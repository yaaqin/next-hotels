export interface facilitytTypeProps {
  success: boolean
  message: string
  data: facilityTypeState[]
}

export interface facilityTypeState {
  id: string
  code: string
  note?: string
  createdAt: string
  name: string
  lang: string
}
