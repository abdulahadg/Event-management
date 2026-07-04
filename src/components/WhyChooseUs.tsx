import React from 'react';
import { Users, Compass, ShieldCheck, Crown, Coins, Clock, Star } from 'lucide-react';

export default function WhyChooseUs() {
  const features = [
    {
      icon: Users,
      title: 'Experienced Team',
      description: 'Our award-winning spatial architects and senior logistics directors have over 15 years of high-society planning history in the UK and internationally.'
    },
    {
      icon: Compass,
      title: 'Creative Planning',
      description: 'We reject standard design templates. Every project begins with bespoke artistic mood boards, custom-built scenery, and sensory atmosphere formulas.'
    },
    {
      icon: ShieldCheck,
      title: 'End-to-End Management',
      description: 'From securing exclusive castles to negotiating vendor retainers, technical stage production, and final post-event wraps, we oversee every line.'
    },
    {
      icon: Crown,
      title: 'Luxury Event Design',
      description: 'We orchestrate couture tablescapes, custom floral architecture, bespoke geometric pavilions, and high-fashion red carpet visual entries.'
    },
    {
      icon: Coins,
      title: 'Budget-Conscious Luxury',
      description: 'Complete cost transparency. We deliver unmatched global execution while maintaining strictly optimized, highly structured investment spreadsheets.'
    },
    {
      icon: Clock,
      title: 'On-Time Delivery',
      description: 'Flawless execution. Our military-grade minute-by-minute day schedules ensure stages build, speakers present, and champagne flows on the second.'
    }
  ];

  return (
    <section id="why-choose-us" className="py-24 bg-white relative overflow-hidden">
      {/* Decorative ambient gold drop */}
      <div className="absolute top-1/4 right-0 w-72 h-72 bg-gradient-to-tr from-[#D4A737]/5 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        
        {/* Section Heading */}
        <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-6 mb-16">
          <div className="space-y-4 text-left max-w-2xl">
            <span className="text-[#D4A737] text-xs font-semibold tracking-widest uppercase block">
              OUR STANDARDS
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-medium text-[#0B1B2A] tracking-tight">
              Why Elite Clients Entrust Their Legacies to AURA
            </h2>
            <div className="w-12 h-[2.5px] bg-[#D4A737]" />
          </div>
          <p className="text-sm text-slate-500 max-w-sm text-left leading-relaxed">
            We merge immaculate British discretion with high-fidelity sensory design to create an unparalleled event production framework.
          </p>
        </div>

        {/* Features Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feat, index) => {
            const IconComponent = feat.icon;
            return (
              <div
                key={index}
                className="group p-8 rounded-3xl bg-[#FAFBFD] border border-slate-100 hover:border-[#D4A737]/20 hover:bg-white transition-all duration-300 shadow-sm hover:shadow-lg text-left"
              >
                {/* Icon wrapper */}
                <div className="p-3.5 rounded-2xl bg-white text-[#0B1B2A] group-hover:bg-[#0B1B2A] group-hover:text-white shadow-sm w-fit transition-all duration-300 mb-6">
                  <IconComponent className="w-5 h-5" />
                </div>

                <div className="space-y-3">
                  <h3 className="text-base font-serif font-bold text-[#0B1B2A] group-hover:text-[#D4A737] transition-colors duration-300">
                    {feat.title}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {feat.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
