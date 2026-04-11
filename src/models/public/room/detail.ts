export interface publicRoomDetailProps {
  success: boolean
  message: string
  data: publicRoomDetailState
}

export interface publicRoomDetailState {
  id: string
  siteCode: string
  number: string
  floorId: string
  createdAt: string
  createdBy: string
  site: Site
  roomType: RoomType
  bedType: BedType
  facilityGroup: FacilityGroup
  gallery: Gallery
  isAllowToCheckIn: boolean
  pricing: Pricing | null
}

export interface Pricing {
  basePrice: number
  pricePerNight: number
  originalPrice: number | null
  isDiscounted: boolean
  nights: number
  totalPrice: number
  nightlyBreakdown: number[]
}

export interface Site {
  id: string
  nama: string
  lokasi: string
  createdBy: string
  isActive: boolean
  createdAt: string
  updatedAt: string
  sitecode: string
}

export interface RoomType {
  id: string
  imageId: string
  createdAt: string
  createdBy: string
  translation: Translation
}

export interface Translation {
  id: string
  roomTypeId: string
  lang: string
  name: string
  desk: string
}

export interface BedType {
  id: string
  code: string
  createdBy: string
  createdAt: string
  updatedAt: string
  translation: Translation2
}

export interface Translation2 {
  id: string
  bedTypeId: string
  lang: string
  name: string
  size: string
  description: string
  createdAt: string
  updatedAt: string
}

export interface FacilityGroup {
  id: string
  code: string
  note: string
  facilities: Facility[]
}

export interface Facility {
  type: Type
  items: Item[]
}

export interface Type {
  id: string
  code: string
  name: string
}

export interface Item {
  id: string
  code: string
  name: string
}

export interface Gallery {
  id: string
  title: string
  createdAt: string
  images: Image[]
}

export interface Image {
  id: string
  url: string
  name: string
}
