import EdChapterHead from '@/components/edition/EdChapterHead'
import EdPill from '@/components/edition/EdPill'

export default function NotFound() {
  return (
    <div className="ed-page">
      <section
        className="ed-chapter ed-chapter--first ed-404"
        data-chapter="intro"
        data-chapter-color="var(--ed-ink)"
      >
        <div className="ed-shell">
          <EdChapterHead
            num="00"
            kicker="Not found"
            display="404"
            title="This page isn't here."
            as="h1"
          >
            <p>It may have moved, or the link has a typo. The blog and the lab are a click away.</p>
          </EdChapterHead>
          <div className="ed-section-actions">
            <EdPill href="/" variant="light" size="lg" arrow>
              Home
            </EdPill>
            <EdPill href="/blog" variant="outline" size="lg">
              All posts
            </EdPill>
            <EdPill href="/lab" variant="outline" size="lg">
              The lab
            </EdPill>
          </div>
        </div>
      </section>
    </div>
  )
}
