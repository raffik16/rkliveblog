// The one idea the harmony machine is built on: a musical interval is a ratio of two whole
// numbers, and the same two numbers set every layer.
//
//   p : q  ─┬─> the pendulums swing at p : q            (the loops in the sand and in the light)
//           ├─> the plate rings in its (p, q) mode       (the lines the sand is shaken onto)
//           └─> the speaker plays the chord at p : q     (what you hear)
//
// The pendulums are the chord nine octaves down. Transposing by octaves (doubling or halving
// every frequency) keeps every ratio, so a pendulum pair at 0.43 Hz and 0.64 Hz is the same
// perfect fifth as A3 and E4 at 220 Hz and 330 Hz, just 512 times slower.

export type Tuning = 'just' | 'equal'

export interface Interval {
  id: string
  name: string
  /** Upper note : root, as whole numbers in lowest terms (p > q) */
  p: number
  q: number
  /** Semitones above the root on a piano (equal temperament) */
  semitones: number
  /** The two notes over the A3 root */
  notes: [string, string]
  /**
   * Which of the two plate modes built from (p, q) this interval rings: cos·cos ± cos·cos.
   * Both have p and q half-waves across the plate; they differ in symmetry.
   */
  sign: 1 | -1
  /** The LED's colours over one swing, from the first, widest loops to the last (sRGB hex) */
  colors: [string, string]
}

/** A3, the root of every chord */
export const ROOT_HZ = 220
/** The pendulums swing this many octaves below the chord */
export const OCTAVES_DOWN = 9
/** Standard gravity, m/s² */
const G = 9.80665

export const INTERVALS: Interval[] = [
  {
    id: 'octave',
    name: 'Octave',
    p: 2,
    q: 1,
    semitones: 12,
    notes: ['A3', 'A4'],
    sign: -1,
    colors: ['#3cc8ff', '#6a5cff'],
  },
  {
    id: 'fifth',
    name: 'Perfect fifth',
    p: 3,
    q: 2,
    semitones: 7,
    notes: ['A3', 'E4'],
    sign: -1,
    colors: ['#ffb03b', '#ff3d6e'],
  },
  {
    id: 'fourth',
    name: 'Perfect fourth',
    p: 4,
    q: 3,
    semitones: 5,
    notes: ['A3', 'D4'],
    sign: -1,
    colors: ['#d7ff3d', '#22e3b5'],
  },
  {
    id: 'major-sixth',
    name: 'Major sixth',
    p: 5,
    q: 3,
    semitones: 9,
    notes: ['A3', 'F♯4'],
    sign: -1,
    colors: ['#ff6ad5', '#8a5cff'],
  },
  {
    id: 'major-third',
    name: 'Major third',
    p: 5,
    q: 4,
    semitones: 4,
    notes: ['A3', 'C♯4'],
    sign: -1,
    colors: ['#ffe25c', '#ff7a2f'],
  },
  {
    id: 'minor-third',
    name: 'Minor third',
    p: 6,
    q: 5,
    semitones: 3,
    notes: ['A3', 'C4'],
    sign: -1,
    colors: ['#5c8dff', '#3cffe0'],
  },
]

export const DEFAULT_INTERVAL = 'fifth'

export const intervalById = (id: string) => INTERVALS.find((i) => i.id === id) ?? INTERVALS[1]

/** Upper note ÷ root: the pure ratio, or the piano's nearest step */
export const ratioOf = (interval: Interval, tuning: Tuning) =>
  tuning === 'just' ? interval.p / interval.q : Math.pow(2, interval.semitones / 12)

/** The chord, in Hz: [root, upper] */
export const chordHz = (interval: Interval, tuning: Tuning): [number, number] => [
  ROOT_HZ,
  ROOT_HZ * ratioOf(interval, tuning),
]

/** A note's frequency brought down to the pendulums */
export const pendulumHz = (hz: number) => hz / Math.pow(2, OCTAVES_DOWN)

/** The length of a simple pendulum that swings at this (audio) frequency, brought down, in metres */
export const pendulumLength = (hz: number) => {
  const w = 2 * Math.PI * pendulumHz(hz)
  return G / (w * w)
}

/** How far the piano's version of the interval is from the pure one, in cents (1/100 semitone) */
export const centsOff = (interval: Interval) =>
  1200 * Math.log2(Math.pow(2, interval.semitones / 12) / (interval.p / interval.q))

/**
 * How fast the chord beats. The root's p-th harmonic and the upper note's q-th harmonic land on
 * the same pitch when the interval is pure; any mistuning makes them beat at the difference.
 * The figure drifts at the same rate, nine octaves down.
 */
export const beatHz = (interval: Interval, tuning: Tuning) => {
  const [root, upper] = chordHz(interval, tuning)
  return Math.abs(interval.q * upper - interval.p * root)
}

/** '#ffb03b' → linear-light RGB, 0..1 */
export function linearRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.slice(1), 16)
  const c = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => {
    const s = v / 255
    return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4)
  })
  return [c[0], c[1], c[2]]
}

/**
 * A closed Lissajous figure for an interval as an SVG path, for the interval buttons: the shape
 * the two pendulums would draw if they never lost any swing.
 */
export function lissajousPath(interval: Interval, size = 32, pad = 3) {
  const r = size / 2 - pad
  const c = size / 2
  const steps = 240
  const pts: string[] = []
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * Math.PI * 2
    const x = c + r * Math.sin(interval.q * t + Math.PI / (2 * interval.p))
    const y = c + r * Math.sin(interval.p * t)
    pts.push(`${x.toFixed(2)} ${y.toFixed(2)}`)
  }
  return 'M' + pts.join('L') + 'Z'
}
