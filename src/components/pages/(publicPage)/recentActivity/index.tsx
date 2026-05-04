"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { userRecentActivityListState } from "@/src/models/userRecentActivity/list";
import { useRecentActivity } from "@/src/hooks/query/recentActivity/list";
import { useCheckIn } from "@/src/hooks/mutation/userRecentActivity/checkIn";
import { RecentActivityDrawer } from "@/src/components/organisms/userRecentActivity/drawer";
import { RecentActivityCard } from "@/src/components/organisms/userRecentActivity/activityCard";
import { useCheckOut } from "@/src/hooks/mutation/userRecentActivity/checkOut";
import { orderFoodHistoryState } from "@/src/models/public/food/orderHistory";
import Image from "next/image";
import { useFoodOrderHistory } from "@/src/hooks/query/recentActivity/foodOrderHistory";

// ── Types ──────────────────────────────────────────────────────────────────
type ActivityStatus = 'all' | 'PENDING' | 'PAID' | 'CONFIRMED' | 'CHECKED_IN' | 'CHECKED_OUT' | 'CANCELLED' | 'EXPIRED';
type FoodStatus = 'all' | 'PENDING' | 'CONFIRMED' | 'IN_PROGRESS' | 'READY' | 'COMPLETED' | 'CANCELLED';
type MainTab = 'booking' | 'food';

const BOOKING_FILTERS: { label: string; value: ActivityStatus }[] = [
  { label: "All", value: "all" },
  { label: "Pending", value: "PENDING" },
  { label: "Confirmed", value: "CONFIRMED" },
  { label: "Checked In", value: "CHECKED_IN" },
];

const FOOD_FILTERS: { label: string; value: FoodStatus }[] = [
  { label: "All", value: "all" },
  { label: "Pending", value: "PENDING" },
  { label: "Confirmed", value: "CONFIRMED" },
  { label: "Selesai", value: "COMPLETED" },
  { label: "Batal", value: "CANCELLED" },
];

// ── Status Badge ───────────────────────────────────────────────────────────
function FoodStatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; bg: string; text: string }> = {
    PENDING:     { label: "Menunggu", bg: "#fefce8", text: "#854d0e" },
    CONFIRMED:   { label: "Dikonfirmasi", bg: "#eff6ff", text: "#1e3a8a" },
    IN_PROGRESS: { label: "Diproses", bg: "#fff7ed", text: "#7c2d12" },
    READY:       { label: "Siap", bg: "#f0fdf4", text: "#14532d" },
    COMPLETED:   { label: "Selesai", bg: "#f0fdf4", text: "#14532d" },
    CANCELLED:   { label: "Dibatal", bg: "#fef2f2", text: "#7f1d1d" },
  };
  const s = map[status] ?? { label: status, bg: "#f1f5f9", text: "#475569" };
  return (
    <span style={{
      fontSize: 10, fontWeight: 700, padding: "2px 8px",
      borderRadius: 6, background: s.bg, color: s.text,
    }}>
      {s.label}
    </span>
  );
}

function PaymentStatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; bg: string; text: string }> = {
    PENDING: { label: "Belum Bayar", bg: "#fefce8", text: "#854d0e" },
    SUCCESS: { label: "Lunas", bg: "#f0fdf4", text: "#14532d" },
    FAILED:  { label: "Gagal", bg: "#fef2f2", text: "#7f1d1d" },
    EXPIRED: { label: "Expired", bg: "#f1f5f9", text: "#475569" },
  };
  const s = map[status] ?? { label: status, bg: "#f1f5f9", text: "#475569" };
  return (
    <span style={{
      fontSize: 10, fontWeight: 700, padding: "2px 8px",
      borderRadius: 6, background: s.bg, color: s.text,
    }}>
      {s.label}
    </span>
  );
}

// ── Food Order Card ────────────────────────────────────────────────────────
function FoodOrderCard({ order, index }: { order: orderFoodHistoryState; index: number }) {
  const formatPrice = (n: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });

  const tableNote = order.note?.match(/\[Meja: (.+?)\]/)?.[1] ?? null;
  const extraNote = order.note?.replace(/\[Meja: .+?\]\s*-?\s*/, "").trim() || null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ delay: index * 0.04, duration: 0.3 }}
      className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm"
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-4 pt-4 pb-3 border-b border-gray-50">
        {order.restaurantSite.restaurant.logoUrl ? (
          <img
            src={order.restaurantSite.restaurant.logoUrl}
            alt={order.restaurantSite.restaurant.name}
            className="w-10 h-10 rounded-xl object-cover shrink-0"
          />
        ) : (
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0 text-lg">
            🍽️
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-700 text-gray-900 truncate font-semibold">
            {order.restaurantSite.restaurant.name}
          </p>
          <p className="text-[10px] text-gray-400 font-mono">{order.orderCode}</p>
        </div>
        <div className="flex flex-col items-end gap-1 shrink-0">
          <FoodStatusBadge status={order.status} />
          <PaymentStatusBadge status={order.payment.status} />
        </div>
      </div>

      {/* Items */}
      <div className="px-4 py-3 space-y-1.5">
        {order.items.map((item) => (
          <div key={item.id} className="flex justify-between items-center">
            <span className="text-xs text-gray-600">
              <span className="font-medium">{item.quantity}×</span> {item.productName}
            </span>
            <span className="text-xs font-semibold text-gray-800">{formatPrice(item.subtotal)}</span>
          </div>
        ))}
      </div>

      {/* Meta */}
      <div className="px-4 pb-4 flex flex-col gap-2">
        {tableNote && (
          <div className="flex items-center gap-1.5 text-[11px] text-gray-400">
            <span>📍</span>
            <span>{tableNote}</span>
          </div>
        )}
        {extraNote && (
          <div className="flex items-center gap-1.5 text-[11px] text-gray-400">
            <span>📝</span>
            <span>{extraNote}</span>
          </div>
        )}
        <div className="flex items-center justify-between mt-1">
          <span className="text-[11px] text-gray-400">{formatDate(order.createdAt)}</span>
          <span className="text-sm font-bold text-gray-900">{formatPrice(order.totalAmount)}</span>
        </div>
        {order.payment.status === "PENDING" && order.status !== "CANCELLED" && (
          <div className="mt-1 px-3 py-2 bg-amber-50 border border-amber-100 rounded-xl text-[11px] text-amber-700 text-center font-medium">
            ⏳ Menunggu pembayaran
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ── Google Login Gate ──────────────────────────────────────────────────────
export function GoogleLoginGate() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center min-h-[70vh] px-4"
    >
      <div className="w-full max-w-sm">
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="relative h-36 bg-gradient-to-br from-blue-400 to-blue-600 overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="absolute rounded-full border border-white"
                  style={{ width: `${80 + i * 44}px`, height: `${80 + i * 44}px`, top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}
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
              <p className="text-xs text-gray-400 leading-relaxed">Login dulu untuk melihat aktivitas booking kamu.</p>
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
            <p className="text-[10px] text-gray-300 leading-relaxed">Dengan masuk, kamu menyetujui syarat & ketentuan kami.</p>
          </div>
        </div>
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

function FoodSkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
      <div className="flex items-center gap-3 px-4 pt-4 pb-3 border-b border-gray-50">
        <div className="w-10 h-10 rounded-xl bg-gray-100 shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-3 bg-gray-100 rounded w-1/2" />
          <div className="h-2 bg-gray-100 rounded w-1/3" />
        </div>
        <div className="w-16 h-5 bg-gray-100 rounded" />
      </div>
      <div className="px-4 py-3 space-y-2">
        <div className="h-3 bg-gray-100 rounded" />
        <div className="h-3 bg-gray-100 rounded w-2/3" />
      </div>
      <div className="px-4 pb-4 flex justify-between">
        <div className="h-3 bg-gray-100 rounded w-1/3" />
        <div className="h-4 bg-gray-100 rounded w-1/4" />
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

// ── Empty State ────────────────────────────────────────────────────────────
function EmptyState({ type }: { type: "booking" | "food" }) {
  const router = useRouter();
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center py-16 px-4 text-center"
    >
      <div className="text-5xl mb-4">{type === "food" ? "🍽️" : "🛏️"}</div>
      <h3 className="text-base font-semibold text-gray-900 mb-2">
        {type === "food" ? "Belum ada pesanan makanan" : "Tidak ada aktivitas"}
      </h3>
      <p className="text-sm text-gray-400 leading-relaxed mb-6">
        {type === "food"
          ? "Pesanan food kamu akan muncul di sini."
          : "Booking kamu yang sedang berjalan akan muncul di sini."}
      </p>
      <button
        onClick={() => router.push(type === "food" ? "/food" : "/")}
        className="px-6 py-3 rounded-xl bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 transition-all shadow-lg shadow-blue-100"
      >
        {type === "food" ? "Pesan Sekarang" : "Cari Kamar Sekarang"}
      </button>
    </motion.div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────
export default function RecentActivityPage() {
  const { data: session, status: authStatus } = useSession();
  const { data, isLoading, error, refetch } = useRecentActivity();
  const { data: foodData, isLoading: foodLoading, error: foodError, refetch: foodRefetch } = useFoodOrderHistory();
  const { mutate: checkIn, isPending: isCheckingIn, variables: checkingInCode } = useCheckIn();
  const { mutate: checkOut, isPending: isCheckingOut, variables: checkingOutCode } = useCheckOut();

  const [mainTab, setMainTab] = useState<MainTab>("booking");
  const [bookingFilter, setBookingFilter] = useState<ActivityStatus>("all");
  const [foodFilter, setFoodFilter] = useState<FoodStatus>("all");
  const [selected, setSelected] = useState<userRecentActivityListState | null>(null);

  if (authStatus === "loading") return <AuthSkeleton />;
  if (authStatus === "unauthenticated" || !session) return <GoogleLoginGate />;

  const bookings = data?.data?.bookings ?? [];
  const foodOrders = foodData?.data ?? [];

  const filteredBookings = bookingFilter === "all" ? bookings : bookings.filter((b) => b.status === bookingFilter);
  const filteredFood = foodFilter === "all" ? foodOrders : foodOrders.filter((o) => o.status === foodFilter);

  const checkedIn = bookings.filter((b) => b.status === "CHECKED_IN").length;
  const totalActive = bookings.filter((b) => b.status !== "CANCELLED" && b.status !== "EXPIRED").length;
  const foodPending = foodOrders.filter((o) => o.payment.status === "PENDING" && o.status !== "CANCELLED").length;

  return (
    <div className="min-h-screen bg-gray-50/60">
      <div className="max-w-2xl mx-auto px-4 py-10">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-5">
            {session.user?.image && (
              <Image unoptimized width={200} height={200} src={session.user.image} alt="avatar"
                className="w-9 h-9 rounded-full border-2 border-white shadow-sm" />
            )}
            <div>
              <p className="text-xs text-gray-400">Welcome back,</p>
              <p className="text-sm font-semibold text-gray-800 leading-tight">{session.user?.name ?? session.user?.email}</p>
            </div>
          </div>
          <p className="text-xs tracking-widest uppercase text-blue-400 mb-1">My Account</p>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Recent Activity</h1>
          <p className="text-sm text-gray-400 mt-1">Semua aktivitas booking & pesanan kamu</p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.45 }}
          className="grid grid-cols-3 gap-3 mb-6"
        >
          {[
            { label: "Total Booking", value: isLoading ? "—" : bookings.length },
            { label: "Checked In", value: isLoading ? "—" : checkedIn },
            { label: "Food Pending", value: foodLoading ? "—" : foodPending,
              highlight: foodPending > 0 },
          ].map((s) => (
            <div key={s.label} className={`rounded-2xl border px-4 py-4 text-center transition-all
              ${s.highlight ? "bg-amber-50 border-amber-100" : "bg-white border-gray-100"}`}>
              <p className={`text-lg font-bold ${s.highlight ? "text-amber-600" : "text-gray-900"}`}>{s.value}</p>
              <p className={`text-xs mt-0.5 leading-tight ${s.highlight ? "text-amber-500" : "text-gray-400"}`}>{s.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Main Tabs */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}
          className="flex gap-2 mb-5"
        >
          {([
            { value: "booking", label: "🏨 Hotel Booking", count: bookings.length },
            { value: "food", label: "🍽️ Food Order", count: foodOrders.length },
          ] as { value: MainTab; label: string; count: number }[]).map((tab) => (
            <button
              key={tab.value}
              onClick={() => setMainTab(tab.value)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-all duration-200
                ${mainTab === tab.value
                  ? "bg-blue-500 text-white border-blue-500 shadow-md shadow-blue-100"
                  : "bg-white text-gray-500 border-gray-200 hover:border-blue-300 hover:text-blue-500"
                }`}
            >
              {tab.label}
              <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold
                ${mainTab === tab.value ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"}`}>
                {tab.count}
              </span>
            </button>
          ))}
        </motion.div>

        {/* ── Booking Tab ── */}
        <AnimatePresence mode="wait">
          {mainTab === "booking" && (
            <motion.div
              key="booking"
              initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 12 }}
              transition={{ duration: 0.2 }}
            >
              {/* Filter pills */}
              <div className="flex gap-2 overflow-x-auto pb-1 mb-4 scrollbar-hide">
                {BOOKING_FILTERS.map((f) => (
                  <button
                    key={f.value}
                    onClick={() => setBookingFilter(f.value)}
                    className={`shrink-0 px-4 py-1.5 rounded-full text-xs font-medium border transition-all duration-200
                      ${bookingFilter === f.value
                        ? "bg-blue-500 text-white border-blue-500 shadow-md shadow-blue-100"
                        : "bg-white text-gray-500 border-gray-200 hover:border-blue-300 hover:text-blue-500"
                      }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              <div className="flex flex-col gap-3">
                {isLoading && [...Array(3)].map((_, i) => <SkeletonCard key={i} />)}
                {error && !isLoading && (
                  <div className="flex flex-col items-center py-16 text-center">
                    <p className="text-sm text-gray-400 mb-3">Gagal memuat booking</p>
                    <button onClick={() => refetch()} className="px-4 py-2 rounded-xl border border-blue-200 text-blue-500 text-xs">
                      Coba Lagi
                    </button>
                  </div>
                )}
                {!isLoading && !error && bookings.length === 0 && <EmptyState type="booking" />}
                {!isLoading && !error && bookings.length > 0 && filteredBookings.length === 0 && (
                  <div className="flex flex-col items-center py-12 text-center">
                    <p className="text-sm text-gray-400 mb-3">Tidak ada booking dengan status ini</p>
                    <button onClick={() => setBookingFilter("all")} className="px-4 py-2 rounded-xl border border-gray-200 text-gray-500 text-xs">
                      Tampilkan Semua
                    </button>
                  </div>
                )}
                <AnimatePresence mode="popLayout">
                  {!isLoading && !error && filteredBookings.map((booking, i) => (
                    <RecentActivityCard
                      key={booking.id}
                      booking={booking}
                      index={i}
                      onClick={() => setSelected(booking)}
                    />
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>
          )}

          {/* ── Food Tab ── */}
          {mainTab === "food" && (
            <motion.div
              key="food"
              initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.2 }}
            >
              {/* Filter pills */}
              <div className="flex gap-2 overflow-x-auto pb-1 mb-4 scrollbar-hide">
                {FOOD_FILTERS.map((f) => (
                  <button
                    key={f.value}
                    onClick={() => setFoodFilter(f.value)}
                    className={`shrink-0 px-4 py-1.5 rounded-full text-xs font-medium border transition-all duration-200
                      ${foodFilter === f.value
                        ? "bg-blue-500 text-white border-blue-500 shadow-md shadow-blue-100"
                        : "bg-white text-gray-500 border-gray-200 hover:border-blue-300 hover:text-blue-500"
                      }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              <div className="flex flex-col gap-3">
                {foodLoading && [...Array(3)].map((_, i) => <FoodSkeletonCard key={i} />)}
                {foodError && !foodLoading && (
                  <div className="flex flex-col items-center py-16 text-center">
                    <p className="text-sm text-gray-400 mb-3">Gagal memuat pesanan</p>
                    <button onClick={() => foodRefetch()} className="px-4 py-2 rounded-xl border border-blue-200 text-blue-500 text-xs">
                      Coba Lagi
                    </button>
                  </div>
                )}
                {!foodLoading && !foodError && foodOrders.length === 0 && <EmptyState type="food" />}
                {!foodLoading && !foodError && foodOrders.length > 0 && filteredFood.length === 0 && (
                  <div className="flex flex-col items-center py-12 text-center">
                    <p className="text-sm text-gray-400 mb-3">Tidak ada pesanan dengan status ini</p>
                    <button onClick={() => setFoodFilter("all")} className="px-4 py-2 rounded-xl border border-gray-200 text-gray-500 text-xs">
                      Tampilkan Semua
                    </button>
                  </div>
                )}
                <AnimatePresence mode="popLayout">
                  {!foodLoading && !foodError && filteredFood.map((order, i) => (
                    <FoodOrderCard key={order.id} order={order} index={i} />
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {selected && (
        <RecentActivityDrawer
          booking={selected}
          onClose={() => setSelected(null)}
          onCheckIn={(bookingCode) => checkIn(bookingCode)}
          onCheckOut={(bookingCode) => checkOut(bookingCode)}
          isCheckingIn={isCheckingIn && checkingInCode === selected?.bookingCode}
          isCheckingOut={isCheckingOut && checkingOutCode === selected?.bookingCode}
        />
      )}
    </div>
  );
}