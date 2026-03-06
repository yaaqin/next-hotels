'use client'
import FacilityGroupTable from '@/src/components/organisms/facilities/groups/table'
import { useFacilityGroupList } from '@/src/hooks/query/facilities/listGroups'
import Link from 'next/link'

export default function FacilityGroupPage() {
  const { data } = useFacilityGroupList()
  return (
    <div>
      <section className='flex justify-between items-center'>
        <h5 className='mb-4'>facility Group list</h5>
        <Link href={`/dashboard/facility/group/create`} className='p-2 px-6'>Create</Link>
      </section>
      {data && (
        <FacilityGroupTable data={data.data} />
      )}
    </div>
  )
}
