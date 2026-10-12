import NotFoundView from '@/src/components/organisms/notFound/NotFoundView'

// notFound() di halaman public (mis. /hotel/...) — tetap dengan navbar & footer public
export default function PublicNotFound() {
  return <NotFoundView />
}
