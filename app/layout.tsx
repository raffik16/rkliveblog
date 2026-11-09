import 'css/tailwind.css'
import 'pliny/search/algolia.css'
import 'remark-github-blockquote-alert/alert.css'

import { Inter, Inter_Tight, Instrument_Serif, JetBrains_Mono } from 'next/font/google'
import Script from 'next/script'
import { Analytics, AnalyticsConfig } from 'pliny/analytics'
import { SearchProvider, SearchConfig } from 'pliny/search'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import siteMetadata from '@/data/siteMetadata'
import { ThemeProviders } from './theme-providers'
import { Metadata, Viewport } from 'next'
import { twitterHandle } from './seo'
import { authorPerson, jsonLdGraph, websiteSchema } from '@/lib/schema'
import WebMCPTools from '@/components/WebMCPTools'
import EdBackdrop from '@/components/edition/EdBackdrop'
import EdRail from '@/components/edition/EdRail'
import Reveal from '@/components/edition/Reveal'

// The raffi.website type system: Inter for text, Inter Tight for display, Instrument Serif
// italic for the odd accent word, JetBrains Mono for labels.
const inter = Inter({ subsets: ['latin'], display: 'swap', variable: '--font-inter' })
const interTight = Inter_Tight({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600'],
  variable: '--font-inter-tight',
})
const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  display: 'swap',
  weight: '400',
  style: ['normal', 'italic'],
  variable: '--font-instrument-serif',
})
const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500'],
  variable: '--font-jetbrains-mono',
})

export const viewport: Viewport = {
  themeColor: '#07080C',
  colorScheme: 'dark',
}

export const metadata: Metadata = {
  metadataBase: new URL(siteMetadata.siteUrl),
  title: {
    default: siteMetadata.title,
    template: `%s | ${siteMetadata.headerTitle}`,
  },
  description: siteMetadata.description,
  openGraph: {
    title: siteMetadata.title,
    description: siteMetadata.description,
    url: siteMetadata.siteUrl,
    siteName: siteMetadata.title,
    images: [
      {
        url: `${siteMetadata.siteUrl}${siteMetadata.socialBanner}`,
        width: 1200,
        height: 630,
        alt: siteMetadata.title,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  // No root canonical: it would be inherited by every page that doesn't set its own and point
  // them all at the homepage. Pages declare their canonical via genPageMetadata({ path }).
  alternates: {
    types: {
      'application/rss+xml': `${siteMetadata.siteUrl}/feed.xml`,
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  twitter: {
    title: siteMetadata.title,
    card: 'summary_large_image',
    site: twitterHandle,
    creator: twitterHandle,
    images: [siteMetadata.socialBanner],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const basePath = process.env.BASE_PATH || ''

  return (
    <html
      lang={siteMetadata.language}
      className={`${inter.variable} ${interTight.variable} ${instrumentSerif.variable} ${jetbrainsMono.variable} dark motion-safe:scroll-smooth`}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <link rel="icon" type="image/svg+xml" href={`${basePath}/static/favicons/favicon.svg`} />
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href={`${basePath}/static/favicons/favicon-32x32.png`}
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href={`${basePath}/static/favicons/favicon-16x16.png`}
      />
      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href={`${basePath}/static/favicons/apple-touch-icon.png`}
      />
      <link rel="manifest" href={`${basePath}/static/favicons/site.webmanifest`} />
      <link
        rel="mask-icon"
        href={`${basePath}/static/favicons/safari-pinned-tab.svg`}
        color="#D7FF3D"
      />
      <meta name="msapplication-TileColor" content="#07080C" />
      <link rel="alternate" type="application/rss+xml" href={`${basePath}/feed.xml`} />
      {/* Google Tag Manager */}
      <Script id="google-tag-manager" strategy="afterInteractive">
        {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-M5H2L6Z');`}
      </Script>
      {/* End Google Tag Manager */}
      <body className="antialiased">
        {/* On every page: this blog and its author, each with an id the page's own structured
            data (a post, the About page) points back to. See lib/schema.ts. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdGraph(websiteSchema(), authorPerson()) }}
        />
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-M5H2L6Z"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
            title="Google Tag Manager"
          />
        </noscript>
        {/* End Google Tag Manager (noscript) */}
        {/* Without JS, chapter titles show filled (the scroll scrub never runs) */}
        <noscript>
          <style>{`.ed-chapter-head__fill{clip-path:none!important}`}</style>
        </noscript>
        <a href="#main" className="ed-skip">
          Skip to content
        </a>
        <ThemeProviders>
          <Analytics analyticsConfig={siteMetadata.analytics as AnalyticsConfig} />
          {/* Registers a read-only search_posts WebMCP tool where the browser supports it */}
          <WebMCPTools />
          <SearchProvider searchConfig={siteMetadata.search as SearchConfig}>
            <EdBackdrop />
            <div className="ed-app">
              <Header />
              <EdRail />
              <main id="main" className="ed-main" tabIndex={-1}>
                {children}
              </main>
              <Footer />
            </div>
            <Reveal />
          </SearchProvider>
        </ThemeProviders>
      </body>
    </html>
  )
}
