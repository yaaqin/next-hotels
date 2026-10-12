'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useId, useMemo, useRef, useState, useTransition } from 'react'
import type { ListingFacility, ListingSearchInfo } from '@/src/models/public/roomListing'

export interface ListingSearchLabels {
  placeholder: string
  submit: string
  clear: string
  searchText: string
  roomCount: string
  noSuggestion: string
  matched: string
  unmatched: string
  remove: string
}

const MAX_SUGGESTIONS = 8
// Jeda sebelum filter diterapkan — user bisa pilih/hapus beberapa fasilitas sekaligus
const APPLY_DELAY_MS = 1000

// Sama dengan tokenize BE: huruf/angka saja, lowercase, tanpa aksen
const tokenize = (text: string) =>
  text
    .normalize('NFKD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .split(/[^\p{L}\p{N}]+/u)
    .filter(Boolean)

const fill = (template: string, vars: Record<string, string | number>) =>
  template.replace(/\{\{\s*(\w+)\s*\}\}/g, (match, name) => (name in vars ? String(vars[name]) : match))

// Skor kecocokan ketikan dengan nama fasilitas (semua bahasa); 0 = tidak cocok
function matchScore(facility: ListingFacility, typed: string[]) {
  const compactTyped = typed.join('')
  let best = 0
  for (const keyword of facility.keywords) {
    const tokens = tokenize(keyword)
    const compact = tokens.join('')
    if (compact.startsWith(compactTyped)) best = Math.max(best, 3)
    // Tiap kata yang diketik = awalan salah satu kata nama: "jac" → "Private Jacuzzi"
    else if (typed.every((t) => tokens.some((k) => k.startsWith(t)))) best = Math.max(best, 2)
    // "citylight" → "City Light View"
    else if (compact.includes(compactTyped)) best = Math.max(best, 1)
  }
  return best
}

type Option = { kind: 'facility'; facility: ListingFacility } | { kind: 'text'; text: string }

// Pencarian fasilitas di RLP. Sama seperti ListingFilters, cuma mengubah query string:
// ?facilities=KODE,KODE (pilihan autocomplete) dan ?q=teks bebas (ditafsirkan BE).
export default function ListingSearch({
  facilities,
  search,
  labels,
  maxFacilities,
}: {
  facilities: ListingFacility[]
  search: ListingSearchInfo | null
  labels: ListingSearchLabels
  maxFacilities: number
}) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  const listboxId = useId()
  const scrollRef = useRef<HTMLDivElement>(null)

  const [text, setText] = useState('')
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(0)

  const urlCodes = (searchParams.get('facilities') ?? '').split(',').filter(Boolean)
  const query = searchParams.get('q')

  // Pilihan yang belum diterapkan ke URL (masih menunggu jeda); null = ikut URL
  const [draftCodes, setDraftCodes] = useState<string[] | null>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const selectedCodes = draftCodes ?? urlCodes

  // URL berubah (filter diterapkan / navigasi lain) → chip kembali ikut URL
  useEffect(() => {
    if (!timerRef.current) setDraftCodes(null)
  }, [searchParams])
  useEffect(() => () => clearTimeout(timerRef.current ?? undefined), [])

  // Chip baru → geser ke ujung kanan supaya input tetap kelihatan
  const chipKey = `${selectedCodes.join(',')}|${query ?? ''}`
  useEffect(() => {
    const el = scrollRef.current
    if (el) el.scrollTo({ left: el.scrollWidth, behavior: 'smooth' })
  }, [chipKey])

  const nameByCode = useMemo(() => {
    const map = new Map(search?.facilities.map((f) => [f.code, f.name]))
    for (const f of facilities) map.set(f.code, f.name)
    return map
  }, [facilities, search])

  const options = useMemo<Option[]>(() => {
    const typed = tokenize(text)
    const available = facilities.filter((f) => !selectedCodes.includes(f.code))
    const matches = typed.length
      ? available
          .map((facility) => ({ facility, score: matchScore(facility, typed) }))
          .filter((m) => m.score > 0)
          .sort((a, b) => b.score - a.score || b.facility.roomCount - a.facility.roomCount)
          .map((m) => m.facility)
      : available
    const facilityOptions: Option[] = (selectedCodes.length < maxFacilities ? matches : [])
      .slice(0, typed.length ? MAX_SUGGESTIONS : undefined)
      .map((facility) => ({ kind: 'facility', facility }))
    return text.trim() ? [...facilityOptions, { kind: 'text', text: text.trim() }] : facilityOptions
    // selectedCodes diturunkan dari searchParams & draftCodes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, facilities, searchParams, draftCodes, maxFacilities])

  // Menunggu jeda atau sedang memuat hasil → ikon berputar
  const applying = isPending || draftCodes !== null

  const codesParam = (codes: string[]) => (codes.length ? codes.join(',') : null)

  // Pilihan fasilitas yang masih menunggu ikut diterapkan bersama perubahan lain
  const push = (patch: Record<string, string | null>) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
      if (draftCodes && !('facilities' in patch)) patch = { facilities: codesParam(draftCodes), ...patch }
    }
    // Chip tetap menampilkan tujuan sampai URL baru masuk
    if ('facilities' in patch) setDraftCodes(patch.facilities?.split(',') ?? [])
    // URL terkini, bukan searchParams render lama — filter tanggal/sort bisa berubah selama jeda
    const params = new URLSearchParams(window.location.search)
    for (const [key, value] of Object.entries(patch)) {
      if (value) params.set(key, value)
      else params.delete(key)
    }
    params.delete('page')
    const qs = params.toString()
    // Mis. pilih lalu batal dalam jeda yang sama → URL tidak berubah, tidak perlu fetch ulang
    if (qs === new URLSearchParams(window.location.search).toString()) {
      setDraftCodes(null)
      return
    }
    startTransition(() => router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false }))
  }

  // Chip langsung berubah, URL (fetch ulang) baru setelah user berhenti memilih
  const setCodes = (codes: string[]) => {
    setDraftCodes(codes)
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      timerRef.current = null
      push({ facilities: codesParam(codes) })
    }, APPLY_DELAY_MS)
  }

  const choose = (option: Option | undefined) => {
    if (!option) return
    if (option.kind === 'facility') setCodes([...selectedCodes, option.facility.code])
    else push({ q: option.text })
    setText('')
    setActive(0)
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault()
      setOpen(true)
      if (!options.length) return
      setActive((i) => (i + (e.key === 'ArrowDown' ? 1 : options.length - 1)) % options.length)
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (open) choose(options[active])
      else if (text.trim()) choose({ kind: 'text', text: text.trim() })
    } else if (e.key === 'Escape') {
      setOpen(false)
    } else if (e.key === 'Backspace' && !text && selectedCodes.length) {
      setCodes(selectedCodes.slice(0, -1))
    }
  }

  const hasSearch = selectedCodes.length > 0 || !!query
  const matchedNames = search?.terms.flatMap((t) => t.facilities.map((f) => f.name)) ?? []

  return (
    <div className="space-y-2">
      <div
        aria-busy={applying}
        className="relative bg-white border border-[#DCE6F2] rounded-2xl p-2 flex items-center gap-2"
      >
        {/* Loading cukup ikon yang berputar — dropdown tetap solid */}
        {applying ? (
          <svg
            aria-hidden
            className="ml-2 h-4 w-4 shrink-0 text-[#6A9EC5] animate-spin"
            viewBox="0 0 20 20"
            fill="none"
          >
            <circle cx="10" cy="10" r="7" stroke="currentColor" strokeOpacity="0.25" strokeWidth="2" />
            <path d="M17 10a7 7 0 0 0-7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        ) : (
          <svg aria-hidden className="ml-2 h-4 w-4 shrink-0 text-[#6A9EC5]" viewBox="0 0 20 20" fill="none">
            <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="2" />
            <path d="m14 14 4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        )}

        {/* Chip + input satu baris, geser horizontal; tombol di kanan tetap diam */}
        <div ref={scrollRef} className="flex-1 min-w-0 flex items-center gap-2 overflow-x-auto no-scrollbar">
          {selectedCodes.map((code) => (
            <Chip
              key={code}
              label={nameByCode.get(code) ?? code}
              removeLabel={labels.remove}
              onRemove={() => setCodes(selectedCodes.filter((c) => c !== code))}
            />
          ))}
          {query && <Chip label={`“${query}”`} removeLabel={labels.remove} onRemove={() => push({ q: null })} />}

          <input
            type="text"
            role="combobox"
            aria-expanded={open}
            aria-controls={listboxId}
            aria-autocomplete="list"
            aria-activedescendant={open && options[active] ? `${listboxId}-${active}` : undefined}
            value={text}
            maxLength={100}
            placeholder={labels.placeholder}
            onChange={(e) => {
              setText(e.target.value)
              setActive(0)
              setOpen(true)
            }}
            onFocus={() => setOpen(true)}
            onBlur={() => setOpen(false)}
            onKeyDown={onKeyDown}
            className="flex-1 min-w-[12rem] px-2 py-2 text-sm text-[#05111F] placeholder:text-gray-400 bg-transparent outline-none"
          />
        </div>

        {hasSearch && (
          <button
            type="button"
            onClick={() => push({ facilities: null, q: null })}
            className="shrink-0 whitespace-nowrap px-2 text-xs text-gray-500 underline"
          >
            {labels.clear}
          </button>
        )}
        <button
          type="button"
          disabled={!text.trim()}
          onClick={() => choose({ kind: 'text', text: text.trim() })}
          className="shrink-0 px-5 py-2.5 rounded-xl text-xs font-semibold tracking-wide text-white bg-[#0A1828] hover:bg-[#163356] disabled:opacity-40 transition-colors"
        >
          {labels.submit}
        </button>

        {open && (options.length > 0 || text.trim()) && (
          <ul
            id={listboxId}
            role="listbox"
            className="absolute left-0 right-0 top-full mt-2 z-20 max-h-72 overflow-auto bg-white border border-[#DCE6F2] rounded-2xl shadow-lg py-2"
          >
            {options.map((option, i) => (
              <li
                key={option.kind === 'facility' ? option.facility.code : 'text'}
                id={`${listboxId}-${i}`}
                role="option"
                aria-selected={i === active}
                // mouseDown supaya jalan sebelum input blur menutup dropdown
                onMouseDown={(e) => {
                  e.preventDefault()
                  choose(option)
                }}
                onMouseEnter={() => setActive(i)}
                className={`px-4 py-2 cursor-pointer flex items-center justify-between gap-3 text-sm ${
                  i === active ? 'bg-[#EEF3FA]' : ''
                } ${option.kind === 'text' ? 'border-t border-[#EEF3FA] text-[#163356]' : 'text-[#05111F]'}`}
              >
                {option.kind === 'facility' ? (
                  <>
                    <span>
                      {option.facility.name}
                      {option.facility.typeName && (
                        <span className="ml-2 text-xs text-gray-400">{option.facility.typeName}</span>
                      )}
                    </span>
                    <span className="text-xs text-gray-400 shrink-0">
                      {fill(labels.roomCount, {
                        count: option.facility.roomCount,
                      })}
                    </span>
                  </>
                ) : (
                  <span>{fill(labels.searchText, { text: option.text })}</span>
                )}
              </li>
            ))}
            {options.length === 1 && options[0].kind === 'text' && (
              <li className="px-4 pt-1 text-xs text-gray-400">{labels.noSuggestion}</li>
            )}
          </ul>
        )}
      </div>

      {/* Tafsiran teks bebas: fasilitas yang dicari & kata yang diabaikan */}
      {query && search && (
        <p className="px-2 text-xs text-gray-500">
          {matchedNames.length > 0 && (
            <span>
              {labels.matched}: <span className="text-[#163356] font-medium">{matchedNames.join(', ')}</span>
            </span>
          )}
          {matchedNames.length > 0 && search.unmatched.length > 0 && ' · '}
          {search.unmatched.length > 0 && (
            <span>
              {labels.unmatched}: {search.unmatched.join(', ')}
            </span>
          )}
        </p>
      )}
    </div>
  )
}

function Chip({ label, removeLabel, onRemove }: { label: string; removeLabel: string; onRemove: () => void }) {
  return (
    <span className="shrink-0 whitespace-nowrap inline-flex items-center gap-1 rounded-full bg-[#EEF3FA] border border-[#DCE6F2] pl-3 pr-1 py-1 text-xs font-medium text-[#163356]">
      {label}
      <button
        type="button"
        aria-label={`${removeLabel} ${label}`}
        onClick={onRemove}
        className="h-5 w-5 rounded-full grid place-items-center text-gray-500 hover:bg-white hover:text-[#05111F]"
      >
        ×
      </button>
    </span>
  )
}
