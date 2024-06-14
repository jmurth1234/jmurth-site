import { GlobalConfig } from 'payload/types'

const Nav: GlobalConfig = {
  slug: 'nav',
  access: {
    read: () => true,
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'tagline', type: 'text', required: true },
    {
      name: 'items',
      type: 'array',
      required: true,
      maxRows: 6,
      fields: [
        { name: 'label', type: 'text', required: true },
        {
          name: 'link',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'authedItems',
      type: 'array',
      required: true,
      maxRows: 6,
      fields: [
        { name: 'label', type: 'text', required: true },
        {
          name: 'link',
          type: 'text',
          required: true,
        },
      ],
      access: {
        read: ({ req }) => {
          return !!req.user
        }
      }
    }
  ],
}

export default Nav
