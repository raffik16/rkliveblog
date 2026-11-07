'use client'

import { useId, useMemo, useState } from 'react'

interface BlogFiltersProps {
  allTags: Record<string, number>
  /** Current filters. The parent owns this state. */
  value: FilterState
  onFiltersChange: (filters: FilterState) => void
  /** "Showing N of M posts" line, shown while any filter is on */
  resultCount?: number
  totalCount?: number
}

export interface FilterState {
  searchQuery: string
  selectedTags: string[]
  sortBy: 'newest' | 'oldest' | 'title'
}

export const EMPTY_FILTERS: FilterState = { searchQuery: '', selectedTags: [], sortBy: 'newest' }

const SORTS: { value: FilterState['sortBy']; label: string }[] = [
  { value: 'newest', label: 'Newest' },
  { value: 'oldest', label: 'Oldest' },
  { value: 'title', label: 'A–Z' },
]

const VISIBLE_TAGS = 12

// Search, sort and topic filters for a post list: a hairline search field, a segmented sort
// control and topic chips, all in the raffi.website mono-pill style.
export default function BlogFilters({
  allTags,
  value,
  onFiltersChange,
  resultCount,
  totalCount,
}: BlogFiltersProps) {
  const { searchQuery, selectedTags, sortBy } = value
  const [showAll, setShowAll] = useState(false)
  const searchId = useId()
  const tagsId = useId()

  const sortedTags = useMemo(
    () => Object.entries(allTags).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])),
    [allTags]
  )
  // Selected topics always stay visible, even when they fall outside the first few.
  const visibleTags = showAll
    ? sortedTags
    : sortedTags.filter(([t], i) => i < VISIBLE_TAGS || selectedTags.includes(t))
  const hiddenCount = sortedTags.length - visibleTags.length

  const active = !!searchQuery || selectedTags.length > 0 || sortBy !== 'newest'
  const update = (updates: Partial<FilterState>) => onFiltersChange({ ...value, ...updates })
  const toggleTag = (tag: string) =>
    update({
      selectedTags: selectedTags.includes(tag)
        ? selectedTags.filter((t) => t !== tag)
        : [...selectedTags, tag],
    })

  return (
    <div className="ed-filter" role="search" aria-label="Filter posts">
      <div className="ed-filter__row">
        <div className="ed-filter__search">
          <label htmlFor={searchId} className="sr-only">
            Search posts
          </label>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.75}
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
            />
          </svg>
          <input
            id={searchId}
            type="search"
            value={searchQuery}
            onChange={(e) => update({ searchQuery: e.target.value })}
            placeholder="Search titles, summaries and topics"
            autoComplete="off"
            spellCheck={false}
          />
          {searchQuery && (
            <button
              type="button"
              className="ed-filter__clear-search"
              onClick={() => update({ searchQuery: '' })}
              aria-label="Clear search"
            >
              ×
            </button>
          )}
        </div>
        <div className="ed-filter__sort" role="group" aria-label="Sort posts">
          {SORTS.map((s) => (
            <button
              key={s.value}
              type="button"
              aria-pressed={sortBy === s.value}
              onClick={() => update({ sortBy: s.value })}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div className="ed-filter__tags" role="group" aria-labelledby={tagsId}>
        <span id={tagsId} className="ed-filter__label">
          Topics
        </span>
        {visibleTags.map(([tag, count]) => {
          const on = selectedTags.includes(tag)
          return (
            <button
              key={tag}
              type="button"
              className="ed-pill ed-pill--tag"
              aria-pressed={on}
              onClick={() => toggleTag(tag)}
            >
              {tag}
              <span className="ed-pill__count">{count}</span>
            </button>
          )
        })}
        {(hiddenCount > 0 || showAll) && (
          <button
            type="button"
            className="ed-filter__more"
            aria-expanded={showAll}
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? 'Fewer topics' : `+ ${hiddenCount} more`}
          </button>
        )}
      </div>

      <div className="ed-filter__status" aria-live="polite">
        {active && typeof resultCount === 'number' && (
          <>
            <span>
              Showing {resultCount} of {totalCount} posts
            </span>
            <button type="button" onClick={() => onFiltersChange(EMPTY_FILTERS)}>
              Clear filters
            </button>
          </>
        )}
      </div>
    </div>
  )
}
