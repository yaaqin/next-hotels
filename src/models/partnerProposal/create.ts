export enum ProposalType {
  SUBSCRIPTION = 'SUBSCRIPTION',
  REVENUE_SHARE = 'REVENUE_SHARE',
}

export interface CreateProposalReq {
  restaurantSiteId: string
  type: ProposalType
  flatFeeMonthly: number | null
  monthlyCapIdr: number | null
  surchargeAfterCapPct: number | null
  revenueSharePct: number | null
  freePeriodDays: number | null
  startDate: string
  note: string
}

export interface CreateProposalRes {
  success: boolean
  message: string
  data: {
    id: string
    restaurantSiteId: string
    type: string
    flatFeeMonthly: number | null
    monthlyCapIdr: number | null
    surchargeAfterCapPct: number | null
    revenueSharePct: number | null
    freePeriodDays: number | null
    startDate: string
    note: string
    createdAt: string
  }
}