'use client'

import { useState, useEffect } from 'react'
import { Image } from '@/src/models/public/room/detail'

interface Props {
    images: Image[]
}

function getGridClass(count: number) {
    if (count === 1) return 'grid-cols-1'
    if (count === 2) return 'grid-cols-2'
    return 'grid-cols-[2fr_1fr]'
}

export default function RoomImageGallery({ images }: Props) {
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

    const isOpen = lightboxIndex !== null
    const visibleImages = images.slice(0, 5)
    const remaining = images.length - 5

    const open = (idx: number) => {
        setLightboxIndex(idx)
        document.body.style.overflow = 'hidden'
    }

    const close = () => {
        setLightboxIndex(null)
        document.body.style.overflow = ''
    }

    const navigate = (dir: number) => {
        if (lightboxIndex === null) return
        setLightboxIndex((lightboxIndex + dir + images.length) % images.length)
    }

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (!isOpen) return
            if (e.key === 'Escape') close()
            if (e.key === 'ArrowLeft') navigate(-1)
            if (e.key === 'ArrowRight') navigate(1)
        }
        window.addEventListener('keydown', handler)
        return () => window.removeEventListener('keydown', handler)
    }, [isOpen, lightboxIndex])

    if (!images.length) return null

    function getGridStyle(n: number): React.CSSProperties {
        const base: React.CSSProperties = {
            display: 'grid',
            gap: 4,
            height: 'clamp(240px, 45vw, 480px)', // ← ini: mobile 240px, desktop max 480px
            borderRadius: 14,
            overflow: 'hidden',
        }
        if (n === 1) return { ...base, gridTemplateColumns: '1fr' }
        if (n === 2) return { ...base, gridTemplateColumns: '1fr 1fr' }
        if (n === 3) return { ...base, gridTemplateColumns: '2fr 1fr', gridTemplateRows: '1fr 1fr' }
        if (n === 4) return { ...base, gridTemplateColumns: '2fr 1fr', gridTemplateRows: '1fr 1fr' }
        return { ...base, gridTemplateColumns: '2fr 1fr 1fr', gridTemplateRows: '1fr 1fr' }
    }

    return (
        <>
            {/* ── Grid ── */}
            <div style={getGridStyle(visibleImages.length)}>
                {visibleImages.map((img, idx) => (
                    <div
                        key={img.id}
                        onClick={() => setLightboxIndex(idx)}
                        // ✅ gridRow juga inline style
                        style={{ gridRow: idx === 0 && images.length >= 3 ? 'span 2' : undefined }}
                        className="relative overflow-hidden cursor-pointer group bg-gray-100"
                    >
                        <img
                            src={img.url}
                            alt={img.name}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                        {idx === 4 && remaining > 0 && (
                            <div className="absolute inset-0 bg-black/55 flex items-center justify-center">
                                <span className="text-white text-xl font-semibold">+{remaining}</span>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* ── Lightbox ── */}
            {isOpen && lightboxIndex !== null && (
                <div
                    className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex flex-col items-center justify-center"
                    onClick={close}
                >
                    {/* Close */}
                    <button
                        onClick={close}
                        className="absolute top-5 right-5 text-white/70 hover:text-white w-10 h-10 rounded-full bg-white/10 flex items-center justify-center transition-colors z-10"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>

                    {/* Counter */}
                    <div className="absolute top-6 left-6 text-white/60 text-xs font-medium">
                        {lightboxIndex + 1} / {images.length}
                    </div>

                    {/* Image */}
                    <div
                        className="relative max-w-[90vw] max-h-[72vh] mx-16"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <img
                            src={images[lightboxIndex].url}
                            alt={images[lightboxIndex].name}
                            className="max-w-full max-h-[72vh] object-contain rounded-xl shadow-2xl"
                        />

                        {/* Prev */}
                        <button
                            onClick={(e) => { e.stopPropagation(); navigate(-1) }}
                            className="absolute left-[-52px] top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>

                        {/* Next */}
                        <button
                            onClick={(e) => { e.stopPropagation(); navigate(1) }}
                            className="absolute right-[-52px] top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>

                    {/* Caption */}
                    <p className="mt-3 text-white/70 text-xs text-center">
                        {images[lightboxIndex].name}
                    </p>

                    {/* Thumbnails */}
                    <div
                        className="flex gap-2 mt-4 px-4 overflow-x-auto max-w-[90vw] pb-1"
                        style={{ scrollbarWidth: 'none' }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {images.map((img, idx) => (
                            <button
                                key={img.id}
                                onClick={() => setLightboxIndex(idx)}
                                className={`
                  flex-shrink-0 w-14 h-14 rounded-lg overflow-hidden border-2 transition-all
                  ${idx === lightboxIndex ? 'border-white opacity-100 scale-110' : 'border-transparent opacity-50 hover:opacity-80'}
                `}
                            >
                                <img src={img.url} alt={img.name} className="w-full h-full object-cover" />
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </>
    )
}