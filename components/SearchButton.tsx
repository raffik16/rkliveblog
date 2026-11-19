'use client'

import { useSiteSearch } from './SiteSearchContext'

// Opens the site search (components/SiteSearch.tsx; also ⌘K / Ctrl+K). A mono pill in the
// navbar; icon only on phones. Pointing at it starts loading the post index.
const SearchButton = () => {
  const { open, preload } = useSiteSearch()

  return (
    <button
      type="button"
      aria-label="Search posts and Lab demos"
      aria-haspopup="dialog"
      aria-keyshortcuts="Meta+K Control+K"
      className="ed-nav__search"
      onClick={open}
      onPointerEnter={preload}
      onFocus={preload}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.75}
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
        />
      </svg>
      <span className="ed-nav__search-label" aria-hidden="true">
        Search
      </span>
      <kbd className="ed-nav__kbd" aria-hidden="true">
        ⌘K
      </kbd>
    </button>
  )
}

export default SearchButton
