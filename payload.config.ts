import path from 'path'
// import { postgresAdapter } from '@payloadcms/db-postgres'
import { en } from 'payload/i18n/en'
import { lexicalEditor, lexicalHTML } from '@payloadcms/richtext-lexical'

//import { slateEditor } from '@payloadcms/richtext-slate'
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { buildConfig } from 'payload'
import sharp from 'sharp'
import { fileURLToPath } from 'url'
import Users from '@/collections/Users'
import Projects from '@/collections/Projects'
import ProjectCategories from '@/collections/ProjectCategories'
import Pages from '@/collections/Pages'
import Posts from '@/collections/Posts'
import Media from '@/collections/Media'
import Homepage from '@/globals/Homepage'
import Nav from '@/globals/Nav'
// simport { cloudflareAdapter } from 'payload-cloud-storage-cf-img-adapter'

import { formBuilderPlugin } from '@payloadcms/plugin-form-builder'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  //editor: slateEditor({}),
  editor: lexicalEditor(),
  collections: [Users, Projects, ProjectCategories, Pages, Posts, Media],
  globals: [Homepage, Nav],
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    autoGenerate: true,
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  // db: postgresAdapter({
  //   pool: {
  //     connectionString: process.env.DATABASE_URL || '',
  //   },
  // }),
  db: mongooseAdapter({
    url: process.env.MONGODB_URI || '',
  }),

  /**
   * Payload can now accept specific translations from 'payload/i18n/en'
   * This is completely optional and will default to English if not provided
   */
  i18n: {
    supportedLanguages: { en },
  },

  admin: {
    user: Users.slug,
  },
  async onInit(payload) {
    const existingUsers = await payload.find({
      collection: 'users',
      limit: 1,
    })

    if (existingUsers.docs.length === 0) {
      await payload.create({
        collection: 'users',
        data: {
          email: 'dev@payloadcms.com',
          password: 'test',
        },
      })
    }
  },

  // Sharp is now an optional dependency -
  // if you want to resize images, crop, set focal point, etc.
  // make sure to install it and pass it to the config.

  // This is temporary - we may make an adapter pattern
  // for this before reaching 3.0 stable
  sharp,
  plugins: [
    formBuilderPlugin({
      fields: {
        payment: false,
        country: false,
        state: false,
      },
      formOverrides: {
        fields: ({ defaultFields }) => {
          return [
            ...defaultFields,
            lexicalHTML('confirmationMessage', { name: 'confirmationHtml' }),
          ]
        },
      },
    }),
  ],
})
