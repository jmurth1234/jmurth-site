import { CollectionConfig } from 'payload/types'
import ContentArea from '../fields/content-area'

const ProjectCategories: CollectionConfig = {
  slug: 'project-categories',
  admin: {
    useAsTitle: 'title',
  },
  access: {
    read: ({ req }) => {
      if (req.user) return true

      return {
        _status: {
          equals: 'published',
        },
      }
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
