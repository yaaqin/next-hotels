import { axiosPrivate } from "@/src/libs/instance"
import { detailRoomTypeProps } from "@/src/models/roomTypes/detail"

export const roomTypeDetail = async (id: string): Promise<detailRoomTypeProps> => {
  const res = await axiosPrivate.get(`/room-types/${id}`)

  if (!res) {
    throw new Error('fail to get detail room type')
  }

  const data = await res.data
  return data
}