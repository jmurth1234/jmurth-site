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
    <header className="p-8 font-serif">
      <div className="text-center">
        <div className="mb-6">
          <h2 className="mb-2 text-4xl font-bold">{props.title}</h2>
          {props.createdAt && (
            <span className="font-medium">{new Date(props.createdAt).toDateString()}</span>
          )}

          {props.description && (
            <p className="font-medium">{props.description}</p>
          )}

          {props.links?.length && (
            <ul className="mt-4 flex flex-row gap-2 mx-auto content-center justify-center">
              {props.links.map((link) => (
                <li key={link.href}>
                  <a href={link.href} target="_blank" rel="noopener noreferrer" className="p-2 rounded bg-gray-200 hover:bg-gray-300">
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
