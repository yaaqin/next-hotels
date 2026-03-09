"use client";

import { motion } from "framer-motion";

// ── Types ──────────────────────────────────────────────────────────────────
interface DailyMetricsData {
  date: string;
  siteCode: string;
  bookingsToday: {
    total: number;
    yesterday: number;
    growth: number;
  };
  revenueToday: {
    total: number;
    currency: string;
    yesterday: number;
    growth: number;
  };
  occupancyRate: {
    percentage: number;
    occupiedRooms: number;
    totalRooms: number;
  };
}

interface DailyMetricsCardProps {
  data: DailyMetricsData;
  isLoading?: boolean;
}

// ── Helpers ────────────────────────────────────────────────────────────────
function formatPrice(amount: number) {
  if (amount >= 1_000_000) {
    return `Rp ${(amount / 1_000_000).toFixed(1)}jt`;
  }
  if (amount >= 1_000) {
    return `Rp ${(amount / 1_000).toFixed(0)}rb`;
  }
  return `Rp ${amount.toLocaleString("id-ID")}`;
}

function GrowthBadge({ value }: { value: number }) {
  const isUp = value >= 0;
  return (
    <span
      className={`inline-flex items-center gap-0.5 text-xs font-medium px-1.5 py-0.5 rounded-md
        ${isUp
          ? "bg-emerald-50 text-emerald-600"
          : "bg-rose-50 text-rose-500"
        }`}
    >
      <span>{isUp ? "↑" : "↓"}</span>
      {Math.abs(value)}%
    </span>
  );
}

// ── Occupancy Arc ──────────────────────────────────────────────────────────
function OccupancyArc({ percentage }: { percentage: number }) {
  const r = 28;
  const circ = 2 * Math.PI * r;
  const filled = (percentage / 100) * circ;

  return (
    <svg width="72" height="72" className="shrink-0 -rotate-90">
      <circle
        cx="36" cy="36" r={r}
        fill="none"
        stroke="#f1f5f9"
        strokeWidth="6"
      />
      <motion.circle
        cx="36" cy="36" r={r}
        fill="none"
        stroke="#3b82f6"
        strokeWidth="6"
        strokeLinecap="round"
        strokeDasharray={circ}
        initial={{ strokeDashoffset: circ }}
        animate={{ strokeDashoffset: circ - filled }}
        transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
      />
    </svg>
  );
}

// ── Skeleton ──────────────────────────────────────────────────────────────
function MetricSkeleton() {
  return (
    <div className="w-full bg-white rounded-2xl border border-gray-100 p-5 animate-pulse">
      <div className="grid grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="space-y-3">
            <div className="h-3 bg-gray-100 rounded w-2/3" />
            <div className="h-8 bg-gray-100 rounded w-1/2" />
            <div className="h-3 bg-gray-100 rounded w-3/4" />
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────
export function DailyMetricsCard({ data, isLoading }: DailyMetricsCardProps) {
  if (isLoading) return <MetricSkeleton />;

  const { bookingsToday, revenueToday, occupancyRate } = data;

  const metrics = [
    {
      key: "bookings",
      label: "Bookings Today",
      value: bookingsToday.total,
      displayValue: (
        <span className="text-3xl font-bold text-gray-900 tracking-tight">
          {bookingsToday.total}
        </span>
      ),
      sub: (
        <div className="flex items-center gap-2 mt-1.5">
          <GrowthBadge value={bookingsToday.growth} />
          <span className="text-xs text-gray-400">vs yesterday ({bookingsToday.yesterday})</span>
        </div>
      ),
      icon: "🗓️",
      accent: "bg-blue-50",
    },
    {
      key: "revenue",
      label: "Revenue Today",
      displayValue: (
        <span className="text-3xl font-bold text-gray-900 tracking-tight">
          {formatPrice(revenueToday.total)}
        </span>
      ),
      sub: (
        <div className="flex items-center gap-2 mt-1.5">
          <GrowthBadge value={revenueToday.growth} />
          <span className="text-xs text-gray-400">vs {formatPrice(revenueToday.yesterday)}</span>
        </div>
      ),
      icon: "💰",
      accent: "bg-emerald-50",
    },
    {
      key: "occupancy",
      label: "Occupancy Rate",
      displayValue: null, // custom render
      sub: null,
      icon: null,
      accent: "bg-violet-50",
    },
  ];

  return (
    <div className="w-full bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="grid grid-cols-3 divide-x divide-gray-100">

        {/* ── Bookings ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0 }}
          className="px-6 py-5"
        >
          <div className={`inline-flex items-center justify-center w-8 h-8 rounded-lg ${metrics[0].accent} mb-3`}>
            <span className="text-sm">{metrics[0].icon}</span>
          </div>
          <p className="text-[11px] tracking-widest uppercase text-gray-400 mb-1">
            {metrics[0].label}
          </p>
          {metrics[0].displayValue}
          {metrics[0].sub}
        </motion.div>

        {/* ── Revenue ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.08 }}
          className="px-6 py-5"
        >
          <div className={`inline-flex items-center justify-center w-8 h-8 rounded-lg ${metrics[1].accent} mb-3`}>
            <span className="text-sm">{metrics[1].icon}</span>
          </div>
          <p className="text-[11px] tracking-widest uppercase text-gray-400 mb-1">
            {metrics[1].label}
          </p>
          {metrics[1].displayValue}
          {metrics[1].sub}
        </motion.div>

        {/* ── Occupancy ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.16 }}
          className="px-6 py-5"
        >
          <div className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-violet-50 mb-3">
            <span className="text-sm">🏨</span>
          </div>
          <p className="text-[11px] tracking-widest uppercase text-gray-400 mb-1">
            Occupancy Rate
          </p>

          <div className="flex items-center gap-4">
            {/* Arc */}
            <div className="relative">
              <OccupancyArc percentage={occupancyRate.percentage} />
              <div className="absolute inset-0 flex items-center justify-center rotate-90">
                <span className="text-xs font-bold text-gray-800">{occupancyRate.percentage}%</span>
              </div>
            </div>

            {/* Detail */}
            <div>
              <p className="text-3xl font-bold text-gray-900 tracking-tight leading-none">
                {occupancyRate.percentage}
                <span className="text-base font-normal text-gray-400">%</span>
              </p>
              <p className="text-xs text-gray-400 mt-1.5">
                {occupancyRate.occupiedRooms} / {occupancyRate.totalRooms} rooms
              </p>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}