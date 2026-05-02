import { axiosPrivate } from "@/src/libs/instance"
import { adminRestoListProps } from "@/src/models/adminResto/list"

export const AdminRestoList = async (): Promise<adminRestoListProps> => {
  const res = await axiosPrivate.get(`/restaurant-admin`)

  if (!res) {
    throw new Error('fail to get list admin resto')
  }

  const data = await res.data
  return data
}