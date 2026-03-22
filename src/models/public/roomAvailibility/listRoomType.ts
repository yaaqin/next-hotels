export interface roomListAvailableProps {
  success: boolean
  message: string
  data: roomListAvailableState[]
}

export interface roomListAvailableState {
  roomTypeId: string
  name: string
  description: string
  imageUrl?: string
  availability: Availability
  pricing: Pricing
}

export interface Availability {
  totalRooms: number
  availableRooms: number
}

export interface Pricing {
  price: number
  checkIn: string
  checkOut: string
  nights: number
  totalPrice: number
  isDiscounted: boolean
  originalPrice: number | null
  originalTotalPrice: number | null
}
