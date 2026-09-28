import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

interface VideoPlayerProps {
  videoSrc?: string;
  posterImage?: string;
  title?: string;
  subtitle?: string;
  className?: string;
  maxHeight?: string;
  lazy?: boolean;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  videoSrc = '/assets/videos/AQNynW791wX9tJb7b-hHUNRno7DkLYo5ZeCEHB6HeWwSvkkVP2FhFRv9_ktgOmO_M_YxxryzZsK4nEPaJ1oPQiHwLT3rZ069L40 (1).mp4',
  posterImage = '/assets/videos/raw-vs-edit-poster.jpg',
  title = 'Raw Footage vs Agency Edit',
  subtitle = 'VERTICAL 9:16 REEL BREAKDOWN',
  className = '',
  maxHeight = 'max-h-[580px]',
  lazy = true,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(67.85);
  const [volume, setVolume] = useState<number>(0.9);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showControls, setShowControls] = useState<boolean>(true);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [hasStarted, setHasStarted] = useState<boolean>(false);
  const [isNearViewport, setIsNearViewport] = useState<boolean>(!lazy);
  const [isPosterLoaded, setIsPosterLoaded] = useState<boolean>(false);

  // Lazy observer for video network initialization
  useEffect(() => {
    if (!lazy) {
      setIsNearViewport(true);
      return;
    }

    const el = containerRef.current;
    if (!el || typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      setIsNearViewport(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsNearViewport(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '350px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [lazy]);

  // Blur-up preloader for posterImage
  useEffect(() => {
    if (!posterImage) {
      setIsPosterLoaded(true);
      return;
    }
    const img = new Image();
    img.src = posterImage;
    if (img.complete) {
      setIsPosterLoaded(true);
    } else {
      img.onload = () => setIsPosterLoaded(true);
      img.onerror = () => setIsPosterLoaded(true);
    }
  }, [posterImage]);

  // Auto-hide controls when video is playing
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (isPlaying && !isHovered) {
      timeout = setTimeout(() => {
        setShowControls(false);
      }, 2500);
    } else {
      setShowControls(true);
    }
    return () => clearTimeout(timeout);
  }, [isPlaying, isHovered]);

  // Reset playback state when videoSrc changes
  useEffect(() => {
    setIsPlaying(false);
    setCurrentTime(0);
    setHasStarted(false);
    if (videoRef.current) {
      videoRef.current.load();
    }
  }, [videoSrc]);

  // Fullscreen change tracking
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const togglePlay = useCallback(
    (e?: React.MouseEvent) => {
      if (e) e.stopPropagation();
      if (!videoRef.current) return;

      if (videoRef.current.paused || videoRef.current.ended) {
        videoRef.current
          .play()
          .then(() => {
            setIsPlaying(true);
            setHasStarted(true);
          })
          .catch((err) => {
            console.warn('Playback request error:', err);
          });
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    },
    []
  );

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      if (!duration || isNaN(duration)) {
        setDuration(videoRef.current.duration || 35.08);
      }
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      if (videoRef.current.duration && !isNaN(videoRef.current.duration)) {
        setDuration(videoRef.current.duration);
      }
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (!videoRef.current || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newProgress = Math.max(0, Math.min(1, clickX / rect.width));
    const targetTime = newProgress * duration;
    videoRef.current.currentTime = targetTime;
    setCurrentTime(targetTime);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    if (videoRef.current) {
      videoRef.current.volume = newVol;
      videoRef.current.muted = newVol === 0;
      setIsMuted(newVol === 0);
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    const nextMuted = !isMuted;
    videoRef.current.muted = nextMuted;
    setIsMuted(nextMuted);
    if (!nextMuted && volume === 0) {
      setVolume(0.8);
      videoRef.current.volume = 0.8;
    }
  };

  const handleRestart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play();
      setIsPlaying(true);
      setHasStarted(true);
    }
  };

  const toggleFullscreen = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!containerRef.current) return;

    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch((err) => {
        console.warn('Fullscreen failed:', err);
      });
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds < 0) return '00:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div
      ref={containerRef}
      className={`relative w-full min-h-[380px] sm:min-h-[460px] md:min-h-[540px] bg-[#05070C] overflow-hidden rounded-xl group select-none flex items-center justify-center cursor-pointer ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={togglePlay}
    >
      {/* 1. Ambient blurred background using video poster for a rich cinema framing with blur-up */}
      <div
        className={`absolute inset-0 bg-cover bg-center filter transition-all duration-1000 pointer-events-none ${
          isPosterLoaded ? 'opacity-20 blur-2xl scale-110' : 'opacity-0 blur-3xl scale-125'
        }`}
        style={{ backgroundImage: `url(${posterImage})` }}
        aria-hidden="true"
      />

      {/* Dark Vignette Overlay */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-[#05070C]/80 via-transparent to-[#05070C]/90 pointer-events-none"
        aria-hidden="true"
      />

      {/* 2. Vertical 9:16 Video Player Container (maintains exact native aspect ratio without distortion) */}
      <div className={`relative h-full ${maxHeight} aspect-[9/16] max-w-full flex items-center justify-center overflow-hidden rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.85),0_0_40px_rgba(124,0,255,0.15)] border border-white/10 group-hover:border-[#8B2CFF]/50 transition-all duration-300 bg-black`}>
        {/* Shimmer skeleton for poster blur-up */}
        <div
          className={`absolute inset-0 z-0 bg-gradient-to-r from-[#0C0E14] via-[#1A1D27] to-[#0C0E14] animate-pulse transition-opacity duration-700 pointer-events-none ${
            isPosterLoaded ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
          aria-hidden="true"
        />

        {/* Blur-up Poster image overlay before playback starts */}
        {posterImage && !isPlaying && (
          <img
            src={posterImage}
            alt={title}
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-out z-10 pointer-events-none ${
              isPosterLoaded
                ? 'opacity-100 filter-none scale-100'
                : 'opacity-0 filter blur-xl scale-105'
            }`}
          />
        )}

        <video
          ref={videoRef}
          key={videoSrc}
          src={isNearViewport ? encodeURI(videoSrc) : undefined}
          poster={posterImage}
          playsInline
          preload={isPlaying ? 'auto' : isNearViewport ? 'metadata' : 'none'}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={() => setIsPlaying(false)}
          className="w-full h-full object-contain cursor-pointer relative z-0"
        >
          {isNearViewport && (
            <>
              <source src={encodeURI(videoSrc)} type="video/mp4" />
              <source src={videoSrc} type="video/mp4" />
              <source src="/assets/videos/showcase-reel.mp4" type="video/mp4" />
            </>
          )}
          Your browser does not support HTML5 video playback.
        </video>
      </div>

      {/* 3. Top HUD: Title, Live indicator, and Split-Screen Badge */}
      <div
        className={`absolute top-4 left-4 right-4 z-20 flex items-center justify-between text-xs font-mono text-zinc-300 transition-opacity duration-300 pointer-events-none ${
          showControls || !isPlaying ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/75 backdrop-blur-md border border-white/10 shadow-lg">
          <span
            className={`w-2 h-2 rounded-full ${
              isPlaying ? 'bg-emerald-400 animate-pulse' : 'bg-[#A855F7]'
            }`}
          />
          <span className="font-semibold text-white tracking-wide">{title}</span>
        </div>

        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/75 backdrop-blur-md border border-white/10 text-[11px] text-zinc-300">
          <Sparkles className="w-3 h-3 text-[#C084FC]" />
          <span>{subtitle}</span>
        </div>
      </div>

      {/* 4. Large Center Play Button Overlay (visible when paused) */}
      {!isPlaying && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/40 backdrop-blur-[1px] transition-opacity duration-300 pointer-events-none">
          <button
            type="button"
            onClick={togglePlay}
            className="pointer-events-auto group/btn relative w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-zinc-950/90 border border-[#8B2CFF]/80 flex items-center justify-center text-white shadow-[0_0_40px_rgba(139,44,255,0.45)] hover:shadow-[0_0_60px_rgba(168,85,247,0.75)] hover:border-[#C084FC] hover:scale-105 active:scale-95 transition-all duration-300"
            aria-label="Play video"
          >
            {/* Glowing Pulse Ring */}
            <span className="absolute inset-0 rounded-full border border-[#A855F7]/50 animate-ping pointer-events-none" />

            {/* Inner Play Icon */}
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#7C00FF] to-[#A855F7] flex items-center justify-center text-white shadow-inner">
              <Play className="w-6 h-6 ml-1 fill-white text-white" />
            </div>
          </button>
        </div>
      )}

      {/* 5. Modern Bottom Controls Bar */}
      <div
        className={`absolute bottom-0 left-0 right-0 z-30 p-4 sm:p-5 bg-gradient-to-t from-black/95 via-black/85 to-transparent transition-all duration-300 ${
          showControls || !isPlaying
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-2 pointer-events-none'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="max-w-3xl mx-auto">
          {/* Progress Bar Scrubber */}
          <div
            className="group/scrub relative w-full h-2 bg-white/20 hover:h-2.5 rounded-full cursor-pointer mb-3 transition-all"
            onClick={handleSeek}
            role="slider"
            aria-label="Video scrubber"
            aria-valuemin={0}
            aria-valuemax={duration}
            aria-valuenow={currentTime}
          >
            {/* Progress Fill */}
            <div
              className="h-full bg-gradient-to-r from-[#7C00FF] via-[#9333EA] to-[#C084FC] rounded-full relative shadow-[0_0_10px_#A855F7]"
              style={{ width: `${progressPercent}%` }}
            >
              {/* Scrubber Knob */}
              <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-3.5 h-3.5 bg-white rounded-full shadow-lg scale-0 group-hover/scrub:scale-100 transition-transform" />
            </div>
          </div>

          {/* Controls Bottom Row */}
          <div className="flex items-center justify-between text-white text-xs font-mono">
            {/* Left Controls: Play/Pause, Replay, Time Readout */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={togglePlay}
                className="p-1.5 rounded-lg text-zinc-200 hover:text-white hover:bg-white/10 transition-colors"
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? (
                  <Pause className="w-4 h-4 fill-current" />
                ) : (
                  <Play className="w-4 h-4 fill-current ml-0.5" />
                )}
              </button>

              <button
                type="button"
                onClick={handleRestart}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
                title="Restart from beginning"
                aria-label="Restart video"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>

              <span className="text-zinc-300 text-[11px] sm:text-xs tabular-nums">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>

            {/* Right Controls: Volume & Fullscreen */}
            <div className="flex items-center gap-3 sm:gap-4">
              {/* Volume Slider with Mute Toggle */}
              <div className="flex items-center gap-1.5 group/vol">
                <button
                  type="button"
                  onClick={toggleMute}
                  className="p-1.5 rounded-lg text-zinc-300 hover:text-white hover:bg-white/10 transition-colors"
                  aria-label={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted || volume === 0 ? (
                    <VolumeX className="w-4 h-4 text-rose-400" />
                  ) : (
                    <Volume2 className="w-4 h-4" />
                  )}
                </button>

                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  onClick={(e) => e.stopPropagation()}
                  className="w-14 sm:w-20 h-1 bg-zinc-700 accent-[#A855F7] rounded-lg cursor-pointer"
                  aria-label="Volume slider"
                />
              </div>

              {/* Fullscreen Button */}
              <button
                type="button"
                onClick={toggleFullscreen}
                className="p-1.5 rounded-lg text-zinc-300 hover:text-white hover:bg-white/10 transition-colors"
                aria-label={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
              >
                {isFullscreen ? (
                  <Minimize className="w-4 h-4" />
                ) : (
                  <Maximize className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
