import getPayload from '@/lib/payload-getter'
import PageHeader from '@/components/PageHeader'
import ContentArea from '@/components/ContentArea'
import { ResolvingMetadata } from 'next'
import { notFound } from 'next/navigation'

type PageParams = { params: { year: string; month: string; slug: string } }
const Page = async (props: PageParams) => {
  console.log('props', props)

  const { payload, user } = await getPayload()

  const posts = await payload.find({
    collection: 'posts',
    where: {
      url: {
        equals: `/${props.params.year}/${props.params.month}/${props.params.slug}`,
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

  return (
    <main>
      <PageHeader
        title={post.title}
        description={new Date(post.createdAt).toLocaleDateString('en-GB')}
      />
      <article className="content">
        {post?.contentArea?.map((area) => (
          <div key={area.id} data-area={area.blockType}>
            <ContentArea area={area} />
          </div>
        ))}
      </article>
    </main>
  )
}

export async function generateMetadata({ params }: PageParams, parent: ResolvingMetadata) {
  const metadata = await parent
  const { payload } = await getPayload()

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
    title: `${post.title} | ${metadata.title?.absolute}`,
    description: post.description,
  }
}

export default Page
