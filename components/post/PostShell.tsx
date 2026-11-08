import { ReactNode } from 'react'
import NextLink from 'next/link'
import { slug as slugify } from 'github-slugger'
import { CoreContent } from 'pliny/utils/contentlayer'
import type { Blog, Authors } from 'contentlayer/generated'
import Image from '@/components/Image'
import Comments from '@/components/Comments'
import NewsletterForm from '@/components/NewsletterForm'
import EdNote from '@/components/edition/EdNote'
import EdPill from '@/components/edition/EdPill'
import siteMetadata from '@/data/siteMetadata'
import { formatDate, readMinutes } from '@/lib/posts'
import PostToc, { type TocEntry } from './PostToc'
import { cx } from '@/lib/edition/cx'

export interface PostNeighbour {
  path: string
  title: string
  summary?: string
  date?: string
}

export interface PostShellProps {
  content: CoreContent<Blog>
  authorDetails?: CoreContent<Authors>[]
  next?: PostNeighbour
  prev?: PostNeighbour
  /** Two-digit issue number (oldest post is 01) */
  number?: string
  children: ReactNode
}

interface Options {
  /** Contents rail in the left column (PostLayout) */
  toc?: boolean
  /** Lead image under the header (PostBanner) */
  banner?: boolean
  /** "Load comments" under the article */
  comments?: boolean
}

// The post page, shared by the three layouts (PostLayout, PostSimple, PostBanner). One reading
// shell: [contents rail] [article] [margin notes], on ink, closing on a cobalt chapter with the
// neighbouring posts and the newsletter.
export default function PostShell({
  content,
  authorDetails = [],
  next,
  prev,
  number,
  children,
  toc: withToc = false,
  banner = false,
  comments = false,
}: PostShellProps & Options) {
  const { slug, date, lastmod, title, summary, tags = [], readingTime, images } = content
  const minutes = readMinutes(readingTime)
  const words = (readingTime as { words?: number } | undefined)?.words
  const updated =
    lastmod &&
    new Date(lastmod).getTime() > new Date(date).getTime() &&
    formatDate(lastmod) !== formatDate(date)
      ? lastmod
      : null

  // Long posts list just their h2s; posts with only a couple fall back to h2 + h3.
  const tocAll: TocEntry[] = Array.isArray(content.toc) ? content.toc : []
  const h2 = tocAll.filter((h) => h.depth === 2)
  const tocEntries = h2.length >= 3 ? h2 : tocAll.filter((h) => h.depth === 2 || h.depth === 3)
  const showToc = withToc && tocEntries.length >= 3

  const bannerImage =
    banner && images ? (typeof images === 'string' ? images : images[0]) : undefined
  const author = authorDetails[0]
  const primaryTag = tags[0]

  return (
    <div className="ed-page ed-read" id="top">
      <header
        className="ed-chapter ed-chapter--first ed-post-head"
        data-chapter="intro"
        data-chapter-rail="off"
        data-chapter-color="var(--ed-ink)"
      >
        <div className="ed-shell ed-shell--read">
          <div className="ed-left ed-post-head__back">
            <NextLink href="/blog" className="ed-back">
              <span aria-hidden="true">←</span> All posts
            </NextLink>
          </div>
          <div className="ed-post-head__main">
            <div className="ed-meta ed-intro" style={{ ['--ed-in' as string]: 0 }}>
              {number && <span className="ed-num">No. {number}</span>}
              {primaryTag && (
                <NextLink href={`/tags/${slugify(primaryTag)}`} className="ed-meta__link">
                  {primaryTag}
                </NextLink>
              )}
              <span className="ed-meta__rule" aria-hidden="true" />
              {minutes !== null && <span>{minutes} min read</span>}
            </div>
            <h1 className="ed-post-title">{title}</h1>
            {summary && (
              <p className="ed-post-head__lede ed-intro" style={{ ['--ed-in' as string]: 3 }}>
                {summary}
              </p>
            )}
            <div className="ed-byline ed-intro" style={{ ['--ed-in' as string]: 5 }}>
              {authorDetails.map((a) => (
                <span key={a.name} className="ed-byline__author">
                  {a.avatar && (
                    <Image
                      src={a.avatar}
                      width={28}
                      height={28}
                      alt=""
                      className="ed-byline__avatar"
                    />
                  )}
                  {a.slug === 'default' ? (
                    <NextLink href="/about">{a.name}</NextLink>
                  ) : (
                    <span>{a.name}</span>
                  )}
                </span>
              ))}
              <span className="ed-byline__sep" aria-hidden="true">
                ·
              </span>
              <time dateTime={date}>{formatDate(date)}</time>
            </div>
          </div>
          <div className="ed-notes ed-post-head__notes">
            <EdNote index={1} label="Published">
              <time dateTime={date}>{formatDate(date, 'short')}</time>
              {updated && (
                <>
                  <br />
                  Updated <time dateTime={updated}>{formatDate(updated, 'short')}</time>
                </>
              )}
            </EdNote>
            {minutes !== null && (
              <EdNote index={2} label="Length">
                {minutes} min read{words ? `, about ${words.toLocaleString('en-US')} words` : ''}
              </EdNote>
            )}
            {author?.x || author?.twitter ? (
              <EdNote index={3} label="Author">
                <a
                  href={(author.x || author.twitter) as string}
                  rel="me noopener noreferrer"
                  target="_blank"
                >
                  {String(author.x || author.twitter).replace(
                    /^https?:\/\/(www\.)?(x|twitter)\.com\//i,
                    '@'
                  )}
                </a>
              </EdNote>
            ) : null}
          </div>
        </div>
      </header>

      {bannerImage && (
        <div className="ed-shell ed-shell--read ed-post-banner">
          <figure className="ed-wide">
            <Image
              src={bannerImage}
              alt=""
              width={1600}
              height={800}
              priority
              sizes="(min-width: 1360px) 1120px, 100vw"
            />
          </figure>
        </div>
      )}

      <div
        className={cx('ed-shell ed-shell--read ed-post-body', !showToc && 'ed-post-body--no-toc')}
        data-chapter="article"
        data-chapter-rail="off"
        data-chapter-color="var(--ed-ink)"
      >
        <aside className="ed-left ed-post-body__rail" aria-label="Contents">
          {showToc ? (
            <PostToc toc={tocEntries} articleId="post-article" />
          ) : (
            <PostToc toc={[]} articleId="post-article" />
          )}
        </aside>
        {/* Each block of the body (paragraph, heading, figure, table...) fades in as it
            scrolls into view: see components/edition/Reveal.tsx. */}
        <article id="post-article" className="ed-prose" data-reveal-children="">
          {children}
        </article>
        {tags.length > 0 && (
          <aside className="ed-notes ed-post-body__notes" aria-label="Topics">
            <div className="ed-note">
              <span className="ed-note__label">Topics</span>
              <ul className="ed-post-tags">
                {tags.map((t) => (
                  <li key={t}>
                    <NextLink href={`/tags/${slugify(t)}`} className="ed-pill ed-pill--tag">
                      {t}
                    </NextLink>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        )}
      </div>

      {comments && siteMetadata.comments?.provider && (
        <div className="ed-shell ed-shell--read ed-post-comments" id="comment">
          <div>
            <Comments slug={slug} />
          </div>
        </div>
      )}

      <section
        className="ed-chapter ed-post-end"
        data-chapter="keep-reading"
        data-chapter-rail="off"
        data-chapter-color="var(--ed-cobalt)"
        aria-labelledby="keep-reading-title"
      >
        <div className="ed-shell ed-shell--read">
          <div className="ed-wide">
            <div className="ed-meta" data-reveal="">
              <span className="ed-num">→</span>
              <span>Keep reading</span>
            </div>
            <h2 id="keep-reading-title" className="ed-post-end__title" data-reveal="">
              {prev || next ? (
                <>
                  More from the <em>blog.</em>
                </>
              ) : (
                <>
                  Back to the <em>blog.</em>
                </>
              )}
            </h2>
            {(prev || next) && (
              <div className="ed-grid ed-post-end__grid">
                {[
                  { post: prev, label: 'Previous post' },
                  { post: next, label: 'Next post' },
                ].map(({ post, label }) =>
                  post && post.path ? (
                    <article
                      key={label}
                      className="ed-panel ed-panel--lg span-6 ed-neighbour"
                      data-reveal=""
                    >
                      <div className="ed-panel__text">
                        <span className="ed-panel__sub ed-neighbour__label">{label}</span>
                        <h3 className="ed-panel__title ed-neighbour__title">
                          <span className="ed-panel__dot" aria-hidden="true" />
                          <NextLink href={`/${post.path}`} className="ed-panel__stretch">
                            {post.title}
                          </NextLink>
                        </h3>
                        {post.summary && <p className="ed-panel__body">{post.summary}</p>}
                        <div className="ed-panel__actions">
                          <span className="ed-pill ed-pill--dark" aria-hidden="true">
                            Read <span className="ed-pill__arrow">→</span>
                          </span>
                        </div>
                      </div>
                    </article>
                  ) : null
                )}
              </div>
            )}
            <div className="ed-section-actions" data-reveal="">
              <EdPill href="/blog" variant="light" size="lg" arrow>
                All posts
              </EdPill>
              {primaryTag && (
                <EdPill href={`/tags/${slugify(primaryTag)}`} variant="outline" size="lg">
                  More on {primaryTag}
                </EdPill>
              )}
            </div>
            {siteMetadata.newsletter?.provider && (
              <div className="ed-post-end__signup" data-reveal="">
                <NewsletterForm title="Get the next post by email" />
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
