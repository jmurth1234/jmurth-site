import React from 'react'

interface Props {
  title: string
  createdAt?: Date
  description?: string
  links?: {
    label: string
    href: string
  }[]
}

const PageHeader = (props: Props) => {
  return (
    <header className="page-header">
      <div>
        <div>
          <h1>{props.title}</h1>
          {props.createdAt && (
            <span className="font-medium">{new Date(props.createdAt).toDateString()}</span>
          )}

          {props.description && (
            <p>{props.description}</p>
          )}

          {!!props.links?.length && (
            <ul className="button-row">
              {props.links.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="button secondary"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </header>
  )
}

export default PageHeader
