export interface detailRestoProps {
  success: boolean
  message: string
  data: detailRestoState
}

export interface detailRestoState {
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
  assignedAt: string
  restaurantAdmin: RestaurantAdmin
}

export interface RestaurantAdmin {
  id: string
  name: string
  email: string
  isActive: boolean
}

export interface RestaurantSite {
  id: string
  siteCode: string
  isActive: boolean
  createdAt: string
  site: Site
  proposals: any[]
}

export interface Site {
  nama: string
  lokasi: string
}
