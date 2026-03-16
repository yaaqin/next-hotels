import { axiosUser } from "@/src/libs/instance"

export interface CancelPreviewData {
  bookingCode: string
  siteName: string
  checkInDate: string
  checkOutDate: string
  daysBeforeCheckIn: number
  policy: {
    id: string
    name: string
    minDays: number
    maxDays: number
  }
  originalAmount: number
  refundPercent: number
  refundAmount: number
  penaltyAmount: number
  allowCredit: boolean
  allowCash: boolean
  previewToken: string
  tokenExpiresAt: string
}

export interface CancelPreviewResponse {
  success: boolean
  message: string
  data: CancelPreviewData
}

export const getCancelPreview = async (bookingCode: string): Promise<CancelPreviewResponse> => {
  const res = await axiosUser.get(`/user/recent-activity/${bookingCode}/cancel-preview`)
  return res.data
}