import { GlobalConfig } from 'payload'

const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site Settings',
  access: {
    read: () => true,
    update: ({ req }) => {
      return !!req.user
    },
  },
  fields: [
    {
      name: 'footerText',
      label: 'Footer Text',
      type: 'text',
    },
    {
      name: 'projectsTitle',
      label: 'Projects Page Title',
      type: 'text',
      defaultValue: 'Projects',
    },
    {
      name: 'projectsDescription',
      label: 'Projects Page Description',
      type: 'textarea',
      defaultValue:
        'A curated portfolio plus a historical archive of open-source tools, apps, experiments, and older work.',
    },
    {
      name: 'postsTitle',
      label: 'Posts Page Title',
      type: 'text',
      defaultValue: 'Writing',
    },
    {
      name: 'postsDescription',
      label: 'Posts Page Description',
      type: 'textarea',
      defaultValue: 'Recent posts plus the older site archive, preserved as historical notes.',
    },
    {
      name: 'socialLinks',
      label: 'Social Links',
      type: 'array',
      fields: [
        { name: 'label', label: 'Label', type: 'text', required: true },
        { name: 'url', label: 'URL', type: 'text', required: true },
      ],
    },
  ],
}

export default SiteSettings
