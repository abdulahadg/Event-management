-- AURA Mayfair Registry - Supabase Database Schema
-- Copy and paste this script into your Supabase SQL Editor to provision all required tables.

-- Disable Row Level Security (RLS) by default for demo ease, or set appropriate public policies.

-- 1. Users Table (Admin authentication)
CREATE TABLE IF NOT EXISTS public.users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT DEFAULT 'admin',
  "isVerified" BOOLEAN DEFAULT true,
  "createdAt" TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

-- 2. Consultations Table (Luxury Event Requests)
CREATE TABLE IF NOT EXISTS public.consultations (
  id TEXT PRIMARY KEY,
  "clientName" TEXT,
  "clientEmail" TEXT,
  "clientPhone" TEXT,
  "eventType" TEXT,
  "preselectedPackage" TEXT,
  "guestCount" INTEGER,
  destination TEXT,
  "eventDate" TEXT,
  "specialRequests" TEXT,
  estimate TEXT,
  "rawEstimate" INTEGER,
  status TEXT DEFAULT 'Pending',
  timestamp TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

-- 3. Inquiries Table (Custom Contact Inquiries)
CREATE TABLE IF NOT EXISTS public.inquiries (
  id TEXT PRIMARY KEY,
  name TEXT,
  email TEXT,
  phone TEXT,
  category TEXT,
  company TEXT,
  "guestsCount" TEXT,
  details TEXT,
  status TEXT DEFAULT 'Pending',
  timestamp TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

-- 4. Registrations Table (Exclusive Event Bookings)
CREATE TABLE IF NOT EXISTS public.registrations (
  id TEXT PRIMARY KEY,
  name TEXT,
  email TEXT,
  phone TEXT,
  "guestsCount" TEXT,
  company TEXT,
  "ticketType" TEXT,
  "eventId" TEXT,
  "eventTitle" TEXT,
  status TEXT DEFAULT 'Pending',
  timestamp TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

-- 5. Services Table (AURA Event Package Definitions)
CREATE TABLE IF NOT EXISTS public.services (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  features TEXT[] DEFAULT '{}',
  packages JSONB DEFAULT '[]'::jsonb
);

-- 6. Portfolio Table (Curated Showcases)
CREATE TABLE IF NOT EXISTS public.portfolio (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT,
  location TEXT,
  date TEXT,
  description TEXT,
  "imageUrl" TEXT,
  details JSONB DEFAULT '{}'::jsonb
);

-- 7. Testimonials Table (Elite Client Reviews)
CREATE TABLE IF NOT EXISTS public.testimonials (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT,
  company TEXT,
  content TEXT NOT NULL,
  "avatarUrl" TEXT,
  rating INTEGER DEFAULT 5
);

-- 8. Blogs Table (Premium Publications)
CREATE TABLE IF NOT EXISTS public.blogs (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT,
  category TEXT,
  "readTime" TEXT,
  date TEXT,
  "imageUrl" TEXT,
  author JSONB DEFAULT '{}'::jsonb
);

-- 9. Events Table (Curated Masterclasses)
CREATE TABLE IF NOT EXISTS public.events (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  date TEXT,
  time TEXT,
  location TEXT,
  capacity TEXT,
  "ticketPrice" TEXT,
  "imageUrl" TEXT,
  details TEXT,
  agenda TEXT[] DEFAULT '{}',
  speakers JSONB DEFAULT '[]'::jsonb
);

-- 10. Website Settings Table
CREATE TABLE IF NOT EXISTS public.settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL
);

-- 11. Uploaded Files Table (Media Assets)
CREATE TABLE IF NOT EXISTS public.uploaded_files (
  id TEXT PRIMARY KEY,
  filename TEXT NOT NULL,
  filepath TEXT NOT NULL,
  mimetype TEXT,
  size INTEGER,
  "uploadedAt" TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

-- Enable full read/write permissions for public/anon/service roles (demo default)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consultations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.uploaded_files ENABLE ROW LEVEL SECURITY;

-- Setup public access policies for convenience
CREATE POLICY "Allow public read" ON public.services FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON public.portfolio FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON public.testimonials FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON public.blogs FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON public.events FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON public.settings FOR SELECT USING (true);

-- Allow full access for authentication and mutations
CREATE POLICY "Allow all public mutations" ON public.consultations FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all public mutations" ON public.inquiries FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all public mutations" ON public.registrations FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all public mutations" ON public.users FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all public mutations" ON public.services FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all public mutations" ON public.portfolio FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all public mutations" ON public.testimonials FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all public mutations" ON public.blogs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all public mutations" ON public.events FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all public mutations" ON public.settings FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all public mutations" ON public.uploaded_files FOR ALL USING (true) WITH CHECK (true);
