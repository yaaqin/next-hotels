'use client'
import { usePublicRoomTypeAvailibility } from "@/src/hooks/query/roomAvailibility/publicRoomTypeAvailibility"
import { useSearchParams } from "next/navigation"
import { useMemo } from "react"

function formatDate(date: Date) {
    const yyyy = date.getFullYear()
    const mm = String(date.getMonth() + 1).padStart(2, "0")
    const dd = String(date.getDate()).padStart(2, "0")
    return `${yyyy}-${mm}-${dd}`
}

export default function BookingPublicPage() {
    const searchParams = useSearchParams()
    const checkinParam = searchParams.get("checkin")

    const { checkin, checkout } = useMemo(() => {
        let baseDate: Date

        if (checkinParam) {
            // parse manual biar aman timezone
            const [year, month, day] = checkinParam.split("-").map(Number)
            baseDate = new Date(year, month - 1, day)
        } else {
            baseDate = new Date()
        }

        const checkinDate = new Date(baseDate)
        const checkoutDate = new Date(baseDate)
        checkoutDate.setDate(checkoutDate.getDate() + 1)

        return {
            checkin: formatDate(checkinDate),
            checkout: formatDate(checkoutDate),
        }
    }, [checkinParam])

    const { data } = usePublicRoomTypeAvailibility(checkin, checkout)

    console.log('list room ==>', data)
    return (
        <div>
                booking here
        </div>
    )
}
