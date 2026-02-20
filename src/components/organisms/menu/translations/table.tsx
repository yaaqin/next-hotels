import { Translation } from '@/src/models/menu/detailTranslations';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
  getSortedRowModel,
  SortingState,
  getPaginationRowModel,
} from '@tanstack/react-table';
import { useState } from 'react';

interface MenuTranslationTableProps {
  data: Translation[];
  onDelete?: (langs: string[]) => void;
}

export default function MenuTranslationTable({
  data,
  onDelete,
}: MenuTranslationTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const getLanguageBadge = (lang: string) => {
    const langColors: Record<string, string> = {
      eng: 'bg-blue-100 text-blue-800',
      idn: 'bg-red-100 text-red-800',
      chn: 'bg-yellow-100 text-yellow-800',
      jpn: 'bg-pink-100 text-pink-800',
      kor: 'bg-purple-100 text-purple-800',
      es: 'bg-orange-100 text-orange-800',
      fr: 'bg-indigo-100 text-indigo-800',
      de: 'bg-gray-100 text-gray-800',
    };

    const langNames: Record<string, string> = {
      eng: 'English',
      idn: 'Indonesia',
      chn: '中文',
      jpn: '日本語',
      kor: '한국어',
      es: 'Español',
      fr: 'Français',
      de: 'Deutsch',
    };

    return (
      <span
        className={`px-3 py-1 text-xs font-semibold rounded-full ${
          langColors[lang] ?? 'bg-gray-100 text-gray-800'
        }`}
      >
        {langNames[lang] ?? lang.toUpperCase()}
      </span>
    );
  };

  const toggleRow = (lang: string) => {
    const next = new Set(selectedRows);
    next.has(lang) ? next.delete(lang) : next.add(lang);
    setSelectedRows(next);
  };

  const toggleAll = () => {
    setSelectedRows(
      selectedRows.size === data.length
        ? new Set()
        : new Set(data.map((d) => d.lang)),
    );
  };

  const handleConfirmDelete = () => {
    onDelete?.(Array.from(selectedRows));
    setShowDeleteModal(false);
    setSelectedRows(new Set());
  };

  const columns: ColumnDef<Translation>[] = [
    {
      id: 'select',
      header: () => (
        <input
          type="checkbox"
          checked={selectedRows.size === data.length && data.length > 0}
          onChange={toggleAll}
          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
        />
      ),
      cell: ({ row }) => (
        <input
          type="checkbox"
          checked={selectedRows.has(row.original.lang)}
          onChange={() => toggleRow(row.original.lang)}
          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
        />
      ),
      enableSorting: false,
    },
    {
      accessorKey: 'lang',
      header: 'Language',
      cell: (info) => getLanguageBadge(info.getValue() as string),
    },
    {
      accessorKey: 'name',
      header: 'Name',
      cell: (info) => (
        <span className="font-medium text-gray-900">{info.getValue() as string}</span>
      ),
    },
  ];

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  });

  return (
    <div className="w-full space-y-4 mt-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h5 className="text-xl font-semibold">Translation</h5>

        {selectedRows.size > 0 && (
          <div className="flex items-center gap-3 bg-blue-50 px-4 py-2 rounded-lg border border-blue-200">
            <span className="text-sm font-medium text-blue-900">
              {selectedRows.size} selected
            </span>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors duration-200 flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Delete Selected
            </button>
            <button
              onClick={() => setSelectedRows(new Set())}
              className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
            >
              Clear
            </button>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto shadow-md rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const canSort = header.column.getCanSort();
                  return (
                    <th
                      key={header.id}
                      className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider select-none ${
                        canSort ? 'cursor-pointer hover:bg-gray-100' : ''
                      }`}
                      onClick={canSort ? header.column.getToggleSortingHandler() : undefined}
                    >
                      <div className="flex items-center gap-2">
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {canSort && header.column.getIsSorted() && (
                          <span>{header.column.getIsSorted() === 'asc' ? '🔼' : '🔽'}</span>
                        )}
                      </div>
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className={`hover:bg-gray-50 transition-colors ${
                    selectedRows.has(row.original.lang) ? 'bg-blue-50' : ''
                  }`}
                >
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
                    <svg className="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
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

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-gray-900 opacity-50"
            onClick={() => setShowDeleteModal(false)}
          />
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 overflow-hidden z-10">
            <div className="bg-red-600 px-6 py-4">
              <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                Confirm Deletion
              </h3>
            </div>
            <div className="p-6">
              <p className="text-gray-700 mb-4">
                Are you sure you want to delete{' '}
                <strong>{selectedRows.size}</strong> translation
                {selectedRows.size > 1 ? 's' : ''}?
              </p>
              <div className="bg-gray-50 rounded-md p-4 mb-4 max-h-40 overflow-y-auto">
                <p className="text-sm font-medium text-gray-700 mb-2">Selected Languages:</p>
                <ul className="space-y-1">
                  {Array.from(selectedRows).map((lang) => {
                    const translation = data.find((t) => t.lang === lang);
                    return (
                      <li key={lang} className="text-sm text-gray-600 flex items-center gap-2">
                        <span className="font-semibold px-2 py-1 rounded bg-white">
                          {lang.toUpperCase()}
                        </span>
                        {translation && (
                          <span className="text-xs">- {translation.name}</span>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
              <p className="text-sm text-red-600 font-medium">
                ⚠️ This action cannot be undone.
              </p>
            </div>
            <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete {selectedRows.size} Item{selectedRows.size > 1 ? 's' : ''}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}