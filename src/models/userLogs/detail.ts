export interface detailUserLogProps {
  success: boolean
  data: detailUserLogState
}

export interface detailUserLogState {
  id: string
  name: string
  email: string
  phone: any
  avatarUrl: string
  isActive: boolean
  createdAt: string
  bookings: Booking[]
  refunds: Refund[]
  creditWallet: CreditWallet
}

export interface Booking {
  id: string
  bookingCode: string
  siteName: string
  siteCode: string
  checkInDate: string
  checkOutDate: string
  totalAmount: number
  status: string
  createdAt: string
  payment: Payment
  statusJourney: StatusJourney[]
  items: Item[]
}

export interface Payment {
  method: string
  status: string
  paidAt: string
  expiredAt: string
}

export interface StatusJourney {
  fromStatus?: string
  toStatus: string
  note: string
  createdAt: string
  actorUsername: any
}

export interface Item {
  id: string
  roomTypeName: string
  roomNumber: string
  pricePerNight: number
  nights: number
  subtotal: number
}

export interface Refund {
  id: string
  bookingCode: string
  reason: string
  refundType: string
  status: string
  refundPercent: number
  originalAmount: number
  refundAmount: number
  penaltyAmount: number
  policyName: string
  requestedAt: string
  processedAt: string
  processedBy: string
  note: string
}

export interface CreditWallet {
  id: string
  code: string
  balance: number
  expiredAt: string
  status: string
  createdAt: string
  logs: Log[]
}

export interface Log {
  id: string
  type: string
  amount: number
  balanceAfter: number
  sourceType: string
  sourceId: string
  note: string
  createdAt: string
}
