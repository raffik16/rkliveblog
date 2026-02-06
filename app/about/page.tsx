import { Authors, allAuthors } from 'contentlayer/generated'
import { MDXLayoutRenderer } from 'pliny/mdx-components'
import AuthorLayout from '@/layouts/AuthorLayout'
import { coreContent } from 'pliny/utils/contentlayer'
import { genPageMetadata } from 'app/seo'
import siteMetadata from '@/data/siteMetadata'

export const metadata = genPageMetadata({
  title: 'About',
  description:
    'Raffik Keklikian - Software engineer and writer exploring AI-assisted development, creative coding, and building tools that matter. Based in the intersection of engineering and creativity.',
  path: '/about',
})

export default function Page() {
  const author = allAuthors.find((p) => p.slug === 'default') as Authors
  const mainContent = coreContent(author)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    mainEntity: {
      '@type': 'Person',
      name: author.name,
      description:
        'Software engineer and writer exploring AI-assisted development, creative coding, and building tools that matter.',
      url: `${siteMetadata.siteUrl}/about`,
      image: `${siteMetadata.siteUrl}${author.avatar}`,
      jobTitle: author.occupation,
      worksFor: {
        '@type': 'Organization',
        name: author.company,
      },
      sameAs: [author.github, author.linkedin, author.x, author.instagram].filter(Boolean),
    },
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
