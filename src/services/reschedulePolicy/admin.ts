import { axiosPrivate } from "@/src/libs/instance"
import { reschedulePolicyListProps, reschedulePolicyPayload } from "@/src/models/reschedulePolicy/list"

export const reschedulePolicyList = async (): Promise<reschedulePolicyListProps> => {
  const res = await axiosPrivate.get(`/reschedule-policies`)
  return res.data
}

export const createReschedulePolicy = async (payload: reschedulePolicyPayload) => {
  const res = await axiosPrivate.post(`/reschedule-policies`, payload)
  return res.data
}

export const updateReschedulePolicy = async ({ id, ...payload }: Partial<reschedulePolicyPayload> & { id: string }) => {
  const res = await axiosPrivate.patch(`/reschedule-policies/${id}`, payload)
  return res.data
}

export const deleteReschedulePolicy = async (id: string) => {
  const res = await axiosPrivate.delete(`/reschedule-policies/${id}`)
  return res.data
}
