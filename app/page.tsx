import type { Metadata } from 'next'
import { sortPosts, allCoreContent } from 'pliny/utils/contentlayer'
import { allBlogs } from 'contentlayer/generated'
import Link from '@/components/Link'
import siteMetadata from '@/data/siteMetadata'
import { Hero6, type HeroStats } from '@/components/heroes'
import demosData from '@/data/demosData'
import Main from './Main'
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

export default async function Page() {
  const sortedPosts = sortPosts(allBlogs)
  // allCoreContent drops drafts in production, so these are the published posts
  const posts = allCoreContent(sortedPosts)

  // Read the year straight from the ISO string so the server's time zone can't shift it
  const years = posts
    .map((post) => Number.parseInt(String(post.date).slice(0, 4), 10))
    .filter((year) => Number.isFinite(year))

  const stats: HeroStats = {
    posts: posts.length,
    topics: Object.keys(tagData).length,
    demos: demosData.length,
    since: years.length > 0 ? Math.min(...years) : new Date().getFullYear(),
  }

  return (
    <>
      <Hero6 stats={stats} />
      <FromTheLab />
      <Main posts={posts} tagData={tagData} />
    </>
  )
}

function FromTheLab() {
  return (
    <section aria-labelledby="from-the-lab-heading" className="pt-10 sm:pt-12">
      <div className="mb-4 flex items-baseline justify-between gap-4">
        <h2
          id="from-the-lab-heading"
          className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100"
        >
          From the lab
        </h2>
        <Link
          href="/lab"
          className="text-primary-700 hover:text-primary-800 dark:text-primary-500 dark:hover:text-primary-400 shrink-0 text-sm font-medium"
        >
          All demos &rarr;
        </Link>
      </div>
      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {demosData.map((demo) => (
          <li key={demo.slug} className="flex">
            <Link
              href={demo.href}
              className="group hover:border-primary-500/60 dark:hover:border-primary-400/60 relative flex w-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all duration-300 hover:shadow-lg motion-safe:hover:-translate-y-0.5 dark:border-gray-700 dark:bg-gray-800/50"
            >
              <span
                aria-hidden="true"
                className="from-primary-500 absolute inset-x-0 top-0 h-1 bg-gradient-to-r to-[#075056] opacity-70 transition-opacity group-hover:opacity-100"
              />
              <h3 className="group-hover:text-primary-500 dark:group-hover:text-primary-400 font-bold text-gray-900 transition-colors dark:text-gray-100">
                {demo.title}
              </h3>
              <p className="mt-1 line-clamp-2 text-sm leading-6 text-gray-600 dark:text-gray-400">
                {demo.description}
              </p>
              <p className="mt-auto pt-3 text-xs font-medium text-gray-500 dark:text-gray-400">
                {demo.tech.slice(0, 3).join(' · ')}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
