import { ReactNode } from 'react'
import { CoreContent } from 'pliny/utils/contentlayer'
import TOCInline from 'pliny/ui/TOCInline'
import type { Blog, Authors } from 'contentlayer/generated'
import Link from '@/components/Link'
import PageTitle from '@/components/PageTitle'
import Image from '@/components/Image'
import Tag from '@/components/Tag'
import siteMetadata from '@/data/siteMetadata'
import ScrollTopAndComment from '@/components/ScrollTopAndComment'

// Dates are stored as UTC midnight, so format them in UTC to avoid shifting by a day.
const postDateTemplate: Intl.DateTimeFormatOptions = {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  timeZone: 'UTC',
}

const shortDateTemplate: Intl.DateTimeFormatOptions = {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  timeZone: 'UTC',
}

const formatPostDate = (value: string, options: Intl.DateTimeFormatOptions) =>
  new Date(value).toLocaleDateString(siteMetadata.locale, options)

interface PostMetaProps {
  date: string
  lastmod?: string
  readingTime?: { minutes?: number }
  /** Include the weekday in the published date ("Sunday, January 25, 2026"). */
  weekday?: boolean
}

/** "<date> · N min read · Updated <lastmod>" line shown above post titles. */
export function PostMeta({ date, lastmod, readingTime, weekday = true }: PostMetaProps) {
  const minutes = readingTime?.minutes
  const readMinutes = typeof minutes === 'number' && minutes > 0 ? Math.ceil(minutes) : null
  const updated =
    lastmod &&
    new Date(lastmod).getTime() > new Date(date).getTime() &&
    formatPostDate(lastmod, shortDateTemplate) !== formatPostDate(date, shortDateTemplate)
      ? lastmod
      : null

  return (
    <dl className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-base leading-6 font-medium text-gray-500 dark:text-gray-400">
      <div className="whitespace-nowrap">
        <dt className="sr-only">Published on</dt>
        <dd>
          <time dateTime={date}>
            {formatPostDate(date, weekday ? postDateTemplate : shortDateTemplate)}
          </time>
        </dd>
      </div>
      {readMinutes !== null && (
        <div className="whitespace-nowrap">
          <dt className="sr-only">Reading time</dt>
          <dd>
            <span aria-hidden="true" className="mr-2">
              ·
            </span>
            {readMinutes} min read
          </dd>
        </div>
      )}
      {updated && (
        <div className="whitespace-nowrap">
          <dt className="inline">
            <span aria-hidden="true" className="mr-2">
              ·
            </span>
            Updated{' '}
          </dt>
          <dd className="inline">
            <time dateTime={updated}>{formatPostDate(updated, shortDateTemplate)}</time>
          </dd>
        </div>
      )}
    </dl>
  )
}

interface TocEntry {
  value: string
  url: string
  depth: number
}

interface LayoutProps {
  content: CoreContent<Blog>
  authorDetails: CoreContent<Authors>[]
  next?: { path: string; title: string }
  prev?: { path: string; title: string }
  children: ReactNode
}

export default function PostLayout({ content, authorDetails, next, prev, children }: LayoutProps) {
  const { path, date, lastmod, title, tags, readingTime } = content
  const basePath = path.split('/')[0]

  // Sidebar table of contents (xl only). Long posts list just their h2s to keep it short;
  // posts with only a couple of h2s fall back to including h3s.
  const toc: TocEntry[] = Array.isArray(content.toc) ? content.toc : []
  const tocEntries = toc.filter((heading) => heading.depth === 2 || heading.depth === 3)
  const showToc = tocEntries.length >= 3
  const tocToHeading = tocEntries.filter((heading) => heading.depth === 2).length >= 3 ? 2 : 3

  return (
    <>
      <ScrollTopAndComment />
      <article className="mx-auto max-w-5xl">
        <div className="xl:divide-y xl:divide-gray-200 xl:dark:divide-gray-700">
          <header className="pt-6 xl:pb-6">
            <div className="space-y-1 text-center">
              <PostMeta date={date} lastmod={lastmod} readingTime={readingTime} />
              <div>
                <PageTitle>{title}</PageTitle>
              </div>
            </div>
          </header>
          <div
            className={`${
              showToc ? 'grid-rows-[auto_1fr_auto]' : 'grid-rows-[auto_1fr]'
            } mx-auto max-w-[70ch] divide-y divide-gray-200 pb-8 xl:grid xl:max-w-none xl:grid-cols-4 xl:gap-x-6 xl:divide-y-0 dark:divide-gray-700`}
          >
            <dl className="pt-6 pb-10 xl:border-b xl:border-gray-200 xl:pt-11 xl:dark:border-gray-700">
              <dt className="sr-only">Authors</dt>
              <dd>
                <ul className="flex flex-wrap justify-center gap-4 sm:space-x-12 xl:block xl:space-y-8 xl:space-x-0">
                  {authorDetails.map((author) => {
                    const social = author.x || author.twitter
                    return (
                      <li className="flex items-center space-x-2" key={author.name}>
                        {author.avatar && (
                          <Image
                            src={author.avatar}
                            width={38}
                            height={38}
                            alt={author.name}
                            className="h-10 w-10 rounded-full"
                          />
                        )}
                        <dl className="text-sm leading-5 font-medium whitespace-nowrap">
                          <dt className="sr-only">Name</dt>
                          <dd className="text-gray-900 dark:text-gray-100">
                            {author.slug === 'default' ? (
                              <Link
                                href="/about"
                                className="hover:text-primary-700 dark:hover:text-primary-400"
                              >
                                {author.name}
                              </Link>
                            ) : (
                              author.name
                            )}
                          </dd>
                          {social && (
                            <>
                              <dt className="sr-only">X</dt>
                              <dd>
                                <Link
                                  href={social}
                                  className="text-primary-700 hover:text-primary-800 dark:text-primary-500 dark:hover:text-primary-400"
                                >
                                  {social.replace(/^https?:\/\/(www\.)?(x|twitter)\.com\//i, '@')}
                                </Link>
                              </dd>
                            </>
                          )}
                        </dl>
                      </li>
                    )
                  })}
                </ul>
              </dd>
            </dl>
            {showToc && (
              <div className="hidden xl:col-start-1 xl:row-start-2 xl:block">
                <nav
                  aria-labelledby="post-toc-label"
                  className="post-toc sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto pt-8 pb-4 text-sm leading-5"
                >
                  <h2
                    id="post-toc-label"
                    className="mb-3 text-xs tracking-wide text-gray-500 uppercase dark:text-gray-400"
                  >
                    On this page
                  </h2>
                  <TOCInline
                    toc={toc}
                    fromHeading={2}
                    toHeading={tocToHeading}
                    ulClassName="space-y-1"
                  />
                </nav>
              </div>
            )}
            <div
              className={`divide-y divide-gray-200 xl:col-span-3 ${
                showToc ? 'xl:row-span-3' : 'xl:row-span-2'
              } xl:max-w-[70ch] xl:pb-0 dark:divide-gray-700`}
            >
              <div className="prose dark:prose-invert max-w-none pt-10 pb-8">{children}</div>
              {(next || prev) && (
                <nav
                  aria-label="More posts"
                  className="flex justify-between gap-6 border-t border-gray-200 pt-8 pb-8 dark:border-gray-700"
                >
                  <div className="flex-1">
                    {prev && prev.path && (
                      <Link href={`/${prev.path}`} className="group flex flex-col">
                        <span className="text-xs tracking-wide text-gray-500 uppercase dark:text-gray-400">
                          &larr; Previous
                        </span>
                        <span className="text-primary-700 group-hover:text-primary-800 dark:text-primary-500 dark:group-hover:text-primary-400 font-medium">
                          {prev.title}
                        </span>
                      </Link>
                    )}
                  </div>
                  <div className="flex-1 text-right">
                    {next && next.path && (
                      <Link href={`/${next.path}`} className="group flex flex-col items-end">
                        <span className="text-xs tracking-wide text-gray-500 uppercase dark:text-gray-400">
                          Next &rarr;
                        </span>
                        <span className="text-primary-700 group-hover:text-primary-800 dark:text-primary-500 dark:group-hover:text-primary-400 font-medium">
                          {next.title}
                        </span>
                      </Link>
                    )}
                  </div>
                </nav>
              )}
            </div>
            <footer className={showToc ? 'xl:col-start-1 xl:row-start-3' : undefined}>
              <div className="divide-gray-200 text-sm leading-5 font-medium xl:col-start-1 xl:row-start-2 xl:divide-y dark:divide-gray-700">
                {tags && (
                  <div className="py-4 xl:py-8">
                    <h2 className="text-xs tracking-wide text-gray-500 uppercase dark:text-gray-400">
                      Tags
                    </h2>
                    <div className="flex flex-wrap">
                      {tags.map((tag) => (
                        <Tag key={tag} text={tag} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="pt-4 xl:pt-8">
                <Link
                  href={`/${basePath}`}
                  className="text-primary-700 hover:text-primary-800 dark:text-primary-500 dark:hover:text-primary-400"
                  aria-label="Back to the blog"
                >
                  &larr; Back to the blog
                </Link>
              </div>
            </footer>
          </div>
        </div>
      </article>
    </>
  )
}
