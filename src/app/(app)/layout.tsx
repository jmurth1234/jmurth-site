import React from 'react'
import './globals.scss'
import { Roboto } from 'next/font/google'
import SiteHeader from '@/components/SiteHeader'
import { Nav } from 'payload-types'
import { Metadata } from 'next'
import getPayload from '@/lib/payload-getter'
import { RefreshRouteOnSave } from '@/components/RefreshRouteOnSave'
import { siteUrl } from '@/lib/site'

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '700'],
  display: 'swap',
})

function Content({ children }: { children: React.ReactNode }) {
  return <div className="site-container">{children}</div>
}

/* Our app sits here to not cause any conflicts with payload's root layout  */
const Layout: React.FC<{ children: React.ReactNode }> = async ({ children }) => {
  const { payload, user } = await getPayload()

  const nav = await payload.findGlobal({
    slug: 'nav',
    user,
    overrideAccess: false,
  })

  const siteSettings = await payload.findGlobal({
    slug: 'site-settings',
    user,
    overrideAccess: false,
  })

  return (
    <html className={roboto.className}>
      <body className="website">
        <div>
          <RefreshRouteOnSave />
          <SiteHeader {...(nav as Nav)} />
          <Content>{children}</Content>

          <div className="footer">
            <span>
              {siteSettings?.footerText || `Copyright © ${new Date().getFullYear()} ${nav?.title}`}
            </span>
            {!!siteSettings?.socialLinks?.length && (
              <ul className="mt-3 flex flex-wrap justify-center gap-3">
                {siteSettings.socialLinks.map((link) => (
                  <li key={link.id}>
                    <a href={link.url} target="_blank" rel="noopener noreferrer" className="link">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            )}
            {/* <a href="/feed" rel="external" className="link">
              Subscribe to RSS Feed
            </a> */}
          </div>
        </div>
      </body>
    </html>
  )
}

export async function generateMetadata(): Promise<Metadata> {
  const { payload } = await getPayload()

  const nav = await payload.findGlobal({
    slug: 'nav',
  })

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: nav?.title || "Jess's Site",
      template: `%s | ${nav?.title || "Jess's Site"}`,
    },
    description: nav?.tagline,
    alternates: {
      canonical: '/',
    },
    openGraph: {
      title: nav?.title || "Jess's Site",
      description: nav?.tagline,
      url: siteUrl,
      siteName: nav?.title || "Jess's Site",
      type: 'website',
    },
    icons: {
      icon: [
        { url: '/favicon.ico' },
        { url: '/favicon.svg', type: 'image/svg+xml' },
        { url: '/icon.png', type: 'image/png', sizes: '512x512' },
      ],
      apple: '/apple-touch-icon.png',
    },
  }
}

export default Layout
