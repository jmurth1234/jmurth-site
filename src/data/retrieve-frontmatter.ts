import grayMatter from 'gray-matter'
import { glob } from 'glob'
import path from 'path'
import fs from 'fs'
import { promisify } from 'util'
import slugify from 'slugify'
import toMarkdown from './string-to-markdown'

export default async function retrieveFrontmatter() {
  const base = path.resolve()
  const contentPath = path.join(base, 'src/content/**/*.md')

  const files = await glob.glob(contentPath)

  function firstFourLines(content: string) {
    return toMarkdown(content).toPlainText()
  }

  const matter = await Promise.all(
    files.map(async (file) => {
      const content = await promisify(fs.readFile)(file)

      return grayMatter(content)
    }),
  )

  const processed = matter.map((info) => ({
    ...info,
    html: toMarkdown(info.content).content,
    slug: info.data.url || `/${slugify(info.data.title).toLowerCase()}/`,
    orig: null,
    frontmatter: info.data,
    excerpt: firstFourLines(info.content),
  }))

  return processed
}
