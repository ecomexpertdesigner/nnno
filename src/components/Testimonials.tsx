import React, { useState } from 'react';
import { LazyImage } from './LazyImage.tsx';
import {
  ChevronLeft,
  Video,
  Phone,
  CheckCheck,
  Smile,
  Mic,
  Plus,
  Wifi,
  Battery,
  Signal,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

interface TestimonialsProps {
  onViewAll?: () => void;
}

interface ChatMessage {
  sender: 'client' | 'business';
  text: string;
  time: string;
}

interface PhoneTestimonial {
  id: string;
  clientName: string;
  statusText: string;
  avatar: string;
  time: string;
  dateBadge: string;
  batteryLevel: string;
  messages: ChatMessage[];
  projectTag: string;
}

const CHAT_DATA: PhoneTestimonial[] = [
  {
    id: 'chat-1',
    clientName: 'Abdul-Ahad',
    statusText: 'online',
    avatar: '/src/assets/images/regenerated_image_1790244876331.png',
    time: '10:24',
    dateBadge: 'Today',
    batteryLevel: '89%',
    projectTag: 'Commercial Brand Film',
    messages: [
      {
        sender: 'client',
        text: 'The video looks amazing! 🔥 You guys are really professional. Highly recommended!',
        time: '10:24 AM',
      },
      {
        sender: 'business',
        text: "Thank you so much! We're glad you liked it! 🙏",
        time: '10:26 AM',
      },
      {
        sender: 'client',
        text: 'Honestly, this is exactly what I was looking for. Everything feels so much more premium now.',
        time: '10:28 AM',
      },
    ],
  },
  {
    id: 'chat-2',
    clientName: 'Eman Arshad',
    statusText: 'online',
    avatar: '/src/assets/images/regenerated_image_1790244877953.png',
    time: '9:42',
    dateBadge: 'Today',
    batteryLevel: '94%',
    projectTag: 'Viral Reels & Shorts Pacing',
    messages: [
      {
        sender: 'client',
        text: "Bro the edit is 🔥 Exactly what I wanted! You're really talented 👏",
        time: '9:42 PM',
      },
      {
        sender: 'business',
        text: "Means a lot! Glad you're happy! 😊",
        time: '9:45 PM',
      },
      {
        sender: 'client',
        text: 'Already getting crazy high retention on the first reel drop!',
        time: '9:47 PM',
      },
    ],
  },
  {
    id: 'chat-3',
    clientName: 'Rafay Rauf',
    statusText: 'online',
    avatar: '/src/assets/images/regenerated_image_1790244879311.png',
    time: '8:17',
    dateBadge: 'Today',
    batteryLevel: '78%',
    projectTag: 'ACES Color & Motion Design',
    messages: [
      {
        sender: 'client',
        text: 'Amazing work! The quality is next level. Will definitely work again!',
        time: '8:17 PM',
      },
      {
        sender: 'business',
        text: 'Thanks a lot! Looking forward to our next project. 🤝',
        time: '8:20 PM',
      },
      {
        sender: 'client',
        text: 'Shared it with our entire executive team and everyone is blown away by the grade.',
        time: '8:22 PM',
      },
    ],
  },
];

export const Testimonials: React.FC<TestimonialsProps> = ({ onViewAll }) => {
  const [activeTab, setActiveTab] = useState<number>(0);

  return (
    <section
      id="feedback"
      className="relative py-24 md:py-32 scroll-mt-20 border-t border-zinc-900 bg-[#06080D] overflow-hidden"
    >
      {/* Soft Ambient Radial Glow behind the smartphone cards */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[550px] bg-[#7C00FF]/10 blur-[180px] pointer-events-none rounded-full"
        aria-hidden="true"
      />

      <div className="max-w-[1360px] mx-auto px-5 sm:px-8 lg:px-12 relative z-10">
        {/* Section Header: Heading (Left) + View All Link (Right) */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12 lg:mb-16">
          <div>
            <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#A855F7] block mb-2 font-medium">
              CLIENT TESTIMONIALS
            </span>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl text-[#F5F5F7] tracking-tight">
              Real People. Real Feedback.
            </h2>
          </div>

          <button
            onClick={onViewAll}
            className="group inline-flex items-center gap-1.5 text-sm font-medium text-[#C084FC] hover:text-white transition-colors duration-200 self-start sm:self-end pb-1"
          >
            <span>View All</span>
            <ArrowRight className="w-4 h-4 text-[#A855F7] group-hover:translate-x-1 transition-transform duration-200" />
          </button>
        </div>

        {/* 3 Smartphone Testimonial Cards Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 justify-items-center">
          {CHAT_DATA.map((item, idx) => (
            <div
              key={item.id}
              className="w-full max-w-[360px] sm:max-w-[375px] rounded-[2.5rem] sm:rounded-[2.85rem] border border-purple-500/25 bg-[#07090F] p-2.5 sm:p-3 shadow-[0_16px_50px_rgba(0,0,0,0.85),0_0_30px_rgba(124,0,255,0.12)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.9),0_0_45px_rgba(147,51,234,0.32)] hover:border-purple-500/60 hover:-translate-y-2 transition-all duration-300 group flex flex-col justify-between select-none relative"
            >
              {/* Subtle top chassis highlight */}
              <div className="absolute top-0 left-12 right-12 h-[1px] bg-gradient-to-r from-transparent via-purple-400/40 to-transparent pointer-events-none" />

              {/* Inner Smartphone Screen */}
              <div className="w-full rounded-[2.1rem] sm:rounded-[2.35rem] bg-[#0A0D15] border border-white/5 flex flex-col justify-between overflow-hidden h-[540px] sm:h-[570px] relative">
                
                {/* 1. Modern Status Bar */}
                <div className="px-5 pt-3 pb-1 flex items-center justify-between text-[11px] font-medium text-zinc-300">
                  {/* Left Time */}
                  <span className="font-semibold tracking-tight">{item.time}</span>

                  {/* Center Dynamic Island Notch */}
                  <div className="w-20 h-4 bg-black rounded-full border border-white/10 flex items-center justify-end px-1.5 gap-1 shadow-inner">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/80 animate-pulse" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#18181B]" />
                  </div>

                  {/* Right Network & Battery Icons */}
                  <div className="flex items-center gap-1.5 text-zinc-300">
                    <Signal className="w-3 h-3 stroke-[2.2]" />
                    <Wifi className="w-3 h-3 stroke-[2.2]" />
                    <div className="flex items-center gap-0.5">
                      <span className="text-[10px] text-zinc-400 font-mono">{item.batteryLevel}</span>
                      <Battery className="w-3.5 h-3.5 stroke-[2]" />
                    </div>
                  </div>
                </div>

                {/* 2. Chat Navigation Bar */}
                <div className="px-3.5 py-2.5 border-b border-white/5 bg-[#0C101A]/80 backdrop-blur-md flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      className="text-zinc-400 hover:text-white transition-colors p-0.5 -ml-1"
                      aria-label="Back"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>

                    {/* Circular Client Avatar with Online Dot and blur-up */}
                    <div className="relative shrink-0">
                      <LazyImage
                        src={item.avatar}
                        alt={item.clientName}
                        wrapperClassName="w-8 h-8 rounded-full border border-white/15"
                        className="w-full h-full object-cover rounded-full"
                        rounded="rounded-full"
                      />
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-[#0A0D15] z-10" />
                    </div>

                    {/* Client Name & Status */}
                    <div className="flex flex-col text-left">
                      <div className="flex items-center gap-1">
                        <span className="text-xs font-semibold text-white tracking-tight">
                          {item.clientName}
                        </span>
                      </div>
                      <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1 leading-none">
                        <span>online</span>
                      </span>
                    </div>
                  </div>

                  {/* Top Right Call Icons */}
                  <div className="flex items-center gap-3 text-zinc-400">
                    <button
                      type="button"
                      className="hover:text-white transition-colors"
                      aria-label="Video Call"
                    >
                      <Video className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      className="hover:text-white transition-colors"
                      aria-label="Audio Call"
                    >
                      <Phone className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* 3. Messages Conversation Flow */}
                <div className="p-3.5 sm:p-4 flex flex-col gap-3 overflow-y-auto flex-grow justify-start">
                  {/* Subtle Date Tag */}
                  <div className="flex justify-center my-0.5">
                    <span className="px-2.5 py-0.5 rounded-full bg-zinc-900/90 border border-white/5 text-[10px] font-mono text-zinc-400">
                      {item.dateBadge}
                    </span>
                  </div>

                  {item.messages.map((msg, mIdx) => {
                    const isClient = msg.sender === 'client';
                    return (
                      <div
                        key={mIdx}
                        className={`flex flex-col ${
                          isClient ? 'items-start' : 'items-end'
                        }`}
                      >
                        <div
                          className={`max-w-[85%] rounded-2xl p-3 sm:p-3.5 text-xs sm:text-[13px] leading-relaxed relative shadow-md ${
                            isClient
                              ? 'bg-[#181E29] text-zinc-100 rounded-tl-sm border border-white/5'
                              : 'bg-[#0E3D26] text-white rounded-tr-sm border border-emerald-500/20'
                          }`}
                        >
                          <p className="font-light pr-1">{msg.text}</p>

                          {/* Message Timestamp & Status Indicator */}
                          <div
                            className={`flex items-center justify-end gap-1 mt-1 text-[10px] ${
                              isClient ? 'text-zinc-400' : 'text-emerald-300'
                            }`}
                          >
                            <span>{msg.time}</span>
                            {!isClient && (
                              <CheckCheck className="w-3.5 h-3.5 text-[#38BDF8]" />
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* 4. Bottom Interactive Chat Input Bar */}
                <div className="p-2.5 bg-[#0C101A] border-t border-white/5 flex flex-col gap-1.5">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      className="w-7 h-7 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-400 hover:text-white"
                      aria-label="Add attachment"
                    >
                      <Plus className="w-4 h-4" />
                    </button>

                    <div className="flex-grow flex items-center justify-between px-3 py-1.5 rounded-full bg-[#141923] border border-white/5 text-xs text-zinc-500">
                      <span className="text-[11px]">Message...</span>
                      <Smile className="w-3.5 h-3.5 text-zinc-500 hover:text-zinc-300 cursor-pointer" />
                    </div>

                    <button
                      type="button"
                      className="w-7 h-7 rounded-full bg-[#7C00FF]/30 hover:bg-[#7C00FF] text-[#C084FC] hover:text-white flex items-center justify-center transition-colors"
                      aria-label="Voice note"
                    >
                      <Mic className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Smartphone Home Indicator Gesture Bar */}
                  <div className="w-24 h-1 bg-white/20 rounded-full mx-auto mt-1" />
                </div>
              </div>

              {/* Bottom Project Tag Banner */}
              <div className="pt-2 px-2 flex items-center justify-between text-[11px] font-mono text-zinc-400">
                <span className="text-zinc-400 truncate">{item.projectTag}</span>
                <span className="text-emerald-400 flex items-center gap-1 shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Verified
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Subtle Sample Disclaimer Footer */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0C0E17] border border-zinc-800/80 text-xs font-mono text-zinc-400">
            <Sparkles className="w-3.5 h-3.5 text-[#A855F7]" />
            <span>Sample client conversations · Demonstrating actual agency communication workflows</span>
          </div>
        </div>

      </div>
    </section>
  );
};
