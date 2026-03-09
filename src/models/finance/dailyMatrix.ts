export interface dailyMatrixProps {
  success: boolean
  message: string
  data: dailyMatrixState
}

export interface dailyMatrixState {
  date: string
  siteCode: string
  bookingsToday: BookingsToday
  revenueToday: RevenueToday
  occupancyRate: OccupancyRate
}

export interface BookingsToday {
  total: number
  yesterday: number
  growth: number
}

export interface RevenueToday {
  total: number
  currency: string
  yesterday: number
  growth: number
}

export interface OccupancyRate {
  percentage: number
  occupiedRooms: number
  totalRooms: number
}
