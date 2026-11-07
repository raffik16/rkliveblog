import siteMetadata from '@/data/siteMetadata'

// Small helpers shared by the post lists and the post pages.

/** Minimal post shape the lists need (a CoreContent<Blog> satisfies it). */
export interface PostSummary {
  slug: string
  path: string
  date: string
  title: string
  summary?: string
  tags?: string[]
  readingTime?: { minutes?: number } | null
}

// Dates are stored as UTC midnight, so format them in UTC to avoid shifting by a day.
export function formatDate(value: string, style: 'long' | 'short' | 'month' = 'long') {
  const options: Intl.DateTimeFormatOptions =
    style === 'long'
      ? { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' }
      : style === 'short'
        ? { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' }
        : { year: 'numeric', month: 'short', timeZone: 'UTC' }
  return new Date(value).toLocaleDateString(siteMetadata.locale, options)
}

/** "Jan 28" (no year) */
export function formatDay(value: string) {
  return new Date(value).toLocaleDateString(siteMetadata.locale, {
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  })
}

/** Year straight from the ISO string, so the server's time zone can't shift it */
export const postYear = (date: string) => String(date).slice(0, 4)

export function readMinutes(readingTime?: { minutes?: number } | null) {
  const minutes = readingTime?.minutes
  return typeof minutes === 'number' && minutes > 0 ? Math.max(1, Math.ceil(minutes)) : null
}

export const postHref = (path: string) => `/${path.replace(/^\//, '')}`

/** Two-digit issue number: the oldest post is 01. `posts` must be sorted newest first. */
export function postNumber(posts: { slug: string }[], slug: string) {
  const i = posts.findIndex((p) => p.slug === slug)
  return i === -1 ? '' : String(posts.length - i).padStart(2, '0')
}

/** Posts grouped by year, newest year first (keeps the incoming order within a year). */
export function groupByYear<T extends { date: string }>(posts: T[]) {
  const groups: { year: string; posts: T[] }[] = []
  for (const post of posts) {
    const year = postYear(post.date)
    const last = groups[groups.length - 1]
    if (last && last.year === year) last.posts.push(post)
    else groups.push({ year, posts: [post] })
  }
  return groups
}
