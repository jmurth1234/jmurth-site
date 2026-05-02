import { Media } from 'payload-types'

export type SiteSettingsLike = {
  defaultTitle?: string | null
  defaultDescription?: string | null
  canonicalBaseUrl?: string | null
  socialImage?: string | Media | null
  personName?: string | null
  jobTitle?: string | null
  professionalBio?: string | null
  profileLinks?:
    | {
        label?: string | null
        url?: string | null
      }[]
    | null
}

export const DEFAULT_SITE_URL = 'https://jmurth.co.uk'
export const DEFAULT_PERSON_NAME = 'Jessica Murthick'
export const DEFAULT_JOB_TITLE = 'Software Engineer'
export const DEFAULT_SITE_TITLE = `${DEFAULT_PERSON_NAME} - ${DEFAULT_JOB_TITLE}`
export const DEFAULT_DESCRIPTION =
  'Jessica Murthick is a software engineer working with complex web apps, React Native, Payload, Next.js, and thoughtful AI integrations.'

export const trimTrailingSlash = (value: string) => value.replace(/\/$/, '')

export const getCanonicalBase = (settings?: SiteSettingsLike | null) => {
  return trimTrailingSlash(
    settings?.canonicalBaseUrl || process.env.PAYLOAD_PUBLIC_SITE_URL || DEFAULT_SITE_URL,
  )
}

export const getAbsoluteUrl = (path = '/', settings?: SiteSettingsLike | null) => {
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path
  }

  const normalizedPath = path.startsWith('/') ? path : `/${path}`

  return `${getCanonicalBase(settings)}${normalizedPath}`
}

export const getMediaUrl = (
  media?: string | Media | null,
  settings?: SiteSettingsLike | null,
) => {
  if (!media) return null

  const url =
    typeof media === 'string'
      ? media
      : media.sizes?.tablet?.url || media.sizes?.card?.url || media.url

  if (!url) return null

  return getAbsoluteUrl(url, settings)
}

export const getSeoTitle = (settings?: SiteSettingsLike | null) => {
  return settings?.defaultTitle || DEFAULT_SITE_TITLE
}

export const getSeoDescription = (settings?: SiteSettingsLike | null) => {
  return settings?.defaultDescription || settings?.professionalBio || DEFAULT_DESCRIPTION
}

export const getPersonName = (settings?: SiteSettingsLike | null) => {
  return settings?.personName || DEFAULT_PERSON_NAME
}

export const getJobTitle = (settings?: SiteSettingsLike | null) => {
  return settings?.jobTitle || DEFAULT_JOB_TITLE
}

export const getProfileLinks = (settings?: SiteSettingsLike | null) => {
  return (
    settings?.profileLinks
      ?.filter((link) => link?.url)
      .map((link) => ({
        label: link.label || link.url || '',
        url: link.url || '',
      })) || []
  )
}

export const getSiteSettings = async (payload: {
  findGlobal: (args: { slug: 'siteSettings' }) => Promise<unknown>
}) => {
  try {
    return (await payload.findGlobal({
      slug: 'siteSettings',
    })) as SiteSettingsLike
  } catch {
    return null
  }
}
