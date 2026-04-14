'use client'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useBookingDetail } from '@/src/hooks/query/bookings/detail'
import { Payment } from '@/src/models/bookings/detail'
import { usePaymentStatus } from '@/src/hooks/custom/payment/usePaymentStatus'
import { useTranslation } from 'react-i18next'

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
    if (payment.vaBank === 'MANDIRI') return 'https://simulator.sandbox.midtrans.com/openapi/va/index?bank=mandiri'
    if (payment.type === 'QRIS') return 'https://simulator.sandbox.midtrans.com/qris/index'
    return '#'
}

function CopyButton({ text }: { text: string }) {
    const { t } = useTranslation()
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
                    {t('text.reservation.copied')}
                </>
            ) : (
                <>
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    {t('text.reservation.copy')}
                </>
            )}
        </button>
    )
}

function QrisSandboxWarning() {
    const { t } = useTranslation()
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
                <p className="text-xs font-semibold text-amber-800 mb-1">{t('text.reservation.qrisWarningTitle')}</p>
                <p className="text-xs text-amber-700 leading-relaxed">
                    {t('text.reservation.qrisWarningDesc1')} <span className="font-semibold">{t('text.reservation.qrisWarningVA')}</span> {t('text.reservation.qrisWarningDesc2')} <span className="font-semibold">{t('text.reservation.qrisWarningWait')}</span> {t('text.reservation.qrisWarningDesc3')}
                </p>
            </div>
            <button
                onClick={() => setDismissed(true)}
                className="flex-shrink-0 text-amber-400 hover:text-amber-600 transition-colors"
                aria-label={t('text.reservation.closeWarning')}
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
    )
}

function PaymentInfoPanel({ payment, totalAmount }: { payment: Payment; totalAmount: number }) {
    const { t } = useTranslation()
    const qrisUrl = (payment as any).qrisUrl as string | undefined

    if (payment.type === 'VIRTUAL_ACCOUNT') {
        return (
            <div className="flex flex-col gap-5">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                        <span className="text-lg">🏦</span>
                    </div>
                    <div>
                        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">{t('text.reservation.bank')}</p>
                        <p className="text-sm font-bold text-gray-800">{payment.vaBank}</p>
                    </div>
                </div>

                {/* Mandiri: billerCode + billKey, bukan vaNumber */}
                {payment.vaBank !== 'MANDIRI' && (
                    //     <div className="space-y-3">
                    //         <div>
                    //             <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-2">{t('text.reservation.billerCode')}</p>
                    //             <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3">
                    //                 <span className="font-mono text-base md:text-lg font-bold tracking-widest text-gray-800 flex-1 break-all">
                    //                     {payment.billerCode ?? '—'}
                    //                 </span>
                    //                 {payment.billerCode && <CopyButton text={payment.billerCode} />}
                    //             </div>
                    //         </div>
                    //         <div>
                    //             <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-2">{t('text.reservation.billKey')}</p>
                    //             <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3">
                    //                 <span className="font-mono text-base md:text-lg font-bold tracking-widest text-gray-800 flex-1 break-all">
                    //                     {payment.billKey ?? '—'}
                    //                 </span>
                    //                 {payment.billKey && <CopyButton text={payment.billKey} />}
                    //             </div>
                    //         </div>
                    //     </div>
                    // ) : (
                    <div>
                        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-2">{t('text.reservation.vaNumber')}</p>
                        <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3">
                            <span className="font-mono text-base md:text-lg font-bold tracking-widest text-gray-800 flex-1 break-all">
                                {payment.vaNumber ?? '—'}
                            </span>
                            {payment.vaNumber && <CopyButton text={payment.vaNumber} />}
                        </div>
                    </div>
                )}

                <div className="bg-green-50 border border-green-100 rounded-xl px-4 py-3">
                    <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-1">{t('text.reservation.totalPayment')}</p>
                    <p className="text-2xl font-bold text-green-600">{formatRupiah(totalAmount)}</p>
                </div>

                <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
                    <svg className="w-4 h-4 text-amber-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-xs text-amber-700">
                        {t('text.reservation.payBefore')} <span className="font-semibold">{formatExpiry(payment.expiredAt)}</span>
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-5">
            <QrisSandboxWarning />

            <div>
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-2">{t('text.reservation.qrCode')}</p>
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex flex-col items-center gap-3">
                    {qrisUrl ? (
                        <img src={qrisUrl} alt="QRIS" className="w-40 h-40 object-contain rounded-lg" />
                    ) : (
                        <div className="w-40 h-40 bg-white border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                            <p className="text-xs text-gray-400">{t('text.reservation.qrNotAvailable')}</p>
                        </div>
                    )}
                </div>
            </div>

            {qrisUrl && (
                <div>
                    <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-2">{t('text.reservation.qrisImageUrl')}</p>
                    <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3">
                        <span className="font-mono text-xs text-gray-700 flex-1 break-all line-clamp-2">{qrisUrl}</span>
                        <CopyButton text={qrisUrl} />
                    </div>
                </div>
            )}

            <div className="bg-green-50 border border-green-100 rounded-xl px-4 py-3">
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-1">{t('text.reservation.totalPayment')}</p>
                <p className="text-2xl font-bold text-green-600">{formatRupiah(totalAmount)}</p>
            </div>

            <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
                <svg className="w-4 h-4 text-amber-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-xs text-amber-700">
                    {t('text.reservation.payBefore')} <span className="font-semibold">{formatExpiry(payment.expiredAt)}</span>
                </p>
            </div>
        </div>
    )
}

function PaymentLinkPanel({ payment }: { payment: Payment }) {
    const { t } = useTranslation()
    const paymentUrl = getPaymentUrl(payment)
    const isMandiri = payment.vaBank === 'MANDIRI'
    const mandiriPayment = payment as any

    return (
        <div className="flex flex-col gap-5 h-auto">
            <div>
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-1">
                    {payment.type === 'VIRTUAL_ACCOUNT'
                        ? `${t('text.reservation.vaSimulation')} ${payment.vaBank}`
                        : t('text.reservation.qrisSimulation')}
                </p>
                <p className="text-sm text-gray-500 leading-relaxed">
                    {payment.type === 'VIRTUAL_ACCOUNT'
                        ? `${t('text.reservation.vaSimulationDesc')} ${payment.vaBank} ${t('text.reservation.vaSimulationDesc2')}`
                        : t('text.reservation.qrisSimulationDesc')}
                </p>
            </div>

            {isMandiri && mandiriPayment.billerCode && (
                <div className="space-y-3">
                    <div>
                        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-2">{t('text.reservation.billerCode')}</p>
                        <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3">
                            <span className="font-mono text-base font-bold tracking-widest text-gray-800 flex-1">
                                {mandiriPayment.billerCode}
                            </span>
                            <CopyButton text={mandiriPayment.billerCode} />
                        </div>
                    </div>
                    <div>
                        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-2">{t('text.reservation.billKey')}</p>
                        <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3">
                            <span className="font-mono text-base font-bold tracking-widest text-gray-800 flex-1">
                                {mandiriPayment.billKey}
                            </span>
                            <CopyButton text={mandiriPayment.billKey} />
                        </div>
                    </div>
                </div>
            )}

            <div className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3">
                <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-1">{t('text.reservation.paymentUrl')}</p>
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
                {t('text.reservation.payNow')}
            </a>

            <div className="mt-auto pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-400 text-center leading-relaxed">
                    {t('text.reservation.autoUpdate')}
                </p>
            </div>
        </div >
    )
}

export default function PaymentStatus() {
    const { t } = useTranslation()
    const params = useParams<{ id: string }>();
    const bookingCode = params.id;
    const router = useRouter()
    const { data, isLoading } = useBookingDetail(bookingCode)
    const { status } = usePaymentStatus(bookingCode)

    useEffect(() => {
        if (!status) return
        if (status === 'PAID') router.push(`/payment/success/${bookingCode}`)
    }, [status])

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
        )
    }

    // Status EXPIRED
    if (status === 'EXPIRED') {
        return (
            <div className="flex flex-col items-center justify-center py-24 px-4 text-center">
                <div className="w-14 h-14 rounded-full bg-orange-50 flex items-center justify-center mb-4">
                    <svg className="w-7 h-7 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <h2 className="text-base font-semibold text-gray-800 mb-1">{t('text.reservation.expiredTitle')}</h2>
                <p className="text-sm text-gray-400 mb-6">{t('text.reservation.expiredDesc')}</p>
                <button
                    onClick={() => router.push('/')}
                    className="px-5 py-2.5 rounded-xl bg-gray-900 text-white text-sm font-medium hover:bg-gray-700 transition-colors"
                >
                    {t('text.reservation.backToHome')}
                </button>
            </div>
        )
    }

    // Booking tidak ditemukan / error
    const booking = data?.data
    if (!booking || !booking.payment) {
        return (
            <div className="flex flex-col items-center justify-center py-24 px-4 text-center">
                <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mb-4">
                    <svg className="w-7 h-7 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <h2 className="text-base font-semibold text-gray-800 mb-1">{t('text.reservation.notFoundTitle')}</h2>
                <p className="text-sm text-gray-400 mb-6">{t('text.reservation.notFoundDesc')}</p>
                <button
                    onClick={() => router.push('/')}
                    className="px-5 py-2.5 rounded-xl bg-gray-900 text-white text-sm font-medium hover:bg-gray-700 transition-colors"
                >
                    {t('text.reservation.backToHome')}
                </button>
            </div>
        )
    }

    // Status bukan PENDING (misal sudah PAID tapi belum redirect, atau status lain)
    if (booking.status !== 'PENDING') {
        return (
            <div className="flex flex-col items-center justify-center py-24 px-4 text-center">
                <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                    <svg className="w-7 h-7 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                </div>
                <h2 className="text-base font-semibold text-gray-800 mb-1">{t('text.reservation.invalidStatusTitle')}</h2>
                <p className="text-sm text-gray-400 mb-6">{t('text.reservation.invalidStatusDesc')}</p>
                <button
                    onClick={() => router.push('/')}
                    className="px-5 py-2.5 rounded-xl bg-gray-900 text-white text-sm font-medium hover:bg-gray-700 transition-colors"
                >
                    {t('text.reservation.backToHome')}
                </button>
            </div>
        )
    }

    return (
        <div className="w-full max-w-4xl mx-auto px-4 md:px-8 py-6 md:py-10">
            <div className="mb-5 flex items-start justify-between gap-3">
                <div>
                    <p className="text-xs text-gray-400 font-mono mb-0.5">{booking.bookingCode}</p>
                    <h1 className="text-lg md:text-xl font-bold text-gray-800">{t('text.reservation.completePayment')}</h1>
                </div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-yellow-100 text-yellow-700 rounded-full text-xs font-semibold whitespace-nowrap">
                    <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse" />
                    {t('text.reservation.awaitingPayment')}
                </span>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="flex flex-col md:grid md:grid-cols-2 md:divide-x divide-gray-100">
                    <div className="p-5 md:p-6">
                        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-5">
                            {t('text.reservation.paymentInfo')}
                        </p>
                        <PaymentInfoPanel payment={booking.payment} totalAmount={booking.totalAmount} />
                    </div>

                    <div className="block md:hidden h-px bg-gray-100 mx-5" />

                    <div className="p-5 md:p-6">
                        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-5">
                            {t('text.reservation.paymentLink')}
                        </p>
                        <PaymentLinkPanel payment={booking.payment} />
                    </div>
                </div>
            </div>
        </div>
    )
}