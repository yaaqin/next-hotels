export interface roomListProps {
  success: boolean
  message: string
  data: roomListState[]
}

export interface roomListState {
  id: string
  siteCode: string
  number: string
  floorId: string
  roomTypeId: string
  bedTypeId: string
  facilityGroupId: string
  createdAt: string
  createdBy: string
  site: Site
  roomType: RoomType
  bedType: BedType
  facilityGroup: FacilityGroup
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

export interface BedType {
  id: string
  code: string
  createdBy: string
  createdAt: string
  updatedAt: string
  translations: Translation2[]
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
  facility: string[]
  createdAt: string
  createdBy: string
}
