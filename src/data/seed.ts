import { getPayload } from 'payload'
import { importConfig } from 'payload/node'
import 'dotenv/config'
import retrieveFrontmatter from './retrieve-frontmatter'
import slugify from 'slugify'

function filterTrailingSlash(str: string) {
  return str.replace(/\/$/, '')
}

const createPages = async () => {
  const awaitedConfig = await importConfig('../../payload.config.ts')
  const payload = await getPayload({ config: awaitedConfig })

  try {
    await Promise.all(
      ['pages', 'posts', 'projects'].map(async (collection) => {
        await payload.delete({
          collection: collection as 'pages' | 'posts' | 'projects',
          where: {},
        })
      }),
    )
  } catch (error) {
    console.error('Error deleting existing documents', error)
  }

  const pages = await retrieveFrontmatter()

  for (const page of pages) {
    if (!page.content) continue

    console.log('Creating page', page.frontmatter.title)

    if (page.frontmatter.type === 'project') {
      await payload.create({
        collection: 'projects',
        data: {
          title: page.frontmatter.title,
          description: page.frontmatter.description,
          source: page.frontmatter.source,
          site: page.frontmatter.site,
          category: page.frontmatter.category,
          state: page.frontmatter.status,
          contentArea: [
            {
              blockType: 'markdown',
              content: page.content,
            },
          ],
          slug: slugify(page.frontmatter.title, { lower: true }),
          _status: 'published',
        },
      })
    } else if (page.frontmatter.type === 'post' || page.frontmatter.type === 'page') {
      const url =
        page.frontmatter.type === 'page'
          ? page.frontmatter.url || `/${slugify(page.frontmatter.title, { lower: true })}`
          : filterTrailingSlash(page.frontmatter.url)

      await payload.create({
        collection: `${page.frontmatter.type}s` as 'posts' | 'pages',
        data: {
          title: page.frontmatter.title,
          description: page.frontmatter.description,
          createdAt: new Date(page.frontmatter.date).toISOString(),
          url,
          contentArea: [
            {
              blockType: 'markdown',
              content: page.content,
            },
          ],
          _status: 'published',
        },
      })
    }
  }

  console.log('Seed completed!')
  process.exit(0)
}

createPages()
