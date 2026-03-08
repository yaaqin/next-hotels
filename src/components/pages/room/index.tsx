'use client'
import { useState } from 'react'
import { useRoomList } from '@/src/hooks/query/rooms'
import { useRoomTypeList } from '@/src/hooks/query/roomTypes'
import RoomTable from '../../organisms/rooms/table'
import Link from 'next/link'
import Loading from '../../organisms/loading'
import { Selects } from '../../molecules/inputs/selects'

export default function RoomPage() {
    const [selectedRoomType, setSelectedRoomType] = useState<string>('')

    const { data, isLoading } = useRoomList(selectedRoomType || undefined)
    const { data: roomTypeData } = useRoomTypeList()

    const roomTypeOptions = [
        { id: 'all', value: '', label: 'All Room Types' },
        ...(roomTypeData?.data.map((rt) => ({
            id: rt.id,
            value: rt.name,
            label: rt.name,
        })) ?? []),
    ]

    return (
        <>
            <div className='flex items-center justify-between mb-4'>
                <Selects
                    label=''
                    value={selectedRoomType}
                    onChange={(val) => setSelectedRoomType(val)}
                    options={roomTypeOptions}
                    placeholder='All Room Types'
                    showPlaceholder={false}
                    containerClassName='w-48'
                />
                <Link href={'/dashboard/room/create'} className='p-2 px-6'>Create</Link>
            </div>
            {isLoading ? (
                <Loading />
            ) : data && (
                <RoomTable data={data.data} />
            )}
        </>
    )
}