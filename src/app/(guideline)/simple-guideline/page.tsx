import { permanentRedirect } from 'next/navigation'

// Halaman lama — diganti /user-guide
export default function page() {
  permanentRedirect('/user-guide')
}
