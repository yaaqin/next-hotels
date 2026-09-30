'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import toast from 'react-hot-toast'
import {
  CreditCardIcon,
  ArrowDown01Icon,
  ReceiptDollarIcon,
  Tick01Icon,
} from 'hugeicons-react'
import { useReschedulePreview } from '@/src/hooks/query/reschedule/reschedulePreview'
import { useConfirmReschedule } from '@/src/hooks/mutation/reschedule/confirm'
import { useSgtPayment } from '@/src/hooks/custom/payment/useSgtPayment'
import { SlushWalletButton } from '@/src/components/atoms/slushWalletButton'
import { axiosPublic } from '@/src/libs/instance'
import {
  reschedulePaymentMethod,
  reschedulePolicySummary,
  reschedulePreviewState,
  reschedulePricing,
  rescheduleOriginalBooking,
  rescheduleRoomOption,
} from '@/src/models/reschedule/preview'

// ─── Types ────────────────────────────────────────────────────────────────────

type PaymentCategory = 'va' | 'qris' | 'sgt' | 'credit'
type VABank = 'bca' | 'bni' | 'bri' | 'mandiri'

const VA_BANKS: { value: VABank; label: string; logo: string }[] = [
  { value: 'bca', label: 'BCA Virtual Account', logo: 'BCA' },
  { value: 'bni', label: 'BNI Virtual Account', logo: 'BNI' },
  { value: 'bri', label: 'BRI Virtual Account', logo: 'BRI' },
  { value: 'mandiri', label: 'Mandiri Virtual Account', logo: 'MDR' },
]

const PAY_CATS: { key: PaymentCategory; label: string }[] = [
  { key: 'va', label: 'Virtual Account' },
  { key: 'qris', label: 'QRIS' },
  { key: 'sgt', label: 'Crypto (SGT)' },
  { key: 'credit', label: 'Credit' },
]

// Sama dengan halaman reservasi
const DISABLED_PAYMENT: PaymentCategory[] = ['qris']

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount)
}

function formatDate(dateStr: string) {
  if (!dateStr) return '—'
  const [y, m, d] = dateStr.split('T')[0].split('-')
  return `${d} · ${m} · ${y}`
}

function formatPaymentMethod(method: string | null) {
  if (!method) return '—'
  if (method === 'CREDIT') return 'Booking Credit'
  if (method === 'QRIS') return 'QRIS'
  if (method === 'SGT') return 'Crypto (SGT)'
  if (method.startsWith('VA_')) return `${method.replace('VA_', '')} Virtual Account`
  return method
}

function policyWindowLabel(policy: reschedulePolicySummary) {
  return policy.daysUntilCheckIn === 0 ? 'hari H' : `H-${policy.daysUntilCheckIn}`
}

function getErrorMessage(error: unknown) {
  const err = error as { response?: { data?: { message?: string } }; message?: string }
  return err?.response?.data?.message ?? err?.message ?? 'Terjadi kesalahan, coba lagi.'
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] tracking-[0.18em] uppercase text-gray-400 mb-1">{children}</p>
  )
}

function SectionValue({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={`text-sm font-medium text-gray-900 ${className ?? ''}`}>{children}</p>
  )
}

function Divider() {
  return <div className="border-t border-dashed border-gray-200 my-5" />
}

function CardHeader({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-2 mb-5">
      {icon}
      <span className="text-[10px] tracking-widest uppercase text-gray-400">{label}</span>
    </div>
  )
}

function StateCard({
  title,
  description,
  onRetry,
}: {
  title: string
  description: string
  onRetry?: () => void
}) {
  return (
    <div className="min-h-screen bg-[#f5f4f0] py-10 px-4">
      <div className="max-w-md mx-auto bg-white rounded-2xl p-6 shadow-sm text-center">
        <p className="text-base font-semibold text-gray-900">{title}</p>
        <p className="text-sm text-gray-500 mt-2 leading-relaxed">{description}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="block mx-auto mt-5 text-[11px] tracking-widest uppercase font-medium text-blue-500 hover:underline"
          >
            Pilih kamar lain
          </button>
        )}
        <Link
          href="/recent-activity"
          className="inline-block mt-5 px-5 py-2.5 rounded-xl text-[11px] tracking-widest uppercase font-medium bg-gray-900 text-white hover:bg-gray-800 transition"
        >
          Kembali ke Recent Activity
        </Link>
      </div>
    </div>
  )
}

// ─── Old Booking Card ─────────────────────────────────────────────────────────

function OldBookingCard({ booking }: { booking: rescheduleOriginalBooking }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-5">
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-medium tracking-wide bg-red-50 text-red-700 border border-red-100">
          Old booking
        </span>
        <span className="text-[10px] text-gray-400 tracking-wide">
          {booking.bookingCode} · {booking.status}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-5">
        <div>
          <SectionLabel>Check in</SectionLabel>
          <SectionValue>{formatDate(booking.checkIn)}</SectionValue>
        </div>
        <div>
          <SectionLabel>Check out</SectionLabel>
          <SectionValue>{formatDate(booking.checkOut)}</SectionValue>
        </div>
      </div>

      <Divider />

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <SectionLabel>Room number</SectionLabel>
          <SectionValue>{booking.roomNumber ?? '—'}</SectionValue>
        </div>
        <div>
          <SectionLabel>Room type</SectionLabel>
          <SectionValue>{booking.roomTypeName ?? '—'}</SectionValue>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <SectionLabel>Total payment</SectionLabel>
          <SectionValue>{formatCurrency(booking.totalAmount)}</SectionValue>
        </div>
        <div>
          <SectionLabel>Payment method</SectionLabel>
          <SectionValue>{formatPaymentMethod(booking.paymentMethod)}</SectionValue>
        </div>
      </div>
    </div>
  )
}

// ─── New Booking Card ─────────────────────────────────────────────────────────

function NewBookingCard({
  preview,
  isFetching,
  onRoomChange,
}: {
  preview: reschedulePreviewState
  isFetching: boolean
  onRoomChange: (roomId: string) => void
}) {
  const { dates, rooms } = preview
  const selected = rooms.selected

  // Kelompokkan per tipe kamar untuk dropdown
  const allRooms = [...(rooms.originalRoom ? [rooms.originalRoom] : []), ...rooms.alternatives]
  const groups = new Map<string, rescheduleRoomOption[]>()
  for (const room of allRooms) {
    const key = room.roomTypeName || room.roomTypeId
    if (!groups.has(key)) groups.set(key, [])
    groups.get(key)!.push(room)
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between gap-2 mb-5">
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-medium tracking-wide bg-blue-50 text-blue-700 border border-blue-100">
          New booking
        </span>
        <Link href="/recent-activity" className="text-[10px] tracking-wide text-blue-500 hover:underline">
          Ganti tanggal
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-5">
        <div>
          <SectionLabel>Check in</SectionLabel>
          <SectionValue>{formatDate(dates.newCheckIn)}</SectionValue>
        </div>
        <div>
          <SectionLabel>Check out</SectionLabel>
          <SectionValue>{formatDate(dates.newCheckOut)}</SectionValue>
        </div>
      </div>

      <Divider />

      <div className="mb-4">
        <SectionLabel>Kamar</SectionLabel>
        <div className="relative mt-1">
          <select
            value={selected.roomId}
            disabled={isFetching}
            onChange={(e) => onRoomChange(e.target.value)}
            className="w-full appearance-none pl-3 pr-8 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-transparent bg-white text-gray-900 transition disabled:opacity-60"
          >
            {Array.from(groups.entries()).map(([typeName, list]) => (
              <optgroup key={typeName} label={typeName}>
                {list.map((room) => (
                  <option key={room.roomId} value={room.roomId}>
                    No. {room.roomNumber} · Lantai {room.floorId} — {formatCurrency(room.pricePerNight)}/malam
                    {room.isOriginalRoom ? ' (kamar lama)' : ''}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
          <ArrowDown01Icon
            size={13}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          />
        </div>
        {rooms.mustChooseAlternative && (
          <p className="text-[11px] text-amber-600 mt-2 leading-relaxed">
            Kamar lama kamu sudah terisi di tanggal ini, pilih kamar lain.
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <SectionLabel>Room type</SectionLabel>
          <SectionValue>{selected.roomTypeName || '—'}</SectionValue>
        </div>
        <div>
          <SectionLabel>Durasi</SectionLabel>
          <SectionValue>{dates.nights} malam</SectionValue>
        </div>
      </div>
    </div>
  )
}

// ─── Calculation Card ─────────────────────────────────────────────────────────

function CalcRow({
  label,
  sub,
  value,
  valueClass,
}: {
  label: string
  sub?: React.ReactNode
  value: React.ReactNode
  valueClass?: string
}) {
  return (
    <div className="flex items-start justify-between py-4 border-b border-dashed border-gray-100 last:border-b-0">
      <div className="flex-1 pr-4">
        <p className="text-sm text-gray-600">{label}</p>
        {sub && <div className="mt-1">{sub}</div>}
      </div>
      <p className={`text-sm font-medium text-right shrink-0 ${valueClass ?? 'text-gray-900'}`}>
        {value}
      </p>
    </div>
  )
}

function CalculationCard({
  pricing,
  policy,
  room,
  isFetching,
}: {
  pricing: reschedulePricing
  policy: reschedulePolicySummary
  room: rescheduleRoomOption
  isFetching: boolean
}) {
  return (
    <div className={`bg-white rounded-2xl p-6 shadow-sm transition-opacity ${isFetching ? 'opacity-60' : ''}`}>
      <CardHeader
        icon={<ReceiptDollarIcon size={16} className="text-blue-400" />}
        label="Calculation"
      />

      <CalcRow label="Total pembayaran booking lama" value={formatCurrency(pricing.oldPrice)} />

      <CalcRow
        label="Reschedule policy"
        sub={
          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-50 border border-green-100 rounded-lg text-[10px] text-green-700 font-medium">
            <Tick01Icon size={10} />
            {policy.name} · {policyWindowLabel(policy)} · Potongan {policy.penaltyPercent}%
          </span>
        }
        value={
          <span>
            <span className="text-red-500">- {formatCurrency(pricing.penaltyAmount)}</span>
            <br />
            <span className="text-[10px] text-gray-400 font-normal">
              ({policy.penaltyPercent}% dari total lama)
            </span>
          </span>
        }
      />

      <CalcRow
        label="Nilai tersisa dari booking lama"
        sub={<p className="text-[10px] text-gray-400">Dipakai untuk booking baru</p>}
        value={formatCurrency(pricing.retainedAmount)}
        valueClass="text-green-600"
      />

      <CalcRow
        label="Harga booking baru"
        sub={
          <p className="text-[10px] text-gray-400">
            {room.roomTypeName} · {room.nights} malam × {formatCurrency(room.pricePerNight)}
          </p>
        }
        value={formatCurrency(pricing.newPrice)}
      />

      <CalcRow
        label={
          pricing.paymentRequired
            ? 'Kekurangan yang perlu dibayar'
            : pricing.creditWillBeIssued
              ? 'Selisih masuk ke booking credit'
              : 'Tidak ada selisih'
        }
        value={formatCurrency(Math.abs(pricing.difference))}
        valueClass={
          pricing.paymentRequired
            ? 'text-amber-600'
            : pricing.creditWillBeIssued
              ? 'text-green-600'
              : 'text-gray-900'
        }
      />

      <div className="flex items-center justify-between mt-4 px-4 py-3.5 bg-gray-50 rounded-xl border border-dashed border-gray-200">
        <div>
          <p className="text-[10px] tracking-widest uppercase text-gray-400">Total tagihan</p>
          <p className="text-[10px] text-gray-400 mt-0.5">Jumlah yang harus dibayarkan sekarang</p>
        </div>
        <p className="text-xl font-bold text-gray-900">{formatCurrency(pricing.extraCharge)}</p>
      </div>
    </div>
  )
}

// ─── Payment Method Card ──────────────────────────────────────────────────────

interface PaymentCardProps {
  pricing: reschedulePricing
  paymentCategory: PaymentCategory | null
  selectedVA: VABank | null
  onSelectCategory: (cat: PaymentCategory) => void
  onSelectVA: (va: VABank) => void
  onWalletConnected: (address: string) => void
  onWalletDisconnected: () => void
  isPending: boolean
  canSubmit: boolean
  onSubmit: () => void
}

function PaymentMethodCard({
  pricing,
  paymentCategory,
  selectedVA,
  onSelectCategory,
  onSelectVA,
  onWalletConnected,
  onWalletDisconnected,
  isPending,
  canSubmit,
  onSubmit,
}: PaymentCardProps) {
  const isCreditMode = paymentCategory === 'credit'
  const isFree = !pricing.paymentRequired

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <CardHeader
        icon={<CreditCardIcon size={16} className="text-blue-400" />}
        label="Metode pembayaran"
      />

      {isFree ? (
        <div className="px-4 py-3 bg-green-50 border border-green-100 rounded-xl mb-4">
          <p className="text-xs font-medium text-green-700">Tidak ada tagihan</p>
          <p className="text-[11px] text-green-600 leading-relaxed mt-0.5">
            {pricing.creditWillBeIssued
              ? `Booking baru lebih murah dari sisa nilai booking lama. Selisih ${formatCurrency(pricing.creditIssued)} otomatis masuk ke saldo booking credit kamu.`
              : 'Sisa nilai booking lama pas untuk menutup booking baru.'}
          </p>
        </div>
      ) : (
        <>
          <div className="flex flex-wrap gap-2 mb-4">
            {PAY_CATS.map(({ key, label }) => {
              const disabled = DISABLED_PAYMENT.includes(key)
              const isActive = paymentCategory === key
              return (
                <button
                  key={key}
                  disabled={disabled}
                  onClick={() => !disabled && onSelectCategory(key)}
                  className={[
                    'px-4 py-2 rounded-xl text-[10px] tracking-widest uppercase font-medium transition-all duration-200',
                    disabled
                      ? 'bg-gray-50 text-gray-200 cursor-not-allowed border border-dashed border-gray-200'
                      : isActive
                        ? key === 'credit'
                          ? 'bg-emerald-500 text-white shadow-sm shadow-emerald-100'
                          : 'bg-blue-500 text-white shadow-sm shadow-blue-100'
                        : 'bg-gray-100 text-gray-400 hover:bg-gray-200',
                  ].join(' ')}
                >
                  {disabled ? (
                    <>
                      <span className="line-through">{label}</span>
                      <span className="ml-1.5 normal-case tracking-normal text-gray-300">Coming soon</span>
                    </>
                  ) : (
                    label
                  )}
                </button>
              )
            })}
          </div>

          {paymentCategory === 'va' && (
            <div className="border border-gray-100 rounded-xl overflow-hidden mt-2">
              {VA_BANKS.map((bank) => (
                <button
                  key={bank.value}
                  onClick={() => onSelectVA(bank.value)}
                  className={[
                    'w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-gray-50 transition text-left border-b border-gray-50 last:border-b-0',
                    selectedVA === bank.value ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700',
                  ].join(' ')}
                >
                  <span className="w-10 h-6 bg-gray-100 rounded text-[10px] font-bold text-gray-500 flex items-center justify-center shrink-0">
                    {bank.logo}
                  </span>
                  {bank.label}
                </button>
              ))}
            </div>
          )}

          {paymentCategory === 'sgt' && (
            <div className="mt-2 space-y-2">
              <div className="px-4 py-3 bg-amber-50 border border-amber-100 rounded-xl">
                <p className="text-xs font-medium text-amber-700">Pembayaran Crypto (SGT)</p>
                <p className="text-[11px] text-amber-600 leading-relaxed mt-0.5">
                  Hubungkan Sui wallet kamu untuk membayar selisih menggunakan SGT token. Pastikan saldo cukup.
                </p>
              </div>
              <SlushWalletButton onConnected={onWalletConnected} onDisconnected={onWalletDisconnected} />
            </div>
          )}

          {paymentCategory === 'credit' && (
            <div className="mt-2 px-4 py-3 bg-emerald-50 border border-emerald-100 rounded-xl">
              <p className="text-xs font-medium text-emerald-700">Bayar dengan Booking Credit</p>
              <p className="text-[11px] text-emerald-600 leading-relaxed mt-0.5">
                Saldo kredit kamu dipakai untuk melunasi kekurangan ini. Jika saldo tidak mencukupi, pilih metode
                pembayaran lain.
              </p>
            </div>
          )}

          <p className="text-[11px] text-gray-400 leading-relaxed mt-4">
            Booking lama tetap berlaku sampai selisih lunas. Kalau tagihan tidak dibayar dalam 15 menit,
            reschedule dibatalkan otomatis dan booking lama tidak berubah.
          </p>
        </>
      )}

      <button
        onClick={onSubmit}
        disabled={isPending || !canSubmit}
        className={[
          'w-full mt-5 py-3.5 rounded-xl text-[11px] tracking-widest uppercase font-medium transition-all duration-300',
          isPending || !canSubmit
            ? 'bg-gray-100 text-gray-300 cursor-not-allowed'
            : isCreditMode
              ? 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-md shadow-emerald-100'
              : 'bg-blue-500 text-white hover:bg-blue-600 shadow-md shadow-blue-100',
        ].join(' ')}
      >
        {isPending ? (
          <span className="flex items-center justify-center gap-2">
            <span className="w-3.5 h-3.5 rounded-full border-2 border-white/40 border-t-white animate-spin inline-block" />
            Memproses...
          </span>
        ) : isFree ? (
          'Konfirmasi Reschedule'
        ) : isCreditMode ? (
          'Bayar dengan Credit'
        ) : (
          'Konfirmasi & Bayar'
        )}
      </button>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ReschedulePage() {
  const router = useRouter()
  const { id: bookingId } = useParams<{ id: string }>()
  const searchParams = useSearchParams()
  const newCheckIn = searchParams.get('newCheckIn') ?? ''
  const newCheckOut = searchParams.get('newCheckOut') ?? ''

  const [preferredRoomId, setPreferredRoomId] = useState<string | undefined>()
  const { data, isLoading, isFetching, error } = useReschedulePreview({
    bookingId,
    newCheckIn,
    newCheckOut,
    preferredRoomId,
  })
  const preview = data?.data

  const [paymentCategory, setPaymentCategory] = useState<PaymentCategory | null>(null)
  const [selectedVA, setSelectedVA] = useState<VABank | null>(null)
  const [sgtWalletAddress, setSgtWalletAddress] = useState<string | null>(null)
  const [isPayingSgt, setIsPayingSgt] = useState(false)

  const { executePayment } = useSgtPayment()
  const { mutate, isPending } = useConfirmReschedule()

  if (!newCheckIn || !newCheckOut) {
    return (
      <StateCard
        title="Tanggal baru belum dipilih"
        description="Pilih tanggal baru lewat tombol Reschedule di Recent Activity."
      />
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f5f4f0] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-6 h-6 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-500">Menghitung reschedule...</p>
        </div>
      </div>
    )
  }

  if (!preview) {
    return (
      <StateCard
        title="Reschedule tidak bisa diproses"
        description={getErrorMessage(error)}
        onRetry={preferredRoomId ? () => setPreferredRoomId(undefined) : undefined}
      />
    )
  }

  const { pricing } = preview

  const paymentMethod: reschedulePaymentMethod | undefined = !pricing.paymentRequired
    ? undefined
    : paymentCategory === 'va'
      ? selectedVA ?? undefined
      : paymentCategory ?? undefined

  const canSubmit =
    !isFetching &&
    (!pricing.paymentRequired ||
      (!!paymentMethod && (paymentCategory !== 'sgt' || !!sgtWalletAddress)))

  const handleSelectCategory = (cat: PaymentCategory) => {
    setPaymentCategory(cat)
    setSelectedVA(null)
    if (cat !== 'sgt') setSgtWalletAddress(null)
  }

  const handleSubmit = () => {
    if (!canSubmit) return

    mutate(
      {
        bookingId,
        newCheckIn,
        newCheckOut,
        selectedRoomId: preview.rooms.selected.roomId,
        paymentMethod,
        senderWallet: paymentMethod === 'sgt' ? sgtWalletAddress ?? undefined : undefined,
      },
      {
        onSuccess: async (res) => {
          const result = res.data
          const bookingCode = result.newBookingCode

          if (!result.requiresPayment) {
            toast.success(res.message)
            router.push(`/payment/success?bookingCode=${bookingCode}`)
            return
          }

          const payment = result.payment
          if (payment?.type === 'SGT') {
            if (!payment.hotelWalletAddress || !payment.sgtAmountDue) {
              toast.error('Data pembayaran SGT tidak lengkap')
              router.push(`/reservation/${bookingCode}`)
              return
            }
            setIsPayingSgt(true)
            try {
              const txDigest = await executePayment({
                hotelWalletAddress: payment.hotelWalletAddress,
                sgtAmountDue: payment.sgtAmountDue,
              })
              await axiosPublic.post('/booking/sgt/verify', { bookingCode, txDigest })
              router.push(`/payment/success?bookingCode=${bookingCode}`)
            } catch (err) {
              console.error('SGT payment gagal:', err)
              toast.error('Transaksi SGT dibatalkan atau gagal. Booking lama kamu tetap berlaku.')
              router.push(`/reservation/${bookingCode}`)
            } finally {
              setIsPayingSgt(false)
            }
            return
          }

          // VA / QRIS → halaman instruksi bayar
          router.push(`/reservation/${bookingCode}`)
        },
        // Pesan error sudah di-toast oleh axiosUser
      }
    )
  }

  const { originalBooking, policy } = preview

  return (
    <div className="min-h-screen bg-[#f5f4f0] py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-gray-900 tracking-tight">Reschedule booking</h1>
          <p className="text-sm text-gray-400 tracking-widest uppercase mt-1">
            {originalBooking.bookingCode} · Atur ulang tanggal & kamar reservasi kamu
          </p>
          {originalBooking.status === 'CONFIRMED' && (
            <p className="text-xs text-amber-700 bg-amber-50 border border-amber-100 rounded-xl px-4 py-2.5 mt-4 leading-relaxed">
              Booking ini sudah dikonfirmasi resepsionis (hari H), jadi berlaku policy hari H dengan potongan{' '}
              {policy.penaltyPercent}%.
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
          <OldBookingCard booking={originalBooking} />
          <NewBookingCard preview={preview} isFetching={isFetching} onRoomChange={setPreferredRoomId} />
        </div>

        <div className="mb-4">
          <CalculationCard
            pricing={pricing}
            policy={policy}
            room={preview.rooms.selected}
            isFetching={isFetching}
          />
        </div>

        <PaymentMethodCard
          pricing={pricing}
          paymentCategory={paymentCategory}
          selectedVA={selectedVA}
          onSelectCategory={handleSelectCategory}
          onSelectVA={(va) => {
            setSelectedVA(va)
            setPaymentCategory('va')
          }}
          onWalletConnected={setSgtWalletAddress}
          onWalletDisconnected={() => setSgtWalletAddress(null)}
          isPending={isPending || isPayingSgt}
          canSubmit={canSubmit}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  )
}
