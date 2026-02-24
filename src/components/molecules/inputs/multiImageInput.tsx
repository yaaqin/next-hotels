import { useRef, type InputHTMLAttributes } from 'react';

interface MultiImageInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value' | 'type'> {
  label: string;
  value: File[];
  onChange?: (files: File[]) => void;
  error?: string;
  helperText?: string;
  maxFiles?: number;
  maxSizeMB?: number;
  containerClassName?: string;
  labelClassName?: string;
  required?: boolean;
  disabled?: boolean;
}

export function MultiImageInput({
  label,
  value = [],
  onChange,
  error,
  helperText,
  maxFiles = 5,
  maxSizeMB = 5,
  containerClassName,
  labelClassName,
  required = false,
  disabled = false,
  ...restProps
}: MultiImageInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const hasError = !!error;
  const remaining = maxFiles - value.length;

  const handleFiles = (incoming: FileList | null) => {
    if (!incoming) return;

    const valid: File[] = [];
    const maxBytes = maxSizeMB * 1024 * 1024;

    Array.from(incoming).forEach((file) => {
      if (!file.type.startsWith('image/')) return;
      if (file.size > maxBytes) return;
      if (value.some((f) => f.name === file.name && f.size === file.size)) return;
      valid.push(file);
    });

    const merged = [...value, ...valid].slice(0, maxFiles);
    onChange?.(merged);

    // reset input so same file can be re-added after removal
    if (inputRef.current) inputRef.current.value = '';
  };

  const handleRemove = (index: number) => {
    const updated = value.filter((_, i) => i !== index);
    onChange?.(updated);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (disabled) return;
    handleFiles(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const isFull = value.length >= maxFiles;

  return (
    <div className={containerClassName || 'w-full'}>
      {/* Label */}
      <label className={labelClassName || 'block text-md font-medium mb-1 md:mb-2'}>
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {/* Drop Zone */}
      {!isFull && !disabled && (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={() => inputRef.current?.click()}
          className={`
            w-full border-2 border-dashed rounded-lg px-4 py-6 flex flex-col items-center justify-center gap-1
            cursor-pointer transition-colors duration-200 select-none
            ${hasError
              ? 'border-red-400 bg-red-50 hover:bg-red-100'
              : 'border-gray-300 bg-gray-50 hover:bg-gray-100 hover:border-blue-400'
            }
          `}
        >
          {/* Upload Icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`w-8 h-8 ${hasError ? 'text-red-400' : 'text-gray-400'}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16l4-4 4 4m4-4l4 4M7 12V4m10 8V4m-5 0v8" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 20h18" />
          </svg>
          <p className={`text-sm font-medium ${hasError ? 'text-red-500' : 'text-gray-600'}`}>
            Klik atau drag &amp; drop gambar di sini
          </p>
          <p className="text-xs text-gray-400">
            Maks {maxFiles} gambar · Maks {maxSizeMB}MB per file · {remaining} slot tersisa
          </p>

          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            disabled={disabled}
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
            aria-invalid={hasError}
            aria-label={label}
            {...restProps}
          />
        </div>
      )}

      {/* Full state nudge */}
      {isFull && !disabled && (
        <div className="w-full border border-gray-200 rounded-lg px-4 py-3 bg-gray-50 text-sm text-gray-500 text-center">
          Maksimal {maxFiles} gambar sudah tercapai. Hapus salah satu untuk menambah lagi.
        </div>
      )}

      {/* Preview Grid */}
      {value.length > 0 && (
        <div className="mt-3 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
          {value.map((file, index) => {
            const url = URL.createObjectURL(file);
            return (
              <div key={`${file.name}-${index}`} className="relative group aspect-square rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                <img
                  src={url}
                  alt={file.name}
                  className="w-full h-full object-cover"
                  onLoad={() => URL.revokeObjectURL(url)}
                />

                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-150 flex items-center justify-center">
                  <button
                    type="button"
                    onClick={() => handleRemove(index)}
                    aria-label={`Hapus ${file.name}`}
                    className="w-7 h-7 rounded-full bg-white flex items-center justify-center shadow hover:bg-red-50 transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-4 h-4 text-red-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* File name tooltip */}
                <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-[10px] px-1 py-0.5 truncate opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                  {file.name}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <p className="mt-1 text-xs text-red-600" role="alert">
          {error}
        </p>
      )}

      {/* Helper Text */}
      {helperText && !error && (
        <p className="mt-1 text-xs text-gray-500">{helperText}</p>
      )}
    </div>
  );
}

MultiImageInput.displayName = 'MultiImageInput';