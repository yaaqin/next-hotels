import { axiosUser } from "@/src/libs/instance"

export interface CancelConfirmResponse {
  success: boolean
  message: string
  data: {
    bookingCode: string
    status: string
  }
}

export const postCancelConfirm = async (
  bookingCode: string,
  previewToken: string,
): Promise<CancelConfirmResponse> => {
  const res = await axiosUser.post(
    `/user/recent-activity/${bookingCode}/cancel-confirm`,
    { previewToken },
  )
  return res.data
}