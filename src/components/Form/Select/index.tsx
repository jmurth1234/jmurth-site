import type { Control, FieldErrorsImpl, FieldValues } from 'react-hook-form'

import React from 'react'
import { Controller } from 'react-hook-form'
import ReactSelect from 'react-select'

import { SelectField } from 'payload'

export const Select: React.FC<
  SelectField & {
    control: Control<FieldValues, any>
    errors: Partial<
      FieldErrorsImpl<{
        [x: string]: any
      }>
    >
    label: string
  }
> = ({ name, control, errors, label, options, required }) => {
  const fieldError = errors?.[name]

  return (
    <div>
      <label htmlFor={name} className="font-bold text-slate-800">
        {label} {required && <span>*</span>}
      </label>
      <Controller
        control={control}
        defaultValue=""
        name={name}
        render={({ field: { onChange, value } }) => (
          <ReactSelect
            classNamePrefix="rs"
            inputId={name}
            instanceId={name}
            onChange={(val: any) => onChange(val.value)}
            options={options}
            aria-invalid={!!fieldError}
            aria-describedby={fieldError ? `${name}-error` : undefined}
            value={options.find((s: any) => s.value === value)}
          />
        )}
        rules={{ required: required ? `${label || 'This field'} is required.` : false }}
      />
      {fieldError && (
        <p id={`${name}-error`} className="mt-1 text-sm font-bold text-red-700">
          {typeof fieldError.message === 'string' ? fieldError.message : `${label || 'This field'} is required.`}
        </p>
      )}
    </div>
  )
}
