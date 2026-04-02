'use client'
import Link from 'next/link'
import RoomMaintenanceTable from '../../organisms/roomMaintainenace/table'
import { useRoomMaintainList } from '@/src/hooks/query/roomMaintainenace/list';

export default function RoomMaintenance() {

    const { data, isLoading } = useRoomMaintainList();
    if (isLoading) return <div>Loading...</div>;
    return (
        <>
            <div className='flex items-center justify-between mb-4'>
                <h3 className='text-2xl font-bold'>Room Maintenance</h3>
                <Link href={'/dashboard/room-maintenance/create'} className='p-2 px-6'>Create</Link>
            </div>
            <RoomMaintenanceTable data={data?.data ?? []} />
        </>
    )
}
