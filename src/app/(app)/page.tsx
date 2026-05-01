import { createDataSummary } from '@/data/data-summary-creator'
import RichText from '@/components/RichText'
import PageSection from '@/components/PageSection'
import CardArea from '@/components/CardArea'
import PostSummary, { PostExcerpt } from '@/components/PostSummary'
import ProjectSummary from '@/components/ProjectSummary'
import Link from 'next/link'
import getPayload from '@/lib/payload-getter'
import { Project } from 'payload-types'

function getCTA(cta: { label?: string | null; href?: string | null } | undefined, fallback: { label: string; href: string }) {
  return {
    label: cta?.label || fallback.label,
    href: cta?.href || fallback.href,
  }
}

const Page = async () => {
  const { payload, user } = await getPayload()

  const home = await payload.findGlobal({
    slug: 'homepage',
    draft: !!user,
  })

  const posts = await payload.find({
    collection: 'posts',
    limit: 4,
    sort: '-createdAt',
    where: {
      hidden: {
        not_equals: true,
      },
    },
    overrideAccess: false,
    user,
    draft: !!user,
  })

  const curatedProjects = (home?.showcaseProjects || []).filter(
    (project): project is Project => typeof project === 'object' && project !== null,
  )

  const fallbackProjects =
    curatedProjects.length > 0
      ? null
      : await payload.find({
          collection: 'projects',
          limit: 4,
          sort: 'showcaseOrder',
          where: {
            featured: {
              equals: true,
            },
          },
          overrideAccess: false,
          user,
          draft: !!user,
        })

  const formattedPosts = posts?.docs?.map((post) => createDataSummary(post))
  const projects = curatedProjects.length > 0 ? curatedProjects : fallbackProjects?.docs || []
  const primaryCTA = getCTA(home?.primaryCTA, { label: 'View projects', href: '/projects' })
  const secondaryCTA = getCTA(home?.secondaryCTA, { label: 'Contact Jess', href: '/contact' })

  return (
    <main>
      <section className="mx-auto grid max-w-5xl gap-8 px-4 py-14 md:grid-cols-[1.35fr_0.65fr] md:items-end md:py-20">
        <div>
          <p className="mb-4 text-sm font-bold uppercase text-nav-header">
            {home?.heroKicker || 'Software engineer and practical toolmaker'}
          </p>
          <h1 className="max-w-4xl text-5xl font-black text-slate-950 md:text-6xl">
            {home?.heroTitle || 'Building useful software with a bias for clarity.'}
          </h1>
          <p className="mt-6 max-w-3xl text-xl leading-9 text-slate-700">
            {home?.heroSummary ||
              "I'm Jessica Murthick, a software engineer at Clock. This is my portfolio, writing archive, and home for projects ranging from developer tools to open-source experiments."}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href={primaryCTA.href} className="btn-primary">
              {primaryCTA.label}
            </Link>
            <Link href={secondaryCTA.href} className="btn-secondary">
              {secondaryCTA.label}
            </Link>
          </div>
        </div>

        <aside className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-bold uppercase text-slate-500">
            {home?.focusLabel || 'Current focus'}
          </p>
          <div className="prose prose-slate mt-3 max-w-none">
            {home?.html ? (
              <RichText content={home.html} leftAlign />
            ) : (
              <p>Personal projects, pragmatic web applications, and tools that make technical work calmer.</p>
            )}
          </div>
        </aside>
      </section>

      <PageSection
        title={home?.projectsHeading || 'Featured Projects'}
        description={
          home?.projectsSummary ||
          'Selected work and open-source projects, with current status and richer project notes where available.'
        }
      >
        <CardArea grid>
          {projects.map((project) => (
            <ProjectSummary key={project.id} project={project} />
          ))}

          <Link className="card justify-center text-lg font-black text-slate-950 no-underline" href="/projects">
            {home?.projectsArchiveLinkLabel || 'See all projects'} -&gt;
          </Link>
        </CardArea>
      </PageSection>

      <PageSection
        title={home?.postsHeading || 'Latest Writing'}
        description={home?.postsSummary || 'Posts and historical notes from the site archive.'}
      >
        <CardArea grid>
          {formattedPosts?.map((post: PostExcerpt) => (
            <PostSummary key={post.id} post={post} />
          ))}

          <Link href="/posts" className="card justify-center text-lg font-black text-slate-950 no-underline">
            {home?.postsArchiveLinkLabel || 'Read more posts'} -&gt;
          </Link>
        </CardArea>
      </PageSection>
    </main>
  )
}

export default Page
