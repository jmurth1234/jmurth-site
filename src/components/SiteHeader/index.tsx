import React from 'react'
import { Nav } from 'payload-types'
import Link from 'next/link'

const SiteHeader = (props: Nav) => {
  return (
    <header className="site-header">
      <div>
        <Link href="/" className="site-brand">
          {props.title}
        </Link>
        <p>{props.tagline}</p>
      </div>

      <nav aria-label="Main navigation">
        <div>
          {props.items?.map((item) => (
            <Link key={item.id} href={item.link}>
              {item.label}
            </Link>
          ))}

          {props.authedItems?.map((item) => (
            <a key={item.id} href={item.link} rel="external">
              {item.label}
            </a>
          ))}
        </div>
      </nav>
    </header>
  )
}

export default SiteHeader
