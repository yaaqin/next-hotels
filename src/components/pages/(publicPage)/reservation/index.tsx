'use client'

import { useState } from 'react'
import {
  Building01Icon,
  Calendar01Icon,
  CreditCardIcon,
  UserIcon,
  Mail01Icon,
  SmartPhone01Icon,
  IdIcon,
  ArrowDown01Icon,
} from 'hugeicons-react'
import { useBookingStore } from '@/src/stores/booking'
import { useCreateBooking } from '@/src/hooks/mutation/booking/create'

// ─── Types ────────────────────────────────────────────────────────────────────

type PaymentMethod = 'va_bca' | 'va_bni' | 'va_bri' | 'va_mandiri' | 'qris' | 'gopay'
type PaymentCategory = 'va' | 'qris' | 'gopay'

const VA_BANKS = [
  { value: 'va_bca', label: 'BCA Virtual Account', logo: 'BCA' },
  { value: 'va_bni', label: 'BNI Virtual Account', logo: 'BNI' },
  { value: 'va_bri', label: 'BRI Virtual Account', logo: 'BRI' },
  { value: 'va_mandiri', label: 'Mandiri Virtual Account', logo: 'MDR' },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(dateStr: string) {
  if (!dateStr) return '—'
  const [y, m, d] = dateStr.split('-')
  return `${d} · ${m} · ${y}`
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount)
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function Label({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] tracking-[0.18em] uppercase text-gray-400 mb-1">
      {children}
    </p>
  )
}

function Field({ children }: { children: React.ReactNode }) {
  return <p className="text-sm font-medium text-gray-900">{children}</p>
}

function Divider() {
  return <div className="border-t border-dashed border-gray-200 my-6" />
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ReservationPage() {
  const { payload, setContact, setPaymentMethod, isReadyToSubmit } = useBookingStore()
  const { checkInDate, checkOutDate, items, contact } = payload

  const [paymentCategory, setPaymentCategory] = useState<PaymentCategory | null>(null)
  const [selectedVA, setSelectedVA] = useState<PaymentMethod | null>(null)
  const [vaOpen, setVaOpen] = useState(false)

  // Mock data — nanti dari store / props
  const room = {
    type: items[0]?.roomTypeId ? 'Standard' : '—',
    floor: '01',
    number: items[0]?.roomId ?? '—',
    image: 'https://id.marinabaysands.com/content/dam/marinabaysands/hotel/sands-premiere-room/gallery/sands-premier-room-no-view-1.jpg',
    pricePerNight: 229000,
    nights: checkInDate && checkOutDate
      ? Math.max(1, Math.ceil((new Date(checkOutDate).getTime() - new Date(checkInDate).getTime()) / 86400000))
      : 1,
  }

  const totalPrice = room.pricePerNight * room.nights
  const tax = Math.round(totalPrice * 0.11)
  const grandTotal = totalPrice + tax

  const handleSelectPayment = (cat: PaymentCategory) => {
    setPaymentCategory(cat)
    setSelectedVA(null)
    if (cat === 'qris') setPaymentMethod('qris' as any)
    if (cat === 'gopay') setPaymentMethod('gopay' as any)
  }

  const handleSelectVA = (method: PaymentMethod) => {
    setSelectedVA(method)
    setVaOpen(false)
    setPaymentMethod(method.replace('va_', '') as any)
  }


  const { mutate, isPending, isSuccess, data, error } =
    useCreateBooking()

  const handleBooking = () => {
    mutate({
      siteCode: 'MERAK',
      checkInDate: '2026-03-16',
      checkOutDate: '2026-03-17',
      paymentMethod: 'qris',
      contact: {
        fullName: 'Temennya anaknya sudarso',
        email: 'tasu@gmail.com',
        phone: '081234567890',
        idType: 'KTP',
        idNumber: '3201234567890001',
      },
      items: [
        {
          roomId: 'MERAK01004',
          roomTypeId: '6021ad0f-ed26-4e9c-86f7-9f52eb00c767',
        },
      ],
    })
  }

  return (
    <div className="min-h-screen bg-[#f5f4f0] py-10 px-4">
      <div className="max-w-4xl mx-auto">

        {/* Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-gray-900 tracking-tight">Reservation</h1>
          <p className="text-sm text-gray-400 tracking-widest uppercase mt-1">
            {payload.siteCode || 'MBS'} · Review your booking details
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">

          {/* ── Left Column ── */}
          <div className="flex-1 space-y-4">

            {/* Stay Info Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-5">
                <Calendar01Icon size={16} className="text-blue-400" />
                <span className="text-xs tracking-widest uppercase text-gray-400">Stay</span>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <Label>Check In</Label>
                  <Field>{formatDate(checkInDate)}</Field>
                </div>
                <div>
                  <Label>Check Out</Label>
                  <Field>{formatDate(checkOutDate)}</Field>
                </div>
              </div>

              <Divider />

              <div className="flex items-center gap-2 mb-5">
                <Building01Icon size={16} className="text-blue-400" />
                <span className="text-xs tracking-widest uppercase text-gray-400">Room</span>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>Room Type</Label>
                  <Field>{room.type}</Field>
                </div>
                <div>
                  <Label>Floor</Label>
                  <Field>{room.floor}</Field>
                </div>
                <div>
                  <Label>Room Number</Label>
                  <Field>{room.number}</Field>
                </div>
              </div>
            </div>

            {/* Contact Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-5">
                <UserIcon size={16} className="text-blue-400" />
                <span className="text-xs tracking-widest uppercase text-gray-400">Contact</span>
              </div>

              <div className="space-y-4">
                {/* Full Name */}
                <div className="relative">
                  <UserIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />
                  <input
                    type="text"
                    placeholder="Full Name *"
                    value={contact.fullName}
                    onChange={(e) => setContact({ fullName: e.target.value })}
                    className="w-full pl-9 pr-4 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-transparent transition placeholder:text-gray-300"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {/* Email */}
                  <div className="relative">
                    <Mail01Icon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />
                    <input
                      type="email"
                      placeholder="Email *"
                      value={contact.email}
                      onChange={(e) => setContact({ email: e.target.value })}
                      className="w-full pl-9 pr-4 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-transparent transition placeholder:text-gray-300"
                    />
                  </div>

                  {/* Phone */}
                  <div className="relative">
                    <SmartPhone01Icon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />
                    <input
                      type="tel"
                      placeholder="Phone *"
                      value={contact.phone}
                      onChange={(e) => setContact({ phone: e.target.value })}
                      className="w-full pl-9 pr-4 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-transparent transition placeholder:text-gray-300"
                    />
                  </div>
                </div>

                {/* ID (optional) */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="relative">
                    <IdIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />
                    <select
                      value={contact.idType ?? ''}
                      onChange={(e) => setContact({ idType: e.target.value as any || undefined })}
                      className="w-full pl-9 pr-4 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-transparent transition text-gray-400 appearance-none bg-white"
                    >
                      <option value="">ID Type (optional)</option>
                      <option value="KTP">KTP</option>
                      <option value="PASSPORT">Passport</option>
                      <option value="SIM">SIM</option>
                    </select>
                  </div>
                  <input
                    type="text"
                    placeholder="ID Number (optional)"
                    value={contact.idNumber ?? ''}
                    onChange={(e) => setContact({ idNumber: e.target.value || undefined })}
                    className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-transparent transition placeholder:text-gray-300"
                  />
                </div>
              </div>
            </div>

            {/* Payment Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-5">
                <CreditCardIcon size={16} className="text-blue-400" />
                <span className="text-xs tracking-widest uppercase text-gray-400">Payment</span>
              </div>

              {/* Payment Category Tabs */}
              <div className="flex gap-2 mb-4">
                {(['va', 'qris', 'gopay'] as PaymentCategory[]).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => handleSelectPayment(cat)}
                    className={`px-4 py-2 rounded-xl text-xs tracking-widest uppercase font-medium transition-all duration-200
                      ${paymentCategory === cat
                        ? 'bg-blue-500 text-white shadow-sm shadow-blue-200'
                        : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                      }`}
                  >
                    {cat === 'va' ? 'Virtual Account' : cat.toUpperCase()}
                  </button>
                ))}
              </div>

              {/* VA Bank Dropdown */}
              {paymentCategory === 'va' && (
                <div className="relative mt-2">
                  <button
                    onClick={() => setVaOpen(!vaOpen)}
                    className="w-full flex items-center justify-between px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-700 hover:border-blue-300 transition"
                  >
                    <span className={selectedVA ? 'text-gray-900' : 'text-gray-300'}>
                      {selectedVA
                        ? VA_BANKS.find((b) => b.value === selectedVA)?.label
                        : 'Pilih bank...'}
                    </span>
                    <ArrowDown01Icon
                      size={14}
                      className={`text-gray-400 transition-transform duration-200 ${vaOpen ? 'rotate-180' : ''}`}
                    />
                  </button>

                  {vaOpen && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-100 rounded-xl shadow-lg z-10 overflow-hidden">
                      {VA_BANKS.map((bank) => (
                        <button
                          key={bank.value}
                          onClick={() => handleSelectVA(bank.value as PaymentMethod)}
                          className={`w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-gray-50 transition text-left
                            ${selectedVA === bank.value ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700'}`}
                        >
                          <span className="w-10 h-6 bg-gray-100 rounded text-[10px] font-bold text-gray-500 flex items-center justify-center">
                            {bank.logo}
                          </span>
                          {bank.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {paymentCategory === 'qris' && (
                <div className="mt-2 px-4 py-3 bg-blue-50 rounded-xl text-sm text-blue-600 text-center">
                  QR Code akan ditampilkan setelah konfirmasi
                </div>
              )}

              {paymentCategory === 'gopay' && (
                <div className="mt-2 px-4 py-3 bg-green-50 rounded-xl text-sm text-green-600 text-center">
                  Notifikasi akan dikirim ke aplikasi GoPay kamu
                </div>
              )}
            </div>

          </div>

          {/* ── Right Column — Price Summary ── */}
          <div className="lg:w-72 space-y-4">
            <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-6">

              {/* Room image */}
              <div className="w-full h-36 rounded-xl overflow-hidden mb-5 bg-gray-100">
                <img
                  src={room.image}
                  alt="Room"
                  className="w-full h-full object-cover"
                />
              </div>

              <p className="text-xs tracking-widest uppercase text-gray-400 mb-1">Price Summary</p>
              <p className="text-base font-semibold text-gray-900 mb-4">{room.type}</p>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-gray-500">
                  <span>{formatCurrency(room.pricePerNight)} × {room.nights} malam</span>
                  <span className="text-gray-900">{formatCurrency(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Pajak (11%)</span>
                  <span className="text-gray-900">{formatCurrency(tax)}</span>
                </div>
              </div>

              <div className="border-t border-dashed border-gray-200 my-4" />

              <div className="flex justify-between items-center">
                <span className="text-xs tracking-widest uppercase text-gray-400">Total</span>
                <span className="text-lg font-bold text-gray-900">{formatCurrency(grandTotal)}</span>
              </div>

              <button
                disabled={!isReadyToSubmit()}
                className={`w-full mt-5 py-3.5 rounded-xl text-sm tracking-widest uppercase font-medium transition-all duration-300
                  ${isReadyToSubmit()
                    ? 'bg-blue-500 text-white hover:bg-blue-600 shadow-md shadow-blue-100'
                    : 'bg-gray-100 text-gray-300 cursor-not-allowed'
                  }`}
              >
                Confirm & Pay
              </button>

              {!isReadyToSubmit() && (
                <p className="text-center text-[10px] text-gray-300 mt-2 tracking-wide">
                  Lengkapi semua data untuk melanjutkan
                </p>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}