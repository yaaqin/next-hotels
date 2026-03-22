'use client'

import { useParams, useSearchParams, useRouter } from 'next/navigation'
import { useRoomDetailPublic } from '@/src/hooks/query/rooms/publicDetail'
import SliderImage from '@/src/components/organisms/galleries/sliderImage'
import { publicRoomDetailState } from '@/src/models/public/room/detail'

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function Skeleton() {
  return (
    <div className="min-h-screen bg-white animate-pulse">
      <div className="w-full h-72 bg-gray-100" />
      <div className="px-5 pt-6 space-y-4">
        <div className="h-4 w-20 bg-gray-100 rounded-full" />
        <div className="h-7 w-36 bg-gray-100 rounded-xl" />
        <div className="h-4 w-48 bg-gray-100 rounded-full" />
        <div className="h-px bg-gray-100 my-4" />
        <div className="grid grid-cols-2 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 bg-gray-100 rounded-2xl" />
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Availability Badge ───────────────────────────────────────────────────────
function AvailabilityBadge({ isAllowToCheckIn }: { isAllowToCheckIn: boolean }) {
  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide
      ${isAllowToCheckIn
        ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
        : 'bg-red-50 text-red-500 border border-red-100'
      }`}>
      <span className={`w-1.5 h-1.5 rounded-full ${isAllowToCheckIn ? 'bg-emerald-400' : 'bg-red-400'}`} />
      {isAllowToCheckIn ? 'Tersedia' : 'Tidak Tersedia'}
    </div>
  )
}

// ─── Info Card ────────────────────────────────────────────────────────────────
function InfoCard({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="border border-gray-100 rounded-2xl p-4 space-y-1">
      <p className="text-[10px] font-semibold tracking-widest uppercase text-gray-400">{label}</p>
      {children}
    </div>
  )
}

// ─── Detail Content ───────────────────────────────────────────────────────────
function RoomDetailContent({ room, checkin, checkout }: {
  room: publicRoomDetailState
  checkin: string
  checkout: string
}) {
  const router = useRouter()

  const nights = checkin && checkout
    ? Math.max(0, Math.round((new Date(checkout).getTime() - new Date(checkin).getTime()) / 86400000))
    : 0

  const handleReservasi = () => {
    console.log('Reservasi payload:', {
      roomId: room.id,
      roomNumber: room.number,
      siteCode: room.siteCode,
      checkin,
      checkout,
      nights,
      roomType: room.roomType.translation.name,
      bedType: room.bedType.translation.name,
    })
  }

  return (
    <div className="min-h-screen bg-white relative">

      {/* ── Gallery ── */}
      {room.gallery?.images?.length > 0 ? (
        <SliderImage data={{
          id: room.gallery.id,
          title: room.gallery.title,
          createdAt: room.gallery.createdAt,
          createdBy: room.createdBy,
          images: room.gallery.images,
        }} />
      ) : (
        <div className="w-full h-64 bg-gray-100 flex items-center justify-center">
          <svg className="w-14 h-14 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
              d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909" />
          </svg>
        </div>
      )}

      <div className="px-5 pt-6 pb-32 space-y-6">

        {/* ── Header ── */}
        <div className="space-y-2">
          <p className="text-[10px] font-semibold tracking-widest uppercase text-gray-400">
            {room.site.nama} · Lantai {room.floorId}
          </p>
          <div className="flex items-start justify-between gap-3">
            <h1 className="text-2xl font-bold text-gray-900">
              Kamar {room.number}
            </h1>
            <AvailabilityBadge isAllowToCheckIn={room.isAllowToCheckIn} />
          </div>
          <p className="text-sm text-gray-400 font-mono">{room.id}</p>
        </div>

        <hr className="border-gray-100" />

        {/* ── Tanggal ── */}
        {checkin && checkout && (
          <div className="flex items-center justify-between bg-gray-50 rounded-2xl px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-white border border-gray-100 flex items-center justify-center">
                <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25" />
                </svg>
              </div>
              <div>
                <p className="text-[10px] text-gray-400 font-semibold tracking-wider uppercase">Tanggal Menginap</p>
                <p className="text-xs font-semibold text-gray-800">
                  {checkin} → {checkout}
                  <span className="ml-2 text-gray-400 font-normal">({nights} malam)</span>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ── Room Type & Bed Type ── */}
        <div className="grid grid-cols-2 gap-3">
          <InfoCard label="Tipe Kamar">
            <p className="text-sm font-semibold text-gray-800">{room.roomType.translation.name}</p>
            {room.roomType.translation.desk && (
              <p className="text-xs text-gray-400 leading-relaxed">{room.roomType.translation.desk}</p>
            )}
          </InfoCard>

          <InfoCard label="Tipe Kasur">
            <p className="text-sm font-semibold text-gray-800">{room.bedType.translation.name}</p>
            <p className="text-xs text-gray-400">{room.bedType.translation.size}</p>
            {room.bedType.translation.description && (
              <p className="text-xs text-gray-400">{room.bedType.translation.description}</p>
            )}
          </InfoCard>
        </div>

        {/* ── Fasilitas ── */}
        <div className="border border-gray-100 rounded-2xl p-4 space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-semibold tracking-widest uppercase text-gray-400">
              Fasilitas
            </p>
            <span className="text-[10px] font-semibold text-gray-400 bg-gray-50 border border-gray-100 px-2 py-0.5 rounded-full">
              {room.facilityGroup.code}
            </span>
          </div>
          {room.facilityGroup.note && (
            <p className="text-xs text-gray-400">{room.facilityGroup.note}</p>
          )}
          <div className="space-y-4">
            {room.facilityGroup.facilities.map((facility) => (
              <div key={facility.type.id}>
                <p className="text-[10px] font-semibold tracking-widest uppercase text-gray-400 mb-2">
                  {facility.type.name}
                </p>
                <div className="flex flex-wrap gap-2">
                  {facility.items.map((item) => (
                    <span
                      key={item.id}
                      className="px-3 py-1 text-xs text-gray-600 bg-gray-50 border border-gray-100 rounded-full"
                    >
                      {item.name}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Site Info ── */}
        <div className="border border-gray-100 rounded-2xl p-4 space-y-3">
          <p className="text-[10px] font-semibold tracking-widest uppercase text-gray-400">Lokasi</p>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-[10px] text-gray-400 mb-0.5">Nama</p>
              <p className="font-medium text-gray-800 text-xs">{room.site.nama}</p>
            </div>
            <div>
              <p className="text-[10px] text-gray-400 mb-0.5">Lokasi</p>
              <p className="font-medium text-gray-800 text-xs">{room.site.lokasi}</p>
            </div>
            <div>
              <p className="text-[10px] text-gray-400 mb-0.5">Site Code</p>
              <p className="font-mono font-medium text-gray-800 text-xs">{room.site.sitecode}</p>
            </div>
            <div>
              <p className="text-[10px] text-gray-400 mb-0.5">Status</p>
              <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold
                ${room.site.isActive ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'}`}>
                {room.site.isActive ? 'Aktif' : 'Nonaktif'}
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* ── CTA Fixed Bottom ── */}
      <div className="sticky bottom-0 bg-white/95 backdrop-blur-sm border-t border-gray-100 px-5 py-4 z-40">
        {room.isAllowToCheckIn ? (
          <button
            onClick={handleReservasi}
            className="w-full bg-gray-900 text-white font-semibold rounded-2xl py-4 text-sm tracking-wide hover:bg-gray-700 transition-colors"
          >
            Reservasi Sekarang
          </button>
        ) : (
          <div className="w-full bg-gray-100 text-gray-400 font-semibold rounded-2xl py-4 text-sm tracking-wide text-center">
            Kamar Tidak Tersedia
          </div>
        )}
        {checkin && checkout && (
          <p className="text-center text-[10px] text-gray-400 mt-2 tracking-wide">
            {checkin} → {checkout} · {nights} malam
          </p>
        )}
      </div>

    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function PublicRoomDetailPage() {
  const params = useParams<{ id: string }>()
  const searchParams = useSearchParams()
  const id = params.id

  const checkin = searchParams.get('checkin') ?? ''
  const checkout = searchParams.get('checkout') ?? ''

  const { data, isLoading, error } = useRoomDetailPublic(id)
  const room = data?.data

  if (isLoading) return <Skeleton />

  if (error || !room) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-6">
        <div className="text-center space-y-3">
          <p className="text-4xl">🛏️</p>
          <p className="text-lg font-bold text-gray-900">Kamar tidak ditemukan</p>
          <p className="text-sm text-gray-400">Coba kembali atau pilih kamar lain</p>
        </div>
      </div>
    )
  }

  return <RoomDetailContent room={room} checkin={checkin} checkout={checkout} />
}