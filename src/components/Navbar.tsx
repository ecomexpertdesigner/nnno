import React, { useState, useEffect } from 'react';
import { Logo } from './Logo.tsx';
import { ArrowRight, Menu, X, Mail, Phone, MessageSquare, Users, FolderGit2, Info, Home } from 'lucide-react';
import { AGENCY_CONTACT } from '../data/content.ts';

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  onOpenInquiry: (initialService?: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  onNavigate,
  onOpenInquiry,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', id: 'home', path: '/' },
    { label: 'About', id: 'about', path: '/about' },
    { label: 'Projects', id: 'projects', path: '/projects' },
    { label: 'Team', id: 'team', path: '/team' },
    { label: 'Reviews', id: 'reviews', path: '/reviews' },
    { label: 'Contact', id: 'contact', path: '/contact' },
  ];

  const handleNavClick = (e: React.MouseEvent, pageId: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    onNavigate(pageId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <header className="fixed top-3 md:top-5 left-0 right-0 z-50 flex justify-center px-4 transition-all duration-300">
        <nav
          className={`w-full max-w-[1360px] h-14 md:h-16 px-4 md:px-7 rounded-2xl flex items-center justify-between transition-all duration-300 ${
            isScrolled
              ? 'bg-[#080A0F]/90 backdrop-blur-xl border border-zinc-800/90 shadow-2xl shadow-black/80'
              : 'bg-[#0C0D12]/70 backdrop-blur-md border border-zinc-800/50 shadow-lg shadow-black/40'
          }`}
          aria-label="Main Navigation"
        >
          {/* Left: WG Media Production Logo */}
          <button
            onClick={(e) => handleNavClick(e, 'home')}
            className="group flex items-center text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8B2CFF] rounded-lg"
          >
            <Logo />
          </button>

          {/* Center: Desktop Navigation Links (Home → About → Projects → Team → Reviews → Contact) */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8 text-xs uppercase tracking-wider font-medium text-zinc-400">
            {navLinks.map((item) => {
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={(e) => handleNavClick(e, item.id)}
                  className={`relative py-1.5 transition-colors duration-200 hover:text-white ${
                    isActive ? 'text-white font-semibold' : 'text-zinc-400'
                  }`}
                >
                  <span>{item.label}</span>
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#7C00FF] via-[#A855F7] to-[#7C00FF] rounded-full shadow-[0_0_8px_#A855F7]" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Right: CTA & Mobile Hamburger */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onOpenInquiry()}
              className="group relative hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold tracking-wide text-zinc-100 bg-zinc-950/70 border border-[#8B2CFF]/60 hover:border-[#A855F7] hover:bg-[#8B2CFF]/15 hover:shadow-[0_0_20px_rgba(139,44,255,0.35)] transition-all duration-300"
            >
              <span>Let's Create</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#A855F7] transition-transform duration-300 group-hover:translate-x-1" />
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-zinc-300 hover:text-white bg-zinc-900/80 border border-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B2CFF]"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/95 backdrop-blur-2xl md:hidden flex flex-col justify-between p-6 pt-24 animate-in fade-in duration-200 overflow-y-auto"
          role="dialog"
          aria-modal="true"
        >
          <div className="flex flex-col gap-4">
            <span className="text-[11px] font-mono tracking-widest text-[#A855F7] uppercase">
              Navigation Menu
            </span>
            {navLinks.map((item) => {
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={(e) => handleNavClick(e, item.id)}
                  className={`text-2xl font-display font-semibold transition-all duration-200 flex items-center justify-between border-b border-zinc-800/60 pb-3 text-left ${
                    isActive ? 'text-white pl-2 border-[#8B2CFF]' : 'text-zinc-300 hover:text-white'
                  }`}
                >
                  <span className="flex items-center gap-3">
                    {isActive && <span className="w-2 h-2 rounded-full bg-[#A855F7]" />}
                    {item.label}
                  </span>
                  <ArrowRight className={`w-4 h-4 ${isActive ? 'text-[#C084FC]' : 'text-[#8B2CFF]'}`} />
                </button>
              );
            })}
          </div>

          <div className="pt-6 border-t border-zinc-800/80 flex flex-col gap-4 mt-8">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenInquiry();
              }}
              className="w-full py-3.5 rounded-xl font-medium text-sm text-white bg-gradient-to-r from-[#7C00FF] to-[#8B2CFF] flex items-center justify-center gap-2 shadow-lg shadow-[#7C00FF]/30"
            >
              <span>Start a Project</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Direct Contact Links */}
            <div className="flex flex-col gap-2 text-xs font-mono">
              <a
                href={AGENCY_CONTACT.mailto}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-zinc-900/60 border border-zinc-800 text-zinc-300 hover:text-white"
              >
                <Mail className="w-3.5 h-3.5 text-[#A855F7]" />
                <span className="truncate">{AGENCY_CONTACT.email}</span>
              </a>
              <a
                href={AGENCY_CONTACT.tel}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-zinc-900/60 border border-zinc-800 text-zinc-300 hover:text-white"
              >
                <Phone className="w-3.5 h-3.5 text-[#A855F7]" />
                <span>{AGENCY_CONTACT.phoneFormatted}</span>
              </a>
            </div>

            <p className="text-center text-xs text-zinc-500">
              Creative visuals. Powerful stories.
            </p>
          </div>
        </div>
      )}
    </>
  );
};
