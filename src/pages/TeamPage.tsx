import React, { useState } from 'react';
import { TEAM_MEMBERS, TeamMember, AGENCY_CONTACT } from '../data/content.ts';
import turfaAvatar from '../assets/images/regenerated_image_1790330748502.png';
import waleedAvatar from '../assets/images/regenerated_image_1790330746954.png';
import certificateRealImg from '../assets/images/waleed_certificate_real.jpg';
import { LazyImage } from '../components/LazyImage.tsx';
import { CertificateModal } from '../components/CertificateModal.tsx';
import {
  Film,
  Palette,
  Volume2,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  FileCheck,
  ArrowRight,
  Eye,
  Sliders,
  Scissors,
  Wand2,
  Video,
  X,
  User,
  Building,
  Calendar,
} from 'lucide-react';

interface TeamPageProps {
  onOpenInquiry: (service?: string) => void;
}

export const TeamPage: React.FC<TeamPageProps> = ({ onOpenInquiry }) => {
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [isCertificateOpen, setIsCertificateOpen] = useState(false);

  const founder = TEAM_MEMBERS.find((m) => m.isFounder) || TEAM_MEMBERS[0];
  const creativeMembers = TEAM_MEMBERS.filter((m) => !m.isFounder);

  const getServiceIcon = (service: string) => {
    switch (service) {
      case 'Video Editing':
        return Scissors;
      case 'Sound Designing':
        return Volume2;
      case 'Motion Graphics':
        return Wand2;
      case 'Video Production':
        return Video;
      default:
        return Film;
    }
  };

  return (
    <div className="pt-24 md:pt-32 pb-24 text-[#F5F5F7]">
      {/* Background ambient lighting */}
      <div
        className="fixed top-1/4 right-1/4 w-[540px] h-[540px] bg-[#7C00FF]/10 blur-[170px] pointer-events-none rounded-full -z-10"
        aria-hidden="true"
      />
      <div
        className="fixed bottom-1/4 left-1/4 w-[420px] h-[420px] bg-[#8B2CFF]/10 blur-[150px] pointer-events-none rounded-full -z-10"
        aria-hidden="true"
      />

      <div className="max-w-[1360px] mx-auto px-5 sm:px-8 lg:px-12">
        {/* Page Header */}
        <div className="max-w-3xl mb-14 md:mb-18">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900/90 border border-zinc-800 text-[11px] font-mono tracking-[0.2em] text-[#A855F7] uppercase mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#A855F7] animate-pulse" />
            <span>AGENCY LEADERSHIP & TEAM</span>
          </div>

          <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl text-[#F5F5F7] tracking-tight leading-[1.05] mb-6">
            The Creative Minds Behind <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#A855F7] via-[#C084FC] to-white">
              WG Media Production
            </span>
          </h1>

          <p className="text-base sm:text-lg text-zinc-300 font-light leading-relaxed">
            Every project at WG Media Production is directly helmed by senior discipline leads. We do not pass creative work down to unvetted subcontractors.
          </p>
        </div>

        {/* 1. FOUNDER & OWNER PROFILE (HIGHEST VISUAL HIERARCHY) */}
        <div className="relative mb-24">
          <div className="flex items-center gap-2 mb-4 text-xs font-mono tracking-widest text-[#A855F7] uppercase">
            <ShieldCheck className="w-4 h-4" />
            <span>FOUNDER & OWNER PROFILE</span>
          </div>

          <div className="relative rounded-3xl bg-gradient-to-b from-[#0F1118] via-[#0A0C11] to-[#07080B] border-2 border-[#8B2CFF]/35 shadow-[0_0_40px_rgba(124,0,255,0.12)] p-7 sm:p-10 lg:p-12 overflow-hidden">
            {/* Top decorative gradient glow */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#7C00FF]/15 blur-3xl pointer-events-none -z-0" />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
              {/* Left Column: Founder Portrait & Identity */}
              <div className="lg:col-span-4 flex flex-col items-center sm:items-start text-center sm:text-left">
                {/* Large Profile Visual Container */}
                <div className="relative group mb-6">
                  {/* Outer glowing ring */}
                  <div className="absolute -inset-1.5 rounded-3xl bg-gradient-to-tr from-[#7C00FF] via-[#8B2CFF] to-[#C084FC] opacity-75 blur-md group-hover:opacity-100 transition-opacity" />

                  {/* Profile Image Frame */}
                  <div className="relative w-44 h-44 sm:w-52 sm:h-52 rounded-2xl bg-[#06070A] border-2 border-[#A855F7]/80 overflow-hidden flex flex-col items-center justify-center shadow-2xl">
                    <img
                      src={waleedAvatar || founder.avatar}
                      alt={founder.name}
                      className="w-full h-full object-cover object-center transform transition-transform duration-500 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />

                    {/* Verified Leader Ribbon Badge */}
                    <div className="absolute bottom-2 inset-x-2 py-1 px-2.5 rounded-lg bg-black/80 backdrop-blur-md border border-zinc-700/80 flex items-center justify-center gap-1.5 text-[10px] font-mono text-white">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                      <span className="font-semibold tracking-wider">FOUNDER & OWNER</span>
                    </div>
                  </div>
                </div>

                {/* Name & Agency Designation */}
                <div className="mb-5">
                  <div className="inline-block px-3 py-1 rounded-md bg-[#7C00FF]/20 border border-[#8B2CFF]/40 text-xs font-mono font-semibold text-[#C084FC] mb-2 tracking-wider">
                    {founder.role}
                  </div>
                  <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-white tracking-tight">
                    {founder.name}
                  </h2>
                  <div className="text-xs font-mono text-zinc-400 tracking-wider mt-1 uppercase">
                    Agency: <span className="text-white font-semibold">{founder.agency || 'WG MEDIA PRODUCTION'}</span>
                  </div>
                </div>

                {/* Direct Action Affordance */}
                <div className="flex flex-col sm:flex-row gap-3 w-full">
                  <button
                    onClick={() => onOpenInquiry('Founder Creative Consultation')}
                    className="w-full px-5 py-3 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-[#7C00FF] to-[#8B2CFF] shadow-lg shadow-[#7C00FF]/25 hover:opacity-95 transition-all flex items-center justify-center gap-2"
                  >
                    <span>Work with Waleed</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Right Column: Founder Story, Service Expertise & Certificate Proof */}
              <div className="lg:col-span-8 flex flex-col justify-between space-y-8">
                {/* 1. Dedicated Introduction & Leadership Overview */}
                <div className="p-6 sm:p-7 rounded-2xl bg-[#07080D]/80 border border-zinc-800/90">
                  <div className="flex items-center gap-2 text-xs font-mono text-[#A855F7] uppercase tracking-wider mb-3">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Creative Leadership & Agency Direction</span>
                  </div>
                  <h3 className="font-display font-bold text-xl sm:text-2xl text-white mb-3 leading-snug">
                    Steering Vision, Production Quality & Creative Direction
                  </h3>
                  <p className="text-sm sm:text-base text-zinc-300 font-light leading-relaxed">
                    {founder.bio}
                  </p>
                </div>

                {/* 2. Complete Service Expertise Grid */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono uppercase tracking-wider text-zinc-400">
                      Core Services & Expertise
                    </span>
                    <span className="text-[11px] font-mono text-[#A855F7]">
                      Comprehensive Production Pipeline
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {founder.services?.map((service) => {
                      const Icon = getServiceIcon(service);
                      return (
                        <div
                          key={service}
                          className="p-4 rounded-xl bg-[#090B10] border border-zinc-800 hover:border-[#8B2CFF]/60 hover:bg-[#0D0F18] transition-colors flex items-center gap-3.5"
                        >
                          <div className="w-10 h-10 rounded-lg bg-zinc-900 border border-zinc-700/80 flex items-center justify-center text-[#A855F7] shrink-0">
                            <Icon className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-white">
                              {service}
                            </div>
                            <div className="text-[11px] text-zinc-400 font-mono mt-0.5">
                              Founder Specialization
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 3. Verified Certification / Proof Section */}
                {founder.certificate && (
                  <div className="p-6 rounded-2xl bg-gradient-to-br from-[#0B0D14] to-[#07080B] border border-zinc-800">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-800/80 mb-5">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono uppercase tracking-wider text-[#A855F7] font-semibold">
                            Verified Certification & Proof
                          </span>
                          <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-mono">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Official Credential
                          </span>
                        </div>
                        <h4 className="font-display font-bold text-lg text-white mt-1">
                          {founder.certificate.title}
                        </h4>
                      </div>

                      <button
                        onClick={() => setIsCertificateOpen(true)}
                        className="self-start sm:self-auto inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-zinc-900 border border-zinc-700 hover:border-[#8B2CFF] hover:bg-zinc-800 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5 text-[#A855F7]" />
                        <span>View Certificate</span>
                      </button>
                    </div>

                    {/* Certificate Preview Card & Extracted Records */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
                      {/* Thumbnail Preview with Click-To-Open */}
                      <div
                        onClick={() => setIsCertificateOpen(true)}
                        className="md:col-span-5 relative rounded-xl overflow-hidden border border-zinc-800 group cursor-pointer aspect-[4/3] bg-zinc-950 flex items-center justify-center shadow-lg"
                      >
                        <img
                          src={certificateRealImg}
                          alt="Official Certificate of Participation - Malik Waleed Hassan"
                          className="w-full h-full object-contain bg-zinc-950/80 p-1.5 transition-transform duration-500 group-hover:scale-105"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-xs font-mono text-white backdrop-blur-[2px]">
                          <Eye className="w-4 h-4 text-[#A855F7]" />
                          <span>View Certificate</span>
                        </div>
                      </div>

                      {/* Extracted Certificate Record Details */}
                      <div className="md:col-span-7 space-y-3 text-xs">
                        <div className="p-3 rounded-lg bg-zinc-950/80 border border-zinc-900">
                          <span className="text-[10px] font-mono text-zinc-500 block mb-0.5 uppercase">
                            Recipient & Role on Record
                          </span>
                          <span className="font-semibold text-white text-sm">
                            {founder.certificate.recipient}
                          </span>
                          <div className="text-[11px] text-emerald-400 font-mono mt-0.5">
                            {founder.certificate.role}
                          </div>
                        </div>

                        <div className="p-3 rounded-lg bg-zinc-950/80 border border-zinc-900">
                          <span className="text-[10px] font-mono text-zinc-500 block mb-0.5 uppercase">
                            Issuing Hospital / Organization
                          </span>
                          <span className="text-zinc-200 font-medium leading-relaxed block">
                            {founder.certificate.organization}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-lg bg-zinc-950/80 border border-zinc-900 text-[11px] font-mono text-zinc-400">
                          <div>
                            <span className="text-zinc-500">Event:</span> {founder.certificate.event}
                          </div>
                          <div>
                            <span className="text-zinc-500">Dates:</span> {founder.certificate.dates}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 2. AGENCY CREATIVE TEAM MEMBERS SECTION */}
        <div className="mb-20">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-zinc-800">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-[#A855F7] block mb-1">
                STUDIO SPECIALISTS
              </span>
              <h2 className="font-display font-bold text-2xl sm:text-3xl text-white">
                Creative Team & Discipline Specialists
              </h2>
            </div>
            <span className="text-xs font-mono text-zinc-500 hidden sm:block">
              Direct Senior Engagement
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {creativeMembers.map((member) => {
              return (
                <div
                  key={member.name}
                  onClick={() => setSelectedMember(member)}
                  className="group relative rounded-2xl bg-[#090B10] border border-zinc-800/80 hover:border-[#8B2CFF]/60 hover:shadow-[0_0_30px_rgba(124,0,255,0.12)] p-6 sm:p-8 transition-all duration-300 flex flex-col justify-between cursor-pointer"
                >
                  <div>
                    {/* Top Bar with Avatar */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-zinc-800 to-zinc-950 border border-zinc-700/80 flex items-center justify-center font-display font-bold text-lg text-white shadow-inner group-hover:border-[#8B2CFF] transition-colors overflow-hidden shrink-0">
                          {member.name === 'Turfa Shaukat' ? (
                            <LazyImage
                              src={turfaAvatar}
                              alt={member.name}
                              wrapperClassName="w-full h-full rounded-xl"
                              className="w-full h-full object-cover rounded-xl"
                              rounded="rounded-xl"
                            />
                          ) : member.avatar ? (
                            <LazyImage
                              src={member.avatar}
                              alt={member.name}
                              wrapperClassName="w-full h-full rounded-xl"
                              className="w-full h-full object-cover rounded-xl"
                              rounded="rounded-xl"
                            />
                          ) : (
                            member.name
                              .split(' ')
                              .map((n) => n[0])
                              .join('')
                          )}
                        </div>
                        <div>
                          <div className="text-[11px] font-mono uppercase tracking-wider text-[#A855F7]">
                            Creative Specialist
                          </div>
                          <h3 className="font-display font-bold text-xl sm:text-2xl text-white group-hover:text-[#C084FC] transition-colors">
                            {member.name}
                          </h3>
                        </div>
                      </div>

                      <div className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-[#A855F7]">
                        <Palette className="w-5 h-5" />
                      </div>
                    </div>

                    {/* Role & Specialty */}
                    <div className="mb-4">
                      <div className="text-sm font-semibold text-[#F5F5F7] mb-1">
                        {member.role}
                      </div>
                      <div className="inline-block px-2.5 py-1 rounded-md bg-zinc-900/80 border border-zinc-800 text-xs font-mono text-[#C084FC]">
                        {member.specialty}
                      </div>
                    </div>

                    {/* Biography */}
                    <p className="text-sm text-zinc-300 font-light leading-relaxed mb-6">
                      {member.bio}
                    </p>
                  </div>

                  {/* Footer Action */}
                  <div className="pt-4 border-t border-zinc-800/80 flex items-center justify-between">
                    <span className="text-xs font-mono text-zinc-500 group-hover:text-zinc-300 transition-colors">
                      View specialist profile →
                    </span>
                    <div className="w-7 h-7 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 group-hover:text-white group-hover:border-[#8B2CFF] transition-colors">
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Agency Commitment Banner */}
        <div className="p-8 sm:p-12 rounded-2xl bg-gradient-to-br from-[#0C0E14] to-[#07080B] border border-zinc-800/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-mono text-[#A855F7] uppercase tracking-wider mb-2">
              <ShieldCheck className="w-4 h-4" />
              <span>DIRECT EXECUTIVE SUPERVISION</span>
            </div>
            <h3 className="font-display font-bold text-2xl text-white mb-2">
              Want our senior team on your next campaign?
            </h3>
            <p className="text-sm text-zinc-400 font-light leading-relaxed">
              Every production and post-production contract has our creative principals directly assigned to ensure narrative consistency, technical perfection, and punctual delivery.
            </p>
          </div>

          <button
            onClick={() => onOpenInquiry('Creative Direction')}
            className="shrink-0 px-6 py-3.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-[#7C00FF] to-[#8B2CFF] shadow-lg shadow-[#7C00FF]/30 hover:opacity-95 transition-all flex items-center gap-2"
          >
            <span>Book Creative Consultation</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Member Modal for Specialist */}
      {selectedMember && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
        >
          <div
            className="relative w-full max-w-xl rounded-2xl bg-[#090B10] border border-zinc-800 shadow-2xl p-6 sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between pb-6 border-b border-zinc-800 mb-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-zinc-800 to-zinc-950 border border-zinc-700/80 flex items-center justify-center font-display font-bold text-lg text-white overflow-hidden shrink-0">
                  {selectedMember.name === 'Turfa Shaukat' ? (
                    <LazyImage
                      src={turfaAvatar}
                      alt={selectedMember.name}
                      wrapperClassName="w-full h-full rounded-xl"
                      className="w-full h-full object-cover rounded-xl"
                      rounded="rounded-xl"
                    />
                  ) : (
                    selectedMember.name.split(' ').map((n) => n[0]).join('')
                  )}
                </div>
                <div>
                  <span className="text-[11px] font-mono uppercase tracking-widest text-[#A855F7] block">
                    SPECIALIST PROFILE
                  </span>
                  <h3 className="font-display font-bold text-2xl text-white mt-0.5">
                    {selectedMember.name}
                  </h3>
                  <div className="text-xs text-[#C084FC] font-medium">
                    {selectedMember.role}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedMember(null)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 mb-8">
              <div>
                <span className="text-xs font-mono text-zinc-500 uppercase tracking-wider block mb-1">
                  Primary Specialization:
                </span>
                <div className="text-sm font-semibold text-white">
                  {selectedMember.specialty}
                </div>
              </div>

              <div>
                <span className="text-xs font-mono text-zinc-500 uppercase tracking-wider block mb-1">
                  Background & Discipline:
                </span>
                <p className="text-sm text-zinc-300 font-light leading-relaxed">
                  {selectedMember.bio}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between gap-4 pt-4 border-t border-zinc-800">
              <button
                onClick={() => setSelectedMember(null)}
                className="px-4 py-2.5 rounded-xl text-xs font-medium text-zinc-400 hover:text-white transition-colors"
              >
                Close
              </button>

              <button
                onClick={() => {
                  setSelectedMember(null);
                  onOpenInquiry(`Team Consultation with ${selectedMember.name}`);
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-[#7C00FF] to-[#8B2CFF] shadow-lg shadow-[#7C00FF]/30 hover:opacity-95 transition-all"
              >
                <span>Work with {selectedMember.name.split(' ')[0]}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lightbox Modal for Verified Certificate */}
      {founder.certificate && (
        <CertificateModal
          isOpen={isCertificateOpen}
          onClose={() => setIsCertificateOpen(false)}
          certificate={{ ...founder.certificate, image: certificateRealImg }}
        />
      )}
    </div>
  );
};
