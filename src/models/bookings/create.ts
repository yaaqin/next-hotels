export interface BookingPayload {
  siteCode: string
  checkInDate: string
  checkOutDate: string
  paymentMethod: string
  senderWallet?: string
  contact: {
    fullName: string
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
  data: Data
}

export interface Data {
  booking: Booking
  payment: Payment
}

export interface Booking {
  id: string
  bookingCode: string
  siteCode: string
  checkInDate: string
  checkOutDate: string
  totalAmount: number
  status: string
  createdAt: string
  createdBy: any
  userId: string
  contact: Contact
  items: Item[]
  statusLogs: StatusLog[]
}

export interface Contact {
  id: string
  bookingId: string
  fullName: string
  email: string
  phone: string
  idType: string
  idNumber: string
  nationality: any
  address: any
  note: any
}

export interface Item {
  id: string
  bookingId: string
  roomTypeId: string
  roomId: string
  pricePerNight: number
  nights: number
  subtotal: number
  roomType: RoomType
  room: Room
}

export interface RoomType {
  id: string
  imageId: string
  createdAt: string
  createdBy: string
  translations: Translation[]
}

export interface Translation {
  id: string
  roomTypeId: string
  lang: string
  name: string
  desk: string
}

export interface Room {
  id: string
  siteCode: string
  number: string
  floorId: string
  roomTypeId: string
  bedTypeId: string
  facilityGroupId: string
  galleryId: string
  createdAt: string
  createdBy: string
}

export interface StatusLog {
  id: string
  bookingId: string
  fromStatus: any
  toStatus: string
  note: string
  createdAt: string
  createdBy: any
}

export interface Payment {
  type: string
  hotelWalletAddress: string
  sgtAmountDue: number
  rateSnapshot: number
  expiredAt: string
}
