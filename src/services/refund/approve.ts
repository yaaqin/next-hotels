import { axiosPrivate } from "@/src/libs/instance"

export interface ApproveRefundResponse {
  success: boolean
  message: string
  data: {
    bookingCode: string
    status: string
  }
}

export const approveRefund = async (bookingCode: string): Promise<ApproveRefundResponse> => {
  const res = await axiosPrivate.patch(`/refund/${bookingCode}/approve`)
  return res.data
}