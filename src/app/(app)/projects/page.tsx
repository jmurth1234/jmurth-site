import getPayload from '@/lib/payload-getter'
import { ResolvingMetadata } from 'next'
import PageSection from '@/components/PageSection'
import CardArea from '@/components/CardArea'
import ProjectSummary from '@/components/ProjectSummary'
import { Project, ProjectCategory } from 'payload-types'
import ContentArea from '@/components/ContentArea'
import PageHeader from '@/components/PageHeader'

const Page = async ({}) => {
  const { payload, user } = await getPayload()

  const result = await payload.find({
    collection: 'projects',
    limit: 100,
    sort: 'title',
    overrideAccess: false,
    user: user,
    draft: !!user,
  })

  const projects = result.docs

  // group projects by category
  const categories = projects.reduce<
    {
      category: ProjectCategory
      projects: Project[]
    }[]
  >((acc, project) => {
    const category = (project.category || { title: 'Uncategorized' }) as ProjectCategory

    const found = acc.find((c) => c.category.id === category.id)

    if (!found) {
      acc.push({ category, projects: [project] })
      return acc
    }

    found.projects.push(project)

    found.projects.sort((a, b) => a.featured && !b.featured ? -1 : b.featured && !a.featured ? 1 : 0)

    return acc
  }, [])

  categories.sort((a, b) => a.category.order - b.category.order)

  return (
    <main>
      <PageHeader title="All Projects" />
      {categories.map((category) => (
        <PageSection key={category.category.id} title={category.category.title}>
          {category.category.contentArea && (
            <div className='mb-2'>
              <ContentArea area={category.category.contentArea[0]} leftAlign />
            </div>
          )}
          <CardArea grid>
            {category.projects.map((project) => (
              <ProjectSummary key={project.id} project={project} />
            ))}
          </CardArea>
        </PageSection>
      ))}
    </main>
  )
}

export async function generateMetadata(_: {}, parent: ResolvingMetadata) {
  const metadata = await parent

  return {
    title: `All Projects | ${metadata.title?.absolute}`,
  }
}

export default Page
