// The world a dream is painted from: one flat record of colours and amounts. Each chapter of a
// life sets two of these (how it starts and how it ends) and the director blends between them,
// so a summer morning can turn into a night bus without anything ever cutting.

export type Vec3 = [number, number, number]

export const hex = (value: string): Vec3 => {
  const n = parseInt(value.slice(1), 16)
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255]
}

const COLOURS = ['skyTop', 'skyHor', 'sun', 'fog', 'landFar', 'landNear', 'sea', 'cloud'] as const

const AMOUNTS = [
  // the sun: where it is, how big the disc is, how much light it throws
  'sunX',
  'sunY',
  'sunSize',
  'sunGlow',
  // where the sky meets the ground, in screen units (the screen runs from -1 to 1 top to bottom)
  'horizon',
  // the sky
  'moon',
  'stars',
  'clouds',
  // the land: far hills, a far city, a near city, how many windows are lit
  'hills',
  'city',
  'cityNear',
  'windows',
  // water instead of a meadow, the house by it, tall grass in front
  'water',
  'house',
  'grass',
  // what is in the air
  'seeds',
  'flies',
  'rain',
  'snow',
  'leaves',
  // how it is seen: the dream's wobble, the dark edges, the brightness, the drift past
  'warp',
  'vignette',
  'exposure',
  'travel',
] as const

type ColourName = (typeof COLOURS)[number]
type AmountName = (typeof AMOUNTS)[number]

export type WorldKey = Record<ColourName, Vec3> & Record<AmountName, number>

/** How a chapter writes a key: colours as hex, everything left out is taken from BASE */
export type KeySpec = Partial<Record<ColourName, string> & Record<AmountName, number>>

// Nothing: a dark, empty dream with the sun below the ground
const BASE_SPEC: Required<KeySpec> = {
  skyTop: '#05030a',
  skyHor: '#0c0714',
  sun: '#ffd0a0',
  fog: '#140c1e',
  landFar: '#0a0610',
  landNear: '#06040a',
  sea: '#0a0c18',
  cloud: '#2a1e3a',
  sunX: 0,
  sunY: -0.8,
  sunSize: 0,
  sunGlow: 0,
  horizon: -0.12,
  moon: 0,
  stars: 0,
  clouds: 0,
  hills: 0,
  city: 0,
  cityNear: 0,
  windows: 0,
  water: 0,
  house: 0,
  grass: 0,
  seeds: 0,
  flies: 0,
  rain: 0,
  snow: 0,
  leaves: 0,
  warp: 0.15,
  vignette: 0.6,
  exposure: 1,
  travel: 0,
}

export const emptyKey = (): WorldKey => {
  const out = {} as WorldKey
  for (const name of COLOURS) out[name] = [0, 0, 0]
  for (const name of AMOUNTS) out[name] = 0
  return out
}

export function copyKey(from: WorldKey, out: WorldKey = emptyKey()): WorldKey {
  for (const name of COLOURS) {
    out[name][0] = from[name][0]
    out[name][1] = from[name][1]
    out[name][2] = from[name][2]
  }
  for (const name of AMOUNTS) out[name] = from[name]
  return out
}

/** A full key from a chapter's spec, on top of `base` (BASE when left out) */
export function makeKey(spec: KeySpec, base?: WorldKey): WorldKey {
  const out = base ? copyKey(base) : copyKey(BASE)
  for (const name of COLOURS) {
    const value = spec[name]
    if (value) out[name] = hex(value)
  }
  for (const name of AMOUNTS) {
    const value = spec[name]
    if (value !== undefined) out[name] = value
  }
  return out
}

/** a → b by t, written into out (no allocation: this runs every frame) */
export function mixKey(a: WorldKey, b: WorldKey, t: number, out: WorldKey): WorldKey {
  const s = 1 - t
  for (const name of COLOURS) {
    const x = a[name]
    const y = b[name]
    const o = out[name]
    o[0] = x[0] * s + y[0] * t
    o[1] = x[1] * s + y[1] * t
    o[2] = x[2] * s + y[2] * t
  }
  for (const name of AMOUNTS) out[name] = a[name] * s + b[name] * t
  return out
}

export function mixColour(target: Vec3, towards: Vec3, t: number) {
  target[0] += (towards[0] - target[0]) * t
  target[1] += (towards[1] - target[1]) * t
  target[2] += (towards[2] - target[2]) * t
}

export const BASE: WorldKey = (() => {
  const out = emptyKey()
  for (const name of COLOURS) out[name] = hex(BASE_SPEC[name])
  for (const name of AMOUNTS) out[name] = BASE_SPEC[name]
  return out
})()

export const smooth = (t: number) => {
  const x = Math.min(1, Math.max(0, t))
  return x * x * (3 - 2 * x)
}

/** 0 before a, 1 after b, eased between (either way round) */
export const ramp = (a: number, b: number, x: number) => smooth((x - a) / (b - a))
