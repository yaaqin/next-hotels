import GalleryPages from '@/src/components/pages/galleries'
import { Suspense } from 'react'

export default function page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <GalleryPages />
    </Suspense>
  )
}
