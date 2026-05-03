'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import { useAssignResto } from '@/src/hooks/mutation/adminResto/assignAdmin'
import { useAdminRestoList } from '@/src/hooks/query/adminResto/list'
import { useRestoList } from '@/src/hooks/query/restaurant/list'
import { mapAdminRestoToOptions, mapRestoToOptions } from '@/src/utils/restaurant'
import { Selects } from '@/src/components/molecules/inputs/selects'

export default function AssignAdminRestoPage() {
  const { t } = useTranslation()
  const router = useRouter()
  const { mutate, isPending } = useAssignResto()

  const { data: adminRestoData, isLoading: loadingAdmins } = useAdminRestoList()
  const { data: restoData, isLoading: loadingRestos } = useRestoList()

  const [form, setForm] = useState({
    restaurantAdminId: '',
    restaurantId: '',
  })

  const [errors, setErrors] = useState({
    restaurantAdminId: '',
    restaurantId: '',
  })

  const validate = () => {
    const newErrors = { restaurantAdminId: '', restaurantId: '' }
    let valid = true

    if (!form.restaurantAdminId) {
      newErrors.restaurantAdminId = 'Admin resto wajib dipilih'
      valid = false
    }

    if (!form.restaurantId) {
      newErrors.restaurantId = 'Restaurant wajib dipilih'
      valid = false
    }

    setErrors(newErrors)
    return valid
  }

  const handleSubmit = () => {
    if (!validate()) return

    mutate(form, {
      onSuccess: () => {
        router.push('/dashboard/restaurant')
      },
      onError: (err) => {
        console.error(err)
      },
    })
  }

  const adminOptions = adminRestoData?.data ? mapAdminRestoToOptions(adminRestoData.data) : []
  const restoOptions = restoData?.data ? mapRestoToOptions(restoData.data) : []

  return (
    <div className="space-y-6">

      <section className="flex justify-between items-center">
        <h6 className="text-xl font-semibold">Assign Admin ke Restoran</h6>
        <Link
          href="/dashboard/restaurant"
          className="px-4 py-2 text-sm font-medium text-gray-600 border border-gray-300 hover:bg-gray-50 rounded-md transition-colors"
        >
          {t('label.back')}
        </Link>
      </section>

      <div className="bg-white rounded-lg shadow p-6 max-w-lg space-y-4">

        <Selects
          label="Admin Resto"
          value={form.restaurantAdminId}
          onChange={(val) => setForm((prev) => ({ ...prev, restaurantAdminId: val }))}
          options={adminOptions}
          error={errors.restaurantAdminId}
          placeholder="Pilih admin resto"
          disabled={loadingAdmins}
          required
        />

        <Selects
          label="Restaurant"
          value={form.restaurantId}
          onChange={(val) => setForm((prev) => ({ ...prev, restaurantId: val }))}
          options={restoOptions}
          error={errors.restaurantId}
          placeholder="Pilih restaurant"
          disabled={loadingRestos}
          required
        />

        <div className="flex gap-3 pt-2">
          <button
            onClick={handleSubmit}
            disabled={isPending || loadingAdmins || loadingRestos}
            className="px-6 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? 'Saving...' : t('label.save')}
          </button>
          <Link
            href="/dashboard/restaurant"
            className="px-6 py-2 text-sm font-medium text-gray-600 border border-gray-300 hover:bg-gray-50 rounded-md transition-colors"
          >
            {t('label.cancel')}
          </Link>
        </div>
      </div>

    </div>
  )
}