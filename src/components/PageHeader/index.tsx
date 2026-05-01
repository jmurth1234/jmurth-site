import React from 'react'

interface Props {
  title: string
  createdAt?: Date
  description?: string
  eyebrow?: string
  links?: {
    label: string
    href: string
    primary?: boolean | null
  }[]
  align?: 'left' | 'center'
}

const PageHeader = (props: Props) => {
  const align = props.align || 'center'

  return (
    <header className="page-header">
      <div className={align === 'center' ? 'text-center' : 'text-left'}>
        <div className="space-y-4">
          {props.eyebrow && (
            <p className="text-sm font-bold uppercase text-nav-header">{props.eyebrow}</p>
          )}
          <h1 className="text-4xl font-black text-slate-950 md:text-5xl">
            {props.title}
          </h1>
          {props.createdAt && (
            <span className="text-base font-medium text-slate-600">
              {new Date(props.createdAt).toLocaleDateString('en-GB')}
            </span>
          )}

          {props.description && (
            <p className="mx-auto max-w-3xl text-lg leading-8 text-slate-700">{props.description}</p>
          )}

          {props.links?.length && (
            <ul className={align === 'center' ? 'flex flex-wrap justify-center gap-2' : 'flex flex-wrap gap-2'}>
              {props.links.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={
                      link.primary
                        ? 'btn-primary'
                        : 'btn-secondary'
                    }
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
