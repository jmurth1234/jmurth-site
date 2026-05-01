import React from 'react'
import { Project } from 'payload-types'

import Link from 'next/link'
import {
  getMediaUrl,
  getProjectLinks,
  getProjectMedia,
  getProjectPath,
  getProjectStatus,
  getProjectTech,
} from '@/lib/projects'

interface Props {
  project: Project
}

export default function ProjectSummary({ project }: Props) {
  const status = getProjectStatus(project)
  const links = getProjectLinks(project)
  const tech = getProjectTech(project).slice(0, 4)
  const media = getProjectMedia(project)
  const mediaUrl = getMediaUrl(media, 'thumbnail')
  const summary = project.shortDeck || project.description

  return (
    <article className="card overflow-hidden p-0">
      {mediaUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={mediaUrl}
          alt={media?.alt || ''}
          className="aspect-[16/9] w-full object-cover"
        />
      ) : (
        <div className="flex min-h-40 items-end bg-slate-950 p-5 text-white">
          <div>
            <span className="text-xs font-bold uppercase text-teal-200">Project</span>
            <p className="mt-2 text-2xl font-black">{project.title}</p>
          </div>
        </div>
      )}

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className={`meta-pill ${status.className}`}>{status.label}</span>
          {project.showcase && (
            <span className="meta-pill bg-teal-50 text-teal-800 ring-teal-200">Showcase</span>
          )}
        </div>

        <h3 className="mb-2 text-xl font-black text-slate-950">
          <Link className="no-underline hover:underline" href={getProjectPath(project)}>
            {project.title}
          </Link>
        </h3>
        <p className="line-clamp-3 flex-1 text-slate-700">{summary}</p>

        {tech.length > 0 && (
          <ul className="mt-4 flex flex-wrap gap-2">
            {tech.map((item) => (
              <li key={item} className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-700">
                {item}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-5 flex flex-wrap gap-2">
          <Link href={getProjectPath(project)} className="btn-primary">
            View project
          </Link>
          {links.slice(0, 1).map((link) => (
            <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer" className="btn-secondary">
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </article>
  )
}
