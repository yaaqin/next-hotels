'use client'

import Link from 'next/link'
import { useCallback, useRef } from 'react'
import { usePublicRoomTypeAvailibility } from '@/src/hooks/query/roomAvailibility/publicRoomTypeAvailibility'
import { roomListAvailableState } from '@/src/models/public/roomAvailibility/listRoomType'
import { useTranslation } from 'react-i18next'
import { useBookingStore } from '@/src/stores/booking'
import { useRouter } from 'next/navigation'

// ─── Date Utilities ───────────────────────────────────────────────────────────
function getTodayAndTomorrow() {
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const fmt = (d: Date) =>
        `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

    return { checkin: fmt(today), checkout: fmt(tomorrow) }
}

function formatRupiah(amount: number) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 2,
    }).format(amount)
}

// ─── Skeleton Card ────────────────────────────────────────────────────────────
function SkeletonCard() {
    return (
        <div className="flex-shrink-0 w-[260px] rounded-3xl border border-gray-100 overflow-hidden animate-pulse">
            <div className="h-40 bg-gray-100" />
            <div className="p-4 space-y-2">
                <div className="h-4 w-24 bg-gray-100 rounded-full" />
                <div className="h-3 w-16 bg-gray-100 rounded-full" />
                <div className="h-5 w-32 bg-gray-100 rounded-full" />
                <div className="h-9 w-full bg-gray-100 rounded-xl mt-2" />
            </div>
        </div>
    )
}

// ─── Room Card ────────────────────────────────────────────────────────────────
function RoomCard({
    room,
    checkin,
    checkout,
    onSelect,
}: {
    room: roomListAvailableState
    checkin: string
    checkout: string
    onSelect: (room: roomListAvailableState) => void
}) {
    const { t } = useTranslation()

    return (
        <div className="flex-shrink-0 w-[260px] rounded-3xl border border-gray-100 overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col">
            {/* Image */}
            <div className="relative h-40 bg-gray-100 overflow-hidden">
                {room.imageUrl ? (
                    <img
                        src={room.imageUrl}
                        alt={room.name}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <svg className="w-10 h-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                                d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909" />
                        </svg>
                    </div>
                )}
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-[10px] font-semibold text-gray-600 px-2 py-1 rounded-full border border-gray-100">
                    {room.availability.availableRooms} {t("label.available")}
                </div>
            </div>

            {/* Content */}
            <div className="p-4 flex flex-col flex-grow">
                {/* Name */}
                <h3 className="text-base font-bold text-gray-900">{room.name}</h3>

                {/* Description */}
                <p className="text-[11px] text-gray-400 truncate mt-1">{room.description || `${room.pricing.nights} malam`}</p>

                {/* Spacer — dorong harga & tombol ke bawah */}
                <div className="flex-grow" />

                {/* Price coret */}
                {room.pricing.isDiscounted && room.pricing.originalPrice ? (
                    <p className="text-[11px] text-red-500 line-through">
                        {formatRupiah(room.pricing.originalPrice)}
                    </p>
                ) : (
                    // Placeholder biar tinggi tetap sama waktu gada harga coret
                    <p className="text-[11px] invisible">placeholder</p>
                )}

                {/* Price */}
                <p className="text-sm font-bold text-gray-900">
                    {formatRupiah(room.pricing.price)}
                    <span className="text-[11px] font-normal text-gray-400">/{t("label.night")}</span>
                </p>

                {/* CTA */}
                <div className="pt-2">
                    <button
                        onClick={() => onSelect(room)}
                        className="block w-full text-center bg-white border border-gray-200 text-gray-800 text-xs font-semibold rounded-xl py-2.5 hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-colors duration-200"
                    >
                        {t("label.booking")}
                    </button>
                </div>
            </div>
        </div>
    )
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function RoomTypeCarousel() {
    const { checkin, checkout } = getTodayAndTomorrow()
    const { data, isLoading } = usePublicRoomTypeAvailibility(checkin, checkout)

    const { t } = useTranslation()

    const scrollRef = useRef<HTMLDivElement>(null)

    const scroll = (dir: 'left' | 'right') => {
        if (!scrollRef.current) return
        scrollRef.current.scrollBy({ left: dir === 'right' ? 280 : -280, behavior: 'smooth' })
    }

    const rooms = data?.data ?? []
    const router = useRouter()
    const { setStay, setItem, setRoomDetail } = useBookingStore()


    const handleSelectRoom = useCallback(
        (roomType: roomListAvailableState) => {
            setStay({
                siteCode: 'MERAK',
                checkInDate: checkin,
                checkOutDate: checkout,
            })
            setItem({
                roomTypeId: roomType.roomTypeId,
                imageUrl: roomType.imageUrl || '',
            })
            setRoomDetail({
                roomTypeName: roomType.name,
                pricePerNight: roomType.pricing.price,
                nights: roomType.pricing.nights,
                totalPrice: roomType.pricing.totalPrice,
            })
            router.push('/reservation')
        },
        [checkin, checkout, setStay, setItem, setRoomDetail, router],
    )

    return (
        <div className="relative w-full mb-8">
            {/* Scroll area */}
            <div
                ref={scrollRef}
                className="flex gap-4 overflow-x-auto scroll-smooth px-5 py-4 scrollbar-hide"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {isLoading
                    ? Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)
                    : rooms.length === 0
                        ? (
                            <div className="w-full text-center py-16 text-sm text-gray-400 tracking-widest uppercase">
                                Tidak ada kamar tersedia
                            </div>
                        )
                        : rooms.map((room) => (
                            <RoomCard
                                key={room.roomTypeId}
                                room={room}
                                checkin={checkin}
                                checkout={checkout}
                                onSelect={handleSelectRoom}
                            />
                        ))
                }
            </div>

            {/* Nav buttons — only show if rooms > 2 */}
            {!isLoading && rooms.length > 2 && (
                <>
                    <button
                        onClick={() => scroll('left')}
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-8 h-8 bg-white border border-gray-100 shadow rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors z-10"
                    >
                        <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                        </svg>
                    </button>
                    <button
                        onClick={() => scroll('right')}
                        className="absolute right-0 top-1/2 -translate-y-1/2 w-8 h-8 bg-white border border-gray-100 shadow rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors z-10"
                    >
                        <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                        </svg>
                    </button>
                </>
            )}
        </div>
    )
}