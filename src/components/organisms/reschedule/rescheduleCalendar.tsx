"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import type { rechAvlbDateState } from "@/src/models/reschedule/rescAvlbDate";

// ─── Props ────────────────────────────────────────────────────────────────────

interface RescheduleCalendarProps {
  bookingId: string;
  onClose: () => void;
  data: rechAvlbDateState;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const DAYS_ID = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

function formatRupiah(val: number): string {
  if (val >= 1_000_000) return `${(val / 1_000_000).toFixed(val % 1_000_000 === 0 ? 0 : 1)}jt`;
  if (val >= 1_000) return `${Math.round(val / 1_000)}rb`;
  return val.toString();
}

function isSameDay(a: globalThis.Date, b: globalThis.Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function toISODate(date: globalThis.Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function RescheduleCalendar({
  bookingId,
  onClose,
  data,
}: RescheduleCalendarProps) {
  const router = useRouter();

  // Build flat date map dari months untuk lookup O(1)
  const dateMap = new Map<string, rechAvlbDateState["months"][0]["dates"][0]>();
  for (const month of data.months) {
    for (const entry of month.dates) {
      dateMap.set(entry.date, entry);
    }
  }

  // Tentukan bulan awal: bulan pertama yang ada di data
  const firstMonth = data.months[0];
  const [ymKey, setYmKey] = useState(firstMonth?.month ?? "");

  const currentMonthData = data.months.find((m) => m.month === ymKey);
  const monthIndex = data.months.findIndex((m) => m.month === ymKey);
  const canGoPrev = monthIndex > 0;
  const canGoNext = monthIndex < data.months.length - 1;

  const [selectedDate, setSelectedDate] = useState<globalThis.Date | null>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (overlayRef.current && (e.target as Node) === overlayRef.current) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  // Close on ESC
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  const goPrev = () => {
    if (!canGoPrev) return;
    setYmKey(data.months[monthIndex - 1].month);
    setSelectedDate(null);
  };

  const goNext = () => {
    if (!canGoNext) return;
    setYmKey(data.months[monthIndex + 1].month);
    setSelectedDate(null);
  };

  // Build calendar grid untuk bulan ini
  const [year, month] = ymKey.split("-").map(Number);
  const firstDayOfWeek = new Date(year, month - 1, 1).getDay();
  const daysInMonth = new Date(year, month, 0).getDate();
  const cells: (globalThis.Date | null)[] = [
    ...Array(firstDayOfWeek).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => new Date(year, month - 1, i + 1)),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  const handleDayClick = (date: globalThis.Date) => {
    const key = toISODate(date);
    const entry = dateMap.get(key);
    if (!entry || !entry.available || !entry.sameTypePrice) return;

    if (selectedDate && isSameDay(selectedDate, date)) {
      setSelectedDate(null);
      return;
    }
    setSelectedDate(date);
  };

  const handleConfirm = () => {
    if (!selectedDate) return;
    const checkIn = toISODate(selectedDate);
    const checkOutDate = new Date(selectedDate);
    checkOutDate.setDate(checkOutDate.getDate() + data.originalNights);
    const checkOut = toISODate(checkOutDate);
    router.push(`/reschedule/${bookingId}?newCheckIn=${checkIn}&newCheckOut=${checkOut}`);
  };

  const today = new Date();

  const selectedEntry = selectedDate ? dateMap.get(toISODate(selectedDate)) : null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm"
    >
      <div
        className="relative w-full sm:w-[400px] bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden"
        style={{ maxHeight: "90dvh" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Header ── */}
        <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-gray-100">
          <div>
            <p className="text-[11px] font-medium text-gray-400 uppercase tracking-widest">Reschedule</p>
            <h2 className="text-base font-bold text-gray-900 mt-0.5">Pilih Tanggal Baru</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition text-gray-500 text-lg leading-none"
          >
            ×
          </button>
        </div>

        <div className="overflow-y-auto" style={{ maxHeight: "calc(90dvh - 60px)" }}>
          {/* ── Month nav ── */}
          <div className="flex items-center justify-between px-5 pt-4 pb-2">
            <button
              onClick={goPrev}
              disabled={!canGoPrev}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition disabled:opacity-20 disabled:cursor-not-allowed text-gray-600 text-lg"
            >
              ‹
            </button>
            <span className="text-sm font-semibold text-gray-800">
              {currentMonthData?.label}
            </span>
            <button
              onClick={goNext}
              disabled={!canGoNext}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition disabled:opacity-20 disabled:cursor-not-allowed text-gray-600 text-lg"
            >
              ›
            </button>
          </div>

          {/* ── Day headers ── */}
          <div className="grid grid-cols-7 px-3 mb-1">
            {DAYS_ID.map((d) => (
              <div key={d} className="text-center text-[10px] font-semibold text-gray-400 py-1">
                {d}
              </div>
            ))}
          </div>

          {/* ── Day cells ── */}
          <div className="grid grid-cols-7 gap-y-0.5 px-3 pb-3">
            {cells.map((date, idx) => {
              if (!date) return <div key={`e-${idx}`} />;

              const key = toISODate(date);
              const entry = dateMap.get(key);
              const isClickable = !!entry?.available && !!entry.sameTypePrice;
              const isSelected = selectedDate ? isSameDay(selectedDate, date) : false;
              const isToday = isSameDay(date, today);
              const isPast = date < today && !isToday;
              const price = entry?.sameTypePrice ?? null;

              return (
                <button
                  key={idx}
                  onClick={() => isClickable && handleDayClick(date)}
                  disabled={!isClickable || isPast}
                  className={[
                    "relative flex flex-col items-center justify-center rounded-xl py-1.5 transition-all duration-150 group",
                    !isClickable || isPast
                      ? "opacity-30 cursor-not-allowed"
                      : "cursor-pointer",
                    isSelected
                      ? "bg-gray-900 shadow-lg scale-105"
                      : isClickable && !isPast
                      ? "hover:bg-gray-50 active:scale-95"
                      : "",
                    isToday && !isSelected ? "ring-1 ring-gray-300" : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  <span
                    className={[
                      "text-[12px] font-semibold leading-none",
                      isSelected
                        ? "text-white"
                        : isPast || !isClickable
                        ? "text-gray-400"
                        : "text-gray-800",
                    ].join(" ")}
                  >
                    {date.getDate()}
                  </span>

                  {/* Harga sameTypePrice */}
                  {price !== null && !isPast ? (
                    <span
                      className={[
                        "mt-0.5 text-[8px] font-medium leading-none",
                        isSelected ? "text-gray-300" : "text-emerald-600",
                      ].join(" ")}
                    >
                      {formatRupiah(price)}
                    </span>
                  ) : (
                    <span className="mt-0.5 text-[8px] leading-none text-transparent select-none">
                      –
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* ── Legend ── */}
          <div className="flex items-center gap-3 px-5 pb-3 pt-1">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-[10px] text-gray-400">Tersedia + harga</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-gray-300" />
              <span className="text-[10px] text-gray-400">Tidak tersedia</span>
            </div>
          </div>

          {/* ── Selected date summary ── */}
          <div
            className={[
              "mx-4 mb-4 rounded-2xl border transition-all duration-200 overflow-hidden",
              selectedDate && selectedEntry
                ? "border-gray-200 bg-gray-50 opacity-100 max-h-40"
                : "border-transparent bg-transparent opacity-0 max-h-0",
            ].join(" ")}
          >
            {selectedDate && selectedEntry && (
              <div className="px-4 py-3 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">
                    Check-in baru
                  </p>
                  <p className="text-sm font-bold text-gray-900 mt-0.5">
                    {selectedDate.getDate()}{" "}
                    {currentMonthData?.label.split(" ")[0]}{" "}
                    {selectedDate.getFullYear()}
                  </p>
                  <p className="text-[10px] text-gray-400 mt-0.5">
                    {data.originalNights} malam
                  </p>
                </div>
                {selectedEntry.sameTypePrice && (
                  <div className="text-right">
                    <p className="text-[10px] text-gray-400">Harga/malam</p>
                    <p className="text-base font-bold text-gray-900">
                      Rp {selectedEntry.sameTypePrice.toLocaleString("id-ID")}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ── CTA ── */}
          <div className="px-4 pb-6">
            <button
              onClick={handleConfirm}
              disabled={!selectedDate}
              className={[
                "w-full py-3.5 rounded-2xl text-sm font-bold tracking-wide transition-all duration-200",
                selectedDate
                  ? "bg-gray-900 text-white hover:bg-gray-800 active:scale-[0.98] shadow-lg shadow-gray-900/20"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed",
              ].join(" ")}
            >
              {selectedDate ? "Lanjut ke Konfirmasi →" : "Pilih tanggal dulu"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}