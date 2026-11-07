import projectsData from '@/data/projectsData'
import brand from '@/data/brand'
import Image from '@/components/Image'
import EdChapterHead from '@/components/edition/EdChapterHead'
import EdNote from '@/components/edition/EdNote'
import EdPanel from '@/components/edition/EdPanel'
import EdPill from '@/components/edition/EdPill'

const hostOf = (href?: string) => {
  if (!href) return ''
  try {
    return new URL(href).host.replace(/^www\./, '')
  } catch {
    return ''
  }
}

// Client sites, as a grid of image panels (the main site's Work chapter style). The full case
// studies live on raffi.website/work.
export default function ProjectsContent() {
  return (
    <div className="ed-page">
      <section
        className="ed-chapter ed-chapter--first ed-chapter--lead"
        data-chapter="intro"
        data-chapter-color="var(--ed-ink)"
        aria-labelledby="projects-title"
      >
        <div className="ed-shell">
          <div className="ed-chapter-head--page">
            <EdChapterHead
              num="04"
              kicker={`${projectsData.length} client sites`}
              title="Projects"
              as="h1"
              id="projects-title"
            >
              <p>
                Websites I&apos;ve built for production companies, post houses, studios and brands.
                Case studies for several of them, with the brief and what I built, are on
                raffi.website.
              </p>
            </EdChapterHead>
          </div>
          <div className="ed-notes">
            <EdNote index={1} label="Case studies">
              The full write-ups live at{' '}
              <a href={`${brand.mainSite}/work`} target="_blank" rel="noopener noreferrer">
                raffi.website/work
              </a>
              .
            </EdNote>
          </div>
        </div>
      </section>

      <section
        className="ed-chapter ed-chapter--follow ed-projects"
        data-chapter="sites"
        data-chapter-label="Sites"
        data-chapter-rail="off"
        data-chapter-color="var(--ed-cobalt)"
        aria-label="Client sites"
      >
        <div className="ed-shell">
          <div className="ed-wide ed-grid ed-projects__grid">
            {projectsData.map((project, i) => (
              <EdPanel
                key={project.title}
                title={project.title}
                href={project.href}
                sub={hostOf(project.href)}
                className="span-4 ed-project"
                headingLevel="h2"
                media={
                  project.imgSrc ? (
                    <Image
                      src={project.imgSrc}
                      alt={`${project.title} website`}
                      width={800}
                      height={600}
                      sizes="(min-width: 1180px) 33vw, (min-width: 760px) 50vw, 100vw"
                      priority={i < 3}
                    />
                  ) : undefined
                }
                actions={
                  project.href ? (
                    <EdPill href={project.href} variant="dark" arrow>
                      Visit site<span className="sr-only">: {project.title}</span>
                    </EdPill>
                  ) : undefined
                }
              >
                <p className="ed-project__desc">{project.description}</p>
              </EdPanel>
            ))}
          </div>
          <div className="ed-section-actions" data-reveal="">
            <EdPill href={`${brand.mainSite}/work`} variant="light" size="lg" arrow>
              Case studies on raffi.website
            </EdPill>
            <EdPill href={brand.contact} variant="signal" size="lg" arrow>
              Start a project
            </EdPill>
          </div>
        </div>
      </section>
    </div>
  )
}
