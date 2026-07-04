import React, { useState } from 'react';
import { faqData } from '../data';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, Sparkles, MessageSquare } from 'lucide-react';

interface FAQProps {
  onOpenConsultation: () => void;
}

export default function FAQ({ onOpenConsultation }: FAQProps) {
  const [openId, setOpenId] = useState<string | null>('f1');

  const toggleFaq = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section id="faq" className="py-24 bg-[#F5F7FA] relative overflow-hidden border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          {/* Left Column: Context Brief (5 Cols) */}
          <div className="lg:col-span-5 space-y-8 text-left sticky top-32">
            <div className="space-y-4">
              <span className="text-[#D4A737] text-xs font-semibold tracking-widest uppercase block">
                RESOLVING UNKNOWNS
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif font-medium text-[#0B1B2A] tracking-tight">
                Frequently Clarified Queries
              </h2>
              <div className="w-12 h-[2.5px] bg-[#D4A737]" />
            </div>

            <p className="text-sm text-slate-500 leading-relaxed max-w-sm">
              We operate at the highest standards of transparency and confidentiality. Review our standard operational guidelines, destination coverage policies, and performer contract riders.
            </p>

            {/* Concierge support box */}
            <div className="p-6 rounded-3xl bg-white border border-slate-100 shadow-sm space-y-4 max-w-sm">
              <div className="p-3 rounded-2xl bg-[#D4A737]/10 text-[#D4A737] w-fit shadow-xs">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-serif font-bold text-[#0B1B2A]">Still have queries?</h4>
                <p className="text-xs text-slate-400">Our Mayfair concierge desk is available 24/7 for urgent consultations.</p>
              </div>
              <button
                onClick={onOpenConsultation}
                className="w-full py-2.5 rounded-xl bg-[#0B1B2A] hover:bg-[#D4A737] hover:text-[#0B1B2A] text-white text-xs font-semibold uppercase tracking-wider transition-all shadow-sm"
              >
                Direct Enquire
              </button>
            </div>
          </div>

          {/* Right Column: Accordion Items (7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            {faqData.map((item) => {
              const isOpen = openId === item.id;
              return (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-xs transition-all duration-300 hover:border-slate-200"
                >
                  {/* Header Trigger bar */}
                  <button
                    onClick={() => toggleFaq(item.id)}
                    className="w-full p-6 text-left flex justify-between items-center gap-4 text-[#0B1B2A]"
                  >
                    <span className="font-serif font-semibold text-sm sm:text-base pr-4">
                      {item.question}
                    </span>
                    <div className={`p-1.5 rounded-full bg-slate-50 border border-slate-100 text-[#0B1B2A] transition-transform duration-300 ${isOpen ? 'rotate-180 bg-[#D4A737]/10 text-[#D4A737] border-[#D4A737]/20' : ''}`}>
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>

                  {/* Expandable Panel */}
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="px-6 pb-6 pt-1 text-xs sm:text-sm text-slate-500 leading-relaxed border-t border-slate-50">
                          {item.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
}
