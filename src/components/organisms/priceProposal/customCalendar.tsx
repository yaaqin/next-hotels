import { detailPriceProposalState } from "@/src/models/priceProposal/detail";
import { useState, useRef, useEffect } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────

interface Rule {
  id: string;
  ruleType: "SPECIFIC_DATE" | "DATE_RANGE" | "WEEKEND";
  date?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  adjustment: string;
  value: number;
  priority: number;
}

interface RoomType {
  id: string;
  name: string;
  desk: string;
}

interface Item {
  id: string;
  roomType: RoomType;
  basePrice: number;
  rules: Rule[];
}

interface ProposalData {
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  status: string;
  items: Item[];
}

interface PriceCalendarProps {
  data: detailPriceProposalState;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const MONTHS_ID = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];
const DAYS_ID = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

function formatRupiah(val: number): string {
  return "Rp " + val.toLocaleString("id-ID");
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function getEffectivePrice(item: Item, date: Date): number {
  const dayOfWeek = date.getDay();
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
  let best: Rule | null = null;

  for (const rule of item.rules) {
    if (rule.ruleType === "SPECIFIC_DATE" && rule.date) {
      if (isSameDay(new Date(rule.date), date)) {
        if (!best || rule.priority > best.priority) best = rule;
      }
    } else if (rule.ruleType === "DATE_RANGE" && rule.startDate && rule.endDate) {
      const s = new Date(rule.startDate); s.setHours(0, 0, 0, 0);
      const e = new Date(rule.endDate); e.setHours(23, 59, 59, 999);
      if (date >= s && date <= e) {
        if (!best || rule.priority > best.priority) best = rule;
      }
    } else if (rule.ruleType === "WEEKEND" && isWeekend) {
      if (!best || rule.priority > best.priority) best = rule;
    }
  }

  return best ? best.value : item.basePrice;
}

type CellTag = "specific" | "range" | "weekend" | null;

function getCellTag(date: Date, items: Item[]): CellTag {
  const dayOfWeek = date.getDay();
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

  for (const item of items) {
    for (const rule of item.rules) {
      if (rule.ruleType === "SPECIFIC_DATE" && rule.date) {
        if (isSameDay(new Date(rule.date), date)) return "specific";
      }
    }
  }
  for (const item of items) {
    for (const rule of item.rules) {
      if (rule.ruleType === "DATE_RANGE" && rule.startDate && rule.endDate) {
        const s = new Date(rule.startDate); s.setHours(0, 0, 0, 0);
        const e = new Date(rule.endDate); e.setHours(23, 59, 59, 999);
        if (date >= s && date <= e) return "range";
      }
    }
  }
  if (isWeekend) return "weekend";
  return null;
}

function isInProposalRange(date: Date, start: Date, end: Date): boolean {
  const d = new Date(date); d.setHours(12, 0, 0, 0);
  const s = new Date(start); s.setHours(0, 0, 0, 0);
  const e = new Date(end); e.setHours(23, 59, 59, 999);
  return d >= s && d <= e;
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function PriceCalendar({ data }: PriceCalendarProps) {
  const proposalStart = new Date(data.startDate);
  const proposalEnd = new Date(data.endDate);

  const [currentYear, setCurrentYear] = useState(proposalStart.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(proposalStart.getMonth());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [popupAnchor, setPopupAnchor] = useState<{ top: number; left: number } | null>(null);
  const calendarRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  // Navigate prev/next month (clamp to proposal range)
  const canGoPrev = new Date(currentYear, currentMonth, 1) > new Date(proposalStart.getFullYear(), proposalStart.getMonth(), 1);
  const canGoNext = new Date(currentYear, currentMonth, 1) < new Date(proposalEnd.getFullYear(), proposalEnd.getMonth(), 1);

  const goPrev = () => {
    if (!canGoPrev) return;
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(y => y - 1); }
    else setCurrentMonth(m => m - 1);
    setSelectedDate(null);
  };
  const goNext = () => {
    if (!canGoNext) return;
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(y => y + 1); }
    else setCurrentMonth(m => m + 1);
    setSelectedDate(null);
  };

  // Build calendar grid
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const cells: (Date | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => new Date(currentYear, currentMonth, i + 1)),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  // Close popup on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        popupRef.current && !popupRef.current.contains(e.target as Node) &&
        calendarRef.current && !calendarRef.current.contains(e.target as Node)
      ) {
        setSelectedDate(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleDayClick = (date: Date, e: React.MouseEvent<HTMLButtonElement>) => {
    if (!isInProposalRange(date, proposalStart, proposalEnd)) return;
    if (selectedDate && isSameDay(selectedDate, date)) {
      setSelectedDate(null);
      return;
    }
    setSelectedDate(date);
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const calRect = calendarRef.current!.getBoundingClientRect();
    setPopupAnchor({
      top: rect.bottom - calRect.top + 8,
      left: rect.left - calRect.left + rect.width / 2,
    });
  };

  const tagStyle: Record<NonNullable<CellTag>, string> = {
    specific: "bg-rose-100 text-rose-700 border border-rose-300",
    range: "bg-amber-100 text-amber-700 border border-amber-200",
    weekend: "bg-sky-100 text-sky-700 border border-sky-200",
  };

  const tagDot: Record<NonNullable<CellTag>, string> = {
    specific: "bg-rose-400",
    range: "bg-amber-400",
    weekend: "bg-sky-400",
  };

  return (
    <div className="w-full max-w-md mx-auto select-none font-sans">
      {/* Header info */}
      <div className="mb-4 px-1">
        <h2 className="text-base font-semibold text-gray-800">{data.title}</h2>
        {data.description && (
          <p className="text-xs text-gray-400 mt-0.5">{data.description}</p>
        )}
      </div>

      {/* Calendar card */}
      <div ref={calendarRef} className="relative bg-white rounded-2xl border border-gray-200 shadow-sm p-4">
        {/* Month nav */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={goPrev}
            disabled={!canGoPrev}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition disabled:opacity-30 disabled:cursor-not-allowed text-gray-500"
          >
            ‹
          </button>
          <span className="text-sm font-semibold text-gray-700 tracking-wide">
            {MONTHS_ID[currentMonth]} {currentYear}
          </span>
          <button
            onClick={goNext}
            disabled={!canGoNext}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition disabled:opacity-30 disabled:cursor-not-allowed text-gray-500"
          >
            ›
          </button>
        </div>

        {/* Day headers */}
        <div className="grid grid-cols-7 mb-1">
          {DAYS_ID.map((d) => (
            <div key={d} className="text-center text-[10px] font-medium text-gray-400 py-1">
              {d}
            </div>
          ))}
        </div>

        {/* Day cells */}
        <div className="grid grid-cols-7 gap-y-1">
          {cells.map((date, idx) => {
            if (!date) return <div key={`empty-${idx}`} />;

            const inRange = isInProposalRange(date, proposalStart, proposalEnd);
            const tag = inRange ? getCellTag(date, data.items) : null;
            const isSelected = selectedDate ? isSameDay(selectedDate, date) : false;
            const isToday = isSameDay(date, new Date());

            return (
              <button
                key={idx}
                onClick={(e) => handleDayClick(date, e)}
                disabled={!inRange}
                className={[
                  "relative flex flex-col items-center justify-center rounded-xl py-1.5 text-xs font-medium transition-all",
                  inRange ? "cursor-pointer" : "opacity-25 cursor-default",
                  isSelected
                    ? "bg-gray-800 text-white shadow-md scale-105"
                    : tag
                    ? tagStyle[tag]
                    : isToday
                    ? "ring-1 ring-gray-300 text-gray-700"
                    : "text-gray-600 hover:bg-gray-50",
                ].join(" ")}
              >
                <span>{date.getDate()}</span>
                {tag && !isSelected && (
                  <span className={`mt-0.5 w-1 h-1 rounded-full ${tagDot[tag]}`} />
                )}
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex gap-3 mt-4 pt-3 border-t border-gray-100">
          {(["specific", "range", "weekend"] as CellTag[]).map((t) => (
            <div key={t!} className="flex items-center gap-1">
              <span className={`w-2 h-2 rounded-full ${tagDot[t!]}`} />
              <span className="text-[10px] text-gray-400 capitalize">
                {t === "specific" ? "Tgl Khusus" : t === "range" ? "Rentang" : "Weekend"}
              </span>
            </div>
          ))}
        </div>

        {/* Popup */}
        {selectedDate && popupAnchor && (
          <div
            ref={popupRef}
            style={{
              position: "absolute",
              top: popupAnchor.top,
              left: Math.min(Math.max(popupAnchor.left - 140, 0), 280),
              width: 280,
              zIndex: 50,
            }}
            className="bg-white rounded-2xl border border-gray-200 shadow-xl p-4 animate-in fade-in slide-in-from-top-2 duration-150"
          >
            {/* Arrow indicator */}
            <div
              style={{
                position: "absolute",
                top: -6,
                left: Math.min(Math.max(popupAnchor.left - Math.min(Math.max(popupAnchor.left - 140, 0), 280) - 6, 12), 256),
                width: 12,
                height: 12,
              }}
              className="bg-white border-l border-t border-gray-200 rotate-45"
            />

            <p className="text-xs font-semibold text-gray-500 mb-3">
              {selectedDate.getDate()} {MONTHS_ID[selectedDate.getMonth()]} {selectedDate.getFullYear()}
            </p>

            <div className="space-y-2">
              {data.items.map((item) => {
                const price = getEffectivePrice(item, selectedDate);
                const isSpecial = price !== item.basePrice;
                return (
                  <div
                    key={item.id}
                    className="flex items-center justify-between py-2 px-3 rounded-xl bg-gray-50"
                  >
                    <div>
                      <p className="text-xs font-semibold text-gray-700">{item.roomType.name}</p>
                      <p className="text-[10px] text-gray-400">{item.roomType.desk}</p>
                    </div>
                    <div className="text-right">
                      <p className={`text-xs font-bold ${isSpecial ? "text-rose-600" : "text-gray-800"}`}>
                        {formatRupiah(price)}
                      </p>
                      {isSpecial && (
                        <p className="text-[10px] text-gray-400 line-through">
                          {formatRupiah(item.basePrice)}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}