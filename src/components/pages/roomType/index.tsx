'use client'
import { useRoomTypeList } from '@/src/hooks/query/roomTypes'
import BasicCard from '../../molecules/cards/basicCard'
import RoomTypeTable from '../../organisms/roomTypes/table'
import Buttons from '../../atoms/buttons'
import Link from 'next/link'

export default function RoomTypePage() {
    const { data } = useRoomTypeList()
    return (
        <div>
            <section className='flex justify-between items-center'>
                <h6 className='mb-4 text-xl'>List room type</h6>
                <Link href={`/dashboard/room-type/create`}>Create</Link>
            </section>
            {data && (
                <RoomTypeTable data={data.data} />
            )}
        </div>
    )
}
