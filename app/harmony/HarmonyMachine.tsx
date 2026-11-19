'use client'

import { useCallback, useEffect, useMemo, useRef, useState, type MutableRefObject } from 'react'
import siteMetadata from '@/data/siteMetadata'
import { cx } from '@/lib/edition/cx'
import {
  beatHz,
  centsOff,
  chordHz,
  DEFAULT_INTERVAL,
  intervalById,
  INTERVALS,
  lissajousPath,
  pendulumHz,
  pendulumLength,
  type Interval,
  type Tuning,
} from './engine/intervals'
import type { Hud, Layers, Machine, MachineState } from './engine/machine'
import styles from './harmony.module.css'

type Status = 'loading' | 'ready' | 'unsupported' | 'failed'

/** A change to the controls; the layers can be changed one at a time */
type Patch = Omit<Partial<MachineState>, 'layers'> & { layers?: Partial<Layers> }

const SPEEDS = [1, 3, 6, 12]

const INITIAL: MachineState = {
  interval: DEFAULT_INTERVAL,
  tuning: 'just',
  layers: { light: true, sand: true, pattern: false },
  drive: 0.4,
  flow: 0.55,
  speed: 3,
  third: true,
  running: true,
  sound: false,
}

const LAYERS: { key: keyof Layers; label: string; hint: string }[] = [
  { key: 'light', label: 'Light', hint: 'The LED’s loops on the photograph' },
  { key: 'sand', label: 'Sand', hint: 'The sand on the plate' },
  {
    key: 'pattern',
    label: 'Plate lines',
    hint: 'Where the plate is still, and how hard it shakes elsewhere',
  },
]

const clock = (seconds: number) => {
  const s = Math.floor(seconds)
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`
}

const metres = (m: number) => `${m.toFixed(2)} m`

/** What the tuning does to this interval, in a sentence or two */
function tuningNote(iv: Interval, tuning: Tuning, third: boolean) {
  if (iv.semitones === 12) {
    return 'The octave is the one interval a piano keeps pure, so the two tunings agree: the chord is steady and the figure holds its shape.'
  }
  if (tuning === 'just') {
    return third
      ? `Pure ${iv.p}:${iv.q}. The harmonics line up, so the chord is steady and the two main pendulums hold their figure. Only the third pendulum turns it.`
      : `Pure ${iv.p}:${iv.q}. The harmonics line up, so the chord is steady and the figure keeps its shape as it shrinks.`
  }
  const cents = centsOff(iv)
  const beat = beatHz(iv, 'equal')
  return `On a piano this ${iv.name.toLowerCase()} is ${Math.abs(cents).toFixed(1)} cents ${cents < 0 ? 'flat' : 'sharp'} of ${iv.p}:${iv.q}. The chord beats ${beat.toFixed(2)} times a second, and the figure drifts at the same rate, 512 times slower.`
}

// ---------------------------------------------------------------------------------- the HUD

interface HudProps {
  sink: MutableRefObject<((h: Hud) => void) | null>
  interval: Interval
  tuning: Tuning
  touched: boolean
  onSwing: () => void
}

/** The camera's readout over the picture, updated ten times a second by the machine */
function Viewfinder({ sink, interval, tuning, touched, onSwing }: HudProps) {
  const [hud, setHud] = useState<Hud | null>(null)
  useEffect(() => {
    sink.current = setHud
    return () => {
      sink.current = null
    }
  }, [sink])

  const [root, upper] = chordHz(interval, tuning)
  const beat = beatHz(interval, tuning)
  const state = !hud
    ? 'READY'
    : hud.holding
      ? 'IN HAND'
      : !hud.running
        ? 'PAUSED'
        : hud.shutter
          ? 'REC'
          : 'SHUTTER CLOSED'

  return (
    <div className={styles.hud} aria-hidden="true">
      <span className={cx(styles.corner, styles.cornerTL)} />
      <span className={cx(styles.corner, styles.cornerTR)} />
      <span className={cx(styles.corner, styles.cornerBL)} />
      <span className={cx(styles.corner, styles.cornerBR)} />
      <div className={cx(styles.read, styles.readTL)}>
        <div className={styles.recRow}>
          <span className={styles.rec} data-state={state === 'REC' ? 'on' : 'off'} />
          {state}
          <span className={styles.time}>{clock(hud?.exposure ?? 0)}</span>
        </div>
        <div className={styles.dim}>
          {hud ? `${Math.round(hud.poured).toLocaleString('en-US')} grains poured` : ' '}
        </div>
      </div>
      <div className={cx(styles.read, styles.readTR)}>
        <div>
          {interval.p}:{interval.q} · {interval.name.toUpperCase()}
        </div>
        <div className={styles.dim}>
          {tuning === 'just' ? 'JUST' : 'EQUAL TEMPERED'}
          {beat > 0.005 ? ` · BEATS ${beat.toFixed(2)} Hz` : ' · NO BEATS'}
        </div>
      </div>
      <div className={cx(styles.read, styles.readBL)}>
        <div>
          PENDULUMS {metres(pendulumLength(root))} · {metres(pendulumLength(upper))}
        </div>
        <div className={styles.dim}>
          {pendulumHz(root).toFixed(3)} Hz · {pendulumHz(upper).toFixed(3)} Hz
        </div>
      </div>
      <div className={cx(styles.read, styles.readBR)}>
        <div>
          PLATE MODE ({interval.p}, {interval.q})
        </div>
        <div className={styles.dim}>
          {interval.notes[0]} {root.toFixed(1)} + {interval.notes[1]} {upper.toFixed(1)} Hz
        </div>
      </div>
      {hud && !hud.shutter && !hud.holding && (
        <button type="button" className={styles.swingCue} onClick={onSwing}>
          The swing has died away · <strong>Swing again</strong>
        </button>
      )}
      {!touched && hud?.shutter && (
        <div className={styles.dragCue}>Grab the funnel and throw it to swing it by hand</div>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------------- the stage

export default function HarmonyMachine({ num }: { num: string }) {
  const viewRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<HTMLElement>(null)
  const machineRef = useRef<Machine | null>(null)
  const hudSink = useRef<((h: Hud) => void) | null>(null)
  const lastHud = useRef<Hud | null>(null)
  const [state, setState] = useState<MachineState>(INITIAL)
  const stateRef = useRef(state)
  stateRef.current = state
  const [status, setStatus] = useState<Status>('loading')
  const [holding, setHolding] = useState(false)
  const [touched, setTouched] = useState(false)
  const [saving, setSaving] = useState(false)

  const interval = intervalById(state.interval)
  const [root, upper] = chordHz(interval, state.tuning)
  const icons = useMemo(() => INTERVALS.map((iv) => lissajousPath(iv, 36, 3)), [])

  const update = useCallback((patch: Patch) => {
    setState((s) => ({ ...s, ...patch, layers: { ...s.layers, ...(patch.layers || {}) } }))
  }, [])

  // Build the machine once the page is in the browser. The canvas is made here rather than in
  // JSX so that a remount (React's development double-mount) never meets a context it lost.
  useEffect(() => {
    const view = viewRef.current
    if (!view) return
    let machine: Machine | null = null
    let observer: ResizeObserver | null = null
    let seen: IntersectionObserver | null = null
    let cancelled = false
    const canvas = document.createElement('canvas')
    canvas.className = styles.canvas
    view.prepend(canvas)

    import('./engine/machine')
      .then(({ Machine }) => {
        if (cancelled) return
        const coarse = window.matchMedia('(pointer: coarse)').matches
        const small = Math.min(window.screen.width, window.screen.height) < 700
        const quality =
          coarse || small
            ? { simSize: 1024, maxGrains: 260_000 }
            : { simSize: 1536, maxGrains: 1_000_000 }
        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        const start = reduce ? { ...stateRef.current, running: false } : stateRef.current
        try {
          machine = new Machine(canvas, start, quality, (h) => {
            lastHud.current = h
            hudSink.current?.(h)
          })
        } catch (e) {
          setStatus(e instanceof Error && e.message === 'unsupported' ? 'unsupported' : 'failed')
          return
        }
        machineRef.current = machine
        if (reduce) {
          // No motion unless asked for: develop a finished photograph instead, and wait
          machine.develop(150)
          update({ running: false })
        }
        const fit = () => {
          const rect = view.getBoundingClientRect()
          machine?.resize(rect.width, rect.height, window.devicePixelRatio)
        }
        fit()
        observer = new ResizeObserver(fit)
        observer.observe(view)
        seen = new IntersectionObserver(([entry]) => machine?.setVisible(entry.isIntersecting))
        seen.observe(view)
        setStatus('ready')
      })
      .catch(() => {
        if (!cancelled) setStatus('failed')
      })

    return () => {
      cancelled = true
      observer?.disconnect()
      seen?.disconnect()
      machine?.destroy()
      machineRef.current = null
      canvas.remove()
    }
  }, [update])

  // Everything the controls change goes straight to the machine
  useEffect(() => {
    machineRef.current?.set(state)
  }, [state, status])

  // Sound only starts after a click or tap, and stops while the tab is hidden
  useEffect(() => {
    const stage = stageRef.current
    if (!stage) return
    const unlock = () => machineRef.current?.audio.unlock()
    const events = ['pointerdown', 'pointerup', 'touchend', 'click', 'keydown'] as const
    events.forEach((name) => stage.addEventListener(name, unlock, { capture: true, passive: true }))
    const onVisibility = () => {
      const audio = machineRef.current?.audio
      if (document.hidden) audio?.sleep()
      else audio?.wake()
    }
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      events.forEach((name) => stage.removeEventListener(name, unlock, { capture: true }))
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [])

  const swing = useCallback(() => {
    machineRef.current?.swing()
    update({ running: true })
  }, [update])

  const sweep = useCallback(() => machineRef.current?.sweep(), [])
  const fresh = useCallback(() => machineRef.current?.newExposure(), [])

  const savePhoto = useCallback(async () => {
    const machine = machineRef.current
    if (!machine || saving) return
    setSaving(true)
    try {
      const s = stateRef.current
      const iv = intervalById(s.interval)
      const font =
        getComputedStyle(document.documentElement)
          .getPropertyValue('--font-jetbrains-mono')
          .trim() || 'ui-monospace'
      const exposure = lastHud.current?.exposure ?? 0
      const [r, u] = chordHz(iv, s.tuning)
      const title = `THE HARMONY MACHINE · ${iv.p}:${iv.q} ${iv.name.toUpperCase()}`
      const detail = `${s.tuning === 'just' ? 'JUST' : 'EQUAL TEMPERED'} · ${iv.notes[0]} ${r.toFixed(0)} + ${iv.notes[1]} ${u.toFixed(0)} Hz · ${clock(exposure)} EXPOSURE`
      const site = `${siteMetadata.siteUrl.replace(/^https?:\/\//, '')}/harmony`
      const blob = await machine.photo(title, detail, site, `${font}, ui-monospace, monospace`)
      if (!blob) return
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `harmony-machine-${iv.p}-${iv.q}-${iv.id}.jpg`
      document.body.appendChild(a)
      a.click()
      a.remove()
      setTimeout(() => URL.revokeObjectURL(url), 5000)
    } finally {
      setSaving(false)
    }
  }, [saving])

  // Keys: 1–6 intervals, T tuning, Space pause, R swing, S sweep, N new exposure, M sound
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return
      const target = e.target as HTMLElement | null
      if (target && /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)) return
      if (target?.isContentEditable) return
      const stage = stageRef.current
      if (!stage) return
      const rect = stage.getBoundingClientRect()
      if (rect.bottom < 80 || rect.top > window.innerHeight - 80) return
      const n = Number(e.key)
      if (n >= 1 && n <= INTERVALS.length) {
        update({ interval: INTERVALS[n - 1].id })
        return
      }
      switch (e.key.toLowerCase()) {
        case 't':
          update({ tuning: stateRef.current.tuning === 'just' ? 'equal' : 'just' })
          break
        case ' ':
          if (target && target.closest('button, a')) return
          e.preventDefault()
          update({ running: !stateRef.current.running })
          break
        case 'r':
          swing()
          break
        case 's':
          sweep()
          break
        case 'n':
          fresh()
          break
        case 'm':
          update({ sound: !stateRef.current.sound })
          break
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [update, swing, sweep, fresh])

  // The hand on the funnel
  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const machine = machineRef.current
    if (!machine || status !== 'ready' || e.button !== 0) return
    if ((e.target as HTMLElement).closest('button')) return
    e.currentTarget.setPointerCapture(e.pointerId)
    machine.grab(e.clientX, e.clientY)
    if (!stateRef.current.running) update({ running: true })
    setHolding(true)
    setTouched(true)
  }
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (holding) machineRef.current?.drag(e.clientX, e.clientY)
  }
  const onPointerUp = () => {
    if (!holding) return
    machineRef.current?.letGo()
    setHolding(false)
  }

  const label = `The harmony machine from above: a ${interval.name.toLowerCase()} (${interval.p}:${interval.q}) drawn by pendulums as glowing loops of light over sand, which a plate vibrating in its (${interval.p}, ${interval.q}) mode shakes onto its own lines.`

  return (
    <section
      ref={stageRef}
      className={styles.stage}
      data-chapter="intro"
      data-chapter-color="var(--ed-ink)"
      aria-labelledby="harmony-title"
    >
      <div className={styles.frame}>
        <header className={styles.head}>
          <p className={styles.kicker}>
            <span className="ed-num">{num}</span> Lab experiment
          </p>
          <h1 id="harmony-title" className={styles.title}>
            The <em>Harmony</em> Machine
          </h1>
          <p className={styles.lede}>
            Pendulums swing a funnel of sand with an LED on it over a steel plate that a speaker
            sets ringing. Pick an interval: the light, the sand, the plate’s lines and the chord all
            show the same ratio.
          </p>
          <div className={styles.headActions}>
            <button
              type="button"
              className={cx(styles.sound, state.sound && styles.soundOn)}
              aria-pressed={state.sound}
              onClick={() => update({ sound: !state.sound })}
            >
              <span className={styles.bars} aria-hidden="true">
                <i />
                <i />
                <i />
              </span>
              {state.sound ? 'Sound on' : 'Hear the chord'}
            </button>
            <button
              type="button"
              className={styles.ghost}
              onClick={savePhoto}
              disabled={status !== 'ready' || saving}
            >
              {saving ? 'Developing…' : 'Save the photograph'}
            </button>
          </div>
        </header>

        <div
          ref={viewRef}
          className={cx(styles.view, holding && styles.holding)}
          role="img"
          aria-label={label}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          onLostPointerCapture={onPointerUp}
        >
          {status === 'ready' && (
            <Viewfinder
              sink={hudSink}
              interval={interval}
              tuning={state.tuning}
              touched={touched}
              onSwing={swing}
            />
          )}
          {status !== 'ready' && (
            <div className={styles.loader}>
              <svg viewBox="0 0 36 36" className={styles.loaderMark} aria-hidden="true">
                <path d={icons[1]} pathLength={1} />
              </svg>
              <p>
                {status === 'unsupported'
                  ? 'This experiment needs WebGL 2, which this browser doesn’t offer.'
                  : status === 'failed'
                    ? 'The machine didn’t start. Reload the page to try again.'
                    : 'Hanging the pendulums…'}
              </p>
            </div>
          )}
        </div>

        <div className={styles.controls}>
          <fieldset className={styles.group}>
            <legend className={styles.legend}>Interval</legend>
            <div className={styles.intervals}>
              {INTERVALS.map((iv, i) => {
                const on = iv.id === state.interval
                return (
                  <button
                    key={iv.id}
                    type="button"
                    className={cx(styles.interval, on && styles.intervalOn)}
                    style={{ '--c': iv.colors[0], '--c2': iv.colors[1] } as React.CSSProperties}
                    aria-pressed={on}
                    onClick={() => update({ interval: iv.id })}
                  >
                    <svg viewBox="0 0 36 36" aria-hidden="true">
                      <path d={icons[i]} />
                    </svg>
                    <span className={styles.ratio}>
                      {iv.p}:{iv.q}
                    </span>
                    <span className={styles.ivName}>{iv.name}</span>
                    <kbd className={styles.key} aria-hidden="true">
                      {i + 1}
                    </kbd>
                  </button>
                )
              })}
            </div>
            <p className={styles.readout}>
              <span>
                {interval.notes[0]} + {interval.notes[1]}
              </span>
              <span>
                {root.toFixed(1)} + {upper.toFixed(1)} Hz
              </span>
              <span>
                {metres(pendulumLength(root))} · {metres(pendulumLength(upper))} pendulums
              </span>
            </p>
          </fieldset>

          <fieldset className={styles.group}>
            <legend className={styles.legend}>Tuning</legend>
            <div className={styles.segmented} role="group" aria-label="Tuning">
              {(['just', 'equal'] as Tuning[]).map((t) => (
                <button
                  key={t}
                  type="button"
                  aria-pressed={state.tuning === t}
                  onClick={() => update({ tuning: t })}
                >
                  {t === 'just' ? 'Just (pure)' : 'Equal (piano)'}
                </button>
              ))}
            </div>
            <p className={styles.note}>{tuningNote(interval, state.tuning, state.third)}</p>
          </fieldset>

          <fieldset className={styles.group}>
            <legend className={styles.legend}>The machine</legend>
            <label className={styles.slider}>
              <span className={styles.sliderHead}>
                <span>Plate tone</span>
                <output>{state.drive < 0.02 ? 'off' : `${Math.round(state.drive * 100)}%`}</output>
              </span>
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={state.drive}
                onChange={(e) => update({ drive: Number(e.target.value) })}
              />
              <span className={styles.sliderHint}>
                How hard the speaker drives the plate. Too gentle and the sand stays where it fell.
              </span>
            </label>
            <label className={styles.slider}>
              <span className={styles.sliderHead}>
                <span>Sand flow</span>
                <output>{state.flow < 0.02 ? 'closed' : `${Math.round(state.flow * 100)}%`}</output>
              </span>
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={state.flow}
                onChange={(e) => update({ flow: Number(e.target.value) })}
              />
              <span className={styles.sliderHint}>
                How fast the funnel pours. Close it to draw in light alone.
              </span>
            </label>
            <div className={styles.row}>
              <span className={styles.rowLabel}>Time-lapse</span>
              <div className={styles.segmented} role="group" aria-label="Time-lapse">
                {SPEEDS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    aria-pressed={state.speed === s}
                    onClick={() => update({ speed: s })}
                  >
                    {s}×
                  </button>
                ))}
              </div>
            </div>
            <div className={styles.row}>
              <span className={styles.rowLabel}>Third pendulum</span>
              <div className={styles.segmented} role="group" aria-label="Third pendulum">
                {[true, false].map((on) => (
                  <button
                    key={String(on)}
                    type="button"
                    aria-pressed={state.third === on}
                    onClick={() => update({ third: on })}
                  >
                    {on ? 'On' : 'Off'}
                  </button>
                ))}
              </div>
            </div>
          </fieldset>

          <fieldset className={styles.group}>
            <legend className={styles.legend}>Layers</legend>
            <div className={styles.toggles}>
              {LAYERS.map((l) => (
                <button
                  key={l.key}
                  type="button"
                  className={styles.toggle}
                  aria-pressed={state.layers[l.key]}
                  title={l.hint}
                  onClick={() => update({ layers: { [l.key]: !state.layers[l.key] } })}
                >
                  <span className={styles.dot} aria-hidden="true" />
                  {l.label}
                </button>
              ))}
            </div>
          </fieldset>

          <div className={styles.actions}>
            <button type="button" className={styles.action} onClick={swing}>
              Swing again
            </button>
            <button
              type="button"
              className={styles.action}
              onClick={() => update({ running: !state.running })}
            >
              {state.running ? 'Pause' : 'Play'}
            </button>
            <button type="button" className={styles.action} onClick={sweep}>
              Sweep the plate
            </button>
            <button type="button" className={styles.action} onClick={fresh}>
              New exposure
            </button>
          </div>
          <p className={styles.keys} aria-hidden="true">
            Keys: <kbd>1</kbd>–<kbd>6</kbd> interval · <kbd>T</kbd> tuning · <kbd>Space</kbd> pause
            · <kbd>R</kbd> swing · <kbd>S</kbd> sweep · <kbd>N</kbd> new exposure · <kbd>M</kbd>{' '}
            sound
          </p>
        </div>
      </div>
    </section>
  )
}
