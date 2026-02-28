'use client'
import { useBookingList } from '@/src/hooks/query/bookings/list'
import { getToday } from '@/src/utils'
import { useState } from 'react'
import BookingTable from '../../organisms/booking/table'

export default function BookingPage() {
    const [selectedDate, setSelectedDate] = useState<string>(getToday())


    const { data } = useBookingList(selectedDate)
    return (
        <div className="p-6 space-y-4">
            <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Select Date</label>
                <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="border rounded-lg px-3 py-2 w-fit"
                />
            </div>
            {data && (
                <BookingTable data={data?.data.bookings}/>
            )}
        </div>
    )
}

