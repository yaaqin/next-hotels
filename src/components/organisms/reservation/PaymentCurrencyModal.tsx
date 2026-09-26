'use client'

import { useTranslation } from 'react-i18next'
import { DisplayPricing } from '@/src/models/public/currency'
import { useCurrentLanguage } from '@/src/hooks/useCurrentLanguage'
import { LANG_LOCALE } from '@/src/utils/currencyCookie'
import { formatMoney, formatRate, formatRateDate } from '@/src/utils/money'

interface PaymentCurrencyModalProps {
  // Harga dalam mata uang pilihan user — dihitung BE
  display: DisplayPricing
  // Nominal IDR yang benar-benar ditagih
  totalIdr: number
  methodLabel: string
  onConfirm: () => void
  onCancel: () => void
}

// Muncul sebelum bayar kalau user melihat harga non-IDR tapi metode bayarnya menagih IDR
export function PaymentCurrencyModal({ display, totalIdr, methodLabel, onConfirm, onCancel }: PaymentCurrencyModalProps) {
  const { t } = useTranslation()
  const locale = LANG_LOCALE[useCurrentLanguage()]
  const shown = formatMoney(display.totalPrice ?? display.price, display.currency, locale, display.decimals)
  const pay = formatMoney(totalIdr, 'IDR', locale)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden z-10">
        <div className="px-6 pt-6 pb-4 border-b border-dashed border-gray-100 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-blue-400 inline-block" />
              <p className="text-xs tracking-widest uppercase text-gray-400">{methodLabel}</p>
            </div>
            <p className="text-base font-semibold text-gray-900">{t('currency.modalTitle')}</p>
          </div>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-600 transition text-lg leading-none">
            ✕
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">
          <p className="text-sm text-gray-600 leading-relaxed">
            {t('currency.modalBody', { currency: display.currency, method: methodLabel })}
          </p>

          <div className="bg-gray-50 rounded-xl px-4 py-3 space-y-2 text-sm">
            <div className="flex justify-between gap-4">
              <span className="text-gray-500">{t('currency.modalShown')}</span>
              <span className="text-gray-900">≈ {shown}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-gray-500">{t('currency.modalRate')}</span>
              <span className="text-gray-900 text-right">
                {formatRate(display.currency, display.rate)}
                <span className="block text-[11px] text-gray-400">{formatRateDate(display.rateAt, locale)}</span>
              </span>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 flex justify-between items-center">
            <span className="text-xs tracking-widest uppercase text-blue-600">{t('currency.modalPay')}</span>
            <span className="text-lg font-bold text-gray-900">{pay}</span>
          </div>
        </div>

        <div className="px-6 pb-6 flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-3 rounded-xl text-sm text-gray-600 border border-gray-200 hover:bg-gray-50 transition"
          >
            {t('currency.modalCancel')}
          </button>
          <button
            data-cy="btn-confirm-currency"
            onClick={onConfirm}
            className="flex-[2] py-3 rounded-xl text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 shadow-md shadow-blue-100 transition"
          >
            {t('currency.modalConfirm', { amount: pay })}
          </button>
        </div>
      </div>
    </div>
  )
}
