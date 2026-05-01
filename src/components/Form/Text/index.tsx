import type { FieldErrorsImpl, FieldValues, UseFormRegister } from 'react-hook-form'

import React from 'react'

import { TextField, TextAreaField, EmailField } from '@payloadcms/plugin-form-builder/types'

type Field = TextField | TextAreaField | EmailField

export const Text: React.FC<
  Field & {
    errors: Partial<
      FieldErrorsImpl<{
        [x: string]: any
      }>
    >
    register: UseFormRegister<FieldValues & any>
  }
> = ({ blockType, name, errors, label, register, required: requiredFromProps, width }) => {
  const Input = blockType === 'textarea' ? 'textarea' : 'input'
  const fieldError = errors?.[name]
  const errorMessage =
    typeof fieldError?.message === 'string' ? fieldError.message : `${label || 'This field'} is required.`
  const isEmail = blockType === 'email' || name.toLowerCase().includes('email')
  const inputType = isEmail ? 'email' : 'text'
  const autoComplete = isEmail ? 'email' : name.toLowerCase().includes('name') ? 'name' : undefined

  return (
    <div className="w-full">
      <label htmlFor={name} className="font-bold text-slate-800">
        {label} {requiredFromProps && <span>*</span>}
      </label>
      <Input
        id={name}
        type={inputType}
        required={!!requiredFromProps}
        aria-required={!!requiredFromProps}
        aria-invalid={!!fieldError}
        aria-describedby={fieldError ? `${name}-error` : undefined}
        autoComplete={autoComplete}
        {...register(name, {
          required: requiredFromProps ? `${label || 'This field'} is required.` : false,
          pattern: isEmail
            ? {
                value: /^\S+@\S+\.\S+$/,
                message: 'Enter a valid email address.',
              }
            : undefined,
        })}
        className={`w-full form-${name} rounded-md border-slate-300 px-4 py-3 shadow-sm focus:border-nav-header focus:ring-nav-header`}
      />
      {fieldError && (
        <p id={`${name}-error`} className="mt-1 text-sm font-bold text-red-700">
          {errorMessage}
        </p>
      )}
    </div>
  )
}
