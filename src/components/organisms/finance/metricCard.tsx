"use client";

import { TrendingUp, TrendingDown } from "lucide-react";

interface MetricCardProps {
  label: string;
  value: string;
  growth: number;
  growthLabel?: string;
  icon?: React.ReactNode;
}

export function MetricCard({ label, value, growth, growthLabel = "vs tahun lalu", icon }: MetricCardProps) {
  const isPositive = growth > 0;
  const isNeutral = growth === 0;

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">
          {label}
        </span>
        {icon && (
          <span className="text-zinc-300 dark:text-zinc-600">{icon}</span>
        )}
      </div>

      <p className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50 tracking-tight">
        {value}
      </p>

      <div
        className={`flex items-center gap-1.5 text-xs font-medium ${
          isNeutral
            ? "text-zinc-400"
            : isPositive
            ? "text-emerald-600 dark:text-emerald-400"
            : "text-rose-500 dark:text-rose-400"
        }`}
      >
        {!isNeutral &&
          (isPositive ? (
            <TrendingUp className="w-3.5 h-3.5" />
          ) : (
            <TrendingDown className="w-3.5 h-3.5" />
          ))}
        <span>
          {growth > 0 ? "+" : ""}
          {growth.toFixed(1)}% {growthLabel}
        </span>
      </div>
    </div>
  );
}
