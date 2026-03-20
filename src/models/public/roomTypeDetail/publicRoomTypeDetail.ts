export interface publicRoomTypeDetailProps {
  success: boolean
  message: string
  data: publicRoomTypeDetailState
}

export interface publicRoomTypeDetailState {
  id: string
  createdAt: string
  image: Image
  lang: string
  name: string
  desk: string
  rooms: Room[]
}

export interface Image {
  id: string
  url: string
  name: string
}

export interface Room {
  id: string
  number: string
  floorId: string
  isAvailable: boolean
  bedType: BedType
  facilityGroup: FacilityGroup
}

export interface BedType {
  id: string
  code: string
  name: string
  size: string
}

export interface FacilityGroup {
  id: string
  code: string
  note: string
}
