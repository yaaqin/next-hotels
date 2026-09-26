import type { Metadata } from 'next'

// Flow booking (pilih tanggal → tipe → kamar) adalah halaman transaksi, bukan landing SEO.
// Versi yang diindex ada di /hotel/... (RLP), jadi di sini noindex supaya tidak bersaing.
export const metadata: Metadata = {
  robots: { index: false, follow: true },
}

export default function BookingLayout({ children }: { children: React.ReactNode }) {
  return children
}
