import NextLink from 'next/link'
import siteMetadata from '@/data/siteMetadata'
import headerNavLinks from '@/data/headerNavLinks'
import brand from '@/data/brand'
import EdPill from '@/components/edition/EdPill'

// Closing block on every page: a hand-off to raffi.website (the same call to action as the main
// site), then a colophon of links. Marked as an ink chapter so the backdrop settles back to
// ink under it; the rail leaves it out (id "end").
export default function Footer() {
  const elsewhere = [
    { href: siteMetadata.github, title: 'GitHub' },
    { href: siteMetadata.linkedin, title: 'LinkedIn' },
    { href: siteMetadata.x, title: 'X' },
    { href: siteMetadata.instagram, title: 'Instagram' },
  ].filter((s) => s.href)

  return (
    <footer className="ed-footer" data-chapter="end" data-chapter-color="var(--ed-ink)">
      <div className="ed-shell">
        <div className="ed-wide ed-footer__cta" data-reveal="">
          <div className="ed-meta">
            <span className="ed-num">→</span>
            <span>The day job</span>
          </div>
          <p className="ed-footer__title">
            I build fast sites your team can <em>update.</em>
          </p>
          <p className="ed-footer__sub">
            This blog is where I write up what I learn along the way. The client work, websites for
            studios, publishers and real estate firms, lives at raffi.website.
          </p>
          <div className="ed-pills">
            <EdPill href={brand.contact} variant="signal" size="lg" arrow>
              Book a free 30-minute call
            </EdPill>
            <EdPill href={`${brand.mainSite}/work`} variant="outline" size="lg" arrow>
              See the work
            </EdPill>
          </div>
        </div>

        <nav className="ed-wide ed-footer__grid" aria-label="Footer">
          <div>
            <p className="ed-footer__head">Blog</p>
            <ul>
              {headerNavLinks.map((link) => (
                <li key={link.href}>
                  <NextLink href={link.href}>{link.title}</NextLink>
                </li>
              ))}
              <li>
                <a href="/feed.xml">RSS feed</a>
              </li>
            </ul>
          </div>
          <div>
            <p className="ed-footer__head">raffi.website</p>
            <ul>
              {brand.mainNav.map((link) => (
                <li key={link.href}>
                  <a href={link.href}>{link.title}</a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="ed-footer__head">Elsewhere</p>
            <ul>
              {elsewhere.map((link) => (
                <li key={link.title}>
                  <a href={link.href} target="_blank" rel="noopener noreferrer me">
                    {link.title}
                    <span aria-hidden="true"> ↗</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        <div className="ed-wide ed-footer__base">
          <span>
            © {new Date().getFullYear()} {brand.name} · {brand.place}
          </span>
          <span>
            Next.js and MDX ·{' '}
            <a href={siteMetadata.siteRepo} target="_blank" rel="noopener noreferrer">
              Source on GitHub ↗
            </a>
          </span>
        </div>
      </div>
    </footer>
  )
}
