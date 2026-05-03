import { axiosPrivate } from "@/src/libs/instance"

export const assignOwner = async ({ restaurantId, restaurantAdminId }: { restaurantId: string, restaurantAdminId: string }) => {
  const res = await axiosPrivate.post(`/restaurant/${restaurantId}/owner`, { restaurantAdminId })
  return res.data
}