import { CollectionConfig } from 'payload'
import slugify from 'slugify'
import ContentArea from '../fields/content-area'

const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'date'],
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

        if (!data.url && data.title) {
          data.url = `/${slugify(data.title).toLowerCase()}`
        } else if (data.url) {
          data.url = `/${slugify(data.url).toLowerCase()}`
        }

        return data
      },
    ],
  },
  versions: {
    drafts: {
      autosave: {
        interval: 375,
      },
    },
  },
}

export default Pages
