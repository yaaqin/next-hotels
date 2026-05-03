'use client'
import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useCreateMenu } from '@/src/hooks/mutation/restaurant/restoDashboard/menu/create'
import { useFoodCategoryList } from '@/src/hooks/query/foodCategory/list'
import { mapFoodCategoryToOptions } from '@/src/utils/restaurant'
import { Inputs } from '@/src/components/molecules/inputs/inputs'
import { Selects } from '@/src/components/molecules/inputs/selects'

const MAX_FILES = 5
const MAX_SIZE_MB = 4

export default function CreateMenuPage() {
  const router = useRouter()
  const { mutate, isPending } = useCreateMenu()
  const { data: categoryData, isLoading: loadingCategory } = useFoodCategoryList()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [form, setForm] = useState({
    foodCategoryId: '',
    basePrice: '',
    name: '',
    description: '',
  })

  const [files, setFiles] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])

  const [errors, setErrors] = useState({
    foodCategoryId: '',
    basePrice: '',
    name: '',
    files: '',
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || [])

    // Validasi jumlah
    if (selected.length + files.length > MAX_FILES) {
      setErrors((prev) => ({ ...prev, files: `Maksimal ${MAX_FILES} gambar` }))
      return
    }

    // Validasi ukuran
    const oversized = selected.find((f) => f.size > MAX_SIZE_MB * 1024 * 1024)
    if (oversized) {
      setErrors((prev) => ({ ...prev, files: `File ${oversized.name} melebihi ${MAX_SIZE_MB}MB` }))
      return
    }

    setErrors((prev) => ({ ...prev, files: '' }))
    const newFiles = [...files, ...selected]
    setFiles(newFiles)
    setPreviews(newFiles.map((f) => URL.createObjectURL(f)))
  }

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index)
    setFiles(newFiles)
    setPreviews(newFiles.map((f) => URL.createObjectURL(f)))
  }

  const validate = () => {
    const newErrors = { foodCategoryId: '', basePrice: '', name: '', files: '' }
    let valid = true

    if (!form.foodCategoryId) { newErrors.foodCategoryId = 'Kategori wajib dipilih'; valid = false }
    if (!form.basePrice || Number(form.basePrice) <= 0) { newErrors.basePrice = 'Harga wajib diisi'; valid = false }
    if (!form.name.trim()) { newErrors.name = 'Nama menu wajib diisi'; valid = false }
    if (files.length === 0) { newErrors.files = 'Minimal 1 gambar wajib diupload'; valid = false }

    setErrors(newErrors)
    return valid
  }

  const handleSubmit = () => {
    if (!validate()) return

    mutate(
      {
        foodCategoryId: form.foodCategoryId,
        basePrice: Number(form.basePrice),
        name: form.name,
        description: form.description,
        files,
      },
      {
        onSuccess: () => router.push('/restaurant/menu'),
        onError: (err) => console.error(err),
      },
    )
  }

  const categoryOptions = mapFoodCategoryToOptions(categoryData?.data ?? [])

  return (
    <div className="space-y-6">

      {/* Header */}
      <section className="flex justify-between items-center">
        <div>
          <p className="text-xs font-medium text-orange-400 uppercase tracking-wider">
            Manajemen Menu
          </p>
          <h6 className="text-xl font-bold text-gray-900 mt-0.5">Tambah Menu</h6>
        </div>
        <Link
          href="/restaurant/menu"
          className="px-4 py-2 text-sm font-medium text-gray-600 border border-gray-300 hover:bg-gray-50 rounded-xl transition-colors"
        >
          Kembali
        </Link>
      </section>

      <div className="bg-white rounded-2xl border border-orange-50 p-6 max-w-lg space-y-4">

        {/* Nama */}
        <Inputs
          label="Nama Menu"
          value={form.name}
          onChange={(val) => setForm((prev) => ({ ...prev, name: val }))}
          error={errors.name}
          placeholder="Sushi Roll"
          required
        />

        {/* Kategori */}
        <Selects
          label="Kategori"
          value={form.foodCategoryId}
          onChange={(val) => setForm((prev) => ({ ...prev, foodCategoryId: val }))}
          options={categoryOptions}
          error={errors.foodCategoryId}
          placeholder="Pilih kategori"
          disabled={loadingCategory}
          required
        />

        {/* Harga */}
        <Inputs
          label="Harga Dasar"
          value={form.basePrice}
          onChange={(val) => setForm((prev) => ({ ...prev, basePrice: val }))}
          error={errors.basePrice}
          placeholder="75000"
          required
        />

        {/* Deskripsi */}
        <Inputs
          label="Deskripsi"
          value={form.description}
          onChange={(val) => setForm((prev) => ({ ...prev, description: val }))}
          placeholder="Deskripsi menu (opsional)"
        />

        {/* Upload Gambar */}
        <div>
          <label className="block text-lg font-medium mb-1 md:mb-2">
            Gambar <span className="text-red-500 ml-1">*</span>
            <span className="text-xs text-gray-400 font-normal ml-2">
              (maks {MAX_FILES} foto, {MAX_SIZE_MB}MB/foto)
            </span>
          </label>

          {/* Preview */}
          {previews.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {previews.map((src, i) => (
                <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden border border-orange-100">
                  <Image src={src} alt={`preview-${i}`} fill className="object-cover" />
                  <button
                    onClick={() => removeFile(i)}
                    className="absolute top-1 right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center"
                  >
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Upload Button */}
          {files.length < MAX_FILES && (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-3 border-2 border-dashed border-orange-200 rounded-xl text-sm text-orange-400 hover:border-orange-400 hover:text-orange-500 transition-colors"
            >
              + Tambah Gambar
            </button>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleFileChange}
          />

          {errors.files && (
            <p className="mt-1 text-xs text-red-600">{errors.files}</p>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <button
            onClick={handleSubmit}
            disabled={isPending || loadingCategory}
            className="px-6 py-2 text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? 'Menyimpan...' : 'Simpan Menu'}
          </button>
          <Link
            href="/restaurant/menu"
            className="px-6 py-2 text-sm font-medium text-gray-600 border border-gray-300 hover:bg-gray-50 rounded-xl transition-colors"
          >
            Batal
          </Link>
        </div>
      </div>
    </div>
  )
}