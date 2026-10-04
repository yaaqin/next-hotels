import { axiosPublic } from "@/src/libs/instance"

export type PaymentScope = 'BOOKING' | 'FOOD'

// Metode yang aktif di cabang ini (setting config panel: cabang → semua cabang → default)
export const getEnabledPaymentMethods = async (
  scope: PaymentScope,
  siteCode: string,
): Promise<{ success: boolean; message: string; data: string[] }> => {
  const res = await axiosPublic.get(`/public/payment-methods`, { params: { scope, siteCode } })
  return res.data
}
