'use client'

import { useEffect, useMemo, useRef, useState, type CSSProperties, type Ref } from 'react'
import { createPortal } from 'react-dom'
import EdChapterHead from '@/components/edition/EdChapterHead'
import EdNote from '@/components/edition/EdNote'
import EdPill from '@/components/edition/EdPill'
import { cx } from '@/lib/edition/cx'
import { Director, type Phase, type Prompt, type Summary } from './engine/director'
import { seeded, words } from './engine/script'
import { DreamSound } from './engine/sound'
import styles from './dream.module.css'

// Forty Winks. The page is an ordinary page on purpose: it is where you start, and it is where
// you wake up. Closing your eyes lays the dream over the whole window (and the whole screen,
// where the browser allows it) until the kettle boils.

type State = 'awake' | 'asleep' | 'woke'
type Device = 'mouse' | 'touch' | 'key'

interface Line {
  id: number
  text: string
  kind: 'line' | 'name'
  out?: boolean
}

const HOLD_TEXT: Record<Device, string> = {
  mouse: 'Press and hold',
  touch: 'Touch and hold',
  key: 'Hold space',
}

const ARROWS: Record<string, [number, number]> = {
  ArrowLeft: [-1, 0],
  ArrowRight: [1, 0],
  ArrowUp: [0, 1],
  ArrowDown: [0, -1],
}

/** A number from a string (FNV-1a), to seed the small randomnesses below */
const seedOf = (text: string) =>
  [...text].reduce((h, c) => Math.imul(h ^ c.charCodeAt(0), 16777619), 2166136261) >>> 0

export default function Dream() {
  const [state, setState] = useState<State>('awake')
  const [phase, setPhase] = useState<Phase>('falling')
  const [lines, setLines] = useState<Line[]>([])
  const [prompt, setPrompt] = useState<Prompt | null>(null)
  const [holding, setHolding] = useState(false)
  const [summary, setSummary] = useState<Summary | null>(null)
  const [device, setDevice] = useState<Device>('mouse')

  const overlayRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const hazeRef = useRef<HTMLDivElement>(null)
  const fallbackRef = useRef<HTMLDivElement>(null)
  const wakeRef = useRef<HTMLButtonElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const soundRef = useRef<DreamSound | null>(null)
  const directorRef = useRef<Director | null>(null)
  const fullscreenRef = useRef(false)
  const restRef = useRef(0)
  const lineId = useRef(0)

  const fallAsleep = () => {
    window.clearTimeout(restRef.current)
    // Sound has to start inside the click that asks for it
    const sound = soundRef.current ?? new DreamSound()
    soundRef.current = sound
    sound.unlock()
    const root = document.documentElement
    if (root.requestFullscreen && !document.fullscreenElement) {
      fullscreenRef.current = true
      root.requestFullscreen({ navigationUI: 'hide' }).catch(() => {
        fullscreenRef.current = false
      })
    }
    setSummary(null)
    setLines([])
    setPrompt(null)
    setHolding(false)
    setPhase('falling')
    // a phone shows no Esc key and asks you to touch and hold, before its first touch too
    setDevice(window.matchMedia('(pointer: coarse)').matches ? 'touch' : 'mouse')
    setState('asleep')
  }

  // One dream, from closing your eyes to opening them
  useEffect(() => {
    if (state !== 'asleep') return
    const dev = process.env.NODE_ENV !== 'production'
    const query = new URLSearchParams(window.location.search)
    const html = document.documentElement
    const before = {
      htmlOverflow: html.style.overflow,
      bodyOverflow: document.body.style.overflow,
      overscroll: html.style.overscrollBehavior,
    }
    html.style.overflow = 'hidden'
    document.body.style.overflow = 'hidden'
    html.style.overscrollBehavior = 'none'
    overlayRef.current?.focus({ preventScroll: true })

    const leaveFullscreen = () => {
      if (!fullscreenRef.current) return
      fullscreenRef.current = false
      if (document.fullscreenElement) document.exitFullscreen().catch(() => {})
    }

    // Started a moment later, so that React's development double run of effects makes one
    // dream (one WebGL context, one set of sounds) and not two
    let director: Director | null = null
    const begin = window.setTimeout(() => {
      const canvas = canvasRef.current
      if (!canvas) return
      director = new Director({
        canvas,
        haze: hazeRef.current,
        fallback: fallbackRef.current,
        overlay: overlayRef.current,
        sound: soundRef.current,
        reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
        seed: Math.floor(Math.random() * 2 ** 32),
        startAt: dev ? Number(query.get('at')) || undefined : undefined,
        speed: dev ? Number(query.get('speed')) || undefined : undefined,
        events: {
          line: (text, kind) =>
            setLines((shown) => [
              ...shown.slice(-1).map((line) => ({ ...line, out: true })),
              { id: ++lineId.current, text, kind },
            ]),
          prompt: setPrompt,
          holding: setHolding,
          woke: setSummary,
          phase: (next) => {
            setPhase(next)
            if (next === 'opening') {
              // the blink as you wake hides the browser coming out of full screen
              leaveFullscreen()
              setLines([])
            } else if (next === 'done') {
              setState('woke')
              // let the kettle's click and the room fade, then let the audio hardware rest
              restRef.current = window.setTimeout(() => soundRef.current?.pause(), 8000)
            }
          },
        },
      })
      directorRef.current = director
      director.start()
      if (dev) {
        ;(window as unknown as { __dream?: unknown }).__dream = {
          director,
          life: director.life,
          peak: () => soundRef.current?.peak() ?? 0,
        }
      }
    })

    const onVisibility = () => (document.hidden ? director?.pause() : director?.resume())
    // leaving full screen yourself (Esc does that in most browsers) wakes you up
    const onFullscreen = () => {
      if (!document.fullscreenElement && fullscreenRef.current) {
        fullscreenRef.current = false
        director?.wakeUp()
      }
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        director?.wakeUp()
        return
      }
      if (event.key === 'Tab') {
        // one way out, and it is always the next thing Tab reaches
        event.preventDefault()
        wakeRef.current?.focus()
        return
      }
      // the wake-up button keeps its own Space and Enter
      if (event.target instanceof HTMLButtonElement) return
      if (event.key === ' ' || event.key === 'Enter') {
        event.preventDefault()
        if (!event.repeat) {
          setDevice('key')
          director?.press('key')
        }
      } else if (ARROWS[event.key]) {
        event.preventDefault()
        director?.nudge(...ARROWS[event.key])
      }
    }
    const onKeyUp = (event: KeyboardEvent) => {
      if (event.key === ' ' || event.key === 'Enter') director?.release()
    }
    document.addEventListener('visibilitychange', onVisibility)
    document.addEventListener('fullscreenchange', onFullscreen)
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)

    // keep the screen on: nobody touches a phone while they are dreaming
    type Lock = { release: () => Promise<void> }
    type WakeLockNavigator = Navigator & {
      wakeLock?: { request: (type: 'screen') => Promise<Lock> }
    }
    let lock: Lock | null = null
    let released = false
    ;(navigator as WakeLockNavigator).wakeLock
      ?.request('screen')
      .then((sentinel) => {
        if (released) sentinel.release().catch(() => {})
        else lock = sentinel
      })
      .catch(() => {})

    return () => {
      window.clearTimeout(begin)
      director?.destroy()
      directorRef.current = null
      leaveFullscreen()
      document.removeEventListener('visibilitychange', onVisibility)
      document.removeEventListener('fullscreenchange', onFullscreen)
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
      html.style.overflow = before.htmlOverflow
      document.body.style.overflow = before.bodyOverflow
      html.style.overscrollBehavior = before.overscroll
      released = true
      lock?.release().catch(() => {})
    }
  }, [state])

  // Awake again: put the reader where the page has changed
  useEffect(() => {
    if (state === 'woke') headingRef.current?.focus({ preventScroll: true })
  }, [state])

  // The sound is kept between dreams (browsers allow a page only so many audio contexts), and
  // goes with the page
  useEffect(() => {
    const sound = soundRef
    const rest = restRef
    return () => {
      window.clearTimeout(rest.current)
      sound.current?.dispose()
      sound.current = null
    }
  }, [])

  const director = () => directorRef.current

  return (
    <div className="ed-page">
      <section
        className="ed-chapter ed-chapter--first ed-chapter--lead"
        data-chapter="intro"
        data-chapter-color="var(--ed-ink)"
        aria-labelledby="dream-title"
      >
        <div className="ed-shell">
          <div className="ed-chapter-head--page">
            <EdChapterHead
              num="03"
              kicker="Lab · about four minutes"
              title="Forty Winks"
              as="h1"
              id="dream-title"
            >
              <p>
                Put the kettle on, close your eyes and live a whole other life before it boils: a
                different name, people who love you, seventy-odd years in about four minutes. Then
                the kettle whistles, and you have to wake up.
              </p>
            </EdChapterHead>
          </div>

          <div className={styles.panel}>
            {summary ? (
              <Awake summary={summary} headingRef={headingRef} onAgain={fallAsleep} />
            ) : (
              <>
                <div className={styles.actions}>
                  <button
                    type="button"
                    className={cx('ed-pill ed-pill--signal ed-pill--lg', styles.button)}
                    onClick={fallAsleep}
                  >
                    Close your eyes
                  </button>
                  <EdPill href="/lab" variant="outline" size="lg">
                    Back to the lab
                  </EdPill>
                </div>
                <ul className={styles.how}>
                  <li>Sound on, headphones if you have them</li>
                  <li>
                    <span className={styles.fine}>Move</span>
                    <span className={styles.coarse}>Drag</span> to wander
                  </li>
                  <li>Hold to hold on</li>
                  <li>
                    <span className={styles.fine}>Esc</span>
                    <span className={styles.coarse}>The corner button</span> wakes you
                  </li>
                </ul>
              </>
            )}
          </div>

          <div className="ed-notes">
            <EdNote index={1} label="Heads up">
              It fills the screen and plays sound, and every dream is a different life. You can wake
              up whenever you like.
            </EdNote>
          </div>
        </div>
      </section>

      {state === 'asleep' &&
        createPortal(
          <div
            ref={overlayRef}
            className={styles.overlay}
            data-phase={phase}
            role="dialog"
            aria-modal="true"
            aria-label="Forty Winks, a dream"
            tabIndex={-1}
            onPointerDown={(event) => {
              if (event.button > 0) return
              const kind = event.pointerType === 'mouse' ? 'mouse' : 'touch'
              setDevice(kind)
              director()?.pointer(event.clientX, event.clientY)
              director()?.press(kind)
            }}
            onPointerMove={(event) => director()?.pointer(event.clientX, event.clientY)}
            onPointerUp={() => director()?.release()}
            onPointerCancel={() => director()?.release()}
            onPointerLeave={() => director()?.release()}
            onContextMenu={(event) => event.preventDefault()}
          >
            <div ref={hazeRef} className={styles.haze} />
            <div ref={fallbackRef} className={styles.fallback} hidden />
            <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />

            <div className={styles.narration} aria-live="polite">
              {lines.map((line) =>
                line.kind === 'name' ? (
                  <p
                    key={line.id}
                    className={cx(styles.line, styles.name, line.out && styles.lineOut)}
                  >
                    <span className="sr-only">{line.text}</span>
                    <Letters text={line.text} />
                  </p>
                ) : (
                  <Words key={line.id} text={line.text} out={line.out} />
                )
              )}
            </div>

            <div className={styles.promptArea} aria-live="polite">
              {prompt && (
                <div
                  className={styles.prompt}
                  data-holding={holding && prompt.kind === 'hold' ? '' : undefined}
                >
                  <span
                    className={prompt.kind === 'hold' ? styles.ring : styles.dot}
                    aria-hidden="true"
                  />
                  {prompt.kind === 'hold' ? HOLD_TEXT[device] : prompt.text}
                </div>
              )}
            </div>

            <button
              ref={wakeRef}
              type="button"
              className={styles.wake}
              onPointerDown={(event) => event.stopPropagation()}
              onClick={() => director()?.wakeUp()}
            >
              {phase === 'falling' ? 'Open your eyes' : 'Wake up'}
              {device !== 'touch' && <kbd>Esc</kbd>}
            </button>
          </div>,
          document.body
        )}
    </div>
  )
}

/** A line of the dream, arriving a word at a time; it fades by itself after a while */
function Words({ text, out }: { text: string; out?: boolean }) {
  const list = text.split(' ')
  const life = 5 + list.length * 0.45
  return (
    <p
      className={cx(styles.line, out && styles.lineOut)}
      style={{ '--life': `${life.toFixed(2)}s` } as CSSProperties}
    >
      {list.map((word, i) => (
        <span key={i} className={styles.word} style={{ '--i': i } as CSSProperties}>
          {i ? ` ${word}` : word}
        </span>
      ))}
    </p>
  )
}

/** Your name coming apart, letter by letter, as you wake */
function Letters({ text }: { text: string }) {
  const letters = useMemo(() => {
    const random = seeded(seedOf(text))
    return [...text].map((letter, i) => ({
      letter,
      style: {
        '--i': i,
        '--dx': `${((random() - 0.5) * 2.4).toFixed(2)}em`,
        '--dy': `${((random() - 0.7) * 1.6).toFixed(2)}em`,
        '--r': `${((random() - 0.5) * 70).toFixed(1)}deg`,
      } as CSSProperties,
    }))
  }, [text])
  return (
    <span aria-hidden="true">
      {letters.map(({ letter, style }, i) => (
        <span key={i} className={styles.letter} style={style}>
          {letter}
        </span>
      ))}
    </span>
  )
}

interface AwakeProps {
  summary: Summary
  headingRef: Ref<HTMLHeadingElement>
  onAgain: () => void
}

/** Back to normal: how long you were away, and what you remember, which doesn't last */
function Awake({ summary, headingRef, onAgain }: AwakeProps) {
  const seconds = Math.max(1, Math.round(summary.asleepMs / 1000))
  const asleep = `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`
  const age =
    summary.age < 1
      ? 'You were not yet one when the kettle boiled.'
      : `You were ${words(Math.floor(summary.age))} when the kettle boiled.`
  const memory = summary.dreamt ? [...summary.memories, age].join(' ') : ''
  // each word goes at its own moment over the next half minute or so
  const fading = useMemo(() => {
    const random = seeded(seedOf(memory))
    const list = memory.split(' ')
    const delays = list.map(() => 9 + random() * 24)
    return { list, delays, last: Math.max(9, ...delays) + 2.2 }
  }, [memory])

  return (
    <div className={styles.after}>
      <p className={styles.kicker}>Awake · {asleep} asleep</p>
      <h2 ref={headingRef} tabIndex={-1} className={styles.boiled}>
        {summary.dreamt ? 'The kettle’s boiled.' : 'You opened your eyes.'}
      </h2>
      {summary.dreamt ? (
        <div
          className={styles.memoryBox}
          style={{ '--last': `${fading.last.toFixed(2)}s` } as CSSProperties}
        >
          {/* the memory folds away once the last of it has gone */}
          <div className={styles.fold}>
            <p className={styles.memory}>
              {fading.list.map((word, i) => (
                <span
                  key={i}
                  className={styles.forget}
                  style={{ '--forget': `${fading.delays[i].toFixed(2)}s` } as CSSProperties}
                >
                  {i ? ` ${word}` : word}
                </span>
              ))}
            </p>
          </div>
          <p className={styles.gone} aria-hidden="true">
            You had a dream. You can’t remember what it was about.
          </p>
        </div>
      ) : (
        <p className={cx(styles.memory, styles.memoryBox)}>
          You hadn’t quite fallen asleep. The dream will keep.
        </p>
      )}
      <div className={styles.actions}>
        <button
          type="button"
          className={cx('ed-pill ed-pill--signal ed-pill--lg', styles.button)}
          onClick={onAgain}
        >
          {summary.dreamt ? 'Dream another life' : 'Close your eyes'}
        </button>
        <EdPill href="/lab" variant="outline" size="lg">
          Back to the lab
        </EdPill>
      </div>
    </div>
  )
}
