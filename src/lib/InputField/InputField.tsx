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
  sm: 'h-10 text-sm px-4',
  md: 'h-12 text-base px-4',
  lg: 'h-14 text-lg px-5',
} as const;

const variantMap = (invalid?: boolean) => ({
  filled: cn(
    'bg-card focus-within:bg-background',
    'border-2 border-transparent focus-within:border-blue-500 dark:focus-within:border-blue-400',
    'shadow-sm focus-within:shadow-lg',
    invalid && 'border-red-500 bg-red-50 dark:bg-red-900/20 focus-within:border-red-500'
  ),
  outlined: cn(
    'bg-card border-2 shadow-sm focus-within:shadow-lg',
    invalid 
      ? 'border-red-500 focus-within:border-red-500' 
      : 'border-primary focus-within:border-blue-500 dark:focus-within:border-blue-400'
  ),
  ghost: cn(
    'bg-transparent border-b-2 rounded-none shadow-none',
    invalid 
      ? 'border-red-500' 
      : 'border-slate-300 dark:border-slate-700 focus-within:border-blue-500 dark:focus-within:border-blue-400'
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
          <label htmlFor={inputId} className="mb-2 block text-sm font-semibold text-foreground">
            {label}
          </label>
        )}
        <div
          className={cn(
            'group relative flex items-center rounded-2xl transition-all duration-300',
            sizeMap[size],
            variantMap(invalid)[variant],
            disabled && 'opacity-60 cursor-not-allowed',
            'hover:shadow-md focus-within:shadow-lg'
          )}
          aria-busy={loading || undefined}
        >
          <input
            ref={ref}
            id={inputId}
            className={cn(
              'flex-1 min-w-0 bg-transparent border-none focus:outline-none transition-colors duration-200',
              'placeholder:text-card-foreground',
              'text-foreground',
              disabled ? 'cursor-not-allowed' : 'cursor-text',
              'text-base leading-6'
            )}
            type={inputType}
            placeholder={placeholder}
            disabled={disabled}
            aria-invalid={invalid || undefined}
            aria-describedby={describedBy}
            value={currentValue}
            onChange={handleChange}
          />

          <div className="flex items-center gap-2 ml-2">
            {loading && (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              </div>
            )}

            {type === 'password' && (
              <button
                type="button"
                aria-label={showPwd ? 'Hide password' : 'Show password'}
                onClick={() => setShowPwd((s) => !s)}
                className="text-sm font-medium text-forground hover:text-secondary-foreground transition-colors duration-200 cursor-pointer select-none"
                disabled={disabled}
                tabIndex={0}
              >
                {showPwd ? 'Hide' : 'Show'}
              </button>
            )}

            {clearable && currentValue && !disabled && (
              <button
                type="button"
                aria-label="Clear input"
                onClick={handleClear}
                className="p-1 rounded-full bg-card text-card-foreground hover:bg-secondary hover:text-secondary-foreground transition-all duration-200 transform hover:scale-110"
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
        </div>

        {helperText && !invalid && (
          <p id={helpId} className="mt-2 text-sm text-foreground flex items-center gap-1">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            {helperText}
          </p>
        )}
        {invalid && errorMessage && (
          <p id={errId} className="mt-2 text-sm text-red-600 flex items-center gap-1 animate-pulse">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            {errorMessage}
          </p>
        )}
      </div>
    );
  }
);

InputField.displayName = 'InputField';

export default InputField;