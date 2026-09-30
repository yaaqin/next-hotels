'use client'

import type { ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { useBookingStore } from '@/src/stores/booking'

export interface RoomReserveData {
  siteCode: string
  roomId: string
  roomTypeId: string
  roomTypeName: string
  imageUrl: string
  pricePerNight: number
  nights: number
  totalPrice: number
}

export type ReserveState = 'ready' | 'pickDates' | 'unavailable'

interface Props {
  state: ReserveState
  booking: RoomReserveData
  checkin: string
  checkout: string
  labels: { reserve: string; pickDates: string; unavailable: string }
  // Harga & keterangan dirender di server (PriceTag), di sini cuma ditempel
  summary?: ReactNode
}

// Satu-satunya bagian interaktif RDP. Login tidak diminta di sini —
// halaman /reservation yang menampilkan gate login, jadi RDP tetap terbuka untuk crawler.
export default function RoomReserveBar({ state, booking, checkin, checkout, labels, summary }: Props) {
  const router = useRouter()
  const { setStay, setItem, setRoomId, setRoomDetail } = useBookingStore()

  const handleReserve = () => {
    setStay({ siteCode: booking.siteCode, checkInDate: checkin, checkOutDate: checkout })
    setItem({ roomTypeId: booking.roomTypeId, imageUrl: booking.imageUrl })
    setRoomId(booking.roomTypeId, booking.roomId, booking.imageUrl)
    setRoomDetail({
      roomTypeName: booking.roomTypeName,
      pricePerNight: booking.pricePerNight,
      nights: booking.nights,
      totalPrice: booking.totalPrice,
    })
    router.push('/reservation')
  }

  return (
    <div className="sticky bottom-0 z-40 border-t border-[#DCE6F2] bg-white/95 backdrop-blur-sm">
      <div className="max-w-4xl mx-auto px-5 py-4 flex items-center justify-between gap-4">
        <div className="min-w-0">{summary}</div>
        {state === 'ready' ? (
          <button
            type="button"
            onClick={handleReserve}
            className="shrink-0 px-6 py-3.5 rounded-2xl text-sm font-semibold tracking-wide text-white bg-[#05111F] hover:bg-[#0A1E38] transition-colors"
          >
            {labels.reserve}
          </button>
        ) : (
          <a
            href={state === 'pickDates' ? '#stay-dates' : undefined}
            aria-disabled={state === 'unavailable'}
            className="shrink-0 px-6 py-3.5 rounded-2xl text-sm font-semibold tracking-wide text-gray-500 bg-gray-100 text-center"
          >
            {state === 'pickDates' ? labels.pickDates : labels.unavailable}
          </a>
        )}
      </div>
    </div>
  )
}
