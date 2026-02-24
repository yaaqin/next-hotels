'use client'
import { useImageList } from '@/src/hooks/query/images'
import Image from 'next/image'
import Link from 'next/link'
export default function ImageListPage() {
    const { data } = useImageList()
    return (
        <div className='bg-white rounded-xl'>
            <section className='mb-4 flex items-center justify-between'>
                <h5>list image here</h5>
                <Link href={`/dashboard/image/add`} className='p-2 px-6'>Add</Link>
            </section>
            {data &&  (
                <section className='grid grid-cols-8 gap-4'>
                    {data.data.map((image, key) => (
                        <Image key={key} src={image} width={50} height={50} className='grid rounded-md w-52' alt={'image-name'}/>
                    ))}
                </section>
            )}
        </div>
    )
}
