export interface reschedulePolicyListProps {
  success: boolean
  message: string
  data: reschedulePolicyItem[]
}

// Range inclusive H-minDays s/d H-maxDays (null = tanpa batas atas).
// minDays=0 & maxDays=0 → hari H, juga dipakai untuk booking CONFIRMED.
export interface reschedulePolicyItem {
  id: string
  name: string
  minDays: number
  maxDays: number | null
  reschedulePercent: number // % nilai booking lama yang dipertahankan
  penaltyPercent: number    // potongan = 100 - reschedulePercent
  isActive: boolean
  createdAt: string
  createdBy: string
}

export interface reschedulePolicyPayload {
  name: string
  minDays: number
  maxDays: number | null
  reschedulePercent: number
  isActive: boolean
}
