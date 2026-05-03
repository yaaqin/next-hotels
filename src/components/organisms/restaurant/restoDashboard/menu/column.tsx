export type MenuRestoRow = {
  id: string
  basePrice: number
  isActive: boolean
  createdAt: string
  name: string
  description: string
  lang: string
  images: { id: string; url: string; order: number }[]
  category: { id: string; code: string; name: string }
  discountRules: any[]
}

export const columns = [
  { key: "image", label: "Gambar" },
  { key: "name", label: "Nama" },
  { key: "category", label: "Kategori" },
  { key: "basePrice", label: "Harga" },
  { key: "discountRules", label: "Diskon" },
  { key: "isActive", label: "Status" },
]