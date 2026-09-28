import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  Calendar,
  Users,
  Eye,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Clock,
  ShieldCheck,
} from 'lucide-react';
import { useAdminAuth } from '../AdminAuthContext.tsx';
import { AnalyticsData } from '../types.ts';

export const AnalyticsView: React.FC = () => {
  const { authFetch } = useAdminAuth();
  const [period, setPeriod] = useState<'7d' | '30d' | '60d' | '90d'>('30d');
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hoveredPoint, setHoveredPoint] = useState<{
    date: string;
    count: number;
    uniqueCount: number;
  } | null>(null);

  const fetchAnalytics = async () => {
    setIsLoading(true);
    try {
      const res = await authFetch(`/api/admin/visits?period=${period}`);
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (err) {
      console.error('Failed to load analytics:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [period]);

  const maxCount =
    data?.dailySeries && data.dailySeries.length > 0
      ? Math.max(...data.dailySeries.map((d) => d.count), 5)
      : 10;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* 1. Header & Period Selector */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-white/[0.06]">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
            <span className="text-[11px] font-mono tracking-wider uppercase text-zinc-400">
              Traffic Telemetry
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-display font-bold text-white tracking-tight">
            Website Traffic & Visitors
          </h1>
          <p className="text-xs text-zinc-400 font-light mt-0.5">
            Real visitor interactions logged directly from the live public site.
          </p>
        </div>

        {/* Period Selector Tabs */}
        <div className="flex items-center gap-1 p-1 rounded-lg bg-zinc-900/80 border border-white/[0.08] self-start md:self-auto">
          {(['7d', '30d', '60d', '90d'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 rounded text-xs font-mono transition-all ${
                period === p
                  ? 'bg-violet-600 text-white font-medium shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              {p.toUpperCase()}
            </button>
          ))}
          <button
            onClick={fetchAnalytics}
            title="Refresh metrics"
            className="p-1.5 rounded text-zinc-400 hover:text-white transition-colors ml-1"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-violet-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* 2. REFINED METRIC STRIP (LIGHTWEIGHT, EDITORIAL) */}
      <div className="p-4 sm:p-6 rounded-xl bg-[#080A0F] border border-white/[0.06]">
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-6 divide-y sm:divide-y-0 sm:divide-x divide-white/[0.05]">
          <div className="pt-3 sm:pt-0 sm:px-4 first:pl-0">
            <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 block mb-1">
              Total Visits
            </span>
            <div className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight">
              {data ? data.totalVisits.toLocaleString() : '0'}
            </div>
            <span className="text-[11px] font-mono text-zinc-500 mt-1 block">All-time</span>
          </div>

          <div className="pt-3 sm:pt-0 sm:px-4">
            <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 block mb-1">
              Last 7 Days
            </span>
            <div className="text-2xl sm:text-3xl font-display font-bold text-zinc-200 tracking-tight">
              {data ? data.visits7d.toLocaleString() : '0'}
            </div>
            <span className="text-[11px] font-mono text-zinc-500 mt-1 block">Trailing 7d</span>
          </div>

          <div className="pt-3 sm:pt-0 sm:px-4">
            <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 block mb-1">
              Last 30 Days
            </span>
            <div className="text-2xl sm:text-3xl font-display font-bold text-zinc-200 tracking-tight">
              {data ? data.visits30d.toLocaleString() : '0'}
            </div>
            <span className="text-[11px] font-mono text-zinc-500 mt-1 block">Trailing 30d</span>
          </div>

          <div className="pt-3 sm:pt-0 sm:px-4">
            <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 block mb-1">
              Last 60 Days
            </span>
            <div className="text-2xl sm:text-3xl font-display font-bold text-zinc-200 tracking-tight">
              {data ? data.visits60d.toLocaleString() : '0'}
            </div>
            <span className="text-[11px] font-mono text-zinc-500 mt-1 block">Trailing 60d</span>
          </div>

          <div className="pt-3 sm:pt-0 sm:px-4">
            <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 block mb-1">
              Last 90 Days
            </span>
            <div className="text-2xl sm:text-3xl font-display font-bold text-zinc-200 tracking-tight">
              {data ? data.visits90d.toLocaleString() : '0'}
            </div>
            <span className="text-[11px] font-mono text-zinc-500 mt-1 block">Trailing 90d</span>
          </div>
        </div>
      </div>

      {/* 3. VISITOR TIMELINE CHART */}
      <div className="p-5 sm:p-6 rounded-xl bg-[#080A0F] border border-white/[0.06] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-sm font-semibold text-white tracking-wide">
              Visitor Traffic Timeline
            </h2>
            <p className="text-xs text-zinc-500 font-mono mt-0.5">
              Daily visit counts recorded across public pages
            </p>
          </div>

          {hoveredPoint && (
            <div className="px-3 py-1 rounded bg-zinc-900 border border-violet-500/30 text-xs font-mono flex items-center gap-2 self-start sm:self-auto">
              <span className="text-zinc-400">{hoveredPoint.date}:</span>
              <span className="text-white font-bold">{hoveredPoint.count} visits</span>
              <span className="text-violet-300">({hoveredPoint.uniqueCount} unique)</span>
            </div>
          )}
        </div>

        {/* Empty State vs SVG Timeline */}
        {!data || !data.hasData || data.totalVisits === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center text-center text-zinc-500 font-mono text-xs">
            <Eye className="w-8 h-8 text-zinc-700 mb-2" />
            <p className="text-zinc-300 font-medium">No traffic data recorded yet.</p>
            <p className="text-xs text-zinc-600 mt-0.5">
              Visits to the public website will be logged here automatically.
            </p>
          </div>
        ) : (
          <div className="space-y-4 pt-2">
            <div className="relative h-60 w-full overflow-hidden">
              <svg
                className="w-full h-full overflow-visible"
                viewBox={`0 0 ${data.dailySeries.length * 20} 100`}
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient id="analyticsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#7C00FF" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#7C00FF" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Grid lines */}
                {[0, 25, 50, 75, 100].map((y) => (
                  <line
                    key={y}
                    x1="0"
                    y1={y}
                    x2={data.dailySeries.length * 20}
                    y2={y}
                    stroke="rgba(255,255,255,0.04)"
                    strokeDasharray="2 2"
                  />
                ))}

                {/* Fill */}
                {data.dailySeries.length > 1 && (
                  <polygon
                    fill="url(#analyticsGradient)"
                    points={`
                      0,100 
                      ${data.dailySeries
                        .map((d, i) => `${i * 20},${100 - (d.count / maxCount) * 90}`)
                        .join(' ')} 
                      ${(data.dailySeries.length - 1) * 20},100
                    `}
                  />
                )}

                {/* Line */}
                {data.dailySeries.length > 1 && (
                  <polyline
                    fill="none"
                    stroke="#8B2CFF"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={data.dailySeries
                      .map((d, i) => `${i * 20},${100 - (d.count / maxCount) * 90}`)
                      .join(' ')}
                  />
                )}

                {/* Interactive Points */}
                {data.dailySeries.map((d, i) => {
                  const cx = i * 20;
                  const cy = 100 - (d.count / maxCount) * 90;
                  const isHovered = hoveredPoint?.date === d.date;

                  return (
                    <g key={d.date}>
                      <circle
                        cx={cx}
                        cy={cy}
                        r={isHovered ? 4.5 : 2.5}
                        fill={isHovered ? '#FFFFFF' : '#8B2CFF'}
                        stroke="#080A0F"
                        strokeWidth="1.5"
                        className="cursor-pointer transition-all"
                        onMouseEnter={() => setHoveredPoint(d)}
                        onMouseLeave={() => setHoveredPoint(null)}
                      />
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* X-axis labels */}
            <div className="flex justify-between pt-2 text-[10px] text-zinc-500 font-mono border-t border-white/[0.04]">
              {data.dailySeries.length > 0 && (
                <>
                  <span>{data.dailySeries[0].date}</span>
                  {data.dailySeries.length > 6 && (
                    <span>{data.dailySeries[Math.floor(data.dailySeries.length / 2)].date}</span>
                  )}
                  <span>{data.dailySeries[data.dailySeries.length - 1].date}</span>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
