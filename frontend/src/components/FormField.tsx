import type { ChangeEvent } from 'react'

interface FormFieldProps {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  type?: 'text' | 'number'
  required?: boolean
  min?: number
  step?: number | 'any'
  placeholder?: string
  helperText?: string
  suggestions?: readonly string[]
}

function FormField({
  id,
  label,
  value,
  onChange,
  type = 'text',
  required = false,
  min,
  step,
  placeholder,
  helperText,
  suggestions,
}: FormFieldProps) {
  const listId = suggestions?.length ? `${id}-suggestions` : undefined

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    onChange(event.target.value)
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-ink" htmlFor={id}>
        {label}
        {required && <span className="ml-1 text-accent">*</span>}
      </label>
      <input
        autoComplete="off"
        className="min-h-12 w-full rounded-lg border border-line bg-white px-4 text-sm text-ink outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
        id={id}
        list={listId}
        min={min}
        name={id}
        onChange={handleChange}
        placeholder={placeholder}
        required={required}
        step={step}
        type={type}
        value={value}
        aria-describedby={helperText ? `${id}-help` : undefined}
      />
      {listId && (
        <datalist id={listId}>
          {suggestions?.map((suggestion) => (
            <option key={suggestion} value={suggestion} />
          ))}
        </datalist>
      )}
      {helperText && (
        <p className="text-xs leading-5 text-muted" id={`${id}-help`}>
          {helperText}
        </p>
      )}
    </div>
  )
}

export default FormField
