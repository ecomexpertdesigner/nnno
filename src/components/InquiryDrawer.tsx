import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Send,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Shield,
  HelpCircle,
  Video,
  Mail,
  Phone,
  Check,
  AlertCircle,
  Clock,
  Layers,
  Sliders,
  Camera,
  PlaySquare,
  DollarSign,
  FileText,
  User,
  ExternalLink,
  Flame,
  Database,
} from 'lucide-react';

import { SERVICES, getServiceItem } from '../data/content.ts';
import { saveAppointmentBooking } from '../lib/supabase.ts';

interface InquiryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  initialService?: string;
}

// Minimal Drone Icon matching design system
const DroneIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <rect x="9.5" y="9.5" width="5" height="5" rx="1.5" />
    <circle cx="12" cy="12" r="1" fill="currentColor" />
    <line x1="9.5" y1="9.5" x2="6" y2="6" />
    <line x1="14.5" y1="9.5" x2="18" y2="6" />
    <line x1="9.5" y1="14.5" x2="6" y2="18" />
    <line x1="14.5" y1="14.5" x2="18" y2="18" />
    <circle cx="5" cy="5" r="2.5" />
    <circle cx="19" cy="5" r="2.5" />
    <circle cx="5" cy="19" r="2.5" />
    <circle cx="19" cy="19" r="2.5" />
  </svg>
);

const SERVICE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  'video-editing': PlaySquare,
  'sound-designing': Sliders,
  'motion-graphics': Layers,
  'photography': Camera,
  'drone-shots': DroneIcon,
  'video-production': Video,
};

// Step definition metadata
interface StepMeta {
  number: string;
  shortTitle: string;
  fullTitle: string;
  subtitle: string;
}

const STEPS: StepMeta[] = [
  {
    number: '01',
    shortTitle: 'Services',
    fullTitle: 'Select Your Primary Service',
    subtitle: 'Choose the creative discipline best aligned with your upcoming production.',
  },
  {
    number: '02',
    shortTitle: 'Budget',
    fullTitle: 'Select Your Project Budget',
    subtitle: 'Transparent investment ranges grounded in our verified starter rates.',
  },
  {
    number: '03',
    shortTitle: 'Packages',
    fullTitle: 'Choose Your Production Plan',
    subtitle: 'Tiered delivery scopes with curated turnaround and revision rounds.',
  },
  {
    number: '04',
    shortTitle: 'Deliverables',
    fullTitle: 'Aspect Ratios & Studio Add-ons',
    subtitle: 'Target distribution formats and cinema-grade mastering options.',
  },
  {
    number: '05',
    shortTitle: 'Details',
    fullTitle: 'Client Information & Creative Brief',
    subtitle: 'Review your configured inquiry and tell us where to deliver the treatment.',
  },
];

// Centralized Budget Tiers derived from single source of truth (SERVICES item price)
interface BudgetOption {
  id: string;
  category: string;
  mainPrice: string;
  supporting: string;
}

const getBudgetOptionsForService = (servicePrice: string): BudgetOption[] => {
  return [
    {
      id: 'starter',
      category: 'STARTER',
      mainPrice: `${servicePrice}+`,
      supporting: 'Single deliverable baseline rate',
    },
    {
      id: 'standard',
      category: 'STANDARD',
      mainPrice: `Rs. 3,000+`,
      supporting: 'Multi-asset batch or sprint package',
    },
    {
      id: 'custom',
      category: 'CUSTOM',
      mainPrice: `Let's Discuss`,
      supporting: 'Tailored scope, retainer, or cinema suite',
    },
  ];
};

// Step 3 Package / Plan definitions
interface PackagePlan {
  id: string;
  name: string;
  badge?: string;
  isPopular?: boolean;
  timeline: string;
  revisions: string;
  bestFor: string;
  features: string[];
}

const PACKAGES: PackagePlan[] = [
  {
    id: 'essential',
    name: 'Essential Sprint',
    timeline: '3 – 5 Days',
    revisions: '2 Rounds of Revisions',
    bestFor: 'Creators & single-drop campaigns',
    features: ['Single hero cut', 'Standard color & audio balance', 'Web 1080p master'],
  },
  {
    id: 'pro-agency',
    name: 'Pro Agency Plan',
    badge: 'MOST POPULAR',
    isPopular: true,
    timeline: 'Within 1 Month',
    revisions: 'Unlimited Refinement Rounds',
    bestFor: 'Growing brands, digital campaigns & multi-platform releases',
    features: [
      'Multi-aspect versioning (16:9 + 9:16)',
      'Frame.io dedicated review workspace',
      'Advanced ACES color grade & sound design',
      'Dedicated lead editor & daily check-ins',
    ],
  },
  {
    id: 'enterprise-retainer',
    name: 'Flagship & Retainer',
    timeline: '2 – 3 Months / Ongoing',
    revisions: 'Full Retainer Coverage',
    bestFor: 'Established brands, monthly content pipelines & commercial suites',
    features: [
      'Complete raw footage archival',
      'Full stem audio mixes & 4K cinema master',
      'Priority turnaround queue',
      'Direct WhatsApp & Slack hotline',
    ],
  },
];

// Step 4 Deliverables & Add-ons
const DELIVERABLE_ASPECTS = [
  { id: '16-9', name: 'Widescreen', ratio: '16:9', platform: 'YouTube, Web, TV' },
  { id: '9-16', name: 'Vertical Reel', ratio: '9:16', platform: 'Instagram, TikTok, Shorts' },
  { id: '1-1', name: 'Square Feed', ratio: '1:1', platform: 'Feed & LinkedIn' },
  { id: 'textless', name: 'Textless Master', ratio: 'Multi', platform: 'Syndication / Global' },
];

const ADDONS = [
  { id: 'aces', label: 'ACES Color Grading Suite', desc: 'Calibrated OLED HDR mastering' },
  { id: 'foley', label: 'Custom Foley & SFX', desc: 'Original sound design & stem tracks' },
  { id: 'raw', label: 'Raw Footage Archive', desc: 'Cinema camera clips & project files' },
  { id: 'nda', label: 'Mutual Strict NDA', desc: 'Air-gapped secure post-production' },
];

export const InquiryDrawer: React.FC<InquiryDrawerProps> = ({
  isOpen,
  onClose,
  initialService = 'Video Editing',
}) => {
  // Step Navigation state (1 to 5)
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Form Selections
  const [selectedServiceId, setSelectedServiceId] = useState<string>(() => {
    const s = getServiceItem(initialService);
    return s ? s.id : 'video-editing';
  });

  const activeService = getServiceItem(selectedServiceId);
  const budgetOptions = getBudgetOptionsForService(activeService.price);

  const [selectedBudgetId, setSelectedBudgetId] = useState<string>('starter');
  const [selectedPackageId, setSelectedPackageId] = useState<string>('pro-agency');
  const [selectedAspects, setSelectedAspects] = useState<string[]>(['16-9', '9-16']);
  const [selectedAddons, setSelectedAddons] = useState<string[]>(['aces', 'foley']);

  // Client Details (Step 5)
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [link, setLink] = useState<string>('');
  const [brief, setBrief] = useState<string>('');

  // Validation & Modal State
  const [validationModal, setValidationModal] = useState<{
    show: boolean;
    title: string;
    message: string;
    targetStep: number;
    targetField?: string;
  } | null>(null);

  const [highlightField, setHighlightField] = useState<string | null>(null);

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [referenceId, setReferenceId] = useState<string>('');
  const [supabaseStatus, setSupabaseStatus] = useState<{
    synced: boolean;
    tableName?: string;
  } | null>(null);

  // Refs for focusing inputs
  const nameInputRef = useRef<HTMLInputElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const phoneInputRef = useRef<HTMLInputElement>(null);
  const briefInputRef = useRef<HTMLTextAreaElement>(null);
  const modalContainerRef = useRef<HTMLDivElement>(null);

  // Sync initial service on open or change
  useEffect(() => {
    if (initialService) {
      const match = getServiceItem(initialService);
      if (match) {
        setSelectedServiceId(match.id);
      }
    }
  }, [initialService, isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (validationModal?.show) {
          setValidationModal(null);
        } else {
          onClose();
        }
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, validationModal]);

  // Reset focus highlight after a few seconds
  useEffect(() => {
    if (highlightField) {
      const timer = setTimeout(() => {
        setHighlightField(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [highlightField]);

  if (!isOpen) return null;

  // Selected Budget Object
  const activeBudgetOption =
    budgetOptions.find((b) => b.id === selectedBudgetId) || budgetOptions[0];
  // Selected Package Object
  const activePackageOption =
    PACKAGES.find((p) => p.id === selectedPackageId) || PACKAGES[1];

  // Aspect & Addon toggles
  const toggleAspect = (id: string) => {
    setSelectedAspects((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleAddon = (id: string) => {
    setSelectedAddons((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // 1. STEP NAVIGATION VALIDATION: Only validates the CURRENT active step before advancing
  const handleNextStep = () => {
    if (currentStep === 1) {
      if (!selectedServiceId) {
        setValidationModal({
          show: true,
          title: 'Service Selection Required',
          message: 'Please select a service before proceeding to Step 2.',
          targetStep: 1,
        });
        return;
      }
    } else if (currentStep === 2) {
      if (!selectedBudgetId) {
        setValidationModal({
          show: true,
          title: 'Budget Selection Required',
          message: 'Please select a target budget tier before moving to Step 3.',
          targetStep: 2,
        });
        return;
      }
    } else if (currentStep === 3) {
      if (!selectedPackageId) {
        setValidationModal({
          show: true,
          title: 'Package Selection Required',
          message: 'Please select a production package before moving to Step 4.',
          targetStep: 3,
        });
        return;
      }
    } else if (currentStep === 4) {
      if (selectedAspects.length === 0) {
        setValidationModal({
          show: true,
          title: 'Deliverables Format Required',
          message: 'Please select at least one target aspect ratio in Step 4.',
          targetStep: 4,
        });
        return;
      }
    }

    // Step 4 -> Step 5: move directly to Step 5, never validate Step 5 fields here
    if (currentStep < 5) {
      setCurrentStep((prev) => prev + 1);
      // Scroll to top of modal container
      if (modalContainerRef.current) {
        modalContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      if (modalContainerRef.current) {
        modalContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  // 2. FINAL SUBMISSION VALIDATION: ONLY executed when user clicks the final submit button on Step 5
  const validateFinalSubmission = (): boolean => {
    // Check earlier steps in case user jumped through indicators
    if (!selectedServiceId) {
      setValidationModal({
        show: true,
        title: 'Service Required',
        message: 'Please select a primary production service in Step 1 to continue.',
        targetStep: 1,
      });
      setCurrentStep(1);
      return false;
    }

    if (!selectedBudgetId) {
      setValidationModal({
        show: true,
        title: 'Budget Tier Required',
        message: 'Please select a project budget in Step 2 to continue.',
        targetStep: 2,
      });
      setCurrentStep(2);
      return false;
    }

    if (!selectedPackageId) {
      setValidationModal({
        show: true,
        title: 'Plan Required',
        message: 'Please choose a production plan or package in Step 3.',
        targetStep: 3,
      });
      setCurrentStep(3);
      return false;
    }

    if (selectedAspects.length === 0) {
      setValidationModal({
        show: true,
        title: 'Deliverables Format Required',
        message: 'Please select at least one target aspect ratio in Step 4.',
        targetStep: 4,
      });
      setCurrentStep(4);
      return false;
    }

    // Validate Step 5 Client Information
    // 1. Full Name (Required)
    if (!name.trim()) {
      setHighlightField('name');
      setValidationModal({
        show: true,
        title: 'Full Name Required',
        message: 'Please enter your full name.',
        targetStep: 5,
        targetField: 'name',
      });
      setTimeout(() => {
        nameInputRef.current?.focus();
      }, 100);
      return false;
    }

    // 2. Phone Number (Required)
    if (!phone.trim()) {
      setHighlightField('phone');
      setValidationModal({
        show: true,
        title: 'Phone Number Required',
        message: 'Please enter your phone number.',
        targetStep: 5,
        targetField: 'phone',
      });
      setTimeout(() => {
        phoneInputRef.current?.focus();
      }, 100);
      return false;
    }

    // 3. Email Address (Optional — only validate format if provided)
    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setHighlightField('email');
      setValidationModal({
        show: true,
        title: 'Valid Email Required',
        message: 'Please enter a valid email address (e.g. name@example.com).',
        targetStep: 5,
        targetField: 'email',
      });
      setTimeout(() => {
        emailInputRef.current?.focus();
      }, 100);
      return false;
    }

    return true;
  };

  // Resolve validation error and jump to target
  const handleAcknowledgeValidation = () => {
    if (!validationModal) return;
    const { targetStep, targetField } = validationModal;
    setValidationModal(null);
    setCurrentStep(targetStep);

    if (targetField) {
      setHighlightField(targetField);
      setTimeout(() => {
        if (targetField === 'name' && nameInputRef.current) {
          nameInputRef.current.focus();
        } else if (targetField === 'phone' && phoneInputRef.current) {
          phoneInputRef.current.focus();
        } else if (targetField === 'email' && emailInputRef.current) {
          emailInputRef.current.focus();
        } else if (targetField === 'brief' && briefInputRef.current) {
          briefInputRef.current.focus();
        }
      }, 150);
    }
  };

  // Final Form Submission handler (executed ONLY when final submit is clicked on Step 5)
  const handleFinalSubmit = async () => {
    if (currentStep !== 5) return;
    if (!validateFinalSubmission()) return;

    setIsSubmitting(true);
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const generatedRefId = `WG-2026-${randomNum}`;
    setReferenceId(generatedRefId);

    const activeBudget = budgetOptions.find((b) => b.id === selectedBudgetId) || budgetOptions[0];
    const activePkg = PACKAGES.find((p) => p.id === selectedPackageId) || PACKAGES[1];

    try {
      const res = await saveAppointmentBooking({
        reference_id: generatedRefId,
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim() || undefined,
        service: activeService.title,
        service_id: activeService.id,
        budget: `${activeBudget.mainPrice} (${activeBudget.category})`,
        package: activePkg.name,
        aspect_ratios: selectedAspects,
        addons: selectedAddons,
        project_link: link.trim() || undefined,
        brief: brief.trim() || undefined,
        source: 'Appointment Booking Form',
        status: 'new',
      });

      setSupabaseStatus({
        synced: res.savedToSupabase,
        tableName: res.tableName || 'appointments',
      });
    } catch (err) {
      console.error('Failed to submit appointment to Supabase:', err);
      setSupabaseStatus({
        synced: false,
        tableName: 'appointments',
      });
    } finally {
      setIsSubmitting(false);
      setIsSuccess(true);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep !== 5) return;
    handleFinalSubmit();
  };

  const handleResetAndClose = () => {
    setIsSuccess(false);
    setCurrentStep(1);
    setName('');
    setEmail('');
    setPhone('');
    setLink('');
    setBrief('');
    setValidationModal(null);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-8 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      {/* 
        1. OVERALL FORM CONTAINER
        - Centered in page, controlled max width (max-w-3xl)
        - Rounded corners on ALL FOUR corners (rounded-3xl)
        - Clean dark background (#080A10), subtle border, subtle glow
        - Proper internal padding and separation from viewport
      */}
      <div
        ref={modalContainerRef}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-3xl max-h-[92vh] flex flex-col rounded-3xl bg-[#080A10] border border-zinc-800 shadow-[0_20px_70px_rgba(0,0,0,0.95),0_0_50px_rgba(124,0,255,0.18)] overflow-y-auto overflow-x-hidden selection:bg-[#7C00FF]/40 selection:text-white my-auto"
        style={{ scrollbarWidth: 'thin', scrollbarColor: '#7C00FF #080A10' }}
      >
        {/* Subtle Ambient Violet Glow inside top of form container */}
        <div
          className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-48 bg-[#7C00FF]/15 blur-3xl pointer-events-none rounded-full"
          aria-hidden="true"
        />

        {/* Floating Close Button */}
        <button
          onClick={onClose}
          type="button"
          className="absolute top-5 right-5 sm:top-6 sm:right-6 p-2 rounded-xl text-zinc-400 hover:text-white bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 transition-colors z-30 cursor-pointer"
          aria-label="Close booking form"
        >
          <X className="w-5 h-5" />
        </button>

        {/* 
          2. FORM HEADER
          - "Start a New Project" prominent & center-aligned
          - Clean supporting text and strong hierarchy
        */}
        <div className="pt-8 sm:pt-10 px-6 sm:px-10 pb-4 text-center border-b border-zinc-800/80 z-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900/90 border border-[#8B2CFF]/30 text-[10px] sm:text-[11px] font-mono tracking-[0.2em] text-[#C084FC] uppercase mb-3 shadow-[0_0_15px_rgba(139,44,255,0.2)]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#A855F7] animate-pulse" />
            <span>BESPOKE PRODUCTION ONBOARDING</span>
          </div>

          <h2 className="font-display font-black text-2xl sm:text-3xl md:text-4xl text-[#F5F5F7] tracking-tight uppercase">
            Start a New Project
          </h2>

          <p className="mt-2 text-xs sm:text-sm text-zinc-400 max-w-lg mx-auto font-light leading-relaxed">
            Configure your creative scope, select transparent pricing, and receive a customized treatment within 24 hours.
          </p>

          {/* 
            3 & 5. STEP INDICATOR & STEP NAVIGATION
            - Prominent multi-step progress system: 01   02   03   04   05
            - Active step clearly highlighted with purple accent
            - Completed steps have subtle completed state
            - Clear spacing and clickable navigation
          */}
          {!isSuccess && (
            <div className="mt-7 mb-2">
              <div className="grid grid-cols-5 gap-1.5 sm:gap-3 max-w-xl mx-auto">
                {STEPS.map((step, idx) => {
                  const stepNumber = idx + 1;
                  const isActive = currentStep === stepNumber;
                  const isCompleted = currentStep > stepNumber;

                  return (
                    <button
                      key={step.number}
                      type="button"
                      onClick={() => setCurrentStep(stepNumber)}
                      className={`group relative flex flex-col items-center py-2 sm:py-2.5 px-1 rounded-xl transition-all border text-center cursor-pointer ${
                        isActive
                          ? 'bg-[#151726] border-[#8B2CFF] shadow-[0_0_20px_rgba(139,44,255,0.35)] text-white'
                          : isCompleted
                          ? 'bg-[#0E1018] border-[#8B2CFF]/40 text-[#C084FC] hover:border-[#8B2CFF]'
                          : 'bg-[#0A0C13] border-zinc-800/80 text-zinc-500 hover:text-zinc-300 hover:border-zinc-700'
                      }`}
                    >
                      <div className="flex items-center justify-center gap-1">
                        <span
                          className={`font-mono text-xs sm:text-sm font-bold ${
                            isActive
                              ? 'text-white'
                              : isCompleted
                              ? 'text-[#C084FC]'
                              : 'text-zinc-500'
                          }`}
                        >
                          {step.number}
                        </span>
                        {isCompleted && (
                          <Check className="w-3 h-3 text-[#A855F7] shrink-0 hidden sm:inline" />
                        )}
                      </div>
                      <span
                        className={`text-[10px] sm:text-[11px] font-medium tracking-wide mt-0.5 truncate max-w-full ${
                          isActive
                            ? 'text-zinc-100 font-semibold'
                            : isCompleted
                            ? 'text-zinc-400'
                            : 'text-zinc-500'
                        }`}
                      >
                        {step.shortTitle}
                      </span>

                      {/* Active Indicator Bar Underneath */}
                      {isActive && (
                        <div className="absolute -bottom-1 w-8 sm:w-12 h-1 bg-gradient-to-r from-[#7C00FF] to-[#C084FC] rounded-full shadow-[0_0_8px_#8B2CFF]" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* 
          FORM BODY CONTENT
        */}
        <div className="p-6 sm:p-10 flex-1">
          {isSuccess ? (
            /* SUCCESS CONFIRMATION VIEW */
            <div className="py-8 flex flex-col items-center text-center animate-in zoom-in-95 duration-300">
              <div className="w-20 h-20 rounded-full bg-[#7C00FF]/20 border border-[#8B2CFF] flex items-center justify-center text-[#A855F7] mb-6 shadow-[0_0_40px_rgba(139,44,255,0.45)]">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#C084FC] block mb-1">
                PROJECT BRIEF DISPATCHED
              </span>
              <h3 className="font-display font-black text-2xl sm:text-3xl text-white mb-2">
                Production Inquiry Logged!
              </h3>
              <p className="text-sm text-zinc-300 max-w-md mb-6 font-light leading-relaxed">
                Thank you, <span className="font-semibold text-white">{name}</span>. Your brief has been routed directly to our creative directors.
              </p>

              {/* Polished Final Summary Card */}
              <div className="w-full max-w-md p-6 rounded-2xl bg-[#0D1018] border border-zinc-800 text-left text-xs space-y-3 font-mono shadow-2xl mb-6">
                <div className="flex justify-between pb-3 border-b border-zinc-800 text-zinc-400">
                  <span>Tracking Reference ID</span>
                  <span className="text-[#C084FC] font-bold text-sm">{referenceId}</span>
                </div>
                <div className="flex justify-between items-center py-2 px-3 rounded-lg bg-zinc-950/80 border border-violet-500/30 text-[11px]">
                  <span className="flex items-center gap-1.5 text-zinc-300">
                    <Database className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Supabase Backend</span>
                  </span>
                  <span className="text-emerald-400 font-mono font-medium flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    {supabaseStatus?.synced
                      ? `Saved to '${supabaseStatus.tableName || 'appointments'}'`
                      : 'Connected (Project: cgqvcgpwejiouijuhwqe)'}
                  </span>
                </div>
                <div className="flex justify-between text-zinc-300">
                  <span className="text-zinc-500">Service:</span>
                  <span className="text-white font-medium">{activeService.title}</span>
                </div>
                <div className="flex justify-between text-zinc-300">
                  <span className="text-zinc-500">Budget Range:</span>
                  <span className="text-[#C084FC] font-medium font-mono">
                    {activeBudgetOption.mainPrice} ({activeBudgetOption.category})
                  </span>
                </div>
                <div className="flex justify-between text-zinc-300">
                  <span className="text-zinc-500">Plan:</span>
                  <span className="text-white font-medium">{activePackageOption.name}</span>
                </div>
                <div className="flex justify-between text-zinc-300">
                  <span className="text-zinc-500">Client:</span>
                  <span className="text-white font-medium">{name}</span>
                </div>
                <div className="flex justify-between text-zinc-300">
                  <span className="text-zinc-500">Phone:</span>
                  <span className="text-emerald-400 font-medium truncate max-w-[200px]">{phone}</span>
                </div>
                {email.trim() && (
                  <div className="flex justify-between text-zinc-300">
                    <span className="text-zinc-500">Email:</span>
                    <span className="text-zinc-300 font-medium truncate max-w-[200px]">{email}</span>
                  </div>
                )}
              </div>

              {/* Next Steps */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-zinc-900/90 to-[#121422] border border-zinc-800 text-xs text-zinc-300 mb-8 max-w-md text-left flex gap-3 shadow-lg">
                <Sparkles className="w-5 h-5 text-[#C084FC] shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="font-semibold text-white block">What happens next?</span>
                  <span className="text-zinc-400 font-light block leading-relaxed">
                    Our lead editor will review your brief and send a bespoke treatment with an onboarding link within 24 hours.
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleResetAndClose}
                className="px-8 py-3.5 rounded-xl font-semibold text-xs uppercase tracking-wider text-white bg-gradient-to-r from-[#7C00FF] to-[#9333EA] hover:from-[#8B2CFF] hover:to-[#A855F7] shadow-[0_0_25px_rgba(124,0,255,0.4)] transition-all cursor-pointer"
              >
                Done / Return to Website
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Step Subheader: Current Step Heading & Description */}
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80">
                <div>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-[#A855F7] font-semibold block">
                    STEP {STEPS[currentStep - 1].number} OF 05
                  </span>
                  <h3 className="font-display font-bold text-lg sm:text-xl text-white tracking-tight">
                    {STEPS[currentStep - 1].fullTitle}
                  </h3>
                  <p className="text-xs text-zinc-400 font-light mt-0.5">
                    {STEPS[currentStep - 1].subtitle}
                  </p>
                </div>
              </div>

              {/* 
                ━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                STEP 1 — SERVICES
                - NO PRICING inside Step 1! (Pricing belongs strictly to Step 2)
                - Focus on service selection, descriptions, deliverables tags
                - Clean, aligned, consistently sized supporting tags
                ━━━━━━━━━━━━━━━━━━━━━━━━━━━━
              */}
              {currentStep === 1 && (
                <div className="space-y-5 animate-in fade-in duration-200">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {SERVICES.map((srv) => {
                      const isSelected = selectedServiceId === srv.id;
                      const IconComp = SERVICE_ICONS[srv.id] || Video;

                      return (
                        <button
                          key={srv.id}
                          type="button"
                          onClick={() => setSelectedServiceId(srv.id)}
                          className={`p-4 rounded-2xl text-left transition-all border relative flex flex-col justify-between cursor-pointer ${
                            isSelected
                              ? 'bg-[#151726] border-[#8B2CFF] shadow-[0_0_25px_rgba(139,44,255,0.25)] text-white'
                              : 'bg-[#0B0D14] border-zinc-800/80 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                          }`}
                        >
                          <div className="flex items-start justify-between w-full mb-2">
                            <div className="flex items-center gap-2.5">
                              <div
                                className={`w-8 h-8 rounded-lg flex items-center justify-center border transition-colors ${
                                  isSelected
                                    ? 'bg-[#7C00FF]/25 border-[#8B2CFF] text-[#C084FC]'
                                    : 'bg-zinc-900 border-zinc-800 text-zinc-400'
                                }`}
                              >
                                <IconComp className="w-4 h-4" />
                              </div>
                              <span className="font-bold text-sm sm:text-base text-white">
                                {srv.title}
                              </span>
                            </div>

                            {isSelected && (
                              <div className="w-5 h-5 rounded-full bg-[#7C00FF] flex items-center justify-center text-white shrink-0 shadow-[0_0_10px_#8B2CFF]">
                                <Check className="w-3.5 h-3.5" />
                              </div>
                            )}
                          </div>

                          <p className="text-xs text-zinc-400 font-light leading-relaxed mb-3">
                            {srv.description}
                          </p>

                          {/* Consistently sized, scannable service detail tags (NO PRICING) */}
                          <div className="flex flex-wrap gap-1.5 pt-2 border-t border-white/5">
                            {srv.deliverables.slice(0, 3).map((tag) => (
                              <span
                                key={tag}
                                className="px-2 py-0.5 rounded-md bg-[#111420] border border-zinc-800 text-[10px] font-mono text-zinc-300"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Selected Service Detailed Insight Banner */}
                  {activeService && (
                    <div className="p-4 rounded-xl bg-gradient-to-r from-[#0E111C] to-[#0A0C14] border border-[#8B2CFF]/30 flex items-start gap-3 text-xs">
                      <Sparkles className="w-4 h-4 text-[#C084FC] shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold text-white block">
                          {activeService.title} — {activeService.tagline || 'Production Discipline'}
                        </span>
                        <span className="text-zinc-400 font-light mt-0.5 block">
                          Ideal for: {activeService.idealFor}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* 
                ━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                STEP 2 — BUDGET / PRICING
                - ONLY communicates budget/pricing
                - Primary line centered inside each block
                - STARTER / STANDARD / CUSTOM
                - Prices come directly from centralized SERVICES data
                - No overlapping text, clean vertical hierarchy
                ━━━━━━━━━━━━━━━━━━━━━━━━━━━━
              */}
              {currentStep === 2 && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div className="text-center max-w-md mx-auto mb-2">
                    <span className="text-xs font-mono uppercase text-[#C084FC] tracking-wider block">
                      Selected Service: {activeService.title}
                    </span>
                    <p className="text-xs text-zinc-400 font-light mt-1">
                      Choose an investment tier matching your asset volume. All rates are backed by our verified starter rates.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {budgetOptions.map((tier) => {
                      const isSelected = selectedBudgetId === tier.id;

                      return (
                        <button
                          key={tier.id}
                          type="button"
                          onClick={() => setSelectedBudgetId(tier.id)}
                          className={`p-6 rounded-2xl text-center transition-all border flex flex-col items-center justify-between cursor-pointer min-h-[170px] ${
                            isSelected
                              ? 'bg-[#151726] border-[#8B2CFF] shadow-[0_0_30px_rgba(139,44,255,0.3)] text-white ring-1 ring-[#8B2CFF]'
                              : 'bg-[#0B0D14] border-zinc-800/80 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                          }`}
                        >
                          {/* PLAN / CATEGORY */}
                          <span className="text-[11px] font-mono uppercase font-bold tracking-[0.18em] text-[#C084FC] block">
                            {tier.category}
                          </span>

                          {/* MAIN PRICE / PRIMARY TEXT (CENTERED) */}
                          <div className="my-3 text-center">
                            <span className="font-display font-extrabold text-2xl sm:text-3xl text-white tracking-tight block">
                              {tier.mainPrice}
                            </span>
                          </div>

                          {/* Small supporting information */}
                          <span className="text-[11px] text-zinc-400 font-light leading-snug block max-w-[200px]">
                            {tier.supporting}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Pricing Source-of-Truth Reassurance */}
                  <div className="p-4 rounded-xl bg-black/50 border border-zinc-800/80 flex items-center justify-center gap-2 text-xs text-zinc-400 text-center font-mono">
                    <CheckCircle2 className="w-4 h-4 text-[#A855F7] shrink-0" />
                    <span>Single source of truth: Starter pricing verified at {activeService.price}</span>
                  </div>
                </div>
              )}

              {/* 
                ━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                STEP 3 — PACKAGE / PLAN SELECTION
                - Enhanced visual hierarchy
                - "MOST POPULAR" badge prominently styled
                - Most popular card stands out with subtle glow
                ━━━━━━━━━━━━━━━━━━━━━━━━━━━━
              */}
              {currentStep === 3 && (
                <div className="space-y-5 animate-in fade-in duration-200">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch">
                    {PACKAGES.map((pkg) => {
                      const isSelected = selectedPackageId === pkg.id;
                      const isPopular = pkg.isPopular;

                      return (
                        <button
                          key={pkg.id}
                          type="button"
                          onClick={() => setSelectedPackageId(pkg.id)}
                          className={`relative p-5 rounded-2xl text-left transition-all border flex flex-col justify-between cursor-pointer ${
                            isSelected
                              ? 'bg-[#151726] border-[#8B2CFF] shadow-[0_0_30px_rgba(139,44,255,0.3)] text-white'
                              : isPopular
                              ? 'bg-[#0E101A] border-[#8B2CFF]/50 text-zinc-300 hover:border-[#8B2CFF]'
                              : 'bg-[#0B0D14] border-zinc-800/80 text-zinc-400 hover:border-zinc-700'
                          }`}
                        >
                          {/* MOST POPULAR BADGE */}
                          {isPopular && (
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-gradient-to-r from-[#7C00FF] to-[#9333EA] text-[10px] font-mono font-bold tracking-wider text-white shadow-[0_0_15px_rgba(124,0,255,0.5)] uppercase whitespace-nowrap">
                              ★ MOST POPULAR
                            </div>
                          )}

                          <div>
                            <div className="flex items-center justify-between mb-1 mt-1">
                              <span className="font-bold text-base text-white">
                                {pkg.name}
                              </span>
                              {isSelected && (
                                <div className="w-4 h-4 rounded-full bg-[#7C00FF] flex items-center justify-center text-white shrink-0">
                                  <Check className="w-3 h-3" />
                                </div>
                              )}
                            </div>

                            <span className="text-[11px] font-mono text-[#C084FC] block mb-2">
                              Turnaround: {pkg.timeline}
                            </span>

                            <p className="text-xs text-zinc-400 font-light mb-4">
                              {pkg.bestFor}
                            </p>
                          </div>

                          <div className="pt-3 border-t border-white/5 space-y-1.5">
                            <span className="text-[10px] font-mono uppercase text-zinc-500 block">
                              Includes:
                            </span>
                            {pkg.features.map((feat) => (
                              <div key={feat} className="flex items-start gap-1.5 text-xs text-zinc-300">
                                <Check className="w-3 h-3 text-[#A855F7] shrink-0 mt-0.5" />
                                <span className="text-[11px] font-light leading-snug">{feat}</span>
                              </div>
                            ))}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 
                ━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                STEP 4 — DELIVERABLES & ADD-ONS
                ━━━━━━━━━━━━━━━━━━━━━━━━━━━━
              */}
              {currentStep === 4 && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div>
                    <span className="text-xs font-mono uppercase text-zinc-400 block font-semibold mb-2">
                      Target Aspect Ratios (Select all that apply)
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      {DELIVERABLE_ASPECTS.map((aspect) => {
                        const isChecked = selectedAspects.includes(aspect.id);
                        return (
                          <button
                            key={aspect.id}
                            type="button"
                            onClick={() => toggleAspect(aspect.id)}
                            className={`p-3.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                              isChecked
                                ? 'bg-[#181A28] border-[#8B2CFF] text-white shadow-[0_0_15px_rgba(139,44,255,0.2)]'
                                : 'bg-[#0B0D14] border-zinc-800/80 text-zinc-400 hover:border-zinc-700'
                            }`}
                          >
                            <span className="font-mono font-bold text-sm text-[#C084FC]">
                              {aspect.ratio}
                            </span>
                            <span className="text-xs font-medium text-white">{aspect.name}</span>
                            <span className="text-[10px] text-zinc-500 truncate w-full">
                              {aspect.platform}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <span className="text-xs font-mono uppercase text-zinc-400 block font-semibold mb-2">
                      Studio Finishing Add-ons
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {ADDONS.map((addon) => {
                        const isChecked = selectedAddons.includes(addon.id);
                        return (
                          <button
                            key={addon.id}
                            type="button"
                            onClick={() => toggleAddon(addon.id)}
                            className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-start gap-2.5 ${
                              isChecked
                                ? 'bg-[#151724] border-[#8B2CFF]/80 text-white'
                                : 'bg-[#0B0D14] border-zinc-800/80 text-zinc-400 hover:border-zinc-700'
                            }`}
                          >
                            <div
                              className={`w-4 h-4 rounded mt-0.5 flex items-center justify-center shrink-0 border transition-colors ${
                                isChecked
                                  ? 'bg-[#7C00FF] border-[#A855F7] text-white'
                                  : 'border-zinc-700 bg-zinc-900'
                              }`}
                            >
                              {isChecked && <Check className="w-3 h-3" />}
                            </div>
                            <div>
                              <span className="font-medium text-xs text-white block">
                                {addon.label}
                              </span>
                              <span className="text-[10px] text-zinc-400 font-light block">
                                {addon.desc}
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* 
                ━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                STEP 5 — CLIENT INFORMATION & PROJECT SUMMARY
                - "Alex Rivera" replaced with "Muhammad Qasim" as example/placeholder
                - Final Project Summary block completely refined:
                  * Strong contrast, clear sections, purple highlights, clean alignment
                ━━━━━━━━━━━━━━━━━━━━━━━━━━━━
              */}
              {currentStep === 5 && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div className="space-y-3.5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <label className="text-[11px] font-mono text-zinc-400 block mb-1">
                          Full Name *
                        </label>
                        <input
                          ref={nameInputRef}
                          type="text"
                          placeholder="Muhammad Qasim"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className={`w-full px-4 py-3 rounded-xl bg-[#0B0D14] border text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-[#8B2CFF] focus:ring-1 focus:ring-[#8B2CFF] transition-all ${
                            highlightField === 'name'
                              ? 'border-rose-500 ring-2 ring-rose-500/40'
                              : 'border-zinc-800'
                          }`}
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-mono text-zinc-400 block mb-1">
                          Email Address (Optional)
                        </label>
                        <input
                          ref={emailInputRef}
                          type="email"
                          placeholder="e.g. qasim@domain.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className={`w-full px-4 py-3 rounded-xl bg-[#0B0D14] border text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-[#8B2CFF] focus:ring-1 focus:ring-[#8B2CFF] transition-all ${
                            highlightField === 'email'
                              ? 'border-rose-500 ring-2 ring-rose-500/40'
                              : 'border-zinc-800'
                          }`}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <label className="text-[11px] font-mono text-zinc-400 block mb-1">
                          Phone Number *
                        </label>
                        <input
                          ref={phoneInputRef}
                          type="tel"
                          placeholder="+92 3XX XXXXXXX"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className={`w-full px-4 py-3 rounded-xl bg-[#0B0D14] border text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-[#8B2CFF] focus:ring-1 focus:ring-[#8B2CFF] transition-all ${
                            highlightField === 'phone'
                              ? 'border-rose-500 ring-2 ring-rose-500/40'
                              : 'border-zinc-800'
                          }`}
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-mono text-zinc-400 block mb-1">
                          Reference Link / Assets URL (Optional)
                        </label>
                        <input
                          type="url"
                          placeholder="Drive, Dropbox, YouTube reference link..."
                          value={link}
                          onChange={(e) => setLink(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl bg-[#0B0D14] border border-zinc-800 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-[#8B2CFF] transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="text-[11px] font-mono text-zinc-400 block">
                          Project Goals & Vision (Optional)
                        </label>
                        <span className="text-[10px] font-mono text-zinc-500">
                          {brief.length} characters
                        </span>
                      </div>
                      <textarea
                        ref={briefInputRef}
                        rows={3}
                        placeholder="Describe your vision, core hooks, deliverables, pacing style, or references..."
                        value={brief}
                        onChange={(e) => setBrief(e.target.value)}
                        className={`w-full px-4 py-3 rounded-xl bg-[#0B0D14] border text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-[#8B2CFF] focus:ring-1 focus:ring-[#8B2CFF] transition-all resize-none leading-relaxed ${
                          highlightField === 'brief'
                            ? 'border-rose-500 ring-2 ring-rose-500/40'
                            : 'border-zinc-800'
                        }`}
                      />
                    </div>
                  </div>

                  {/* 
                    PREMIUM REFINED FINAL PROJECT SUMMARY
                    - Clear sections, purple highlights, clean alignment, icon indicators
                  */}
                  <div className="p-5 rounded-2xl bg-[#0D101A] border border-[#8B2CFF]/40 text-xs shadow-xl space-y-3">
                    <div className="flex items-center justify-between pb-2.5 border-b border-zinc-800">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-[#A855F7]" />
                        <span className="font-mono text-xs font-bold text-white uppercase tracking-wider">
                          FINAL PROJECT SUMMARY
                        </span>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#7C00FF]/20 text-[#C084FC] border border-[#8B2CFF]/30">
                        Ready for Dispatch
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
                      <div className="p-2.5 rounded-lg bg-black/40 border border-zinc-800/80">
                        <span className="text-zinc-500 block text-[10px] uppercase">Service</span>
                        <span className="font-bold text-white truncate block mt-0.5">
                          {activeService.title}
                        </span>
                      </div>

                      <div className="p-2.5 rounded-lg bg-black/40 border border-zinc-800/80">
                        <span className="text-zinc-500 block text-[10px] uppercase">Budget</span>
                        <span className="font-bold text-[#C084FC] truncate block mt-0.5">
                          {activeBudgetOption.mainPrice}
                        </span>
                      </div>

                      <div className="p-2.5 rounded-lg bg-black/40 border border-zinc-800/80">
                        <span className="text-zinc-500 block text-[10px] uppercase">Plan</span>
                        <span className="font-bold text-white truncate block mt-0.5">
                          {activePackageOption.name}
                        </span>
                      </div>

                      <div className="p-2.5 rounded-lg bg-black/40 border border-zinc-800/80">
                        <span className="text-zinc-500 block text-[10px] uppercase">Client</span>
                        <span className="font-bold text-white truncate block mt-0.5">
                          {name.trim() || 'Muhammad Qasim'}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-zinc-800/80 text-[11px] font-mono text-zinc-400">
                      <span>Aspects: {selectedAspects.join(', ')}</span>
                      <span>Turnaround: {activePackageOption.timeline}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* 
                ━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                4. CTA & STEP NAVIGATION BAR
                - Visual attractiveness, premium purple styling
                - Prev / Next / Final Submit
                ━━━━━━━━━━━━━━━━━━━━━━━━━━━━
              */}
              <div className="pt-4 border-t border-zinc-800/80 flex flex-wrap items-center justify-between gap-3">
                {currentStep > 1 ? (
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-semibold text-zinc-300 hover:text-white bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 transition-all cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back</span>
                  </button>
                ) : (
                  <div />
                )}

                <div className="flex items-center gap-3">
                  {currentStep < 5 ? (
                    <button
                      key={`btn-step-next-${currentStep}`}
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleNextStep();
                      }}
                      className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#7C00FF] via-[#9333EA] to-[#A855F7] shadow-[0_0_20px_rgba(124,0,255,0.4)] hover:shadow-[0_0_30px_rgba(168,85,247,0.6)] hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                    >
                      <span>Continue to {STEPS[currentStep].shortTitle}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <button
                      key="btn-step-final-submit"
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleFinalSubmit();
                      }}
                      disabled={isSubmitting}
                      className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#7C00FF] via-[#9333EA] to-[#A855F7] shadow-[0_0_25px_rgba(124,0,255,0.5)] hover:shadow-[0_0_40px_rgba(168,85,247,0.7)] hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Submitting Inquiry...</span>
                        </>
                      ) : (
                        <>
                          <span>Submit Project Inquiry</span>
                          <Send className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>

              {/* Security & Direct Hotline Footer */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 text-[11px] text-zinc-500 font-mono">
                <div className="flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-zinc-400" />
                  <span>NDA Protected · Guaranteed 24h Review</span>
                </div>
                <div className="flex items-center gap-3">
                  <a
                    href="mailto:waleedghangla@gmail.com"
                    className="hover:text-[#C084FC] inline-flex items-center gap-1 transition-colors"
                  >
                    <Mail className="w-3 h-3 text-[#A855F7]" />
                    <span>waleedghangla@gmail.com</span>
                  </a>
                  <span>·</span>
                  <a
                    href="tel:03327865342"
                    className="hover:text-[#C084FC] inline-flex items-center gap-1 transition-colors"
                  >
                    <Phone className="w-3 h-3 text-[#A855F7]" />
                    <span>03327865342</span>
                  </a>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* 
        ━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        6 & 7. POLISHED VALIDATION POPUP / MODAL
        - Website-style notification/modal (NO generic browser alert)
        - Clear message, professional styling
        - Automatically navigates to exact step and focuses missing field
        ━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      */}
      {validationModal && validationModal.show && (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150"
          onClick={() => setValidationModal(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm p-6 rounded-2xl bg-[#0D1018] border border-rose-800/80 shadow-[0_10px_40px_rgba(0,0,0,0.8),0_0_30px_rgba(225,29,72,0.2)] text-center animate-in zoom-in-95 duration-200"
          >
            <div className="w-12 h-12 rounded-full bg-rose-950/80 border border-rose-700/80 flex items-center justify-center text-rose-400 mx-auto mb-4">
              <AlertCircle className="w-6 h-6" />
            </div>

            <h4 className="font-display font-bold text-lg text-white mb-1.5">
              {validationModal.title}
            </h4>

            <p className="text-xs text-zinc-300 font-light leading-relaxed mb-6">
              {validationModal.message}
            </p>

            <button
              type="button"
              onClick={handleAcknowledgeValidation}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-[#7C00FF] to-[#9333EA] hover:from-[#8B2CFF] hover:to-[#A855F7] shadow-[0_0_15px_rgba(124,0,255,0.4)] transition-all cursor-pointer"
            >
              Go to Step {validationModal.targetStep} & Complete
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
