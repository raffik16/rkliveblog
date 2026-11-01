'use client'

import { useState, useMemo, useCallback } from 'react'
import { usePathname } from 'next/navigation'
import { slug } from 'github-slugger'
import { CoreContent } from 'pliny/utils/contentlayer'
import type { Blog } from 'contentlayer/generated'
import Link from '@/components/Link'
import tagData from 'app/tag-data.json'
import BlogFilters, { FilterState } from '@/components/BlogFilters'
import PostCard from '@/components/PostCard'

interface PaginationProps {
  totalPages: number
  currentPage: number
}
interface ListLayoutProps {
  posts: CoreContent<Blog>[]
  title: string
  initialDisplayPosts?: CoreContent<Blog>[]
  pagination?: PaginationProps
}

export default function ListLayoutWithTags({
  posts,
  title,
  initialDisplayPosts = [],
  pagination,
}: ListLayoutProps) {
  const pathname = usePathname()
  const tagCounts = tagData as Record<string, number>
  const tagKeys = Object.keys(tagCounts)
  const sortedTags = tagKeys.sort((a, b) => tagCounts[b] - tagCounts[a])

  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    selectedTags: [],
    sortBy: 'newest',
  })
  const [showAllTags, setShowAllTags] = useState(false)

  const displayTags = showAllTags ? sortedTags : sortedTags.slice(0, 8)
  const hasMoreTags = sortedTags.length > 8

  const hasActiveFilters =
    filters.searchQuery || filters.selectedTags.length > 0 || filters.sortBy !== 'newest'

  const filteredAndSortedPosts = useMemo(() => {
    let result = [...posts]

    // Filter by search query
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase()
      result = result.filter((post) => {
        const searchContent = `${post.title} ${post.summary || ''} ${post.tags?.join(' ') || ''}`
        return searchContent.toLowerCase().includes(query)
      })
    }

    // Filter by selected tags
    if (filters.selectedTags.length > 0) {
      result = result.filter((post) => filters.selectedTags.some((tag) => post.tags?.includes(tag)))
    }

    // Sort posts
    switch (filters.sortBy) {
      case 'oldest':
        result.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        break
      case 'title':
        result.sort((a, b) => a.title.localeCompare(b.title))
        break
      case 'newest':
      default:
        result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        break
    }

    return result
  }, [posts, filters])

  const handleFiltersChange = useCallback((newFilters: FilterState) => {
    setFilters(newFilters)
  }, [])

  // When filters are active, show all matching posts; otherwise use pagination
  const displayPosts = hasActiveFilters
    ? filteredAndSortedPosts
    : initialDisplayPosts.length > 0
      ? initialDisplayPosts
      : posts

  return (
    <>
      <div>
        <div className="pt-6 pb-6">
          <h1 className="text-3xl leading-9 font-extrabold tracking-tight text-gray-900 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14 dark:text-gray-100">
            {title}
          </h1>
        </div>

        {/* Smart Filter System */}
        <div className="mb-6">
          <BlogFilters allTags={tagCounts} value={filters} onFiltersChange={handleFiltersChange} />

          {/* Results count when filtering */}
          {hasActiveFilters && (
            <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Showing {filteredAndSortedPosts.length} of {posts.length} posts
            </div>
          )}
        </div>

        {/* Below lg the tag sidebar is hidden, so keep tag navigation reachable with a compact strip */}
        <nav aria-label="Browse by tag" className="mb-6 lg:hidden">
          <ul className="flex flex-wrap gap-2">
            <li>
              {pathname.startsWith('/blog') ? (
                <span
                  aria-current="page"
                  className="bg-primary-700 inline-block rounded-full px-3 py-1 text-xs font-semibold text-white uppercase"
                >
                  All posts
                </span>
              ) : (
                <Link
                  href="/blog"
                  className="inline-block rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700 uppercase hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  All posts
                </Link>
              )}
            </li>
            {displayTags.map((t) => (
              <li key={t}>
                {decodeURI(pathname.split('/tags/')[1]) === slug(t) ? (
                  <span
                    aria-current="page"
                    className="bg-primary-700 inline-block rounded-full px-3 py-1 text-xs font-semibold text-white uppercase"
                  >
                    {t}
                  </span>
                ) : (
                  <Link
                    href={`/tags/${slug(t)}`}
                    className="inline-block rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700 uppercase hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                  >
                    {t}
                  </Link>
                )}
              </li>
            ))}
            {hasMoreTags && (
              <li>
                <button
                  type="button"
                  onClick={() => setShowAllTags(!showAllTags)}
                  aria-expanded={showAllTags}
                  className="text-primary-700 hover:text-primary-800 dark:text-primary-500 dark:hover:text-primary-400 inline-block px-2 py-1 text-xs font-medium"
                >
                  {showAllTags ? 'Show fewer' : `+${sortedTags.length - 8} more`}
                </button>
              </li>
            )}
          </ul>
        </nav>

        <div className="flex lg:gap-8 xl:gap-10">
          {/* Tag sidebar from lg, so the card grid keeps its width on tablets */}
          <div className="hidden h-full w-64 shrink-0 flex-wrap rounded-sm bg-gray-50 pt-5 shadow-md lg:flex dark:bg-gray-900/70 dark:shadow-gray-800/40">
            <div className="w-full px-5 py-4">
              {pathname.startsWith('/blog') ? (
                <h3 className="text-primary-700 dark:text-primary-500 font-bold uppercase">
                  All Posts
                </h3>
              ) : (
                <Link
                  href={`/blog`}
                  className="hover:text-primary-500 dark:hover:text-primary-500 font-bold text-gray-700 uppercase dark:text-gray-300"
                >
                  All Posts
                </Link>
              )}
              <ul>
                {displayTags.map((t) => {
                  return (
                    <li key={t} className="my-3">
                      {decodeURI(pathname.split('/tags/')[1]) === slug(t) ? (
                        <h3 className="text-primary-700 dark:text-primary-500 inline px-3 py-2 text-sm font-bold uppercase">
                          {`${t} (${tagCounts[t]})`}
                        </h3>
                      ) : (
                        <Link
                          href={`/tags/${slug(t)}`}
                          className="hover:text-primary-500 dark:hover:text-primary-500 px-3 py-2 text-sm font-medium text-gray-500 uppercase dark:text-gray-300"
                          aria-label={`View posts tagged ${t}`}
                        >
                          {`${t} (${tagCounts[t]})`}
                        </Link>
                      )}
                    </li>
                  )
                })}
              </ul>
              {hasMoreTags && (
                <button
                  type="button"
                  onClick={() => setShowAllTags(!showAllTags)}
                  className="text-primary-700 hover:text-primary-800 dark:text-primary-500 dark:hover:text-primary-400 mt-2 px-3 text-sm font-medium transition-colors"
                >
                  {showAllTags ? '← Show less' : `See more (${sortedTags.length - 8})`}
                </button>
              )}
            </div>
          </div>
          <div className="min-w-0 flex-1">
            {!displayPosts.length && (
              <div className="py-12 text-center">
                <div className="text-gray-500 dark:text-gray-400">
                  <svg
                    aria-hidden="true"
                    className="mx-auto mb-4 h-12 w-12 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <p className="text-lg font-medium">No posts found</p>
                  <p className="mt-1 text-sm">Try adjusting your filters or search query</p>
                </div>
              </div>
            )}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {displayPosts.map((post) => (
                <PostCard key={post.path} post={post} />
              ))}
            </div>
            {pagination && pagination.totalPages > 1 && !hasActiveFilters && (
              <div className="space-y-2 pt-6 pb-8 md:space-y-5">
                <nav className="flex justify-between">
                  <PaginationLink
                    currentPage={pagination.currentPage}
                    totalPages={pagination.totalPages}
                    direction="prev"
                  />
                  <span>
                    {pagination.currentPage} of {pagination.totalPages}
                  </span>
                  <PaginationLink
                    currentPage={pagination.currentPage}
                    totalPages={pagination.totalPages}
                    direction="next"
                  />
                </nav>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

function PaginationLink({
  currentPage,
  totalPages,
  direction,
}: {
  currentPage: number
  totalPages: number
  direction: 'prev' | 'next'
}) {
  const pathname = usePathname()
  const basePath = pathname
    .replace(/^\//, '')
    .replace(/\/page\/\d+\/?$/, '')
    .replace(/\/$/, '')

  if (direction === 'prev') {
    const prevPage = currentPage - 1 > 0
    if (!prevPage) {
      return (
        <button className="cursor-auto disabled:opacity-50" disabled>
          Previous
        </button>
      )
    }
    return (
      <Link
        href={currentPage - 1 === 1 ? `/${basePath}/` : `/${basePath}/page/${currentPage - 1}`}
        rel="prev"
      >
        Previous
      </Link>
    )
  }

  const nextPage = currentPage + 1 <= totalPages
  if (!nextPage) {
    return (
      <button className="cursor-auto disabled:opacity-50" disabled>
        Next
      </button>
    )
  }
  return (
    <Link href={`/${basePath}/page/${currentPage + 1}`} rel="next">
      Next
    </Link>
  )
}
