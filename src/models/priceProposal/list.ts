export interface listPriceProposalProps {
  success: boolean
  message: string
  data: listPriceProposalState[]
}

export interface listPriceProposalState {
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
  createdBy: string
  translations: Translation[]
}

export interface Translation {
  id: string
  roomTypeId: string
  lang: string
  name: string
  desk: string
}

export interface Rule {
  id: string
  priceProposalItemId: string
  ruleType: string
  startDate?: string
  endDate?: string
  date?: string
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
