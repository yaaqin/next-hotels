"use client";

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
import { formatRupiah, roomTypeStats } from "./dataDummy";

interface TooltipProps {
  active?: boolean;
  payload?: Array<{ value: number; payload: (typeof roomTypeStats)[0] }>;
}

function CustomTooltip({ active, payload }: TooltipProps) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2.5 shadow-lg text-xs">
      <p className="font-semibold text-zinc-800 dark:text-zinc-100 mb-1">{d.roomType}</p>
      <p className="text-zinc-500 dark:text-zinc-400">{formatRupiah(d.revenue, true)}</p>
      <p className="text-zinc-500 dark:text-zinc-400">Avg/malam: {formatRupiah(d.avgNightRate, true)}</p>
    </div>
  );
}

function formatRevAxis(v: number): string {
  if (v >= 1_000_000_000) return `${(v / 1_000_000_000).toFixed(1)}M`;
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(0)}Jt`;
  return String(v);
}

export function RevenueByRoomChart() {
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-5">
      <h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-100 mb-1">
        Revenue per Tipe Kamar
      </h3>
      <p className="text-xs text-zinc-400 dark:text-zinc-500 mb-5">
        Kontribusi revenue YTD (Rp)
      </p>

      <ResponsiveContainer width="100%" height={220}>
        <BarChart
          layout="vertical"
          data={roomTypeStats}
          barSize={18}
          margin={{ top: 0, right: 8, left: 10, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" horizontal={false} />
          <XAxis
            type="number"
            tickFormatter={formatRevAxis}
            tick={{ fontSize: 10, fill: "#888780" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            type="category"
            dataKey="roomType"
            tick={{ fontSize: 11, fill: "#888780" }}
            axisLine={false}
            tickLine={false}
            width={80}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(0,0,0,0.04)" }} />
          <Bar dataKey="revenue" radius={[0, 4, 4, 0]}>
            {roomTypeStats.map((entry) => (
              <Cell key={entry.roomType} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
