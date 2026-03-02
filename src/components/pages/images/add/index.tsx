'use client';
import { MultiImageInput } from '@/src/components/molecules/inputs/multiImageInput';
import { useUploadImages } from '@/src/hooks/mutation/images/useCreateImage';
import { Suspense, useState } from 'react';

export default function UploadImagePage() {
  const [images, setImages] = useState<File[]>([]);
  const [fieldError, setFieldError] = useState<string>('');
  const { mutate, isPending } = useUploadImages();

  const handleSubmit = async () => {
    try {
      mutate(images);
      console.log('console log try catch mah jalan nih')

    } catch (error) {

    }
  };

  const handleImagesChange = (files: File[]) => {
    setImages(files);
    if (files.length > 0) setFieldError('');
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="min-h-screen bg-gray-50 flex items-start justify-center py-12 px-4">
        <div className="w-full max-w-xl bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-gray-900">Upload Gambar</h1>
            <p className="text-sm text-gray-500 mt-1">
              Pilih hingga 5 gambar untuk diunggah ke server.
            </p>
          </div>

          <div className="space-y-6">
            {/* Multi Image Input */}
            <MultiImageInput
              label="Gambar"
              value={images}
              onChange={handleImagesChange}
              maxFiles={5}
              maxSizeMB={5}
              required
              error={fieldError}
              helperText="Format JPG, PNG, WEBP. Maks 5MB per file."
              disabled={isPending}
            />

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={isPending}
              className={`
              w-full py-2.5 px-4 rounded-lg text-sm font-medium transition-colors duration-200
              ${isPending
                  ? 'bg-blue-300 text-white cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
                }
            `}
            >
              {isPending ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin w-4 h-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12" cy="12" r="10"
                      stroke="currentColor" strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8z"
                    />
                  </svg>
                  Mengupload {images.length} gambar...
                </span>
              ) : (
                `Upload ${images.length > 0 ? `${images.length} ` : ''}Gambar`
              )}
            </button>
          </div>
        </div>
      </div>
    </Suspense>
  );
}