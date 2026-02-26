export interface DetailPriceProposalProps {
  success: boolean
  message: string
  data: detailPriceProposalState
}

export interface detailPriceProposalState {
  id: string
  title: string
  description: string
  startDate: string
  endDate: string
  status: string
  createdAt: string
  createdBy: string
  items: Item[]
  creator: Creator
}

export interface Item {
  id: string
  priceProposalId: string
  roomTypeId: string
  basePrice: number
  createdAt: string
  createdBy: string
  roomType: RoomType
  rules: Rule[]
}

export interface RoomType {
  id: string
  createdAt: string
  name: string
  desk: string
}

export interface Rule {
  id: string
  priceProposalItemId: string
  ruleType: "SPECIFIC_DATE" | "DATE_RANGE" | "WEEKEND";
  startDate?: string
  endDate?: string
  date?: string
  adjustment: string
  value: number
  priority: number
  createdAt: string
  createdBy: string
  conflictsAsA: ConflictsAsA[]
  conflictsAsB: ConflictsAsB[]
}

export interface ConflictsAsA {
  id: string
  ruleIdA: string
  ruleIdB: string
  conflictType: string
  note: any
  createdAt: string
  createdBy: string
  ruleB: RuleB
}

export interface RuleB {
  id: string
  priceProposalItemId: string
  ruleType: string
  startDate: string
  endDate: string
  date: any
  adjustment: string
  value: number
  priority: number
  createdAt: string
  createdBy: string
}

export interface ConflictsAsB {
  id: string
  ruleIdA: string
  ruleIdB: string
  conflictType: string
  note: any
  createdAt: string
  createdBy: string
  ruleA: RuleA
}

export interface RuleA {
  id: string
  priceProposalItemId: string
  ruleType: string
  startDate: any
  endDate: any
  date: string
  adjustment: string
  value: number
  priority: number
  createdAt: string
  createdBy: string
}

export interface Creator {
  id: string
  username: string
  email: string
}
