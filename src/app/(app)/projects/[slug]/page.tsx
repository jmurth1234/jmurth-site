import getPayload from '@/lib/payload-getter'
import PageHeader from '@/components/PageHeader'
import ContentArea from '@/components/ContentArea'
import { ResolvingMetadata } from 'next'
import { notFound } from 'next/navigation'

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

type PageParams = { params: { slug: string } }
const Page = async (props: PageParams) => {
  const { payload, user } = await getPayload()

  const result = await payload.find({
    collection: 'projects',
    where: {
      slug: {
        equals: props.params.slug,
      },
    },
    limit: 1,
    draft: !!user,
    user,
    overrideAccess: false,
  })

  const project = result?.docs?.[0]

  if (!project) {
    return notFound()
  }

  return (
    <main>
      <PageHeader
        title={project.title}
        description={`Status: ${capitalize(project.state)}`}
        links={[
          { href: project.site, label: 'Project Site' },
          { href: project.source, label: 'Source Code' },
        ]}
      />
      <article className="content">
        {project?.contentArea?.map((area) => (
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

  const projects = await payload.find({
    collection: 'projects',
    where: {
      slug: {
        equals: params.slug,
      },
    },
    limit: 1,
    overrideAccess: false,
  })

  const project = projects?.docs?.[0]

  if (!project) {
    return notFound()
  }

  return {
    title: `${project.title} | ${metadata.title?.absolute}`,
    description: project.description,
  }
}

export default Page
