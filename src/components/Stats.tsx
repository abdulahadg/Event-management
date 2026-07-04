import React, { useState, useEffect } from 'react';
import { Award, Heart, Shield, Clock } from 'lucide-react';

export default function Stats() {
  const [events, setEvents] = useState(0);
  const [clients, setClients] = useState(0);
  const [years, setYears] = useState(0);
  const [satisfaction, setSatisfaction] = useState(0);

  useEffect(() => {
    // Dynamic countdown/up trigger for simulated high-fidelity counters
    const duration = 1500; // ms
    const stepTime = 30; // ms
    const steps = duration / stepTime;

    const eventsTarget = 500;
    const clientsTarget = 250;
    const yearsTarget = 15;
    const satisfactionTarget = 98;

    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      
      setEvents(Math.min(Math.floor((eventsTarget / steps) * currentStep), eventsTarget));
      setClients(Math.min(Math.floor((clientsTarget / steps) * currentStep), clientsTarget));
      setYears(Math.min(Math.floor((yearsTarget / steps) * currentStep), yearsTarget));
      setSatisfaction(Math.min(Math.floor((satisfactionTarget / steps) * currentStep), satisfactionTarget));

      if (currentStep >= steps) {
        clearInterval(timer);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, []);

  const statsList = [
    {
      icon: Award,
      value: `${events}+`,
      label: 'Events Managed',
      subtext: 'Across 12 countries globally'
    },
    {
      icon: Heart,
      value: `${clients}+`,
      label: 'Happy Clients',
      subtext: 'Sovereigns, tech leaders & creators'
    },
    {
      icon: Clock,
      value: `${years}+`,
      label: 'Years Experience',
      subtext: 'Orchestrating high-end design'
    },
    {
      icon: Shield,
      value: `${satisfaction}%`,
      label: 'Satisfaction Rate',
      subtext: 'Bespoke precision audits'
    }
  ];

  return (
    <section id="stats" className="py-20 bg-[#0B1B2A] text-white relative overflow-hidden">
      {/* Soft gradient blur spheres */}
      <div className="absolute top-1/2 left-0 w-80 h-80 bg-[#D4A737]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/4 right-0 w-80 h-80 bg-blue-900/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {statsList.map((stat, i) => {
            const IconComponent = stat.icon;
            return (
              <div
                key={i}
                className="p-8 rounded-3xl bg-slate-900/40 border border-slate-800 hover:border-[#D4A737]/30 transition-all duration-300 text-left group"
              >
                {/* Gold glowing icon block */}
                <div className="p-3.5 rounded-2xl bg-slate-800/80 text-[#D4A737] group-hover:bg-[#D4A737] group-hover:text-[#0B1B2A] w-fit shadow-sm transition-all duration-300 mb-6">
                  <IconComponent className="w-5 h-5" />
                </div>

                <div className="space-y-2">
                  <h3 className="text-4xl md:text-5xl font-serif font-semibold text-[#D4A737] tracking-tight">
                    {stat.value}
                  </h3>
                  <div>
                    <span className="text-sm font-semibold text-white block uppercase tracking-wider">
                      {stat.label}
                    </span>
                    <span className="text-xs text-slate-400 block mt-1 leading-relaxed">
                      {stat.subtext}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
