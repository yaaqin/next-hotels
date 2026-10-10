'use client'
import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ArrowDown01Icon, ArrowLeft01Icon, ArrowRight01Icon } from 'hugeicons-react'
import { NavItem } from '@/src/constans/menu/navbar'

const SCROLL_STEP = 240

export const isActivePath = (pathname: string, path?: string) =>
  !!path && (pathname === path || pathname.startsWith(`${path}/`))

const itemClass = (active: boolean) =>
  `flex items-center gap-1 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition-colors ${active
    ? 'bg-blue-50 text-blue-600 dark:bg-blue-500/15 dark:text-blue-300'
    : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600 dark:text-slate-300 dark:hover:bg-slate-800'
  }`

// Menu atas desktop: satu baris, geser kiri/kanan tanpa scrollbar.
// Panah muncul hanya kalau ada menu yang tertutup di sisi itu.
export default function NavScroller({ items }: { items: NavItem[] }) {
  const pathname = usePathname()
  const scrollRef = useRef<HTMLDivElement>(null)
  const [edges, setEdges] = useState({ left: false, right: false })
  const [open, setOpen] = useState<{ key: string; el: HTMLElement; rect: DOMRect } | null>(null)

  const updateEdges = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    setEdges({
      left: el.scrollLeft > 1,
      right: el.scrollLeft + el.clientWidth < el.scrollWidth - 1,
    })
  }, [])

  // Lebar layar / jumlah menu berubah → cek ulang panah
  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    updateEdges()
    const observer = new ResizeObserver(updateEdges)
    observer.observe(el)
    if (el.firstElementChild) observer.observe(el.firstElementChild)
    return () => observer.disconnect()
  }, [items, updateEdges])

  // Dropdown dirender di body (strip ini overflow-x-auto jadi memotong isinya), tutup kalau klik di luar / resize / pindah halaman
  useEffect(() => {
    if (!open) return
    const close = () => setOpen(null)
    const onPointerDown = (e: PointerEvent) => {
      if (!(e.target as Element).closest('[data-nav-dropdown]')) close()
    }
    document.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('resize', close)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('resize', close)
    }
  }, [open])

  useEffect(() => setOpen(null), [pathname])

  const scroll = (dir: -1 | 1) => scrollRef.current?.scrollBy({ left: dir * SCROLL_STEP, behavior: 'smooth' })

  const openItem = open ? items.find((i) => i.key === open.key) : undefined

  return (
    <div className="relative min-w-0 flex-1">
      <div
        ref={scrollRef}
        onScroll={() => {
          updateEdges()
          // Dropdown ikut bergeser bersama tombolnya
          setOpen((o) => o && { ...o, rect: o.el.getBoundingClientRect() })
        }}
        className="no-scrollbar overflow-x-auto"
      >
        <div className="flex w-max items-center gap-1 px-12">
          {items.map((item) => {
            const hasChildren = !!item.children?.length
            const active = hasChildren
              ? item.children!.some((c) => isActivePath(pathname, c.path))
              : isActivePath(pathname, item.path)

            if (!hasChildren) {
              return (
                <Link key={item.key} href={item.path || '/dashboard'} className={itemClass(active)}>
                  {item.label}
                </Link>
              )
            }

            const isOpen = open?.key === item.key
            return (
              <button
                key={item.key}
                type="button"
                data-nav-dropdown
                aria-expanded={isOpen}
                onClick={(e) => {
                  if (isOpen) return setOpen(null)
                  const el = e.currentTarget
                  el.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'smooth' })
                  setOpen({ key: item.key, el, rect: el.getBoundingClientRect() })
                }}
                className={`${itemClass(active || isOpen)} cursor-pointer`}
              >
                {item.label}
                <ArrowDown01Icon size={16} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
              </button>
            )
          })}
        </div>
      </div>

      {edges.left && <EdgeArrow side="left" onClick={() => scroll(-1)} />}
      {edges.right && <EdgeArrow side="right" onClick={() => scroll(1)} />}

      {openItem && open && createPortal(
        <div
          data-nav-dropdown
          style={{ top: open.rect.bottom + 8, left: Math.min(open.rect.left, window.innerWidth - 208) }}
          className="fixed z-[60] w-48 overflow-hidden rounded-xl border bg-white py-1 shadow-lg dark:border-slate-700 dark:bg-slate-900"
        >
          {openItem.children!.map((child) => (
            <Link
              key={child.key}
              href={child.path || '/dashboard'}
              onClick={() => setOpen(null)}
              className={`block px-4 py-2 text-sm transition-colors ${isActivePath(pathname, child.path)
                ? 'bg-blue-50 font-medium text-blue-600 dark:bg-blue-500/15 dark:text-blue-300'
                : 'text-gray-700 hover:bg-gray-100 dark:text-slate-300 dark:hover:bg-slate-800'
              }`}
            >
              {child.label}
            </Link>
          ))}
        </div>,
        document.body,
      )}
    </div>
  )
}

function EdgeArrow({ side, onClick }: { side: 'left' | 'right'; onClick: () => void }) {
  const Icon = side === 'left' ? ArrowLeft01Icon : ArrowRight01Icon
  return (
    <div
      className={`pointer-events-none absolute inset-y-0 ${side === 'left' ? 'left-0 bg-gradient-to-r' : 'right-0 bg-gradient-to-l'} flex w-12 items-center justify-center from-background via-background/90 to-transparent`}
    >
      <button
        type="button"
        onClick={onClick}
        aria-label={side === 'left' ? 'Geser menu ke kiri' : 'Geser menu ke kanan'}
        className="pointer-events-auto flex h-8 w-8 items-center justify-center rounded-full border bg-white text-gray-600 shadow-sm transition hover:text-blue-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
      >
        <Icon size={16} />
      </button>
    </div>
  )
}
