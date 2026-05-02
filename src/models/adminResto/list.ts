export interface adminRestoListProps {
  success: boolean
  message: string
  data: adminRestoListState[]
}

export interface adminRestoListState {
  id: string
  email: string
  name: string
  phone: string
  isActive: boolean
  createdAt: string
  ownerships: Ownership[]
  siteAccess: SiteAccess[]
}

export interface Ownership {
  restaurant: Restaurant
}

export interface Restaurant {
  id: string
  name: string
}

export interface SiteAccess {
  role: string
  restaurantSite: RestaurantSite
}

export interface RestaurantSite {
  id: string
  siteCode: string
  restaurant: Restaurant2
}

export interface Restaurant2 {
  name: string
}
