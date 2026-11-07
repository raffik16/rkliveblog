// The director: a 64-bar loop at the set's tempo, everything a function of time. Eleven shots, each a camera move
// written as a function of time and of where the dogs are, and every change between them a blend: the camera travels
// from one to the next, it never cuts. The attractor schedule, the teardown schedule (explode, slice) per dog, and the
// passes all count in bars, so they land on the downbeat; every one of them eases in and out, with no step anywhere
// in the loop (the loop's own seam included), so nothing on screen jumps.
import * as THREE from 'three'
import { clamp01 } from '../../teardown/kit/util.js'

export const BARS = 64
const V3 = THREE.Vector3

// smoothstep and smootherstep: zero speed at both ends (smootherstep: zero acceleration too)
const smooth = (x) => {
  const k = clamp01(x)
  return k * k * (3 - 2 * k)
}
export const smoother = (x) => {
  const k = clamp01(x)
  return k * k * k * (k * (k * 6 - 15) + 10)
}
// an explosion: leaves quickly but from rest, then settles
const burst = (x) => 1 - Math.pow(1 - smooth(x), 3)
// 0 before a, up to 1 by b, held, down to 0 between c and d
const envelope = (x, a, b, c, d) => smoother((x - a) / (b - a)) * (1 - smoother((x - c) / (d - c)))

/** The beat clock for a tempo: seconds per beat and per bar, and the loop's length. */
export function clock(bpm) {
  const beat = 60 / bpm
  return { bpm, beat, bar: beat * 4, loop: beat * 4 * BARS }
}

// The kick: a swell over the first tenth of the beat and a decay that reaches exactly zero as the next beat starts, so
// the pulse is continuous from beat to beat.
const KICK_DECAY = 3.4
const KICK_TAIL = Math.exp(-KICK_DECAY)
/** Where in the music time t is: bars into the loop, beats so far, and the kick (0..1) of this beat. */
export function beatAt(t, ck) {
  const b = t / ck.beat
  const n = Math.floor(b)
  const ph = b - n
  const kick = smooth(ph / 0.1) * ((Math.exp(-ph * KICK_DECAY) - KICK_TAIL) / (1 - KICK_TAIL))
  const bars = (((b / 4) % BARS) + BARS) % BARS
  return { beats: b, n, ph, kick, bars }
}

// ------------------------------------------------------------------ attractors (bars)
const MORPHS = [
  [12, 15, 0, 1],
  [24, 27, 1, 2],
  [36, 39, 2, 3],
  [46, 49, 3, 4],
  [59, 62, 4, 0],
]
export function attractorAt(bars) {
  for (const [a, b, from, to] of MORPHS) {
    if (bars < a) return { a: from, b: from, m: 0, k: 0 }
    if (bars < b)
      return {
        a: from,
        b: to,
        m: (bars - a) / (b - a),
        k: Math.sin((Math.PI * (bars - a)) / (b - a)),
      }
  }
  return { a: MORPHS[0][2], b: MORPHS[0][2], m: 0, k: 0 }
}

// ------------------------------------------------------------------ teardowns (bars)
// [bar, value]; a rise is an explosion (burst), a fall a reassembly (smootherstep). Each dog comes apart in its own
// phrase, all three on the drop (bar 32), and all three again in the last phrase.
// prettier-ignore
const TEARDOWN = {
  chicago: {
    explode: [[0, 0], [9, 0], [10, 1], [14.5, 1], [16, 0], [32, 0], [33, 1], [38, 1], [40, 0], [57, 0], [58, 1], [62, 1], [63.5, 0]],
    slice: [[0, 0], [33, 0], [34.5, 1], [37.5, 1], [39, 0]],
  },
  ballpark: {
    explode: [[0, 0], [25, 0], [26, 1], [30.5, 1], [32, 0], [33, 1], [38, 1], [40, 0], [57, 0], [58, 1], [62, 1], [63.5, 0]],
    slice: [[0, 0], [25.5, 0], [27, 1], [30, 1], [31.5, 0], [57.5, 0], [59, 1], [61.5, 1], [63, 0]],
  },
  newyork: {
    explode: [[0, 0], [32, 0], [33, 1], [38, 1], [40, 0], [49, 0], [50, 1], [54.5, 1], [56, 0], [57, 0], [58, 1], [62, 1], [63.5, 0]],
    slice: [[0, 0], [50, 0], [51.5, 1], [54, 1], [55.5, 0]],
  },
}
function track(keys, x) {
  if (x <= keys[0][0]) return keys[0][1]
  for (let i = 0; i < keys.length - 1; i++) {
    const [x0, v0] = keys[i]
    const [x1, v1] = keys[i + 1]
    if (x <= x1) {
      if (x1 === x0) return v1
      const k = (x - x0) / (x1 - x0)
      return v0 + (v1 - v0) * (v1 > v0 ? burst(k) : smoother(k))
    }
  }
  return keys[keys.length - 1][1]
}
export function teardownAt(bars) {
  const out = {}
  for (const [k, v] of Object.entries(TEARDOWN))
    out[k] = { explode: track(v.explode, bars), slice: track(v.slice, bars) }
  return out
}

// ------------------------------------------------------------------ shots
const orbit = (c, dist, az, el, out = new V3()) =>
  out.set(
    c.x + dist * Math.cos(el) * Math.cos(az),
    c.y + dist * Math.sin(el),
    c.z + dist * Math.cos(el) * Math.sin(az)
  )
const ORIGIN = new V3(0, 0, 0)
const UP = new V3(0, 1, 0)
const azOf = (p) => Math.atan2(p.z, p.x)

// a dog seen broadside from outside the ring: the storm stands behind it. side swings the camera round the dog.
function dogShot(
  s,
  key,
  t,
  { side = 0.35, drift = 0.035, lift = 0.16, d0 = 11, dE = 18, fov = 38 } = {}
) {
  const c = s.centre[key]
  const e = s.explode[key]
  const az = azOf(c) + side + drift * t
  const d = d0 + dE * e + 3 * s.slice[key] * (1 - e)
  // whole, the dog's middle is a little below the frank; exploded, the stack's middle is above it
  const look = c
    .clone()
    .multiplyScalar(0.9)
    .add(new V3(0, -0.6 + 2 * e, 0))
  return { p: orbit(look, d, az, lift + 0.1 * e), l: look, fov }
}

// Each shot starts on a bar; fn gets (seconds into the shot, state, clock), and reads negative seconds fine (a shot
// is already moving while the camera blends into it). blend: seconds the camera takes to travel into this shot.
const SHOTS = [
  {
    at: 0,
    name: 'wide',
    fn: (t) => ({
      p: orbit(ORIGIN, 33 - 0.06 * t, 0.95 + 0.028 * t, 0.3 - 0.002 * t),
      l: new V3(0, -1.2, 0),
      fov: 42,
    }),
  },
  { at: 8, name: 'chicago', fn: (t, s) => dogShot(s, 'chicago', t, { side: 0.42, drift: -0.03 }) },
  {
    at: 16,
    name: 'storm',
    fn: (t) => {
      const a = 0.14 * t + 1.6
      const p = new V3(6.4 * Math.cos(a), 1.6 * Math.sin(0.3 * t), 6.4 * Math.sin(a))
      const l = new V3(3 * Math.cos(a + 1.05), 0.4, 3 * Math.sin(a + 1.05))
      return { p, l, fov: 62 }
    },
  },
  {
    at: 24,
    name: 'ballpark',
    fn: (t, s) => dogShot(s, 'ballpark', t, { side: -0.3, drift: 0.03, lift: 0.1 }),
  },
  // the drop: four views two bars apart, the camera always sweeping on to the next
  {
    at: 32,
    name: 'drop-chicago',
    fn: (t, s) =>
      dogShot(s, 'chicago', t + 2, {
        side: 0.1,
        drift: 0.05,
        lift: -0.05,
        d0: 10,
        dE: 11,
        fov: 44,
      }),
  },
  {
    at: 34,
    name: 'drop-wide',
    blend: 3.4,
    fn: (t) => ({ p: orbit(ORIGIN, 34, -2.0 + 0.09 * t, 0.5), l: new V3(0, -2, 0), fov: 50 }),
  },
  {
    at: 36,
    name: 'drop-newyork',
    blend: 3.4,
    fn: (t, s) =>
      dogShot(s, 'newyork', t + 2, {
        side: -0.5,
        drift: -0.05,
        lift: 0.3,
        d0: 10,
        dE: 11,
        fov: 44,
      }),
  },
  {
    at: 38,
    name: 'drop-ballpark',
    blend: 3.4,
    fn: (t, s) =>
      dogShot(s, 'ballpark', t + 2, { side: 0.6, drift: 0.05, lift: 0.5, d0: 11, dE: 10, fov: 44 }),
  },
  {
    at: 40,
    name: 'stave',
    // just inside the ring of the stave, down the line of notes as they come round to the playhead, then craning
    // up over the phrase until the storm stands beyond them. Worked out in the stave's own frame (its ring is level
    // there), then taken out into the world.
    fn: (t, s, ck) => {
      const st = s.stave
      const k = smoother(t / (8 * ck.bar))
      const a = st.playhead + 0.5 - 0.01 * t
      const r = st.radius - 2.2 - 1.2 * k
      const p = new V3(r * Math.cos(a), 1.1 + 3.2 * k + 0.25 * Math.sin(t * 0.4), r * Math.sin(a))
      const a2 = a - 0.42 - 0.08 * k
      const lr = st.radius - 0.8 - 12 * k
      const l = new V3(lr * Math.cos(a2), 0.3 + 4 * k, lr * Math.sin(a2))
      return { p: p.applyMatrix4(st.matrix), l: l.applyMatrix4(st.matrix), fov: 54 }
    },
  },
  { at: 48, name: 'newyork', fn: (t, s) => dogShot(s, 'newyork', t, { side: 0.25, drift: 0.035 }) },
  {
    at: 56,
    name: 'kaleido',
    // starts between the New York dog and the Chicago dog, high enough to pass over them
    fn: (t) => {
      const a = 0.1 * t + 0.45
      const roll = 0.35 * Math.sin(0.25 * t)
      return {
        p: orbit(ORIGIN, 24, a, 0.22 * Math.sin(0.2 * t) + 0.36),
        l: new V3(0, 0, 0),
        fov: 46,
        up: new V3(Math.sin(roll), Math.cos(roll), 0),
      }
    },
  },
]

const BLEND = 4.5 // seconds, unless a shot says otherwise
const pick = (s) => ({ p: s.p, l: s.l, fov: s.fov, up: s.up || UP })
// Between two shots the camera travels round the room, not across it: radius, bearing and height are blended (the
// short way round), with a lift in the middle. A straight line from one side of the ring to the other runs through
// whatever stands on it.
const TAU = Math.PI * 2
function mixPos(a, b, w, out = new V3()) {
  const ra = Math.hypot(a.x, a.z)
  const rb = Math.hypot(b.x, b.z)
  const aa = Math.atan2(a.z, a.x)
  let da = Math.atan2(b.z, b.x) - aa
  da = ((((da + Math.PI) % TAU) + TAU) % TAU) - Math.PI
  const r = ra + (rb - ra) * w
  const az = aa + da * w
  const lift = Math.sin(Math.PI * w) * Math.min(7, a.distanceTo(b) * 0.25)
  return out.set(r * Math.cos(az), a.y + (b.y - a.y) * w + lift, r * Math.sin(az))
}
const mixShot = (a, b, w) => ({
  p: mixPos(a.p, b.p, w),
  l: a.l.clone().lerp(b.l, w),
  fov: a.fov + (b.fov - a.fov) * w,
  up: a.up.clone().lerp(b.up, w).normalize(),
})

const frameOf = (i, bars, s, ck) => pick(SHOTS[i].fn((bars - SHOTS[i].at) * ck.bar, s, ck))

/** The camera at loop bars `bars`: {p, l, fov, up, name}. */
export function shotAt(bars, s, ck) {
  let i = SHOTS.length - 1
  while (i > 0 && SHOTS[i].at > bars) i--
  const ni = (i + 1) % SHOTS.length
  const next = SHOTS[ni]
  const nextAt = i + 1 < SHOTS.length ? next.at : BARS
  let out = frameOf(i, bars, s, ck)
  let name = SHOTS[i].name
  // the blend into the next shot runs over the last `blend` seconds before its bar, with smootherstep weights
  const blendBars = (next.blend || BLEND) / ck.bar
  if (bars > nextAt - blendBars) {
    const w = smoother((bars - (nextAt - blendBars)) / blendBars)
    // past the loop's end, the first shot is read a loop earlier
    const nb = i + 1 < SHOTS.length ? bars : bars - BARS
    out = mixShot(out, frameOf(ni, nb, s, ck), w)
    if (w > 0.5) name = next.name
  }
  return { ...out, name }
}

// ------------------------------------------------------------------ passes
export function fxAt(bars, beat, reduced) {
  const morph = attractorAt(bars)
  // the drop's extra energy: rises over the bar before it, falls away over its last two bars
  const drop = envelope(bars, 31.5, 32.5, 38, 40)
  const kick = reduced ? 0 : beat.kick
  // a swell at the top of every eight-bar phrase, eased in over a sixteenth note so it never flashes
  const pb = bars % 8
  const phrase = reduced ? 0 : smooth(pb / 0.06) * Math.exp(-pb * 2.2)
  // the kaleidoscope blooms out from the middle of the frame and folds back into it: two bars in the drop, and the
  // last phrase. kaleido is how far it has opened (0 closed, 1 covering the frame).
  const kal = Math.max(
    envelope(bars, 35.4, 36.6, 37.4, 38.8) * 0.85,
    envelope(bars, 56, 58.5, 61, 63.6)
  )
  return {
    chaos: 1.35 * morph.k + 0.7 * drop,
    kaleido: reduced ? 0 : kal,
    aberration: reduced ? 0 : 0.0012 * morph.k + 0.0014 * drop * (0.6 + 0.4 * kick),
    bloom: 0.5 + 0.1 * kick + 0.12 * drop + 0.15 * phrase + 0.1 * morph.k,
    exposure: 1 + 0.03 * kick + 0.07 * phrase,
    // the dogs bounce to the kick
    bounce: kick * (0.6 + 0.4 * drop),
  }
}
