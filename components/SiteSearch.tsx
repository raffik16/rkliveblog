'use client'

import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from 'react'
import { usePathname, useRouter } from 'next/navigation'
import demosData from '@/data/demosData'
import siteMetadata from '@/data/siteMetadata'
import { formatDate } from '@/lib/posts'
import { createSearch, labItems, postItems, type SearchItem } from '@/lib/search'
import { cx } from '@/lib/edition/cx'
import { SiteSearchContext } from './SiteSearchContext'

// Site search: posts and Lab demos in one list, in a <dialog> opened from the navbar's Search
// pill (components/SearchButton.tsx, through useSiteSearch()) or with ⌘K / Ctrl+K. The Lab ships
// with the page, so it can be searched at once; the post index (/search.json) loads the first
// time someone reaches for search, hovering the pill included, and the list fills in when it
// lands. Matching and ranking live in lib/search.ts.

const LAB = labItems(demosData)

function indexPath() {
  const search = siteMetadata.search
  if (search && search.provider === 'kbar') {
    const path = search.kbarConfig?.searchDocumentsPath
    if (typeof path === 'string' && path) return path
  }
  return '/search.json'
}

const plural = (count: number, word: string) => `${count} ${word}${count === 1 ? '' : 's'}`

export default function SiteSearch({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const dialogRef = useRef<HTMLDialogElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const listId = useId()
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)

  // Posts are null until the index has loaded
  const [posts, setPosts] = useState<SearchItem[] | null>(null)
  const [failed, setFailed] = useState(false)
  const request = useRef<Promise<void> | null>(null)

  const preload = useCallback(() => {
    if (request.current) return
    setFailed(false)
    request.current = fetch(indexPath())
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`)
        return response.json()
      })
      .then((index: unknown) => setPosts(postItems(index)))
      .catch(() => {
        request.current = null // try again the next time search opens
        setFailed(true)
      })
  }, [])

  const open = useCallback(() => {
    preload()
    const dialog = dialogRef.current
    if (!dialog) return
    if (!dialog.open) {
      // Every search starts empty
      setQuery('')
      setActive(0)
      dialog.showModal()
      setIsOpen(true)
    }
    // Focus inside the tap or key press that opened it, so phones bring up the keyboard
    inputRef.current?.focus()
  }, [preload])

  const close = useCallback(() => dialogRef.current?.close(), [])

  // The close event (Escape, a click outside, a result, ⌘K) is queued, so it can land after the
  // dialog has opened again; then it is old news.
  const onClose = useCallback(() => {
    if (!dialogRef.current?.open) setIsOpen(false)
  }, [])

  // ⌘K / Ctrl+K opens and closes it from anywhere
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (!event.key || event.key.toLowerCase() !== 'k') return
      if (!(event.metaKey || event.ctrlKey) || event.altKey || event.shiftKey) return
      if (event.isComposing) return
      event.preventDefault()
      if (dialogRef.current?.open) close()
      else open()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, close])

  // Close when the page changes underneath it (the back button, say)
  useEffect(() => {
    close()
  }, [pathname, close])

  // On phones the on-screen keyboard covers the bottom of the screen: keep the panel above it
  useEffect(() => {
    const dialog = dialogRef.current
    const viewport = window.visualViewport
    if (!isOpen || !dialog || !viewport) return
    const fit = () => dialog.style.setProperty('--ed-search-h', `${viewport.height}px`)
    fit()
    viewport.addEventListener('resize', fit)
    return () => {
      viewport.removeEventListener('resize', fit)
      dialog.style.removeProperty('--ed-search-h')
    }
  }, [isOpen])

  const items = useMemo(() => (posts ? [...LAB, ...posts] : LAB), [posts])
  const search = useMemo(() => createSearch(items), [items])
  const results = useMemo(() => search(query), [search, query])
  const activeIndex = Math.min(active, results.length - 1)
  const optionId = (index: number) => `${listId}-${index}`

  const go = (item: SearchItem, newTab: boolean) => {
    if (newTab) {
      window.open(item.href, '_blank', 'noopener')
      return
    }
    close()
    if (item.href !== pathname) router.push(item.href)
  }

  const onInputKeyDown = (event: ReactKeyboardEvent<HTMLInputElement>) => {
    if (event.nativeEvent.isComposing || !results.length) return
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      const step = event.key === 'ArrowDown' ? 1 : -1
      const next = (activeIndex + step + results.length) % results.length
      setActive(next)
      document.getElementById(optionId(next))?.scrollIntoView({ block: 'nearest' })
    } else if (event.key === 'Enter') {
      event.preventDefault()
      go(results[activeIndex], event.metaKey || event.ctrlKey)
    }
  }

  // Only a real pointer move picks a result, not the list scrolling under a resting pointer
  const pointer = useRef({ x: -1, y: -1 })
  // A click on the dim area around the panel closes it; a drag that ends there doesn't
  const pressedOutside = useRef(false)

  const api = useMemo(() => ({ open, preload }), [open, preload])

  const status = failed
    ? 'Posts didn’t load, so only Lab demos are listed'
    : !posts
      ? 'Loading posts…'
      : query.trim()
        ? plural(results.length, 'result')
        : `${plural(posts.length, 'post')} and ${plural(LAB.length, 'Lab demo')}`

  return (
    <SiteSearchContext.Provider value={api}>
      {children}
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions -- the click is the pointer's way out; Escape closes it from the keyboard */}
      <dialog
        ref={dialogRef}
        className="ed-search"
        aria-label="Search posts and Lab demos"
        onClose={onClose}
        onMouseDown={(event) => {
          pressedOutside.current = event.target === event.currentTarget
        }}
        onClick={(event) => {
          if (pressedOutside.current && event.target === event.currentTarget) close()
        }}
      >
        <div className="ed-search__panel">
          <div className="ed-search__field">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.75}
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
              />
            </svg>
            <input
              ref={inputRef}
              type="text"
              role="combobox"
              aria-label="Search posts and Lab demos"
              aria-autocomplete="list"
              aria-expanded={isOpen && results.length > 0}
              aria-controls={isOpen ? listId : undefined}
              aria-activedescendant={isOpen && activeIndex >= 0 ? optionId(activeIndex) : undefined}
              placeholder="Search posts and the Lab"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value)
                setActive(0)
              }}
              onKeyDown={onInputKeyDown}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
              enterKeyHint="go"
            />
            <button
              type="button"
              className="ed-search__close"
              aria-label="Close search"
              onClick={close}
            >
              <span className="ed-search__close-key">esc</span>
              <span className="ed-search__close-word">Close</span>
            </button>
          </div>

          {isOpen && (
            <div className="ed-search__body">
              <ul
                id={listId}
                role="listbox"
                aria-label="Results"
                className="ed-search__list"
                hidden={!results.length}
                // Keep the focus in the field when a result is pressed
                onMouseDown={(event) => event.preventDefault()}
              >
                {results.map((item, index) => (
                  // eslint-disable-next-line jsx-a11y/click-events-have-key-events -- the keys live on the field: arrows move through the options, Enter opens one
                  <li
                    key={`${item.kind}:${item.href}`}
                    id={optionId(index)}
                    role="option"
                    aria-selected={index === activeIndex}
                    className="ed-search__item"
                    onMouseMove={(event) => {
                      const { clientX: x, clientY: y } = event
                      if (x === pointer.current.x && y === pointer.current.y) return
                      pointer.current = { x, y }
                      if (index !== activeIndex) setActive(index)
                    }}
                    onClick={(event) => go(item, event.metaKey || event.ctrlKey)}
                    onAuxClick={(event) => {
                      if (event.button === 1) go(item, true)
                    }}
                  >
                    <span
                      className={cx(
                        'ed-search__kind',
                        item.kind === 'lab' && 'ed-search__kind--lab'
                      )}
                    >
                      {item.kind === 'lab' ? 'Lab' : 'Post'}
                    </span>
                    <span className="ed-search__text">
                      <span className="ed-search__title">{item.title}</span>
                      <span className="ed-search__meta">
                        {[item.date && formatDate(item.date, 'short'), ...item.tags.slice(0, 3)]
                          .filter(Boolean)
                          .join(' · ')}
                      </span>
                    </span>
                    <span className="ed-search__go" aria-hidden="true">
                      ↵
                    </span>
                  </li>
                ))}
              </ul>
              {!results.length &&
                (posts || failed ? (
                  <div className="ed-search__empty">
                    <p>Nothing matches “{query.trim()}”.</p>
                    <p>
                      Search looks at titles, topics, summaries and what each Lab demo is built
                      with. Try fewer or shorter words.
                    </p>
                  </div>
                ) : (
                  <div className="ed-search__empty">
                    <p>Still loading the posts…</p>
                  </div>
                ))}
            </div>
          )}

          <div className="ed-search__foot">
            <p role="status" className="ed-search__status">
              {isOpen ? status : ''}
            </p>
            <p className="ed-search__keys" aria-hidden="true">
              <kbd>↑</kbd>
              <kbd>↓</kbd> to move <kbd>↵</kbd> to open <kbd>esc</kbd> to close
            </p>
          </div>
        </div>
      </dialog>
    </SiteSearchContext.Provider>
  )
}
