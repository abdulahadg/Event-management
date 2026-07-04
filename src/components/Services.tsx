import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { servicesData } from '../data';
import {
  Building2,
  Heart,
  Sparkles,
  Presentation,
  Trophy,
  Crown,
  Gift,
  Coins,
  Music,
  Palette,
  ArrowRight,
  Sparkle,
  Grid,
  CheckCircle2,
  Sliders,
  ChevronRight,
  Maximize2
} from 'lucide-react';

interface ServicesProps {
  onOpenService: (id: string) => void;
}

// Icon mapper mapping database string names to actual Lucide components
const iconMap: Record<string, React.ComponentType<any>> = {
  Building2,
  Heart,
  Sparkles,
  Presentation,
  Trophy,
  Crown,
  Gift,
  Coins,
  Music,
  Palette,
};

export default function Services({ onOpenService }: ServicesProps) {
  // Mode selection: 'explorer' (immersive split-pane) or 'grid' (aesthetic bento-grid)
  const [viewMode, setViewMode] = useState<'explorer' | 'grid'>('explorer');
  const [selectedCategory, setSelectedCategory] = useState<'All' | 'Corporate' | 'Private' | 'Luxury Events'>('All');
  
  // Active selected service in the Immersive Showcase view
  const [activeShowcaseId, setActiveShowcaseId] = useState<string>('corporate-events');

  const categories = ['All', 'Corporate', 'Private', 'Luxury Events'];

  // Handpicked services to feature in the main showcase explorer
  const showcaseServices = servicesData.filter(s => 
    ['corporate-events', 'weddings', 'product-launches', 'event-decoration'].includes(s.id)
  );

  const filteredServices = servicesData.filter((service) => {
    if (selectedCategory === 'All') return true;
    return service.category === selectedCategory;
  });

  // Safe icon renderer
  const renderIcon = (name: string, className: string) => {
    const IconComponent = iconMap[name] || Sparkles;
    return <IconComponent className={className} />;
  };

  // Custom luxury bullet-points for showcase items
  const getShowcaseHighlights = (id: string) => {
    switch (id) {
      case 'corporate-events':
        return [
          'Full-scale spatial design with 3D photorealistic renderings',
          'Precision flow management for board-level delegates',
          'Premium venue lease and custom security integrations'
        ];
      case 'weddings':
        return [
          'Exclusive historic castle and estate coordinates',
          'Michelin-partnered multi-sensory culinary curation',
          'Symphonic orchestra and fine talent coordination'
        ];
      case 'product-launches':
        return [
          'Bespoke stage architecture & technical direction',
          'Immersive projection mapping & kinetic light shows',
          'High-impact press and global media coordination'
        ];
      case 'event-decoration':
        return [
          'Direct-auction premium floristry from Aalsmeer vaults',
          'Bespoke tableware & fine Irish linen styling',
          'Calculated asymmetric shadow & sensory mood lighting'
        ];
      default:
        return [
          'Bespoke production coordination with key directors',
          'Tailored materials and direct supply line sourcing',
          'Dedicated on-site execution team managing operations'
        ];
    }
  };

  const activeShowcaseService = servicesData.find(s => s.id === activeShowcaseId) || servicesData[0];

  return (
    <section id="services" className="py-28 bg-[#F6F8FB] relative overflow-hidden">
      {/* Background Ornaments */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-b from-blue-100/20 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-t from-[#D4A737]/5 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="space-y-4 text-left">
            <span className="text-[#D4A737] text-xs font-bold tracking-[0.2em] uppercase block">
              OUR CAPABILITIES
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-light text-[#0B1B2A] tracking-tight leading-tight">
              Bespoke Spatial & <br className="hidden sm:inline" />
              <span className="font-serif italic font-medium text-[#D4A737]">Experiential</span> Architecture
            </h2>
            <div className="w-16 h-[2px] bg-[#D4A737]" />
          </div>
          
          <div className="flex flex-col gap-4 text-left max-w-md">
            <p className="text-sm text-slate-500 leading-relaxed font-light">
              AURA designs and produces elite physical moments. Toggle our viewing modes to explore our work through a cinematic interactive showcase or our comprehensive matrix.
            </p>
            
            {/* Interactive View Mode Switcher */}
            <div className="flex bg-white/80 p-1 rounded-2xl border border-slate-200/50 shadow-sm w-fit">
              <button
                onClick={() => setViewMode('explorer')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all duration-300 ${
                  viewMode === 'explorer'
                    ? 'bg-[#0B1B2A] text-white shadow-sm'
                    : 'text-slate-600 hover:text-[#0B1B2A]'
                }`}
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Showcase Explorer</span>
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all duration-300 ${
                  viewMode === 'grid'
                    ? 'bg-[#0B1B2A] text-white shadow-sm'
                    : 'text-slate-600 hover:text-[#0B1B2A]'
                }`}
              >
                <Grid className="w-3.5 h-3.5" />
                <span>Specialist Matrix</span>
              </button>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* VIEW 1: IMMERSIVE MOUNTED EXPLORER                       */}
        {/* ======================================================== */}
        {viewMode === 'explorer' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch mt-8 min-h-[550px]">
            
            {/* Left Frame: Immersive Cinematic Image Panel */}
            <div className="lg:col-span-7 relative rounded-[32px] overflow-hidden shadow-2xl border border-white/40 group flex flex-col justify-end min-h-[400px] lg:min-h-full">
              
              {/* Image Transition Stage */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeShowcaseService.id}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute inset-0 w-full h-full"
                >
                  <img
                    src={activeShowcaseService.imageUrl}
                    alt={activeShowcaseService.title}
                    className="w-full h-full object-cover"
                  />
                  {/* Deep Cinematic Overlay Vignette */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B1B2A] via-[#0B1B2A]/40 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#0B1B2A]/50 to-transparent pointer-events-none" />
                </motion.div>
              </AnimatePresence>

              {/* Dynamic Overlay Content inside the image frame */}
              <div className="relative z-10 p-8 sm:p-10 text-left space-y-6">
                
                {/* Floating Tag */}
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-white bg-[#D4A737] px-3.5 py-1 rounded-full font-bold uppercase tracking-widest font-mono shadow-md">
                    Signature Division
                  </span>
                  <span className="text-[10px] text-slate-300 font-mono uppercase tracking-wider">
                    {activeShowcaseService.category} Specialist Blueprint
                  </span>
                </div>

                <div className="space-y-3">
                  <h3 className="text-2xl sm:text-3xl md:text-4xl font-serif font-light text-white leading-tight">
                    {activeShowcaseService.title}
                  </h3>
                  <p className="text-slate-300 text-sm leading-relaxed font-light max-w-xl">
                    {activeShowcaseService.longDescription}
                  </p>
                </div>

                {/* Staggered Highlights list */}
                <div className="pt-4 border-t border-white/10 space-y-3">
                  <span className="text-[10px] font-bold text-[#D4A737] uppercase tracking-widest block font-mono">
                    Operational Blueprint Standards
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {getShowcaseHighlights(activeShowcaseService.id).map((highlight, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="flex items-start gap-2 text-xs text-slate-200"
                      >
                        <CheckCircle2 className="w-4 h-4 text-[#D4A737] shrink-0 mt-0.5" />
                        <span>{highlight}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Interactive CTA directly inside the Image Panel */}
                <div className="pt-4 flex flex-wrap gap-4 items-center">
                  <button
                    onClick={() => onOpenService(activeShowcaseService.id)}
                    className="px-6 py-3 bg-[#D4A737] hover:bg-white text-[#0B1B2A] rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-lg flex items-center gap-2 group/btn"
                  >
                    <span>Inspect Design Blueprints</span>
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                  <span className="text-[10px] text-slate-400 font-mono">CODE ID: {activeShowcaseService.id.toUpperCase()}</span>
                </div>

              </div>

            </div>

            {/* Right Panel: Interactive List Navigation (Tabs) */}
            <div className="lg:col-span-5 flex flex-col justify-between gap-4">
              <div className="space-y-4">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block text-left pl-1">
                  Select Core Sector
                </span>
                
                <div className="space-y-3">
                  {showcaseServices.map((service, idx) => {
                    const isActive = service.id === activeShowcaseId;
                    return (
                      <div
                        key={service.id}
                        onMouseEnter={() => setActiveShowcaseId(service.id)}
                        onClick={() => setActiveShowcaseId(service.id)}
                        className={`group relative p-6 rounded-2xl border text-left cursor-pointer transition-all duration-300 flex items-center justify-between ${
                          isActive
                            ? 'bg-white border-[#D4A737] shadow-lg'
                            : 'bg-white/40 hover:bg-white/80 border-slate-200/50 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex gap-4 items-center">
                          {/* Elegant serial indicator */}
                          <span className={`text-xl font-serif font-light transition-colors duration-300 ${
                            isActive ? 'text-[#D4A737]' : 'text-slate-300 group-hover:text-slate-400'
                          }`}>
                            0{idx + 1}
                          </span>

                          <div className="space-y-1">
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">
                              {service.category} Department
                            </span>
                            <h4 className={`font-serif font-semibold text-lg transition-colors duration-300 ${
                              isActive ? 'text-[#0B1B2A]' : 'text-slate-700'
                            }`}>
                              {service.title}
                            </h4>
                          </div>
                        </div>

                        {/* Icon and status indicator */}
                        <div className="flex items-center gap-3">
                          <div className={`p-3 rounded-xl transition-all duration-300 ${
                            isActive
                              ? 'bg-[#0B1B2A] text-[#D4A737]'
                              : 'bg-white text-slate-500 group-hover:text-[#0B1B2A]'
                          }`}>
                            {renderIcon(service.iconName, "w-5 h-5")}
                          </div>
                          <ChevronRight className={`w-4 h-4 text-[#D4A737] transition-all duration-300 ${
                            isActive ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'
                          }`} />
                        </div>

                        {/* Left edge dynamic active light bar */}
                        {isActive && (
                          <motion.div
                            layoutId="activeBar"
                            className="absolute left-0 top-1/4 bottom-1/4 w-[3.5px] bg-[#D4A737] rounded-r-full"
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Informative footer widget for the explorer view */}
              <div className="p-6 rounded-2xl bg-white border border-slate-200/50 shadow-xs text-left space-y-3">
                <div className="flex items-center gap-2">
                  <Sparkle className="w-4 h-4 text-[#D4A737]" />
                  <span className="text-xs font-bold text-[#0B1B2A] uppercase tracking-widest font-mono">
                    The AURA Curation Standard
                  </span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed font-light">
                  All signature departments are back-supported by our specialist logistics center in Central Mayfair, guaranteeing secure, end-to-end compliance and custom physical fabrications.
                </p>
              </div>

            </div>

          </div>
        )}

        {/* ======================================================== */}
        {/* VIEW 2: COMPREHENSIVE FILTERABLE SPECIALIST MATRIX        */}
        {/* ======================================================== */}
        {viewMode === 'grid' && (
          <div>
            {/* Filter Navigation Menu */}
            <div className="flex justify-center flex-wrap gap-2 mb-12">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat as any)}
                  className="relative px-6 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300"
                >
                  {selectedCategory === cat && (
                    <motion.div
                      layoutId="activeCatPill"
                      className="absolute inset-0 bg-[#0B1B2A] rounded-full shadow-md"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className={`relative z-10 transition-colors duration-300 ${
                    selectedCategory === cat
                      ? 'text-[#D4A737]'
                      : 'text-slate-600 hover:text-[#0B1B2A]'
                  }`}>
                    {cat}
                  </span>
                </button>
              ))}
            </div>

            {/* Matrix Bento Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <AnimatePresence mode="popLayout">
                {filteredServices.map((service, index) => (
                  <motion.div
                    layout
                    key={service.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4 }}
                    className="group bg-white rounded-[32px] overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl hover:border-[#D4A737]/30 transition-all duration-500 flex flex-col h-[350px] text-left relative cursor-pointer"
                    onClick={() => onOpenService(service.id)}
                  >
                    {/* Background Image Panel (Always present but transitions with high opacity) */}
                    <div className="absolute inset-0 w-full h-full overflow-hidden">
                      <img
                        src={service.imageUrl}
                        alt={service.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      {/* Smooth Backdrop shading overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0B1B2A]/95 via-[#0B1B2A]/75 to-[#0B1B2A]/40 transition-all duration-500" />
                    </div>

                    {/* Card Content Layer */}
                    <div className="relative z-10 p-8 flex flex-col justify-between h-full">
                      
                      {/* Top Row: Category badge & Icon */}
                      <div className="flex justify-between items-start">
                        <span className="text-[9px] font-bold text-[#D4A737] bg-white/10 backdrop-blur-md border border-white/10 px-3 py-1 rounded-full uppercase tracking-widest font-mono">
                          {service.category}
                        </span>
                        
                        <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-[#D4A737] group-hover:bg-[#D4A737] group-hover:text-white transition-all duration-300 shadow-sm">
                          {renderIcon(service.iconName, "w-5 h-5")}
                        </div>
                      </div>

                      {/* Bottom Info Blocks */}
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <h3 className="text-xl font-serif font-semibold text-white group-hover:text-[#D4A737] transition-colors duration-300 leading-snug">
                            {service.title}
                          </h3>
                          <p className="text-xs text-slate-300 leading-relaxed font-light line-clamp-2">
                            {service.description}
                          </p>
                        </div>

                        {/* Hidden parameters revealed on hover */}
                        <div className="h-0 group-hover:h-8 opacity-0 group-hover:opacity-100 overflow-hidden transition-all duration-300 pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                          <span>AURA DEPT ID: {service.id.toUpperCase().slice(0, 8)}</span>
                          <span className="text-[#D4A737] font-sans font-bold flex items-center gap-0.5">
                            Active Spec <Maximize2 className="w-2.5 h-2.5 ml-1" />
                          </span>
                        </div>

                        {/* Inline button */}
                        <div className="pt-2 flex items-center justify-between">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onOpenService(service.id);
                            }}
                            className="text-white group-hover:text-[#D4A737] text-xs font-semibold tracking-wider uppercase flex items-center gap-1.5 transition-colors"
                          >
                            <span>Discover Department</span>
                            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform text-[#D4A737]" />
                          </button>
                        </div>
                      </div>

                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
