import React, { useState, useEffect } from 'react';
import {
  Clock,
  FileVideo,
  Mail,
  Edit3,
  CheckCircle2,
  RefreshCw,
  User,
  Trash2,
  ShieldCheck,
} from 'lucide-react';
import { useAdminAuth } from '../AdminAuthContext.tsx';
import { ActivityRecord } from '../types.ts';

export const RecentActivityView: React.FC = () => {
  const { authFetch } = useAdminAuth();
  const [activities, setActivities] = useState<ActivityRecord[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchActivities = async () => {
    setIsLoading(true);
    try {
      const res = await authFetch('/api/admin/activity');
      if (res.ok) {
        const json = await res.json();
        setActivities(json);
      }
    } catch (err) {
      console.error('Failed to fetch activity logs:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  const getActivityIcon = (type: ActivityRecord['type']) => {
    switch (type) {
      case 'inquiry_created':
        return <FileVideo className="w-3.5 h-3.5 text-violet-400" />;
      case 'contact_created':
        return <Mail className="w-3.5 h-3.5 text-fuchsia-400" />;
      case 'inquiry_status_updated':
      case 'contact_status_updated':
        return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />;
      case 'inquiry_note_added':
      case 'contact_note_added':
        return <Edit3 className="w-3.5 h-3.5 text-sky-400" />;
      case 'inquiry_deleted':
      case 'contact_deleted':
        return <Trash2 className="w-3.5 h-3.5 text-rose-400" />;
      default:
        return <Clock className="w-3.5 h-3.5 text-zinc-400" />;
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-white/[0.06]">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
            <span className="text-[11px] font-mono tracking-wider uppercase text-zinc-400">
              Audit Stream
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-display font-bold text-white tracking-tight">
            Recent System Activity
          </h1>
          <p className="text-xs text-zinc-400 font-light mt-0.5">
            Real timeline of customer inquiries, status transitions, and administrative actions.
          </p>
        </div>

        <button
          onClick={fetchActivities}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900/80 border border-white/[0.08] text-xs font-mono text-zinc-400 hover:text-white transition-colors self-start md:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-violet-400' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Main Content */}
      {isLoading ? (
        <div className="py-24 text-center text-zinc-500 font-mono text-xs flex flex-col items-center justify-center">
          <div className="w-5 h-5 border-2 border-violet-500/20 border-t-violet-400 rounded-full animate-spin mb-3" />
          <span>Reading genuine activity logs...</span>
        </div>
      ) : activities.length === 0 ? (
        <div className="py-20 flex flex-col items-center justify-center text-center text-zinc-500 font-mono text-xs">
          <Clock className="w-8 h-8 text-zinc-700 mb-2" />
          <p className="text-sm text-zinc-300 font-semibold mb-1">
            No recent activity yet.
          </p>
          <p className="text-xs text-zinc-500 max-w-sm">
            Activity is recorded exclusively when visitors submit forms or when an admin modifies records.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-white/[0.04]">
          {activities.map((act) => (
            <div
              key={act.id}
              className="py-3.5 px-3 rounded-lg hover:bg-white/[0.02] transition-colors flex items-start gap-3.5 text-xs"
            >
              <div className="p-1.5 rounded-md bg-white/[0.03] border border-white/[0.05] shrink-0 mt-0.5">
                {getActivityIcon(act.type)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-0.5">
                  <span className="font-semibold text-white truncate text-xs">
                    {act.title}
                  </span>
                  <span className="text-[10px] font-mono text-zinc-500 shrink-0">
                    {new Date(act.timestamp).toLocaleString()}
                  </span>
                </div>
                <p className="text-zinc-400 text-xs truncate font-light">
                  {act.description}
                </p>
                <div className="mt-1 flex items-center gap-3 text-[10px] font-mono text-zinc-500">
                  <span className="flex items-center gap-1">
                    <User className="w-3 h-3 text-zinc-400" />
                    <span>Actor: {act.actor}</span>
                  </span>
                  {act.referenceId && (
                    <span className="text-violet-400">Ref: {act.referenceId}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
