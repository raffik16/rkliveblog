import 'css/prism.css'
import 'katex/dist/katex.css'

import { components } from '@/components/MDXComponents'
import { MDXLayoutRenderer } from 'pliny/mdx-components'
import { sortPosts, coreContent, allCoreContent } from 'pliny/utils/contentlayer'
import { allBlogs, allAuthors } from 'contentlayer/generated'
import type { Authors, Blog } from 'contentlayer/generated'
import PostSimple from '@/layouts/PostSimple'
import PostLayout from '@/layouts/PostLayout'
import PostBanner from '@/layouts/PostBanner'
import { Metadata } from 'next'
import siteMetadata from '@/data/siteMetadata'
import { twitterHandle } from 'app/seo'
import { notFound } from 'next/navigation'
import { postNumber, readMinutes } from '@/lib/posts'
import { tagLabel } from '@/lib/tags'
import { LANGUAGE, authorRef, blogRef, breadcrumbSchema, jsonLdGraph } from '@/lib/schema'

/** Where search results cut a page title off. */
const TITLE_MAX = 60

const defaultLayout = 'PostLayout'
const layouts = {
  PostSimple,
  PostLayout,
  PostBanner,
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string[] }>
}): Promise<Metadata | undefined> {
  const params = await props.params
  const slug = decodeURI(params.slug.join('/'))
  const post = allBlogs.find((p) => p.slug === slug)
  const authorList = post?.authors || ['default']
  const authorDetails = authorList.map((author) => {
    const authorResults = allAuthors.find((p) => p.slug === author)
    return coreContent(authorResults as Authors)
  })
  if (!post) {
    return
  }

  const publishedAt = new Date(post.date).toISOString()
  const modifiedAt = new Date(post.lastmod || post.date).toISOString()
  const authors = authorDetails.map((author) => author.name)
  let imageList = [siteMetadata.socialBanner]
  if (post.images) {
    imageList = typeof post.images === 'string' ? [post.images] : post.images
  }
  const ogImages = imageList.map((img) => {
    return {
      url: img && img.includes('http') ? img : siteMetadata.siteUrl + img,
    }
  })

  const postUrl = post.canonicalUrl || `${siteMetadata.siteUrl}/blog/${slug}`
  // Search results cut a title off at about 60 characters, so a long post title goes out on its
  // own; a short one keeps the " | Raffi Keklikian" ending from the root layout's template.
  const suffixed = `${post.title} | ${siteMetadata.headerTitle}`

  return {
    title: suffixed.length <= TITLE_MAX ? post.title : { absolute: post.title },
    description: post.summary,
    authors: authorDetails.map((author) =>
      author.slug === 'default'
        ? { name: author.name, url: siteMetadata.authorUrl }
        : { name: author.name }
    ),
    alternates: {
      canonical: postUrl,
      // The same post as plain Markdown, for AI assistants and other tools that would rather not
      // read the page's HTML (written by scripts/llms.mjs after the build).
      types: {
        'text/markdown': `${siteMetadata.siteUrl}/blog/${slug}.md`,
      },
    },
    openGraph: {
      title: post.title,
      description: post.summary,
      siteName: siteMetadata.title,
      locale: 'en_US',
      type: 'article',
      publishedTime: publishedAt,
      modifiedTime: modifiedAt,
      url: postUrl,
      images: ogImages,
      authors: authors.length > 0 ? authors : [siteMetadata.author],
      tags: post.tags,
    },
    twitter: {
      card: 'summary_large_image',
      site: twitterHandle,
      creator: twitterHandle,
      title: post.title,
      description: post.summary,
      images: imageList,
    },
    keywords: post.tags,
  }
}

export const generateStaticParams = async () => {
  return allBlogs.map((p) => ({ slug: p.slug.split('/').map((name) => decodeURI(name)) }))
}

export default async function Page(props: { params: Promise<{ slug: string[] }> }) {
  const params = await props.params
  const slug = decodeURI(params.slug.join('/'))
  // Filter out drafts in production
  const sortedCoreContents = allCoreContent(sortPosts(allBlogs))
  const postIndex = sortedCoreContents.findIndex((p) => p.slug === slug)
  if (postIndex === -1) {
    return notFound()
  }

  const prev = sortedCoreContents[postIndex + 1]
  const next = sortedCoreContents[postIndex - 1]
  const post = allBlogs.find((p) => p.slug === slug) as Blog
  const authorList = post?.authors || ['default']
  const authorDetails = authorList.map((author) => {
    const authorResults = allAuthors.find((p) => p.slug === author)
    return coreContent(authorResults as Authors)
  })
  const mainContent = coreContent(post)
  const postUrl = post.canonicalUrl || `${siteMetadata.siteUrl}/blog/${slug}`
  // The post, described for search engines and AI assistants: what it is, when it was written
  // and updated, how long it is, and who wrote it. `structuredData` (contentlayer.config.ts)
  // supplies the headline, dates, description and image; the layout already sets the context.
  const { '@context': _context, ...article } = post.structuredData as Record<string, unknown>
  const minutes = readMinutes(post.readingTime)
  const words = (post.readingTime as { words?: number } | undefined)?.words
  const jsonLd = {
    ...article,
    '@id': `${postUrl}#article`,
    url: postUrl,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': postUrl,
    },
    isPartOf: blogRef(),
    inLanguage: LANGUAGE,
    keywords: post.tags?.map(tagLabel).join(', '),
    articleSection: post.tags?.[0] ? tagLabel(post.tags[0]) : undefined,
    wordCount: words,
    timeRequired: minutes ? `PT${minutes}M` : undefined,
    // Raffi is the Person raffi.website declares; a guest author is just a name.
    author: authorDetails.map((author) =>
      author.slug === 'default' ? authorRef() : { '@type': 'Person', name: author.name }
    ),
    publisher: authorRef(),
  }
  const breadcrumbs = breadcrumbSchema([
    ['Blog', '/blog'],
    [post.title, `/blog/${slug}`],
  ])

  const Layout = layouts[post.layout || defaultLayout]

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdGraph(jsonLd, breadcrumbs) }}
      />
      <Layout
        content={mainContent}
        authorDetails={authorDetails}
        next={next}
        prev={prev}
        number={postNumber(sortedCoreContents, slug)}
      >
        <MDXLayoutRenderer code={post.body.code} components={components} toc={post.toc} />
      </Layout>
    </>
  )
}
