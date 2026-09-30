import ReschedulePage from '@/src/components/pages/(publicPage)/reschedule/detail'
import React, { Suspense } from 'react'

export default function page() {
  return (
    // ReschedulePage baca tanggal dari query (useSearchParams)
    <Suspense>
      <ReschedulePage />
    </Suspense>
  )
}
