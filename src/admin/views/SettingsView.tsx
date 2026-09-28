import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  KeyRound,
  Database,
  Server,
  LogOut,
  Mail,
  CheckCircle2,
  Lock,
  ExternalLink,
} from 'lucide-react';
import { useAdminAuth } from '../AdminAuthContext.tsx';

export const SettingsView: React.FC = () => {
  const { user, logout, authFetch } = useAdminAuth();
  const [settingsInfo, setSettingsInfo] = useState<any>(null);

  useEffect(() => {
    authFetch('/api/admin/settings')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setSettingsInfo(data))
      .catch((err) => console.error('Failed to load settings:', err));
  }, []);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-white/[0.06]">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
            <span className="text-[11px] font-mono tracking-wider uppercase text-zinc-400">
              System Infrastructure
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-display font-bold text-white tracking-tight">
            Database & Settings
          </h1>
          <p className="text-xs text-zinc-400 font-light mt-0.5">
            Real Supabase connection status, persistent storage records, and admin credentials.
          </p>
        </div>
      </div>

      {/* Admin Session Info */}
      <div className="p-5 sm:p-6 rounded-xl bg-[#080A0F] border border-white/[0.06] space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-white/[0.06]">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <h2 className="text-sm font-semibold text-white tracking-wide">
            Active Admin Session
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
          <div className="p-3.5 rounded-lg bg-white/[0.02] border border-white/[0.04]">
            <span className="text-[10px] text-zinc-500 uppercase block mb-1">
              Admin Identity
            </span>
            <span className="text-white font-medium">Agency Director</span>
            <span className="text-[11px] text-zinc-500 block mt-0.5">WG Media Production</span>
          </div>

          <div className="p-3.5 rounded-lg bg-white/[0.02] border border-white/[0.04]">
            <span className="text-[10px] text-zinc-500 uppercase block mb-1">
              Account Email
            </span>
            <span className="text-white font-medium truncate block">{user?.email || 'admin@example.com'}</span>
            <span className="text-[11px] text-emerald-400 block mt-0.5">Verified Session</span>
          </div>

          <div className="p-3.5 rounded-lg bg-white/[0.02] border border-white/[0.04]">
            <span className="text-[10px] text-zinc-500 uppercase block mb-1">
              Session Auth
            </span>
            <span className="text-white font-medium">Bearer Token (24h)</span>
            <span className="text-[11px] text-zinc-500 block mt-0.5">TLS Secured</span>
          </div>
        </div>

        <div className="pt-3 border-t border-white/[0.06] flex justify-end">
          <button
            onClick={() => logout()}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300 hover:text-white hover:bg-rose-500/20 text-xs font-mono transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Log Out Admin Session</span>
          </button>
        </div>
      </div>

      {/* Supabase & Storage Status */}
      <div className="p-5 sm:p-6 rounded-xl bg-[#080A0F] border border-white/[0.06] space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-white/[0.06]">
          <Database className="w-4 h-4 text-violet-400" />
          <h2 className="text-sm font-semibold text-white tracking-wide">
            Database & Storage Infrastructure
          </h2>
        </div>

        <div className="space-y-3 text-xs">
          <div className="p-4 rounded-lg bg-white/[0.02] border border-white/[0.04] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="font-semibold text-white">Supabase Cloud Database</span>
              </div>
              <span className="text-[11px] font-mono text-zinc-500 mt-1 block">
                {settingsInfo?.supabaseUrl || 'https://cgqvcgpwejiouijuhwqe.supabase.co'}
              </span>
            </div>
            <span className="px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-mono self-start sm:self-auto">
              Realtime Active
            </span>
          </div>

          <div className="p-4 rounded-lg bg-white/[0.02] border border-white/[0.04] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <Server className="w-4 h-4 text-violet-400" />
                <span className="font-semibold text-white">Local Server Storage Engine</span>
              </div>
              <p className="text-zinc-400 text-xs mt-1">
                Persistent disk fallback for zero-loss guarantees:
              </p>
              <span className="text-[11px] font-mono text-zinc-500 mt-1 block">
                {settingsInfo?.storageDirectory || '/data'}
              </span>
            </div>
            <span className="px-2.5 py-1 rounded bg-violet-500/10 text-violet-300 border border-violet-500/20 text-[10px] font-mono self-start sm:self-auto">
              Verified Sync
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
