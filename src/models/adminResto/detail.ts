export interface detailAdminRestoProps {
  success: boolean
  message: string
  data: detailAdminRestoState
}

export interface detailAdminRestoState {
  id: string
  email: string
  name: string
  phone: string
  isActive: boolean
  createdAt: string
  ownerships: any[]
  siteAccess: SiteAccess[]
}

export interface SiteAccess {
  role: string
  assignedAt: string
  restaurantSite: RestaurantSite
}

export interface RestaurantSite {
  id: string
  siteCode: string
  isActive: boolean
  restaurant: Restaurant
}

export interface Restaurant {
  id: string
  name: string
}
