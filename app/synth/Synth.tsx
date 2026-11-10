'use client'

import { memo, useCallback, useEffect, useRef, useState } from 'react'
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

// Two octaves and the C above them. The phone layout shows the first octave only; which pads
// are on show is the stylesheet's decision, so the markup is the same everywhere.
const PAD_STEPS = Array.from({ length: 25 }, (_, step) => step)
const isUpper = (step: number) => [1, 3, 6, 8, 10].includes(step % 12)
const LOWER_STEPS = PAD_STEPS.filter((step) => !isUpper(step))
const UPPER_STEPS = PAD_STEPS.filter(isUpper)

const MIN_OCTAVE = 1
const MAX_OCTAVE = 6

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

// On a phone the controls don't all fit on one screen with the pads, so they are split into
// four pages and one is shown at a time. Wider screens show everything and never see the tabs.
const TABS = [
  { id: 'seq', label: 'Seq' },
  { id: 'sound', label: 'Sound' },
  { id: 'tone', label: 'Tone' },
  { id: 'shape', label: 'Shape' },
] as const
type Tab = (typeof TABS)[number]['id']

const NO_NOTES: ReadonlySet<number> = new Set()

interface PadsProps {
  /** MIDI number of the first pad */
  base: number
  held: ReadonlySet<number>
  press: (source: string, midi: number) => void
  release: (source: string) => void
  isDown: (source: string) => boolean
}

// The keyboard. The pads are a picture of what the pointer and the computer keyboard play;
// they are not tab stops, since Tab-then-Enter is no way to play a tune. Keyboard users play
// on the letter keys.
const Pads = memo(function Pads({ base, held, press, release, isDown }: PadsProps) {
  const midiAt = (x: number, y: number) => {
    const pad = document.elementFromPoint(x, y)?.closest<HTMLElement>('[data-midi]')
    return pad ? Number(pad.dataset.midi) : undefined
  }
  // The pad area captures the pointer, so a drag that leaves it still ends the note, and
  // sliding across pads plays each one in turn. Every finger is its own pointer.
  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return
    const midi = midiAt(e.clientX, e.clientY)
    if (midi === undefined) return
    e.preventDefault()
    try {
      e.currentTarget.setPointerCapture(e.pointerId)
    } catch {
      // The pointer is already gone: the note still plays, and pointerup still ends it
    }
    press(`p${e.pointerId}`, midi)
  }
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const source = `p${e.pointerId}`
    if (!isDown(source)) return
    const midi = midiAt(e.clientX, e.clientY)
    if (midi !== undefined) press(source, midi)
  }
  const onPointerEnd = (e: React.PointerEvent<HTMLDivElement>) => release(`p${e.pointerId}`)

  const pad = (step: number) => {
    const midi = base + step
    return (
      <div
        key={step}
        data-midi={midi}
        data-far={step > 12 || undefined}
        data-held={held.has(midi) || undefined}
        className={styles.pad}
        style={
          {
            '--i': step,
            // For an upper pad: how many lower pads sit to its left
            '--before': LOWER_STEPS.filter((lower) => lower < step).length,
          } as React.CSSProperties
        }
      >
        <span className={styles.padLight} />
        <span className={styles.padLabel}>
          {step % 12 === 0 ? (
            noteName(midi)
          ) : (
            <span className={styles.hotkey}>{KEY_ROW[step]?.[1]}</span>
          )}
        </span>
      </div>
    )
  }

  return (
    <div
      className={cx(styles.well, styles.pads)}
      role="group"
      aria-label={`Keyboard, from ${noteName(base)}`}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerEnd}
      onPointerCancel={onPointerEnd}
      onLostPointerCapture={onPointerEnd}
      onContextMenu={(e) => e.preventDefault()}
    >
      <div className={styles.padsUpper}>{UPPER_STEPS.map(pad)}</div>
      <div className={styles.padsLower}>{LOWER_STEPS.map(pad)}</div>
    </div>
  )
})

interface StepsProps {
  pattern: Pattern
  /** The step the next recorded note lands on, or -1 when not step-recording */
  cursor: number
  onToggle: (index: number) => void
}

const Steps = memo(function Steps({ pattern, cursor, onToggle }: StepsProps) {
  return (
    <div className={styles.steps} data-page="seq" role="group" aria-label="Sequencer steps">
      {pattern.map((midi, i) => (
        <button
          key={i}
          type="button"
          className={styles.step}
          data-step={i}
          data-on={midi !== null || undefined}
          data-cursor={cursor === i || undefined}
          aria-pressed={midi !== null}
          aria-label={`Step ${i + 1}: ${midi !== null ? noteName(midi) : 'empty'}`}
          style={{ '--i': i } as React.CSSProperties}
          onClick={() => onToggle(i)}
        >
          <span className={styles.stepLed} />
          <span className={styles.stepNote}>{midi !== null ? noteName(midi) : i + 1}</span>
        </button>
      ))}
    </div>
  )
})

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
  const [colour, setColour] = useState<Colour>('violet')
  const [tab, setTab] = useState<Tab>('seq')
  const [held, setHeld] = useState<ReadonlySet<number>>(NO_NOTES)

  const engineRef = useRef<SynthEngine | null>(null)
  if (!engineRef.current) engineRef.current = new SynthEngine(INITIAL, INITIAL)
  const engine = engineRef.current

  const stageRef = useRef<HTMLDivElement>(null)
  const deviceRef = useRef<HTMLDivElement>(null)

  // What is holding each note down: a finger ("p<pointerId>") or a key ("k<code>"). A note
  // sounds while at least one of them is on it, so a key and a finger on the same note don't
  // cut each other off.
  const sources = useRef(new Map<string, number>())
  // With HOLD on, the notes the arpeggiator keeps cycling after the keys are let go
  const latch = useRef(new Set<number>())
  const lastNote = useRef(60)
  const focus = useRef<ScreenState['focus']>(null)

  // Handlers that are created once (keyboard, pointer, memoised children) read the latest
  // values from here instead of from the render they were created in
  const live = useRef({ octave, playing, recording, cursor, arp, hold, pattern })
  live.current = { octave, playing, recording, cursor, arp, hold, pattern }
  // Counts renders, so the lights loop knows when the pads it marked may have been redrawn
  const renders = useRef(0)
  renders.current++

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

  // Once, on arrival: the remembered colour, and a starting point that suits the device.
  const arrived = useRef(false)
  useEffect(() => {
    if (arrived.current) return
    arrived.current = true

    try {
      const saved = localStorage.getItem(COLOUR_KEY) as Colour | null
      if (saved && COLOURS.includes(saved)) setColour(saved)
    } catch {
      // Storage is blocked: the default colour is fine
    }

    // A phone speaker has no bass to speak of, and the upright phone layout shows one octave.
    // On a phone, either way up, start an octave higher: where its speaker can be heard and
    // where the pattern's notes are on the pads.
    const layout = deviceRef.current
      ? getComputedStyle(deviceRef.current).getPropertyValue('--layout').trim()
      : ''
    if (layout === 'phone' || layout === 'flat') {
      setOctave(4)
      setPattern((p) => p.map((midi) => (midi === null ? null : midi + 12)))
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
    let last = ''
    const loop = () => {
      frame = requestAnimationFrame(loop)
      const device = deviceRef.current
      if (!device) return
      const lit = engine.litNotes()
      if (!live.current.arp) for (const midi of sources.current.values()) lit.add(midi)
      const step = engine.currentStep()

      // Nearly every frame is the same as the one before: leave the page alone unless the
      // lights changed or React has redrawn the elements they are on
      const now = `${renders.current}|${step}|${[...lit].sort().join()}`
      if (now === last) return
      last = now

      device
        .querySelectorAll<HTMLElement>('[data-midi]')
        .forEach((pad) => pad.toggleAttribute('data-lit', lit.has(Number(pad.dataset.midi))))
      device
        .querySelectorAll<HTMLElement>('[data-step]')
        .forEach((el) => el.toggleAttribute('data-now', Number(el.dataset.step) === step))
      device
        .querySelector('[data-b="play"]')
        ?.toggleAttribute('data-beat', step >= 0 && step % 4 === 0)
    }
    loop()
    return () => cancelAnimationFrame(frame)
  }, [engine])

  // ----------------------------------------------------------------------------- playing
  const arpNotes = () =>
    live.current.hold ? [...latch.current] : [...new Set(sources.current.values())]

  const moveCursor = useCallback((next: number) => {
    // Updated here as well as in state: two notes can arrive before React has re-rendered
    live.current.cursor = next
    setCursor(next)
  }, [])

  // REC while the pattern runs: the note lands on the nearest step. REC while stopped: it
  // lands on the cursor, which moves on one step.
  const record = useCallback(
    (midi: number) => {
      const { recording, playing, cursor } = live.current
      if (!recording) return
      const at = playing ? engine.nearestStep() : cursor
      if (at < 0) return
      setPattern((p) => p.map((note, i) => (i === at ? midi : note)))
      if (!playing) moveCursor((cursor + 1) % STEPS)
    },
    [engine, moveCursor]
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

  const isDown = useCallback((source: string) => sources.current.has(source), [])

  // Let go of every key and finger. What HOLD is keeping carries on.
  const releaseKeys = useCallback(() => {
    if (sources.current.size === 0) return
    sources.current.clear()
    engine.allNotesOff()
    if (live.current.arp) engine.setArpNotes(arpNotes())
    setHeld(NO_NOTES)
  }, [engine])

  // Silence everything, held notes included
  const releaseAll = useCallback(() => {
    sources.current.clear()
    latch.current.clear()
    engine.allNotesOff()
    engine.setArpNotes([])
    setHeld(NO_NOTES)
  }, [engine])

  const togglePlay = useCallback(() => {
    if (live.current.playing) engine.stop()
    else engine.play()
    setPlaying(!live.current.playing)
  }, [engine])

  const shiftOctave = useCallback((by: number) => {
    setOctave((o) => Math.min(MAX_OCTAVE, Math.max(MIN_OCTAVE, o + by)))
  }, [])

  // Any tap or click on the instrument makes sure audio is allowed and running. A touch only
  // counts when the finger lifts, so the note a first tap starts needs this to be heard.
  useEffect(() => {
    const stage = stageRef.current
    if (!stage) return
    const unlock = () => engine.unlock()
    const events = ['pointerdown', 'pointerup', 'touchend', 'click'] as const
    events.forEach((name) => stage.addEventListener(name, unlock, { capture: true, passive: true }))
    return () =>
      events.forEach((name) => stage.removeEventListener(name, unlock, { capture: true }))
  }, [engine])

  // Computer keyboard, and leaving the page
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.repeat || e.metaKey || e.ctrlKey || e.altKey) return
      // Usually the focused element or <body>, but it can be the document itself
      const target = e.target instanceof Element ? e.target : null
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

    // A key released while the window is elsewhere never sends keyup, so let go of them all
    const blur = () => releaseKeys()
    // A background tab's timers are too slow to keep a pattern in time, and nobody is
    // listening: stop everything and let the audio clock rest
    const visibility = () => {
      if (document.hidden) {
        releaseAll()
        setPlaying(false)
        engine.sleep()
      } else {
        engine.wake()
      }
    }

    window.addEventListener('keydown', down)
    window.addEventListener('keyup', up)
    window.addEventListener('blur', blur)
    document.addEventListener('visibilitychange', visibility)
    return () => {
      window.removeEventListener('keydown', down)
      window.removeEventListener('keyup', up)
      window.removeEventListener('blur', blur)
      document.removeEventListener('visibilitychange', visibility)
    }
  }, [engine, press, release, releaseKeys, releaseAll, shiftOctave, togglePlay])

  // ---------------------------------------------------------------------------- controls
  // Put a control's page on the screen. The screen reads screenState each frame, and a new
  // object is how it knows something changed.
  const show = (key: NonNullable<ScreenState['focus']>['key']) => {
    focus.current = { key, at: performance.now() }
    screenState.current = { ...screenState.current, focus: focus.current }
  }

  const turn = useCallback((def: KnobDef, position: number) => {
    show(def.key)
    const value = fromPosition(def, position)
    setSettings((s) => (s[def.key] === value ? s : { ...s, [def.key]: value }))
  }, [])

  // Back to exactly the starting value, so a preset that was nudged and reset is a preset again
  const reset = useCallback((def: KnobDef) => {
    show(def.key)
    setSettings((s) => ({ ...s, [def.key]: INITIAL[def.key] }))
  }, [])

  const toggleStep = useCallback(
    (index: number) => {
      const filled = live.current.pattern[index] !== null
      if (!filled && !live.current.playing) engine.preview(lastNote.current)
      setPattern((p) =>
        p.map((note, i) => (i === index ? (filled ? null : lastNote.current) : note))
      )
      moveCursor((index + 1) % STEPS)
    },
    [engine, moveCursor]
  )

  const clearPattern = () => {
    setPattern(new Array(STEPS).fill(null))
    moveCursor(0)
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
      <Knob key={def.key} def={def} value={settings[def.key]} onTurn={turn} onReset={reset} />
    ))

  const arpLabel = ARP_MODES.find((m) => m.id === arpMode)!.label
  const nextArpMode =
    ARP_MODES[(ARP_MODES.findIndex((m) => m.id === arpMode) + 1) % ARP_MODES.length].id
  const nextColour = COLOURS[(COLOURS.indexOf(colour) + 1) % COLOURS.length]

  return (
    <div className={styles.stage} ref={stageRef}>
      <header className={styles.head}>
        <h1 className={styles.title}>
          Pocket <em>Synth</em>
        </h1>
        <p className={styles.hint}>
          <span className={styles.desk}>
            Keys <kbd>A</kbd>–<kbd>&apos;</kbd> play · <kbd>Z</kbd> <kbd>X</kbd> octave ·{' '}
            <kbd>Space</kbd> start/stop ·{' '}
          </span>
          Drag a knob to turn it · press it twice to reset
        </p>
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
          {/* Where six swatches don't fit, one that steps through them */}
          <button
            type="button"
            className={cx(styles.colour, styles.cycle)}
            data-colour={colour}
            aria-label={`Body colour: ${colour}. Change to ${nextColour}`}
            onClick={() => pickColour(nextColour)}
          />
          <Link href={POST_HREF} className="ed-pill ed-pill--outline">
            How it works
            <span className="ed-pill__arrow" aria-hidden="true">
              →
            </span>
          </Link>
        </div>
      </header>

      <div className={styles.fit}>
        <div className={styles.device} data-colour={colour} data-tab={tab} ref={deviceRef}>
          <div className={styles.bezel}>
            <Screen engine={engine} state={screenState} />
          </div>

          <section
            className={cx(styles.knobs, styles.knobsLeft)}
            data-page="tone"
            aria-label="Tone"
          >
            {knobs(KNOBS_LEFT)}
          </section>

          <section
            className={cx(styles.knobs, styles.knobsRight)}
            data-page="shape"
            aria-label="Envelope and effects"
          >
            {knobs(KNOBS_RIGHT)}
          </section>

          <div className={cx(styles.well, styles.sound)}>
            <div
              className={styles.row}
              data-page="sound"
              data-g="waves"
              role="group"
              aria-label="Waveform"
            >
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
            <div
              className={styles.row}
              data-page="sound"
              data-g="presets"
              role="group"
              aria-label="Presets"
            >
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

          {/* In the order the wide layout's two rows of four want them; the phone layouts
              place each one by name (data-b) */}
          <div
            className={cx(styles.well, styles.transport)}
            role="group"
            aria-label="Sequencer and arpeggiator"
          >
            <button
              type="button"
              className={styles.button}
              data-b="play"
              data-tone="play"
              aria-pressed={playing}
              onClick={togglePlay}
            >
              {playing ? 'Stop' : 'Play'}
            </button>
            <button
              type="button"
              className={styles.button}
              data-b="rec"
              data-page="seq"
              data-tone="rec"
              aria-pressed={recording}
              onClick={() => setRecording(!recording)}
            >
              Rec
            </button>
            <button
              type="button"
              className={styles.button}
              data-b="clear"
              data-page="seq"
              onClick={clearPattern}
            >
              Clear
            </button>
            <button
              type="button"
              className={styles.button}
              data-b="octDown"
              data-page="seq"
              onClick={() => shiftOctave(-1)}
              disabled={octave <= MIN_OCTAVE}
              aria-label="Octave down"
            >
              Oct −
            </button>
            <button
              type="button"
              className={styles.button}
              data-b="arp"
              data-page="sound"
              aria-pressed={arp}
              onClick={toggleArp}
            >
              Arp
            </button>
            <button
              type="button"
              className={styles.button}
              data-b="hold"
              data-page="sound"
              aria-pressed={hold}
              onClick={toggleHold}
              disabled={!arp}
            >
              Hold
            </button>
            <button
              type="button"
              className={styles.button}
              data-b="mode"
              data-page="sound"
              disabled={!arp}
              aria-label={`Arpeggiator direction: ${arpLabel}`}
              onClick={() => setArpMode(nextArpMode)}
            >
              {arpLabel}
            </button>
            <button
              type="button"
              className={styles.button}
              data-b="octUp"
              data-page="seq"
              onClick={() => shiftOctave(1)}
              disabled={octave >= MAX_OCTAVE}
              aria-label="Octave up"
            >
              Oct +
            </button>
          </div>

          <div className={styles.tabs} role="group" aria-label="Controls shown">
            {TABS.map(({ id, label }) => (
              <button
                key={id}
                type="button"
                className={styles.tab}
                data-t={id}
                aria-pressed={tab === id}
                onClick={() => setTab(id)}
              >
                {label}
              </button>
            ))}
          </div>

          <Steps
            pattern={pattern}
            cursor={recording && !playing ? cursor : -1}
            onToggle={toggleStep}
          />

          <Pads
            base={(octave + 1) * 12}
            held={held}
            press={press}
            release={release}
            isDown={isDown}
          />
        </div>
      </div>
    </div>
  )
}
