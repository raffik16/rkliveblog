import NextLink from 'next/link'
import tagData from 'app/tag-data.json'
import { genPageMetadata } from 'app/seo'
import EdChapterHead from '@/components/edition/EdChapterHead'
import EdNote from '@/components/edition/EdNote'

export const metadata = genPageMetadata({
  title: 'Topics',
  description: 'Every topic on the blog, with how many posts cover it.',
  path: '/tags',
})

export default async function Page() {
  const tagCounts = tagData as Record<string, number>
  const sortedTags = Object.keys(tagCounts).sort(
    (a, b) => tagCounts[b] - tagCounts[a] || a.localeCompare(b)
  )

  return (
    <div className="ed-page">
      <section
        className="ed-chapter ed-chapter--first"
        data-chapter="intro"
        data-chapter-color="var(--ed-ink)"
        aria-labelledby="topics-title"
      >
        <div className="ed-shell">
          <div className="ed-chapter-head--page">
            <EdChapterHead
              num="02"
              kicker={`${sortedTags.length} topics`}
              title="Topics"
              as="h1"
              id="topics-title"
            >
              <p>Everything the blog covers, the topics with the most posts first.</p>
            </EdChapterHead>
          </div>
          <div className="ed-notes">
            <EdNote index={1} label="Filter">
              To combine topics, pick several at once on the{' '}
              <NextLink href="/blog">blog page</NextLink>.
            </EdNote>
          </div>
          {sortedTags.length === 0 ? (
            <p className="ed-lede">No topics yet.</p>
          ) : (
            <ol className="ed-topic-index ed-topic-index--all">
              {sortedTags.map((t, i) => (
                <li key={t} data-reveal="">
                  <NextLink href={`/tags/${t}`} aria-label={`${t}: ${tagCounts[t]} posts`}>
                    <span className="ed-topic-index__no">{String(i + 1).padStart(2, '0')}</span>
                    <span className="ed-topic-index__name">{t}</span>
                    <span className="ed-topic-index__rule" aria-hidden="true" />
                    <span className="ed-topic-index__count">{tagCounts[t]}</span>
                  </NextLink>
                </li>
              ))}
            </ol>
          )}
        </div>
      </section>
    </div>
  )
}
