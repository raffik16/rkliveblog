'use client'

import { memo, useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { cx } from '@/lib/edition/cx'
import { STEPS, SynthEngine, type ArpMode, type Pattern } from './engine'
import Knob from './Knob'
import Screen, { type Expression, type ScreenState } from './Screen'
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

// How a finger moving on a held pad is read (see Pads). Sizes are in pad widths, so it feels
// the same on a phone's narrow pads and a desktop's wide ones.
const LEAVE = 0.3 // how far past a pad's edge a finger goes before it plays the next pad
const SLACK = 0.08 // movement this small is a finger settling, not a gesture
const REACH = 0.2 // this far from where it landed is full expression
const BEND_PER_PAD = 450 // cents of pitch for one pad width of sideways movement
const MAX_BEND = 100 // cents: a semitone either way
const clamp = (n: number, low: number, high: number) => Math.min(high, Math.max(low, n))

interface PadsProps {
  /** MIDI number of the first pad */
  base: number
  held: ReadonlySet<number>
  press: (source: string, midi: number) => void
  release: (source: string) => void
  /** A finger moving on the pad it is holding. False when the pads are not played directly. */
  express: (midi: number, bend: number, amount: number) => boolean
}

// The keyboard. The pads are a picture of what the pointer and the computer keyboard play;
// they are not tab stops, since Tab-then-Enter is no way to play a tune. Keyboard users play
// on the letter keys.
const Pads = memo(function Pads({ base, held, press, release, express }: PadsProps) {
  // Where each finger landed, on which pad, and the note that pad was then. Every finger is
  // its own pointer. The note is kept because the pads can change under a finger: the octave
  // buttons renumber them, and a held note is still the note it was.
  const fingers = useRef(
    new Map<number, { pad: HTMLElement; midi: number; x: number; y: number }>()
  )
  const padAt = (x: number, y: number) =>
    document.elementFromPoint(x, y)?.closest<HTMLElement>('[data-midi]') ?? null
  const settle = (pad: HTMLElement) => {
    pad.style.removeProperty('--bend')
    pad.style.removeProperty('--bloom')
  }

  // The pad area captures the pointer, so a drag that leaves it still ends the note
  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return
    const pad = padAt(e.clientX, e.clientY)
    if (!pad) return
    e.preventDefault()
    try {
      e.currentTarget.setPointerCapture(e.pointerId)
    } catch {
      // The pointer is already gone: the note still plays, and pointerup still ends it
    }
    const midi = Number(pad.dataset.midi)
    fingers.current.set(e.pointerId, { pad, midi, x: e.clientX, y: e.clientY })
    press(`p${e.pointerId}`, midi)
  }

  // A pad is an instrument's key, not a switch: what the finger does after it lands matters.
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const finger = fingers.current.get(e.pointerId)
    if (!finger) return
    const { clientX: x, clientY: y } = e
    const box = finger.pad.getBoundingClientRect()
    const width = box.width

    // A finger that has plainly moved onto another pad plays that pad, so sliding along
    // the pads still plays each in turn. Straying a little over the edge does not count:
    // a wiggle that started near the edge of a pad must not turn into a trill.
    const outside = Math.max(box.left - x, x - box.right, box.top - y, y - box.bottom, 0)
    const under = padAt(x, y)
    if (under && under !== finger.pad && outside > width * LEAVE) {
      settle(finger.pad)
      const midi = Number(under.dataset.midi)
      fingers.current.set(e.pointerId, { pad: under, midi, x, y })
      press(`p${e.pointerId}`, midi)
      return
    }

    // Until then its movement is expression, measured from where it landed. Sideways bends
    // the pitch, so rocking a finger is vibrato. Any direction pushes the note into the reverb.
    const dx = x - finger.x
    const dy = y - finger.y
    const slack = Math.max(3, width * SLACK)
    const sideways = Math.max(0, Math.abs(dx) - slack) * Math.sign(dx)
    const bend = clamp((sideways / width) * BEND_PER_PAD, -MAX_BEND, MAX_BEND)
    const amount = clamp((Math.hypot(dx, dy) - slack) / (width * REACH - slack), 0, 1)
    if (!express(finger.midi, bend, amount)) return
    // The pad's light leans with the bend and swells with the reverb (synth.module.css)
    finger.pad.style.setProperty('--bend', (bend / MAX_BEND).toFixed(3))
    finger.pad.style.setProperty('--bloom', amount.toFixed(3))
  }

  const onPointerEnd = (e: React.PointerEvent<HTMLDivElement>) => {
    const finger = fingers.current.get(e.pointerId)
    if (finger) settle(finger.pad)
    fingers.current.delete(e.pointerId)
    release(`p${e.pointerId}`)
  }

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
  // What a finger moving on a pad is doing, for the screen to draw
  const expression = useRef<Expression>({ trail: [], amount: 0 })

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
    expression: expression.current,
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

  // Put a control's page on the screen. The screen reads screenState each frame, and a new
  // object is how it knows something changed.
  const show = (key: NonNullable<ScreenState['focus']>['key']) => {
    focus.current = { key, at: performance.now() }
    screenState.current = { ...screenState.current, focus: focus.current }
  }

  // A finger moving on a held pad: bend the note, open its reverb send, and keep the last two
  // seconds of the bend for the screen to draw.
  const express = useCallback(
    (midi: number, bend: number, amount: number) => {
      // With the arpeggiator on, the pads choose its notes; nothing is held to bend
      if (live.current.arp) return false
      engine.express(midi, bend, amount)
      const now = performance.now()
      const drawn = expression.current
      drawn.amount = amount
      drawn.trail.push(now, bend)
      while (drawn.trail.length > 2 && now - drawn.trail[0] > 2000) drawn.trail.splice(0, 2)
      if (Math.abs(bend) > 1 || amount > 0.02 || focus.current?.key === 'touch') show('touch')
      return true
    },
    [engine]
  )

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
      if (source[0] === 'p') expression.current.amount = 0
      if (live.current.arp) engine.setArpNotes(arpNotes())
      else if (![...map.values()].includes(midi)) engine.noteOff(midi)
      setHeld(new Set(map.values()))
    },
    [engine]
  )

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

    // Pressing a button with the mouse does not move keyboard focus to it (as on a Mac, where
    // buttons never take focus from a click). The keys here are for playing: left on the last
    // button clicked, focus would make Space press that button again instead of starting and
    // stopping the pattern, and would draw a focus ring round it the moment a note key was
    // pressed. Tabbing to a button works as it always does.
    const keepFocus = (e: MouseEvent) => {
      if (e.target instanceof Element && e.target.closest('button')) e.preventDefault()
    }
    stage.addEventListener('mousedown', keepFocus)

    // A finger that is not alone on the glass never clicks. A browser turns a touch into a
    // click only when it is the one finger down, so with a pad held, a tap on PLAY or on a tab
    // would do nothing, and holding a note while reaching for a control is how an instrument
    // is played. So a finger that shared the screen, and lifts off the button it landed on,
    // presses that button.
    const touches = new Map<number, { button: HTMLButtonElement | null; shared: boolean }>()
    // The press made for a finger, so that the browser's own click for it, should one come
    // after all, is not a second press
    let made: { button: HTMLButtonElement; pointerId: number; at: number } | null = null
    const touchDown = (e: PointerEvent) => {
      if (e.pointerType !== 'touch') return
      const shared = touches.size > 0
      if (shared) touches.forEach((touch) => (touch.shared = true))
      const button = e.target instanceof Element ? e.target.closest('button') : null
      touches.set(e.pointerId, { button: button && stage.contains(button) ? button : null, shared })
    }
    const touchUp = (e: PointerEvent) => {
      const touch = touches.get(e.pointerId)
      if (!touch) return
      touches.delete(e.pointerId)
      const { button, shared } = touch
      if (e.type !== 'pointerup' || !shared || !button || button.disabled) return
      // A finger that slid off the button before lifting changed its mind
      const box = button.getBoundingClientRect()
      const { clientX: x, clientY: y } = e
      if (x < box.left || x > box.right || y < box.top || y > box.bottom) return
      made = { button, pointerId: e.pointerId, at: e.timeStamp }
      button.click()
    }
    const pressOnce = (e: MouseEvent) => {
      const last = made
      if (!last || !e.isTrusted || e.timeStamp - last.at > 700) return
      if (!(e.target instanceof Node) || !last.button.contains(e.target)) return
      // Where the browser says which finger a click came from, only that finger's is dropped
      const finger = (e as Partial<PointerEvent>).pointerId
      if (finger !== undefined && finger !== last.pointerId) return
      made = null
      e.preventDefault()
      e.stopPropagation()
    }
    // A touch that ended while the page was elsewhere is never heard of again
    const forget = () => touches.clear()
    window.addEventListener('pointerdown', touchDown, true)
    window.addEventListener('pointerup', touchUp, true)
    window.addEventListener('pointercancel', touchUp, true)
    window.addEventListener('blur', forget)
    stage.addEventListener('click', pressOnce, true)

    return () => {
      events.forEach((name) => stage.removeEventListener(name, unlock, { capture: true }))
      stage.removeEventListener('mousedown', keepFocus)
      window.removeEventListener('pointerdown', touchDown, true)
      window.removeEventListener('pointerup', touchUp, true)
      window.removeEventListener('pointercancel', touchUp, true)
      window.removeEventListener('blur', forget)
      stage.removeEventListener('click', pressOnce, true)
    }
  }, [engine])

  // Computer keyboard, and leaving the page
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.repeat || e.metaKey || e.ctrlKey || e.altKey) return
      // Usually the focused element or <body>, but it can be the document itself
      const target = e.target instanceof Element ? e.target : null
      if (target?.closest('input, textarea, select, [contenteditable]')) return

      if (e.code === 'Space') {
        // On a button or link someone has tabbed to, Space already means "press this"
        if (target?.closest('button, a')) return
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
          Drag a knob to turn it · Wiggle a held pad to bend it
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
            express={express}
          />
        </div>
      </div>
    </div>
  )
}
