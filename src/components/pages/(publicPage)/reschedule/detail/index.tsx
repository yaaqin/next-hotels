'use client'

import { useState, useEffect } from 'react'
import {
  Calendar01Icon,
  Building01Icon,
  CreditCardIcon,
  ArrowDown01Icon,
  ReceiptDollarIcon,
  Tick01Icon,
} from 'hugeicons-react'

// ─── Types ────────────────────────────────────────────────────────────────────

type RoomTypeKey = 'presidential' | 'deluxe' | 'standard' | 'suite'
type PaymentCategory = 'va' | 'qris' | 'sgt' | 'credit'
type VAMethod = 'va_bca' | 'va_bni' | 'va_bri' | 'va_mandiri'

interface OldBooking {
  checkIn: string
  checkOut: string
  roomNumber: string
  roomType: string
  totalPayment: number
  paymentMethod: string
}

interface Calculation {
  oldTotal: number
  penaltyPct: number
  penaltyAmt: number
  retained: number
  newBookingAmt: number
  diff: number
  diffType: 'shortage' | 'credit' | 'even'
}

// ─── Dummy Data ───────────────────────────────────────────────────────────────

const OLD_BOOKING: OldBooking = {
  checkIn: '2026-04-27',
  checkOut: '2026-04-28',
  roomNumber: '312333',
  roomType: 'Presidential',
  totalPayment: 456000,
  paymentMethod: 'BCA Virtual Account',
}

const ROOM_PRICES: Record<RoomTypeKey, number> = {
  presidential: 477000,
  deluxe: 380000,
  standard: 290000,
  suite: 620000,
}

const ROOM_OPTIONS = [
  { value: '312333', label: '312333', floor: 'Lantai 3 · Wing A' },
  { value: '312334', label: '312334', floor: 'Lantai 3 · Wing B' },
  { value: '312335', label: '312335', floor: 'Lantai 3 · Wing C' },
  { value: '214201', label: '214201', floor: 'Lantai 2 · Wing A' },
]

const VA_BANKS = [
  { value: 'va_bca' as VAMethod, label: 'BCA Virtual Account', logo: 'BCA' },
  { value: 'va_bni' as VAMethod, label: 'BNI Virtual Account', logo: 'BNI' },
  { value: 'va_bri' as VAMethod, label: 'BRI Virtual Account', logo: 'BRI' },
  { value: 'va_mandiri' as VAMethod, label: 'Mandiri Virtual Account', logo: 'MDR' },
]

const RESCHEDULE_POLICY = {
  name: 'Standard Policy',
  penaltyPct: 10,
}

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
  const [y, m, d] = dateStr.split('-')
  return `${d} · ${m} · ${y}`
}

function calcReschedule(oldTotal: number, newPrice: number, penaltyPct: number): Calculation {
  const penaltyAmt = Math.round(oldTotal * (penaltyPct / 100))
  const retained = oldTotal - penaltyAmt
  const diff = newPrice - retained
  return {
    oldTotal,
    penaltyPct,
    penaltyAmt,
    retained,
    newBookingAmt: newPrice,
    diff,
    diffType: diff > 0 ? 'shortage' : diff < 0 ? 'credit' : 'even',
  }
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

function CardHeader({
  icon,
  label,
}: {
  icon: React.ReactNode
  label: string
}) {
  return (
    <div className="flex items-center gap-2 mb-5">
      {icon}
      <span className="text-[10px] tracking-widest uppercase text-gray-400">{label}</span>
    </div>
  )
}

// ─── Old Booking Card ─────────────────────────────────────────────────────────

function OldBookingCard({ booking }: { booking: OldBooking }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-5">
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-medium tracking-wide bg-red-50 text-red-700 border border-red-100">
          Old booking
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
          <SectionValue>{booking.roomNumber}</SectionValue>
        </div>
        <div>
          <SectionLabel>Room type</SectionLabel>
          <SectionValue>{booking.roomType}</SectionValue>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <SectionLabel>Total payment</SectionLabel>
          <SectionValue>{formatCurrency(booking.totalPayment)}</SectionValue>
        </div>
        <div>
          <SectionLabel>Payment method</SectionLabel>
          <SectionValue>{booking.paymentMethod}</SectionValue>
        </div>
      </div>
    </div>
  )
}

// ─── New Booking Card ─────────────────────────────────────────────────────────

interface NewBookingCardProps {
  checkIn: string
  checkOut: string
  roomType: RoomTypeKey
  roomNumber: string
  onCheckInChange: (v: string) => void
  onCheckOutChange: (v: string) => void
  onRoomTypeChange: (v: RoomTypeKey) => void
  onRoomNumberChange: (v: string) => void
}

function NewBookingCard({
  checkIn,
  checkOut,
  roomType,
  roomNumber,
  onCheckInChange,
  onCheckOutChange,
  onRoomTypeChange,
  onRoomNumberChange,
}: NewBookingCardProps) {
  const selectedRoom = ROOM_OPTIONS.find((r) => r.value === roomNumber)

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-5">
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-medium tracking-wide bg-blue-50 text-blue-700 border border-blue-100">
          New booking
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-5">
        <div>
          <SectionLabel>Check in</SectionLabel>
          <input
            type="date"
            value={checkIn}
            onChange={(e) => onCheckInChange(e.target.value)}
            className="w-full mt-1 px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-transparent transition text-gray-900"
          />
        </div>
        <div>
          <SectionLabel>Check out</SectionLabel>
          <input
            type="date"
            value={checkOut}
            onChange={(e) => onCheckOutChange(e.target.value)}
            className="w-full mt-1 px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-transparent transition text-gray-900"
          />
        </div>
      </div>

      <Divider />

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <SectionLabel>Room type</SectionLabel>
          <div className="relative mt-1">
            <select
              value={roomType}
              onChange={(e) => onRoomTypeChange(e.target.value as RoomTypeKey)}
              className="w-full appearance-none pl-3 pr-8 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-transparent bg-white text-gray-900 transition"
            >
              <option value="presidential">Presidential</option>
              <option value="deluxe">Deluxe</option>
              <option value="standard">Standard</option>
              <option value="suite">Suite</option>
            </select>
            <ArrowDown01Icon
              size={13}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />
          </div>
        </div>
        <div>
          <SectionLabel>Room number</SectionLabel>
          <div className="relative mt-1">
            <select
              value={roomNumber}
              onChange={(e) => onRoomNumberChange(e.target.value)}
              className="w-full appearance-none pl-3 pr-8 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-transparent bg-white text-gray-900 transition"
            >
              {ROOM_OPTIONS.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
            <ArrowDown01Icon
              size={13}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />
          </div>
        </div>
      </div>

      <div>
        <SectionLabel>Floor</SectionLabel>
        <SectionValue className="text-gray-500 font-normal text-xs mt-0.5">
          {selectedRoom?.floor ?? '—'}
        </SectionValue>
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

function CalculationCard({ calc, roomType }: { calc: Calculation; roomType: RoomTypeKey }) {
  const roomTypeName = roomType.charAt(0).toUpperCase() + roomType.slice(1)

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <CardHeader
        icon={<ReceiptDollarIcon size={16} className="text-blue-400" />}
        label="Calculation"
      />

      <CalcRow
        label="Total pembayaran booking lama"
        value={formatCurrency(calc.oldTotal)}
      />

      <CalcRow
        label="Reschedule policy"
        sub={
          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-50 border border-green-100 rounded-lg text-[10px] text-green-700 font-medium">
            <Tick01Icon size={10} />
            {RESCHEDULE_POLICY.name} · Potongan {RESCHEDULE_POLICY.penaltyPct}%
          </span>
        }
        value={
          <span>
            <span className="text-red-500">- {formatCurrency(calc.penaltyAmt)}</span>
            <br />
            <span className="text-[10px] text-gray-400 font-normal">
              ({calc.penaltyPct}% dari total lama)
            </span>
          </span>
        }
      />

      <CalcRow
        label="Nilai tersisa dari booking lama"
        sub={<p className="text-[10px] text-gray-400">Bisa dipakai untuk booking baru</p>}
        value={formatCurrency(calc.retained)}
        valueClass="text-green-600"
      />

      <CalcRow
        label="Harga booking baru"
        sub={<p className="text-[10px] text-gray-400">{roomTypeName} · 1 malam</p>}
        value={formatCurrency(calc.newBookingAmt)}
      />

      <CalcRow
        label={
          calc.diffType === 'shortage'
            ? 'Kekurangan yang perlu dibayar'
            : calc.diffType === 'credit'
            ? 'Selisih masuk ke booking credit'
            : 'Tidak ada selisih'
        }
        value={formatCurrency(Math.abs(calc.diff))}
        valueClass={
          calc.diffType === 'shortage'
            ? 'text-amber-600'
            : calc.diffType === 'credit'
            ? 'text-green-600'
            : 'text-gray-900'
        }
      />

      {/* Total */}
      <div className="flex items-center justify-between mt-4 px-4 py-3.5 bg-gray-50 rounded-xl border border-dashed border-gray-200">
        <div>
          <p className="text-[10px] tracking-widest uppercase text-gray-400">Total tagihan</p>
          <p className="text-[10px] text-gray-400 mt-0.5">
            Jumlah yang harus dibayarkan sekarang
          </p>
        </div>
        <p className="text-xl font-bold text-gray-900">
          {calc.diffType === 'shortage' ? formatCurrency(calc.diff) : 'Rp 0'}
        </p>
      </div>
    </div>
  )
}

// ─── Payment Method Card ──────────────────────────────────────────────────────

interface PaymentCardProps {
  paymentCategory: PaymentCategory | null
  selectedVA: VAMethod | null
  walletConnected: boolean
  onSelectCategory: (cat: PaymentCategory) => void
  onSelectVA: (va: VAMethod) => void
  onConnectWallet: () => void
  diffType: 'shortage' | 'credit' | 'even'
  isPending: boolean
  onSubmit: () => void
}

function PaymentMethodCard({
  paymentCategory,
  selectedVA,
  walletConnected,
  onSelectCategory,
  onSelectVA,
  onConnectWallet,
  diffType,
  isPending,
  onSubmit,
}: PaymentCardProps) {
  const isCreditMode = paymentCategory === 'credit'
  const isFree = diffType !== 'shortage'

  const PAY_CATS: { key: PaymentCategory; label: string }[] = [
    { key: 'va', label: 'Virtual Account' },
    { key: 'qris', label: 'QRIS' },
    { key: 'sgt', label: 'Crypto (SGT)' },
    { key: 'credit', label: 'Credit' },
  ]

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
            Booking baru lebih murah dari sisa nilai booking lama. Selisih akan otomatis masuk ke
            saldo booking credit kamu.
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
                      <span className="ml-1.5 normal-case tracking-normal text-gray-300">
                        Coming soon
                      </span>
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
                    selectedVA === bank.value
                      ? 'bg-blue-50 text-blue-600 font-medium'
                      : 'text-gray-700',
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
                  Hubungkan Sui wallet kamu untuk membayar menggunakan SGT token. Pastikan wallet
                  sudah terinstall dan memiliki saldo yang cukup.
                </p>
              </div>
              <button
                onClick={onConnectWallet}
                className={[
                  'w-full py-3 rounded-xl text-xs font-medium tracking-wide transition-all duration-200 border',
                  walletConnected
                    ? 'bg-green-50 border-green-200 text-green-700'
                    : 'border-dashed border-gray-300 text-gray-400 hover:border-gray-400 hover:text-gray-600',
                ].join(' ')}
              >
                {walletConnected ? '✓ Wallet terhubung' : '+ Connect Wallet'}
              </button>
            </div>
          )}

          {paymentCategory === 'credit' && (
            <div className="mt-2 px-4 py-3 bg-emerald-50 border border-emerald-100 rounded-xl">
              <p className="text-xs font-medium text-emerald-700">Bayar dengan Booking Credit</p>
              <p className="text-[11px] text-emerald-600 leading-relaxed mt-0.5">
                Saldo kredit kamu akan digunakan untuk melunasi kekurangan pembayaran ini. Jika
                saldo tidak mencukupi, kamu perlu memilih metode pembayaran lain.
              </p>
            </div>
          )}
        </>
      )}

      <button
        onClick={onSubmit}
        disabled={isPending}
        className={[
          'w-full mt-5 py-3.5 rounded-xl text-[11px] tracking-widest uppercase font-medium transition-all duration-300',
          isPending
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
  // New booking state
  const [checkIn, setCheckIn] = useState(OLD_BOOKING.checkIn)
  const [checkOut, setCheckOut] = useState(OLD_BOOKING.checkOut)
  const [roomType, setRoomType] = useState<RoomTypeKey>('presidential')
  const [roomNumber, setRoomNumber] = useState(OLD_BOOKING.roomNumber)

  // Payment state
  const [paymentCategory, setPaymentCategory] = useState<PaymentCategory | null>(null)
  const [selectedVA, setSelectedVA] = useState<VAMethod | null>(null)
  const [walletConnected, setWalletConnected] = useState(false)

  // UI state
  const [isPending, setIsPending] = useState(false)

  // Calculation
  const [calc, setCalc] = useState<Calculation>(() =>
    calcReschedule(OLD_BOOKING.totalPayment, ROOM_PRICES['presidential'], RESCHEDULE_POLICY.penaltyPct)
  )

  useEffect(() => {
    setCalc(
      calcReschedule(OLD_BOOKING.totalPayment, ROOM_PRICES[roomType], RESCHEDULE_POLICY.penaltyPct)
    )
  }, [roomType])

  const handleSelectCategory = (cat: PaymentCategory) => {
    setPaymentCategory(cat)
    setSelectedVA(null)
    if (cat !== 'sgt') setWalletConnected(false)
  }

  const handleSubmit = async () => {
    setIsPending(true)
    // TODO: integrate with reschedule mutation
    await new Promise((r) => setTimeout(r, 1500))
    setIsPending(false)
    console.log('Submit reschedule', {
      checkIn,
      checkOut,
      roomType,
      roomNumber,
      paymentCategory,
      selectedVA,
    })
  }

  return (
    <div className="min-h-screen bg-[#f5f4f0] py-10 px-4">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-gray-900 tracking-tight">
            Reschedule booking
          </h1>
          <p className="text-sm text-gray-400 tracking-widest uppercase mt-1">
            {OLD_BOOKING.roomNumber} · Atur ulang tanggal & kamar reservasi kamu
          </p>
        </div>

        {/* Old + New Booking — side by side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
          <OldBookingCard booking={OLD_BOOKING} />
          <NewBookingCard
            checkIn={checkIn}
            checkOut={checkOut}
            roomType={roomType}
            roomNumber={roomNumber}
            onCheckInChange={setCheckIn}
            onCheckOutChange={setCheckOut}
            onRoomTypeChange={(v) => {
              setRoomType(v)
            }}
            onRoomNumberChange={setRoomNumber}
          />
        </div>

        {/* Calculation */}
        <div className="mb-4">
          <CalculationCard calc={calc} roomType={roomType} />
        </div>

        {/* Payment */}
        <PaymentMethodCard
          paymentCategory={paymentCategory}
          selectedVA={selectedVA}
          walletConnected={walletConnected}
          onSelectCategory={handleSelectCategory}
          onSelectVA={(va) => {
            setSelectedVA(va)
            setPaymentCategory('va')
          }}
          onConnectWallet={() => setWalletConnected((prev) => !prev)}
          diffType={calc.diffType}
          isPending={isPending}
          onSubmit={handleSubmit}
        />

      </div>
    </div>
  )
}