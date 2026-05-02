import { PostExcerpt } from '../components/PostSummary'
import { Post } from 'payload-types'
import toMarkdown from './string-to-markdown'
import html2plaintext from 'html2plaintext'

const truncate = (text: string, maxLength = 220) => {
  const normalized = text.replace(/\s+/g, ' ').trim()

  if (normalized.length <= maxLength) {
    return normalized
  }

  return `${normalized.slice(0, maxLength).replace(/\s+\S*$/, '')}...`
}

export function createDataSummary(item: Post): PostExcerpt {
  const post = item as PostExcerpt

  const findFirst = post.contentArea?.find(
    (block) => block.blockType === 'markdown' || block.blockType === 'rich-text-area',
  )

  if (!findFirst) {
    return post
  }

  if (findFirst.blockType === 'markdown') {
    const text = toMarkdown(findFirst.content || '').toPlainText()

    post.excerpt = post.description || truncate(text)
  } else if (findFirst.blockType === 'rich-text-area') {
    const text = html2plaintext(findFirst.html || '')

    post.excerpt = post.description || truncate(text)
  }

  return post
}
