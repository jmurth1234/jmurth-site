import { GlobalConfig } from 'payload'

const SiteSettings: GlobalConfig = {
  slug: 'siteSettings',
  label: 'Site Settings',
  access: {
    read: () => true,
    update: ({ req }) => {
      return !!req.user
    },
  },
  fields: [
    {
      name: 'defaultTitle',
      label: 'Default SEO Title',
      type: 'text',
    },
    {
      name: 'defaultDescription',
      label: 'Default SEO Description',
      type: 'textarea',
    },
    {
      name: 'canonicalBaseUrl',
      label: 'Canonical Base URL',
      type: 'text',
      admin: {
        description: 'Example: https://jmurth.co.uk',
      },
    },
    {
      name: 'socialImage',
      label: 'Default Social Image',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'personName',
      label: 'Person Name',
      type: 'text',
    },
    {
      name: 'jobTitle',
      label: 'Job Title',
      type: 'text',
    },
    {
      name: 'professionalBio',
      label: 'Professional Bio',
      type: 'textarea',
    },
    {
      name: 'profileLinks',
      label: 'Profile Links',
      type: 'array',
      maxRows: 8,
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
        },
        {
          name: 'url',
          type: 'text',
          required: true,
        },
      ],
    },
  ],
}

export default SiteSettings
