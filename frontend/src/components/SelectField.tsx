import { ChevronDown } from 'lucide-react'

interface SelectFieldProps {
  id: string
  label: string
  value: string
  options: readonly string[]
  onChange: (value: string) => void
  placeholder: string
  required?: boolean
  disabled?: boolean
}

function SelectField({
  id,
  label,
  value,
  options,
  onChange,
  placeholder,
  required = false,
  disabled = false,
}: SelectFieldProps) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-ink" htmlFor={id}>
        {label}
        {required && <span className="ml-1 text-accent">*</span>}
      </label>
      <div className="relative">
        <select
          className="min-h-12 w-full appearance-none rounded-lg border border-line bg-white px-4 pr-10 text-sm text-ink outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={disabled}
          id={id}
          name={id}
          onChange={(event) => onChange(event.target.value)}
          required={required}
          value={value}
        >
          <option disabled={required} value="">
            {placeholder}
          </option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <ChevronDown
          aria-hidden="true"
          className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-muted"
          size={16}
        />
      </div>
    </div>
  )
}

export default SelectField
