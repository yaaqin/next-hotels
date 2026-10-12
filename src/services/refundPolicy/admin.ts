import { axiosPrivate } from "@/src/libs/instance"
import { refundPolicyListProps, refundPolicyPayload } from "@/src/models/refundPolicy/list"

export const refundPolicyList = async (): Promise<refundPolicyListProps> => {
  const res = await axiosPrivate.get(`/refund-policy`)
  return res.data
}

export const createRefundPolicy = async (payload: refundPolicyPayload) => {
  const res = await axiosPrivate.post(`/refund-policy`, payload)
  return res.data
}

export const updateRefundPolicy = async ({ id, ...payload }: Partial<refundPolicyPayload> & { id: string }) => {
  const res = await axiosPrivate.patch(`/refund-policy/${id}`, payload)
  return res.data
}

export const deleteRefundPolicy = async (id: string) => {
  const res = await axiosPrivate.delete(`/refund-policy/${id}`)
  return res.data
}
