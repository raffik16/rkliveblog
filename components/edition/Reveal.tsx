'use client'

import { useEffect } from 'react'

/*
  Scroll reveals: one entrance for every content block (post rows, panels, notes, ledes, and each
  block of a post's body). A port of raffi.website's plugins/reveal.js (its v-reveal directive),
  driven from the DOM instead of a directive:

  - Opt in with data-reveal on an element, or data-reveal-children on a container to reveal each
    of its element children on its own (the post body uses this, so every paragraph, heading,
    figure, table and code block of a section fades in as it arrives). data-reveal="false" opts
    out.
  - An element is hidden (.ed-reveal, see css/edition.css) until it crosses a line at 92% of the
    viewport, then fades and rises into place.

  How it stays smooth:
  - The entrance is a Web Animation (opacity + the `translate` property, both compositor-only)
    with implicit end keyframes. A component's own `transition` list or `transform` can't cancel
    or fight it, and it always ends exactly on the element's own resting style.
  - One shared IntersectionObserver. Elements that enter in the same callback are ordered by row,
    then column, and staggered 70ms apart (max 4 steps); during a fast fling, or when a callback
    lands late (element already well into view), they go at once instead of waiting their turn.
  - Hydration never hides anything the visitor can already see: blocks on screen (or above it)
    when the page hydrates are simply marked revealed. Only content still below the fold is
    hidden, so nothing is hidden without JS either.
  - Anything scrolled past unseen is revealed without animation; anything the observer missed
    (bottom of the page, scroll jumps, late callbacks) is caught by a sweep once scrolling settles.
  - In-page links (the post contents, #comment): the target is shown at once, so the jump lands
    where it should instead of on a block that is still 24px low.
  - Media is ready before it is shown: lazy images start loading a viewport early, and a block
    holding an image waits briefly for it to decode, so the picture fades in with its block
    instead of popping in afterwards. A panel's media part (.ed-panel__media) follows the panel
    ~110ms later and waits for its image.
  - Page intros (.ed-intro, a CSS keyframe entrance) are left alone while on screen.
  - Reduced motion: nothing is hidden.
*/

const TARGETS = '[data-reveal]:not([data-reveal="false"]), [data-reveal-children] > *'
const NOT_RENDERED = new Set(['SCRIPT', 'STYLE', 'TEMPLATE', 'LINK', 'META', 'NOSCRIPT'])

const LINE = 0.92 // trigger line, fraction of the viewport height
const SHOWN = 40 // px on screen that count as seen once scrolling stops
const STEP = 70 // ms between items entering together
const MAX_STEPS = 4
const FAST = 2000 // px/s: above this, no stagger
const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)' // --ed-ease, for movement
const SOFT = 'cubic-bezier(0.25, 0.1, 0.25, 1)' // for opacity

const PENDING = 1
const REVEALED = 2

interface Entering {
  el: HTMLElement
  r: DOMRect
}

// Keep in step with --ed-reveal-* in css/edition.css. `wait`: how long a panel's media may hold
// for its image to decode.
const timing = () =>
  window.innerWidth <= 560
    ? { move: 720, fade: 520, dist: 18, media: 14, wait: 500 }
    : { move: 900, fade: 650, dist: 24, media: 18, wait: 1200 }

const eager = (img: HTMLImageElement) => {
  if (img.loading === 'lazy') img.loading = 'eager'
}

// Resolves once every image has decoded, or after `cap` ms, whichever is first.
const imagesReady = (imgs: HTMLImageElement[], cap: number) =>
  new Promise<void>((resolve) => {
    let done = false
    const finish = () => {
      if (!done) {
        done = true
        resolve()
      }
    }
    window.setTimeout(finish, cap)
    Promise.all(
      imgs.map((img) => {
        eager(img)
        return img.decode ? img.decode().catch(() => {}) : Promise.resolve()
      })
    ).then(finish)
  })

function startReveal() {
  if (
    window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
    !('IntersectionObserver' in window) ||
    !Element.prototype.animate
  )
    return () => {}

  const state = new WeakMap<Element, number>()
  const pending = new Set<HTMLElement>()
  let queue: { el: HTMLElement; ssr: boolean }[] = []
  let flushQueued = false
  let lastY = window.scrollY
  let lastT = 0
  let velocity = 0
  let burst = 0 // peak speed of the latest scroll burst
  let settleTimer = 0

  const speed = () => (performance.now() - lastT > 160 ? 0 : velocity)
  const atBottom = () =>
    window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2

  const settle = (ms: number) => {
    window.clearTimeout(settleTimer)
    settleTimer = window.setTimeout(sweep, ms)
  }

  function forget(el: HTMLElement) {
    pending.delete(el)
    io.unobserve(el)
    pre.unobserve(el)
  }

  function markRevealed(el: HTMLElement) {
    forget(el)
    state.set(el, REVEALED)
    el.classList.add('ed-reveal', 'is-revealed')
  }

  function animateIn(el: HTMLElement, delay: number) {
    const t = timing()
    // Implicit end keyframes: each animation ends on the element's own style.
    el.animate([{ offset: 0, translate: `0 ${t.dist}px` }], {
      duration: t.move,
      delay,
      easing: EASE,
      fill: 'backwards',
    })
    el.animate([{ offset: 0, opacity: 0 }], {
      duration: t.fade,
      delay,
      easing: SOFT,
      fill: 'backwards',
    })
    markRevealed(el)

    // Two-part panels: the media follows the text and waits for its image.
    const media = el.classList.contains('ed-panel')
      ? el.querySelector<HTMLElement>(':scope > .ed-panel__media')
      : null
    if (!media) return
    const md = delay + 110
    const anims = [
      media.animate([{ offset: 0, translate: `0 ${t.media}px` }], {
        duration: t.move + 150,
        delay: md,
        easing: EASE,
        fill: 'backwards',
      }),
      media.animate([{ offset: 0, opacity: 0 }], {
        duration: t.fade + 200,
        delay: md,
        easing: SOFT,
        fill: 'backwards',
      }),
    ]
    const waiting = Array.from(media.querySelectorAll('img')).filter((img) => !img.complete)
    if (!waiting.length) return
    anims.forEach((a) => a.pause()) // hold on the hidden first frame
    imagesReady(waiting, t.wait).then(() =>
      anims.forEach((a) => {
        if (a.playState === 'paused') a.play()
      })
    )
  }

  function reveal(el: HTMLElement, delay: number, animate = true) {
    if (state.get(el) !== PENDING) return
    if (!animate) {
      markRevealed(el)
      return
    }
    // Blocks that hold an image (figures, screenshots) wait for it briefly, so it fades in with
    // the block instead of popping in after it.
    const isPanel = el.classList.contains('ed-panel')
    const waiting = isPanel
      ? []
      : Array.from(el.querySelectorAll('img')).filter((img) => !img.complete)
    if (!waiting.length) {
      animateIn(el, delay)
      return
    }
    forget(el)
    const t0 = performance.now()
    imagesReady(waiting, 350).then(() => {
      if (state.get(el) !== PENDING || !el.isConnected) return
      animateIn(el, Math.max(0, delay - (performance.now() - t0)))
    })
  }

  // Reveal a group that entered together, in reading order: rows top to bottom, then left to
  // right; one step per row and per column. `settled`: called once scrolling has stopped; after
  // a fling, what is on screen goes at once too.
  function play(items: Entering[], settled = false) {
    if (!items.length) return
    const vh = window.innerHeight
    const fast = speed() > FAST || (settled && burst > FAST && performance.now() - lastT < 600)
    items.sort((a, b) =>
      Math.abs(a.r.top - b.r.top) > 12 ? a.r.top - b.r.top : a.r.left - b.r.left
    )
    let row = -1
    let rowTop = -Infinity
    let col = 0
    items.forEach(({ el, r }) => {
      if (Math.abs(r.top - rowTop) > 12) {
        row += 1
        col = 0
        rowTop = r.top
      } else col += 1
      // A late callback (element already well into view) goes at once.
      const late = r.top < vh * 0.55
      const steps = fast || late ? 0 : Math.min(row + col, MAX_STEPS)
      reveal(el, steps * STEP)
    })
  }

  // Catch whatever the observer can't: scrolled past unseen (no animation), on screen but
  // missed, and, once scrolling stops, anything the visitor can actually see below the trigger
  // line (fully on screen, or at least SHOWN px of it), so nothing sits blank at the bottom of a
  // still screen.
  function sweep() {
    if (!pending.size) return
    const vh = window.innerHeight
    const line = atBottom() ? vh : Math.max(vh * LINE, vh - SHOWN)
    const batch: Entering[] = []
    pending.forEach((el) => {
      if (!el.isConnected) {
        forget(el)
        state.delete(el)
        return
      }
      const r = el.getBoundingClientRect()
      if (!r.width && !r.height) return // display: none
      if (r.bottom <= 0) reveal(el, 0, false)
      else if (r.top < line || (r.top >= 0 && r.bottom <= vh)) batch.push({ el, r })
    })
    play(batch, true)
  }

  const io = new IntersectionObserver(
    (entries) => {
      const batch: Entering[] = []
      entries.forEach((en) => {
        const el = en.target as HTMLElement
        if (state.get(el) !== PENDING) return
        if (en.isIntersecting) batch.push({ el, r: en.boundingClientRect })
      })
      play(batch)
      if (atBottom()) sweep()
    },
    { rootMargin: `0px 0px -${Math.round((1 - LINE) * 100)}% 0px`, threshold: 0 }
  )

  // Start lazy images a viewport before their block is revealed.
  const pre = new IntersectionObserver(
    (entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return
        en.target.querySelectorAll<HTMLImageElement>('img[loading="lazy"]').forEach(eager)
        pre.unobserve(en.target)
      })
    },
    { rootMargin: '0px 0px 100% 0px' }
  )

  // Classify everything queued in one pass: read all rects first (a single layout), then write
  // classes. Runs as a microtask, i.e. before the browser paints newly mounted elements.
  function flush() {
    flushQueued = false
    const items = queue
    queue = []
    const vh = window.innerHeight
    const rects = items.map(({ el }) => el.getBoundingClientRect())
    const enter: Entering[] = []
    items.forEach(({ el, ssr }, i) => {
      if (!el.isConnected || state.has(el)) return
      // Shown once already (e.g. by an earlier instance in dev's double mount): never re-hide.
      if (el.classList.contains('is-revealed')) {
        state.set(el, REVEALED)
        return
      }
      const r = rects[i]
      const sized = r.width > 0 || r.height > 0
      const onScreen = sized && r.bottom > 0 && r.top < vh
      const intro = el.classList.contains('ed-intro')
      // Already visible (server-rendered, or a page intro playing its CSS entrance), or
      // hydrated above the viewport: never hide it. Blocks created on the client above the
      // viewport are left to the settle sweep.
      if ((onScreen && (ssr || intro)) || (ssr && sized && r.bottom <= 0)) {
        markRevealed(el)
        return
      }
      if (intro) {
        // An intro that starts below the fold scroll-reveals instead.
        el.getAnimations().forEach((a) => {
          if (String((a as CSSAnimation).animationName || '').startsWith('ed-intro')) a.cancel()
        })
      }
      state.set(el, PENDING)
      pending.add(el)
      el.classList.add('ed-reveal')
      if (onScreen && r.top < vh * LINE)
        enter.push({ el, r }) // mounted in view (client render)
      else {
        io.observe(el)
        if (el.querySelector('img[loading="lazy"]')) pre.observe(el)
      }
    })
    play(enter)
    // Settle pass once layout has caught up (fonts, images).
    settle(300)
  }

  const enqueue = (el: HTMLElement, ssr: boolean) => {
    if (state.has(el) || NOT_RENDERED.has(el.tagName)) return
    queue.push({ el, ssr })
    if (!flushQueued) {
      flushQueued = true
      queueMicrotask(flush)
    }
  }

  const collect = (root: ParentNode, ssr: boolean) =>
    root.querySelectorAll<HTMLElement>(TARGETS).forEach((el) => enqueue(el, ssr))

  // The block an in-page link points at (and any block it sits in) shows at once.
  const showTarget = (hash: string) => {
    if (!hash || hash === '#') return
    let target: HTMLElement | null = null
    try {
      target = document.getElementById(decodeURIComponent(hash.slice(1)))
    } catch {
      return
    }
    for (let a: HTMLElement | null = target; a && a !== document.body; a = a.parentElement)
      if (state.get(a) === PENDING) markRevealed(a)
  }

  const onClick = (e: MouseEvent) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey)
      return
    const a = (e.target as Element | null)?.closest?.('a[href*="#"]') as HTMLAnchorElement | null
    if (a && a.origin === location.origin && a.pathname === location.pathname) showTarget(a.hash)
  }

  const onHash = () => {
    showTarget(location.hash)
    settle(140)
  }

  const onScroll = () => {
    const now = performance.now()
    const y = window.scrollY
    const dt = now - lastT
    if (dt > 0 && dt < 200) velocity = velocity * 0.5 + (Math.abs(y - lastY) / dt) * 1000 * 0.5
    else {
      velocity = 0
      burst = 0
    }
    burst = Math.max(burst, velocity)
    lastY = y
    lastT = now
    settle(140)
  }

  const onResize = () => settle(140)
  const onLoad = () => settle(0)

  const mo = new MutationObserver((records) => {
    for (const rec of records) {
      rec.addedNodes.forEach((n) => {
        if (n.nodeType !== Node.ELEMENT_NODE) return
        const el = n as HTMLElement
        if (el.matches(TARGETS)) enqueue(el, false)
        if (el.firstElementChild) collect(el, false)
      })
    }
  })

  // What is in the document now came from the server (first load).
  collect(document, true)
  if (queue.length) flush()
  showTarget(location.hash)

  mo.observe(document.body, { childList: true, subtree: true })
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onResize, { passive: true })
  window.addEventListener('hashchange', onHash)
  document.addEventListener('click', onClick, true)
  if (document.readyState === 'complete') settle(0)
  else window.addEventListener('load', onLoad, { once: true })

  return () => {
    mo.disconnect()
    io.disconnect()
    pre.disconnect()
    window.clearTimeout(settleTimer)
    window.removeEventListener('scroll', onScroll)
    window.removeEventListener('resize', onResize)
    window.removeEventListener('hashchange', onHash)
    window.removeEventListener('load', onLoad)
    document.removeEventListener('click', onClick, true)
    // Hand still-hidden blocks back unclassified, so a later instance picks them up.
    pending.forEach((el) => el.classList.remove('ed-reveal'))
    pending.clear()
  }
}

// Mounted once in the root layout. It watches the whole document (route changes included), so it
// does not need to re-run per page.
export default function Reveal() {
  useEffect(() => startReveal(), [])
  return null
}
