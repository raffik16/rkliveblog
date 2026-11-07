'use client'

import { useEffect, useState } from 'react'
import { useNavHidden } from '@/lib/edition/chapters'
import { cx } from '@/lib/edition/cx'

export interface TocEntry {
  value: string
  url: string
  depth: number
}

interface Props {
  toc: TocEntry[]
  /** Element whose scroll progress drives the progress strip */
  articleId: string
}

// The post's contents, in the chapter-rail style: a sticky list in the left column on desktop
// (same mono labels and square marks as raffi.website's EdChapterRail), and below 1100px the
// slim progress strip under the navbar with the current section and reading progress.
export default function PostToc({ toc, articleId }: Props) {
  const [active, setActive] = useState<string | null>(null)
  const navHidden = useNavHidden()

  useEffect(() => {
    const article = document.getElementById(articleId)
    const heads = toc
      .map((t) => document.getElementById(decodeURIComponent(t.url.replace(/^#/, ''))))
      .filter((el): el is HTMLElement => !!el)
    let raf = 0
    const update = () => {
      raf = 0
      const vh = window.innerHeight
      const line = vh * 0.3
      let current: string | null = null
      for (const h of heads) {
        if (h.getBoundingClientRect().top <= line) current = h.id
        else break
      }
      setActive(current)
      if (article) {
        const r = article.getBoundingClientRect()
        const p = Math.min(1, Math.max(0, (vh * 0.5 - r.top) / Math.max(1, r.height)))
        document.documentElement.style.setProperty('--ed-read', p.toFixed(3))
      }
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      document.documentElement.style.removeProperty('--ed-read')
    }
  }, [toc, articleId])

  const currentIndex = toc.findIndex((t) => t.url === `#${active}`)
  const current = currentIndex >= 0 ? toc[currentIndex] : null

  return (
    <>
      {toc.length > 0 && (
        <nav className="ed-toc" aria-labelledby="ed-toc-label">
          <p id="ed-toc-label" className="ed-toc__label">
            On this page
          </p>
          <ol className="ed-rail__list">
            {toc.map((t) => {
              const isActive = t.url === `#${active}`
              return (
                <li key={t.url} className={t.depth > 2 ? 'ed-toc__sub' : undefined}>
                  <a
                    href={t.url}
                    className={cx('ed-rail__item', isActive && 'is-active')}
                    aria-current={isActive ? 'location' : undefined}
                  >
                    <span className="ed-toc__text">{t.value}</span>
                    <span className="ed-rail__mark" aria-hidden="true" />
                  </a>
                </li>
              )
            })}
          </ol>
          <a href="#top" className="ed-toc__top">
            Back to top ↑
          </a>
        </nav>
      )}

      <div
        className={cx('ed-progress ed-progress--read', navHidden && 'is-raised')}
        aria-hidden="true"
      >
        <span className="ed-progress__label">
          <span className="ed-progress__num">
            {current ? String(currentIndex + 1).padStart(2, '0') : '00'}
          </span>
          <span className="ed-progress__sep">·</span>
          <span>{current ? current.value : 'Intro'}</span>
        </span>
        <span className="ed-progress__count">
          {toc.length ? `${Math.max(currentIndex + 1, 0)} / ${toc.length}` : ''}
        </span>
        <span className="ed-progress__track">
          <span className="ed-progress__fill" />
        </span>
      </div>
    </>
  )
}
