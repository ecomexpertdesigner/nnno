import React, { useState } from 'react';
import { PROJECTS, Project, PortfolioCategory } from '../data/content.ts';
import { VideoPlayer } from '../components/VideoPlayer.tsx';
import { LazyImage } from '../components/LazyImage.tsx';
import {
  Play,
  Eye,
  ArrowUpRight,
  Sparkles,
  Layers,
  Clock,
  User,
  Calendar,
  CheckCircle2,
  SlidersHorizontal,
} from 'lucide-react';

interface ProjectsPageProps {
  onSelectProject: (project: Project) => void;
  onOpenInquiry: (service?: string) => void;
}

export const ProjectsPage: React.FC<ProjectsPageProps> = ({
  onSelectProject,
  onOpenInquiry,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<PortfolioCategory>('all');

  const filterTabs: { label: string; value: PortfolioCategory }[] = [
    { label: 'All Projects', value: 'all' },
    { label: 'Before & After', value: 'before-after' },
    { label: 'Video Editing', value: 'video-editing' },
    { label: 'Motion Graphics', value: 'motion-graphics' },
    { label: 'Sound Design', value: 'sound-design' },
    { label: 'Graphic Design', value: 'graphic-design' },
  ];

  const filteredProjects =
    selectedFilter === 'all'
      ? PROJECTS
      : PROJECTS.filter((p) => p.filterCategories?.includes(selectedFilter));

  return (
    <div className="pt-24 md:pt-32 pb-24 text-[#F5F5F7]">
      {/* Background ambient lighting */}
      <div
        className="fixed top-1/3 left-0 w-[500px] h-[500px] bg-[#7C00FF]/10 blur-[150px] pointer-events-none rounded-full -z-10"
        aria-hidden="true"
      />
      <div
        className="fixed bottom-10 right-0 w-[450px] h-[450px] bg-[#8B2CFF]/10 blur-[140px] pointer-events-none rounded-full -z-10"
        aria-hidden="true"
      />

      <div className="max-w-[1360px] mx-auto px-5 sm:px-8 lg:px-12">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-zinc-800/80 pb-8">
          <div className="flex flex-col items-start max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900/90 border border-zinc-800 text-[11px] font-mono tracking-[0.2em] text-[#A855F7] uppercase mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-[#A855F7] animate-pulse" />
              <span>PROJECT PORTFOLIO</span>
            </div>

            <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl text-[#F5F5F7] tracking-tight leading-[1.05]">
              Commercial & Creative Showcase
            </h1>

            <p className="mt-4 text-base sm:text-lg text-zinc-400 font-light leading-relaxed">
              Every project in our portfolio is engineered for high retention, narrative resonance, and distinct visual identity.
            </p>
          </div>

          {/* Interactive Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-[#0C0D12] border border-zinc-800 rounded-xl self-start md:self-end">
            <div className="flex items-center gap-1 px-2 text-zinc-500 text-xs font-mono hidden sm:flex">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filter:</span>
            </div>
            {filterTabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setSelectedFilter(tab.value)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 whitespace-nowrap ${
                  selectedFilter === tab.value
                    ? 'bg-[#181A24] text-white shadow-sm border border-zinc-700/80'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Masonry / Editorial Grid Showcase */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch mb-20">
          {filteredProjects.map((project, idx) => {
            // Editorial layout sizing: Alternate large featured cards with companion cards
            const total = filteredProjects.length;
            let colSpan = 'col-span-12 md:col-span-7 lg:col-span-8';

            if (total === 1) {
              colSpan = 'col-span-12 max-w-4xl mx-auto w-full';
            } else if (idx === total - 1 && idx % 2 === 0) {
              colSpan = 'col-span-12 md:col-span-10 md:col-start-2 lg:col-span-8 lg:col-start-3';
            } else {
              const pairIndex = Math.floor(idx / 2);
              const isFirstInPair = idx % 2 === 0;
              const isLarge = pairIndex % 2 === 0 ? isFirstInPair : !isFirstInPair;
              colSpan = isLarge
                ? 'col-span-12 md:col-span-7 lg:col-span-8'
                : 'col-span-12 md:col-span-5 lg:col-span-4';
            }

            return (
              <div
                key={project.id}
                className={`${colSpan} group flex flex-col justify-between rounded-2xl bg-[#090B10] border border-zinc-800/80 hover:border-[#8B2CFF]/60 hover:shadow-[0_0_30px_rgba(124,0,255,0.15)] transition-all duration-500 overflow-hidden relative`}
              >
                {/* Media Container: Real Video Player or Image Showcase */}
                {project.videoUrl ? (
                  <div className="relative w-full h-[280px] sm:h-[340px] md:h-[400px] lg:h-[440px] overflow-hidden bg-black rounded-t-2xl">
                    <VideoPlayer
                      videoSrc={project.videoUrl}
                      posterImage={project.image}
                      title={project.title}
                      className="!min-h-0 h-full w-full"
                      maxHeight="max-h-full h-full"
                    />
                  </div>
                ) : (
                  <div
                    className="relative w-full h-[280px] sm:h-[340px] md:h-[400px] lg:h-[440px] overflow-hidden bg-zinc-950 cursor-pointer"
                    onClick={() => onSelectProject(project)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        onSelectProject(project);
                      }
                    }}
                  >
                    <LazyImage
                      src={project.image}
                      alt={project.title}
                      wrapperClassName="w-full h-full"
                      className="w-full h-full object-cover object-center transform transition-transform duration-700 ease-out group-hover:scale-105"
                    />

                    {/* Gradient Scrim for Contrast */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#090B10] via-black/30 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-300 pointer-events-none" />

                    {/* Top-Right Play Indicator */}
                    <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/60 backdrop-blur-md border border-white/15 flex items-center justify-center text-zinc-300 group-hover:bg-[#8B2CFF] group-hover:text-white group-hover:scale-110 transition-all duration-300 shadow-lg pointer-events-none">
                      <Play className="w-3.5 h-3.5 ml-0.5 fill-current" />
                    </div>

                    {/* View Details Tag */}
                    <div className="absolute top-4 left-4 flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-md border border-white/10 text-[11px] font-mono text-zinc-300 pointer-events-none">
                      <Eye className="w-3 h-3 text-[#A855F7]" />
                      <span>Case Study Details</span>
                    </div>

                    {/* Bottom Stats Overlay inside image */}
                    <div className="absolute bottom-3 left-4 text-xs font-mono text-zinc-400 pointer-events-none">
                      <span className="text-[#C084FC]">{project.stats}</span>
                    </div>
                  </div>
                )}

                {/* Content Details Area */}
                <div className="p-6 sm:p-7 flex flex-col justify-between flex-grow">
                  <div>
                    {/* Metadata Header */}
                    <div className="flex items-center justify-between gap-3 text-xs font-mono text-zinc-500 mb-3">
                      <span className="text-[#A855F7] uppercase tracking-wider">{project.category}</span>
                      <div className="flex items-center gap-3">
                        <span>{project.year}</span>
                        <span>·</span>
                        <span>{project.duration}</span>
                      </div>
                    </div>

                    {/* Project Title */}
                    <h2
                      onClick={() => onSelectProject(project)}
                      className="font-display font-bold text-xl sm:text-2xl text-white mb-3 cursor-pointer hover:text-[#C084FC] transition-colors"
                    >
                      {project.title}
                    </h2>

                    {/* Client & Description */}
                    <div className="text-xs font-mono text-zinc-400 mb-2">
                      Client: <span className="text-zinc-200">{project.client}</span>
                    </div>

                    {project.tagline && (
                      <p className="text-xs font-mono text-zinc-300 mb-2">
                        {project.tagline}
                      </p>
                    )}

                    <p className="text-sm text-zinc-300 font-light leading-relaxed mb-4">
                      {project.description}
                    </p>

                    {/* Deliverables Tags */}
                    <div className="flex flex-wrap gap-1.5 mb-5">
                      {project.deliverables.map((item) => (
                        <span
                          key={item}
                          className="px-2.5 py-1 rounded-md bg-zinc-900 border border-zinc-800 text-[11px] font-mono text-zinc-300"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Card Actions */}
                  <div className="pt-4 border-t border-zinc-800/80 flex items-center justify-between gap-4">
                    <button
                      onClick={() => onSelectProject(project)}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#C084FC] hover:text-white transition-colors"
                    >
                      <span>View Full Breakdown</span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-[#A855F7]" />
                    </button>

                    <button
                      onClick={() => onOpenInquiry(`Project Inquiry: ${project.title}`)}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-300 bg-zinc-900 hover:bg-zinc-800 hover:text-white border border-zinc-800 transition-colors"
                    >
                      Request Similar
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Banner */}
        <div className="p-8 sm:p-12 rounded-2xl bg-[#090B10] border border-zinc-800 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="font-display font-bold text-2xl text-white mb-2">
              Ready to create your next visual showcase?
            </h3>
            <p className="text-sm text-zinc-400 font-light">
              Let's craft high-retention video editing, cinematic production, or motion graphics for your brand.
            </p>
          </div>
          <button
            onClick={() => onOpenInquiry('Commercial Production')}
            className="shrink-0 px-6 py-3 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-[#7C00FF] to-[#8B2CFF] shadow-lg shadow-[#7C00FF]/30 hover:opacity-95 transition-all"
          >
            Start Your Project
          </button>
        </div>
      </div>
    </div>
  );
};
