import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare,
  Sparkles,
  X,
  Send,
  RotateCcw,
  ExternalLink,
  ChevronDown,
  ArrowRight,
  Phone,
  Film,
  Sliders,
  Layers,
  Calculator,
  CheckCircle2,
  Clock,
  Zap,
  HelpCircle,
  Minimize2,
} from 'lucide-react';
import {
  ChatMessage,
  INITIAL_GREETING,
  INITIAL_QUICK_PROMPTS,
  getSimulatedAIResponse,
} from '../data/chatKnowledge.ts';
import { AGENCY_CONTACT, SERVICES } from '../data/content.ts';

interface LiveChatProps {
  onOpenInquiry: (service?: string) => void;
  onNavigate: (page: string) => void;
}

export const LiveChat: React.FC<LiveChatProps> = ({ onOpenInquiry, onNavigate }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [hasUnread, setHasUnread] = useState<boolean>(true);
  const [inputMessage, setInputMessage] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [showCalculator, setShowCalculator] = useState<boolean>(false);

  // Instant Quote Calculator State
  const [calcService, setCalcService] = useState<'reel' | 'youtube' | 'commercial' | 'motion'>('reel');
  const [calcQuantity, setCalcQuantity] = useState<number>(1);
  const [calcWithSoundDesign, setCalcWithSoundDesign] = useState<boolean>(true);
  const [calcRush, setCalcRush] = useState<boolean>(false);

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = sessionStorage.getItem('wg_media_chat_history');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // fallback
    }
    return [INITIAL_GREETING];
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Persist messages in session
  useEffect(() => {
    try {
      sessionStorage.setItem('wg_media_chat_history', JSON.stringify(messages));
    } catch {
      // ignore
    }
  }, [messages]);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      // focus input
      setTimeout(() => inputRef.current?.focus(), 250);
    }
  }, [isOpen, messages, isTyping, showCalculator]);

  const handleToggleOpen = () => {
    setIsOpen((prev) => {
      const next = !prev;
      if (next) {
        setHasUnread(false);
      }
      return next;
    });
  };

  const handleResetChat = () => {
    setMessages([INITIAL_GREETING]);
    setShowCalculator(false);
    try {
      sessionStorage.removeItem('wg_media_chat_history');
    } catch {
      // ignore
    }
  };

  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || isTyping) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');

    // Check if user specifically requested calculator
    if (text.toLowerCase().includes('calculator') || text.toLowerCase().includes('estimate')) {
      setShowCalculator(true);
    }

    // Simulate AI thinking and response
    setIsTyping(true);

    const typingDelay = Math.min(1100, Math.max(550, text.length * 20));

    setTimeout(() => {
      const aiReply = getSimulatedAIResponse(text);

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: aiReply.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        action: aiReply.action,
        quickReplies: aiReply.quickReplies,
      };

      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);

      if (aiReply.action?.type === 'estimate') {
        setShowCalculator(true);
      }
    }, typingDelay);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleExecuteAction = (action: NonNullable<ChatMessage['action']>) => {
    if (action.type === 'inquiry') {
      setIsOpen(false);
      onOpenInquiry(action.payload || 'Video Editing');
    } else if (action.type === 'whatsapp') {
      window.open(action.payload || AGENCY_CONTACT.whatsappUrl, '_blank', 'noopener,noreferrer');
    } else if (action.type === 'navigate') {
      setIsOpen(false);
      onNavigate(action.payload || 'home');
    } else if (action.type === 'call') {
      window.location.href = AGENCY_CONTACT.tel;
    } else if (action.type === 'estimate') {
      setShowCalculator(true);
    }
  };

  // Calculate instant quote values
  const computeQuote = () => {
    let basePricePerUnit = 1500;
    let label = 'High-Retention Reel';

    if (calcService === 'reel') {
      basePricePerUnit = 1500;
      label = 'Vertical 9:16 High-Retention Reel';
    } else if (calcService === 'youtube') {
      basePricePerUnit = 4500;
      label = 'YouTube Long-Form Master Edit';
    } else if (calcService === 'commercial') {
      basePricePerUnit = 7500;
      label = 'Commercial Brand Ad / Film';
    } else if (calcService === 'motion') {
      basePricePerUnit = 2500;
      label = 'Kinetic 3D Motion Graphics';
    }

    let total = basePricePerUnit * calcQuantity;

    // Volume discount for 3+ or 5+
    let discountPercent = 0;
    if (calcQuantity >= 10) discountPercent = 20;
    else if (calcQuantity >= 5) discountPercent = 15;
    else if (calcQuantity >= 3) discountPercent = 10;

    if (discountPercent > 0) {
      total = total * (1 - discountPercent / 100);
    }

    // Sound design add-on
    const soundAddon = calcWithSoundDesign ? 700 * calcQuantity : 0;
    total += soundAddon;

    // Rush turnaround add-on (25%)
    if (calcRush) {
      total = Math.round(total * 1.25);
    }

    const estimatedDays = calcRush
      ? calcQuantity > 3 ? '2–3 Days' : '24–36 Hours'
      : calcQuantity > 3 ? '4–7 Days' : '2–4 Days';

    return {
      total: Math.round(total),
      label,
      discountPercent,
      estimatedDays,
    };
  };

  const quoteResult = computeQuote();

  const handleBookCalculatedQuote = () => {
    const serviceName =
      calcService === 'reel'
        ? 'Video Editing'
        : calcService === 'youtube'
        ? 'Video Editing'
        : calcService === 'commercial'
        ? 'Video Production'
        : 'Motion Graphics';

    setIsOpen(false);
    onOpenInquiry(serviceName);
  };

  const handleWhatsAppCalculatedQuote = () => {
    const text = encodeURIComponent(
      `Hello Waleed! I scoped a project on the WG Media Production AI Chat:\n` +
      `• Service: ${quoteResult.label}\n` +
      `• Quantity: ${calcQuantity} video(s)\n` +
      `• Custom Sound Design: ${calcWithSoundDesign ? 'Yes' : 'No'}\n` +
      `• Rush Turnaround: ${calcRush ? 'Yes (24–36h)' : 'Standard'}\n` +
      `• Estimated Investment: Rs. ${quoteResult.total.toLocaleString()}\n` +
      `• Target Delivery: ${quoteResult.estimatedDays}\n\nCan we discuss getting this scheduled?`
    );
    window.open(`https://wa.me/923327865342?text=${text}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <>
      {/* Floating Action Button (FAB) Area */}
      <div className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-40 flex flex-col items-end pointer-events-auto">
        {/* The Persistent Floating Button - Compact Symbol Only */}
        <motion.button
          type="button"
          onClick={handleToggleOpen}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          aria-label={isOpen ? 'Close Live Chat' : 'Open Live Chat'}
          aria-expanded={isOpen}
          className={`relative group w-12 h-12 sm:w-13 sm:h-13 rounded-full flex items-center justify-center transition-all duration-300 shadow-[0_8px_30px_rgba(0,0,0,0.6)] ${
            isOpen
              ? 'bg-[#121422] text-zinc-200 border border-violet-500/40 hover:bg-[#181B2E]'
              : 'bg-gradient-to-r from-[#7C00FF] via-[#8B2CFF] to-[#A855F7] text-white shadow-[0_0_24px_rgba(139,44,255,0.5)] hover:shadow-[0_0_36px_rgba(168,85,247,0.75)] border border-violet-400/40'
          }`}
        >
          {/* Animated Glow Halo */}
          {!isOpen && (
            <span
              className="absolute -inset-1 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 opacity-40 blur-md group-hover:opacity-80 transition duration-500 pointer-events-none"
              aria-hidden="true"
            />
          )}

          {/* Icon with online status beacon */}
          <div className="relative z-10 flex items-center justify-center">
            {isOpen ? (
              <X className="w-5 h-5 text-zinc-200" />
            ) : (
              <>
                <MessageSquare className="w-5 h-5 text-white" />
                <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 border border-[#050609]" />
                </span>
              </>
            )}
          </div>

          {/* Unread Ping Badge */}
          {hasUnread && !isOpen && (
            <span className="absolute top-1.5 right-1.5 z-10 flex h-2 w-2 rounded-full bg-amber-400 shadow-[0_0_8px_#F59E0B]" />
          )}
        </motion.button>
      </div>

      {/* Simulated AI Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 25, scale: 0.95 }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            className="fixed bottom-20 right-4 sm:bottom-24 sm:right-6 z-40 w-[calc(100vw-32px)] sm:w-[410px] h-[580px] max-h-[calc(100vh-120px)] bg-[#090B12]/95 backdrop-blur-2xl border border-violet-500/30 rounded-2xl shadow-[0_25px_70px_rgba(0,0,0,0.85),0_0_40px_rgba(124,0,255,0.2)] flex flex-col overflow-hidden text-[#F5F5F7]"
            role="dialog"
            aria-modal="true"
            aria-label="AI Live Chat Window"
          >
            {/* Ambient Background Glow */}
            <div
              className="absolute -top-24 -right-24 w-60 h-60 bg-[#7C00FF]/20 rounded-full blur-3xl pointer-events-none"
              aria-hidden="true"
            />
            <div
              className="absolute -bottom-24 -left-24 w-60 h-60 bg-[#8B2CFF]/15 rounded-full blur-3xl pointer-events-none"
              aria-hidden="true"
            />

            {/* Chat Window Header */}
            <div className="relative z-10 px-4 py-3.5 bg-[#0C0E18]/90 border-b border-violet-500/20 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {/* AI Producer Avatar */}
                <div className="relative w-9 h-9 rounded-xl bg-gradient-to-tr from-[#7C00FF] to-[#A855F7] p-0.5 shadow-[0_0_15px_rgba(139,44,255,0.4)] flex items-center justify-center">
                  <div className="w-full h-full bg-[#0C0E18] rounded-[10px] flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-[#C084FC]" />
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 border border-[#0C0E18]" />
                  </span>
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-display font-bold text-sm tracking-wide text-white">
                      Nova AI
                    </span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-violet-950/80 border border-violet-800/50 text-violet-300">
                      Studio Assistant
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-400 font-light flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    Online • Instant Answers
                  </p>
                </div>
              </div>

              {/* Action Buttons in Header */}
              <div className="flex items-center gap-1">
                {/* Reset Chat */}
                <button
                  type="button"
                  onClick={handleResetChat}
                  title="Reset conversation"
                  aria-label="Reset conversation"
                  className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/60 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                {/* Calculator Toggle */}
                <button
                  type="button"
                  onClick={() => setShowCalculator((prev) => !prev)}
                  title="Toggle Project Calculator"
                  aria-label="Toggle Project Calculator"
                  className={`p-1.5 rounded-lg transition-colors ${
                    showCalculator
                      ? 'text-violet-300 bg-violet-900/40 border border-violet-700/50'
                      : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/60'
                  }`}
                >
                  <Calculator className="w-4 h-4" />
                </button>

                {/* Close Button */}
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  title="Close chat window"
                  aria-label="Close chat window"
                  className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800/60 transition-colors ml-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Interactive Calculator Drawer (Collapsible within the chat) */}
            <AnimatePresence>
              {showCalculator && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="relative z-20 border-b border-violet-500/25 bg-[#0D0F1B]/95 px-4 py-3.5 overflow-hidden text-xs"
                >
                  <div className="flex items-center justify-between mb-2.5">
                    <div className="flex items-center gap-1.5 font-semibold text-white">
                      <Calculator className="w-3.5 h-3.5 text-[#C084FC]" />
                      <span>Instant Project Scoper</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowCalculator(false)}
                      className="text-zinc-400 hover:text-white"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Format Selector */}
                  <div className="grid grid-cols-2 gap-1.5 mb-2.5">
                    <button
                      type="button"
                      onClick={() => setCalcService('reel')}
                      className={`py-1.5 px-2 rounded-lg text-[11px] font-medium transition-all text-left flex items-center justify-between ${
                        calcService === 'reel'
                          ? 'bg-violet-600/30 border border-violet-500 text-white'
                          : 'bg-zinc-900/60 border border-zinc-800 text-zinc-300 hover:bg-zinc-800'
                      }`}
                    >
                      <span>Reels / Shorts (9:16)</span>
                      <span className="text-[10px] text-violet-300 font-mono">1.5k</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setCalcService('youtube')}
                      className={`py-1.5 px-2 rounded-lg text-[11px] font-medium transition-all text-left flex items-center justify-between ${
                        calcService === 'youtube'
                          ? 'bg-violet-600/30 border border-violet-500 text-white'
                          : 'bg-zinc-900/60 border border-zinc-800 text-zinc-300 hover:bg-zinc-800'
                      }`}
                    >
                      <span>YouTube Edit</span>
                      <span className="text-[10px] text-violet-300 font-mono">4.5k</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setCalcService('motion')}
                      className={`py-1.5 px-2 rounded-lg text-[11px] font-medium transition-all text-left flex items-center justify-between ${
                        calcService === 'motion'
                          ? 'bg-violet-600/30 border border-violet-500 text-white'
                          : 'bg-zinc-900/60 border border-zinc-800 text-zinc-300 hover:bg-zinc-800'
                      }`}
                    >
                      <span>Motion Graphics</span>
                      <span className="text-[10px] text-violet-300 font-mono">2.5k</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setCalcService('commercial')}
                      className={`py-1.5 px-2 rounded-lg text-[11px] font-medium transition-all text-left flex items-center justify-between ${
                        calcService === 'commercial'
                          ? 'bg-violet-600/30 border border-violet-500 text-white'
                          : 'bg-zinc-900/60 border border-zinc-800 text-zinc-300 hover:bg-zinc-800'
                      }`}
                    >
                      <span>Commercial Spot</span>
                      <span className="text-[10px] text-violet-300 font-mono">7.5k</span>
                    </button>
                  </div>

                  {/* Quantity & Toggles */}
                  <div className="flex items-center justify-between gap-2 mb-2 bg-zinc-900/70 p-2 rounded-lg border border-zinc-800">
                    <div className="flex items-center gap-2">
                      <span className="text-zinc-300 text-[11px]">Quantity:</span>
                      <div className="flex items-center gap-1 font-mono">
                        {[1, 3, 5, 10].map((num) => (
                          <button
                            key={num}
                            type="button"
                            onClick={() => setCalcQuantity(num)}
                            className={`w-6 h-6 rounded flex items-center justify-center text-[10px] transition-colors ${
                              calcQuantity === num
                                ? 'bg-violet-600 text-white font-bold'
                                : 'bg-zinc-800 text-zinc-400 hover:text-white'
                            }`}
                          >
                            {num}
                          </button>
                        ))}
                      </div>
                    </div>

                    <label className="flex items-center gap-1.5 cursor-pointer text-[11px] text-zinc-300">
                      <input
                        type="checkbox"
                        checked={calcRush}
                        onChange={(e) => setCalcRush(e.target.checked)}
                        className="rounded border-zinc-700 bg-zinc-800 text-violet-600 focus:ring-0"
                      />
                      <span className="flex items-center gap-0.5 text-amber-300 font-medium">
                        <Zap className="w-3 h-3" /> Rush 24h
                      </span>
                    </label>
                  </div>

                  {/* Sound Design Checkbox */}
                  <div className="flex items-center justify-between mb-3 text-[11px] text-zinc-300">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={calcWithSoundDesign}
                        onChange={(e) => setCalcWithSoundDesign(e.target.checked)}
                        className="rounded border-zinc-700 bg-zinc-800 text-violet-600 focus:ring-0"
                      />
                      <span>Include Multi-track Sound Design (+Rs. 700/vid)</span>
                    </label>
                  </div>

                  {/* Calculated Result Card */}
                  <div className="p-2.5 rounded-xl bg-violet-950/40 border border-violet-500/30 flex items-center justify-between gap-3">
                    <div>
                      <div className="text-[10px] text-zinc-400 uppercase tracking-wider font-mono">
                        Estimated Investment
                      </div>
                      <div className="text-base font-bold font-display text-white flex items-baseline gap-1.5">
                        <span>Rs. {quoteResult.total.toLocaleString()}</span>
                        {quoteResult.discountPercent > 0 && (
                          <span className="text-[10px] font-mono text-emerald-400 font-normal">
                            (-{quoteResult.discountPercent}% bulk discount)
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-zinc-400 flex items-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3 text-violet-400" />
                        <span>Ready in {quoteResult.estimatedDays}</span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1">
                      <button
                        type="button"
                        onClick={handleBookCalculatedQuote}
                        className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-medium text-[11px] transition-all shadow-[0_0_12px_rgba(139,44,255,0.4)] whitespace-nowrap"
                      >
                        Book This Scope
                      </button>
                      <button
                        type="button"
                        onClick={handleWhatsAppCalculatedQuote}
                        className="px-3 py-1 rounded-lg bg-emerald-950/60 border border-emerald-700/50 hover:bg-emerald-900/60 text-emerald-300 font-medium text-[10px] transition-colors whitespace-nowrap"
                      >
                        Send to WhatsApp
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Message Stream */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs font-sans selection:bg-[#7C00FF]/40">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${
                    msg.sender === 'user' ? 'items-end' : 'items-start'
                  }`}
                >
                  <div
                    className={`max-w-[88%] rounded-2xl px-3.5 py-2.5 leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-gradient-to-r from-[#7C00FF] to-[#9333EA] text-white rounded-br-sm shadow-[0_4px_16px_rgba(124,0,255,0.25)]'
                        : 'bg-[#121422] border border-zinc-800/90 text-zinc-200 rounded-bl-sm shadow-md'
                    }`}
                  >
                    {/* Message Body with Markdown formatting support */}
                    <div className="space-y-1.5 whitespace-pre-wrap break-words">
                      {msg.text.split('\n').map((line, idx) => {
                        // Handle bold markdown formatting like **word**
                        const parts = line.split(/(\*\*.*?\*\*)/g);
                        return (
                          <p key={idx} className={line.startsWith('•') ? 'pl-2' : ''}>
                            {parts.map((part, pIdx) => {
                              if (part.startsWith('**') && part.endsWith('**')) {
                                return (
                                  <strong key={pIdx} className="font-semibold text-white">
                                    {part.slice(2, -2)}
                                  </strong>
                                );
                              }
                              // Basic markdown link detection
                              const linkMatch = part.match(/\[(.*?)\]\((.*?)\)/);
                              if (linkMatch) {
                                return (
                                  <a
                                    key={pIdx}
                                    href={linkMatch[2]}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-violet-300 underline hover:text-white"
                                  >
                                    {linkMatch[1]}
                                  </a>
                                );
                              }
                              return part;
                            })}
                          </p>
                        );
                      })}
                    </div>

                    {/* Action Card Button attached to bot message */}
                    {msg.action && (
                      <div className="mt-3 pt-2.5 border-t border-white/10 flex flex-wrap gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleExecuteAction(msg.action!)}
                          className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-gradient-to-r from-violet-600/90 to-purple-600/90 hover:from-violet-500 hover:to-purple-500 text-white font-medium text-xs shadow-[0_2px_10px_rgba(124,0,255,0.35)] transition-all"
                        >
                          {msg.action.type === 'whatsapp' && <Phone className="w-3.5 h-3.5" />}
                          {msg.action.type === 'inquiry' && <Film className="w-3.5 h-3.5" />}
                          {msg.action.type === 'estimate' && <Calculator className="w-3.5 h-3.5" />}
                          <span>{msg.action.label}</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>

                  <span className="text-[10px] text-zinc-400 mt-1 px-1 font-mono">
                    {msg.timestamp}
                  </span>

                  {/* Contextual Quick Reply Chips */}
                  {msg.quickReplies && msg.quickReplies.length > 0 && msg.id === messages[messages.length - 1].id && !isTyping && (
                    <div className="mt-2.5 flex flex-wrap gap-1.5 max-w-[92%]">
                      {msg.quickReplies.map((reply, rIdx) => (
                        <button
                          key={rIdx}
                          type="button"
                          onClick={() => handleSendMessage(reply)}
                          className="px-2.5 py-1.5 rounded-full bg-zinc-900/90 border border-violet-500/25 hover:border-violet-400 text-zinc-300 hover:text-white hover:bg-violet-950/40 text-[11px] transition-all duration-150 flex items-center gap-1 shadow-sm"
                        >
                          <span>{reply}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {/* Typing indicator */}
              {isTyping && (
                <div className="flex items-center gap-2 text-zinc-400 text-[11px] bg-[#121422] border border-zinc-800/80 px-3 py-2 rounded-2xl rounded-bl-sm w-fit">
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-bounce" />
                  </div>
                  <span className="font-mono text-[10px] text-violet-300">Nova is scoping answer...</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Action Category Carousel */}
            {messages.length <= 2 && (
              <div className="px-4 py-2 border-t border-zinc-800/60 bg-[#0A0C14]/70">
                <div className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider mb-1.5">
                  Frequently Asked
                </div>
                <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none no-scrollbar">
                  {INITIAL_QUICK_PROMPTS.map((prompt) => (
                    <button
                      key={prompt.id}
                      type="button"
                      onClick={() => handleSendMessage(prompt.query)}
                      className="flex-shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-900/90 border border-zinc-800 hover:border-violet-500/50 text-zinc-300 hover:text-white text-[11px] transition-colors"
                    >
                      <span>{prompt.icon}</span>
                      <span>{prompt.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Form Bar */}
            <div className="p-3 bg-[#0B0D16] border-t border-violet-500/20">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-2"
              >
                <div className="relative flex-1">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask about pricing, turnaround, or scope..."
                    className="w-full bg-[#131625] border border-zinc-800 focus:border-violet-500 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-violet-500/50 transition-colors"
                  />
                  {inputMessage && (
                    <button
                      type="button"
                      onClick={() => setInputMessage('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={!inputMessage.trim() || isTyping}
                  aria-label="Send message"
                  className={`p-2.5 rounded-xl font-medium transition-all duration-200 flex items-center justify-center ${
                    inputMessage.trim() && !isTyping
                      ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-[0_0_15px_rgba(139,44,255,0.4)] hover:scale-105'
                      : 'bg-zinc-800/60 text-zinc-400 cursor-not-allowed'
                  }`}
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>

              {/* Status info caption */}
              <div className="mt-2 flex items-center justify-between text-[10px] text-zinc-400 font-mono">
                <span>Simulated AI Support • WG Media Production</span>
                <a
                  href={AGENCY_CONTACT.whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-violet-400 hover:text-violet-300 flex items-center gap-1"
                >
                  <span>WhatsApp</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
