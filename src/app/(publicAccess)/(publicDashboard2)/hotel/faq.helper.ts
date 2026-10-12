import type { AutoFaqKey, ListingFaqFacts, ResolvedListing } from '@/src/models/public/roomListing'
import type { ServerT } from '@/src/i18n/server'
import { BRAND } from './hotel.helper'

export interface FaqItem {
  question: string
  answer: string
}

const MAX_FACILITIES = 8
const MAX_LIST = 10

// Kunci teks (i18n) → jenis FAQ otomatis yang bisa diatur admin
const AUTO_KEY: Record<string, AutoFaqKey> = {
  price: 'price',
  promo: 'price',
  count: 'roomTypes',
  types: 'roomTypes',
  facilities: 'facilities',
  address: 'location',
  locations: 'location',
  availability: 'availability',
  payment: 'payment',
  reschedule: 'reschedule',
  refund: 'refund',
  bookingData: 'bookingData',
}

// FAQ RLP: FAQ otomatis (dirakit dari data) + FAQ buatan admin, diurutkan sesuai dashboard.
// FAQ otomatis tidak memuat klaim yang tidak tercatat di sistem — hal seperti jam check-in,
// sarapan, atau parkir ditulis admin sebagai FAQ buatan sendiri.
export function buildListingFaq(
  resolved: ResolvedListing,
  facts: ListingFaqFacts,
  t: ServerT,
  locale: string,
): FaqItem[] {
  // BE lama / cache lama belum mengirim auto & custom → semua FAQ otomatis tampil, urutan bawaan
  const order = facts.auto ? new Map(facts.auto.map((a) => [a.key, a.sortOrder])) : null
  const auto = buildAutoFaq(resolved, facts, t, locale)
    .filter((item) => !order || order.has(item.key))
    .map(({ key, ...item }, i) => ({ ...item, sortOrder: order?.get(key) ?? (i + 1) * 10 }))
  const custom = (facts.custom ?? []).map(({ question, answer, sortOrder }) => ({ question, answer, sortOrder }))

  return [...auto, ...custom]
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map(({ question, answer }) => ({ question, answer }))
}

function buildAutoFaq(
  resolved: ResolvedListing,
  facts: ListingFaqFacts,
  t: ServerT,
  locale: string,
): (FaqItem & { key: AutoFaqKey })[] {
  const list = (items: string[]) => new Intl.ListFormat(locale, { type: 'conjunction' }).format(items)
  const money = (value: number, currency: string) =>
    new Intl.NumberFormat(locale, { style: 'currency', currency, maximumFractionDigits: 0 }).format(value)
  const range = (min: number, max: number | null) =>
    max === null
      ? t('roomListing.faq.range.orMore', { n: min })
      : min === max
        ? min === 0
          ? t('roomListing.faq.range.day0')
          : t('roomListing.faq.range.single', { n: min })
        : t('roomListing.faq.range.between', { min, max })

  const place = resolved.location?.label ?? t('roomListing.allBranches')
  const type = resolved.roomType?.displayName
  const subject = type ? t('roomListing.faq.subjectType', { type }) : t('roomListing.faq.subjectAll')
  const vars = { place, subject, brand: BRAND }
  const faq: (FaqItem & { key: AutoFaqKey })[] = []
  // Kalimat bisa diawali {{subject}} ("rooms in ...") → huruf pertama dikapitalkan
  const capitalize = (text: string) => text.charAt(0).toLocaleUpperCase(locale) + text.slice(1)
  const add = (key: string, answer: string, extra: Record<string, string | number> = {}) =>
    faq.push({
      key: AUTO_KEY[key],
      question: capitalize(t(`roomListing.faq.${key}Q`, { ...vars, ...extra })),
      answer: capitalize(answer),
    })

  // Harga
  if (facts.total > 0) {
    const [first] = facts.prices
    if (resolved.promo) {
      add('promo', t('roomListing.faq.promoA', { ...vars, count: facts.total, min: money(first.min, first.currency) }))
    } else if (facts.prices.length > 1) {
      const mins = list(facts.prices.map((p) => money(p.min, p.currency)))
      add('price', t('roomListing.faq.priceMultiA', { ...vars, list: mins }))
    } else if (first.min === first.max) {
      add('price', t('roomListing.faq.priceSingleA', { ...vars, min: money(first.min, first.currency) }))
    } else {
      add(
        'price',
        t('roomListing.faq.priceA', { ...vars, min: money(first.min, first.currency), max: money(first.max, first.currency) }),
      )
    }
  }

  // Tipe kamar / jumlah kamar tipe ini
  if (type && facts.roomTypes.length) {
    const cheapest = facts.roomTypes[0]
    add('count', t('roomListing.faq.countA', { ...vars, count: facts.total, price: money(cheapest.minPrice, cheapest.currency) }))
  } else if (facts.roomTypes.length > 1) {
    const items = facts.roomTypes.slice(0, MAX_LIST).map((rt) =>
      t('roomListing.faq.typeItem', { name: rt.name, rooms: rt.count, price: money(rt.minPrice, rt.currency) }),
    )
    add('types', t('roomListing.faq.typesA', { ...vars, count: facts.roomTypes.length, list: list(items) }))
  }

  // Fasilitas
  const { everyRoom, someRooms } = facts.facilities
  if (everyRoom.length || someRooms.length) {
    const parts = [
      everyRoom.length && t('roomListing.faq.facilitiesEvery', { list: list(everyRoom.slice(0, MAX_FACILITIES)) }),
      someRooms.length &&
        t(everyRoom.length ? 'roomListing.faq.facilitiesSome' : 'roomListing.faq.facilitiesSomeOnly', {
          list: list(someRooms.slice(0, MAX_FACILITIES)),
        }),
      t('roomListing.faq.facilitiesSearch'),
    ]
    add('facilities', parts.filter(Boolean).join(' '))
  }

  // Lokasi
  const sites = facts.sites
  if (sites.length === 1 && sites[0].address) {
    add('address', t('roomListing.faq.addressA', { ...vars, site: sites[0].nama, address: sites[0].address }), {
      site: sites[0].nama,
    })
  } else if (sites.length > 1) {
    const items = sites
      .slice(0, MAX_LIST)
      .map((s) => (s.address ? t('roomListing.faq.siteWithAddress', { site: s.nama, address: s.address }) : s.nama))
    add('locations', t('roomListing.faq.locationsA', { ...vars, count: sites.length, list: list(items) }))
  }

  // Cek ketersediaan
  add('availability', t('roomListing.faq.availabilityA', vars))

  // Pembayaran
  if (facts.paymentMethods.length) {
    const methods = facts.paymentMethods.map((m) => m.label)
    const hasBill = facts.paymentMethods.some((m) => ['bca', 'bni', 'bri', 'mandiri', 'qris'].includes(m.method))
    add(
      'payment',
      [t('roomListing.faq.paymentA', { list: list(methods) }), hasBill && t('roomListing.faq.paymentDeadline')]
        .filter(Boolean)
        .join(' '),
    )
  }

  // Reschedule
  const reschedule = facts.reschedule.policies
  if (reschedule.length) {
    const items = reschedule.map((p) =>
      p.penaltyPercent === 0
        ? t('roomListing.faq.rescheduleFree', { range: range(p.minDays, p.maxDays) })
        : t('roomListing.faq.reschedulePenalty', { range: range(p.minDays, p.maxDays), percent: p.penaltyPercent }),
    )
    const coversDayH = reschedule.some((p) => p.minDays === 0)
    add(
      'reschedule',
      [
        t('roomListing.faq.rescheduleA', { list: list(items) }),
        t('roomListing.faq.rescheduleConfirmed'),
        !coversDayH && t('roomListing.faq.rescheduleNoDayH'),
        !facts.reschedule.allowReReschedule && t('roomListing.faq.rescheduleOnce'),
        t('roomListing.faq.rescheduleMultiRoom'),
      ]
        .filter(Boolean)
        .join(' '),
    )
  }

  // Pembatalan & refund
  const refund = facts.refund.policies
  if (refund.length) {
    const items = refund.map((p) => {
      const base = t('roomListing.faq.refundItem', { range: range(p.minDays, p.maxDays), percent: p.refundPercent })
      if (!p.allowCash && p.allowCredit) return `${base} ${t('roomListing.faq.creditOnly')}`
      if (p.allowCash && !p.allowCredit) return `${base} ${t('roomListing.faq.cashOnly')}`
      return base
    })
    add('refund', `${t('roomListing.faq.refundA', { list: list(items) })} ${t('roomListing.faq.refundTypes')}`)
  }

  // Data booking
  add('bookingData', t('roomListing.faq.bookingDataA'))

  return faq
}

// FAQPage tetap schema.org yang valid; isinya harus sama persis dengan yang tampil di halaman
export function faqJsonLd(items: FaqItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  }
}
