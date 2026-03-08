'use client'
import { useBookingList } from '@/src/hooks/query/bookings/list'
import { getToday } from '@/src/utils'
import { useState, useRef, useEffect } from 'react'
import BookingTable from '../../organisms/booking/table'
import { Calendar } from '@/components/ui/calendar'
import { Calendar01Icon } from 'hugeicons-react'
import Loading from '../../organisms/loading'

export default function BookingPage() {
    const [selectedDate, setSelectedDate] = useState<string>(getToday())
    const [open, setOpen] = useState(false)
    const ref = useRef<HTMLDivElement>(null)

    // close on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false)
            }
        }
        document.addEventListener('mousedown', handler)
        return () => document.removeEventListener('mousedown', handler)
    }, [])

    const handleDateChange = (date: Date | undefined) => {
        if (!date) return
        const yyyy = date.getFullYear()
        const mm = String(date.getMonth() + 1).padStart(2, '0')
        const dd = String(date.getDate()).padStart(2, '0')
        setSelectedDate(`${yyyy}-${mm}-${dd}`)
        setOpen(false) // auto close setelah pilih
    }

    const { data, isLoading } = useBookingList(selectedDate)

    return (
        <div className="p-6 space-y-4">
            <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Select Date</label>

                {/* Input trigger */}
                <div ref={ref} className="relative w-fit">
                    <div
                        onClick={() => setOpen((prev) => !prev)}
                        className="flex items-center gap-2 border rounded-lg px-3 py-2 cursor-pointer hover:bg-gray-50 w-48"
                    >
                        <Calendar01Icon size={16} className="text-gray-500" />
                        <span className="text-sm">{selectedDate}</span>
                    </div>

                    {/* Dropdown calendar */}
                    {open && (
                        <div className="absolute top-full mt-1 z-50 shadow-lg rounded-lg bg-white border">
                            <Calendar
                                mode="single"
                                selected={new Date(selectedDate + 'T00:00:00')}
                                onSelect={handleDateChange}
                            />
                        </div>
                    )}
                </div>
            </div>

            {isLoading ? (
                <Loading />
            ) : data && (
                <BookingTable data={data?.data.bookings} />
            )}
        </div>
    )
}