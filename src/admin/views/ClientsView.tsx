import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Mail,
  Phone,
  Calendar,
  Clock,
  Briefcase,
  FileVideo,
  MessageSquare,
  ArrowRight,
  ExternalLink,
  Shield,
  Layers,
  X,
} from 'lucide-react';
import { useAdminAuth } from '../AdminAuthContext.tsx';
import { ClientProfile } from '../types.ts';

export const ClientsView: React.FC = () => {
  const { authFetch } = useAdminAuth();
  const [clients, setClients] = useState<ClientProfile[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedClient, setSelectedClient] = useState<ClientProfile | null>(null);

  const fetchClients = async () => {
    setIsLoading(true);
    try {
      const res = await authFetch('/api/admin/clients');
      if (res.ok) {
        const data = await res.json();
        setClients(data);
      }
    } catch (err) {
      console.error('Failed to fetch clients:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const filteredClients = clients.filter((c) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.phone.toLowerCase().includes(q) ||
      c.services.some((s) => s.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-white/[0.06]">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
            <span className="text-[11px] font-mono tracking-wider uppercase text-zinc-400">
              Customer CRM
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-display font-bold text-white tracking-tight flex items-center gap-3">
            <span>Leads & Clients</span>
            <span className="text-xs font-mono px-2 py-0.5 rounded-md bg-white/[0.05] border border-white/[0.08] text-zinc-300">
              {clients.length} {clients.length === 1 ? 'contact' : 'contacts'}
            </span>
          </h1>
          <p className="text-xs text-zinc-400 font-light mt-0.5">
            Aggregated profiles from verified project bookings and contact inquiries.
          </p>
        </div>

        {/* Search */}
        <div className="relative min-w-[220px]">
          <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search name, email, phone..."
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-zinc-900/80 border border-white/[0.08] text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500/50"
          />
        </div>
      </div>

      {/* Main Content */}
      {isLoading ? (
        <div className="py-24 text-center text-zinc-500 font-mono text-xs flex flex-col items-center justify-center">
          <div className="w-5 h-5 border-2 border-violet-500/20 border-t-violet-400 rounded-full animate-spin mb-3" />
          <span>Compiling client profiles...</span>
        </div>
      ) : filteredClients.length === 0 ? (
        <div className="py-20 flex flex-col items-center justify-center text-center text-zinc-500 font-mono text-xs">
          <Users className="w-8 h-8 text-zinc-700 mb-2" />
          <p className="text-sm text-zinc-300 font-semibold mb-1">No leads found.</p>
          <p className="text-xs text-zinc-500 max-w-sm">
            {searchQuery
              ? 'No client matched your search criteria.'
              : 'As visitors submit bookings or contact forms, profiles will appear here.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {/* Mobile Stacked View */}
          <div className="md:hidden space-y-2.5">
            {filteredClients.map((client) => (
              <div
                key={client.id}
                onClick={() => setSelectedClient(client)}
                className="p-4 rounded-xl bg-[#080A0F] border border-white/[0.06] hover:border-violet-500/30 cursor-pointer transition-all space-y-2.5 group"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-sm text-white group-hover:text-violet-300 transition-colors">
                      {client.name}
                    </h3>
                    <div className="text-xs font-mono text-zinc-400 mt-0.5">
                      {client.phone !== 'Not provided' ? client.phone : client.email}
                    </div>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.04] text-zinc-300 border border-white/[0.06]">
                    {client.totalInquiries} inq • {client.totalContacts} msg
                  </span>
                </div>

                <div className="flex flex-wrap gap-1 pt-1">
                  {client.services.map((s) => (
                    <span
                      key={s}
                      className="px-2 py-0.5 rounded bg-zinc-800 text-[10px] font-mono text-zinc-300"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block rounded-xl border border-white/[0.06] bg-[#080A0F] overflow-hidden">
            <table className="w-full text-left text-xs font-sans">
              <thead className="bg-white/[0.02] text-[10px] uppercase font-mono text-zinc-400 border-b border-white/[0.06] tracking-wider">
                <tr>
                  <th className="py-3 px-4">Client Name</th>
                  <th className="py-3 px-4">Contact</th>
                  <th className="py-3 px-4">Services of Interest</th>
                  <th className="py-3 px-4">Activity Counts</th>
                  <th className="py-3 px-4">Latest Interaction</th>
                  <th className="py-3 px-4 text-right">Profile</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {filteredClients.map((client) => (
                  <tr
                    key={client.id}
                    onClick={() => setSelectedClient(client)}
                    className="hover:bg-white/[0.02] cursor-pointer transition-colors group"
                  >
                    <td className="py-3 px-4 font-medium text-white group-hover:text-violet-300 transition-colors">
                      {client.name}
                    </td>
                    <td className="py-3 px-4 font-mono text-zinc-300">
                      <div>{client.phone}</div>
                      {client.email && client.email !== 'Not provided' && (
                        <div className="text-[10px] text-zinc-500">{client.email}</div>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1">
                        {client.services.map((s) => (
                          <span
                            key={s}
                            className="px-1.5 py-0.5 rounded bg-white/[0.04] text-[10px] font-mono text-zinc-300"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono text-zinc-300">
                      <span>{client.totalInquiries} bookings</span>
                      {client.totalContacts > 0 && (
                        <span className="text-zinc-500"> • {client.totalContacts} msgs</span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-mono text-zinc-500 text-[11px]">
                      {new Date(client.latestActivity).toLocaleDateString([], {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedClient(client);
                        }}
                        className="px-2.5 py-1 rounded bg-white/[0.04] hover:bg-violet-600 hover:text-white text-zinc-300 font-mono text-[11px] transition-colors"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Client Detail Inspection Modal */}
      {selectedClient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm">
          <div
            className="w-full max-w-xl bg-[#080A0F] border border-white/[0.1] rounded-2xl shadow-2xl flex flex-col overflow-hidden text-zinc-200"
            role="dialog"
            aria-modal="true"
          >
            <div className="px-5 sm:px-6 py-4 bg-[#0B0D14] border-b border-white/[0.06] flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold font-display text-white">
                  {selectedClient.name}
                </h3>
                <p className="text-xs text-zinc-500 font-mono">
                  First Contact: {new Date(selectedClient.firstContactDate).toLocaleDateString()}
                </p>
              </div>
              <button
                onClick={() => setSelectedClient(null)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/[0.06] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 sm:p-6 space-y-4 text-xs overflow-y-auto max-h-[75vh]">
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] grid grid-cols-2 gap-3">
                <div>
                  <span className="text-[10px] font-mono text-zinc-500 block">Phone</span>
                  <span className="font-mono text-zinc-200">{selectedClient.phone}</span>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-zinc-500 block">Email</span>
                  <span className="font-mono text-zinc-200 truncate block">{selectedClient.email}</span>
                </div>
              </div>

              <div>
                <span className="text-[10px] font-mono text-zinc-500 uppercase block mb-1.5">
                  Interactions ({selectedClient.inquiries.length} Inquiries, {selectedClient.contacts.length} Contacts)
                </span>
                <div className="space-y-2">
                  {selectedClient.inquiries.map((inq) => (
                    <div
                      key={inq.id}
                      className="p-3 rounded-lg bg-[#050609] border border-white/[0.06] flex items-center justify-between"
                    >
                      <div>
                        <div className="font-medium text-white">{inq.service}</div>
                        <div className="text-[10px] font-mono text-zinc-500">
                          {inq.reference_id} • {new Date(inq.created_at).toLocaleDateString()}
                        </div>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-violet-500/10 text-violet-300 border border-violet-500/20">
                        {inq.status}
                      </span>
                    </div>
                  ))}
                  {selectedClient.contacts.map((c) => (
                    <div
                      key={c.id}
                      className="p-3 rounded-lg bg-[#050609] border border-white/[0.06] flex items-center justify-between"
                    >
                      <div className="min-w-0 pr-2">
                        <div className="font-medium text-white">{c.service}</div>
                        <p className="text-[10px] text-zinc-400 truncate">"{c.message}"</p>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-fuchsia-500/10 text-fuchsia-300 border border-fuchsia-500/20 shrink-0">
                        {c.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="px-5 sm:px-6 py-3 bg-[#0B0D14] border-t border-white/[0.06] flex justify-end">
              <button
                onClick={() => setSelectedClient(null)}
                className="px-4 py-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] text-zinc-300 text-xs font-mono transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
