import { CollectionConfig } from 'payload/types'

const Users: CollectionConfig = {
  slug: 'users',
  auth: {
    tokenExpiration: 60 * 60 * 24 * 7, // 7 days
  },
  admin: {
    useAsTitle: 'email',
  },
  access: {
    create: ({ req }) => {
      return !!req.user
    },
    update: ({ req }) => {
      return !!req.user
    },
    read: ({ req }) => {
      return !!req.user
    },
    delete: ({ req }) => {
      return !!req.user
    },
  },
  fields: [
    // Email added by default
    // Add more fields as needed
  ],
}

export default Users
