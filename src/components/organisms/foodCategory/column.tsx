export type FoodCategoryRow = {
  id: string
  code: string
  isGlobal: boolean
  status: string
  isActive: boolean
  createdAt: string
  reviewedAt: any
  reviewNote: any
  name: string
  description: string
  lang: string
  restaurantAdmin: any
  reviewer: any
}

export const columns = [
  { key: "code", label: "Kode" },
  { key: "name", label: "Nama" },
  { key: "description", label: "Deskripsi" },
  { key: "isGlobal", label: "Tipe" },
  { key: "status", label: "Status" },
  { key: "createdAt", label: "Dibuat" },
]