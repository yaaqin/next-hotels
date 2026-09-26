'use client'
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import idn from './locales/idn.json'
import eng from './locales/eng.json'
import jpn from './locales/jpn.json'
import chn from './locales/chn.json'
import { DEFAULT_LANG, readLanguageCookie } from '../utils/languageCookie'

// Render pertama di browser harus pakai bahasa yang sama dengan server (cookie),
// kalau tidak React gagal hidrasi. Migrasi dari localStorage ada di I18nProvider.
const savedLang = readLanguageCookie() ?? DEFAULT_LANG

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