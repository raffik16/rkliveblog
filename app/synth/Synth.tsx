'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { cx } from '@/lib/edition/cx'
import { STEPS, SynthEngine, type ArpMode, type Pattern } from './engine'
import Knob from './Knob'
import Screen, { type ScreenState } from './Screen'
import {
  INITIAL,
  INITIAL_PATTERN,
  KNOBS_LEFT,
  KNOBS_RIGHT,
  PRESETS,
  WAVES,
  fromPosition,
  noteName,
  toPosition,
  type KnobDef,
  type Settings,
  type Sound,
} from './params'
import styles from './synth.module.css'

const POST_HREF = '/blog/pocket-synth-web-audio'

// Two rows of the computer keyboard laid out like a piano: the home row is the lower pads,
// the row above is the upper ones. Matched on the physical key (event.code), so it is the
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

const isUpper = (step: number) => [1, 3, 6, 8, 10].includes(step % 12)

const MIN_OCTAVE = 1
const MAX_OCTAVE = 6
// Below this width two octaves of pads are too narrow for a thumb, so the keyboard shows one.
const WIDE = '(min-width: 720px)'
// A phone, upright or on its side: the screen uses its shorter layout
const SMALL = '(max-width: 719.98px), (max-height: 520px)'

const ARP_MODES: { id: ArpMode; label: string }[] = [
  { id: 'up', label: 'Up' },
  { id: 'down', label: 'Down' },
  { id: 'updown', label: 'Up-Dn' },
  { id: 'random', label: 'Rand' },
]

// The body comes in the six colours of the site's palette
const COLOURS = ['violet', 'cobalt', 'raspberry', 'ember', 'forest', 'ink'] as const
type Colour = (typeof COLOURS)[number]
const COLOUR_KEY = 'pocket-synth-colour'

// On a phone the controls don't all fit under the screen, so they are split into three pages
// and one is shown at a time. Wider screens show everything and never see the tabs.
const TABS = [
  { id: 'seq', label: 'Seq' },
  { id: 'tone', label: 'Tone' },
  { id: 'shape', label: 'Shape' },
] as const
type Tab = (typeof TABS)[number]['id']

export default function Synth() {
  const [settings, setSettings] = useState<Settings>(INITIAL)
  const [pattern, setPattern] = useState<Pattern>(INITIAL_PATTERN)
  const [playing, setPlaying] = useState(false)
  const [recording, setRecording] = useState(false)
  const [cursor, setCursor] = useState(0)
  const [arp, setArp] = useState(false)
  const [arpMode, setArpMode] = useState<ArpMode>('up')
  const [hold, setHold] = useState(false)
  const [octave, setOctave] = useState(3)
  const [wide, setWide] = useState(true)
  const [small, setSmall] = useState(false)
  const [colour, setColour] = useState<Colour>('violet')
  const [tab, setTab] = useState<Tab>('seq')
  const [held, setHeld] = useState<ReadonlySet<number>>(new Set())

  const engineRef = useRef<SynthEngine | null>(null)
  if (!engineRef.current) engineRef.current = new SynthEngine(INITIAL, INITIAL)
  const engine = engineRef.current

  const deviceRef = useRef<HTMLDivElement>(null)
  const playRef = useRef<HTMLButtonElement>(null)

  // What is holding each note down: a finger ("p<pointerId>") or a key ("k<code>"). A note
  // sounds while at least one of them is on it, so a key and a finger on the same note don't
  // cut each other off.
  const sources = useRef(new Map<string, number>())
  // With HOLD on, the notes the arpeggiator keeps cycling after the keys are let go
  const latch = useRef(new Set<number>())
  const lastNote = useRef(60)
  const focus = useRef<ScreenState['focus']>(null)

  // Event handlers registered once (keyboard, pointer) read the latest values from here
  const live = useRef({ octave, playing, recording, cursor, arp, hold })
  live.current = { octave, playing, recording, cursor, arp, hold }

  const preset = PRESETS.find(({ sound }) =>
    (Object.keys(sound) as (keyof Sound)[]).every((key) => sound[key] === settings[key])
  )?.name

  const screenState = useRef<ScreenState>(null!)
  screenState.current = {
    settings,
    pattern,
    preset,
    playing,
    recording,
    cursor,
    arp,
    arpMode,
    focus: focus.current,
  }

  useEffect(() => {
    engine.setPatch(settings)
    engine.setTransport(settings)
  }, [engine, settings])

  useEffect(() => engine.setPattern(pattern), [engine, pattern])
  useEffect(() => engine.setArp(arp, arpMode), [engine, arp, arpMode])
  useEffect(() => () => engine.dispose(), [engine])

  useEffect(() => {
    const wideQuery = window.matchMedia(WIDE)
    const smallQuery = window.matchMedia(SMALL)
    const update = () => {
      setWide(wideQuery.matches)
      setSmall(smallQuery.matches)
    }
    update()
    wideQuery.addEventListener('change', update)
    smallQuery.addEventListener('change', update)
    return () => {
      wideQuery.removeEventListener('change', update)
      smallQuery.removeEventListener('change', update)
    }
  }, [])

  useEffect(() => {
    try {
      const saved = localStorage.getItem(COLOUR_KEY) as Colour | null
      if (saved && COLOURS.includes(saved)) setColour(saved)
    } catch {
      // Storage is blocked: the default colour is fine
    }
  }, [])

  const pickColour = (next: Colour) => {
    setColour(next)
    try {
      localStorage.setItem(COLOUR_KEY, next)
    } catch {
      // Not remembered, still applied
    }
  }

  // Lights. A sequenced note is scheduled a moment before it sounds, so React state would
  // light its pad early. Each frame asks the engine what is sounding on the audio clock
  // right now and switches the lights on the elements directly.
  useEffect(() => {
    let frame = 0
    const loop = () => {
      frame = requestAnimationFrame(loop)
      const device = deviceRef.current
      if (!device) return
      const lit = engine.litNotes()
      if (!live.current.arp) for (const midi of sources.current.values()) lit.add(midi)
      const step = engine.currentStep()
      device
        .querySelectorAll<HTMLElement>('[data-midi]')
        .forEach((pad) => pad.toggleAttribute('data-lit', lit.has(Number(pad.dataset.midi))))
      device
        .querySelectorAll<HTMLElement>('[data-step]')
        .forEach((el) => el.toggleAttribute('data-now', Number(el.dataset.step) === step))
      playRef.current?.toggleAttribute('data-beat', step >= 0 && step % 4 === 0)
    }
    loop()
    return () => cancelAnimationFrame(frame)
  }, [engine])

  // ----------------------------------------------------------------------------- playing
  const arpNotes = () =>
    live.current.hold ? [...latch.current] : [...new Set(sources.current.values())]

  // REC while the pattern runs: the note lands on the nearest step. REC while stopped: it
  // lands on the cursor, which moves on one step.
  const record = useCallback(
    (midi: number) => {
      const { recording, playing, cursor } = live.current
      if (!recording) return
      const at = playing ? engine.nearestStep() : cursor
      if (at < 0) return
      setPattern((p) => p.map((note, i) => (i === at ? midi : note)))
      if (!playing) setCursor((cursor + 1) % STEPS)
    },
    [engine]
  )

  const press = useCallback(
    (source: string, midi: number) => {
      const map = sources.current
      const previous = map.get(source)
      if (previous === midi) return
      const nothingHeld = map.size === 0
      const alreadySounding = [...map.values()].includes(midi)
      map.set(source, midi)
      lastNote.current = midi

      if (live.current.arp) {
        // The first key of a new chord replaces what HOLD was keeping
        if (live.current.hold && nothingHeld) latch.current.clear()
        latch.current.add(midi)
        engine.setArpNotes(arpNotes())
      } else {
        if (!alreadySounding) engine.noteOn(midi)
        if (previous !== undefined && ![...map.values()].includes(previous)) {
          engine.noteOff(previous)
        }
      }
      record(midi)
      setHeld(new Set(map.values()))
    },
    [engine, record]
  )

  const release = useCallback(
    (source: string) => {
      const map = sources.current
      const midi = map.get(source)
      if (midi === undefined) return
      map.delete(source)
      if (live.current.arp) engine.setArpNotes(arpNotes())
      else if (![...map.values()].includes(midi)) engine.noteOff(midi)
      setHeld(new Set(map.values()))
    },
    [engine]
  )

  const releaseAll = useCallback(() => {
    sources.current.clear()
    latch.current.clear()
    engine.allNotesOff()
    engine.setArpNotes([])
    setHeld(new Set())
  }, [engine])

  const togglePlay = useCallback(() => {
    if (live.current.playing) engine.stop()
    else engine.play()
    setPlaying(!live.current.playing)
  }, [engine])

  const shiftOctave = useCallback((by: number) => {
    setOctave((o) => Math.min(MAX_OCTAVE, Math.max(MIN_OCTAVE, o + by)))
  }, [])

  // Computer keyboard
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.repeat || e.metaKey || e.ctrlKey || e.altKey) return
      const target = e.target as HTMLElement | null
      if (target?.closest('input, textarea, select, [contenteditable]')) return

      if (e.code === 'Space') {
        // On a focused button or knob, Space already means "press this"
        if (target?.closest('button, a, [role="slider"]')) return
        e.preventDefault()
        return togglePlay()
      }
      if (e.code === 'KeyZ') return shiftOctave(-1)
      if (e.code === 'KeyX') return shiftOctave(1)

      const step = CODE_TO_STEP.get(e.code)
      if (step === undefined) return
      e.preventDefault() // ' opens quick find in Firefox
      press(`k${e.code}`, (live.current.octave + 1) * 12 + step)
    }
    const up = (e: KeyboardEvent) => release(`k${e.code}`)
    // A key released while the tab is in the background never sends keyup, and a background
    // tab's timers are too slow to keep a pattern in time: stop everything.
    const halt = () => {
      releaseAll()
      engine.stop()
      setPlaying(false)
    }
    const hidden = () => document.hidden && halt()

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
  }, [engine, press, release, releaseAll, shiftOctave, togglePlay])

  // Mouse and touch. The pad area captures the pointer, so a drag that leaves it still ends
  // the note, and sliding across pads plays each one in turn.
  const midiAt = (x: number, y: number) => {
    const pad = document.elementFromPoint(x, y)?.closest<HTMLElement>('[data-midi]')
    return pad ? Number(pad.dataset.midi) : undefined
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

  // ---------------------------------------------------------------------------- controls
  const show = (key: NonNullable<ScreenState['focus']>['key']) => {
    focus.current = { key, at: performance.now() }
  }

  const turn = (def: KnobDef, position: number) => {
    show(def.key)
    setSettings((s) => ({ ...s, [def.key]: fromPosition(def, position) }))
  }

  const toggleStep = (index: number) => {
    const filled = pattern[index] !== null
    if (!filled && !playing) engine.preview(lastNote.current)
    setPattern((p) => p.map((note, i) => (i === index ? (filled ? null : lastNote.current) : note)))
    setCursor((index + 1) % STEPS)
  }

  // ARP changes what a held key means, so nothing is left held across the switch
  const toggleArp = () => {
    releaseAll()
    setArp(!arp)
  }
  const toggleHold = () => {
    releaseAll()
    setHold(!hold)
  }

  const knobs = (defs: KnobDef[]) =>
    defs.map((def) => (
      <Knob
        key={def.key}
        label={def.label}
        position={toPosition(def, settings[def.key])}
        display={def.format(settings[def.key])}
        resetTo={toPosition(def, INITIAL[def.key])}
        onChange={(position) => turn(def, position)}
      />
    ))

  // Pads on screen: C to C, one octave on a phone and two on anything wider
  const base = (octave + 1) * 12
  const steps = Array.from({ length: wide ? 25 : 13 }, (_, step) => step)
  const lower = steps.filter((step) => !isUpper(step))
  const padWidth = 100 / lower.length

  const pad = (step: number, style?: React.CSSProperties) => {
    const midi = base + step
    const hotkey = KEY_ROW[step]?.[1]
    return (
      <div
        key={step}
        data-midi={midi}
        data-held={held.has(midi) || undefined}
        className={styles.pad}
        style={{ ...style, '--i': step } as React.CSSProperties}
      >
        <span className={styles.padLight} />
        <span className={styles.padLabel}>
          {step % 12 === 0 ? noteName(midi) : <span className={styles.hotkey}>{hotkey}</span>}
        </span>
      </div>
    )
  }

  const arpLabel = ARP_MODES.find((m) => m.id === arpMode)!.label
  const nextArpMode =
    ARP_MODES[(ARP_MODES.findIndex((m) => m.id === arpMode) + 1) % ARP_MODES.length].id

  return (
    <div className={styles.synth}>
      <header className={styles.head}>
        <div>
          <p className={styles.kicker}>Web Audio · no libraries</p>
          <h1 className={styles.title}>
            Pocket <em>Synth</em>
          </h1>
        </div>
        <div className={styles.headSide}>
          <div className={styles.colours} role="group" aria-label="Body colour">
            {COLOURS.map((name) => (
              <button
                key={name}
                type="button"
                className={styles.colour}
                data-colour={name}
                aria-label={name}
                aria-pressed={colour === name}
                onClick={() => pickColour(name)}
              />
            ))}
          </div>
          <Link href={POST_HREF} className="ed-pill ed-pill--outline">
            How it works
            <span className="ed-pill__arrow" aria-hidden="true">
              →
            </span>
          </Link>
        </div>
      </header>

      <div className={styles.device} data-colour={colour} data-tab={tab} ref={deviceRef}>
        <section className={cx(styles.knobs, styles.knobsLeft)} aria-label="Tone">
          {knobs(KNOBS_LEFT)}
        </section>

        <div className={styles.bezel}>
          <Screen engine={engine} state={screenState} compact={small} />
        </div>

        <section className={cx(styles.knobs, styles.knobsRight)} aria-label="Envelope and effects">
          {knobs(KNOBS_RIGHT)}
        </section>

        <div className={styles.tabs} role="group" aria-label="Controls shown">
          {TABS.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              className={styles.tab}
              aria-pressed={tab === id}
              onClick={() => setTab(id)}
            >
              {label}
            </button>
          ))}
        </div>

        <div className={cx(styles.well, styles.soundButtons)}>
          <div className={styles.buttonRow} role="group" aria-label="Waveform">
            {WAVES.map((w) => (
              <button
                key={w.id}
                type="button"
                className={styles.button}
                aria-pressed={settings.wave === w.id}
                aria-label={`${w.label} wave`}
                onClick={() => {
                  show('wave')
                  setSettings((s) => ({ ...s, wave: w.id }))
                }}
              >
                <svg viewBox="0 0 26 16" aria-hidden="true">
                  <path d={w.path} />
                </svg>
              </button>
            ))}
          </div>
          <div className={styles.buttonRow} role="group" aria-label="Presets">
            {PRESETS.map(({ name, sound }) => (
              <button
                key={name}
                type="button"
                className={styles.button}
                aria-pressed={preset === name}
                onClick={() => setSettings((s) => ({ ...s, ...sound }))}
              >
                {name}
              </button>
            ))}
          </div>
        </div>

        <div className={cx(styles.well, styles.transport)}>
          <div className={styles.buttonRow} role="group" aria-label="Sequencer">
            <button
              ref={playRef}
              type="button"
              className={styles.button}
              data-tone="play"
              aria-pressed={playing}
              onClick={togglePlay}
            >
              {playing ? 'Stop' : 'Play'}
            </button>
            <button
              type="button"
              className={styles.button}
              data-tone="rec"
              aria-pressed={recording}
              onClick={() => setRecording(!recording)}
            >
              Rec
            </button>
            <button
              type="button"
              className={styles.button}
              onClick={() => setPattern(new Array(STEPS).fill(null))}
            >
              Clear
            </button>
            <button
              type="button"
              className={styles.button}
              onClick={() => shiftOctave(-1)}
              disabled={octave <= MIN_OCTAVE}
              aria-label="Octave down"
            >
              Oct −
            </button>
          </div>
          <div className={styles.buttonRow} role="group" aria-label="Arpeggiator">
            <button type="button" className={styles.button} aria-pressed={arp} onClick={toggleArp}>
              Arp
            </button>
            <button
              type="button"
              className={styles.button}
              aria-pressed={hold}
              onClick={toggleHold}
              disabled={!arp}
            >
              Hold
            </button>
            <button
              type="button"
              className={styles.button}
              disabled={!arp}
              aria-label={`Arpeggiator direction: ${arpLabel}`}
              onClick={() => setArpMode(nextArpMode)}
            >
              {arpLabel}
            </button>
            <button
              type="button"
              className={styles.button}
              onClick={() => shiftOctave(1)}
              disabled={octave >= MAX_OCTAVE}
              aria-label="Octave up"
            >
              Oct +
            </button>
          </div>
        </div>

        <div className={styles.steps} role="group" aria-label="Sequencer steps">
          {pattern.map((midi, i) => (
            <button
              key={i}
              type="button"
              className={styles.step}
              data-step={i}
              data-on={midi !== null || undefined}
              data-cursor={(recording && !playing && cursor === i) || undefined}
              aria-pressed={midi !== null}
              aria-label={`Step ${i + 1}: ${midi !== null ? noteName(midi) : 'empty'}`}
              style={{ '--i': i } as React.CSSProperties}
              onClick={() => toggleStep(i)}
            >
              <span className={styles.stepLed} />
              <span className={styles.stepNote}>{midi !== null ? noteName(midi) : i + 1}</span>
            </button>
          ))}
        </div>

        {/* The pads are a picture of what the pointer and the computer keyboard play; they are
            not tab stops, since Tab-then-Enter is no way to play a tune. Keyboard users play
            on the letter keys, as the hint below says. */}
        <div
          className={cx(styles.well, styles.pads)}
          role="group"
          aria-label={`Keyboard, octave ${octave}`}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerEnd}
          onPointerCancel={onPointerEnd}
          onLostPointerCapture={onPointerEnd}
          onContextMenu={(e) => e.preventDefault()}
        >
          <div className={styles.padsUpper}>
            {steps.filter(isUpper).map((step) =>
              pad(step, {
                left: `${steps.filter((s) => s < step && !isUpper(s)).length * padWidth}%`,
                width: `${padWidth}%`,
              })
            )}
          </div>
          <div className={styles.padsLower}>{lower.map((step) => pad(step))}</div>
        </div>
      </div>

      <p className={styles.hint}>
        <span className={styles.desk}>
          Play the pads, or the keys <kbd>A</kbd>–<kbd>&apos;</kbd>. <kbd>Z</kbd> <kbd>X</kbd>{' '}
          octave. <kbd>Space</kbd> play/stop.
        </span>
        <span>
          Drag a knob up or down<span className={styles.desk}>, Shift for fine steps</span>.
          Double-tap it to reset.
        </span>
      </p>
    </div>
  )
}
