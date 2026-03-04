'use client'
import { sessionTokenLIstState } from '@/src/models/sessionToken/list';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  SortingState,
} from '@tanstack/react-table';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { sessionTokenColumns } from './column';

interface SessionTokenTableProps {
  data: sessionTokenLIstState[];
  meta: {
    page: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export default function SessionTokenTable({ data, meta }: SessionTokenTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const router = useRouter();
  const searchParams = useSearchParams();

  const table = useReactTable({
    data,
    columns: sessionTokenColumns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: true, // ⬅️ pagination dikontrol dari URL
    pageCount: meta.totalPages,
  });

  const goToPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(page));
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="w-full">
      <div className="overflow-x-auto shadow-md rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 select-none"
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <div className="flex items-center gap-2">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {{
                        asc: ' 🔼',
                        desc: ' 🔽',
                      }[header.column.getIsSorted() as string] ?? null}
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
                    <td
                      key={cell.id}
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={sessionTokenColumns.length}
                  className="px-6 py-8 text-center text-gray-500"
                >
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-6 py-4 bg-white border-t rounded-b-lg">
        <span className="text-sm text-gray-700">
          Showing {(meta.page - 1) * 10 + 1}–{Math.min(meta.page * 10, meta.totalItems)} of {meta.totalItems} results
        </span>

        <div className="flex gap-2">
          <button
            onClick={() => goToPage(1)}
            disabled={!meta.hasPrevPage}
            className="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {'<<'}
          </button>
          <button
            onClick={() => goToPage(meta.page - 1)}
            disabled={!meta.hasPrevPage}
            className="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {'<'}
          </button>
          <span className="px-4 py-2 text-sm border border-gray-300 rounded-md bg-gray-50">
            Page {meta.page} of {meta.totalPages}
          </span>
          <button
            onClick={() => goToPage(meta.page + 1)}
            disabled={!meta.hasNextPage}
            className="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {'>'}
          </button>
          <button
            onClick={() => goToPage(meta.totalPages)}
            disabled={!meta.hasNextPage}
            className="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {'>>'}
          </button>
        </div>
      </div>
    </div>
  );
}