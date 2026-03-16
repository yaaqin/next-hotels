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

// ── Types ──────────────────────────────────────────────────────────────────
type ActivityStatus = "pending" | "confirmed" | "checked_in";

// ── Filters ────────────────────────────────────────────────────────────────
const FILTERS: { label: string; value: ActivityStatus | "all" }[] = [
  { label: "All",        value: "all"        },
  { label: "Pending",    value: "pending"    },
  { label: "Confirmed",  value: "confirmed"  },
  { label: "Checked In", value: "checked_in" },
];

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

// ── Empty State ────────────────────────────────────────────────────────────
function EmptyActivityState() {
  const router = useRouter();
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center py-16 px-4 text-center"
    >
      <div className="w-full max-w-xs">
        <div className="relative mx-auto w-40 h-40 mb-8">
          <div className="absolute inset-0 rounded-3xl bg-blue-50 rotate-6" />
          <div className="absolute inset-0 rounded-3xl bg-blue-100 -rotate-3" />
          <div className="absolute inset-0 rounded-3xl bg-white border border-blue-100 shadow-sm flex items-center justify-center">
            <div className="text-center">
              <div className="text-5xl mb-1">🛏️</div>
              <div className="flex gap-1 justify-center">
                {[...Array(3)].map((_, i) => (
                  <motion.div key={i} className="w-1.5 h-1.5 rounded-full bg-blue-300"
                    animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Tidak ada aktivitas</h3>
        <p className="text-sm text-gray-400 leading-relaxed mb-8">Booking kamu yang sedang berjalan akan muncul di sini.</p>
        <button
          onClick={() => router.push("/")}
          className="w-full py-4 rounded-xl bg-blue-500 text-white text-sm tracking-widest uppercase font-medium hover:bg-blue-600 transition-all duration-300 shadow-lg shadow-blue-100"
        >
          Cari Kamar Sekarang
        </button>
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

// ── Main Page ──────────────────────────────────────────────────────────────
export default function RecentActivityPage() {
  const { data: session, status: authStatus } = useSession();
  const { data, isLoading, error, refetch } = useRecentActivity();
  const { mutate: checkIn, isPending: isCheckingIn, variables: checkingInCode } = useCheckIn();
  const { mutate: checkOut, isPending: isCheckingOut, variables: checkingOutCode } = useCheckOut();

  const [activeFilter, setActiveFilter] = useState<ActivityStatus | "all">("all");
  const [selected, setSelected] = useState<userRecentActivityListState | null>(null);

  if (authStatus === "loading") return <AuthSkeleton />;
  if (authStatus === "unauthenticated" || !session) return <GoogleLoginGate />;

  const bookings = data?.data?.bookings ?? [];
  const filtered = activeFilter === "all" ? bookings : bookings.filter((b) => b.status === activeFilter);

  const total = bookings.length;
  const checkedIn = bookings.filter((b) => b.status === "checked_in").length;
  const totalActive = bookings.filter((b) => b.status !== "cancelled" && b.status !== "expired").length;

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
              <img src={session.user.image} alt="avatar" className="w-9 h-9 rounded-full border-2 border-white shadow-sm" />
            )}
            <div>
              <p className="text-xs text-gray-400">Welcome back,</p>
              <p className="text-sm font-semibold text-gray-800 leading-tight">{session.user?.name ?? session.user?.email}</p>
            </div>
          </div>
          <p className="text-xs tracking-widest uppercase text-blue-400 mb-1">My Account</p>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Recent Activity</h1>
          <p className="text-sm text-gray-400 mt-1">Booking yang sedang berjalan</p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.45 }}
          className="grid grid-cols-3 gap-3 mb-8"
        >
          {[
            { label: "Active Bookings", value: isLoading ? "—" : total },
            { label: "Checked In",      value: isLoading ? "—" : checkedIn },
            { label: "Total Active",    value: isLoading ? "—" : totalActive },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-2xl border border-gray-100 px-4 py-4 text-center">
              <p className="text-lg font-bold text-gray-900">{s.value}</p>
              <p className="text-xs text-gray-400 mt-0.5 leading-tight">{s.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Filter tabs */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}
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

        {/* List */}
        <div className="flex flex-col gap-3">
          {isLoading && (
            <div className="flex flex-col gap-3">
              {[...Array(3)].map((_, i) => <SkeletonCard key={i} />)}
            </div>
          )}

          {error && !isLoading && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-20 text-center"
            >
              <div className="text-4xl mb-4 opacity-30">⚠️</div>
              <p className="text-sm font-medium text-gray-400">Failed to load activity</p>
              <button
                onClick={() => refetch()}
                className="mt-4 px-5 py-2 rounded-xl border border-blue-200 text-blue-500 text-xs hover:bg-blue-50 transition"
              >
                Try Again
              </button>
            </motion.div>
          )}

          {!isLoading && !error && bookings.length === 0 && <EmptyActivityState />}

          {!isLoading && !error && bookings.length > 0 && filtered.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
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

          <AnimatePresence mode="popLayout">
            {!isLoading && !error && filtered.map((booking, i) => (
              <RecentActivityCard
                key={booking.id}
                booking={booking}
                index={i}
                onClick={() => setSelected(booking)}
              />
            ))}
          </AnimatePresence>
        </div>
      </div>

      <RecentActivityDrawer
        booking={selected}
        onClose={() => setSelected(null)}
        onCheckIn={(bookingCode) => checkIn(bookingCode)}
        onCheckOut={(bookingCode) => checkOut(bookingCode)}
        isCheckingIn={isCheckingIn && checkingInCode === selected?.bookingCode}
        isCheckingOut={isCheckingOut && checkingOutCode === selected?.bookingCode}
      />
    </div>
  );
}