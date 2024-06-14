import { marked } from 'marked'
import html2plaintext from 'html2plaintext'

export default function toMarkdown(string: string) {
  const content = marked(string, {
    smartypants: true,
  })

  const toPlainText = function () {
    return html2plaintext(content)
  }

  return { content, toPlainText }
}
