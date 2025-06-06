import { Block, Field } from 'payload'
import Editor from '../../components/Editor'
import { HeadingFeature, lexicalEditor, lexicalHTML } from '@payloadcms/richtext-lexical'
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

export const FormBlock: Block = {
  slug: 'formBlock',
  fields: [
    {
      name: 'form',
      type: 'relationship',
      relationTo: 'forms',
      required: true,
    },
    {
      name: 'enableIntro',
      type: 'checkbox',
      label: 'Enable Intro Content',
    },
    {
      name: 'introContent',
      type: 'richText',
      admin: {
        condition: (_, { enableIntro }) => Boolean(enableIntro),
      },
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [...rootFeatures, HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3'] })]
        },
      }),
      label: 'Intro Content',
    },
    lexicalHTML('introContent', { name: 'introHtml' }),
  ],
  graphQL: {
    singularName: 'FormBlock',
  },
  labels: {
    plural: 'Form Blocks',
    singular: 'Form Block',
  },
}

const ContentArea: Field = {
  name: 'contentArea',
  type: 'blocks',
  labels: {
    singular: 'Content Area',
    plural: 'Content Areas',
  },
  blocks: [MarkdownBlock, RichTextArea, ImageBlock, FormBlock],
}

export default ContentArea
