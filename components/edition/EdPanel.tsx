import { ReactNode } from 'react'
import NextLink from 'next/link'
import { cx } from '@/lib/edition/cx'

interface Props {
  title: ReactNode
  /** Makes the title a link that covers the whole panel (pills stay clickable above it). */
  href?: string
  /** Mono line under the title */
  sub?: ReactNode
  size?: 'sm' | 'md' | 'lg'
  headingLevel?: 'h2' | 'h3'
  actions?: ReactNode
  media?: ReactNode
  className?: string
  children?: ReactNode
}

// Translucent content panel (raffi.website's components/EdPanel.vue): "• Title", body copy,
// optional pill actions, optional media below. A corner tick marks the top right.
export default function EdPanel({
  title,
  href,
  sub,
  size = 'md',
  headingLevel: Heading = 'h3',
  actions,
  media,
  className = '',
  children,
}: Props) {
  const isExternal = !!href && /^https?:\/\//.test(href)
  const titleInner = (
    <>
      <span className="ed-panel__dot" aria-hidden="true" />
      {href ? (
        isExternal ? (
          <a href={href} className="ed-panel__stretch" target="_blank" rel="noopener noreferrer">
            {title}
          </a>
        ) : (
          <NextLink href={href} className="ed-panel__stretch">
            {title}
          </NextLink>
        )
      ) : (
        title
      )}
    </>
  )

  return (
    <article className={cx('ed-panel', `ed-panel--${size}`, className)} data-reveal="">
      <div className="ed-panel__text">
        <Heading className="ed-panel__title">{titleInner}</Heading>
        {sub && <div className="ed-panel__sub">{sub}</div>}
        {children && <div className="ed-panel__body">{children}</div>}
        {actions && <div className="ed-panel__actions">{actions}</div>}
      </div>
      {media && <div className="ed-panel__media">{media}</div>}
    </article>
  )
}
