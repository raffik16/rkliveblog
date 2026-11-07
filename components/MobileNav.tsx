'use client'

import { useEffect, useState } from 'react'
import NextLink from 'next/link'
import { usePathname } from 'next/navigation'
import { Dialog, DialogPanel } from '@headlessui/react'
import headerNavLinks from '@/data/headerNavLinks'
import brand from '@/data/brand'
import siteMetadata from '@/data/siteMetadata'
import Logo from '@/components/edition/Logo'
import EdPill from '@/components/edition/EdPill'
import { isActivePath } from '@/lib/edition/nav'

// Full-screen menu below 1025px: the navbar's links set large in Inter Tight, numbered like
// the main site's chapter index, with the social links and the call to action underneath.
const MobileNav = () => {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  // Close on navigation (the links are client-side, so the dialog would otherwise stay open).
  useEffect(() => {
    setOpen(false)
  }, [pathname])

  // The backdrop pauses its fibre field while the menu covers it.
  useEffect(() => {
    const html = document.documentElement
    if (open) html.dataset.menu = 'open'
    else delete html.dataset.menu
    return () => {
      delete html.dataset.menu
    }
  }, [open])

  const socials = [
    { href: siteMetadata.github, title: 'GitHub' },
    { href: siteMetadata.linkedin, title: 'LinkedIn' },
    { href: siteMetadata.x, title: 'X' },
  ].filter((s) => s.href)

  return (
    <>
      <button
        type="button"
        className="ed-burger"
        aria-label="Menu"
        aria-expanded={open}
        aria-controls="site-menu"
        onClick={() => setOpen(true)}
      >
        <span />
        <span />
      </button>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogPanel id="site-menu" className="ed-menu">
          <div className="ed-menu__grain" aria-hidden="true" />
          <div className="ed-menu__top">
            <NextLink href="/" className="ed-nav__logo" aria-label={`${brand.name}. Blog home`}>
              <Logo />
            </NextLink>
            <button
              type="button"
              className="ed-menu__close"
              aria-label="Close menu"
              onClick={() => setOpen(false)}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
                <path d="M4 4l12 12M16 4L4 16" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </button>
          </div>
          <p className="ed-kicker ed-menu__kicker">Menu</p>
          <nav aria-label="Primary">
            <ol className="ed-menu__list">
              {headerNavLinks.map((link, i) => (
                <li key={link.href}>
                  <NextLink
                    href={link.href}
                    aria-current={isActivePath(pathname, link.href) ? 'page' : undefined}
                    onClick={() => setOpen(false)}
                  >
                    <span className="ed-menu__num" aria-hidden="true">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    {link.title}
                    <span className="ed-menu__arrow" aria-hidden="true">
                      →
                    </span>
                  </NextLink>
                </li>
              ))}
            </ol>
          </nav>
          <div className="ed-menu__foot">
            <EdPill href={brand.contact} variant="signal" size="lg" arrow>
              Let&apos;s talk
            </EdPill>
            <EdPill href={brand.mainSite} variant="outline" size="lg" arrow>
              raffi.website
            </EdPill>
            {socials.map((s) => (
              <EdPill key={s.title} href={s.href} variant="tag">
                {s.title}
              </EdPill>
            ))}
          </div>
        </DialogPanel>
      </Dialog>
    </>
  )
}

export default MobileNav
