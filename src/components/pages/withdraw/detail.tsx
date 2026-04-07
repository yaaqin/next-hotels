'use client'

import { useWithdrawDetail } from '@/src/hooks/query/withdraw/detail'
import { useParams, useRouter } from 'next/navigation'
import {
    ArrowLeft01Icon,
    CreditCardIcon,
    UserIcon,
    BitcoinEllipseIcon,
    CheckmarkCircle01Icon,
    Clock01Icon,
    Cancel01Icon,
    Loading01Icon,
} from 'hugeicons-react'
import { useApproveWithdraw } from '@/src/hooks/mutation/withdraw/approve'

function formatCurrency(amount: number) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(amount)
}

function formatDate(dateStr: string | null) {
    if (!dateStr) return '—'
    const date = new Date(dateStr)
    return date.toLocaleString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    })
}

function Label({ children }: { children: React.ReactNode }) {
    return <p className="text-[10px] tracking-[0.14em] uppercase text-gray-400 mb-1">{children}</p>
}

function Field({ children }: { children: React.ReactNode }) {
    return <p className="text-sm font-medium text-gray-800">{children}</p>
}

function Divider() {
    return <div className="border-t border-dashed border-gray-100 my-4" />
}

function StatusBadge({ status }: { status: string }) {
    const map: Record<string, { label: string; class: string; icon: React.ReactNode }> = {
        PENDING: {
            label: 'Pending',
            class: 'bg-yellow-50 text-yellow-700',
            icon: <Clock01Icon size={12} />,
        },
        PROCESSING: {
            label: 'Processing',
            class: 'bg-blue-50 text-blue-700',
            icon: <Loading01Icon size={12} />,
        },
        COMPLETED: {
            label: 'Completed',
            class: 'bg-green-50 text-green-700',
            icon: <CheckmarkCircle01Icon size={12} />,
        },
        FAILED: {
            label: 'Failed',
            class: 'bg-red-50 text-red-700',
            icon: <Cancel01Icon size={12} />,
        },
        CANCELLED: {
            label: 'Cancelled',
            class: 'bg-gray-100 text-gray-500',
            icon: <Cancel01Icon size={12} />,
        },
    }

    const s = map[status] ?? { label: status, class: 'bg-gray-100 text-gray-500', icon: null }

    return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium ${s.class}`}>
            {s.icon}
            {s.label}
        </span>
    )
}

export default function DetailWithdraw() {
    const params = useParams<{ id: string }>()
    const router = useRouter()
    const id = params.id
    const { data, isLoading } = useWithdrawDetail(id)
    const { mutate: approve, isPending } = useApproveWithdraw(id)


    const wd = data?.data

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#f5f4f0] flex items-center justify-center">
                <p className="text-sm text-gray-400 tracking-widest uppercase animate-pulse">Memuat data...</p>
            </div>
        )
    }

    if (!wd) {
        return (
            <div className="min-h-screen bg-[#f5f4f0] flex items-center justify-center">
                <p className="text-sm text-gray-400">Data tidak ditemukan.</p>
            </div>
        )
    }

    const canApprove = wd.status === 'PENDING'

    return (
        <div className="min-h-screen bg-[#f5f4f0] py-10 px-4">
            <div className="w-full mx-auto space-y-4">

                {/* Header */}
                <div className="flex items-center gap-3 mb-2">
                    <button
                        onClick={() => router.back()}
                        className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center hover:bg-gray-50 transition-colors"
                    >
                        <ArrowLeft01Icon size={15} className="text-gray-600" />
                    </button>
                    <div>
                        <h1 className="text-xl font-semibold text-gray-900 tracking-tight">Detail Withdraw</h1>
                        <p className="text-[11px] text-gray-400 tracking-widest uppercase">#{wd.id.slice(0, 8)}</p>
                    </div>
                </div>

                {/* Status & Amount */}
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <BitcoinEllipseIcon size={16} className="text-emerald-400" />
                            <span className="text-xs tracking-widest uppercase text-gray-400">Nominal</span>
                        </div>
                        <StatusBadge status={wd.status} />
                    </div>

                    <p className="text-3xl font-semibold text-gray-900 mb-1">
                        {formatCurrency(wd.amountIdr)}
                    </p>
                    <p className="text-sm text-emerald-600 font-medium">
                        {wd.amountSgt.toFixed(6)} SGT
                    </p>

                    <Divider />

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <div>
                            <Label>Rate snapshot</Label>
                            <Field>{wd.rateSnapshot.toLocaleString('id-ID')}</Field>
                        </div>
                        <div>
                            <Label>Requested at</Label>
                            <Field>{formatDate(wd.requestedAt)}</Field>
                        </div>
                        <div>
                            <Label>Processed at</Label>
                            <Field>{formatDate(wd.processedAt)}</Field>
                        </div>
                        <div>
                            <Label>Tx Hash</Label>
                            <Field>
                                {wd.txHash
                                    ? <span className="font-mono text-[11px] break-all">{wd.txHash}</span>
                                    : '—'
                                }
                            </Field>
                        </div>
                    </div>

                    {wd.note && (
                        <>
                            <Divider />
                            <div>
                                <Label>Note</Label>
                                <p className="text-sm text-red-500">{wd.note}</p>
                            </div>
                        </>
                    )}
                </div>

                {/* Wallet & Kredit */}
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                    <div className="flex items-center gap-2 mb-4">
                        <CreditCardIcon size={16} className="text-blue-400" />
                        <span className="text-xs tracking-widest uppercase text-gray-400">Wallet & Kredit</span>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <Label>Wallet address</Label>
                            <p className="text-[12px] font-mono text-gray-700 break-all mt-0.5">{wd.walletAddress}</p>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                            <div>
                                <Label>Kode kredit</Label>
                                <Field>{wd.credit.code}</Field>
                            </div>
                            <div>
                                <Label>Credit ID</Label>
                                <Field>
                                    <span className="text-[11px] font-mono">{wd.credit.id.slice(0, 8)}...</span>
                                </Field>
                            </div>
                        </div>
                    </div>
                </div>

                {/* User Info */}
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                    <div className="flex items-center gap-2 mb-4">
                        <UserIcon size={16} className="text-purple-400" />
                        <span className="text-xs tracking-widest uppercase text-gray-400">Info user</span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <div>
                            <Label>Nama</Label>
                            <Field>{wd.user.name}</Field>
                        </div>
                        <div>
                            <Label>Email</Label>
                            <Field>{wd.user.email}</Field>
                        </div>
                        <div>
                            <Label>Phone</Label>
                            <Field>{wd.user.phone ?? '—'}</Field>
                        </div>
                        <div>
                            <Label>User ID</Label>
                            <Field>
                                <span className="text-[11px] font-mono">{wd.user.id.slice(0, 8)}...</span>
                            </Field>
                        </div>
                    </div>
                </div>

                {/* Admin Info */}
                {wd.admin && (
                    <div className="bg-white rounded-2xl p-6 shadow-sm">
                        <div className="flex items-center gap-2 mb-4">
                            <UserIcon size={16} className="text-orange-400" />
                            <span className="text-xs tracking-widest uppercase text-gray-400">Diproses oleh</span>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                            <div>
                                <Label>Username</Label>
                                <Field>{wd.admin.username}</Field>
                            </div>
                            <div>
                                <Label>Email</Label>
                                <Field>{wd.admin.email}</Field>
                            </div>
                        </div>
                    </div>
                )}

                {/* Approve Button */}
                {canApprove && (
                    <div className="bg-white rounded-2xl p-6 shadow-sm">
                        <p className="text-xs text-gray-400 mb-4 text-center">
                            Approve akan langsung trigger mint SGT ke wallet user. Pastikan semua data sudah benar.
                        </p>
                        <button
                            onClick={() => approve()}
                            disabled={isPending}
                            className="w-full py-3.5 rounded-xl bg-gray-900 text-white text-sm font-medium tracking-wide hover:bg-gray-700 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                        >
                            {isPending ? (
                                <>
                                    <svg
                                        className="animate-spin h-4 w-4 text-white"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                    </svg>
                                    Memproses...
                                </>
                            ) : (
                                'Approve & Mint SGT' 
                            )}
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}