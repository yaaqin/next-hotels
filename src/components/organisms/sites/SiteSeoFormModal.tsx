'use client'

import { useState } from 'react'
import { siteListState, siteSeoPayload } from '@/src/models/sites/list'

interface SiteSeoFormModalProps {
  site: siteListState
  isSaving: boolean
  onSave: (payload: siteSeoPayload) => void
  onClose: () => void
}

const inputClass =
  'w-full px-3 py-2 text-sm border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-500'

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <span className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">{children}</span>
}

const toSlug = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

export function SiteSeoFormModal({ site, isSaving, onSave, onClose }: SiteSeoFormModalProps) {
  const [slug, setSlug] = useState(site.slug ?? '')
  const [aliases, setAliases] = useState(site.aliases.join(', '))
  const [city, setCity] = useState(site.city ?? '')
  const [address, setAddress] = useState(site.address ?? '')

  const aliasList = Array.from(new Set(aliases.split(',').map(toSlug).filter(Boolean)))
  const isValid = !!toSlug(slug)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden z-10">
        <div className="px-6 pt-6 pb-4 border-b border-dashed border-gray-100 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-blue-400 inline-block" />
              <p className="text-xs tracking-widest uppercase text-gray-400">Cabang {site.sitecode}</p>
            </div>
            <p className="text-base font-semibold text-gray-900">{site.nama}</p>
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
            onSave({ slug: toSlug(slug), aliases: aliasList, city: city.trim(), address: address.trim() })
          }}
        >
          <label className="block">
            <FieldLabel>Slug halaman</FieldLabel>
            <input value={slug} onChange={(e) => setSlug(e.target.value)} className={inputClass} />
            <p className="text-[11px] text-gray-500 mt-1">/hotel/{toSlug(slug) || '…'}</p>
          </label>

          <label className="block">
            <FieldLabel>Alias (pisahkan dengan koma)</FieldLabel>
            <input value={aliases} onChange={(e) => setAliases(e.target.value)} placeholder="mis. jakpus, jkt-pusat" className={inputClass} />
            <p className="text-[11px] text-gray-500 mt-1">Dialihkan (301) ke slug utama.</p>
          </label>

          <label className="block">
            <FieldLabel>Kota</FieldLabel>
            <input value={city} onChange={(e) => setCity(e.target.value)} placeholder="mis. Jakarta" className={inputClass} />
            <p className="text-[11px] text-gray-500 mt-1">Cabang dengan kota yang sama dikelompokkan di halaman kota.</p>
          </label>

          <label className="block">
            <FieldLabel>Alamat</FieldLabel>
            <textarea value={address} rows={3} onChange={(e) => setAddress(e.target.value)} className={`${inputClass} resize-y`} />
            <p className="text-[11px] text-gray-500 mt-1">Tampil di halaman listing, FAQ, dan data Google (JSON-LD). Kosongkan untuk menghapus.</p>
          </label>

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
