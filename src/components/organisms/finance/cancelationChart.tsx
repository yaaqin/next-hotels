"use client";

import { useState } from "react";
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
import { cancellationByPeriod } from "./dataDummy2";

type ViewMode = "cancelled" | "paid" | "rate";

const VIEW_LABELS: Record<ViewMode, string> = {
  cancelled: "Jml Cancel",
  paid:      "Jml Paid",
  rate:      "Cancel Rate %",
};

interface TooltipProps {
  active?: boolean;
  payload?: Array<{ value: number; payload: (typeof cancellationByPeriod)["ytd"][0] }>;
}

function CustomTooltip({ active, payload }: TooltipProps) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2.5 shadow-lg text-xs space-y-1">
      <p className="font-semibold text-zinc-800 dark:text-zinc-100">{d.roomType}</p>
      <p className="text-zinc-500 dark:text-zinc-400">
        Total booking: <span className="font-medium text-zinc-700 dark:text-zinc-200">{d.confirmedTotal.toLocaleString("id-ID")}</span>
      </p>
      <p className="text-rose-500 dark:text-rose-400">
        Cancelled: <span className="font-medium">{d.cancelled.toLocaleString("id-ID")}</span>
      </p>
      <p className="text-emerald-600 dark:text-emerald-400">
        Paid/completed: <span className="font-medium">{(d.confirmedTotal - d.cancelled).toLocaleString("id-ID")}</span>
      </p>
      <p className="text-zinc-500 dark:text-zinc-400">
        Cancel rate: <span className="font-medium text-zinc-700 dark:text-zinc-200">{d.cancellationRate}%</span>
      </p>
    </div>
  );
}

interface Props {
  period: string;
}

export function CancellationChart({ period }: Props) {
  const [mode, setMode] = useState<ViewMode>("cancelled");
  const data = cancellationByPeriod[period] ?? cancellationByPeriod.ytd;

  const chartData = data.map((d) => ({
    ...d,
    paid: d.confirmedTotal - d.cancelled,
    displayValue:
      mode === "cancelled" ? d.cancelled :
      mode === "paid"      ? d.confirmedTotal - d.cancelled :
      d.cancellationRate,
  }));

  const barColor = (roomType: string, entry: typeof chartData[0]): string => {
    if (mode === "cancelled") return "#E24B4A";
    if (mode === "paid")      return entry.color;
    // rate — gradient from green to red based on rate
    const rate = entry.cancellationRate;
    if (rate >= 15) return "#E24B4A";
    if (rate >= 10) return "#EF9F27";
    return "#3B6D11";
  };

  const yLabel = mode === "rate" ? "%" : "bookings";

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-5">
      <div className="flex items-start justify-between mb-5">
        <div>
          <h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-100 mb-1">
            Booking per Tipe Kamar
          </h3>
          <p className="text-xs text-zinc-400 dark:text-zinc-500">
            Ganti tampilan: cancel, paid, atau cancel rate
          </p>
        </div>

        {/* Toggle mode */}
        <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800 rounded-lg p-0.5">
          {(Object.keys(VIEW_LABELS) as ViewMode[]).map((v) => (
            <button
              key={v}
              onClick={() => setMode(v)}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                mode === v
                  ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-50 shadow-sm"
                  : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
              }`}
            >
              {VIEW_LABELS[v]}
            </button>
          ))}
        </div>
      </div>

      {/* Summary pills */}
      <div className="flex flex-wrap gap-2 mb-4">
        {data.map((d) => (
          <div
            key={d.roomType}
            className="flex items-center gap-1.5 text-xs bg-zinc-50 dark:bg-zinc-800 px-2.5 py-1 rounded-full border border-zinc-100 dark:border-zinc-700"
          >
            <span className="w-2 h-2 rounded-sm" style={{ backgroundColor: d.color }} />
            <span className="text-zinc-600 dark:text-zinc-300">{d.roomType}</span>
            {mode === "cancelled" && (
              <span className="font-semibold text-rose-500 dark:text-rose-400">{d.cancelled}</span>
            )}
            {mode === "paid" && (
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                {(d.confirmedTotal - d.cancelled).toLocaleString("id-ID")}
              </span>
            )}
            {mode === "rate" && (
              <span
                className={`font-semibold ${
                  d.cancellationRate >= 15
                    ? "text-rose-500 dark:text-rose-400"
                    : d.cancellationRate >= 10
                    ? "text-amber-500 dark:text-amber-400"
                    : "text-emerald-600 dark:text-emerald-400"
                }`}
              >
                {d.cancellationRate}%
              </span>
            )}
          </div>
        ))}
      </div>

      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={chartData} barSize={36} margin={{ top: 4, right: 4, left: -10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" vertical={false} />
          <XAxis
            dataKey="roomType"
            tick={{ fontSize: 11, fill: "#888780" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "#888780" }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => mode === "rate" ? `${v}%` : v}
            label={{
              value: yLabel,
              angle: -90,
              position: "insideLeft",
              offset: 12,
              style: { fontSize: 10, fill: "#888780" },
            }}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(0,0,0,0.04)" }} />
          <Bar dataKey="displayValue" radius={[4, 4, 0, 0]}>
            {chartData.map((entry) => (
              <Cell key={entry.roomType} fill={barColor(entry.roomType, entry)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Legend for rate mode */}
      {mode === "rate" && (
        <div className="flex items-center gap-4 mt-3 text-xs text-zinc-400 dark:text-zinc-500">
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-[#3B6D11]" /> {"<"} 10% — Baik</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-[#EF9F27]" /> 10–15% — Perlu perhatian</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-[#E24B4A]" /> {">"}15% — Tinggi</span>
        </div>
      )}
    </div>
  );
}
