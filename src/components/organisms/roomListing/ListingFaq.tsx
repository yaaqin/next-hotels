import type { FaqItem } from '@/src/app/(publicAccess)/(publicDashboard2)/hotel/faq.helper'

// FAQ RLP — <details> native: jawaban ada di HTML (terbaca crawler) & bisa dibuka tanpa JS
export default function ListingFaq({ title, items }: { title: string; items: FaqItem[] }) {
  if (!items.length) return null

  return (
    <section aria-labelledby="listing-faq" className="space-y-4">
      <h2 id="listing-faq" className="text-lg md:text-xl font-semibold text-[#05111F]">
        {title}
      </h2>
      <div className="bg-white border border-[#DCE6F2] rounded-2xl divide-y divide-[#EEF3FA]">
        {items.map((item, i) => (
          <details key={item.question} className="group" open={i === 0}>
            <summary className="flex items-center justify-between gap-4 px-5 py-4 cursor-pointer list-none [&::-webkit-details-marker]:hidden text-sm md:text-base font-medium text-[#05111F] hover:text-[#1A56A0] transition-colors">
              {item.question}
              <svg
                aria-hidden
                viewBox="0 0 20 20"
                className="h-4 w-4 shrink-0 text-[#5B90C9] transition-transform group-open:rotate-180"
                fill="none"
              >
                <path d="m5 8 5 5 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </summary>
            <p className="px-5 pb-5 -mt-1 text-sm leading-relaxed text-[#2C4E72]">{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  )
}
