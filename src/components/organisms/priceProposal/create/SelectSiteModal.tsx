import { creatableSite } from '@/src/models/priceProposal/creatableSites'

interface SelectSiteModalProps {
  sites: creatableSite[]
  onSelect: (siteCode: string) => void
  onClose: () => void
}

// Muncul untuk akun pusat (tidak terikat cabang) sebelum mengisi form proposal
export function SelectSiteModal({ sites, onSelect, onClose }: SelectSiteModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden z-10">
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-dashed border-gray-100 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-blue-400 inline-block" />
              <p className="text-xs tracking-widest uppercase text-gray-400">Price Proposal</p>
            </div>
            <p className="text-base font-semibold text-gray-900">Buat proposal untuk cabang mana?</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition text-lg leading-none"
          >
            ✕
          </button>
        </div>

        <div className="px-6 py-5 space-y-2 max-h-[60vh] overflow-y-auto">
          {sites.length === 0 && (
            <p className="text-sm text-gray-500 text-center py-6">Belum ada cabang aktif.</p>
          )}

          {sites.map((site) => (
            <button
              key={site.siteCode}
              type="button"
              onClick={() => onSelect(site.siteCode)}
              className="w-full text-left bg-gray-50 hover:bg-blue-50 border border-gray-100 hover:border-blue-200 rounded-xl px-4 py-3 transition-colors"
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-gray-800">{site.nama}</p>
                  {site.city && <p className="text-xs text-gray-500">{site.city}</p>}
                </div>
                <span className="text-xs font-mono text-gray-400">{site.siteCode}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
