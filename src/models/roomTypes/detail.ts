export interface detailRoomTypeProps {
  success: boolean
  message: string
  data: detailRoomTypeState
}

export interface detailRoomTypeState {
  id: string
  createdAt: string
  createdBy: string
  name: string
  desk: string
}
