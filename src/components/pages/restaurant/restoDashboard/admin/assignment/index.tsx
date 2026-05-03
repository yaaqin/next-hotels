'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useRestoDataAdminRestoList } from '@/src/hooks/query/restaurant/restoDashboard/adminResto/list'
import { useRestoBranchList } from '@/src/hooks/query/restaurant/restoDashboard/branch/list'
import { useAssignStaffToSite } from '@/src/hooks/mutation/restaurant/restoDashboard/assignmentStaff'
import { mapBranchToOptions, mapRestoStaffToOptions } from '@/src/utils/restaurant'
import { Selects } from '@/src/components/molecules/inputs/selects'
import { RESTO_ROLE_OPTIONS } from '@/src/constans/restaurant/role'

export default function AssignmentPage() {
  const router = useRouter()
  const { mutate, isPending } = useAssignStaffToSite()

  const { data: adminData, isLoading: loadingAdmins } = useRestoDataAdminRestoList()
  const { data: branchData, isLoading: loadingBranch } = useRestoBranchList()

  const [form, setForm] = useState({
    staffId: '',
    siteCode: '',
    role: '',
  })

  const [errors, setErrors] = useState({
    staffId: '',
    siteCode: '',
    role: '',
  })

  const validate = () => {
    const newErrors = { staffId: '', siteCode: '', role: '' }
    let valid = true

    if (!form.staffId) { newErrors.staffId = 'Admin wajib dipilih'; valid = false }
    if (!form.siteCode) { newErrors.siteCode = 'Site wajib dipilih'; valid = false }
    if (!form.role) { newErrors.role = 'Role wajib dipilih'; valid = false }

    setErrors(newErrors)
    return valid
  }

  const handleSubmit = () => {
    if (!validate()) return

    mutate(
      {
        staffId: form.staffId,
        siteCode: form.siteCode,
        role: form.role as 'MANAGER' | 'KITCHEN_STAFF' | 'CASHIER',
      },
      {
        onSuccess: () => router.push('/restaurant/admin'),
        onError: (err) => console.error(err),
      },
    )
  }

  const staffOptions = mapRestoStaffToOptions(adminData?.data?.staff ?? [])
  const branchOptions = mapBranchToOptions(branchData?.data ?? [])

  return (
    <div className="space-y-6">

      <section className="flex justify-between items-center">
        <div>
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
            Manajemen Tim
          </p>
          <h6 className="text-xl font-bold text-gray-900 mt-0.5">Assign Staff ke Site</h6>
        </div>
        <Link
          href="/restaurant/admin"
          className="px-4 py-2 text-sm font-medium text-gray-600 border border-gray-300 hover:bg-gray-50 rounded-xl transition-colors"
        >
          Kembali
        </Link>
      </section>

      <div className="bg-white rounded-2xl border border-gray-100 p-6 max-w-lg space-y-4">

        <Selects
          label="Admin"
          value={form.staffId}
          onChange={(val) => setForm((prev) => ({ ...prev, staffId: val }))}
          options={staffOptions}
          error={errors.staffId}
          placeholder="Pilih admin"
          disabled={loadingAdmins}
          required
        />

        <Selects
          label="Site / Cabang"
          value={form.siteCode}
          onChange={(val) => setForm((prev) => ({ ...prev, siteCode: val }))}
          options={branchOptions}
          error={errors.siteCode}
          placeholder="Pilih site"
          disabled={loadingBranch}
          required
        />

        <Selects
          label="Role"
          value={form.role}
          onChange={(val) => setForm((prev) => ({ ...prev, role: val }))}
          options={RESTO_ROLE_OPTIONS}
          error={errors.role}
          placeholder="Pilih role"
          required
        />

        <div className="flex gap-3 pt-2">
          <button
            onClick={handleSubmit}
            disabled={isPending || loadingAdmins || loadingBranch}
            className="px-6 py-2 text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? 'Menyimpan...' : 'Assign'}
          </button>
          <Link
            href="/restaurant/admin"
            className="px-6 py-2 text-sm font-medium text-gray-600 border border-gray-300 hover:bg-gray-50 rounded-xl transition-colors"
          >
            Batal
          </Link>
        </div>
      </div>

    </div>
  )
}