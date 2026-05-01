import getPayload from '@/lib/payload-getter'
import PageHeader from '@/components/PageHeader'
import ContentArea from '@/components/ContentArea'
import { notFound, redirect } from 'next/navigation'
import {
  getMediaUrl,
  getCanonicalProjectSlug,
  getProjectGallery,
  getProjectHighlights,
  getProjectLinks,
  getProjectMedia,
  getProjectOutcomes,
  getProjectStatus,
  getProjectTech,
} from '@/lib/projects'

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

type PageParams = { params: Promise<{ slug: string }> }
const Page = async (props: PageParams) => {
  const { payload, user } = await getPayload()
  const params = await props.params

  const canonicalSlug = getCanonicalProjectSlug(params.slug)

  if (params.slug !== canonicalSlug) {
    redirect('/projects/aosp-music-plus')
  }

  const findProject = (slug: string) =>
    payload.find({
      collection: 'projects',
      where: {
        slug: {
          equals: slug,
        },
      },
      limit: 1,
      draft: !!user,
      user,
      overrideAccess: false,
    })

  const result = await findProject(canonicalSlug)
  const fallbackResult =
    !result?.docs?.length && canonicalSlug === 'aosp-music-plus'
      ? await findProject('aosp-music+')
      : null
  const project = result?.docs?.[0] || fallbackResult?.docs?.[0]

  if (!project) {
    return notFound()
  }

  const status = getProjectStatus(project)
  const links = getProjectLinks(project)
  const tech = getProjectTech(project)
  const highlights = getProjectHighlights(project)
  const outcomes = getProjectOutcomes(project)
  const media = getProjectMedia(project)
  const mediaUrl = getMediaUrl(media, 'tablet')
  const gallery = getProjectGallery(project)

  return (
    <main>
      <PageHeader
        title={project.title}
        eyebrow={
          project.showcase ? 'Showcase Project' : project.state === 'active' ? 'Project' : 'Project Archive'
        }
        description={project.shortDeck || project.description}
        links={links.map((link) => ({ href: link.href, label: link.label, primary: link.primary }))}
      />

      <article className="content mx-auto max-w-5xl px-4">
        <div className="mb-8 grid gap-4 md:grid-cols-[1.15fr_0.85fr]">
          {mediaUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={mediaUrl}
              alt={media?.alt || ''}
              className="aspect-[16/9] rounded-lg border border-slate-200 bg-white object-cover shadow-sm"
            />
          ) : (
            <div className="flex min-h-64 items-end rounded-lg bg-slate-950 p-6 text-white shadow-sm">
              <div>
                <p className="text-sm font-bold uppercase text-teal-200">Project</p>
                <p className="mt-2 text-3xl font-black">{project.title}</p>
              </div>
            </div>
          )}

          <aside className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-wrap gap-2">
              <span className={`meta-pill ${status.className}`}>{status.label}</span>
              {project.showcase && (
                <span className="meta-pill bg-teal-50 text-teal-800 ring-teal-200">Showcase</span>
              )}
            </div>

            <dl className="mt-5 space-y-4 text-sm">
              {project.role && (
                <div>
                  <dt className="font-bold text-slate-500">Role</dt>
                  <dd className="mt-1 text-slate-900">{project.role}</dd>
                </div>
              )}
              {project.timeframe && (
                <div>
                  <dt className="font-bold text-slate-500">Timeframe</dt>
                  <dd className="mt-1 text-slate-900">{project.timeframe}</dd>
                </div>
              )}
              <div>
                <dt className="font-bold text-slate-500">Status</dt>
                <dd className="mt-1 text-slate-900">{capitalize(project.state)}</dd>
              </div>
            </dl>

            {tech.length > 0 && (
              <ul className="mt-5 flex flex-wrap gap-2">
                {tech.map((item) => (
                  <li key={item} className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-700">
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </aside>
        </div>

        {project.archiveNote && (
          <div className="mb-8 rounded-lg border border-amber-200 bg-amber-50 p-5 text-amber-950">
            <p className="font-bold">Archive note</p>
            <p className="mt-2">{project.archiveNote}</p>
          </div>
        )}

        {(highlights.length > 0 || outcomes.length > 0) && (
          <div className="mb-8 grid gap-4 md:grid-cols-2">
            {highlights.length > 0 && (
              <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                <h2 className="text-xl font-black text-slate-950">Highlights</h2>
                <ul className="mt-4 space-y-3 text-slate-700">
                  {highlights.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </section>
            )}
            {outcomes.length > 0 && (
              <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                <h2 className="text-xl font-black text-slate-950">Outcomes</h2>
                <ul className="mt-4 space-y-3 text-slate-700">
                  {outcomes.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </section>
            )}
          </div>
        )}

        {project?.contentArea?.map((area: any) => (
          <div key={area.id} data-area={area.blockType}>
            <ContentArea area={area} />
          </div>
        ))}

        {gallery.length > 0 && (
          <section className="my-10">
            <h2 className="mb-4 text-2xl font-black text-slate-950">Gallery</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {gallery.map((item) => {
                const url = getMediaUrl(item, 'card')
                if (!url) return null

                return (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={item.id}
                    src={url}
                    alt={item.alt || ''}
                    className="aspect-[4/3] rounded-lg border border-slate-200 bg-white object-cover shadow-sm"
                  />
                )
              })}
            </div>
          </section>
        )}
      </article>
    </main>
  )
}

export async function generateMetadata(props: PageParams) {
  const params = await props.params;
  const { payload } = await getPayload()
  const canonicalSlug = getCanonicalProjectSlug(params.slug)

  if (params.slug !== canonicalSlug) {
    return {
      title: 'AOSP Music+',
    }
  }

  const findProject = (slug: string) =>
    payload.find({
      collection: 'projects',
      where: {
        slug: {
          equals: slug,
        },
      },
      limit: 1,
      overrideAccess: false,
    })

  const projects = await findProject(canonicalSlug)
  const fallbackProjects =
    !projects?.docs?.length && canonicalSlug === 'aosp-music-plus'
      ? await findProject('aosp-music+')
      : null
  const project = projects?.docs?.[0] || fallbackProjects?.docs?.[0]

  if (!project) {
    return notFound()
  }

  return {
    title: project.title,
    description: project.shortDeck || project.description,
  }
}

export default Page
