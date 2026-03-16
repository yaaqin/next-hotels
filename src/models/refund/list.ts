export interface refundListProps {
  success: boolean
  message: string
  data: Data
}

export interface Data {
  total: number
  refunds: refundListState[]
}

export interface refundListState {
  id: string
  bookingId: string
  userId: string
  reason?: string
  refundType?: string
  status: string
  policyId: string
  refundPercent: number
  originalAmount: number
  refundAmount: number
  penaltyAmount: number
  canProcessAt: any
  processedAt?: string
  processedBy?: string
  note?: string
  requestedAt: string
  booking: Booking
  policy: Policy
}

export interface Booking {
  bookingCode: string
  checkInDate: string
  checkOutDate: string
  totalAmount: number
  siteCode: string
  site: Site
  contact: Contact
}

export interface Site {
  nama: string
}

export interface Contact {
  fullName: string
  email: string
  phone: string
}

export interface Policy {
  name: string
  refundPercent: number
}
