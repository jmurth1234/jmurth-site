import type { FieldErrorsImpl, FieldValues, UseFormRegister } from 'react-hook-form'

import React, { useState } from 'react'

import { CheckboxField } from '@payloadcms/plugin-form-builder/types'

export const Checkbox: React.FC<
  CheckboxField & {
    errors: Partial<
      FieldErrorsImpl<{
        [x: string]: any
      }>
    >
    getValues: any
    register: UseFormRegister<FieldValues & any>
    setValue: any
  }
> = ({
  name,
  errors,
  getValues,
  label,
  register,
  required: requiredFromProps,
  setValue,
  width,
}) => {
  const isCheckboxChecked = getValues(name)
  const fieldError = errors?.[name]

  return (
    <div>
      <label htmlFor={name} className="flex items-center gap-2 font-bold text-slate-800">
      <input
        type="checkbox"
        id={name}
        aria-invalid={!!fieldError}
        aria-describedby={fieldError ? `${name}-error` : undefined}
        required={!!requiredFromProps}
        checked={isCheckboxChecked}
        {...register(name, { required: requiredFromProps })}
      />
      {label}
      {requiredFromProps && <span>*</span>}
      </label>
      {fieldError && (
        <p id={`${name}-error`} className="mt-1 text-sm font-bold text-red-700">
          {label || 'This field'} is required.
        </p>
      )}
    </div>
  )
}
