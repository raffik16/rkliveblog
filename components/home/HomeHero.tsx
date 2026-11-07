import NextLink from 'next/link'
import EdPill from '@/components/edition/EdPill'
import brand from '@/data/brand'
import siteMetadata from '@/data/siteMetadata'
import { formatDate, formatDay, postHref, postNumber, type PostSummary } from '@/lib/posts'

interface Props {
  posts: PostSummary[]
  topics: { tag: string; count: number }[]
  demos: number
  chapters: { id: string; num: string; label: string }[]
}

const WORD = 'Blog'

// First screen of the homepage, laid out like raffi.website's hero (components/EdHero.vue):
// the lead on the left, a framed figure in the middle (here: the contents, newest first), a
// column of stat cards on the right, and a giant word along the bottom.
export default function HomeHero({ posts, topics, demos, chapters }: Props) {
  const latest = posts[0]
  const contents = posts.slice(0, 10)
  const first = posts[posts.length - 1]
  const since = first ? first.date.slice(0, 4) : String(new Date().getFullYear())

  // Posts per month from the first post to the newest, for the figure's sparkline.
  const months: { key: string; count: number }[] = []
  if (first && latest) {
    const start = new Date(first.date)
    const end = new Date(latest.date)
    const cursor = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth(), 1))
    while (cursor <= end) {
      const key = cursor.toISOString().slice(0, 7)
      months.push({ key, count: posts.filter((p) => p.date.slice(0, 7) === key).length })
      cursor.setUTCMonth(cursor.getUTCMonth() + 1)
    }
  }
  const maxMonth = Math.max(1, ...months.map((m) => m.count))
  const topBars = topics.slice(0, 8).map((t) => t.count)
  const maxBar = Math.max(1, ...topBars)

  return (
    <section
      className="ed-hero"
      id="intro"
      aria-labelledby="home-title"
      data-chapter="intro"
      data-chapter-color="var(--ed-ink)"
    >
      <div className="ed-shell ed-hero__body">
        <div className="ed-wide ed-hero__grid">
          <div className="ed-hero__lead">
            {latest && (
              <NextLink
                href={postHref(latest.path)}
                className="ed-hero__status ed-intro"
                style={{ ['--ed-in' as string]: 0 }}
              >
                <span className="ed-hero__status-dot" aria-hidden="true" />
                New post · {formatDay(latest.date)}
              </NextLink>
            )}
            <p className="ed-hero__name ed-intro" style={{ ['--ed-in' as string]: 1 }}>
              {brand.name}, notes from a web developer in {brand.place}
            </p>
            <h1 id="home-title" className="ed-hero__title">
              <span className="ed-hero__line">
                <span className="ed-rise" style={{ ['--d' as string]: 180 }}>
                  Engineering, AI
                </span>
              </span>
              <span className="ed-hero__line">
                <span className="ed-rise" style={{ ['--d' as string]: 280 }}>
                  and <em>creative code.</em>
                </span>
              </span>
            </h1>
            <p className="ed-hero__sub ed-intro" style={{ ['--ed-in' as string]: 5 }}>
              {siteMetadata.description}
            </p>
            <div className="ed-hero__ctas ed-intro" style={{ ['--ed-in' as string]: 7 }}>
              {latest && (
                <EdPill href={postHref(latest.path)} variant="light" size="lg" arrow>
                  Read the latest
                </EdPill>
              )}
              <EdPill href="/lab" variant="outline" size="lg">
                Open the lab
              </EdPill>
            </div>
          </div>

          <nav
            className="ed-hero__index ed-intro"
            aria-label="On this page"
            style={{ ['--ed-in' as string]: 9 }}
          >
            <div className="ed-hero__index-head">
              <span>On this page</span>
              <span>{String(chapters.length).padStart(2, '0')}</span>
            </div>
            <ol>
              {chapters.map((c) => (
                <li key={c.id}>
                  <a href={`#${c.id}`}>
                    <span className="ed-hero__index-num">{c.num}</span>
                    <span>{c.label}</span>
                    <span className="ed-hero__index-rule" aria-hidden="true" />
                    <span className="ed-hero__index-arrow" aria-hidden="true">
                      ↓
                    </span>
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <figure className="ed-hero__stage ed-fig" aria-labelledby="home-contents-caption">
            <div className="ed-fig__bar">
              <span>
                <b>Fig. 00</b> Contents · newest first
              </span>
              <span>
                {posts.length} posts · {topics.length} topics
              </span>
            </div>
            <ol className="ed-fig__list">
              {contents.map((post, i) => (
                <li
                  key={post.slug}
                  className="ed-fig__row"
                  style={{ ['--d' as string]: 380 + i * 60 }}
                >
                  <NextLink href={postHref(post.path)}>
                    <span className="ed-fig__no">{postNumber(posts, post.slug)}</span>
                    <span className="ed-fig__title">{post.title}</span>
                    <span className="ed-fig__tag">{post.tags?.[0]}</span>
                    <time className="ed-fig__date" dateTime={post.date}>
                      {formatDate(post.date, 'short')}
                    </time>
                  </NextLink>
                </li>
              ))}
            </ol>
            <figcaption id="home-contents-caption" className="ed-fig__foot">
              <div className="ed-fig__spark" aria-hidden="true">
                {months.map((m) => (
                  <i
                    key={m.key}
                    className={m.count ? undefined : 'is-empty'}
                    style={{
                      ['--h' as string]: m.count ? Math.max(0.12, m.count / maxMonth) : 0.04,
                    }}
                  />
                ))}
              </div>
              <div className="ed-fig__axis">
                <span>{first ? formatDate(first.date, 'month') : ''}</span>
                <span>Posts per month</span>
                <span>{latest ? formatDate(latest.date, 'month') : ''}</span>
              </div>
              {posts.length > contents.length && (
                <NextLink href="/blog" className="ed-fig__all">
                  All {posts.length} posts →
                </NextLink>
              )}
            </figcaption>
          </figure>

          <ul className="ed-hero__stats" aria-label="The blog in numbers">
            <li className="ed-stat ed-intro" style={{ ['--ed-in' as string]: 8 }}>
              <span className="ed-stat__kicker">Published</span>
              <span
                className="ed-stat__viz ed-stat__viz--dots"
                aria-hidden="true"
                style={{ ['--cols' as string]: Math.max(8, Math.ceil(posts.length / 2)) }}
              >
                {posts.map((p, i) => (
                  <i key={p.slug} style={{ ['--i' as string]: i }} />
                ))}
              </span>
              <span className="ed-stat__value">{posts.length}</span>
              <span className="ed-stat__label">
                posts, the newest on {latest ? formatDay(latest.date) : ''}
              </span>
            </li>
            <li className="ed-stat ed-intro" style={{ ['--ed-in' as string]: 9 }}>
              <span className="ed-stat__kicker">Topics</span>
              <span className="ed-stat__viz ed-stat__viz--bars" aria-hidden="true">
                {topBars.map((v, i) => (
                  <i key={i} style={{ ['--h' as string]: v / maxBar, ['--i' as string]: i }} />
                ))}
              </span>
              <span className="ed-stat__value">{topics.length}</span>
              <span className="ed-stat__label">
                most on <NextLink href={`/tags/${topics[0]?.tag ?? ''}`}>{topics[0]?.tag}</NextLink>
              </span>
            </li>
            <li className="ed-stat ed-intro" style={{ ['--ed-in' as string]: 10 }}>
              <span className="ed-stat__kicker">In the lab</span>
              <span className="ed-stat__value">{demos}</span>
              <span className="ed-stat__label">
                interactive demos, <NextLink href="/lab">all in the browser</NextLink>
              </span>
            </li>
            <li className="ed-stat ed-intro" style={{ ['--ed-in' as string]: 11 }}>
              <span className="ed-stat__kicker">Writing since</span>
              <span className="ed-stat__value">{since}</span>
              <span className="ed-stat__label">
                first post {first ? formatDate(first.date, 'short') : ''}
              </span>
            </li>
          </ul>
        </div>
      </div>

      <div className="ed-shell ed-hero__foot">
        <div className="ed-wide ed-hero__word-box">
          <p className="ed-hero__word" aria-hidden="true">
            {WORD.split('').map((ch, i) => (
              <span key={i} className="ed-letter" style={{ ['--d' as string]: 360 + i * 60 }}>
                {ch}
              </span>
            ))}
          </p>
          <div className="ed-hero__colophon">
            <p className="ed-intro" style={{ ['--ed-in' as string]: 12 }}>
              {brand.name} · {brand.place}
            </p>
            {chapters[0] && (
              <a
                href={`#${chapters[0].id}`}
                className="ed-hero__cue ed-intro"
                style={{ ['--ed-in' as string]: 13 }}
              >
                Scroll <span aria-hidden="true">↓</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
