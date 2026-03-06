export interface detailFacilityGroupProps {
  success: boolean
  message: string
  data: detailFacilityGroupState
}

export interface detailFacilityGroupState {
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
  note: any
  type: Type
  translations: Translation2[]
}

export interface Type {
  id: string
  code: string
  translations: Translation[]
}

export interface Translation {
  id: string
  facilityTypeId: string
  lang: string
  name: string
}

export interface Translation2 {
  id: string
  facilityItemId: string
  lang: string
  name: string
}
