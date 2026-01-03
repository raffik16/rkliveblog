'use client'

import { useState, useMemo, useCallback } from 'react'
import { usePathname } from 'next/navigation'
import { slug } from 'github-slugger'
import { CoreContent } from 'pliny/utils/contentlayer'
import type { Blog } from 'contentlayer/generated'
import Link from '@/components/Link'
import siteMetadata from '@/data/siteMetadata'
import tagData from 'app/tag-data.json'
import BlogFilters, { FilterState } from '@/components/BlogFilters'

// Fix timezone issue by parsing date as local time
function formatDateLocal(dateString: string, locale: string) {
  const [year, month, day] = dateString.split('T')[0].split('-').map(Number)
  const date = new Date(year, month - 1, day)
  return date.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

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
          <BlogFilters allTags={tagCounts} onFiltersChange={handleFiltersChange} />

          {/* Results count when filtering */}
          {hasActiveFilters && (
            <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Showing {filteredAndSortedPosts.length} of {posts.length} posts
            </div>
          )}
        </div>

        <div className="flex sm:space-x-24">
          <div className="hidden h-full max-h-screen max-w-[280px] min-w-[280px] flex-wrap overflow-auto rounded-sm bg-gray-50 pt-5 shadow-md sm:flex dark:bg-gray-900/70 dark:shadow-gray-800/40">
            <div className="px-6 py-4">
              {pathname.startsWith('/blog') ? (
                <h3 className="text-primary-500 font-bold uppercase">All Posts</h3>
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
                        <h3 className="text-primary-500 inline px-3 py-2 text-sm font-bold uppercase">
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
                  onClick={() => setShowAllTags(!showAllTags)}
                  className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400 mt-2 px-3 text-sm font-medium transition-colors"
                >
                  {showAllTags ? '← Show less' : `See more (${sortedTags.length - 8})`}
                </button>
              )}
            </div>
          </div>
          <div className="w-full">
            {!displayPosts.length && (
              <div className="py-12 text-center">
                <div className="text-gray-500 dark:text-gray-400">
                  <svg
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
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {displayPosts.map((post) => {
                const { path, date, title } = post
                return (
                  <article
                    key={path}
                    className="group relative flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-gray-700 dark:bg-gray-800/50"
                  >
                    {/* Animated gradient border on hover */}
                    <div className="from-primary-500 absolute inset-0 rounded-lg bg-gradient-to-r via-purple-500 to-cyan-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    <div className="absolute inset-[2px] rounded-lg bg-white dark:bg-gray-800/95" />

                    <Link href={`/${path}`} className="relative flex flex-1 flex-col p-5">
                      <h2 className="mb-3 text-lg leading-6 font-bold tracking-tight">
                        <span className="group-hover:from-primary-500 relative text-gray-900 transition-colors duration-300 group-hover:bg-gradient-to-r group-hover:via-purple-500 group-hover:to-cyan-500 group-hover:bg-clip-text group-hover:text-transparent dark:text-gray-100">
                          {title}
                        </span>
                      </h2>
                      <div className="mt-auto border-t border-gray-100 pt-3 dark:border-gray-700">
                        <time
                          dateTime={date}
                          className="text-xs text-gray-500 dark:text-gray-400"
                          suppressHydrationWarning
                        >
                          {formatDateLocal(date, siteMetadata.locale)}
                        </time>
                      </div>
                    </Link>
                  </article>
                )
              })}
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
