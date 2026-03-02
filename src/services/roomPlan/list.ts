import { axiosPublic } from "@/src/libs/instance"
import { roomPlanListProps } from "@/src/models/public/roomPlan/list"

export const publicRoomPlanList = async (siteCode: string, check_in: string, checkOut: string): Promise<roomPlanListProps> => {
  const res = await axiosPublic.get(`/public/room-plan?siteCode=${siteCode}&checkIn=${check_in}&checkOut=${checkOut}`)

  if (!res) {
    throw new Error('fail to get list availibility room')
  }

  const data = await res.data
  return data
}