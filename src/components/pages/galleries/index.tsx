import Link from 'next/link'

export default function GalleryPages() {
    return (
        <section className='bg-white rounded-xl p-2 px-4'>
            <div className='flex justify-between items-center'>
                <p>list galery here</p>
                <Link href={`/dashboard/gallery/create`} className='p-2 px-4'>create</Link>
            </div>
        </section>
    )
}
