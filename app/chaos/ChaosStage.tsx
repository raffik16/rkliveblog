'use client'

import { useEffect, useRef, useState } from 'react'
import { JetBrains_Mono } from 'next/font/google'

const mono = JetBrains_Mono({ subsets: ['latin'], weight: ['400', '600'], display: 'swap' })

// The loader's butterfly: the Lorenz attractor seen side-on (x across, z up), integrated here once. It is in the
// server HTML, so it is on screen before any script runs; the boot then traces it as it goes.
const LORENZ = (() => {
  const f = (p: number[]) => [
    10 * (p[1] - p[0]),
    p[0] * (28 - p[2]) - p[1],
    p[0] * p[1] - (8 / 3) * p[2],
  ]
  const step = (p: number[], h: number) => {
    const k1 = f(p)
    const k2 = f(p.map((v, i) => v + (h / 2) * k1[i]))
    const k3 = f(p.map((v, i) => v + (h / 2) * k2[i]))
    const k4 = f(p.map((v, i) => v + h * k3[i]))
    return p.map((v, i) => v + (h / 6) * (k1[i] + 2 * k2[i] + 2 * k3[i] + k4[i]))
  }
  let p = [0.1, 0, 0]
  // a start whose path keeps switching wings, so both fill in as the loader traces it
  for (let i = 0; i < 3400; i++) p = step(p, 0.005)
  const pts: string[] = []
  for (let i = 0; i < 900; i++) {
    for (let s = 0; s < 4; s++) p = step(p, 0.004)
    pts.push(`${(120 + p[0] * 5).toFixed(1)} ${(178 - p[2] * 3.2).toFixed(1)}`)
  }
  return 'M' + pts.join('L')
})()

type Status = 'loading' | 'ready' | 'unsupported' | 'failed'

// The piece covers the whole window, header and footer included. It has no controls: it plays itself. A click (or
// the f key) toggles browser fullscreen, and the cursor hides when it is still.
export default function ChaosStage() {
  const rootRef = useRef<HTMLDivElement>(null)
  const hostRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLDivElement>(null)
  const leftRef = useRef<HTMLDivElement>(null)
  const rightRef = useRef<HTMLDivElement>(null)
  const l1 = useRef<HTMLDivElement>(null)
  const l2 = useRef<HTMLDivElement>(null)
  const r1 = useRef<HTMLDivElement>(null)
  const r2 = useRef<HTMLDivElement>(null)
  const [status, setStatus] = useState<Status>('loading')
  const [stage, setStage] = useState({ label: 'LOADING THREE.JS', k: 0.04 })
  const [idle, setIdle] = useState(false)

  useEffect(() => {
    const html = document.documentElement
    const prevHtml = html.style.overflow
    const prevBody = document.body.style.overflow
    html.style.overflow = 'hidden'
    document.body.style.overflow = 'hidden'

    let stop: (() => void) | undefined
    let cancelled = false
    import('./scene/chaos.js')
      .then(({ startChaos }) => {
        if (cancelled || !hostRef.current) return
        stop = startChaos(
          hostRef.current,
          {
            title: titleRef.current,
            leftBox: leftRef.current,
            rightBox: rightRef.current,
            left: [l1.current, l2.current],
            right: [r1.current, r2.current],
          },
          {
            onProgress: (label, k) => setStage({ label, k }),
            onReady: () => setStatus('ready'),
            onUnsupported: () => setStatus('unsupported'),
          }
        )
      })
      .catch(() => {
        if (!cancelled) setStatus('failed')
      })
    return () => {
      cancelled = true
      stop?.()
      html.style.overflow = prevHtml
      document.body.style.overflow = prevBody
    }
  }, [])

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const toggle = () => {
      if (document.fullscreenElement) document.exitFullscreen?.().catch(() => {})
      else document.documentElement.requestFullscreen?.().catch(() => {})
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'f' && !e.metaKey && !e.ctrlKey && !e.altKey) toggle()
    }
    let timer: ReturnType<typeof setTimeout> | undefined
    const wake = () => {
      setIdle(false)
      clearTimeout(timer)
      timer = setTimeout(() => setIdle(true), 2200)
    }
    wake()
    root.addEventListener('click', toggle)
    root.addEventListener('pointermove', wake)
    window.addEventListener('keydown', onKey)
    return () => {
      clearTimeout(timer)
      root.removeEventListener('click', toggle)
      root.removeEventListener('pointermove', wake)
      window.removeEventListener('keydown', onKey)
    }
  }, [])

  const caption = 'text-[10px] leading-[1.75] tracking-[0.16em] text-white/60 sm:text-[11px]'
  // the loader stays up until the piece plays, and carries the message if it never will
  const showLoader = status !== 'ready'
  const message =
    status === 'unsupported'
      ? 'THIS PIECE NEEDS WEBGL 2'
      : status === 'failed'
        ? 'COULD NOT LOAD · RELOAD TO TRY AGAIN'
        : null

  return (
    <div
      ref={rootRef}
      role="img"
      aria-label="Chaos is an art form: a V8 engine, a Strandbeest and a landing gear run, come apart and reassemble inside glowing strange attractors."
      className={`${mono.className} fixed inset-0 z-[200] overflow-hidden bg-[#030304] select-none`}
      style={{ cursor: idle ? 'none' : 'default' }}
    >
      <div ref={hostRef} className="absolute inset-0" />

      <div
        ref={titleRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-[42%] px-6 text-center opacity-0"
      >
        <div className="text-[13px] font-semibold tracking-[0.32em] text-white/90 [text-shadow:0_0_24px_rgba(0,0,0,0.9)] sm:text-[22px] sm:tracking-[0.55em]">
          CHAOS IS AN ART FORM
        </div>
        <div className="mt-4 text-[9px] tracking-[0.2em] text-white/55 [text-shadow:0_0_18px_rgba(0,0,0,0.9)] sm:text-[12px] sm:tracking-[0.42em]">
          NOTHING HERE IS RANDOM
        </div>
      </div>

      <div
        ref={leftRef}
        aria-hidden="true"
        className={`pointer-events-none absolute bottom-[max(18px,env(safe-area-inset-bottom))] left-4 max-w-[80%] opacity-0 sm:left-7 sm:max-w-[46%] ${caption}`}
      >
        <div ref={l1} />
        <div ref={l2} className="hidden text-white/40 sm:block" />
      </div>
      <div
        ref={rightRef}
        aria-hidden="true"
        className={`pointer-events-none absolute right-4 bottom-[max(18px,env(safe-area-inset-bottom))] hidden max-w-[50%] text-right opacity-0 sm:right-7 sm:block ${caption}`}
      >
        <div ref={r1} />
        <div ref={r2} className="text-white/40" />
      </div>

      {/* The loader: opaque until the piece is built, compiled and tuned, then it fades off a piece already playing */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center bg-[#030304] px-6 transition-opacity duration-[1100ms] ease-out"
        style={{ opacity: showLoader ? 1 : 0 }}
      >
        <svg
          viewBox="0 0 240 196"
          className="w-[min(60vw,280px)] overflow-visible"
          style={{ filter: 'drop-shadow(0 0 6px rgba(255, 106, 31, 0.45))' }}
        >
          <defs>
            <linearGradient id="chaos-loader-ink" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0" stopColor="#ff4d1a" />
              <stop offset="1" stopColor="#ffd9a8" />
            </linearGradient>
          </defs>
          <path d={LORENZ} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="0.5" />
          <path
            d={LORENZ}
            fill="none"
            stroke="url(#chaos-loader-ink)"
            strokeWidth="0.7"
            strokeLinecap="round"
            pathLength={1}
            strokeDasharray="1 1"
            style={{
              strokeDashoffset: 1 - stage.k,
              transition: 'stroke-dashoffset 900ms cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          />
        </svg>
        <div className="mt-9 text-[11px] font-semibold tracking-[0.32em] text-white/80 sm:text-[12px] sm:tracking-[0.42em]">
          CHAOS IS AN ART FORM
        </div>
        <div className="mt-5 h-px w-44 overflow-hidden bg-white/10">
          <div
            className="h-full bg-[#ff6a1f] transition-[width] duration-700 ease-out"
            style={{ width: `${Math.round(stage.k * 100)}%` }}
          />
        </div>
        <div className="mt-3 flex h-4 w-[min(84vw,380px)] items-center justify-center gap-3 text-[9px] tracking-[0.18em] text-white/45 sm:text-[10px]">
          {message ? (
            <span className="text-white/70">{message}</span>
          ) : (
            <>
              <span className="motion-safe:animate-pulse">{stage.label}</span>
              <span className="text-white/30 tabular-nums">{Math.round(stage.k * 100)}%</span>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
