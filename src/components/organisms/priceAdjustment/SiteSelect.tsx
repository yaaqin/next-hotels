'use client'

import { usePriceProposalCreatableSites } from '@/src/hooks/query/priceProposal/creatableSites'

interface Props {
  value?: string
  onChange: (siteCode: string) => void
}

// Akun cabang terkunci ke cabangnya (select tidak tampil); akun pusat wajib pilih cabang
export default function SiteSelect({ value, onChange }: Props) {
  const { data } = usePriceProposalCreatableSites()
  const scope = data?.data
  if (!scope || scope.lockedSiteCode) return null

  return (
    <select
      value={value ?? ''}
      onChange={(e) => onChange(e.target.value)}
      className="px-3 py-2 text-sm border border-gray-300 rounded-md bg-white"
    >
      <option value="" disabled>Pilih cabang</option>
      {scope.sites.map((site) => (
        <option key={site.siteCode} value={site.siteCode}>{site.nama} ({site.siteCode})</option>
      ))}
    </select>
  )
}

// true kalau akun pusat belum memilih cabang
export function useNeedsSite(siteCode?: string) {
  const { data, isLoading } = usePriceProposalCreatableSites()
  const locked = data?.data?.lockedSiteCode
  return { isLoading, needsSite: !isLoading && !locked && !siteCode, lockedSiteCode: locked ?? undefined }
}
