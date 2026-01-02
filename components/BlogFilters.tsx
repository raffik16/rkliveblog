'use client'

import { useState, useCallback, useMemo } from 'react'
import { slug } from 'github-slugger'

interface BlogFiltersProps {
  allTags: Record<string, number>
  onFiltersChange: (filters: FilterState) => void
}

export interface FilterState {
  searchQuery: string
  selectedTags: string[]
  sortBy: 'newest' | 'oldest' | 'title'
}

export default function BlogFilters({ allTags, onFiltersChange }: BlogFiltersProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'title'>('newest')
  const [isExpanded, setIsExpanded] = useState(false)

  const sortedTags = useMemo(() => {
    return Object.entries(allTags).sort((a, b) => b[1] - a[1])
  }, [allTags])

  const hasActiveFilters = searchQuery || selectedTags.length > 0 || sortBy !== 'newest'
  const activeFilterCount =
    (searchQuery ? 1 : 0) + selectedTags.length + (sortBy !== 'newest' ? 1 : 0)

  const updateFilters = useCallback(
    (updates: Partial<FilterState>) => {
      const newState = {
        searchQuery: updates.searchQuery ?? searchQuery,
        selectedTags: updates.selectedTags ?? selectedTags,
        sortBy: updates.sortBy ?? sortBy,
      }
      onFiltersChange(newState)
    },
    [searchQuery, selectedTags, sortBy, onFiltersChange]
  )

  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    updateFilters({ searchQuery: value })
  }

  const toggleTag = (tag: string) => {
    const newTags = selectedTags.includes(tag)
      ? selectedTags.filter((t) => t !== tag)
      : [...selectedTags, tag]
    setSelectedTags(newTags)
    updateFilters({ selectedTags: newTags })
  }

  const handleSortChange = (value: 'newest' | 'oldest' | 'title') => {
    setSortBy(value)
    updateFilters({ sortBy: value })
  }

  const clearAllFilters = () => {
    setSearchQuery('')
    setSelectedTags([])
    setSortBy('newest')
    onFiltersChange({ searchQuery: '', selectedTags: [], sortBy: 'newest' })
  }

  return (
    <div className="mb-8 rounded-xl border border-gray-200 bg-gray-50 p-3 sm:p-4 dark:border-gray-700 dark:bg-gray-800/50">
      {/* Search and Sort Row - Always horizontal */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Search Input */}
        <div className="relative min-w-0 flex-1">
          <label>
            <span className="sr-only">Search posts</span>
            <input
              aria-label="Search posts"
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search..."
              className="focus:border-primary-500 focus:ring-primary-500/20 block w-full rounded-lg border border-gray-300 bg-white py-2 pr-8 pl-8 text-sm text-gray-900 transition-colors focus:ring-2 sm:py-2.5 sm:pr-10 sm:pl-10 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-400"
            />
          </label>
          <svg
            className="absolute top-1/2 left-2 h-4 w-4 -translate-y-1/2 text-gray-400 sm:left-3"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          {searchQuery && (
            <button
              onClick={() => handleSearchChange('')}
              className="absolute top-1/2 right-2 -translate-y-1/2 text-gray-400 hover:text-gray-600 sm:right-3 dark:hover:text-gray-300"
              aria-label="Clear search"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>

        {/* Sort Dropdown */}
        <div className="flex shrink-0 items-center">
          <label
            htmlFor="sort-select"
            className="sr-only sm:not-sr-only sm:mr-2 sm:text-sm sm:text-gray-600 sm:dark:text-gray-400"
          >
            Sort:
          </label>
          <select
            id="sort-select"
            value={sortBy}
            onChange={(e) => handleSortChange(e.target.value as 'newest' | 'oldest' | 'title')}
            className="focus:border-primary-500 focus:ring-primary-500/20 rounded-lg border border-gray-300 bg-white px-2 py-2 text-sm text-gray-900 transition-colors focus:ring-2 sm:px-3 sm:py-2.5 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="title">A-Z</option>
          </select>
        </div>

        {/* Filter Toggle Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`flex shrink-0 items-center gap-1 rounded-lg border px-2 py-2 text-sm font-medium transition-all sm:gap-2 sm:px-4 sm:py-2.5 ${
            isExpanded || selectedTags.length > 0
              ? 'border-primary-500 bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400'
              : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:hover:border-gray-500'
          }`}
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
            />
          </svg>
          <span className="hidden sm:inline">Tags</span>
          {selectedTags.length > 0 && (
            <span className="bg-primary-500 flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold text-white">
              {selectedTags.length}
            </span>
          )}
          <svg
            className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Expandable Tags Section */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isExpanded ? 'mt-4 max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="border-t border-gray-200 pt-4 dark:border-gray-700">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Filter by tags
            </span>
            {selectedTags.length > 0 && (
              <button
                onClick={() => {
                  setSelectedTags([])
                  updateFilters({ selectedTags: [] })
                }}
                className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 text-xs"
              >
                Clear tags
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {sortedTags.map(([tag, count]) => {
              const isSelected = selectedTags.includes(tag)
              return (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-all ${
                    isSelected
                      ? 'bg-primary-500 hover:bg-primary-600 text-white shadow-sm'
                      : 'bg-white text-gray-700 ring-1 ring-gray-300 ring-inset hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:ring-gray-600 dark:hover:bg-gray-700'
                  }`}
                >
                  {tag}
                  <span
                    className={`text-xs ${isSelected ? 'text-primary-100' : 'text-gray-500 dark:text-gray-400'}`}
                  >
                    ({count})
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-4 dark:border-gray-700">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">Active filters:</span>
            {searchQuery && (
              <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2.5 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                Search: "{searchQuery}"
                <button
                  onClick={() => handleSearchChange('')}
                  className="ml-0.5 hover:text-blue-600 dark:hover:text-blue-200"
                >
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </span>
            )}
            {sortBy !== 'newest' && (
              <span className="inline-flex items-center gap-1 rounded-full bg-purple-100 px-2.5 py-1 text-xs font-medium text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
                {sortBy === 'oldest' ? 'Oldest First' : 'Title A-Z'}
                <button
                  onClick={() => handleSortChange('newest')}
                  className="ml-0.5 hover:text-purple-600 dark:hover:text-purple-200"
                >
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </span>
            )}
            {selectedTags.map((tag) => (
              <span
                key={tag}
                className="bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium"
              >
                {tag}
                <button
                  onClick={() => toggleTag(tag)}
                  className="hover:text-primary-600 dark:hover:text-primary-200 ml-0.5"
                >
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </span>
            ))}
          </div>
          <button
            onClick={clearAllFilters}
            className="text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  )
}
