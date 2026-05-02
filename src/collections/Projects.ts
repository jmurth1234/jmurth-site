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
      name: 'summary',
      label: 'Short Summary',
      type: 'textarea',
    },
    {
      name: 'techStack',
      label: 'Tech Stack',
      type: 'array',
      maxRows: 12,
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
      name: 'role',
      label: 'Role',
      type: 'text',
    },
    {
      name: 'impact',
      label: 'Impact',
      type: 'textarea',
    },
    {
      name: 'year',
      label: 'Year',
      type: 'number',
      min: 2000,
      max: 2100,
    },
    {
      name: 'priority',
      label: 'Priority',
      type: 'number',
      admin: {
        position: 'sidebar',
        description: 'Higher numbers appear first when project lists use priority sorting.',
      },
    },
    {
      name: 'source',
      label: 'Source',
      type: 'text',
      required: false,
    },
    {
      name: 'site',
      label: 'Site',
      type: 'text',
      required: false,
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
