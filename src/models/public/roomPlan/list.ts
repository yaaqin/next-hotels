export interface roomPlanListProps {
  success: boolean
  data: roomPlanListState
}

export interface roomPlanListState {
  siteCode: string
  checkIn: string
  checkOut: string
  nights: number
  gridMeta: GridMeta
  floors: Floor[]
}

export interface GridMeta {
  cols: number
  rows: number
  colLabels: string[]
  rowRightLabels: RowRightLabels
  rowBottomLabels: string[]
}

export interface RowRightLabels {
  "0": string
  "1": string
  "2": string
  "3": string
}

export interface Floor {
  floorId: string
  floorName: string
  typeMapping: TypeMapping[]
  rooms: Room[]
  specialCells: SpecialCell[]
}

export interface TypeMapping {
  gridType: number
  roomTypeId: string
  roomTypeName: string
  basePrice: number
}

export interface Room {
  roomId: string
  roomNumber: string
  wing: string
  floorId: string
  gridType: number
  gridRow: number
  gridCol: number
  isAvailable: boolean
  status: string
  roomTypeId: string
  roomTypeName: string
  bedTypeName: string
  pricing: any
}

export interface SpecialCell {
  gridRow: number
  gridCol: number
  label: string
}
