import React from 'react';
import { cn } from '../../utils/cn';

export interface InputFieldProps {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label?: string;
  placeholder?: string;
  helperText?: string;
  errorMessage?: string;
  disabled?: boolean;
  invalid?: boolean;
  variant?: 'filled' | 'outlined' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  type?: 'text' | 'password';
  loading?: boolean;
  clearable?: boolean;
  onClear?: () => void;
  id?: string;
  className?: string;
}

const sizeMap = {
  sm: 'h-9 text-sm px-3',
  md: 'h-11 text-base px-4',
  lg: 'h-12 text-lg px-5',
} as const;

const variantMap = (invalid?: boolean) => ({
  filled: cn(
    'bg-slate-100 dark:bg-slate-800/60 focus:bg-white dark:focus:bg-slate-800',
    'border border-transparent focus:border-slate-300 dark:focus:border-slate-600',
    invalid && 'ring-2 ring-red-500/50 focus:border-red-500'
  ),
  outlined: cn(
    'bg-white dark:bg-slate-900 border',
    invalid ? 'border-red-500 ring-1 ring-red-500/40' : 'border-slate-300 dark:border-slate-700 focus:border-slate-400 dark:focus:border-slate-600'
  ),
  ghost: cn(
    'bg-transparent border-b',
    invalid ? 'border-red-500' : 'border-slate-300 dark:border-slate-700 focus:border-slate-400 dark:focus:border-slate-600'
  ),
});

function useControllableState(initial = '') {
  const [val, setVal] = React.useState(initial);
  return { val, setVal };
}

const InputField = React.forwardRef<HTMLInputElement, InputFieldProps>(
  (
    {
      value,
      onChange,
      label,
      placeholder,
      helperText,
      errorMessage,
      disabled,
      invalid,
      variant = 'outlined',
      size = 'md',
      type = 'text',
      loading = false,
      clearable = false,
      onClear,
      id,
      className,
    },
    ref
  ) => {
    const autoId = React.useId();
    const inputId = id ?? `input-${autoId}`;
    const helpId = helperText ? `${inputId}-help` : undefined;
    const errId = invalid && errorMessage ? `${inputId}-error` : undefined;
    const describedBy = [helpId, errId].filter(Boolean).join(' ') || undefined;
    const [showPwd, setShowPwd] = React.useState(false);

    const isControlled = value !== undefined;
    const { val, setVal } = useControllableState('');
    const currentValue = isControlled ? value! : val;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!isControlled) setVal(e.target.value);
      onChange?.(e);
    };

    const handleClear = () => {
      if (isControlled) {
        onClear?.();
      } else {
        setVal('');
      }
    };

    const inputType = type === 'password' ? (showPwd ? 'text' : 'password') : type;

    return (
      <div className={cn('w-full', className)}>
        {label && (
          <label htmlFor={inputId} className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
            {label}
          </label>
        )}
        <div
          className={cn(
            'relative flex items-center rounded-xl transition-[box-shadow,border-color,background]',
            sizeMap[size],
            variantMap(invalid)[variant],
            disabled && 'opacity-60',
            'focus-within:ring-2 focus-within:ring-slate-300 dark:focus-within:ring-slate-700'
          )}
          aria-busy={loading || undefined}
        >
          <input
            ref={ref}
            id={inputId}
            className={cn(
              'flex-1 min-w-0 bg-transparent border-none focus:outline-none',
              'placeholder:text-slate-400 dark:placeholder:text-slate-500',
              disabled ? 'cursor-not-allowed' : 'cursor-text',
              'dark:text-white',
              'w-full',
              'focus:ring-0',
              'p-0',
              'text-sm',
              'leading-6',
              'placeholder-gray-500',
              'sm:text-sm',
              'sm:leading-6'
            )}
            type={inputType}
            placeholder={placeholder}
            disabled={disabled}
            aria-invalid={invalid || undefined}
            aria-describedby={describedBy}
            value={currentValue}
            onChange={handleChange}
          />

          {loading && (
            <div className="ml-2">
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5 animate-spin text-slate-500"
                role="status"
                aria-label="Loading"
              >
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" opacity="0.25" />
                <path d="M22 12a10 10 0 0 1-10 10" fill="none" stroke="currentColor" strokeWidth="4" />
              </svg>
            </div>
          )}

          {type === 'password' && (
            <button
              type="button"
              aria-label={showPwd ? 'Hide password' : 'Show password'}
              onClick={() => setShowPwd((s) => !s)}
              className="ml-2 rounded px-2 py-1 text-sm font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
              disabled={disabled}
            >
              {showPwd ? 'Hide' : 'Show'}
            </button>
          )}

          {clearable && currentValue && !disabled && (
            <button
              type="button"
              aria-label="Clear input"
              onClick={handleClear}
              className="ml-2 rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:text-slate-500 dark:hover:bg-slate-800 dark:hover:text-slate-300"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>

        {helperText && !invalid && (
          <p id={helpId} className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            {helperText}
          </p>
        )}
        {invalid && errorMessage && (
          <p id={errId} className="mt-1 text-xs text-red-600 dark:text-red-400">
            {errorMessage}
          </p>
        )}
      </div>
    );
  }
);

InputField.displayName = 'InputField';

export default InputField;
