import { ReactNode } from 'react'
import type { Authors } from 'contentlayer/generated'
import Image from '@/components/Image'
import EdNote from '@/components/edition/EdNote'
import EdPill from '@/components/edition/EdPill'
import brand from '@/data/brand'

interface Props {
  children: ReactNode
  content: Omit<Authors, '_id' | '_raw' | 'body'>
}

// About page, after raffi.website/about: the name set huge, the bio beside a framed portrait,
// notes in the margin, links as pills.
export default function AuthorLayout({ children, content }: Props) {
  const { name, avatar, occupation, email, twitter, x, instagram, bluesky, linkedin, github } =
    content

  const links = [
    { href: github, label: 'GitHub' },
    { href: linkedin, label: 'LinkedIn' },
    { href: x || twitter, label: 'X' },
    { href: instagram, label: 'Instagram' },
    { href: bluesky, label: 'Bluesky' },
    { href: email ? `mailto:${email}` : undefined, label: 'Email' },
  ].filter((l): l is { href: string; label: string } => !!l.href)

  const [first, ...rest] = name.split(' ')

  return (
    <div className="ed-page">
      <section
        className="ed-chapter ed-chapter--first ed-about"
        data-chapter="intro"
        data-chapter-color="var(--ed-ink)"
        aria-labelledby="about-title"
      >
        <div className="ed-shell">
          <div className="ed-meta ed-intro" style={{ ['--ed-in' as string]: 0 }}>
            <span className="ed-num">05</span>
            <span>About</span>
            <span className="ed-meta__rule" aria-hidden="true" />
            <span>{brand.place}, CA</span>
          </div>
          <h1 id="about-title" className="ed-about__name">
            <span className="ed-hero__line">
              <span className="ed-rise" style={{ ['--d' as string]: 120 }}>
                {first}
              </span>
            </span>
            {rest.length > 0 && (
              <span className="ed-hero__line">
                <span className="ed-rise" style={{ ['--d' as string]: 220 }}>
                  {rest.join(' ')}
                </span>
              </span>
            )}
          </h1>
          <div className="ed-wide ed-about__grid">
            <div className="ed-about__bio">
              {occupation && (
                <p className="ed-about__role ed-intro" style={{ ['--ed-in' as string]: 4 }}>
                  {occupation}
                </p>
              )}
              <div className="ed-prose ed-about__prose">{children}</div>
              <div className="ed-pills ed-about__links">
                {links.map((l) => (
                  <EdPill key={l.label} href={l.href} variant="outline" arrow>
                    {l.label}
                  </EdPill>
                ))}
              </div>
            </div>
            <div className="ed-about__side">
              {avatar && (
                <figure
                  className="ed-about__portrait ed-intro"
                  style={{ ['--ed-in' as string]: 6 }}
                >
                  <Image src={avatar} alt={name} width={480} height={480} priority />
                  <figcaption>
                    {name} · {brand.place}
                  </figcaption>
                </figure>
              )}
              <div className="ed-about__notes">
                <EdNote index={1} label="Day job">
                  I build websites for clients at{' '}
                  <a href={brand.mainSite} target="_blank" rel="noopener noreferrer">
                    raffi.website
                  </a>
                  .
                </EdNote>
                <EdNote index={2} label="Say hello">
                  The quickest way to reach me is the{' '}
                  <a href={brand.contact} target="_blank" rel="noopener noreferrer">
                    contact page
                  </a>
                  .
                </EdNote>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
