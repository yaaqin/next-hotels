export interface bedTypeListProps {
  success: boolean
  message: string
  data: bedTypeListState[]
}

export interface bedTypeListState {
  id: string
  code: string
  createdBy: string
  createdAt: string
  updatedAt: string
  translations: Translation[]
}

export interface Translation {
  id: string
  bedTypeId: string
  lang: string
  name: string
  size: string
  description: string
  createdAt: string
  updatedAt: string
}
