import React from 'react'
import './globals.scss'
import { Roboto, Roboto_Slab } from 'next/font/google'
import SiteHeader from '@/components/SiteHeader'
import { Nav } from 'payload-types'
import { Metadata, ResolvingMetadata } from 'next'
import getPayload from '@/lib/payload-getter'
import { RefreshRouteOnSave } from '@/components/RefreshRouteOnSave'

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '700'],
  display: 'swap',
})

const robotoSlab = Roboto_Slab({
  subsets: ['latin'],
  weight: ['400', '700'],
  display: 'swap',
})

function Content({ children }: { children: React.ReactNode }) {
  return <div className="container">{children}</div>
}

/* Our app sits here to not cause any conflicts with payload's root layout  */
const Layout: React.FC<{ children: React.ReactNode }> = async ({ children }) => {
  const { payload, user } = await getPayload()

  const nav = await payload.findGlobal({
    slug: 'nav',
    user,
    overrideAccess: false,
  })

  return (
    <html className={`${roboto.className} ${robotoSlab.className}`}>
      <body className="container">
        <RefreshRouteOnSave />
        <SiteHeader {...(nav as Nav)} />
        <Content>{children}</Content>

        <div className="footer">
          <span>
            Copyright © {new Date().getFullYear()} {nav?.title}
          </span>
          {/* <a href="/feed" rel="external" className="link">
            Subscribe to RSS Feed
          </a> */}
        </div>
      </body>
    </html>
  )
}

export async function generateMetadata(_: {}, parent: ResolvingMetadata): Promise<Metadata> {
  const { payload } = await getPayload()

  const nav = await payload.findGlobal({
    slug: 'nav',
  })

  return {
    title: nav?.title,
    description: nav?.tagline,
  }
}

export default Layout
