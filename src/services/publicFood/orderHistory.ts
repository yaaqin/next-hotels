import { axiosUser } from "@/src/libs/instance"
import { orderFoodHistoryProps } from "@/src/models/public/food/orderHistory"

export const foodOrderHistoryList = async (): Promise<orderFoodHistoryProps> => {
  const res = await axiosUser.get(`/food-order/history`)

  if (!res) {
    throw new Error('fail to get list history food order')
  }

  const data = await res.data
  return data
}