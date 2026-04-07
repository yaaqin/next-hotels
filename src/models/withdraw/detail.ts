export interface detailWdProps {
  success: boolean
  message: string
  data: detailWdState
}

export interface detailWdState {
  id: string
  amountIdr: number
  rateSnapshot: number
  amountSgt: number
  walletAddress: string
  status: string
  txHash: any
  note: any
  requestedAt: string
  processedAt: any
  user: User
  credit: Credit
  admin: any
  backingLog: any
}

export interface User {
  id: string
  name: string
  email: string
  phone: any
}

export interface Credit {
  id: string
  code: string
}
