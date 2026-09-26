import idn from './locales/idn.json'
import eng from './locales/eng.json'
import jpn from './locales/jpn.json'
import chn from './locales/chn.json'

// Translator untuk server component (SSR). react-i18next hanya jalan di client dan
// bahasanya dari localStorage, jadi di server bahasa dari cookie + file locale yang sama.

const RESOURCES: Record<string, unknown> = { idn, eng, jpn, chn }
const FALLBACK = 'idn'

type Vars = Record<string, string | number>

function lookup(resource: unknown, key: string): string | undefined {
  const value = key
    .split('.')
    .reduce<unknown>((node, part) => (node && typeof node === 'object' ? (node as Record<string, unknown>)[part] : undefined), resource)
  return typeof value === 'string' ? value : undefined
}

// Interpolasi gaya i18next: "{{count}} malam"
function interpolate(template: string, vars?: Vars) {
  if (!vars) return template
  return template.replace(/\{\{\s*(\w+)\s*\}\}/g, (match, name) => (name in vars ? String(vars[name]) : match))
}

export function getServerT(lang: string) {
  const resource = RESOURCES[lang] ?? RESOURCES[FALLBACK]
  return (key: string, vars?: Vars) =>
    interpolate(lookup(resource, key) ?? lookup(RESOURCES[FALLBACK], key) ?? key, vars)
}

export type ServerT = ReturnType<typeof getServerT>
