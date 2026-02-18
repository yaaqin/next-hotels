export interface CreateBedTypeForm {
  code: string
  name: string
  size: string
  description: string
}

export interface BedType {
  id: string
  code: string
  name: string
  size: string
  description: string
}

export interface BedTypesResponse {
  data: BedType[]
  message?: string
}

export interface BedTypeDetailResponse {
  data: BedType
  message?: string
}

// ✅ payload untuk POST
export interface CreateBedTypePayload {
  code: string
  name: string
  size: string
  description: string
}