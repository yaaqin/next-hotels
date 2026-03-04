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
                    : 'bg-white border-gray-200 text-gray-600 hover:border-green-400 hover:text-green-700'
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

// ─── Payment Info Panel (Left) ────────────────────────────────────────────────

function PaymentInfoPanel({ payment, totalAmount }: { payment: Payment; totalAmount: number }) {
    if (payment.type === 'VIRTUAL_ACCOUNT') {
        return (
            <div className="flex flex-col gap-5">
                <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">Bank</p>
                    <span className="text-lg font-bold text-gray-800">🏦 {payment.vaBank}</span>
                </div>

                <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">VA Number</p>
                    <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3">
                        <span className="font-mono text-lg font-bold tracking-widest text-gray-800 flex-1">
                            {payment.vaNumber}
                        </span>
                        <CopyButton text={payment.vaNumber} />
                    </div>
                </div>

                <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">Total Pembayaran</p>
                    <p className="text-2xl font-bold text-green-600">{formatRupiah(totalAmount)}</p>
                </div>

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

    return (
        <div className="flex flex-col gap-5">
            <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">QR Code</p>
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex flex-col items-center gap-3">
                    {(payment as any).qrisUrl ? (
                        <img src={(payment as any).qrisUrl} alt="QRIS" className="w-40 h-40 object-contain rounded-lg" />
                    ) : (
                        <div className="w-40 h-40 bg-white border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                            <p className="text-xs text-gray-400">QR tidak tersedia</p>
                        </div>
                    )}
                    {(payment as any).qrisUrl && (
                        <div className="w-full">
                            <p className="text-xs text-gray-400 mb-1.5 text-center">QR Image URL</p>
                            <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2">
                                <span className="font-mono text-xs text-gray-500 flex-1 truncate">{(payment as any).qrisUrl}</span>
                                <CopyButton text={(payment as any).qrisUrl} />
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">Total Pembayaran</p>
                <p className="text-2xl font-bold text-green-600">{formatRupiah(totalAmount)}</p>
            </div>

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

// ─── Payment Link Panel (Right) ───────────────────────────────────────────────

function PaymentLinkPanel({ payment }: { payment: Payment }) {
    const paymentUrl = getPaymentUrl(payment)
    return (
        <div className="flex flex-col gap-5 h-full">
            <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">
                    {payment.type === 'VIRTUAL_ACCOUNT' ? `Simulasi VA ${payment.vaBank}` : 'Simulasi QRIS'}
                </p>
                <p className="text-sm text-gray-500">
                    {payment.type === 'VIRTUAL_ACCOUNT'
                        ? `Gunakan link berikut untuk simulasi pembayaran VA ${payment.vaBank} di sandbox Midtrans.`
                        : 'Gunakan link berikut untuk simulasi pembayaran QRIS di sandbox Midtrans.'}
                </p>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3">
                <p className="text-xs text-gray-400 mb-1">Payment URL</p>
                <p className="font-mono text-xs text-gray-600 break-all">{paymentUrl}</p>
            </div>

            <a
                href={paymentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full bg-green-600 hover:bg-green-700 text-white font-semibold text-sm px-4 py-3 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                Bayar Sekarang
            </a>

            <div className="mt-auto pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-400 text-center">
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
        if (status === 'PAID') {
            router.push(`/booking/success/${bookingCode}`)
        } else if (status === 'EXPIRED') {
            router.push(`/booking/expired/${bookingCode}`)
        }
    }, [status])

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
            </div>
        )
    }

    const booking = data?.data
    if (!booking || !booking.payment) return null
    if (booking.status !== 'PENDING') return null

    return (
        <div className="w-full">
            <div className="mb-4 flex items-center justify-between">
                <div>
                    <p className="text-xs text-gray-400 font-mono">{booking.bookingCode}</p>
                    <h1 className="text-xl font-bold text-gray-800">Selesaikan Pembayaran</h1>
                </div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse" />
                    Menunggu Pembayaran
                </span>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="grid grid-cols-2 divide-x divide-gray-100">
                    <div className="p-6">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-5">
                            Payment Information
                        </p>
                        <PaymentInfoPanel payment={booking.payment} totalAmount={booking.totalAmount} />
                    </div>
                    <div className="p-6">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-5">
                            Link to Payment
                        </p>
                        <PaymentLinkPanel payment={booking.payment} />
                    </div>
                </div>
            </div>
        </div>
    )
}