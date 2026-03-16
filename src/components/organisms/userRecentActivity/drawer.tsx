"use client";

import { AnimatePresence, motion } from "framer-motion";
import { userRecentActivityListState } from "@/src/models/userRecentActivity/list";
import { BookingStatusBadge } from "../../molecules/cards/badgeStatusBookingUserCard";
import { CancelPreviewModal } from "./CancelPreviewModal";
import { useState } from "react";
import { useCancelPreview } from "@/src/hooks/query/recentActivity/cancelPreview";
import { useCancelConfirm } from "@/src/hooks/mutation/userRecentActivity/cancelConfirm";

type BookingStatus = "confirmed" | "checked_in" | "completed" | "cancelled" | "pending";

const STATUS_CONFIG: Record<BookingStatus, { label: string; dot: string; badge: string; text: string }> = {
  pending: { label: "Pending", dot: "bg-amber-400", badge: "bg-amber-50 border-amber-200", text: "text-amber-600" },
  confirmed: { label: "Confirmed", dot: "bg-blue-400", badge: "bg-blue-50 border-blue-200", text: "text-blue-600" },
  checked_in: { label: "Checked In", dot: "bg-emerald-400", badge: "bg-emerald-50 border-emerald-200", text: "text-emerald-600" },
  completed: { label: "Completed", dot: "bg-gray-400", badge: "bg-gray-50 border-gray-200", text: "text-gray-500" },
  cancelled: { label: "Cancelled", dot: "bg-rose-400", badge: "bg-rose-50 border-rose-200", text: "text-rose-500" },
};

export function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

export function formatPrice(price: number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(price);
}

export function getNights(checkIn: string, checkOut: string) {
  return Math.max(1, Math.round((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24)));
}

export function getRoomName(booking: userRecentActivityListState, lang = "eng") {
  return (
    booking.items?.[0]?.roomType?.translations?.find((t) => t.lang === lang)?.name ??
    booking.items?.[0]?.roomType?.translations?.[0]?.name ??
    "—"
  );
}

// export function getStatusCfg(status: string) {
//   return STATUS_CONFIG[status as BookingStatus] ?? STATUS_CONFIG["pending"];
// }

interface RecentActivityDrawerProps {
  booking: userRecentActivityListState | null;
  onClose: () => void;
  onCheckIn: (bookingCode: string) => void;
  onCheckOut: (bookingCode: string) => void;
  isCheckingIn: boolean;
  isCheckingOut: boolean;
}

export function RecentActivityDrawer({
  booking,
  onClose,
  onCheckIn,
  onCheckOut,
  isCheckingIn,
  isCheckingOut,
}: RecentActivityDrawerProps) {
  if (!booking) return null;
  const [cancelBookingCode, setCancelBookingCode] = useState<string | null>(null)
  // const [isConfirming, setIsConfirming] = useState(false)

  const { mutate: cancelConfirm, isPending: isConfirming } = useCancelConfirm()

  const {
    data: cancelPreviewRes,
    isLoading: isLoadingPreview,
  } = useCancelPreview(cancelBookingCode)

  const handleCancelClick = (bookingCode: string) => {
    setCancelBookingCode(bookingCode)
  }

  const handleCancelClose = () => {
    setCancelBookingCode(null)
  }

  const handleCancelConfirm = (previewToken: string) => {
    if (!cancelBookingCode) return
    cancelConfirm(
      { bookingCode: cancelBookingCode, previewToken },
      {
        onSuccess: () => {
          setCancelBookingCode(null)
          onClose() // tutup drawer sekalian
        },
        onError: (err) => {
          alert('Gagal membatalkan booking, silakan coba lagi')
          console.error(err)
        },
      }
    )
  }

  // const cfg = getStatusCfg(booking.status);
  const nights = getNights(booking.checkInDate, booking.checkOutDate);
  const roomName = getRoomName(booking);
  const firstItem = booking.items?.[0];
  const imageUrl = firstItem?.roomType?.image?.url ?? null;

  return (
    <AnimatePresence>
      {booking && (
        <>
          <CancelPreviewModal
            data={cancelPreviewRes?.data ?? null}
            isLoading={isLoadingPreview}
            onClose={handleCancelClose}
            onConfirm={handleCancelConfirm}
            isConfirming={isConfirming}
          />
          <motion.div
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.aside
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-white shadow-2xl flex flex-col"
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 90, damping: 22 }}
          >
            {/* Hero */}
            <div className="relative h-56 overflow-hidden shrink-0 bg-gray-100">
              {imageUrl ? (
                <img src={imageUrl} alt={roomName} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                  <span className="text-5xl opacity-30">🏨</span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <button
                onClick={onClose}
                className="absolute top-4 right-4 h-8 w-8 flex items-center justify-center rounded-full bg-white/20 backdrop-blur text-white hover:bg-white/40 transition text-sm"
              >✕</button>
              <div className="absolute bottom-4 left-5">
                <p className="text-white/70 text-xs tracking-widest uppercase">
                  {booking.site?.nama ?? booking.siteCode} · Room {firstItem?.room?.number ?? "—"}
                </p>
                <h3 className="text-white text-xl font-semibold leading-snug">{roomName}</h3>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">
              {/* Status + code */}
              <div className="flex items-center justify-between">
                <BookingStatusBadge status={booking.status} />
                <span className="text-xs font-mono text-gray-400">{booking.bookingCode}</span>
              </div>

              {/* Guest */}
              <div className="bg-gray-50 rounded-2xl px-5 py-4 space-y-1">
                <p className="text-xs text-gray-400 tracking-widest uppercase mb-2">Guest</p>
                <p className="text-sm font-semibold text-gray-800">{booking.contact?.fullName}</p>
                <p className="text-xs text-gray-500">{booking.contact?.email}</p>
                <p className="text-xs text-gray-500">{booking.contact?.phone}</p>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Check-in", value: formatDate(booking.checkInDate) },
                  { label: "Check-out", value: formatDate(booking.checkOutDate) },
                  { label: "Nights", value: `${nights} night${nights > 1 ? "s" : ""}` },
                  { label: "Rooms", value: `${booking.items?.length ?? 1} room${(booking.items?.length ?? 1) > 1 ? "s" : ""}` },
                ].map((item) => (
                  <div key={item.label} className="bg-gray-50 rounded-xl px-4 py-3">
                    <p className="text-xs text-gray-400 tracking-wide uppercase mb-1">{item.label}</p>
                    <p className="text-sm font-semibold text-gray-800">{item.value}</p>
                  </div>
                ))}
              </div>

              {/* Room items */}
              {booking.items?.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs text-gray-400 tracking-widest uppercase">Room Detail</p>
                  {booking.items.map((item) => {
                    const name =
                      item.roomType?.translations?.find((t) => t.lang === "eng")?.name ??
                      item.roomType?.translations?.[0]?.name ??
                      "Room";
                    return (
                      <div key={item.id} className="flex justify-between items-center py-2 border-b border-dashed border-gray-100 last:border-0">
                        <div>
                          <p className="text-xs font-medium text-gray-700">{name}</p>
                          <p className="text-xs text-gray-400">Room {item.room?.number} · {item.nights}n</p>
                        </div>
                        <p className="text-xs font-semibold text-gray-700">{formatPrice(item.subtotal)}</p>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Payment */}
              {booking.payment && (
                <div className="bg-gray-50 rounded-2xl px-5 py-4 space-y-2">
                  <p className="text-xs text-gray-400 tracking-widest uppercase mb-2">Payment</p>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">Method</span>
                    <span className="font-medium text-gray-700 uppercase">{booking.payment.method}</span>
                  </div>
                  {booking.payment.vaNumber && (
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">VA Number</span>
                      <span className="font-mono font-medium text-gray-700">{booking.payment.vaNumber}</span>
                    </div>
                  )}
                  {booking.payment.vaBank && (
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">Bank</span>
                      <span className="font-medium text-gray-700 uppercase">{booking.payment.vaBank}</span>
                    </div>
                  )}
                  {booking.payment.paidAt && (
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">Paid At</span>
                      <span className="font-medium text-gray-700">{formatDate(booking.payment.paidAt)}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Total */}
              <div className="flex items-center justify-between bg-blue-50 border border-blue-100 rounded-2xl px-5 py-4">
                <div>
                  <p className="text-xs text-blue-400 tracking-widest uppercase">Total Payment</p>
                  <p className="text-xl font-bold text-blue-600 mt-0.5">{formatPrice(booking.totalAmount)}</p>
                </div>
                <div className="text-3xl opacity-20">🏨</div>
              </div>

              {/* Check In */}
              {booking.allowCheckIn !== undefined && (
                <button
                  disabled={!booking.allowCheckIn || isCheckingIn}
                  onClick={() => onCheckIn(booking.bookingCode)}
                  className={`w-full py-3.5 rounded-xl text-sm font-medium tracking-widest uppercase transition-all duration-200
      ${booking.allowCheckIn && !isCheckingIn
                      ? "bg-blue-500 text-white hover:bg-blue-600 shadow-lg shadow-blue-100"
                      : "bg-gray-100 text-gray-300 cursor-not-allowed"
                    }`}
                >
                  {isCheckingIn ? "Processing..." : "Check In"}
                </button>
              )}

              {/* Check Out */}
              {booking.allowCheckOut !== undefined && (
                <button
                  disabled={!booking.allowCheckOut || isCheckingOut}
                  onClick={() => onCheckOut(booking.bookingCode)}
                  className={`w-full py-3.5 rounded-xl text-sm font-medium tracking-widest uppercase transition-all duration-200
      ${booking.allowCheckOut && !isCheckingOut
                      ? "bg-emerald-500 text-white hover:bg-emerald-600 shadow-lg shadow-emerald-100"
                      : "bg-gray-100 text-gray-300 cursor-not-allowed"
                    }`}
                >
                  {isCheckingOut ? "Processing..." : "Check Out"}
                </button>
              )}

              {/* Cancel — hanya tampil kalau allowCancel true, status bukan CANCELLED */}
              {booking.allowCancel && booking.status !== 'CANCELLED' && (
                <button
                  onClick={() => handleCancelClick(booking.bookingCode)}
                  className="w-full py-3.5 rounded-xl text-sm font-medium tracking-widest uppercase transition-all duration-200 border border-red-200 text-red-400 hover:bg-red-50"
                >
                  Cancel Booking
                </button>
              )}

              {/* Refund — hanya tampil kalau status CANCELLED */}
              {booking.status === 'CANCELLED' && (
                <button
                  onClick={() => alert(`Ajukan refund untuk booking ${booking.bookingCode}?`)}
                  className="w-full py-3.5 rounded-xl text-sm font-medium tracking-widest uppercase transition-all duration-200 bg-orange-50 border border-orange-200 text-orange-500 hover:bg-orange-100"
                >
                  Request Refund
                </button>
              )}

              {/* Status logs */}
              {booking.statusLogs?.length > 0 && (
                <div className="space-y-2 pt-2">
                  <p className="text-xs text-gray-400 tracking-widest uppercase">Activity Log</p>
                  <div className="relative pl-4 border-l-2 border-gray-100 space-y-4">
                    {booking.statusLogs.map((log) => (
                      <div key={log.id} className="relative">
                        <span className="absolute -left-[1.15rem] top-1 h-2 w-2 rounded-full bg-blue-300 border-2 border-white" />
                        <p className="text-xs font-medium text-gray-700 capitalize">{log.fromStatus} → {log.toStatus}</p>
                        {log.note && <p className="text-xs text-gray-400 mt-0.5">{log.note}</p>}
                        <p className="text-xs text-gray-300 mt-0.5">{formatDate(log.createdAt)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}