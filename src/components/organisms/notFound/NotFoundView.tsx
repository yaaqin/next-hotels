import { cookies } from 'next/headers'
import { getServerT } from '@/src/i18n/server'
import { LANGUAGE_COOKIE, toSupportedLang } from '@/src/utils/languageCookie'
import NotFoundContent from './NotFoundContent'

// Halaman 404 bersama: URL tidak dikenal (root) & notFound() di halaman public.
// Teks dari cookie bahasa supaya SSR & hidrasi sama; varian (umum / berita) dipilih di client.
export default async function NotFoundView() {
  const cookieStore = await cookies()
  const t = getServerT(toSupportedLang(cookieStore.get(LANGUAGE_COOKIE)?.value))
  const variant = (key: 'general' | 'news') => ({
    title: t(`notFound.${key}.title`),
    description: t(`notFound.${key}.description`),
    cta: t(`notFound.${key}.cta`),
  })

  return (
    <div
      className="min-h-[80vh] bg-[#EEF3FA] px-4 py-12 flex items-center justify-center"
      style={{ fontFamily: "'Montserrat', sans-serif" }}
    >
      <NotFoundContent eyebrow={t('notFound.eyebrow')} general={variant('general')} news={variant('news')} />
    </div>
  )
}
