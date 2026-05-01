'use client'

import React, { useState } from 'react'
import { Nav } from 'payload-types'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import classNames from 'classnames'

const SiteHeader = (props: Nav) => {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const items = [...(props.items || []), ...(props.authedItems || [])]

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname === href || pathname.startsWith(`${href}/`)
  }

  return (
    <header className="site-shell sticky top-0 z-30 pt-3">
      <div className="site-container">
        <div className="rounded-lg border border-white/70 bg-white/90 px-4 py-3 shadow-sm backdrop-blur md:px-5">
          <div className="flex items-center justify-between gap-4">
            <Link
              href="/"
              className="group min-w-0 rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-nav-header"
              onClick={() => setIsOpen(false)}
            >
              <span className="block text-lg font-bold leading-tight text-slate-950 md:text-xl">
                {props.title}
              </span>
              <span className="hidden text-sm text-slate-600 sm:block">{props.tagline}</span>
            </Link>

            <button
              type="button"
              className="rounded-md border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-900 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-nav-header md:hidden"
              aria-expanded={isOpen}
              aria-controls="site-navigation"
              onClick={() => setIsOpen((open) => !open)}
            >
              {isOpen ? 'Close' : 'Menu'}
            </button>

            <nav className="hidden md:block" aria-label="Primary navigation">
              <ul className="flex items-center gap-1">
                {items.map((item) => (
                  <li key={item.id}>
                    <Link
                      href={item.link}
                      className={classNames(
                        'rounded-md px-3 py-2 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-nav-header',
                        isActive(item.link)
                          ? 'bg-slate-950 text-white'
                          : 'text-slate-700 hover:bg-slate-100 hover:text-slate-950',
                      )}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <nav
            id="site-navigation"
            className={classNames('mt-3 border-t border-slate-200 pt-3 md:hidden', !isOpen && 'hidden')}
            aria-label="Primary navigation"
          >
            <ul className="grid grid-cols-2 gap-2">
              {items.map((item) => (
                <li key={item.id}>
                  <Link
                    href={item.link}
                    className={classNames(
                      'block rounded-md px-3 py-2 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-nav-header',
                      isActive(item.link)
                        ? 'bg-slate-950 text-white'
                        : 'bg-slate-50 text-slate-700 hover:bg-slate-100 hover:text-slate-950',
                    )}
                    onClick={() => setIsOpen(false)}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  )
}

export default SiteHeader
