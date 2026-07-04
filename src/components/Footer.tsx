import React, { useState } from 'react';
import { Mail, Phone, MapPin, Crown, ArrowRight, Instagram, Linkedin, Twitter, Globe, CheckCircle2 } from 'lucide-react';

interface FooterProps {
  onOpenAdmin?: () => void;
  onNavigate?: (id: string) => void;
}

export default function Footer({ onOpenAdmin, onNavigate }: FooterProps) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setTimeout(() => {
      setEmail('');
    }, 2000);
  };

  const handleScrollTo = (id: string) => {
    if (onNavigate) {
      onNavigate(id);
      return;
    }
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <footer id="footer" className="bg-[#0B1B2A] text-slate-300 border-t border-slate-800 pt-20 pb-8 relative overflow-hidden">
      {/* Decorative Blur sphere */}
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#D4A737]/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        
        {/* Main Footer grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 pb-16 border-b border-slate-800">
          
          {/* Col 1: Brand & Bio (4 Cols) */}
          <div className="lg:col-span-4 space-y-6 text-left">
            <button
              onClick={() => handleScrollTo('home')}
              className="flex items-center gap-2 text-white font-serif font-semibold text-2xl tracking-wide text-left"
            >
              <div className="p-1.5 rounded-lg bg-[#D4A737] text-[#0B1B2A]">
                <Crown className="w-5 h-5" />
              </div>
              <span>AURA<span className="text-[#D4A737] font-sans font-normal text-xs ml-1.5 tracking-widest uppercase">GLOBAL</span></span>
            </button>
            
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Established in Mayfair, London, AURA is an award-winning event production and experiential planning agency. We blend classic British sophistication with modern technical execution to realize extraordinary milestones globally.
            </p>

            <div className="flex gap-3">
              {[Instagram, Linkedin, Twitter, Globe].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-[#D4A737] hover:border-[#D4A737] transition-all"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Col 2: Quick Links (2 Cols) */}
          <div className="lg:col-span-2 space-y-5 text-left">
            <h4 className="text-xs font-bold text-white uppercase tracking-widest">Quick links</h4>
            <ul className="space-y-3 text-xs text-slate-400">
              {[
                { name: 'Home Studio', id: 'home' },
                { name: 'About Agency', id: 'about' },
                { name: 'Services Grid', id: 'services' },
                { name: 'Portfolio Blueprint', id: 'portfolio' },
                { name: 'Season Schedule', id: 'events' },
                { name: 'Investment Tier', id: 'packages' }
              ].map((link) => (
                <li key={link.id}>
                  <button
                    onClick={() => handleScrollTo(link.id)}
                    className="hover:text-[#D4A737] transition-colors"
                  >
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Services (3 Cols) */}
          <div className="lg:col-span-3 space-y-5 text-left">
            <h4 className="text-xs font-bold text-white uppercase tracking-widest">Our Services</h4>
            <ul className="space-y-3 text-xs text-slate-400">
              {[
                { name: 'Corporate Events', id: 'services' },
                { name: 'Luxury Weddings', id: 'services' },
                { name: 'Product Launches', id: 'services' },
                { name: 'Conferences & Expos', id: 'services' },
                { name: 'Award Ceremonies', id: 'services' },
                { name: 'Event Decoration', id: 'services' }
              ].map((link, i) => (
                <li key={i}>
                  <button
                    onClick={() => handleScrollTo(link.id)}
                    className="hover:text-[#D4A737] transition-colors"
                  >
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Newsletter & Contact (3 Cols) */}
          <div className="lg:col-span-3 space-y-6 text-left">
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-white uppercase tracking-widest">AURA publications</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">Subscribe to receive exclusive destination catalogs and design case studies.</p>
            </div>

            {!subscribed ? (
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@corporation.com"
                  className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs focus:outline-none focus:border-[#D4A737] text-white flex-grow"
                />
                <button
                  type="submit"
                  className="p-2.5 rounded-xl bg-[#D4A737] hover:bg-[#bfa22f] text-white transition-colors"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            ) : (
              <div className="flex items-center gap-2 text-xs text-[#D4A737] bg-slate-900 p-3 rounded-xl border border-slate-800">
                <CheckCircle2 className="w-4 h-4" />
                <span>Subscription Confirmed</span>
              </div>
            )}

            {/* Direct coordinate coordinates mini */}
            <div className="pt-2 space-y-2.5 text-[11px] text-slate-400">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#D4A737]" />
                <span>+44 (0) 20 7946 0088</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#D4A737]" />
                <span>concierge@auraevents.co.uk</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom footer bar */}
        <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-slate-500">
          <span>© {new Date().getFullYear()} AURA GLOBAL Events Mayfair. All rights reserved. Registered UK Agency.</span>
          
          <div className="flex gap-6 items-center flex-wrap justify-center md:justify-end">
            <a href="#" className="hover:text-slate-300">Privacy Policy</a>
            <a href="#" className="hover:text-slate-300">Terms & Conditions</a>
            <a href="#" className="hover:text-slate-300">Heritage Compliance</a>
            {onOpenAdmin && (
              <button
                onClick={onOpenAdmin}
                className="hover:text-slate-200 transition-colors text-[10px] uppercase font-bold text-[#D4A737] flex items-center gap-1 font-mono px-2 py-1 bg-slate-900 rounded-lg border border-slate-800"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse inline-block" />
                <span>Admin Panel</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </footer>
  );
}
