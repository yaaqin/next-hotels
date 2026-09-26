// Blok `display` dari BE: harga dalam mata uang pilihan user (x-currency).
// Angka IDR di field pricing lain tetap nominal yang ditagih.
export interface DisplayPricing {
  currency: string
  symbol: string
  decimals: number
  rate: number // IDR per 1 unit mata uang
  rateAt: string
  price: number
  totalPrice: number | null
  originalPrice: number | null
  originalTotalPrice: number | null
}
