// The song as data: tempo, swing, chords and what each of the three loops plays. Nothing in this
// file makes a sound. synth.js renders it into audio, and the chart (charts/track1.json) is
// written against the same grid, so a pad note lands on a hit the song really has.

export const BASE_BPM = 95
export const BEATS_PER_BAR = 4
export const LOOP_BARS = 4
export const LOOP_BEATS = LOOP_BARS * BEATS_PER_BAR
export const STEPS_PER_BAR = 16
export const STEPS_PER_LOOP = STEPS_PER_BAR * LOOP_BARS

// The tempo. Practice can slow it down, so these are `let`: modules that import them always see
// the current values (ES module exports are live). Sounds made at one tempo have to be rendered
// again for another (engine.setTempo).
export let BPM = BASE_BPM
export let BEAT = 60 / BPM // 0.6316 s at 95 BPM
export let BAR = BEAT * BEATS_PER_BAR
export let LOOP = LOOP_BEATS * BEAT // 10.1 s

export function setTempo(bpm) {
  BPM = bpm
  BEAT = 60 / bpm
  BAR = BEAT * BEATS_PER_BAR
  LOOP = LOOP_BEATS * BEAT
}

// MPC-style swing: in every pair of 16th notes the first takes 55% of the time and the second
// 45%, so the off 16th lands a little late. Beats and 8th notes stay where they are.
export const SWING = 0.55

/** A position in beats, with swing applied (still in beats). Linear in between grid lines. */
export function swing(beat, amount = SWING) {
  const eighth = Math.floor(beat * 2)
  const f = beat * 2 - eighth // 0..1 through this 8th note
  const warped = f < 0.5 ? f * (amount / 0.5) : amount + (f - 0.5) * ((1 - amount) / 0.5)
  return (eighth + warped) / 2
}

/** Seconds from the start of the song (or loop) to a position in beats, swing included. */
export const beatTime = (beat, amount = SWING) => swing(beat, amount) * BEAT

/** Seconds to a 16th-note step. */
export const stepTime = (step) => beatTime(step / 4)

export const hz = (midi) => 440 * Math.pow(2, (midi - 69) / 12)

// Rootless jazz voicings in D minor that move by a step or less from one chord to the next.
// The bass plays the root.
export const CHORDS = {
  Dm9: { root: 38, voicing: [57, 60, 64, 65] }, // A3 C4 E4 F4 over D2
  Bbmaj9: { root: 34, voicing: [57, 60, 62, 65] }, // A3 C4 D4 F4 over Bb1
  Gm9: { root: 31, voicing: [58, 62, 65, 69] }, // Bb3 D4 F4 A4 over G1
  A7b9: { root: 33, voicing: [58, 61, 64, 67] }, // Bb3 C#4 E4 G4 over A1
  C69: { root: 36, voicing: [55, 57, 62, 64] }, // G3 A3 D4 E4 over C2
}

// Per-bar step lists → one list of steps across the 4-bar loop
const perBar = (bars) => bars.flatMap((steps, bar) => steps.map((s) => s + bar * STEPS_PER_BAR))
// Same, for [step, ...rest] entries
const perBarEntries = (bars) =>
  bars.flatMap((entries, bar) => entries.map(([s, ...rest]) => [s + bar * STEPS_PER_BAR, ...rest]))

// Hi-hat loudness by position: the off-beat 8th is the accent, the in-between 16ths are ghosts
const HAT_ACCENT = [0.55, 0.3, 0.8, 0.32]

// Each loop is four bars. Steps are 16th notes from the start of the loop (0–63).
//   kick, snare, clap: steps.  ghost: [step, velocity].  hats: [step, velocity].  open: steps.
//   bass: [step, length in steps, midi].  keys: [step, length in steps, velocity] on that bar's
//   chord.  lead: [step, [midi, ...]] brass stabs.
// The kick, snare, clap, open hat and horn stabs are the pad part: they are played one hit at a
// time (by you, or by the song when the chart doesn't give them to you). The closed hats, ghost
// notes, bass and keys are the backing, rendered into loops.
export const LOOPS = {
  // A: the verse. A pushing boom-bap kick, keys on 1 and the and-of-3, a horn answer at the end
  // of each bar.
  A: {
    chords: ['Dm9', 'Bbmaj9', 'Gm9', 'A7b9'],
    kick: perBar([
      [0, 6, 10],
      [0, 6, 10, 15],
      [0, 6, 10],
      [0, 6, 9, 11],
    ]),
    snare: perBar([
      [4, 12],
      [4, 12],
      [4, 12],
      [4, 12],
    ]),
    clap: [],
    ghost: perBarEntries([
      [],
      [[7, 0.18]],
      [],
      [
        [7, 0.2],
        [15, 0.26],
      ],
    ]),
    hats: hats16(perBar([[], [], [], [14]])),
    open: perBar([[], [], [], [14]]),
    bass: perBarEntries([
      [
        [0, 5, 38],
        [6, 3, 38],
        [10, 5, 33],
      ],
      [
        [0, 5, 34],
        [6, 3, 34],
        [10, 4, 41],
        [15, 1, 34],
      ],
      [
        [0, 5, 31],
        [6, 3, 31],
        [10, 5, 38],
      ],
      [
        [0, 5, 33],
        [6, 2, 33],
        [9, 2, 37],
        [11, 4, 40],
      ],
    ]),
    keys: perBarEntries([
      [
        [0, 3, 0.9],
        [10, 2, 0.7],
      ],
      [
        [0, 3, 0.9],
        [10, 2, 0.7],
      ],
      [
        [0, 3, 0.9],
        [10, 2, 0.7],
      ],
      [
        [0, 3, 0.9],
        [10, 2, 0.75],
      ],
    ]),
    lead: perBarEntries([
      [[14, [62, 69, 74]]],
      [
        [10, [65, 72, 77]],
        [14, [62, 69, 74]],
      ],
      [[14, [58, 65, 70]]],
      [
        [6, [57, 64, 69]],
        [10, [61, 73]],
        [12, [64, 76]],
      ],
    ]),
  },

  // B: the scratch section. Sparse on purpose: 8th-note hats, long keys, the horns only at the
  // end of every second bar, so there is room for the record.
  B: {
    chords: ['Dm9', 'Dm9', 'Bbmaj9', 'A7b9'],
    kick: perBar([
      [0, 10],
      [0, 3, 10],
      [0, 10, 11],
      [0, 3, 7, 10],
    ]),
    snare: perBar([
      [4, 12],
      [4, 12],
      [4, 12],
      [4, 12],
    ]),
    clap: [],
    ghost: perBarEntries([[], [[15, 0.2]], [], [[14, 0.22]]]),
    hats: [
      ...[0, 2, 4, 6, 8, 10, 12, 14].flatMap((s) =>
        [0, 16, 32, 48].map((b) => [b + s, s % 4 === 2 ? 0.7 : 0.48])
      ),
      [31, 0.26],
      [63, 0.26],
    ],
    open: [],
    bass: perBarEntries([
      [
        [0, 8, 38],
        [10, 4, 38],
      ],
      [
        [0, 6, 38],
        [8, 4, 36],
        [12, 4, 33],
      ],
      [
        [0, 6, 34],
        [10, 2, 34],
        [12, 4, 41],
      ],
      [
        [0, 6, 33],
        [8, 2, 33],
        [10, 2, 43],
        [12, 4, 40],
      ],
    ]),
    keys: perBarEntries([
      [
        [0, 10, 0.75],
        [12, 3, 0.55],
      ],
      [
        [0, 10, 0.7],
        [12, 3, 0.55],
      ],
      [
        [0, 10, 0.75],
        [12, 3, 0.55],
      ],
      [
        [0, 10, 0.75],
        [12, 3, 0.6],
      ],
    ]),
    lead: perBarEntries([
      [],
      [
        [12, [62, 69, 74]],
        [14, [65, 72, 77]],
      ],
      [],
      [
        [10, [57, 64, 69]],
        [12, [61, 73]],
        [14, [64, 76]],
      ],
    ]),
  },

  // C: the peak, for the freestyle and the final section. A lift to Bb and C, a busier kick, a
  // clap on the snare, open hats, keys skanking on the off-beats and horns on every bar.
  C: {
    chords: ['Bbmaj9', 'C69', 'Dm9', 'A7b9'],
    kick: perBar([
      [0, 6, 10],
      [0, 3, 6, 10],
      [0, 6, 10],
      [0, 6, 10, 13, 14],
    ]),
    snare: perBar([
      [4, 12],
      [4, 12],
      [4, 12],
      [4, 12],
    ]),
    clap: perBar([
      [4, 12],
      [4, 12],
      [4, 12],
      [4, 12],
    ]),
    ghost: perBarEntries([
      [[11, 0.18]],
      [[7, 0.2]],
      [[11, 0.18]],
      [
        [7, 0.2],
        [15, 0.28],
      ],
    ]),
    hats: hats16(
      perBar([
        [6, 14],
        [6, 14],
        [6, 14],
        [6, 14],
      ])
    ),
    open: perBar([
      [6, 14],
      [6, 14],
      [6, 14],
      [6, 14],
    ]),
    bass: perBarEntries([
      [
        [0, 3, 34],
        [3, 3, 34],
        [6, 2, 46],
        [8, 2, 34],
        [10, 3, 41],
        [14, 2, 46],
      ],
      [
        [0, 3, 36],
        [3, 3, 36],
        [6, 2, 48],
        [8, 2, 36],
        [10, 3, 43],
        [14, 2, 48],
      ],
      [
        [0, 3, 38],
        [3, 3, 38],
        [6, 2, 50],
        [8, 2, 38],
        [10, 3, 45],
        [14, 2, 50],
      ],
      [
        [0, 3, 33],
        [3, 3, 33],
        [6, 2, 45],
        [8, 2, 33],
        [10, 2, 37],
        [12, 2, 40],
        [14, 2, 43],
      ],
    ]),
    keys: perBarEntries(
      [0, 1, 2, 3].map(() => [
        [2, 1, 0.7],
        [6, 1, 0.62],
        [10, 1, 0.7],
        [14, 1, 0.62],
      ])
    ),
    lead: perBarEntries([
      [
        [6, [65, 72, 77]],
        [14, [62, 69, 74]],
      ],
      [
        [6, [67, 74, 79]],
        [14, [64, 76]],
      ],
      [
        [6, [69, 76, 81]],
        [14, [65, 77]],
      ],
      [
        [6, [64, 76]],
        [10, [61, 73]],
        [12, [58, 70]],
        [14, [57, 69]],
      ],
    ]),
  },
}

/** Closed hats on every 16th except where an open hat plays, accented by position. */
function hats16(openSteps) {
  const out = []
  for (let s = 0; s < STEPS_PER_LOOP; s++) {
    if (!openSteps.includes(s)) out.push([s, HAT_ACCENT[s % 4]])
  }
  return out
}

const eventCache = {}

/**
 * The pad part of a loop: what the song plays on the pads when nobody plays them for it.
 * [{ beat (from the start of the loop), pad, voicing (horns only) }], in time order.
 */
export function loopEvents(name) {
  if (eventCache[name]) return eventCache[name]
  const loop = LOOPS[name]
  const out = []
  for (const s of loop.kick) out.push({ beat: s / 4, pad: 'kick' })
  for (const s of loop.snare) out.push({ beat: s / 4, pad: 'snare' })
  for (const s of loop.clap) out.push({ beat: s / 4, pad: 'clap' })
  for (const s of loop.open) out.push({ beat: s / 4, pad: 'hat' })
  for (const [s, voicing] of loop.lead) out.push({ beat: s / 4, pad: 'horn', voicing })
  out.sort((a, b) => a.beat - b.beat)
  return (eventCache[name] = out)
}

// The horn stab a free hit on the HORN pad plays over each chord (the loops use the same ones)
export const HORN_FOR_CHORD = {
  Dm9: [62, 69, 74],
  Bbmaj9: [65, 72, 77],
  Gm9: [58, 65, 70],
  A7b9: [57, 64, 69],
  C69: [67, 74, 79],
}

/** Every horn voicing the game can play: the loops' stabs and the free-hit ones. */
export function hornVoicings() {
  const seen = new Map()
  const add = (v) => seen.set(v.join(','), v)
  for (const loop of Object.values(LOOPS)) for (const [, v] of loop.lead) add(v)
  for (const v of Object.values(HORN_FOR_CHORD)) add(v)
  return [...seen.values()]
}

/** The chord under a beat of the song, given the loop playing in each 16-beat block. */
export function chordAt(loops, beat) {
  const block = Math.max(0, Math.floor(beat / LOOP_BEATS))
  const name = loops[Math.min(block, loops.length - 1)] || 'A'
  const inLoop = beat - block * LOOP_BEATS
  return LOOPS[name].chords[Math.max(0, Math.min(3, Math.floor(inLoop / BEATS_PER_BAR)))]
}

// The scratch record: a sung "ahh", then a horn stab one beat after it, then silent groove to
// the end of the bar. The cue point is just before the "ahh", so a tap on the beat sings on it.
// It is a record: it keeps the song's own tempo even when practice slows the song down.
const BASE_BEAT = 60 / BASE_BPM
export const SCRATCH = {
  length: BASE_BEAT * BEATS_PER_BAR,
  onset: 0.05, // seconds into the record where the "ahh" starts
  cue: 0.046,
  vowelMidi: 50, // D3
  vowelLength: 0.5,
  vowelEnd: 0.62, // a VOX pad hit plays from the cue to here: the "ahh" and nothing more
  stab: [62, 65, 69, 74], // D minor, voiced like a horn section
  stabAt: 0.05 + BASE_BEAT, // seconds into the record
}
