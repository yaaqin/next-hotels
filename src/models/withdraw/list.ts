export interface withdrawListProps {
  success: boolean
  message: string
  data: withdrawListState[]
}

export interface withdrawListState {
  id: string
  amountIdr: number
  rateSnapshot: number
  amountSgt: number
  walletAddress: string
  status: string
  txHash: string
  requestedAt: string
  processedAt: string
  user: User
}

export interface User {
  id: string
  name: string
  email: string
}
