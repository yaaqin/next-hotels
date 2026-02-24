'use client'
import InfoCard from '@/src/components/molecules/cards/infoCard';
import { useUserDetail } from '@/src/hooks/query/users/detail'
import { useParams } from 'next/navigation';

export default function DetailUserPage() {
    const params = useParams<{ id: string }>();
    const id = params.id;

    const { data } = useUserDetail(id)
    return (
        <section className='p-2 px-4 bg-white rounded-xl grid grid-cols-4'>
            {data && (
                <>
                    <InfoCard Label={'Nama'} value={data.data.username} className='grid col-span-1' />
                    <InfoCard Label={'Email'} value={data.data.email} className='grid col-span-1' />
                    <InfoCard Label={'Role'} value={data.data.role.name} className='grid col-span-1' />
                    <InfoCard Label={'Dibuat'} value={data.data.createdAt} className='grid col-span-1' />
                </>
            )}
        </section>
    )
}
