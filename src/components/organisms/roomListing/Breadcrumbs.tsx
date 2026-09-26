import Link from 'next/link'
import { Crumb } from '@/src/models/public/roomListing'
import { ServerT } from '@/src/i18n/server'

export default function Breadcrumbs({ items, t }: { items: Crumb[]; t: ServerT }) {
  return (
    <nav aria-label="Breadcrumb" className="text-xs text-[#6A9EC5]">
      <ol className="flex flex-wrap items-center gap-1.5">
        <li>
          <Link href="/" className="hover:text-[#C8DCEF] transition-colors">{t('roomListing.home')}</Link>
        </li>
        {items.map((crumb, i) => {
          const isLast = i === items.length - 1
          return (
            <li key={crumb.path} className="flex items-center gap-1.5">
              <span className="opacity-50">›</span>
              {isLast ? (
                <span aria-current="page" className="text-[#C8DCEF]">{crumb.label}</span>
              ) : (
                <Link href={crumb.path} className="hover:text-[#C8DCEF] transition-colors">{crumb.label}</Link>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
