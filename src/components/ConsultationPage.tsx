import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { createClient, isSupabaseConfigured } from '@/utils/supabase/client';
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Users,
  CheckCircle2,
  Sparkles,
  Building2,
  Heart,
  Trophy,
  Crown,
  Gift,
  Music,
  Palette,
  Send,
  Sparkle,
  Compass,
  ShieldCheck,
  ChevronRight,
  Info
} from 'lucide-react';

interface ConsultationPageProps {
  onBackToHome: () => void;
  preselectedPackage?: string;
  preselectedService?: string;
}

export default function ConsultationPage({
  onBackToHome,
  preselectedPackage = '',
  preselectedService = ''
}: ConsultationPageProps) {
  const [step, setStep] = useState(1);
  const [eventType, setEventType] = useState(preselectedService || 'corporate-events');
  const [guestCount, setGuestCount] = useState(150);
  const [destination, setDestination] = useState('London, UK');
  const [eventDate, setEventDate] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Auto-scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const eventTypes = [
    { id: 'corporate-events', name: 'Corporate Event', icon: Building2, desc: 'AGMs, galas, board retreats & milestones' },
    { id: 'weddings', name: 'Luxury Wedding', icon: Heart, desc: 'Bespoke estate and historic castle nuptials' },
    { id: 'product-launches', name: 'Product Launch', icon: Sparkles, desc: 'High-impact press and global media launches' },
    { id: 'award-ceremonies', name: 'Award Ceremony', icon: Trophy, desc: 'High-production stages and delegate banquets' },
    { id: 'private-events', name: 'Private Celebration', icon: Crown, desc: 'Anniversaries, exclusive fine dinners' },
    { id: 'birthday-parties', name: 'Milestone Birthday', icon: Gift, desc: 'Themed custom installations and acts' },
    { id: 'festivals', name: 'Bespoke Festival', icon: Music, desc: 'Multi-day music & culinary outdoor staging' },
    { id: 'event-decoration', name: 'Bespoke Decoration', icon: Palette, desc: 'Direct-auction floristry & spatial builds' }
  ];

  const destinations = [
    { name: 'London, UK (Mayfair Studio)', surcharge: 0, region: 'United Kingdom' },
    { name: 'Cotswolds, UK (Country Estates)', surcharge: 1500, region: 'United Kingdom' },
    { name: 'French Riviera, France (Cap d\'Antibes)', surcharge: 4000, region: 'Europe' },
    { name: 'Amalfi Coast, Italy', surcharge: 4500, region: 'Europe' },
    { name: 'Dubai, UAE', surcharge: 6000, region: 'Middle East' },
    { name: 'New York, USA', surcharge: 7000, region: 'North America' },
    { name: 'Custom Destination', surcharge: 3000, region: 'Global Outposts' }
  ];

  // Live premium price estimation formula
  const calculateEstimate = () => {
    let basePrice = 4500;
    if (eventType === 'weddings') basePrice = 9500;
    if (eventType === 'product-launches') basePrice = 8500;
    if (eventType === 'award-ceremonies') basePrice = 11000;
    if (eventType === 'festivals') basePrice = 15000;

    let packageAddition = 0;
    if (preselectedPackage) {
      if (preselectedPackage.toLowerCase().includes('elite') || preselectedPackage.toLowerCase().includes('soiree')) {
        packageAddition = 3000;
      } else if (preselectedPackage.toLowerCase().includes('signature') || preselectedPackage.toLowerCase().includes('summit')) {
        packageAddition = 7000;
      } else if (preselectedPackage.toLowerCase().includes('monarch') || preselectedPackage.toLowerCase().includes('gala')) {
        packageAddition = 15000;
      }
    }

    const guestCost = guestCount * 18; // £18 extra logistics per guest
    const destinationSurcharge = destinations.find(d => d.name === destination)?.surcharge || 0;
    const total = basePrice + guestCost + destinationSurcharge + packageAddition;

    return {
      total: total.toLocaleString('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: 0 }),
      deposit: (total * 0.25).toLocaleString('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: 0 }),
      rawTotal: total
    };
  };

  const estimate = calculateEstimate();

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !clientEmail || !clientPhone) {
      setErrorMessage('Please fill out all required contact fields.');
      return;
    }
    setErrorMessage('');
    setIsSubmitting(true);

    const inquiryId = 'CON-' + Math.floor(100000 + Math.random() * 900000);
    const timestamp = new Date().toISOString();

    const inquiry = {
      id: inquiryId,
      eventType,
      preselectedPackage,
      guestCount,
      destination,
      eventDate,
      clientName,
      clientEmail,
      clientPhone,
      specialRequests,
      estimate: estimate.total,
      rawEstimate: estimate.rawTotal,
      status: 'Pending',
      timestamp
    };

    // Check if Supabase keys are present
    if (!isSupabaseConfigured()) {
      setIsSubmitting(false);
      // Save locally so no user input is lost!
      const existing = JSON.parse(localStorage.getItem('aura_consultation_requests') || '[]');
      localStorage.setItem('aura_consultation_requests', JSON.stringify([...existing, inquiry]));
      
      setErrorMessage('Database credentials are not configured. Please define NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY in your environment variables/secrets via the settings menu. (A fallback local reservation was successfully saved to your browser history).');
      return;
    }

    try {
      const supabase = createClient();
      
      // Try to insert the inquiry into the 'inquiries' table.
      const { error } = await supabase.from('inquiries').insert([
        {
          id: inquiryId,
          name: clientName,
          email: clientEmail,
          phone: clientPhone,
          event_type: eventType,
          guests: guestCount,
          destination,
          event_date: eventDate,
          details: specialRequests,
          estimate: estimate.total,
          timestamp
        }
      ]);

      if (error) {
        throw error;
      }

      // Also save to localStorage as local history
      const existing = JSON.parse(localStorage.getItem('aura_consultation_requests') || '[]');
      localStorage.setItem('aura_consultation_requests', JSON.stringify([...existing, inquiry]));

      setIsSubmitting(false);
      setIsSubmitted(true);
    } catch (err) {
      console.error('Supabase intake gateway submission failed:', err);
      setIsSubmitting(false);
      setErrorMessage('Could not connect to the intake gateway database. Please check your Supabase connection parameters and make sure the table schema matches.');
    }
  };

  const handleReset = () => {
    setStep(1);
    setEventType('corporate-events');
    setGuestCount(150);
    setDestination('London, UK');
    setEventDate('');
    setClientName('');
    setClientEmail('');
    setClientPhone('');
    setSpecialRequests('');
    setIsSubmitted(false);
    onBackToHome();
  };

  return (
    <div className="bg-[#FAFBFD] min-h-screen pt-24 pb-20">
      {/* Interactive Breadcrumbs */}
      <div className="bg-white border-b border-slate-100 py-4 sticky top-16 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between">
          <button
            onClick={onBackToHome}
            className="group flex items-center gap-2.5 text-xs font-semibold text-slate-500 hover:text-[#0B1B2A] uppercase tracking-wider transition-colors"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform text-[#D4A737]" />
            <span>Return to Studio Home</span>
          </button>
          
          <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono">
            <span>AURA DESIGN LAB</span>
            <span className="text-[#D4A737]">✦</span>
            <span>SECURE INTAKE GATEWAY</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 mt-12 text-left">
        
        {/* Main Section Header */}
        <div className="mb-12 space-y-4">
          <span className="text-[#D4A737] text-xs font-bold tracking-[0.2em] uppercase block">
            ESTABLISH CONNECTION
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-light text-[#0B1B2A] tracking-tight leading-tight">
            Plan Your <span className="font-serif italic font-medium text-[#D4A737]">Bespoke Milestone</span>
          </h1>
          <p className="text-slate-500 text-sm max-w-2xl font-light">
            Use our interactive estimator to configure spatial variables, calculate premium logistical allocations, and securely route your administrative brief directly to our Mayfair directors.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* LEFT COLUMN: Interactive Wizard Form (8 cols) */}
          <div className="lg:col-span-8 bg-white rounded-[40px] border border-slate-100 p-6 sm:p-10 md:p-12 shadow-md">
            {!isSubmitted ? (
              <form onSubmit={handleSubmit}>
                
                {/* Horizontal Step Header */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-6 mb-8 flex-wrap gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex bg-slate-100 rounded-full p-1 border border-slate-200/50">
                      {[1, 2, 3].map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => s <= step && setStep(s)}
                          className={`w-8 h-8 rounded-full text-xs font-bold flex items-center justify-center transition-all ${
                            step === s
                              ? 'bg-[#0B1B2A] text-[#D4A737] shadow-sm'
                              : step > s
                              ? 'bg-emerald-50 text-emerald-600'
                              : 'text-slate-400 cursor-not-allowed'
                          }`}
                          disabled={s > step}
                        >
                          {step > s ? <CheckCircle2 className="w-4 h-4" /> : s}
                        </button>
                      ))}
                    </div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono">
                      Phase {step === 1 ? 'Occasion Matrix' : step === 2 ? 'Logistical Scale' : 'Contact Blueprint'}
                    </span>
                  </div>

                  <span className="text-xs text-slate-400 uppercase tracking-wider font-mono">
                    Brief Config Status: {step < 3 ? 'Drafting' : 'Awaiting Transmission'}
                  </span>
                </div>

                {/* STEP 1: OCCASION CONFIG */}
                {step === 1 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-8"
                  >
                    <div>
                      <h3 className="text-2xl font-serif font-medium text-[#0B1B2A] mb-2">1. Select Occasion Architecture</h3>
                      <p className="text-sm text-slate-500">Pick an event profile to guide initial layout, aesthetic presets, and culinary partnerships.</p>
                    </div>

                    {preselectedPackage && (
                      <div className="p-4 rounded-2xl bg-[#D4A737]/10 border border-[#D4A737]/30 flex items-center gap-3">
                        <Sparkles className="w-5 h-5 text-[#D4A737] shrink-0" />
                        <span className="text-xs text-slate-700">
                          Preselected Investment Tier: <strong className="text-[#0B1B2A] uppercase font-bold">{preselectedPackage} Package</strong>
                        </span>
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {eventTypes.map((item) => {
                        const IconComponent = item.icon;
                        const isSelected = eventType === item.id;
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => setEventType(item.id)}
                            className={`flex items-start gap-4 p-5 rounded-3xl border text-left transition-all duration-300 ${
                              isSelected
                                ? 'border-[#D4A737] bg-[#FAFBFD] shadow-md text-[#0B1B2A]'
                                : 'border-slate-100 hover:border-slate-200 text-slate-600 hover:bg-slate-50/50'
                            }`}
                          >
                            <div className={`p-3 rounded-2xl shrink-0 transition-colors ${isSelected ? 'bg-[#0B1B2A] text-[#D4A737]' : 'bg-slate-50 text-slate-500'}`}>
                              <IconComponent className="w-5 h-5" />
                            </div>
                            <div className="space-y-1">
                              <h4 className="font-semibold text-sm text-[#0B1B2A]">{item.name}</h4>
                              <p className="text-xs text-slate-400 font-light leading-snug">{item.desc}</p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}

                {/* STEP 2: LOGISTICAL PARAMETERS */}
                {step === 2 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-8"
                  >
                    <div>
                      <h3 className="text-2xl font-serif font-medium text-[#0B1B2A] mb-2">2. Define Logistics & Scale</h3>
                      <p className="text-sm text-slate-500 font-light">Set attendance density and global destination coordinates to calculate spatial requirements.</p>
                    </div>

                    {/* Guest Count Slider */}
                    <div className="space-y-4 p-6 rounded-3xl bg-slate-50 border border-slate-100">
                      <div className="flex justify-between items-center text-sm">
                        <div className="space-y-0.5">
                          <span className="font-medium text-[#0B1B2A] block">Guest Count Density</span>
                          <span className="text-xs text-slate-400 font-light block">Governs cutlery allocations, catering staff, and security margins.</span>
                        </div>
                        <span className="text-[#D4A737] font-semibold font-mono bg-white px-4 py-1.5 rounded-full border border-slate-100 shadow-sm text-sm">
                          {guestCount} Guests
                        </span>
                      </div>
                      
                      <input
                        type="range"
                        min="20"
                        max="1000"
                        step="10"
                        value={guestCount}
                        onChange={(e) => setGuestCount(Number(e.target.value))}
                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#D4A737]"
                      />
                      
                      <div className="flex justify-between text-[11px] text-slate-400 font-mono font-medium">
                        <span>20 (Intimate Soirée)</span>
                        <span>350 (Mid Gala)</span>
                        <span>1000+ (Grand Arena)</span>
                      </div>
                    </div>

                    {/* Location Select */}
                    <div className="space-y-3">
                      <label className="text-sm font-semibold text-[#0B1B2A] uppercase tracking-wider block">Global Destination Hub</label>
                      <p className="text-xs text-slate-400 font-light mb-3">Surcharges account for transport of Mayfair styling crews, floral cold-chains, and custom permits.</p>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {destinations.map((d) => (
                          <button
                            key={d.name}
                            type="button"
                            onClick={() => setDestination(d.name)}
                            className={`p-4 rounded-2xl border text-left transition-all ${
                              destination === d.name
                                ? 'border-[#D4A737] bg-[#FAFBFD] shadow-sm'
                                : 'border-slate-100 hover:border-slate-200 text-slate-600'
                            }`}
                          >
                            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block mb-0.5">{d.region}</span>
                            <span className={`text-sm font-semibold block ${destination === d.name ? 'text-[#0B1B2A]' : 'text-slate-700'}`}>{d.name}</span>
                            {d.surcharge > 0 && (
                              <span className="text-xs text-[#D4A737] font-medium font-mono mt-1 block">+£{d.surcharge.toLocaleString()} logistics fee</span>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Date Input */}
                    <div className="space-y-2 pt-4 border-t border-slate-100">
                      <label className="text-sm font-semibold text-[#0B1B2A] uppercase tracking-wider block">Target Milestone Date</label>
                      <p className="text-xs text-slate-400 font-light mb-2">Weekend dates between May and September may require priority slot approvals.</p>
                      <input
                        type="date"
                        value={eventDate}
                        onChange={(e) => setEventDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full max-w-md p-3.5 rounded-xl border border-slate-100 bg-slate-50 focus:outline-none focus:bg-white focus:border-[#D4A737] text-sm text-[#0B1B2A]"
                      />
                    </div>
                  </motion.div>
                )}

                {/* STEP 3: CONTACT INFORMATION */}
                {step === 3 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-8"
                  >
                    <div>
                      <h3 className="text-2xl font-serif font-medium text-[#0B1B2A] mb-2">3. Primary Liaison Credentials</h3>
                      <p className="text-sm text-slate-500 font-light">Confirm your contact coordinates. AURA operates under absolute non-disclosure protocols; your details are encrypted and never shared.</p>
                    </div>

                    {errorMessage && (
                      <div className="p-4 rounded-2xl bg-rose-50 border border-rose-100 text-rose-600 text-xs font-semibold tracking-wide flex items-center gap-3">
                        <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse shrink-0" />
                        <span>{errorMessage}</span>
                      </div>
                    )}

                    <div className="space-y-5">
                      <div>
                        <label className="text-xs font-semibold text-[#0B1B2A] uppercase tracking-wider block mb-1.5">Liaison Name *</label>
                        <input
                          type="text"
                          required
                          value={clientName}
                          onChange={(e) => setClientName(e.target.value)}
                          placeholder="e.g. Lady Charlotte Montgomery"
                          className="w-full p-3.5 rounded-2xl border border-slate-100 bg-slate-50 focus:outline-none focus:bg-white focus:border-[#D4A737] text-sm text-[#0B1B2A]"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                          <label className="text-xs font-semibold text-[#0B1B2A] uppercase tracking-wider block mb-1.5">Direct Email *</label>
                          <input
                            type="email"
                            required
                            value={clientEmail}
                            onChange={(e) => setClientEmail(e.target.value)}
                            placeholder="c.montgomery@estates.co.uk"
                            className="w-full p-3.5 rounded-2xl border border-slate-100 bg-slate-50 focus:outline-none focus:bg-white focus:border-[#D4A737] text-sm text-[#0B1B2A]"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-semibold text-[#0B1B2A] uppercase tracking-wider block mb-1.5">Direct Line / WhatsApp *</label>
                          <input
                            type="tel"
                            required
                            value={clientPhone}
                            onChange={(e) => setClientPhone(e.target.value)}
                            placeholder="+44 7700 900088"
                            className="w-full p-3.5 rounded-2xl border border-slate-100 bg-slate-50 focus:outline-none focus:bg-white focus:border-[#D4A737] text-sm text-[#0B1B2A]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-[#0B1B2A] uppercase tracking-wider block mb-1.5">Bespoke Demands & Security Clearances (Optional)</label>
                        <textarea
                          rows={4}
                          value={specialRequests}
                          onChange={(e) => setSpecialRequests(e.target.value)}
                          placeholder="Please note physical building constraints, specific dietary rules, or strict security/embargo details."
                          className="w-full p-3.5 rounded-2xl border border-slate-100 bg-slate-50 focus:outline-none focus:bg-white focus:border-[#D4A737] text-sm text-[#0B1B2A] resize-none"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Footer buttons */}
                <div className="flex justify-between items-center pt-8 border-t border-slate-100 mt-10">
                  {step > 1 ? (
                    <button
                      type="button"
                      onClick={handlePrev}
                      className="px-6 py-3 rounded-xl border border-slate-100 hover:border-slate-200 text-slate-500 font-semibold text-xs uppercase tracking-wider transition-colors"
                    >
                      Back
                    </button>
                  ) : (
                    <div />
                  )}

                  {step < 3 ? (
                    <button
                      type="button"
                      onClick={handleNext}
                      className="px-8 py-3 rounded-xl bg-[#0B1B2A] hover:bg-[#D4A737] text-white hover:text-[#0B1B2A] text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center gap-2"
                    >
                      <span>Continue Configuration</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-8 py-3 rounded-xl bg-[#D4A737] hover:bg-white text-white hover:text-[#0B1B2A] border border-[#D4A737] transition-all duration-300 text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-[#D4A737]/20 disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <span>TRANS-ROUTING BRIEF...</span>
                      ) : (
                        <>
                          <span>Submit Proposal Brief</span>
                          <Send className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  )}
                </div>

              </form>
            ) : (
              // SUCCESS OUTCOME SCREEN
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center text-center py-12 px-4"
              >
                <div className="w-20 h-20 rounded-full bg-[#D4A737]/10 flex items-center justify-center mb-6 text-[#D4A737] border border-[#D4A737]/20 shadow-md">
                  <CheckCircle2 className="w-12 h-12" />
                </div>

                <span className="text-[#D4A737] text-xs font-bold tracking-[0.2em] uppercase mb-2">Bespoke Proposal Encrypted & Dispatched</span>
                <h2 className="text-3xl font-serif font-light text-[#0B1B2A] mb-4">An Extraordinary Journey Begins</h2>
                
                <div className="max-w-md text-slate-500 leading-relaxed space-y-4 mb-8 text-sm">
                  <p>
                    Thank you, <span className="font-semibold text-[#0B1B2A]">{clientName}</span>. Your planning brief has been successfully locked into our Mayfair registers.
                  </p>
                  
                  <div className="bg-slate-50 p-6 rounded-3xl text-xs text-left border border-slate-100 space-y-2 shadow-inner">
                    <strong className="text-[#0B1B2A] text-xs block border-b border-slate-200 pb-2 mb-2 uppercase tracking-wide">Secure Blueprint Specifications:</strong>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-slate-600 font-mono">
                      <span>Occasion Area:</span>
                      <span className="text-[#0B1B2A] font-semibold">{eventTypes.find(e => e.id === eventType)?.name}</span>
                      <span>Logistics Scope:</span>
                      <span className="text-[#0B1B2A] font-semibold">{guestCount} Guests</span>
                      <span>Target Hub:</span>
                      <span className="text-[#0B1B2A] font-semibold">{destination}</span>
                      <span>Milestone Date:</span>
                      <span className="text-[#0B1B2A] font-semibold">{eventDate ? new Date(eventDate).toLocaleDateString('en-GB', { dateStyle: 'long' }) : 'TBD'}</span>
                      <span>Total Estimated Pipeline:</span>
                      <span className="text-[#D4A737] font-semibold">{estimate.total}</span>
                    </div>
                  </div>

                  <p className="text-xs">
                    Our lead directors will audit the logistical coordinates and connect via secure voice call to <strong className="text-[#0B1B2A]">{clientPhone}</strong> within 2 hours.
                  </p>
                </div>

                <div className="flex flex-wrap gap-4 justify-center">
                  <button
                    onClick={handleReset}
                    className="px-8 py-3.5 rounded-xl bg-[#0B1B2A] hover:bg-[#D4A737] text-white hover:text-[#0B1B2A] transition-all duration-300 font-bold text-xs uppercase tracking-wider"
                  >
                    Return to Studio Home
                  </button>
                </div>
              </motion.div>
            )}
          </div>

          {/* RIGHT COLUMN: Live Interactive Estimation Board (4 cols) */}
          <div className="lg:col-span-4 space-y-8 sticky top-36">
            
            {/* Main Estimator Pricing Card */}
            <div className="bg-[#0B1B2A] text-white p-8 rounded-[40px] shadow-xl border border-slate-800 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-[#132d46]/30 to-transparent pointer-events-none" />
              <div className="absolute -top-16 -left-16 w-36 h-36 bg-[#D4A737]/10 rounded-full blur-3xl pointer-events-none" />
              
              <div className="relative z-10 space-y-6">
                <div>
                  <span className="text-[#D4A737] text-[10px] font-bold tracking-[0.2em] uppercase block font-mono">
                    LIVE INVESTMENT ALLOCATION
                  </span>
                  <h4 className="text-2xl font-serif font-light text-white mt-1">Proposal Estimates</h4>
                </div>

                <div className="space-y-4 pt-4 border-t border-slate-800/80">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">Occasion Type</span>
                    <span className="font-semibold text-slate-200">
                      {eventTypes.find(e => e.id === eventType)?.name}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">Guest Accommodations</span>
                    <span className="font-semibold text-slate-200">{guestCount} Guests</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">Destination Hub</span>
                    <span className="font-semibold text-slate-200 truncate max-w-[150px]" title={destination}>
                      {destination.split(' (')[0]}
                    </span>
                  </div>
                  {preselectedPackage && (
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400">Investment Tier</span>
                      <span className="font-semibold text-[#D4A737] uppercase">{preselectedPackage}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">Selected Date</span>
                    <span className="font-semibold text-slate-200">
                      {eventDate ? new Date(eventDate).toLocaleDateString('en-GB', { dateStyle: 'medium' }) : 'TBD'}
                    </span>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-800 space-y-3">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-widest block font-mono">
                      Estimated Luxury Investment
                    </span>
                    <div className="text-3xl sm:text-4xl font-serif font-medium text-[#D4A737] mt-1">
                      {estimate.total}
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-[11px] text-slate-300 leading-relaxed font-light">
                    This instant estimation covers complete creative production, Mayfair executive direction, global floral chains, and 3D mockups.
                    <div className="mt-2 text-[#D4A737] font-semibold">
                      • Mobilization Deposit (25%): {estimate.deposit}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* AURA Quality Standards sidebar item */}
            <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm text-left space-y-4">
              <h4 className="text-xs font-bold text-[#0B1B2A] uppercase tracking-widest border-b border-slate-100 pb-3 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>The AURA Curation Mandate</span>
              </h4>
              <ul className="space-y-3 text-xs text-slate-500 font-light leading-relaxed">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#D4A737] shrink-0 mt-0.5" />
                  <span><strong>Zero-Foam Commitment:</strong> 100% natural organic floral architecture, banning polluting microplastic foams.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#D4A737] shrink-0 mt-0.5" />
                  <span><strong>Sound Health Protocols:</strong> Background acoustics tailored specifically at 432Hz ambient tuning.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#D4A737] shrink-0 mt-0.5" />
                  <span><strong>Complete NDA Enclosures:</strong> Fully compliant legal non-disclosure protocols provided on first print draft.</span>
                </li>
              </ul>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
