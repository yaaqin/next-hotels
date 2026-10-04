'use client'

import RoomAvlbCard from "@/src/components/molecules/cards/publicRoomTypeAvlbCard"
import { usePublicRoomTypeAvailibility } from "@/src/hooks/query/roomAvailibility/publicRoomTypeAvailibility"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback, useMemo, useState } from "react"
import { roomListAvailableState } from "@/src/models/public/roomAvailibility/listRoomType"
import { useBookingStore } from "@/src/stores/booking"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { differenceInCalendarDays, format } from "date-fns"
import type { DateRange } from "react-day-picker"

const DEFAULT_SITE_CODE = "MERAK"

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

    // Cabang dari ?site=KODE — flow booking lama default ke cabang pertama (Merak)
    const siteCode = searchParams.get("site") ?? DEFAULT_SITE_CODE
    const checkinParam = searchParams.get("checkin")
    // "checkOut" = nama param lama
    const checkoutParam = searchParams.get("checkout") ?? searchParams.get("checkOut")

    // Tanpa check-out (atau tidak valid) → default 1 malam
    const { checkinDate, checkoutDate, checkin, checkout, nights } = useMemo(() => {
        const checkinDate = parseDateParam(checkinParam)
        let checkoutDate = checkoutParam ? parseDateParam(checkoutParam) : null
        if (!checkoutDate || differenceInCalendarDays(checkoutDate, checkinDate) < 1) {
            checkoutDate = new Date(checkinDate)
            checkoutDate.setDate(checkoutDate.getDate() + 1)
        }

        return {
            checkinDate,
            checkoutDate,
            checkin: formatInputDate(checkinDate),
            checkout: formatInputDate(checkoutDate),
            nights: differenceInCalendarDays(checkoutDate, checkinDate),
        }
    }, [checkinParam, checkoutParam])

    const { data, isLoading } = usePublicRoomTypeAvailibility(checkin, checkout, siteCode)

    // Pilihan di kalender baru dipakai (URL berubah → refetch) setelah klik Apply
    const [calendarOpen, setCalendarOpen] = useState(false)
    const [draftRange, setDraftRange] = useState<DateRange | undefined>()
    const draftNights =
        draftRange?.from && draftRange.to ? differenceInCalendarDays(draftRange.to, draftRange.from) : 0
    const canApply = draftNights >= 1

    const handleCalendarOpenChange = (open: boolean) => {
        setCalendarOpen(open)
        if (open) setDraftRange({ from: checkinDate, to: checkoutDate })
    }

    // Kalau rentang sudah lengkap, klik berikutnya memulai rentang baru (jadi check-in baru),
    // bukan menggeser salah satu ujung rentang lama
    const handleSelectRange = (range: DateRange | undefined, clicked: Date) => {
        if (draftRange?.from && draftRange.to) {
            setDraftRange({ from: clicked, to: undefined })
            return
        }
        setDraftRange(range)
    }

    const handleApplyRange = useCallback(() => {
        if (!draftRange?.from || !draftRange.to) return
        const params = new URLSearchParams(searchParams.toString())
        params.set("checkin", formatInputDate(draftRange.from))
        params.set("checkout", formatInputDate(draftRange.to))
        params.delete("checkOut")
        router.replace(`${pathname}?${params.toString()}`, { scroll: false })
        setCalendarOpen(false)
    }, [draftRange, router, pathname, searchParams])

    const handleSelectRoom = useCallback(
        (roomType: roomListAvailableState) => {
            setStay({
                siteCode,
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
        [siteCode, checkin, checkout, setStay, setItem, setRoomDetail, router],
    )

    // Slug di URL (/booking/presidential), UUID cuma fallback kalau slug belum ada
    const handleViewDetail = (roomType: roomListAvailableState) => {
        const params = new URLSearchParams({ checkIn: checkin, checkout })
        if (siteCode !== DEFAULT_SITE_CODE) params.set("site", siteCode)
        router.push(`/booking/${roomType.slug ?? roomType.roomTypeId}?${params.toString()}`)
    }

    return (
        <div className="min-h-screen" style={{ background: "#EEF3FA", fontFamily: "'Montserrat', sans-serif" }}>

            {/* ── Date Bar ── */}
            <div
                className="relative px-6 py-5 flex flex-col md:flex-row md:items-center md:justify-between gap-2"
                style={{ background: "#05111F", borderBottom: "1px solid #0A1E38" }}
            >
                {/* Left — eyebrow brand */}
                <p
                    className="text-[0.52rem] tracking-[0.2em] uppercase hidden md:block"
                    style={{ color: "#3A6A96" }}
                >
                    Marina by Sand
                </p>

                {/* Center — date picker */}
                <Popover open={calendarOpen} onOpenChange={handleCalendarOpenChange}>
                    <PopoverTrigger asChild>
                        <button
                            data-cy="btn-open-calendar"
                            className="text-sm tracking-[0.15em] uppercase transition-colors duration-200 text-left flex items-center gap-1"
                            style={{ color: "#C8DCEF", fontFamily: "'Montserrat', sans-serif" }}
                            onMouseEnter={(e) => (e.currentTarget.style.color = "#ffffff")}
                            onMouseLeave={(e) => (e.currentTarget.style.color = "#C8DCEF")}
                        >
                            {formatDisplayDate(checkinDate)}
                            <span className="mx-3" style={{ color: "#1A56A0" }}>→</span>
                            {formatDisplayDate(checkoutDate)}
                        </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 z-[200]" align="center">
                        <div className="inline-flex flex-col rounded-lg border bg-white">
                            <Calendar
                                mode="range"
                                selected={draftRange}
                                onSelect={handleSelectRange}
                                defaultMonth={checkinDate}
                                disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                                initialFocus
                            />
                            {/* w-0 min-w-full: lebar footer ikut kalender, tidak ikut melebarkan popover */}
                            <div
                                className="w-0 min-w-full px-3 pb-3 pt-2.5 space-y-2.5"
                                style={{ borderTop: "1px solid #DDE8F5" }}
                            >
                                <p className="text-[0.65rem] tracking-[0.08em] text-center" style={{ color: "#5B90C9" }}>
                                    {canApply
                                        ? `${format(draftRange!.from!, "dd MMM")} → ${format(draftRange!.to!, "dd MMM")} · ${draftNights} Malam`
                                        : draftRange?.from
                                            ? "Pilih tanggal check-out"
                                            : "Pilih tanggal check-in"}
                                </p>
                                <div className="grid grid-cols-2 gap-2">
                                    <button
                                        onClick={() => setCalendarOpen(false)}
                                        className="py-2 rounded-lg text-[0.65rem] tracking-[0.12em] uppercase"
                                        style={{ color: "#5B90C9", border: "0.5px solid #B5CDE8" }}
                                    >
                                        Batal
                                    </button>
                                    <button
                                        data-cy="btn-apply-dates"
                                        onClick={handleApplyRange}
                                        disabled={!canApply}
                                        className="py-2 rounded-lg text-[0.65rem] tracking-[0.12em] uppercase transition-colors disabled:cursor-not-allowed"
                                        style={
                                            canApply
                                                ? { background: "#0A1828", color: "#C8DCEF" }
                                                : { background: "#D0DCE8", color: "#8AADC8" }
                                        }
                                    >
                                        Apply
                                    </button>
                                </div>
                            </div>
                        </div>
                    </PopoverContent>
                </Popover>

                {/* Right — stay info */}
                <p
                    className="text-[0.58rem] tracking-[0.2em] uppercase"
                    style={{ color: "#3A6A96" }}
                >
                    {nights} Malam
                </p>
            </div>

            {/* ── Room List ── */}
            <div className="px-4 md:px-8 py-6 space-y-4">

                {/* Loading skeletons */}
                {isLoading && (
                    <div className="flex flex-col gap-4">
                        {[...Array(3)].map((_, i) => (
                            <div
                                key={i}
                                className="h-64 rounded-2xl animate-pulse"
                                style={{ background: "#DDE8F5" }}
                            />
                        ))}
                    </div>
                )}

                {/* Empty state */}
                {!isLoading && data?.data?.length === 0 && (
                    <div
                        className="text-center py-24 tracking-[0.2em] uppercase text-xs"
                        style={{ color: "#6A9EC5" }}
                    >
                        Tidak ada kamar tersedia untuk tanggal ini
                    </div>
                )}

                {/* Room cards */}
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
                            price={roomType.pricing.price}
                            display={roomType.pricing.display}
                            bedInfo="2 Tempat Tidur Queen & Tempat Tidur King tersedia"
                            onViewDetail={() => handleViewDetail(roomType)}
                            onViewPackage={() => handleSelectRoom(roomType)}
                        />
                    ))}
            </div>
        </div>
    )
}