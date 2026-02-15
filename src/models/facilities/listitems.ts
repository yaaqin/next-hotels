export interface facilityItemslistProps {
  success: boolean
  message: string
  data: facilityItemsListState[]
}

export interface facilityItemsListState {
  id: string
  code: string
  note?: string
  createdAt: string
  type: Type
  name: string
  lang: string
}

export interface Type {
  id: string
  code: string
}
