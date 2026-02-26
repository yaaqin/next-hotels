import { facilityGroupListProps } from "@/src/models/facilities/listGroups"
import { axiosPrivate } from "@/src/libs/instance"

export const facilityGroupList = async (): Promise<facilityGroupListProps> => {
  const res = await axiosPrivate.get(`/facility-groups`)

  if (!res) {
    throw new Error('fail to get list facility Groups')
  }

  const data = await res.data
  return data
}