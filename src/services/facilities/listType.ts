import { axiosPrivate } from "@/src/libs/instance"
import { facilitytTypeProps } from "@/src/models/facilities/listType"

export const facilityTypeList = async (): Promise<facilitytTypeProps> => {
  const res = await axiosPrivate.get(`/facility-types`)

  if (!res) {
    throw new Error('fail to get list facility type')
  }

  const data = await res.data
  return data
}