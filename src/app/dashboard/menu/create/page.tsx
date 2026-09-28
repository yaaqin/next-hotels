import { redirect } from 'next/navigation'

// Kelola menu pindah ke /config-panel (khusus role sistem)
export default function page() {
  redirect('/config-panel/menus')
}
