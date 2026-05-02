'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCreateResto } from '@/src/hooks/mutation/restaurant/create'
import Link from 'next/link'
import Image from 'next/image'
import { useTranslation } from 'react-i18next'
import { Inputs } from '@/src/components/molecules/inputs/inputs'

export default function CreateRestoPage() {
  const { t } = useTranslation()
  const router = useRouter()
  const { mutate, isPending } = useCreateResto()

  const [form, setForm] = useState({
    name: '',
    description: '',
    logoUrl: '',
  })

  const [errors, setErrors] = useState({
    name: '',
    description: '',
    logoUrl: '',
  })

  const validate = () => {
    const newErrors = { name: '', description: '', logoUrl: '' }
    let valid = true

    if (!form.name.trim()) {
      newErrors.name = 'Name is required'
      valid = false
    }

    if (!form.description.trim()) {
      newErrors.description = 'Description is required'
      valid = false
    }

    if (!form.logoUrl.trim()) {
      newErrors.logoUrl = 'Logo URL is required'
      valid = false
    } else {
      try {
        new URL(form.logoUrl)
      } catch {
        newErrors.logoUrl = 'Logo URL is not valid'
        valid = false
      }
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

  return (
    <div className="space-y-6">

      {/* Header */}
      <section className="flex justify-between items-center">
        <h6 className="text-xl font-semibold">Create Restaurant</h6>
        <Link
          href="/dashboard/restaurant"
          className="px-4 py-2 text-sm font-medium text-gray-600 border border-gray-300 hover:bg-gray-50 rounded-md transition-colors"
        >
          {t('label.back')}
        </Link>
      </section>

      {/* Form */}
      <div className="bg-white rounded-lg shadow p-6 max-w-lg space-y-4">

        <Inputs
          label={t('label.name')}
          value={form.name}
          onChange={(val) => setForm((prev) => ({ ...prev, name: val }))}
          error={errors.name}
          required
          placeholder="Sushi Japan"
        />

        <Inputs
          label={t('label.description')}
          value={form.description}
          onChange={(val) => setForm((prev) => ({ ...prev, description: val }))}
          error={errors.description}
          required
          placeholder="Authentic Japanese cuisine"
        />

        <Inputs
          label="Logo URL"
          value={form.logoUrl}
          onChange={(val) => setForm((prev) => ({ ...prev, logoUrl: val }))}
          error={errors.logoUrl}
          required
          placeholder="https://example.com/logo.png"
        />

        {/* Preview Logo */}
        {form.logoUrl && !errors.logoUrl && (
          <div>
            <p className="text-xs text-gray-400 uppercase mb-2">Preview</p>
            <Image
              src={form.logoUrl}
              alt="Logo preview"
              width={80}
              height={80}
              className="rounded-lg object-cover border border-gray-200"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none'
              }}
            />
          </div>
        )}

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