'use client'

import RoomAvlbCard from "@/src/components/molecules/cards/publicRoomTypeAvlbCard"
import { usePublicRoomTypeAvailibility } from "@/src/hooks/query/roomAvailibility/publicRoomTypeAvailibility"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback, useMemo, useRef } from "react"

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
    const dateInputRef = useRef<HTMLInputElement>(null)

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
        (value: string) => {
            const params = new URLSearchParams(searchParams.toString())
            params.set("checkin", value)
            router.replace(`${pathname}?${params.toString()}`, { scroll: false })
        },
        [router, pathname, searchParams],
    )

    const openDatePicker = useCallback(() => {
        dateInputRef.current?.showPicker?.()
    }, [])

    return (
        <div className="min-h-screen bg-white">
            {/* ── Date Bar ── */}
            <div className="relative bg-[#d9d9d4] px-6 py-5 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                <button
                    onClick={openDatePicker}
                    className="text-sm md:text-base font-medium tracking-[0.2em] uppercase text-gray-800 hover:text-gray-600 transition-colors text-left"
                >
                    {formatDisplayDate(checkinDate)}
                    <span className="mx-3 text-gray-400">→</span>
                    {formatDisplayDate(checkoutDate)}
                </button>

                <p className="text-xs tracking-[0.3em] uppercase text-gray-500">
                    1 Malam · 1 Kamar
                </p>

                {/* Hidden native date input */}
                <input
                    ref={dateInputRef}
                    type="date"
                    value={checkin}
                    min={formatInputDate(new Date())}
                    onChange={(e) => handleChangeDate(e.target.value)}
                    className="absolute opacity-0 pointer-events-none w-0 h-0"
                    tabIndex={-1}
                    aria-hidden
                />
            </div>

            {/* ── Room List ── */}
            <div className="px-4 md:px-8 py-6 space-y-4">
                {isLoading && (
                    <div className="flex flex-col gap-4">
                        {[...Array(3)].map((_, i) => (
                            <div
                                key={i}
                                className="h-64 rounded-2xl bg-gray-100 animate-pulse"
                            />
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
                            image="https://id.marinabaysands.com/content/dam/marinabaysands/hotel/sands-premiere-room/gallery/sands-premier-room-no-view-1.jpg"
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
                            onViewDetail={() => console.log("detail", roomType.roomTypeId)}
                            onViewPackage={() => console.log("package", roomType.roomTypeId)}
                        />
                    ))}
            </div>
        </div>
    )
}