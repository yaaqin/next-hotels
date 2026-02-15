import { axiosPrivate } from "@/src/libs/instance"
import { roomTypeLIstProps } from "@/src/models/roomTypes/list"

export const roomTypeList = async (): Promise<roomTypeLIstProps> => {
  const res = await axiosPrivate.get(`/room-types`)

  if (!res) {
    throw new Error('fail to get list room type')
  }

  const data = await res.data
  return data
}