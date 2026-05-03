import { axiosPrivate } from "@/src/libs/instance"
import { foodCategoryListProps } from "@/src/models/foodCategory/list"

export const foodCategoryList = async (): Promise<foodCategoryListProps> => {
  const res = await axiosPrivate.get(`/food-category`)

  if (!res) {
    throw new Error('fail to get list menu')
  }

  const data = await res.data
  return data
}