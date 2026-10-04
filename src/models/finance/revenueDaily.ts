// Uang masuk per hari (tanggal pembayaran, WIB) — GET /finance/revenue/daily
export interface revenueDailyRow {
  date: string
  revenue: number
  payments: number
  creditUsed: number
}

export interface revenueDailyProps {
  success: boolean
  message: string
  data: revenueDailyRow[]
}

// Rincian satu hari — GET /finance/revenue/detail
export interface revenueDetailItem {
  roomTypeId: string
  roomTypeName: string | null
  roomNumber: string | null
  nights: number
  subtotal: number
}

export interface revenueDetailBooking {
  bookingCode: string
  siteCode: string
  status: string
  guestName: string | null
  guestEmail: string | null
  guestPhone: string | null
  paidAt: string
  method: string | null
  amount: number
  totalAmount: number
  creditAmount: number
  isReschedule: boolean
  checkInDate: string
  checkOutDate: string
  items: revenueDetailItem[]
}

export interface revenueDetailState {
  date: string
  siteCode: string
  summary: {
    revenue: number
    bookings: number
    rooms: number
    guests: number
    reschedulePayments: number
    creditUsed: number
  }
  byMethod: { method: string; count: number; amount: number }[]
  byRoomType: { roomTypeName: string | null; rooms: number; nights: number }[]
  bookings: revenueDetailBooking[]
  creditUsages: { bookingCode: string; status: string; guestName: string | null; amount: number; usedAt: string }[]
}

export interface revenueDetailProps {
  success: boolean
  message: string
  data: revenueDetailState
}
