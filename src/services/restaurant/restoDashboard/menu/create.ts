import { axiosPrivate } from "@/src/libs/instance"

export const createMenu = async (payload: {
  foodCategoryId: string
  basePrice: number
  name: string
  description?: string
  files: File[]
}) => {
  const formData = new FormData()
  formData.append('foodCategoryId', payload.foodCategoryId)
  formData.append('basePrice', String(payload.basePrice))
  formData.append('name', payload.name)
  if (payload.description) formData.append('description', payload.description)
  payload.files.forEach((file) => formData.append('files', file))

  const res = await axiosPrivate.post('/resto-data/product', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return res.data
}