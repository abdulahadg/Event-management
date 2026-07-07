import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Fallback JSON Path
const DATA_DIR = path.join(process.cwd(), 'server', 'data');
const JSON_DB_PATH = path.join(DATA_DIR, 'db.json');

let isConnectedToSupabase = false;
let supabaseClient: SupabaseClient | null = null;

// Ensure local directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initial Local JSON DB Schema
const defaultLocalDb = {
  users: [] as any[],
  consultations: [] as any[],
  inquiries: [] as any[],
  registrations: [] as any[],
  services: [] as any[],
  portfolio: [] as any[],
  testimonials: [] as any[],
  blogs: [] as any[],
  events: [] as any[],
  settings: [] as any[],
  uploadedFiles: [] as any[]
};

// Write helper for Local DB
function writeLocalDb(data: typeof defaultLocalDb) {
  try {
    fs.writeFileSync(JSON_DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to write local database file:', err);
  }
}

// Read helper for Local DB
function readLocalDb(): typeof defaultLocalDb {
  try {
    if (!fs.existsSync(JSON_DB_PATH)) {
      writeLocalDb(defaultLocalDb);
      return defaultLocalDb;
    }
    const content = fs.readFileSync(JSON_DB_PATH, 'utf-8');
    return JSON.parse(content);
  } catch (err) {
    console.error('Failed to read local database file:', err);
    return defaultLocalDb;
  }
}

// Database Connection Manager
export async function connectDB() {
  const sbUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const sbKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (sbUrl && sbKey) {
    console.log('🔌 Connecting to Supabase...');
    try {
      supabaseClient = createClient(sbUrl, sbKey, {
        auth: {
          persistSession: false
        }
      });
      
      // Test Supabase connectivity by querying the users table
      const { error } = await supabaseClient.from('users').select('id').limit(1);
      if (error) {
        if (error.code === 'PGRST116' || error.message.includes('relation "users" does not exist') || error.message.includes('not found')) {
          console.warn('⚠️  Connected to Supabase but database tables have not been created yet!');
          console.warn('👉 Please execute the SQL in "/supabase_schema.sql" using your Supabase SQL Editor to provision all tables.');
        } else {
          throw error;
        }
      }
      isConnectedToSupabase = true;
      console.log('✅ Connected to Supabase successfully.');
      await seedDefaultData();
      return;
    } catch (err: any) {
      console.error('❌ Failed to connect to Supabase:', err.message || err);
      console.log('⚠️ Falling back to alternative data store.');
    }
  }

  console.log('⚠️  No Supabase environment variables provided or failed to connect. Relying on local JSON persistent store (MongoDB is removed).');
  await seedDefaultData();
}

export function isSupabaseMode() {
  return isConnectedToSupabase;
}

// Resilient query helper for Supabase that falls back to local file DB
async function handleSupabaseQuery<T>(
  queryFn: (client: SupabaseClient) => Promise<{ data: T | null; error: any }>,
  fallbackFn: () => Promise<T>
): Promise<T> {
  if (isConnectedToSupabase && supabaseClient) {
    try {
      const { data, error } = await queryFn(supabaseClient);
      if (error) {
        if (error.code === 'PGRST116' || error.message?.includes('relation') || error.message?.includes('does not exist')) {
          console.warn(`⚠️ Supabase table relation not found. Executing fallback database mode.`);
          return await fallbackFn();
        }
        throw error;
      }
      return data as T;
    } catch (err) {
      console.error('Supabase Query execution issue, executing fallback:', err);
      return await fallbackFn();
    }
  }
  return await fallbackFn();
}

// Seeder to populate initial data if database/store is empty
async function seedDefaultData() {
  const { servicesData, portfolioData, testimonialsData, blogPostsData, upcomingEventsData } = await import('../../src/data') as any;
  const hashedDefaultPassword = await bcrypt.hash('aura2026', 10);

  // 1. Supabase Seeding
  if (isConnectedToSupabase && supabaseClient) {
    try {
      // Admin User
      const { count: adminCount, error: userErr } = await supabaseClient.from('users').select('*', { count: 'exact', head: true }).eq('role', 'admin');
      if (!userErr && (adminCount === 0 || adminCount === null)) {
        await supabaseClient.from('users').insert([{
          id: 'usr_admin',
          name: 'Aura Administrator',
          email: 'admin@auradesign.co.uk',
          password: hashedDefaultPassword,
          role: 'admin',
          isVerified: true
        }]);
        console.log('👤 Seeded Default Admin User into Supabase (admin@auradesign.co.uk / aura2026)');
      }

      // Services
      const { count: serviceCount, error: sErr } = await supabaseClient.from('services').select('*', { count: 'exact', head: true });
      if (!sErr && (serviceCount === 0 || serviceCount === null)) {
        await supabaseClient.from('services').insert(
          servicesData.map((s: any) => ({
            id: s.id,
            title: s.title,
            description: s.description,
            icon: s.icon,
            features: s.features,
            packages: s.packages
          }))
        );
        console.log(`🛠️  Seeded ${servicesData.length} Services into Supabase.`);
      }

      // Portfolio
      const { count: portfolioCount, error: pErr } = await supabaseClient.from('portfolio').select('*', { count: 'exact', head: true });
      if (!pErr && (portfolioCount === 0 || portfolioCount === null)) {
        await supabaseClient.from('portfolio').insert(
          portfolioData.map((p: any) => ({
            id: p.id,
            title: p.title,
            category: p.category,
            location: p.location,
            date: p.date,
            description: p.description,
            imageUrl: p.imageUrl,
            details: p.details
          }))
        );
        console.log(`📁 Seeded ${portfolioData.length} Portfolio items into Supabase.`);
      }

      // Testimonials
      const { count: testCount, error: tErr } = await supabaseClient.from('testimonials').select('*', { count: 'exact', head: true });
      if (!tErr && (testCount === 0 || testCount === null)) {
        const items = testimonialsData.map((t: any) => ({
          id: t.id,
          name: t.name,
          role: t.role,
          company: t.company,
          content: t.content,
          avatarUrl: t.imageUrl,
          rating: t.rating
        }));
        await supabaseClient.from('testimonials').insert(items);
        console.log(`💬 Seeded ${items.length} Testimonials into Supabase.`);
      }

      // Blogs
      const { count: blogCount, error: bErr } = await supabaseClient.from('blogs').select('*', { count: 'exact', head: true });
      if (!bErr && (blogCount === 0 || blogCount === null)) {
        await supabaseClient.from('blogs').insert(
          blogPostsData.map((b: any) => ({
            id: b.id,
            title: b.title,
            excerpt: b.excerpt,
            content: b.content,
            category: b.category,
            readTime: b.readTime,
            date: b.date,
            imageUrl: b.imageUrl,
            author: b.author
          }))
        );
        console.log(`📝 Seeded ${blogPostsData.length} Blog posts into Supabase.`);
      }

      // Events
      const { count: eventCount, error: eErr } = await supabaseClient.from('events').select('*', { count: 'exact', head: true });
      if (!eErr && (eventCount === 0 || eventCount === null)) {
        const items = upcomingEventsData.map((e: any) => ({
          id: e.id,
          title: e.title,
          description: e.description,
          date: e.date,
          time: e.time,
          location: e.location,
          capacity: String(e.availableSeats + 20),
          ticketPrice: '£150',
          imageUrl: e.imageUrl,
          details: 'An elite convening of industry pioneers and brand visionaries.',
          agenda: ['09:00 Registration', '10:00 Opening Keynote', '12:00 Interactive Panel', '13:00 Gourmet Lunch', '15:00 Live Demonstrations', '17:00 VIP Networking Reception'],
          speakers: [
            { name: 'Dr. Evelyn Sterling', role: 'Lead Futurist, Aura', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=300' },
            { name: 'Marcus Sterling', role: 'Executive Architect', avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=300' }
          ]
        }));
        await supabaseClient.from('events').insert(items);
        console.log(`📅 Seeded ${items.length} Upcoming Events into Supabase.`);
      }
    } catch (err) {
      console.error('Error seeding Supabase data:', err);
    }
    return;
  }

  // 2. Local JSON seeding
  const db = readLocalDb();
  let updated = false;

  const hasAdmin = db.users.some(u => u.role === 'admin');
  if (!hasAdmin) {
    db.users.push({
      _id: 'usr_admin',
      id: 'usr_admin',
      name: 'Aura Administrator',
      email: 'admin@auradesign.co.uk',
      password: hashedDefaultPassword,
      role: 'admin',
      isVerified: true,
      createdAt: new Date().toISOString()
    });
    updated = true;
    console.log('👤 Seeded Default Admin User into Local Store (admin@auradesign.co.uk / aura2026)');
  }

  if (db.services.length === 0) {
    db.services = servicesData.map((s: any) => ({ ...s, _id: s.id, id: s.id }));
    updated = true;
    console.log(`🛠️  Seeded ${servicesData.length} Services into Local Store.`);
  }

  if (db.portfolio.length === 0) {
    db.portfolio = portfolioData.map((p: any) => ({ ...p, _id: p.id, id: p.id }));
    updated = true;
    console.log(`📁 Seeded ${portfolioData.length} Portfolio items into Local Store.`);
  }

  if (db.testimonials.length === 0) {
    db.testimonials = testimonialsData.map((t: any) => ({
      _id: t.id,
      id: t.id,
      name: t.name,
      role: t.role,
      company: t.company,
      content: t.content,
      avatarUrl: t.imageUrl,
      rating: t.rating
    }));
    updated = true;
    console.log(`💬 Seeded ${testimonialsData.length} Testimonials into Local Store.`);
  }

  if (db.blogs.length === 0) {
    db.blogs = blogPostsData.map((b: any) => ({ ...b, _id: b.id, id: b.id }));
    updated = true;
    console.log(`📝 Seeded ${blogPostsData.length} Blog posts into Local Store.`);
  }

  if (db.events.length === 0) {
    db.events = upcomingEventsData.map((e: any) => ({
      _id: e.id,
      id: e.id,
      title: e.title,
      description: e.description,
      date: e.date,
      time: e.time,
      location: e.location,
      capacity: String(e.availableSeats + 20),
      ticketPrice: '£150',
      imageUrl: e.imageUrl,
      details: 'An elite convening of industry pioneers and brand visionaries.',
      agenda: ['09:00 Registration', '10:00 Opening Keynote', '12:00 Interactive Panel', '13:00 Gourmet Lunch', '15:00 Live Demonstrations', '17:00 VIP Networking Reception'],
      speakers: [
        { name: 'Dr. Evelyn Sterling', role: 'Lead Futurist, Aura', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=300' },
        { name: 'Marcus Sterling', role: 'Executive Architect', avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=300' }
      ]
    }));
    updated = true;
    console.log(`📅 Seeded ${upcomingEventsData.length} Upcoming Events into Local Store.`);
  }

  if (updated) {
    writeLocalDb(db);
  }
}

// --- CORE DATABASE OPERATIONS ---

// Users API
export async function getUsers() {
  return handleSupabaseQuery<any[]>(
    async (client) => {
      const { data, error } = await client.from('users').select('*');
      const mapped = data?.map(u => ({ ...u, _id: u.id })) || null;
      return { data: mapped, error };
    },
    async () => {
      return readLocalDb().users.map(u => ({ ...u, _id: u.id || u._id, id: u.id || u._id }));
    }
  );
}

export async function findUserByEmail(email: string) {
  return handleSupabaseQuery<any | null>(
    async (client) => {
      const { data, error } = await client.from('users').select('*').ilike('email', email).maybeSingle();
      if (data) {
        data._id = data.id;
      }
      return { data, error };
    },
    async () => {
      const db = readLocalDb();
      const u = db.users.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
      if (u) {
        return { ...u, _id: u.id || u._id, id: u.id || u._id };
      }
      return null;
    }
  );
}

export async function saveUser(userData: any) {
  const finalId = userData.id || userData._id || 'usr_' + Date.now() + Math.floor(Math.random() * 1000);
  const formattedUserData = {
    id: finalId,
    name: userData.name,
    email: userData.email,
    password: userData.password,
    role: userData.role || 'admin',
    isVerified: userData.isVerified !== undefined ? userData.isVerified : true,
    createdAt: userData.createdAt || new Date().toISOString()
  };

  return handleSupabaseQuery<any>(
    async (client) => {
      const { data, error } = await client.from('users').insert([formattedUserData]).select().single();
      if (data) {
        data._id = data.id;
      }
      return { data, error };
    },
    async () => {
      const db = readLocalDb();
      const newUser = { id: finalId, _id: finalId, ...formattedUserData };
      db.users.push(newUser);
      writeLocalDb(db);
      return newUser;
    }
  );
}

export async function updateUser(id: string, updates: any) {
  return handleSupabaseQuery<any | null>(
    async (client) => {
      const { data, error } = await client.from('users').update(updates).eq('id', id).select().single();
      if (data) {
        data._id = data.id;
      }
      return { data, error };
    },
    async () => {
      const db = readLocalDb();
      const idx = db.users.findIndex(u => u._id === id || u.id === id);
      if (idx !== -1) {
        db.users[idx] = { ...db.users[idx], ...updates, _id: id, id };
        writeLocalDb(db);
        return db.users[idx];
      }
      return null;
    }
  );
}

// Consultations API
export async function getConsultations() {
  return handleSupabaseQuery<any[]>(
    async (client) => {
      const { data, error } = await client.from('consultations').select('*').order('timestamp', { ascending: false });
      const mapped = data?.map(item => ({ ...item, _id: item.id })) || null;
      return { data: mapped, error };
    },
    async () => {
      const db = readLocalDb();
      const list = [...db.consultations].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      return list.map(item => ({ ...item, _id: item.id || item._id, id: item.id || item._id }));
    }
  );
}

export async function saveConsultation(data: any) {
  const finalId = data.id || data._id || 'con_' + Date.now();
  const formattedData = {
    id: finalId,
    clientName: data.clientName,
    clientEmail: data.clientEmail,
    clientPhone: data.clientPhone,
    eventType: data.eventType,
    preselectedPackage: data.preselectedPackage,
    guestCount: Number(data.guestCount || 0),
    destination: data.destination,
    eventDate: data.eventDate,
    specialRequests: data.specialRequests,
    estimate: data.estimate,
    rawEstimate: Number(data.rawEstimate || 0),
    status: data.status || 'Pending',
    timestamp: data.timestamp || new Date().toISOString()
  };

  return handleSupabaseQuery<any>(
    async (client) => {
      const { data: resData, error } = await client.from('consultations').insert([formattedData]).select().single();
      if (resData) {
        resData._id = resData.id;
      }
      return { data: resData, error };
    },
    async () => {
      const db = readLocalDb();
      const newRecord = { id: finalId, _id: finalId, ...formattedData };
      db.consultations.push(newRecord);
      writeLocalDb(db);
      return newRecord;
    }
  );
}

export async function updateConsultationStatus(id: string, status: string) {
  return handleSupabaseQuery<any | null>(
    async (client) => {
      const { data, error } = await client.from('consultations').update({ status }).eq('id', id).select().single();
      if (data) {
        data._id = data.id;
      }
      return { data, error };
    },
    async () => {
      const db = readLocalDb();
      const idx = db.consultations.findIndex(c => c.id === id || c._id === id);
      if (idx !== -1) {
        db.consultations[idx].status = status;
        db.consultations[idx]._id = db.consultations[idx].id;
        writeLocalDb(db);
        return db.consultations[idx];
      }
      return null;
    }
  );
}

export async function deleteConsultation(id: string) {
  return handleSupabaseQuery<any>(
    async (client) => {
      const { data, error } = await client.from('consultations').delete().eq('id', id).select().maybeSingle();
      if (data) {
        data._id = data.id;
      }
      return { data, error };
    },
    async () => {
      const db = readLocalDb();
      const filtered = db.consultations.filter(c => c.id !== id && c._id !== id);
      const deleted = db.consultations.length !== filtered.length;
      db.consultations = filtered;
      writeLocalDb(db);
      return deleted;
    }
  );
}

// Inquiries API
export async function getInquiries() {
  return handleSupabaseQuery<any[]>(
    async (client) => {
      const { data, error } = await client.from('inquiries').select('*').order('timestamp', { ascending: false });
      const mapped = data?.map(item => ({ ...item, _id: item.id })) || null;
      return { data: mapped, error };
    },
    async () => {
      const db = readLocalDb();
      const list = [...db.inquiries].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      return list.map(item => ({ ...item, _id: item.id || item._id, id: item.id || item._id }));
    }
  );
}

export async function saveInquiry(data: any) {
  const finalId = data.id || data._id || 'inq_' + Date.now() + Math.floor(Math.random() * 1000);
  const formattedData = {
    id: finalId,
    name: data.name,
    email: data.email,
    phone: data.phone,
    category: data.category,
    company: data.company,
    guestsCount: String(data.guestsCount || ''),
    details: data.details,
    status: data.status || 'Pending',
    timestamp: data.timestamp || new Date().toISOString()
  };

  return handleSupabaseQuery<any>(
    async (client) => {
      const { data: resData, error } = await client.from('inquiries').insert([formattedData]).select().single();
      if (resData) {
        resData._id = resData.id;
      }
      return { data: resData, error };
    },
    async () => {
      const db = readLocalDb();
      const newRecord = { id: finalId, _id: finalId, ...formattedData };
      db.inquiries.push(newRecord);
      writeLocalDb(db);
      return newRecord;
    }
  );
}

export async function updateInquiryStatus(id: string, status: string) {
  return handleSupabaseQuery<any | null>(
    async (client) => {
      const { data, error } = await client.from('inquiries').update({ status }).eq('id', id).select().single();
      if (data) {
        data._id = data.id;
      }
      return { data, error };
    },
    async () => {
      const db = readLocalDb();
      const idx = db.inquiries.findIndex(i => i._id === id || i.id === id);
      if (idx !== -1) {
        db.inquiries[idx].status = status;
        db.inquiries[idx]._id = db.inquiries[idx].id;
        writeLocalDb(db);
        return db.inquiries[idx];
      }
      return null;
    }
  );
}

export async function deleteInquiry(id: string) {
  return handleSupabaseQuery<any>(
    async (client) => {
      const { data, error } = await client.from('inquiries').delete().eq('id', id).select().maybeSingle();
      if (data) {
        data._id = data.id;
      }
      return { data, error };
    },
    async () => {
      const db = readLocalDb();
      const filtered = db.inquiries.filter(i => i._id !== id && i.id !== id);
      const deleted = db.inquiries.length !== filtered.length;
      db.inquiries = filtered;
      writeLocalDb(db);
      return deleted;
    }
  );
}

// Registrations API
export async function getRegistrations() {
  return handleSupabaseQuery<any[]>(
    async (client) => {
      const { data, error } = await client.from('registrations').select('*').order('timestamp', { ascending: false });
      const mapped = data?.map(item => ({ ...item, _id: item.id })) || null;
      return { data: mapped, error };
    },
    async () => {
      const db = readLocalDb();
      const list = [...db.registrations].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      return list.map(item => ({ ...item, _id: item.id || item._id, id: item.id || item._id }));
    }
  );
}

export async function saveRegistration(data: any) {
  const finalId = data.id || data._id || 'reg_' + Date.now() + Math.floor(Math.random() * 1000);
  const formattedData = {
    id: finalId,
    name: data.name,
    email: data.email,
    phone: data.phone,
    guestsCount: String(data.guestsCount || ''),
    company: data.company,
    ticketType: data.ticketType,
    eventId: data.eventId,
    eventTitle: data.eventTitle,
    status: data.status || 'Pending',
    timestamp: data.timestamp || new Date().toISOString()
  };

  return handleSupabaseQuery<any>(
    async (client) => {
      const { data: resData, error } = await client.from('registrations').insert([formattedData]).select().single();
      if (resData) {
        resData._id = resData.id;
      }
      return { data: resData, error };
    },
    async () => {
      const db = readLocalDb();
      const newRecord = { id: finalId, _id: finalId, ...formattedData };
      db.registrations.push(newRecord);
      writeLocalDb(db);
      return newRecord;
    }
  );
}

export async function updateRegistrationStatus(id: string, status: string) {
  return handleSupabaseQuery<any | null>(
    async (client) => {
      const { data, error } = await client.from('registrations').update({ status }).eq('id', id).select().single();
      if (data) {
        data._id = data.id;
      }
      return { data, error };
    },
    async () => {
      const db = readLocalDb();
      const idx = db.registrations.findIndex(r => r._id === id || r.id === id);
      if (idx !== -1) {
        db.registrations[idx].status = status;
        db.registrations[idx]._id = db.registrations[idx].id;
        writeLocalDb(db);
        return db.registrations[idx];
      }
      return null;
    }
  );
}

export async function deleteRegistration(id: string) {
  return handleSupabaseQuery<any>(
    async (client) => {
      const { data, error } = await client.from('registrations').delete().eq('id', id).select().maybeSingle();
      if (data) {
        data._id = data.id;
      }
      return { data, error };
    },
    async () => {
      const db = readLocalDb();
      const filtered = db.registrations.filter(r => r._id !== id && r.id !== id);
      const deleted = db.registrations.length !== filtered.length;
      db.registrations = filtered;
      writeLocalDb(db);
      return deleted;
    }
  );
}

// Pure Admin Clean All Registers Utility
export async function purgeAllRegisters() {
  if (isConnectedToSupabase && supabaseClient) {
    try {
      await supabaseClient.from('consultations').delete().neq('id', 'dummy');
      await supabaseClient.from('inquiries').delete().neq('id', 'dummy');
      await supabaseClient.from('registrations').delete().neq('id', 'dummy');
    } catch (err) {
      console.error('Failed to purge registries on Supabase:', err);
    }
  }

  const db = readLocalDb();
  db.consultations = [];
  db.inquiries = [];
  db.registrations = [];
  writeLocalDb(db);
}

// Dynamic Content: Services
export async function getServices() {
  return handleSupabaseQuery<any[]>(
    async (client) => {
      const { data, error } = await client.from('services').select('*');
      const mapped = data?.map(item => ({ ...item, _id: item.id })) || null;
      return { data: mapped, error };
    },
    async () => {
      return readLocalDb().services.map(item => ({ ...item, _id: item.id || item._id, id: item.id || item._id }));
    }
  );
}

export async function saveService(data: any) {
  const finalId = data.id || 'service_' + Date.now();
  const formattedData = {
    id: finalId,
    title: data.title,
    description: data.description,
    icon: data.icon,
    features: data.features || [],
    packages: data.packages || []
  };

  return handleSupabaseQuery<any>(
    async (client) => {
      const { data: resData, error } = await client.from('services').upsert(formattedData).select().single();
      if (resData) {
        resData._id = resData.id;
      }
      return { data: resData, error };
    },
    async () => {
      const db = readLocalDb();
      const idx = db.services.findIndex(s => s.id === finalId);
      const formattedWithId = { ...formattedData, _id: finalId };
      if (idx !== -1) {
        db.services[idx] = formattedWithId;
      } else {
        db.services.push(formattedWithId);
      }
      writeLocalDb(db);
      return formattedWithId;
    }
  );
}

export async function deleteService(id: string) {
  return handleSupabaseQuery<boolean>(
    async (client) => {
      const { error } = await client.from('services').delete().eq('id', id);
      return { data: !error, error };
    },
    async () => {
      const db = readLocalDb();
      db.services = db.services.filter(s => s.id !== id);
      writeLocalDb(db);
      return true;
    }
  );
}

// Dynamic Content: Portfolio
export async function getPortfolios() {
  return handleSupabaseQuery<any[]>(
    async (client) => {
      const { data, error } = await client.from('portfolio').select('*');
      const mapped = data?.map(item => ({ ...item, _id: item.id })) || null;
      return { data: mapped, error };
    },
    async () => {
      return readLocalDb().portfolio.map(item => ({ ...item, _id: item.id || item._id, id: item.id || item._id }));
    }
  );
}

export async function savePortfolio(data: any) {
  const finalId = data.id || 'portfolio_' + Date.now();
  const formattedData = {
    id: finalId,
    title: data.title,
    category: data.category,
    location: data.location,
    date: data.date,
    description: data.description,
    imageUrl: data.imageUrl,
    details: data.details || {}
  };

  return handleSupabaseQuery<any>(
    async (client) => {
      const { data: resData, error } = await client.from('portfolio').upsert(formattedData).select().single();
      if (resData) {
        resData._id = resData.id;
      }
      return { data: resData, error };
    },
    async () => {
      const db = readLocalDb();
      const idx = db.portfolio.findIndex(p => p.id === finalId);
      const formattedWithId = { ...formattedData, _id: finalId };
      if (idx !== -1) {
        db.portfolio[idx] = formattedWithId;
      } else {
        db.portfolio.push(formattedWithId);
      }
      writeLocalDb(db);
      return formattedWithId;
    }
  );
}

export async function deletePortfolio(id: string) {
  return handleSupabaseQuery<boolean>(
    async (client) => {
      const { error } = await client.from('portfolio').delete().eq('id', id);
      return { data: !error, error };
    },
    async () => {
      const db = readLocalDb();
      db.portfolio = db.portfolio.filter(p => p.id !== id);
      writeLocalDb(db);
      return true;
    }
  );
}

// Dynamic Content: Testimonials
export async function getTestimonials() {
  return handleSupabaseQuery<any[]>(
    async (client) => {
      const { data, error } = await client.from('testimonials').select('*');
      const mapped = data?.map(item => ({ ...item, _id: item.id })) || null;
      return { data: mapped, error };
    },
    async () => {
      return readLocalDb().testimonials.map(item => ({ ...item, _id: item.id || item._id, id: item.id || item._id }));
    }
  );
}

export async function saveTestimonial(data: any) {
  const finalId = data.id || 'testimonial_' + Date.now();
  const formattedData = {
    id: finalId,
    name: data.name,
    role: data.role,
    company: data.company,
    content: data.content,
    avatarUrl: data.avatarUrl,
    rating: Number(data.rating || 5)
  };

  return handleSupabaseQuery<any>(
    async (client) => {
      const { data: resData, error } = await client.from('testimonials').upsert(formattedData).select().single();
      if (resData) {
        resData._id = resData.id;
      }
      return { data: resData, error };
    },
    async () => {
      const db = readLocalDb();
      const idx = db.testimonials.findIndex(t => t.id === finalId);
      const formattedWithId = { ...formattedData, _id: finalId };
      if (idx !== -1) {
        db.testimonials[idx] = formattedWithId;
      } else {
        db.testimonials.push(formattedWithId);
      }
      writeLocalDb(db);
      return formattedWithId;
    }
  );
}

export async function deleteTestimonial(id: string) {
  return handleSupabaseQuery<boolean>(
    async (client) => {
      const { error } = await client.from('testimonials').delete().eq('id', id);
      return { data: !error, error };
    },
    async () => {
      const db = readLocalDb();
      db.testimonials = db.testimonials.filter(t => t.id !== id);
      writeLocalDb(db);
      return true;
    }
  );
}

// Dynamic Content: Blogs
export async function getBlogs() {
  return handleSupabaseQuery<any[]>(
    async (client) => {
      const { data, error } = await client.from('blogs').select('*');
      const mapped = data?.map(item => ({ ...item, _id: item.id })) || null;
      return { data: mapped, error };
    },
    async () => {
      return readLocalDb().blogs.map(item => ({ ...item, _id: item.id || item._id, id: item.id || item._id }));
    }
  );
}

export async function saveBlog(data: any) {
  const finalId = data.id || 'blog_' + Date.now();
  const formattedData = {
    id: finalId,
    title: data.title,
    excerpt: data.excerpt,
    content: data.content,
    category: data.category,
    readTime: data.readTime,
    date: data.date,
    imageUrl: data.imageUrl,
    author: data.author || {}
  };

  return handleSupabaseQuery<any>(
    async (client) => {
      const { data: resData, error } = await client.from('blogs').upsert(formattedData).select().single();
      if (resData) {
        resData._id = resData.id;
      }
      return { data: resData, error };
    },
    async () => {
      const db = readLocalDb();
      const idx = db.blogs.findIndex(b => b.id === finalId);
      const formattedWithId = { ...formattedData, _id: finalId };
      if (idx !== -1) {
        db.blogs[idx] = formattedWithId;
      } else {
        db.blogs.push(formattedWithId);
      }
      writeLocalDb(db);
      return formattedWithId;
    }
  );
}

export async function deleteBlog(id: string) {
  return handleSupabaseQuery<boolean>(
    async (client) => {
      const { error } = await client.from('blogs').delete().eq('id', id);
      return { data: !error, error };
    },
    async () => {
      const db = readLocalDb();
      db.blogs = db.blogs.filter(b => b.id !== id);
      writeLocalDb(db);
      return true;
    }
  );
}

// Dynamic Content: Events
export async function getEvents() {
  return handleSupabaseQuery<any[]>(
    async (client) => {
      const { data, error } = await client.from('events').select('*');
      const mapped = data?.map(item => ({ ...item, _id: item.id })) || null;
      return { data: mapped, error };
    },
    async () => {
      return readLocalDb().events.map(item => ({ ...item, _id: item.id || item._id, id: item.id || item._id }));
    }
  );
}

export async function saveEvent(data: any) {
  const finalId = data.id || 'event_' + Date.now();
  const formattedData = {
    id: finalId,
    title: data.title,
    description: data.description,
    date: data.date,
    time: data.time,
    location: data.location,
    capacity: data.capacity,
    ticketPrice: data.ticketPrice,
    imageUrl: data.imageUrl,
    details: data.details,
    agenda: data.agenda || [],
    speakers: data.speakers || []
  };

  return handleSupabaseQuery<any>(
    async (client) => {
      const { data: resData, error } = await client.from('events').upsert(formattedData).select().single();
      if (resData) {
        resData._id = resData.id;
      }
      return { data: resData, error };
    },
    async () => {
      const db = readLocalDb();
      const idx = db.events.findIndex(e => e.id === finalId);
      const formattedWithId = { ...formattedData, _id: finalId };
      if (idx !== -1) {
        db.events[idx] = formattedWithId;
      } else {
        db.events.push(formattedWithId);
      }
      writeLocalDb(db);
      return formattedWithId;
    }
  );
}

export async function deleteEvent(id: string) {
  return handleSupabaseQuery<boolean>(
    async (client) => {
      const { error } = await client.from('events').delete().eq('id', id);
      return { data: !error, error };
    },
    async () => {
      const db = readLocalDb();
      db.events = db.events.filter(e => e.id !== id);
      writeLocalDb(db);
      return true;
    }
  );
}

// Website Settings
export async function getSettings() {
  return handleSupabaseQuery<any>(
    async (client) => {
      const { data, error } = await client.from('settings').select('*');
      if (error) return { data: null, error };
      const settingsObj: any = {};
      data?.forEach(item => {
        settingsObj[item.key] = item.value;
      });
      return { data: settingsObj, error: null };
    },
    async () => {
      const db = readLocalDb();
      const settingsObj: any = {};
      db.settings.forEach(item => {
        settingsObj[item.key] = item.value;
      });
      return settingsObj;
    }
  );
}

export async function saveSetting(key: string, value: any) {
  return handleSupabaseQuery<any>(
    async (client) => {
      const { data, error } = await client.from('settings').upsert({ key, value }).select().single();
      return { data, error };
    },
    async () => {
      const db = readLocalDb();
      const idx = db.settings.findIndex(s => s.key === key);
      if (idx !== -1) {
        db.settings[idx].value = value;
      } else {
        db.settings.push({ key, value });
      }
      writeLocalDb(db);
      return { key, value };
    }
  );
}

// Uploaded Files API
export async function getUploadedFiles() {
  return handleSupabaseQuery<any[]>(
    async (client) => {
      const { data, error } = await client.from('uploaded_files').select('*').order('uploadedAt', { ascending: false });
      const mapped = data?.map(item => ({ ...item, _id: item.id })) || null;
      return { data: mapped, error };
    },
    async () => {
      return readLocalDb().uploadedFiles.map(item => ({ ...item, _id: item.id || item._id, id: item.id || item._id }));
    }
  );
}

export async function saveUploadedFile(fileData: any) {
  const finalId = fileData.id || 'file_' + Date.now();
  const formattedData = {
    id: finalId,
    filename: fileData.filename,
    filepath: fileData.filepath,
    mimetype: fileData.mimetype,
    size: Number(fileData.size || 0),
    uploadedAt: fileData.uploadedAt || new Date().toISOString()
  };

  return handleSupabaseQuery<any>(
    async (client) => {
      const { data: resData, error } = await client.from('uploaded_files').insert([formattedData]).select().single();
      if (resData) {
        resData._id = resData.id;
      }
      return { data: resData, error };
    },
    async () => {
      const db = readLocalDb();
      const newRecord = { id: finalId, _id: finalId, ...formattedData };
      db.uploadedFiles.push(newRecord);
      writeLocalDb(db);
      return newRecord;
    }
  );
}

export async function deleteUploadedFile(id: string) {
  return handleSupabaseQuery<boolean>(
    async (client) => {
      const { error } = await client.from('uploaded_files').delete().eq('id', id);
      return { data: !error, error };
    },
    async () => {
      const db = readLocalDb();
      db.uploadedFiles = db.uploadedFiles.filter(f => f.id !== id);
      writeLocalDb(db);
      return true;
    }
  );
}
