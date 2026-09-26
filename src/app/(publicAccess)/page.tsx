import BookingPage2 from "@/src/components/pages/(publicPage)/home/bookingPage2";
import { getPublicSites } from "@/src/services/roomListing";

// "jakarta-pusat" → "Jakarta Pusat" (sama dengan label lokasi di title RLP)
const slugLabel = (slug: string) =>
  slug.split("-").filter(Boolean).map((w) => w[0].toUpperCase() + w.slice(1)).join(" ");

// Link cabang di footer — BE tidak bisa dihubungi tidak boleh bikin homepage error
async function getBranchLinks() {
  try {
    const sites = await getPublicSites();
    return sites
      .filter((site) => site.slug)
      .map((site) => ({ label: `Hotel di ${slugLabel(site.slug!)}`, href: `/hotel/${site.slug}` }));
  } catch {
    return [];
  }
}


export const metadata = {
  title: 'MBS Hotel — Reservasi Hotel di Merak',
  description: 'Pesan kamar hotel MBS dengan mudah. Check-in fleksibel, pembayaran aman via Virtual Account & Crypto.',
  keywords: ['hotel mbs', 'reservasi hotel', 'hotel merak'],
  openGraph: {
    title: 'MBS Hotel',
    description: '...',
    url: 'https://mbsc.yaaqin.xyz',
    siteName: 'MBS Hotel',
  },
}
export default async function Home() {
  const branches = await getBranchLinks();
  return (
    <BookingPage2 branches={branches} />
  );
}
