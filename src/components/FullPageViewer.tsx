import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { createClient, isSupabaseConfigured } from '@/utils/supabase/client';
import {
  ArrowLeft,
  Calendar,
  Clock,
  User,
  MapPin,
  Users,
  Compass,
  Globe,
  CheckCircle2,
  Send,
  Sparkles,
  ShieldCheck,
  Building2,
  Heart,
  Presentation,
  Trophy,
  Crown,
  Gift,
  Coins,
  Music,
  Palette,
  ArrowRight,
  Bookmark,
  Share2,
  Printer,
  ChevronRight,
  ExternalLink,
  BookOpen
} from 'lucide-react';
import { blogPostsData, servicesData, portfolioData, upcomingEventsData } from '../data';
import { BlogPost, ServiceItem, PortfolioItem, UpcomingEvent } from '../types';

interface FullPageViewerProps {
  viewType: 'article' | 'service' | 'project' | 'event';
  itemId: string;
  onBackToHome: () => void;
  onOpenConsultation: () => void;
}

export default function FullPageViewer({ viewType, itemId, onBackToHome, onOpenConsultation }: FullPageViewerProps) {
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ticketType, setTicketType] = useState('vip');
  const [errorMessage, setErrorMessage] = useState('');
  const [formFields, setFormFields] = useState({
    name: '',
    email: '',
    notes: '',
    guestsCount: '1',
    company: ''
  });

  // Automatically scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    setErrorMessage('');
  }, [viewType, itemId]);

  // Form submission handler for inline custom actions
  const handleInquirySubmit = async (e: React.FormEvent, category: string) => {
    e.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);
    const timestamp = new Date().toISOString();

    if (!isSupabaseConfigured()) {
      setIsSubmitting(false);
      // Save locally
      const currentInquiries = JSON.parse(localStorage.getItem('aura_custom_inquiries') || '[]');
      localStorage.setItem('aura_custom_inquiries', JSON.stringify([
        ...currentInquiries,
        { ...formFields, itemId, viewType, category, timestamp }
      ]));

      setErrorMessage('Database credentials are not configured. Please define NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY in your environment variables/secrets via the settings menu. (A fallback local reservation was successfully saved to your browser history).');
      return;
    }

    try {
      const supabase = createClient();

      // Try inserting into Supabase
      const { error } = await supabase.from('inquiries').insert([
        {
          name: formFields.name,
          email: formFields.email,
          company: formFields.company,
          guests: Number(formFields.guestsCount),
          details: formFields.notes,
          event_type: category,
          timestamp
        }
      ]);

      if (error) throw error;

      setIsSubmitting(false);
      setSuccessMessage(`Your tailored inquiry for ${category} has been securely routed directly to our Lead Spatial Director.`);
      setFormFields({ name: '', email: '', notes: '', guestsCount: '1', company: '' });
      
      const currentInquiries = JSON.parse(localStorage.getItem('aura_custom_inquiries') || '[]');
      localStorage.setItem('aura_custom_inquiries', JSON.stringify([
        ...currentInquiries,
        { ...formFields, itemId, viewType, category, timestamp }
      ]));
    } catch (err) {
      console.error('Supabase custom inquiry submission failed:', err);
      setIsSubmitting(false);
      setErrorMessage('Could not connect to the intake gateway database. Please check your Supabase connection parameters and make sure the table schema matches.');
    }
  };

  const handleEventRegister = async (e: React.FormEvent, eventTitle: string) => {
    e.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);
    const timestamp = new Date().toISOString();

    if (!isSupabaseConfigured()) {
      setIsSubmitting(false);
      // Save locally
      const currentRegistrations = JSON.parse(localStorage.getItem('aura_event_registrations') || '[]');
      localStorage.setItem('aura_event_registrations', JSON.stringify([
        ...currentRegistrations,
        { ...formFields, ticketType, eventId: itemId, eventTitle, timestamp }
      ]));

      setErrorMessage('Database credentials are not configured. Please define NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY in your environment variables/secrets via the settings menu. (A fallback local reservation was successfully saved to your browser history).');
      return;
    }

    try {
      const supabase = createClient();

      // Try inserting into Supabase
      const { error } = await supabase.from('inquiries').insert([
        {
          name: formFields.name,
          email: formFields.email,
          company: formFields.company,
          guests: Number(formFields.guestsCount),
          details: `Ticket registration: ${ticketType.toUpperCase()}. ${formFields.notes}`,
          event_type: `Event: ${eventTitle}`,
          timestamp
        }
      ]);

      if (error) throw error;

      setIsSubmitting(false);
      setSuccessMessage(`Congratulations! Your exclusive ${ticketType.toUpperCase()} pass request for "${eventTitle}" has been provisionally registered. Check your secure electronic inbox at ${formFields.email} for coordinates.`);
      setFormFields({ name: '', email: '', notes: '', guestsCount: '1', company: '' });

      const currentRegistrations = JSON.parse(localStorage.getItem('aura_event_registrations') || '[]');
      localStorage.setItem('aura_event_registrations', JSON.stringify([
        ...currentRegistrations,
        { ...formFields, ticketType, eventId: itemId, eventTitle, timestamp }
      ]));
    } catch (err) {
      console.error('Supabase event registration failed:', err);
      setIsSubmitting(false);
      setErrorMessage('Could not connect to the intake gateway database. Please check your Supabase connection parameters and make sure the table schema matches.');
    }
  };

  // Find targeted item
  const article = blogPostsData.find(a => a.id === itemId);
  const service = servicesData.find(s => s.id === itemId);
  const project = portfolioData.find(p => p.id === itemId);
  const event = upcomingEventsData.find(e => e.id === itemId);

  // Render service icons dynamically
  const renderServiceIcon = (name: string, className: string) => {
    switch (name) {
      case 'Building2': return <Building2 className={className} />;
      case 'Heart': return <Heart className={className} />;
      case 'Sparkles': return <Sparkles className={className} />;
      case 'Presentation': return <Presentation className={className} />;
      case 'Trophy': return <Trophy className={className} />;
      case 'Crown': return <Crown className={className} />;
      case 'Gift': return <Gift className={className} />;
      case 'Coins': return <Coins className={className} />;
      case 'Music': return <Music className={className} />;
      case 'Palette': return <Palette className={className} />;
      default: return <Sparkles className={className} />;
    }
  };

  const getArticleContent = (id: string) => {
    switch (id) {
      case 'b1':
        return [
          { type: 'heading', text: '1. The Paradigm Shift: Emotional Architecture' },
          { type: 'paragraph', text: 'Historically, luxury event architecture relied heavily on physical scale: towering pillars of roses, velvet drapes, and cascading champagne towers. Today, the focus has shifted from mere mass to narrative density. Discerning global audiences expect an environment that speaks directly to their intellect and emotions.' },
          { type: 'paragraph', text: 'When we designed the Lumina Tech Summit at London\'s Shard, we began by asking: How do we render data flows in physical space? The answer layout was a custom kinetic fiber-optic ceiling that altered light colors and tempos based on the aggregate sentiment analysis of active keynote discussions. This physicalization of abstract information creates a feedback loop that captivates attendees and frames conversations perfectly.' },
          { type: 'quote', text: '"Good design acts as a silent physical host, guiding the emotional and intellectual direction of the room without guests ever realizing it is happening."', author: 'Alistair Sterling, Principal Director of Design' },
          { type: 'heading', text: '2. The Sensory Trifecta: Scents, Frequencies, and Shadows' },
          { type: 'paragraph', text: 'We operate under a simple directive: True luxury is multi-sensory. When a guest passes our threshold, we target all five primary senses in perfect coordination:' },
          { type: 'list', items: [
            'Bespoke Scent Architecture: Custom aromatherapy blends featuring woodsy atlas cedar, sandalwood, and fresh English fig distributed via discrete nebulizers.',
            'Bespoke Frequency Scapes: Background music mixed live at 432Hz—a natural frequency scientific studies link to systemic anxiety relief and cognitive focus.',
            'Architectural Lighting Shadows: We reject harsh, flat, high-brightness floodlights, opting instead for calculated asymmetric pools of light and soft organic shadows that flatter guest silhouettes.'
          ] },
          { type: 'heading', text: '3. Formulating the Perfect Layout' },
          { type: 'paragraph', text: 'Every architectural design demands meticulous spacing ratios. At AURA, we configure seating corridors and cocktail high-tables utilizing strict Golden Ratio grids. This maximizes fluid movement, allows server teams to bypass guest circles silently, and maintains premium sightlines toward central presentation vectors.' }
        ];
      case 'b2':
        return [
          { type: 'heading', text: '1. Why British Castles Command Supreme Prestige' },
          { type: 'paragraph', text: 'A castle is not merely a historic brick facade—it is a physical container of romantic weight and historical continuity. When couples select historic monuments like Highclere Castle, they are weaving their family history into the heritage fabric of the UK.' },
          { type: 'paragraph', text: 'However, executing a modern luxury wedding in a Grade I listed historic monument presents immense structural challenges. Most ancient estates enforce strict preservation orders. You cannot nail structures to walls, tape wires to ornate plaster, or exceed strict electrical grid limits.' },
          { type: 'heading', text: '2. Navigating the Logistics Heritage Matrix' },
          { type: 'paragraph', text: 'To coordinate bespoke glass marquees and premium custom tablescapes on sensitive castle grounds, AURA deploys a proprietary protocol:' },
          { type: 'list', items: [
            'Independent Clean Power: We never draw electricity from sensitive ancient castle grids. We deploy ultra-silent bio-diesel generators positioned hundreds of yards away, routed using insulated, low-profile cabling.',
            'Weighted Free-Standing Marquees: Rather than anchoring structural tents with traditional ground stakes which might fracture archaeological layers, we use heavy sand-weighted ballasts disguised as sculpted hedge planters.',
            'Specialized Material Protection: Our setup crews wear micro-fiber boots and apply custom temporary neoprene carpets over ancient parquet floors before bringing in any floral staging.'
          ] },
          { type: 'quote', text: '"Heritage compliance is not a barrier to beautiful design; it is the catalyst for bespoke, non-destructive engineering solutions that protect history while crafting future memories."', author: 'Beatrice Vance, Heritage Director' },
          { type: 'heading', text: '3. Handpicked Historic Destinations We Recommend' },
          { type: 'paragraph', text: 'For couples searching for the ultimate historic backdrop, we regularly coordinate exclusive site leases with Castle Howard in Yorkshire (noted for its dramatic baroque grandeur) and Dunstafnage Castle on the Scottish coast (ideal for remote, high-security coastal milestones).' }
        ];
      case 'b3':
        return [
          { type: 'heading', text: '1. The Problem with Single-Use Staging' },
          { type: 'paragraph', text: 'For decades, the standard operation of the prestige event sector was remarkably wasteful. Massive custom-carved plywood stage backdrops, single-use PVC banner prints, and oil-based floral foam bricks were discarded into local landfills immediately following the curtain close. This standard is no longer acceptable.' },
          { type: 'paragraph', text: 'At AURA, we are proving that absolute prestige and zero-waste logistics are not mutually exclusive. We have overhauled our complete supply chain to deliver magnificent staging environments that leave a minimal carbon footprint.' },
          { type: 'heading', text: '2. The AURA Green-Logistics Blueprint' },
          { type: 'paragraph', text: 'Our sustainable event framework operates on three strict design tenets:' },
          { type: 'list', items: [
            'Modular Aluminum Scenery: Our stage backdrops are designed in-house using interlocking aircraft-grade aluminum. These are fully reconfigurable, dressed in biodegradable linen, and reused across dozens of custom layouts.',
            'Eliminating Floral Foam: Traditional green floral foam is a non-biodegradable microplastic that pollutes waterways. AURA has banned it completely. We utilize historical clay frog pins, recycled steel wire cages, and localized moss bases to secure floral arrangements.',
            'Hyper-Localized Gastronomy: We coordinate menus exclusively with artisan organic farms located within a 30-mile radius of the venue. This removes heavy flight transport emissions and ensures ingredients are freshly harvested within 24 hours of guest service.'
          ] },
          { type: 'quote', text: '"Prestige luxury is no longer defined by reckless consumption. True modern luxury is characterized by absolute responsibility, rigorous provenance, and environmental respect."', author: 'Gavin Henderson, Sustainability Liaison' },
          { type: 'heading', text: '3. Realizing Carbon-Neutral Certification' },
          { type: 'paragraph', text: 'For our corporate clients, we provide complete, audited post-event carbon offset logs. We calculate travel, material manufacturing, and gourmet prep emissions, then secure verified UK forestry planting certificates to offset every single kilogram of carbon generated.' }
        ];
      default:
        return [{ type: 'paragraph', text: 'Detailed article content is currently being curated by our editorial team in Mayfair.' }];
    }
  };

  return (
    <div className="bg-[#FAFBFD] min-h-screen pt-24 pb-20">
      {/* Top Breadcrumb & Action bar */}
      <div className="bg-white border-b border-slate-100 py-4 sticky top-16 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between">
          <button
            onClick={onBackToHome}
            className="group flex items-center gap-2.5 text-xs font-semibold text-slate-500 hover:text-[#0B1B2A] uppercase tracking-wider transition-colors"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform text-[#D4A737]" />
            <span>Back to Mayfair Studio</span>
          </button>

          <div className="flex items-center gap-4">
            <span className="text-[10px] text-slate-400 font-mono hidden sm:inline-block">AURA SECURE SYSTEM // STATUS: LIVE</span>
            <button
              onClick={() => {
                window.print();
              }}
              className="p-2 rounded-xl text-slate-400 hover:text-[#0B1B2A] hover:bg-slate-50 transition-colors"
              title="Print Blueprint Specs"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                alert("Link copied to clipboard!");
              }}
              className="p-2 rounded-xl text-slate-400 hover:text-[#0B1B2A] hover:bg-slate-50 transition-colors"
              title="Copy Secure Link"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 mt-10">
        
        {/* ==================== 1. BLOG ARTICLE VIEW ==================== */}
        {viewType === 'article' && article && (
          <motion.article
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start"
          >
            {/* Left Column: Extensive Content (8 Cols) */}
            <div className="lg:col-span-8 bg-white p-6 sm:p-10 md:p-16 rounded-[40px] border border-slate-100 shadow-sm text-left space-y-8">
              
              {/* Category tag & metadata */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] text-white bg-[#D4A737] px-3 py-1 rounded-full font-bold uppercase tracking-widest font-mono">
                    {article.category}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono uppercase">
                    AURA Journal ID // {article.id.toUpperCase()}-2026
                  </span>
                </div>

                <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-light text-[#0B1B2A] leading-tight">
                  {article.title}
                </h1>

                {/* Meta details strip */}
                <div className="flex items-center gap-6 text-xs text-slate-400 pt-2 border-b border-slate-100 pb-6 flex-wrap">
                  <span className="flex items-center gap-1.5 font-medium">
                    <Calendar className="w-4 h-4 text-[#D4A737]" />
                    {article.date}
                  </span>
                  <span className="flex items-center gap-1.5 font-medium">
                    <Clock className="w-4 h-4 text-[#D4A737]" />
                    {article.readTime}
                  </span>
                  <span className="flex items-center gap-1.5 font-medium">
                    <User className="w-4 h-4 text-[#D4A737]" />
                    By {article.author}
                  </span>
                </div>
              </div>

              {/* Large Cover Image */}
              <div className="h-64 sm:h-[400px] rounded-3xl overflow-hidden shadow-md relative">
                <img
                  src={article.imageUrl}
                  alt={article.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>

              {/* Dynamic Typographic Prose layout */}
              <div className="prose prose-slate max-w-none text-slate-600 text-sm sm:text-base leading-relaxed space-y-6">
                
                {/* Intro excerpt styled beautifully */}
                <p className="text-[#0B1B2A] font-serif italic text-base sm:text-lg border-l-2 border-[#D4A737] pl-6 py-1 leading-relaxed">
                  "{article.excerpt}"
                </p>

                {getArticleContent(article.id).map((block, idx) => {
                  if (block.type === 'heading') {
                    return (
                      <h3 key={idx} className="text-xl sm:text-2xl font-serif font-semibold text-[#0B1B2A] pt-6 flex items-center gap-2">
                        <span className="text-[#D4A737] font-mono text-sm">✦</span>
                        {block.text}
                      </h3>
                    );
                  }
                  if (block.type === 'quote' && block.author) {
                    return (
                      <div key={idx} className="my-8 p-8 rounded-3xl bg-[#FAFBFD] border border-slate-100 relative overflow-hidden">
                        <div className="absolute top-2 right-4 text-7xl font-serif text-[#D4A737]/10 pointer-events-none">“</div>
                        <p className="font-serif italic text-slate-700 text-sm sm:text-base relative z-10">
                          {block.text}
                        </p>
                        <span className="block text-xs font-bold uppercase tracking-wider text-[#D4A737] mt-3 font-mono">
                          — {block.author}
                        </span>
                      </div>
                    );
                  }
                  if (block.type === 'list' && block.items) {
                    return (
                      <ul key={idx} className="space-y-3 pl-4 my-6">
                        {block.items.map((li, liIdx) => (
                          <li key={liIdx} className="flex items-start gap-3 text-sm">
                            <span className="p-1 rounded-full bg-[#D4A737]/10 text-[#D4A737] mt-0.5">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                            </span>
                            <span className="text-slate-600">{li}</span>
                          </li>
                        ))}
                      </ul>
                    );
                  }
                  return <p key={idx} className="leading-relaxed font-light">{block.text}</p>;
                })}

              </div>

              {/* Footer Stamp & Share */}
              <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-400">
                <span>AURA Global Publications — Curated in Mayfair, London W1J</span>
                <span className="font-mono">GEOLOCAL LINKED // UK HISTORIC PROTOCOL</span>
              </div>

            </div>

            {/* Right Column: Context/Call to Action sidebar (4 Cols) */}
            <div className="lg:col-span-4 space-y-8 sticky top-36">
              
              {/* Writer Profile */}
              <div className="p-8 bg-white rounded-[32px] border border-slate-100 shadow-sm text-left space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#0B1B2A] text-[#D4A737] flex items-center justify-center font-bold font-serif text-lg">
                    {article.author.split(' ')[0][0]}{article.author.split(' ')[1][0]}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#0B1B2A]">{article.author}</h4>
                    <span className="text-[10px] text-slate-400 font-mono uppercase tracking-widest block">AURA Lead Strategist</span>
                  </div>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed font-light">
                  Directing aesthetic blueprints and heritage logistics across European historical castles and private compounds.
                </p>
                <button
                  onClick={onOpenConsultation}
                  className="w-full py-2.5 rounded-xl border border-slate-100 hover:border-[#D4A737] text-slate-600 hover:text-[#0B1B2A] text-xs font-semibold uppercase tracking-wider transition-colors"
                >
                  Direct Inquiry Author
                </button>
              </div>

              {/* Consultation Intake box */}
              <div className="p-8 bg-[#0B1B2A] text-white rounded-[32px] border border-slate-800 shadow-xl text-left space-y-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:20px_20px] opacity-30 pointer-events-none" />
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4A737]/5 rounded-full blur-2xl" />
                
                <div className="space-y-2 relative z-10">
                  <Compass className="w-8 h-8 text-[#D4A737] animate-spin-slow" />
                  <span className="text-[10px] text-[#D4A737] uppercase tracking-widest font-bold font-mono block">Direct Spatial Booking</span>
                  <h3 className="text-xl font-serif font-medium">Plan Your Next Milestone</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Our lead spatial directors are compiling custom site blueprints. Establish connection now.
                  </p>
                </div>

                <button
                  onClick={onOpenConsultation}
                  className="w-full py-3.5 rounded-2xl bg-[#D4A737] hover:bg-[#bfa22f] text-[#0B1B2A] text-xs font-bold uppercase tracking-wider transition-colors relative z-10 flex items-center justify-center gap-2"
                >
                  <span>Request Bespoke Proposal</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Other Related Articles */}
              <div className="p-8 bg-white rounded-[32px] border border-slate-100 shadow-sm text-left space-y-4">
                <h4 className="text-xs font-bold text-[#0B1B2A] uppercase tracking-widest border-b border-slate-100 pb-3">More Perspectives</h4>
                <div className="space-y-4">
                  {blogPostsData.filter(b => b.id !== itemId).map(b => (
                    <a
                      key={b.id}
                      href={`#`}
                      onClick={(e) => {
                        e.preventDefault();
                        // Scroll to top
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="block group space-y-1"
                    >
                      <span className="text-[9px] text-[#D4A737] uppercase tracking-widest font-bold font-mono">{b.category}</span>
                      <h5 className="text-xs font-serif font-semibold text-slate-800 group-hover:text-[#D4A737] transition-colors leading-snug line-clamp-2">
                        {b.title}
                      </h5>
                    </a>
                  ))}
                </div>
              </div>

            </div>
          </motion.article>
        )}

        {/* ==================== 2. SERVICE DEPARTMENT VIEW ==================== */}
        {viewType === 'service' && service && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start"
          >
            {/* Left Column: Extensive Details (7 Cols) */}
            <div className="lg:col-span-7 space-y-8 text-left">
              
              {/* Header Box */}
              <div className="bg-white p-8 md:p-12 rounded-[40px] border border-slate-100 shadow-sm space-y-6">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="p-4 rounded-3xl bg-[#0B1B2A] text-[#D4A737] shadow-md">
                    {renderServiceIcon(service.iconName, "w-8 h-8")}
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono uppercase bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
                    AURA DIVISION SPECIFICATION // 0{service.id.length}
                  </span>
                </div>

                <div className="space-y-3">
                  <span className="text-[#D4A737] text-xs font-semibold tracking-widest uppercase block">
                    {service.category} DEPARTMENT CORE
                  </span>
                  <h1 className="text-3xl sm:text-4xl font-serif font-medium text-[#0B1B2A] leading-tight">
                    {service.title} Experiential Management
                  </h1>
                </div>

                <p className="text-sm text-slate-500 leading-relaxed font-light border-t border-slate-100 pt-6">
                  {service.longDescription}
                </p>
              </div>

              {/* Department Highlights & Operational Blueprints */}
              <div className="bg-white p-8 md:p-12 rounded-[40px] border border-slate-100 shadow-sm space-y-6">
                <h3 className="text-lg font-serif font-semibold text-[#0B1B2A] flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-[#D4A737]" />
                  <span>Standard Operational Mandate</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                    <span className="text-[10px] font-bold text-[#D4A737] uppercase tracking-widest font-mono">CAD / 3D RENDERINGS</span>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Every contract locks in photorealistic spatial models, physical color-swatch panels, and floral architectural prototypes for executive pre-approval.
                    </p>
                  </div>
                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                    <span className="text-[10px] font-bold text-[#D4A737] uppercase tracking-widest font-mono">SUPPLY Provenance</span>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Flowers sourced via direct auctions in Aalsmeer, premium linen curated from historic Irish mills, and cutlery custom forged in Sheffield.
                    </p>
                  </div>
                </div>

                <div className="pt-4 text-xs text-slate-400 italic">
                  "For custom dimensions, physical estate site surveys, or localized permits (e.g. public squares, marine permissions), AURA handles end-to-end administration."
                </div>
              </div>

              {/* Portfolio Showcase Matching Service type */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-[#0B1B2A] uppercase tracking-widest pl-2">CORRESPONDING BLUEPRINTS</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {portfolioData.slice(0, 2).map((item) => (
                    <div
                      key={item.id}
                      className="group bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-md transition-all text-left"
                    >
                      <div className="h-44 overflow-hidden relative">
                        <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500" />
                      </div>
                      <div className="p-5 space-y-2">
                        <span className="text-[9px] text-[#D4A737] uppercase tracking-wider block">{item.location}</span>
                        <h4 className="text-sm font-serif font-bold text-slate-800 group-hover:text-[#D4A737] transition-colors">{item.title}</h4>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Right Column: Tailored Inquiry Intake Form (5 Cols) */}
            <div className="lg:col-span-5 bg-white p-8 md:p-12 rounded-[40px] border border-slate-100 shadow-sm text-left sticky top-36">
              
              {!successMessage ? (
                <form onSubmit={(e) => handleInquirySubmit(e, service.title)} className="space-y-6">
                  <div>
                    <span className="text-[10px] text-[#D4A737] font-bold tracking-widest uppercase block">SECURE INTAKE GATEWAY</span>
                    <h3 className="text-xl font-serif font-medium text-[#0B1B2A] mt-1">Configure {service.title} Blueprint</h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Our directors will compile custom physical swatchbooks and draft layout briefs.
                    </p>
                  </div>

                  {errorMessage && (
                    <div className="p-4 rounded-2xl bg-rose-50 border border-rose-100 text-rose-600 text-xs font-semibold tracking-wide flex items-center gap-3">
                      <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse shrink-0" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-bold text-[#0B1B2A] uppercase tracking-wider block mb-1">Your Full Name *</label>
                      <input
                        type="text"
                        required
                        value={formFields.name}
                        onChange={(e) => setFormFields({ ...formFields, name: e.target.value })}
                        placeholder="e.g. Duchess Elizabeth Sterling"
                        className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:border-[#D4A737] text-xs text-[#0B1B2A]"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-[#0B1B2A] uppercase tracking-wider block mb-1">Corporate Suite / Organization</label>
                      <input
                        type="text"
                        value={formFields.company}
                        onChange={(e) => setFormFields({ ...formFields, company: e.target.value })}
                        placeholder="e.g. Stirling Capital PLC"
                        className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:border-[#D4A737] text-xs text-[#0B1B2A]"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-[#0B1B2A] uppercase tracking-wider block mb-1">Secure Contact Email *</label>
                      <input
                        type="email"
                        required
                        value={formFields.email}
                        onChange={(e) => setFormFields({ ...formFields, email: e.target.value })}
                        placeholder="name@organization.com"
                        className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:border-[#D4A737] text-xs text-[#0B1B2A]"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-[#0B1B2A] uppercase tracking-wider block mb-1">Anticipated Attendance Size</label>
                      <select
                        value={formFields.guestsCount}
                        onChange={(e) => setFormFields({ ...formFields, guestsCount: e.target.value })}
                        className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:border-[#D4A737] text-xs text-slate-600"
                      >
                        <option value="50">Bespoke Retreat (20 - 50 VIPs)</option>
                        <option value="200">Mainstream Summit (100 - 300 delegates)</option>
                        <option value="600">Grand Arena (500 - 1000 invitations)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-[#0B1B2A] uppercase tracking-wider block mb-1">Custom Directives / Spatial Vision</label>
                      <textarea
                        rows={3}
                        value={formFields.notes}
                        onChange={(e) => setFormFields({ ...formFields, notes: e.target.value })}
                        placeholder="Detail custom AV requests, historic castle leases, or strict press embargo requirements."
                        className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:border-[#D4A737] text-xs text-[#0B1B2A] resize-none"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 rounded-xl bg-[#0B1B2A] hover:bg-[#D4A737] hover:text-[#0B1B2A] text-white font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <span>TRANSMITTING DIRECT SECURE DIAL...</span>
                    ) : (
                      <>
                        <span>Submit Department Brief</span>
                        <Send className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </form>
              ) : (
                <div className="py-12 text-center space-y-6">
                  <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center mx-auto border border-emerald-100">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <div className="space-y-2">
                    <span className="text-[10px] text-emerald-500 font-bold tracking-widest font-mono uppercase block">TRANSMISSION SECURED</span>
                    <h4 className="text-xl font-serif font-semibold text-[#0B1B2A]">Inquiry Received</h4>
                    <p className="text-xs text-slate-500 leading-relaxed max-w-sm mx-auto">
                      {successMessage}
                    </p>
                  </div>
                  <button
                    onClick={() => setSuccessMessage(null)}
                    className="px-6 py-2.5 rounded-xl bg-[#0B1B2A] text-white hover:bg-[#D4A737] hover:text-[#0B1B2A] text-xs font-bold uppercase tracking-wider transition-colors"
                  >
                    Send Another Configuration
                  </button>
                </div>
              )}

            </div>
          </motion.div>
        )}

        {/* ==================== 3. PORTFOLIO PROJECT SPECIFICATION ==================== */}
        {viewType === 'project' && project && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start"
          >
            {/* Left Column: Extensive Content & Photo Showcase (8 Cols) */}
            <div className="lg:col-span-8 space-y-8 text-left">
              
              {/* Cover Showcase Banner */}
              <div className="bg-white p-6 sm:p-10 rounded-[40px] border border-slate-100 shadow-sm space-y-6">
                
                {/* Title blocks */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] text-white bg-[#D4A737] px-2.5 py-1 rounded-full font-bold uppercase tracking-widest font-mono">
                      {project.category} SPECIFICATION
                    </span>
                    <span className="text-[9px] text-slate-400 font-mono uppercase">
                      ARCHIVE ID // AURA-{project.id.toUpperCase()}-{project.year}
                    </span>
                  </div>
                  
                  <h1 className="text-3xl sm:text-4xl font-serif font-light text-[#0B1B2A] leading-tight">
                    {project.title}
                  </h1>
                </div>

                {/* Cinematic showcase image */}
                <div className="h-64 sm:h-[450px] rounded-3xl overflow-hidden shadow-md">
                  <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover" />
                </div>
              </div>

              {/* Historical Site Blueprints & Step-by-Step implementation */}
              <div className="bg-white p-8 md:p-12 rounded-[40px] border border-slate-100 shadow-sm space-y-8">
                
                <div className="space-y-4">
                  <h3 className="text-xl font-serif font-medium text-[#0B1B2A] flex items-center gap-2">
                    <Compass className="w-5 h-5 text-[#D4A737]" />
                    <span>Experiential Realization Path</span>
                  </h3>
                  <p className="text-sm text-slate-500 leading-relaxed font-light">
                    Transforming a landmark venue into a narrative canvas requires a strict timeline. Here is the architectural execution log compiled for this milestone:
                  </p>
                </div>

                {/* Step Timeline */}
                <div className="space-y-6 pt-4 border-t border-slate-100">
                  {[
                    { phase: 'Phase I // Conception & Rendering', title: 'Conceptualizing Spatial Ratios', detail: 'Our structural architects draft photorealistic 3D vector blueprints, adjusting acoustic nodes and locating physical power guides.' },
                    { phase: 'Phase II // Fabric & Curation Sourcing', title: 'Hand-Curating Materials', detail: 'We fly floral structures directly from premium Aalsmeer vaults and import custom silks to match client house standards.' },
                    { phase: 'Phase III // On-Site Integration', title: 'Silent Site Construction', detail: 'Deploying a 40-member specialized crew to construct weighted marquees and adjust focus projectors micro-by-micro.' },
                    { phase: 'Phase IV // Elite Orchestration', title: 'Flawless Unveiling & Protocol', detail: 'Running complete communications lines with security, live coordination of guest entry, and supervising gourmet timing.' }
                  ].map((step, sIdx) => (
                    <div key={sIdx} className="flex gap-4 items-start text-xs sm:text-sm">
                      <div className="p-2.5 rounded-xl bg-slate-50 text-[#D4A737] border border-slate-100 font-mono font-bold">
                        0{sIdx + 1}
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block">{step.phase}</span>
                        <h4 className="font-serif font-bold text-[#0B1B2A]">{step.title}</h4>
                        <p className="text-xs text-slate-500 leading-relaxed font-light">{step.detail}</p>
                      </div>
                    </div>
                  ))}
                </div>

              </div>

            </div>

            {/* Right Column: Spec Sheets & Direct CTA (4 Cols) */}
            <div className="lg:col-span-4 space-y-8 sticky top-36">
              
              {/* Technical Specifications Sheet */}
              <div className="p-8 bg-white rounded-[32px] border border-slate-100 shadow-sm text-left space-y-6">
                <h4 className="text-xs font-bold text-[#0B1B2A] uppercase tracking-widest border-b border-slate-100 pb-3 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span>Blueprints Specification Sheet</span>
                </h4>

                <div className="space-y-4 text-xs">
                  <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                    <span className="text-slate-400">PATRON / CLIENT</span>
                    <span className="font-semibold text-[#0B1B2A] text-right">{project.client}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                    <span className="text-slate-400">VENUE / LOCATION</span>
                    <span className="font-semibold text-[#0B1B2A] text-right">{project.location}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                    <span className="text-slate-400">YEAR COMPILED</span>
                    <span className="font-semibold text-[#0B1B2A] text-right">{project.year}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                    <span className="text-slate-400">INVITATION COUNT</span>
                    <span className="font-semibold text-[#0B1B2A] text-right">{project.guestCount}</span>
                  </div>
                  <div className="flex justify-between items-center pb-1">
                    <span className="text-slate-400">NDA CERTIFIED</span>
                    <span className="font-semibold text-emerald-500 text-right">SECURE LEVEL 1</span>
                  </div>
                </div>

                {/* Core Highlights list */}
                <div className="space-y-3 pt-4 border-t border-slate-100">
                  <span className="text-[10px] font-bold text-slate-700 block uppercase tracking-wider">PROJECT HIGHLIGHTS</span>
                  <ul className="space-y-2">
                    {project.highlights.map((h, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-500">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#D4A737] mt-1.5" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>

              </div>

              {/* Consultation trigger card */}
              <div className="p-8 bg-[#0B1B2A] text-white rounded-[32px] border border-slate-800 shadow-xl text-left space-y-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B1B2A] to-[#121E2B]" />
                
                <div className="relative z-10 space-y-3">
                  <Compass className="w-8 h-8 text-[#D4A737]" />
                  <h3 className="text-xl font-serif font-medium">Replicate This Production Style</h3>
                  <p className="text-xs text-slate-400 leading-relaxed font-light">
                    Interested in the spatial design, floral layouts, or lighting structures shown in this archive? Our directors can replicate this concept customized to your target venue.
                  </p>
                </div>

                <button
                  onClick={() => onOpenConsultation()}
                  className="w-full py-3.5 rounded-2xl bg-[#D4A737] hover:bg-[#bfa22f] text-[#0B1B2A] text-xs font-bold uppercase tracking-wider transition-colors relative z-10 flex items-center justify-center gap-2"
                >
                  <span>Inquire Similar Style</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          </motion.div>
        )}

        {/* ==================== 4. PUBLIC EVENT SCHEDULE DETAIL ==================== */}
        {viewType === 'event' && event && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start"
          >
            {/* Left Column: Event details (7 Cols) */}
            <div className="lg:col-span-7 space-y-8 text-left">
              
              {/* Core card */}
              <div className="bg-white p-8 md:p-12 rounded-[40px] border border-slate-100 shadow-sm space-y-6">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="px-4 py-1.5 rounded-full bg-[#D4A737]/10 text-[#D4A737] text-[10px] font-bold uppercase tracking-wider">
                    {event.category} Category
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">SEMINAR CODE: AURA-EV-{event.id.toUpperCase()}</span>
                </div>

                <h1 className="text-3xl sm:text-4xl font-serif font-light text-[#0B1B2A] leading-tight">
                  {event.title}
                </h1>

                <p className="text-sm text-slate-500 leading-relaxed font-light border-t border-slate-100 pt-6">
                  {event.description}
                </p>
              </div>

              {/* Event Schedule Timeline */}
              <div className="bg-white p-8 md:p-12 rounded-[40px] border border-slate-100 shadow-sm space-y-6">
                <h3 className="text-lg font-serif font-semibold text-[#0B1B2A] flex items-center gap-2">
                  <Clock className="w-5 h-5 text-[#D4A737]" />
                  <span>Proposed Session Agenda</span>
                </h3>

                <div className="space-y-4">
                  {[
                    { time: '09:30 - 10:15', title: 'Reception & Welcome Champagne', desc: 'Guests clear our security desks and enter the historic lobby for networking over localized English vintage champagne.' },
                    { time: '10:30 - 12:00', title: 'AURA Principal Design Keynote', desc: 'Our lead director Alistair Sterling hosts a complete breakdown of 3D spatial design vectors and acoustic layouts.' },
                    { time: '12:15 - 13:45', title: 'Private Panel & Gourmet Luncheon', desc: 'Michelin-starred 3-course organic dining paired with a dynamic discussion around sustainability in European historical venues.' },
                    { time: '14:00 - 16:30', title: 'Active Tablescape Curation Showcase', desc: 'Live workshop showcasing custom floristry arrays, Irish linen settings, and advanced asymmetric shadow configurations.' }
                  ].map((session, sIdx) => (
                    <div key={sIdx} className="flex gap-4 border-l border-[#D4A737]/30 pl-6 pb-6 relative last:pb-0">
                      <div className="absolute left-0 top-1.5 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-[#D4A737]" />
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-[#D4A737] font-mono tracking-wider">{session.time}</span>
                        <h4 className="text-xs sm:text-sm font-bold text-[#0B1B2A]">{session.title}</h4>
                        <p className="text-xs text-slate-400 leading-relaxed font-light">{session.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Venue Info Map block */}
              <div className="p-8 bg-[#0B1B2A] text-white rounded-[40px] relative overflow-hidden h-[240px] flex flex-col justify-between border border-slate-800">
                <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:20px_20px] opacity-40 pointer-events-none" />
                
                {/* Gold glowing compass marker */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full border border-[#D4A737]/10 flex items-center justify-center">
                  <div className="w-24 h-24 rounded-full border border-[#D4A737]/20 flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full bg-[#D4A737] flex items-center justify-center text-[#0B1B2A] shadow-lg">
                      <Compass className="w-4 h-4 animate-spin-slow" />
                    </div>
                  </div>
                </div>

                <div className="relative z-10 text-left">
                  <span className="text-[10px] text-[#D4A737] uppercase tracking-widest font-bold">GEOGRAPHIC TARGET COORDINATES</span>
                  <h4 className="text-base font-serif font-semibold mt-1">{event.location}</h4>
                  <p className="text-xs text-slate-400 mt-1">Satellite Navigation protocol active // Central Mayfair sector</p>
                </div>

                <div className="relative z-10 flex justify-between items-end border-t border-slate-800 pt-3">
                  <span className="text-xs text-[#D4A737] font-semibold">AURA GLOBAL SEMINARS</span>
                  <span className="text-[10px] text-slate-500 font-mono">SEMINAR HUB: ACTIVE</span>
                </div>
              </div>

            </div>

            {/* Right Column: Dynamic Reservation Ticket Form (5 Cols) */}
            <div className="lg:col-span-5 bg-white p-8 md:p-12 rounded-[40px] border border-slate-100 shadow-sm text-left sticky top-36">
              
              {!successMessage ? (
                <form onSubmit={(e) => handleEventRegister(e, event.title)} className="space-y-6">
                  <div>
                    <span className="text-[10px] text-[#D4A737] font-bold tracking-widest uppercase block">SEMINAR TICKET DESK</span>
                    <h3 className="text-xl font-serif font-medium text-[#0B1B2A] mt-1">Request Attendee Pass</h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Remaining spaces: <span className="font-bold text-rose-500">{event.availableSeats} passes</span>. Settle credential level:
                    </p>
                  </div>

                  {errorMessage && (
                    <div className="p-4 rounded-2xl bg-rose-50 border border-rose-100 text-rose-600 text-xs font-semibold tracking-wide flex items-center gap-3">
                      <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse shrink-0" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  {/* Selector of tiers */}
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { type: 'standard', title: 'Standard', desc: 'Pass Access' },
                      { type: 'vip', title: 'VIP Suite', desc: 'Champagne Seat' },
                      { type: 'press', title: 'Press Core', desc: 'PR Pass' }
                    ].map((t) => (
                      <button
                        key={t.type}
                        type="button"
                        onClick={() => setTicketType(t.type)}
                        className={`p-3 rounded-xl border text-center transition-all ${
                          ticketType === t.type
                            ? 'bg-[#0B1B2A] text-[#D4A737] border-[#0B1B2A] shadow-md'
                            : 'bg-slate-50 text-slate-600 border-slate-100 hover:bg-slate-100'
                        }`}
                      >
                        <span className="block text-xs font-bold uppercase">{t.title}</span>
                        <span className="block text-[8px] text-slate-400 font-mono mt-0.5">{t.desc}</span>
                      </button>
                    ))}
                  </div>

                  <div className="space-y-4 pt-2">
                    <div>
                      <label className="text-xs font-bold text-[#0B1B2A] uppercase tracking-wider block mb-1">Your Name *</label>
                      <input
                        type="text"
                        required
                        value={formFields.name}
                        onChange={(e) => setFormFields({ ...formFields, name: e.target.value })}
                        placeholder="e.g. Sterling Sterling"
                        className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:border-[#D4A737] text-xs text-[#0B1B2A]"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-[#0B1B2A] uppercase tracking-wider block mb-1">Contact Email *</label>
                      <input
                        type="email"
                        required
                        value={formFields.email}
                        onChange={(e) => setFormFields({ ...formFields, email: e.target.value })}
                        placeholder="a.sterling@stirling.co.uk"
                        className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:border-[#D4A737] text-xs text-[#0B1B2A]"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-[#0B1B2A] uppercase tracking-wider block mb-1">Special Curation requests / Dietary</label>
                      <textarea
                        rows={2}
                        value={formFields.notes}
                        onChange={(e) => setFormFields({ ...formFields, notes: e.target.value })}
                        placeholder="List special access preferences, dietary guidelines, or press publication requests."
                        className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:border-[#D4A737] text-xs text-[#0B1B2A] resize-none"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 rounded-xl bg-[#0B1B2A] hover:bg-[#D4A737] hover:text-[#0B1B2A] text-white font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <span>TRANSMITTING TICKET SUBMISSION...</span>
                    ) : (
                      <>
                        <span>Submit Ticket Request</span>
                        <Send className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </form>
              ) : (
                <div className="py-12 text-center space-y-6">
                  <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center mx-auto border border-emerald-100">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <div className="space-y-2">
                    <span className="text-[10px] text-emerald-500 font-bold tracking-widest font-mono uppercase block">RESERVATION ASSIGNED</span>
                    <h4 className="text-xl font-serif font-semibold text-[#0B1B2A]">Ticket Request Secure</h4>
                    <p className="text-xs text-slate-500 leading-relaxed max-w-sm mx-auto">
                      {successMessage}
                    </p>
                  </div>
                  <button
                    onClick={() => setSuccessMessage(null)}
                    className="px-6 py-2.5 rounded-xl bg-[#0B1B2A] text-white hover:bg-[#D4A737] hover:text-[#0B1B2A] text-xs font-bold uppercase tracking-wider transition-colors"
                  >
                    Register Another Pass
                  </button>
                </div>
              )}

            </div>
          </motion.div>
        )}

      </div>
    </div>
  );
}
