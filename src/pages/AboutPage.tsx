import React from 'react';
import { SERVICES, AGENCY_CONTACT } from '../data/content.ts';
import { LazyImage } from '../components/LazyImage.tsx';
import aboutImage from '../assets/images/regenerated_image_1790333933779.png';
import {
  Film,
  Zap,
  ShieldCheck,
  Sliders,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Layers,
  Camera,
  Monitor,
  Eye,
  Calendar,
  Globe,
  Award,
} from 'lucide-react';

interface AboutPageProps {
  onNavigate: (page: string) => void;
  onOpenInquiry: (service?: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate, onOpenInquiry }) => {
  return (
    <div className="pt-24 md:pt-32 pb-24 text-[#F5F5F7]">
      {/* Ambient background glows */}
      <div
        className="fixed top-1/4 left-1/4 w-[500px] h-[500px] bg-[#7C00FF]/10 blur-[160px] pointer-events-none rounded-full -z-10"
        aria-hidden="true"
      />
      <div
        className="fixed bottom-1/4 right-1/4 w-[400px] h-[400px] bg-[#8B2CFF]/10 blur-[150px] pointer-events-none rounded-full -z-10"
        aria-hidden="true"
      />

      <div className="max-w-[1360px] mx-auto px-5 sm:px-8 lg:px-12">
        {/* Page Hero Header */}
        <div className="max-w-3xl mb-16 md:mb-24">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900/90 border border-zinc-800 text-[11px] font-mono tracking-[0.2em] text-[#A855F7] uppercase mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#A855F7] animate-pulse" />
            <span>ABOUT WG MEDIA PRODUCTION</span>
          </div>

          <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl text-[#F5F5F7] tracking-tight leading-[1.05] mb-6">
            Creative minds. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#A855F7] via-[#C084FC] to-white">
              Cinematic results.
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-zinc-300 font-light leading-relaxed">
            WG MEDIA PRODUCTION is a creative production and post-production agency focused on turning ideas into visual experiences that people remember.
          </p>
        </div>

        {/* Agency Introduction & Visual Set Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center mb-24 md:mb-32">
          {/* On-Set Production Image */}
          <div className="lg:col-span-6 relative">
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
                  priority={true}
                />
              </div>

              <div className="p-4 bg-[#080A0F]/90 backdrop-blur-md border-t border-zinc-800/80 flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-2 text-zinc-300">
                  <Film className="w-4 h-4 text-[#A855F7]" />
                  <span>On-Set Operations & Studio Lab</span>
                </div>
                <span className="text-[#C084FC]">Est. 2021</span>
              </div>
            </div>
          </div>

          {/* Agency Story & Philosophy */}
          <div className="lg:col-span-6 flex flex-col items-start">
            <span className="text-xs font-mono uppercase tracking-widest text-[#A855F7] mb-3">
              OUR MISSION & PURPOSE
            </span>

            <h2 className="font-display font-bold text-2xl sm:text-3xl text-white mb-6 leading-snug">
              Visual content engineered for high retention and memorable brand recall.
            </h2>

            <p className="text-base text-zinc-300 font-light leading-relaxed mb-4">
              We partner with forward-thinking commercial brands, direct-to-consumer disruptors, and ambitious digital creators to produce visual content engineered for high retention and memorable brand recall across modern digital platforms.
            </p>

            <p className="text-sm text-zinc-400 font-light leading-relaxed mb-8">
              From commercial brand films and viral short-form systems to broadcast color grading and kinetic motion graphics, our team bridges technical precision with compelling narrative arcs.
            </p>

            {/* Core Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full pt-4 border-t border-zinc-900">
              <div className="p-4 rounded-xl bg-[#090B10] border border-zinc-800/80">
                <div className="p-2 rounded-lg bg-zinc-900 w-fit text-[#A855F7] mb-3">
                  <Zap className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-semibold text-white">Retention-Driven Pacing</h3>
                <p className="text-xs text-zinc-400 mt-1">Every cut is engineered to maintain viewer engagement and eliminate drop-off.</p>
              </div>

              <div className="p-4 rounded-xl bg-[#090B10] border border-zinc-800/80">
                <div className="p-2 rounded-lg bg-zinc-900 w-fit text-[#A855F7] mb-3">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-semibold text-white">Broadcast Grade</h3>
                <p className="text-xs text-zinc-400 mt-1">Full color gamut compliance (ACES / DCI-P3) and master sound design (-14 LUFS).</p>
              </div>
            </div>
          </div>
        </div>

        {/* Studio Operations & Workstation Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center mb-24 md:mb-32">
          <div className="lg:col-span-6 order-2 lg:order-1 flex flex-col items-start">
            <span className="text-xs font-mono uppercase tracking-widest text-[#A855F7] mb-3">
              POST-PRODUCTION INFRASTRUCTURE
            </span>

            <h2 className="font-display font-bold text-2xl sm:text-3xl text-white mb-6 leading-snug">
              Calibrated color science & Frame.io collaborative workflows.
            </h2>

            <p className="text-base text-zinc-300 font-light leading-relaxed mb-4">
              Our post-production facility utilizes calibrated DCI-P3 4K monitoring, ACES color management, and dedicated DaVinci Resolve suites to guarantee seamless skin-tone preservation and sensor standardization across ARRI, RED, and Sony cinema cameras.
            </p>

            <ul className="space-y-3 mb-8 text-sm text-zinc-300 font-light">
              <li className="flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-[#A855F7] shrink-0" />
                <span>Standardized ACES-managed pipeline with custom show LUTs</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-[#A855F7] shrink-0" />
                <span>Multi-format delivery: 16:9 Cinema TVC & 9:16 Vertical Masters</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-[#A855F7] shrink-0" />
                <span>High-fidelity spatial audio mastering and bespoke foley design</span>
              </li>
            </ul>

            <button
              onClick={() => onNavigate('projects')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-zinc-900 border border-zinc-700/80 hover:border-[#8B2CFF] transition-all"
            >
              <span>Explore Project Case Studies</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#A855F7]" />
            </button>
          </div>

          <div className="lg:col-span-6 order-1 lg:order-2">
            <div className="relative rounded-2xl overflow-hidden border border-zinc-800 bg-[#0C0D12] group shadow-2xl">
              <div className="aspect-[4/3] w-full overflow-hidden">
                <LazyImage
                  src="/src/assets/images/services_editing_workstation_1790154367783.jpg"
                  alt="Post-production editing suite workstation"
                  wrapperClassName="w-full h-full"
                  className="w-full h-full object-cover object-center transform transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="p-4 bg-[#080A0F]/90 backdrop-blur-md border-t border-zinc-800/80 flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-2 text-zinc-300">
                  <Monitor className="w-4 h-4 text-[#A855F7]" />
                  <span>Color Grading & Audio Mastering Suite</span>
                </div>
                <span className="text-[#C084FC]">DCI-P3 4K</span>
              </div>
            </div>
          </div>
        </div>

        {/* What We Do / Services Breakdown */}
        <div className="mb-24 md:mb-32">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-mono uppercase tracking-widest text-[#A855F7] mb-3 block">
              OUR CAPABILITIES
            </span>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-white">
              End-to-End Creative Services
            </h2>
            <p className="mt-4 text-sm sm:text-base text-zinc-400 font-light">
              Crafted from initial treatment to cinema-grade capture, editorial assembly, and multi-platform delivery.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICES.map((srv) => (
              <div
                key={srv.id}
                className="p-6 rounded-2xl bg-[#090B10] border border-zinc-800/80 hover:border-[#8B2CFF]/60 hover:shadow-[0_0_25px_rgba(124,0,255,0.12)] transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono text-[#A855F7]">{srv.number}</span>
                    {srv.startingPrice ? (
                      <span className="px-2 py-0.5 rounded-full bg-[#7C00FF]/15 border border-[#8B2CFF]/30 text-[11px] font-mono font-medium text-[#D8B4FE]">
                        Starting at {srv.startingPrice}
                      </span>
                    ) : (
                      <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider">Service</span>
                    )}
                  </div>
                  <h3 className="font-display font-bold text-xl text-white mb-2">{srv.title}</h3>
                  <p className="text-xs sm:text-sm text-zinc-400 font-light leading-relaxed mb-4">
                    {srv.description}
                  </p>

                  <div className="pt-4 border-t border-zinc-900 mb-4">
                    <span className="text-[11px] font-mono text-zinc-500 block mb-2">DELIVERABLES:</span>
                    <ul className="space-y-1.5">
                      {srv.deliverables.map((item) => (
                        <li key={item} className="text-xs text-zinc-300 flex items-center gap-2">
                          <span className="w-1 h-1 rounded-full bg-[#A855F7]" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-4 border-t border-zinc-900/80">
                  <span className="text-[10px] font-mono text-zinc-500 block mb-1">IDEAL FOR:</span>
                  <p className="text-xs text-[#C084FC] mb-4">{srv.idealFor}</p>

                  <button
                    onClick={() => onOpenInquiry(srv.title)}
                    className="w-full py-2.5 rounded-lg text-xs font-medium text-white bg-zinc-900 border border-zinc-800 hover:border-[#8B2CFF] hover:bg-zinc-800/80 transition-all flex items-center justify-center gap-1.5"
                  >
                    <span>Inquire About {srv.title}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#A855F7]" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 4-Step Work Process */}
        <div className="mb-24 md:mb-32">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-mono uppercase tracking-widest text-[#A855F7] mb-3 block">
              WORK PROCESS
            </span>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-white">
              How We Create & Deliver
            </h2>
            <p className="mt-4 text-sm sm:text-base text-zinc-400 font-light">
              A transparent, structured workflow engineered for velocity, creative excellence, and zero surprise handoffs.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                step: '01',
                title: 'Discovery & Treatment',
                desc: 'In-depth brief alignment, audience retention mapping, visual moodboards, and script/treatment approval before cameras roll.',
              },
              {
                step: '02',
                title: 'Cinema Production',
                desc: 'On-set execution with cinema camera packages, specialized lighting design, audio capture, and high-speed units.',
              },
              {
                step: '03',
                title: 'Assembly & Editorial',
                desc: 'Pacing architecture, hook calibration, dynamic motion graphics, and audio sweetening to maintain viewer attention.',
              },
              {
                step: '04',
                title: 'Finishing & Sound',
                desc: 'ACES-managed color grade, broadcast -14 LUFS sound mix, Frame.io client review cycles, and multi-format master exports.',
              },
            ].map((p) => (
              <div
                key={p.step}
                className="p-6 rounded-2xl bg-[#090B10] border border-zinc-800/80 flex flex-col justify-between"
              >
                <div>
                  <div className="text-2xl font-mono font-bold text-[#A855F7] mb-4">{p.step}</div>
                  <h3 className="font-display font-bold text-lg text-white mb-2">{p.title}</h3>
                  <p className="text-xs sm:text-sm text-zinc-400 font-light leading-relaxed">
                    {p.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Team Preview Banner */}
        <div className="p-8 sm:p-12 rounded-2xl bg-gradient-to-br from-[#0E1017] to-[#08090E] border border-zinc-800 relative overflow-hidden flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 mb-16">
          <div className="max-w-xl">
            <span className="text-xs font-mono uppercase tracking-widest text-[#A855F7] block mb-2">
              STUDIO LEADERSHIP
            </span>
            <h3 className="font-display font-bold text-2xl sm:text-3xl text-white mb-3">
              Led by Senior Specialists Across Every Discipline
            </h3>
            <p className="text-sm text-zinc-400 font-light leading-relaxed">
              Every project is directly directed and supervised by senior leads in creative direction, post-production, motion VFX, and sound design.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={() => onNavigate('team')}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-semibold text-white bg-zinc-900 border border-zinc-700 hover:border-[#8B2CFF] hover:bg-zinc-800 transition-all"
            >
              <span>Meet Full Team & Specialties</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#A855F7]" />
            </button>

            <button
              onClick={() => onNavigate('contact')}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-[#7C00FF] to-[#8B2CFF] hover:opacity-95 shadow-lg shadow-[#7C00FF]/30 transition-all"
            >
              <span>Start a Project</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
