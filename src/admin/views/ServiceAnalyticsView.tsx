import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Layers,
  Film,
  Sliders,
  Camera,
  PlaySquare,
  TrendingUp,
  BarChart2,
  RefreshCw,
} from 'lucide-react';
import { useAdminAuth } from '../AdminAuthContext.tsx';

interface ServiceAnalyticsData {
  totalSubmissions: number;
  services: { name: string; count: number; percentage: number }[];
  mostRequested: string | null;
  hasData: boolean;
}

export const ServiceAnalyticsView: React.FC = () => {
  const { authFetch } = useAdminAuth();
  const [data, setData] = useState<ServiceAnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchServiceAnalytics = async () => {
    setIsLoading(true);
    try {
      const res = await authFetch('/api/admin/services-analytics');
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (err) {
      console.error('Error fetching service analytics:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchServiceAnalytics();
  }, []);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-white/[0.06]">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
            <span className="text-[11px] font-mono tracking-wider uppercase text-zinc-400">
              Discipline Breakdown
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-display font-bold text-white tracking-tight">
            Service Demand Analytics
          </h1>
          <p className="text-xs text-zinc-400 font-light mt-0.5">
            Measured strictly from real visitor bookings and contact submissions.
          </p>
        </div>

        <button
          onClick={fetchServiceAnalytics}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900/80 border border-white/[0.08] text-xs font-mono text-zinc-400 hover:text-white transition-colors self-start md:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-violet-400' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {isLoading ? (
        <div className="py-24 text-center text-zinc-500 font-mono text-xs flex flex-col items-center justify-center">
          <div className="w-5 h-5 border-2 border-violet-500/20 border-t-violet-400 rounded-full animate-spin mb-3" />
          <span>Calculating service demand metrics...</span>
        </div>
      ) : !data || !data.hasData || data.totalSubmissions === 0 ? (
        <div className="py-20 flex flex-col items-center justify-center text-center text-zinc-500 font-mono text-xs">
          <Sparkles className="w-8 h-8 text-zinc-700 mb-2" />
          <p className="text-sm text-zinc-300 font-semibold mb-1">
            No service inquiry data available yet.
          </p>
          <p className="text-xs text-zinc-500 max-w-sm">
            When visitors submit requests for Video Editing, Sound Design, Motion Graphics, or Video Production, insights will calculate here automatically.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Key Metric Row */}
          <div className="p-4 sm:p-5 rounded-xl bg-[#080A0F] border border-white/[0.06] grid grid-cols-1 sm:grid-cols-2 gap-4 divide-y sm:divide-y-0 sm:divide-x divide-white/[0.05]">
            <div className="pt-2 sm:pt-0 sm:px-3 first:pl-0">
              <span className="text-[10px] font-mono text-zinc-500 uppercase block mb-1">
                Total Submissions Analyzed
              </span>
              <div className="text-2xl font-bold font-display text-white">
                {data.totalSubmissions}
              </div>
              <span className="text-[11px] text-zinc-500 font-mono">
                Booking forms + contact messages
              </span>
            </div>

            <div className="pt-2 sm:pt-0 sm:px-3">
              <span className="text-[10px] font-mono text-violet-400 uppercase block mb-1">
                Highest Demand Service
              </span>
              <div className="text-2xl font-bold font-display text-white">
                {data.mostRequested || 'N/A'}
              </div>
              <span className="text-[11px] text-zinc-500 font-mono">
                Leading production category
              </span>
            </div>
          </div>

          {/* Breakdown Bars */}
          <div className="p-5 sm:p-6 rounded-xl bg-[#080A0F] border border-white/[0.06] space-y-4">
            <h3 className="text-sm font-semibold text-white">
              Service Distribution Breakdown
            </h3>
            <div className="space-y-4 pt-2">
              {data.services.map((item) => (
                <div key={item.name} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-zinc-200">{item.name}</span>
                    <span className="text-violet-300 font-semibold">
                      {item.count} ({item.percentage}%)
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-violet-500 to-purple-400 rounded-full"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
