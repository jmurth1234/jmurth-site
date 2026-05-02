import { getAbsoluteUrl, getCanonicalBase, getSiteSettings } from '@/lib/site'
import getPayload from '@/lib/payload-getter'
import { MetadataRoute } from 'next'

export const dynamic = 'force-dynamic'

export default async function robots(): Promise<MetadataRoute.Robots> {
  const { payload } = await getPayload()
  const siteSettings = await getSiteSettings(payload)

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/api'],
    },
    sitemap: getAbsoluteUrl('/sitemap.xml', siteSettings),
    host: getCanonicalBase(siteSettings),
  }
}
