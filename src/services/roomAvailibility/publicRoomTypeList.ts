import { axiosPublic } from "@/src/libs/instance"
import { roomListAvailableProps } from "@/src/models/public/roomAvailibility/listRoomType"

export const publicRoomAvailibility = async (check_in: string, checkOut: string, siteCode: string): Promise<roomListAvailableProps> => {
  const res = await axiosPublic.get(`/public/room-availability`, {
    params: { check_in, check_out: checkOut, site_code: siteCode },
  })

  if (!res) {
    throw new Error('fail to get list availibility room')
  }

  const data = await res.data
  return data
}