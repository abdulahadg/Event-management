import React, { useState } from 'react';
import { testimonialsData } from '../data';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? testimonialsData.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === testimonialsData.length - 1 ? 0 : prev + 1));
  };

  const activeReview = testimonialsData[currentIndex];

  return (
    <section id="testimonials" className="py-24 bg-[#FAFBFD] relative overflow-hidden border-t border-slate-100">
      {/* Decorative Ornaments */}
      <div className="absolute top-1/2 right-0 w-84 h-84 bg-blue-100/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
        
        {/* Header Section */}
        <div className="space-y-4 mb-16">
          <span className="text-[#D4A737] text-xs font-semibold tracking-widest uppercase block">
            CLIENT ENDORSEMENTS
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-medium text-[#0B1B2A] tracking-tight">
            Discerning Verifications from Industry Leaders
          </h2>
          <div className="w-12 h-[2.5px] bg-[#D4A737] mx-auto" />
        </div>

        {/* Testimonials Slider Box */}
        <div className="relative bg-white rounded-[32px] p-8 md:p-14 border border-slate-100 shadow-sm overflow-hidden">
          {/* Absolute Background Quote Sign */}
          <Quote className="absolute right-8 bottom-8 w-36 h-36 text-slate-100/50 select-none pointer-events-none" />

          <AnimatePresence mode="wait">
            <motion.div
              key={activeReview.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="space-y-8 relative z-10"
            >
              {/* Star Ratings Row */}
              <div className="flex justify-center gap-1 text-[#D4A737]">
                {[...Array(activeReview.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-current" />
                ))}
              </div>

              {/* Quote text */}
              <p className="text-base sm:text-lg md:text-xl font-serif font-medium italic text-[#0B1B2A] leading-relaxed max-w-3xl mx-auto">
                "{activeReview.content}"
              </p>

              {/* Author Info block */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <img
                  src={activeReview.imageUrl}
                  alt={activeReview.name}
                  className="w-14 h-14 rounded-full object-cover border border-slate-200"
                />
                <div className="text-left text-xs">
                  <span className="font-bold text-[#0B1B2A] block text-sm">{activeReview.name}</span>
                  <span className="text-slate-500 block">{activeReview.role}</span>
                  <span className="text-[#D4A737] font-semibold block">{activeReview.company}</span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Controls */}
          <div className="flex justify-center items-center gap-4 mt-10">
            <button
              onClick={handlePrev}
              className="p-3 rounded-full bg-slate-50 border border-slate-100 hover:border-slate-200 text-slate-600 hover:text-[#0B1B2A] transition-colors shadow-sm"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-xs text-slate-400 font-medium">
              {currentIndex + 1} of {testimonialsData.length}
            </span>
            <button
              onClick={handleNext}
              className="p-3 rounded-full bg-slate-50 border border-slate-100 hover:border-slate-200 text-slate-600 hover:text-[#0B1B2A] transition-colors shadow-sm"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}
