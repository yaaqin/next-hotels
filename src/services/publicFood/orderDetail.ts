import { axiosUser } from "@/src/libs/instance"

export interface FoodOrderDetail {
  id: string
  orderCode: string
  status: string // PENDING | CONFIRMED | IN_PROGRESS | READY | COMPLETED | CANCELLED
  totalAmount: number
  note: string | null
  createdAt: string
  items: { id: string; productName: string; quantity: number; finalPrice: number; subtotal: number }[]
  payment: {
    method: string | null // QRIS_DPAY | VA_DPAY | method Midtrans (diisi webhook)
    status: string // PENDING | SUCCESS | FAILED | EXPIRED
    amount: number
    vaNumber: string | null
    vaBank: string | null
    qrisUrl: string | null
    expiredAt: string | null
    paidAt: string | null
  } | null
  restaurantSite: { restaurant: { name: string } }
}

export const getFoodOrderDetail = async (orderId: string): Promise<{ success: boolean; data: FoodOrderDetail }> => {
  const res = await axiosUser.get(`/food-order/${orderId}`)
  return res.data
}
