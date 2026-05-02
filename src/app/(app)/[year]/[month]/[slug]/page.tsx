import getPayload from '@/lib/payload-getter'
import PageHeader from '@/components/PageHeader'
import ContentArea from '@/components/ContentArea'
import { ResolvingMetadata } from 'next'
import { notFound } from 'next/navigation'
import JsonLd from '@/components/JsonLd'
import { createDataSummary } from '@/data/data-summary-creator'
import { getAbsoluteUrl, getPersonName, getSeoTitle, getSiteSettings } from '@/lib/site'

type PageParams = { params: Promise<{ year: string; month: string; slug: string }> }
const Page = async (props: PageParams) => {
  const { payload, user } = await getPayload()
  const params = await props.params

  const posts = await payload.find({
    collection: 'posts',
    where: {
      url: {
        equals: `/${params.year}/${params.month}/${params.slug}`,
      },
    },
    limit: 1,
    draft: !!user,
    user,
    overrideAccess: false,
  })

  const post = posts?.docs?.[0]

  if (!post) {
    return notFound()
  }

  const summary = post.description || createDataSummary(post).excerpt
  const canonicalPath = `/${params.year}/${params.month}/${params.slug}`
  const siteSettings = await getSiteSettings(payload)

  return (
    <main>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          headline: post.title,
          description: summary,
          datePublished: post.createdAt,
          dateModified: post.updatedAt,
          author: {
            '@type': 'Person',
            name: getPersonName(siteSettings),
          },
          url: getAbsoluteUrl(canonicalPath, siteSettings),
        }}
      />
      <PageHeader
        title={post.title}
        createdAt={new Date(post.createdAt)}
        description={post.description || undefined}
      />
      <article className="content">
        {post?.contentArea?.map((area: any) => (
          <div key={area.id} data-area={area.blockType}>
            <ContentArea area={area} />
          </div>
        ))}
      </article>
    </main>
  )
}

export async function generateMetadata(props: PageParams, parent: ResolvingMetadata) {
  const params = await props.params
  const metadata = await parent
  const { payload } = await getPayload()
  const siteSettings = await getSiteSettings(payload)

  const posts = await payload.find({
    collection: 'posts',
    where: {
      url: {
        equals: `/${params.year}/${params.month}/${params.slug}`,
      },
    },
    limit: 1,
  })

  const post = posts?.docs?.[0]

  if (!post) {
    return null
  }

  return {
    title: `${post.title} | ${metadata.title?.absolute || getSeoTitle(siteSettings)}`,
    description: post.description || createDataSummary(post).excerpt,
    alternates: {
      canonical: getAbsoluteUrl(`/${params.year}/${params.month}/${params.slug}`, siteSettings),
    },
    openGraph: {
      title: post.title,
      description: post.description || createDataSummary(post).excerpt,
      type: 'article',
      publishedTime: post.createdAt,
      modifiedTime: post.updatedAt,
      url: getAbsoluteUrl(`/${params.year}/${params.month}/${params.slug}`, siteSettings),
    },
  }
}

export default Page
