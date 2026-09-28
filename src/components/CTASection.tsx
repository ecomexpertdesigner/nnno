import React from 'react';
import { ArrowRight, Sparkles, Mail, Phone } from 'lucide-react';

interface CTASectionProps {
  onOpenInquiry: () => void;
  onExploreWork: () => void;
}

export const CTASection: React.FC<CTASectionProps> = ({ onOpenInquiry, onExploreWork }) => {
  return (
    <section className="relative py-28 md:py-36 overflow-hidden bg-[#050609] border-t border-zinc-900">
      {/* Intense Center Violet Glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-gradient-to-tr from-[#7C00FF]/25 via-[#8B2CFF]/20 to-transparent blur-[160px] pointer-events-none rounded-full"
        aria-hidden="true"
      />

      {/* Cinematic Viewfinder Corner Overlays */}
      <div className="absolute top-8 left-8 sm:left-16 w-8 h-8 border-t-2 border-l-2 border-zinc-800/80 pointer-events-none" />
      <div className="absolute top-8 right-8 sm:right-16 w-8 h-8 border-t-2 border-r-2 border-zinc-800/80 pointer-events-none" />
      <div className="absolute bottom-8 left-8 sm:left-16 w-8 h-8 border-b-2 border-l-2 border-zinc-800/80 pointer-events-none" />
      <div className="absolute bottom-8 right-8 sm:right-16 w-8 h-8 border-b-2 border-r-2 border-zinc-800/80 pointer-events-none" />

      <div className="relative max-w-[1000px] mx-auto px-5 sm:px-8 text-center z-10">
        
        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900/90 border border-zinc-800 text-[11px] font-mono tracking-widest text-[#C084FC] uppercase mb-6">
          <Sparkles className="w-3 h-3 text-[#A855F7]" />
          <span>LET'S BUILD SOMETHING CINEMATIC</span>
        </div>

        {/* Large Centered Headline */}
        <h2 className="font-display font-black text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.05] tracking-tight text-[#F5F5F7] mb-6 text-balance">
          HAVE A STORY <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-100 to-[#C084FC]">
            WORTH TELLING?
          </span>
        </h2>

        {/* Subtitle */}
        <p className="max-w-xl mx-auto text-base sm:text-lg text-zinc-400 font-light leading-relaxed mb-10">
          Let's turn your next idea into something people remember. We work closely with our partners to create visuals that convert and captivate.
        </p>

        {/* Dual Actions */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
          {/* Primary Filled / Outlined Violet Button */}
          <button
            onClick={onOpenInquiry}
            className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-full text-sm font-semibold tracking-wide text-white bg-gradient-to-r from-[#7C00FF] via-[#8B2CFF] to-[#A855F7] shadow-[0_0_30px_rgba(139,44,255,0.45)] hover:shadow-[0_0_50px_rgba(168,85,247,0.7)] hover:scale-105 transition-all duration-300"
          >
            <span>Start a Project</span>
            <ArrowRight className="w-4 h-4 text-white transition-transform duration-300 group-hover:translate-x-1.5" />
          </button>

          {/* Secondary Action */}
          <button
            onClick={onExploreWork}
            className="inline-flex items-center gap-2 px-7 py-4 rounded-full text-sm font-medium text-zinc-300 bg-zinc-900/80 border border-zinc-800 hover:border-zinc-700 hover:text-white transition-all duration-200"
          >
            <span>View Our Work</span>
          </button>
        </div>

        {/* Direct Contact Bar */}
        <div className="mt-12 pt-8 border-t border-zinc-900/80 flex flex-wrap items-center justify-center gap-5 sm:gap-8 text-xs font-mono">
          <span className="text-zinc-500 uppercase tracking-widest text-[11px]">Direct Reach:</span>
          <a
            href="mailto:waleedghangla@gmail.com"
            className="inline-flex items-center gap-2 text-zinc-300 hover:text-[#C084FC] transition-colors group"
          >
            <Mail className="w-3.5 h-3.5 text-[#A855F7] group-hover:scale-110 transition-transform" />
            <span>waleedghangla@gmail.com</span>
          </a>
          <span className="hidden sm:inline text-zinc-700">·</span>
          <a
            href="tel:03327865342"
            className="inline-flex items-center gap-2 text-zinc-300 hover:text-[#C084FC] transition-colors group"
          >
            <Phone className="w-3.5 h-3.5 text-[#A855F7] group-hover:scale-110 transition-transform" />
            <span>03327865342</span>
          </a>
        </div>

        {/* Quiet footnote */}
        <div className="mt-6 text-xs font-mono text-zinc-500">
          Average production kickoff within 48 business hours.
        </div>

      </div>
    </section>
  );
};
