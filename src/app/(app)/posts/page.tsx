import getPayload from '@/lib/payload-getter'
import { notFound } from 'next/navigation'
import PageSection from '@/components/PageSection'
import CardArea from '@/components/CardArea'
import PostSummary, { PostExcerpt } from '@/components/PostSummary'
import { createDataSummary } from '@/data/data-summary-creator'
import Link from 'next/link'

const Page = async (props: { searchParams: Promise<Record<string, string>> }) => {
  const searchParams = await props.searchParams;
  const { payload, user } = await getPayload()
  const siteSettings = await payload.findGlobal({
    slug: 'site-settings',
    user,
    overrideAccess: false,
  })
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
      <PageSection
        title={siteSettings?.postsTitle || 'Writing'}
        description={
          siteSettings?.postsDescription ||
          'Recent posts plus the older site archive, preserved as historical notes.'
        }
      >
        <CardArea>
          {posts?.map((post: PostExcerpt) => (
            <PostSummary key={post.id} post={post} />
          ))}
        </CardArea>

        <CardArea grid>
          {page > 1 && (
            <Link href={`/posts?page=${page - 1}`} className="card">
              &lt;- See newer posts
            </Link>
          )}

          {page === 1 && <div className="card disabled">Newest Posts</div>}

          {hasMore && (
            <Link href={`/posts?page=${page + 1}`} className="card">
              See older posts -&gt;
            </Link>
          )}
        </CardArea>
      </PageSection>
    </main>
  )
}

export async function generateMetadata() {
  const { payload } = await getPayload()
  const siteSettings = await payload.findGlobal({
    slug: 'site-settings',
  })

  return {
    title: siteSettings?.postsTitle || 'Writing',
    description: siteSettings?.postsDescription || 'Posts and archive notes from Jess Murthick.',
  }
}

export default Page
