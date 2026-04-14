export type RoomType = "Deluxe" | "Superior" | "Suite" | "Standard" | "Family Room";

export type BookingStatus = "confirmed" | "checked_in" | "checked_out" | "cancelled";

export interface Booking {
  id: string;
  guestName: string;
  roomType: RoomType;
  roomNumber: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  totalAmount: number;
  status: BookingStatus;
  channel: "direct" | "OTA" | "corporate" | "walk-in";
}

export interface DailyRevenue {
  date: string;
  revenue: number;
  bookings: number;
  occupancy: number;
}

export interface MonthlyStats {
  month: string;
  shortMonth: string;
  revenue: number;
  bookings: number;
  occupancyRate: number;
}

export interface RoomTypeStats {
  roomType: RoomType;
  bookings: number;
  revenue: number;
  percentage: number;
  avgNightRate: number;
  color: string;
}

export interface PeakDate {
  date: string;
  label: string;
  bookings: number;
  revenue: number;
  occasion: string;
}

export interface FinanceSummary {
  totalRevenue: number;
  totalBookings: number;
  avgOccupancy: number;
  avgNightlyRate: number;
  revenueGrowth: number;
  bookingGrowth: number;
  occupancyChange: number;
  adrGrowth: number;
}
