import config from '@payload-config'
import { headers as getHeaders } from 'next/headers'
import { getPayload as _getPayload } from 'payload'

export default async function getPayload() {
  const headers = await getHeaders()
  const payload = await _getPayload({ config })
  const { user } = await payload.auth({ headers })

  return {
    payload,
    user,
  }
}
