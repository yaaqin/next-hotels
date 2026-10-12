export interface refundPolicyListProps {
  success: boolean
  message: string
  data: refundPolicyItem[]
}

// Range inclusive H-minDays s/d H-maxDays (null = tanpa batas atas), dihitung saat tamu cancel
export interface refundPolicyItem {
  id: string
  name: string
  minDays: number
  maxDays: number | null
  refundPercent: number // % nilai booking yang dikembalikan
  allowCredit: boolean
  allowCash: boolean
  isActive: boolean
  createdAt: string
  createdBy: string
}

export interface refundPolicyPayload {
  name: string
  minDays: number
  maxDays: number | null
  refundPercent: number
  allowCredit: boolean
  allowCash: boolean
  isActive: boolean
}
