import React from 'react';
import { LazyImage } from './LazyImage.tsx';
import {
  ArrowRight,
  Film,
  Sparkles,
  CheckCircle2,
  Scissors,
  Layers,
  Volume2,
  Share2,
  Video,
  Palette,
} from 'lucide-react';
import { motion } from 'framer-motion';
import heroImage from '../assets/images/regenerated_image_1790333938499.png';

interface HeroProps {
  onOpenInquiry: () => void;
  onExploreWork: () => void;
}

const HeroImageCard: React.FC = () => {
  return (
    <div className="relative w-full max-w-[360px] sm:max-w-[420px] lg:max-w-[460px] px-2 sm:px-0">
      {/* Ambient Violet Radial Glow Behind Image */}
      <div
        className="absolute -inset-4 bg-gradient-to-tr from-[#7C00FF]/35 to-[#8B2CFF]/20 blur-3xl -z-10 rounded-2xl"
        aria-hidden="true"
      />

      {/* Orbiting Agency Service Elements Around the Outside of the Card */}
      {/* 1. Top Center-Left: Video Editing */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{
          opacity: 1,
          y: [0, -6, 0],
        }}
        transition={{
          opacity: { duration: 0.6, delay: 0.1 },
          y: { duration: 4.5, repeat: Infinity, ease: 'easeInOut' },
        }}
        className="absolute -top-4 sm:-top-5 left-3 sm:left-8 z-30 pointer-events-auto"
      >
        <div className="group flex items-center gap-1.5 sm:gap-2 px-2.5 py-1 sm:px-3.5 sm:py-2 rounded-xl bg-[#0B0D14]/90 backdrop-blur-md border border-[#8B2CFF]/30 hover:border-[#A855F7] shadow-[0_4px_20px_rgba(0,0,0,0.5),0_0_15px_rgba(124,0,255,0.2)] hover:shadow-[0_0_25px_rgba(168,85,247,0.4)] transition-all duration-300">
          <div className="w-4 h-4 sm:w-6 sm:h-6 rounded-lg bg-[#7C00FF]/20 border border-[#8B2CFF]/40 flex items-center justify-center text-[#C084FC] group-hover:scale-110 transition-transform">
            <Scissors className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5" />
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] sm:text-xs font-semibold tracking-wide text-zinc-100 group-hover:text-white">
              Video Editing
            </span>
          </div>
        </div>
      </motion.div>

      {/* 2. Top-Right: Sound Designing */}
      <motion.div
        initial={{ opacity: 0, x: 12 }}
        animate={{
          opacity: 1,
          y: [0, 6, 0],
        }}
        transition={{
          opacity: { duration: 0.6, delay: 0.2 },
          y: { duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 },
        }}
        className="absolute -top-3.5 sm:-top-4 -right-1 sm:-right-5 z-30 pointer-events-auto"
      >
        <div className="group flex items-center gap-1.5 sm:gap-2 px-2.5 py-1 sm:px-3.5 sm:py-2 rounded-xl bg-[#0B0D14]/90 backdrop-blur-md border border-[#8B2CFF]/30 hover:border-[#A855F7] shadow-[0_4px_20px_rgba(0,0,0,0.5),0_0_15px_rgba(124,0,255,0.2)] hover:shadow-[0_0_25px_rgba(168,85,247,0.4)] transition-all duration-300">
          <div className="w-4 h-4 sm:w-6 sm:h-6 rounded-lg bg-[#7C00FF]/20 border border-[#8B2CFF]/40 flex items-center justify-center text-[#C084FC] group-hover:scale-110 transition-transform">
            <Volume2 className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5" />
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] sm:text-xs font-semibold tracking-wide text-zinc-100 group-hover:text-white">
              Sound Designing
            </span>
          </div>
        </div>
      </motion.div>

      {/* 3. Left Flank: Motion Graphics */}
      <motion.div
        initial={{ opacity: 0, x: -14 }}
        animate={{
          opacity: 1,
          y: [0, -7, 0],
        }}
        transition={{
          opacity: { duration: 0.6, delay: 0.3 },
          y: { duration: 5.2, repeat: Infinity, ease: 'easeInOut', delay: 1 },
        }}
        className="absolute top-1/3 -left-2 sm:-left-8 z-30 pointer-events-auto"
      >
        <div className="group flex items-center gap-1.5 sm:gap-2 px-2.5 py-1 sm:px-3.5 sm:py-2 rounded-xl bg-[#0B0D14]/90 backdrop-blur-md border border-[#8B2CFF]/30 hover:border-[#A855F7] shadow-[0_4px_20px_rgba(0,0,0,0.5),0_0_15px_rgba(124,0,255,0.2)] hover:shadow-[0_0_25px_rgba(168,85,247,0.4)] transition-all duration-300">
          <div className="w-4 h-4 sm:w-6 sm:h-6 rounded-lg bg-[#7C00FF]/20 border border-[#8B2CFF]/40 flex items-center justify-center text-[#C084FC] group-hover:scale-110 transition-transform">
            <Layers className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5" />
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] sm:text-xs font-semibold tracking-wide text-zinc-100 group-hover:text-white">
              Motion Graphics
            </span>
          </div>
        </div>
      </motion.div>

      {/* 4. Right Flank: Video Production */}
      <motion.div
        initial={{ opacity: 0, x: 14 }}
        animate={{
          opacity: 1,
          y: [0, 7, 0],
        }}
        transition={{
          opacity: { duration: 0.6, delay: 0.4 },
          y: { duration: 4.8, repeat: Infinity, ease: 'easeInOut', delay: 1.5 },
        }}
        className="absolute top-1/2 -right-2 sm:-right-8 z-30 pointer-events-auto"
      >
        <div className="group flex items-center gap-1.5 sm:gap-2 px-2.5 py-1 sm:px-3.5 sm:py-2 rounded-xl bg-[#0B0D14]/90 backdrop-blur-md border border-[#8B2CFF]/30 hover:border-[#A855F7] shadow-[0_4px_20px_rgba(0,0,0,0.5),0_0_15px_rgba(124,0,255,0.2)] hover:shadow-[0_0_25px_rgba(168,85,247,0.4)] transition-all duration-300">
          <div className="w-4 h-4 sm:w-6 sm:h-6 rounded-lg bg-[#7C00FF]/20 border border-[#8B2CFF]/40 flex items-center justify-center text-[#C084FC] group-hover:scale-110 transition-transform">
            <Video className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5" />
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] sm:text-xs font-semibold tracking-wide text-zinc-100 group-hover:text-white">
              Video Production
            </span>
          </div>
        </div>
      </motion.div>

      {/* 5. Bottom Center-Left: Social Media Marketing */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{
          opacity: 1,
          y: [0, -5, 0],
        }}
        transition={{
          opacity: { duration: 0.6, delay: 0.5 },
          y: { duration: 4.6, repeat: Infinity, ease: 'easeInOut', delay: 0.8 },
        }}
        className="absolute -bottom-3 sm:-bottom-4 left-2 sm:left-6 z-30 pointer-events-auto"
      >
        <div className="group flex items-center gap-1.5 sm:gap-2 px-2.5 py-1 sm:px-3.5 sm:py-2 rounded-xl bg-[#0B0D14]/90 backdrop-blur-md border border-[#8B2CFF]/30 hover:border-[#A855F7] shadow-[0_4px_20px_rgba(0,0,0,0.5),0_0_15px_rgba(124,0,255,0.2)] hover:shadow-[0_0_25px_rgba(168,85,247,0.4)] transition-all duration-300">
          <div className="w-4 h-4 sm:w-6 sm:h-6 rounded-lg bg-[#7C00FF]/20 border border-[#8B2CFF]/40 flex items-center justify-center text-[#C084FC] group-hover:scale-110 transition-transform">
            <Share2 className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5" />
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] sm:text-xs font-semibold tracking-wide text-zinc-100 group-hover:text-white">
              Social Media Marketing
            </span>
          </div>
        </div>
      </motion.div>

      {/* Framing Box with Cinematic Geometric Lines */}
      <div className="relative w-full rounded-2xl p-1 bg-gradient-to-b from-zinc-700/40 via-zinc-800/20 to-transparent backdrop-blur-sm">
        
        {/* Corner Viewfinder Camera Brackets */}
        <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-[#A855F7] z-20" />
        <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-[#A855F7] z-20" />
        <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-[#A855F7] z-20" />
        <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-[#A855F7] z-20" />

        {/* Main Image Container */}
        <div className="relative overflow-hidden rounded-xl aspect-[3/4] bg-[#0C0D12] border border-zinc-800/80 group">
          <LazyImage
            src={heroImage}
            alt="WG Media Production Director framing shot on cinema camera rig"
            wrapperClassName="w-full h-full"
            className="w-full h-full object-cover object-center transform transition-transform duration-700 group-hover:scale-105"
            referrerPolicy="no-referrer"
            priority={true}
          />

          {/* Subtle dark bottom scrim for seamless integration */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#050609] via-transparent to-black/20 pointer-events-none" />

          {/* Floating Studio Badge Overlay */}
          <div className="absolute bottom-4 left-4 right-4 sm:left-6 sm:right-6 py-2 px-3.5 rounded-lg bg-[#080A0F]/85 backdrop-blur-md border border-zinc-800/90 shadow-xl flex items-center justify-center gap-2.5">
            <div className="w-1.5 h-1.5 rounded-full bg-[#8B2CFF] shadow-[0_0_6px_#8B2CFF] shrink-0" />
            <span className="text-[10px] sm:text-xs font-mono font-semibold tracking-wider text-zinc-200 uppercase whitespace-nowrap">
              VIDEO EDITING • MOTION • SOUND
            </span>
          </div>
        </div>

        {/* Decorative Geometric Ambient Lines */}
        <div className="absolute -right-4 -bottom-4 w-24 h-24 border border-zinc-800/60 rounded-xl pointer-events-none -z-10" />
      </div>
    </div>
  );
};

export const Hero: React.FC<HeroProps> = ({ onOpenInquiry, onExploreWork }) => {
  return (
    <section
      id="home"
      className="relative min-h-[92vh] md:min-h-screen flex items-center pt-24 md:pt-28 pb-16 overflow-hidden"
    >
      {/* Background Cinematic Radial Lighting */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-gradient-to-tr from-[#7C00FF]/15 via-[#8B2CFF]/10 to-transparent blur-[140px] pointer-events-none rounded-full"
        aria-hidden="true"
      />
      <div
        className="absolute -top-32 right-10 w-[450px] h-[450px] bg-[#8B2CFF]/12 blur-[130px] pointer-events-none rounded-full"
        aria-hidden="true"
      />

      {/* Subtle Grid Texture Lines */}
      <div
        className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)] pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative w-full max-w-[1360px] mx-auto px-5 sm:px-8 lg:px-12 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Expressive Copy & CTAs */}
          <div className="lg:col-span-7 flex flex-col items-start z-20 gap-y-6 md:gap-y-0">
            {/* Eyebrow */}
            <div className="order-1 inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-zinc-900/90 border border-zinc-800 text-[11px] font-mono tracking-[0.2em] text-[#C084FC] uppercase mb-6 backdrop-blur-md">
              <span className="w-1.5 h-1.5 rounded-full bg-[#A855F7] animate-pulse" />
              <span>CREATIVE MEDIA AGENCY</span>
            </div>

            {/* Giant Display Headline */}
            <h1 className="order-2 font-display font-black text-[46px] sm:text-[64px] md:text-[78px] lg:text-[88px] leading-[1.08] sm:leading-[0.94] tracking-[-0.035em] text-[#F5F5F7] mb-5 text-balance">
              WE TURN <br />
              IDEAS INTO <br />
              <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-[#A855F7] via-[#C084FC] to-[#E9D5FF] drop-shadow-[0_0_35px_rgba(168,85,247,0.45)]">
                VISUAL <br className="sm:hidden" /> IMPACT.
              </span>
            </h1>

            {/* Editorial Triad: Ideas -> Visuals -> Impact (Supporting description) */}
            <div className="order-3 flex items-center gap-3 text-xs sm:text-sm font-mono tracking-wider text-zinc-300 mb-6">
              <span className="font-semibold text-white">Ideas</span>
              <span className="text-[#A855F7] font-bold">→</span>
              <span className="font-semibold text-white">Visuals</span>
              <span className="text-[#A855F7] font-bold">→</span>
              <span className="font-semibold text-white">Impact</span>
            </div>

            {/* Visual Image Card: On mobile (<768px), order-4 places it before the service description (order-5); on md+ it preserves desktop layout */}
            <div className="order-4 md:order-5 w-full my-8 sm:my-10 lg:hidden flex justify-center py-2">
              <HeroImageCard />
            </div>

            {/* Service-related short description: order-5 on mobile (<768px), md:order-4 on desktop/tablet */}
            <p className="order-5 md:order-4 max-w-xl text-base sm:text-lg text-zinc-300/90 font-normal leading-relaxed mb-6 lg:mb-8 text-left">
              Video editing, motion graphics and cinematic content built to make brands impossible to ignore.
            </p>

            {/* Dual CTAs */}
            <div className="order-6 flex flex-wrap items-center gap-4 sm:gap-5 mb-8 md:mb-10">
              {/* Primary Pill Button */}
              <button
                onClick={onExploreWork}
                className="group relative inline-flex items-center gap-3 px-7 py-3.5 rounded-full text-sm font-semibold tracking-wide text-white bg-zinc-950 border border-[#8B2CFF] shadow-[0_0_25px_rgba(139,44,255,0.3)] hover:shadow-[0_0_35px_rgba(168,85,247,0.55)] hover:border-[#A855F7] hover:scale-[1.02] transition-all duration-300"
              >
                <span>View Our Work</span>
                <ArrowRight className="w-4 h-4 text-[#A855F7] transition-transform duration-300 group-hover:translate-x-1.5" />
              </button>

              {/* Secondary Button */}
              <button
                onClick={onOpenInquiry}
                className="group inline-flex items-center gap-2 px-5 py-3.5 text-sm font-medium text-zinc-300 hover:text-white transition-colors duration-200 border-b border-transparent hover:border-[#8B2CFF]"
              >
                <span>Start a Project</span>
                <ArrowRight className="w-3.5 h-3.5 text-zinc-400 group-hover:text-[#A855F7] transition-transform duration-200 group-hover:translate-x-1" />
              </button>
            </div>

            {/* Trust Statement / Lower Description */}
            <div className="order-7 flex flex-wrap items-center gap-3 mb-6 md:mb-0 pt-0 md:pt-6 md:border-t md:border-zinc-800/70 text-xs text-zinc-400 font-medium">
              <div className="flex items-center gap-1.5 text-zinc-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#A855F7]" />
                <span>Built for brands, creators & businesses</span>
              </div>
              <span className="hidden sm:inline text-zinc-600">·</span>
              <span className="text-zinc-500">4K RAW · Fast Turnaround · Bespoke Audio</span>
            </div>
          </div>

          {/* Right Column: High-Impact Cinematic Visual Asset (Desktop Only: hidden on mobile, block on lg) */}
          <div className="hidden lg:flex lg:col-span-5 relative mt-6 lg:mt-0 justify-center lg:justify-end">
            <HeroImageCard />
          </div>

        </div>
      </div>
    </section>
  );
};
