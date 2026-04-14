"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { formatRupiah, roomTypeStats } from "./dataDummy";

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    payload: (typeof roomTypeStats)[0];
  }>;
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2.5 shadow-lg text-xs">
      <p className="font-semibold text-zinc-800 dark:text-zinc-100 mb-1">{d.roomType}</p>
      <p className="text-zinc-500 dark:text-zinc-400">{d.bookings.toLocaleString("id-ID")} bookings</p>
      <p className="text-zinc-500 dark:text-zinc-400">{formatRupiah(d.revenue, true)} revenue</p>
    </div>
  );
}

interface LabelProps {
  cx?: number;
  cy?: number;
  midAngle?: number;
  innerRadius?: number;
  outerRadius?: number;
  percent?: number;
}

function CustomLabel({ cx = 0, cy = 0, midAngle = 0, innerRadius = 0, outerRadius = 0, percent = 0 }: LabelProps) {
  if (percent < 0.08) return null;
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={12} fontWeight={600}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
}

export function RoomTypePieChart() {
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-5">
      <h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-100 mb-1">
        Room Type Bookings
      </h3>
      <p className="text-xs text-zinc-400 dark:text-zinc-500 mb-5">
        Distribusi pemesanan per tipe kamar
      </p>

      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={roomTypeStats}
            cx="50%"
            cy="50%"
            outerRadius={95}
            dataKey="bookings"
            nameKey="roomType"
            labelLine={false}
            label={CustomLabel}
          >
            {roomTypeStats.map((entry) => (
              <Cell key={entry.roomType} fill={entry.color} stroke="transparent" />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>

      <div className="mt-4 space-y-2">
        {roomTypeStats.map((rt) => (
          <div key={rt.roomType} className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span
                className="w-2.5 h-2.5 rounded-sm flex-shrink-0"
                style={{ backgroundColor: rt.color }}
              />
              <span className="text-zinc-600 dark:text-zinc-300">{rt.roomType}</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-zinc-400 dark:text-zinc-500">
                {rt.bookings.toLocaleString("id-ID")} bookings
              </span>
              <span className="font-medium text-zinc-700 dark:text-zinc-200 w-8 text-right">
                {rt.percentage}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
