import { axiosPrivate } from "@/src/libs/instance"
import { roomListProps } from "@/src/models/room/list"

export interface RoomListParams {
  siteCode?: string
  floor?: string
  roomType?: string
  lang?: string
}

export const roomList = async (params?: RoomListParams): Promise<roomListProps> => {
  const res = await axiosPrivate.get(`/rooms`, {
    params,
    headers: {
      'x-lang': params?.lang ?? 'id',
    },
  })

  if (!res) {
    throw new Error('fail to get list rooms')
  }

  return res.data
}