import { axiosPrivate } from "@/src/libs/instance"

export const assignResto = async ({ restaurantAdminId, restaurantId }: { restaurantAdminId: string, restaurantId: string }) => {
  const res = await axiosPrivate.post(`/restaurant-admin/${restaurantAdminId}/assign-resto`, { restaurantId })
  return res.data
}