'use client'

import { useState, useEffect } from 'react'
import { signIn } from 'next-auth/react'
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
import { roomNumberListState } from '@/src/models/public/roomAvailibility/listRoomNumber'
import { usePublicRoomNumberAvailibility } from '@/src/hooks/query/roomAvailibility/publicRoomNumberList'
import { BookingPayload } from '@/src/models/bookings/create'
import { useRouter } from 'next/navigation'
import { SlushWalletButton } from '@/src/components/atoms/slushWalletButton'
import { useSgtPayment } from '@/src/hooks/custom/payment/useSgtPayment'
import { axiosPublic } from '@/src/libs/instance'
import { useSafeSession } from "@/src/hooks/custom/payment/useSafeSession"
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'

type PaymentMethod = 'va_bca' | 'va_bni' | 'va_bri' | 'va_mandiri' | 'qris' | 'sgt'
type PaymentCategory = 'va' | 'qris' | 'sgt'

// ─── Validation Types ────────────────────────────────────────────────────────

type FormErrors = {
  fullName?: string
  phone?: string
  idType?: string
  idNumber?: string
  roomNumber?: string
  paymentMethod?: string
}

// ─── Validation Logic ────────────────────────────────────────────────────────

function validateForm({
  contact,
  selectedRoom,
  paymentCategory,
  selectedVA,
  sgtWalletAddress,
}: {
  contact: any
  selectedRoom: roomNumberListState | null
  paymentCategory: PaymentCategory | null
  selectedVA: PaymentMethod | null
  sgtWalletAddress: string | null
}): FormErrors {
  const errors: FormErrors = {}

  if (!contact.fullName?.trim()) {
    errors.fullName = 'Nama lengkap wajib diisi'
  }

  if (!contact.phone?.trim()) {
    errors.phone = 'Nomor telepon wajib diisi'
  }

  if (!contact.idType) {
    errors.idType = 'Tipe identitas wajib dipilih'
  }

  if (!contact.idNumber?.trim()) {
    errors.idNumber = 'Nomor identitas wajib diisi'
  }

  if (!selectedRoom) {
    errors.roomNumber = 'Nomor kamar wajib dipilih'
  }

  if (!paymentCategory) {
    errors.paymentMethod = 'Metode pembayaran wajib dipilih'
  } else if (paymentCategory === 'va' && !selectedVA) {
    errors.paymentMethod = 'Bank virtual account wajib dipilih'
  } else if (paymentCategory === 'sgt' && !sgtWalletAddress) {
    errors.paymentMethod = 'Hubungkan wallet SGT terlebih dahulu'
  }

  return errors
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const VA_BANKS = [
  { value: 'va_bca', label: 'BCA Virtual Account', logo: 'BCA' },
  { value: 'va_bni', label: 'BNI Virtual Account', logo: 'BNI' },
  { value: 'va_bri', label: 'BRI Virtual Account', logo: 'BRI' },
  { value: 'va_mandiri', label: 'Mandiri Virtual Account', logo: 'MDR' },
]

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

function Label({ children }: { children: React.ReactNode }) {
  return <p className="text-[10px] tracking-[0.18em] uppercase text-gray-400 mb-1">{children}</p>
}

function Field({ children }: { children: React.ReactNode }) {
  return <p className="text-sm font-medium text-gray-900">{children}</p>
}

function Divider() {
  return <div className="border-t border-dashed border-gray-200 my-6" />
}

// ─── Inline Error Message ─────────────────────────────────────────────────────

function ErrorMsg({ message }: { message?: string }) {
  if (!message) return null
  return (
    <p className="text-[11px] text-red-400 mt-1.5 ml-1 flex items-center gap-1">
      <span className="inline-block w-1 h-1 rounded-full bg-red-400 flex-shrink-0" />
      {message}
    </p>
  )
}

// ─── Skeletons & Gates ───────────────────────────────────────────────────────

function ContactCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm animate-pulse">
      <div className="flex items-center gap-2 mb-5">
        <div className="w-4 h-4 rounded bg-gray-100" />
        <div className="w-16 h-3 rounded bg-gray-100" />
      </div>
      <div className="space-y-4">
        <div className="h-11 rounded-xl bg-gray-100" />
        <div className="grid grid-cols-2 gap-3">
          <div className="h-11 rounded-xl bg-gray-100" />
          <div className="h-11 rounded-xl bg-gray-100" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="h-11 rounded-xl bg-gray-100" />
          <div className="h-11 rounded-xl bg-gray-100" />
        </div>
      </div>
    </div>
  )
}

function GoogleLoginGate() {
  return (
    <div className="bg-white rounded-2xl p-8 shadow-sm flex flex-col items-center text-center gap-4">
      <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
        <UserIcon size={22} className="text-blue-400" />
      </div>
      <div>
        <p className="text-sm font-semibold text-gray-900 mb-1">Login diperlukan</p>
        <p className="text-xs text-gray-400 leading-relaxed">
          Masuk dengan Google untuk melanjutkan reservasi.
        </p>
      </div>
      <button
        onClick={() => signIn('google')}
        className="flex items-center gap-3 px-5 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:border-gray-400 hover:shadow-sm transition-all duration-200"
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4" />
          <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.859-3.048.859-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853" />
          <path d="M3.964 10.706A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.038l3.007-2.332z" fill="#FBBC05" />
          <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.962L3.964 7.294C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335" />
        </svg>
        Masuk dengan Google
      </button>
    </div>
  )
}

// ─── Contact Card ─────────────────────────────────────────────────────────────

function ContactCard({
  session,
  contact,
  setContact,
  errors,
}: {
  session: NonNullable<ReturnType<typeof useSafeSession>['session']>
  contact: any
  setContact: (val: any) => void
  errors: FormErrors
}) {
  const { t } = useTranslation()

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <UserIcon size={16} className="text-blue-400" />
          <span className="text-xs tracking-widest uppercase text-gray-400">{t("text.reservation.contact")}</span>
        </div>
        {session.user && (
          <div className="flex items-center gap-2">
            {session.user.image && (
              <img src={session.user.image} alt="avatar" className="w-6 h-6 rounded-full" />
            )}
            <span className="text-xs text-gray-400">{session.user.email}</span>
          </div>
        )}
      </div>
      <div className="space-y-4">

        {/* Full Name */}
        <div>
          <div className="relative">
            <UserIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />
            <input
              type="text"
              placeholder={t("text.reservation.fullNamePlaceholder")}
              value={contact.fullName}
              onChange={(e) => setContact({ fullName: e.target.value })}
              className={`w-full pl-9 pr-4 py-3 text-sm border rounded-xl focus:outline-none focus:ring-2 transition placeholder:text-gray-300
                ${errors.fullName
                  ? 'border-red-300 focus:ring-red-100 focus:border-red-300'
                  : 'border-gray-200 focus:ring-blue-200 focus:border-transparent'
                }`}
            />
          </div>
          <ErrorMsg message={errors.fullName} />
        </div>

        {/* Email & Phone */}
        <div className="grid grid-cols-2 gap-3">
          <div className="relative">
            <Mail01Icon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />
            <input
              type="email"
              placeholder={t("text.reservation.emailPlaceholder")}
              value={session?.user?.email ?? ''}
              readOnly
              onChange={() => { }}
              className="w-full pl-9 pr-4 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none transition placeholder:text-gray-300 bg-gray-50 text-gray-400 cursor-not-allowed select-none"
            />
          </div>
          <div>
            <div className="relative">
              <SmartPhone01Icon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />
              <input
                type="tel"
                placeholder={t("text.reservation.phonePlaceholder")}
                value={contact.phone}
                onChange={(e) => setContact({ phone: e.target.value })}
                className={`w-full pl-9 pr-4 py-3 text-sm border rounded-xl focus:outline-none focus:ring-2 transition placeholder:text-gray-300
                  ${errors.phone
                    ? 'border-red-300 focus:ring-red-100 focus:border-red-300'
                    : 'border-gray-200 focus:ring-blue-200 focus:border-transparent'
                  }`}
              />
            </div>
            <ErrorMsg message={errors.phone} />
          </div>
        </div>

        {/* ID Type & ID Number */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <div className="relative">
              <IdIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />
              <select
                value={contact.idType ?? ''}
                onChange={(e) => setContact({ idType: (e.target.value as any) || undefined })}
                className={`w-full pl-9 pr-4 py-3 text-sm border rounded-xl focus:outline-none focus:ring-2 transition appearance-none bg-white
                  ${errors.idType
                    ? 'border-red-300 focus:ring-red-100 focus:border-red-300 text-gray-700'
                    : 'border-gray-200 focus:ring-blue-200 focus:border-transparent text-gray-400'
                  }`}
              >
                <option value="">{t("text.reservation.idTypePlaceholder")}</option>
                <option value="KTP">KTP</option>
                <option value="PASSPORT">{t("text.reservation.passport")}</option>
                <option value="SIM">SIM</option>
              </select>
            </div>
            <ErrorMsg message={errors.idType} />
          </div>
          <div>
            <input
              type="text"
              placeholder={t("text.reservation.idNumberPlaceholder")}
              value={contact.idNumber ?? ''}
              onChange={(e) => setContact({ idNumber: e.target.value || undefined })}
              className={`w-full px-4 py-3 text-sm border rounded-xl focus:outline-none focus:ring-2 transition placeholder:text-gray-300
                ${errors.idNumber
                  ? 'border-red-300 focus:ring-red-100 focus:border-red-300'
                  : 'border-gray-200 focus:ring-blue-200 focus:border-transparent'
                }`}
            />
            <ErrorMsg message={errors.idNumber} />
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ReservationPage() {
  const { session, isLoading, isAuthenticated, isUnauthenticated } = useSafeSession()
  const { payload, setContact, setPaymentMethod, setRoomId, isReadyToSubmit } = useBookingStore()
  const { checkInDate, checkOutDate, items, contact } = payload

  const { executePayment } = useSgtPayment()
  const [sgtWalletAddress, setSgtWalletAddress] = useState<string | null>(null)

  // ── Validation state ──────────────────────────────────────────────────────
  const [errors, setErrors] = useState<FormErrors>({})
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    if (session?.user?.name && !contact.fullName) {
      setContact({ fullName: session.user.name })
    }
  }, [session])

  const roomTypeId = items[0]?.roomTypeId ?? ''
  const roomImageUrl = items[0]?.imageUrl

  const { data: roomData, isLoading: roomLoading } = usePublicRoomNumberAvailibility(
    checkInDate,
    checkOutDate,
    roomTypeId
  )

  const [selectedRoom, setSelectedRoom] = useState<roomNumberListState | null>(null)
  const [roomOpen, setRoomOpen] = useState(false)

  const handleSelectRoom = (room: roomNumberListState) => {
    setSelectedRoom(room)
    setRoomOpen(false)
    setRoomId(roomTypeId, room.id, roomImageUrl ?? '')
    // Clear room error on select
    if (submitted) setErrors((prev) => ({ ...prev, roomNumber: undefined }))
  }

  const firstAvailableRoom = roomData?.data?.find((r) => r.isAvailable)
  const displayRoom = selectedRoom ?? firstAvailableRoom
  const pricing = displayRoom?.pricing

  const [paymentCategory, setPaymentCategory] = useState<PaymentCategory | null>(null)
  const [selectedVA, setSelectedVA] = useState<PaymentMethod | null>(null)
  const [vaOpen, setVaOpen] = useState(false)

  const handleSelectPayment = (cat: PaymentCategory) => {
    setPaymentCategory(cat)
    setSelectedVA(null)
    if (cat === 'qris') setPaymentMethod('qris' as any)
    if (cat !== 'sgt') setSgtWalletAddress(null)
    // Clear payment error on select
    if (submitted) setErrors((prev) => ({ ...prev, paymentMethod: undefined }))
  }

  const handleSelectVA = (method: PaymentMethod) => {
    setSelectedVA(method)
    setVaOpen(false)
    setPaymentMethod(method.replace('va_', '') as any)
    // Clear payment error on bank select
    if (submitted) setErrors((prev) => ({ ...prev, paymentMethod: undefined }))
  }

  const { mutate, isPending } = useCreateBooking()
  const { reset } = useBookingStore()
  const router = useRouter()

  const preselectedRoomId = items[0]?.roomId
  useEffect(() => {
    if (!preselectedRoomId || !roomData?.data || selectedRoom) return
    const match = roomData.data.find((r) => r.id === preselectedRoomId)
    if (match) setSelectedRoom(match)
  }, [preselectedRoomId, roomData?.data])

  // ── Re-validate on field change after first submit attempt ────────────────
  useEffect(() => {
    if (!submitted) return
    const newErrors = validateForm({ contact, selectedRoom, paymentCategory, selectedVA, sgtWalletAddress })
    setErrors(newErrors)
  }, [contact, selectedRoom, paymentCategory, selectedVA, sgtWalletAddress, submitted])

  const handleBooking = async () => {
    setSubmitted(true)
    const newErrors = validateForm({ contact, selectedRoom, paymentCategory, selectedVA, sgtWalletAddress })
    setErrors(newErrors)

    // Stop if there are validation errors
    if (Object.keys(newErrors).length > 0) return

    if (!isReadyToSubmit()) return

    const { items, ...rest } = payload
    mutate(
      {
        ...rest,
        items: items.map(({ imageUrl, ...item }) => item),
        senderWallet: sgtWalletAddress ?? undefined,
      } as BookingPayload,
      {
        onSuccess: async (res) => {
          const payment = res?.data?.payment
          const bookingCode = res?.data?.booking?.bookingCode
          if (paymentCategory === 'sgt' && payment?.type === 'SGT') {
            if (!payment.hotelWalletAddress || !payment.sgtAmountDue) {
              toast.error('Data pembayaran SGT tidak lengkap')
              return
            }
            const { hotelWalletAddress, sgtAmountDue } = payment
            try {
              const txDigest = await executePayment({ hotelWalletAddress, sgtAmountDue })
              await axiosPublic.post('/booking/sgt/verify', { bookingCode, txDigest })
              reset()
              router.push(`/payment/success?bookingCode=${bookingCode}`)
            } catch (err) {
              console.error('SGT payment gagal:', err)
              toast.error('Transaksi SGT dibatalkan atau gagal.')
            }
            return
          }
          reset()
          router.push(`/reservation/${bookingCode}`)
        },
        onError: (err: any) => {
          const message =
            err?.response?.data?.message ??
            err?.message ??
            'Terjadi kesalahan, coba lagi.'
          toast.error(message)
        },
      }
    )
  }

  // canSubmit: tetap true biar button bisa diklik, validasi jalan di handleBooking
  const canSubmit = isAuthenticated && !isPending

  const { t } = useTranslation()

  const DISABLED_PAYMENT_METHODS: PaymentCategory[] = ['qris']

  return (
    <div className="min-h-screen bg-[#f5f4f0] py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-gray-900 tracking-tight">
            {t("text.reservation.title")}
          </h1>
          <p className="text-sm text-gray-400 tracking-widest uppercase mt-1">
            {payload.siteCode || 'MBS'} · {t("text.reservation.reviewDetails")}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 space-y-4">

            {/* Stay Info */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-5">
                <Calendar01Icon size={16} className="text-blue-400" />
                <span className="text-xs tracking-widest uppercase text-gray-400">
                  {t("text.reservation.stay")}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div><Label>{t("text.reservation.checkIn")}</Label><Field>{formatDate(checkInDate)}</Field></div>
                <div><Label>{t("text.reservation.checkOut")}</Label><Field>{formatDate(checkOutDate)}</Field></div>
              </div>
              <Divider />
              <div className="flex items-center gap-2 mb-5">
                <Building01Icon size={16} className="text-blue-400" />
                <span className="text-xs tracking-widest uppercase text-gray-400">{t("text.reservation.room")}</span>
              </div>
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div><Label>{t("text.reservation.roomType")}</Label><Field>{displayRoom?.roomType.name ?? '—'}</Field></div>
                <div><Label>{t("text.reservation.floor")}</Label><Field>{selectedRoom?.floor ?? '—'}</Field></div>
                <div><Label>{t("text.reservation.bedType")}</Label><Field>{displayRoom?.bedType.name ?? '—'}</Field></div>
              </div>

              {/* Room Number dengan error */}
              <div>
                <Label>{t("text.reservation.roomNumber")}</Label>
                <div className="relative mt-1">
                  <button
                    onClick={() => setRoomOpen(!roomOpen)}
                    disabled={roomLoading || !roomData?.data?.length}
                    className={`w-full flex items-center justify-between px-4 py-3 border rounded-xl text-sm hover:border-blue-300 transition disabled:opacity-50 disabled:cursor-not-allowed
                      ${errors.roomNumber ? 'border-red-300' : 'border-gray-200'}`}
                  >
                    <span className={selectedRoom ? 'text-gray-900' : 'text-gray-300'}>
                      {roomLoading ? 'Memuat kamar...' : selectedRoom ? `Room ${selectedRoom.number}` : 'Pilih nomor kamar...'}
                    </span>
                    <ArrowDown01Icon size={14} className={`text-gray-400 transition-transform duration-200 ${roomOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {roomOpen && roomData?.data && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-100 rounded-xl shadow-lg z-10 overflow-hidden max-h-52 overflow-y-auto">
                      {roomData.data.filter((r) => r.isAvailable).map((room) => (
                        <button
                          key={room.id}
                          onClick={() => handleSelectRoom(room)}
                          className={`w-full flex items-center justify-between px-4 py-3 text-sm hover:bg-gray-50 transition text-left
                            ${selectedRoom?.id === room.id ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700'}`}
                        >
                          <span>Room {room.number} · Lantai {room.floor}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <ErrorMsg message={errors.roomNumber} />
              </div>
            </div>

            {/* Contact — 3 state */}
            {isLoading ? (
              <ContactCardSkeleton />
            ) : isUnauthenticated ? (
              <GoogleLoginGate />
            ) : isAuthenticated && session ? (
              <ContactCard
                session={session}
                contact={contact}
                setContact={setContact}
                errors={errors}
              />
            ) : null}

            {/* Payment */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-5">
                <CreditCardIcon size={16} className="text-blue-400" />
                <span className="text-xs tracking-widest uppercase text-gray-400">{t("text.reservation.payment")}</span>
              </div>
              <div className="flex gap-2 mb-4">
                {(['va', 'qris', 'sgt'] as PaymentCategory[]).map((cat) => {
                  const isDisabled = DISABLED_PAYMENT_METHODS.includes(cat)
                  return (
                    <button
                      key={cat}
                      onClick={() => !isDisabled && handleSelectPayment(cat)}
                      disabled={isDisabled}
                      className={`px-4 py-2 rounded-xl text-xs tracking-widest uppercase font-medium transition-all duration-200
                        ${isDisabled
                          ? 'bg-gray-50 text-gray-200 cursor-not-allowed border border-dashed border-gray-200'
                          : paymentCategory === cat
                            ? 'bg-blue-500 text-white shadow-sm shadow-blue-200'
                            : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                        }`}
                    >
                      <span className={isDisabled ? 'line-through' : ''}>
                        {cat === 'va' ? t("text.reservation.virtualAccount") : cat === 'sgt' ? t("text.reservation.crypto") : cat.toUpperCase()}
                      </span>
                      {isDisabled && (
                        <span className="ml-1.5 normal-case tracking-normal no-underline text-gray-300">
                          {t("text.reservation.comingSoon")}
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>

              {paymentCategory === 'va' && (
                <div className="relative mt-2">
                  <button
                    onClick={() => setVaOpen(!vaOpen)}
                    className={`w-full flex items-center justify-between px-4 py-3 border rounded-xl text-sm hover:border-blue-300 transition
                      ${errors.paymentMethod ? 'border-red-300' : 'border-gray-200'}`}
                  >
                    <span className={selectedVA ? 'text-gray-900' : 'text-gray-300'}>
                      {selectedVA ? VA_BANKS.find((b) => b.value === selectedVA)?.label : t("text.reservation.selectBank")}
                    </span>
                    <ArrowDown01Icon size={14} className={`text-gray-400 transition-transform duration-200 ${vaOpen ? 'rotate-180' : ''}`} />
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
                          <span className="w-10 h-6 bg-gray-100 rounded text-[10px] font-bold text-gray-500 flex items-center justify-center">{bank.logo}</span>
                          {bank.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {paymentCategory === 'qris' && (
                <div className="mt-2 px-4 py-3 bg-blue-50 rounded-xl text-sm text-blue-600 text-center">
                  {t("text.reservation.qrisInfo")}
                </div>
              )}

              {paymentCategory === 'sgt' && (
                <div className="mt-2 space-y-2">
                  <div className="px-4 py-3 bg-amber-50 border border-amber-100 rounded-xl space-y-1 mb-3">
                    <p className="text-xs font-medium text-amber-700">{t("text.reservation.cryptoNoticeTitle")}</p>
                    <p className="text-[11px] text-amber-600 leading-relaxed">{t("text.reservation.cryptoNoticeDesc")}</p>
                  </div>
                  <SlushWalletButton
                    onConnected={(address) => {
                      setSgtWalletAddress(address)
                      setPaymentMethod('sgt' as any)
                    }}
                    onDisconnected={() => setSgtWalletAddress(null)}
                  />
                  {sgtWalletAddress && (
                    <p className="text-[10px] text-center text-gray-400 tracking-wide">
                      {t("text.reservation.walletConnected")}
                    </p>
                  )}
                </div>
              )}

              {/* Error payment method (muncul di bawah semua opsi payment) */}
              <ErrorMsg message={errors.paymentMethod} />
            </div>

          </div>

          {/* Right Column */}
          <div className="lg:w-72 space-y-4">
            <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-6">
              <div className="w-full h-36 rounded-xl overflow-hidden mb-5 bg-gray-100">
                {roomImageUrl && <img src={roomImageUrl} alt="Room" className="w-full h-full object-cover" />}
              </div>
              <p className="text-xs tracking-widest uppercase text-gray-400 mb-1">{t("text.reservation.priceSummary")}</p>
              <p className="text-base font-semibold text-gray-900 mb-4">{displayRoom?.roomType.name ?? '—'}</p>
              {pricing ? (
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between text-gray-500">
                    <span>{formatCurrency(pricing.price)} × {pricing.nights} {t("text.reservation.nights")}</span>
                    <span className="text-gray-900">{formatCurrency(pricing.totalPrice)}</span>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-gray-300 text-center py-2">{t("text.reservation.loadingPrice")}</p>
              )}
              <div className="border-t border-dashed border-gray-200 my-4" />
              <div className="flex justify-between items-center">
                <span className="text-xs tracking-widest uppercase text-gray-400">{t("text.reservation.total")}</span>
                <span className="text-lg font-bold text-gray-900">{pricing ? formatCurrency(pricing.totalPrice) : '—'}</span>
              </div>
              <button
                onClick={handleBooking}
                disabled={!canSubmit || isLoading}
                className={`w-full mt-5 py-3.5 rounded-xl text-sm tracking-widest uppercase font-medium transition-all duration-300
                  ${canSubmit && !isLoading
                    ? 'bg-blue-500 text-white hover:bg-blue-600 shadow-md shadow-blue-100'
                    : 'bg-gray-100 text-gray-300 cursor-not-allowed'
                  }`}
              >
                {isPending ? t("text.reservation.processing") : isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-3.5 h-3.5 rounded-full border-2 border-gray-300 border-t-gray-400 animate-spin inline-block" />
                    {t("text.reservation.loadingSession")}
                  </span>
                ) : t("text.reservation.confirmPay")}
              </button>
              {isUnauthenticated && (
                <p className="text-center text-[10px] text-gray-300 mt-2 tracking-wide">
                  {t("text.reservation.loginPrompt")}
                </p>
              )}
              {/* Hint jika ada error setelah submit */}
              {submitted && Object.keys(errors).length > 0 && (
                <p className="text-center text-[10px] text-red-400 mt-2 tracking-wide">
                  Lengkapi semua data yang diperlukan
                </p>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}