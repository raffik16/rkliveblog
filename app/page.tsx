import type { Metadata } from 'next'
import NextLink from 'next/link'
import { sortPosts, allCoreContent } from 'pliny/utils/contentlayer'
import { allBlogs } from 'contentlayer/generated'
import siteMetadata from '@/data/siteMetadata'
import demosData from '@/data/demosData'
import HomeHero from '@/components/home/HomeHero'
import EdChapterHead from '@/components/edition/EdChapterHead'
import EdPanel from '@/components/edition/EdPanel'
import EdPill from '@/components/edition/EdPill'
import EdNote from '@/components/edition/EdNote'
import PostRow from '@/components/PostRow'
import SetLauncher from '@/components/SetLauncher'
import NewsletterForm from '@/components/NewsletterForm'
import { postNumber } from '@/lib/posts'
import tagData from './tag-data.json'

// The root layout no longer sets a canonical (it was inherited by every page), so the
// homepage declares its own. Setting `alternates` here replaces the root's, so keep RSS.
export const metadata: Metadata = {
  alternates: {
    canonical: '/',
    types: {
      'application/rss+xml': `${siteMetadata.siteUrl}/feed.xml`,
    },
  },
}

const CHAPTERS = [
  { id: 'latest', num: '01', label: 'Latest', color: 'var(--ed-cobalt)' },
  { id: 'lab', num: '02', label: 'Lab', color: 'var(--ed-violet)' },
  { id: 'topics', num: '03', label: 'Topics', color: 'var(--ed-raspberry)' },
  { id: 'subscribe', num: '04', label: 'Subscribe', color: 'var(--ed-ink)' },
]

const chapterProps = (id: string) => {
  const c = CHAPTERS.find((ch) => ch.id === id)!
  return {
    id: c.id,
    'data-chapter': c.id,
    'data-chapter-label': c.label,
    'data-chapter-num': c.num,
    'data-chapter-color': c.color,
  }
}

export default async function Page() {
  // allCoreContent drops drafts in production, so these are the published posts
  const posts = allCoreContent(sortPosts(allBlogs))
  const topics = Object.entries(tagData as Record<string, number>)
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag))
  const recent = posts.slice(0, 6)

  return (
    <div className="ed-page">
      <HomeHero posts={posts} topics={topics} demos={demosData.length} chapters={CHAPTERS} />

      <section className="ed-chapter" {...chapterProps('latest')} aria-labelledby="latest-title">
        <div className="ed-shell">
          <EdChapterHead
            num="01"
            kicker="Newest first"
            display="Latest"
            title="Recent writing on engineering, AI and the web"
            id="latest-title"
          >
            <p>
              Practical guides, deep dives and honest takes on the tools shaping how we build,
              newest first.
            </p>
          </EdChapterHead>
          <ol className="ed-posts">
            {recent.map((post, i) => (
              <PostRow
                key={post.slug}
                post={post}
                number={postNumber(posts, post.slug)}
                lead={i === 0}
              />
            ))}
          </ol>
          <div className="ed-section-actions" data-reveal="">
            <EdPill href="/blog" variant="light" size="lg" arrow>
              All {posts.length} posts
            </EdPill>
            <EdPill href="/tags" variant="outline" size="lg">
              Browse by topic
            </EdPill>
          </div>
          <div className="ed-notes">
            <EdNote index={1} label="Archive">
              {posts.length} posts so far. Search, sort and filter them all on the{' '}
              <NextLink href="/blog">blog page</NextLink>.
            </EdNote>
            <EdNote index={2} label="Feed">
              Prefer a reader? There&apos;s an <a href="/feed.xml">RSS feed</a>.
            </EdNote>
          </div>
        </div>
      </section>

      <section className="ed-chapter" {...chapterProps('lab')} aria-labelledby="lab-title">
        <div className="ed-shell">
          <EdChapterHead
            num="02"
            kicker="Interactive demos"
            display="Lab"
            title="Experiments that grew out of the posts"
            id="lab-title"
          >
            <p>
              Everything runs in your browser. Open a demo to play with it, or read how it was
              built.
            </p>
          </EdChapterHead>
          <div className="ed-grid">
            {demosData.map((demo, i) => (
              <EdPanel
                key={demo.slug}
                title={demo.title}
                href={demo.href}
                size={i === 0 ? 'lg' : 'md'}
                className={i === 0 ? 'span-12' : 'span-6'}
                sub={demo.tech.slice(0, 3).join(' · ')}
                actions={
                  <>
                    {demo.setLauncher ? (
                      <SetLauncher href={demo.href} name={demo.title} />
                    ) : (
                      <EdPill href={demo.href} variant="dark" arrow>
                        Open demo<span className="sr-only">: {demo.title}</span>
                      </EdPill>
                    )}
                    {demo.postHref && (
                      <EdPill href={demo.postHref} variant="outline">
                        Read the story<span className="sr-only">: {demo.title}</span>
                      </EdPill>
                    )}
                  </>
                }
              >
                <p>{demo.description}</p>
              </EdPanel>
            ))}
          </div>
        </div>
      </section>

      <section className="ed-chapter" {...chapterProps('topics')} aria-labelledby="topics-title">
        <div className="ed-shell">
          <EdChapterHead
            num="03"
            kicker={`${topics.length} topics`}
            display="Topics"
            title="What I write about, most often first"
            id="topics-title"
          />
          <ol className="ed-topic-index">
            {topics.slice(0, 12).map((t, i) => (
              <li key={t.tag} data-reveal="">
                <NextLink href={`/tags/${t.tag}`}>
                  <span className="ed-topic-index__no">{String(i + 1).padStart(2, '0')}</span>
                  <span className="ed-topic-index__name">{t.tag}</span>
                  <span className="ed-topic-index__rule" aria-hidden="true" />
                  <span className="ed-topic-index__count">
                    {t.count} {t.count === 1 ? 'post' : 'posts'}
                  </span>
                </NextLink>
              </li>
            ))}
          </ol>
          <div className="ed-section-actions" data-reveal="">
            <EdPill href="/tags" variant="light" size="lg" arrow>
              All {topics.length} topics
            </EdPill>
          </div>
        </div>
      </section>

      {siteMetadata.newsletter?.provider && (
        <section
          className="ed-chapter ed-subscribe"
          {...chapterProps('subscribe')}
          aria-labelledby="subscribe-title"
        >
          <div className="ed-shell">
            <div className="ed-wide ed-subscribe__grid">
              <div data-reveal="">
                <div className="ed-meta">
                  <span className="ed-num">04</span>
                  <span>Subscribe</span>
                </div>
                <h2 id="subscribe-title" className="ed-subscribe__title">
                  Get new posts <em>by email.</em>
                </h2>
                <p className="ed-lede">
                  Leave your address and the next post lands in your inbox when it&apos;s out.
                </p>
              </div>
              <div className="ed-subscribe__form" data-reveal="">
                <NewsletterForm />
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
