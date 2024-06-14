import { PostExcerpt } from '../components/PostSummary'
import { Post } from 'payload-types'
import toMarkdown from './string-to-markdown'
import html2plaintext from 'html2plaintext'

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

    post.excerpt = text
  } else if (findFirst.blockType === 'rich-text-area') {
    const text = html2plaintext(findFirst.html || '')

    post.excerpt = text
  }

  return post
}
