'use client'
import { useRoomList } from '@/src/hooks/query/rooms'
import RoomTable from '../../organisms/rooms/table'

export default function RoomPage() {
    const { data } = useRoomList()
    return (
        <>
            {data && (
                <RoomTable data={data.data} />
            )}
        </>
    )
}
