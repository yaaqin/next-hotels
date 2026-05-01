"use client";

import { dailyRevenue } from "@/src/constans/dummy/restoData";


export default function RevenueChart() {
  const max = Math.max(...dailyRevenue.map((d) => d.revenue));
  const today = dailyRevenue[dailyRevenue.length - 1];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5">
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
            Pendapatan Harian
          </p>
          <p className="text-xl font-bold text-gray-900 mt-0.5">
            Rp {(dailyRevenue.reduce((a, b) => a + b.revenue, 0) / 1_000_000).toFixed(1)}jt
          </p>
          <p className="text-xs text-gray-400">Total 7 hari terakhir</p>
        </div>
        <div className="text-right">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 text-xs font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
            +12.4%
          </span>
          <p className="text-xs text-gray-400 mt-1">vs minggu lalu</p>
        </div>
      </div>

      {/* Bar chart */}
      <div className="flex items-end gap-2 h-40">
        {dailyRevenue.map((d, i) => {
          const heightPct = (d.revenue / max) * 100;
          const isLast = i === dailyRevenue.length - 1;
          return (
            <div key={d.day} className="flex-1 flex flex-col items-center gap-1.5 group relative">
              {/* Tooltip */}
              <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] rounded-lg px-2 py-1.5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                <p className="font-semibold">Rp {(d.revenue / 1_000_000).toFixed(2)}jt</p>
                <p className="text-gray-400">{d.orders} pesanan</p>
              </div>

              <div className="w-full flex items-end" style={{ height: "128px" }}>
                <div
                  className={`w-full rounded-t-lg transition-all duration-300 ${
                    isLast
                      ? "bg-orange-500"
                      : "bg-orange-100 group-hover:bg-orange-200"
                  }`}
                  style={{ height: `${heightPct}%` }}
                />
              </div>
              <p className={`text-[10px] font-medium ${isLast ? "text-orange-600" : "text-gray-400"}`}>
                {d.day}
              </p>
            </div>
          );
        })}
      </div>

      {/* Bottom legend */}
      <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between">
        <p className="text-xs text-gray-400">
          Hari terbaik:{" "}
          <span className="font-semibold text-gray-700">
            {dailyRevenue.reduce((a, b) => (a.revenue > b.revenue ? a : b)).day}{" "}
            — Rp{" "}
            {(
              Math.max(...dailyRevenue.map((d) => d.revenue)) / 1_000_000
            ).toFixed(2)}
            jt
          </span>
        </p>
        <p className="text-xs text-gray-400">
          Total pesanan:{" "}
          <span className="font-semibold text-gray-700">
            {dailyRevenue.reduce((a, b) => a + b.orders, 0)} transaksi
          </span>
        </p>
      </div>
    </div>
  );
}