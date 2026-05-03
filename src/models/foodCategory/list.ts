export interface foodCategoryListProps {
  success: boolean
  message: string
  data: foodCategoryListState[]
}

export interface foodCategoryListState {
  id: string
  code: string
  isGlobal: boolean
  status: string
  isActive: boolean
  createdAt: string
  reviewedAt: any
  reviewNote: any
  name: string
  description: string
  lang: string
  restaurantAdmin: any
  reviewer: any
}
