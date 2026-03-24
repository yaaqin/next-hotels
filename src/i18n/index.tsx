'use client'
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import idn from './locales/idn.json'
import eng from './locales/eng.json'
import jpn from './locales/jpn.json'
import chn from './locales/chn.json'

const savedLang =
  typeof window !== 'undefined'
    ? (localStorage.getItem('language') ?? 'idn')
    : 'idn'

i18n.use(initReactI18next).init({
  resources: {
    idn: { translation: idn },
    eng: { translation: eng },
    jpn: { translation: jpn },
    chn: { translation: chn },
  },
  lng: savedLang,
  fallbackLng: 'idn',
  interpolation: { escapeValue: false },
})

export default i18n