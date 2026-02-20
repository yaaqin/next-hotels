'use client'
import { useMenuList } from '@/src/hooks/query/menu/list'
import MenuTable from '../../organisms/menu/table'
import Link from 'next/link'

export default function MenuPage() {
    const { data } = useMenuList()
    return (
        <>
        <section className='mb-4 flex justify-between items-center'>
            <p>List menu here</p>
            <Link href={`/dashboard/menu/create`} className='p-2 px-4'>Create</Link>
        </section>
            {data && (
                <MenuTable data={data.data} />
            )}
        </>
    )
}
