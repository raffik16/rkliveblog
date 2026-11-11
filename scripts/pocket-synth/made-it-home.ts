// "Made It Home": sixteen bars of the Pocket Synth, 132 BPM, F minor.
//
// Eight bars of pads and soft keys under a filter that opens, one beat of nothing, then eight
// bars with the bass and the hook in. Five takes, each a different sound, each played the way
// the page is played: pads pressed and let go, knobs turned, the sequencer and the arpeggiator
// started. The recording is the audio reference the song was made from.

import type { Pattern } from '../../app/synth/engine'
import { INITIAL, PRESETS } from '../../app/synth/params'
import type { Action, Score, Settings, Track } from './tape'

const TEMPO = 132
const SWING = 0.36
const STEP = 60 / TEMPO / 4 // a sixteenth note, in seconds
const BAR = 16 * STEP
const BARS = 16
// The bar, counting from 0, where the bass and the hook come in
const DROP = 8
// The sequencer's first step sounds this long after PLAY is pressed (see startClock)
const COUNT_IN = 0.02
// The sequencer decides what a step plays up to 144 ms before it sounds (its lookahead, plus
// one tick of its timer). A change meant for the next bar line is made this far ahead of it:
// after the last step of the old bar has been decided, before the first of the new one.
const AHEAD = 0.16
const TAIL = 0.6

// D♭maj7, A♭, Fm7, E♭: a bar each, round and round
const CHORDS = [
  { bass: 37, pad: [53, 56, 60, 63], keys: [61, 65, 68, 72] },
  { bass: 32, pad: [51, 56, 60, 63], keys: [60, 63, 68, 72] },
  { bass: 29, pad: [53, 56, 60, 65], keys: [60, 65, 68, 75] },
  { bass: 39, pad: [51, 55, 58, 65], keys: [58, 63, 67, 70] },
]

const preset = (name: string) => PRESETS.find((p) => p.name === name)!.sound

const knobs = (sound: Partial<Settings>): Settings => ({
  ...INITIAL,
  tempo: TEMPO,
  swing: SWING,
  ...sound,
})

// When a step of a bar sounds, in a take whose first bar starts `origin` seconds in. Every
// second sixteenth is late by as much as the engine's sequencer makes it, so that hands and
// sequencer swing alike.
const clock =
  (origin: number) =>
  (bar: number, step = 0) =>
    origin + (bar * 16 + step) * STEP + (Math.floor(step) % 2 === 1 ? SWING * STEP * 0.5 : 0)

// Warm pads. Notes two chords share stay held across the change. The Cutoff knob is turned up
// through the first eight bars, the Volume knob is pulled to nothing for the last beat of
// them, and from the drop the LFO pumps the filter once a beat.
function pad(): Track {
  // At 2.2 Hz the LFO goes round once a beat, with the filter most closed three quarters of
  // the way round. It starts turning when the first note sounds: until a note's filter is
  // listening to it, Chromium does not run it. So the first chord goes down three quarters of
  // a beat before the song starts, which puts that dip on every beat, where a kick drum
  // would be.
  const beat = 4 * STEP
  const early = 0.75 * beat
  const origin = 0.05 + early
  const at = clock(origin)
  const actions: Action[] = []

  let held: number[] = []
  for (let bar = 0; bar < BARS; bar++) {
    const chord = CHORDS[bar % 4].pad
    const change = bar === 0 ? at(0) - early : at(bar)
    for (const midi of held.filter((note) => !chord.includes(note))) {
      actions.push({ at: change, do: 'off', midi })
    }
    for (const midi of chord.filter((note) => !held.includes(note))) {
      actions.push({ at: change, do: 'on', midi })
    }
    held = chord
  }
  for (const midi of held) actions.push({ at: at(BARS), do: 'off', midi })

  const closed = 0.3
  const open = 0.62
  const silence = (DROP - 1) * 16 + 12
  for (let step = 0; step < silence; step++) {
    const cutoff = closed + ((open - closed) * step) / silence
    actions.push({ at: at(0, step), do: 'knobs', settings: { cutoff } })
  }
  actions.push({ at: at(0, silence), do: 'knobs', settings: { volume: 0 } })
  actions.push({
    at: at(DROP) - 0.01,
    do: 'knobs',
    settings: { volume: INITIAL.volume, cutoff: 0.55, lfoDepth: 0.65 },
  })

  return {
    name: 'pad',
    gain: 0.6,
    origin,
    take: {
      seconds: origin + BARS * BAR + TAIL,
      settings: knobs({
        ...preset('Pad'),
        cutoff: closed,
        lfoRate: 1 / beat,
        lfoDepth: 0,
        echo: 0.15,
      }),
      actions,
    },
  }
}

// Soft keys: a triangle wave with the filter nearly shut, as close to a felt piano as two
// oscillators get. Chords are rolled from the bottom note up, a hundredth of a second apart.
function keys(): Track {
  const origin = 0.05
  const at = clock(origin)
  const actions: Action[] = []

  // [step the chord is struck on, step it is let go on]
  const sparse = [
    [0, 7],
    [10, 15],
  ]
  const busy = [
    [0, 2.6],
    [3, 5.2],
    [6, 9],
    [10, 12.6],
    [14, 15.6],
  ]
  for (let bar = 0; bar < BARS; bar++) {
    // The bar before the drop stops short, to leave its last beat empty
    const rhythm = bar === DROP - 1 ? [[0, 10]] : bar < DROP ? sparse : busy
    for (const [down, up] of rhythm) {
      CHORDS[bar % 4].keys.forEach((midi, finger) => {
        actions.push({ at: at(bar, down) + finger * 0.01, do: 'on', midi })
        actions.push({ at: at(bar, up), do: 'off', midi })
      })
    }
  }
  actions.push({ at: at(DROP - 1, 12), do: 'knobs', settings: { volume: 0 } })
  actions.push({ at: at(DROP) - 0.01, do: 'knobs', settings: { volume: INITIAL.volume } })

  return {
    name: 'keys',
    gain: 0.8,
    origin,
    take: {
      seconds: origin + BARS * BAR + TAIL,
      settings: knobs({
        wave: 'triangle',
        detune: 4,
        cutoff: 0.5,
        resonance: 1,
        envAmount: 0.4,
        attack: 0.004,
        decay: 0.8,
        sustain: 0.3,
        release: 0.6,
        lfoDepth: 0,
        echo: 0.14,
        reverb: 0.32,
      }),
      actions,
    },
  }
}

// Sub bass, from the drop: the root of each chord, with an octave and a fifth thrown in
function bass(): Track {
  const origin = 0.05
  const at = clock(origin)
  const actions: Action[] = []

  // [step, length in steps, semitones above the root]
  const line = [
    [0, 2.6, 0],
    [3, 1.6, 0],
    [6, 1.8, 12],
    [10, 2.6, 0],
    [13, 0.7, 0],
    [14, 1.6, 7],
  ]
  for (let bar = DROP; bar < BARS; bar++) {
    for (const [step, length, interval] of line) {
      const midi = CHORDS[bar % 4].bass + interval
      actions.push({ at: at(bar, step), do: 'on', midi })
      actions.push({ at: at(bar, step) + length * STEP, do: 'off', midi })
    }
  }

  return {
    name: 'bass',
    gain: 1.25,
    origin,
    take: {
      seconds: origin + BARS * BAR + TAIL,
      settings: knobs({
        wave: 'triangle',
        detune: 0,
        cutoff: 0.42,
        resonance: 2,
        envAmount: 0.3,
        attack: 0.004,
        decay: 0.2,
        sustain: 0.8,
        release: 0.08,
        lfoDepth: 0,
        echo: 0,
        reverb: 0.02,
      }),
      actions,
    },
  }
}

// The hook, from the drop: one pattern on the step sequencer, looping over all four chords.
// Its rhythm is the line the song hangs on: "home, home, I made it home".
function hook(): Track {
  const _ = null
  const pattern: Pattern = [75, _, _, _, 72, _, _, _, 68, _, 70, 72, 77, _, _, 72]
  const end = COUNT_IN + (BARS - DROP) * BAR

  return {
    name: 'hook',
    gain: 0.9,
    // PLAY is pressed as the take starts, so the take starts at the drop
    origin: COUNT_IN - DROP * BAR,
    take: {
      seconds: end + TAIL,
      settings: knobs({ ...preset('Lead'), cutoff: 0.62, echo: 0.36, reverb: 0.3, gate: 0.7 }),
      actions: [
        { at: 0, do: 'pattern', pattern },
        { at: 0, do: 'play' },
        { at: end - AHEAD, do: 'stop' },
      ],
    },
  }
}

// The arpeggiator, for the last four bars: each chord held an octave up, run up and down
function arp(): Track {
  const from = BARS - 4
  const notes = (bar: number) => CHORDS[bar % 4].keys.map((midi) => midi + 12)
  const actions: Action[] = [
    { at: 0, do: 'arp', on: true, mode: 'updown' },
    { at: 0, do: 'arpNotes', notes: notes(from) },
  ]
  for (let bar = from + 1; bar < BARS; bar++) {
    actions.push({ at: COUNT_IN + (bar - from) * BAR - AHEAD, do: 'arpNotes', notes: notes(bar) })
  }
  const end = COUNT_IN + (BARS - from) * BAR
  actions.push({ at: end - AHEAD, do: 'arpNotes', notes: [] })

  return {
    name: 'arp',
    gain: 0.5,
    origin: COUNT_IN - from * BAR,
    take: {
      seconds: end + TAIL,
      settings: knobs({ ...preset('Pluck'), cutoff: 0.6, echo: 0.3, reverb: 0.3 }),
      actions,
    },
  }
}

const score: Score = {
  name: 'made-it-home',
  seconds: BARS * BAR + 0.5,
  fadeOut: 0.5,
  tracks: [pad(), keys(), bass(), hook(), arp()],
}

export default score
