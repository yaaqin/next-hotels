"use client";

// src/components/operational/CheckInOperationalSection.tsx

import { useCheckInOprList } from '@/src/hooks/query/operational/checkInOpr'
import { checkinOprProps } from '@/src/models/operational/checkinList'
import { AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { BookingCard, BookingCardSkeleton, BookingItemShared, BookingModal, ModalVariant } from './shared';

interface CheckInOpsProps {
    actionLabel?: string
    onAction?: (booking: checkinOprProps) => void
    isActionLoading?: boolean
}

export default function CheckInOperationalSection({
    actionLabel,
    onAction,
    isActionLoading,
}: CheckInOpsProps) {
    const { data, isLoading } = useCheckInOprList()
    const [selected, setSelected] = useState<BookingItemShared | null>(null)

    const bookings = (data?.data?.bookings ?? []) as BookingItemShared[]
    const modalVariant: ModalVariant = actionLabel && onAction ? 'action' : 'detail'

    return (
        <div className="space-y-3">
            {isLoading && [...Array(3)].map((_, i) => <BookingCardSkeleton key={i} />)}

            {!isLoading && bookings.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                    <p className="text-3xl mb-3 opacity-20">🛏️</p>
                    <p className="text-sm text-gray-400">Tidak ada tamu yang sedang check-in</p>
                </div>
            )}

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

            <BookingModal
                booking={selected}
                variant={modalVariant}
                onClose={() => setSelected(null)}
                actionLabel={actionLabel}
                onAction={onAction ? (b: any) => onAction(b as checkinOprProps) : undefined}
                isActionLoading={isActionLoading}
            />
        </div>
    )
}