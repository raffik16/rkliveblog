'use client'

import { ReactNode, useEffect, useRef } from 'react'

interface Props {
  num: string
  /** The heading text: what screen readers and search engines read. */
  title: string
  /** Optional giant display word. When set it is decorative and `title` shows below it. */
  display?: string
  kicker?: string
  as?: 'h1' | 'h2'
  /** Heading id, for aria-labelledby on the section */
  id?: string
  children?: ReactNode
}

// Chapter opener, as on raffi.website (components/EdChapterHead.vue): a boxed mono number and
// kicker, a giant title that fills in from an outline as it scrolls up the viewport, then an
// optional lede. The outline copy is drawn by CSS from data-text, so the words are in the DOM
// once. Without JS the fill shows straight away (see the <noscript> rule in app/layout.tsx).
export default function EdChapterHead({
  num,
  title,
  display,
  kicker,
  as: Tag = 'h2',
  id,
  children,
}: Props) {
  const rootRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLDivElement | HTMLHeadingElement>(null)
  const fillRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const root = rootRef.current
    const titleEl = titleRef.current
    const fill = fillRef.current
    if (!root || !titleEl || !fill) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      fill.style.clipPath = 'none'
      return
    }

    // Scrubbed like the main site's GSAP ScrollTrigger: the fill runs from 'top 85%' to
    // 'top 35%' of the viewport, and the title rises 18% while it enters.
    let raf = 0
    let shown = -1
    let lifted = -1
    const update = () => {
      raf = 0
      const vh = window.innerHeight
      const top = root.getBoundingClientRect().top
      const p = Math.min(1, Math.max(0, (vh * 0.85 - top) / (vh * 0.5)))
      const lift = Math.min(1, Math.max(0, (vh - top) / (vh * 0.7)))
      const fillAt = Math.round(p * 1000) / 1000
      if (fillAt !== shown) {
        shown = fillAt
        fill.style.clipPath = `inset(-20% ${(100 - fillAt * 110).toFixed(2)}% -20% -10%)`
      }
      const liftAt = Math.round(lift * 1000) / 1000
      if (liftAt !== lifted) {
        lifted = liftAt
        titleEl.style.transform = `translateY(${((1 - liftAt) * 18).toFixed(2)}%)`
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
    }
  }, [])

  return (
    <header ref={rootRef} className="ed-chapter-head">
      <div className="ed-chapter-head__meta">
        <span className="ed-num">{num}</span>
        {kicker && <span>{kicker}</span>}
      </div>
      {display ? (
        <>
          <div
            ref={titleRef as React.RefObject<HTMLDivElement>}
            className="ed-chapter-head__title ed-display"
            aria-hidden="true"
          >
            <span className="ed-chapter-head__outline" data-text={display} />
            <span ref={fillRef} className="ed-chapter-head__fill">
              {display}
            </span>
          </div>
          <Tag id={id} className="ed-chapter-head__heading">
            {title}
          </Tag>
        </>
      ) : (
        <Tag
          id={id}
          ref={titleRef as React.RefObject<HTMLHeadingElement>}
          className="ed-chapter-head__title ed-display"
        >
          <span className="ed-chapter-head__outline" aria-hidden="true" data-text={title} />
          <span ref={fillRef} className="ed-chapter-head__fill">
            {title}
          </span>
        </Tag>
      )}
      {children && (
        <div className="ed-chapter-head__lede ed-lede" data-reveal="">
          {children}
        </div>
      )}
    </header>
  )
}
