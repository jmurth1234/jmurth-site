import getPayload from '@/lib/payload-getter'
import PageHeader from '@/components/PageHeader'
import ContentArea from '@/components/ContentArea'
import { notFound } from 'next/navigation'

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

  return (
    <main>
      <PageHeader
        title={post.title}
        createdAt={new Date(post.createdAt)}
        eyebrow="Writing"
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

export async function generateMetadata(props: PageParams) {
  const params = await props.params
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
    title: post.title,
    description: post.description,
  }
}

export default Page
