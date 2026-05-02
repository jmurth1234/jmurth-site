import getPayload from '@/lib/payload-getter'
import { getAbsoluteUrl, getSiteSettings } from '@/lib/site'
import { MetadataRoute } from 'next'

export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { payload } = await getPayload()
  const siteSettings = await getSiteSettings(payload)

  const [pages, posts, projects] = await Promise.all([
    payload.find({
      collection: 'pages',
      limit: 1000,
      overrideAccess: false,
    }),
    payload.find({
      collection: 'posts',
      limit: 1000,
      sort: '-createdAt',
      where: {
        hidden: {
          not_equals: true,
        },
      },
      overrideAccess: false,
    }),
    payload.find({
      collection: 'projects',
      limit: 1000,
      sort: 'title',
      overrideAccess: false,
    }),
  ])

  return [
    {
      url: getAbsoluteUrl('/', siteSettings),
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: getAbsoluteUrl('/posts', siteSettings),
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: getAbsoluteUrl('/projects', siteSettings),
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    ...pages.docs
      .filter((page) => page.url)
      .map((page) => ({
        url: getAbsoluteUrl(page.url || '/', siteSettings),
        lastModified: page.updatedAt || page.createdAt,
        changeFrequency: 'monthly' as const,
        priority: page.url === '/about' ? 0.8 : 0.6,
      })),
    ...posts.docs
      .filter((post) => post.url)
      .map((post) => ({
        url: getAbsoluteUrl(post.url || '/', siteSettings),
        lastModified: post.updatedAt || post.createdAt,
        changeFrequency: 'yearly' as const,
        priority: 0.5,
      })),
    ...projects.docs
      .filter((project) => project.slug)
      .map((project) => ({
        url: getAbsoluteUrl(`/projects/${project.slug}`, siteSettings),
        lastModified: project.updatedAt || project.createdAt,
        changeFrequency: 'monthly' as const,
        priority: project.featured ? 0.8 : 0.6,
      })),
  ]
}
