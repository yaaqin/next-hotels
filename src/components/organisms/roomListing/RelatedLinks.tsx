import Link from 'next/link'
import { ListingLink } from '@/src/models/public/roomListing'
import { ServerT } from '@/src/i18n/server'
import { linkDisplayLabel } from '@/src/app/(publicAccess)/(publicDashboard2)/hotel/hotel.helper'

// Internal link antar halaman RLP — semuanya path resmi yang bisa diindex
export default function RelatedLinks({ title, links, t }: { title: string; links: ListingLink[]; t: ServerT }) {
  if (links.length === 0) return null

  return (
    <section className="space-y-3">
      <h2 className="text-xs font-semibold tracking-widest uppercase text-[#5B90C9]">{title}</h2>
      <ul className="flex flex-wrap gap-2">
        {links.map((link) => (
          <li key={link.path}>
            <Link
              href={link.path}
              className="inline-block px-3.5 py-2 rounded-full text-sm bg-white border border-[#DCE6F2] text-[#05111F] hover:border-[#1A56A0] transition-colors"
            >
              {linkDisplayLabel(link, t)}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
