import { CollectionConfig } from 'payload'
import slugify from 'slugify'
import ContentArea from '../fields/content-area'

const Posts: CollectionConfig = {
  slug: 'posts',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'date', 'url'],
    livePreview: {
      url: ({ data }) => {
        return `${process.env.PAYLOAD_PUBLIC_SITE_URL}${data.url}`
      },
    },
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
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'hidden',
      type: 'checkbox',
      label: 'Hidden',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'url',
      type: 'text',
      admin: {
        position: 'sidebar',
      },
      unique: true,
    },
    ContentArea,
  ],
  hooks: {
    beforeChange: [
      async ({ data }) => {
        if (!data) return

        if (!data.createdAt) {
          data.createdAt = new Date()
        }

        if (!data.url && data.title && data.createdAt) {
          // yyyy/mm/title as slug for posts
          const date = new Date(data.createdAt)
          const year = date.getFullYear()
          const month = date.getMonth() + 1

          data.url = `/${year}/${month}/${slugify(data.title).toLowerCase()}`
        }

        return data
      },
    ],
  },
  versions: {
    drafts: {
      autosave: true,
    },
  },
}

export default Posts
