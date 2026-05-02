export interface partnerProposalListProps {
  success: boolean
  message: string
  data: partnerProposalListState[]
}

export interface partnerProposalListState {
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
}

export interface RestaurantSite {
  id: string
  siteCode: string
  restaurant: Restaurant
}

export interface Restaurant {
  id: string
  name: string
}

export interface Creator {
  id: string
  username: string
}

export interface Reviewer {
  id: string
  username: string
}
