export interface orderFoodHistoryProps {
  success: boolean
  message: string
  data: orderFoodHistoryState[]
}

export interface orderFoodHistoryState {
  id: string
  orderCode: string
  status: string
  totalAmount: number
  createdAt: string
  note: string
  restaurantSite: RestaurantSite
  items: Item[]
  payment: Payment
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

export interface Item {
  id: string
  productName: string
  quantity: number
  finalPrice: number
  subtotal: number
}

export interface Payment {
  status: string
  method?: string
  amount: number
  paidAt?: string
}
