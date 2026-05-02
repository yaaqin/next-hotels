export interface restaurantListProps {
  success: boolean
  message: string
  data: restaurantListState[]
}

export interface restaurantListState {
  id: string
  name: string
  description: string
  logoUrl: string
  isActive: boolean
  createdAt: string
  ownerships: Ownership[]
  restaurantSites: RestaurantSite[]
}

export interface Ownership {
  restaurantAdmin: RestaurantAdmin
  assignedAt: string
}

export interface RestaurantAdmin {
  id: string
  name: string
  email: string
}

export interface RestaurantSite {
  id: string
  siteCode: string
  isActive: boolean
  site: Site
}

export interface Site {
  nama: string
  lokasi: string
}
