import { reschedulePolicySummary } from "./preview"

export interface rechAvlbDateProps {
  success: boolean
  data: rechAvlbDateState
}

export interface rechAvlbDateState {
  bookingId: string
  siteCode: string
  originalCheckIn: string
  originalCheckOut: string
  originalNights: number
  rangeStart: string
  rangeEnd: string
  policy: reschedulePolicySummary
  months: Month[]
}

export interface Month {
  month: string
  label: string
  dates: Date[]
}

export interface Date {
  date: string
  available: boolean
  lowestPrice?: number
  sameTypePrice?: number
  roomTypes: RoomType[]
}

export interface RoomType {
  roomTypeId: string
  roomTypeName: string
  pricePerNight: number
  availableRooms: number
  hasPricing: boolean
}
