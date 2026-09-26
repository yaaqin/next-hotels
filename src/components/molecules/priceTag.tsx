import type { ReactNode } from 'react'
import { DisplayPricing } from '@/src/models/public/currency'
import { formatMoney, formatRate, formatRateDate } from '@/src/utils/money'
import { cn } from '@/lib/utils'

// Harga global: tampil dalam mata uang pilihan user, hover/tap → detail konversi.
// Tanpa hook & tooltip murni CSS, jadi bisa dipakai di server component (RLP) maupun client.

export interface PriceTagLabels {
  original: string
  rate: string
  updated: string
  hint: string
}

type PriceField = 'price' | 'totalPrice' | 'originalPrice' | 'originalTotalPrice'

interface PriceTagProps {
  // Blok display dari BE; kosong / IDR → tampil Rupiah biasa tanpa tooltip
  display?: DisplayPricing | null
  field?: PriceField
  // Nominal IDR untuk field yang sama (yang benar-benar ditagih)
  amountIdr: number
  locale: string
  labels: PriceTagLabels
  suffix?: ReactNode
  className?: string
  // Sisi tooltip — "right" untuk harga yang ada di pinggir kanan
  align?: 'left' | 'right'
}

export function PriceTag({
  display,
  field = 'price',
  amountIdr,
  locale,
  labels,
  suffix,
  className,
  align = 'left',
}: PriceTagProps) {
  const converted = display ? display[field] : null

  if (!display || display.currency === 'IDR' || converted == null) {
    return (
      <span className={className}>
        {formatMoney(amountIdr, 'IDR', locale)}
        {suffix}
      </span>
    )
  }

  return (
    <span className="group relative inline-flex outline-none" tabIndex={0}>
      <span className={cn('cursor-help underline decoration-dotted decoration-1 underline-offset-4', className)}>
        ≈ {formatMoney(converted, display.currency, locale, display.decimals)}
        {suffix}
      </span>

      <span
        role="tooltip"
        className={cn(
          'pointer-events-none absolute bottom-full z-40 mb-2 hidden w-max max-w-[16rem] rounded-xl bg-[#0A1828] px-3.5 py-3 text-left text-[11px] font-normal normal-case tracking-normal text-[#C8DCEF] shadow-xl',
          'group-hover:block group-focus-within:block',
          align === 'right' ? 'right-0' : 'left-0',
        )}
      >
        <span className="grid grid-cols-[auto_auto] gap-x-4 gap-y-1">
          <span className="text-[#6A9EC5]">{labels.original}</span>
          <span className="text-right font-semibold text-white">{formatMoney(amountIdr, 'IDR', locale)}</span>
          <span className="text-[#6A9EC5]">{labels.rate}</span>
          <span className="text-right">{formatRate(display.currency, display.rate)}</span>
          <span className="text-[#6A9EC5]">{labels.updated}</span>
          <span className="text-right">{formatRateDate(display.rateAt, locale)}</span>
        </span>
        <span className="mt-2 block border-t border-white/10 pt-2 text-[10px] text-[#6A9EC5]">{labels.hint}</span>
      </span>
    </span>
  )
}
