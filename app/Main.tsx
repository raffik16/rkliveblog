'use client'

import { useState, useMemo, useCallback } from 'react'
import { slug } from 'github-slugger'
import Link from '@/components/Link'
import Tag from '@/components/Tag'
import siteMetadata from '@/data/siteMetadata'
import { formatDate } from 'pliny/utils/formatDate'
import NewsletterForm from '@/components/NewsletterForm'
import { Hero6 } from '@/components/heroes'
import BlogFilters, { FilterState } from '@/components/BlogFilters'

const MAX_DISPLAY = 6

interface Post {
  slug: string
  date: string
  title: string
  summary?: string
  tags: string[]
  path: string
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

  const tagKeys = Object.keys(tagData)
  const sortedTags = tagKeys.sort((a, b) => tagData[b] - tagData[a])

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

  // When filters are active, show all matching posts; otherwise limit to MAX_DISPLAY
  const displayPosts = hasActiveFilters
    ? filteredAndSortedPosts
    : filteredAndSortedPosts.slice(0, MAX_DISPLAY)

  return (
    <>
      <Hero6 />
      <div>
        <div className="space-y-2 pt-6 pb-8 md:space-y-5">
          <h1 className="text-3xl leading-9 font-extrabold tracking-tight text-gray-900 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14 dark:text-gray-100">
            Latest
          </h1>
          <p className="text-lg leading-7 text-gray-500 dark:text-gray-400">
            {siteMetadata.description}
          </p>
        </div>

        {/* Smart Filter System */}
        <div className="mb-6">
          <BlogFilters allTags={tagData} onFiltersChange={handleFiltersChange} />

          {/* Results count when filtering */}
          {hasActiveFilters && (
            <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Showing {filteredAndSortedPosts.length} of {posts.length} posts
            </div>
          )}
        </div>

        <div className="flex sm:space-x-24">
          {/* Left Sidebar - Tags */}
          <div className="hidden h-full max-h-screen max-w-[280px] min-w-[280px] flex-wrap overflow-auto rounded-sm bg-gray-50 pt-5 shadow-md sm:flex dark:bg-gray-900/70 dark:shadow-gray-800/40">
            <div className="px-6 py-4">
              <h3 className="text-primary-500 font-bold uppercase">All Posts</h3>
              <ul>
                {sortedTags.map((t) => {
                  return (
                    <li key={t} className="my-3">
                      <Link
                        href={`/tags/${slug(t)}`}
                        className="hover:text-primary-500 dark:hover:text-primary-500 px-3 py-2 text-sm font-medium text-gray-500 uppercase dark:text-gray-300"
                        aria-label={`View posts tagged ${t}`}
                      >
                        {`${t} (${tagData[t]})`}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>
          </div>

          {/* Main Content - Grid Posts */}
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
                const { slug: postSlug, date, title, summary, tags } = post
                return (
                  <article
                    key={postSlug}
                    className="group flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all duration-200 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800/50"
                  >
                    <div className="flex flex-1 flex-col p-5">
                      <div className="mb-3 flex flex-wrap gap-1">
                        {tags.map((tag) => (
                          <Tag key={tag} text={tag} />
                        ))}
                      </div>
                      <h2 className="mb-2 text-lg leading-6 font-bold tracking-tight">
                        <Link
                          href={`/blog/${postSlug}`}
                          className="group-hover:text-primary-500 dark:group-hover:text-primary-400 text-gray-900 transition-colors dark:text-gray-100"
                        >
                          {title}
                        </Link>
                      </h2>
                      <p className="mb-4 line-clamp-3 flex-1 text-sm text-gray-500 dark:text-gray-400">
                        {summary}
                      </p>
                      <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-4 dark:border-gray-700">
                        <time dateTime={date} className="text-xs text-gray-500 dark:text-gray-400">
                          {formatDate(date, siteMetadata.locale)}
                        </time>
                        <Link
                          href={`/blog/${postSlug}`}
                          className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400 text-xs font-medium"
                        >
                          Read more →
                        </Link>
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>

            {!hasActiveFilters && posts.length > MAX_DISPLAY && (
              <div className="mt-8 flex justify-end text-base leading-6 font-medium">
                <Link
                  href="/blog"
                  className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
                  aria-label="All posts"
                >
                  All Posts &rarr;
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
      {siteMetadata.newsletter?.provider && (
        <div className="flex items-center justify-center pt-4">
          <NewsletterForm />
        </div>
      )}
    </>
  )
}
