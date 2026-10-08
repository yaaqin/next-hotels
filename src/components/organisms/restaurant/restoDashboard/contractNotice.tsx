'use client'
import { useQuery } from '@tanstack/react-query'
import { restoBranchList } from '@/src/services/restaurant/restoDashboard/branch/list'
import { BranchRestoListProps } from '@/src/models/restaurant/restoDashboard/branch/list'
import { formatContractDate } from '../../partnerProposal/helpers'

// Pemberitahuan status kontrak tiap cabang: merah kalau sudah tidak aktif, kuning kalau <= 7 hari lagi berakhir
export default function ContractNotice() {
  const { data } = useQuery<BranchRestoListProps>({
    queryKey: ['resto-branch-list'],
    queryFn: () => restoBranchList(),
  })

  const branches = (data?.data ?? []).filter((b) => b.contractState !== 'ACTIVE')
  if (branches.length === 0) return null

  return (
    <div className="space-y-3 mb-6">
      {branches.map((b) =>
        b.contractState === 'INACTIVE' ? (
          <div key={b.id} className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <p className="font-semibold">Toko di cabang {b.site.nama} ({b.siteCode}) sudah tidak aktif</p>
            <p>
              {b.contract
                ? `Kontrak kerja sama berakhir ${formatContractDate(b.contract.endDate)}. `
                : 'Belum ada kontrak kerja sama. '}
              Menu tidak tampil ke tamu. Silakan urus dokumen perpanjangan kontrak ke pihak hotel.
            </p>
          </div>
        ) : (
          <div key={b.id} className="rounded-lg border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm text-yellow-800">
            <p className="font-semibold">
              Kontrak cabang {b.site.nama} ({b.siteCode}) berakhir {b.contractDaysLeft} hari lagi
            </p>
            <p>
              Berakhir {formatContractDate(b.contract!.endDate)}. Setelah itu menu tidak tampil ke tamu, segera urus
              dokumen perpanjangan kontrak ke pihak hotel.
            </p>
          </div>
        ),
      )}
    </div>
  )
}
