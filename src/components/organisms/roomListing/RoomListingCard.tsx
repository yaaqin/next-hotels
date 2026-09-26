import Link from 'next/link'
import Images from '@/src/components/atoms/images'
import { ListingRoom } from '@/src/models/public/roomListing'
import { formatRupiah, roomPath } from '@/src/app/(publicAccess)/(publicDashboard2)/hotel/hotel.helper'

interface RoomListingCardProps {
  room: ListingRoom
  // Tanggal dibawa ke detail kamar; tanpa tanggal detail pakai hari ini
  stayQuery: string
}

export default function RoomListingCard({ room, stayQuery }: RoomListingCardProps) {
  const { pricing } = room
  const href = `${roomPath(room)}${stayQuery}`

  return (
    <article className="bg-white rounded-2xl overflow-hidden border border-[#DCE6F2] shadow-sm flex flex-col">
      {/* Tinggi dikunci rasio 16:10 — gambar diposisikan absolut supaya tidak ikut ukuran aslinya */}
      <Link href={href} className="relative block aspect-[16/10] overflow-hidden bg-[#EEF3FA]">
        {room.roomType.imageUrl ? (
          <Images
            src={room.roomType.imageUrl}
            alt={`Kamar ${room.roomType.name ?? ''} ${room.number} — ${room.site.nama}`}
            fill
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-3xl">🛏️</div>
        )}
        {pricing.isDiscounted && (
          <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-widest uppercase bg-[#1A56A0] text-white">
            Promo
          </span>
        )}
      </Link>

      <div className="p-4 flex flex-col gap-3 flex-1">
        <div className="space-y-1">
          <p className="text-[10px] font-semibold tracking-widest uppercase text-[#5B90C9]">
            {room.site.nama} · Lantai {room.floor}
          </p>
          <h2 className="text-base font-semibold text-[#05111F]">
            <Link href={href} className="hover:underline">
              {room.roomType.name} · Kamar {room.number}
            </Link>
          </h2>
          {room.bedType.name && <p className="text-xs text-gray-500">{room.bedType.name}</p>}
        </div>

        {room.roomType.description && (
          <p className="text-xs text-gray-500 line-clamp-2">{room.roomType.description}</p>
        )}

        <div className="mt-auto flex items-end justify-between gap-3 pt-2 border-t border-dashed border-[#DCE6F2]">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-gray-400">
              {pricing.isStartingPrice ? 'Mulai dari' : `${pricing.nights} malam`}
            </p>
            {pricing.originalPrice && (
              <p className="text-xs text-gray-400 line-through">{formatRupiah(pricing.originalPrice)}</p>
            )}
            <p className="text-lg font-bold text-[#05111F]">
              {formatRupiah(pricing.isStartingPrice ? pricing.price : pricing.totalPrice)}
            </p>
            {pricing.isStartingPrice && <p className="text-[10px] text-gray-400">per malam</p>}
          </div>
          <Link
            href={href}
            className="px-4 py-2 rounded-full text-xs font-semibold tracking-wide bg-[#05111F] text-white hover:bg-[#0A1E38] transition-colors"
          >
            Lihat kamar
          </Link>
        </div>
      </div>
    </article>
  )
}
