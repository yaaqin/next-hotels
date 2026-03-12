import { axiosUser } from "@/src/libs/instance"

export const bookingCheckout = async (bookingCode: string): Promise<void> => {
  const res = await axiosUser.patch(`/user/recent-activity/${bookingCode}/checkout`)

  if (!res) {
    throw new Error('Failed to check in')
  }

  return res.data
}