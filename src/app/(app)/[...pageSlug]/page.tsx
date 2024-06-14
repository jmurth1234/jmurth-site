import getPayload from '@/lib/payload-getter'
import PageHeader from '@/components/PageHeader'
import ContentArea from '@/components/ContentArea'
import { ResolvingMetadata } from 'next'
import { notFound } from 'next/navigation'

const Page = async (props: { params: { pageSlug: string[] } }) => {
  console.log('props', props)

  const { pageSlug } = props.params

  if (!pageSlug || pageSlug.length === 0) {
    return notFound()
  }

  const { payload, user } = await getPayload()

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
      <PageHeader title={page.title} />
      <article className="content">
        {page?.contentArea?.map((area) => (
          <div key={area.id} data-area={area.blockType}>
            <ContentArea area={area} />
          </div>
        ))}
      </article>
    </main>
  )
}

export async function generateMetadata(
  { params }: { params: { pageSlug: string[] } },
  parent: ResolvingMetadata,
) {
  const metadata = await parent
  const { payload } = await getPayload()

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

  return {
    title: `${page.title} | ${metadata.title?.absolute}`,
    description: page.description,
  }
}

export default Page
