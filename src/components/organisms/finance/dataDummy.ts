import { Booking, FinanceSummary, MonthlyStats, PeakDate, RoomTypeStats } from "@/src/models/finance/dashboard";


// ─── Room type config ──────────────────────────────────────────────────────
export const ROOM_COLORS: Record<string, string> = {
  Deluxe: "#185FA5",
  Superior: "#0F6E56",
  Suite: "#B85C1C",
  Standard: "#888780",
  "Family Room": "#8B3A6E",
};

export const ROOM_RATES: Record<string, number> = {
  Deluxe: 1_350_000,
  Superior: 950_000,
  Suite: 2_800_000,
  Standard: 650_000,
  "Family Room": 1_600_000,
};

// ─── Recent Bookings ───────────────────────────────────────────────────────
export const recentBookings: Booking[] = [
  { id: "BK-2025-0847", guestName: "Budi Santoso", roomType: "Suite", roomNumber: "801", checkIn: "2025-12-24", checkOut: "2025-12-27", nights: 3, totalAmount: 8_400_000, status: "confirmed", channel: "direct" },
  { id: "BK-2025-0846", guestName: "Siti Rahma", roomType: "Deluxe", roomNumber: "412", checkIn: "2025-12-23", checkOut: "2025-12-26", nights: 3, totalAmount: 4_050_000, status: "checked_in", channel: "OTA" },
  { id: "BK-2025-0845", guestName: "Ahmad Fauzi", roomType: "Family Room", roomNumber: "502", checkIn: "2025-12-22", checkOut: "2025-12-25", nights: 3, totalAmount: 4_800_000, status: "checked_in", channel: "corporate" },
  { id: "BK-2025-0844", guestName: "Dewi Lestari", roomType: "Superior", roomNumber: "315", checkIn: "2025-12-21", checkOut: "2025-12-23", nights: 2, totalAmount: 1_900_000, status: "checked_out", channel: "OTA" },
  { id: "BK-2025-0843", guestName: "Rudi Hartono", roomType: "Standard", roomNumber: "201", checkIn: "2025-12-20", checkOut: "2025-12-22", nights: 2, totalAmount: 1_300_000, status: "checked_out", channel: "walk-in" },
  { id: "BK-2025-0842", guestName: "Maya Putri", roomType: "Suite", roomNumber: "802", checkIn: "2025-12-19", checkOut: "2025-12-21", nights: 2, totalAmount: 5_600_000, status: "checked_out", channel: "direct" },
  { id: "BK-2025-0841", guestName: "Hendra Gunawan", roomType: "Deluxe", roomNumber: "408", checkIn: "2025-12-18", checkOut: "2025-12-20", nights: 2, totalAmount: 2_700_000, status: "checked_out", channel: "corporate" },
  { id: "BK-2025-0840", guestName: "Rina Kusuma", roomType: "Deluxe", roomNumber: "411", checkIn: "2025-12-17", checkOut: "2025-12-19", nights: 2, totalAmount: 2_700_000, status: "checked_out", channel: "OTA" },
  { id: "BK-2025-0839", guestName: "Teguh Prasetyo", roomType: "Superior", roomNumber: "317", checkIn: "2025-12-16", checkOut: "2025-12-18", nights: 2, totalAmount: 1_900_000, status: "cancelled", channel: "OTA" },
  { id: "BK-2025-0838", guestName: "Fitri Yanti", roomType: "Family Room", roomNumber: "503", checkIn: "2025-12-15", checkOut: "2025-12-18", nights: 3, totalAmount: 4_800_000, status: "checked_out", channel: "direct" },
];

// ─── Monthly Stats ─────────────────────────────────────────────────────────
export const monthlyStats: MonthlyStats[] = [
  { month: "January",   shortMonth: "Jan", revenue: 342_000_000, bookings: 310, occupancyRate: 71.4 },
  { month: "February",  shortMonth: "Feb", revenue: 298_500_000, bookings: 265, occupancyRate: 68.2 },
  { month: "March",     shortMonth: "Mar", revenue: 315_200_000, bookings: 280, occupancyRate: 70.1 },
  { month: "April",     shortMonth: "Apr", revenue: 287_400_000, bookings: 255, occupancyRate: 66.8 },
  { month: "May",       shortMonth: "May", revenue: 304_600_000, bookings: 270, occupancyRate: 69.5 },
  { month: "June",      shortMonth: "Jun", revenue: 321_800_000, bookings: 285, occupancyRate: 72.3 },
  { month: "July",      shortMonth: "Jul", revenue: 356_000_000, bookings: 310, occupancyRate: 75.8 },
  { month: "August",    shortMonth: "Aug", revenue: 389_500_000, bookings: 340, occupancyRate: 80.2 },
  { month: "September", shortMonth: "Sep", revenue: 334_200_000, bookings: 290, occupancyRate: 73.1 },
  { month: "October",   shortMonth: "Oct", revenue: 341_700_000, bookings: 295, occupancyRate: 74.4 },
  { month: "November",  shortMonth: "Nov", revenue: 358_300_000, bookings: 305, occupancyRate: 76.2 },
  { month: "December",  shortMonth: "Dec", revenue: 512_400_000, bookings: 437, occupancyRate: 92.6 },
];

// ─── Room Type Stats ───────────────────────────────────────────────────────
export const roomTypeStats: RoomTypeStats[] = [
  { roomType: "Deluxe",      bookings: 1306, revenue: 1_763_100_000, percentage: 34, avgNightRate: 1_350_000, color: "#185FA5" },
  { roomType: "Superior",    bookings: 1037, revenue:   985_150_000, percentage: 27, avgNightRate:   950_000, color: "#0F6E56" },
  { roomType: "Suite",       bookings:  691, revenue: 1_934_800_000, percentage: 18, avgNightRate: 2_800_000, color: "#B85C1C" },
  { roomType: "Standard",    bookings:  499, revenue:   324_350_000, percentage: 13, avgNightRate:   650_000, color: "#888780" },
  { roomType: "Family Room", bookings:  309, revenue:   494_400_000, percentage:  8, avgNightRate: 1_600_000, color: "#8B3A6E" },
];

// ─── Peak Dates ────────────────────────────────────────────────────────────
export const peakDates: PeakDate[] = [
  { date: "31 Des 2025", label: "31/12", bookings: 203, revenue: 274_050_000, occasion: "Malam Tahun Baru" },
  { date: "1 Jan 2025",  label: "1/1",  bookings: 196, revenue: 264_600_000, occasion: "Tahun Baru" },
  { date: "25 Des 2025", label: "25/12", bookings: 187, revenue: 252_450_000, occasion: "Hari Natal" },
  { date: "17 Ags 2025", label: "17/8",  bookings: 172, revenue: 232_200_000, occasion: "HUT RI" },
  { date: "10 Mar 2025", label: "10/3",  bookings: 165, revenue: 222_750_000, occasion: "Libur Lebaran" },
  { date: "14 Feb 2025", label: "14/2",  bookings: 158, revenue: 213_300_000, occasion: "Valentine's Day" },
  { date: "20 Apr 2025", label: "20/4",  bookings: 143, revenue: 193_050_000, occasion: "Libur Paskah" },
  { date: "30 Jun 2025", label: "30/6",  bookings: 138, revenue: 186_300_000, occasion: "Libur Sekolah" },
];

// ─── YTD Finance Summary ───────────────────────────────────────────────────
export const financeSummary: FinanceSummary = {
  totalRevenue:    4_761_200_000,
  totalBookings:   3_842,
  avgOccupancy:    74.3,
  avgNightlyRate:  1_239_300,
  revenueGrowth:   12.4,
  bookingGrowth:   8.1,
  occupancyChange: -2.1,
  adrGrowth:       5.7,
};

// ─── Quarterly filter slices ───────────────────────────────────────────────
export const quarterlyData = {
  ytd: { summary: financeSummary, months: monthlyStats },
  q1: {
    summary: { totalRevenue: 955_700_000, totalBookings: 855, avgOccupancy: 69.9, avgNightlyRate: 1_118_000, revenueGrowth: 9.1, bookingGrowth: 6.3, occupancyChange: -1.4, adrGrowth: 4.2 } as FinanceSummary,
    months: monthlyStats.slice(0, 3),
  },
  q2: {
    summary: { totalRevenue: 913_800_000, totalBookings: 810, avgOccupancy: 69.5, avgNightlyRate: 1_128_000, revenueGrowth: 11.2, bookingGrowth: 7.5, occupancyChange: -0.9, adrGrowth: 5.1 } as FinanceSummary,
    months: monthlyStats.slice(3, 6),
  },
  q3: {
    summary: { totalRevenue: 1_079_700_000, totalBookings: 940, avgOccupancy: 76.4, avgNightlyRate: 1_148_000, revenueGrowth: 13.7, bookingGrowth: 9.0, occupancyChange: -3.2, adrGrowth: 6.2 } as FinanceSummary,
    months: monthlyStats.slice(6, 9),
  },
  q4: {
    summary: { totalRevenue: 1_212_400_000, totalBookings: 1037, avgOccupancy: 81.1, avgNightlyRate: 1_169_000, revenueGrowth: 15.1, bookingGrowth: 9.8, occupancyChange: -2.8, adrGrowth: 7.3 } as FinanceSummary,
    months: monthlyStats.slice(9, 12),
  },
};

// ─── Helpers ───────────────────────────────────────────────────────────────
export function formatRupiah(value: number, compact = false): string {
  if (compact) {
    if (value >= 1_000_000_000) return `Rp ${(value / 1_000_000_000).toFixed(1)}M`;
    if (value >= 1_000_000) return `Rp ${(value / 1_000_000).toFixed(0)}Jt`;
    return `Rp ${value.toLocaleString("id-ID")}`;
  }
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(value);
}

export function formatGrowth(value: number): string {
  return `${value > 0 ? "+" : ""}${value.toFixed(1)}%`;
}
