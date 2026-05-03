import { axiosPrivate } from "@/src/libs/instance"
import { adminRestoListProps } from "@/src/models/restaurant/restoDashboard/adminResto/list"

export const adminRestoList = async (): Promise<adminRestoListProps> => {
  const res = await axiosPrivate.get(`/resto-data/restaurant/admins`)

  if (!res) {
    throw new Error('fail to get list resto')
  }

  const data = await res.data
  return data
}