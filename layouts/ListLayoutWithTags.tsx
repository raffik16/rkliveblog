'use client'

import { useCallback, useMemo, useState } from 'react'
import NextLink from 'next/link'
import { usePathname } from 'next/navigation'
import { CoreContent } from 'pliny/utils/contentlayer'
import type { Blog } from 'contentlayer/generated'
import tagData from 'app/tag-data.json'
import BlogFilters, { EMPTY_FILTERS, FilterState } from '@/components/BlogFilters'
import PostRow from '@/components/PostRow'
import EdChapterHead from '@/components/edition/EdChapterHead'
import EdNote from '@/components/edition/EdNote'
import EdPill from '@/components/edition/EdPill'
import { groupByYear, postNumber } from '@/lib/posts'

interface PaginationProps {
  totalPages: number
  currentPage: number
}
interface ListLayoutProps {
  posts: CoreContent<Blog>[]
  title: string
  initialDisplayPosts?: CoreContent<Blog>[]
  pagination?: PaginationProps
  /** Set on /tags/[tag] pages */
  tag?: string
  /** Every published post, newest first, for issue numbers (defaults to `posts`) */
  allPosts?: CoreContent<Blog>[]
}

// Each year is a chapter: the backdrop takes its colour and the rail lists the years.
const YEAR_COLORS = [
  'var(--ed-cobalt)',
  'var(--ed-violet)',
  'var(--ed-raspberry)',
  'var(--ed-ember)',
  'var(--ed-forest)',
]

export default function ListLayoutWithTags({
  posts,
  title,
  initialDisplayPosts = [],
  pagination,
  tag,
  allPosts,
}: ListLayoutProps) {
  const tagCounts = tagData as Record<string, number>
  const numbered = allPosts ?? posts
  const [filters, setFilters] = useState<FilterState>(EMPTY_FILTERS)

  const hasActiveFilters =
    !!filters.searchQuery || filters.selectedTags.length > 0 || filters.sortBy !== 'newest'

  const filtered = useMemo(() => {
    let result = [...posts]
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase()
      result = result.filter((post) =>
        `${post.title} ${post.summary || ''} ${post.tags?.join(' ') || ''}`
          .toLowerCase()
          .includes(query)
      )
    }
    if (filters.selectedTags.length > 0) {
      result = result.filter((post) => filters.selectedTags.some((t) => post.tags?.includes(t)))
    }
    switch (filters.sortBy) {
      case 'oldest':
        result.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        break
      case 'title':
        result.sort((a, b) => a.title.localeCompare(b.title))
        break
      default:
        result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    }
    return result
  }, [posts, filters])

  const onFiltersChange = useCallback((next: FilterState) => setFilters(next), [])

  // Filters search every post; otherwise show this page of the pagination.
  const displayPosts = hasActiveFilters
    ? filtered
    : initialDisplayPosts.length > 0
      ? initialDisplayPosts
      : posts

  const groups =
    filters.sortBy === 'title' ? [{ year: 'A–Z', posts: displayPosts }] : groupByYear(displayPosts)

  const lede = tag ? (
    <p>
      {posts.length} {posts.length === 1 ? 'post' : 'posts'} on {tag}, newest first.{' '}
      <NextLink href="/tags" className="ed-link">
        See every topic
      </NextLink>
      .
    </p>
  ) : (
    <p>Every post, newest first. Search, sort or pick a topic to dig further back.</p>
  )

  return (
    <div className="ed-page">
      <section
        className="ed-chapter ed-chapter--first ed-list-head"
        data-chapter="intro"
        data-chapter-color="var(--ed-ink)"
        aria-label={title}
      >
        <div className="ed-shell">
          <div className="ed-chapter-head--page">
            <EdChapterHead
              num={tag ? '#' : '01'}
              kicker={tag ? 'Topic' : `Archive · ${posts.length} posts`}
              title={title}
              as="h1"
            >
              {lede}
            </EdChapterHead>
          </div>
          <div className="ed-notes">
            {tag ? (
              <EdNote index={1} label="Topic">
                Filtering below only searches posts on {tag}.{' '}
                <NextLink href="/blog">All posts</NextLink>
              </EdNote>
            ) : (
              <EdNote index={1} label="Search">
                Search looks at titles, summaries and topics. Press ⌘K to search from any page.
              </EdNote>
            )}
          </div>
          <div className="ed-wide">
            <BlogFilters
              allTags={tag ? countTags(posts) : tagCounts}
              value={filters}
              onFiltersChange={onFiltersChange}
              resultCount={filtered.length}
              totalCount={posts.length}
            />
          </div>
        </div>
      </section>

      {!displayPosts.length && (
        <section className="ed-list-empty" aria-live="polite">
          <div className="ed-shell">
            <p className="ed-list-empty__title">Nothing matches that.</p>
            <p className="ed-lede">Try fewer topics or a shorter search.</p>
            <div className="ed-section-actions">
              <button
                type="button"
                className="ed-pill ed-pill--light ed-pill--lg"
                onClick={() => setFilters(EMPTY_FILTERS)}
              >
                Clear filters
              </button>
            </div>
          </div>
        </section>
      )}

      {groups.map((group, gi) => {
        const id = group.year === 'A–Z' ? 'a-z' : `y${group.year}`
        return (
          <section
            key={id}
            id={id}
            className="ed-year"
            data-chapter={id}
            data-chapter-label={group.year}
            data-chapter-num={String(group.posts.length).padStart(2, '0')}
            data-chapter-color={YEAR_COLORS[gi % YEAR_COLORS.length]}
            aria-labelledby={`${id}-title`}
          >
            <div className="ed-shell">
              <header className="ed-year__head">
                <h2 id={`${id}-title`} className="ed-year__title">
                  {group.year}
                </h2>
                <span className="ed-year__count">
                  {group.posts.length} {group.posts.length === 1 ? 'post' : 'posts'}
                </span>
              </header>
              <ol className="ed-posts">
                {group.posts.map((post) => (
                  <PostRow key={post.path} post={post} number={postNumber(numbered, post.slug)} />
                ))}
              </ol>
            </div>
          </section>
        )
      })}

      {pagination && pagination.totalPages > 1 && !hasActiveFilters && (
        <nav className="ed-pager" aria-label="Pagination">
          <div className="ed-shell">
            <div className="ed-pager__inner">
              <PaginationLink {...pagination} direction="prev" />
              <span className="ed-pager__count">
                Page {pagination.currentPage} of {pagination.totalPages}
              </span>
              <PaginationLink {...pagination} direction="next" />
            </div>
          </div>
        </nav>
      )}
    </div>
  )
}

function countTags(posts: CoreContent<Blog>[]) {
  const counts: Record<string, number> = {}
  posts.forEach((p) => p.tags?.forEach((t) => (counts[t] = (counts[t] || 0) + 1)))
  return counts
}

function PaginationLink({
  currentPage,
  totalPages,
  direction,
}: PaginationProps & { direction: 'prev' | 'next' }) {
  const pathname = usePathname()
  const basePath = pathname
    .replace(/^\//, '')
    .replace(/\/page\/\d+\/?$/, '')
    .replace(/\/$/, '')

  if (direction === 'prev') {
    if (currentPage - 1 <= 0) {
      return (
        <span className="ed-pill ed-pill--outline ed-pill--lg is-disabled" aria-disabled="true">
          ← Newer
        </span>
      )
    }
    return (
      <EdPill
        href={currentPage - 1 === 1 ? `/${basePath}` : `/${basePath}/page/${currentPage - 1}`}
        variant="outline"
        size="lg"
      >
        ← Newer
      </EdPill>
    )
  }

  if (currentPage + 1 > totalPages) {
    return (
      <span className="ed-pill ed-pill--outline ed-pill--lg is-disabled" aria-disabled="true">
        Older →
      </span>
    )
  }
  return (
    <EdPill href={`/${basePath}/page/${currentPage + 1}`} variant="light" size="lg">
      Older →
    </EdPill>
  )
}
