import React from 'react'
import { Project } from 'payload-types'

import Link from 'next/link'

interface Props {
  project: Project
}

export default function ProjectSummary({ project }: Props) {
  return (
    <article className="card">
      <h3 className="mb-2 text-xl font-bold">
        <Link href={`/projects/${project.slug}`}>{project.title}</Link>
      </h3>
      <div className="flex-1 line-clamp-3">{project.description}</div>
      <ul className="mt-4 flex flex-row gap-2">
        <li>
          <a href={project.source} target="_blank" rel="noopener noreferrer">
            Source Code
          </a>
        </li>
        <li>
          <a href={project.site} target="_blank" rel="noopener noreferrer">
            Project Site
          </a>
        </li>
      </ul>
    </article>
  )
}
