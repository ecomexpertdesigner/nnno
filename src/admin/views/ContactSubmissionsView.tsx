import React, { useState, useEffect } from 'react';
import {
  Mail,
  Search,
  Filter,
  Eye,
  Phone,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  Save,
  X,
  ArrowRight,
  Clock,
  Calendar,
  Archive,
  Trash2,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';
import { useAdminAuth } from '../AdminAuthContext.tsx';
import { ContactRecord, ContactStatus } from '../types.ts';
import { supabase } from '../../lib/supabase.ts';

const CONTACT_STATUS_OPTIONS: ContactStatus[] = [
  'New',
  'Read',
  'Contacted',
  'Archived',
];

interface ContactSubmissionsViewProps {
  initialSelectedContact?: ContactRecord | null;
  onClearInitialSelected?: () => void;
}

export const ContactSubmissionsView: React.FC<ContactSubmissionsViewProps> = ({
  initialSelectedContact,
  onClearInitialSelected,
}) => {
  const { authFetch } = useAdminAuth();
  const [contacts, setContacts] = useState<ContactRecord[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [selectedContact, setSelectedContact] = useState<ContactRecord | null>(
    initialSelectedContact || null
  );

  const [currentStatus, setCurrentStatus] = useState<ContactStatus>('New');
  const [currentNotes, setCurrentNotes] = useState<string>('');
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [updateSuccess, setUpdateSuccess] = useState<boolean>(false);

  // Delete Confirmation State
  const [contactToDelete, setContactToDelete] = useState<ContactRecord | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const fetchContacts = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery.trim()) params.set('search', searchQuery.trim());
      if (statusFilter !== 'All') params.set('status', statusFilter);

      const res = await authFetch(`/api/admin/contacts?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setContacts(data);
      }
    } catch (err) {
      console.error('Failed to fetch contacts:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, [searchQuery, statusFilter]);

  // Realtime updates
  useEffect(() => {
    try {
      const channel = supabase
        .channel('admin-contacts-realtime')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'appointments' },
          () => {
            fetchContacts();
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
    if (initialSelectedContact) {
      setSelectedContact(initialSelectedContact);
      setCurrentStatus(initialSelectedContact.status || 'New');
      setCurrentNotes(initialSelectedContact.notes || '');
    }
  }, [initialSelectedContact]);

  const handleOpenDetail = (contact: ContactRecord) => {
    setSelectedContact(contact);
    setCurrentStatus(contact.status || 'New');
    setCurrentNotes(contact.notes || '');
    setUpdateSuccess(false);

    // Auto mark as Read if New
    if (contact.status === 'New') {
      authFetch(`/api/admin/contacts/${contact.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status: 'Read' }),
      }).then(() => {
        setContacts((prev) =>
          prev.map((c) => (c.id === contact.id ? { ...c, status: 'Read' } : c))
        );
      });
    }
  };

  const handleCloseDetail = () => {
    setSelectedContact(null);
    if (onClearInitialSelected) onClearInitialSelected();
  };

  const handleSaveContactUpdates = async () => {
    if (!selectedContact) return;
    setIsUpdating(true);
    setUpdateSuccess(false);

    try {
      const res = await authFetch(`/api/admin/contacts/${selectedContact.id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          status: currentStatus,
          notes: currentNotes,
        }),
      });

      if (res.ok) {
        const { contact } = await res.json();
        setSelectedContact(contact);
        setContacts((prev) =>
          prev.map((item) => (item.id === contact.id ? contact : item))
        );
        setUpdateSuccess(true);
        setTimeout(() => setUpdateSuccess(false), 3000);
      }
    } catch (err) {
      console.error('Failed to update contact:', err);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!contactToDelete) return;
    setIsDeleting(true);

    try {
      const res = await authFetch(`/api/admin/contacts/${contactToDelete.id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setContacts((prev) => prev.filter((item) => item.id !== contactToDelete.id));
        if (selectedContact?.id === contactToDelete.id) {
          setSelectedContact(null);
        }
        setContactToDelete(null);
      }
    } catch (err) {
      console.error('Failed to delete contact submission:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const s = (status || '').toLowerCase();
    if (s === 'new') {
      return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
    }
    if (s === 'read') {
      return 'text-sky-400 bg-sky-500/10 border-sky-500/20';
    }
    if (s === 'contacted') {
      return 'text-violet-300 bg-violet-500/10 border-violet-500/20';
    }
    return 'text-zinc-500 bg-zinc-800/40 border-zinc-700/30';
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* 1. Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-white/[0.06]">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-fuchsia-400" />
            <span className="text-[11px] font-mono tracking-wider uppercase text-zinc-400">
              Direct Inquiries
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-display font-bold text-white tracking-tight flex items-center gap-3">
            <span>Contact Submissions</span>
            <span className="text-xs font-mono px-2 py-0.5 rounded-md bg-white/[0.05] border border-white/[0.08] text-zinc-300">
              {contacts.length} {contacts.length === 1 ? 'message' : 'messages'}
            </span>
          </h1>
          <p className="text-xs text-zinc-400 font-light mt-0.5">
            General messages, questions, and briefs sent through the public Contact page.
          </p>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative min-w-[200px] flex-1 sm:flex-none">
            <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search sender, email, text..."
              className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-zinc-900/80 border border-white/[0.08] text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-fuchsia-500/50"
            />
          </div>

          <div className="flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-zinc-500" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-zinc-900/80 border border-white/[0.08] rounded-lg px-2.5 py-1.5 text-xs text-zinc-300 focus:outline-none focus:border-fuchsia-500/50"
            >
              <option value="All">All Statuses</option>
              {CONTACT_STATUS_OPTIONS.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>

            <button
              onClick={fetchContacts}
              title="Refresh messages"
              className="p-1.5 rounded-lg bg-zinc-900/80 border border-white/[0.08] text-zinc-400 hover:text-white transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-fuchsia-400' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* 2. Main List View */}
      {isLoading ? (
        <div className="py-24 text-center text-zinc-500 font-mono text-xs flex flex-col items-center justify-center">
          <div className="w-5 h-5 border-2 border-fuchsia-500/20 border-t-fuchsia-400 rounded-full animate-spin mb-3" />
          <span>Loading contact submissions...</span>
        </div>
      ) : contacts.length === 0 ? (
        <div className="py-20 flex flex-col items-center justify-center text-center text-zinc-500 font-mono text-xs">
          <Mail className="w-8 h-8 text-zinc-700 mb-3" />
          <p className="text-sm text-zinc-300 font-semibold mb-1">
            No contact submissions yet.
          </p>
          <p className="text-xs text-zinc-500 max-w-sm">
            Messages sent via the Contact Us form will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Mobile Stacked View (< 768px) */}
          <div className="md:hidden space-y-2.5">
            {contacts.map((c) => (
              <div
                key={c.id}
                onClick={() => handleOpenDetail(c)}
                className="p-4 rounded-xl bg-[#080A0F] border border-white/[0.06] hover:border-fuchsia-500/30 cursor-pointer transition-all space-y-3 group"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <span className="font-mono text-[11px] text-zinc-500 block">
                      {c.reference_id}
                    </span>
                    <h3 className="font-semibold text-sm text-white group-hover:text-fuchsia-300 transition-colors truncate mt-0.5">
                      {c.name}
                    </h3>
                  </div>
                  <span
                    className={`inline-flex px-2 py-0.5 rounded text-[10px] font-mono border shrink-0 ${getStatusBadge(
                      c.status
                    )}`}
                  >
                    {c.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-2 border-t border-white/[0.04]">
                  <div>
                    <span className="text-[10px] text-zinc-500 block uppercase">Service</span>
                    <span className="text-zinc-200 truncate block">{c.service || 'General Inquiry'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-500 block uppercase">Email</span>
                    <span className="text-zinc-300 truncate block">{c.email || 'Not provided'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-500 block uppercase">Phone</span>
                    <span className="text-zinc-300 truncate block">{c.phone || 'Not provided'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-500 block uppercase">Date</span>
                    <span className="text-zinc-400 block">
                      {new Date(c.created_at).toLocaleDateString([], {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                </div>

                {c.message && (
                  <p className="text-xs text-zinc-400 line-clamp-2 pt-1 font-light italic border-t border-white/[0.04]">
                    "{c.message}"
                  </p>
                )}

                <div className="pt-2 flex items-center justify-between border-t border-white/[0.04]">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setContactToDelete(c);
                    }}
                    className="text-zinc-500 hover:text-rose-400 transition-colors p-1"
                    title="Delete message"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  <span className="inline-flex items-center gap-1 text-xs text-fuchsia-400 font-mono">
                    <span>Read Message</span>
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
                  <th className="py-3 px-4">Sender</th>
                  <th className="py-3 px-4">Contact</th>
                  <th className="py-3 px-4">Service</th>
                  <th className="py-3 px-4">Message Snippet</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {contacts.map((c) => (
                  <tr
                    key={c.id}
                    onClick={() => handleOpenDetail(c)}
                    className="hover:bg-white/[0.02] cursor-pointer transition-colors group"
                  >
                    <td className="py-3 px-4 font-medium text-white group-hover:text-fuchsia-300 transition-colors">
                      {c.name}
                    </td>
                    <td className="py-3 px-4 font-mono text-zinc-300">
                      <div>{c.email || 'Not provided'}</div>
                      {c.phone && (
                        <div className="text-[10px] text-zinc-500">{c.phone}</div>
                      )}
                    </td>
                    <td className="py-3 px-4 text-zinc-200">
                      <span>{c.service}</span>
                    </td>
                    <td className="py-3 px-4 max-w-xs truncate text-zinc-400">
                      "{c.message}"
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded text-[10px] font-mono border ${getStatusBadge(
                          c.status
                        )}`}
                      >
                        {c.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-zinc-500 text-[11px]">
                      {new Date(c.created_at).toLocaleDateString([], {
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
                            handleOpenDetail(c);
                          }}
                          className="px-2.5 py-1 rounded bg-white/[0.04] hover:bg-fuchsia-600 hover:text-white text-zinc-300 font-mono text-[11px] transition-colors"
                        >
                          Open
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setContactToDelete(c);
                          }}
                          className="p-1 rounded text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                          title="Delete message"
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

      {/* 3. DETAIL MODAL */}
      {selectedContact && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm">
          <div
            className="w-full max-w-2xl bg-[#080A0F] border border-white/[0.1] rounded-2xl shadow-2xl flex flex-col overflow-hidden text-zinc-200"
            role="dialog"
            aria-modal="true"
          >
            {/* Header */}
            <div className="px-5 sm:px-6 py-4 bg-[#0B0D14] border-b border-white/[0.06] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-fuchsia-500/10 border border-fuchsia-500/20 text-fuchsia-300">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold font-display text-white">
                    Message from {selectedContact.name}
                  </h3>
                  <p className="text-xs text-zinc-500 font-mono">
                    Ref: {selectedContact.reference_id} •{' '}
                    {new Date(selectedContact.created_at).toLocaleString()}
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

            {/* Body */}
            <div className="p-5 sm:p-6 space-y-5 text-xs overflow-y-auto max-h-[75vh]">
              {/* Sender Info Row */}
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <span className="text-[10px] font-mono text-zinc-500 block">Sender Name</span>
                  <span className="font-semibold text-white">{selectedContact.name || 'Not provided'}</span>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-zinc-500 block">Email</span>
                  {selectedContact.email ? (
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="font-mono text-zinc-200">{selectedContact.email}</span>
                      <a
                        href={`mailto:${selectedContact.email}`}
                        className="text-fuchsia-400 hover:text-white"
                        title="Email client"
                      >
                        <Mail className="w-3 h-3" />
                      </a>
                    </div>
                  ) : (
                    <span className="text-zinc-500 italic">Not provided</span>
                  )}
                </div>
                <div>
                  <span className="text-[10px] font-mono text-zinc-500 block">Phone</span>
                  {selectedContact.phone ? (
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="font-mono text-zinc-200">{selectedContact.phone}</span>
                      <a
                        href={`tel:${selectedContact.phone}`}
                        className="text-violet-400 hover:text-white"
                        title="Call"
                      >
                        <Phone className="w-3 h-3" />
                      </a>
                    </div>
                  ) : (
                    <span className="text-zinc-500 italic">Not provided</span>
                  )}
                </div>
              </div>

              {/* Service Subject */}
              <div>
                <span className="text-[10px] font-mono text-zinc-500 uppercase block mb-1">
                  Requested Subject / Service
                </span>
                <div className="text-sm font-medium text-white">
                  {selectedContact.service || 'General Inquiry'}
                </div>
              </div>

              {/* Message Content */}
              <div>
                <span className="text-[10px] font-mono text-zinc-500 uppercase block mb-1">
                  Message Content
                </span>
                <div className="p-4 rounded-xl bg-[#050609] border border-white/[0.06] text-sm text-zinc-100 leading-relaxed whitespace-pre-wrap">
                  {selectedContact.message || 'Not provided'}
                </div>
              </div>

              {/* Admin Status Management */}
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] space-y-3">
                <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-semibold block">
                  Status & Notes
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-mono text-zinc-500 uppercase mb-1">
                      Status
                    </label>
                    <select
                      value={currentStatus}
                      onChange={(e) => setCurrentStatus(e.target.value as ContactStatus)}
                      className="w-full bg-zinc-900 border border-white/[0.1] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-fuchsia-500"
                    >
                      {CONTACT_STATUS_OPTIONS.map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-zinc-500 uppercase mb-1">
                    Internal Notes
                  </label>
                  <textarea
                    rows={2}
                    value={currentNotes}
                    onChange={(e) => setCurrentNotes(e.target.value)}
                    placeholder="Add follow-up notes..."
                    className="w-full bg-zinc-900 border border-white/[0.1] rounded-lg p-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-fuchsia-500"
                  />
                </div>

                <div className="flex items-center justify-between pt-1">
                  <button
                    type="button"
                    onClick={handleSaveContactUpdates}
                    disabled={isUpdating}
                    className="px-4 py-2 rounded-lg bg-fuchsia-600 hover:bg-fuchsia-500 text-white font-medium text-xs transition-colors flex items-center gap-1.5 disabled:opacity-50"
                  >
                    {isUpdating ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-3.5 h-3.5" />
                        <span>Save Changes</span>
                      </>
                    )}
                  </button>

                  {updateSuccess && (
                    <span className="text-emerald-400 font-mono text-xs flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Updated</span>
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Footer with Delete Action */}
            <div className="px-5 sm:px-6 py-3 bg-[#0B0D14] border-t border-white/[0.06] flex items-center justify-between">
              <button
                type="button"
                onClick={() => setContactToDelete(selectedContact)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-rose-400 hover:text-white hover:bg-rose-500/20 text-xs font-mono transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Submission</span>
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

      {/* 4. DELETE CONFIRMATION DIALOG */}
      {contactToDelete && (
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
                  Delete this contact submission?
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Sender: <span className="font-mono text-zinc-200">{contactToDelete.name}</span>
                </p>
              </div>
            </div>

            <p className="text-xs text-zinc-400 leading-relaxed font-light">
              Once deleted, this record will be permanently removed.
            </p>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/[0.06]">
              <button
                type="button"
                onClick={() => setContactToDelete(null)}
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
