import type { SupportedCurrency } from '@/src/utils/currencyCookie'

// Pilihan mata uang tampilan (urutan sama dengan sortOrder di BE)
export const CURRENCY_OPTIONS: { value: SupportedCurrency; symbol: string }[] = [
  { value: 'IDR', symbol: 'Rp' },
  { value: 'USD', symbol: '$' },
  { value: 'SGD', symbol: 'S$' },
  { value: 'JPY', symbol: '¥' },
  { value: 'CNY', symbol: '¥' },
]
