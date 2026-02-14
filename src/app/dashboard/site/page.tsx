'use client'
import SitePages from '@/src/components/pages/sites'
import { useSiteList } from '@/src/hooks/query/sites'

export default function page() {
const {data} = useSiteList()

console.log('datas ==>', data)
  return (
    <SitePages/>
  )
}
