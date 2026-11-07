'use client'

import { useEffect, useRef, useState } from 'react'
import { JetBrains_Mono } from 'next/font/google'

const mono = JetBrains_Mono({ subsets: ['latin'], weight: ['400', '600'], display: 'swap' })

// The loader's drawing, traced as the set builds: the bun, the frank, the mustard, then the notes above it.
const DOG =
  'M38 70C38 52 54 45 72 45H168C186 45 202 52 202 70' +
  'M30 59H210A11.5 11.5 0 0 1 210 82H30A11.5 11.5 0 0 1 30 59Z' +
  'M24 73C24 100 44 110 70 110H170C196 110 216 100 216 73'
const MUSTARD =
  'M44 63L56 70L68 63L80 70L92 63L104 70L116 63L128 70L140 63L152 70L164 63L176 70L188 63L196 67'
const NOTES =
  'M174 30a6 4.2 -20 1 0 12 -1a6 4.2 -20 1 0 -12 1M186 29V5C188 12 197 14 194 25' +
  'M36 36a6 4.2 -20 1 0 12 -1a6 4.2 -20 1 0 -12 1M60 31a6 4.2 -20 1 0 12 -1a6 4.2 -20 1 0 -12 1' +
  'M48 35V13M72 30V8M48 13L72 8M48 18L72 13'

type Status = 'loading' | 'ready' | 'unsupported' | 'failed'

const clamp01 = (x: number) => Math.min(1, Math.max(0, x))

// The set covers the whole window, header and footer included. It has no controls: it plays itself. A click (or the
// f key) toggles browser fullscreen, the cursor hides when it is still, and the screen is kept awake while it plays.
export default function HotDogStage() {
  const rootRef = useRef<HTMLDivElement>(null)
  const hostRef = useRef<HTMLDivElement>(null)
  const [status, setStatus] = useState<Status>('loading')
  const [stage, setStage] = useState({ label: 'LOADING THREE.JS', k: 0.03 })
  const [bpm, setBpm] = useState<number | null>(null)
  const [idle, setIdle] = useState(false)

  useEffect(() => {
    const html = document.documentElement
    const prevHtml = html.style.overflow
    const prevBody = document.body.style.overflow
    html.style.overflow = 'hidden'
    document.body.style.overflow = 'hidden'

    let stop: (() => void) | undefined
    let cancelled = false
    import('./scene/set.js')
      .then(({ startHotDogSet, tempoFrom }) => {
        if (cancelled || !hostRef.current) return
        setBpm(tempoFrom(location.search))
        stop = startHotDogSet(hostRef.current, {
          onProgress: (label: string, k: number) => setStage({ label, k }),
          onReady: () => setStatus('ready'),
          onUnsupported: () => setStatus('unsupported'),
        })
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

  // A backdrop runs for hours: keep the screen from dimming or locking while it plays (where the browser allows it).
  useEffect(() => {
    if (status !== 'ready' || !('wakeLock' in navigator)) return
    let lock: WakeLockSentinel | null = null
    let gone = false
    const ask = () => {
      if (document.visibilityState !== 'visible' || (lock && !lock.released)) return
      navigator.wakeLock
        .request('screen')
        .then((l) => {
          if (gone) l.release().catch(() => {})
          else lock = l
        })
        .catch(() => {})
    }
    ask()
    document.addEventListener('visibilitychange', ask)
    return () => {
      gone = true
      document.removeEventListener('visibilitychange', ask)
      lock?.release().catch(() => {})
    }
  }, [status])

  const showLoader = status !== 'ready'
  const message =
    status === 'unsupported'
      ? 'THIS SET NEEDS WEBGL 2'
      : status === 'failed'
        ? 'COULD NOT LOAD · RELOAD TO TRY AGAIN'
        : null
  const k = stage.k
  const trace = (from: number, to: number) => ({
    strokeDashoffset: 1 - clamp01((k - from) / (to - from)),
    transition: 'stroke-dashoffset 900ms cubic-bezier(0.16, 1, 0.3, 1)',
  })

  return (
    <div
      ref={rootRef}
      role="img"
      aria-label="Chaos is an art form, the hot dog set: hot dogs come apart into exploded views and back together inside glowing strange attractors, while music notes fly and a ring of stave plays a melody."
      className={`${mono.className} fixed inset-0 z-[200] overflow-hidden bg-[#030304] select-none`}
      style={{ cursor: idle ? 'none' : 'default' }}
    >
      <div ref={hostRef} className="absolute inset-0" />

      {/* The loader: opaque until the set is built, compiled and tuned, then it fades off a set already playing */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center bg-[#030304] px-6 transition-opacity duration-[1100ms] ease-out"
        style={{ opacity: showLoader ? 1 : 0 }}
      >
        <svg
          viewBox="0 0 240 120"
          className="w-[min(64vw,300px)] overflow-visible"
          style={{ filter: 'drop-shadow(0 0 6px rgba(255, 196, 26, 0.4))' }}
        >
          <defs>
            <linearGradient id="hotdog-loader-ink" x1="0" y1="1" x2="1" y2="0">
              <stop offset="0" stopColor="#ff3b2f" />
              <stop offset="1" stopColor="#ffd9a8" />
            </linearGradient>
          </defs>
          <g fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path d={DOG} stroke="rgba(255,255,255,0.07)" strokeWidth="0.8" />
            <path d={MUSTARD} stroke="rgba(255,255,255,0.05)" strokeWidth="0.8" />
            <path d={NOTES} stroke="rgba(255,255,255,0.05)" strokeWidth="0.8" />
            <path
              d={DOG}
              stroke="url(#hotdog-loader-ink)"
              strokeWidth="1.1"
              pathLength={1}
              strokeDasharray="1 1"
              style={trace(0, 0.6)}
            />
            <path
              d={MUSTARD}
              stroke="#ffd21f"
              strokeWidth="1.6"
              pathLength={1}
              strokeDasharray="1 1"
              style={trace(0.5, 0.78)}
            />
            <path
              d={NOTES}
              stroke="#ff3df0"
              strokeWidth="1.1"
              pathLength={1}
              strokeDasharray="1 1"
              style={trace(0.7, 1)}
            />
          </g>
        </svg>
        <div className="mt-9 text-[11px] font-semibold tracking-[0.32em] text-white/80 sm:text-[12px] sm:tracking-[0.42em]">
          HOT DOG SET
        </div>
        <div className="mt-2 h-3 text-[9px] tracking-[0.3em] text-white/40 sm:text-[10px]">
          {bpm ? `${bpm} BPM` : ''}
        </div>
        <div className="mt-4 h-px w-44 overflow-hidden bg-white/10">
          <div
            className="h-full bg-[#ffd21f] transition-[width] duration-700 ease-out"
            style={{ width: `${Math.round(k * 100)}%` }}
          />
        </div>
        <div className="mt-3 flex h-4 w-[min(84vw,380px)] items-center justify-center gap-3 text-[9px] tracking-[0.18em] text-white/45 sm:text-[10px]">
          {message ? (
            <span className="text-white/70">{message}</span>
          ) : (
            <>
              <span className="motion-safe:animate-pulse">{stage.label}</span>
              <span className="text-white/30 tabular-nums">{Math.round(k * 100)}%</span>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
