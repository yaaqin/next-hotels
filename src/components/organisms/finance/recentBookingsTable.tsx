"use client";

import { BookingStatus } from "@/src/models/finance/dashboard";
import { formatRupiah, recentBookings } from "./dataDummy";

const STATUS_STYLES: Record<BookingStatus, string> = {
  confirmed:   "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  checked_in:  "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
  checked_out: "bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400",
  cancelled:   "bg-rose-50 text-rose-600 dark:bg-rose-950 dark:text-rose-400",
};

const STATUS_LABEL: Record<BookingStatus, string> = {
  confirmed:   "Confirmed",
  checked_in:  "Check-in",
  checked_out: "Check-out",
  cancelled:   "Cancelled",
};

const CHANNEL_STYLES: Record<string, string> = {
  direct:    "bg-violet-50 text-violet-600 dark:bg-violet-950 dark:text-violet-300",
  OTA:       "bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-300",
  corporate: "bg-cyan-50 text-cyan-600 dark:bg-cyan-950 dark:text-cyan-300",
  "walk-in": "bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400",
};

export function RecentBookingsTable() {
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-5">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-100 mb-1">
            Booking Terbaru
          </h3>
          <p className="text-xs text-zinc-400 dark:text-zinc-500">
            10 transaksi terakhir
          </p>
        </div>
        <button className="text-xs text-blue-600 dark:text-blue-400 hover:underline">
          Lihat semua →
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-zinc-100 dark:border-zinc-800">
              {["ID Booking", "Tamu", "Tipe Kamar", "Check-in", "Check-out", "Malam", "Total", "Channel", "Status"].map((h) => (
                <th key={h} className="text-left pb-2.5 pr-4 font-medium text-zinc-400 dark:text-zinc-500 uppercase tracking-wider whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {recentBookings.map((b) => (
              <tr
                key={b.id}
                className="border-b border-zinc-50 dark:border-zinc-800/60 last:border-0 hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-colors"
              >
                <td className="py-3 pr-4 font-mono text-zinc-500 dark:text-zinc-400 whitespace-nowrap">
                  {b.id}
                </td>
                <td className="py-3 pr-4 font-medium text-zinc-800 dark:text-zinc-100 whitespace-nowrap">
                  {b.guestName}
                </td>
                <td className="py-3 pr-4 whitespace-nowrap">
                  <span className="text-zinc-600 dark:text-zinc-300">{b.roomType}</span>
                  <span className="ml-1 text-zinc-400 dark:text-zinc-500">#{b.roomNumber}</span>
                </td>
                <td className="py-3 pr-4 text-zinc-500 dark:text-zinc-400 whitespace-nowrap">{b.checkIn}</td>
                <td className="py-3 pr-4 text-zinc-500 dark:text-zinc-400 whitespace-nowrap">{b.checkOut}</td>
                <td className="py-3 pr-4 text-center text-zinc-600 dark:text-zinc-300">{b.nights}</td>
                <td className="py-3 pr-4 font-semibold text-zinc-800 dark:text-zinc-100 whitespace-nowrap">
                  {formatRupiah(b.totalAmount, true)}
                </td>
                <td className="py-3 pr-4 whitespace-nowrap">
                  <span className={`px-2 py-0.5 rounded-md font-medium ${CHANNEL_STYLES[b.channel]}`}>
                    {b.channel}
                  </span>
                </td>
                <td className="py-3 whitespace-nowrap">
                  <span className={`px-2 py-0.5 rounded-md font-medium ${STATUS_STYLES[b.status]}`}>
                    {STATUS_LABEL[b.status]}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
