import React, { useState } from 'react';
import { Logo } from './Logo.tsx';
import { Check, Copy, Mail, Phone } from 'lucide-react';

interface FooterProps {
  onOpenInquiry: (service?: string) => void;
  onNavigate?: (page: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenInquiry, onNavigate }) => {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);

  const handleCopyEmail = (e: React.MouseEvent) => {
    e.preventDefault();
    navigator.clipboard.writeText('waleedghangla@gmail.com');
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  const handleCopyPhone = (e: React.MouseEvent) => {
    e.preventDefault();
    navigator.clipboard.writeText('03327865342');
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2500);
  };

  const handlePageClick = (page: string) => {
    if (onNavigate) {
      onNavigate(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer className="relative bg-[#06070B] border-t border-zinc-900 pt-16 pb-12 text-zinc-400">
      <div className="max-w-[1360px] mx-auto px-5 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12 pb-16 border-b border-zinc-900">
          
          {/* Brand Info */}
          <div className="lg:col-span-5 flex flex-col items-start">
            <button
              onClick={() => handlePageClick('home')}
              className="text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8B2CFF] rounded-lg"
            >
              <Logo withTagline />
            </button>
            <p className="mt-5 text-sm text-zinc-400 font-light max-w-sm leading-relaxed">
              Creative production, editing and visual storytelling for brands that want to stand out.
            </p>

            {/* Direct Contact Pills */}
            <div className="mt-6 flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-3">
              {/* Email Pill */}
              <div className="flex items-center gap-1.5">
                <a
                  href="mailto:waleedghangla@gmail.com"
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#0C0D12] border border-zinc-800 text-xs font-mono text-zinc-300 hover:border-[#8B2CFF]/60 hover:text-white transition-all"
                  title="Send email to waleedghangla@gmail.com"
                >
                  <Mail className="w-3.5 h-3.5 text-[#A855F7]" />
                  <span>waleedghangla@gmail.com</span>
                </a>
                <button
                  onClick={handleCopyEmail}
                  className="p-2 rounded-lg bg-[#0C0D12] border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white transition-all"
                  title="Copy email address"
                  aria-label="Copy email address"
                >
                  {copiedEmail ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5 text-zinc-500" />
                  )}
                </button>
              </div>

              {/* Phone Pill */}
              <div className="flex items-center gap-1.5">
                <a
                  href="tel:03327865342"
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#0C0D12] border border-zinc-800 text-xs font-mono text-zinc-300 hover:border-[#8B2CFF]/60 hover:text-white transition-all"
                  title="Call 03327865342"
                >
                  <Phone className="w-3.5 h-3.5 text-[#A855F7]" />
                  <span>03327865342</span>
                </a>
                <button
                  onClick={handleCopyPhone}
                  className="p-2 rounded-lg bg-[#0C0D12] border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white transition-all"
                  title="Copy contact number"
                  aria-label="Copy contact number"
                >
                  {copiedPhone ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5 text-zinc-500" />
                  )}
                </button>
              </div>
            </div>

            {(copiedEmail || copiedPhone) && (
              <span className="text-xs text-emerald-400 font-mono mt-2 animate-in fade-in block">
                {copiedEmail ? 'Email copied: waleedghangla@gmail.com' : 'Contact number copied: 03327865342'}
              </span>
            )}
          </div>

          {/* Column: Explore */}
          <div className="lg:col-span-2 sm:col-span-1">
            <h4 className="text-xs font-mono uppercase tracking-widest text-[#F5F5F7] mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => handlePageClick('home')}
                  className="hover:text-white transition-colors text-left"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => handlePageClick('about')}
                  className="hover:text-white transition-colors text-left"
                >
                  About Us
                </button>
              </li>
              <li>
                <button
                  onClick={() => handlePageClick('projects')}
                  className="hover:text-white transition-colors text-left"
                >
                  Projects Showcase
                </button>
              </li>
              <li>
                <button
                  onClick={() => handlePageClick('team')}
                  className="hover:text-white transition-colors text-left"
                >
                  Team & Leadership
                </button>
              </li>
              <li>
                <button
                  onClick={() => handlePageClick('reviews')}
                  className="hover:text-white transition-colors text-left"
                >
                  Client Reviews
                </button>
              </li>
              <li>
                <button
                  onClick={() => handlePageClick('contact')}
                  className="hover:text-white transition-colors text-left"
                >
                  Contact Studio
                </button>
              </li>
            </ul>
          </div>

          {/* Column: Services */}
          <div className="lg:col-span-3 sm:col-span-1">
            <h4 className="text-xs font-mono uppercase tracking-widest text-[#F5F5F7] mb-4">
              Services
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => onOpenInquiry('Video Editing')}
                  className="hover:text-white transition-colors text-left"
                >
                  Video Editing
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenInquiry('Motion Graphics')}
                  className="hover:text-white transition-colors text-left"
                >
                  Motion Graphics & VFX
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenInquiry('Short-Form Content')}
                  className="hover:text-white transition-colors text-left"
                >
                  Short-Form Content
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenInquiry('Video Production')}
                  className="hover:text-white transition-colors text-left"
                >
                  Commercial Production
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenInquiry('Color Grading')}
                  className="hover:text-white transition-colors text-left"
                >
                  Color Grading & Audio Master
                </button>
              </li>
            </ul>
          </div>

          {/* Column: Connect & Contact */}
          <div className="lg:col-span-2">
            <h4 className="text-xs font-mono uppercase tracking-widest text-[#F5F5F7] mb-4">
              Direct Reach
            </h4>
            <div className="space-y-3 mb-5 text-xs font-mono">
              <div>
                <span className="text-zinc-500 block text-[10px] uppercase tracking-wider">Email</span>
                <a
                  href="mailto:waleedghangla@gmail.com"
                  className="text-zinc-300 hover:text-[#A855F7] transition-colors break-all"
                >
                  waleedghangla@gmail.com
                </a>
              </div>
              <div>
                <span className="text-zinc-500 block text-[10px] uppercase tracking-wider">Contact Number</span>
                <a
                  href="tel:03327865342"
                  className="text-zinc-300 hover:text-[#A855F7] transition-colors"
                >
                  03327865342
                </a>
              </div>
            </div>

            <h4 className="text-xs font-mono uppercase tracking-widest text-[#F5F5F7] mb-3">
              Social
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  YouTube
                </a>
              </li>
              <li>
                <a
                  href="https://vimeo.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Vimeo Pro
                </a>
              </li>
              <li>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  LinkedIn
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-zinc-500">
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <span>© 2026 WG Media Production. All rights reserved.</span>
            <button
              onClick={() => handlePageClick('admin')}
              className="text-zinc-600 hover:text-zinc-300 transition-colors cursor-pointer text-xs font-mono"
            >
              Admin Login
            </button>
          </div>
          <div className="flex flex-wrap items-center gap-6 pr-16 sm:pr-20">
            <span>Creative Visuals · Powerful Stories</span>
            <span>Studio HQ: Los Angeles & Remote Global</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
