import React, { useState, useEffect } from 'react';
import { Menu, X, Crown } from 'lucide-react';

interface NavbarProps {
  onOpenConsultation: () => void;
  onNavigate?: (id: string) => void;
  activeSectionOverride?: string;
}

export default function Navbar({ onOpenConsultation, onNavigate, activeSectionOverride }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  const navLinks = [
    { name: 'Home', id: 'home' },
    { name: 'About', id: 'about' },
    { name: 'Services', id: 'services' },
    { name: 'Portfolio', id: 'portfolio' },
    { name: 'Events', id: 'events' },
    { name: 'Packages', id: 'packages' },
    { name: 'Testimonials', id: 'testimonials' },
    { name: 'Blog', id: 'blog' },
    { name: 'Contact', id: 'contact' },
  ];

  useEffect(() => {
    if (activeSectionOverride) {
      setActiveSection(activeSectionOverride);
      return;
    }

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);

      // Simple active link tracking based on scroll position
      const scrollPosition = window.scrollY + 120;
      for (const link of navLinks) {
        const element = document.getElementById(link.id);
        if (element) {
          const top = element.offsetTop;
          const height = element.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(link.id);
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeSectionOverride]);

  const handleScrollTo = (id: string) => {
    setIsMobileMenuOpen(false);
    if (onNavigate) {
      onNavigate(id);
      return;
    }

    const element = document.getElementById(id);
    if (element) {
      const offset = 80; // height of sticky header
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
    <nav
      id="sticky-navbar"
      className={`fixed top-0 left-0 w-full z-40 transition-all duration-300 bg-white border-b border-slate-100 py-4 shadow-xs`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <button
          onClick={() => handleScrollTo('home')}
          className="flex items-center gap-2 text-[#0B1B2A] font-serif font-semibold text-2xl tracking-wide group"
        >
          <div className="p-1.5 rounded-lg bg-gradient-to-tr from-[#D4A737] to-[#BFA22F] text-white">
            <Crown className="w-5 h-5" />
          </div>
          <span>AURA<span className="text-[#D4A737] font-sans font-normal text-xs ml-1.5 tracking-widest uppercase">GLOBAL</span></span>
        </button>

        {/* Desktop Navigation Link Cluster */}
        <div className="hidden lg:flex items-center gap-6">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleScrollTo(link.id)}
              className={`text-sm font-medium tracking-wide transition-all hover:text-[#D4A737] relative ${
                activeSection === link.id ? 'text-[#D4A737]' : 'text-slate-600'
              }`}
            >
              {link.name}
              {activeSection === link.id && (
                <span className="absolute -bottom-1 left-0 w-full h-[1.5px] bg-[#D4A737]" />
              )}
            </button>
          ))}
        </div>

        {/* Action Button & Mobile Trigger */}
        <div className="flex items-center gap-4">
          <button
            onClick={onOpenConsultation}
            className="hidden sm:inline-block px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#0B1B2A] hover:bg-[#D4A737] text-white hover:text-[#0B1B2A] transition-all duration-300 border border-[#0B1B2A] hover:border-[#D4A737] shadow-sm hover:shadow-[#D4A737]/20"
          >
            Book Consultation
          </button>

          {/* Mobile Menu Icon */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 lg:hidden text-slate-800 rounded-lg hover:bg-slate-50 transition-colors"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Expandable Panel */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-white border-b border-slate-100 shadow-xl py-6 px-6 lg:hidden flex flex-col gap-4 animate-fadeIn">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleScrollTo(link.id)}
              className={`text-left text-base font-medium py-2 border-b border-slate-50 ${
                activeSection === link.id ? 'text-[#D4A737]' : 'text-[#0B1B2A]'
              }`}
            >
              {link.name}
            </button>
          ))}
          <button
            onClick={() => {
              setIsMobileMenuOpen(false);
              onOpenConsultation();
            }}
            className="w-full mt-2 py-3 rounded-xl bg-[#0B1B2A] hover:bg-[#D4A737] text-white font-medium text-sm transition-colors text-center"
          >
            Book Consultation
          </button>
        </div>
      )}
    </nav>
  );
}
