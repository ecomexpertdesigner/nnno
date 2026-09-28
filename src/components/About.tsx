import React from 'react';
import { LazyImage } from './LazyImage.tsx';
import { ArrowRight, Film, ShieldCheck, Zap } from 'lucide-react';
import aboutImage from '../assets/images/regenerated_image_1790333933779.png';

interface AboutProps {
  onOpenTeam: () => void;
  onOpenInquiry: () => void;
}

export const About: React.FC<AboutProps> = ({ onOpenTeam, onOpenInquiry }) => {
  return (
    <section id="about" className="relative py-24 md:py-32 scroll-mt-20">
      <div className="max-w-[1360px] mx-auto px-5 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Cinematic Production Environment Image */}
          <div className="lg:col-span-6 relative">
            {/* Ambient background glow */}
            <div
              className="absolute -inset-4 bg-gradient-to-tr from-[#7C00FF]/25 to-transparent blur-3xl -z-10 rounded-2xl"
              aria-hidden="true"
            />

            <div className="relative rounded-2xl overflow-hidden border border-zinc-800 bg-[#0C0D12] group shadow-2xl">
              {/* Corner Viewfinder Accents */}
              <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-[#A855F7] z-10" />
              <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-[#A855F7] z-10" />
              <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-[#A855F7] z-10" />
              <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-[#A855F7] z-10" />

              <div className="aspect-[4/3] w-full overflow-hidden">
                <LazyImage
                  src={aboutImage}
                  alt="WG Media Production film production set with director and camera crew"
                  wrapperClassName="w-full h-full"
                  className="w-full h-full object-cover object-center transform transition-transform duration-700 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Bottom In-Image Badge */}
              <div className="p-4 bg-[#080A0F]/90 backdrop-blur-md border-t border-zinc-800/80 flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-2 text-zinc-300">
                  <Film className="w-4 h-4 text-[#A855F7]" />
                  <span>On-Set Operations & Studio Lab</span>
                </div>
                <span className="text-[#C084FC]">Est. 2021</span>
              </div>
            </div>
          </div>

          {/* Right Column: Editorial Copy */}
          <div className="lg:col-span-6 flex flex-col items-start">
            <span className="text-xs font-mono uppercase tracking-widest text-[#A855F7] mb-3">
              WHO WE ARE
            </span>

            <div className="flex items-stretch gap-4 mb-6">
              {/* Decorative Violet Vertical Line */}
              <div className="w-1.5 bg-gradient-to-b from-[#7C00FF] via-[#8B2CFF] to-transparent rounded-full shrink-0" />
              
              <h2 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-[46px] leading-[1.1] text-[#F5F5F7] tracking-tight">
                Creative minds. <br />
                Cinematic results.
              </h2>
            </div>

            <p className="text-base sm:text-lg text-zinc-300 font-light leading-relaxed mb-5">
              WG MEDIA PRODUCTION is a creative production and post-production agency focused on turning ideas into visual experiences that people remember.
            </p>

            <p className="text-sm sm:text-base text-zinc-400 font-light leading-relaxed mb-8">
              We partner with forward-thinking commercial brands, direct-to-consumer disruptors, and ambitious digital creators to produce visual content engineered for high retention and memorable brand recall across modern digital platforms.
            </p>

            {/* Value Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full mb-8 pt-4 border-t border-zinc-900">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-zinc-900/90 border border-zinc-800 text-[#A855F7]">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">Retention-Driven Pacing</h4>
                  <p className="text-xs text-zinc-400 mt-0.5">Every cut is engineered to keep attention locked.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-zinc-900/90 border border-zinc-800 text-[#A855F7]">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">Broadcast Grade</h4>
                  <p className="text-xs text-zinc-400 mt-0.5">Full color gamut compliance and high-fidelity sound.</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={onOpenTeam}
                className="group inline-flex items-center gap-2.5 px-6 py-3 rounded-xl text-sm font-semibold text-white bg-zinc-900 border border-zinc-700/80 hover:border-[#8B2CFF] hover:bg-zinc-800 transition-all duration-300"
              >
                <span>Meet the Team</span>
                <ArrowRight className="w-4 h-4 text-[#A855F7] transition-transform duration-300 group-hover:translate-x-1" />
              </button>

              <button
                onClick={onOpenInquiry}
                className="inline-flex items-center gap-1.5 px-4 py-3 text-sm text-zinc-400 hover:text-white transition-colors"
              >
                <span>Let's talk about your project →</span>
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
