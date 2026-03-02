import UploadImagePage from '@/src/components/pages/images/add'
import { Suspense } from 'react'

export default function page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <UploadImagePage />
    </Suspense>
  )
}
