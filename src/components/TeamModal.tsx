import React, { useEffect, useState } from 'react';
import { TEAM_MEMBERS, TeamMember } from '../data/content.ts';
import turfaAvatar from '../assets/images/regenerated_image_1790330748502.png';
import waleedAvatar from '../assets/images/regenerated_image_1790330746954.png';
import certificateRealImg from '../assets/images/waleed_certificate_real.jpg';
import { LazyImage } from './LazyImage.tsx';
import { CertificateModal } from './CertificateModal.tsx';
import {
  X,
  Award,
  Film,
  Palette,
  Scissors,
  Wand2,
  Video,
  Volume2,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Eye,
  Sparkles,
} from 'lucide-react';

interface TeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenInquiry: (service?: string) => void;
}

export const TeamModal: React.FC<TeamModalProps> = ({
  isOpen,
  onClose,
  onOpenInquiry,
}) => {
  const [isCertificateOpen, setIsCertificateOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const founder = TEAM_MEMBERS.find((m) => m.isFounder) || TEAM_MEMBERS[0];
  const creativeMembers = TEAM_MEMBERS.filter((m) => !m.isFounder);

  return (
    <>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200"
        role="dialog"
        aria-modal="true"
        onClick={onClose}
      >
        <div
          className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl bg-[#090B10] border border-zinc-800 shadow-2xl p-6 sm:p-8"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top Header */}
          <div className="flex items-center justify-between pb-6 border-b border-zinc-800 mb-6">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-[#A855F7] block">
                STUDIO LEADERSHIP & TEAM
              </span>
              <h3 className="font-display font-bold text-2xl text-white mt-1">
                The Creative Leadership Behind WG Media Production
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
              aria-label="Close team modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* 1. FEATURED FOUNDER & OWNER CARD (HIGHER VISUAL HIERARCHY) */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-[#12141F] via-[#0A0C12] to-[#06070A] border-2 border-[#8B2CFF]/40 shadow-xl mb-6">
            <div className="flex flex-col sm:flex-row items-start gap-5 mb-5">
              {/* Founder Avatar Frame */}
              <div className="relative w-20 h-20 rounded-2xl bg-[#07080D] border border-[#8B2CFF]/60 flex items-center justify-center text-white font-display font-black text-2xl shrink-0 overflow-hidden shadow-lg">
                <img
                  src={waleedAvatar || founder.avatar}
                  alt={founder.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 border border-black" />
              </div>

              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="px-2.5 py-0.5 rounded-md bg-[#7C00FF]/25 border border-[#8B2CFF]/40 text-[11px] font-mono font-semibold text-[#C084FC]">
                    {founder.role}
                  </span>
                  <span className="text-[11px] font-mono text-zinc-400">
                    {founder.agency || 'WG MEDIA PRODUCTION'}
                  </span>
                </div>
                <h4 className="font-display font-bold text-2xl text-white">
                  {founder.name}
                </h4>
                <p className="text-xs text-zinc-300 font-light leading-relaxed mt-2">
                  {founder.bio}
                </p>
              </div>
            </div>

            {/* Complete Services List */}
            <div className="pt-4 border-t border-zinc-800/80 mb-4">
              <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 block mb-2">
                Services & Core Expertise:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {founder.services?.map((srv) => (
                  <div
                    key={srv}
                    className="px-2.5 py-1.5 rounded-lg bg-zinc-900/90 border border-zinc-800 text-xs font-medium text-white text-center"
                  >
                    {srv}
                  </div>
                ))}
              </div>
            </div>

            {/* Certificate Proof Strip */}
            {founder.certificate && (
              <div className="p-3.5 rounded-xl bg-zinc-950/80 border border-zinc-800 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 overflow-hidden">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div className="truncate">
                    <span className="text-xs font-semibold text-white block truncate">
                      {founder.certificate.title} · {founder.certificate.recipient}
                    </span>
                    <span className="text-[10px] text-zinc-400 font-mono block truncate">
                      {founder.certificate.role} — {founder.certificate.organization}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setIsCertificateOpen(true)}
                  className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono text-white bg-zinc-900 border border-zinc-700 hover:border-[#8B2CFF] transition-colors"
                >
                  <Eye className="w-3.5 h-3.5 text-[#A855F7]" />
                  <span>View Proof</span>
                </button>
              </div>
            )}
          </div>

          {/* 2. CREATIVE TEAM MEMBERS */}
          <div className="mb-6">
            <span className="text-xs font-mono uppercase tracking-wider text-zinc-400 block mb-3">
              Discipline Specialists:
            </span>
            <div className="grid grid-cols-1 gap-4">
              {creativeMembers.map((member) => (
                <div
                  key={member.name}
                  className="p-4 rounded-xl bg-[#0F1118] border border-zinc-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center overflow-hidden shrink-0">
                      {member.name === 'Turfa Shaukat' ? (
                        <LazyImage
                          src={turfaAvatar}
                          alt={member.name}
                          wrapperClassName="w-full h-full rounded-xl"
                          className="w-full h-full object-cover rounded-xl"
                          rounded="rounded-xl"
                        />
                      ) : (
                        <Palette className="w-5 h-5 text-[#A855F7]" />
                      )}
                    </div>
                    <div>
                      <h5 className="font-display font-bold text-base text-white">
                        {member.name}
                      </h5>
                      <div className="text-xs text-[#C084FC]">
                        {member.role}
                      </div>
                      <div className="text-[11px] text-zinc-400 font-mono mt-0.5">
                        {member.specialty}
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-zinc-400 font-light max-w-sm">
                    {member.bio}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Callout */}
          <div className="pt-5 border-t border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-zinc-400 text-center sm:text-left">
              Directly helmed by Waleed Ghangla and senior leads on every project.
            </p>
            <button
              onClick={() => {
                onClose();
                onOpenInquiry('Team Creative Consultation');
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-[#7C00FF] to-[#8B2CFF]"
            >
              <span>Work With Our Team</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Certificate Lightbox */}
      {founder.certificate && (
        <CertificateModal
          isOpen={isCertificateOpen}
          onClose={() => setIsCertificateOpen(false)}
          certificate={{ ...founder.certificate, image: certificateRealImg }}
        />
      )}
    </>
  );
};
