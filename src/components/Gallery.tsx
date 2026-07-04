import React, { useState } from 'react';
import { galleryData } from '../data';
import { motion, AnimatePresence } from 'motion/react';
import { X, Search, Maximize2 } from 'lucide-react';

export default function Gallery() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  const categories = ['All', 'Corporate', 'Wedding', 'Birthday', 'Festival', 'Luxury Events'];

  const filteredGallery = galleryData.filter((item) => {
    if (selectedCategory === 'All') return true;
    return item.category === selectedCategory;
  });

  return (
    <section id="gallery" className="py-24 bg-white relative overflow-hidden border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-6 mb-16">
          <div className="space-y-4 text-left max-w-2xl">
            <span className="text-[#D4A737] text-xs font-semibold tracking-widest uppercase block">
              VISUAL JOURNAL
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-medium text-[#0B1B2A] tracking-tight">
              A Photographic Blueprint of Sophistication
            </h2>
            <div className="w-12 h-[2.5px] bg-[#D4A737]" />
          </div>
          <p className="text-sm text-slate-500 max-w-xs text-left leading-relaxed">
            Take a visual tour through our historic setups. Click on any thumbnail to engage the light magnifier.
          </p>
        </div>

        {/* Gallery Categories */}
        <div className="flex justify-start flex-wrap gap-2 mb-12 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 flex-shrink-0 ${
                selectedCategory === cat
                  ? 'bg-[#0B1B2A] text-white shadow-md'
                  : 'bg-[#FAFBFD] hover:bg-slate-100 text-slate-600 border border-slate-200/50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Masonry Columns Layout */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
          <AnimatePresence mode="popLayout">
            {filteredGallery.map((item) => (
              <motion.div
                layout
                key={item.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                onClick={() => setLightboxImage(item.imageUrl)}
                className="relative rounded-3xl overflow-hidden shadow-sm hover:shadow-lg cursor-pointer group break-inside-avoid border border-slate-100"
              >
                <img
                  src={item.imageUrl}
                  alt={item.caption}
                  className="w-full h-auto object-cover group-hover:scale-103 transition-transform duration-500"
                />

                {/* Cover Overlay on Hover */}
                <div className="absolute inset-0 bg-[#0B1B2A]/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6 text-left" />

                {/* Text and actions */}
                <div className="absolute inset-0 p-6 flex flex-col justify-between text-left z-10">
                  <div className="flex justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="p-2 rounded-xl bg-white/20 text-white backdrop-blur-xs">
                      <Maximize2 className="w-4 h-4" />
                    </div>
                  </div>
                  
                  <div className="opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                    <span className="text-[10px] text-[#D4A737] uppercase tracking-widest font-bold block mb-1">
                      {item.category}
                    </span>
                    <h4 className="text-sm font-serif font-semibold text-white">
                      {item.caption}
                    </h4>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Lightbox Modal */}
        <AnimatePresence>
          {lightboxImage && (
            <div id="lightbox-overlay" className="fixed inset-0 z-50 flex items-center justify-center p-4">
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setLightboxImage(null)}
                className="fixed inset-0 bg-black/95"
              />

              {/* Close Button */}
              <button
                onClick={() => setLightboxImage(null)}
                className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-20"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Box container */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative max-w-4xl max-h-[85vh] overflow-hidden rounded-2xl z-10 border border-white/10"
              >
                <img
                  src={lightboxImage}
                  alt="Enlarged Showcase asset"
                  className="w-full h-auto max-h-[85vh] object-contain"
                />
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}
