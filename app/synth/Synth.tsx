'use client'

import { useCallback, useEffect, useId, useRef, useState } from 'react'
import Link from 'next/link'
import { cx } from '@/lib/edition/cx'
import { SynthEngine, cutoffHz, type Patch, type Wave } from './engine'
import Scope from './Scope'
import styles from './synth.module.css'

const POST_HREF = '/blog/pocket-synth-web-audio'

const WAVES: { id: Wave; label: string; path: string }[] = [
  { id: 'sine', label: 'Sine', path: 'M1 8 C 5 -2, 9 -2, 13 8 S 21 18, 25 8' },
  { id: 'triangle', label: 'Triangle', path: 'M1 8 L7 2 L19 14 L25 8' },
  { id: 'sawtooth', label: 'Saw', path: 'M1 14 L13 2 L13 14 L25 2 L25 14' },
  { id: 'square', label: 'Square', path: 'M1 14 L1 2 L13 2 L13 14 L25 14 L25 2' },
]

type Sound = Omit<Patch, 'volume'>

const PRESETS: { name: string; sound: Sound }[] = [
  {
    name: 'Pluck',
    sound: {
      wave: 'sawtooth',
      cutoff: 0.55,
      resonance: 4,
      attack: 0.005,
      decay: 0.25,
      sustain: 0.15,
      release: 0.3,
      echo: 0.3,
    },
  },
  {
    name: 'Pad',
    sound: {
      wave: 'sawtooth',
      cutoff: 0.45,
      resonance: 1,
      attack: 0.6,
      decay: 0.8,
      sustain: 0.8,
      release: 1.6,
      echo: 0.35,
    },
  },
  {
    name: 'Bass',
    sound: {
      wave: 'square',
      cutoff: 0.35,
      resonance: 6,
      attack: 0.005,
      decay: 0.2,
      sustain: 0.6,
      release: 0.12,
      echo: 0,
    },
  },
  {
    name: 'Lead',
    sound: {
      wave: 'square',
      cutoff: 0.7,
      resonance: 2,
      attack: 0.02,
      decay: 0.1,
      sustain: 0.9,
      release: 0.25,
      echo: 0.25,
    },
  },
]

const INITIAL: Patch = { ...PRESETS[0].sound, volume: 0.7 }

// Two rows of the computer keyboard laid out like a piano: the home row is the white keys,
// the row above is the black ones. Matched on the physical key (event.code), so it is the
// same shape on any keyboard layout.
const KEY_ROW: [code: string, label: string][] = [
  ['KeyA', 'A'],
  ['KeyW', 'W'],
  ['KeyS', 'S'],
  ['KeyE', 'E'],
  ['KeyD', 'D'],
  ['KeyF', 'F'],
  ['KeyT', 'T'],
  ['KeyG', 'G'],
  ['KeyY', 'Y'],
  ['KeyH', 'H'],
  ['KeyU', 'U'],
  ['KeyJ', 'J'],
  ['KeyK', 'K'],
  ['KeyO', 'O'],
  ['KeyL', 'L'],
  ['KeyP', 'P'],
  ['Semicolon', ';'],
  ['Quote', "'"],
]
const CODE_TO_STEP = new Map(KEY_ROW.map(([code], step) => [code, step]))

const NOTE_NAMES = ['C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B']
const isBlack = (step: number) => [1, 3, 6, 8, 10].includes(step % 12)
const noteName = (midi: number) => `${NOTE_NAMES[midi % 12]}${Math.floor(midi / 12) - 1}`

const MIN_OCTAVE = 1
const MAX_OCTAVE = 6
// Below this width two octaves of keys are too narrow for a thumb, so the keyboard shows one.
const WIDE = '(min-width: 720px)'

const ms = (seconds: number) =>
  seconds < 1 ? `${Math.round(seconds * 1000)} ms` : `${seconds.toFixed(2)} s`
const hz = (value: number) =>
  value < 1000 ? `${Math.round(value)} Hz` : `${(value / 1000).toFixed(1)} kHz`
const pct = (value: number) => `${Math.round(value * 100)}%`

interface SliderProps {
  label: string
  value: number
  min: number
  max: number
  step: number
  display: string
  onChange: (value: number) => void
}

function Slider({ label, value, min, max, step, display, onChange }: SliderProps) {
  const id = useId()
  return (
    <div className={styles.slider}>
      <label htmlFor={id} className={styles.sliderHead}>
        <span>{label}</span>
        <span className={styles.sliderValue}>{display}</span>
      </label>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        aria-label={label}
        aria-valuetext={display}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ '--fill': `${((value - min) / (max - min)) * 100}%` } as React.CSSProperties}
      />
    </div>
  )
}

export default function Synth() {
  const [patch, setPatch] = useState<Patch>(INITIAL)
  const [octave, setOctave] = useState(3)
  const [wide, setWide] = useState(true)
  const [held, setHeld] = useState<ReadonlySet<number>>(new Set())

  const engineRef = useRef<SynthEngine | null>(null)
  if (!engineRef.current) engineRef.current = new SynthEngine(INITIAL)
  const engine = engineRef.current

  // What is holding each note down: a finger ("p<pointerId>") or a key ("k<code>"). A note
  // sounds while at least one of them is on it, so a key and a finger on the same note don't
  // cut each other off.
  const sources = useRef(new Map<string, number>())
  const octaveRef = useRef(octave)
  octaveRef.current = octave

  useEffect(() => {
    engine.setPatch(patch)
  }, [engine, patch])

  useEffect(() => {
    const query = window.matchMedia(WIDE)
    const update = () => setWide(query.matches)
    update()
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])

  const press = useCallback(
    (source: string, midi: number) => {
      const map = sources.current
      if (map.get(source) === midi) return
      const previous = map.get(source)
      const alreadySounding = [...map.values()].includes(midi)
      map.set(source, midi)
      if (!alreadySounding) engine.noteOn(midi)
      if (previous !== undefined && ![...map.values()].includes(previous)) engine.noteOff(previous)
      setHeld(new Set(map.values()))
    },
    [engine]
  )

  const release = useCallback(
    (source: string) => {
      const map = sources.current
      const midi = map.get(source)
      if (midi === undefined) return
      map.delete(source)
      if (![...map.values()].includes(midi)) engine.noteOff(midi)
      setHeld(new Set(map.values()))
    },
    [engine]
  )

  const releaseAll = useCallback(() => {
    sources.current.clear()
    engine.allNotesOff()
    setHeld(new Set())
  }, [engine])

  const shiftOctave = useCallback((by: number) => {
    setOctave((o) => Math.min(MAX_OCTAVE, Math.max(MIN_OCTAVE, o + by)))
  }, [])

  // Computer keyboard
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.repeat || e.metaKey || e.ctrlKey || e.altKey) return
      const target = e.target as HTMLElement | null
      if (target?.closest('input:not([type="range"]), textarea, select, [contenteditable]')) return

      if (e.code === 'KeyZ') return shiftOctave(-1)
      if (e.code === 'KeyX') return shiftOctave(1)

      const step = CODE_TO_STEP.get(e.code)
      if (step === undefined) return
      e.preventDefault() // ' opens quick find in Firefox
      press(`k${e.code}`, (octaveRef.current + 1) * 12 + step)
    }
    const up = (e: KeyboardEvent) => release(`k${e.code}`)
    // A key released while the tab is in the background never sends keyup: stop everything
    // rather than leave a note ringing.
    const hidden = () => document.hidden && releaseAll()

    window.addEventListener('keydown', down)
    window.addEventListener('keyup', up)
    window.addEventListener('blur', releaseAll)
    document.addEventListener('visibilitychange', hidden)
    return () => {
      window.removeEventListener('keydown', down)
      window.removeEventListener('keyup', up)
      window.removeEventListener('blur', releaseAll)
      document.removeEventListener('visibilitychange', hidden)
    }
  }, [press, release, releaseAll, shiftOctave])

  useEffect(() => () => engine.dispose(), [engine])

  // Mouse and touch. The keyboard element captures the pointer, so a drag that leaves it
  // still ends the note, and sliding across keys plays each one in turn.
  const midiAt = (x: number, y: number) => {
    const key = document.elementFromPoint(x, y)?.closest<HTMLElement>('[data-midi]')
    return key ? Number(key.dataset.midi) : undefined
  }
  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return
    const midi = midiAt(e.clientX, e.clientY)
    if (midi === undefined) return
    e.preventDefault()
    e.currentTarget.setPointerCapture(e.pointerId)
    press(`p${e.pointerId}`, midi)
  }
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const source = `p${e.pointerId}`
    if (!sources.current.has(source)) return
    const midi = midiAt(e.clientX, e.clientY)
    if (midi !== undefined) press(source, midi)
  }
  const onPointerEnd = (e: React.PointerEvent<HTMLDivElement>) => release(`p${e.pointerId}`)

  const set = <K extends keyof Patch>(key: K, value: Patch[K]) =>
    setPatch((p) => ({ ...p, [key]: value }))

  const activePreset = PRESETS.find(({ sound }) =>
    (Object.keys(sound) as (keyof Sound)[]).every((key) => sound[key] === patch[key])
  )?.name

  // Keys on screen: C to C, one octave on a phone and two on anything wider
  const base = (octave + 1) * 12
  const steps = Array.from({ length: wide ? 25 : 13 }, (_, step) => step)
  const whites = steps.filter((step) => !isBlack(step))
  const whiteWidth = 100 / whites.length

  return (
    <div className={styles.synth}>
      <header className={styles.head}>
        <div>
          <p className={styles.kicker}>Web Audio · no libraries</p>
          <h1 className={styles.title}>
            Pocket <em>Synth</em>
          </h1>
        </div>
        <Link href={POST_HREF} className="ed-pill ed-pill--outline">
          How it works
          <span className="ed-pill__arrow" aria-hidden="true">
            →
          </span>
        </Link>
      </header>

      <div className={styles.body}>
        <div className={styles.top}>
          <Scope engine={engine} />

          <div className={styles.presets} role="group" aria-label="Presets">
            <span className={styles.label}>Preset</span>
            {PRESETS.map(({ name, sound }) => (
              <button
                key={name}
                type="button"
                className={styles.chip}
                aria-pressed={activePreset === name}
                onClick={() => setPatch((p) => ({ ...sound, volume: p.volume }))}
              >
                {name}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.panels}>
          <section className={styles.panel} aria-label="Oscillator">
            <h2 className={styles.label}>Oscillator</h2>
            <div className={styles.waves} role="group" aria-label="Waveform">
              {WAVES.map((wave) => (
                <button
                  key={wave.id}
                  type="button"
                  className={styles.wave}
                  aria-pressed={patch.wave === wave.id}
                  onClick={() => set('wave', wave.id)}
                >
                  <svg viewBox="0 0 26 16" aria-hidden="true">
                    <path d={wave.path} />
                  </svg>
                  {wave.label}
                </button>
              ))}
            </div>
          </section>

          <section className={styles.panel} aria-label="Filter">
            <h2 className={styles.label}>Filter</h2>
            <Slider
              label="Cutoff"
              value={patch.cutoff}
              min={0}
              max={1}
              step={0.005}
              display={hz(cutoffHz(patch.cutoff))}
              onChange={(v) => set('cutoff', v)}
            />
            <Slider
              label="Resonance"
              value={patch.resonance}
              min={0.1}
              max={18}
              step={0.1}
              display={patch.resonance.toFixed(1)}
              onChange={(v) => set('resonance', v)}
            />
          </section>

          <section className={cx(styles.panel, styles.envelope)} aria-label="Envelope">
            <h2 className={styles.label}>Envelope</h2>
            <Slider
              label="Attack"
              value={patch.attack}
              min={0.005}
              max={2}
              step={0.005}
              display={ms(patch.attack)}
              onChange={(v) => set('attack', v)}
            />
            <Slider
              label="Decay"
              value={patch.decay}
              min={0.01}
              max={2}
              step={0.01}
              display={ms(patch.decay)}
              onChange={(v) => set('decay', v)}
            />
            <Slider
              label="Sustain"
              value={patch.sustain}
              min={0}
              max={1}
              step={0.01}
              display={pct(patch.sustain)}
              onChange={(v) => set('sustain', v)}
            />
            <Slider
              label="Release"
              value={patch.release}
              min={0.02}
              max={4}
              step={0.01}
              display={ms(patch.release)}
              onChange={(v) => set('release', v)}
            />
          </section>

          <section className={styles.panel} aria-label="Output">
            <h2 className={styles.label}>Output</h2>
            <Slider
              label="Echo"
              value={patch.echo}
              min={0}
              max={0.8}
              step={0.01}
              display={pct(patch.echo)}
              onChange={(v) => set('echo', v)}
            />
            <Slider
              label="Volume"
              value={patch.volume}
              min={0}
              max={1}
              step={0.01}
              display={pct(patch.volume)}
              onChange={(v) => set('volume', v)}
            />
          </section>
        </div>

        <div className={styles.keysBar}>
          <div className={styles.octave} role="group" aria-label="Octave">
            <button
              type="button"
              className={styles.chip}
              onClick={() => shiftOctave(-1)}
              disabled={octave <= MIN_OCTAVE}
              aria-label="Octave down"
            >
              −
            </button>
            <span className={styles.octaveValue} aria-live="polite">
              Octave {octave}
            </span>
            <button
              type="button"
              className={styles.chip}
              onClick={() => shiftOctave(1)}
              disabled={octave >= MAX_OCTAVE}
              aria-label="Octave up"
            >
              +
            </button>
          </div>
          <p className={styles.hint}>
            Play with the mouse, a finger or the keys <kbd>A</kbd>–<kbd>&apos;</kbd>. <kbd>Z</kbd>{' '}
            and <kbd>X</kbd> change octave.
          </p>
        </div>

        {/* The keys are a picture of what the pointer and the computer keyboard play; they are
            not tab stops, since Tab-then-Enter is no way to play a tune. Keyboard users play
            on the letter keys, as the hint above says. */}
        <div
          className={styles.keys}
          role="group"
          aria-label="Piano keyboard"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerEnd}
          onPointerCancel={onPointerEnd}
          onLostPointerCapture={onPointerEnd}
          onContextMenu={(e) => e.preventDefault()}
        >
          {steps.map((step) => {
            const midi = base + step
            const black = isBlack(step)
            const whitesBefore = steps.filter((s) => s < step && !isBlack(s)).length
            const hotkey = KEY_ROW[step]?.[1]
            return (
              <div
                key={step}
                data-midi={midi}
                data-held={held.has(midi) || undefined}
                className={cx(styles.key, black ? styles.black : styles.white)}
                style={
                  black
                    ? { left: `${whitesBefore * whiteWidth}%`, width: `${whiteWidth * 0.62}%` }
                    : { width: `${whiteWidth}%` }
                }
              >
                <span className={styles.keyLabel}>
                  {hotkey && <span className={styles.hotkey}>{hotkey}</span>}
                  {step % 12 === 0 && <span>{noteName(midi)}</span>}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
