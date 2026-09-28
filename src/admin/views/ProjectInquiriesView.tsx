import React, { useState, useEffect } from 'react';
import {
  FileVideo,
  Search,
  Filter,
  Eye,
  Phone,
  Mail,
  ExternalLink,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Save,
  X,
  Sparkles,
  ArrowRight,
  MessageSquare,
  DollarSign,
  Layers,
  Film,
  Trash2,
  RefreshCw,
  Sliders,
  Check,
} from 'lucide-react';
import { useAdminAuth } from '../AdminAuthContext.tsx';
import { InquiryRecord, InquiryStatus } from '../types.ts';
import { supabase } from '../../lib/supabase.ts';

const STATUS_OPTIONS: InquiryStatus[] = [
  'New',
  'Contacted',
  'In Progress',
  'Completed',
  'Cancelled',
];

interface ProjectInquiriesViewProps {
  initialSelectedInquiry?: InquiryRecord | null;
  onClearInitialSelected?: () => void;
}

export const ProjectInquiriesView: React.FC<ProjectInquiriesViewProps> = ({
  initialSelectedInquiry,
  onClearInitialSelected,
}) => {
  const { authFetch } = useAdminAuth();
  const [inquiries, setInquiries] = useState<InquiryRecord[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [selectedInquiry, setSelectedInquiry] = useState<InquiryRecord | null>(
    initialSelectedInquiry || null
  );

  // Status & Notes editing state
  const [currentStatus, setCurrentStatus] = useState<InquiryStatus>('New');
  const [currentNotes, setCurrentNotes] = useState<string>('');
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [updateSuccess, setUpdateSuccess] = useState<boolean>(false);

  // Delete Confirmation State
  const [inquiryToDelete, setInquiryToDelete] = useState<InquiryRecord | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const fetchInquiries = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery.trim()) params.set('search', searchQuery.trim());
      if (statusFilter !== 'All') params.set('status', statusFilter);

      const res = await authFetch(`/api/admin/inquiries?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setInquiries(data);
      }
    } catch (err) {
      console.error('Error fetching inquiries:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, [searchQuery, statusFilter]);

  // Realtime listener for newly submitted inquiries
  useEffect(() => {
    try {
      const channel = supabase
        .channel('admin-inquiries-realtime')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'appointments' },
          () => {
            fetchInquiries();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    if (initialSelectedInquiry) {
      setSelectedInquiry(initialSelectedInquiry);
      setCurrentStatus(initialSelectedInquiry.status || 'New');
      setCurrentNotes(initialSelectedInquiry.notes || '');
    }
  }, [initialSelectedInquiry]);

  const handleOpenDetail = (inq: InquiryRecord) => {
    setSelectedInquiry(inq);
    setCurrentStatus(inq.status || 'New');
    setCurrentNotes(inq.notes || '');
    setUpdateSuccess(false);
  };

  const handleCloseDetail = () => {
    setSelectedInquiry(null);
    if (onClearInitialSelected) onClearInitialSelected();
  };

  const handleSaveInquiryUpdates = async () => {
    if (!selectedInquiry) return;
    setIsUpdating(true);
    setUpdateSuccess(false);

    try {
      const res = await authFetch(`/api/admin/inquiries/${selectedInquiry.id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          status: currentStatus,
          notes: currentNotes,
        }),
      });

      if (res.ok) {
        const { inquiry } = await res.json();
        setSelectedInquiry(inquiry);
        setInquiries((prev) =>
          prev.map((item) => (item.id === inquiry.id ? inquiry : item))
        );
        setUpdateSuccess(true);
        setTimeout(() => setUpdateSuccess(false), 3000);
      }
    } catch (err) {
      console.error('Failed to update inquiry:', err);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!inquiryToDelete) return;
    setIsDeleting(true);

    try {
      const res = await authFetch(`/api/admin/inquiries/${inquiryToDelete.id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setInquiries((prev) => prev.filter((item) => item.id !== inquiryToDelete.id));
        if (selectedInquiry?.id === inquiryToDelete.id) {
          setSelectedInquiry(null);
        }
        setInquiryToDelete(null);
      }
    } catch (err) {
      console.error('Failed to delete inquiry:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const s = (status || '').toLowerCase();
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
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* 1. Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-white/[0.06]">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
            <span className="text-[11px] font-mono tracking-wider uppercase text-zinc-400">
              Supabase Source of Truth
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-display font-bold text-white tracking-tight flex items-center gap-3">
            <span>Project Inquiries</span>
            <span className="text-xs font-mono px-2 py-0.5 rounded-md bg-white/[0.05] border border-white/[0.08] text-zinc-300">
              {inquiries.length} {inquiries.length === 1 ? 'record' : 'records'}
            </span>
          </h1>
          <p className="text-xs text-zinc-400 font-light mt-0.5">
            Real customer booking requests received via the website appointment flow.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative min-w-[200px] flex-1 sm:flex-none">
            <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search name, phone, ref..."
              className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-zinc-900/80 border border-white/[0.08] text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500/50"
            />
          </div>

          <div className="flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-zinc-500" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-zinc-900/80 border border-white/[0.08] rounded-lg px-2.5 py-1.5 text-xs text-zinc-300 focus:outline-none focus:border-violet-500/50"
            >
              <option value="All">All Statuses</option>
              {STATUS_OPTIONS.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>

            <button
              onClick={fetchInquiries}
              title="Refresh inquiries"
              className="p-1.5 rounded-lg bg-zinc-900/80 border border-white/[0.08] text-zinc-400 hover:text-white transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-violet-400' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* 2. Main Inquiries List */}
      {isLoading ? (
        <div className="py-24 text-center text-zinc-500 font-mono text-xs flex flex-col items-center justify-center">
          <div className="w-5 h-5 border-2 border-violet-500/20 border-t-violet-400 rounded-full animate-spin mb-3" />
          <span>Fetching Supabase records...</span>
        </div>
      ) : inquiries.length === 0 ? (
        <div className="py-20 flex flex-col items-center justify-center text-center text-zinc-500 font-mono text-xs">
          <FileVideo className="w-8 h-8 text-zinc-700 mb-3" />
          <p className="text-sm text-zinc-300 font-semibold mb-1">
            No project inquiries yet.
          </p>
          <p className="text-xs text-zinc-500 max-w-sm">
            New inquiries from your website will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Mobile Stacked View (< 768px) */}
          <div className="md:hidden space-y-2.5">
            {inquiries.map((inq) => (
              <div
                key={inq.id}
                onClick={() => handleOpenDetail(inq)}
                className="p-4 rounded-xl bg-[#080A0F] border border-white/[0.06] hover:border-violet-500/30 cursor-pointer transition-all space-y-3 group"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <span className="font-mono text-[11px] text-zinc-500 block">
                      {inq.reference_id}
                    </span>
                    <h3 className="font-semibold text-sm text-white group-hover:text-violet-300 transition-colors truncate mt-0.5">
                      {inq.name}
                    </h3>
                  </div>
                  <span
                    className={`inline-flex px-2 py-0.5 rounded text-[10px] font-mono border shrink-0 ${getStatusBadge(
                      inq.status
                    )}`}
                  >
                    {inq.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-2 border-t border-white/[0.04]">
                  <div>
                    <span className="text-[10px] text-zinc-500 block uppercase">Service</span>
                    <span className="text-zinc-200 truncate block">{inq.service || 'Not provided'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-500 block uppercase">Budget</span>
                    <span className="text-zinc-200 truncate block">{inq.budget || 'Not provided'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-500 block uppercase">Phone</span>
                    <span className="text-zinc-300 truncate block">{inq.phone || 'Not provided'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-500 block uppercase">Date</span>
                    <span className="text-zinc-400 block">
                      {new Date(inq.created_at).toLocaleDateString([], {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-white/[0.04]">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setInquiryToDelete(inq);
                    }}
                    className="text-zinc-500 hover:text-rose-400 transition-colors p-1"
                    title="Delete inquiry"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  <span className="inline-flex items-center gap-1 text-xs text-violet-400 font-mono">
                    <span>Inspect Brief</span>
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table View (>= 768px) */}
          <div className="hidden md:block rounded-xl border border-white/[0.06] bg-[#080A0F] overflow-hidden">
            <table className="w-full text-left text-xs font-sans">
              <thead className="bg-white/[0.02] text-[10px] uppercase font-mono text-zinc-400 border-b border-white/[0.06] tracking-wider">
                <tr>
                  <th className="py-3 px-4">Ref ID</th>
                  <th className="py-3 px-4">Client</th>
                  <th className="py-3 px-4">Phone / Email</th>
                  <th className="py-3 px-4">Service</th>
                  <th className="py-3 px-4">Budget / Plan</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {inquiries.map((inq) => (
                  <tr
                    key={inq.id}
                    onClick={() => handleOpenDetail(inq)}
                    className="hover:bg-white/[0.02] cursor-pointer transition-colors group"
                  >
                    <td className="py-3 px-4 font-mono text-zinc-400 font-medium">
                      {inq.reference_id}
                    </td>
                    <td className="py-3 px-4 font-medium text-white group-hover:text-violet-300 transition-colors">
                      {inq.name}
                    </td>
                    <td className="py-3 px-4 font-mono text-zinc-300">
                      <div>{inq.phone || 'Not provided'}</div>
                      {inq.email && (
                        <div className="text-[10px] text-zinc-500">{inq.email}</div>
                      )}
                    </td>
                    <td className="py-3 px-4 text-zinc-200">
                      <span>{inq.service}</span>
                    </td>
                    <td className="py-3 px-4 font-mono text-zinc-300">
                      {inq.budget || inq.package || 'Not provided'}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded text-[10px] font-mono border ${getStatusBadge(
                          inq.status
                        )}`}
                      >
                        {inq.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-zinc-500 text-[11px]">
                      {new Date(inq.created_at).toLocaleDateString([], {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenDetail(inq);
                          }}
                          className="px-2.5 py-1 rounded bg-white/[0.04] hover:bg-violet-600 hover:text-white text-zinc-300 font-mono text-[11px] transition-colors"
                        >
                          View
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setInquiryToDelete(inq);
                          }}
                          className="p-1 rounded text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                          title="Delete inquiry"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. COMPLETE BOOKING DETAILS MODAL */}
      {selectedInquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm">
          <div
            className="w-full max-w-3xl max-h-[92vh] bg-[#080A0F] border border-white/[0.1] rounded-2xl shadow-2xl flex flex-col overflow-hidden text-zinc-200"
            role="dialog"
            aria-modal="true"
          >
            {/* Modal Header */}
            <div className="px-5 sm:px-6 py-4 bg-[#0B0D14] border-b border-white/[0.06] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-violet-500/10 border border-violet-500/20 text-violet-300">
                  <Film className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold font-display text-white">
                      Inquiry #{selectedInquiry.reference_id}
                    </h3>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded border ${getStatusBadge(
                        selectedInquiry.status
                      )}`}
                    >
                      {selectedInquiry.status}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-500 font-mono">
                    Submitted: {new Date(selectedInquiry.created_at).toLocaleString()}
                  </p>
                </div>
              </div>

              <button
                onClick={handleCloseDetail}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/[0.06] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6 text-xs">
              {/* SECTION 1: CLIENT DETAILS */}
              <div className="space-y-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-violet-400 block font-semibold">
                  Client Information
                </span>
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <span className="text-zinc-500 font-mono block text-[10px]">Full Name</span>
                    <span className="text-sm font-semibold text-white">
                      {selectedInquiry.name || 'Not provided'}
                    </span>
                  </div>
                  <div>
                    <span className="text-zinc-500 font-mono block text-[10px]">Phone Number</span>
                    {selectedInquiry.phone ? (
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="font-mono text-zinc-200">{selectedInquiry.phone}</span>
                        <a
                          href={`tel:${selectedInquiry.phone}`}
                          className="text-violet-400 hover:text-white"
                          title="Call"
                        >
                          <Phone className="w-3.5 h-3.5" />
                        </a>
                        <a
                          href={`https://wa.me/${selectedInquiry.phone.replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-emerald-400 hover:text-white"
                          title="WhatsApp"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    ) : (
                      <span className="text-zinc-500 italic">Not provided</span>
                    )}
                  </div>
                  <div>
                    <span className="text-zinc-500 font-mono block text-[10px]">Email Address</span>
                    {selectedInquiry.email ? (
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="font-mono text-zinc-200 truncate">{selectedInquiry.email}</span>
                        <a
                          href={`mailto:${selectedInquiry.email}`}
                          className="text-violet-400 hover:text-white"
                          title="Email client"
                        >
                          <Mail className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    ) : (
                      <span className="text-zinc-500 italic">Not provided</span>
                    )}
                  </div>
                </div>
              </div>

              {/* SECTION 2: PROJECT SPECIFICATIONS */}
              <div className="space-y-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-violet-400 block font-semibold">
                  Project Details
                </span>
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <span className="text-zinc-500 font-mono block text-[10px]">Service</span>
                      <span className="text-white font-medium">{selectedInquiry.service || 'Not provided'}</span>
                    </div>
                    <div>
                      <span className="text-zinc-500 font-mono block text-[10px]">Budget</span>
                      <span className="text-white font-mono">{selectedInquiry.budget || 'Not provided'}</span>
                    </div>
                    <div>
                      <span className="text-zinc-500 font-mono block text-[10px]">Package / Tier</span>
                      <span className="text-white font-medium">{selectedInquiry.package || 'Not provided'}</span>
                    </div>
                  </div>

                  {/* Aspect Ratios & Add-ons */}
                  <div className="pt-3 border-t border-white/[0.04] grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <span className="text-zinc-500 font-mono block text-[10px] mb-1">
                        Aspect Ratios
                      </span>
                      {selectedInquiry.aspect_ratios && selectedInquiry.aspect_ratios.length > 0 ? (
                        <div className="flex flex-wrap gap-1.5">
                          {selectedInquiry.aspect_ratios.map((ar) => (
                            <span
                              key={ar}
                              className="px-2 py-0.5 rounded bg-zinc-800 text-[10px] font-mono text-zinc-300"
                            >
                              {ar}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-zinc-500 italic">Not provided</span>
                      )}
                    </div>

                    <div>
                      <span className="text-zinc-500 font-mono block text-[10px] mb-1">
                        Requested Add-ons
                      </span>
                      {selectedInquiry.addons && selectedInquiry.addons.length > 0 ? (
                        <div className="flex flex-wrap gap-1.5">
                          {selectedInquiry.addons.map((add) => (
                            <span
                              key={add}
                              className="px-2 py-0.5 rounded bg-zinc-800 text-[10px] font-mono text-zinc-300"
                            >
                              {add}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-zinc-500 italic">Not provided</span>
                      )}
                    </div>
                  </div>

                  {/* Footage Link */}
                  <div className="pt-3 border-t border-white/[0.04]">
                    <span className="text-zinc-500 font-mono block text-[10px] mb-1">
                      Raw Footage / Reference Link
                    </span>
                    {selectedInquiry.project_link ? (
                      <a
                        href={selectedInquiry.project_link}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-500/10 border border-violet-500/20 text-violet-300 hover:text-white text-xs font-mono break-all"
                      >
                        <span>{selectedInquiry.project_link}</span>
                        <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                      </a>
                    ) : (
                      <span className="text-zinc-500 italic">Not provided</span>
                    )}
                  </div>

                  {/* Project Description / Brief */}
                  <div className="pt-3 border-t border-white/[0.04]">
                    <span className="text-zinc-500 font-mono block text-[10px] mb-1">
                      Project Description & Brief
                    </span>
                    <div className="p-3 rounded-lg bg-[#050609] border border-white/[0.06] text-zinc-200 leading-relaxed whitespace-pre-wrap">
                      {selectedInquiry.brief || 'Not provided'}
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 3: STATUS & ADMIN MANAGEMENT */}
              <div className="space-y-3">
                <span className="text-[10px] font-mono uppercase tracking-wider text-violet-400 block font-semibold">
                  Status Management & Internal Notes
                </span>
                <div className="p-4 rounded-xl bg-violet-950/15 border border-violet-500/20 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-zinc-400 font-mono text-[10px] uppercase mb-1">
                        Inquiry Status
                      </label>
                      <select
                        value={currentStatus}
                        onChange={(e) => setCurrentStatus(e.target.value as InquiryStatus)}
                        className="w-full bg-zinc-900 border border-white/[0.1] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500 font-medium"
                      >
                        {STATUS_OPTIONS.map((st) => (
                          <option key={st} value={st}>
                            {st}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-zinc-400 font-mono text-[10px] uppercase mb-1">
                        Source
                      </label>
                      <div className="px-3 py-2 rounded-lg bg-zinc-900/60 border border-white/[0.06] text-xs font-mono text-zinc-400">
                        {selectedInquiry.source || 'Appointment Booking Form'}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-zinc-400 font-mono text-[10px] uppercase mb-1">
                      Internal Admin Notes
                    </label>
                    <textarea
                      rows={3}
                      value={currentNotes}
                      onChange={(e) => setCurrentNotes(e.target.value)}
                      placeholder="Add follow-up notes, quotation status, client instructions..."
                      className="w-full bg-zinc-900 border border-white/[0.1] rounded-lg p-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <button
                      type="button"
                      onClick={handleSaveInquiryUpdates}
                      disabled={isUpdating}
                      className="px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white font-medium text-xs transition-colors flex items-center gap-1.5 disabled:opacity-50"
                    >
                      {isUpdating ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Saving to Supabase...</span>
                        </>
                      ) : (
                        <>
                          <Save className="w-3.5 h-3.5" />
                          <span>Save Status & Notes</span>
                        </>
                      )}
                    </button>

                    {updateSuccess && (
                      <span className="text-emerald-400 font-mono text-xs flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Saved to Supabase</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer with Delete Action */}
            <div className="px-5 sm:px-6 py-3 bg-[#0B0D14] border-t border-white/[0.06] flex items-center justify-between">
              <button
                type="button"
                onClick={() => setInquiryToDelete(selectedInquiry)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-rose-400 hover:text-white hover:bg-rose-500/20 text-xs font-mono transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Inquiry</span>
              </button>

              <button
                onClick={handleCloseDetail}
                className="px-4 py-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] text-zinc-300 text-xs font-mono transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. ADMIN DELETE CONFIRMATION DIALOG */}
      {inquiryToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div
            className="w-full max-w-md bg-[#0C0E14] border border-rose-500/30 rounded-2xl p-6 shadow-2xl space-y-4"
            role="alertdialog"
            aria-modal="true"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-full bg-rose-500/10 text-rose-400 shrink-0">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white font-display">
                  Delete this inquiry?
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Reference: <span className="font-mono text-zinc-200">{inquiryToDelete.reference_id}</span> ({inquiryToDelete.name})
                </p>
              </div>
            </div>

            <p className="text-xs text-zinc-400 leading-relaxed font-light">
              Once deleted, this record will be permanently removed.
            </p>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/[0.06]">
              <button
                type="button"
                onClick={() => setInquiryToDelete(null)}
                disabled={isDeleting}
                className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-mono transition-colors"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-mono font-medium transition-colors flex items-center gap-1.5 disabled:opacity-50"
              >
                {isDeleting ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
