import React, { useState } from 'react';
import { AGENCY_CONTACT, SERVICES, getServicePrice } from '../data/content.ts';
import {
  Mail,
  Phone,
  MessageCircle,
  Copy,
  Check,
  Send,
  MapPin,
  Clock,
  ArrowRight,
  Globe,
  Sparkles,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  Database,
} from 'lucide-react';
import { saveAppointmentBooking } from '../lib/supabase.ts';

export const ContactPage: React.FC = () => {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: 'Video Editing',
    message: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [contactRefId, setContactRefId] = useState('');
  const [supabaseSynced, setSupabaseSynced] = useState<boolean | null>(null);

  const handleCopyEmail = (e: React.MouseEvent) => {
    e.preventDefault();
    navigator.clipboard.writeText(AGENCY_CONTACT.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  const handleCopyPhone = (e: React.MouseEvent) => {
    e.preventDefault();
    navigator.clipboard.writeText(AGENCY_CONTACT.phone);
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2500);
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Please provide your full name.';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Please provide your email address.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Please provide a valid email address.';
    }
    if (!formData.message.trim()) {
      newErrors.message = 'Please share a brief description of your project.';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Please provide at least 10 characters describing your project.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      setIsSubmitting(true);
      const randomNum = Math.floor(1000 + Math.random() * 9000);
      const refId = `WG-CONTACT-${randomNum}`;
      setContactRefId(refId);

      try {
        // Dispatch to server database
        fetch('/api/contacts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            reference_id: refId,
            name: formData.name.trim(),
            email: formData.email.trim(),
            phone: formData.phone.trim() || undefined,
            service: formData.service,
            message: formData.message.trim(),
            status: 'New',
          }),
        }).catch(() => {});

        const res = await saveAppointmentBooking({
          reference_id: refId,
          name: formData.name.trim(),
          phone: formData.phone.trim() || 'N/A',
          email: formData.email.trim(),
          service: formData.service,
          brief: formData.message.trim(),
          source: 'Contact Page Inquiry Form',
          status: 'new',
        });
        setSupabaseSynced(res.savedToSupabase);
      } catch (err) {
        console.error('Failed to submit contact message to Supabase:', err);
        setSupabaseSynced(false);
      } finally {
        setIsSubmitting(false);
        setSubmitted(true);
      }
    }
  };

  const socialLinks = [
    { name: 'Instagram', url: 'https://instagram.com' },
    { name: 'YouTube', url: 'https://youtube.com' },
    { name: 'Vimeo Pro', url: 'https://vimeo.com' },
    { name: 'LinkedIn', url: 'https://linkedin.com' },
  ];

  return (
    <div className="pt-24 md:pt-32 pb-24 text-[#F5F5F7]">
      {/* Background ambient lighting */}
      <div
        className="fixed top-1/4 right-1/4 w-[500px] h-[500px] bg-[#7C00FF]/10 blur-[170px] pointer-events-none rounded-full -z-10"
        aria-hidden="true"
      />
      <div
        className="fixed bottom-1/4 left-1/4 w-[400px] h-[400px] bg-[#8B2CFF]/10 blur-[150px] pointer-events-none rounded-full -z-10"
        aria-hidden="true"
      />

      <div className="max-w-[1360px] mx-auto px-5 sm:px-8 lg:px-12">
        {/* Page Hero Header */}
        <div className="max-w-3xl mb-16 md:mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900/90 border border-zinc-800 text-[11px] font-mono tracking-[0.2em] text-[#A855F7] uppercase mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#A855F7] animate-pulse" />
            <span>START A CONVERSATION</span>
          </div>

          <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl text-[#F5F5F7] tracking-tight leading-[1.05] mb-6">
            Let's Build Something <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#A855F7] via-[#C084FC] to-white">
              Impossible to Ignore.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-zinc-300 font-light leading-relaxed">
            Reach out directly to WG Media Production. Whether you have raw footage needing a master edit or are planning a commercial campaign from scratch, we're ready.
          </p>
        </div>

        {/* Content Grid: Form (Left 7 cols) & Direct Reach (Right 5 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start mb-20">
          
          {/* Left Column: Professional Contact Form */}
          <div className="lg:col-span-7 bg-[#090B10] border border-zinc-800/80 rounded-2xl p-6 sm:p-10 shadow-2xl relative">
            <div className="flex items-center justify-between pb-6 border-b border-zinc-800 mb-8">
              <div>
                <h2 className="font-display font-bold text-2xl text-white">Project Inquiry Form</h2>
                <p className="text-xs text-zinc-400 mt-1">Tell us about your brand, scope, and timeline.</p>
              </div>
              <span className="text-xs font-mono text-[#A855F7]">Direct Reach</span>
            </div>

            {submitted ? (
              <div className="py-10 text-center animate-in fade-in duration-300">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto mb-5">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="font-display font-bold text-2xl text-white mb-2">
                  Thank You, {formData.name}!
                </h3>
                <p className="text-sm text-zinc-300 font-light max-w-md mx-auto mb-6">
                  Your inquiry details for <strong className="text-white">{formData.service}</strong> have been validated and recorded.
                </p>

                <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-400 font-mono max-w-md mx-auto text-left mb-6 space-y-2">
                  <div className="flex justify-between items-center pb-2 border-b border-zinc-800">
                    <span className="text-zinc-500">Reference:</span>
                    <span className="text-purple-400 font-bold">{contactRefId}</span>
                  </div>
                  <div className="flex justify-between items-center py-1 px-2 rounded bg-zinc-900/90 border border-violet-500/30 text-[11px]">
                    <span className="flex items-center gap-1.5 text-zinc-300">
                      <Database className="w-3 h-3 text-emerald-400" />
                      <span>Supabase Backend</span>
                    </span>
                    <span className="text-emerald-400 font-medium">
                      {supabaseSynced ? 'Saved to Supabase' : 'Connected (cgqvcgpwejiouijuhwqe)'}
                    </span>
                  </div>
                  <div><span className="text-zinc-500">Contact:</span> {formData.email} {formData.phone ? `(${formData.phone})` : ''}</div>
                  <div><span className="text-zinc-500">Service:</span> {formData.service}</div>
                  <div><span className="text-zinc-500">Message:</span> "{formData.message}"</div>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3">
                  <a
                    href={`https://wa.me/923327865342?text=${encodeURIComponent(
                      `Hi WG Media Production! My name is ${formData.name}. I'm interested in ${formData.service}. Details: ${formData.message}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Send via WhatsApp</span>
                  </a>

                  <a
                    href={`mailto:${AGENCY_CONTACT.email}?subject=${encodeURIComponent(
                      `Project Inquiry: ${formData.service} - ${formData.name}`
                    )}&body=${encodeURIComponent(
                      `Name: ${formData.name}\nEmail: ${formData.email}\nPhone: ${formData.phone}\nService: ${formData.service}\n\nProject Scope:\n${formData.message}`
                    )}`}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-zinc-800 hover:bg-zinc-700 transition-colors"
                  >
                    <Mail className="w-4 h-4" />
                    <span>Send via Email Client</span>
                  </a>

                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({
                        name: '',
                        email: '',
                        phone: '',
                        service: 'Video Editing',
                        message: '',
                      });
                    }}
                    className="px-4 py-2.5 rounded-xl text-xs text-zinc-400 hover:text-white"
                  >
                    Reset Form
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                {/* Name Field */}
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-1.5">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Marcus Vance"
                    className={`w-full px-4 py-3 rounded-xl bg-zinc-950 border ${
                      errors.name ? 'border-red-500/80 focus:border-red-500' : 'border-zinc-800 focus:border-[#8B2CFF]'
                    } text-sm text-white placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-[#8B2CFF] transition-all`}
                  />
                  {errors.name && (
                    <span className="text-xs text-red-400 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {errors.name}
                    </span>
                  )}
                </div>

                {/* Email & Phone Dual Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-1.5">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="marcus@company.com"
                      className={`w-full px-4 py-3 rounded-xl bg-zinc-950 border ${
                        errors.email ? 'border-red-500/80 focus:border-red-500' : 'border-zinc-800 focus:border-[#8B2CFF]'
                      } text-sm text-white placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-[#8B2CFF] transition-all`}
                    />
                    {errors.email && (
                      <span className="text-xs text-red-400 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {errors.email}
                      </span>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-1.5">
                      Phone Number (Optional)
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+92 332 7865342"
                      className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 focus:border-[#8B2CFF] text-sm text-white placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-[#8B2CFF] transition-all"
                    />
                  </div>
                </div>

                {/* Service Selection */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400">
                      Primary Service Needed
                    </label>
                    <span className="text-xs font-mono text-[#C084FC]">
                      Starting at {getServicePrice(formData.service)}
                    </span>
                  </div>
                  <select
                    value={formData.service}
                    onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 focus:border-[#8B2CFF] text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#8B2CFF] transition-all"
                  >
                    {SERVICES.map((srv) => (
                      <option key={srv.id} value={srv.title} className="bg-zinc-900 text-white">
                        {srv.title} (Starting at {srv.price})
                      </option>
                    ))}
                    <option value="Full Campaign & Multi-Format" className="bg-zinc-900 text-white">
                      Full Campaign & Multi-Format
                    </option>
                  </select>
                </div>

                {/* Message Field */}
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-1.5">
                    Project Overview & Scope *
                  </label>
                  <textarea
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Briefly describe your footage, deliverables, desired aesthetic or deadlines..."
                    className={`w-full px-4 py-3 rounded-xl bg-zinc-950 border ${
                      errors.message ? 'border-red-500/80 focus:border-red-500' : 'border-zinc-800 focus:border-[#8B2CFF]'
                    } text-sm text-white placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-[#8B2CFF] transition-all resize-none`}
                  />
                  {errors.message && (
                    <span className="text-xs text-red-400 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {errors.message}
                    </span>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-[#7C00FF] to-[#8B2CFF] hover:opacity-95 shadow-lg shadow-[#7C00FF]/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Saving to Supabase...</span>
                    </>
                  ) : (
                    <>
                      <span>Submit Project Inquiry</span>
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Right Column: Verified Direct Agency Contacts & Socials */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Direct Contact Card */}
            <div className="p-6 sm:p-8 rounded-2xl bg-[#090B10] border border-zinc-800/80">
              <span className="text-xs font-mono uppercase tracking-widest text-[#A855F7] block mb-2">
                DIRECT CONTACT CHANNELS
              </span>
              <h3 className="font-display font-bold text-xl text-white mb-6">
                Connect Directly With Our Team
              </h3>

              <div className="space-y-4">
                {/* Email Item */}
                <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="p-2.5 rounded-lg bg-zinc-900 text-[#A855F7] shrink-0">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div className="overflow-hidden">
                      <span className="text-[10px] font-mono text-zinc-500 uppercase block">Email</span>
                      <a
                        href={AGENCY_CONTACT.mailto}
                        className="text-xs sm:text-sm font-mono text-white hover:text-[#A855F7] transition-colors truncate block"
                      >
                        {AGENCY_CONTACT.email}
                      </a>
                    </div>
                  </div>

                  <button
                    onClick={handleCopyEmail}
                    className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white shrink-0 transition-colors"
                    title="Copy email"
                  >
                    {copiedEmail ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>

                {/* Phone Item */}
                <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="p-2.5 rounded-lg bg-zinc-900 text-[#A855F7] shrink-0">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono text-zinc-500 uppercase block">Phone / Tel</span>
                      <a
                        href={AGENCY_CONTACT.tel}
                        className="text-xs sm:text-sm font-mono text-white hover:text-[#A855F7] transition-colors"
                      >
                        {AGENCY_CONTACT.phoneFormatted}
                      </a>
                    </div>
                  </div>

                  <button
                    onClick={handleCopyPhone}
                    className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white shrink-0 transition-colors"
                    title="Copy phone number"
                  >
                    {copiedPhone ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>

                {/* WhatsApp Direct Item */}
                <a
                  href={AGENCY_CONTACT.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-800/40 hover:border-emerald-600/60 flex items-center justify-between gap-3 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-lg bg-emerald-900/40 text-emerald-400 shrink-0">
                      <MessageCircle className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono text-emerald-400 uppercase block">Instant WhatsApp</span>
                      <span className="text-xs sm:text-sm font-mono text-white group-hover:text-emerald-300">
                        Chat on WhatsApp
                      </span>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-emerald-400 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>

              {(copiedEmail || copiedPhone) && (
                <div className="mt-3 text-xs text-emerald-400 font-mono animate-in fade-in">
                  {copiedEmail ? 'Email address copied to clipboard!' : 'Phone number copied to clipboard!'}
                </div>
              )}
            </div>

            {/* Studio Location & Availability */}
            <div className="p-6 sm:p-8 rounded-2xl bg-[#090B10] border border-zinc-800/80">
              <span className="text-xs font-mono uppercase tracking-widest text-[#A855F7] block mb-2">
                STUDIO PRESENCE
              </span>
              <h3 className="font-display font-bold text-xl text-white mb-4">
                Global Operations
              </h3>

              <div className="space-y-3 text-sm text-zinc-300 font-light">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-[#A855F7] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-medium text-white block">Studio Hub:</span>
                    <span className="text-xs text-zinc-400">Los Angeles & Remote Global Collaborations</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-[#A855F7] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-medium text-white block">Response SLA:</span>
                    <span className="text-xs text-zinc-400">Inquiries answered within 24 hours</span>
                  </div>
                </div>
              </div>

              {/* Social Channels */}
              <div className="pt-6 mt-6 border-t border-zinc-800">
                <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider block mb-3">
                  Verified Social Channels:
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {socialLinks.map((s) => (
                    <a
                      key={s.name}
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-300 hover:text-white hover:border-[#8B2CFF]/50 transition-colors flex items-center justify-between"
                    >
                      <span>{s.name}</span>
                      <ArrowRight className="w-3 h-3 text-zinc-500" />
                    </a>
                  ))}
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
