import siteMetadata from '@/data/siteMetadata'

// Structured data (JSON-LD) shared by the layout and the pages. Every block names the same
// three things by id, so a search engine or an AI assistant reading any one page can tell that
// it belongs to this blog and who wrote it:
//
//   WEBSITE_ID   this blog
//   BLOG_ID      the list of posts at /blog
//   authorId     Raffi, as raffi.website/about describes him (data/siteMetadata.js)

const { siteUrl } = siteMetadata

export const WEBSITE_ID = `${siteUrl}/#website`
export const BLOG_ID = `${siteUrl}/blog#blog`
export const LANGUAGE = 'en-US'

/** Site-relative paths become absolute; full URLs pass through. */
export const absoluteUrl = (path: string) =>
  /^https?:\/\//.test(path) ? path : `${siteUrl}${path}`

/** Profiles that are the same person, the main site first. */
export const authorProfiles = (): string[] =>
  [
    siteMetadata.mainSite,
    siteMetadata.github,
    siteMetadata.linkedin,
    siteMetadata.x,
    siteMetadata.instagram,
  ].filter(Boolean)

/**
 * The blog's author, as a short reference to the Person the main site declares. It carries the
 * name and a profile link itself, because a crawler reads each page on its own and does not
 * follow the id to fetch the rest.
 */
export const authorRef = () => ({
  '@type': 'Person',
  '@id': siteMetadata.authorId,
  name: siteMetadata.author,
  url: siteMetadata.authorUrl,
})

/** The same person with the links that identify him. Used once per page, in the layout. */
export const authorPerson = () => ({
  ...authorRef(),
  image: siteMetadata.authorImage,
  sameAs: authorProfiles(),
})

export const websiteSchema = () => ({
  '@type': 'WebSite',
  '@id': WEBSITE_ID,
  url: siteUrl,
  name: siteMetadata.title,
  description: siteMetadata.description,
  inLanguage: LANGUAGE,
  publisher: { '@id': siteMetadata.authorId },
})

/** A reference to the blog as a whole, for a post's isPartOf. */
export const blogRef = () => ({
  '@type': 'Blog',
  '@id': BLOG_ID,
  name: siteMetadata.title,
  url: `${siteUrl}/blog`,
})

/**
 * BreadcrumbList for a page. `trail` is the path below Home as [name, path] pairs, ending with
 * the page itself: breadcrumbSchema([['Blog', '/blog'], [post.title, `/blog/${slug}`]])
 */
export const breadcrumbSchema = (trail: [name: string, path: string][]) => ({
  '@type': 'BreadcrumbList',
  itemListElement: ([['Home', '/']] as [string, string][]).concat(trail).map(([name, path], i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name,
    item: absoluteUrl(path),
  })),
})

/**
 * Wraps blocks in one graph, ready for a <script type="application/ld+json">. "<" is escaped so
 * that text from a post (a title with a tag in it, say) can never close the script element.
 */
export const jsonLdGraph = (...nodes: object[]) =>
  JSON.stringify({ '@context': 'https://schema.org', '@graph': nodes }).replace(/</g, '\\u003c')
