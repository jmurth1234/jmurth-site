import type { MetadataRoute } from 'next'
import getPayload from '@/lib/payload-getter'
import { absoluteUrl } from '@/lib/site'
import { getProjectPath } from '@/lib/projects'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { payload } = await getPayload()

  const [pages, posts, projects] = await Promise.all([
    payload.find({
      collection: 'pages',
      limit: 100,
      overrideAccess: false,
    }),
    payload.find({
      collection: 'posts',
      limit: 500,
      where: {
        hidden: {
          not_equals: true,
        },
      },
      overrideAccess: false,
    }),
    payload.find({
      collection: 'projects',
      limit: 500,
      overrideAccess: false,
    }),
  ])

  return [
    {
      url: absoluteUrl('/'),
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: absoluteUrl('/posts'),
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: absoluteUrl('/projects'),
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    ...pages.docs
      .filter((page) => !!page.url)
      .map((page) => ({
        url: absoluteUrl(page.url || '/'),
        lastModified: new Date(page.updatedAt),
        changeFrequency: 'monthly' as const,
        priority: 0.6,
      })),
    ...posts.docs
      .filter((post) => !!post.url)
      .map((post) => ({
        url: absoluteUrl(post.url || '/posts'),
        lastModified: new Date(post.updatedAt),
        changeFrequency: 'monthly' as const,
        priority: 0.5,
      })),
    ...projects.docs
      .filter((project) => !!project.slug)
      .map((project) => ({
        url: absoluteUrl(getProjectPath(project)),
        lastModified: new Date(project.updatedAt),
        changeFrequency: 'monthly' as const,
        priority: project.showcase ? 0.8 : 0.5,
      })),
  ]
}
