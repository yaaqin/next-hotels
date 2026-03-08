import { axiosPrivate } from "@/src/libs/instance"

export interface CreateFacilityGroupPayload {
  note: string
  facility: string[]
}

export const createFacilityGroup = async (payload: CreateFacilityGroupPayload) => {
  const res = await axiosPrivate.post(`/facility-groups`, payload)

  if (!res) throw new Error('fail to create facility group')

  return res.data
}