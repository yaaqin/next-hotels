'use client'
import { useFacilityGroupDetail } from '@/src/hooks/query/facilities/detailGroup';
import { useParams } from 'next/navigation';
export default function DetailFacilityGroupPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const { data, isLoading } = useFacilityGroupDetail(id)
  console.log("data ==>", data)
  return (
    <div>
      {isLoading ? 'Sabarrrr' : 'detail here'}
    </div>
  )
}
