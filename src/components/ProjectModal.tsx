import React, { useState, useEffect } from 'react';
import { Project } from '../data/content.ts';
import { VideoPlayer } from './VideoPlayer.tsx';
import { LazyImage } from './LazyImage.tsx';
import {
  X,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  Calendar,
  Clock,
  Briefcase,
  Layers,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
  onInquireSimilar: (projectName: string) => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({
  project,
  onClose,
  onInquireSimilar,
}) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(30);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Simulate progress playback
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setProgress((prev) => (prev >= 100 ? 0 : prev + 1));
    }, 250);
    return () => clearInterval(interval);
  }, [isPlaying]);

  if (!project) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-2xl bg-[#090B10] border border-zinc-800 shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div className="sticky top-0 z-20 flex items-center justify-between px-6 py-4 bg-[#090B10]/95 backdrop-blur-md border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono uppercase tracking-widest text-[#A855F7]">
              {project.category}
            </span>
            <span className="text-zinc-600">·</span>
            <span className="text-xs font-mono text-zinc-400">{project.client}</span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            aria-label="Close project preview"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cinematic Video Showcase Player Area */}
        {project.videoUrl ? (
          <div className="w-full bg-black overflow-hidden flex items-center justify-center min-h-[350px] sm:min-h-[440px]">
            <VideoPlayer
              videoSrc={project.videoUrl}
              posterImage={project.image}
              title={project.title}
            />
          </div>
        ) : (
          <div className="relative aspect-video w-full bg-black overflow-hidden group">
            <LazyImage
              src={project.image}
              alt={project.title}
              wrapperClassName="w-full h-full"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
              priority={true}
            />

            {/* Video Player Overlay HUD */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 flex flex-col justify-between p-4 sm:p-6">
              {/* Top Info */}
              <div className="flex items-center justify-between text-xs font-mono text-zinc-300">
                <span className="px-2 py-1 rounded bg-black/60 border border-white/10 backdrop-blur-sm">
                  4K UHD 60FPS · PRORES 4444 XQ
                </span>
                <span className="px-2 py-1 rounded bg-[#7C00FF]/40 border border-[#8B2CFF]/60 text-white backdrop-blur-sm">
                  {project.duration}
                </span>
              </div>

              {/* Bottom Controls */}
              <div className="flex flex-col gap-2">
                {/* Scrubbing Bar */}
                <div
                  className="w-full h-1.5 bg-white/20 rounded-full cursor-pointer relative overflow-hidden group-hover:h-2 transition-all"
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const clickX = e.clientX - rect.left;
                    setProgress((clickX / rect.width) * 100);
                  }}
                >
                  <div
                    className="h-full bg-gradient-to-r from-[#7C00FF] via-[#8B2CFF] to-[#A855F7] rounded-full relative"
                    style={{ width: `${progress}%` }}
                  />
                </div>

                {/* Player Buttons */}
                <div className="flex items-center justify-between text-white text-xs font-mono pt-1">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                      aria-label={isPlaying ? 'Pause' : 'Play'}
                    >
                      {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                    </button>

                    <button
                      onClick={() => setIsMuted(!isMuted)}
                      className="text-zinc-300 hover:text-white transition-colors"
                      aria-label={isMuted ? 'Unmute' : 'Mute'}
                    >
                      {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </button>

                    <span className="text-zinc-400">
                      {Math.floor((progress / 100) * 60).toString().padStart(2, '0')}:
                      {((progress * 3) % 60).toString().padStart(2, '0')} / {project.duration}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-[#C084FC] hidden sm:inline">
                      {project.stats}
                    </span>
                    <button
                      onClick={() => {
                        if (!document.fullscreenElement) {
                          document.documentElement.requestFullscreen().catch(() => {});
                        } else {
                          document.exitFullscreen().catch(() => {});
                        }
                      }}
                      className="text-zinc-300 hover:text-white p-1"
                      title="Fullscreen"
                    >
                      <Maximize2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Case Study Details Section */}
        <div className="p-6 sm:p-8 space-y-8">
          <div>
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-white">
              {project.title}
            </h2>
            {project.tagline && (
              <p className="mt-1 text-sm font-mono text-[#A855F7]">
                {project.tagline}
              </p>
            )}
            <p className="mt-2 text-base text-zinc-300 font-light leading-relaxed">
              {project.description}
            </p>
          </div>

          {/* Metadata Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-[#0F1118] border border-zinc-800 text-xs">
            <div>
              <span className="text-zinc-500 font-mono block">Client</span>
              <span className="font-medium text-white">{project.client}</span>
            </div>
            <div>
              <span className="text-zinc-500 font-mono block">Role</span>
              <span className="font-medium text-white">{project.role}</span>
            </div>
            <div>
              <span className="text-zinc-500 font-mono block">Release</span>
              <span className="font-medium text-white">{project.year}</span>
            </div>
            <div>
              <span className="text-zinc-500 font-mono block">Performance</span>
              <span className="font-medium text-[#C084FC]">{project.stats}</span>
            </div>
          </div>

          {/* Narrative Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div className="p-5 rounded-xl bg-zinc-950/60 border border-zinc-800/80">
              <span className="text-xs font-mono uppercase tracking-wider text-rose-400 block mb-2">
                The Creative Challenge
              </span>
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-light">
                {project.challenge}
              </p>
            </div>

            <div className="p-5 rounded-xl bg-zinc-950/60 border border-zinc-800/80">
              <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 block mb-2">
                Our Production Solution
              </span>
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-light">
                {project.solution}
              </p>
            </div>
          </div>

          {/* Deliverables */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-widest text-zinc-400 mb-3">
              Delivered Assets & Masters
            </h4>
            <div className="flex flex-wrap gap-2">
              {project.deliverables.map((item) => (
                <span
                  key={item}
                  className="px-3 py-1.5 rounded-lg bg-[#11131A] border border-zinc-800 text-xs text-zinc-300 font-medium"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* Action Row */}
          <div className="pt-6 border-t border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-zinc-400">
              <Sparkles className="w-4 h-4 text-[#A855F7]" />
              <span>Available for commercial bookings Q3/Q4</span>
            </div>

            <button
              onClick={() => {
                onClose();
                onInquireSimilar(project.title);
              }}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-[#7C00FF] to-[#8B2CFF] shadow-lg shadow-[#7C00FF]/30 hover:shadow-[#8B2CFF]/50 transition-all"
            >
              <span>Request Similar Project</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
