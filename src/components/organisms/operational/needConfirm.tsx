"use client";

import { useNeedConfirmList } from '@/src/hooks/query/operational/confirmList'
import { needConfirmListState } from '@/src/models/operational/confirmList'
import { AnimatePresence, motion } from 'framer-motion'
import React, { useState } from 'react'

// ── Helpers ────────────────────────────────────────────────────────────────

function formatPrice(price: number) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(price)
}

function getRoomName(booking: needConfirmListState) {
    const t = booking.items?.[0]?.roomType?.translations?.[0]
    return t?.name ?? '—'
}

function getRoomNumber(booking: needConfirmListState) {
    return booking.items?.[0]?.room?.number ?? '—'
}

function getFloor(booking: needConfirmListState) {
    return booking.items?.[0]?.room?.floorId ?? '—'
}

function getImageUrl(booking: needConfirmListState) {
    return booking.items?.[0]?.roomType?.image?.url ?? null
}

// ── Modal ──────────────────────────────────────────────────────────────────

type ModalVariant = 'detail' | 'action'

interface BookingModalProps {
    booking: needConfirmListState | null
    variant: ModalVariant
    onClose: () => void
    actionLabel?: string
    onAction?: (booking: needConfirmListState) => void
    isActionLoading?: boolean
}

function BookingModal({
    booking,
    variant,
    onClose,
    actionLabel,
    onAction,
    isActionLoading,
}: BookingModalProps) {
    if (!booking) return null

    const imageUrl = getImageUrl(booking)
    const roomName = getRoomName(booking)

    return (
        <AnimatePresence>
            {booking && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    />

                    {/* Modal */}
                    <motion.div
                        className="fixed z-50 inset-x-4 bottom-0 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 w-full sm:max-w-sm bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden"
                        initial={{ y: '100%', opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: '100%', opacity: 0 }}
                        transition={{ type: 'spring', stiffness: 100, damping: 20 }}
                    >
                        {/* Image */}
                        <div className="relative h-40 bg-gray-100">
                            {imageUrl ? (
                                <img src={imageUrl} alt={roomName} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
                                    <span className="text-4xl opacity-20">🏨</span>
                                </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                            <button
                                onClick={onClose}
                                className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-white text-xs hover:bg-white/40 transition"
                            >
                                ✕
                            </button>
                            <div className="absolute bottom-3 left-4">
                                <p className="text-white/70 text-xs tracking-widest uppercase">{booking.site?.nama}</p>
                                <p className="text-white text-base font-semibold">{roomName}</p>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="px-5 py-5 space-y-4">
                            {/* Room info */}
                            <div className="grid grid-cols-3 gap-2">
                                {[
                                    { label: 'Room', value: getRoomNumber(booking) },
                                    { label: 'Floor', value: getFloor(booking) },
                                    { label: 'Nights', value: `${booking.items?.[0]?.nights ?? 1}n` },
                                ].map((item) => (
                                    <div key={item.label} className="bg-gray-50 rounded-xl px-3 py-2.5 text-center">
                                        <p className="text-xs text-gray-400 uppercase tracking-wide">{item.label}</p>
                                        <p className="text-sm font-semibold text-gray-800 mt-0.5">{item.value}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Guest email */}
                            <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3">
                                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                                    <span className="text-xs">👤</span>
                                </div>
                                <div className="min-w-0">
                                    <p className="text-xs font-medium text-gray-800 truncate">{booking.contact?.fullName}</p>
                                    <p className="text-xs text-gray-400 truncate">{booking.contact?.email}</p>
                                </div>
                            </div>

                            {/* Price */}
                            <div className="flex items-center justify-between bg-blue-50 border border-blue-100 rounded-xl px-4 py-3">
                                <p className="text-xs text-blue-400 uppercase tracking-widest">Total</p>
                                <p className="text-base font-bold text-blue-600">{formatPrice(booking.totalAmount)}</p>
                            </div>

                            {/* Action button — hanya muncul di variant 'action' */}
                            {variant === 'action' && actionLabel && onAction && (
                                <button
                                    disabled={isActionLoading}
                                    onClick={() => onAction(booking)}
                                    className={`w-full py-3 rounded-xl text-sm font-medium tracking-widest uppercase transition-all duration-200
                                        ${isActionLoading
                                            ? 'bg-gray-100 text-gray-300 cursor-not-allowed'
                                            : 'bg-blue-500 text-white hover:bg-blue-600 shadow-md shadow-blue-100'
                                        }`}
                                >
                                    {isActionLoading ? 'Processing...' : actionLabel}
                                </button>
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}

// ── Booking Card ───────────────────────────────────────────────────────────

interface BookingCardProps {
    booking: needConfirmListState
    index: number
    onClick: () => void
}

export function BookingCard({ booking, index, onClick }: BookingCardProps) {
    const imageUrl = getImageUrl(booking)
    const roomName = getRoomName(booking)

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.06, duration: 0.35, ease: 'easeOut' }}
            onClick={onClick}
            className="flex items-center gap-3 bg-white border border-gray-100 rounded-2xl p-3 cursor-pointer hover:shadow-lg hover:shadow-blue-50 hover:-translate-y-0.5 transition-all duration-200"
        >
            {/* Image */}
            <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                {imageUrl ? (
                    <img src={imageUrl} alt={roomName} className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
                        <span className="text-xl opacity-30">🏨</span>
                    </div>
                )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-400 truncate">{booking.bookingCode}</p>
                <p className="text-sm font-semibold text-gray-800 truncate mt-0.5">{roomName}</p>
                <p className="text-xs text-gray-500 mt-0.5">
                    Room {getRoomNumber(booking)} · Lt. {getFloor(booking)}
                </p>
            </div>

            {/* Status + price */}
            <div className="text-right shrink-0">
                <span className="inline-block px-2 py-0.5 rounded-full bg-blue-50 text-blue-500 text-xs font-medium border border-blue-100">
                    {booking.status}
                </span>
                <p className="text-xs font-bold text-gray-700 mt-1">{formatPrice(booking.totalAmount)}</p>
            </div>
        </motion.div>
    )
}

// ── Main Section ───────────────────────────────────────────────────────────

interface NeedConfirmSectionProps {
    // optional — kalau tidak dikirim, modal tampil versi detail only
    actionLabel?: string
    onAction?: (booking: needConfirmListState) => void
    isActionLoading?: boolean
}

export default function NeedConfirmSection({
    actionLabel,
    onAction,
    isActionLoading,
}: NeedConfirmSectionProps) {
    const { data, isLoading } = useNeedConfirmList()
    const [selected, setSelected] = useState<needConfirmListState | null>(null)

    const bookings = data?.data?.bookings ?? []
    const modalVariant: ModalVariant = actionLabel && onAction ? 'action' : 'detail'

    return (
        <div className="space-y-3">
            {/* Loading skeleton */}
            {isLoading && (
                <>
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="flex items-center gap-3 bg-white border border-gray-100 rounded-2xl p-3 animate-pulse">
                            <div className="w-16 h-16 rounded-xl bg-gray-100 shrink-0" />
                            <div className="flex-1 space-y-2">
                                <div className="h-3 bg-gray-100 rounded w-1/3" />
                                <div className="h-4 bg-gray-100 rounded w-2/3" />
                                <div className="h-3 bg-gray-100 rounded w-1/2" />
                            </div>
                        </div>
                    ))}
                </>
            )}

            {/* Empty */}
            {!isLoading && bookings.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                    <p className="text-3xl mb-3 opacity-20">📋</p>
                    <p className="text-sm text-gray-400">Tidak ada data</p>
                </div>
            )}

            {/* Cards */}
            <AnimatePresence>
                {!isLoading && bookings.map((booking, i) => (
                    <BookingCard
                        key={booking.id}
                        booking={booking}
                        index={i}
                        onClick={() => setSelected(booking)}
                    />
                ))}
            </AnimatePresence>

            {/* Modal */}
            <BookingModal
                booking={selected}
                variant={modalVariant}
                onClose={() => setSelected(null)}
                actionLabel={actionLabel}
                onAction={onAction}
                isActionLoading={isActionLoading}
            />
        </div>
    )
}