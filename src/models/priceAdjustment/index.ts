export type AdjustmentType = 'FIXED_PRICE' | 'PERCENTAGE' | 'FIXED_AMOUNT'
export type AdjustmentStatus = 'DRAFT' | 'APPROVED' | 'REJECTED'

interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
}

export interface priceAdjustmentItem {
  id: string
  roomTypeId: string
  // null = semua kamar tipe ini
  roomId: string | null
  adjustment: AdjustmentType
  value: number
  roomType: { id: string; name: string | null }
  room: { id: string; number: string; floorId: string } | null
}

interface adminRef {
  id: string
  username: string
  email: string
}

export interface priceAdjustmentState {
  id: string
  title: string
  description: string | null
  siteCode: string
  startDate: string
  endDate: string
  status: AdjustmentStatus
  createdAt: string
  reviewedAt: string | null
  reviewNote: string | null
  items: priceAdjustmentItem[]
  creator: adminRef
  reviewer: adminRef | null
}

// Tanggal yang belum ditutup proposal APPROVED (per tipe)
export interface uncoveredDates {
  roomTypeId: string
  dates: string[]
}

export interface priceAdjustmentDetailState extends priceAdjustmentState {
  uncovered: uncoveredDates[]
}

export type priceAdjustmentListProps = ApiResponse<priceAdjustmentState[]>
export type priceAdjustmentDetailProps = ApiResponse<priceAdjustmentDetailState>

export interface adjustmentRoomOption {
  id: string
  number: string
  floorId: string
}

export interface adjustmentRoomTypeOption {
  id: string
  name: string | null
  rooms: adjustmentRoomOption[]
}

export type priceAdjustmentOptionsProps = ApiResponse<{ siteCode: string; roomTypes: adjustmentRoomTypeOption[] }>

export type calendarTypeCell =
  | { roomTypeId: string; hasProposal: false }
  | {
      roomTypeId: string
      hasProposal: true
      basePrice: number
      proposalPrice: number
      price: number
      adjustmentId: string | null
      roomOverrides: { roomId: string; number: string; price: number; adjustmentId: string | null }[]
    }

export interface priceCalendarState {
  siteCode: string
  start: string
  end: string
  previewAdjustmentId: string | null
  roomTypes: adjustmentRoomTypeOption[]
  days: { date: string; types: calendarTypeCell[] }[]
}

export type priceCalendarProps = ApiResponse<priceCalendarState>

export interface priceAdjustmentPayload {
  site_code?: string
  title: string
  description?: string
  start_date: string
  end_date: string
  items: {
    room_type_id: string
    room_ids?: string[]
    adjustment: AdjustmentType
    value: number
  }[]
}

export interface priceCalendarQuery {
  siteCode?: string
  start: string
  end: string
  roomTypeId?: string
  adjustmentId?: string
}
