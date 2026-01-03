'use client'

import { useState, useMemo, useCallback } from 'react'
import Link from '@/components/Link'
import Tag from '@/components/Tag'
import siteMetadata from '@/data/siteMetadata'
import { formatDate } from 'pliny/utils/formatDate'
import NewsletterForm from '@/components/NewsletterForm'
import { Hero6 } from '@/components/heroes'
import BlogFilters, { FilterState } from '@/components/BlogFilters'

const MAX_DISPLAY = 5

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
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        <div className="space-y-2 pt-6 pb-8 md:space-y-5">
          <h1 className="text-3xl leading-9 font-extrabold tracking-tight text-gray-900 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14 dark:text-gray-100">
            Latest
          </h1>
          <p className="text-lg leading-7 text-gray-500 dark:text-gray-400">
            {siteMetadata.description}
          </p>
        </div>

        {/* Smart Filter System */}
        <div className="pt-6">
          <BlogFilters allTags={tagData} onFiltersChange={handleFiltersChange} />

          {/* Results count when filtering */}
          {hasActiveFilters && (
            <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
              Showing {filteredAndSortedPosts.length} of {posts.length} posts
            </div>
          )}

          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {!displayPosts.length && (
              <li className="py-12 text-center">
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
              </li>
            )}
            {displayPosts.map((post) => {
              const { slug, date, title, summary, tags } = post
              return (
                <li key={slug} className="py-12">
                  <article>
                    <div className="space-y-2 xl:grid xl:grid-cols-4 xl:items-baseline xl:space-y-0">
                      <dl>
                        <dt className="sr-only">Published on</dt>
                        <dd className="text-base leading-6 font-medium text-gray-500 dark:text-gray-400">
                          <time dateTime={date}>{formatDate(date, siteMetadata.locale)}</time>
                        </dd>
                      </dl>
                      <div className="space-y-5 xl:col-span-3">
                        <div className="space-y-6">
                          <div>
                            <h2 className="text-2xl leading-8 font-bold tracking-tight">
                              <Link
                                href={`/blog/${slug}`}
                                className="text-gray-900 dark:text-gray-100"
                              >
                                {title}
                              </Link>
                            </h2>
                            <div className="flex flex-wrap">
                              {tags.map((tag) => (
                                <Tag key={tag} text={tag} />
                              ))}
                            </div>
                          </div>
                          <div className="prose max-w-none text-gray-500 dark:text-gray-400">
                            {summary}
                          </div>
                        </div>
                        <div className="text-base leading-6 font-medium">
                          <Link
                            href={`/blog/${slug}`}
                            className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
                            aria-label={`Read more: "${title}"`}
                          >
                            Read more &rarr;
                          </Link>
                        </div>
                      </div>
                    </div>
                  </article>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
      {!hasActiveFilters && posts.length > MAX_DISPLAY && (
        <div className="flex justify-end text-base leading-6 font-medium">
          <Link
            href="/blog"
            className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
            aria-label="All posts"
          >
            All Posts &rarr;
          </Link>
        </div>
      )}
      {siteMetadata.newsletter?.provider && (
        <div className="flex items-center justify-center pt-4">
          <NewsletterForm />
        </div>
      )}
    </>
  )
}
