import { useTranslation } from 'react-i18next'
import { useCurrentLanguage } from '@/src/hooks/useCurrentLanguage'
import { LANG_LOCALE } from '@/src/utils/currencyCookie'
import type { PriceTagLabels } from '@/src/components/molecules/priceTag'

// Locale + label tooltip PriceTag untuk client component
export function usePriceTagConfig(): { locale: string; labels: PriceTagLabels } {
  const { t } = useTranslation()
  const lang = useCurrentLanguage()
  return {
    locale: LANG_LOCALE[lang],
    labels: {
      original: t('currency.original'),
      rate: t('currency.rate'),
      updated: t('currency.updated'),
      hint: t('currency.approxHint'),
    },
  }
}
