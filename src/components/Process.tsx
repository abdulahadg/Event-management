import React, { useState } from 'react';
import { processSteps } from '../data';
import { motion } from 'motion/react';
import { Compass, FileText, Palette, Hammer, Star } from 'lucide-react';

export default function Process() {
  const [activeStep, setActiveStep] = useState(0);

  // Map step index to high-fidelity icons
  const stepIcons = [
    Compass,   // Step 1: Consultation
    FileText,  // Step 2: Planning
    Palette,   // Step 3: Design
    Hammer,    // Step 4: Execution
    Star       // Step 5: Successful Event
  ];

  return (
    <section id="process" className="py-24 bg-[#F5F7FA] relative overflow-hidden border-t border-slate-100">
      {/* Visual glowing backdrop */}
      <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-[#D4A737]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-20">
          <span className="text-[#D4A737] text-xs font-semibold tracking-widest uppercase block">
            HOW WE ORCHESTRATE
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-medium text-[#0B1B2A] tracking-tight">
            The Architectural Path to Flawless Realization
          </h2>
          <div className="w-12 h-[2.5px] bg-[#D4A737] mx-auto" />
          <p className="text-sm text-slate-500 max-w-xl mx-auto">
            From initial creative drafts to on-site technical cues, we follow a rigorous, proven methodology to keep your milestone stress-free.
          </p>
        </div>

        {/* Desktop Horizontal Timeline (Visible on large screens) */}
        <div className="hidden lg:block relative mb-16">
          {/* Horizontal Connection Line */}
          <div className="absolute top-1/2 left-[5%] right-[5%] h-[2px] bg-slate-200 -translate-y-1/2 z-0" />
          
          {/* Progress fill animation based on selection */}
          <div 
            className="absolute top-1/2 left-[5%] h-[2.5px] bg-[#D4A737] -translate-y-1/2 z-0 transition-all duration-500"
            style={{ width: `${(activeStep / (processSteps.length - 1)) * 90}%` }}
          />

          <div className="relative z-10 grid grid-cols-5 gap-4">
            {processSteps.map((step, index) => {
              const IconComponent = stepIcons[index];
              const isActive = activeStep === index;
              const isPast = index < activeStep;

              return (
                <div
                  key={step.step}
                  onClick={() => setActiveStep(index)}
                  className="flex flex-col items-center cursor-pointer group"
                >
                  {/* Step Bubble Indicator */}
                  <div
                    className={`w-14 h-14 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                      isActive
                        ? 'bg-[#0B1B2A] border-[#D4A737] text-white scale-110 shadow-lg shadow-[#D4A737]/10'
                        : isPast
                        ? 'bg-[#D4A737] border-[#D4A737] text-white'
                        : 'bg-white border-slate-200 text-slate-400 hover:border-slate-300'
                    }`}
                  >
                    <IconComponent className="w-5 h-5" />
                  </div>

                  {/* Title & Step Identifier */}
                  <span className="text-[10px] font-bold text-[#D4A737] uppercase tracking-widest mt-4">
                    Step {step.step}
                  </span>
                  <h3 className={`text-base font-serif font-semibold mt-1 transition-colors ${isActive ? 'text-[#0B1B2A]' : 'text-slate-500 group-hover:text-slate-800'}`}>
                    {step.title}
                  </h3>
                </div>
              );
            })}
          </div>
        </div>

        {/* Interactive Active Card Detail (Desktop) */}
        <div className="hidden lg:block bg-white rounded-3xl p-8 border border-slate-100 shadow-sm max-w-4xl mx-auto text-left relative overflow-hidden">
          {/* Subtle watermarked step numeral */}
          <span className="absolute right-8 bottom-4 text-8xl font-serif font-extrabold text-slate-50 select-none">
            {processSteps[activeStep].step}
          </span>
          
          <div className="relative z-10 flex gap-6 items-start">
            <div className="p-4 rounded-2xl bg-[#FAFBFD] text-[#D4A737] border border-slate-100 flex-shrink-0">
              {React.createElement(stepIcons[activeStep], { className: 'w-8 h-8' })}
            </div>
            
            <div className="space-y-3 max-w-2xl">
              <span className="text-[11px] font-bold text-[#D4A737] uppercase tracking-widest block">ACTIVE DEPARTMENT STAGE</span>
              <h4 className="text-xl font-serif font-semibold text-[#0B1B2A]">
                Phase {processSteps[activeStep].step}: {processSteps[activeStep].title}
              </h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                {processSteps[activeStep].description}
              </p>
            </div>
          </div>
        </div>

        {/* Mobile Vertical Timeline (Responsive) */}
        <div className="lg:hidden relative space-y-8 text-left max-w-md mx-auto">
          {/* Vertical connection line */}
          <div className="absolute top-4 bottom-4 left-7 w-[2px] bg-slate-200 z-0" />

          {processSteps.map((step, index) => {
            const IconComponent = stepIcons[index];
            return (
              <div key={step.step} className="flex gap-4 relative z-10">
                {/* Bubble */}
                <div className="w-14 h-14 rounded-full bg-[#0B1B2A] text-[#D4A737] border-2 border-[#D4A737] flex items-center justify-center flex-shrink-0 shadow-md">
                  <IconComponent className="w-5 h-5" />
                </div>
                
                {/* Description Card */}
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex-grow">
                  <span className="text-[10px] font-bold text-[#D4A737] uppercase tracking-widest block mb-1">
                    Step {step.step}
                  </span>
                  <h4 className="text-base font-serif font-bold text-[#0B1B2A] mb-2">
                    {step.title}
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {step.description}
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
