'use client'

import { useState, useMemo, useCallback } from 'react'
import Link from '@/components/Link'
import siteMetadata from '@/data/siteMetadata'
import NewsletterForm from '@/components/NewsletterForm'
import BlogFilters, { FilterState } from '@/components/BlogFilters'
import PostCard from '@/components/PostCard'

const MAX_DISPLAY = 10

interface Post {
  slug: string
  date: string
  title: string
  summary?: string
  tags: string[]
  path: string
  /** contentlayer computed field; optional so partial post objects still type-check */
  readingTime?: { minutes?: number } | null
}

interface HomeProps {
  posts: Post[]
  tagData: Record<string, number>
}

export default function Home({ posts, tagData }: HomeProps) {
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    selectedTags: [],
    sortBy: 'newest',
  })
  const [showAllTags, setShowAllTags] = useState(false)

  const tagKeys = Object.keys(tagData)
  const sortedTags = tagKeys.sort((a, b) => tagData[b] - tagData[a])
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

  const toggleTag = useCallback((tag: string) => {
    setFilters((prev) => {
      const isSelected = prev.selectedTags.includes(tag)
      return {
        ...prev,
        selectedTags: isSelected
          ? prev.selectedTags.filter((t) => t !== tag)
          : [...prev.selectedTags, tag],
      }
    })
  }, [])

  // When filters are active, show all matching posts; otherwise limit to MAX_DISPLAY
  const displayPosts = hasActiveFilters
    ? filteredAndSortedPosts
    : filteredAndSortedPosts.slice(0, MAX_DISPLAY)

  return (
    <>
      {/* The hero (with the page's only h1) and the lab row are rendered by app/page.tsx */}
      <section aria-labelledby="latest-heading">
        <div className="space-y-2 pt-6 pb-8 md:space-y-5">
          <h2
            id="latest-heading"
            className="text-3xl leading-9 font-extrabold tracking-tight text-gray-900 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14 dark:text-gray-100"
          >
            Latest
          </h2>
          <p className="text-lg leading-7 text-gray-500 dark:text-gray-400">
            The newest writing first. Search, sort or filter by topic to dig further back.
          </p>
        </div>

        {/* Smart Filter System */}
        <div className="mb-6">
          <BlogFilters allTags={tagData} value={filters} onFiltersChange={handleFiltersChange} />

          {/* Results count when filtering */}
          {hasActiveFilters && (
            <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Showing {filteredAndSortedPosts.length} of {posts.length} posts
            </div>
          )}
        </div>

        <div className="flex lg:gap-8 xl:gap-10">
          {/* Left Sidebar - Tags (from lg, so the card grid keeps its width on tablets) */}
          <div className="hidden h-full w-64 shrink-0 flex-wrap rounded-sm bg-gray-50 pt-5 shadow-md lg:flex dark:bg-gray-900/70 dark:shadow-gray-800/40">
            <div className="w-full px-5 py-4">
              <div className="flex items-center justify-between">
                <h3 className="text-primary-700 dark:text-primary-500 font-bold uppercase">
                  Filter by Tag
                </h3>
                {filters.selectedTags.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setFilters((prev) => ({ ...prev, selectedTags: [] }))}
                    className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    Clear all
                  </button>
                )}
              </div>
              <ul>
                {displayTags.map((t) => {
                  const isSelected = filters.selectedTags.includes(t)
                  return (
                    <li key={t} className="my-2">
                      <button
                        type="button"
                        onClick={() => toggleTag(t)}
                        className={`w-full rounded-md px-3 py-2 text-left text-sm font-medium uppercase transition-all duration-200 ${
                          isSelected
                            ? 'bg-primary-500 text-white shadow-sm'
                            : 'hover:text-primary-500 text-gray-500 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                        }`}
                        aria-label={`${isSelected ? 'Remove' : 'Add'} filter for ${t}`}
                      >
                        <span className="flex items-center justify-between">
                          <span>{t}</span>
                          <span
                            className={`text-xs ${isSelected ? 'text-white/80' : 'text-gray-400'}`}
                          >
                            {tagData[t]}
                          </span>
                        </span>
                      </button>
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

          {/* Main Content - Grid Posts */}
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
              {displayPosts.map((post, index) => {
                // Highlight the newest post only in the default (unfiltered) view
                const featured = !hasActiveFilters && index === 0
                return (
                  <PostCard
                    key={post.slug}
                    post={post}
                    headingLevel="h3"
                    featured={featured}
                    className={featured ? 'md:col-span-2' : ''}
                  />
                )
              })}
            </div>

            {!hasActiveFilters && posts.length > MAX_DISPLAY && (
              <div className="mt-8 flex justify-end text-base leading-6 font-medium">
                <Link
                  href="/blog"
                  className="text-primary-700 hover:text-primary-800 dark:text-primary-500 dark:hover:text-primary-400"
                  aria-label="All posts"
                >
                  All Posts &rarr;
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>
      {siteMetadata.newsletter?.provider && (
        <div className="flex items-center justify-center pt-4">
          <NewsletterForm />
        </div>
      )}
    </>
  )
}
