import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { portfolioData } from '../data';
import { MapPin, Calendar, Users, ArrowUpRight } from 'lucide-react';

interface PortfolioProps {
  onOpenProject: (id: string) => void;
}

export default function Portfolio({ onOpenProject }: PortfolioProps) {
  const [selectedCategory, setSelectedCategory] = useState<'All' | 'Corporate' | 'Wedding' | 'Birthday' | 'Conference' | 'Festival' | 'Luxury Events'>('All');
  const categories = ['All', 'Corporate', 'Wedding', 'Birthday', 'Conference', 'Festival', 'Luxury Events'];

  const filteredPortfolio = portfolioData.filter((item) => {
    if (selectedCategory === 'All') return true;
    return item.category === selectedCategory;
  });

  return (
    <section id="portfolio" className="py-24 bg-white relative overflow-hidden">
      {/* Background visual dots */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-30 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        
        {/* Section Heading */}
        <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-6 mb-16">
          <div className="space-y-4 text-left max-w-2xl">
            <span className="text-[#D4A737] text-xs font-semibold tracking-widest uppercase block">
              PORTFOLIO ARCHIVE
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-medium text-[#0B1B2A] tracking-tight">
              A Selection of Extraordinary Moments Manifested
            </h2>
            <div className="w-12 h-[2.5px] bg-[#D4A737]" />
          </div>
          <p className="text-sm text-slate-500 max-w-xs text-left leading-relaxed font-light">
            Every visual asset represents a real global deployment. Hover to view layout credentials, and click to inspect blueprints.
          </p>
        </div>

        {/* Filter Navigation */}
        <div className="flex justify-start flex-wrap gap-2 mb-12 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat as any)}
              className={`px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 flex-shrink-0 ${
                selectedCategory === cat
                  ? 'bg-[#0B1B2A] text-white shadow-md'
                  : 'bg-[#FAFBFD] hover:bg-slate-100 text-slate-600 border border-slate-200/50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Luxury Portfolio Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredPortfolio.map((item, index) => (
              <motion.div
                layout
                key={item.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5 }}
                onClick={() => onOpenProject(item.id)}
                className="group relative h-[380px] rounded-3xl overflow-hidden shadow-sm hover:shadow-xl cursor-pointer border border-slate-100"
              >
                {/* Background Image with Zoom on Hover */}
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />

                {/* Dark Vignette Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B1B2A]/90 via-[#0B1B2A]/30 to-transparent transition-opacity duration-300" />

                {/* Content Panel (Aesthetic pairing) */}
                <div className="absolute inset-0 p-8 flex flex-col justify-between text-left">
                  {/* Top Category Badge */}
                  <div className="flex justify-between items-start">
                    <span className="text-[9px] font-bold text-[#D4A737] uppercase tracking-widest bg-[#0B1B2A]/80 border border-[#D4A737]/20 px-3 py-1 rounded-full backdrop-blur-xs">
                      {item.category}
                    </span>
                    <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <ArrowUpRight className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Bottom descriptive block */}
                  <div className="space-y-2 transform translate-y-3 group-hover:translate-y-0 transition-transform duration-300">
                    <span className="text-[10px] text-slate-300 uppercase tracking-widest font-semibold block">{item.location}</span>
                    <h3 className="text-xl font-serif font-semibold text-white group-hover:text-[#D4A737] transition-colors leading-snug">
                      {item.title}
                    </h3>
                    <div className="flex items-center gap-4 text-[11px] text-slate-300 pt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="flex items-center gap-1"><Users className="w-3 h-3 text-[#D4A737]" /> {item.guestCount}</span>
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3 text-[#D4A737]" /> {item.year}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
}
