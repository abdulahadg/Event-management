import React from 'react';
import { motion } from 'motion/react';
import { Compass, Target, Eye, Quote } from 'lucide-react';

export default function About() {
  return (
    <section id="about" className="py-24 bg-white relative overflow-hidden">
      {/* Decorative Gold Accents */}
      <div className="absolute top-1/2 left-0 w-64 h-64 bg-[#D4A737]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* Left Column: Story, Mission & Vision (7 Cols) */}
          <div className="lg:col-span-6 space-y-10">
            
            {/* Header Badge & Title */}
            <div className="space-y-4">
              <span className="text-[#D4A737] text-xs font-semibold tracking-widest uppercase block">
                MEET AURA GLOBAL
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif font-medium text-[#0B1B2A] tracking-tight">
                Crafting Legacies through Experiential Excellence
              </h2>
              <div className="w-12 h-[2px] bg-[#D4A737]" />
            </div>

            {/* Narrative Story */}
            <div className="space-y-6 text-slate-600 leading-relaxed text-sm">
              <p>
                Founded in the heart of Mayfair, London, AURA was born from a simple yet ambitious goal: to replace cookie-cutter production templates with spectacular, tailored architectural experiences. We serve discerning brands and private patrons who recognize that an event is not just a gathering, but a physical extension of their story.
              </p>
              <p>
                Today, our award-winning directors and in-house spatial designers guide clients through every stage of development. From managing private estate transformations in the Cotswolds to coordinating complex technical conferences inside The Shard, AURA brings Swiss-clockwork logistics combined with high-fashion artistic vision.
              </p>
            </div>

            {/* Mission & Vision Bento Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
              {/* Mission Card */}
              <div className="p-6 rounded-2xl bg-[#FAFBFD] border border-slate-100 hover:border-[#D4A737]/20 transition-all duration-300">
                <div className="p-3 rounded-xl bg-white w-fit text-[#D4A737] shadow-sm mb-4">
                  <Target className="w-5 h-5" />
                </div>
                <h4 className="text-base font-serif font-semibold text-[#0B1B2A] mb-2">Our Mission</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  To turn ambitious spatial concepts into flawless global realities, elevating shared human connections through sophisticated design.
                </p>
              </div>

              {/* Vision Card */}
              <div className="p-6 rounded-2xl bg-[#FAFBFD] border border-slate-100 hover:border-[#D4A737]/20 transition-all duration-300">
                <div className="p-3 rounded-xl bg-white w-fit text-[#D4A737] shadow-sm mb-4">
                  <Eye className="w-5 h-5" />
                </div>
                <h4 className="text-base font-serif font-semibold text-[#0B1B2A] mb-2">Our Vision</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  To lead the global prestige sector by designing sustainable, highly secure, and emotionally resonant milestones across five continents.
                </p>
              </div>
            </div>

            {/* Quote Block */}
            <div className="p-6 rounded-2xl bg-[#0B1B2A] text-white relative overflow-hidden">
              <Quote className="absolute -right-4 -bottom-4 w-24 h-24 text-slate-800/40 opacity-20 pointer-events-none" />
              <p className="font-serif italic text-sm leading-relaxed mb-4 relative z-10 text-slate-300">
                "An extraordinary event lives forever in the memory of those who attended. Detail is not just a technical parameter; detail is the ultimate form of respect."
              </p>
              <div className="text-xs">
                <span className="font-semibold text-white block">Alistair Sterling</span>
                <span className="text-[#D4A737]">Founder & Creative Director</span>
              </div>
            </div>

          </div>

          {/* Right Column: Elegant Image Composition (6 Cols) */}
          <div className="lg:col-span-6 relative h-[520px] w-full flex items-center justify-center">
            
            {/* Background geometric mesh shadow */}
            <div className="absolute inset-0 bg-slate-50 rounded-[40px] border border-slate-100 transform -rotate-2" />

            {/* Overlapping Main Image */}
            <motion.div
              whileHover={{ y: -5 }}
              className="absolute top-8 left-8 w-[65%] h-[75%] rounded-[24px] overflow-hidden shadow-xl z-10 border-4 border-white"
            >
              <img
                src="https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=800&auto=format&fit=crop"
                alt="AURA Corporate Summit Staging"
                className="w-full h-full object-cover"
              />
            </motion.div>

            {/* Overlapping Secondary Image */}
            <motion.div
              whileHover={{ y: -5 }}
              className="absolute bottom-8 right-8 w-[60%] h-[60%] rounded-[24px] overflow-hidden shadow-2xl z-20 border-4 border-white"
            >
              <img
                src="https://images.unsplash.com/photo-1519225495810-7512c696505a?q=80&w=800&auto=format&fit=crop"
                alt="AURA Dining Tablescapes"
                className="w-full h-full object-cover"
              />
            </motion.div>

            {/* Gold highlight line ornament */}
            <div className="absolute -bottom-2 left-1/4 w-1/2 h-1 bg-gradient-to-r from-transparent via-[#D4A737] to-transparent z-30" />
          </div>

        </div>
      </div>
    </section>
  );
}
