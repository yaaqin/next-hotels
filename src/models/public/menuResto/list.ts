export interface menuRestoPublicProps {
  success: boolean
  message: string
  data: menuRestoPublicState[]
}

export interface menuRestoPublicState {
  id: string
  basePrice: number
  isActive: boolean
  createdAt: string
  name: string
  description: string
  lang: string
  images: Image[]
  category: Category
  restaurantSite: RestaurantSite
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

export interface RestaurantSite {
  id: string
  siteCode: string
  restaurant: Restaurant
}

export interface Restaurant {
  id: string
  name: string
  logoUrl: string
}
