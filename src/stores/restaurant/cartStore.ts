import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { menuRestoPublicState } from "@/src/models/public/menuResto/list";

export interface CartItem {
  id: string;
  name: string;
  basePrice: number;
  finalPrice: number;
  quantity: number;
  image?: string;
  restaurantSiteId: string;
  restaurantName: string;
}

interface CartStore {
  items: CartItem[];
  addItem: (product: menuRestoPublicState) => void;
  removeItem: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  clearCart: () => void;
  totalItems: () => number;
  totalPrice: () => number;
}

const calcFinalPrice = (product: menuRestoPublicState): number => {
  const now = new Date();
  const activeDiscount = product.discountRules.find((d) => {
    const start = d.startDate ? new Date(d.startDate) : null;
    const end = d.endDate ? new Date(d.endDate) : null;
    if (start && now < start) return false;
    if (end && now > end) return false;
    return true;
  });

  if (!activeDiscount) return product.basePrice;

  if (activeDiscount.type === "FIXED_PRICE") return activeDiscount.value;
  if (activeDiscount.type === "PERCENTAGE")
    return product.basePrice - (product.basePrice * activeDiscount.value) / 100;

  return product.basePrice;
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product) => {
        const finalPrice = calcFinalPrice(product);
        set((state) => {
          const existing = state.items.find((i) => i.id === product.id);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
              ),
            };
          }
          return {
            items: [
              ...state.items,
              {
                id: product.id,
                name: product.name,
                basePrice: product.basePrice,
                finalPrice,
                quantity: 1,
                image: product.images[0]?.url,
                restaurantSiteId: product.restaurantSite.id,
                restaurantName: product.restaurantSite.restaurant.name,
              },
            ],
          };
        });
      },

      removeItem: (id) =>
        set((state) => ({ items: state.items.filter((i) => i.id !== id) })),

      updateQty: (id, qty) => {
        if (qty <= 0) {
          get().removeItem(id);
          return;
        }
        set((state) => ({
          items: state.items.map((i) => (i.id === id ? { ...i, quantity: qty } : i)),
        }));
      },

      clearCart: () => set({ items: [] }),
      totalItems: () => get().items.reduce((acc, i) => acc + i.quantity, 0),
      totalPrice: () => get().items.reduce((acc, i) => acc + i.finalPrice * i.quantity, 0),
    }),
    {
      name: "cart-session",
      storage: createJSONStorage(() => sessionStorage), // ← ilang kalau tab ditutup
    }
  )
);