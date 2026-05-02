import getPayload from '@/lib/payload-getter'
import PageHeader from '@/components/PageHeader'
import ContentArea from '@/components/ContentArea'
import { ResolvingMetadata } from 'next'
import { notFound } from 'next/navigation'
import JsonLd from '@/components/JsonLd'
import {
  getAbsoluteUrl,
  getSeoTitle,
  getSiteSettings,
  SiteSettingsLike,
} from '@/lib/site'
import { Project } from 'payload-types'

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

type ProjectWithDetails = Project & {
  summary?: string | null
  techStack?:
    | {
        label?: string | null
        id?: string | null
      }[]
    | null
  role?: string | null
  impact?: string | null
  year?: number | null
}

function ProjectFacts({ project }: { project: ProjectWithDetails }) {
  const techStack = project.techStack?.filter((tech) => tech.label) || []
  const facts = [
    { label: 'Status', value: capitalize(project.state) },
    { label: 'Role', value: project.role },
    { label: 'Year', value: project.year?.toString() },
    { label: 'Impact', value: project.impact },
  ].filter((fact) => fact.value)

  if (!facts.length && !techStack.length) return null

  return (
    <aside className="project-facts" aria-label="Project details">
      {!!facts.length && (
        <dl>
          {facts.map((fact) => (
            <div key={fact.label}>
              <dt>{fact.label}</dt>
              <dd>{fact.value}</dd>
            </div>
          ))}
        </dl>
      )}
      {!!techStack.length && (
        <div>
          <h2>Tech Stack</h2>
          <ul className="flex flex-wrap gap-2">
            {techStack.map((tech) => (
              <li key={tech.id || tech.label} className="chip">
                {tech.label}
              </li>
            ))}
          </ul>
        </div>
      )}
    </aside>
  )
}

function ProjectJsonLd({
  project,
  siteSettings,
}: {
  project: ProjectWithDetails
  siteSettings?: SiteSettingsLike | null
}) {
  const url = getAbsoluteUrl(`/projects/${project.slug}`, siteSettings)
  const source = project.source || project.site

  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': source ? 'SoftwareSourceCode' : 'CreativeWork',
        name: project.title,
        description: project.summary || project.description,
        url,
        codeRepository: project.source || undefined,
        sameAs: project.site || undefined,
        programmingLanguage: project.techStack?.map((tech) => tech.label).filter(Boolean),
      }}
    />
  )
}

type PageParams = { params: Promise<{ slug: string }> }
const Page = async (props: PageParams) => {
  const { payload, user } = await getPayload()
  const siteSettings = await getSiteSettings(payload)

  const result = await payload.find({
    collection: 'projects',
    where: {
      slug: {
        equals: (await props.params).slug,
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

  const projectDetails = project as ProjectWithDetails
  const description = projectDetails.summary || project.description

  return (
    <main>
      <ProjectJsonLd project={projectDetails} siteSettings={siteSettings} />
      <PageHeader
        title={project.title}
        description={description}
        links={
          [
            !!project.site && { href: project.site, label: 'Project Site' },
            !!project.source && { href: project.source, label: 'Source Code' },
          ].filter(Boolean) as { href: string; label: string }[]
        }
      />
      <ProjectFacts project={projectDetails} />
      <article className="content">
        {project?.contentArea?.map((area: any) => (
          <div key={area.id} data-area={area.blockType}>
            <ContentArea area={area} />
          </div>
        ))}
      </article>
    </main>
  )
}

export async function generateMetadata(props: PageParams, parent: ResolvingMetadata) {
  const params = await props.params;
  const metadata = await parent
  const { payload } = await getPayload()
  const siteSettings = await getSiteSettings(payload)

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
    title: `${project.title} | ${metadata.title?.absolute || getSeoTitle(siteSettings)}`,
    description: (project as ProjectWithDetails).summary || project.description,
    alternates: {
      canonical: getAbsoluteUrl(`/projects/${params.slug}`, siteSettings),
    },
    openGraph: {
      title: project.title,
      description: (project as ProjectWithDetails).summary || project.description,
      url: getAbsoluteUrl(`/projects/${params.slug}`, siteSettings),
    },
  }
}

export default Page
