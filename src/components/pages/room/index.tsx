'use client'
import { useRoomList } from '@/src/hooks/query/rooms'
import RoomTable from '../../organisms/rooms/table'
import Link from 'next/link'

export default function RoomPage() {
    const { data } = useRoomList()
    return (
        <>
        <div className='flex items-center justify-end'>
            <Link href={'/dashboard/room/create'} className='p-2 px-6'>Create</Link>
        </div>
            {data && (
                <RoomTable data={data.data} />
            )}
        </>
    )
}
