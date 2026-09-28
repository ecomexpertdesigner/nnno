import React, { useEffect, useState } from 'react';
import { X, ZoomIn, ZoomOut, CheckCircle2, ShieldCheck, FileCheck, Building, Calendar, User, Award, ExternalLink } from 'lucide-react';

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  certificate: {
    title: string;
    recipient: string;
    role: string;
    organization: string;
    hospital: string;
    event: string;
    dates: string;
    signatory: string;
    motto: string;
    image: string;
  };
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  isOpen,
  onClose,
  certificate,
}) => {
  const [isZoomed, setIsZoomed] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-label="Verified Certificate of Participation"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-5xl max-h-[92vh] overflow-y-auto rounded-2xl bg-[#090B10] border border-zinc-800 shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-5 sm:px-7 py-4 border-b border-zinc-800 bg-[#06070B] sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#7C00FF]/20 border border-[#8B2CFF]/40 flex items-center justify-center text-[#A855F7]">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono tracking-wider text-[#A855F7] uppercase font-semibold">
                  Verified Official Credential
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-mono">
                  <CheckCircle2 className="w-3 h-3" />
                  Authenticated
                </span>
              </div>
              <h3 className="font-display font-bold text-base sm:text-lg text-white">
                {certificate.title} — {certificate.recipient}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsZoomed(!isZoomed)}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono text-zinc-300 bg-zinc-900 border border-zinc-800 hover:text-white hover:border-zinc-700 transition-colors"
              title={isZoomed ? 'Zoom out' : 'Zoom in'}
            >
              {isZoomed ? (
                <>
                  <ZoomOut className="w-3.5 h-3.5" />
                  <span>Fit View</span>
                </>
              ) : (
                <>
                  <ZoomIn className="w-3.5 h-3.5" />
                  <span>Enlarge</span>
                </>
              )}
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
              aria-label="Close certificate lightbox"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body: Certificate Image & Verified Data Breakdown */}
        <div className="p-5 sm:p-7 space-y-6">
          {/* Certificate Image Frame */}
          <div className="relative rounded-xl overflow-hidden border border-zinc-800 bg-[#050609] flex items-center justify-center min-h-[320px]">
            <img
              src={certificate.image}
              alt="Official Certificate of Participation - Malik Waleed Hassan, Social Media Manager & Video Editor"
              className={`w-full h-auto object-contain transition-transform duration-300 ${
                isZoomed ? 'scale-125 cursor-zoom-out' : 'cursor-zoom-in'
              }`}
              onClick={() => setIsZoomed(!isZoomed)}
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Verified Document Record Details */}
          <div className="p-5 sm:p-6 rounded-xl bg-[#0D0F16] border border-zinc-800/80">
            <div className="flex items-center gap-2 mb-4 text-xs font-mono tracking-wider text-zinc-400 uppercase">
              <FileCheck className="w-4 h-4 text-[#A855F7]" />
              <span>Extracted Certificate Record</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
              <div className="p-3.5 rounded-lg bg-zinc-950/70 border border-zinc-800/80">
                <span className="text-[11px] font-mono text-zinc-500 block mb-1">CERTIFICATE NAME</span>
                <span className="font-semibold text-white text-sm">{certificate.title}</span>
              </div>

              <div className="p-3.5 rounded-lg bg-zinc-950/70 border border-zinc-800/80">
                <span className="text-[11px] font-mono text-zinc-500 block mb-1">RECIPIENT NAME</span>
                <span className="font-semibold text-[#C084FC] text-sm">{certificate.recipient}</span>
                <span className="text-[10px] text-zinc-400 block mt-0.5">Founder, WG Media Production</span>
              </div>

              <div className="p-3.5 rounded-lg bg-zinc-950/70 border border-zinc-800/80">
                <span className="text-[11px] font-mono text-zinc-500 block mb-1">DUTY & SPECIALIZATION</span>
                <span className="font-semibold text-emerald-400 text-sm">{certificate.role}</span>
              </div>

              <div className="p-3.5 rounded-lg bg-zinc-950/70 border border-zinc-800/80">
                <span className="text-[11px] font-mono text-zinc-500 block mb-1">ISSUING INSTITUTION</span>
                <span className="font-semibold text-white">{certificate.organization}</span>
              </div>

              <div className="p-3.5 rounded-lg bg-zinc-950/70 border border-zinc-800/80">
                <span className="text-[11px] font-mono text-zinc-500 block mb-1">EVENT & CONTRIBUTIONS</span>
                <span className="font-semibold text-white">{certificate.event}</span>
                <span className="text-[11px] font-mono text-[#A855F7] block mt-0.5">{certificate.dates}</span>
              </div>

              <div className="p-3.5 rounded-lg bg-zinc-950/70 border border-zinc-800/80">
                <span className="text-[11px] font-mono text-zinc-500 block mb-1">SIGNATORY & VALIDATION</span>
                <span className="font-semibold text-white">{certificate.signatory}</span>
                <span className="text-[10px] text-zinc-400 block mt-0.5">{certificate.motto}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 sm:px-7 py-4 border-t border-zinc-800 bg-[#06070B] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#A855F7]" />
            <span>Document verified & displayed with authentic credentials only.</span>
          </div>

          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2 rounded-lg bg-zinc-900 border border-zinc-700 hover:text-white hover:bg-zinc-800 text-zinc-200 transition-colors"
          >
            Close Viewer
          </button>
        </div>
      </div>
    </div>
  );
};
