import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

// ─── Types ────────────────────────────────────────────────────────────────────

export type PaymentMethod = 'bca' | 'bni' | 'bri' | 'mandiri' | 'qris' | 'gopay'
export type IdType = 'KTP' | 'PASSPORT' | 'SIM'

export interface BookingContact {
  fullName: string
  email: string
  phone: string
  idType?: IdType
  idNumber?: string
}

export interface BookingItem {
  roomTypeId: string
  roomId?: string
  imageUrl: string
}

export interface BookingPayload {
  siteCode: string
  checkInDate: string
  checkOutDate: string
  paymentMethod: PaymentMethod | null
  contact: BookingContact
  items: BookingItem[]
}

export interface BookingDisplayDetail {
  roomTypeName: string
  pricePerNight: number
  nights: number
  totalPrice: number
}

// ─── Store ────────────────────────────────────────────────────────────────────

interface BookingStore {
  payload: BookingPayload
  displayDetail: BookingDisplayDetail | null

  setStay: (data: { siteCode: string; checkInDate: string; checkOutDate: string }) => void
  setItem: (item: Pick<BookingItem, 'roomTypeId' | 'imageUrl'>) => void
  setRoomId: (roomTypeId: string, roomId: string, imageUrl: string) => void
  setContact: (contact: Partial<BookingContact>) => void
  setPaymentMethod: (method: PaymentMethod) => void
  setRoomDetail: (detail: BookingDisplayDetail) => void
  isContactValid: () => boolean
  isReadyToSubmit: () => boolean
  reset: () => void
}

// ─── Initial State ────────────────────────────────────────────────────────────

const initialPayload: BookingPayload = {
  siteCode: '',
  checkInDate: '',
  checkOutDate: '',
  paymentMethod: null,
  contact: {
    fullName: '',
    email: '',
    phone: '',
    idType: undefined,
    idNumber: undefined,
  },
  items: [],
}

// ─── Create ───────────────────────────────────────────────────────────────────

export const useBookingStore = create<BookingStore>()(
  persist(
    (set, get) => ({
      payload: initialPayload,
      displayDetail: null,

      setStay: ({ siteCode, checkInDate, checkOutDate }) =>
        set((state) => ({
          payload: { ...state.payload, siteCode, checkInDate, checkOutDate },
        })),

      setItem: (item: Pick<BookingItem, 'roomTypeId' | 'imageUrl'>) =>
        set((state) => {
          const exists = state.payload.items.some((i) => i.roomTypeId === item.roomTypeId)
          if (exists) return state
          return {
            payload: {
              ...state.payload,
              items: [{ roomTypeId: item.roomTypeId, imageUrl: item.imageUrl }],
            },
          }
        }),

      setRoomId: (roomTypeId, roomId, imageUrl) =>
        set((state) => ({
          payload: {
            ...state.payload,
            items: state.payload.items.map((i) =>
              i.roomTypeId === roomTypeId ? { ...i, roomId, imageUrl } : i
            ),
          },
        })),

      setContact: (contact) =>
        set((state) => ({
          payload: {
            ...state.payload,
            contact: { ...state.payload.contact, ...contact },
          },
        })),

      setPaymentMethod: (method) =>
        set((state) => ({
          payload: { ...state.payload, paymentMethod: method },
        })),

      setRoomDetail: (detail) => set({ displayDetail: detail }),

      isContactValid: () => {
        const { fullName, email, phone } = get().payload.contact
        return (
          fullName.trim().length > 0 &&
          /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) &&
          phone.trim().length > 0
        )
      },

      isReadyToSubmit: () => {
        const { siteCode, checkInDate, checkOutDate, paymentMethod, items } = get().payload
        const roomResolved = items.length > 0 && items.every((i) => !!i.roomId)
        return (
          !!siteCode &&
          !!checkInDate &&
          !!checkOutDate &&
          !!paymentMethod &&
          roomResolved &&
          get().isContactValid()
        )
      },

      reset: () => set({ payload: initialPayload, displayDetail: null }),
    }),
    {
      name: 'booking-store', // key di localStorage
      storage: createJSONStorage(() => localStorage),
      // Pilih field mana aja yang mau di-persist
      partialize: (state) => ({
        payload: state.payload,
        displayDetail: state.displayDetail,
      }),
    }
  )
)