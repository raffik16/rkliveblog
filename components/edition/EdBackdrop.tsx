'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { createFibreField } from '@/lib/edition/fibreField'
import { setActiveChapter, setChapters, type Chapter } from '@/lib/edition/chapters'

/*
  Fixed page backdrop (z-index 0, page content paints above it). A port of raffi.website's
  components/EdBackdrop.vue:

  - Paints the colour of whichever [data-chapter] holds the middle of the viewport. Across each
    boundary the browser blends the two chapter colours with color-mix(in oklch, ...): JS only
    sets which two tokens to mix and by how much.
  - Draws the faint fibre field (lib/edition/fibreField.js, copied from the main site): ring hubs
    pouring hairline strands, braided cables, comets of light, mild scroll parallax.
  - Reads the page's text line boxes in idle time so hubs that sit on copy fade down.
  - Publishes the chapter list and the active chapter (lib/edition/chapters.ts) and writes the
    progress through the active chapter to --ed-progress on <html>.

  Left out from the main site: the title bundles (fibres reaching into display titles as they
  fill), which hang off GSAP's ticker there.
*/

const DPR_CAP = 1.5
const PARALLAX = 0.06
const IDLE_FRAME_MS = 28
const SCROLL_FRAME_MS = 45
const DEFAULT_COLOR = 'var(--ed-ink)'
const TEXT_SKIP = 'script,style,noscript,template,.ed-backdrop,.ed-menu'

interface ChapterEl extends Chapter {
  el: HTMLElement
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Field = any

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v)
const smooth = (x: number) => {
  const t = clamp01(x)
  return t * t * (3 - 2 * t)
}
const titleCase = (id: string) =>
  String(id || '')
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())

export default function EdBackdrop() {
  const rootRef = useRef<HTMLDivElement>(null)
  const strandRef = useRef<HTMLCanvasElement>(null)
  const lightRef = useRef<HTMLCanvasElement>(null)
  const rescanRef = useRef<() => void>(() => {})
  const pathname = usePathname()

  useEffect(() => {
    const root = rootRef.current
    const strandEl = strandRef.current
    const lightEl = lightRef.current
    if (!root || !strandEl || !lightEl) return

    let alive = true
    let chapterEls: ChapterEl[] = []
    let signature = ''
    let activeId: string | null | undefined = undefined
    const applied = { from: '', to: '', mix: '', snap: '' }
    let tone = ''

    let field: Field = null
    let vw = 0
    let vh = 0
    let builtW = 0
    let builtH = 0

    let raf = 0
    let running = false
    let reducedMotion = false
    let dirty = true
    let scrollMoved = false
    let lastScroll = -1e9
    let frameScroll = NaN
    let lastMeasure = 0
    let lastDraw = 0
    let staticRaf = 0
    let staticDirty = true
    let idleTimer = 0
    let textY = 0
    let scanTimer = 0
    let resizeTimer = 0
    const timers: number[] = []

    // ---------- chapters ----------
    const scan = () => {
      const found = Array.from(
        document.body.querySelectorAll<HTMLElement>('[data-chapter]')
      ).filter(
        (el) => !el.parentElement?.closest('body [data-chapter]') && !el.closest('.ed-backdrop')
      )
      const sameEls =
        found.length === chapterEls.length && found.every((el, i) => chapterEls[i].el === el)
      const nextSig = found
        .map((el) =>
          [
            el.dataset.chapter,
            el.dataset.chapterLabel,
            el.dataset.chapterNum,
            el.dataset.chapterColor,
            el.dataset.chapterRail,
          ].join('|')
        )
        .join('~')
      if (sameEls && nextSig === signature) return

      chapterEls = found.map((el) => {
        const id = el.dataset.chapter || ''
        return {
          el,
          id,
          label: el.dataset.chapterLabel || titleCase(id),
          num: el.dataset.chapterNum || '',
          color: (el.dataset.chapterColor || '').trim() || DEFAULT_COLOR,
          rail: el.dataset.chapterRail !== 'off',
        }
      })
      if (nextSig !== signature) {
        signature = nextSig
        setChapters(
          chapterEls.map(({ id, label, num, color, rail }) => ({ id, label, num, color, rail }))
        )
      }
      dirty = true
      if (reducedMotion) scheduleStatic()
    }

    const scheduleScan = (delay = 140) => {
      window.clearTimeout(scanTimer)
      scanTimer = window.setTimeout(scan, delay)
    }

    // ---------- colour from scroll ----------
    const applyColor = (from: string, to: string, mix: number, snap: string) => {
      const mixStr = `${(Math.round(mix * 1000) / 10).toFixed(1)}%`
      if (applied.from !== from) root.style.setProperty('--ed-bd-from', (applied.from = from))
      if (applied.to !== to) root.style.setProperty('--ed-bd-to', (applied.to = to))
      if (applied.mix !== mixStr) root.style.setProperty('--ed-bd-mix', (applied.mix = mixStr))
      if (applied.snap !== snap) root.style.setProperty('--ed-bd-snap', (applied.snap = snap))
      // Mixing a near-grey colour with itself in oklch drops its hue (Chrome renders a reddish
      // black), so only route through color-mix() while actually blending.
      root.classList.toggle('is-blending', from !== to && mix > 0)
    }

    const setTone = (color: string) => {
      const next = /ed-ink/.test(color) ? 'ink' : 'color'
      if (next === tone) return
      tone = next
      root.dataset.tone = next
    }

    const publish = (id: string | null, progress: number) => {
      if (id !== activeId) {
        activeId = id
        setActiveChapter(id)
      }
      document.documentElement.style.setProperty(
        '--ed-progress',
        String(Math.round(clamp01(progress) * 1000) / 1000)
      )
    }

    const measure = () => {
      const mid = vh * 0.5
      const list: { c: ChapterEl; top: number; bottom: number }[] = []
      for (const c of chapterEls) {
        if (!c.el.isConnected) continue
        const r = c.el.getBoundingClientRect()
        if (r.height <= 0) continue
        list.push({ c, top: r.top, bottom: r.bottom })
      }
      if (!list.length) {
        applyColor(DEFAULT_COLOR, DEFAULT_COLOR, 0, DEFAULT_COLOR)
        setTone(DEFAULT_COLOR)
        publish(null, 0)
        return
      }

      const boundary = (k: number) => (list[k].bottom + list[k + 1].top) / 2
      let idx = 0
      for (let k = 0; k < list.length - 1; k++) {
        if (mid >= boundary(k)) idx = k + 1
        else break
      }

      const active = list[idx].c
      let from = active.color
      let to = active.color
      let mix = 0
      const baseZone = Math.min(Math.max(vh * 0.5, 220), 600)
      let best = Infinity
      for (const k of reducedMotion ? [] : [idx - 1, idx]) {
        if (k < 0 || k >= list.length - 1) continue
        const zone = Math.min(
          baseZone,
          0.6 * (list[k].bottom - list[k].top),
          0.6 * (list[k + 1].bottom - list[k + 1].top)
        )
        const d = mid - boundary(k)
        if (Math.abs(d) < zone / 2 && Math.abs(d) < best) {
          best = Math.abs(d)
          from = list[k].c.color
          to = list[k + 1].c.color
          mix = smooth(d / zone + 0.5)
        }
      }
      if (from === to) mix = 0
      else if (mix <= 0.0005) {
        to = from
        mix = 0
      } else if (mix >= 0.9995) {
        from = to
        mix = 0
      }

      applyColor(from, to, mix, active.color)
      setTone(active.color)
      const a = list[idx]
      publish(active.id, (mid - a.top) / Math.max(1, a.bottom - a.top))
    }

    // ---------- fibre field ----------
    const isLowPower = () => {
      const cores = navigator.hardwareConcurrency || 8
      return vw < 720 || cores <= 4 || !!window.matchMedia?.('(pointer: coarse)').matches
    }

    const sizeCanvas = () => {
      vw = window.innerWidth
      vh = window.innerHeight
      if (!field) field = createFibreField(strandEl, lightEl, { dprCap: DPR_CAP })
      if (!field) return
      field.resize(vw, vh)
      staticDirty = true
      // Rebuild on width changes or big height changes only (mobile URL bar).
      if (vw !== builtW || Math.abs(vh - builtH) > 160) {
        builtW = vw
        builtH = vh
        field.build({ lowPower: isLowPower() })
      }
    }

    const draw = (t: number) => {
      const sy = window.scrollY
      field?.draw(t, reducedMotion ? 0 : sy * PARALLAX, reducedMotion, sy)
    }

    // ---------- text knock-down ----------
    // The line boxes of the page's text (document px), read in idle slices, so the field can
    // fade any hub that sits on copy.
    type TextJob = {
      walker: TreeWalker
      range: Range
      boxes: number[]
      fixed: number[]
      solid: number[]
      fx: WeakMap<Element, boolean>
      maxH: number
    }
    let textJob: TextJob | null = null
    let textTimer = 0
    let textIdle = 0
    let textAgain = false
    const hasIdle = () => typeof window.requestIdleCallback === 'function'
    const requestIdle = (cb: (d?: IdleDeadline) => void) =>
      hasIdle() ? window.requestIdleCallback(cb, { timeout: 500 }) : window.setTimeout(cb, 40)
    const cancelIdle = (id: number) =>
      hasIdle() ? window.cancelIdleCallback(id) : window.clearTimeout(id)

    const isFixed = (el: Element | null, cache: WeakMap<Element, boolean>) => {
      const seen: Element[] = []
      let res = false
      for (let a = el; a && a !== document.body; a = a.parentElement) {
        const c = cache.get(a)
        if (c !== undefined) {
          res = c
          break
        }
        seen.push(a)
        if ((a as HTMLElement).offsetParent === null && getComputedStyle(a).position === 'fixed') {
          res = true
          break
        }
      }
      for (const a of seen) cache.set(a, res)
      return res
    }

    const onSolid = (el: Element | null) => {
      for (let a = el; a && a !== document.body; a = a.parentElement) {
        const m = /rgba?\(([^)]+)\)/.exec(getComputedStyle(a).backgroundColor)
        const v = m ? m[1].split(',') : null
        if (v && (v.length < 4 || parseFloat(v[3]) >= 0.6)) return true
        if ((a as HTMLElement).offsetParent === null) break
      }
      return false
    }

    const sortBoxes = (b: number[]) => {
      const order = Array.from({ length: b.length / 4 }, (_, i) => i).sort(
        (p, q) => b[p * 4 + 1] - b[q * 4 + 1]
      )
      const out = new Float32Array(b.length)
      order.forEach((src, i) => {
        out[i * 4] = b[src * 4]
        out[i * 4 + 1] = b[src * 4 + 1]
        out[i * 4 + 2] = b[src * 4 + 2]
        out[i * 4 + 3] = b[src * 4 + 3]
      })
      return out
    }

    const textSlice = (deadline?: IdleDeadline) => {
      textIdle = 0
      const job = textJob
      if (!job || !alive) return
      const until = performance.now() + 5
      const useDeadline =
        deadline && typeof deadline.timeRemaining === 'function' && !deadline.didTimeout
      const sy = window.scrollY
      let n = 0
      for (let node = job.walker.nextNode(); node; node = job.walker.nextNode()) {
        job.range.selectNodeContents(node)
        const rects = job.range.getClientRects()
        const parent = node.parentElement
        const fixed = rects.length > 0 && isFixed(parent, job.fx)
        const solid = fixed && onSolid(parent)
        for (let i = 0; i < rects.length; i++) {
          const r = rects[i]
          if (r.width < 1 || r.height < 1 || r.right < 0 || r.left > vw) continue
          if (fixed) {
            job.fixed.push(r.left, r.top, r.right, r.bottom)
            job.solid.push(solid ? 1 : 0)
            continue
          }
          job.boxes.push(r.left, r.top + sy, r.right, r.bottom + sy)
          if (r.height > job.maxH) job.maxH = r.height
        }
        if (
          ++n % 24 === 0 &&
          (useDeadline ? deadline!.timeRemaining() < 1.5 : performance.now() > until)
        ) {
          textIdle = requestIdle(textSlice)
          return
        }
      }
      textJob = null
      field?.setText(
        sortBoxes(job.boxes),
        job.maxH,
        job.fixed.length ? Float32Array.from(job.fixed) : null,
        job.solid.length ? Uint8Array.from(job.solid) : null
      )
      if (reducedMotion && field?.wouldChange(window.scrollY)) {
        staticDirty = true
        scheduleStatic()
      }
      if (textAgain) {
        textAgain = false
        if (Math.abs(window.scrollY - textY) > 40) scheduleText(0, true)
      }
    }

    const startText = () => {
      textTimer = 0
      textY = window.scrollY
      if (textIdle) cancelIdle(textIdle)
      textJob = {
        walker: document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
          acceptNode: (n) =>
            /\S/.test((n as Text).data) && !n.parentElement?.closest(TEXT_SKIP)
              ? NodeFilter.FILTER_ACCEPT
              : NodeFilter.FILTER_REJECT,
        }),
        range: document.createRange(),
        boxes: [],
        fixed: [],
        solid: [],
        fx: new WeakMap(),
        maxH: 0,
      }
      textIdle = requestIdle(textSlice)
    }

    function scheduleText(delay = 300, force = false) {
      if (!alive || (textTimer && !force)) return
      window.clearTimeout(textTimer)
      textTimer = window.setTimeout(startText, delay)
    }

    // ---------- loop ----------
    let fieldStamp = -1
    const fieldFrame = (now: number) => {
      const stamp = (document.timeline?.currentTime as number | null) ?? now
      if (stamp === fieldStamp) return
      fieldStamp = stamp
      if (dirty || now - lastMeasure > 500) {
        measure()
        lastMeasure = now
        dirty = false
      }
      if (!field || document.documentElement.dataset.menu === 'open') return
      const sy = window.scrollY
      if (sy !== frameScroll) {
        frameScroll = sy
        scrollMoved = true
      }
      const every = now - lastScroll < 160 ? SCROLL_FRAME_MS : IDLE_FRAME_MS
      if (now - lastDraw >= every) {
        draw(now)
        lastDraw = now
        scrollMoved = false
      } else if (scrollMoved) {
        scrollMoved = false
        if (!field.move(window.scrollY * PARALLAX)) {
          draw(now)
          lastDraw = now
        }
      }
    }

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame)
      fieldFrame(now)
    }

    const start = () => {
      if (running || reducedMotion || document.hidden) return
      running = true
      raf = requestAnimationFrame(frame)
    }

    const stop = () => {
      running = false
      cancelAnimationFrame(raf)
    }

    function scheduleStatic() {
      if (staticRaf) return
      staticRaf = requestAnimationFrame(() => {
        staticRaf = 0
        measure()
        if (staticDirty) {
          staticDirty = false
          draw(0)
        }
      })
    }

    // ---------- events ----------
    const onScrollIdle = () => {
      if (Math.abs(window.scrollY - textY) > 40) {
        if (textJob) textAgain = true
        else scheduleText(0, true)
      } else if (reducedMotion && field?.wouldChange(window.scrollY)) {
        staticDirty = true
        scheduleStatic()
      }
    }

    const onScroll = () => {
      dirty = true
      scrollMoved = true
      lastScroll = performance.now()
      if (reducedMotion) scheduleStatic()
      window.clearTimeout(idleTimer)
      idleTimer = window.setTimeout(onScrollIdle, 220)
    }

    const onResize = () => {
      window.clearTimeout(resizeTimer)
      resizeTimer = window.setTimeout(() => {
        sizeCanvas()
        dirty = true
        scrollMoved = true
        scheduleText(200, true)
        if (reducedMotion) scheduleStatic()
      }, 120)
    }

    const onVisibility = () => {
      if (document.hidden) stop()
      else {
        dirty = true
        start()
      }
    }

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onMotionChange = () => {
      reducedMotion = motionQuery.matches
      if (reducedMotion) {
        stop()
        staticDirty = true
        scheduleStatic()
      } else start()
    }

    reducedMotion = motionQuery.matches
    motionQuery.addEventListener?.('change', onMotionChange)

    vh = window.innerHeight
    sizeCanvas()
    scan()
    measure()
    draw(0)
    staticDirty = false

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize, { passive: true })
    document.addEventListener('visibilitychange', onVisibility)

    const mo = new MutationObserver(() => scheduleScan())
    mo.observe(document.body, { childList: true, subtree: true })
    let ro: ResizeObserver | null = null
    if (typeof ResizeObserver === 'function') {
      ro = new ResizeObserver(() => scheduleText(600))
      ro.observe(document.body)
    }

    timers.push(window.setTimeout(scan, 600))
    scheduleText(60, true)
    timers.push(window.setTimeout(() => scheduleText(0, true), 1600))
    document.fonts?.ready?.then(() => scheduleText(50, true))

    // Route changes: rescan chapters (again once late content settles) and re-read the copy.
    rescanRef.current = () => {
      timers.forEach(window.clearTimeout)
      timers.length = 0
      scan()
      dirty = true
      if (reducedMotion) scheduleStatic()
      ;[120, 600, 1500].forEach((ms) =>
        timers.push(
          window.setTimeout(() => {
            scan()
            dirty = true
          }, ms)
        )
      )
      scheduleText(150, true)
      timers.push(window.setTimeout(() => scheduleText(0, true), 1600))
    }

    start()

    return () => {
      alive = false
      stop()
      cancelAnimationFrame(staticRaf)
      window.clearTimeout(scanTimer)
      window.clearTimeout(resizeTimer)
      window.clearTimeout(idleTimer)
      window.clearTimeout(textTimer)
      if (textIdle) cancelIdle(textIdle)
      textJob = null
      timers.forEach(window.clearTimeout)
      mo.disconnect()
      ro?.disconnect()
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
      document.removeEventListener('visibilitychange', onVisibility)
      motionQuery.removeEventListener?.('change', onMotionChange)
      rescanRef.current = () => {}
      field?.destroy()
      field = null
    }
  }, [])

  useEffect(() => {
    rescanRef.current()
  }, [pathname])

  return (
    <div ref={rootRef} className="ed-backdrop" aria-hidden="true">
      <canvas ref={strandRef} className="ed-backdrop__net ed-backdrop__net--strands" />
      <canvas ref={lightRef} className="ed-backdrop__net" />
      <div className="ed-backdrop__shade" />
      <div className="ed-backdrop__grain" />
    </div>
  )
}
