import NextLink from 'next/link'
import { formatDate, postHref, readMinutes, type PostSummary } from '@/lib/posts'
import { cx } from '@/lib/edition/cx'

interface Props {
  post: PostSummary
  /** Use 'h2' when the list is not under a section heading */
  headingLevel?: 'h2' | 'h3'
  /** Two-digit issue number shown in the date column */
  number?: string
  /** Larger treatment, e.g. the newest post */
  lead?: boolean
}

// One post in a list: an editorial index row. Date and reading time in mono on the left, the
// title and summary in the middle, topics on the right. The title is the link; its ::after
// covers the row so the whole row is clickable while the accessible name stays the title.
export default function PostRow({ post, headingLevel: Heading = 'h3', number, lead }: Props) {
  const { path, date, title, summary, tags = [], readingTime } = post
  const minutes = readMinutes(readingTime)

  return (
    <li className={cx('ed-post', lead && 'ed-post--lead')} data-reveal="">
      <article className="ed-post__inner">
        <div className="ed-post__meta">
          {number && <span className="ed-post__no">No. {number}</span>}
          <time dateTime={date}>{formatDate(date, 'short')}</time>
          {minutes !== null && <span>{minutes} min read</span>}
        </div>
        <div className="ed-post__main">
          <Heading className="ed-post__title">
            <NextLink href={postHref(path)} className="ed-post__link">
              {title}
            </NextLink>
          </Heading>
          {summary && <p className="ed-post__summary">{summary}</p>}
        </div>
        {tags.length > 0 && (
          <ul className="ed-post__tags" aria-label="Topics">
            {tags.slice(0, 3).map((tag) => (
              <li key={tag}>{tag}</li>
            ))}
          </ul>
        )}
        <span className="ed-post__arrow" aria-hidden="true">
          →
        </span>
      </article>
    </li>
  )
}
