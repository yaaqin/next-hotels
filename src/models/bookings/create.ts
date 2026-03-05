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
  data: {
    booking: {
      id: string
      bookingCode: string
      siteCode: string
      checkInDate: string
      checkOutDate: string
      totalAmount: number
      status: string
      createdAt: string
    }
    payment: {
      type: string
      qrCodeUrl: string | null
      vaNumber: string | null
      billerCode: string | null
      billKey: string | null
      transactionId: string
      expiryTime: string
    }
  }
}