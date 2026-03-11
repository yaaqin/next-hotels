export interface needConfirmListProps {
  success: boolean
  message: string
  data: Data
}

export interface Data {
  total: number
  date: string
  bookings: needConfirmListState[]
}

export interface needConfirmListState {
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
}

export interface Contact {
  fullName: string
  phone: string
  email: string
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
  image: Image
}

export interface Translation {
  id: string
  roomTypeId: string
  lang: string
  name: string
  desk: string
}

export interface Image {
  id: string
  url: string
  name: string
}

export interface Site {
  sitecode: string
  nama: string
}
