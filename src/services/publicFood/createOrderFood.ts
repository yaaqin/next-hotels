import { axiosUser } from "@/src/libs/instance";

export interface CreateFoodOrderPayload {
  restaurantSiteId: string;
  tableNote: string;
  note?: string;
  items: { productId: string; quantity: number; note?: string }[];
}

export interface CreateFoodOrderResponse {
  success: boolean;
  data: {
    orderId: string;
    orderCode: string;
    totalAmount: number;
    snapToken: string;
    paymentUrl: string;
  };
}

export const createFoodOrder = async (payload: CreateFoodOrderPayload) => {
  const res = await axiosUser.post<CreateFoodOrderResponse>('/food-order', payload);
  return res.data;
};