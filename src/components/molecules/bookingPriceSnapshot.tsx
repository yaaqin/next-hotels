'use client'

import { useTranslation } from 'react-i18next'
import { useCurrentLanguage } from '@/src/hooks/useCurrentLanguage'
import { LANG_LOCALE } from '@/src/utils/currencyCookie'
import { formatMoney, formatRate, formatRateDate } from '@/src/utils/money'
import { cn } from '@/lib/utils'

// Snapshot mata uang & kurs yang dilihat user saat booking dibuat.
// Transaksi lama (sebelum fitur mata uang) tidak punya snapshot → "–".
export interface BookingDisplaySnapshot {
  displayCurrency?: string | null
  displayAmount?: number | null
  rateSnapshot?: number | null
  rateAt?: string | null
}

export function BookingPriceSnapshot({ snapshot, className }: { snapshot: BookingDisplaySnapshot; className?: string }) {
  const { t } = useTranslation()
  const locale = LANG_LOCALE[useCurrentLanguage()]
  const { displayCurrency, displayAmount, rateSnapshot, rateAt } = snapshot

  const hasPrice = !!displayCurrency && displayAmount != null
  // Kurs IDR → IDR selalu 1, tidak informatif
  const hasRate = hasPrice && displayCurrency !== 'IDR' && rateSnapshot != null

  return (
    <div className={cn('grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-[11px]', className)}>
      <span className="text-gray-400">{t('currency.snapshotTitle')}</span>
      <span className="text-right text-gray-700">
        {hasPrice
          ? `${displayCurrency === 'IDR' ? '' : '≈ '}${formatMoney(displayAmount!, displayCurrency!, locale)}`
          : '–'}
      </span>
      <span className="text-gray-400">{t('currency.snapshotRate')}</span>
      <span className="text-right text-gray-700">
        {hasRate ? (
          <>
            {formatRate(displayCurrency!, rateSnapshot!)}
            {rateAt && <span className="text-gray-400"> · {formatRateDate(rateAt, locale)}</span>}
          </>
        ) : (
          '–'
        )}
      </span>
    </div>
  )
}
