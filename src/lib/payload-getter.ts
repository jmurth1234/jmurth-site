import config from '@payload-config'
import { headers as getHeaders } from 'next/headers'
import { getPayloadHMR } from '@payloadcms/next/utilities'

export default async function getPayload() {
  const headers = getHeaders()
  const payload = await getPayloadHMR({ config })
  const { user } = await payload.auth({ headers })

  return {
    payload,
    user,
  }
}
