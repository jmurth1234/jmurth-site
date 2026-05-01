export const siteUrl = process.env.PAYLOAD_PUBLIC_SITE_URL || 'https://jmurth.co.uk'

export function absoluteUrl(path = '/') {
  return new URL(path, siteUrl).toString()
}
