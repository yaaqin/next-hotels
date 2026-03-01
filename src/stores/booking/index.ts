import { create } from 'zustand'

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

// roomId opsional — diisi setelah user select room di /reservation
export interface BookingItem {
  roomTypeId: string
  roomId?: string
}

export interface BookingPayload {
  siteCode: string
  checkInDate: string
  checkOutDate: string
  paymentMethod: PaymentMethod | null
  contact: BookingContact
  items: BookingItem[]
}

// Display info dari list page — tidak dikirim ke API
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

  // Step 1 — dari list page
  setStay: (data: { siteCode: string; checkInDate: string; checkOutDate: string }) => void
  setItem: (item: Pick<BookingItem, 'roomTypeId'>) => void

  // Step 2 — user select room di /reservation
  setRoomId: (roomTypeId: string, roomId: string) => void

  // Step 3 — form kontak
  setContact: (contact: Partial<BookingContact>) => void

  // Step 4 — pilih payment
  setPaymentMethod: (method: PaymentMethod) => void

  // Display info
  setRoomDetail: (detail: BookingDisplayDetail) => void

  // Utils
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

export const useBookingStore = create<BookingStore>((set, get) => ({
  payload: initialPayload,
  displayDetail: null,

  setStay: ({ siteCode, checkInDate, checkOutDate }) =>
    set((state) => ({
      payload: { ...state.payload, siteCode, checkInDate, checkOutDate },
    })),

  // Dari list page — cukup roomTypeId, replace kalau sudah ada
  setItem: ({ roomTypeId }) =>
    set((state) => {
      const exists = state.payload.items.some((i) => i.roomTypeId === roomTypeId)
      if (exists) return state
      return {
        payload: {
          ...state.payload,
          items: [{ roomTypeId }], // 1 kamar per booking untuk sekarang
        },
      }
    }),

  // Dari select room di /reservation — resolve roomId
  setRoomId: (roomTypeId, roomId) =>
    set((state) => ({
      payload: {
        ...state.payload,
        items: state.payload.items.map((i) =>
          i.roomTypeId === roomTypeId ? { ...i, roomId } : i
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

  // Siap submit kalau roomId sudah di-resolve
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
}))