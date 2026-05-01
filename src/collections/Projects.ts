import { CollectionConfig } from 'payload'
import ContentArea from '../fields/content-area'

import slugg from 'slugify'

const Projects: CollectionConfig = {
  slug: 'projects',
  admin: {
    useAsTitle: 'title',
  },
  access: {
    create: ({ req }) => {
      return !!req.user
    },
    update: ({ req }) => {
      return !!req.user
    },
    read: ({ req }) => {
      if (req.user) return true

      return {
        _status: {
          equals: 'published',
        },
      }
    },
    readVersions: ({ req }) => {
      return !!req.user
    },
    delete: ({ req }) => {
      return !!req.user
    },
  },
  fields: [
    {
      name: 'title',
      label: 'Title',
      type: 'text',
      required: true,
    },
    {
      name: 'featured',
      label: 'Featured',
      type: 'checkbox',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'showcase',
      label: 'Showcase',
      type: 'checkbox',
      admin: {
        position: 'sidebar',
        description: 'Use for the richer portfolio/project showcase treatment.',
      },
    },
    {
      name: 'showcaseOrder',
      label: 'Showcase Order',
      type: 'number',
      admin: {
        position: 'sidebar',
        description: 'Lower numbers appear first when projects are curated manually.',
      },
    },
    {
      name: 'slug',
      label: 'Slug',
      type: 'text',
      unique: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'description',
      label: 'Description',
      type: 'text',
      required: true,
    },
    {
      name: 'shortDeck',
      label: 'Short Deck',
      type: 'textarea',
      admin: {
        description: 'A punchier one or two sentence summary for showcase cards and hero sections.',
      },
    },
    {
      name: 'role',
      label: 'Role',
      type: 'text',
    },
    {
      name: 'timeframe',
      label: 'Timeframe',
      type: 'text',
    },
    {
      name: 'archiveNote',
      label: 'Archive Note',
      type: 'textarea',
      admin: {
        description: 'Context shown on legacy or inactive projects without rewriting the historical page copy.',
      },
    },
    {
      name: 'featuredMedia',
      label: 'Featured Media',
      type: 'relationship',
      relationTo: 'media',
    },
    {
      name: 'gallery',
      label: 'Gallery',
      type: 'relationship',
      relationTo: 'media',
      hasMany: true,
    },
    {
      name: 'techStack',
      label: 'Tech Stack',
      type: 'array',
      fields: [
        {
          name: 'label',
          label: 'Label',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'highlights',
      label: 'Highlights',
      type: 'array',
      fields: [
        {
          name: 'text',
          label: 'Text',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'outcomes',
      label: 'Outcomes',
      type: 'array',
      fields: [
        {
          name: 'text',
          label: 'Text',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'links',
      label: 'Structured Links',
      type: 'array',
      fields: [
        {
          name: 'label',
          label: 'Label',
          type: 'text',
          required: true,
        },
        {
          name: 'url',
          label: 'URL',
          type: 'text',
          required: true,
        },
        {
          name: 'kind',
          label: 'Kind',
          type: 'select',
          options: [
            { label: 'Project Site', value: 'site' },
            { label: 'Source', value: 'source' },
            { label: 'Demo', value: 'demo' },
            { label: 'Docs', value: 'docs' },
            { label: 'Article', value: 'article' },
            { label: 'Store', value: 'store' },
          ],
        },
        {
          name: 'primary',
          label: 'Primary',
          type: 'checkbox',
        },
      ],
    },
    {
      name: 'source',
      label: 'Source',
      type: 'text',
      required: false,
      admin: {
        description: 'Legacy fallback. Prefer Structured Links for new project data.',
      },
    },
    {
      name: 'site',
      label: 'Site',
      type: 'text',
      required: false,
      admin: {
        description: 'Legacy fallback. Prefer Structured Links for new project data.',
      },
    },
    {
      name: 'category',
      label: 'Category',
      type: 'relationship',
      relationTo: 'project-categories',
      required: false,
    },
    {
      name: 'state',
      label: 'State',
      type: 'select',
      options: [
        {
          label: 'Active',
          value: 'active',
        },
        {
          label: 'Inactive',
          value: 'inactive',
        },
        {
          label: 'Legacy',
          value: 'legacy',
        },
      ],

      required: true,
    },
    ContentArea,
  ],
  hooks: {
    beforeChange: [
      async ({ data }) => {
        if (!data.slug && data.title) {
          data.slug = slugg(data.title).toLowerCase()
        } else if (data.slug) {
          data.slug = slugg(data.slug).toLowerCase()
        }

        return data
      },
    ],
  },
  versions: {
    drafts: true,
  },
}

export default Projects
