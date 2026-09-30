import { notFound, permanentRedirect } from 'next/navigation'
import RoomDetailView from '@/src/components/organisms/roomDetail/RoomDetailView'
import PreferenceSync from '@/src/components/organisms/roomListing/PreferenceSync'
import { getPublicRoomDetail, getRequestCurrency, getRequestLang } from '@/src/services/roomListing'
import { getServerT } from '@/src/i18n/server'
import { LANG_LOCALE } from '@/src/utils/currencyCookie'
import {
  filterLabels,
  parseListingQuery,
  priceTagLabels,
  stayFromQuery,
  toQueryString,
} from '../../../hotel/hotel.helper'

type PageProps = {
  params: Promise<{ id: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

// Route lama (by id) dari flow booking → 301 ke RDP resmi /hotel/{cabang}/kamar/{slug},
// tanggal pilihan user ikut dibawa. Fallback render di sini kalau slug belum di-backfill.
export default async function page({ params, searchParams }: PageProps) {
  const [{ id }, rawSearchParams, lang, currency] = await Promise.all([
    params,
    searchParams,
    getRequestLang(),
    getRequestCurrency(),
  ])
  const query = parseListingQuery(rawSearchParams)
  const stay = stayFromQuery(query)

  const room = await getPublicRoomDetail(decodeURIComponent(id), stay, lang, currency)
  if (!room) notFound()

  if (room.site.slug && room.slug) {
    permanentRedirect(`/hotel/${room.site.slug}/kamar/${room.slug}${toQueryString(rawSearchParams)}`)
  }

  const t = getServerT(lang)
  const typeName = room.roomType.translation.name
  return (
    <>
      <PreferenceSync serverLang={lang} serverCurrency={currency} />
      <RoomDetailView
        room={room}
        stay={stay}
        heading={`${typeName} · ${t('roomListing.room')} ${room.number}`}
        typeLink={{ path: '/hotel', label: t('roomListing.otherRoomTypes') }}
        t={t}
        locale={LANG_LOCALE[lang]}
        priceLabels={priceTagLabels(t)}
        filterLabels={filterLabels(t)}
        breadcrumb={null}
      />
    </>
  )
}
