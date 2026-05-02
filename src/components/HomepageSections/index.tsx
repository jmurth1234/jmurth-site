/* eslint-disable @next/next/no-img-element -- Payload media can come from local or external URLs without Next image host config. */
import CardArea from '@/components/CardArea'
import PageSection from '@/components/PageSection'
import PostSummary, { PostExcerpt } from '@/components/PostSummary'
import ProjectSummary from '@/components/ProjectSummary'
import RichText from '@/components/RichText'
import {
  DEFAULT_JOB_TITLE,
  SiteSettingsLike,
  getMediaUrl,
  getPersonName,
} from '@/lib/site'
import Link from 'next/link'
import { Media, Project } from 'payload-types'

type Cta = {
  label?: string | null
  href?: string | null
}

type HomepageSection = {
  id?: string | null
  blockType: string
  heading?: string | null
  title?: string | null
  intro?: string | Record<string, unknown> | null
  html?: string | null
  copy?: string | null
  primaryCta?: Cta | null
  secondaryCta?: Cta | null
  profileImage?: string | Media | null
  highlights?:
    | {
        title?: string | null
        description?: string | null
        id?: string | null
      }[]
    | null
  projects?: (string | Project)[] | null
  limit?: number | null
  links?:
    | {
        label?: string | null
        href?: string | null
        id?: string | null
      }[]
    | null
}

type HomepageLike = {
  html?: string | null
  sections?: HomepageSection[] | null
}

type Props = {
  home?: HomepageLike | null
  posts: PostExcerpt[]
  fallbackProjects: Project[]
  siteSettings?: SiteSettingsLike | null
}

const isPopulatedProject = (project: string | Project): project is Project => {
  return typeof project === 'object' && project !== null && 'title' in project
}

const getLimit = (limit?: number | null, fallback = 4) => {
  if (!limit || limit < 1) return fallback

  return Math.min(limit, 12)
}

function CmsLink({ cta, className }: { cta?: Cta | null; className?: string }) {
  if (!cta?.href || !cta.label) return null

  if (cta.href.startsWith('/')) {
    return (
      <Link href={cta.href} className={className}>
        {cta.label}
      </Link>
    )
  }

  return (
    <a href={cta.href} className={className} target="_blank" rel="noopener noreferrer">
      {cta.label}
    </a>
  )
}

function SectionIntro({ title, intro }: { title?: string | null; intro?: unknown }) {
  const introText = typeof intro === 'string' ? intro : null

  if (!title && !introText) return null

  return (
    <div className="section-heading">
      {title && <h2>{title}</h2>}
      {introText && <p>{introText}</p>}
    </div>
  )
}

function HeroSection({
  section,
  fallbackHtml,
  siteSettings,
}: {
  section: HomepageSection
  fallbackHtml?: string | null
  siteSettings?: SiteSettingsLike | null
}) {
  const imageUrl = getMediaUrl(section.profileImage, siteSettings)
  const imageAlt =
    typeof section.profileImage === 'object' && section.profileImage?.alt
      ? section.profileImage.alt
      : getPersonName(siteSettings)
  const primaryCta =
    section.primaryCta?.href && section.primaryCta.label
      ? section.primaryCta
      : { label: 'View Projects', href: '/projects' }
  const secondaryCta =
    section.secondaryCta?.href && section.secondaryCta.label
      ? section.secondaryCta
      : { label: 'Get in Touch', href: '/contact' }

  return (
    <section className="home-hero">
      <div className="home-hero-copy">
        <p className="eyebrow">{siteSettings?.jobTitle || DEFAULT_JOB_TITLE}</p>
        <h1>{section.heading || getPersonName(siteSettings)}</h1>
        {section.html || fallbackHtml ? (
          <RichText content={section.html || fallbackHtml} className="hero-rich-text" leftAlign />
        ) : siteSettings?.professionalBio ? (
          <p>{siteSettings?.professionalBio}</p>
        ) : null}
        <div className="button-row">
          <CmsLink cta={primaryCta} className="button primary" />
          <CmsLink cta={secondaryCta} className="button secondary" />
        </div>
      </div>

      {imageUrl && (
        <div className="home-hero-image">
          <img src={imageUrl} alt={imageAlt || ''} />
        </div>
      )}
    </section>
  )
}

function ProfileHighlightsSection({ section }: { section: HomepageSection }) {
  const highlights = section.highlights?.filter((highlight) => highlight.title) || []

  if (!highlights.length) return null

  return (
    <section className="homepage-section">
      <SectionIntro title={section.title || 'What I work on'} intro={section.intro} />
      <div className="highlight-grid">
        {highlights.map((highlight) => (
          <article className="highlight-card" key={highlight.id || highlight.title}>
            <h3>{highlight.title}</h3>
            {highlight.description && <p>{highlight.description}</p>}
          </article>
        ))}
      </div>
    </section>
  )
}

function FeaturedProjectsSection({
  section,
  fallbackProjects,
}: {
  section: HomepageSection
  fallbackProjects: Project[]
}) {
  const selectedProjects = section.projects?.filter(isPopulatedProject) || []
  const projects = (selectedProjects.length ? selectedProjects : fallbackProjects).slice(
    0,
    getLimit(section.limit),
  )

  if (!projects.length) return null

  return (
    <PageSection
      title={section.title || 'Featured Projects'}
      intro={typeof section.intro === 'string' ? section.intro : undefined}
    >
      <CardArea grid>
        {projects.map((project) => (
          <ProjectSummary key={project.id} project={project} />
        ))}

        <Link className="card action-card" href="/projects">
          <span>See All Projects</span>
        </Link>
      </CardArea>
    </PageSection>
  )
}

function LatestPostsSection({ section, posts }: { section: HomepageSection; posts: PostExcerpt[] }) {
  const visiblePosts = posts.slice(0, getLimit(section.limit))

  if (!visiblePosts.length) return null

  return (
    <PageSection
      title={section.title || 'Latest Posts'}
      intro={typeof section.intro === 'string' ? section.intro : undefined}
    >
      <CardArea grid>
        {visiblePosts.map((post) => (
          <PostSummary key={post.id} post={post} />
        ))}

        <Link href="/posts" className="card action-card">
          <span>Read More Posts</span>
        </Link>
      </CardArea>
    </PageSection>
  )
}

function ContactCtaSection({ section }: { section: HomepageSection }) {
  const links = section.links?.filter((link) => link.href && link.label) || []

  return (
    <section className="contact-cta">
      <div>
        <h2>{section.heading}</h2>
        {section.copy && <p>{section.copy}</p>}
      </div>
      {!!links.length && (
        <div className="button-row">
          {links.map((link, index) => (
            <CmsLink
              key={link.id || link.href}
              cta={link}
              className={index === 0 ? 'button primary' : 'button secondary'}
            />
          ))}
        </div>
      )}
    </section>
  )
}

export default function HomepageSections({ home, posts, fallbackProjects, siteSettings }: Props) {
  const sections =
    home?.sections?.length
      ? home.sections
      : [
          {
            blockType: 'hero',
            heading: getPersonName(siteSettings),
            html: home?.html,
            primaryCta: { label: 'View Projects', href: '/projects' },
            secondaryCta: { label: 'Get in Touch', href: '/contact' },
          },
          {
            blockType: 'latestPosts',
            title: 'Latest Posts',
            limit: 4,
          },
          {
            blockType: 'featuredProjects',
            title: 'Featured Projects',
            limit: 4,
          },
        ]

  return (
    <>
      {sections.map((section, index) => {
        switch (section.blockType) {
          case 'hero':
            return (
              <HeroSection
                key={section.id || `${section.blockType}-${index}`}
                section={section}
                fallbackHtml={home?.html}
                siteSettings={siteSettings}
              />
            )
          case 'profileHighlights':
            return (
              <ProfileHighlightsSection
                key={section.id || `${section.blockType}-${index}`}
                section={section}
              />
            )
          case 'featuredProjects':
            return (
              <FeaturedProjectsSection
                key={section.id || `${section.blockType}-${index}`}
                section={section}
                fallbackProjects={fallbackProjects}
              />
            )
          case 'latestPosts':
            return (
              <LatestPostsSection
                key={section.id || `${section.blockType}-${index}`}
                section={section}
                posts={posts}
              />
            )
          case 'contactCta':
            return (
              <ContactCtaSection
                key={section.id || `${section.blockType}-${index}`}
                section={section}
              />
            )
          default:
            return null
        }
      })}
    </>
  )
}
