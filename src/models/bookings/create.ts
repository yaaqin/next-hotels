export interface BookingPayload {
  siteCode: string
  checkInDate: string
  checkOutDate: string
  paymentMethod: string
  contact: {
    fullName: string
    email: string
    phone: string
    idType: string
    idNumber: string
  }
  items: {
    roomId: string
    roomTypeId: string
  }[]
}

export interface BookingResponse {
  success: boolean
  message: string
  data?: {
    bookingId: string
    paymentUrl?: string
  }
}