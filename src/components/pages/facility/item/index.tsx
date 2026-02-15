'use client'
import BasicCard from "@/src/components/molecules/cards/basicCard"
import { useFacilityItemList } from "@/src/hooks/query/facilities/listItems"

export default function FacilityItemPage() {
  const { data } = useFacilityItemList()
  return (
    <div>
      <h6>list facility type here</h6>
      <div className='flex flex-wrap gap-3 mt-4'>
        {data && data?.data.map((data) => (
          <BasicCard key={data.id} Label={data?.name} desk={data.code} />
        ))}
      </div>
    </div>
  )
}
