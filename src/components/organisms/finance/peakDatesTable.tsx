"use client";

import { formatRupiah, peakDates } from "./dataDummy";

export function PeakDatesTable() {
  const max = Math.max(...peakDates.map((d) => d.bookings));

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-5">
      <h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-100 mb-1">
        Top Peak Dates
      </h3>
      <p className="text-xs text-zinc-400 dark:text-zinc-500 mb-5">
        Tanggal dengan booking terbanyak YTD
      </p>

      <div className="space-y-0">
        <div className="grid grid-cols-[1fr_1.4fr_80px_80px] gap-2 pb-2 border-b border-zinc-100 dark:border-zinc-800 text-xs font-medium text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
          <span>Tanggal</span>
          <span>Occasion</span>
          <span className="text-right">Booking</span>
          <span className="text-right">Revenue</span>
        </div>

        {peakDates.map((d, i) => (
          <div
            key={d.date}
            className="grid grid-cols-[1fr_1.4fr_80px_80px] gap-2 py-3 border-b border-zinc-50 dark:border-zinc-800/60 last:border-0 items-center"
          >
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500 text-[10px] font-semibold flex items-center justify-center">
                {i + 1}
              </span>
              <span className="text-xs font-medium text-zinc-700 dark:text-zinc-200">
                {d.date}
              </span>
            </div>

            <span className="text-xs text-zinc-500 dark:text-zinc-400 truncate">
              {d.occasion}
            </span>

            <div className="text-right">
              <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-100">
                {d.bookings}
              </span>
              <div className="mt-1 h-1 rounded-full bg-zinc-100 dark:bg-zinc-800">
                <div
                  className="h-1 rounded-full"
                  style={{
                    width: `${Math.round((d.bookings / max) * 100)}%`,
                    backgroundColor: i === 0 ? "#185FA5" : i < 3 ? "#0F6E56" : "#AFA9EC",
                  }}
                />
              </div>
            </div>

            <span className="text-right text-xs text-zinc-500 dark:text-zinc-400">
              {formatRupiah(d.revenue, true)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
