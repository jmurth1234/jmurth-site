import React from 'react'
import { Nav } from 'payload-types'
import Link from 'next/link'

const SiteHeader = (props: Nav) => {
  return (
    <>
      <header className="mt-4 bg-nav-header font-serif text-white rounded shadow-md -mb-20 md:mt-8">
        <div className="p-8 text-center">
          <div className="mb-12">
            <h1 className="text-4xl font-bold mb-2">{props.title}</h1>
            <span className="font-medium">{props.tagline}</span>
          </div>
        </div>
      </header>

      <nav className="sticky top-0 z-10 px-8 py-4 text-white">
        <div className="flex flex-row gap-4 bg-nav-bar rounded shadow-xl overflow-x-auto md:justify-center px-4">
          {props.items?.map((item) => (
            <Link key={item.id} href={item.link} className="p-2 rounded">
              {item.label}
            </Link>
          ))}

          {props.authedItems?.map((item) => (
            <a key={item.id} href={item.link} className="p-2 rounded" rel="external">
              {item.label}
            </a>
          ))}
        </div>
      </nav>

      <div className="mt-8" />
    </>
  )
}

export default SiteHeader
