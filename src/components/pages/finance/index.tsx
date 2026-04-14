"use client";

import { useState } from "react";
import { Hotel, TrendingUp, Users, BedDouble, Banknote } from "lucide-react";
import { formatRupiah, quarterlyData } from "../../organisms/finance/dataDummy";
import { MetricCard } from "../../organisms/finance/metricCard";
import { RoomTypePieChart } from "../../organisms/finance/pieCHart";
import { MonthlyBookingsChart } from "../../organisms/finance/monthlyBookingChart";
import { RevenueByRoomChart } from "../../organisms/finance/revenueByRoom";
import { RecentBookingsTable } from "../../organisms/finance/recentBookingsTable";
import { PeakDatesTable } from "../../organisms/finance/peakDatesTable";
import { CancellationChart } from "../../organisms/finance/cancelationChart";
import { RevenueCreditChart } from "../../organisms/finance/revenueChart";


type Period = "ytd" | "q1" | "q2" | "q3" | "q4";

const PERIOD_LABELS: Record<Period, string> = {
  ytd: "Year to Date",
  q1: "Q1 (Jan–Mar)",
  q2: "Q2 (Apr–Jun)",
  q3: "Q3 (Jul–Sep)",
  q4: "Q4 (Okt–Des)",
};

export default function FinancePage() {
  const [period, setPeriod] = useState<Period>("ytd");
  const { summary, months } = quarterlyData[period];

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 font-sans">
      {/* ── Header ──────────────────────────────────────────────────── */}
      <header className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 px-6 py-4">
        <div className="w-full mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Hotel className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                Marina By Sand
              </h1>
              <p className="text-xs text-zinc-400 dark:text-zinc-500">Finance & Booking Dashboard</p>
            </div>
          </div>

          {/* Period filter */}
          <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800 rounded-lg p-1">
            {(Object.keys(PERIOD_LABELS) as Period[]).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  period === p
                    ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-50 shadow-sm"
                    : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
                }`}
              >
                {p.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* ── Content ─────────────────────────────────────────────────── */}
      <main className="w-full mx-auto px-6 py-8 space-y-6">

        {/* Period label */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              Finance Summary
            </h2>
            <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">
              {PERIOD_LABELS[period]} · 2025
            </p>
          </div>
          <p className="text-xs text-zinc-400 dark:text-zinc-500">
            Last updated: 24 Des 2025, 14:32 WIB
          </p>
        </div>

        {/* ── Metric cards ─────────────────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            label="Total Revenue"
            value={formatRupiah(summary.totalRevenue, true)}
            growth={summary.revenueGrowth}
            icon={<Banknote className="w-4 h-4" />}
          />
          <MetricCard
            label="Total Bookings"
            value={summary.totalBookings.toLocaleString("id-ID")}
            growth={summary.bookingGrowth}
            icon={<Users className="w-4 h-4" />}
          />
          <MetricCard
            label="Avg Occupancy"
            value={`${summary.avgOccupancy}%`}
            growth={summary.occupancyChange}
            icon={<BedDouble className="w-4 h-4" />}
          />
          <MetricCard
            label="Avg Revenue/Malam"
            value={formatRupiah(summary.avgNightlyRate, true)}
            growth={summary.adrGrowth}
            icon={<TrendingUp className="w-4 h-4" />}
          />
        </div>

        {/* ── Charts row 1 ─────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-1">
            <RoomTypePieChart />
          </div>
          <div className="lg:col-span-2">
            <MonthlyBookingsChart data={months} />
          </div>
        </div>

        {/* ── Charts row 2 ─────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <PeakDatesTable />
          <RevenueByRoomChart />
        </div>

        {/* ── Cancellation + Revenue vs Credit ─────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <CancellationChart period={period} />
          <RevenueCreditChart period={period} />
        </div>

        {/* ── Recent bookings ──────────────────────────────────────── */}
        <RecentBookingsTable />
      </main>
    </div>
  );
}
