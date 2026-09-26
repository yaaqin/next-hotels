import { useTranslation } from 'react-i18next'
import { toSupportedLang } from '@/src/utils/languageCookie'

// Bahasa aktif untuk DITAMPILKAN (label dropdown, dll). Dibaca dari instance i18n di context:
// di server = instance per request (bahasa cookie), di browser = instance global (juga dari cookie),
// jadi hasil render server & browser sama. Untuk MENGGANTI bahasa tetap pakai useLanguageStore.
export function useCurrentLanguage() {
  const { i18n } = useTranslation()
  return toSupportedLang(i18n.language)
}
