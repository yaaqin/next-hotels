import { axiosPublic } from "@/src/libs/instance"
import { roomNumberListProps } from "@/src/models/public/roomAvailibility/listRoomNumber"

export const publicRoomNumberAvailibility = async (check_in: string, checkOut: string, typeId: string): Promise<roomNumberListProps> => {
  const res = await axiosPublic.get(`/public/room-availability/rooms?check_in=${check_in}&check_out=${checkOut}&room_type_id=${typeId}`)

  if (!res) {
    throw new Error('fail to get list availibility room Number ')
  }

  const data = await res.data
  return data
}