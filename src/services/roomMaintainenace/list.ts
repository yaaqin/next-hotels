import { axiosPrivate } from "@/src/libs/instance"
import { roomMaintainenaceListProps } from "@/src/models/roomMaintenance/list"


export const roomMaintainList = async (): Promise<roomMaintainenaceListProps> => {
  const res = await axiosPrivate.get(`/maintenances`)

  if (!res) {
    throw new Error('fail to get list rooms Maintenance')
  }

  return res.data
}