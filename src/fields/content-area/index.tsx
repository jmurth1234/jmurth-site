import { Block, Field } from 'payload/types'
import Editor from '../../components/Editor'
import { lexicalEditor, lexicalHTML } from '@payloadcms/richtext-lexical'
import { lexicalConfig } from './lib/editor-config'

const MarkdownBlock: Block = {
  slug: 'markdown',
  labels: {
    singular: 'Markdown',
    plural: 'Markdown',
  },
  fields: [
    {
      name: 'content',
      type: 'code',
      label: 'Content',
      admin: {
        language: 'markdown',
      },
      // admin: {
      //   components: {
      //     Field: Editor,
      //   },
      // },
    },
  ],
}

const RichTextArea: Block = {
  slug: 'rich-text-area',
  labels: {
    singular: 'Rich Text Area',
    plural: 'Rich Text Areas',
  },
  fields: [
    {
      name: 'content',
      type: 'richText',
      label: 'Content',
      editor: lexicalEditor(lexicalConfig),
    },
    lexicalHTML('content', { name: 'html' }),
  ],
}

const ImageBlock: Block = {
  slug: 'image',
  labels: {
    singular: 'Image',
    plural: 'Images',
  },
  fields: [
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: 'Image',
    },
  ],
}

const ContentArea: Field = {
  name: 'contentArea',
  type: 'blocks',
  labels: {
    singular: 'Content Area',
    plural: 'Content Areas',
  },
  blocks: [MarkdownBlock, RichTextArea, ImageBlock],
}

export default ContentArea
