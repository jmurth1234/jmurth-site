import getPayload from '@/lib/payload-getter'
import { ResolvingMetadata } from 'next'
import { notFound } from 'next/navigation'
import PageSection from '@/components/PageSection'
import CardArea from '@/components/CardArea'
import PostSummary, { PostExcerpt } from '@/components/PostSummary'
import { createDataSummary } from '@/data/data-summary-creator'
import Link from 'next/link'
import PageHeader from '@/components/PageHeader'
import { getAbsoluteUrl, getSeoTitle, getSiteSettings } from '@/lib/site'

const Page = async (props: { searchParams: Promise<Record<string, string>> }) => {
  const searchParams = await props.searchParams;
  const { payload, user } = await getPayload()
  const page = searchParams.page ? parseInt(searchParams.page, 10) : 1

  const results = await payload.find({
    collection: 'posts',
    sort: '-createdAt',
    limit: 10,
    page,
    where: {
      hidden: {
        not_equals: true,
      },
    },
    draft: !!user,
    user,
    overrideAccess: false,
  })

  const posts = results.docs.map(createDataSummary)

  if (!posts.length) {
    return notFound()
  }

  const hasMore = results.totalDocs > results.limit * page

  return (
    <main>
      <PageHeader
        title="All Posts"
        description="Notes, project updates, and technical writing from Jessica Murthick."
      />
      <PageSection title="All Posts">
        <CardArea>
          {posts?.map((post: PostExcerpt) => (
            <PostSummary key={post.id} post={post} />
          ))}
        </CardArea>

        <CardArea grid>
          {page > 1 && (
            <Link href={`/posts?page=${page - 1}`} className="card">
              {'<<'} See Newer Posts
            </Link>
          )}

          {page === 1 && <div className="card disabled">Newest Posts</div>}

          {hasMore && (
            <Link href={`/posts?page=${page + 1}`} className="card">
              See Older Posts {'>>'}
            </Link>
          )}
        </CardArea>
      </PageSection>
    </main>
  )
}

export async function generateMetadata(_: {}, parent: ResolvingMetadata) {
  const metadata = await parent
  const { payload } = await getPayload()
  const siteSettings = await getSiteSettings(payload)
  const description = 'Notes, project updates, and technical writing from Jessica Murthick.'

  return {
    title: `All Posts | ${metadata.title?.absolute || getSeoTitle(siteSettings)}`,
    description,
    alternates: {
      canonical: getAbsoluteUrl('/posts', siteSettings),
    },
    openGraph: {
      title: 'All Posts',
      description,
      url: getAbsoluteUrl('/posts', siteSettings),
    },
  }
}

export default Page
