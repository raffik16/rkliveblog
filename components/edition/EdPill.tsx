import { ReactNode } from 'react'
import NextLink from 'next/link'
import { cx } from '@/lib/edition/cx'

type Variant = 'dark' | 'outline' | 'light' | 'signal' | 'tag'

interface Props {
  href?: string
  variant?: Variant
  size?: 'md' | 'lg'
  arrow?: boolean
  className?: string
  children: ReactNode
  'aria-label'?: string
  'aria-current'?: 'page' | 'true'
}

// Small mono pill used for calls to action and tags (raffi.website's components/EdPill.vue).
// Internal routes render a next/link, http(s)/mailto/hash links an <a>; external links open in
// a new tab and show a ↗.
export default function EdPill({
  href,
  variant = 'dark',
  size = 'md',
  arrow = false,
  className = '',
  children,
  ...aria
}: Props) {
  const cls = cx('ed-pill', `ed-pill--${variant}`, size === 'lg' && 'ed-pill--lg', className)
  const isHttp = !!href && /^https?:\/\//.test(href)
  const arrowEl = arrow ? (
    <span className="ed-pill__arrow" aria-hidden="true">
      {isHttp ? '↗' : '→'}
    </span>
  ) : null

  if (href && href.startsWith('/')) {
    return (
      <NextLink href={href} className={cls} {...aria}>
        {children}
        {arrowEl}
      </NextLink>
    )
  }
  if (href) {
    return (
      <a
        href={href}
        className={cls}
        target={isHttp ? '_blank' : undefined}
        rel={isHttp ? 'noopener noreferrer' : undefined}
        {...aria}
      >
        {children}
        {arrowEl}
      </a>
    )
  }
  return (
    <span className={cls} {...aria}>
      {children}
      {arrowEl}
    </span>
  )
}
