'use client'

import { scrollToChapter, useChapters, useNavHidden } from '@/lib/edition/chapters'
import { cx } from '@/lib/edition/cx'

// Desktop (>= 1100px): fixed chapter index in the left margin. Below that: a slim progress
// strip under the navbar. Same as raffi.website's components/EdChapterRail.vue. The chapters
// come from EdBackdrop, which reads them from [data-chapter] sections on the page; the intro
// chapter is left out and hides the rail while it holds the screen.
export default function EdRail() {
  const { chapters, active } = useChapters()
  const navHidden = useNavHidden()

  const items = chapters
    .filter((c) => c.rail && c.id !== 'intro' && c.id !== 'end')
    .map((c, i) => ({ ...c, num: c.num || String(i + 1).padStart(2, '0') }))
  const currentIndex = items.findIndex((c) => c.id === active)
  const current = currentIndex >= 0 ? items[currentIndex] : null
  const hidden = items.length < 2 || !current

  if (!items.length) return null

  return (
    <>
      <nav
        className={cx('ed-rail', hidden && 'is-hidden')}
        aria-label="Sections on this page"
        aria-hidden={hidden ? 'true' : undefined}
      >
        <ol className="ed-rail__list">
          {items.map((c) => (
            <li key={c.id}>
              <a
                href={`#${c.id}`}
                className={cx('ed-rail__item', c.id === active && 'is-active')}
                aria-current={c.id === active ? 'location' : undefined}
                tabIndex={hidden ? -1 : undefined}
                onClick={(e) => {
                  e.preventDefault()
                  scrollToChapter(c.id)
                }}
              >
                <span className="ed-rail__label">{c.label}</span>
                <span className="ed-rail__mark" aria-hidden="true" />
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <div
        className={cx('ed-progress', (hidden || !current) && 'is-hidden', navHidden && 'is-raised')}
        aria-hidden="true"
      >
        <span className="ed-progress__label">
          <span className="ed-progress__num">{current?.num}</span>
          <span className="ed-progress__sep">·</span>
          <span>{current?.label}</span>
        </span>
        <span className="ed-progress__count">
          {currentIndex + 1} / {items.length}
        </span>
        <span className="ed-progress__track">
          <span className="ed-progress__fill" />
        </span>
      </div>
    </>
  )
}
