import Link from '@/components/Link'
import siteMetadata from '@/data/siteMetadata'

export interface PostCardPost {
  path: string
  date: string
  title: string
  summary?: string
  tags?: string[]
  /** contentlayer computed field (reading-time result); only `minutes` is used */
  readingTime?: { minutes?: number } | null
}

interface PostCardProps {
  post: PostCardPost
  /** Use 'h3' when the card list sits under a section h2 */
  headingLevel?: 'h2' | 'h3'
  /** Larger treatment for a highlighted card, e.g. the newest post */
  featured?: boolean
  className?: string
}

// Fix timezone issue by parsing date as local time
function formatDateLocal(dateString: string, locale: string) {
  const [year, month, day] = dateString.split('T')[0].split('-').map(Number)
  const date = new Date(year, month - 1, day)
  return date.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export default function PostCard({
  post,
  headingLevel: Heading = 'h2',
  featured = false,
  className = '',
}: PostCardProps) {
  const { path, date, title, summary, tags = [], readingTime } = post
  const minutes =
    typeof readingTime?.minutes === 'number' ? Math.max(1, Math.ceil(readingTime.minutes)) : null
  const href = `/${path.replace(/^\//, '')}`

  return (
    <article
      className={`group relative flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:shadow-xl motion-safe:hover:-translate-y-1 dark:border-gray-700 dark:bg-gray-800/50 ${className}`}
    >
      {/* Animated gradient border on hover / keyboard focus */}
      <div
        aria-hidden="true"
        className="from-primary-500 absolute inset-0 rounded-lg bg-gradient-to-r via-purple-500 to-cyan-500 opacity-0 transition-opacity duration-300 group-focus-within:opacity-100 group-hover:opacity-100"
      />
      <div
        aria-hidden="true"
        className="absolute inset-[2px] rounded-lg bg-white dark:bg-gray-800/95"
      />

      {/* The whole card is one link, so tags below are plain text (anchors can't nest) */}
      <Link
        href={href}
        className={`relative flex flex-1 flex-col rounded-lg focus-visible:-outline-offset-4 ${featured ? 'p-6 sm:p-8' : 'p-5'}`}
      >
        {featured && (
          <span className="text-primary-700 dark:text-primary-400 mb-2 text-xs font-semibold tracking-wide uppercase">
            Newest post
          </span>
        )}
        <Heading
          className={`mb-2 font-bold tracking-tight ${
            featured ? 'text-xl leading-7 sm:text-2xl sm:leading-8' : 'text-lg leading-6'
          }`}
        >
          <span className="group-hover:from-primary-500 relative text-gray-900 transition-colors duration-300 group-hover:bg-gradient-to-r group-hover:via-purple-500 group-hover:to-cyan-500 group-hover:bg-clip-text group-hover:text-transparent dark:text-gray-100">
            {title}
          </span>
        </Heading>
        {summary && (
          <p
            className={`mb-4 line-clamp-3 text-gray-600 dark:text-gray-400 ${
              featured ? 'text-base leading-7' : 'text-sm leading-6'
            }`}
          >
            {summary}
          </p>
        )}
        {tags.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-1.5">
            {tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600 uppercase dark:bg-gray-700/60 dark:text-gray-300"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        <div className="mt-auto flex flex-wrap items-center gap-x-2 border-t border-gray-100 pt-3 text-xs text-gray-500 dark:border-gray-700 dark:text-gray-400">
          <time dateTime={date} suppressHydrationWarning>
            {formatDateLocal(date, siteMetadata.locale)}
          </time>
          {minutes !== null && (
            <>
              <span aria-hidden="true">&middot;</span>
              <span>{minutes} min read</span>
            </>
          )}
        </div>
      </Link>
    </article>
  )
}
