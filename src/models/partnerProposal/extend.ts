export interface ExtendProposalReq {
  id: string
  endDate: string
  note?: string
}

export interface ExtendProposalRes {
  success: boolean
  message: string
  data: {
    id: string
    status: string
    startDate: string
    endDate: string
  }
}
