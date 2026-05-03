export interface menuRestoProps {
  success: boolean
  message: string
  data: menuRestoState[]
}

export interface menuRestoState {
  id: string
  basePrice: number
  isActive: boolean
  createdAt: string
  name: string
  description: string
  lang: string
  images: Image[]
  category: Category
  discountRules: any[]
}

export interface Image {
  id: string
  url: string
  order: number
}

export interface Category {
  id: string
  code: string
  name: string
}
