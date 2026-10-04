'use client'

import { useRevenueDetail } from '@/src/hooks/query/finance/revenueDaily'
import { revenueDetailBooking } from '@/src/models/finance/revenueDaily'

// Rincian uang masuk di satu hari: total dari berapa booking, siapa yang bayar,
// kamar apa yang dibooking, lewat metode apa.

const fmtRp = (v: number) => `Rp ${v.toLocaleString('id-ID')}`

const fmtLongDate = (d: string) =>
  new Date(`${d}T00:00:00`).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

// Jam pembayaran dalam WIB
const fmtTime = (iso: string) =>
  new Date(iso).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Jakarta' })

const fmtStay = (checkIn: string, checkOut: string) => {
  const opts: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'short', timeZone: 'UTC' }
  return `${new Date(checkIn).toLocaleDateString('id-ID', opts)} – ${new Date(checkOut).toLocaleDateString('id-ID', opts)}`
}

const METHOD_LABEL: Record<string, string> = {
  VA_BCA: 'VA BCA',
  VA_BNI: 'VA BNI',
  VA_BRI: 'VA BRI',
  VA_MANDIRI: 'VA Mandiri',
  QRIS: 'QRIS',
  SGT: 'Crypto (SGT)',
  UNKNOWN: 'Lainnya',
}
const methodLabel = (m: string | null) => (m ? METHOD_LABEL[m] ?? m : '—')

function Stat({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-xl bg-gray-50 px-4 py-3">
      <p className="text-[11px] uppercase tracking-wide text-gray-400">{label}</p>
      <p className="text-lg font-semibold text-gray-900 mt-0.5">{value}</p>
      {hint && <p className="text-[11px] text-gray-400">{hint}</p>}
    </div>
  )
}

function RoomsCell({ booking }: { booking: revenueDetailBooking }) {
  return (
    <div className="space-y-0.5">
      {booking.items.map((item, i) => (
        <p key={i} className="text-gray-700">
          {item.roomTypeName ?? '—'}
          {item.roomNumber && <span className="text-gray-400"> · No. {item.roomNumber}</span>}
        </p>
      ))}
      <p className="text-[11px] text-gray-400">
        {fmtStay(booking.checkInDate, booking.checkOutDate)} · {booking.items[0]?.nights ?? 0} malam
      </p>
    </div>
  )
}

export default function RevenueDetail({ date, siteCode }: { date: string; siteCode?: string }) {
  const { data, isLoading, isFetching } = useRevenueDetail(date, siteCode)
  const detail = data?.data

  return (
    <div className={`w-full bg-white rounded-2xl border border-gray-100 p-5 transition-opacity ${isFetching ? 'opacity-60' : ''}`}>
      <div className="mb-4">
        <p className="text-sm font-semibold text-gray-700">Rincian uang masuk</p>
        <p className="text-xs text-gray-400 mt-0.5">{fmtLongDate(date)}</p>
      </div>

      {isLoading || !detail ? (
        <div className="h-40 rounded-xl bg-gray-50 animate-pulse" />
      ) : (
        <div className="space-y-5">
          {/* Ringkasan */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
            <Stat label="Uang masuk" value={fmtRp(detail.summary.revenue)} />
            <Stat
              label="Booking dibayar"
              value={String(detail.summary.bookings)}
              hint={detail.summary.reschedulePayments ? `${detail.summary.reschedulePayments} selisih reschedule` : undefined}
            />
            <Stat label="Kamar" value={String(detail.summary.rooms)} />
            <Stat label="Tamu" value={String(detail.summary.guests)} />
            <Stat label="Credit dipakai" value={fmtRp(detail.summary.creditUsed)} hint="Tidak dihitung uang masuk" />
          </div>

          {detail.bookings.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-6">Belum ada pembayaran masuk di hari ini.</p>
          ) : (
            <>
              {/* Per metode & per tipe kamar */}
              <div className="grid md:grid-cols-2 gap-3">
                <div className="rounded-xl border border-gray-100 p-4">
                  <p className="text-xs font-semibold text-gray-500 mb-2">Per metode bayar</p>
                  <ul className="space-y-1.5">
                    {detail.byMethod.map((m) => (
                      <li key={m.method} className="flex justify-between text-sm">
                        <span className="text-gray-600">
                          {methodLabel(m.method)} <span className="text-gray-400">· {m.count} booking</span>
                        </span>
                        <span className="font-medium text-gray-900">{fmtRp(m.amount)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-xl border border-gray-100 p-4">
                  <p className="text-xs font-semibold text-gray-500 mb-2">Kamar yang dibooking</p>
                  <ul className="space-y-1.5">
                    {detail.byRoomType.map((r, i) => (
                      <li key={i} className="flex justify-between text-sm">
                        <span className="text-gray-600">{r.roomTypeName ?? '—'}</span>
                        <span className="text-gray-900">
                          {r.rooms} kamar <span className="text-gray-400">· {r.nights} malam</span>
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Daftar pembayaran */}
              <div className="overflow-x-auto rounded-xl border border-gray-100">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-left text-[11px] uppercase tracking-wide text-gray-400">
                    <tr>
                      <th className="px-4 py-2.5 font-medium">Jam</th>
                      <th className="px-4 py-2.5 font-medium">Booking</th>
                      <th className="px-4 py-2.5 font-medium">Tamu</th>
                      <th className="px-4 py-2.5 font-medium">Kamar</th>
                      <th className="px-4 py-2.5 font-medium">Metode</th>
                      <th className="px-4 py-2.5 font-medium text-right">Nominal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {detail.bookings.map((b) => (
                      <tr key={b.bookingCode} className="align-top">
                        <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{fmtTime(b.paidAt)}</td>
                        <td className="px-4 py-3">
                          <p className="font-mono text-xs text-gray-700">{b.bookingCode}</p>
                          <p className="text-[11px] text-gray-400">
                            {b.siteCode} · {b.status}
                            {b.isReschedule && <span className="ml-1 text-amber-600">· Selisih reschedule</span>}
                          </p>
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-gray-800">{b.guestName ?? '—'}</p>
                          <p className="text-[11px] text-gray-400">{b.guestEmail ?? b.guestPhone ?? ''}</p>
                        </td>
                        <td className="px-4 py-3">
                          <RoomsCell booking={b} />
                        </td>
                        <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{methodLabel(b.method)}</td>
                        <td className="px-4 py-3 text-right whitespace-nowrap">
                          <p className="font-medium text-gray-900">{fmtRp(b.amount)}</p>
                          {b.amount !== b.totalAmount && (
                            <p className="text-[11px] text-gray-400">dari total {fmtRp(b.totalAmount)}</p>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {/* Booking yang dibayar pakai credit */}
          {detail.creditUsages.length > 0 && (
            <div className="rounded-xl border border-gray-100 p-4">
              <p className="text-xs font-semibold text-gray-500 mb-2">Dibayar pakai booking credit</p>
              <ul className="space-y-1.5">
                {detail.creditUsages.map((u, i) => (
                  <li key={i} className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      <span className="text-gray-400">{fmtTime(u.usedAt)}</span> ·{' '}
                      <span className="font-mono text-xs">{u.bookingCode}</span> · {u.guestName ?? '—'}
                    </span>
                    <span className="text-gray-900">{fmtRp(u.amount)}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
