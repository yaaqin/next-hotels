"use client";

import { MonthlyStats } from "@/src/models/finance/dashboard";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { formatRupiah } from "./dataDummy";

interface Props {
  data: MonthlyStats[];
}

interface TooltipProps {
  active?: boolean;
  label?: string;
  payload?: Array<{ value: number; payload: MonthlyStats }>;
}

function CustomTooltip({ active, label, payload }: TooltipProps) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2.5 shadow-lg text-xs">
      <p className="font-semibold text-zinc-800 dark:text-zinc-100 mb-1">{d.month}</p>
      <p className="text-zinc-500 dark:text-zinc-400">{d.bookings} bookings</p>
      <p className="text-zinc-500 dark:text-zinc-400">{formatRupiah(d.revenue, true)} revenue</p>
      <p className="text-zinc-500 dark:text-zinc-400">Occ. {d.occupancyRate}%</p>
    </div>
  );
}

function getBarColor(bookings: number): string {
  if (bookings >= 420) return "#185FA5";
  if (bookings >= 320) return "#0F6E56";
  return "#AFA9EC";
}

export function MonthlyBookingsChart({ data }: Props) {
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-5">
      <div className="flex items-start justify-between mb-5">
        <div>
          <h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-100 mb-1">
            Hari / Bulan Paling Rame
          </h3>
          <p className="text-xs text-zinc-400 dark:text-zinc-500">
            Volume booking bulanan — peak days highlighted
          </p>
        </div>
        <div className="flex items-center gap-4 text-xs text-zinc-400 dark:text-zinc-500">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#185FA5]" /> Peak tinggi
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#0F6E56]" /> Medium
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#AFA9EC]" /> Normal
          </span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data} barSize={28} margin={{ top: 4, right: 4, left: -10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" vertical={false} />
          <XAxis
            dataKey="shortMonth"
            tick={{ fontSize: 11, fill: "#888780" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "#888780" }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(0,0,0,0.04)" }} />
          <Bar dataKey="bookings" radius={[4, 4, 0, 0]}>
            {data.map((entry) => (
              <Cell key={entry.shortMonth} fill={getBarColor(entry.bookings)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
