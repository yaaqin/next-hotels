import { axiosUser } from "@/src/libs/instance";

export interface CreateFoodOrderPayload {
  restaurantSiteId: string;
  tableNote: string;
  note?: string;
  // Metode katalog FOOD (bca, qris, qris_dpay, va_dpay, ...)
  paymentMethod?: string;
  items: { productId: string; quantity: number; note?: string }[];
}

export interface CreateFoodOrderResponse {
  success: boolean;
  data: {
    orderId: string;
    orderCode: string;
    totalAmount: number;
    // Midtrans → Snap; DPAY → null, tamu bayar di /food/order/[id]
    snapToken: string | null;
    paymentUrl: string | null;
  };
}

export const createFoodOrder = async (payload: CreateFoodOrderPayload) => {
  const res = await axiosUser.post<CreateFoodOrderResponse>('/food-order', payload);
  return res.data;
};
