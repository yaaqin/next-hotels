import { axiosUser } from "@/src/libs/instance"
import { rechAvlbDateProps } from "@/src/models/reschedule/rescAvlbDate"

export const getRescheduleAvailableDates = async (id: string): Promise<rechAvlbDateProps> => {
  const res = await axiosUser.get(`/booking/${id}/reschedule/available-dates`)

  if (!res) {
    throw new Error('fail to get list reschedule available dates')
  }

  const data = await res.data
  return data
}