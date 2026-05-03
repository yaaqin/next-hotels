import { axiosPrivate } from "@/src/libs/instance"
import { menuRestoProps } from "@/src/models/restaurant/restoDashboard/menu/list"

export const menuRestoList = async (): Promise<menuRestoProps> => {
  const res = await axiosPrivate.get(`/resto-data/product`)

  if (!res) {
    throw new Error('fail to get list menu resto')
  }

  const data = await res.data
  return data
}