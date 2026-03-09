"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession, signIn } from "next-auth/react";
import { useBookingHistoryList } from "@/src/hooks/query/bookingHistory/list";
import { bookingHistoryListState } from "@/src/models/public/bookingHistory/list";
import { useRouter } from "next/navigation";

// ── Types ──────────────────────────────────────────────────────────────────
type BookingStatus = "confirmed" | "checked_in" | "completed" | "cancelled" | "pending";

// ── Helpers ────────────────────────────────────────────────────────────────
const STATUS_CONFIG: Record<
  BookingStatus,
  { label: string; dot: string; badge: string; text: string }
> = {
  pending: {
    label: "Pending",
    dot: "bg-amber-400",
    badge: "bg-amber-50 border-amber-200",
    text: "text-amber-600",
  },
  confirmed: {
    label: "Confirmed",
    dot: "bg-blue-400",
    badge: "bg-blue-50 border-blue-200",
    text: "text-blue-600",
  },
  checked_in: {
    label: "Checked In",
    dot: "bg-emerald-400",
    badge: "bg-emerald-50 border-emerald-200",
    text: "text-emerald-600",
  },
  completed: {
    label: "Completed",
    dot: "bg-gray-400",
    badge: "bg-gray-50 border-gray-200",
    text: "text-gray-500",
  },
  cancelled: {
    label: "Cancelled",
    dot: "bg-rose-400",
    badge: "bg-rose-50 border-rose-200",
    text: "text-rose-500",
  },
};

const FILTERS: { label: string; value: BookingStatus | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Confirmed", value: "confirmed" },
  { label: "Checked In", value: "checked_in" },
  { label: "Completed", value: "completed" },
  { label: "Cancelled", value: "cancelled" },
];

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(price);
}

function getNights(checkIn: string, checkOut: string) {
  const diff = new Date(checkOut).getTime() - new Date(checkIn).getTime();
  return Math.max(1, Math.round(diff / (1000 * 60 * 60 * 24)));
}

function getRoomName(booking: bookingHistoryListState, lang = "eng") {
  const translation =
    booking.items?.[0]?.roomType?.translations?.find((t) => t.lang === lang) ??
    booking.items?.[0]?.roomType?.translations?.[0];
  return translation?.name ?? "—";
}

function getStatusCfg(status: string) {
  return STATUS_CONFIG[status as BookingStatus] ?? STATUS_CONFIG["pending"];
}

// ── Google Login Gate ──────────────────────────────────────────────────────
function GoogleLoginGate() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center min-h-[70vh] px-4"
    >
      <div className="w-full max-w-sm">
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          {/* Top strip */}
          <div className="relative h-36 bg-gradient-to-br from-blue-400 to-blue-600 overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="absolute rounded-full border border-white"
                  style={{
                    width: `${80 + i * 44}px`,
                    height: `${80 + i * 44}px`,
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                  }}
                />
              ))}
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center">
                <span className="text-3xl">🏨</span>
              </div>
            </div>
          </div>

          <div className="px-8 py-8 flex flex-col items-center text-center gap-5">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-1">Sign in to continue</h2>
              <p className="text-xs text-gray-400 leading-relaxed">
                Login dulu untuk melihat riwayat booking kamu. Email Google kamu akan digunakan sebagai kontak.
              </p>
            </div>

            <button
              onClick={() => signIn("google")}
              className="w-full flex items-center justify-center gap-3 px-5 py-3.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:border-gray-400 hover:shadow-sm transition-all duration-200"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4" />
                <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.859-3.048.859-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853" />
                <path d="M3.964 10.706A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.038l3.007-2.332z" fill="#FBBC05" />
                <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.962L3.964 7.294C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335" />
              </svg>
              Masuk dengan Google
            </button>

            <p className="text-[10px] text-gray-300 leading-relaxed">
              Dengan masuk, kamu menyetujui syarat & ketentuan kami.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ── Empty State ────────────────────────────────────────────────────────────
function EmptyBookingState() {
  const router = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center py-16 px-4 text-center"
    >
      <div className="w-full max-w-xs">
        {/* Stacked card illustration */}
        <div className="relative mx-auto w-40 h-40 mb-8">
          <div className="absolute inset-0 rounded-3xl bg-blue-50 rotate-6" />
          <div className="absolute inset-0 rounded-3xl bg-blue-100 -rotate-3" />
          <div className="absolute inset-0 rounded-3xl bg-white border border-blue-100 shadow-sm flex items-center justify-center">
            <div className="text-center">
              <div className="text-5xl mb-1">🛏️</div>
              <div className="flex gap-1 justify-center">
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-blue-300"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Belum ada riwayat booking
        </h3>
        <p className="text-sm text-gray-400 leading-relaxed mb-8">
          Kamu belum pernah melakukan booking. Yuk mulai cari kamar dan buat pengalaman menginap pertamamu!
        </p>

        <button
          onClick={() => router.push("/")}
          className="w-full py-4 rounded-xl bg-blue-500 text-white text-sm tracking-widest uppercase font-medium hover:bg-blue-600 transition-all duration-300 shadow-lg shadow-blue-100"
        >
          Cari Kamar Sekarang
        </button>

        <p className="text-[10px] text-gray-300 mt-4 tracking-wide">
          Temukan berbagai pilihan kamar terbaik untuk kamu
        </p>
      </div>
    </motion.div>
  );
}

// ── Skeletons ──────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="flex rounded-2xl border border-gray-100 bg-white overflow-hidden animate-pulse">
      <div className="w-36 h-24 bg-gray-100 shrink-0" />
      <div className="flex-1 px-5 py-4 space-y-3">
        <div className="h-3 bg-gray-100 rounded w-1/3" />
        <div className="h-4 bg-gray-100 rounded w-2/3" />
        <div className="h-3 bg-gray-100 rounded w-1/2" />
      </div>
    </div>
  );
}

function AuthSkeleton() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh]">
      <div className="w-full max-w-sm space-y-4 animate-pulse">
        <div className="h-36 bg-gray-100 rounded-3xl" />
        <div className="h-4 bg-gray-100 rounded w-1/2 mx-auto" />
        <div className="h-12 bg-gray-100 rounded-xl" />
      </div>
    </div>
  );
}

// ── Detail Drawer ──────────────────────────────────────────────────────────
function BookingDrawer({
  booking,
  onClose,
}: {
  booking: bookingHistoryListState | null;
  onClose: () => void;
}) {
  if (!booking) return null;
  const cfg = getStatusCfg(booking.status);
  const nights = getNights(booking.checkInDate, booking.checkOutDate);
  const roomName = getRoomName(booking);
  const firstItem = booking.items?.[0];
  const imageId = firstItem?.roomType?.imageId;

  return (
    <AnimatePresence>
      {booking && (
        <>
          <motion.div
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.aside
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-white shadow-2xl flex flex-col"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 90, damping: 22 }}
          >
            <div className="relative h-56 overflow-hidden shrink-0 bg-gray-100">
              {imageId ? (
                <img src={`/api/images/${imageId}`} alt={roomName} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                  <span className="text-5xl opacity-30">🏨</span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <button
                onClick={onClose}
                className="absolute top-4 right-4 h-8 w-8 flex items-center justify-center rounded-full bg-white/20 backdrop-blur text-white hover:bg-white/40 transition text-sm"
              >
                ✕
              </button>
              <div className="absolute bottom-4 left-5">
                <p className="text-white/70 text-xs tracking-widest uppercase">
                  {booking.site?.nama ?? booking.siteCode} · Room {firstItem?.room?.number ?? "—"}
                </p>
                <h3 className="text-white text-xl font-semibold leading-snug">{roomName}</h3>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">
              <div className="flex items-center justify-between">
                <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium ${cfg.badge} ${cfg.text}`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
                  {cfg.label}
                </div>
                <span className="text-xs font-mono text-gray-400">{booking.bookingCode}</span>
              </div>

              <div className="bg-gray-50 rounded-2xl px-5 py-4 space-y-1">
                <p className="text-xs text-gray-400 tracking-widest uppercase mb-2">Guest</p>
                <p className="text-sm font-semibold text-gray-800">{booking.contact?.fullName}</p>
                <p className="text-xs text-gray-500">{booking.contact?.email}</p>
                <p className="text-xs text-gray-500">{booking.contact?.phone}</p>
              </div>

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

              {booking.items?.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs text-gray-400 tracking-widest uppercase">Room Detail</p>
                  {booking.items.map((item) => {
                    const name =
                      item.roomType?.translations?.find((t) => t.lang === "eng")?.name ??
                      item.roomType?.translations?.[0]?.name ?? "Room";
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

              <div className="flex items-center justify-between bg-blue-50 border border-blue-100 rounded-2xl px-5 py-4">
                <div>
                  <p className="text-xs text-blue-400 tracking-widest uppercase">Total Payment</p>
                  <p className="text-xl font-bold text-blue-600 mt-0.5">{formatPrice(booking.totalAmount)}</p>
                </div>
                <div className="text-3xl opacity-20">🏨</div>
              </div>

              {booking.status === "confirmed" && (
                <button className="w-full py-3.5 rounded-xl bg-rose-500 text-white text-sm tracking-widest uppercase font-medium hover:bg-rose-600 transition-all shadow-lg shadow-rose-100">
                  Cancel Booking
                </button>
              )}
              {booking.status === "completed" && (
                <button className="w-full py-3.5 rounded-xl border border-blue-200 text-blue-500 text-sm tracking-widest uppercase font-medium hover:bg-blue-50 transition-all">
                  Book Again
                </button>
              )}

              {booking.statusLogs?.length > 0 && (
                <div className="space-y-2 pt-2">
                  <p className="text-xs text-gray-400 tracking-widest uppercase">Activity Log</p>
                  <div className="relative pl-4 border-l-2 border-gray-100 space-y-4">
                    {booking.statusLogs.map((log) => (
                      <div key={log.id} className="relative">
                        <span className="absolute -left-[1.15rem] top-1 h-2 w-2 rounded-full bg-blue-300 border-2 border-white" />
                        <p className="text-xs font-medium text-gray-700 capitalize">
                          {log.fromStatus} → {log.toStatus}
                        </p>
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

// ── Booking Card ───────────────────────────────────────────────────────────
function BookingCard({
  booking,
  index,
  onClick,
}: {
  booking: bookingHistoryListState;
  index: number;
  onClick: () => void;
}) {
  const cfg = getStatusCfg(booking.status);
  const nights = getNights(booking.checkInDate, booking.checkOutDate);
  const roomName = getRoomName(booking);
  const imageId = booking.items?.[0]?.roomType?.imageId;

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ delay: index * 0.07, duration: 0.4, ease: "easeOut" }}
      onClick={onClick}
      className="group flex rounded-2xl border border-gray-100 bg-white overflow-hidden cursor-pointer hover:shadow-xl hover:shadow-blue-50 hover:-translate-y-0.5 transition-all duration-300"
    >
      <div className="relative w-36 h-24 shrink-0 overflow-hidden bg-gray-100">
        {imageId ? (
          <img
            src={`/api/images/${imageId}`}
            alt={roomName}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
            <span className="text-2xl opacity-30">🏨</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/10" />
      </div>

      <div className="flex-1 px-5 py-4 flex flex-col justify-between min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-xs text-gray-400 tracking-widest uppercase truncate">
              {booking.site?.nama ?? booking.siteCode} · {booking.bookingCode}
            </p>
            <h3 className="text-sm font-semibold text-gray-900 truncate mt-0.5">{roomName}</h3>
          </div>
          <span className={`shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium ${cfg.badge} ${cfg.text}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
            {cfg.label}
          </span>
        </div>

        <div className="flex items-end justify-between mt-3">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span>{formatDate(booking.checkInDate)}</span>
            <span className="text-gray-300">→</span>
            <span>{formatDate(booking.checkOutDate)}</span>
            <span className="text-gray-300">·</span>
            <span className="text-gray-400">{nights}n</span>
          </div>
          <p className="text-sm font-bold text-blue-600 shrink-0">{formatPrice(booking.totalAmount)}</p>
        </div>
      </div>

      <div className="flex items-center pr-4 text-gray-200 group-hover:text-blue-400 transition-colors text-lg shrink-0">
        →
      </div>
    </motion.article>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────
export default function BookingHistoryPage() {
  const { data: session, status: authStatus } = useSession();
  const { data, isLoading, error, refetch } = useBookingHistoryList();

  const [activeFilter, setActiveFilter] = useState<BookingStatus | "all">("all");
  const [selected, setSelected] = useState<bookingHistoryListState | null>(null);

  // ── Auth loading ──
  if (authStatus === "loading") return <AuthSkeleton />;

  // ── Not logged in ──
  if (authStatus === "unauthenticated" || !session) return <GoogleLoginGate />;

  const bookings = data?.data?.bookings ?? [];
  const filtered =
    activeFilter === "all"
      ? bookings
      : bookings.filter((b) => b.status === activeFilter);

  const total = bookings.length;
  const completed = bookings.filter((b) => b.status === "completed").length;
  const totalSpent = bookings
    .filter((b) => b.status !== "cancelled")
    .reduce((sum, b) => sum + b.totalAmount, 0);

  return (
    <div className="min-h-screen bg-gray-50/60">
      <div className="max-w-2xl mx-auto px-4 py-10">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          {/* User info */}
          <div className="flex items-center gap-3 mb-5">
            {session.user?.image && (
              <img
                src={session.user.image}
                alt="avatar"
                className="w-9 h-9 rounded-full border-2 border-white shadow-sm"
              />
            )}
            <div>
              <p className="text-xs text-gray-400">Welcome back,</p>
              <p className="text-sm font-semibold text-gray-800 leading-tight">
                {session.user?.name ?? session.user?.email}
              </p>
            </div>
          </div>

          <p className="text-xs tracking-widest uppercase text-blue-400 mb-1">My Account</p>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Booking History</h1>
          <p className="text-sm text-gray-400 mt-1">All your stays in one place</p>
        </motion.div>

        {/* Stats Strip */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.45 }}
          className="grid grid-cols-3 gap-3 mb-8"
        >
          {[
            { label: "Total Bookings", value: isLoading ? "—" : total },
            { label: "Stays Completed", value: isLoading ? "—" : completed },
            { label: "Total Spent", value: isLoading ? "—" : formatPrice(totalSpent) },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-2xl border border-gray-100 px-4 py-4 text-center">
              <p className="text-lg font-bold text-gray-900">{s.value}</p>
              <p className="text-xs text-gray-400 mt-0.5 leading-tight">{s.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Filter Tabs */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="flex gap-2 overflow-x-auto pb-1 mb-6 scrollbar-hide"
        >
          {FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setActiveFilter(f.value)}
              className={`shrink-0 px-4 py-1.5 rounded-full text-xs font-medium border transition-all duration-200
                ${activeFilter === f.value
                  ? "bg-blue-500 text-white border-blue-500 shadow-md shadow-blue-100"
                  : "bg-white text-gray-500 border-gray-200 hover:border-blue-300 hover:text-blue-500"
                }`}
            >
              {f.label}
            </button>
          ))}
        </motion.div>

        {/* List area */}
        <div className="flex flex-col gap-3">

          {/* Loading skeleton */}
          {isLoading && (
            <div className="flex flex-col gap-3">
              {[...Array(3)].map((_, i) => <SkeletonCard key={i} />)}
            </div>
          )}

          {/* Error */}
          {error && !isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-20 text-center"
            >
              <div className="text-4xl mb-4 opacity-30">⚠️</div>
              <p className="text-sm font-medium text-gray-400">Failed to load bookings</p>
              <button
                onClick={() => refetch()}
                className="mt-4 px-5 py-2 rounded-xl border border-blue-200 text-blue-500 text-xs hover:bg-blue-50 transition"
              >
                Try Again
              </button>
            </motion.div>
          )}

          {/* Empty — no bookings at all */}
          {!isLoading && !error && bookings.length === 0 && (
            <EmptyBookingState />
          )}

          {/* Empty — filter has no match but bookings exist */}
          {!isLoading && !error && bookings.length > 0 && filtered.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-16 text-center"
            >
              <div className="text-4xl mb-3 opacity-30">🔍</div>
              <p className="text-sm font-medium text-gray-400">No bookings with this status</p>
              <button
                onClick={() => setActiveFilter("all")}
                className="mt-4 px-5 py-2 rounded-xl border border-gray-200 text-gray-500 text-xs hover:border-blue-300 hover:text-blue-500 transition"
              >
                Show All
              </button>
            </motion.div>
          )}

          {/* Cards */}
          <AnimatePresence mode="popLayout">
            {!isLoading && !error &&
              filtered.map((booking, i) => (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  index={i}
                  onClick={() => setSelected(booking)}
                />
              ))}
          </AnimatePresence>
        </div>
      </div>

      <BookingDrawer booking={selected} onClose={() => setSelected(null)} />
    </div>
  );
}