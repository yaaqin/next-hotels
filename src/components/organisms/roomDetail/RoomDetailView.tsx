import Link from 'next/link'
import { Suspense, type ReactNode } from 'react'
import RoomImageGallery from '@/src/components/organisms/galleries/sliderImage/roomImageGallery'
import ListingFilters, { type ListingFiltersLabels } from '@/src/components/organisms/roomListing/ListingFilters'
import { PriceTag, type PriceTagLabels } from '@/src/components/molecules/priceTag'
import { FACILITY_ICONS } from '@/src/constans/room'
import { publicRoomDetailState } from '@/src/models/public/room/detail'
import { ServerT } from '@/src/i18n/server'
import RoomReserveBar, { type ReserveState } from './RoomReserveBar'

interface Props {
  room: publicRoomDetailState
  // Tanggal yang dipakai untuk harga & ketersediaan; hasDates=false → tanggal default (harga acuan)
  stay: { checkin: string; checkout: string; hasDates: boolean }
  heading: string
  // Link balik ke halaman tipe kamar (yang diindex)
  typeLink: { path: string; label: string }
  t: ServerT
  locale: string
  priceLabels: PriceTagLabels
  filterLabels: ListingFiltersLabels
  breadcrumb: ReactNode
}

function InfoCard({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="bg-white border border-[#DCE6F2] rounded-2xl p-4 space-y-1">
      <p className="text-[10px] font-semibold tracking-widest uppercase text-[#5B90C9]">{label}</p>
      {children}
    </div>
  )
}

// Detail kamar dirender penuh di server — crawler & preview share melihat isi yang sama dengan user.
// Satu-satunya bagian client: galeri (lightbox), pilih tanggal, dan tombol reservasi.
export default function RoomDetailView({
  room,
  stay,
  heading,
  typeLink,
  t,
  locale,
  priceLabels,
  filterLabels,
  breadcrumb,
}: Props) {
  const { pricing } = room
  const typeName = room.roomType.translation.name
  const images = room.gallery?.images ?? []
  const facilities = room.facilityGroup?.facilities ?? []

  // Tanpa tanggal pilihan user, ketersediaan dari tanggal default tidak ditampilkan (bisa menyesatkan)
  const reserveState: ReserveState = !stay.hasDates
    ? 'pickDates'
    : room.isAllowToCheckIn && pricing
      ? 'ready'
      : 'unavailable'

  const summary = pricing ? (
    <div>
      <p className="text-[10px] uppercase tracking-widest text-gray-400">
        {stay.hasDates ? `${t('roomDetail.total')} · ${t('roomListing.nights', { count: pricing.nights })}` : t('roomListing.startingFrom')}
      </p>
      {pricing.originalPrice && !stay.hasDates && (
        <p className="text-xs text-gray-400 line-through">
          <PriceTag display={pricing.display} field="originalPrice" amountIdr={pricing.originalPrice} locale={locale} labels={priceLabels} />
        </p>
      )}
      <p className="text-lg font-bold text-[#05111F]">
        <PriceTag
          display={pricing.display}
          field={stay.hasDates ? 'totalPrice' : 'price'}
          amountIdr={stay.hasDates ? pricing.totalPrice : pricing.pricePerNight}
          locale={locale}
          labels={priceLabels}
        />
      </p>
      {!stay.hasDates && <p className="text-[10px] text-gray-400">{t('roomListing.perNight')}</p>}
    </div>
  ) : (
    <p className="text-xs text-gray-500">{t('roomDetail.noPrice')}</p>
  )

  return (
    <div className="min-h-screen bg-[#EEF3FA]" style={{ fontFamily: "'Montserrat', sans-serif" }}>
      {/* ── Header ── */}
      <header className="bg-[#05111F] px-6 py-8 md:py-10">
        <div className="max-w-4xl mx-auto space-y-4">
          {breadcrumb}
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="space-y-1">
              <p className="text-[10px] font-semibold tracking-widest uppercase text-[#6A9EC5]">
                {room.site.nama} · {t('roomListing.floor')} {room.floorId}
              </p>
              <h1 className="text-2xl md:text-3xl font-semibold text-[#C8DCEF]">{heading}</h1>
            </div>
            {stay.hasDates && (
              <span
                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide ${
                  room.isAllowToCheckIn ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${room.isAllowToCheckIn ? 'bg-emerald-400' : 'bg-red-400'}`} />
                {room.isAllowToCheckIn ? t('roomDetail.available') : t('roomDetail.unavailable')}
              </span>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8 space-y-6">
        {images.length > 0 && (
          <RoomImageGallery images={images} alt={t('roomDetail.galleryAlt', { type: typeName, number: room.number })} />
        )}

        {/* ── Tanggal: cuma ubah query string, canonical tetap path tanpa tanggal ── */}
        <section id="stay-dates" className="space-y-2 scroll-mt-6">
          <h2 className="text-[10px] font-semibold tracking-widest uppercase text-[#5B90C9]">{t('roomDetail.stayDates')}</h2>
          <Suspense>
            <ListingFilters labels={filterLabels} showSort={false} />
          </Suspense>
          {!stay.hasDates && <p className="text-xs text-gray-500">{t('roomDetail.pickDatesHint')}</p>}
        </section>

        {/* ── Tipe kamar & kasur ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <InfoCard label={t('roomDetail.roomType')}>
            <p className="text-sm font-semibold text-[#05111F]">{typeName}</p>
            {room.roomType.translation.desk && (
              <p className="text-xs text-gray-500 leading-relaxed">{room.roomType.translation.desk}</p>
            )}
          </InfoCard>
          <InfoCard label={t('roomDetail.bedType')}>
            <p className="text-sm font-semibold text-[#05111F]">{room.bedType.translation.name}</p>
            {room.bedType.translation.size && <p className="text-xs text-gray-500">{room.bedType.translation.size}</p>}
            {room.bedType.translation.description && (
              <p className="text-xs text-gray-500">{room.bedType.translation.description}</p>
            )}
          </InfoCard>
        </div>

        {/* ── Fasilitas ── */}
        {facilities.length > 0 && (
          <section className="bg-white border border-[#DCE6F2] rounded-2xl p-5 space-y-5">
            <h2 className="text-[10px] font-semibold tracking-widest uppercase text-[#5B90C9]">{t('roomDetail.facilities')}</h2>
            {room.facilityGroup.note && <p className="text-xs text-gray-500 -mt-2">{room.facilityGroup.note}</p>}
            <div className="space-y-5">
              {facilities.map((facility) => {
                const icon = FACILITY_ICONS[facility.type.code] ?? FACILITY_ICONS.DEFAULT
                return (
                  <div key={facility.type.id} className="space-y-2.5">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-[#EEF3FA] flex items-center justify-center flex-shrink-0">
                        <img
                          src={`https://cdn.hugeicons.com/icons/${icon}-stroke-rounded.svg`}
                          alt=""
                          className="w-3.5 h-3.5 opacity-50"
                        />
                      </div>
                      <h3 className="text-[10px] font-semibold tracking-widest uppercase text-gray-500">{facility.type.name}</h3>
                    </div>
                    <ul className="flex flex-wrap gap-1.5 pl-8">
                      {facility.items.map((item) => (
                        <li
                          key={item.id}
                          className="px-2.5 py-1 text-[11px] text-gray-600 bg-[#EEF3FA] rounded-full leading-none"
                        >
                          {item.name}
                        </li>
                      ))}
                    </ul>
                  </div>
                )
              })}
            </div>
          </section>
        )}

        {/* ── Lokasi ── */}
        <InfoCard label={t('roomDetail.location')}>
          <p className="text-sm font-semibold text-[#05111F]">{room.site.nama}</p>
          {room.site.lokasi && <p className="text-xs text-gray-500">{room.site.lokasi}</p>}
        </InfoCard>

        <Link href={typeLink.path} className="inline-block text-sm font-semibold text-[#1A56A0] hover:underline">
          {typeLink.label} →
        </Link>
      </main>

      <RoomReserveBar
        state={reserveState}
        checkin={stay.checkin}
        checkout={stay.checkout}
        booking={{
          siteCode: room.site.sitecode,
          roomId: room.id,
          roomTypeId: room.roomType.id,
          roomTypeName: typeName,
          imageUrl: images[0]?.url ?? '',
          pricePerNight: pricing?.pricePerNight ?? 0,
          nights: pricing?.nights ?? 0,
          totalPrice: pricing?.totalPrice ?? 0,
        }}
        labels={{
          reserve: t('roomDetail.reserve'),
          pickDates: t('roomDetail.pickDatesCta'),
          unavailable: t('roomDetail.unavailableCta'),
        }}
        summary={summary}
      />
    </div>
  )
}
