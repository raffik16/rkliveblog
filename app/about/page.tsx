import { Authors, allAuthors } from 'contentlayer/generated'
import { MDXLayoutRenderer } from 'pliny/mdx-components'
import AuthorLayout from '@/layouts/AuthorLayout'
import { coreContent } from 'pliny/utils/contentlayer'
import { genPageMetadata } from 'app/seo'
import siteMetadata from '@/data/siteMetadata'
import { LANGUAGE, WEBSITE_ID, authorPerson, breadcrumbSchema, jsonLdGraph } from '@/lib/schema'

const description =
  "I'm Raffi Keklikian, a web developer in Los Angeles. On this blog I write about AI-assisted development, creative coding and the tools behind the work."

export const metadata = genPageMetadata({
  title: 'About',
  description,
  path: '/about',
})

export default function Page() {
  const author = allAuthors.find((p) => p.slug === 'default') as Authors
  const mainContent = coreContent(author)
  const pageUrl = `${siteMetadata.siteUrl}/about`

  // A profile page about the same Person the main site declares (raffi.website/about holds the
  // full record: employer, past roles, languages). Only what this page itself says is repeated
  // here, so the two sites never describe him differently.
  const profile = {
    '@type': 'ProfilePage',
    '@id': `${pageUrl}#profile`,
    url: pageUrl,
    name: `About ${author.name}`,
    description,
    inLanguage: LANGUAGE,
    isPartOf: { '@id': WEBSITE_ID },
    mainEntity: {
      ...authorPerson(),
      description:
        'Web developer in Los Angeles. He writes about AI-assisted development, creative coding and developer tools on this blog, and builds websites for clients at raffi.website.',
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdGraph(profile, breadcrumbSchema([['About', '/about']])),
        }}
      />
      <AuthorLayout content={mainContent}>
        <MDXLayoutRenderer code={author.body.code} />
      </AuthorLayout>
    </>
  )
}
