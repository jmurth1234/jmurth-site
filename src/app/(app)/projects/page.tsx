import getPayload from '@/lib/payload-getter'
import { ResolvingMetadata } from 'next'
import PageSection from '@/components/PageSection'
import CardArea from '@/components/CardArea'
import ProjectSummary from '@/components/ProjectSummary'
import { Project, ProjectCategory } from 'payload-types'
import ContentArea from '@/components/ContentArea'
import PageHeader from '@/components/PageHeader'
import { getAbsoluteUrl, getSeoTitle, getSiteSettings } from '@/lib/site'

type ProjectWithPriority = Project & {
  priority?: number | null
}

const sortProjects = (a: ProjectWithPriority, b: ProjectWithPriority) => {
  const priorityDifference = (b.priority || 0) - (a.priority || 0)

  if (priorityDifference !== 0) return priorityDifference
  if (a.featured && !b.featured) return -1
  if (b.featured && !a.featured) return 1

  return a.title.localeCompare(b.title)
}

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
    found.projects.sort(sortProjects)

    return acc
  }, [])

  categories.sort((a, b) => a.category.order - b.category.order)

  return (
    <main>
      <PageHeader
        title="All Projects"
        description="Selected software, libraries, experiments, and older projects."
      />
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
  const { payload } = await getPayload()
  const siteSettings = await getSiteSettings(payload)
  const description = 'Selected software, libraries, experiments, and older projects by Jessica Murthick.'

  return {
    title: `All Projects | ${metadata.title?.absolute || getSeoTitle(siteSettings)}`,
    description,
    alternates: {
      canonical: getAbsoluteUrl('/projects', siteSettings),
    },
    openGraph: {
      title: 'All Projects',
      description,
      url: getAbsoluteUrl('/projects', siteSettings),
    },
  }
}

export default Page
