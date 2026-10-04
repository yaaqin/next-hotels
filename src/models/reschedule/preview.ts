export interface reschedulePolicySummary {
  id: string
  name: string
  reschedulePercent: number
  penaltyPercent: number
  daysUntilCheckIn: number
}

export interface rescheduleRoomOption {
  roomId: string
  roomNumber: string
  floorId: string
  roomTypeId: string
  roomTypeName: string
  isOriginalRoom: boolean
  pricePerNight: number
  nights: number
  subtotal: number
}

export interface rescheduleOriginalBooking {
  id: string
  bookingCode: string
  siteCode: string
  status: string
  checkIn: string
  checkOut: string
  nights: number
  roomId: string | null
  roomNumber: string | null
  floorId: string | null
  roomTypeId: string | null
  roomTypeName: string | null
  totalAmount: number
  paymentMethod: string | null
}

export interface reschedulePricing {
  oldPrice: number
  newPrice: number
  penaltyAmount: number
  retainedAmount: number
  finalPrice: number
  difference: number
  extraCharge: number
  creditIssued: number
  reschedulePercent: number
  paymentRequired: boolean
  creditWillBeIssued: boolean
  noExtraCharge: boolean
}

export interface reschedulePreviewState {
  originalBooking: rescheduleOriginalBooking
  policy: reschedulePolicySummary
  dates: {
    newCheckIn: string
    newCheckOut: string
    nights: number
  }
  rooms: {
    originalRoom: rescheduleRoomOption | null
    alternatives: rescheduleRoomOption[]
    selected: rescheduleRoomOption
    hasOriginalRoom: boolean
    mustChooseAlternative: boolean
  }
  pricing: reschedulePricing
}

export interface reschedulePreviewProps {
  success: boolean
  message: string
  data: reschedulePreviewState
}

export interface reschedulePreviewPayload {
  bookingId: string
  newCheckIn: string
  newCheckOut: string
  preferredRoomId?: string
}

export type reschedulePaymentMethod = 'bca' | 'bni' | 'bri' | 'mandiri' | 'qris' | 'sgt' | 'credit'

export interface rescheduleConfirmPayload {
  bookingId: string
  newCheckIn: string
  newCheckOut: string
  selectedRoomId: string
  paymentMethod?: reschedulePaymentMethod
  senderWallet?: string
}

export interface rescheduleConfirmState {
  newBookingId: string
  newBookingCode: string
  newStatus: string
  requiresPayment: boolean
  extraCharge: number
  creditIssued: number
  creditUsed: number
  penalty: number
  // Sama dengan payment di response create booking (VA/QRIS/SGT), null kalau tanpa tagihan
  payment: {
    type: string
    hotelWalletAddress?: string
    sgtAmountDue?: number
    [key: string]: unknown
  } | null
}

export interface rescheduleConfirmProps {
  success: boolean
  message: string
  data: rescheduleConfirmState
}
