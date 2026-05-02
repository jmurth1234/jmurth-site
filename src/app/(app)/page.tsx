import { createDataSummary } from '@/data/data-summary-creator'
import { PostExcerpt } from '@/components/PostSummary'
import getPayload from '@/lib/payload-getter'
import HomepageSections from '@/components/HomepageSections'
import JsonLd from '@/components/JsonLd'
import {
  getCanonicalBase,
  getJobTitle,
  getPersonName,
  getProfileLinks,
  getSeoDescription,
  getSiteSettings,
} from '@/lib/site'

const Page = async () => {
  const { payload, user } = await getPayload()

  const home = await payload.findGlobal({
    slug: 'homepage',
    draft: !!user,
    user,
    overrideAccess: false,
    depth: 2,
  })

  const siteSettings = await getSiteSettings(payload)

  const posts = await payload.find({
    collection: 'posts',
    limit: 12,
    sort: '-createdAt',
    where: {
      hidden: {
        not_equals: true,
      },
    },
    overrideAccess: false,
    user,
    draft: !!user,
  })

  const projects = await payload.find({
    collection: 'projects',
    limit: 8,
    sort: '-priority',
    depth: 2,
    where: {
      featured: {
        equals: true,
      },
    },
    overrideAccess: false,
    user,
    draft: !!user,
  })

  const formattedPosts = posts?.docs?.map((post) => createDataSummary(post))
  const siteUrl = getCanonicalBase(siteSettings)
  const profileLinks = getProfileLinks(siteSettings).map((link) => link.url)

  return (
    <main>
      <JsonLd
        data={[
          {
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: getPersonName(siteSettings),
            url: siteUrl,
            description: getSeoDescription(siteSettings),
          },
          {
            '@context': 'https://schema.org',
            '@type': 'Person',
            name: getPersonName(siteSettings),
            jobTitle: getJobTitle(siteSettings),
            url: siteUrl,
            sameAs: profileLinks,
            description: getSeoDescription(siteSettings),
          },
        ]}
      />
      <HomepageSections
        home={home}
        posts={(formattedPosts || []) as PostExcerpt[]}
        fallbackProjects={projects?.docs || []}
        siteSettings={siteSettings}
      />
    </main>
  )
}

export default Page
