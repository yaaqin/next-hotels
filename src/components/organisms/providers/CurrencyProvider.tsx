'use client'

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'
import { useCurrentLanguage } from '@/src/hooks/useCurrentLanguage'
import {
  LANG_CURRENCY,
  readCurrencyCookie,
  setCurrencyCookie,
  type SupportedCurrency,
} from '@/src/utils/currencyCookie'

type CurrencyContextValue = {
  currency: SupportedCurrency
  setCurrency: (currency: SupportedCurrency) => void
}

const CurrencyContext = createContext<CurrencyContextValue | null>(null)

export default function CurrencyProvider({
  children,
  currency: initialCurrency,
}: {
  children: ReactNode
  // Dihitung root layout di server dari cookie — nilai awal server & browser sama
  currency: SupportedCurrency
}) {
  const [currency, setCurrencyState] = useState(initialCurrency)
  const language = useCurrentLanguage()

  // Belum pernah pilih mata uang sendiri → ikut bahasa (idn→IDR, eng→USD, ...)
  useEffect(() => {
    if (!readCurrencyCookie()) setCurrencyState(LANG_CURRENCY[language])
  }, [language])

  const setCurrency = useCallback((next: SupportedCurrency) => {
    setCurrencyCookie(next)
    setCurrencyState(next)
  }, [])

  return <CurrencyContext.Provider value={{ currency, setCurrency }}>{children}</CurrencyContext.Provider>
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext)
  if (!ctx) throw new Error('useCurrency harus dipakai di dalam CurrencyProvider')
  return ctx
}
