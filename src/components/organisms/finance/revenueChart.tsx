"use client";

import { useState } from "react";
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { formatRupiah } from "./dataDummy";
import { getCreditSummary, revenueCreditByPeriod } from "./dataDummy2";

type ViewMode = "stacked" | "net";

interface TooltipProps {
  active?: boolean;
  label?: string;
  payload?: Array<{ name: string; value: number; color: string }>;
}

function CustomTooltip({ active, label, payload }: TooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2.5 shadow-lg text-xs space-y-1.5">
      <p className="font-semibold text-zinc-800 dark:text-zinc-100 mb-1">{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color }} className="flex items-center justify-between gap-6">
          <span>{p.name}</span>
          <span className="font-medium">{formatRupiah(p.value, true)}</span>
        </p>
      ))}
    </div>
  );
}

function formatAxis(v: number): string {
  if (v >= 1_000_000_000) return `${(v / 1_000_000_000).toFixed(1)}M`;
  if (v >= 1_000_000)     return `${(v / 1_000_000).toFixed(0)}Jt`;
  return String(v);
}

interface Props {
  period: string;
}

export function RevenueCreditChart({ period }: Props) {
  const [mode, setMode] = useState<ViewMode>("stacked");
  const data   = revenueCreditByPeriod[period] ?? revenueCreditByPeriod.ytd;
  const summary = getCreditSummary(period);

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-5">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-100 mb-1">
            Revenue vs Refund &amp; Credit
          </h3>
          <p className="text-xs text-zinc-400 dark:text-zinc-500">
            Perbandingan gross revenue, credit note, dan cash refund
          </p>
        </div>

        <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800 rounded-lg p-0.5">
          {(["stacked", "net"] as ViewMode[]).map((v) => (
            <button
              key={v}
              onClick={() => setMode(v)}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                mode === v
                  ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-50 shadow-sm"
                  : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
              }`}
            >
              {v === "stacked" ? "Detail" : "Net"}
            </button>
          ))}
        </div>
      </div>

      {/* Summary row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        {[
          { label: "Gross Revenue",  value: formatRupiah(summary.totalRevenue, true),      color: "text-zinc-800 dark:text-zinc-100" },
          { label: "Credit Note",    value: formatRupiah(summary.totalRefundCredit, true),  color: "text-amber-600 dark:text-amber-400" },
          { label: "Cash Refund",    value: formatRupiah(summary.totalCashRefund, true),    color: "text-rose-500 dark:text-rose-400" },
          { label: "Net Revenue",    value: formatRupiah(summary.totalNetRevenue, true),    color: "text-emerald-600 dark:text-emerald-400" },
        ].map((s) => (
          <div key={s.label} className="bg-zinc-50 dark:bg-zinc-800/60 rounded-lg px-3 py-2.5">
            <p className="text-xs text-zinc-400 dark:text-zinc-500 mb-0.5">{s.label}</p>
            <p className={`text-sm font-semibold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Ratio badges */}
      <div className="flex flex-wrap gap-2 mb-5">
        <span className="text-xs px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-100 dark:border-amber-900">
          Credit ratio: {summary.creditRatio}% dari gross
        </span>
        <span className="text-xs px-2.5 py-1 rounded-full bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-900">
          Cash refund ratio: {summary.refundRatio}% dari gross
        </span>
        <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900">
          Net retention: {(100 - summary.creditRatio - summary.refundRatio).toFixed(1)}%
        </span>
      </div>

      <ResponsiveContainer width="100%" height={260}>
        {mode === "stacked" ? (
          <ComposedChart data={data} barSize={22} margin={{ top: 4, right: 4, left: -4, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" vertical={false} />
            <XAxis dataKey="shortMonth" tick={{ fontSize: 11, fill: "#888780" }} axisLine={false} tickLine={false} />
            <YAxis tickFormatter={formatAxis} tick={{ fontSize: 11, fill: "#888780" }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(0,0,0,0.04)" }} />
            <Legend
              iconType="square"
              iconSize={10}
              formatter={(value) => <span style={{ fontSize: 11, color: "#888780" }}>{value}</span>}
            />
            <Bar dataKey="revenue"      name="Gross Revenue" stackId="a" fill="#185FA5" radius={[0, 0, 0, 0]} />
            <Bar dataKey="refundCredit" name="Credit Note"   stackId="b" fill="#EF9F27" radius={[0, 0, 0, 0]} />
            <Bar dataKey="cashRefund"   name="Cash Refund"   stackId="b" fill="#E24B4A" radius={[4, 4, 0, 0]} />
            <Line
              type="monotone"
              dataKey="netRevenue"
              name="Net Revenue"
              stroke="#0F6E56"
              strokeWidth={2}
              dot={{ fill: "#0F6E56", r: 3 }}
              activeDot={{ r: 5 }}
            />
          </ComposedChart>
        ) : (
          <ComposedChart data={data} barSize={28} margin={{ top: 4, right: 4, left: -4, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" vertical={false} />
            <XAxis dataKey="shortMonth" tick={{ fontSize: 11, fill: "#888780" }} axisLine={false} tickLine={false} />
            <YAxis tickFormatter={formatAxis} tick={{ fontSize: 11, fill: "#888780" }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(0,0,0,0.04)" }} />
            <Legend
              iconType="square"
              iconSize={10}
              formatter={(value) => <span style={{ fontSize: 11, color: "#888780" }}>{value}</span>}
            />
            <Bar dataKey="revenue"    name="Gross Revenue" fill="#B5D4F4" radius={[4, 4, 0, 0]} />
            <Bar dataKey="netRevenue" name="Net Revenue"   fill="#185FA5" radius={[4, 4, 0, 0]} />
            <Line
              type="monotone"
              dataKey="cashRefund"
              name="Cash Refund"
              stroke="#E24B4A"
              strokeWidth={2}
              strokeDasharray="4 2"
              dot={{ fill: "#E24B4A", r: 3 }}
            />
            <Line
              type="monotone"
              dataKey="refundCredit"
              name="Credit Note"
              stroke="#EF9F27"
              strokeWidth={2}
              strokeDasharray="4 2"
              dot={{ fill: "#EF9F27", r: 3 }}
            />
          </ComposedChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}
