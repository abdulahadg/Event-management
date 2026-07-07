import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, Instagram, Linkedin, Twitter, Globe, Compass } from 'lucide-react';
import { createClient, isSupabaseConfigured } from '@/utils/supabase/client';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    category: 'corporate-events',
    guests: '150',
    details: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    const timestamp = new Date().toISOString();

    if (!isSupabaseConfigured()) {
      setIsSubmitting(false);
      // Save to localStorage as history fallback
      const inquiries = JSON.parse(localStorage.getItem('aura_general_inquiries') || '[]');
      localStorage.setItem('aura_general_inquiries', JSON.stringify([...inquiries, { ...formData, timestamp }]));

      setErrorMessage('Database credentials are not configured. Please define NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY in your environment variables/secrets via the settings menu. (A fallback local reservation was successfully saved to your browser history).');
      return;
    }

    try {
      const supabase = createClient();

      // Try to insert the form data into the 'inquiries' table
      const { error } = await supabase.from('inquiries').insert([
        {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          event_type: formData.category,
          guests: Number(formData.guests),
          details: formData.details,
          timestamp
        }
      ]);

      if (error) {
        throw error;
      }

      // Save to localStorage as history
      const inquiries = JSON.parse(localStorage.getItem('aura_general_inquiries') || '[]');
      localStorage.setItem('aura_general_inquiries', JSON.stringify([...inquiries, { ...formData, timestamp }]));

      setIsSubmitting(false);
      setIsSubmitted(true);
    } catch (err) {
      console.error('Supabase contact submission failed:', err);
      setIsSubmitting(false);
      setErrorMessage('Could not connect to the intake gateway database. Please check your Supabase connection parameters and make sure the table schema matches.');
    }
  };

  return (
    <section id="contact" className="py-24 bg-white relative overflow-hidden border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          {/* Left Column: Coordinates & Stylized Maps (5 Cols) */}
          <div className="lg:col-span-5 space-y-10 text-left">
            <div className="space-y-4">
              <span className="text-[#D4A737] text-xs font-semibold tracking-widest uppercase block">
                GLOBAL INTAKE
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif font-medium text-[#0B1B2A] tracking-tight">
                Establish Connection with Our Planners
              </h2>
              <div className="w-12 h-[2.5px] bg-[#D4A737]" />
            </div>

            {/* Direct Coordinates */}
            <div className="space-y-6 text-sm text-slate-600">
              
              <div className="flex gap-4 items-start">
                <div className="p-3 rounded-2xl bg-[#FAFBFD] border border-slate-100 text-[#D4A737] shadow-xs">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-serif font-bold text-[#0B1B2A] block text-sm">Mayfair HQ Studio</span>
                  <p className="text-xs text-slate-400 mt-1">45 Berkeley Square, Mayfair, London W1J 5AS, UK</p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="p-3 rounded-2xl bg-[#FAFBFD] border border-slate-100 text-[#D4A737] shadow-xs">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-serif font-bold text-[#0B1B2A] block text-sm">Direct Mayfair Suite</span>
                  <p className="text-xs text-slate-400 mt-1">+44 (0) 20 7946 0088</p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="p-3 rounded-2xl bg-[#FAFBFD] border border-slate-100 text-[#D4A737] shadow-xs">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-serif font-bold text-[#0B1B2A] block text-sm">Electronic Intakes</span>
                  <p className="text-xs text-slate-400 mt-1">concierge@auraevents.co.uk</p>
                </div>
              </div>

            </div>

            {/* Stylized custom vector map of Mayfair Hub to represent Maps elegantly */}
            <div className="p-6 rounded-3xl bg-[#0B1B2A] text-white space-y-4 relative overflow-hidden h-[240px] flex flex-col justify-between border border-slate-800">
              {/* Abs grid lines */}
              <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:20px_20px] opacity-40 pointer-events-none" />
              {/* Graphic golden target rings */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full border border-[#D4A737]/20 flex items-center justify-center animate-pulse">
                <div className="w-24 h-24 rounded-full border border-[#D4A737]/40 flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full bg-[#D4A737] flex items-center justify-center shadow-lg shadow-[#D4A737]/30 text-[#0B1B2A]">
                    <Compass className="w-4 h-4 animate-spin-slow" />
                  </div>
                </div>
              </div>

              <div className="relative z-10 text-left">
                <span className="text-[10px] text-[#D4A737] uppercase tracking-widest font-bold">GEOGRAPHIC COORDINATES</span>
                <h4 className="text-base font-serif font-semibold mt-1">Mayfair HQ Satellite Link</h4>
                <p className="text-[11px] text-slate-400 mt-1">Satellite tracking coordinates: 51.5091° N, 0.1465° W</p>
              </div>

              <div className="relative z-10 flex justify-between items-end border-t border-slate-800 pt-3">
                <span className="text-[11px] text-[#D4A737] font-semibold tracking-wider">AURA DEPLOYMENT HUB</span>
                <span className="text-[10px] text-slate-400 font-mono">MAPS PROTOCOL: SECURE</span>
              </div>
            </div>

            {/* Social Accounts links */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-slate-700 block uppercase tracking-wider">AURA DIGITAL CHANNELS</span>
              <div className="flex gap-3">
                {[
                  { icon: Instagram, url: '#' },
                  { icon: Linkedin, url: '#' },
                  { icon: Twitter, url: '#' },
                  { icon: Globe, url: '#' }
                ].map((social, i) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={i}
                      href={social.url}
                      className="p-3 rounded-2xl bg-[#FAFBFD] border border-slate-100 text-[#0B1B2A] hover:bg-[#0B1B2A] hover:text-[#D4A737] transition-all"
                    >
                      <Icon className="w-4 h-4" />
                    </a>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Right Column: Dynamic Inquiry Form (7 Cols) */}
          <div className="lg:col-span-7 bg-[#FAFBFD] p-8 md:p-12 rounded-[32px] border border-slate-100 shadow-sm text-left">
            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <h3 className="text-2xl font-serif font-medium text-[#0B1B2A] mb-1">Send a Proposal Brief</h3>
                  <p className="text-xs text-slate-400">Our lead spatial directors compile draft blueprints for all accepted submissions.</p>
                </div>

                {errorMessage && (
                  <div className="p-4 rounded-2xl bg-rose-50 border border-rose-100 text-rose-600 text-xs font-semibold tracking-wide flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-[#0B1B2A] uppercase tracking-wider block mb-1">Your Name *</label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g. Alistair Sterling"
                      className="w-full p-3.5 rounded-2xl bg-white border border-slate-100 focus:outline-none focus:border-[#D4A737] text-sm text-[#0B1B2A]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-[#0B1B2A] uppercase tracking-wider block mb-1">Direct Email *</label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="a.sterling@capital.co.uk"
                        className="w-full p-3.5 rounded-2xl bg-white border border-slate-100 focus:outline-none focus:border-[#D4A737] text-sm text-[#0B1B2A]"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-[#0B1B2A] uppercase tracking-wider block mb-1">Direct Telephone *</label>
                      <input
                        type="tel"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+44 7700 900077"
                        className="w-full p-3.5 rounded-2xl bg-white border border-slate-100 focus:outline-none focus:border-[#D4A737] text-sm text-[#0B1B2A]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-[#0B1B2A] uppercase tracking-wider block mb-1">Target Department</label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="w-full p-3.5 rounded-2xl bg-white border border-slate-100 focus:outline-none focus:border-[#D4A737] text-sm text-[#0B1B2A]"
                      >
                        <option value="corporate-events">Corporate Summit</option>
                        <option value="weddings">Luxury Wedding</option>
                        <option value="product-launches">Product Reveal</option>
                        <option value="award-ceremonies">Award Ceremony</option>
                        <option value="private-events">Private Estate Party</option>
                        <option value="birthday-parties">Milestone Birthday</option>
                        <option value="festivals">Bespoke Festival</option>
                        <option value="event-decoration">Luxury Decor Only</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-[#0B1B2A] uppercase tracking-wider block mb-1">Anticipated Guests</label>
                      <select
                        name="guests"
                        value={formData.guests}
                        onChange={handleChange}
                        className="w-full p-3.5 rounded-2xl bg-white border border-slate-100 focus:outline-none focus:border-[#D4A737] text-sm text-[#0B1B2A]"
                      >
                        <option value="20">Intimate (20 - 50 guests)</option>
                        <option value="150">Mid-Scale (100 - 300 guests)</option>
                        <option value="500">Large Summit (300 - 800 guests)</option>
                        <option value="1000">Grand Arena (800+ guests)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#0B1B2A] uppercase tracking-wider block mb-1">Event Ambitions & Design Demands</label>
                    <textarea
                      name="details"
                      rows={4}
                      value={formData.details}
                      onChange={handleChange}
                      placeholder="Kindly outline details regarding custom staging, location desires, or security requirements."
                      className="w-full p-3.5 rounded-2xl bg-white border border-slate-100 focus:outline-none focus:border-[#D4A737] text-sm text-[#0B1B2A] resize-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-2xl bg-[#0B1B2A] hover:bg-[#D4A737] hover:text-[#0B1B2A] text-white font-bold text-xs uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-[#D4A737]/20 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Routing brief...</span>
                  ) : (
                    <>
                      <span>Transmit Event Blueprint Brief</span>
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            ) : (
              <div className="flex flex-col items-center justify-center text-center py-12 px-4 space-y-6">
                <div className="w-16 h-16 rounded-full bg-[#D4A737]/10 flex items-center justify-center text-[#D4A737]">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <div className="space-y-2">
                  <span className="text-xs text-[#D4A737] font-semibold tracking-widest uppercase">Brief Securely Routed</span>
                  <h4 className="text-2xl font-serif font-medium text-[#0B1B2A]">Connection Established</h4>
                  <p className="text-xs text-slate-500 max-w-sm leading-relaxed mx-auto">
                    Thank you, <span className="font-semibold text-[#0B1B2A]">{formData.name}</span>. Your structural event brief has been received. Our Mayfair concierge team is compiling custom estate records and will reach you at <span className="font-semibold text-[#0B1B2A]">{formData.email}</span>.
                  </p>
                </div>
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="px-6 py-2.5 rounded-full bg-[#0B1B2A] text-white hover:bg-[#D4A737] hover:text-[#0B1B2A] transition-colors text-xs font-bold uppercase tracking-wider"
                >
                  Submit Another Brief
                </button>
              </div>
            )}
          </div>

        </div>

      </div>
    </section>
  );
}
