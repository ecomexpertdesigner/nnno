import React, { useState, useEffect, useRef } from 'react';

export interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
  wrapperClassName?: string;
  placeholderSrc?: string;
  priority?: boolean;
  blurDuration?: number;
  rounded?: string;
  skeletonClassName?: string;
  rootMargin?: string;
}

export const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  className = '',
  wrapperClassName = '',
  placeholderSrc,
  priority = false,
  blurDuration = 700,
  rounded = '',
  skeletonClassName = '',
  rootMargin = '250px',
  onClick,
  ...rest
}) => {
  const [isInView, setIsInView] = useState<boolean>(priority);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (priority) {
      setIsInView(true);
      return;
    }

    const element = containerRef.current;
    if (!element) return;

    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin,
        threshold: 0.01,
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [priority, rootMargin]);

  // Pre-cached image check (if already cached by browser, load immediately without flash)
  useEffect(() => {
    if (!isInView || !src) return;

    const img = new Image();
    img.src = src;
    if (img.complete) {
      setIsLoaded(true);
    }
  }, [isInView, src]);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${rounded} ${wrapperClassName}`}
      onClick={onClick}
    >
      {/* 1. Blur-up Background Shimmer Skeleton */}
      <div
        className={`absolute inset-0 z-0 bg-gradient-to-r from-[#0C0E14] via-[#161922] to-[#0C0E14] bg-[length:200%_100%] animate-pulse pointer-events-none transition-opacity duration-700 ${
          isLoaded ? 'opacity-0 pointer-events-none' : 'opacity-100'
        } ${skeletonClassName}`}
        aria-hidden="true"
      >
        {/* Subtle ambient blur glow inside skeleton */}
        <div className="absolute inset-0 bg-[#7C00FF]/5 backdrop-blur-md" />
      </div>

      {/* 2. Optional Low-Res or Tinted Blur Layer */}
      {placeholderSrc && !isLoaded && (
        <img
          src={placeholderSrc}
          alt=""
          aria-hidden="true"
          className={`absolute inset-0 w-full h-full object-cover filter blur-xl scale-110 transform transition-opacity duration-500 pointer-events-none ${
            isLoaded ? 'opacity-0' : 'opacity-80'
          }`}
        />
      )}

      {/* 3. Main Image with Smooth Blur-up and Scale Transition */}
      {isInView && (
        <img
          src={src}
          alt={alt}
          onLoad={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          className={`w-full h-full transition-all duration-700 ease-out transform ${
            isLoaded
              ? 'opacity-100 filter-none scale-100'
              : 'opacity-0 filter blur-lg scale-105'
          } ${className}`}
          {...rest}
        />
      )}

      {/* 4. Graceful Error Fallback */}
      {hasError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-950 text-zinc-600 text-xs p-3 text-center">
          <span className="font-mono">Media unavailable</span>
        </div>
      )}
    </div>
  );
};
