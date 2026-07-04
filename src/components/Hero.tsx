import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, ArrowRight, Compass, Globe, ArrowUpRight, ShieldCheck, MapPin, Layers } from 'lucide-react';

interface HeroProps {
  onOpenConsultation: () => void;
  onExploreWork: () => void;
}

export default function Hero({ onOpenConsultation, onExploreWork }: HeroProps) {
  const [activeDivision, setActiveDivision] = useState<number>(0);

  const divisions = [
    {
      id: 0,
      title: "Corporate Summits",
      metric: "Fortune 500 Trusted",
      desc: "Impeccable execution for global corporate launches, keynote galas, and summit venues.",
      image: "https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=1000&auto=format&fit=crop"
    },
    {
      id: 1,
      title: "Luxury Weddings",
      metric: "Bespoke Estates Only",
      desc: "Exquisite couture styling, architectural floristry, and seamless orchestration in historic castles.",
      image: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1000&auto=format&fit=crop"
    },
    {
      id: 2,
      title: "Experiential Galas",
      metric: "Immersive Art Direction",
      desc: "Multi-sensory brand reveals, milestone banquets, and high-production spatial transformations.",
      image: "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?q=80&w=1000&auto=format&fit=crop"
    }
  ];

  return (
    <section
      id="home"
      className="relative min-h-screen pt-28 pb-16 flex items-center overflow-hidden bg-[#070D14] text-white"
    >
      {/* Structural Tech lines & Grid Overlays to represent Maps / architectural blueprinting */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:32px_32px] opacity-20 pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#D4A737]/20 to-transparent" />
      
      {/* Luxury Radial Glow Spheres */}
      <div className="absolute top-1/4 left-1/3 w-[600px] h-[600px] rounded-full bg-[#D4A737]/5 blur-[150px] pointer-events-none" />
      <div className="absolute -bottom-20 right-10 w-[400px] h-[400px] rounded-full bg-blue-900/10 blur-[130px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Side Content: Editorial Brief (7 Cols) */}
          <div className="lg:col-span-7 space-y-8 text-left">
            
            {/* Live Operations Indicator Badge */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-slate-900/80 border border-slate-800 backdrop-blur-md shadow-inner"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-slate-400 text-[11px] font-medium tracking-widest uppercase flex items-center gap-1.5">
                Mayfair HQ Desk Open <span className="text-[#D4A737]">•</span> London W1
              </span>
            </motion.div>

            {/* Headline with High-Luxury Contrast Typography */}
            <div className="space-y-4">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="text-4xl sm:text-5xl lg:text-6.5xl font-serif font-light leading-[1.1] tracking-tight"
              >
                Orchestrating <span className="font-serif italic text-[#D4A737] font-medium">Extraordinary</span> Spatials for Global Milestones.
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-sm sm:text-base text-slate-400 font-sans max-w-xl leading-relaxed font-light"
              >
                AURA is an award-winning British experiential production house. From historic Mayfair estates to remote private archipelagoes, we design and execute high-concept environments that unite physical precision with visual poetry.
              </motion.p>
            </div>

            {/* Custom Interactive Divisions Selector - The modern centerpiece */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="space-y-3 bg-slate-950/55 p-5 rounded-3xl border border-slate-900/80 backdrop-blur-sm max-w-2xl"
            >
              <div className="flex items-center justify-between border-b border-slate-900 pb-3">
                <span className="text-[10px] text-[#D4A737] font-semibold uppercase tracking-widest block">Signature Capabilities</span>
                <span className="text-[9px] text-slate-500 font-mono">SELECT A PORTFOLIO CORE</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {divisions.map((div, idx) => (
                  <button
                    key={div.id}
                    onClick={() => setActiveDivision(idx)}
                    className={`p-3 rounded-2xl transition-all text-left relative overflow-hidden group ${
                      activeDivision === idx
                        ? 'bg-gradient-to-br from-slate-900 to-[#121E2B] border border-[#D4A737]/30 shadow-md'
                        : 'bg-transparent hover:bg-slate-900/30 border border-transparent'
                    }`}
                  >
                    <span className={`block text-xs font-serif font-semibold transition-colors ${
                      activeDivision === idx ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'
                    }`}>
                      {div.title}
                    </span>
                    <span className="block text-[9px] text-[#D4A737] mt-0.5 tracking-wider uppercase font-mono opacity-80">
                      {div.metric.split(' ')[0]} {div.metric.split(' ').slice(1).join(' ')}
                    </span>
                  </button>
                ))}
              </div>
              <div className="pt-2 text-xs text-slate-400 leading-relaxed italic">
                "{divisions[activeDivision].desc}"
              </div>
            </motion.div>

            {/* Premium CTA Buttons Group */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2"
            >
              <button
                onClick={onOpenConsultation}
                className="px-8 py-4 rounded-2xl bg-[#D4A737] hover:bg-[#bfa22f] text-[#070D14] transition-all duration-300 font-bold tracking-wider text-xs uppercase shadow-lg shadow-[#D4A737]/15 flex items-center justify-center gap-2.5 group"
              >
                <span>Direct Concierge Intake</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button
                onClick={onExploreWork}
                className="px-8 py-4 rounded-2xl bg-transparent hover:bg-slate-900/40 text-white transition-all duration-300 font-bold tracking-wider text-xs uppercase border border-slate-800 hover:border-slate-700 flex items-center justify-center gap-2.5"
              >
                <span>Blueprint Portfolios</span>
                <ArrowUpRight className="w-4 h-4 text-[#D4A737]" />
              </button>
            </motion.div>

            {/* Blueprint Satellite Metadata line */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="pt-6 border-t border-slate-900/80 flex flex-wrap items-center justify-between gap-4 text-[10px] text-slate-500 font-mono"
            >
              <div className="flex items-center gap-2">
                <Compass className="w-3.5 h-3.5 text-[#D4A737] animate-spin-slow" />
                <span>COORDINATES: 51.5091° N, 0.1465° W</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-3.5 h-3.5 text-[#D4A737]" />
                <span>SECURE SATELLITE CONNECTION</span>
              </div>
            </motion.div>
          </div>

          {/* Right Side Visual Panel: Layered Architectural Frame (5 Cols) */}
          <div className="lg:col-span-5 relative h-[480px] sm:h-[550px] w-full flex items-center justify-center">
            
            {/* Outer Abstract Gold Bezel Ornament */}
            <div className="absolute w-[85%] h-[85%] rounded-[40px] border border-[#D4A737]/15 transform rotate-2 pointer-events-none" />
            
            {/* Main Central High-End Image Container */}
            <motion.div
              key={activeDivision}
              initial={{ opacity: 0, scale: 0.95, rotate: -1 }}
              animate={{ opacity: 1, scale: 1, rotate: -1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.6 }}
              className="absolute w-[80%] h-[80%] rounded-[32px] overflow-hidden shadow-2xl z-10 border border-slate-800/80"
            >
              <img
                src={divisions[activeDivision].image}
                alt={divisions[activeDivision].title}
                className="w-full h-full object-cover scale-105 hover:scale-100 transition-transform duration-[1200ms] ease-out"
              />
              {/* Luxury dark gradient blend overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#070D14] via-[#070D14]/20 to-transparent" />
              
              {/* Bottom detail card inside image */}
              <div className="absolute bottom-6 left-6 right-6 text-left">
                <span className="text-[9px] text-[#D4A737] uppercase tracking-widest font-mono font-bold block mb-1">Active Visual Track</span>
                <h4 className="text-base font-serif font-medium text-white">{divisions[activeDivision].title} Blueprint</h4>
              </div>
            </motion.div>

            {/* Overlapping Floating Blueprint Badge */}
            <motion.div
              initial={{ opacity: 0, x: -30, y: 30 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="absolute -bottom-2 -left-2 bg-[#0C1520]/95 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-slate-800/80 max-w-[190px] z-20 text-left"
            >
              <div className="flex items-center gap-2 mb-2 text-[#D4A737]">
                <Layers className="w-4 h-4" />
                <span className="text-[9px] uppercase font-bold tracking-wider font-mono">AURA DIVISION</span>
              </div>
              <p className="text-xs text-white font-medium mb-1 font-serif">Curated Masterplans</p>
              <span className="text-[9px] text-slate-500 leading-tight block">Customized staging blueprints compiled with physical site studies.</span>
            </motion.div>

            {/* Floating Trust Crest Badge */}
            <motion.div
              initial={{ opacity: 0, x: 30, y: -30 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="absolute -top-2 right-0 bg-[#0C1520]/90 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-slate-800/80 max-w-[160px] z-20 text-left"
            >
              <div className="flex items-center gap-1.5 text-emerald-400 text-[9px] uppercase font-bold tracking-widest mb-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>ISO 9001</span>
              </div>
              <p className="text-[10px] text-slate-300 font-light leading-snug">Mayfair Elite Certified Experiential Partner.</p>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
