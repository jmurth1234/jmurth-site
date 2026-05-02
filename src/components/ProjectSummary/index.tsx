import React from 'react'
import { Project } from 'payload-types'

import Link from 'next/link'

interface Props {
  project: Project
}

type ProjectWithDetails = Project & {
  summary?: string | null
  techStack?:
    | {
        label?: string | null
        id?: string | null
      }[]
    | null
  year?: number | null
}

export default function ProjectSummary({ project }: Props) {
  const projectDetails = project as ProjectWithDetails
  const summary = projectDetails.summary || project.description
  const techStack = projectDetails.techStack?.filter((item) => item.label).slice(0, 4) || []

  return (
    <article className="card summary-card">
      <div className="flex items-start justify-between gap-4">
        <p className="text-sm font-medium capitalize text-slate-500">{project.state}</p>
        {projectDetails.year && (
          <p className="text-sm font-medium text-slate-500">{projectDetails.year}</p>
        )}
      </div>
      <h3 className="mt-2 text-xl font-bold text-slate-950">
        <Link href={`/projects/${project.slug}`}>{project.title}</Link>
      </h3>
      <p className="mt-3 flex-1 line-clamp-3 text-slate-700">{summary}</p>
      {!!techStack.length && (
        <ul className="mt-4 flex flex-wrap gap-2">
          {techStack.map((item) => (
            <li key={item.id || item.label} className="chip">
              {item.label}
            </li>
          ))}
        </ul>
      )}
      <ul className="mt-5 flex flex-row flex-wrap gap-3 text-sm font-medium">
        <li>
          <Link href={`/projects/${project.slug}`} className="text-link">
            Details
          </Link>
        </li>
        {project.source && (
          <li>
            <a href={project.source} target="_blank" rel="noopener noreferrer" className="text-link">
              Source Code
            </a>
          </li>
        )}
        {project.site && (
          <li>
            <a href={project.site} target="_blank" rel="noopener noreferrer" className="text-link">
              Project Site
            </a>
          </li>
        )}
      </ul>
    </article>
  )
}
