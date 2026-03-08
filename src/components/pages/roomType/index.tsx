'use client'
import { useRoomTypeList } from '@/src/hooks/query/roomTypes'
import RoomTypeTable from '../../organisms/roomTypes/table'
import Link from 'next/link'
import Loading from '../../organisms/loading'

export default function RoomTypePage() {
    const { data, isLoading } = useRoomTypeList()
    return (
        <div>
            <section className='flex justify-between items-center'>
                <h6 className='mb-4 text-xl'>List room type</h6>
                <Link href={`/dashboard/room-type/create`}>Create</Link>
            </section>
            {isLoading ? (
                <Loading />
            ) : data && (
                <RoomTypeTable data={data.data} />
            )}
        </div>
    )
}
