'use client'
import { useMenuList } from '@/src/hooks/query/menu/list'
import MenuTable from '../organisms/menu/table'

export default function MenuPage() {
    const { data } = useMenuList()
    return (
        <>
            {data && (
                <MenuTable data={data.data} />
            )}
        </>
    )
}
