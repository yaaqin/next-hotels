'use client'
import { useGalleryList } from '@/src/hooks/query/galleries/list'
import Link from 'next/link'
import GalleryTable from '../../organisms/galleries/table'

export default function GalleryPages() {
    const { data } = useGalleryList()
    return (
        <section className='bg-white rounded-xl p-2 px-4'>
            <div className='flex justify-between items-center'>
                <p>list galery here</p>
                <Link href={`/dashboard/gallery/create`} className='p-2 px-4'>create</Link>
            </div>
            {data && (
                <GalleryTable data={data.data} />
            )}
        </section>
    )
}
