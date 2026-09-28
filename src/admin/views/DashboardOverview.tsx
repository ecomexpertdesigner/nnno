import React from 'react';
import {
  TrendingUp,
  FileVideo,
  Mail,
  Users,
  Eye,
  Calendar,
  Clock,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Phone,
  Layers,
  ChevronRight,
  Activity,
  FolderOpen,
} from 'lucide-react';
import { DashboardStats, InquiryRecord, ContactRecord } from '../types.ts';

interface DashboardOverviewProps {
  stats: DashboardStats | null;
  isLoading: boolean;
  onNavigateTab: (tab: string) => void;
  onSelectInquiry: (inq: InquiryRecord) => void;
  onSelectContact: (contact: ContactRecord) => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  stats,
  isLoading,
  onNavigateTab,
  onSelectInquiry,
  onSelectContact,
}) => {
  if (isLoading || !stats) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[380px] text-zinc-500 font-mono text-xs">
        <div className="w-5 h-5 border-2 border-violet-500/20 border-t-violet-400 rounded-full animate-spin mb-3" />
        <span>Loading verified agency data...</span>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    const s = status.toLowerCase();
    if (s === 'new') {
      return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
    }
    if (s === 'contacted') {
      return 'text-sky-400 bg-sky-500/10 border-sky-500/20';
    }
    if (s === 'in progress' || s === 'in discussion' || s === 'quoted' || s === 'approved') {
      return 'text-violet-300 bg-violet-500/10 border-violet-500/20';
    }
    if (s === 'completed') {
      return 'text-teal-300 bg-teal-500/10 border-teal-500/20';
    }
    return 'text-zinc-400 bg-zinc-800/40 border-zinc-700/30';
  };

  return (
    <div className="space-y-10 max-w-7xl mx-auto">
      {/* 1. TOP EDITORIAL HERO HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-white/[0.06]">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] font-mono tracking-widest text-zinc-400 uppercase">
              WG Media Production • Studio Control Room
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight">
            Agency Operations
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 font-light mt-1">
            Real-time project pipeline, verified Supabase submissions, and audience telemetry.
          </p>
        </div>

        {/* Live Status Indicator Pill */}
        <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-zinc-900/60 border border-white/[0.08] text-xs font-mono text-zinc-300 self-start md:self-auto">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
          </span>
          <span className="text-[11px] text-zinc-300">Supabase Connected • Source of Truth</span>
        </div>
      </div>

      {/* 2. REFINED ANALYTICS SECTION (NON-BOX-HEAVY) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono tracking-wider uppercase text-zinc-400 font-medium">
            Live Metrics & Lead Pipeline
          </span>
          <button
            onClick={() => onNavigateTab('analytics')}
            className="text-[11px] font-mono text-violet-400 hover:text-violet-300 transition-colors flex items-center gap-1"
          >
            <span>Detailed Traffic Chart</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        {/* Primary Lead Counts: Elegant, lightweight borderless blocks with subtle divider */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-white/[0.06] rounded-xl overflow-hidden border border-white/[0.06]">
          {/* Project Inquiries */}
          <div
            onClick={() => onNavigateTab('inquiries')}
            className="p-5 sm:p-6 bg-[#080A0F] hover:bg-[#0B0D14] cursor-pointer transition-colors group"
          >
            <div className="flex items-center justify-between text-zinc-400 mb-2">
              <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 group-hover:text-violet-300 transition-colors">
                Project Inquiries
              </span>
              <FileVideo className="w-4 h-4 text-violet-400/70" />
            </div>
            <div className="text-3xl sm:text-4xl font-display font-bold text-white tracking-tight">
              {stats.totalProjectInquiries.toLocaleString()}
            </div>
            <div className="flex items-center justify-between mt-2 text-[11px] text-zinc-500 font-mono">
              <span>Public bookings</span>
              <span className="text-violet-400 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5">
                Inspect <ChevronRight className="w-3 h-3" />
              </span>
            </div>
          </div>

          {/* Contact Submissions */}
          <div
            onClick={() => onNavigateTab('contacts')}
            className="p-5 sm:p-6 bg-[#080A0F] hover:bg-[#0B0D14] cursor-pointer transition-colors group"
          >
            <div className="flex items-center justify-between text-zinc-400 mb-2">
              <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 group-hover:text-fuchsia-300 transition-colors">
                Contact Messages
              </span>
              <Mail className="w-4 h-4 text-fuchsia-400/70" />
            </div>
            <div className="text-3xl sm:text-4xl font-display font-bold text-white tracking-tight">
              {stats.totalContactSubmissions.toLocaleString()}
            </div>
            <div className="flex items-center justify-between mt-2 text-[11px] text-zinc-500 font-mono">
              <span>Contact page inquiries</span>
              <span className="text-fuchsia-400 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5">
                Inspect <ChevronRight className="w-3 h-3" />
              </span>
            </div>
          </div>

          {/* Active Leads */}
          <div
            onClick={() => onNavigateTab('inquiries')}
            className="p-5 sm:p-6 bg-[#080A0F] hover:bg-[#0B0D14] cursor-pointer transition-colors group"
          >
            <div className="flex items-center justify-between text-zinc-400 mb-2">
              <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 group-hover:text-emerald-300 transition-colors">
                Active / Unread Leads
              </span>
              <Users className="w-4 h-4 text-emerald-400/70" />
            </div>
            <div className="text-3xl sm:text-4xl font-display font-bold text-white tracking-tight">
              {stats.activeUnreadLeads.toLocaleString()}
            </div>
            <div className="flex items-center justify-between mt-2 text-[11px] text-zinc-500 font-mono">
              <span>Requires response</span>
              <span className="text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5">
                View pipeline <ChevronRight className="w-3 h-3" />
              </span>
            </div>
          </div>
        </div>

        {/* Secondary Trailing Audience Strip: Compact horizontal telemetry row */}
        <div className="p-4 sm:p-5 rounded-xl bg-[#080A0F]/50 border border-white/[0.05]">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 divide-y sm:divide-y-0 sm:divide-x divide-white/[0.05]">
            <div className="pt-2 sm:pt-0 sm:px-3 first:pl-0">
              <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 block mb-1">
                Total Visits
              </span>
              <span className="text-lg font-bold font-display text-white">
                {stats.totalVisits.toLocaleString()}
              </span>
            </div>

            <div className="pt-2 sm:pt-0 sm:px-3">
              <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 block mb-1">
                Last 7 Days
              </span>
              <span className="text-lg font-bold font-display text-zinc-200">
                {stats.visits7d.toLocaleString()}
              </span>
            </div>

            <div className="pt-2 sm:pt-0 sm:px-3">
              <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 block mb-1">
                Last 30 Days
              </span>
              <span className="text-lg font-bold font-display text-zinc-200">
                {stats.visits30d.toLocaleString()}
              </span>
            </div>

            <div className="pt-2 sm:pt-0 sm:px-3">
              <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 block mb-1">
                Last 60 Days
              </span>
              <span className="text-lg font-bold font-display text-zinc-200">
                {stats.visits60d.toLocaleString()}
              </span>
            </div>

            <div className="pt-2 sm:pt-0 sm:px-3">
              <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 block mb-1">
                Last 90 Days
              </span>
              <span className="text-lg font-bold font-display text-zinc-200">
                {stats.visits90d.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. RECENT INQUIRIES & SUBMISSIONS (EDITORIAL FLOW) */}
      <section className="space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Latest Project Inquiries */}
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
                <h2 className="text-sm font-semibold text-white tracking-wide">
                  Recent Project Inquiries
                </h2>
                <span className="text-[10px] font-mono text-zinc-500">
                  ({stats.totalProjectInquiries})
                </span>
              </div>
              <button
                onClick={() => onNavigateTab('inquiries')}
                className="text-xs text-violet-400 hover:text-violet-300 font-mono transition-colors flex items-center gap-1"
              >
                <span>View all</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {stats.recentInquiries.length === 0 ? (
              <div className="py-14 text-center text-zinc-500 font-mono text-xs">
                <p className="text-zinc-300 font-medium">No project inquiries yet.</p>
                <p className="text-[11px] text-zinc-500 mt-1">
                  New inquiries from your website will appear here.
                </p>
              </div>
            ) : (
              <div className="space-y-1.5">
                {stats.recentInquiries.map((inq) => (
                  <div
                    key={inq.id}
                    onClick={() => onSelectInquiry(inq)}
                    className="p-3.5 rounded-lg hover:bg-white/[0.03] transition-colors cursor-pointer flex items-center justify-between gap-3 border border-transparent hover:border-white/[0.06] group"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-white truncate group-hover:text-violet-300 transition-colors">
                          {inq.name}
                        </span>
                        <span className="text-[10px] font-mono text-zinc-500">
                          {inq.reference_id}
                        </span>
                      </div>
                      <div className="text-xs text-zinc-400 truncate mt-0.5">
                        <span className="text-zinc-300">{inq.service}</span>
                        {inq.budget && (
                          <span className="text-zinc-500"> • {inq.budget}</span>
                        )}
                        {inq.phone && (
                          <span className="text-zinc-500 font-mono"> • {inq.phone}</span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded-md border ${getStatusBadge(
                          inq.status
                        )}`}
                      >
                        {inq.status}
                      </span>
                      <ChevronRight className="w-3.5 h-3.5 text-zinc-600 group-hover:text-zinc-300 transition-colors" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Latest Contact Submissions */}
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-fuchsia-400" />
                <h2 className="text-sm font-semibold text-white tracking-wide">
                  Recent Contact Messages
                </h2>
                <span className="text-[10px] font-mono text-zinc-500">
                  ({stats.totalContactSubmissions})
                </span>
              </div>
              <button
                onClick={() => onNavigateTab('contacts')}
                className="text-xs text-fuchsia-400 hover:text-fuchsia-300 font-mono transition-colors flex items-center gap-1"
              >
                <span>View all</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {stats.recentContacts.length === 0 ? (
              <div className="py-14 text-center text-zinc-500 font-mono text-xs">
                <p className="text-zinc-300 font-medium">No contact submissions yet.</p>
                <p className="text-[11px] text-zinc-500 mt-1">
                  New submissions from the Contact Us form will appear here.
                </p>
              </div>
            ) : (
              <div className="space-y-1.5">
                {stats.recentContacts.map((contact) => (
                  <div
                    key={contact.id}
                    onClick={() => onSelectContact(contact)}
                    className="p-3.5 rounded-lg hover:bg-white/[0.03] transition-colors cursor-pointer flex items-center justify-between gap-3 border border-transparent hover:border-white/[0.06] group"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-white truncate group-hover:text-fuchsia-300 transition-colors">
                          {contact.name}
                        </span>
                        <span className="text-[10px] font-mono text-zinc-500">
                          {contact.reference_id}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-400 truncate mt-0.5">
                        "{contact.message}"
                      </p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded-md border ${getStatusBadge(
                          contact.status
                        )}`}
                      >
                        {contact.status}
                      </span>
                      <ChevronRight className="w-3.5 h-3.5 text-zinc-600 group-hover:text-zinc-300 transition-colors" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 4. RECENT ACTIVITY & SERVICE DISTRIBUTION */}
      <section className="space-y-4 pt-4 border-t border-white/[0.06]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Real Audit Activity Stream */}
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-zinc-400" />
                <h2 className="text-sm font-semibold text-white tracking-wide">
                  Recent Activity Audit
                </h2>
              </div>
              <button
                onClick={() => onNavigateTab('activity')}
                className="text-xs text-zinc-400 hover:text-white font-mono transition-colors flex items-center gap-1"
              >
                <span>Full history</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>

            {stats.recentActivity.length === 0 ? (
              <div className="py-10 text-center text-zinc-500 font-mono text-xs">
                <p>No recent activity yet.</p>
                <p className="text-[11px] text-zinc-600 mt-0.5">
                  Submissions, status changes, and admin deletions will be recorded here.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {stats.recentActivity.slice(0, 5).map((act) => (
                  <div
                    key={act.id}
                    className="flex items-start gap-3 text-xs py-2 px-1 rounded hover:bg-white/[0.02]"
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${
                        act.type?.includes('deleted')
                          ? 'bg-rose-400'
                          : act.actor === 'Visitor'
                          ? 'bg-emerald-400'
                          : 'bg-violet-400'
                      }`}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="text-zinc-200 font-medium truncate">{act.title}</div>
                      <p className="text-[11px] text-zinc-400 truncate">{act.description}</p>
                    </div>
                    <span className="text-[10px] text-zinc-500 font-mono shrink-0">
                      {new Date(act.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Service Inquiry Distribution */}
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
              <div className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-400/80" />
                <h2 className="text-sm font-semibold text-white tracking-wide">
                  Service Demand
                </h2>
              </div>
              <button
                onClick={() => onNavigateTab('services')}
                className="text-xs text-zinc-400 hover:text-white font-mono transition-colors flex items-center gap-1"
              >
                <span>Analytics</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>

            {!stats.serviceAnalytics.hasData ||
            stats.serviceAnalytics.services.length === 0 ? (
              <div className="py-10 text-center text-zinc-500 font-mono text-xs">
                <p>No service inquiries yet.</p>
                <p className="text-[11px] text-zinc-600 mt-0.5">
                  Calculated purely from real customer submissions.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {stats.serviceAnalytics.services.slice(0, 4).map((item) => (
                  <div key={item.name} className="space-y-1">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-zinc-200 truncate pr-2">{item.name}</span>
                      <span className="text-violet-300 font-semibold shrink-0">
                        {item.count} ({item.percentage}%)
                      </span>
                    </div>
                    <div className="w-full h-1 bg-white/[0.06] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-violet-500 to-purple-400 rounded-full"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
