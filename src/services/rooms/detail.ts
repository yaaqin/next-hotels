import { axiosPrivate } from "@/src/libs/instance"
import { detailRoomProps } from "@/src/models/room/detail"

export const roomDetail = async (id: string): Promise<detailRoomProps> => {
  const res = await axiosPrivate.get(`/rooms/${id}`)

  if (!res) {
    throw new Error('fail to get detail room')
  }

  const data = await res.data
  return data
}