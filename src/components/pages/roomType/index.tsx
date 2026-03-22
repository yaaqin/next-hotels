'use client'
import { useRoomTypeList } from '@/src/hooks/query/roomTypes'
import RoomTypeTable from '../../organisms/roomTypes/table'
import Link from 'next/link'
import Loading from '../../organisms/loading'
import { useTranslation } from 'react-i18next'

export default function RoomTypePage() {
    const { data, isLoading } = useRoomTypeList()
    const { t } = useTranslation()
    return (
        <div>
            <section className='flex justify-between items-center'>
                <h6 className='mb-4 text-xl'>List room type</h6>
                <Link href={`/dashboard/room-type/create`}>{t('label.create')}</Link>
            </section>
            {isLoading ? (
                <Loading />
            ) : data && (
                <RoomTypeTable data={data.data} />
            )}
        </div>
    )
}
