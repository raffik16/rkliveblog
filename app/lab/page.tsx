import Link from '@/components/Link'
import demosData from '@/data/demosData'
import { genPageMetadata } from 'app/seo'

export const metadata = genPageMetadata({
  title: 'Lab',
  description:
    'Interactive demos built alongside the blog: a Canvas spacecraft simulator, twelve historical clocks, a one-button game and a WebMCP toolkit.',
  path: '/lab',
})

export default function LabPage() {
  return (
    <div className="pt-6 pb-12">
      <div className="space-y-3 pb-8 md:space-y-5">
        <h1 className="text-3xl leading-9 font-extrabold tracking-tight text-gray-900 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14 dark:text-gray-100">
          Lab
        </h1>
        <p className="max-w-3xl text-lg leading-7 text-gray-500 dark:text-gray-400">
          Experiments that grew out of posts on this blog. Everything runs in your browser: open a
          demo to play with it, or read the story of how it was built.
        </p>
      </div>

      <ul className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {demosData.map((demo) => (
          <li key={demo.slug} className="flex">
            <article
              aria-labelledby={`demo-${demo.slug}`}
              className="relative flex w-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8 dark:border-gray-700 dark:bg-gray-800/50"
            >
              <span
                aria-hidden="true"
                className="from-primary-500 absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r to-[#075056]"
              />
              <h2
                id={`demo-${demo.slug}`}
                className="text-2xl leading-8 font-bold tracking-tight text-gray-900 dark:text-gray-100"
              >
                {demo.title}
              </h2>
              <p className="mt-3 leading-7 text-gray-600 dark:text-gray-400">{demo.description}</p>

              <ul aria-label="Built with" className="mt-4 flex flex-wrap gap-2">
                {demo.tech.map((tech) => (
                  <li
                    key={tech}
                    className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700 dark:bg-gray-700/60 dark:text-gray-200"
                  >
                    {tech}
                  </li>
                ))}
              </ul>

              <div className="mt-auto flex flex-wrap gap-3 pt-6">
                <Link
                  href={demo.href}
                  className="bg-primary-700 hover:bg-primary-800 inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors focus-visible:outline-offset-2"
                >
                  Open demo<span className="sr-only">: {demo.title}</span>
                  <span aria-hidden="true">&rarr;</span>
                </Link>
                {demo.postHref && (
                  <Link
                    href={demo.postHref}
                    className="hover:border-primary-500 hover:text-primary-700 dark:hover:border-primary-400 dark:hover:text-primary-400 inline-flex items-center rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-800 transition-colors focus-visible:outline-offset-2 dark:border-gray-600 dark:text-gray-200"
                  >
                    Read the story<span className="sr-only">: {demo.title}</span>
                  </Link>
                )}
              </div>
            </article>
          </li>
        ))}
      </ul>

      <p className="mt-10 text-gray-600 dark:text-gray-400">
        Looking for the writing instead? Browse{' '}
        <Link
          href="/blog"
          className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium underline-offset-2 hover:underline"
        >
          all posts
        </Link>{' '}
        or{' '}
        <Link
          href="/tags"
          className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium underline-offset-2 hover:underline"
        >
          every topic
        </Link>
        .
      </p>
    </div>
  )
}
