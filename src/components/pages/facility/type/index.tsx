'use client'
import BasicCard from '@/src/components/molecules/cards/basicCard'
import { useFacilityTypeList } from '@/src/hooks/query/facilities/listType'

export default function FacilityTypePage() {
    const { data } = useFacilityTypeList()
    return (
        <div>
            <h6>list facility Type here</h6>
            <div className='flex flex-wrap gap-3 mt-4'>
                {data && data?.data.map((data) => (
                    <BasicCard key={data.id} Label={data?.name} desk={data.code} />
                ))}
            </div>
        </div>
    )
}
