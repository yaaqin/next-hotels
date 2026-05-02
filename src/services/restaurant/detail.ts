import { axiosPrivate } from "@/src/libs/instance"
import { detailRestoProps } from "@/src/models/restaurant/detail"

export const restoDetail = async (id: string): Promise<detailRestoProps> => {
  const res = await axiosPrivate.get(`/restaurant/${id}`)

  if (!res) {
    throw new Error('fail to get detail resto')
  }

  const data = await res.data
  return data
}