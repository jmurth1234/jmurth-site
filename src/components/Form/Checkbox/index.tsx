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

  return (
    <label htmlFor={name}>
      <input
        type="checkbox"
        id={name}
        
        checked={isCheckboxChecked}
        {...register(name, { required: requiredFromProps })}
      />
      {label}
      {requiredFromProps && <span>*</span>}
    </label>
  )
}
