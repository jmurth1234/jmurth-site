/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */
import type { Metadata } from 'next'

import config from '@payload-config'
import { RootPage, generatePageMetadata } from '@payloadcms/next/views'
import { importMap } from '../importMap'

type Args = {
  params: Promise<{
    segments?: string[]
  }>
  searchParams: Promise<{
    [key: string]: string | string[]
  }>
}

const normalizeParams = async (params: Args['params']) => {
  const resolvedParams = await params

  return {
    ...resolvedParams,
    segments: resolvedParams?.segments?.length ? resolvedParams.segments : ['login'],
  }
}

export const generateMetadata = ({ params, searchParams }: Args): Promise<Metadata> =>
  generatePageMetadata({ config, params: normalizeParams(params), searchParams })

const Page = ({ params, searchParams }: Args) =>
  RootPage({ config, params: normalizeParams(params), searchParams, importMap })

export default Page
