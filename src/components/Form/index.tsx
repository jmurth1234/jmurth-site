'use client'
import type { Form as FormType } from '@payloadcms/plugin-form-builder/types'

import { useRouter } from 'next/navigation'
import React, { useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'

import { buildInitialFormState } from './buildInitialFormState'
import { fields } from './fields'
import RichText from '../RichText'
import { Form } from 'payload-types'

export type Value = unknown

export interface Property {
  [key: string]: Value
}

export interface Data {
  [key: string]: Property | Property[] | Value
}

export type FormBlockType = {
  blockName?: string
  blockType?: 'formBlock'
  enableIntro: boolean
  form: Form & FormType
  introContent?: {
    [k: string]: unknown
  }[]
}

export const FormBlock: React.FC<
  FormBlockType & {
    id?: string
  }
> = (props) => {
  const {
    enableIntro,
    form: formFromProps,
    form: { id: formID, confirmationHtml, confirmationType, redirect, submitButtonLabel } = {},
    introContent,
  } = props

  const formMethods = useForm({
    defaultValues: buildInitialFormState(formFromProps.fields),
    mode: 'onBlur',
  })
  const {
    control,
    formState: { errors },
    getValues,
    handleSubmit,
    register,
    setValue,
  } = formMethods

  const [isLoading, setIsLoading] = useState(false)
  const [hasSubmitted, setHasSubmitted] = useState<boolean>()
  const [error, setError] = useState<{ message: string; status?: string } | undefined>()
  const router = useRouter()

  const onSubmit = useCallback(
    (data: Data) => {
      let loadingTimerID: ReturnType<typeof setTimeout>
      const submitForm = async () => {
        setError(undefined)

        const dataToSend = Object.entries(data).map(([name, value]) => ({
          field: name,
          value,
        }))

        // delay loading indicator by 1s
        loadingTimerID = setTimeout(() => {
          setIsLoading(true)
        }, 1000)

        try {
          const req = await fetch(`/api/form-submissions`, {
            body: JSON.stringify({
              form: formID,
              submissionData: dataToSend,
            }),
            headers: {
              'Content-Type': 'application/json',
            },
            method: 'POST',
          })

          const res = await req.json()

          clearTimeout(loadingTimerID)

          if (req.status >= 400) {
            setIsLoading(false)

            setError({
              message: res.errors?.[0]?.message || 'Internal Server Error',
              status: res.status,
            })

            return
          }

          setIsLoading(false)
          setHasSubmitted(true)

          if (confirmationType === 'redirect' && redirect) {
            const { url } = redirect

            const redirectUrl = url

            if (redirectUrl) router.push(redirectUrl)
          }
        } catch (err) {
          console.warn(err)
          setIsLoading(false)
          setError({
            message: 'Something went wrong.',
          })
        }
      }

      void submitForm()
    },
    [router, formID, redirect, confirmationType],
  )

  return (
    <div className="my-4">
      {enableIntro && introContent && !hasSubmitted && <RichText content={introContent} />}
      {!isLoading && hasSubmitted && confirmationType === 'message' && (
        <RichText content={confirmationHtml} />
      )}
      {isLoading && !hasSubmitted && (
        <p className="rounded-md border border-slate-200 bg-white p-4 font-bold text-slate-700" role="status">
          Sending, please wait...
        </p>
      )}
      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 p-4 font-bold text-red-800" role="alert">
          {`${error.status || '500'}: ${error.message || ''}`}
        </div>
      )}
      {!hasSubmitted && (
        <form id={formID} onSubmit={handleSubmit(onSubmit)} className="prose" noValidate>
          {Object.keys(errors).length > 0 && (
            <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-800" role="alert">
              Please check the highlighted fields.
            </div>
          )}
          <div className="space-y-4">
            {formFromProps &&
              formFromProps.fields &&
              formFromProps.fields.map((field, index) => {
                if (!field.blockType) return null

                const Field: React.FC<any> = fields?.[field.blockType]
                if (Field) {
                  return (
                    <React.Fragment key={index}>
                      <Field
                        form={formFromProps}
                        {...field}
                        {...formMethods}
                        control={control}
                        errors={errors}
                        register={register}
                      />
                    </React.Fragment>
                  )
                }
                return null
              })}
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary mt-4 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitButtonLabel || 'Submit'}
          </button>
        </form>
      )}
    </div>
  )
}
