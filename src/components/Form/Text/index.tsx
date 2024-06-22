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
  return (
    <div className="w-full">
      <label htmlFor={name}>
        {label} {requiredFromProps && <span>*</span>}
      </label>
      <Input
        id={name}
        type={blockType === 'email' ? 'email' : 'text'}
        {...register(name, { required: requiredFromProps })}
        className="w-full py-2 px-4 rounded shadow-md border-gray-300 focus:border-gray-500 focus:ring-gray-500 focus:ring-1 focus:outline-none focus:shadow-lg"
      />
    </div>
  )
}
