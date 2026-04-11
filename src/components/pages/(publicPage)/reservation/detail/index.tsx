'use client'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useBookingDetail } from '@/src/hooks/query/bookings/detail'
import { Payment } from '@/src/models/bookings/detail'
import { usePaymentStatus } from '@/src/hooks/custom/payment/usePaymentStatus'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatExpiry(dateStr: string) {
    return new Date(dateStr).toLocaleString('id-ID', {
        day: 'numeric', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit',
    })
}

function formatRupiah(amount: number) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency', currency: 'IDR', minimumFractionDigits: 0,
    }).format(amount)
}

function getPaymentUrl(payment: Payment) {
    if (payment.vaBank === 'BCA') return 'https://simulator.sandbox.midtrans.com/bca/va/index'
    if (payment.vaBank === 'BNI') return 'https://simulator.sandbox.midtrans.com/bni/va/index'
    if (payment.vaBank === 'BRI') return 'https://simulator.sandbox.midtrans.com/bri/va/index'
    if (payment.vaBank === 'MANDIRI') return 'https://simulator.sandbox.midtrans.com/mandiri/va/index'
    if (payment.type === 'QRIS') return 'https://simulator.sandbox.midtrans.com/qris/index'
    return '#'
}

// ─── Copy Button ──────────────────────────────────────────────────────────────

function CopyButton({ text }: { text: string }) {
    const [copied, setCopied] = useState(false)
    const handleCopy = async () => {
        await navigator.clipboard.writeText(text)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }
    return (
        <button
            onClick={handleCopy}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 border ${copied
                ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                : 'bg-white border-gray-200 text-gray-600 hover:border-blue-300 hover:text-blue-600'
                }`}
        >
            {copied ? (
                <>
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                    Copied!
                </>
            ) : (
                <>
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Copy
                </>
            )}
        </button>
    )
}

// ─── QRIS Sandbox Warning ─────────────────────────────────────────────────────

function QrisSandboxWarning() {
    const [dismissed, setDismissed] = useState(false)
    if (dismissed) return null

    return (
        <div className="flex gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3.5">
            <div className="flex-shrink-0 mt-0.5">
                <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-amber-800 mb-1">Simulasi QRIS sandbox sering gagal</p>
                <p className="text-xs text-amber-700 leading-relaxed">
                    Jika pembayaran QRIS gagal, silakan ganti metode pembayaran ke <span className="font-semibold">VA BCA</span> saat booking ulang.
                    Untuk booking ruangan yang sama, harap tunggu <span className="font-semibold">±15 menit</span> hingga payment ini expired sebelum mencoba booking kembali.
                </p>
            </div>
            <button
                onClick={() => setDismissed(true)}
                className="flex-shrink-0 text-amber-400 hover:text-amber-600 transition-colors"
                aria-label="Tutup peringatan"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
    )
}

// ─── Payment Info Panel ───────────────────────────────────────────────────────

function PaymentInfoPanel({ payment, totalAmount }: { payment: Payment; totalAmount: number }) {
    const qrisUrl = (payment as any).qrisUrl as string | undefined

    if (payment.type === 'VIRTUAL_ACCOUNT') {
        return (
            <div className="flex flex-col gap-5">
                {/* Bank */}
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                        <span className="text-lg">🏦</span>
                    </div>
                    <div>
                        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Bank</p>
                        <p className="text-sm font-bold text-gray-800">{payment.vaBank}</p>
                    </div>
                </div>

                {/* VA Number */}
                <div>
                    <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-2">Nomor Virtual Account</p>
                    <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3">
                        <span className="font-mono text-base md:text-lg font-bold tracking-widest text-gray-800 flex-1 break-all">
                            {payment.vaNumber}
                        </span>
                        <CopyButton text={payment.vaNumber} />
                    </div>
                </div>

                {/* Total */}
                <div className="bg-green-50 border border-green-100 rounded-xl px-4 py-3">
                    <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-1">Total Pembayaran</p>
                    <p className="text-2xl font-bold text-green-600">{formatRupiah(totalAmount)}</p>
                </div>

                {/* Expiry */}
                <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
                    <svg className="w-4 h-4 text-amber-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-xs text-amber-700">
                        Bayar sebelum <span className="font-semibold">{formatExpiry(payment.expiredAt)}</span>
                    </p>
                </div>
            </div>
        )
    }

    // ── QRIS ──
    return (
        <div className="flex flex-col gap-5">
            {/* Sandbox Warning */}
            <QrisSandboxWarning />

            {/* QR Image */}
            <div>
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-2">QR Code</p>
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex flex-col items-center gap-3">
                    {qrisUrl ? (
                        <img src={qrisUrl} alt="QRIS" className="w-40 h-40 object-contain rounded-lg" />
                    ) : (
                        <div className="w-40 h-40 bg-white border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                            <p className="text-xs text-gray-400">QR tidak tersedia</p>
                        </div>
                    )}
                </div>
            </div>

            {/* QRIS Image URL — sama persis seperti VA Number */}
            {qrisUrl && (
                <div>
                    <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-2">URL Gambar QRIS</p>
                    <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3">
                        <span className="font-mono text-xs text-gray-700 flex-1 break-all line-clamp-2">
                            {qrisUrl}
                        </span>
                        <CopyButton text={qrisUrl} />
                    </div>
                </div>
            )}

            {/* Total */}
            <div className="bg-green-50 border border-green-100 rounded-xl px-4 py-3">
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-1">Total Pembayaran</p>
                <p className="text-2xl font-bold text-green-600">{formatRupiah(totalAmount)}</p>
            </div>

            {/* Expiry */}
            <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
                <svg className="w-4 h-4 text-amber-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-xs text-amber-700">
                    Bayar sebelum <span className="font-semibold">{formatExpiry(payment.expiredAt)}</span>
                </p>
            </div>
        </div>
    )
}

// ─── Payment Link Panel ───────────────────────────────────────────────────────

function PaymentLinkPanel({ payment }: { payment: Payment }) {
    const paymentUrl = getPaymentUrl(payment)
    return (
        <div className="flex flex-col gap-5 h-full">
            <div>
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-1">
                    {payment.type === 'VIRTUAL_ACCOUNT' ? `Simulasi VA ${payment.vaBank}` : 'Simulasi QRIS'}
                </p>
                <p className="text-sm text-gray-500 leading-relaxed">
                    {payment.type === 'VIRTUAL_ACCOUNT'
                        ? `Gunakan link berikut untuk simulasi pembayaran VA ${payment.vaBank} di sandbox Midtrans.`
                        : 'Gunakan link berikut untuk simulasi pembayaran QRIS di sandbox Midtrans.'}
                </p>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3">
                <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-1">Payment URL</p>
                <p className="font-mono text-xs text-gray-600 break-all">{paymentUrl}</p>
            </div>

            <a
                href={paymentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold text-sm px-4 py-3.5 rounded-xl transition-all duration-200 shadow-sm shadow-blue-100 hover:shadow-blue-200"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                Bayar Sekarang
            </a>

            <div className="mt-auto pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-400 text-center leading-relaxed">
                    Halaman ini akan otomatis update setelah pembayaran berhasil
                </p>
            </div>
        </div>
    )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function PaymentStatus() {
    const params = useParams<{ id: string }>();
    const bookingCode = params.id;

    const router = useRouter()
    const { data, isLoading } = useBookingDetail(bookingCode)
    const { status } = usePaymentStatus(bookingCode)

    useEffect(() => {
        if (!status) return
        if (status === 'PAID') router.push(`/booking/success/${bookingCode}`)
        else if (status === 'EXPIRED') router.push(`/booking/expired/${bookingCode}`)
    }, [status])

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
        )
    }

    const booking = data?.data
    if (!booking || !booking.payment) return null
    if (booking.status !== 'PENDING') return null

    return (
        <div className="w-full max-w-4xl mx-auto px-4 md:px-8 py-6 md:py-10">

            {/* Header */}
            <div className="mb-5 flex items-start justify-between gap-3">
                <div>
                    <p className="text-xs text-gray-400 font-mono mb-0.5">{booking.bookingCode}</p>
                    <h1 className="text-lg md:text-xl font-bold text-gray-800">Selesaikan Pembayaran</h1>
                </div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-yellow-100 text-yellow-700 rounded-full text-xs font-semibold whitespace-nowrap">
                    <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse" />
                    Menunggu Pembayaran
                </span>
            </div>

            {/* Card — stack on mobile, side by side on desktop */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="flex flex-col md:grid md:grid-cols-2 md:divide-x divide-gray-100">

                    {/* Payment Info */}
                    <div className="p-5 md:p-6">
                        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-5">
                            Informasi Pembayaran
                        </p>
                        <PaymentInfoPanel payment={booking.payment} totalAmount={booking.totalAmount} />
                    </div>

                    {/* Divider mobile only */}
                    <div className="block md:hidden h-px bg-gray-100 mx-5" />

                    {/* Payment Link */}
                    <div className="p-5 md:p-6">
                        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-5">
                            Link Pembayaran
                        </p>
                        <PaymentLinkPanel payment={booking.payment} />
                    </div>

                </div>
            </div>
        </div>
    )
}