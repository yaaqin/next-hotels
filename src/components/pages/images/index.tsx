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
            {data && (
                <section className='columns-2 sm:columns-3 md:columns-4 lg:columns-5 gap-4 space-y-4'>
                    {data.data.map((image, key) => (
                        <div key={key} className='break-inside-avoid'>
                            <Image
                                src={image}
                                width={0}
                                height={0}
                                sizes='100vw'
                                className='w-full h-auto rounded-md'
                                alt='image-name'
                                unoptimized
                            />
                        </div>
                    ))}
                </section>
            )}
        </div>
    )
}
