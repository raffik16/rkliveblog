import NextLink from 'next/link'
import demosData from '@/data/demosData'
import { genPageMetadata } from 'app/seo'
import EdChapterHead from '@/components/edition/EdChapterHead'
import EdNote from '@/components/edition/EdNote'
import EdPill from '@/components/edition/EdPill'

export const metadata = genPageMetadata({
  title: 'Lab',
  description:
    'Interactive demos built alongside the blog: two full-screen three.js pieces, a Canvas spacecraft simulator, twelve historical clocks, a one-button game and a WebMCP toolkit.',
  path: '/lab',
})

export default function LabPage() {
  return (
    <div className="ed-page">
      <section
        className="ed-chapter ed-chapter--first ed-chapter--lead"
        data-chapter="intro"
        data-chapter-color="var(--ed-ink)"
        aria-labelledby="lab-title"
      >
        <div className="ed-shell">
          <div className="ed-chapter-head--page">
            <EdChapterHead
              num="03"
              kicker={`${demosData.length} interactive demos`}
              title="Lab"
              as="h1"
              id="lab-title"
            >
              <p>
                Experiments that grew out of posts on this blog. Everything runs in your browser:
                open a demo to play with it, or read the story of how it was built.
              </p>
            </EdChapterHead>
          </div>
          <div className="ed-notes">
            <EdNote index={1} label="Heads up">
              The two Chaos pieces fill the whole window and have no controls: click for fullscreen,
              and use your browser&apos;s back button to leave. The Hot Dog Set keeps the screen
              awake, so it can run behind a DJ all night.
            </EdNote>
          </div>
        </div>
      </section>

      <section
        className="ed-chapter ed-chapter--follow ed-lab"
        data-chapter="demos"
        data-chapter-label="Demos"
        data-chapter-rail="off"
        data-chapter-color="var(--ed-violet)"
        aria-label="Demos"
      >
        <div className="ed-shell">
          <ol className="ed-demos">
            {demosData.map((demo, i) => (
              <li key={demo.slug} className="ed-demo" data-reveal="">
                <span className="ed-demo__no">{String(i + 1).padStart(2, '0')}</span>
                <div className="ed-demo__main">
                  <h2 className="ed-demo__title" id={`demo-${demo.slug}`}>
                    {demo.title}
                  </h2>
                  <p className="ed-demo__desc">{demo.description}</p>
                  <ul className="ed-pills ed-demo__tech" aria-label="Built with">
                    {demo.tech.map((tech) => (
                      <li key={tech} className="ed-pill ed-pill--tag">
                        {tech}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="ed-demo__actions">
                  <EdPill href={demo.href} variant="light" size="lg" arrow>
                    Open demo<span className="sr-only">: {demo.title}</span>
                  </EdPill>
                  {demo.postHref && (
                    <EdPill href={demo.postHref} variant="outline" size="lg">
                      Read the story<span className="sr-only">: {demo.title}</span>
                    </EdPill>
                  )}
                </div>
              </li>
            ))}
          </ol>
          <p className="ed-lab__more" data-reveal="">
            Looking for the writing instead? Browse{' '}
            <NextLink href="/blog" className="ed-link">
              all posts
            </NextLink>{' '}
            or{' '}
            <NextLink href="/tags" className="ed-link">
              every topic
            </NextLink>
            .
          </p>
        </div>
      </section>
    </div>
  )
}
