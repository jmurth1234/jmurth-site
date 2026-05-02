import getPayload from '@/lib/payload-getter'
import PageHeader from '@/components/PageHeader'
import ContentArea from '@/components/ContentArea'
import { ResolvingMetadata } from 'next'
import { notFound } from 'next/navigation'
import JsonLd from '@/components/JsonLd'
import {
  getAbsoluteUrl,
  getJobTitle,
  getPersonName,
  getProfileLinks,
  getSeoDescription,
  getSeoTitle,
  getSiteSettings,
  SiteSettingsLike,
} from '@/lib/site'

function ProfileOverview({ siteSettings }: { siteSettings?: SiteSettingsLike | null }) {
  const profileLinks = getProfileLinks(siteSettings)
  const bio = siteSettings?.professionalBio || getSeoDescription(siteSettings)

  if (!bio && !profileLinks.length) return null

  return (
    <section className="profile-overview">
      <div>
        <p className="eyebrow">{getJobTitle(siteSettings)}</p>
        <h2>What I build</h2>
        {bio && <p>{bio}</p>}
      </div>
      {!!profileLinks.length && (
        <ul>
          {profileLinks.map((link) => (
            <li key={link.url}>
              <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-link">
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

const Page = async (props: { params: Promise<{ pageSlug: string[] }> }) => {
  const { pageSlug } = await props.params

  if (!pageSlug || pageSlug.length === 0) {
    return notFound()
  }

  const { payload, user } = await getPayload()
  const siteSettings = await getSiteSettings(payload)

  const pages = await payload.find({
    collection: 'pages',
    where: {
      url: {
        equals: `/${pageSlug.join('/')}`,
      },
    },
    limit: 1,
    user,
    draft: !!user,
    overrideAccess: false,
  })

  const page = pages?.docs?.[0]

  if (!page) {
    return notFound()
  }

  return (
    <main>
      {page.url === '/about' && (
        <JsonLd
          data={{
            '@context': 'https://schema.org',
            '@type': 'Person',
            name: getPersonName(siteSettings),
            jobTitle: getJobTitle(siteSettings),
            url: getAbsoluteUrl('/about', siteSettings),
            sameAs: getProfileLinks(siteSettings).map((link) => link.url),
            description: getSeoDescription(siteSettings),
          }}
        />
      )}
      <PageHeader title={page.title} />
      {page.url === '/about' && <ProfileOverview siteSettings={siteSettings} />}
      <article className="content">
        {page?.contentArea?.map((area) => (
          <div key={area.id} data-area={area.blockType}>
            <ContentArea area={area} leftAlign />
          </div>
        ))}
      </article>
    </main>
  )
}

export async function generateMetadata(
  props: { params: Promise<{ pageSlug: string[] }> },
  parent: ResolvingMetadata,
) {
  const params = await props.params
  const metadata = await parent
  const { payload } = await getPayload()
  const siteSettings = await getSiteSettings(payload)

  const pages = await payload.find({
    collection: 'pages',
    where: {
      url: {
        equals: `/${params.pageSlug.join('/')}`,
      },
    },
    limit: 1,
  })

  const page = pages?.docs?.[0]

  if (!page) {
    return null
  }

  const path = `/${params.pageSlug.join('/')}`
  const description =
    page.description || (page.url === '/about' ? getSeoDescription(siteSettings) : undefined)

  return {
    title: `${page.title} | ${metadata.title?.absolute || getSeoTitle(siteSettings)}`,
    description,
    alternates: {
      canonical: getAbsoluteUrl(path, siteSettings),
    },
    openGraph: {
      title: page.title,
      description,
      url: getAbsoluteUrl(path, siteSettings),
    },
  }
}

export default Page
