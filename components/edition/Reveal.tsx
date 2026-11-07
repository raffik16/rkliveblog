'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

// Scroll reveals for [data-reveal] elements (raffi.website does this with its v-reveal
// directive). Only elements that start below the fold are hidden (.ed-reveal) and then shown
// (.is-revealed) as they enter, so the first screen never waits for JS and nothing is hidden
// when JS is off. Elements that enter together are staggered by layout order, 70ms apart.
export default function Reveal() {
  const pathname = usePathname()

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const seen = new WeakSet<Element>()
    const io = new IntersectionObserver(
      (entries) => {
        const entering = entries
          .filter((e) => e.isIntersecting)
          .map((e) => e.target as HTMLElement)
          .sort((a, b) => {
            const ra = a.getBoundingClientRect()
            const rb = b.getBoundingClientRect()
            return Math.round(ra.top - rb.top) || ra.left - rb.left
          })
        entering.forEach((el, i) => {
          io.unobserve(el)
          el.style.setProperty('--ed-reveal-delay', `${Math.min(i, 6) * 70}ms`)
          el.classList.add('is-revealed')
        })
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.01 }
    )

    const arm = () => {
      const vh = window.innerHeight
      document.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el) => {
        if (seen.has(el)) return
        seen.add(el)
        const r = el.getBoundingClientRect()
        // Already on screen (or above it): leave it alone.
        if (r.top < vh * 0.94 || r.height === 0) return
        el.classList.add('ed-reveal')
        io.observe(el)
      })
    }

    arm()
    const mo = new MutationObserver(() => arm())
    mo.observe(document.body, { childList: true, subtree: true })
    return () => {
      mo.disconnect()
      io.disconnect()
    }
  }, [pathname])

  return null
}
