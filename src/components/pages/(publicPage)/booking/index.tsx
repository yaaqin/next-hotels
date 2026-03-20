'use client'

import RoomAvlbCard from "@/src/components/molecules/cards/publicRoomTypeAvlbCard"
import { usePublicRoomTypeAvailibility } from "@/src/hooks/query/roomAvailibility/publicRoomTypeAvailibility"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback, useMemo } from "react"
import { roomListAvailableState } from "@/src/models/public/roomAvailibility/listRoomType"
import { useBookingStore } from "@/src/stores/booking"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"

// ─── Date Utilities ───────────────────────────────────────────────────────────

function formatInputDate(date: Date): string {
    const yyyy = date.getFullYear()
    const mm = String(date.getMonth() + 1).padStart(2, "0")
    const dd = String(date.getDate()).padStart(2, "0")
    return `${yyyy}-${mm}-${dd}`
}

function formatDisplayDate(date: Date): string {
    return date
        .toLocaleDateString("en-US", {
            month: "short",
            day: "2-digit",
            year: "numeric",
        })
        .toUpperCase()
}

function parseDateParam(param: string | null): Date {
    if (param) {
        const [year, month, day] = param.split("-").map(Number)
        return new Date(year, month - 1, day)
    }
    return new Date()
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function BookingPublicPage() {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    const { setStay, setItem, setRoomDetail } = useBookingStore()

    const checkinParam = searchParams.get("checkin")

    const { checkinDate, checkoutDate, checkin, checkout } = useMemo(() => {
        const checkinDate = parseDateParam(checkinParam)
        const checkoutDate = new Date(checkinDate)
        checkoutDate.setDate(checkoutDate.getDate() + 1)

        return {
            checkinDate,
            checkoutDate,
            checkin: formatInputDate(checkinDate),
            checkout: formatInputDate(checkoutDate),
        }
    }, [checkinParam])

    const { data, isLoading } = usePublicRoomTypeAvailibility(checkin, checkout)

    const handleChangeDate = useCallback(
        (date: Date | undefined) => {
            if (!date) return
            const value = formatInputDate(date)
            const params = new URLSearchParams(searchParams.toString())
            params.set("checkin", value)
            router.replace(`${pathname}?${params.toString()}`, { scroll: false })
        },
        [router, pathname, searchParams],
    )

    const handleSelectRoom = useCallback(
        (roomType: roomListAvailableState) => {
            setStay({
                siteCode: 'MERAK',
                checkInDate: checkin,
                checkOutDate: checkout,
            })
            setItem({
                roomTypeId: roomType.roomTypeId,
                imageUrl: roomType.imageUrl || ''
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

    const handleViewDetail = (id: string) => {
        router.push(`/booking/${id}?checkIn=${checkin}&checkout=${checkout}`)
    }

    return (
        <div className="min-h-screen bg-white">
            {/* ── Date Bar ── */}
            <div className="relative bg-[#d9d9d4] px-6 py-5 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                
                <Popover>
                    <PopoverTrigger asChild>
                        <button className="text-sm md:text-base font-medium tracking-[0.2em] uppercase text-gray-800 hover:text-gray-600 transition-colors text-left">
                            {formatDisplayDate(checkinDate)}
                            <span className="mx-3 text-gray-400">→</span>
                            {formatDisplayDate(checkoutDate)}
                        </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 z-[200]" align="start">
                        <Calendar
                            mode="single"
                            selected={checkinDate}
                            onSelect={handleChangeDate}
                            disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                            initialFocus
                            className="rounded-lg border"
                        />
                    </PopoverContent>
                </Popover>

                <p className="text-xs tracking-[0.3em] uppercase text-gray-500">
                    1 Malam · 1 Kamar
                </p>
            </div>

            {/* ── Room List ── */}
            <div className="px-4 md:px-8 py-6 space-y-4">
                {isLoading && (
                    <div className="flex flex-col gap-4">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="h-64 rounded-2xl bg-gray-100 animate-pulse" />
                        ))}
                    </div>
                )}

                {!isLoading && data?.data?.length === 0 && (
                    <div className="text-center py-24 text-gray-400 tracking-widest uppercase text-sm">
                        Tidak ada kamar tersedia untuk tanggal ini
                    </div>
                )}

                {!isLoading &&
                    data?.data?.map((roomType, key) => (
                        <RoomAvlbCard
                            key={roomType.roomTypeId ?? key}
                            image={roomType.imageUrl || ''}
                            collectionLabel={roomType.name ?? "—"}
                            title={roomType.name ?? "—"}
                            floorLabel={roomType.description ?? ""}
                            bookedInfo={`Tersedia ${roomType.availability.availableRooms} Kamar`}
                            maxGuest={3}
                            size="45 m²"
                            features={[
                                { icon: "bar", label: "Armoire Khusus & Bar Koktail" },
                                { icon: "bath", label: "Kamar mandi mewah dengan bak berendam" },
                            ]}
                            price={roomType.pricing.totalPrice}
                            bedInfo="2 Tempat Tidur Queen & Tempat Tidur King tersedia"
                            onViewDetail={() => handleViewDetail(roomType.roomTypeId)}
                            onViewPackage={() => handleSelectRoom(roomType)}
                        />
                    ))}
            </div>
        </div>
    )
}