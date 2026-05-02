export interface detailPartnerProposalProps {
  success: boolean
  message: string
  data: detailPartnerProposalState
}

export interface detailPartnerProposalState {
  id: string
  type: string
  status: string
  flatFeeMonthly: number
  monthlyCapIdr: number
  surchargeAfterCapPct: number
  revenueSharePct: any
  freePeriodDays: number
  startDate: string
  note: string
  createdAt: string
  reviewedAt: string
  reviewNote: string
  restaurantSite: RestaurantSite
  creator: Creator
  reviewer: Reviewer
  billings: any[]
}

export interface RestaurantSite {
  id: string
  siteCode: string
  restaurant: Restaurant
  site: Site
}

export interface Restaurant {
  id: string
  name: string
}

export interface Site {
  nama: string
  lokasi: string
}

export interface Creator {
  id: string
  username: string
}

export interface Reviewer {
  id: string
  username: string
}
