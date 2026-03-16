'use client'

import { useState } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
  SortingState,
} from '@tanstack/react-table'
import { refundListState } from '@/src/models/refund/list'
import { refundColumns } from './column'
import { RefundDetailModal } from './RefundDetailModal'
import { useApproveRefund } from '@/src/hooks/mutation/refund/approve'

interface RefundTableProps {
  data: refundListState[]
}

export default function RefundTable({ data }: RefundTableProps) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [selectedRefund, setSelectedRefund] = useState<refundListState | null>(null)

  const columns = refundColumns({ onDetail: setSelectedRefund })

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  })
  
  const { mutate: approve, isPending: isApproving } = useApproveRefund()

  const handleApprove = (refund: refundListState) => {
    approve(refund.booking.bookingCode, {
      onSuccess: () => {
        setSelectedRefund(null)
      },
      onError: () => {
        alert('Gagal approve refund, silakan coba lagi')
      },
    })
  }

  return (
    <>
      <div className="w-full">
        <div className="overflow-x-auto shadow-md rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      onClick={header.column.getToggleSortingHandler()}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 select-none"
                    >
                      <div className="flex items-center gap-2">
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {{ asc: ' 🔼', desc: ' 🔽' }[header.column.getIsSorted() as string] ?? null}
                      </div>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {table.getRowModel().rows.length > 0 ? (
                table.getRowModel().rows.map((row) => (
                  <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length} className="px-6 py-8 text-center text-gray-500">
                    Tidak ada data refund
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 bg-white border-t rounded-b-lg">
          <span className="text-sm text-gray-700">
            Showing{' '}
            {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{' '}
            {Math.min(
              (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
              data.length,
            )}{' '}
            of {data.length} results
          </span>
          <div className="flex gap-2">
            <button onClick={() => table.setPageIndex(0)} disabled={!table.getCanPreviousPage()} className="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">{'<<'}</button>
            <button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()} className="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">{'<'}</button>
            <span className="px-4 py-2 text-sm border border-gray-300 rounded-md bg-gray-50">
              Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
            </span>
            <button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()} className="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">{'>'}</button>
            <button onClick={() => table.setPageIndex(table.getPageCount() - 1)} disabled={!table.getCanNextPage()} className="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">{'>>'}</button>
          </div>
        </div>
      </div>

      {/* Modal */}
      <RefundDetailModal
        refund={selectedRefund}
        onClose={() => setSelectedRefund(null)}
        onApprove={handleApprove}
      />
    </>
  )
}