import { Authors, allAuthors } from 'contentlayer/generated'
import { MDXLayoutRenderer } from 'pliny/mdx-components'
import AuthorLayout from '@/layouts/AuthorLayout'
import { coreContent } from 'pliny/utils/contentlayer'
import { genPageMetadata } from 'app/seo'
import siteMetadata from '@/data/siteMetadata'

export const metadata = genPageMetadata({
  title: 'About',
  description: `Learn more about ${siteMetadata.author} - developer, writer, and creator of ${siteMetadata.headerTitle}.`,
})

export default function Page() {
  const author = allAuthors.find((p) => p.slug === 'default') as Authors
  const mainContent = coreContent(author)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: siteMetadata.author,
    url: `${siteMetadata.siteUrl}/about`,
    sameAs: [siteMetadata.github, siteMetadata.linkedin, siteMetadata.x, siteMetadata.instagram],
    jobTitle: mainContent.occupation,
    worksFor: mainContent.company
      ? { '@type': 'Organization', name: mainContent.company }
      : undefined,
    image: mainContent.avatar ? `${siteMetadata.siteUrl}${mainContent.avatar}` : undefined,
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AuthorLayout content={mainContent}>
        <MDXLayoutRenderer code={author.body.code} />
      </AuthorLayout>
    </>
  )
}
