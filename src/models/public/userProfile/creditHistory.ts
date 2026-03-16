export interface userCreditHistoryProps {
  success: boolean
  message: string
  data: userCreditHistoryState
}

export interface userCreditHistoryState {
  balance: number
  expiredAt: string
  status: string
  logs: Log[]
}

export interface Log {
  id: string
  type: string
  amount: number
  balanceAfter: number
  sourceType: string
  sourceId: string
  note: string
  createdAt: string
}
