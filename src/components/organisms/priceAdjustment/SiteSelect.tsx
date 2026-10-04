'use client'

import { Selects } from '@/src/components/molecules/inputs/selects'
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
    <Selects
      label=""
      value={value ?? ''}
      onChange={onChange}
      placeholder="Pilih cabang"
      options={scope.sites.map((site) => ({
        id: site.siteCode,
        value: site.siteCode,
        label: `${site.nama} (${site.siteCode})`,
      }))}
      selectClassName="text-sm"
    />
  )
}

// true kalau akun pusat belum memilih cabang
export function useNeedsSite(siteCode?: string) {
  const { data, isLoading } = usePriceProposalCreatableSites()
  const locked = data?.data?.lockedSiteCode
  return { isLoading, needsSite: !isLoading && !locked && !siteCode, lockedSiteCode: locked ?? undefined }
}
