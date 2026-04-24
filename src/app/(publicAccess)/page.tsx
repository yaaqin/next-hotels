import BookingPage2 from "@/src/components/pages/(publicPage)/home/bookingPage2";

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
export default function Home() {
  return (
    <BookingPage2/>
  );
}
