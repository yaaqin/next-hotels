import { axiosPrivate } from "@/src/libs/instance"
import { facilityItemslistProps } from "@/src/models/facilities/listitems"

export const facilityItemList = async (): Promise<facilityItemslistProps> => {
  const res = await axiosPrivate.get(`/facility-items`)

  if (!res) {
    throw new Error('fail to get list facility items')
  }

  const data = await res.data
  return data
}