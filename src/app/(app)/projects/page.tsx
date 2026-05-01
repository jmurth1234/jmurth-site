import getPayload from '@/lib/payload-getter'
import PageSection from '@/components/PageSection'
import CardArea from '@/components/CardArea'
import ProjectSummary from '@/components/ProjectSummary'
import { Project, ProjectCategory } from 'payload-types'
import ContentArea from '@/components/ContentArea'
import PageHeader from '@/components/PageHeader'

const Page = async ({}) => {
  const { payload, user } = await getPayload()

  const siteSettings = await payload.findGlobal({
    slug: 'site-settings',
    user,
    overrideAccess: false,
  })

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
      <PageHeader
        title={siteSettings?.projectsTitle || 'Projects'}
        description={
          siteSettings?.projectsDescription ||
          'A curated portfolio plus a historical archive of open-source tools, apps, experiments, and older work.'
        }
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

export async function generateMetadata() {
  const { payload } = await getPayload()
  const siteSettings = await payload.findGlobal({
    slug: 'site-settings',
  })

  return {
    title: siteSettings?.projectsTitle || 'Projects',
    description: siteSettings?.projectsDescription || 'Project portfolio and historical archive for Jess Murthick.',
  }
}

export default Page
