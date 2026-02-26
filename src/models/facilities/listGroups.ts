export interface facilityGroupListProps {
  success: boolean
  message: string
  data: facilityGroupListState[]
}

export interface facilityGroupListState {
  id: string
  code: string
  note: string
  facility: Facility[]
  createdAt: string
  createdBy: string
}

export interface Facility {
  id: string
  code: string
  translations: Translation[]
}

export interface Translation {
  id: string
  facilityItemId: string
  lang: string
  name: string
}
