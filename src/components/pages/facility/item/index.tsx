'use client'
import FacilityItemTable from "@/src/components/organisms/facilities/items/table"
import { useFacilityItemList } from "@/src/hooks/query/facilities/listItems"
import Link from "next/link"

export default function FacilityItemPage() {
  const { data } = useFacilityItemList()
  return (
    <div>
      <section className="flex justify-between items-center">
        <h6>list facility type here</h6>
        <Link href={`/dashboard/facility/create`} className="p-2 px-4">Create</Link>
      </section>
      <div className='flex flex-wrap gap-3 mt-4'>
        {data && (
          <FacilityItemTable data={data.data} />
        )}
      </div>
    </div>
  )
}
