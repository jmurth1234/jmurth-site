import { HTMLConverterFeature, lexicalEditor, lexicalHTML } from '@payloadcms/richtext-lexical'
import { GlobalConfig } from 'payload'

const Homepage: GlobalConfig = {
  slug: 'homepage',
  access: {
    read: () => true,
    update: ({ req }) => {
      return !!req.user
    },
  },
  admin: {
    livePreview: {
      url: ({ data }) => {
        return `${process.env.PAYLOAD_PUBLIC_SITE_URL}`
      },
    },
  },
  fields: [
    {
      name: 'heroKicker',
      label: 'Hero Kicker',
      type: 'text',
    },
    {
      name: 'heroTitle',
      label: 'Hero Title',
      type: 'text',
    },
    {
      name: 'heroSummary',
      label: 'Hero Summary',
      type: 'textarea',
    },
    {
      name: 'primaryCTA',
      label: 'Primary CTA',
      type: 'group',
      fields: [
        { name: 'label', label: 'Label', type: 'text' },
        { name: 'href', label: 'Href', type: 'text' },
      ],
    },
    {
      name: 'secondaryCTA',
      label: 'Secondary CTA',
      type: 'group',
      fields: [
        { name: 'label', label: 'Label', type: 'text' },
        { name: 'href', label: 'Href', type: 'text' },
      ],
    },
    {
      name: 'focusLabel',
      label: 'Focus Label',
      type: 'text',
      defaultValue: 'Current focus',
    },
    {
      name: 'showcaseProjects',
      label: 'Showcase Projects',
      type: 'relationship',
      relationTo: 'projects',
      hasMany: true,
      admin: {
        description: 'Optional homepage curation. Falls back to featured projects when empty.',
      },
    },
    {
      name: 'projectsHeading',
      label: 'Projects Heading',
      type: 'text',
      defaultValue: 'Featured Projects',
    },
    {
      name: 'projectsSummary',
      label: 'Projects Summary',
      type: 'textarea',
      defaultValue:
        'Selected work and open-source projects, with current status and richer project notes where available.',
    },
    {
      name: 'projectsArchiveLinkLabel',
      label: 'Projects Archive Link Label',
      type: 'text',
      defaultValue: 'See all projects',
    },
    {
      name: 'postsHeading',
      label: 'Posts Heading',
      type: 'text',
      defaultValue: 'Latest Writing',
    },
    {
      name: 'postsSummary',
      label: 'Posts Summary',
      type: 'textarea',
      defaultValue: 'Posts and historical notes from the site archive.',
    },
    {
      name: 'postsArchiveLinkLabel',
      label: 'Posts Archive Link Label',
      type: 'text',
      defaultValue: 'Read more posts',
    },
    {
      name: 'introText',
      type: 'richText',
      required: true,
      editor: lexicalEditor({
        features: ({ defaultFeatures }) => [
          ...defaultFeatures,
          // The HTMLConverter Feature is the feature which manages the HTML serializers.
          // If you do not pass any arguments to it, it will use the default serializers.
          HTMLConverterFeature({}),
        ],
      }),
    },
    lexicalHTML('introText', { name: 'html' }),
  ],
  versions: {
    drafts: {
      autosave: {
        interval: 375,
      },
    },
  },
}

export default Homepage
