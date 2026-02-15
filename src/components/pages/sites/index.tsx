'use client'
import { useSiteList } from '@/src/hooks/query/sites'
import BasicCard from '../../molecules/cards/basicCard'

export default function SitePages() {
  const { data } = useSiteList()
  return (
    <div>
      <h6>list site here</h6>
      <div className='flex flex-wrap gap-3 mt-4'>
        {data && data?.data.map((data) => (
          <BasicCard key={data.id} Label={data?.nama} desk={data.lokasi} />
        ))}
      </div>
    </div>
  )
}
