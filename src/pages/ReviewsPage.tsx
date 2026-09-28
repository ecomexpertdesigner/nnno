import React, { useState } from 'react';
import { TESTIMONIALS, Testimonial } from '../data/content.ts';
import { LazyImage } from '../components/LazyImage.tsx';
import {
  Star,
  Quote,
  MessageSquare,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Smartphone,
  ShieldCheck,
  Award,
} from 'lucide-react';

interface ReviewsPageProps {
  onOpenInquiry: (service?: string) => void;
}

interface ChatFeedback {
  id: string;
  name: string;
  avatar: string;
  roleOrTag: string;
  dateBadge: string;
  messages: string[];
}

const CHAT_FEEDBACK_ITEMS: ChatFeedback[] = [
  {
    id: 'chat-1',
    name: 'Abdul-Ahad',
    avatar: '/src/assets/images/regenerated_image_1790244876331.png',
    roleOrTag: 'Commercial Brand Film Client',
    dateBadge: 'Verified Project Delivery',
    messages: [
      'The video looks amazing! 🔥 You guys are really professional. Highly recommended!',
      'Honestly, this is exactly what I was looking for. Everything feels so much more premium now.',
    ],
  },
  {
    id: 'chat-2',
    name: 'Eman Arshad',
    avatar: '/src/assets/images/regenerated_image_1790244877953.png',
    roleOrTag: 'Viral Reels & Shorts Client',
    dateBadge: 'Verified Project Delivery',
    messages: [
      "Bro the edit is 🔥 Exactly what I wanted! You're really talented 👏",
      'Already getting crazy high retention on the first reel drop!',
    ],
  },
  {
    id: 'chat-3',
    name: 'Rafay Rauf',
    avatar: '/src/assets/images/regenerated_image_1790244879311.png',
    roleOrTag: 'ACES Color & Motion Design Client',
    dateBadge: 'Verified Project Delivery',
    messages: [
      'Amazing work! The quality is next level. Will definitely work again!',
      'Shared it with our entire executive team and everyone is blown away by the grade.',
    ],
  },
];

export const ReviewsPage: React.FC<ReviewsPageProps> = ({ onOpenInquiry }) => {
  const [filter, setFilter] = useState<'all' | 'editorial' | 'direct'>('all');

  return (
    <div className="pt-24 md:pt-32 pb-24 text-[#F5F5F7]">
      {/* Background ambient lighting */}
      <div
        className="fixed top-1/4 left-1/3 w-[500px] h-[500px] bg-[#7C00FF]/10 blur-[170px] pointer-events-none rounded-full -z-10"
        aria-hidden="true"
      />
      <div
        className="fixed bottom-1/4 right-1/4 w-[450px] h-[450px] bg-[#8B2CFF]/10 blur-[150px] pointer-events-none rounded-full -z-10"
        aria-hidden="true"
      />

      <div className="max-w-[1360px] mx-auto px-5 sm:px-8 lg:px-12">
        {/* Page Hero Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-zinc-800/80 pb-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900/90 border border-zinc-800 text-[11px] font-mono tracking-[0.2em] text-[#A855F7] uppercase mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-[#A855F7] animate-pulse" />
              <span>AUTHENTIC CLIENT REVIEWS</span>
            </div>

            <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl text-[#F5F5F7] tracking-tight leading-[1.05]">
              Real People. Real Feedback.
            </h1>

            <p className="mt-4 text-base sm:text-lg text-zinc-400 font-light leading-relaxed">
              Unfiltered feedback from founders, creative directors, and creators who trusted WG Media Production with their visual campaigns.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 p-1 bg-[#0C0D12] border border-zinc-800 rounded-xl self-start md:self-end">
            <button
              onClick={() => setFilter('all')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                filter === 'all'
                  ? 'bg-[#181A24] text-white shadow-sm border border-zinc-700/80'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              All Feedback
            </button>
            <button
              onClick={() => setFilter('editorial')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                filter === 'editorial'
                  ? 'bg-[#181A24] text-white shadow-sm border border-zinc-700/80'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Case Study Reviews
            </button>
            <button
              onClick={() => setFilter('direct')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                filter === 'direct'
                  ? 'bg-[#181A24] text-white shadow-sm border border-zinc-700/80'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Direct Client Messages
            </button>
          </div>
        </div>

        {/* Highlight Scorecard */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-16">
          <div className="p-6 rounded-2xl bg-[#090B10] border border-zinc-800/80 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-amber-400">
              <Star className="w-6 h-6 fill-current" />
            </div>
            <div>
              <div className="text-2xl font-bold font-display text-white">5.0 / 5.0</div>
              <div className="text-xs text-zinc-400 font-mono">Unanimous Client Satisfaction</div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-[#090B10] border border-zinc-800/80 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-[#A855F7]">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-bold font-display text-white">100% Genuine</div>
              <div className="text-xs text-zinc-400 font-mono">Direct From Actual Clients</div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-[#090B10] border border-zinc-800/80 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-[#C084FC]">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-bold font-display text-white">Punctual Delivery</div>
              <div className="text-xs text-zinc-400 font-mono">Delivered On or Ahead of Schedule</div>
            </div>
          </div>
        </div>

        {/* Section 1: In-Depth Editorial Reviews */}
        {(filter === 'all' || filter === 'editorial') && (
          <div className="mb-20">
            <div className="flex items-center gap-2 mb-8">
              <Quote className="w-4 h-4 text-[#A855F7]" />
              <h2 className="text-xs font-mono uppercase tracking-widest text-[#A855F7]">
                EDITORIAL CASE STUDY TESTIMONIALS
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {TESTIMONIALS.map((t) => (
                <div
                  key={t.id}
                  className="p-7 sm:p-8 rounded-2xl bg-[#090B10] border border-zinc-800/80 hover:border-[#8B2CFF]/60 hover:shadow-[0_0_25px_rgba(124,0,255,0.12)] transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    {/* Star Rating */}
                    <div className="flex items-center gap-1 text-amber-400 mb-5">
                      {[...Array(t.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>

                    {/* Review Quote */}
                    <p className="text-sm sm:text-base text-zinc-200 font-light leading-relaxed mb-6 italic">
                      "{t.text}"
                    </p>

                    {/* Project Tag */}
                    <div className="mb-6">
                      <span className="px-2.5 py-1 rounded-md bg-zinc-900 border border-zinc-800 text-[11px] font-mono text-[#C084FC]">
                        {t.projectType}
                      </span>
                    </div>
                  </div>

                  {/* Client Info */}
                  <div className="pt-6 border-t border-zinc-800/80 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center font-display font-semibold text-xs text-white">
                        {t.avatarText}
                      </div>
                      <div>
                        <div className="font-display font-bold text-sm text-white">{t.clientName}</div>
                        <div className="text-xs text-zinc-400">{t.role}</div>
                        <div className="text-[11px] text-zinc-500 font-mono">{t.company}</div>
                      </div>
                    </div>

                    <span className="text-[10px] font-mono text-zinc-500">{t.timeAgo}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section 2: Direct Client Message Feedbacks */}
        {(filter === 'all' || filter === 'direct') && (
          <div className="mb-20">
            <div className="flex items-center gap-2 mb-8">
              <MessageSquare className="w-4 h-4 text-[#A855F7]" />
              <h2 className="text-xs font-mono uppercase tracking-widest text-[#A855F7]">
                AUTHENTIC CLIENT DELIVERY CONVERSATIONS
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {CHAT_FEEDBACK_ITEMS.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl bg-[#090B10] border border-zinc-800/80 overflow-hidden flex flex-col justify-between"
                >
                  {/* Message Top Bar */}
                  <div className="p-4 bg-[#0F1118] border-b border-zinc-800 flex items-center gap-3">
                    <LazyImage
                      src={item.avatar}
                      alt={item.name}
                      wrapperClassName="w-10 h-10 rounded-full border border-zinc-700 shrink-0"
                      className="w-full h-full object-cover rounded-full"
                      rounded="rounded-full"
                    />
                    <div>
                      <div className="font-display font-bold text-sm text-white">{item.name}</div>
                      <div className="text-[11px] text-zinc-400 font-mono">{item.roleOrTag}</div>
                    </div>
                  </div>

                  {/* Messages Bubble Area */}
                  <div className="p-6 space-y-3 bg-[#06070B] flex-grow">
                    <div className="text-center mb-3">
                      <span className="text-[10px] font-mono text-zinc-500 px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800">
                        {item.dateBadge}
                      </span>
                    </div>

                    {item.messages.map((msg, i) => (
                      <div key={i} className="flex flex-col items-start">
                        <div className="px-4 py-2.5 rounded-2xl rounded-tl-sm bg-[#1A1D27] border border-zinc-800 text-xs sm:text-sm text-zinc-200 leading-relaxed max-w-[90%]">
                          {msg}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Verification Tag */}
                  <div className="p-3 bg-[#0C0E14] border-t border-zinc-800/80 flex items-center justify-between text-[11px] font-mono text-emerald-400">
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Verified Client Project</span>
                    </div>
                    <span className="text-zinc-500">WG Media</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CTA Banner */}
        <div className="p-8 sm:p-12 rounded-2xl bg-[#090B10] border border-zinc-800 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="font-display font-bold text-2xl text-white mb-2">
              Ready to command premium attention for your brand?
            </h3>
            <p className="text-sm text-zinc-400 font-light">
              Join the creators and companies scaling with WG Media Production.
            </p>
          </div>
          <button
            onClick={() => onOpenInquiry('Commercial Campaign')}
            className="shrink-0 px-6 py-3 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-[#7C00FF] to-[#8B2CFF] shadow-lg shadow-[#7C00FF]/30 hover:opacity-95 transition-all"
          >
            Start Your Project
          </button>
        </div>
      </div>
    </div>
  );
};
