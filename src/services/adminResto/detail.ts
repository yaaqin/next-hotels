import { axiosPrivate } from "@/src/libs/instance"
import { detailAdminRestoProps } from "@/src/models/adminResto/detail"

export const adminRestoDetail = async (id: string): Promise<detailAdminRestoProps> => {
  const res = await axiosPrivate.get(`/restaurant-admin/${id}`)

  if (!res) {
    throw new Error('fail to get detail boooking')
  }

  const data = await res.data
  return data
}