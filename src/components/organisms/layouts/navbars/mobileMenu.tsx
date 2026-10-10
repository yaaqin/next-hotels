'use client'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowDown01Icon, Cancel01Icon, Logout01Icon, Settings02Icon } from 'hugeicons-react'
import { useMenuList } from '@/src/hooks/query/menu/list'
import { useMe } from '@/src/hooks/query/auth/me'
import { logout } from '@/src/libs/auth'
import { isSystemRole } from '@/src/constans/config'
import { NavItem } from '@/src/constans/menu/navbar'
import { useActiveSidebar, useNavigation, useNavigationStore } from '@/src/stores/layouts/useNavigationStore'
import { sidebarMap } from '@/src/utils/menu'
import { SidebarIcon } from '../sidebars'
import { isActivePath } from './navScroller'

interface Props {
  open: boolean
  onClose: () => void
}

// Pengganti sidebar + menu atas di layar kecil: daftar section, section aktif terbuka berisi sub-menunya
export default function MobileMenu({ open, onClose }: Props) {
  const pathname = usePathname()
  const navigation = useNavigation()
  const activeSidebar = useActiveSidebar()
  const { setActiveSidebar } = useNavigationStore()
  const { data: menus } = useMenuList()
  const { data: me } = useMe()
  const sections = menus ? sidebarMap(menus.data) : []

  // Section yang sedang dibuka di menu (default: section halaman ini)
  const [expanded, setExpanded] = useState<string | null>(null)
  const expandedKey = expanded ?? activeSidebar

  const linkClass = (active: boolean) =>
    `block rounded-lg px-3 py-2 text-sm transition-colors ${active
      ? 'bg-blue-50 font-medium text-blue-600 dark:bg-blue-500/15 dark:text-blue-300'
      : 'text-gray-600 hover:bg-gray-100 dark:text-slate-300 dark:hover:bg-slate-800'
    }`

  const renderItems = (items: NavItem[]) =>
    items.map((item) =>
      item.children?.length ? (
        <div key={item.key}>
          <p className="px-3 pt-3 pb-1 text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-slate-500">{item.label}</p>
          {item.children.map((child) => (
            <Link key={child.key} href={child.path || '/dashboard'} onClick={onClose} className={linkClass(isActivePath(pathname, child.path))}>
              {child.label}
            </Link>
          ))}
        </div>
      ) : (
        <Link key={item.key} href={item.path || '/dashboard'} onClick={onClose} className={linkClass(isActivePath(pathname, item.path))}>
          {item.label}
        </Link>
      ),
    )

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[80] lg:hidden">
          <motion.div
            className="absolute inset-0 bg-black/40"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <motion.nav
            className="absolute inset-y-0 right-0 flex w-[85%] max-w-xs flex-col bg-white shadow-2xl dark:bg-slate-900"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 34 }}
          >
            <div className="flex items-center justify-between px-5 py-4">
              <p className="text-lg font-semibold text-gray-800 dark:text-slate-100">Menu</p>
              <button type="button" onClick={onClose} aria-label="Tutup menu" className="rounded-full p-2 text-gray-500 hover:bg-gray-100 dark:text-slate-400 dark:hover:bg-slate-800">
                <Cancel01Icon size={20} />
              </button>
            </div>

            <div className="flex-1 space-y-1 overflow-y-auto px-3 pb-4">
              {sections.map((section) => {
                const code = section.code?.toLowerCase() ?? ''
                const isExpanded = code === expandedKey
                const items = navigation.find((n) => n.key === code)?.children ?? []
                return (
                  <div key={section.id}>
                    <div className={`flex items-center rounded-xl ${code === activeSidebar ? 'bg-blue-400 text-white' : 'text-gray-700 dark:text-slate-200'}`}>
                      <Link
                        href={section.path}
                        onClick={() => {
                          setActiveSidebar(code)
                          setExpanded(code)
                          if (!items.length) onClose()
                        }}
                        className="flex flex-1 items-center gap-3 px-3 py-2.5 text-sm font-semibold"
                      >
                        <SidebarIcon code={section.code} size={20} />
                        {section.name}
                      </Link>
                      {items.length > 0 && (
                        <button
                          type="button"
                          onClick={() => setExpanded(isExpanded ? '' : code)}
                          aria-label={isExpanded ? 'Tutup sub-menu' : 'Buka sub-menu'}
                          aria-expanded={isExpanded}
                          className="p-3"
                        >
                          <ArrowDown01Icon size={16} className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                        </button>
                      )}
                    </div>
                    {isExpanded && items.length > 0 && (
                      <div className="ml-5 mt-1 border-l border-gray-200 pl-2 dark:border-slate-700">{renderItems(items)}</div>
                    )}
                  </div>
                )
              })}
            </div>

            <div className="space-y-1 border-t px-3 py-3 dark:border-slate-700">
              {isSystemRole(me?.data?.role?.name) && (
                <Link href="/config-panel" onClick={onClose} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-slate-200 dark:hover:bg-slate-800">
                  <Settings02Icon size={20} />
                  Config Panel
                </Link>
              )}
              <button type="button" onClick={logout} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40">
                <Logout01Icon size={20} />
                Exit
              </button>
            </div>
          </motion.nav>
        </div>
      )}
    </AnimatePresence>
  )
}
