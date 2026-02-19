import { axiosPrivate } from "@/src/libs/instance"
import { roomListProps } from "@/src/models/room/list"

export const roomList = async (): Promise<roomListProps> => {
  const res = await axiosPrivate.get(`/rooms`)

  if (!res) {
    throw new Error('fail to get list rooms')
  }

  const data = await res.data
  return data
}