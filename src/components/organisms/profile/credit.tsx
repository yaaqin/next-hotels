'use client'

import { useState, useRef } from 'react'
import { CreditCardIcon, ArrowRight01Icon, BitcoinEllipseIcon, Copy01Icon, TickDouble01Icon } from 'hugeicons-react'
import { WithdrawPreview } from '@/src/services/withdraw/preview'
import { WithdrawRequest } from '@/src/services/withdraw/req'

// ── Types ─────────────────────────────────────────────────────────────────────
type Chain = 'ETH' | 'SOL' | 'SUI'
type Step = 'idle' | 'select-method' | 'select-chain' | 'form' | 'confirm'

interface PreviewData {
    amountIdr: number
    rateSnapshot: number
    amountSgt: number
    currentBalance: number
    balanceAfter: number
    previewToken: string
    tokenExpiresAt: string
}

// ── Helpers ───────────────────────────────────────────────────────────────────
const CHAINS: { id: Chain; label: string; active: boolean; desc: string }[] = [
    { id: 'ETH', label: 'Ethereum', active: false, desc: 'ERC-20' },
    { id: 'SUI', label: 'Sui', active: true, desc: 'SUI Network' },
    { id: 'SOL', label: 'Solana', active: false, desc: 'SPL Token' },
]

// ── Sub components ────────────────────────────────────────────────────────────
const Label = ({ children }: { children: React.ReactNode }) => (
    <p className="text-[10px] tracking-[0.14em] uppercase text-gray-400 mb-1">{children}</p>
)
const Field = ({ children }: { children: React.ReactNode }) => (
    <p className="text-sm font-medium text-gray-800">{children}</p>
)
const Divider = () => <div className="border-t border-gray-100 my-4" />

export default function CreditCard({
    user,
    isLoading,
    formatCurrency,
    formatDate,
    router,
}: {
    user: any
    isLoading: boolean
    formatCurrency: (n: number) => string
    formatDate: (s: string) => string
    router: any
}) {
    const [step, setStep] = useState<Step>('idle')
    const [selectedChain, setSelectedChain] = useState<Chain | null>(null)
    const [amount, setAmount] = useState('')
    const [wallet, setWallet] = useState('')
    const [preview, setPreview] = useState<PreviewData | null>(null)
    const [loadingPreview, setLoadingPreview] = useState(false)
    const [pasted, setPasted] = useState(false)
    const [error, setError] = useState('')
    const walletRef = useRef<HTMLInputElement>(null)

    const reset = () => {
        setStep('idle')
        setSelectedChain(null)
        setAmount('')
        setWallet('')
        setPreview(null)
        setError('')
    }

    const handlePaste = async () => {
        try {
            const text = await navigator.clipboard.readText()
            setWallet(text)
            setPasted(true)
            setTimeout(() => setPasted(false), 2000)
        } catch {
            walletRef.current?.focus()
        }
    }

    const handlePreview = async () => {
        setError('')
        if (!amount || parseInt(amount) < 10000) {
            setError('Minimum withdraw Rp 10.000')
            return
        }
        if (!wallet) {
            setError('Wallet address wajib diisi')
            return
        }
        if (!/^0x[a-fA-F0-9]{64}$/.test(wallet)) {
            setError('Format wallet Sui tidak valid (0x + 64 hex chars)')
            return
        }

        try {
            setLoadingPreview(true)
            const res = await WithdrawPreview(amount)
            setPreview((res as any).data)
            setStep('confirm')
        } catch (e: any) {
            setError(e?.response?.data?.message ?? 'Gagal mengambil preview. Coba lagi.')
        } finally {
            setLoadingPreview(false)
        }
    }

    const handleConfirm = async () => {
        try {
            setLoadingPreview(true)
            await WithdrawRequest({
                previewToken: preview!.previewToken,
                walletAddress: wallet,
            })
            reset()
            // TODO: tampilin toast sukses
            // alert('Withdraw berhasil diajukan!')
        } catch (e: any) {
            setError(e?.response?.data?.message ?? 'Gagal submit withdraw. Coba lagi.')
            setStep('form')
        } finally {
            setLoadingPreview(false)
        }
    }

    // ── Render ─────────────────────────────────────────────────────────────────
    return (
        <>
            {/* Credit Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-2">
                        <CreditCardIcon size={16} className="text-emerald-400" />
                        <span className="text-xs tracking-widest uppercase text-gray-400">Booking credit</span>
                    </div>
                    {user?.credit && (
                        <span
                            className={`text-[10px] font-medium px-2.5 py-1 rounded-lg tracking-widest uppercase
                ${user.credit.status === 'ACTIVE' ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-400'}`}
                        >
                            {user.credit.status}
                        </span>
                    )}
                </div>

                {isLoading ? (
                    <p className="text-xs text-gray-300 text-center py-4">Memuat kredit...</p>
                ) : user?.credit ? (
                    <>
                        <p className="text-[10px] tracking-[0.14em] uppercase text-gray-400 mb-1">Saldo tersedia</p>
                        <p className="text-3xl font-semibold text-gray-900">{formatCurrency(user.credit.balance)}</p>

                        <Divider />

                        <div className="grid grid-cols-2 gap-5">
                            <div>
                                <Label>Kode kredit</Label>
                                <Field><span className="tracking-wider text-[13px]">{user.credit.code}</span></Field>
                            </div>
                            <div>
                                <Label>Berlaku hingga</Label>
                                <Field>{formatDate(user.credit.expiredAt)}</Field>
                            </div>
                        </div>

                        <button
                            onClick={() => router.push('/profile/credit-history')}
                            className="flex items-center gap-1.5 mt-4 text-xs text-blue-500 hover:underline"
                        >
                            <ArrowRight01Icon size={13} />
                            Lihat riwayat kredit
                        </button>

                        <Divider />

                        {/* Withdraw Button */}
                        <button
                            onClick={() => setStep('select-method')}
                            className="w-full mt-1 py-2.5 rounded-xl bg-gray-900 text-white text-xs font-medium tracking-wide hover:bg-gray-700 transition-colors"
                        >
                            Withdraw
                        </button>
                    </>
                ) : (
                    <p className="text-sm text-gray-400 text-center py-4">Tidak ada kredit aktif</p>
                )}
            </div>

            {/* ── Modal Overlay ───────────────────────────────────────────────────── */}
            {step !== 'idle' && (
                <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm px-4">
                    <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden">

                        {/* ── Step: Select Method ─────────────────────────────────────── */}
                        {step === 'select-method' && (
                            <div className="p-6">
                                <h2 className="text-base font-semibold text-gray-900 mb-1">Pilih metode withdraw</h2>
                                <p className="text-xs text-gray-400 mb-6">Pilih cara kamu ingin menarik saldo kredit</p>

                                <div className="flex flex-col gap-3">
                                    {/* Cash — disabled */}
                                    <button
                                        disabled
                                        className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 bg-gray-50 opacity-40 cursor-not-allowed text-left"
                                    >
                                        <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center shrink-0">
                                            <span className="text-base">💵</span>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-700">Cash</p>
                                            <p className="text-[11px] text-gray-400">Transfer bank — segera hadir</p>
                                        </div>
                                        <span className="ml-auto text-[10px] bg-gray-200 text-gray-500 px-2 py-0.5 rounded-full">Soon</span>
                                    </button>

                                    {/* Crypto */}
                                    <button
                                        onClick={() => setStep('select-chain')}
                                        className="flex items-center gap-4 p-4 rounded-xl border border-gray-900 bg-gray-900 text-left hover:bg-gray-800 transition-colors"
                                    >
                                        <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                                            <BitcoinEllipseIcon size={18} className="text-white" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-white">Crypto</p>
                                            <p className="text-[11px] text-gray-400">Terima SGT ke wallet kamu</p>
                                        </div>
                                        <ArrowRight01Icon size={15} className="ml-auto text-white" />
                                    </button>
                                </div>

                                <button onClick={reset} className="w-full mt-5 text-xs text-gray-400 hover:text-gray-600">
                                    Batal
                                </button>
                            </div>
                        )}

                        {/* ── Step: Select Chain ──────────────────────────────────────── */}
                        {step === 'select-chain' && (
                            <div className="p-6">
                                <button onClick={() => setStep('select-method')} className="text-xs text-gray-400 hover:text-gray-600 mb-4 flex items-center gap-1">
                                    ← Kembali
                                </button>
                                <h2 className="text-base font-semibold text-gray-900 mb-1">Pilih jaringan</h2>
                                <p className="text-xs text-gray-400 mb-6">Hanya jaringan Sui yang tersedia saat ini</p>

                                <div className="flex flex-col gap-3">
                                    {CHAINS.map((chain) => (
                                        <button
                                            key={chain.id}
                                            disabled={!chain.active}
                                            onClick={() => { setSelectedChain(chain.id); setStep('form') }}
                                            className={`flex items-center gap-4 p-4 rounded-xl border text-left transition-colors
                        ${chain.active
                                                    ? 'border-gray-900 bg-gray-900 hover:bg-gray-800'
                                                    : 'border-gray-100 bg-gray-50 opacity-40 cursor-not-allowed'
                                                }`}
                                        >
                                            <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-base
                        ${chain.active ? 'bg-white/10' : 'bg-gray-200'}`}>
                                                {chain.id === 'ETH' ? '⟠' : chain.id === 'SOL' ? '◎' : '🌊'}
                                            </div>
                                            <div>
                                                <p className={`text-sm font-medium ${chain.active ? 'text-white' : 'text-gray-700'}`}>
                                                    {chain.label}
                                                </p>
                                                <p className="text-[11px] text-gray-400">{chain.desc}</p>
                                            </div>
                                            {!chain.active && (
                                                <span className="ml-auto text-[10px] bg-gray-200 text-gray-500 px-2 py-0.5 rounded-full">Soon</span>
                                            )}
                                            {chain.active && (
                                                <ArrowRight01Icon size={15} className="ml-auto text-white" />
                                            )}
                                        </button>
                                    ))}
                                </div>

                                <button onClick={reset} className="w-full mt-5 text-xs text-gray-400 hover:text-gray-600">
                                    Batal
                                </button>
                            </div>
                        )}

                        {/* ── Step: Form ──────────────────────────────────────────────── */}
                        {step === 'form' && (
                            <div className="p-6">
                                <button onClick={() => setStep('select-chain')} className="text-xs text-gray-400 hover:text-gray-600 mb-4 flex items-center gap-1">
                                    ← Kembali
                                </button>
                                <h2 className="text-base font-semibold text-gray-900 mb-1">Detail withdraw</h2>
                                <p className="text-xs text-gray-400 mb-6">
                                    Saldo tersedia: <span className="font-medium text-gray-700">{formatCurrency(user.credit.balance)}</span>
                                </p>

                                {/* Amount */}
                                <div className="mb-4">
                                    <label className="text-[10px] tracking-widest uppercase text-gray-400 mb-1.5 block">
                                        Jumlah (IDR)
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-gray-400">Rp</span>
                                        <input
                                            type="number"
                                            value={amount}
                                            onChange={(e) => setAmount(e.target.value)}
                                            placeholder="10.000"
                                            min={10000}
                                            className="w-full pl-9 pr-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                                        />
                                    </div>
                                    <p className="text-[10px] text-gray-400 mt-1">Minimum Rp 10.000</p>
                                </div>

                                {/* Wallet Address */}
                                <div className="mb-5">
                                    <label className="text-[10px] tracking-widest uppercase text-gray-400 mb-1.5 block">
                                        Sui Wallet Address
                                    </label>
                                    <div className="relative">
                                        <input
                                            ref={walletRef}
                                            type="text"
                                            value={wallet}
                                            onChange={(e) => setWallet(e.target.value)}
                                            placeholder="0x..."
                                            className="w-full pr-12 pl-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent font-mono"
                                        />
                                        <button
                                            onClick={handlePaste}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition-colors"
                                            title="Paste dari clipboard"
                                        >
                                            {pasted
                                                ? <TickDouble01Icon size={16} className="text-emerald-500" />
                                                : <Copy01Icon size={16} />
                                            }
                                        </button>
                                    </div>
                                </div>

                                {/* Error */}
                                {error && (
                                    <p className="text-xs text-red-500 mb-4 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
                                )}

                                <button
                                    onClick={handlePreview}
                                    disabled={loadingPreview}
                                    className="w-full py-3 rounded-xl bg-gray-900 text-white text-sm font-medium hover:bg-gray-700 transition-colors disabled:opacity-50"
                                >
                                    {loadingPreview ? 'Mengecek...' : 'Preview Withdraw'}
                                </button>

                                <button onClick={reset} className="w-full mt-3 text-xs text-gray-400 hover:text-gray-600">
                                    Batal
                                </button>
                            </div>
                        )}

                        {/* ── Step: Confirm Modal ─────────────────────────────────────── */}
                        {step === 'confirm' && preview && (
                            <div className="p-6">
                                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-emerald-50 mx-auto mb-4">
                                    <TickDouble01Icon size={22} className="text-emerald-500" />
                                </div>
                                <h2 className="text-base font-semibold text-gray-900 text-center mb-1">Konfirmasi Withdraw</h2>
                                <p className="text-xs text-gray-400 text-center mb-6">Pastikan detail berikut sudah benar</p>

                                <div className="bg-gray-50 rounded-xl p-4 flex flex-col gap-3 mb-5">
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs text-gray-400">Jumlah withdraw</span>
                                        <span className="text-sm font-semibold text-gray-900">{formatCurrency(preview.amountIdr)}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs text-gray-400">Kamu akan terima</span>
                                        <span className="text-sm font-semibold text-emerald-600">{preview.amountSgt.toFixed(6)} SGT</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs text-gray-400">Rate (IDR/SGD)</span>
                                        <span className="text-xs text-gray-600">{preview.rateSnapshot.toLocaleString('id-ID')}</span>
                                    </div>
                                    <Divider />
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs text-gray-400">Saldo sebelum</span>
                                        <span className="text-xs text-gray-600">{formatCurrency(preview.currentBalance)}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs text-gray-400">Saldo setelah</span>
                                        <span className="text-xs font-medium text-gray-800">{formatCurrency(preview.balanceAfter)}</span>
                                    </div>
                                    <Divider />
                                    <div>
                                        <span className="text-xs text-gray-400 block mb-1">Wallet tujuan</span>
                                        <span className="text-[11px] font-mono text-gray-700 break-all">{wallet}</span>
                                    </div>
                                </div>

                                <p className="text-[10px] text-amber-600 bg-amber-50 px-3 py-2 rounded-lg mb-5 text-center">
                                    Preview berlaku 10 menit. Setelah submit, saldo langsung dipotong.
                                </p>

                                <button
                                    onClick={handleConfirm}
                                    className="w-full py-3 rounded-xl bg-gray-900 text-white text-sm font-medium hover:bg-gray-700 transition-colors mb-3"
                                >
                                    Konfirmasi & Submit
                                </button>
                                <button
                                    onClick={() => setStep('form')}
                                    className="w-full text-xs text-gray-400 hover:text-gray-600"
                                >
                                    ← Ubah detail
                                </button>
                            </div>
                        )}

                    </div>
                </div>
            )}
        </>
    )
}