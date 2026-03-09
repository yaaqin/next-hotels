export interface bookingHistoryListProps {
  success: boolean
  message: string
  data: Data
}

export interface Data {
  total: number
  bookings: bookingHistoryListState[]
}

export interface bookingHistoryListState {
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
  site: Site
  payment: Payment
  statusLogs: StatusLog[]
}

export interface Contact {
  fullName: string
  email: string
  phone: string
}

export interface Item {
  id: string
  bookingId: string
  roomTypeId: string
  roomId: string
  pricePerNight: number
  nights: number
  subtotal: number
  room: Room
  roomType: RoomType
}

export interface Room {
  id: string
  number: string
  floorId: string
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

export interface Site {
  sitecode: string
  nama: string
  lokasi: string
}

export interface Payment {
  id: string
  bookingId: string
  snapToken: any
  paymentUrl: any
  method: string
  status: string
  vaNumber?: string
  vaBank: string
  qrisUrl: any
  deeplink: any
  expiredAt: string
  paidAt?: string
  createdAt: string
}

export interface StatusLog {
  id: string
  bookingId: string
  fromStatus: string
  toStatus: string
  note: string
  createdAt: string
  createdBy: any
}
