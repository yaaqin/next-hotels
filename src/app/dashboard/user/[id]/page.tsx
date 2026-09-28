import { redirect } from 'next/navigation'

// Kelola admin pindah ke /config-panel (khusus role sistem)
export default function page() {
  redirect('/config-panel/admins')
}
