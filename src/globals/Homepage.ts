import { lexicalEditor, lexicalHTML } from '@payloadcms/richtext-lexical'
import { Block, Field, GlobalConfig } from 'payload'
import { lexicalConfig } from '@/fields/content-area/lib/editor-config'

const linkFields: Field[] = [
  {
    name: 'label',
    type: 'text',
  },
  {
    name: 'href',
    type: 'text',
  },
]

const HeroBlock: Block = {
  slug: 'hero',
  labels: {
    singular: 'Hero',
    plural: 'Hero',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      required: true,
    },
    {
      name: 'intro',
      type: 'richText',
      required: true,
      editor: lexicalEditor(lexicalConfig),
    },
    lexicalHTML('intro', { name: 'html' }),
    {
      name: 'primaryCta',
      type: 'group',
      fields: linkFields,
    },
    {
      name: 'secondaryCta',
      type: 'group',
      fields: linkFields,
    },
    {
      name: 'profileImage',
      type: 'upload',
      relationTo: 'media',
    },
  ],
}

const ProfileHighlightsBlock: Block = {
  slug: 'profileHighlights',
  labels: {
    singular: 'Profile Highlights',
    plural: 'Profile Highlights',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      defaultValue: 'What I work on',
    },
    {
      name: 'highlights',
      type: 'array',
      minRows: 3,
      maxRows: 6,
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
          required: true,
        },
      ],
    },
  ],
}

const FeaturedProjectsBlock: Block = {
  slug: 'featuredProjects',
  labels: {
    singular: 'Featured Projects',
    plural: 'Featured Projects',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      defaultValue: 'Featured Projects',
    },
    {
      name: 'intro',
      type: 'textarea',
    },
    {
      name: 'projects',
      type: 'relationship',
      relationTo: 'projects',
      hasMany: true,
    },
    {
      name: 'limit',
      type: 'number',
      defaultValue: 4,
      min: 1,
      max: 8,
    },
  ],
}

const LatestPostsBlock: Block = {
  slug: 'latestPosts',
  labels: {
    singular: 'Latest Posts',
    plural: 'Latest Posts',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      defaultValue: 'Latest Posts',
    },
    {
      name: 'intro',
      type: 'textarea',
    },
    {
      name: 'limit',
      type: 'number',
      defaultValue: 4,
      min: 1,
      max: 12,
    },
  ],
}

const ContactCtaBlock: Block = {
  slug: 'contactCta',
  labels: {
    singular: 'Contact CTA',
    plural: 'Contact CTAs',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      required: true,
    },
    {
      name: 'copy',
      type: 'textarea',
    },
    {
      name: 'links',
      type: 'array',
      maxRows: 4,
      fields: linkFields,
    },
  ],
}

const Homepage: GlobalConfig = {
  slug: 'homepage',
  access: {
    read: () => true,
    update: ({ req }) => {
      return !!req.user
    },
  },
  admin: {
    livePreview: {
      url: ({ data }) => {
        return `${process.env.PAYLOAD_PUBLIC_SITE_URL}`
      },
    },
  },
  fields: [
    {
      name: 'introText',
      type: 'richText',
      editor: lexicalEditor(lexicalConfig),
    },
    lexicalHTML('introText', { name: 'html' }),
    {
      name: 'sections',
      type: 'blocks',
      labels: {
        singular: 'Homepage Section',
        plural: 'Homepage Sections',
      },
      blocks: [
        HeroBlock,
        ProfileHighlightsBlock,
        FeaturedProjectsBlock,
        LatestPostsBlock,
        ContactCtaBlock,
      ],
    },
  ],
  versions: {
    drafts: {
      autosave: {
        interval: 375,
      },
    },
  },
}

export default Homepage
