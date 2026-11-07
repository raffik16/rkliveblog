'use client'

import { useEffect, useRef, useState } from 'react'
import { JetBrains_Mono } from 'next/font/google'

const mono = JetBrains_Mono({ subsets: ['latin'], weight: ['400', '600'], display: 'swap' })

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
  const [status, setStatus] = useState<'loading' | 'ready' | 'unsupported'>('loading')
  const [idle, setIdle] = useState(false)

  useEffect(() => {
    const html = document.documentElement
    const prevHtml = html.style.overflow
    const prevBody = document.body.style.overflow
    html.style.overflow = 'hidden'
    document.body.style.overflow = 'hidden'

    let stop: (() => void) | undefined
    let cancelled = false
    import('./scene/chaos.js').then(({ startChaos }) => {
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
          onReady: () => setStatus('ready'),
          onUnsupported: () => setStatus('unsupported'),
        }
      )
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

  return (
    <div
      ref={rootRef}
      role="img"
      aria-label="Chaos is an art form: a V8 engine, a Strandbeest and a landing gear run, come apart and reassemble inside glowing strange attractors."
      className={`${mono.className} fixed inset-0 z-[200] overflow-hidden bg-[#030304] select-none`}
      style={{ cursor: idle ? 'none' : 'default' }}
    >
      <div
        ref={hostRef}
        className="absolute inset-0 transition-opacity duration-[1800ms] ease-out"
        style={{ opacity: status === 'ready' ? 1 : 0 }}
      />

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

      {status === 'unsupported' && (
        <div className="absolute inset-0 flex items-center justify-center px-8 text-center text-sm tracking-[0.2em] text-white/60">
          THIS PIECE NEEDS WEBGL 2
        </div>
      )}
    </div>
  )
}
