import React, { useState } from 'react';
import { PROJECTS, Project, PortfolioCategory } from '../data/content.ts';
import { VideoPlayer } from './VideoPlayer.tsx';
import { LazyImage } from './LazyImage.tsx';
import { ArrowUpRight, Play, Eye } from 'lucide-react';

interface SelectedWorkProps {
  onSelectProject: (project: Project) => void;
}

export const SelectedWork: React.FC<SelectedWorkProps> = ({ onSelectProject }) => {
  const [selectedFilter, setSelectedFilter] = useState<PortfolioCategory>('all');
  const [showAllMobile, setShowAllMobile] = useState<boolean>(false);

  const filterTabs: { label: string; value: PortfolioCategory }[] = [
    { label: 'All Projects', value: 'all' },
    { label: 'Before & After', value: 'before-after' },
    { label: 'Video Editing', value: 'video-editing' },
    { label: 'Motion Graphics', value: 'motion-graphics' },
    { label: 'Sound Design', value: 'sound-design' },
    { label: 'Graphic Design', value: 'graphic-design' },
  ];

  const filteredProjects = selectedFilter === 'all'
    ? PROJECTS
    : PROJECTS.filter((p) => p.filterCategories?.includes(selectedFilter));

  const handleFilterChange = (val: PortfolioCategory) => {
    setSelectedFilter(val);
    setShowAllMobile(false);
  };

  return (
    <section id="work" className="relative py-24 md:py-32 scroll-mt-20">
      {/* Background ambient lighting */}
      <div
        className="absolute top-1/3 left-0 w-[450px] h-[450px] bg-[#7C00FF]/10 blur-[130px] pointer-events-none rounded-full"
        aria-hidden="true"
      />

      <div className="max-w-[1360px] mx-auto px-5 sm:px-8 lg:px-12">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-zinc-800/80 pb-8">
          <div className="flex flex-col items-start max-w-2xl">
            <span className="text-xs font-mono uppercase tracking-widest text-[#A855F7] mb-3">
              SELECTED WORK
            </span>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl text-[#F5F5F7] tracking-tight">
              Stories We've Brought to Life
            </h2>
            <p className="mt-4 text-base text-zinc-400 font-light leading-relaxed">
              A selection of commercial, social and cinematic work created to capture attention and drive results.
            </p>
          </div>

          {/* Interactive Filter Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-[#0C0D12] border border-zinc-800 rounded-xl max-w-full overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {filterTabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => handleFilterChange(tab.value)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 whitespace-nowrap cursor-pointer ${
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

        {/* Balanced Editorial Portfolio Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8 items-stretch">
          {filteredProjects.map((project, idx) => {
            // Intentional editorial layout logic:
            // Alternates large & small within each row (Large + Small, then Small + Large)
            // Desktop: 8 cols / 4 cols (or centered for single-item)
            // Tablet: 7 cols / 5 cols (hierarchical yet comfortable for content)
            // Mobile: 12 cols (clean single-column stack)
            const total = filteredProjects.length;
            let isLarge = true;
            let colSpan = 'col-span-12 md:col-span-7 lg:col-span-8';

            if (total === 1) {
              isLarge = true;
              colSpan = 'col-span-12 max-w-4xl mx-auto w-full';
            } else if (idx === total - 1 && idx % 2 === 0) {
              // Gracefully handle a lone last item in odd-numbered filtered lists
              isLarge = true;
              colSpan = 'col-span-12 md:col-span-10 md:col-start-2 lg:col-span-8 lg:col-start-3';
            } else {
              const pairIndex = Math.floor(idx / 2);
              const isFirstInPair = idx % 2 === 0;
              // Even rows (0, 2): Large then Small
              // Odd rows (1, 3): Small then Large
              isLarge = pairIndex % 2 === 0 ? isFirstInPair : !isFirstInPair;
              colSpan = isLarge
                ? 'col-span-12 md:col-span-7 lg:col-span-8'
                : 'col-span-12 md:col-span-5 lg:col-span-4';
            }

            const isHiddenOnMobile = idx >= 4 && !showAllMobile;

            return (
              <div
                key={project.id}
                className={`${colSpan} group ${isHiddenOnMobile ? 'hidden md:flex' : 'flex'} flex-col justify-between rounded-2xl bg-[#090B10] border border-zinc-800/80 hover:border-[#8B2CFF]/60 hover:shadow-[0_0_30px_rgba(124,0,255,0.15)] transition-all duration-500 overflow-hidden relative`}
              >
                {/* Media Container: Real Video Player or Image Showcase */}
                {project.videoUrl ? (
                  <div className="relative w-full h-[260px] sm:h-[320px] md:h-[380px] lg:h-[420px] xl:h-[460px] overflow-hidden bg-black rounded-t-2xl">
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
                    className="relative w-full h-[260px] sm:h-[320px] md:h-[380px] lg:h-[420px] xl:h-[460px] overflow-hidden bg-zinc-950 cursor-pointer"
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
                      referrerPolicy="no-referrer"
                    />

                    {/* Gradient Scrim for Contrast */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#090B10] via-black/30 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-300 pointer-events-none" />

                    {/* Top-Right Play Indicator Affordance */}
                    <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/60 backdrop-blur-md border border-white/15 flex items-center justify-center text-zinc-300 group-hover:bg-[#8B2CFF] group-hover:text-white group-hover:scale-110 transition-all duration-300 shadow-lg pointer-events-none">
                      <Play className="w-3.5 h-3.5 ml-0.5 fill-current" />
                    </div>

                    {/* View Details Tag */}
                    <div className="absolute top-4 left-4 flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-md border border-white/10 text-[11px] font-mono text-zinc-300 pointer-events-none">
                      <Eye className="w-3 h-3 text-[#A855F7]" />
                      <span>Watch Reel</span>
                    </div>

                    {/* Bottom Stats Overlay inside image */}
                    <div className="absolute bottom-3 left-4 text-xs font-mono text-zinc-400 pointer-events-none">
                      <span className="text-[#C084FC]">{project.stats}</span>
                    </div>
                  </div>
                )}

                {/* Card Content & Details */}
                <div className="p-6 sm:p-7 flex flex-col justify-between flex-grow">
                  <div>
                    {/* Unboxed Metadata Line with subtle separator */}
                    <div className="flex items-center gap-2 text-xs font-medium text-[#A855F7] mb-2 uppercase tracking-wider">
                      <span>{project.category}</span>
                      {project.service && (
                        <>
                          <span className="text-zinc-600">·</span>
                          <span className="text-zinc-300 font-normal">{project.service}</span>
                        </>
                      )}
                      <span className="text-zinc-600">·</span>
                      <span className="text-zinc-400 normal-case font-normal font-mono">{project.duration}</span>
                    </div>

                    {/* Title with subtle hover translation */}
                    <h3 className="font-display font-bold text-xl sm:text-2xl text-[#F5F5F7] group-hover:text-white group-hover:translate-x-1 transition-all duration-300 flex items-center justify-between">
                      <span>{project.title}</span>
                      <ArrowUpRight className="w-5 h-5 text-zinc-500 group-hover:text-[#A855F7] group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300" />
                    </h3>

                    <p className="mt-2 text-sm text-zinc-400 font-light line-clamp-3 leading-relaxed">
                      {project.tagline && (
                        <span className="text-zinc-200 font-normal block mb-1">
                          {project.tagline}
                        </span>
                      )}
                      {project.description}
                    </p>
                  </div>

                  {/* Deliverables snippet */}
                  <div className="mt-5 pt-4 border-t border-zinc-800/80 flex flex-wrap gap-2 text-[11px] text-zinc-400">
                    {project.deliverables.slice(0, 3).map((item) => (
                      <span key={item} className="px-2 py-0.5 rounded bg-[#11131A] text-zinc-300 border border-zinc-800">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Animated Bottom Violet Accent Hairline on Hover */}
                <div className="w-full h-[2px] bg-gradient-to-r from-transparent via-[#8B2CFF] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            );
          })}
        </div>

        {/* Mobile-Only: Simple down small arrow ⬇️ to see all projects in project section */}
        {filteredProjects.length > 4 && !showAllMobile && (
          <div className="md:hidden mt-8 flex flex-col items-center justify-center text-center">
            <button
              type="button"
              onClick={() => setShowAllMobile(true)}
              className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-700/80 hover:border-[#8B2CFF]/80 text-zinc-200 hover:text-white shadow-[0_0_20px_rgba(139,44,255,0.2)] transition-all duration-300 active:scale-95 text-xs font-semibold uppercase tracking-wider"
              aria-label="See all projects"
            >
              <span>See all projects</span>
              <span className="text-sm select-none inline-block animate-bounce" aria-hidden="true">
                ⬇️
              </span>
            </button>
            <p className="mt-2 text-[11px] text-zinc-500 font-mono tracking-wide">
              +{filteredProjects.length - 4} more projects
            </p>
          </div>
        )}

        {filteredProjects.length > 4 && showAllMobile && (
          <div className="md:hidden mt-8 flex justify-center">
            <button
              type="button"
              onClick={() => {
                setShowAllMobile(false);
                const workEl = document.getElementById('work');
                if (workEl) {
                  workEl.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="group inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-zinc-200 text-xs font-medium uppercase tracking-wider transition-all duration-200 active:scale-95"
              aria-label="Show fewer projects"
            >
              <span>Show less</span>
              <span className="text-xs select-none">⬆️</span>
            </button>
          </div>
        )}

      </div>
    </section>
  );
};
