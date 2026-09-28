import { redirect } from 'next/navigation'

// Kelola admin pindah ke /config-panel/admins; di dashboard, Manajemen Pengguna = monitoring log tamu
export default function page() {
  redirect('/dashboard/user-log')
}
