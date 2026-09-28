import React from 'react';
import { Search, PenTool, SlidersHorizontal, CheckCircle2 } from 'lucide-react';

export const Process: React.FC = () => {
  const steps = [
    {
      num: '01',
      title: 'Discover',
      tagline: 'Strategy & Vision',
      description: 'We understand the brand, audience, goals and creative direction to formulate a cohesive visual thesis.',
      icon: Search,
    },
    {
      num: '02',
      title: 'Create',
      tagline: 'Production & Story',
      description: 'We develop the visual concept, direct the shoot, or organize raw footage into an intentional narrative arc.',
      icon: PenTool,
    },
    {
      num: '03',
      title: 'Refine',
      tagline: 'Precision Craft',
      description: 'Editing, motion graphics, sound design, color grading and finishing executed with meticulous frame-by-frame scrutiny.',
      icon: SlidersHorizontal,
    },
    {
      num: '04',
      title: 'Deliver',
      tagline: 'Omnichannel Launch',
      description: 'Final polished assets rendered and delivered in master quality, ready for broadcast, social algorithms, or cinema playback.',
      icon: CheckCircle2,
    },
  ];

  return (
    <section id="process" className="relative py-24 md:py-32 scroll-mt-20 border-t border-zinc-900 bg-[#080A0F]/60">
      <div className="max-w-[1360px] mx-auto px-5 sm:px-8 lg:px-12">
        
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto mb-20">
          <span className="text-xs font-mono uppercase tracking-widest text-[#A855F7] mb-3 block">
            HOW WE WORK
          </span>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl text-[#F5F5F7] tracking-tight">
            Simple Process. Serious Results.
          </h2>
          <p className="mt-3 text-sm sm:text-base text-zinc-400 font-light">
            A battle-tested production pipeline eliminating friction from concept to final export.
          </p>
        </div>

        {/* Timeline Container */}
        <div className="relative">
          {/* Desktop Connecting Line */}
          <div className="hidden lg:block absolute top-[42px] left-[6%] right-[6%] h-[2px] bg-zinc-800" />
          <div className="hidden lg:block absolute top-[42px] left-[6%] w-[68%] h-[2px] bg-gradient-to-r from-[#7C00FF] via-[#A855F7] to-zinc-800" />

          {/* Steps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6 relative z-10">
            {steps.map((step, idx) => {
              const Icon = step.icon;

              return (
                <div
                  key={step.num}
                  className="flex flex-col relative group p-6 rounded-2xl bg-[#0C0D12] border border-zinc-800/80 hover:border-[#8B2CFF]/60 hover:bg-[#10121A] transition-all duration-300"
                >
                  {/* Top Step Indicator & Number */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-center text-white group-hover:border-[#A855F7]/80 group-hover:text-[#A855F7] transition-colors duration-300 shadow-md">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="font-mono text-sm font-bold text-zinc-500 group-hover:text-[#A855F7] transition-colors">
                      {step.num}
                    </span>
                  </div>

                  {/* Step Title & Subtitle */}
                  <h3 className="font-display font-bold text-xl text-[#F5F5F7] mb-1">
                    {step.title}
                  </h3>
                  <span className="text-xs font-mono text-[#C084FC] uppercase tracking-wider mb-3">
                    {step.tagline}
                  </span>

                  {/* Body */}
                  <p className="text-sm text-zinc-400 font-light leading-relaxed">
                    {step.description}
                  </p>

                  {/* Ambient indicator dot */}
                  <div className="mt-6 flex items-center gap-2 text-[11px] font-mono text-zinc-500">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#8B2CFF]" />
                    <span>Phase {idx + 1} of 4</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};
