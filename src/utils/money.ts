// Format uang & tanggal kurs — deterministik (locale + zona waktu eksplisit) supaya
// hasil render server dan browser sama.

export function formatMoney(amount: number, currency: string, locale: string, decimals?: number) {
  // Rupiah selalu gaya Indonesia: "Rp 892.500"
  const useLocale = currency === 'IDR' ? 'id-ID' : locale
  const digits = decimals ?? (currency === 'IDR' || currency === 'JPY' ? 0 : 2)
  return new Intl.NumberFormat(useLocale, {
    style: 'currency',
    currency,
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount)
}

// "1 USD = Rp 17.913,90"
export function formatRate(currency: string, idrPerUnit: number) {
  return `1 ${currency} = ${formatMoney(idrPerUnit, 'IDR', 'id-ID', 2)}`
}

export function formatRateDate(iso: string | Date, locale: string) {
  return new Intl.DateTimeFormat(locale, { dateStyle: 'medium', timeZone: 'Asia/Jakarta' }).format(new Date(iso))
}
