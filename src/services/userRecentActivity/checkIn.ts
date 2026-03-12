import { axiosUser } from "@/src/libs/instance"

export const bookingCheckIn = async (bookingCode: string): Promise<void> => {
  const res = await axiosUser.patch(`/user/recent-activity/${bookingCode}/checkin`)

  if (!res) {
    throw new Error('Failed to check in')
  }

  return res.data
}