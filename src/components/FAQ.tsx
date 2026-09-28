import React, { useState } from 'react';
import {
  ChevronDown,
  Clock,
  Sparkles,
  Layers,
  FileCheck,
  ShieldCheck,
  Film,
  ArrowRight,
  MessageCircle,
} from 'lucide-react';

interface FAQItem {
  id: string;
  category: 'timelines' | 'deliverables' | 'process' | 'revisions';
  categoryLabel: string;
  question: string;
  answer: string;
  badge?: string;
}

interface FAQProps {
  onOpenInquiry: (initialService?: string) => void;
}

const FAQ_DATA: FAQItem[] = [
  {
    id: 'faq-turnaround',
    category: 'timelines',
    categoryLabel: 'Timelines',
    question: 'What is your turnaround time for video editing and commercial productions?',
    answer:
      'Turnaround depends on project scope. High-impact short-form reels, TikToks, and YouTube cuts are delivered in 48–72 hours. Full commercial productions and brand films typically require 7–14 business days from production wrap to final mastered delivery. Expedited 24-hour rush turnarounds are available for time-sensitive product drops.',
  },
  {
    id: 'faq-revisions',
    category: 'revisions',
    categoryLabel: 'Process & Revisions',
    question: 'How do you handle revisions and client feedback?',
    answer:
      'We use professional frame-accurate review links (Frame.io) where your team can pause, draw on screen, and leave exact time-stamped feedback. Every package includes 2 to 3 structured revision rounds. Over 90% of our projects are approved on the first or second cut because we lock in creative treatments beforehand.',
  },
  {
    id: 'faq-deliverables',
    category: 'deliverables',
    categoryLabel: 'Deliverables & Formats',
    question: 'What master formats and aspect ratios will we receive?',
    answer:
      'You receive full-resolution 4K ProRes 422 HQ masters, web-optimized H.264/H.265 exports, and tailored platform aspect ratios: 16:9 widescreen (YouTube/Broadcast), 9:16 vertical (Instagram Reels, Shorts, TikTok), and 1:1 or 4:5 square. We also provide clean textless masters for international syndication and split audio stems (Dialogue, SFX, Licensed Music).',
  },
  {
    id: 'faq-concept',
    category: 'process',
    categoryLabel: 'Creative Process',
    question: 'Do we need a completed script and storyboard before contacting you?',
    answer:
      'Not at all. We handle end-to-end creative direction. Whether you have an existing script or just a high-level marketing goal, our directors craft the treatment, hooks, shot list, and visual storyboard for your sign-off before a single frame is filmed or edited.',
  },
  {
    id: 'faq-raw-footage',
    category: 'deliverables',
    categoryLabel: 'Deliverables & Formats',
    question: 'Can we receive the raw unedited camera footage and project archives?',
    answer:
      'Yes. Raw cinema camera footage (RED/ARRI RAW or 10-bit ProRes log files) and complete editable timeline archives (DaVinci Resolve / Premiere Pro project packages) can be bundled and transferred via high-speed encrypted cloud transfer or physical SSD dispatch.',
  },
  {
    id: 'faq-nda',
    category: 'process',
    categoryLabel: 'Security & Trust',
    question: 'Can you sign an NDA before we share unreleased products or concepts?',
    answer:
      'Absolutely. More than half of our commercial projects and tech product campaigns are produced under strict mutual Non-Disclosure Agreements (NDAs). We maintain air-gapped local RAID storage and secure password-protected review pipelines until your official launch day.',
  },
  {
    id: 'faq-standards',
    category: 'deliverables',
    categoryLabel: 'Quality Standards',
    question: 'What color science and audio mastering standards do you use?',
    answer:
      'All footage is graded in an ACES color-managed workflow using calibrated OLED broadcast monitors to guarantee color consistency across iPhone screens, OLED TVs, and cinema projectors. Audio is mixed and mastered to international broadcast specifications (-14 LUFS integrated for streaming; -24 LKFS for TV).',
  },
];

type CategoryFilter = 'all' | 'timelines' | 'deliverables' | 'process' | 'revisions';

export const FAQ: React.FC<FAQProps> = ({ onOpenInquiry }) => {
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('all');
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({
    'faq-turnaround': true, // Open the first item by default
  });

  const toggleItem = (id: string) => {
    setOpenItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const filteredFaqs =
    activeCategory === 'all'
      ? FAQ_DATA
      : FAQ_DATA.filter((item) => item.category === activeCategory);

  const categories: { key: CategoryFilter; label: string }[] = [
    { key: 'all', label: 'All Questions' },
    { key: 'timelines', label: 'Timelines & Rush' },
    { key: 'deliverables', label: 'Deliverables & Formats' },
    { key: 'process', label: 'Creative Process' },
    { key: 'revisions', label: 'Revisions & Feedback' },
  ];

  return (
    <section id="faq" className="relative py-24 md:py-32 scroll-mt-20 bg-[#06080D] border-t border-zinc-900 overflow-hidden">
      {/* Ambient background glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] bg-[#7C00FF]/5 blur-[160px] pointer-events-none rounded-full"
        aria-hidden="true"
      />

      <div className="max-w-[1100px] mx-auto px-5 sm:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#A855F7] block mb-2.5 font-medium">
            FREQUENTLY ASKED QUESTIONS
          </span>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl text-[#F5F5F7] tracking-tight">
            Everything You Need To Know
          </h2>
          <p className="mt-4 text-sm sm:text-base text-zinc-400 font-light leading-relaxed">
            Transparent answers on our production workflow, turnaround times, master deliverables, and collaboration standards.
          </p>
        </div>

        {/* Category Filter Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10 sm:mb-12">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.key;
            return (
              <button
                key={cat.key}
                type="button"
                onClick={() => setActiveCategory(cat.key)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-[#7C00FF] text-white shadow-[0_0_20px_rgba(124,0,255,0.4)] border border-[#A855F7]'
                    : 'bg-[#0E1017] text-zinc-400 hover:text-zinc-200 border border-zinc-800/80 hover:border-zinc-700'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Accordion FAQ List */}
        <div className="space-y-3.5 sm:space-y-4">
          {filteredFaqs.map((faq, index) => {
            const isOpen = !!openItems[faq.id];
            return (
              <div
                key={faq.id}
                className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                  isOpen
                    ? 'bg-[#0A0D15] border-[#8B2CFF]/50 shadow-[0_4px_30px_rgba(124,0,255,0.12)]'
                    : 'bg-[#090B10]/80 border-zinc-800/80 hover:border-zinc-700 hover:bg-[#0C0F17]'
                }`}
              >
                {/* Accordion Question Header */}
                <button
                  type="button"
                  onClick={() => toggleItem(faq.id)}
                  aria-expanded={isOpen}
                  className="w-full px-5 sm:px-7 py-5 text-left flex items-center justify-between gap-4 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8B2CFF]"
                >
                  <div className="flex items-center gap-3 sm:gap-4 pr-2">
                    <span className="text-xs font-mono text-zinc-500 shrink-0">
                      0{index + 1}
                    </span>
                    <h3 className="font-display font-semibold text-base sm:text-lg text-white tracking-tight">
                      {faq.question}
                    </h3>
                  </div>

                  {/* Indicator Icon with smooth rotation */}
                  <div
                    className={`w-8 h-8 rounded-full border flex items-center justify-center shrink-0 transition-all duration-300 ${
                      isOpen
                        ? 'bg-[#7C00FF] border-[#A855F7] text-white rotate-180 shadow-[0_0_12px_rgba(124,0,255,0.4)]'
                        : 'bg-zinc-900 border-zinc-800 text-zinc-400'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {/* Collapsible Answer Body */}
                {isOpen && (
                  <div className="px-5 sm:px-7 pb-6 pt-1 animate-fade-in border-t border-white/5">
                    <div className="text-xs font-mono uppercase tracking-wider text-[#A855F7] mb-2">
                      {faq.categoryLabel}
                    </div>
                    <p className="text-sm sm:text-[15px] text-zinc-300 font-light leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom "Still have a question?" Conversion Card */}
        <div className="mt-14 sm:mt-16 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-[#0C0F18] via-[#101422] to-[#0C0F18] border border-zinc-800/90 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="w-12 h-12 rounded-xl bg-[#7C00FF]/15 border border-[#8B2CFF]/40 flex items-center justify-center text-[#C084FC] shrink-0 hidden sm:flex">
              <MessageCircle className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-display font-bold text-base sm:text-lg text-white">
                Have a unique project or custom scope?
              </h4>
              <p className="text-xs sm:text-sm text-zinc-400 font-light mt-1">
                We craft tailored production pipelines for brands, creators, and agencies.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onOpenInquiry('Custom Scope & Timeline Inquiry')}
            className="group inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#7C00FF] to-[#9333EA] hover:from-[#8B2CFF] hover:to-[#A855F7] text-white text-xs sm:text-sm font-semibold tracking-wide shadow-[0_0_25px_rgba(124,0,255,0.4)] transition-all cursor-pointer whitespace-nowrap shrink-0"
          >
            <span>Ask Us Directly</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
};
