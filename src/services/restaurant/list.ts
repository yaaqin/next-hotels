import { axiosPrivate } from "@/src/libs/instance"
import { restaurantListProps } from "@/src/models/restaurant/list"

export const restoList = async (): Promise<restaurantListProps> => {
  const res = await axiosPrivate.get(`/restaurant`)

  if (!res) {
    throw new Error('fail to get list resto')
  }

  const data = await res.data
  return data
}