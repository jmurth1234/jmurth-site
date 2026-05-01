import type { Media, Project } from 'payload-types'

export type ProjectLink = {
  href: string
  label: string
  kind?: string | null
  primary?: boolean | null
}

const githubOwnerRedirects = [
  ['https://github.com/rymate1234/', 'https://github.com/jmurth1234/'],
  ['http://github.com/rymate1234/', 'https://github.com/jmurth1234/'],
]

const removedProjectUrls = new Set([
  'https://play.google.com/store/apps/details?id=net.rymate.music&hl=en_US',
  'https://play.google.com/store/apps/details?id=net.rymate.notes&hl=en_US',
  'https://play.google.com/store/apps/details?id=net.rymate.remote&hl=en_US',
  'https://github.com/rymate1234/remotebukkit/',
  'https://github.com/jmurth1234/remotebukkit/',
])

const projectUrlOverrides = new Map<string, string>([
  ['http://rymate1234.github.io/WinIRC/', 'https://github.com/jmurth1234/WinIRC'],
  ['https://vue-tab-complete-input.netlify.com/', 'https://github.com/jmurth1234/tab-complete-input-vue'],
  ['http://dev.bukkit.org/bukkit-plugins/jpanel/', 'https://github.com/jmurth1234/JPanel'],
])

export function normalizeProjectUrl(url?: string | null) {
  if (!url) return null

  const override = projectUrlOverrides.get(url)
  if (override) return override
  if (removedProjectUrls.has(url)) return null

  const ownerRedirect = githubOwnerRedirects.find(([from]) => url.startsWith(from))
  if (ownerRedirect) return url.replace(ownerRedirect[0], ownerRedirect[1])

  return url
}

function isSameUrl(a?: string | null, b?: string | null) {
  if (!a || !b) return false
  return a.replace(/\/$/, '') === b.replace(/\/$/, '')
}

export function getProjectLinks(project: Project): ProjectLink[] {
  const links: ProjectLink[] = []

  project.links?.forEach((link) => {
    const href = normalizeProjectUrl(link.url)
    if (!href) return

    links.push({
      href,
      label: link.label || labelForLinkKind(link.kind),
      kind: link.kind,
      primary: link.primary,
    })
  })

  const source = normalizeProjectUrl(project.source)
  const site = normalizeProjectUrl(project.site)

  if (source) {
    links.push({ href: source, label: 'Source', kind: 'source', primary: !links.length })
  }

  if (site && !isSameUrl(source, site)) {
    links.push({ href: site, label: 'Project site', kind: 'site', primary: !links.length })
  }

  const seen = new Set<string>()
  return links.filter((link) => {
    const key = `${link.kind || 'link'}:${link.href}`
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

export function getProjectPath(project: Project) {
  return `/projects/${getCanonicalProjectSlug(project.slug || '')}`
}

export function getCanonicalProjectSlug(slug: string) {
  if (slug === 'aosp-music+' || slug === 'aosp-music%2B' || slug === 'aosp-music ') {
    return 'aosp-music-plus'
  }
  return slug
}

export function getProjectStatus(project: Project) {
  switch (project.state) {
    case 'active':
      return { label: 'Active', className: 'bg-emerald-50 text-emerald-800 ring-emerald-200' }
    case 'inactive':
      return { label: 'Inactive', className: 'bg-amber-50 text-amber-800 ring-amber-200' }
    case 'legacy':
      return { label: 'Legacy', className: 'bg-slate-100 text-slate-700 ring-slate-200' }
    default:
      return { label: 'Project', className: 'bg-slate-100 text-slate-700 ring-slate-200' }
  }
}

export function getProjectTech(project: Project) {
  return (project.techStack || []).map((item) => item.label).filter(Boolean)
}

export function getProjectHighlights(project: Project) {
  return (project.highlights || []).map((item) => item.text).filter(Boolean)
}

export function getProjectOutcomes(project: Project) {
  return (project.outcomes || []).map((item) => item.text).filter(Boolean)
}

export function getProjectMedia(project: Project): Media | null {
  return typeof project.featuredMedia === 'object' && project.featuredMedia ? project.featuredMedia : null
}

export function getProjectGallery(project: Project): Media[] {
  return (project.gallery || []).filter((item): item is Media => typeof item === 'object' && item !== null)
}

export function getMediaUrl(media: Media | null, size: 'thumbnail' | 'card' | 'tablet' = 'card') {
  if (!media) return null

  const sized = media.sizes?.[size]?.url
  return sized || media.url || null
}

function labelForLinkKind(kind?: string | null) {
  switch (kind) {
    case 'source':
      return 'Source'
    case 'demo':
      return 'Demo'
    case 'docs':
      return 'Docs'
    case 'article':
      return 'Article'
    case 'store':
      return 'Store'
    default:
      return 'Project site'
  }
}
