import React from 'react';
import { clientLogos } from '../data';
import { Crown, Sparkles, Building, Globe, Zap, Award } from 'lucide-react';

export default function TrustedBy() {
  // Map icons to logos for elite high-fidelity appearance
  const logoIcons = [
    Award,
    Crown,
    Sparkles,
    Building,
    Globe,
    Zap,
    Crown
  ];

  return (
    <section id="trusted" className="py-12 bg-[#FAFBFD] border-y border-slate-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12">
          
          {/* Label section */}
          <div className="flex-shrink-0 text-center md:text-left">
            <span className="text-[11px] font-bold tracking-widest text-slate-400 uppercase block mb-1">GLOBAL PRESENCE</span>
            <h5 className="text-sm font-semibold text-[#0B1B2A] tracking-wider uppercase">TRUSTED BY INSTITUTIONS</h5>
          </div>

          {/* Scrolling Logos */}
          <div className="w-full overflow-hidden relative">
            {/* Ambient gradients for fade out left and right */}
            <div className="absolute top-0 left-0 w-16 h-full bg-gradient-to-r from-[#FAFBFD] to-transparent z-10 pointer-events-none" />
            <div className="absolute top-0 right-0 w-16 h-full bg-gradient-to-l from-[#FAFBFD] to-transparent z-10 pointer-events-none" />

            <div className="flex items-center gap-12 md:gap-16 animate-[marquee_25s_linear_infinite] whitespace-nowrap min-w-full justify-around">
              {clientLogos.map((item, index) => {
                const IconComponent = logoIcons[index % logoIcons.length];
                return (
                  <div
                    key={`${item.name}-${index}`}
                    className="inline-flex items-center gap-3 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-300 cursor-pointer"
                  >
                    <IconComponent className="w-4 h-4 text-black" />
                    <span className="font-sans font-bold tracking-widest text-xs text-black">{item.logo}</span>
                  </div>
                );
              })}
              {/* Duplicate loop for seamless scroll effect */}
              {clientLogos.map((item, index) => {
                const IconComponent = logoIcons[index % logoIcons.length];
                return (
                  <div
                    key={`${item.name}-${index}-dup`}
                    className="inline-flex items-center gap-3 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-300 cursor-pointer"
                  >
                    <IconComponent className="w-4 h-4 text-black" />
                    <span className="font-sans font-bold tracking-widest text-xs text-black">{item.logo}</span>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
