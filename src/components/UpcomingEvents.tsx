import React from 'react';
import { upcomingEventsData } from '../data';
import { Calendar, MapPin, Clock, Users, ArrowRight } from 'lucide-react';

interface UpcomingEventsProps {
  onOpenEvent: (id: string) => void;
}

export default function UpcomingEvents({ onOpenEvent }: UpcomingEventsProps) {
  return (
    <section id="events" className="py-24 bg-[#F5F7FA] relative overflow-hidden border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-20">
          <span className="text-[#D4A737] text-xs font-semibold tracking-widest uppercase block">
            SEASON SCHEDULE
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-medium text-[#0B1B2A] tracking-tight">
            Upcoming Showcases & Elite Convenings
          </h2>
          <div className="w-12 h-[2.5px] bg-[#D4A737] mx-auto" />
          <p className="text-sm text-slate-500 max-w-xl mx-auto font-light">
            Review our public showcases and private industry seminars. Reserve passes or request direct press credentials.
          </p>
        </div>

        {/* Schedule Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {upcomingEventsData.map((evt) => (
            <div
              key={evt.id}
              onClick={() => onOpenEvent(evt.id)}
              className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl border border-slate-100 transition-all duration-300 flex flex-col justify-between text-left group cursor-pointer"
            >
              {/* Cover Image & Date tag */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={evt.imageUrl}
                  alt={evt.title}
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 bg-white/95 border border-[#D4A737]/20 backdrop-blur-md px-3.5 py-1.5 rounded-2xl flex flex-col items-center shadow-sm">
                  <span className="text-xs font-bold text-[#0B1B2A] uppercase">
                    {evt.date.split(' ')[0]}
                  </span>
                  <span className="text-lg font-serif font-bold text-[#D4A737] leading-none mt-0.5">
                    {evt.date.split(' ')[1].replace(',', '')}
                  </span>
                </div>
                <div className="absolute top-4 right-4 bg-[#0B1B2A]/85 border border-slate-700/50 backdrop-blur-md px-2.5 py-1 rounded-xl text-[10px] font-bold uppercase tracking-wider text-slate-200">
                  {evt.category}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 md:p-8 flex-grow flex flex-col justify-between space-y-6">
                <div className="space-y-3">
                  <h3 className="text-lg font-serif font-semibold text-[#0B1B2A] group-hover:text-[#D4A737] transition-colors leading-snug">
                    {evt.title}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed font-light">
                    {evt.description}
                  </p>
                </div>

                {/* Logistics details */}
                <div className="pt-4 border-t border-slate-100/80 space-y-2.5 text-xs text-slate-500">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#D4A737]" />
                    <span>{evt.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#D4A737]" />
                    <span>{evt.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-[#D4A737]" />
                    <span className="font-semibold text-[#0B1B2A]">{evt.availableSeats} Passes Remaining</span>
                  </div>
                </div>
              </div>

              {/* Registration Trigger */}
              <div className="p-6 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[10px] text-slate-400 font-medium">Pre-registration required.</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenEvent(evt.id);
                  }}
                  className="px-5 py-2.5 rounded-full bg-[#0B1B2A] hover:bg-[#D4A737] hover:text-[#0B1B2A] text-white transition-all text-[11px] font-bold uppercase tracking-wider flex items-center gap-1 group/btn"
                >
                  <span>Request Pass</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
