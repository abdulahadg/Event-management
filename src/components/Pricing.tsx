import React from 'react';
import { pricingData } from '../data';
import { Check, Star, ArrowRight } from 'lucide-react';

interface PricingProps {
  onOpenConsultationWithPackage: (packageName: string) => void;
}

export default function Pricing({ onOpenConsultationWithPackage }: PricingProps) {
  return (
    <section id="packages" className="py-24 bg-white relative overflow-hidden border-t border-slate-100">
      {/* Background Ornaments */}
      <div className="absolute top-1/2 left-0 w-80 h-80 bg-[#D4A737]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-20">
          <span className="text-[#D4A737] text-xs font-semibold tracking-widest uppercase block">
            INVESTMENT SCHEMES
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-medium text-[#0B1B2A] tracking-tight">
            Tailored Resource Tiering For Discerning Patrons
          </h2>
          <div className="w-12 h-[2.5px] bg-[#D4A737] mx-auto" />
          <p className="text-sm text-slate-500 max-w-xl mx-auto">
            Review our premier structural packages. Every allocation represents complete, premium execution led by a dedicated senior creative director.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {pricingData.map((tier) => {
            const isPopular = tier.isPopular;
            return (
              <div
                key={tier.name}
                className={`relative p-8 md:p-10 rounded-3xl text-left transition-all duration-300 flex flex-col justify-between ${
                  isPopular
                    ? 'bg-[#0B1B2A] text-white border-2 border-[#D4A737] shadow-xl scale-102 lg:scale-105 z-10'
                    : 'bg-[#FAFBFD] text-[#0B1B2A] border border-slate-100 hover:border-slate-200 shadow-sm'
                }`}
              >
                {/* Popularity Badge Overlay */}
                {isPopular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-[#D4A737] text-[#0B1B2A] text-[10px] font-extrabold uppercase tracking-widest flex items-center gap-1.5 shadow-md">
                    <Star className="w-3 h-3 fill-current" />
                    <span>Highly Recommended Suite</span>
                  </div>
                )}

                <div className="space-y-6">
                  {/* Tier Title and Price */}
                  <div className="space-y-2">
                    <span className={`text-xs font-bold uppercase tracking-widest ${isPopular ? 'text-[#D4A737]' : 'text-slate-400'}`}>
                      {tier.name} Department
                    </span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl md:text-5xl font-serif font-bold tracking-tight">{tier.price}</span>
                      {tier.price !== 'Bespoke' && <span className="text-xs text-slate-400 font-medium">/ launch</span>}
                    </div>
                    <p className={`text-xs leading-relaxed ${isPopular ? 'text-slate-300' : 'text-slate-500'}`}>
                      {tier.description}
                    </p>
                  </div>

                  {/* Divider */}
                  <div className={`h-[1px] ${isPopular ? 'bg-slate-800' : 'bg-slate-200/60'}`} />

                  {/* Features List */}
                  <ul className="space-y-3.5">
                    {tier.features.map((feat, i) => (
                      <li key={i} className="flex items-start gap-3 text-xs leading-normal">
                        <div className={`p-1 rounded-full flex-shrink-0 mt-0.5 ${isPopular ? 'bg-[#D4A737]/10 text-[#D4A737]' : 'bg-[#0B1B2A]/5 text-[#0B1B2A]'}`}>
                          <Check className="w-3 h-3" />
                        </div>
                        <span className={isPopular ? 'text-slate-200' : 'text-slate-600'}>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Call to Action Button */}
                <button
                  onClick={() => onOpenConsultationWithPackage(tier.name)}
                  className={`w-full mt-8 py-4 px-6 rounded-2xl font-bold text-xs uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 group ${
                    isPopular
                      ? 'bg-[#D4A737] hover:bg-[#bfa22f] text-white shadow-lg shadow-[#D4A737]/10'
                      : 'bg-white hover:bg-[#0B1B2A] text-[#0B1B2A] hover:text-white border border-slate-200 hover:border-[#0B1B2A] shadow-xs'
                  }`}
                >
                  <span>{tier.ctaText}</span>
                  <Star className="w-4 h-4 fill-current group-hover:rotate-45 transition-transform" />
                </button>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
