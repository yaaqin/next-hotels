'use client'

import { useState } from 'react'
import { useSiteList } from '@/src/hooks/query/sites'
import { useRoomTypeList } from '@/src/hooks/query/roomTypes'
import { FaqLang, listingFaqCustomItem, listingFaqPayload } from '@/src/models/listingFaq'

interface FaqFormModalProps {
  faq: listingFaqCustomItem | null // null = buat baru
  isSaving: boolean
  onSave: (payload: listingFaqPayload) => void
  onClose: () => void
}

const LANGS: { code: FaqLang; label: string }[] = [
  { code: 'idn', label: 'Indonesia' },
  { code: 'eng', label: 'English' },
  { code: 'jpn', label: '日本語' },
  { code: 'chn', label: '中文' },
]

const inputClass =
  'w-full px-3 py-2 text-sm border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-500'

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <span className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">{children}</span>
}

type Texts = Record<FaqLang, { question: string; answer: string }>

export function FaqFormModal({ faq, isSaving, onSave, onClose }: FaqFormModalProps) {
  const { data: sites } = useSiteList()
  const { data: roomTypes } = useRoomTypeList()

  const [siteCode, setSiteCode] = useState(faq?.siteCode ?? '')
  const [roomTypeId, setRoomTypeId] = useState(faq?.roomTypeId ?? '')
  const [isActive, setIsActive] = useState(faq?.isActive ?? true)
  const [lang, setLang] = useState<FaqLang>('idn')
  const [texts, setTexts] = useState<Texts>(() => {
    const empty = { question: '', answer: '' }
    const init = { idn: { ...empty }, eng: { ...empty }, jpn: { ...empty }, chn: { ...empty } }
    for (const t of faq?.translations ?? []) init[t.lang] = { question: t.question, answer: t.answer }
    return init
  })

  const setText = (field: 'question' | 'answer', value: string) =>
    setTexts((prev) => ({ ...prev, [lang]: { ...prev[lang], [field]: value } }))

  // Bahasa lain boleh kosong (ikut Indonesia), tapi kalau diisi harus lengkap
  const errors: string[] = []
  if (!texts.idn.question.trim() || !texts.idn.answer.trim()) errors.push('Pertanyaan & jawaban bahasa Indonesia wajib diisi')
  for (const { code, label } of LANGS.slice(1)) {
    const { question, answer } = texts[code]
    if (!!question.trim() !== !!answer.trim()) errors.push(`${label}: isi pertanyaan dan jawaban, atau kosongkan keduanya`)
  }
  const isValid = errors.length === 0
  const filled = (code: FaqLang) => !!texts[code].question.trim() && !!texts[code].answer.trim()

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl z-10">
        <div className="px-6 pt-6 pb-4 border-b border-dashed border-gray-100 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-blue-400 inline-block" />
              <p className="text-xs tracking-widest uppercase text-gray-400">FAQ listing kamar</p>
            </div>
            <p className="text-base font-semibold text-gray-900">{faq ? 'Edit FAQ' : 'FAQ baru'}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition text-lg leading-none">
            ✕
          </button>
        </div>

        <form
          className="px-6 py-5 space-y-4"
          onSubmit={(e) => {
            e.preventDefault()
            if (!isValid) return
            onSave({
              siteCode: siteCode || null,
              roomTypeId: roomTypeId || null,
              isActive,
              translations: LANGS.filter(({ code }) => filled(code)).map(({ code }) => ({
                lang: code,
                question: texts[code].question.trim(),
                answer: texts[code].answer.trim(),
              })),
            })
          }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className="block">
              <FieldLabel>Cabang</FieldLabel>
              <select value={siteCode} onChange={(e) => setSiteCode(e.target.value)} className={inputClass}>
                <option value="">Semua cabang</option>
                {sites?.data.map((s) => (
                  <option key={s.sitecode} value={s.sitecode}>
                    {s.nama}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <FieldLabel>Tipe kamar</FieldLabel>
              <select value={roomTypeId} onChange={(e) => setRoomTypeId(e.target.value)} className={inputClass}>
                <option value="">Semua tipe kamar</option>
                {roomTypes?.data.map((rt) => (
                  <option key={rt.id} value={rt.id}>
                    {rt.name}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <p className="text-[11px] text-gray-500 -mt-2">
            FAQ cabang/tipe tertentu hanya tampil di halaman listing cabang/tipe itu (mis. /hotel/merak), tidak di
            halaman semua cabang.
          </p>

          <div>
            <div className="flex gap-1 border-b border-gray-200 mb-3">
              {LANGS.map(({ code, label }) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => setLang(code)}
                  className={`px-3 py-2 text-xs font-medium -mb-px border-b-2 transition-colors ${
                    lang === code ? 'border-blue-600 text-blue-700' : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {label}
                  {code === 'idn' && <span className="text-red-500"> *</span>}
                  {code !== 'idn' && filled(code) && <span className="ml-1 text-emerald-600">✓</span>}
                </button>
              ))}
            </div>
            {lang !== 'idn' && !filled(lang) && (
              <p className="text-[11px] text-gray-400 mb-2">Kosong = tampil dalam bahasa Indonesia.</p>
            )}
            <label className="block mb-3">
              <FieldLabel>Pertanyaan</FieldLabel>
              <input
                value={texts[lang].question}
                maxLength={300}
                onChange={(e) => setText('question', e.target.value)}
                placeholder={lang === 'idn' ? 'mis. Jam berapa check-in dan check-out?' : ''}
                className={inputClass}
              />
            </label>
            <label className="block">
              <FieldLabel>Jawaban</FieldLabel>
              <textarea
                value={texts[lang].answer}
                maxLength={3000}
                rows={5}
                onChange={(e) => setText('answer', e.target.value)}
                className={`${inputClass} resize-y`}
              />
            </label>
          </div>

          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
            Aktif (tampil di halaman listing)
          </label>

          {!isValid && (texts.idn.question || texts.idn.answer) && (
            <ul className="text-[11px] text-red-500 list-disc pl-4 space-y-0.5">
              {errors.map((err) => (
                <li key={err}>{err}</li>
              ))}
            </ul>
          )}

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-md text-sm text-gray-600 border border-gray-300 hover:bg-gray-50 transition"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={!isValid || isSaving}
              className="flex-[2] py-2.5 rounded-md text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {isSaving ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
