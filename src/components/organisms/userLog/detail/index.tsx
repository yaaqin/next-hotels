"use client";
import { Booking, CreditWallet, detailUserLogProps, Refund, StatusJourney } from "@/src/models/userLogs/detail";
import { useState } from "react";

// ─── Helpers ────────────────────────────────────────────────────────────────

function formatRupiah(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
}

function formatDate(dateStr: string) {
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatDateTime(dateStr: string) {
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ─── Status Badge ────────────────────────────────────────────────────────────

const statusConfig: Record<string, { bg: string; text: string; dot: string }> =
  {
    CHECKED_OUT: {
      bg: "bg-slate-100",
      text: "text-slate-600",
      dot: "bg-slate-400",
    },
    CONFIRMED: {
      bg: "bg-emerald-50",
      text: "text-emerald-700",
      dot: "bg-emerald-500",
    },
    CANCELLED: { bg: "bg-red-50", text: "text-red-600", dot: "bg-red-400" },
    PENDING: {
      bg: "bg-amber-50",
      text: "text-amber-700",
      dot: "bg-amber-400",
    },
    CHECKED_IN: {
      bg: "bg-blue-50",
      text: "text-blue-700",
      dot: "bg-blue-400",
    },
    SUCCESS: {
      bg: "bg-emerald-50",
      text: "text-emerald-700",
      dot: "bg-emerald-500",
    },
    FAILED: { bg: "bg-red-50", text: "text-red-600", dot: "bg-red-400" },
    ACTIVE: {
      bg: "bg-emerald-50",
      text: "text-emerald-700",
      dot: "bg-emerald-500",
    },
    EXPIRED: { bg: "bg-slate-100", text: "text-slate-500", dot: "bg-slate-300" },
  };

function StatusBadge({ status }: { status: string }) {
  const cfg = statusConfig[status] ?? {
    bg: "bg-slate-100",
    text: "text-slate-600",
    dot: "bg-slate-300",
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide ${cfg.bg} ${cfg.text}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {status}
    </span>
  );
}

// ─── Status Journey Timeline ──────────────────────────────────────────────────

function StatusJourneyTimeline({ journey }: { journey: StatusJourney[] }) {
  return (
    <div className="mt-4">
      <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-3">
        Status Journey
      </p>
      <div className="relative pl-5 space-y-4">
        {/* vertical line */}
        <div className="absolute left-[7px] top-1 bottom-1 w-px bg-slate-200" />
        {journey.map((j, i) => (
          <div key={i} className="relative">
            {/* dot */}
            <div
              className={`absolute -left-5 top-1 w-3 h-3 rounded-full border-2 border-white ring-1 ${
                i === 0
                  ? "ring-blue-400 bg-blue-400"
                  : i === journey.length - 1
                  ? "ring-slate-300 bg-slate-300"
                  : "ring-emerald-400 bg-emerald-400"
              }`}
            />
            <p className="text-[11px] text-slate-400">
              {formatDateTime(j.createdAt)}
            </p>
            <p className="text-sm font-bold text-slate-700 mt-0.5">
              {j.fromStatus ? `${j.fromStatus} → ${j.toStatus}` : j.toStatus}
            </p>
            {j.note && (
              <p className="text-xs text-slate-500 mt-0.5">{j.note}</p>
            )}
            {j.actorUsername && (
              <p className="text-[11px] text-slate-400 mt-0.5">
                Processed by:{" "}
                <span className="font-medium text-slate-500">
                  {j.actorUsername}
                </span>
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Booking Card ─────────────────────────────────────────────────────────────

function BookingCard({ booking }: { booking: Booking }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
      {/* Header */}
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center justify-between px-5 py-4 text-left"
      >
        <div className="flex items-center gap-3">
          <span className="font-mono text-sm font-bold text-slate-700">
            {booking.bookingCode}
          </span>
          <span className="text-sm text-slate-500">{booking.siteName}</span>
        </div>
        <div className="flex items-center gap-3">
          <StatusBadge status={booking.status} />
          <svg
            className={`w-4 h-4 text-slate-400 transition-transform ${
              expanded ? "rotate-180" : ""
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </button>

      {/* Summary row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 px-5 pb-4 border-t border-slate-100 pt-3">
        <div>
          <p className="text-[10px] font-semibold tracking-widest text-slate-400 uppercase">
            Check-in
          </p>
          <p className="text-sm font-semibold text-slate-700 mt-0.5">
            {formatDate(booking.checkInDate)}
          </p>
        </div>
        <div>
          <p className="text-[10px] font-semibold tracking-widest text-slate-400 uppercase">
            Check-out
          </p>
          <p className="text-sm font-semibold text-slate-700 mt-0.5">
            {formatDate(booking.checkOutDate)}
          </p>
        </div>
        <div>
          <p className="text-[10px] font-semibold tracking-widest text-slate-400 uppercase">
            Total
          </p>
          <p className="text-sm font-semibold text-slate-700 mt-0.5">
            {formatRupiah(booking.totalAmount)}
          </p>
        </div>
        <div>
          <p className="text-[10px] font-semibold tracking-widest text-slate-400 uppercase">
            Payment
          </p>
          <p className="text-sm font-semibold text-slate-700 mt-0.5">
            {booking.payment?.method ?? "-"}{" "}
            {booking.payment?.status && (
              <span
                className={
                  booking.payment.status === "SUCCESS"
                    ? "text-emerald-600"
                    : "text-red-500"
                }
              >
                · {booking.payment.status}
              </span>
            )}
          </p>
        </div>
      </div>

      {/* Expanded detail */}
      {expanded && (
        <div className="border-t border-slate-100 px-5 pb-5">
          {/* Items */}
          {booking.items.length > 0 && (
            <div className="mt-4">
              <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-2">
                Room Items
              </p>
              <div className="rounded-lg overflow-hidden border border-slate-100">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="text-left px-3 py-2 text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                        Room
                      </th>
                      <th className="text-left px-3 py-2 text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                        No.
                      </th>
                      <th className="text-right px-3 py-2 text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                        /Malam
                      </th>
                      <th className="text-right px-3 py-2 text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                        Malam
                      </th>
                      <th className="text-right px-3 py-2 text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                        Subtotal
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {booking.items.map((item) => (
                      <tr key={item.id} className="bg-white">
                        <td className="px-3 py-2 text-slate-700 font-medium">
                          {item.roomTypeName}
                        </td>
                        <td className="px-3 py-2 text-slate-500">
                          {item.roomNumber}
                        </td>
                        <td className="px-3 py-2 text-slate-600 text-right">
                          {formatRupiah(item.pricePerNight)}
                        </td>
                        <td className="px-3 py-2 text-slate-600 text-right">
                          {item.nights}
                        </td>
                        <td className="px-3 py-2 font-semibold text-slate-700 text-right">
                          {formatRupiah(item.subtotal)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <StatusJourneyTimeline journey={booking.statusJourney} />
        </div>
      )}
    </div>
  );
}

// ─── Refund Card ──────────────────────────────────────────────────────────────

function RefundCard({ refund }: { refund: Refund }) {
  return (
    <div className="border border-slate-200 rounded-xl bg-white shadow-sm p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <span className="font-mono text-sm font-bold text-slate-700">
            {refund.bookingCode}
          </span>
          <span className="ml-2 text-xs text-slate-500">
            {refund.policyName}
          </span>
        </div>
        <StatusBadge status={refund.status} />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div>
          <p className="text-[10px] font-semibold tracking-widest text-slate-400 uppercase">
            Original
          </p>
          <p className="text-sm font-semibold text-slate-700 mt-0.5">
            {formatRupiah(refund.originalAmount)}
          </p>
        </div>
        <div>
          <p className="text-[10px] font-semibold tracking-widest text-slate-400 uppercase">
            Refund ({refund.refundPercent}%)
          </p>
          <p className="text-sm font-semibold text-emerald-600 mt-0.5">
            {formatRupiah(refund.refundAmount)}
          </p>
        </div>
        <div>
          <p className="text-[10px] font-semibold tracking-widest text-slate-400 uppercase">
            Penalty
          </p>
          <p className="text-sm font-semibold text-red-500 mt-0.5">
            {formatRupiah(refund.penaltyAmount)}
          </p>
        </div>
        <div>
          <p className="text-[10px] font-semibold tracking-widest text-slate-400 uppercase">
            Type
          </p>
          <p className="text-sm text-slate-600 mt-0.5">{refund.refundType}</p>
        </div>
        <div>
          <p className="text-[10px] font-semibold tracking-widest text-slate-400 uppercase">
            Requested
          </p>
          <p className="text-sm text-slate-600 mt-0.5">
            {formatDate(refund.requestedAt)}
          </p>
        </div>
        {refund.processedAt && (
          <div>
            <p className="text-[10px] font-semibold tracking-widest text-slate-400 uppercase">
              Processed By
            </p>
            <p className="text-sm text-slate-600 mt-0.5">
              {refund.processedBy}
            </p>
          </div>
        )}
      </div>

      {refund.reason && (
        <div className="bg-slate-50 rounded-lg px-4 py-3">
          <p className="text-[10px] font-semibold tracking-widest text-slate-400 uppercase mb-1">
            Reason
          </p>
          <p className="text-sm text-slate-600">{refund.reason}</p>
        </div>
      )}
      {refund.note && (
        <div className="bg-amber-50 rounded-lg px-4 py-3">
          <p className="text-[10px] font-semibold tracking-widest text-amber-400 uppercase mb-1">
            Note
          </p>
          <p className="text-sm text-amber-700">{refund.note}</p>
        </div>
      )}
    </div>
  );
}

// ─── Credit Wallet Tab ────────────────────────────────────────────────────────

function CreditWalletTab({ wallet }: { wallet: CreditWallet }) {
  return (
    <div className="space-y-4">
      {/* Wallet summary */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-5">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <p className="text-[10px] font-semibold tracking-widest text-blue-400 uppercase">
              Kode
            </p>
            <p className="text-sm font-bold text-blue-800 mt-0.5 font-mono">
              {wallet.code}
            </p>
          </div>
          <div>
            <p className="text-[10px] font-semibold tracking-widest text-blue-400 uppercase">
              Balance
            </p>
            <p className="text-sm font-bold text-blue-800 mt-0.5">
              {formatRupiah(wallet.balance)}
            </p>
          </div>
          <div>
            <p className="text-[10px] font-semibold tracking-widest text-blue-400 uppercase">
              Status
            </p>
            <div className="mt-0.5">
              <StatusBadge status={wallet.status} />
            </div>
          </div>
          <div>
            <p className="text-[10px] font-semibold tracking-widest text-blue-400 uppercase">
              Expired At
            </p>
            <p className="text-sm font-bold text-blue-800 mt-0.5">
              {formatDate(wallet.expiredAt)}
            </p>
          </div>
        </div>
      </div>

      {/* Logs */}
      <div>
        <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-3">
          Transaction Logs
        </p>
        <div className="space-y-2">
          {wallet.logs.map((log) => (
            <div
              key={log.id}
              className="flex items-center justify-between bg-white border border-slate-200 rounded-xl px-4 py-3"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    log.type === "CREDIT" || log.amount > 0
                      ? "bg-emerald-50 text-emerald-600"
                      : "bg-red-50 text-red-500"
                  }`}
                >
                  {log.amount > 0 ? "+" : "−"}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-700">
                    {log.note || log.sourceType}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    {formatDateTime(log.createdAt)} · {log.sourceType}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p
                  className={`text-sm font-bold ${
                    log.amount > 0 ? "text-emerald-600" : "text-red-500"
                  }`}
                >
                  {log.amount > 0 ? "+" : ""}
                  {formatRupiah(log.amount)}
                </p>
                <p className="text-[11px] text-slate-400">
                  Saldo: {formatRupiah(log.balanceAfter)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

type Tab = "bookings" | "refunds" | "credits";

export default function UserDetailLog({ data }: detailUserLogProps) {
  const [activeTab, setActiveTab] = useState<Tab>("bookings");
  const user = data;

  const tabs: { id: Tab; label: string; count?: number }[] = [
    { id: "bookings", label: "Bookings", count: user.bookings.length },
    { id: "refunds", label: "Refunds", count: user.refunds.length },
    { id: "credits", label: "Credits" },
  ];

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 font-sans">
      <div className="w-full mx-auto space-y-4">
        {/* ── User Profile Card ── */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-start gap-4">
            {/* Avatar */}
            <div className="w-12 h-12 rounded-full bg-slate-800 text-white flex items-center justify-center text-lg font-bold flex-shrink-0 overflow-hidden">
              {user.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                initials
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base font-bold text-slate-800">
                  {user.name}
                </h2>
                <StatusBadge status={user.isActive ? "ACTIVE" : "INACTIVE"} />
              </div>
              <p className="text-sm text-slate-500 mt-0.5">
                {user.email}
                {user.phone ? ` · ${user.phone}` : ""}
              </p>
            </div>

            {/* Stats */}
            <div className="text-right flex-shrink-0">
              <p className="text-sm text-slate-600">
                <span className="font-semibold text-slate-800">
                  {user.bookings.length}
                </span>{" "}
                bookings
              </p>
              <p className="text-sm text-slate-600">
                <span className="font-semibold text-slate-800">
                  {user.refunds.length}
                </span>{" "}
                refund
              </p>
            </div>
          </div>
        </div>

        {/* ── Tabs ── */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          {/* Tab headers */}
          <div className="flex border-b border-slate-200">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-3.5 text-sm font-semibold transition-colors relative ${
                  activeTab === tab.id
                    ? "text-slate-800"
                    : "text-slate-400 hover:text-slate-600"
                }`}
              >
                {tab.label}
                {tab.count !== undefined && (
                  <span
                    className={`text-[11px] px-1.5 py-0.5 rounded-full font-bold ${
                      activeTab === tab.id
                        ? "bg-slate-800 text-white"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-800 rounded-t-full" />
                )}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="p-4 sm:p-5">
            {/* Bookings */}
            {activeTab === "bookings" && (
              <div className="space-y-3">
                {user.bookings.length === 0 ? (
                  <p className="text-center text-slate-400 py-10 text-sm">
                    Tidak ada booking
                  </p>
                ) : (
                  <>
                    <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-3">
                      {user.bookings.length} Total Bookings
                    </p>
                    {user.bookings.map((b) => (
                      <BookingCard key={b.id} booking={b} />
                    ))}
                  </>
                )}
              </div>
            )}

            {/* Refunds */}
            {activeTab === "refunds" && (
              <div className="space-y-3">
                {user.refunds.length === 0 ? (
                  <p className="text-center text-slate-400 py-10 text-sm">
                    Tidak ada refund
                  </p>
                ) : (
                  user.refunds.map((r) => <RefundCard key={r.id} refund={r} />)
                )}
              </div>
            )}

            {/* Credits */}
            {activeTab === "credits" && (
              <CreditWalletTab wallet={user.creditWallet} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}