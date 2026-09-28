import React from 'react';
import { LazyImage } from './LazyImage.tsx';
import {
  Video,
  PlaySquare,
  Layers,
  Camera,
  ArrowRight,
  ArrowUpRight,
  ArrowDown,
  Sliders,
} from 'lucide-react';

import { SERVICES, getServiceItem, getServicePrice } from '../data/content.ts';

interface ServicesProps {
  onSelectServiceForInquiry: (serviceTitle: string) => void;
}

// Minimal, elegant outline Drone icon matching the design system
const DroneIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    {/* Drone center body */}
    <rect x="9.5" y="9.5" width="5" height="5" rx="1.5" />
    <circle cx="12" cy="12" r="1" fill="currentColor" />
    {/* Rotor arms */}
    <line x1="9.5" y1="9.5" x2="6" y2="6" />
    <line x1="14.5" y1="9.5" x2="18" y2="6" />
    <line x1="9.5" y1="14.5" x2="6" y2="18" />
    <line x1="14.5" y1="14.5" x2="18" y2="18" />
    {/* Rotor propeller circles */}
    <circle cx="5" cy="5" r="2.5" />
    <circle cx="19" cy="5" r="2.5" />
    <circle cx="5" cy="19" r="2.5" />
    <circle cx="19" cy="19" r="2.5" />
  </svg>
);

const SERVICE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  'video-editing': PlaySquare,
  'sound-designing': Sliders,
  'motion-graphics': Layers,
  'photography': Camera,
  'drone-shots': DroneIcon,
  'video-production': Video,
};

// Single Source of Truth: connected directly to central SERVICES data
export const SERVICES_DATA = SERVICES.map((service) => ({
  ...service,
  image: service.image || '/src/assets/images/service_video_editing_1790156513478.jpg',
  Icon: SERVICE_ICONS[service.id] || Video,
}));

export { getServiceItem, getServicePrice };

export const Services: React.FC<ServicesProps> = ({ onSelectServiceForInquiry }) => {
  return (
    <section id="services" className="relative py-24 md:py-32 scroll-mt-20">
      {/* Ambient background glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[450px] bg-[#7C00FF]/5 blur-[160px] pointer-events-none rounded-full"
        aria-hidden="true"
      />

      <div className="max-w-[1360px] mx-auto px-5 sm:px-8 lg:px-12">
        {/* Section Header: Eyebrow + Heading (Left), Action (Right) */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12 lg:mb-16">
          <div>
            <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#A855F7] block mb-2 font-medium">
              SERVICES & PRICING
            </span>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl text-[#F5F5F7] tracking-tight">
              What We Do
            </h2>
            <p className="mt-2 text-sm text-zinc-400 max-w-xl font-light">
              Accessible, professional starter rates designed for growing brands, creators, and agencies.
            </p>
          </div>

          <button
            onClick={() => onSelectServiceForInquiry('General Production Inquiry')}
            className="group inline-flex items-center gap-2 text-sm font-medium text-[#C084FC] hover:text-white transition-colors duration-200 self-start sm:self-end pb-1"
          >
            <span>Request Custom Scope</span>
            <ArrowRight className="w-4 h-4 text-[#A855F7] group-hover:translate-x-1 transition-transform duration-200" />
          </button>
        </div>

        {/* 3-in-a-Row Desktop Grid: 3 Top, 3 Bottom (Bigger Cards) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {SERVICES_DATA.map((service, idx) => {
            const IconComponent = service.Icon;
            return (
              <div
                key={service.id}
                onClick={() => onSelectServiceForInquiry(service.title)}
                className="group relative flex flex-col justify-between rounded-2xl bg-[#090B10] border border-zinc-800/80 hover:border-[#8B2CFF]/60 hover:shadow-[0_16px_40px_rgba(124,0,255,0.2)] hover:-translate-y-2 transition-all duration-300 overflow-hidden cursor-pointer select-none"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelectServiceForInquiry(service.title);
                  }
                }}
              >
                {/* Large Image Area: Top ~55-60% of card with generous aspect ratio */}
                <div className="relative w-full aspect-[16/10] overflow-hidden bg-zinc-950">
                  <LazyImage
                    src={service.image}
                    alt={service.title}
                    wrapperClassName="w-full h-full"
                    className="w-full h-full object-cover object-center transform transition-transform duration-700 ease-out group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />

                  {/* Gradient Scrim fading into card base */}
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-[#090B10] via-black/20 to-transparent opacity-85 group-hover:opacity-70 transition-opacity duration-300"
                    aria-hidden="true"
                  />

                  {/* Top-Left Pricing Pill */}
                  <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/75 backdrop-blur-md border border-white/10 text-xs font-mono font-medium text-[#E4D4FF] shadow-sm flex items-center gap-1.5">
                    <span className="text-[10px] text-zinc-400 uppercase tracking-wider">From</span>
                    <span className="font-semibold text-white">{service.price}</span>
                  </div>

                  {/* Top-Right Index Pill */}
                  <div className="absolute top-4 right-4 px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-md border border-white/10 text-[11px] font-mono text-zinc-400">
                    0{idx + 1}
                  </div>
                </div>

                {/* Content Area: Icon, Title, Description, and Interactive Arrow */}
                <div className="p-6 sm:p-7 flex flex-col justify-between flex-grow">
                  <div>
                    {/* Minimal Outline Icon */}
                    <div className="w-10 h-10 rounded-xl bg-zinc-900/80 border border-zinc-800 flex items-center justify-center text-zinc-300 group-hover:text-white group-hover:border-[#8B2CFF]/60 group-hover:bg-[#7C00FF]/10 transition-all duration-300 mb-4">
                      <IconComponent className="w-5 h-5 stroke-[1.75]" />
                    </div>

                    {/* Service Title */}
                    <h3 className="font-display font-bold text-xl sm:text-2xl text-white group-hover:text-[#F5F5F7] tracking-tight">
                      {service.title}
                    </h3>

                    {/* One-line Description */}
                    <p className="mt-2 text-sm text-zinc-400 font-light leading-relaxed">
                      {service.description}
                    </p>

                    {/* Deliverable Tags */}
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {service.deliverables.map((item) => (
                        <span
                          key={item}
                          className="px-2 py-0.5 rounded-md bg-black/40 border border-zinc-800/80 text-[11px] font-mono text-zinc-400 group-hover:border-zinc-700 group-hover:text-zinc-300 transition-colors"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Compact Pricing & Inquiry Row */}
                  <div className="mt-5 pt-3.5 border-t border-zinc-800/60 flex flex-wrap items-center justify-between gap-y-2 gap-x-3">
                    <div className="flex items-center gap-2 whitespace-nowrap">
                      <span className="text-xs text-zinc-400 font-mono">Starting at</span>
                      <span className="text-sm font-semibold font-mono text-white tracking-tight group-hover:text-[#E9D5FF] transition-colors">
                        {service.price}
                      </span>
                    </div>

                    <div className="inline-flex items-center gap-1.5 text-xs font-mono font-medium text-zinc-300 group-hover:text-white transition-colors shrink-0">
                      <span>Inquire</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#A855F7] group-hover:translate-x-1 transition-transform duration-200" />
                    </div>
                  </div>
                </div>

                {/* Bottom violet accent line on hover */}
                <div className="w-full h-[2px] bg-gradient-to-r from-transparent via-[#8B2CFF] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            );
          })}
        </div>

        {/* Supporting Pricing Note */}
        <div className="mt-10 max-w-2xl mx-auto text-center px-4">
          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-light">
            <span className="text-zinc-300 font-medium">Transparent Starter Rates:</span> All listed rates are baseline starting points for standard project scopes. Final pricing is customized according to footage length, revisions, and technical complexity.
          </p>
        </div>

        {/* Bottom Simple Small Down Arrow with Subtle Shimmer & Reflection */}
        <div className="mt-12 sm:mt-16 text-center flex justify-center">
          <button
            type="button"
            onClick={() => {
              const nextEl = document.querySelector('#process');
              if (nextEl) {
                nextEl.scrollIntoView({ behavior: 'smooth' });
              } else {
                onSelectServiceForInquiry('Custom Package & Scope Consultation');
              }
            }}
            className="group relative inline-flex items-center justify-center w-11 h-11 rounded-full bg-[#0C0E15] border border-zinc-800 hover:border-[#A855F7]/80 hover:bg-[#121422] text-zinc-400 hover:text-white transition-all duration-500 shadow-md cursor-pointer hover:shadow-[0_0_24px_rgba(168,85,247,0.4)] animate-bounce overflow-hidden"
            aria-label="Scroll down to process"
            title="Scroll down"
          >
            {/* Subtle metallic reflection beam sweeping across on hover */}
            <span
              className="absolute inset-0 -translate-x-[160%] group-hover:translate-x-[160%] transition-transform duration-1000 ease-out bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none -skew-x-12"
              aria-hidden="true"
            />

            {/* Ambient violet specular glow reflection */}
            <span
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-tr from-[#7C00FF]/30 via-[#A855F7]/20 to-transparent pointer-events-none"
              aria-hidden="true"
            />

            <ArrowDown className="w-4 h-4 text-zinc-400 group-hover:text-[#F5F5F7] transition-colors relative z-10" />
          </button>
        </div>
      </div>
    </section>
  );
};
