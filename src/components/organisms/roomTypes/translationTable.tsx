import { TranslationDetailRoomType } from '@/src/models/roomTypes/detailAllLang';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
  getSortedRowModel,
  SortingState,
  getPaginationRowModel,
  getFilteredRowModel,
  ColumnFiltersState,
} from '@tanstack/react-table';
import { useState } from 'react';

interface TranslationTableProps {
  data: TranslationDetailRoomType[];
  onEdit?: (translation: TranslationDetailRoomType) => void;
  onDelete?: (translationId: string) => void;
}

export default function TranslationTable({ 
  data, 
  onEdit, 
  onDelete 
}: TranslationTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  // Language badges dengan warna berbeda
  const getLanguageBadge = (lang: string) => {
    const langColors: Record<string, string> = {
      'en': 'bg-blue-100 text-blue-800',
      'id': 'bg-red-100 text-red-800',
      'zh': 'bg-yellow-100 text-yellow-800',
      'ja': 'bg-pink-100 text-pink-800',
      'ko': 'bg-purple-100 text-purple-800',
      'es': 'bg-orange-100 text-orange-800',
      'fr': 'bg-indigo-100 text-indigo-800',
      'de': 'bg-gray-100 text-gray-800',
    };

    const langNames: Record<string, string> = {
      'en': 'English',
      'id': 'Indonesia',
      'zh': '中文',
      'ja': '日本語',
      'ko': '한국어',
      'es': 'Español',
      'fr': 'Français',
      'de': 'Deutsch',
    };

    const colorClass = langColors[lang] || 'bg-gray-100 text-gray-800';
    const langName = langNames[lang] || lang.toUpperCase();

    return (
      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${colorClass}`}>
        {langName}
      </span>
    );
  };

  const columns: ColumnDef<TranslationDetailRoomType>[] = [
    {
      accessorKey: 'lang',
      header: 'Language',
      cell: (info) => getLanguageBadge(info.getValue() as string),
      filterFn: 'includesString',
    },
    {
      accessorKey: 'name',
      header: 'Name',
      cell: (info) => (
        <span className="font-medium text-gray-900">{info.getValue() as string}</span>
      ),
    },
    {
      accessorKey: 'desk',
      header: 'Description',
      cell: (info) => (
        <div className="max-w-md">
          <p className="text-sm text-gray-600 line-clamp-2">
            {info.getValue() as string}
          </p>
        </div>
      ),
    },
    {
      accessorKey: 'id',
      header: 'Translation ID',
      cell: (info) => (
        <span className="font-mono text-xs text-gray-500">
          {(info.getValue() as string).slice(0, 8)}...
        </span>
      ),
    },
  ];

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  return (
    <div className="w-full space-y-4 mt-4">
        <h5 className='text-xl'>TransLation</h5>
      {/* Filter Section */}
      {/* <div className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-sm"> */}
        {/* <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Search by Language
          </label>
          <input
            type="text"
            value={(table.getColumn('lang')?.getFilterValue() as string) ?? ''}
            onChange={(e) => table.getColumn('lang')?.setFilterValue(e.target.value)}
            placeholder="Filter languages (e.g., en, id)..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Search by Name
          </label>
          <input
            type="text"
            value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
            onChange={(e) => table.getColumn('name')?.setFilterValue(e.target.value)}
            placeholder="Search translations..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div> */}
        {/* {(table.getColumn('lang')?.getFilterValue() || table.getColumn('name')?.getFilterValue()) && (
          <button
            onClick={() => {
              table.getColumn('lang')?.setFilterValue('');
              table.getColumn('name')?.setFilterValue('');
            }}
            className="mt-6 px-4 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Clear Filters
          </button>
        )} */}
      {/* </div> */}

      {/* Table */}
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
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
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
                    <td key={cell.id} className="px-6 py-4 text-sm text-gray-900">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="px-6 py-8 text-center text-gray-500">
                  <div className="flex flex-col items-center gap-2">
                    <svg 
                      className="w-12 h-12 text-gray-400" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" 
                      />
                    </svg>
                    <p className="text-lg font-medium">No translations found</p>
                    <p className="text-sm">Add translations to get started</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {/* {table.getRowModel().rows.length > 0 && (
        <div className="flex items-center justify-between px-6 py-4 bg-white border-t rounded-b-lg">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700">
              Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{' '}
              {Math.min(
                (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                table.getFilteredRowModel().rows.length
              )}{' '}
              of {table.getFilteredRowModel().rows.length} translations
            </span>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
              className="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {'<<'}
            </button>
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {'<'}
            </button>
            
            <span className="px-4 py-2 text-sm border border-gray-300 rounded-md bg-gray-50">
              Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
            </span>
            
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {'>'}
            </button>
            <button
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
              className="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {'>>'}
            </button>
          </div>
        </div>
      )} */}
    </div>
  );
}