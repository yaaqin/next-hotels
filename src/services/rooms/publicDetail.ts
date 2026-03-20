import { axiosUser } from "@/src/libs/instance"
import { publicRoomDetailProps } from "@/src/models/public/room/detail"

type Params = {
  id: string
  checkin: string 
  checkout?: string
  siteCode?: string
}

const addOneDay = (dateStr: string) => {
  const date = new Date(dateStr)
  date.setDate(date.getDate() + 1)

  return date.toISOString().split("T")[0]
}

export const publicRoomDetail = async ({
  id,
  checkin,
  checkout,
  siteCode = "MERAK",
}: Params): Promise<publicRoomDetailProps> => {
  const finalCheckout = checkout ?? addOneDay(checkin)

  const res = await axiosUser.get(
    `/public/rooms/${id}`,
    {
      params: {
        // siteCode,
        checkin,
        checkout: finalCheckout,
      },
    }
  )

  if (!res?.data) {
    throw new Error("fail to get public detail room type")
  }

  return res.data
}