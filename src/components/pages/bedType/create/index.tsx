'use client'

import { createBedTypeAction } from '@/src/actions/bedType/bed-types.action'
import Buttons from '@/src/components/atoms/buttons'
import { Inputs } from '@/src/components/molecules/inputs/inputs'
// import { useCreateBedType } from '@/src/hooks/mutation/bedType/useCreateBedType'
import { CreateBedTypeForm } from '@/src/models/bedType/create'
import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import toast from 'react-hot-toast'

export default function CreateBedType() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const [formData, setFormData] = useState<CreateBedTypeForm>({
    code: '',
    name: '',
    size: '',
    description: '',
  })

  const handleChange = (key: keyof CreateBedTypeForm, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }))
  }

  const handleSubmit = () => {
    if (isDisabled) return

    startTransition(async () => {
      const result = await createBedTypeAction(formData)

      if (result.success) {
        toast.success(result.message)
        setFormData({ code: '', name: '', size: '', description: '' })
        router.push('/dashboard/bed-type')
      } else {
        toast.error(result.message)
      }
    })
  }

  const isDisabled =
    !formData.code.trim() ||
    !formData.name.trim() ||
    !formData.size.trim() ||
    !formData.description.trim() ||
    isPending


  return (
    <div className="space-y-6">
      <h1 className="text-lg font-semibold">Create Bed Type</h1>

      <section>
        <div className="w-1/2 flex flex-col gap-4">
          <Inputs
            label="Code"
            value={formData.code}
            onChange={(value) => handleChange('code', value)}
            placeholder="Ex: SINGLE"
          />

          <Inputs
            label="Name"
            value={formData.name}
            onChange={(value) => handleChange('name', value)}
            placeholder="Ex: Single Bed"
          />

          <Inputs
            label="Size"
            value={formData.size}
            onChange={(value) => handleChange('size', value)}
            placeholder="Ex: single"
          />

          <Inputs
            label="Description"
            value={formData.description}
            onChange={(value) => handleChange('description', value)}
            placeholder="Deskripsi bed type"
          />
        </div>
      </section>

      <Buttons
        label="Create"
        onClick={handleSubmit}
        disable={isDisabled}
      />
    </div>
  )
}