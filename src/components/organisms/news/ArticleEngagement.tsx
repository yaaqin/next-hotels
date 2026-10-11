'use client'
import { createContext, ReactNode, useContext, useEffect, useState } from 'react'
import { signIn, useSession } from 'next-auth/react'
import { Eye, Heart, X } from 'lucide-react'
import { getLikeStatus, recordView, setLike } from '@/src/services/newsEngagement'

// View & like artikel /news/[slug]. Header (ArticleStats) dan akhir artikel (ArticleLikeCta) berbagi state.
// View dihitung sekali per sesi browser; like hanya untuk tamu yang login Google.

type Engagement = {
  views: number
  likes: number
  liked: boolean
  pending: boolean
  toggleLike: () => void
}

const EngagementContext = createContext<Engagement | null>(null)

const useEngagement = () => {
  const ctx = useContext(EngagementContext)
  if (!ctx) throw new Error('useEngagement harus di dalam ArticleEngagementProvider')
  return ctx
}

export const formatCount = (n: number) => new Intl.NumberFormat('id-ID', { notation: 'compact' }).format(n)

export function ArticleEngagementProvider({
  slug,
  viewCount,
  likeCount,
  children,
}: {
  slug: string
  viewCount: number
  likeCount: number
  children: ReactNode
}) {
  const { status } = useSession()
  // ?? 0: data cache lama / BE lama belum punya penghitung
  const [views, setViews] = useState(viewCount ?? 0)
  const [likes, setLikes] = useState(likeCount ?? 0)
  const [liked, setLiked] = useState(false)
  const [pending, setPending] = useState(false)
  const [askLogin, setAskLogin] = useState(false)

  useEffect(() => {
    try {
      const key = `news-view:${slug}`
      if (sessionStorage.getItem(key)) return
      sessionStorage.setItem(key, '1')
    } catch {
      // storage diblokir → tetap hitung
    }
    recordView(slug).then((n) => n !== null && setViews(n))
  }, [slug])

  useEffect(() => {
    if (status !== 'authenticated') {
      setLiked(false)
      return
    }
    let active = true
    getLikeStatus(slug)
      .then((res) => {
        if (!active) return
        setLiked(res.data.liked)
        setLikes(res.data.likeCount)
      })
      .catch(() => {})
    return () => {
      active = false
    }
  }, [slug, status])

  const toggleLike = async () => {
    if (status === 'loading' || pending) return
    if (status !== 'authenticated') return setAskLogin(true)

    // Optimistis, lalu pakai angka dari server
    const next = !liked
    setLiked(next)
    setLikes((c) => c + (next ? 1 : -1))
    setPending(true)
    try {
      const res = await setLike(slug, next)
      setLiked(res.data.liked)
      setLikes(res.data.likeCount)
    } catch {
      setLiked(!next)
      setLikes((c) => c + (next ? -1 : 1))
    } finally {
      setPending(false)
    }
  }

  return (
    <EngagementContext.Provider value={{ views, likes, liked, pending, toggleLike }}>
      {children}
      {askLogin && <LoginToLikeModal onClose={() => setAskLogin(false)} />}
    </EngagementContext.Provider>
  )
}

function LikeButton({ size = 'sm' }: { size?: 'sm' | 'lg' }) {
  const { likes, liked, pending, toggleLike } = useEngagement()
  const lg = size === 'lg'
  return (
    <button
      type="button"
      onClick={toggleLike}
      disabled={pending}
      aria-pressed={liked}
      aria-label={liked ? 'Batal suka' : 'Suka artikel ini'}
      className={`inline-flex items-center gap-1.5 rounded-full border transition disabled:opacity-70 ${
        lg ? 'px-5 py-2.5 text-sm font-medium' : 'px-3 py-1 text-xs'
      } ${
        liked
          ? 'border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100'
          : 'border-gray-200 bg-white text-gray-600 hover:border-rose-200 hover:text-rose-600'
      }`}
    >
      <Heart size={lg ? 18 : 14} className={liked ? 'fill-current' : ''} />
      {lg ? (liked ? 'Kamu menyukai ini' : 'Suka') : null}
      <span className={lg ? 'text-gray-400' : ''}>{formatCount(likes)}</span>
    </button>
  )
}

// Baris di header artikel: jumlah view + tombol like kecil
export function ArticleStats() {
  const { views } = useEngagement()
  return (
    <div className="mt-4 flex items-center gap-3 text-sm text-gray-500">
      <span className="inline-flex items-center gap-1.5" title={`${views.toLocaleString('id-ID')} kali dilihat`}>
        <Eye size={16} />
        {formatCount(views)} dilihat
      </span>
      <LikeButton />
    </div>
  )
}

// Ajakan like di akhir artikel
export function ArticleLikeCta() {
  const { status } = useSession()
  return (
    <div className="mt-10 flex flex-col items-center gap-3 rounded-2xl bg-gray-50 px-6 py-8 text-center">
      <p className="text-base font-semibold text-gray-900">Artikel ini membantu?</p>
      <LikeButton size="lg" />
      {status === 'unauthenticated' && (
        <p className="text-xs text-gray-500">Masuk dengan Google untuk menyukai artikel.</p>
      )}
    </div>
  )
}

function LoginToLikeModal({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="like-login-title"
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-sm rounded-2xl bg-white p-8 text-center shadow-xl"
      >
        <button
          aria-label="Tutup"
          onClick={onClose}
          className="absolute right-3 top-3 rounded-full p-1.5 text-gray-400 hover:bg-gray-100"
        >
          <X size={16} />
        </button>
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose-50">
          <Heart size={22} className="text-rose-500" />
        </div>
        <p id="like-login-title" className="mt-4 text-sm font-semibold text-gray-900">
          Login diperlukan
        </p>
        <p className="mt-1 text-xs leading-relaxed text-gray-500">Masuk dengan Google untuk menyukai artikel ini.</p>
        <button
          autoFocus
          onClick={() => signIn('google', { callbackUrl: window.location.href })}
          className="mt-5 inline-flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-medium text-gray-700 transition hover:border-gray-400 hover:shadow-sm"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
            <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4" />
            <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.859-3.048.859-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853" />
            <path d="M3.964 10.706A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.038l3.007-2.332z" fill="#FBBC05" />
            <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.962L3.964 7.294C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335" />
          </svg>
          Masuk dengan Google
        </button>
      </div>
    </div>
  )
}
