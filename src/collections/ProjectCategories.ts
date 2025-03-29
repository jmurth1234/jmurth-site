import { CollectionConfig } from 'payload'
import ContentArea from '../fields/content-area'

const ProjectCategories: CollectionConfig = {
  slug: 'project-categories',
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
      name: 'order',
      label: 'Order',
      type: 'number',
      required: true,
    },
    ContentArea,
  ],
  versions: {
    drafts: true,
  },
}

export default ProjectCategories
