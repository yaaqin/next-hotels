'use client'
import { useState } from 'react'
import { addDays } from 'date-fns'
import toast from 'react-hot-toast'
import { DatePicker } from '../../molecules/inputs/datePicker'
import { useExtendProposal } from '@/src/hooks/mutation/partnerProposal/extend'
import { detailPartnerProposalState } from '@/src/models/partnerProposal/detail'
import { formatContractDate, plusContractDays, toDate, toDateString, toWibIso } from './helpers'

const EXTENDABLE = ['APPROVED', 'ACTIVE', 'EXPIRED']

// Perpanjang masa kontrak. Kontrak EXPIRED yang diperpanjang langsung aktif lagi (menu tampil lagi ke tamu).
export default function ExtendContract({ proposal }: { proposal: detailPartnerProposalState }) {
  const { mutate, isPending } = useExtendProposal()
  const today = toDateString(new Date())
  const [endDate, setEndDate] = useState('')

  if (!EXTENDABLE.includes(proposal.status)) return null

  // Default: 30 hari dari end date sekarang, atau dari hari ini kalau kontrak sudah lewat
  const currentEnd = toDateString(new Date(proposal.endDate))
  const suggested = plusContractDays(currentEnd > today ? currentEnd : today)
  const value = endDate || suggested

  const handleSubmit = () => {
    mutate(
      { id: proposal.id, endDate: toWibIso(value) },
      {
        onSuccess: () => {
          toast.success(`Kontrak diperpanjang sampai ${formatContractDate(toWibIso(value))}`)
          setEndDate('')
        },
        onError: (err: any) => {
          toast.error(err?.response?.data?.message ?? 'Gagal memperpanjang kontrak')
        },
      },
    )
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-base font-semibold text-gray-700 mb-1">Perpanjang Kontrak</h3>
      <p className="text-sm text-gray-500 mb-4">
        Berakhir {formatContractDate(proposal.endDate)}.
        {proposal.status === 'EXPIRED' && ' Kontrak sudah tidak aktif, menu resto tidak tampil ke tamu.'}
      </p>
      <div className="flex flex-col sm:flex-row sm:items-end gap-3 max-w-lg">
        <div className="flex-1">
          <label className="text-xs text-gray-500">End date baru</label>
          <DatePicker
            variant="default"
            className="mt-1"
            placeholder="Pilih tanggal berakhir"
            displayFormat="dd MMM yyyy"
            minDate={addDays(toDate(today)!, 1)}
            value={toDate(value)}
            onChange={(date) => setEndDate(toDateString(date))}
          />
        </div>
        <button
          onClick={handleSubmit}
          disabled={isPending}
          className="px-6 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? 'Saving...' : 'Perpanjang'}
        </button>
      </div>
    </div>
  )
}
