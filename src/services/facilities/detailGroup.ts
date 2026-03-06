import { axiosPrivate } from "@/src/libs/instance"
import { detailFacilityGroupProps } from "@/src/models/facilities/detailFacilityGroup"

export const facilityGroupDetail = async (id: string): Promise<detailFacilityGroupProps> => {
  const res = await axiosPrivate.get(`/facility-groups/${id}`)

  if (!res) {
    throw new Error('fail to get detail facility group')
  }

  const data = await res.data
  return data
}