import React, { useState, useEffect, useRef } from 'react';

interface StatItem {
  target: number;
  suffix: string;
  label: string;
  subtext: string;
}

const STATS_DATA: StatItem[] = [
  {
    target: 50,
    suffix: '+',
    label: 'Projects Delivered',
    subtext: 'Commercials, reels & brand films',
  },
  {
    target: 20,
    suffix: '+',
    label: 'Happy Clients',
    subtext: 'Global brands & ambitious creators',
  },
  {
    target: 5,
    suffix: '+',
    label: 'Years Creating',
    subtext: 'Specialized cinema & post-production',
  },
];

interface CounterProps {
  target: number;
  suffix: string;
  trigger: boolean;
  duration?: number;
}

const CounterNumber: React.FC<CounterProps> = ({
  target,
  suffix,
  trigger,
  duration = 1800,
}) => {
  const [count, setCount] = useState<number>(0);

  useEffect(() => {
    if (!trigger) {
      setCount(0);
      return;
    }

    // Honor reduced motion accessibility preference
    if (
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      setCount(target);
      return;
    }

    let startTimestamp: number | null = null;
    let animationFrameId: number;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const elapsed = timestamp - startTimestamp;
      const progress = Math.min(elapsed / duration, 1);

      // Smooth ease-out exponential curve: fast surge initially, decelerating smoothly into the final number
      const easeOut =
        progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = Math.floor(easeOut * target);

      setCount(current);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(step);
      } else {
        setCount(target);
      }
    };

    animationFrameId = requestAnimationFrame(step);

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [target, trigger, duration]);

  return (
    <span className="inline-flex items-baseline tabular-nums">
      <span>{count}</span>
      <span className="text-[#A855F7] ml-0.5">{suffix}</span>
    </span>
  );
};

export const TrustStats: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      {
        threshold: 0.25,
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-16 md:py-24 border-y border-zinc-900 bg-[#080A0F]/80 overflow-hidden"
    >
      {/* Subtle top violet accent hairline */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-[1px] bg-gradient-to-r from-transparent via-[#8B2CFF] to-transparent" />

      {/* Ambient soft glow */}
      <div
        className="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-96 bg-[#7C00FF]/5 rounded-full blur-[140px] pointer-events-none"
        aria-hidden="true"
      />

      <div className="max-w-[1360px] mx-auto px-5 sm:px-8 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Text Block */}
          <div className="lg:col-span-5 flex flex-col items-start">
            <span className="text-xs font-mono uppercase tracking-widest text-[#A855F7] mb-3 font-medium">
              TRUSTED BY CREATORS & BUSINESSES
            </span>
            <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-[42px] leading-tight text-[#F5F5F7] tracking-tight">
              Visuals that make people stop scrolling.
            </h2>
            <p className="mt-4 text-sm text-zinc-400 max-w-md leading-relaxed font-light">
              We engineer our edits around algorithmic retention dynamics, rhythm-driven pacing, and high-end cinematic aesthetics that elevate audience perception.
            </p>
          </div>

          {/* Right Statistics Block with Smooth Counting Animation */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-4 relative">
            {STATS_DATA.map((item, idx) => (
              <div
                key={item.label}
                className={`group relative flex flex-col justify-center p-6 rounded-2xl bg-[#0C0D12]/70 border border-zinc-800/70 hover:border-[#8B2CFF]/50 hover:bg-[#0E1017] transition-all duration-300 shadow-lg ${
                  idx < STATS_DATA.length - 1
                    ? 'sm:border-r sm:border-r-zinc-800/80 sm:pr-8'
                    : ''
                }`}
              >
                {/* Accent mini indicator */}
                <div className="w-6 h-[2px] bg-[#8B2CFF] group-hover:w-10 group-hover:bg-[#A855F7] transition-all duration-300 mb-3" />

                {/* Animated Count-Up Value */}
                <div className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl text-white tracking-tight tabular-nums transition-transform duration-300 group-hover:translate-x-0.5">
                  <CounterNumber
                    target={item.target}
                    suffix={item.suffix}
                    trigger={isVisible}
                    duration={1600 + idx * 250}
                  />
                </div>

                <div className="mt-2 text-sm sm:text-base font-semibold text-zinc-200">
                  {item.label}
                </div>
                <div className="mt-1 text-xs text-zinc-500 font-light">
                  {item.subtext}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
