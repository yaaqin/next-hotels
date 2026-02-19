'use client'
import { useRoomDetail } from '@/src/hooks/query/rooms/detail'
import { useParams } from 'next/navigation';
export default function DetailRoomPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;

  const {data} = useRoomDetail(id || '')
  console.log('detail room here ==>', data)
  return (
    <div>
      detail room here
    </div>
  )
}
