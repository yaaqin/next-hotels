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
import { useEnabledPaymentMethods } from '@/src/hooks/query/paymentMethod/public'
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
import { PriceTag } from '@/src/components/molecules/priceTag'
import { usePriceTagConfig } from '@/src/hooks/usePriceTagConfig'
import { PaymentCurrencyModal } from '@/src/components/organisms/reservation/PaymentCurrencyModal'
import type { DisplayPricing } from '@/src/models/public/currency'

type PaymentMethod = 'va_bca' | 'va_bni' | 'va_bri' | 'va_mandiri' | 'qris' | 'sgt' | 'credit'
type PaymentCategory = 'va' | 'qris' | 'sgt' | 'credit'

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
  selectedRoomCount,
  paymentCategory,
  selectedVA,
  sgtWalletAddress,
}: {
  contact: any
  selectedRoomCount: number
  paymentCategory: PaymentCategory | null
  selectedVA: PaymentMethod | null
  sgtWalletAddress: string | null
}): FormErrors {
  const errors: FormErrors = {}

  if (!contact.fullName?.trim()) {
    errors.fullName = 'Nama lengkap wajib diisi'
  }

  const phoneDigits = splitPhone(contact.phone ?? '').number
  if (!phoneDigits) {
    errors.phone = 'Nomor telepon wajib diisi'
  } else if (phoneDigits.length < 6 || phoneDigits.length > 13) {
    errors.phone = 'Nomor telepon tidak valid'
  }

  if (!contact.idType) {
    errors.idType = 'Tipe identitas wajib dipilih'
  }

  if (!contact.idNumber?.trim()) {
    errors.idNumber = 'Nomor identitas wajib diisi'
  } else if (contact.idType === 'KTP' && contact.idNumber.length !== 16) {
    errors.idNumber = 'NIK KTP harus 16 digit'
  }

  if (selectedRoomCount === 0) {
    errors.roomNumber = 'Pilih minimal 1 kamar'
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

// Kode negara telepon. Nomor disimpan gabungan: "+62" + "81234567890"
const COUNTRY_CODES = [
  { code: '+62', flag: '🇮🇩' },
  { code: '+65', flag: '🇸🇬' },
  { code: '+60', flag: '🇲🇾' },
  { code: '+66', flag: '🇹🇭' },
  { code: '+63', flag: '🇵🇭' },
  { code: '+84', flag: '🇻🇳' },
  { code: '+81', flag: '🇯🇵' },
  { code: '+82', flag: '🇰🇷' },
  { code: '+86', flag: '🇨🇳' },
  { code: '+852', flag: '🇭🇰' },
  { code: '+61', flag: '🇦🇺' },
  { code: '+91', flag: '🇮🇳' },
  { code: '+971', flag: '🇦🇪' },
  { code: '+966', flag: '🇸🇦' },
  { code: '+44', flag: '🇬🇧' },
  { code: '+1', flag: '🇺🇸' },
]
const DEFAULT_COUNTRY_CODE = '+62'

function splitPhone(phone: string): { code: string; number: string } {
  if (phone.startsWith('+')) {
    // Cocokkan kode terpanjang dulu (+852 sebelum +85…)
    const match = [...COUNTRY_CODES]
      .sort((a, b) => b.code.length - a.code.length)
      .find((c) => phone.startsWith(c.code))
    if (match) return { code: match.code, number: phone.slice(match.code.length) }
  }
  // Data lama tanpa kode negara, mis. "0812…"
  return { code: DEFAULT_COUNTRY_CODE, number: phone.replace(/\D/g, '').replace(/^0+/, '') }
}

// Angka saja, 0 di depan dibuang (08xx → 8xx karena sudah ada kode negara)
const toPhoneDigits = (value: string) => value.replace(/\D/g, '').replace(/^0+/, '')

// KTP & SIM angka saja; paspor boleh huruf (mis. A1234567)
function sanitizeIdNumber(value: string, idType?: string) {
  if (idType === 'PASSPORT') return value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 20)
  return value.replace(/\D/g, '').slice(0, idType === 'KTP' ? 16 : 20)
}

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

// Gabungan blok display beberapa kamar (kurs sama) → total dalam mata uang tampilan
function sumDisplay(displays: (DisplayPricing | undefined)[]): DisplayPricing | undefined {
  if (displays.length === 0 || displays.some((d) => !d)) return undefined
  const list = displays as DisplayPricing[]
  return { ...list[0], totalPrice: list.reduce((sum, d) => sum + (d.totalPrice ?? 0), 0) }
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

  // Kode negara disimpan lokal supaya tetap terpilih walau nomornya masih kosong
  const initialPhone = splitPhone(contact.phone ?? '')
  const [countryCode, setCountryCode] = useState(initialPhone.code)
  const phoneNumber = splitPhone(contact.phone ?? '').number

  const updatePhone = (code: string, number: string) => {
    setContact({ phone: number ? `${code}${number}` : '' })
  }

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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
            <div
              className={`flex items-stretch border rounded-xl transition focus-within:ring-2
                ${errors.phone
                  ? 'border-red-300 focus-within:ring-red-100'
                  : 'border-gray-200 focus-within:ring-blue-200 focus-within:border-transparent'
                }`}
            >
              <select
                aria-label="Kode negara"
                value={countryCode}
                onChange={(e) => {
                  setCountryCode(e.target.value)
                  updatePhone(e.target.value, phoneNumber)
                }}
                className="pl-3 pr-1 text-sm text-gray-700 bg-transparent border-r border-gray-200 rounded-l-xl focus:outline-none"
              >
                {COUNTRY_CODES.map((c) => (
                  <option key={c.code} value={c.code}>{c.flag} {c.code}</option>
                ))}
              </select>
              <div className="relative flex-1 min-w-0">
                <SmartPhone01Icon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />
                <input
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel-national"
                  placeholder={t("text.reservation.phonePlaceholder")}
                  value={phoneNumber}
                  onChange={(e) => updatePhone(countryCode, toPhoneDigits(e.target.value))}
                  maxLength={13}
                  className="w-full pl-9 pr-4 py-3 text-sm bg-transparent rounded-r-xl focus:outline-none placeholder:text-gray-300"
                />
              </div>
            </div>
            <ErrorMsg message={errors.phone} />
          </div>
        </div>

        {/* ID Type & ID Number */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <div className="relative">
              <IdIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />
              <select
                value={contact.idType ?? ''}
                onChange={(e) => {
                  const idType = (e.target.value as any) || undefined
                  const idNumber = contact.idNumber ? sanitizeIdNumber(contact.idNumber, idType) : undefined
                  setContact({ idType, idNumber: idNumber || undefined })
                }}
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
              inputMode={contact.idType === 'PASSPORT' ? 'text' : 'numeric'}
              placeholder={t("text.reservation.idNumberPlaceholder")}
              value={contact.idNumber ?? ''}
              onChange={(e) => setContact({ idNumber: sanitizeIdNumber(e.target.value, contact.idType) || undefined })}
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
  const { payload, setContact, setPaymentMethod, setRooms, isReadyToSubmit } = useBookingStore()
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

  // Hanya kamar yang kosong di seluruh range tanggal (BE sudah memfilter per malam)
  const availableRooms = roomData?.data?.filter((r) => r.isAvailable) ?? []
  const [selectedRoomIds, setSelectedRoomIds] = useState<string[]>([])
  const [roomOpen, setRoomOpen] = useState(false)
  const selectedRooms = availableRooms.filter((r) => selectedRoomIds.includes(r.id))

  const handleToggleRoom = (room: roomNumberListState) => {
    const next = selectedRoomIds.includes(room.id)
      ? selectedRoomIds.filter((id) => id !== room.id)
      : [...selectedRoomIds, room.id]
    setSelectedRoomIds(next)
    setRooms(roomTypeId, next, roomImageUrl ?? '')
  }

  // Ringkasan harga: kamar yang dipilih, atau kamar kosong pertama sebagai acuan
  const pricedRooms = selectedRooms.length > 0 ? selectedRooms : availableRooms.slice(0, 1)
  const displayRoom = pricedRooms[0]
  const hasPricing = pricedRooms.length > 0 && pricedRooms.every((r) => !!r.pricing)
  const totalIdr = pricedRooms.reduce((sum, r) => sum + (r.pricing?.totalPrice ?? 0), 0)
  const totalDisplay = sumDisplay(pricedRooms.map((r) => r.pricing?.display))

  const [paymentCategory, setPaymentCategory] = useState<PaymentCategory | null>(null)
  const [selectedVA, setSelectedVA] = useState<PaymentMethod | null>(null)
  const [vaOpen, setVaOpen] = useState(false)

  const handleSelectPayment = (cat: PaymentCategory) => {
    setPaymentCategory(cat)
    setSelectedVA(null)
    if (cat === 'qris') setPaymentMethod('qris' as any)
    if (cat === 'credit') setPaymentMethod('credit' as any)
    if (cat !== 'sgt') setSgtWalletAddress(null)
    if (submitted) setErrors((prev) => ({ ...prev, paymentMethod: undefined }))
  }

  const handleSelectVA = (method: PaymentMethod) => {
    setSelectedVA(method)
    setVaOpen(false)
    setPaymentMethod(method.replace('va_', '') as any)
    if (submitted) setErrors((prev) => ({ ...prev, paymentMethod: undefined }))
  }

  const { mutate, isPending } = useCreateBooking()
  const { reset } = useBookingStore()
  const router = useRouter()

  // Harga dilihat dalam mata uang lain, tapi VA/QRIS (Midtrans) menagih IDR → konfirmasi dulu
  const [showCurrencyModal, setShowCurrencyModal] = useState(false)
  const needsCurrencyNotice =
    (paymentCategory === 'va' || paymentCategory === 'qris') &&
    !!totalDisplay &&
    totalDisplay.currency !== 'IDR'
  const paymentMethodLabel =
    paymentCategory === 'qris'
      ? 'QRIS'
      : VA_BANKS.find((b) => b.value === selectedVA)?.label ?? 'Virtual Account'
  const priceTag = usePriceTagConfig()

  // Kamar yang sudah dipilih sebelumnya (dari RDP / kunjungan lalu), selama masih kosong
  const [roomsRestored, setRoomsRestored] = useState(false)
  useEffect(() => {
    if (roomsRestored || !roomData?.data) return
    const available = new Set(roomData.data.filter((r) => r.isAvailable).map((r) => r.id))
    setSelectedRoomIds(items.map((i) => i.roomId).filter((id): id is string => !!id && available.has(id)))
    setRoomsRestored(true)
  }, [roomData?.data])

  // ── Re-validate on field change after first submit attempt ────────────────
  useEffect(() => {
    if (!submitted) return
    const newErrors = validateForm({ contact, selectedRoomCount: selectedRooms.length, paymentCategory, selectedVA, sgtWalletAddress })
    setErrors(newErrors)
  }, [contact, selectedRooms.length, paymentCategory, selectedVA, sgtWalletAddress, submitted])

  const handleBooking = async () => {
    setSubmitted(true)
    const newErrors = validateForm({ contact, selectedRoomCount: selectedRooms.length, paymentCategory, selectedVA, sgtWalletAddress })
    setErrors(newErrors)

    if (Object.keys(newErrors).length > 0) return
    if (!isReadyToSubmit()) return

    if (needsCurrencyNotice) {
      setShowCurrencyModal(true)
      return
    }
    submitBooking()
  }

  const submitBooking = async () => {
    const { items: _storeItems, ...rest } = payload
    // Kirim kamar yang dipilih & masih kosong saat ini, bukan sisa isi store
    const items = selectedRooms.map((room) => ({ roomId: room.id, roomTypeId }))

    // ── Credit path ──────────────────────────────────────────────────────────
    if (paymentCategory === 'credit') {
      mutate(
        {
          ...rest,
          items,
          paymentMethod: 'credit',
        } as BookingPayload,
        {
          onSuccess: (res) => {
            const data = res?.data
            // Credit cukup — langsung redirect ke success
            const bookingCode = data?.booking?.bookingCode
            reset()
            router.push(`/payment/success?bookingCode=${bookingCode}`)
          },
          onError: (err: any) => {
            const errBody = err?.response?.data?.message

            console.log(err?.response?.data?.message)

            if (err?.response?.status === 422 && errBody?.data?.isPaid === false) {
              const shortage = formatCurrency(errBody.data.shortage ?? 0)
              const available = formatCurrency(errBody.data.creditAmount ?? 0)
              toast.error(
                `Kredit tidak mencukupi. Saldo: ${available}, kurang: ${shortage}`,
                { duration: 5000 }
              )
              return
            }

            const message =
              err?.response?.data?.message ??
              err?.message ??
              'Terjadi kesalahan, coba lagi.'
            toast.error(message)
          },
        }
      )
      return
    }

    // ── SGT & Midtrans path (tidak berubah) ───────────────────────────────────
    mutate(
      {
        ...rest,
        items,
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

  const canSubmit = isAuthenticated && !isPending

  const { t } = useTranslation()

  // On/off metode diatur di config panel (scope BOOKING, per cabang)
  const { enabledMethods } = useEnabledPaymentMethods('BOOKING', payload.siteCode)
  const enabledBanks = VA_BANKS.filter((b) => enabledMethods.includes(b.value.replace('va_', '')))
  const isCategoryEnabled = (cat: PaymentCategory) =>
    cat === 'va' ? enabledBanks.length > 0 : enabledMethods.includes(cat)

  return (
    <div className="min-h-screen bg-[#f5f4f0] py-10 px-4">
      {showCurrencyModal && totalDisplay && (
        <PaymentCurrencyModal
          display={totalDisplay}
          totalIdr={totalIdr}
          methodLabel={paymentMethodLabel}
          onCancel={() => setShowCurrencyModal(false)}
          onConfirm={() => {
            setShowCurrencyModal(false)
            submitBooking()
          }}
        />
      )}
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
                <div><Label>{t("text.reservation.floor")}</Label><Field>{selectedRooms.length ? [...new Set(selectedRooms.map((r) => r.floor))].join(', ') : '—'}</Field></div>
                <div><Label>{t("text.reservation.bedType")}</Label><Field>{displayRoom?.bedType.name ?? '—'}</Field></div>
              </div>

              {/* Room Number */}
              <div>
                <Label>{t("text.reservation.roomNumber")}</Label>
                <div className="relative mt-1">
                  <button
                    data-cy="btn-select-room"
                    onClick={() => setRoomOpen(!roomOpen)}
                    disabled={roomLoading || availableRooms.length === 0}
                    className={`w-full flex items-center justify-between px-4 py-3 border rounded-xl text-sm hover:border-blue-300 transition disabled:opacity-50 disabled:cursor-not-allowed
                      ${errors.roomNumber ? 'border-red-300' : 'border-gray-200'}`}
                  >
                    <span className={`truncate ${selectedRooms.length ? 'text-gray-900' : 'text-gray-300'}`}>
                      {roomLoading
                        ? t("text.reservation.loadingRooms")
                        : selectedRooms.length
                          ? t("text.reservation.roomsSelected", {
                            count: selectedRooms.length,
                            rooms: selectedRooms.map((r) => r.number).join(', '),
                          })
                          : availableRooms.length
                            ? t("text.reservation.selectRooms")
                            : t("text.reservation.noRoomsAvailable")}
                    </span>
                    <ArrowDown01Icon size={14} className={`text-gray-400 transition-transform duration-200 ${roomOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {roomOpen && availableRooms.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-100 rounded-xl shadow-lg z-10 overflow-hidden max-h-52 overflow-y-auto">
                      {availableRooms.map((room) => {
                        const isSelected = selectedRoomIds.includes(room.id)
                        return (
                          <button
                            data-cy="room-option"
                            key={room.id}
                            aria-pressed={isSelected}
                            onClick={() => handleToggleRoom(room)}
                            className={`w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-gray-50 transition text-left
                              ${isSelected ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700'}`}
                          >
                            <span className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 text-[10px]
                              ${isSelected ? 'bg-blue-500 border-blue-500 text-white' : 'border-gray-300'}`}>
                              {isSelected && '✓'}
                            </span>
                            <span>{t("text.reservation.roomOption", { number: room.number, floor: room.floor })}</span>
                          </button>
                        )
                      })}
                    </div>
                  )}
                </div>
                <p className="text-[11px] text-gray-400 mt-1.5 ml-1">{t("text.reservation.multiRoomHint")}</p>
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

              {/* Payment Category Tabs */}
              <div className="flex flex-wrap gap-2 mb-4">
                {(['va', 'qris', 'sgt', 'credit'] as PaymentCategory[]).map((cat) => {
                  const isDisabled = !isCategoryEnabled(cat)
                  const label =
                    cat === 'va' ? t("text.reservation.virtualAccount") :
                      cat === 'sgt' ? t("text.reservation.crypto") :
                        cat === 'credit' ? 'Credit' :
                          cat.toUpperCase()

                  return (
                    <button
                      data-cy={`btn-payment-${cat}`}
                      key={cat}
                      onClick={() => !isDisabled && handleSelectPayment(cat)}
                      disabled={isDisabled}
                      className={`px-4 py-2 rounded-xl text-xs tracking-widest uppercase font-medium transition-all duration-200
                        ${isDisabled
                          ? 'bg-gray-50 text-gray-200 cursor-not-allowed border border-dashed border-gray-200'
                          : paymentCategory === cat
                            ? cat === 'credit'
                              ? 'bg-emerald-500 text-white shadow-sm shadow-emerald-200'
                              : 'bg-blue-500 text-white shadow-sm shadow-blue-200'
                            : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                        }`}
                    >
                      <span className={isDisabled ? 'line-through' : ''}>{label}</span>
                      {isDisabled && (
                        <span className="ml-1.5 normal-case tracking-normal no-underline text-gray-300">
                          {t("text.reservation.unavailable")}
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>

              {/* VA Bank Dropdown */}
              {paymentCategory === 'va' && (
                <div className="relative mt-2">
                  <button
                    data-cy="btn-select-va"
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
                      {enabledBanks.map((bank) => (
                        <button
                          data-cy={`va-option-${bank.value}`}
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

              {/* QRIS Info */}
              {paymentCategory === 'qris' && (
                <div className="mt-2 px-4 py-3 bg-blue-50 rounded-xl text-sm text-blue-600 text-center">
                  {t("text.reservation.qrisInfo")}
                </div>
              )}

              {/* SGT Wallet */}
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

              {/* Credit Info */}
              {paymentCategory === 'credit' && (
                <div className="mt-2 px-4 py-3 bg-emerald-50 border border-emerald-100 rounded-xl space-y-1">
                  <p className="text-xs font-medium text-emerald-700">Bayar dengan Booking Credit</p>
                  <p className="text-[11px] text-emerald-600 leading-relaxed">
                    Saldo kredit kamu akan digunakan untuk melunasi pembayaran ini secara langsung.
                    Jika saldo tidak mencukupi, kamu perlu memilih metode pembayaran lain.
                  </p>
                </div>
              )}

              {/* Payment error */}
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
              {hasPricing ? (
                <div className="space-y-3 text-sm">
                  {pricedRooms.map((room) => (
                    <div key={room.id} className="flex justify-between gap-2 text-gray-500">
                      <span>
                        {selectedRooms.length > 0 && (
                          <span className="block text-[11px] text-gray-400">
                            {t("text.reservation.roomLabel", { number: room.number })}
                          </span>
                        )}
                        <PriceTag display={room.pricing.display} amountIdr={room.pricing.price} {...priceTag} />
                        {' '}× {room.pricing.nights} {t("text.reservation.nights")}
                      </span>
                      <span className="text-gray-900">
                        <PriceTag display={room.pricing.display} field="totalPrice" amountIdr={room.pricing.totalPrice} align="right" {...priceTag} />
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-300 text-center py-2">{t("text.reservation.loadingPrice")}</p>
              )}
              <div className="border-t border-dashed border-gray-200 my-4" />
              <div className="flex justify-between items-center">
                <span className="text-xs tracking-widest uppercase text-gray-400">{t("text.reservation.total")}</span>
                <span className="text-lg font-bold text-gray-900">
                  {hasPricing ? (
                    <PriceTag display={totalDisplay} field="totalPrice" amountIdr={totalIdr} align="right" {...priceTag} />
                  ) : '—'}
                </span>
              </div>
              <button
                data-cy="btn-confirm-booking"
                onClick={handleBooking}
                disabled={!canSubmit || isLoading}
                className={`w-full mt-5 py-3.5 rounded-xl text-sm tracking-widest uppercase font-medium transition-all duration-300
                  ${canSubmit && !isLoading
                    ? paymentCategory === 'credit'
                      ? 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-md shadow-emerald-100'
                      : 'bg-blue-500 text-white hover:bg-blue-600 shadow-md shadow-blue-100'
                    : 'bg-gray-100 text-gray-300 cursor-not-allowed'
                  }`}
              >
                {isPending
                  ? t("text.reservation.processing")
                  : isLoading
                    ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="w-3.5 h-3.5 rounded-full border-2 border-gray-300 border-t-gray-400 animate-spin inline-block" />
                        {t("text.reservation.loadingSession")}
                      </span>
                    )
                    : paymentCategory === 'credit'
                      ? 'Bayar dengan Credit'
                      : t("text.reservation.confirmPay")
                }
              </button>
              {isUnauthenticated && (
                <p className="text-center text-[10px] text-gray-300 mt-2 tracking-wide">
                  {t("text.reservation.loginPrompt")}
                </p>
              )}
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