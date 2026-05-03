export interface adminRestoListProps {
  success: boolean
  message: string
  data: adminRestoState
}

export interface adminRestoState {
  restaurant: Restaurant
  owners: Owner[]
  staff: Staff[]
}

export interface Restaurant {
  id: string
  name: string
}

export interface Owner {
  id: string
  name: string
  email: string
  phone: string
  isActive: boolean
  role: string
  assignedAt: string
  site: any
}

export interface Staff {
  id: string
  name: string
  email: string
  phone: string
  isActive: boolean
  role: string
  assignedAt: string
  site: any
}
