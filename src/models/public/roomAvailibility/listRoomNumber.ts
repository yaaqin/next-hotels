export interface roomNumberListProps {
  success: boolean
  message: string
  data: roomNumberListState[]
}

export interface roomNumberListState {
  id: string
  number: string
  floor: string
  roomType: RoomType
  bedType: BedType
  isAvailable: boolean
  pricing: Pricing
}

export interface RoomType {
  id: string
  name: string
  description: string
}

export interface BedType {
  id: string
  name: string
}

export interface Pricing {
  price: number
  checkIn: string
  checkOut: string
  nights: number
  totalPrice: number
}
