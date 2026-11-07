'use client'

import { useEffect, useRef, useState } from 'react'
import NextLink from 'next/link'
import { usePathname } from 'next/navigation'
import headerNavLinks from '@/data/headerNavLinks'
import brand from '@/data/brand'
import Logo from '@/components/edition/Logo'
import { setNavHidden } from '@/lib/edition/chapters'
import { isActivePath } from '@/lib/edition/nav'
import MobileNav from './MobileNav'
import SearchButton from './SearchButton'
import { cx } from '@/lib/edition/cx'

// Fixed navbar, as on raffi.website (components/Navbar.vue): transparent at the top, frosted
// once the page moves, tucks away while scrolling down and comes back on the first scroll up.
const Header = () => {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const lastY = useRef(0)

  useEffect(() => {
    let ticking = false
    const hide = (value: boolean) => {
      setHidden(value)
      setNavHidden(value)
    }
    const update = () => {
      ticking = false
      const y = Math.max(0, window.scrollY)
      setScrolled(y > 8)
      if (y < 160) {
        hide(false)
        lastY.current = y
        return
      }
      const dy = y - lastY.current
      if (Math.abs(dy) < 8) return
      hide(dy > 0 && document.documentElement.dataset.menu !== 'open')
      lastY.current = y
    }
    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(update)
    }
    lastY.current = window.scrollY
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      setNavHidden(false)
    }
  }, [])

  // A new page always starts with the bar showing.
  useEffect(() => {
    setHidden(false)
    setNavHidden(false)
    lastY.current = 0
  }, [pathname])

  return (
    <header
      className={cx('ed-nav', scrolled && 'is-scrolled', hidden && 'is-hidden')}
      onFocus={() => {
        setHidden(false)
        setNavHidden(false)
      }}
    >
      <div className="ed-nav__brand">
        <NextLink href="/" className="ed-nav__logo" aria-label={`${brand.name}. Blog home`}>
          <Logo />
        </NextLink>
        <span className="ed-nav__vol">{brand.section}</span>
      </div>

      <div className="ed-nav__right">
        <nav className="ed-nav__primary" aria-label="Primary">
          <ul className="ed-nav__links">
            {headerNavLinks
              .filter((link) => link.href !== '/')
              .map((link) => (
                <li key={link.href}>
                  <NextLink
                    href={link.href}
                    aria-current={isActivePath(pathname, link.href) ? 'page' : undefined}
                  >
                    {link.title}
                  </NextLink>
                </li>
              ))}
            <li>
              <a href={brand.mainSite} target="_blank" rel="noopener noreferrer">
                raffi.website
                <span className="ed-nav__ext" aria-hidden="true">
                  ↗
                </span>
              </a>
            </li>
          </ul>
        </nav>
        <SearchButton />
        <a className="ed-nav__cta" href={brand.contact}>
          Let&apos;s talk
        </a>
        <MobileNav />
      </div>
    </header>
  )
}

export default Header
