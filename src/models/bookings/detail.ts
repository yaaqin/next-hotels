export interface bookingDetailProps {
  success: boolean
  message: string
  data: bookingDetailState
}

export interface bookingDetailState {
  id: string
  bookingCode: string
  siteCode: string
  checkInDate: string
  checkOutDate: string
  totalAmount: number
  status: string
  createdAt: string
  createdBy: any
  contact: Contact
  items: Item[]
  statusLogs: StatusLog[]
  site: Site
  payment: Payment
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

export interface Site {
  id: string
  nama: string
  lokasi: string
  sitecode: string
}

export interface Payment {
  method: string
  status: string
  expiredAt: string
  paidAt: any
  type: string
  vaNumber: string
  vaBank: string
}
