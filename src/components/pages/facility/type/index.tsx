'use client'
import FacilityTypeTable from '@/src/components/organisms/facilities/types/table'
import { useFacilityTypeList } from '@/src/hooks/query/facilities/listType'
import Link from 'next/link'

export default function FacilityTypePage() {
    const { data } = useFacilityTypeList()
    return (
        <div>
            <section className='flex items-center justify-between'>
                <h6>list facility Type here</h6>
                <Link href={`/dashboard/facility/type/create`} className='px-4 p-2'>Create</Link>
            </section>
            <div className='flex flex-wrap gap-3 mt-4'>
                {data && (
                    <FacilityTypeTable data={data.data} />
                )}
            </div>
        </div>
    )
}
