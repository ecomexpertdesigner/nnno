import React from 'react';

interface LogoProps {
  className?: string;
  iconOnly?: boolean;
  withTagline?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  iconOnly = false,
  withTagline = false,
}) => {
  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {/* Original Geometric Icon: Modern Camera Frame / Play Symbol / Abstract N-F Monogram */}
      <div className="relative w-8 h-8 md:w-9 md:h-9 shrink-0 flex items-center justify-center">
        <svg
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full transform transition-transform duration-300 group-hover:scale-105"
        >
          {/* Subtle Outer Frame Bounds */}
          <rect
            x="2"
            y="2"
            width="36"
            height="36"
            rx="6"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeOpacity="0.25"
          />

          {/* Precision Cinematic Viewfinder Corner Brackets */}
          <path
            d="M 6 12 V 6 H 12"
            stroke="#A855F7"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M 34 12 V 6 H 28"
            stroke="#A855F7"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M 6 28 V 34 H 12"
            stroke="#A855F7"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M 34 28 V 34 H 28"
            stroke="#A855F7"
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* Central Monogram: W and G Geometric Film Glyph */}
          <path
            d="M 10 13 L 13.5 27 L 17 18 L 20.5 27 L 24 13"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M 32 16 C 30.5 13.5 27.5 13 25 14.5 C 22.5 16 21.5 19.5 22.5 22.5 C 23.5 25.5 26.5 27 29.5 26.5 C 31.8 26.1 33 24.5 33 22.5 H 27.5"
            stroke="#A855F7"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Central violet laser focus dot */}
          <circle cx="28" cy="20" r="1.5" fill="#C084FC" />
        </svg>

        {/* Ambient violet glow behind logo mark */}
        <div className="absolute inset-0 bg-[#7C00FF]/25 blur-md -z-10 rounded-full" />
      </div>

      {!iconOnly && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 tracking-tight font-display font-bold text-sm md:text-base leading-none text-[#F5F5F7]">
            <span>WG MEDIA</span>
            <span className="text-[#A855F7] font-semibold text-xs tracking-widest uppercase">
              PRODUCTION
            </span>
          </div>
          {withTagline && (
            <span className="text-[10px] text-zinc-400 tracking-wider uppercase mt-1">
              Creative Visuals · Powerful Stories
            </span>
          )}
        </div>
      )}
    </div>
  );
};
