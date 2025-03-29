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
  return (
    <div>
      <label htmlFor={name}>{label}</label>
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
            value={options.find((s: any) => s.value === value)}
          />
        )}
        rules={{ required }}
      />
    </div>
  )
}
