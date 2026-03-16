import { axiosUser } from "@/src/libs/instance"

export type RefundType = 'CREDIT' | 'CASH'

export interface RefundPayload {
  refundType: RefundType
  reason?: string
}

export interface RefundResponse {
  success: boolean
  message: string
  data: {
    bookingCode: string
    refundType: RefundType
    refundAmount: number
    status: string
  }
}

export const postRefund = async (
  bookingCode: string,
  payload: RefundPayload,
): Promise<RefundResponse> => {
  const res = await axiosUser.post(`/refund/${bookingCode}`, payload)
  return res.data
}