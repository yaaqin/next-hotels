import { forwardRef, type InputHTMLAttributes } from 'react';

interface EmailProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'type'> {
  label: string;
  value: string;
  onChange?: (value: string) => void;
  error?: string;
  helperText?: string;
  containerClassName?: string;
  labelClassName?: string;
  inputClassName?: string;
  required?: boolean;
}

export const Emails = forwardRef<HTMLInputElement, EmailProps>(
  (
    {
      label,
      value,
      onChange,
      error,
      helperText,
      containerClassName,
      labelClassName,
      inputClassName,
      disabled = false,
      required = false,
      ...restProps
    },
    ref
  ) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange?.(e.target.value);
    };

    const hasError = !!error;

    return (
      <div className={containerClassName}>
        {/* Label */}
        <label className={labelClassName || 'block text-lg font-medium mb-1 md:mb-2'}>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>

        {/* Input */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center px-3 pointer-events-none">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`w-5 h-5 ${hasError ? 'text-red-400' : disabled ? 'text-gray-400' : 'text-gray-500'}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>

          <input
            ref={ref}
            type="email"
            value={value}
            onChange={handleChange}
            disabled={disabled}
            aria-invalid={hasError}
            aria-describedby={
              error ? `${label}-error` : helperText ? `${label}-helper` : undefined
            }
            className={`
              w-full pl-10 pr-4 py-2 text-gray-700 border rounded-lg
              transition-colors duration-200
              ${
                hasError
                  ? 'border-red-500 focus:ring-2 focus:ring-red-500 focus:border-red-500 focus:outline-none'
                  : disabled
                  ? 'bg-gray-100 border-gray-300 cursor-not-allowed focus:ring-0 focus:outline-none'
                  : 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none'
              }
              ${inputClassName || ''}
            `}
            {...restProps}
          />
        </div>

        {/* Error */}
        {error && (
          <p id={`${label}-error`} className="mt-1 text-xs text-red-600" role="alert">
            {error}
          </p>
        )}

        {/* Helper Text */}
        {helperText && !error && (
          <p id={`${label}-helper`} className="mt-1 text-xs text-gray-500">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Emails.displayName = 'Emails';