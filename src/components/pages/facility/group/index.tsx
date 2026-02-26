'use client'
import FacilityGroupTable from '@/src/components/organisms/facilities/groups/table'
import { useFacilityGroupList } from '@/src/hooks/query/facilities/listGroups'

export default function FacilityGroupPage() {
    const {data}= useFacilityGroupList()
  return (
    <div>
      <h5 className='mb-4'>facility Group list</h5>
      {data && (
        <FacilityGroupTable data={data.data}/>
      )}
    </div>
  )
}
