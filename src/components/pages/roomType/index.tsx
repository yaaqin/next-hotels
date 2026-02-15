'use client'
import { useRoomTypeList } from '@/src/hooks/query/roomTypes'
import BasicCard from '../../molecules/cards/basicCard'

export default function RoomTypePage() {
    const { data } = useRoomTypeList()
    return (
        <div>
            <h6>list room type here</h6>
            <div className='flex flex-wrap gap-3 mt-4'>
                {data && data?.data.map((data) => (
                    <BasicCard key={data.id} Label={data?.name} desk={data.desk} />
                ))}
            </div>
        </div>
    )
}
