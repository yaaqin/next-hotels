'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAdminRestoDetail } from '@/src/hooks/query/adminResto/detail'
import Link from 'next/link'
import Loading from '../../../organisms/loading'
import { useTranslation } from 'react-i18next'
import { useUpdateAdminResto } from '@/src/hooks/query/adminResto/edit'
import { Inputs } from '@/src/components/molecules/inputs/inputs'

export default function EditAdminRestoPage() {
  const { id } = useParams<{ id: string }>()
  const { t } = useTranslation()
  const router = useRouter()

  const { data, isLoading } = useAdminRestoDetail(id)
  const { mutate, isPending } = useUpdateAdminResto(id)

  const [form, setForm] = useState({
    name: '',
    phone: '',
  })

  const [errors, setErrors] = useState({
    name: '',
    phone: '',
  })

  // Pre-fill form dari data detail
  useEffect(() => {
    if (data?.data) {
      setForm({
        name: data.data.name,
        phone: data.data.phone,
      })
    }
  }, [data])

  const validate = () => {
    const newErrors = { name: '', phone: '' }
    let valid = true

    if (!form.name.trim()) {
      newErrors.name = 'Name is required'
      valid = false
    }

    if (!form.phone.trim()) {
      newErrors.phone = 'Phone is required'
      valid = false
    }

    setErrors(newErrors)
    return valid
  }

  const handleSubmit = () => {
    if (!validate()) return

    mutate(form, {
      onSuccess: () => {
        router.push(`/dashboard/admin-restaurant/${id}`)
      },
      onError: (err) => {
        console.error(err)
      },
    })
  }

  if (isLoading) return <Loading />
  if (!data?.data) return <div className="text-center py-10 text-gray-500">Data not found</div>

  return (
    <div className="space-y-6">

      {/* Header */}
      <section className="flex justify-between items-center">
        <h6 className="text-xl font-semibold">Edit Admin Restaurant</h6>
        <Link
          href={`/dashboard/admin-resto/${id}`}
          className="px-4 py-2 text-sm font-medium text-gray-600 border border-gray-300 hover:bg-gray-50 rounded-md transition-colors"
        >
          {t('label.back')}
        </Link>
      </section>

      {/* Form */}
      <div className="bg-white rounded-lg shadow p-6 max-w-lg space-y-4">

        {/* Email — read only */}
        <div>
          <p className="block text-lg font-medium mb-1 md:mb-2">Email</p>
          <p className="w-full px-4 py-2 text-gray-500 border border-gray-200 rounded-lg bg-gray-50 text-sm">
            {data.data.email}
          </p>
          <p className="mt-1 text-xs text-gray-400">Email cannot be changed</p>
        </div>

        <Inputs
          label={t('label.name')}
          value={form.name}
          onChange={(val) => setForm((prev) => ({ ...prev, name: val }))}
          error={errors.name}
          required
          placeholder="Budi Santoso"
        />

        <Inputs
          label={t('label.phone')}
          value={form.phone}
          onChange={(val) => setForm((prev) => ({ ...prev, phone: val }))}
          error={errors.phone}
          required
          placeholder="08123456789"
        />

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <button
            onClick={handleSubmit}
            disabled={isPending}
            className="px-6 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? 'Saving...' : t('label.save')}
          </button>
          <Link
            href={`/dashboard/admin-restaurant/${id}`}
            className="px-6 py-2 text-sm font-medium text-gray-600 border border-gray-300 hover:bg-gray-50 rounded-md transition-colors"
          >
            {t('label.cancel')}
          </Link>
        </div>
      </div>

    </div>
  )
}