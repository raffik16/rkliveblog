// The director: a 64-bar loop at the set's tempo, everything a function of time. Eight phrases of eight bars, each a
// camera move written as a function of time and of where the dogs are; smooth blends between most of them and hard
// cuts on the bar where a VJ would cut (into the drop, and every two bars inside it). The attractor schedule, the
// teardown schedule (explode, slice) per dog, and the passes all count in bars, so they land on the downbeat.
import * as THREE from 'three'
import { easeInOutCubic, clamp01, easeOutExpo } from '../../teardown/kit/util.js'

export const BARS = 64
const V3 = THREE.Vector3
const ease = easeInOutCubic

/** The beat clock for a tempo: seconds per beat and per bar, and the loop's length. */
export function clock(bpm) {
  const beat = 60 / bpm
  return { bpm, beat, bar: beat * 4, loop: beat * 4 * BARS }
}

/** Where in the music time t is: bars into the loop, whole beats, and the kick, a 0..1 swell and decay on each beat. */
export function beatAt(t, ck) {
  const b = t / ck.beat
  const n = Math.floor(b)
  const ph = b - n
  // a short attack (a sixtieth of a second at 124 bpm) so nothing pops, then the decay
  const kick = Math.min(1, ph / 0.035) * Math.exp(-ph * 4.2)
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
// [bar, value]; a rise is an explosion (fast out, easeOutExpo), a fall a reassembly (eased both ways). Each dog comes
// apart in its own phrase, all three on the drop (bar 32), and all three again in the last phrase.
// prettier-ignore
const TEARDOWN = {
  chicago: {
    explode: [[0, 0], [9, 0], [10, 1], [14.5, 1], [16, 0], [32, 0], [32.5, 1], [38, 1], [40, 0], [57, 0], [58, 1], [62, 1], [63.5, 0]],
    slice: [[0, 0], [33, 0], [34.5, 1], [37.5, 1], [39, 0]],
  },
  ballpark: {
    explode: [[0, 0], [25, 0], [26, 1], [30.5, 1], [32, 0], [32.5, 1], [38, 1], [40, 0], [57, 0], [58, 1], [62, 1], [63.5, 0]],
    slice: [[0, 0], [25.5, 0], [27, 1], [30, 1], [31.5, 0], [57.5, 0], [59, 1], [61.5, 1], [63, 0]],
  },
  newyork: {
    explode: [[0, 0], [32, 0], [32.5, 1], [38, 1], [40, 0], [49, 0], [50, 1], [54.5, 1], [56, 0], [57, 0], [58, 1], [62, 1], [63.5, 0]],
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
      const e = v1 > v0 ? easeOutExpo(k) : ease(k)
      return v0 + (v1 - v0) * e
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

// each shot starts on a bar; fn gets (seconds into the shot, state, clock)
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
  {
    at: 32,
    name: 'drop',
    cut: true,
    // four views, a hard cut every two bars
    sub: [
      (t, s) =>
        dogShot(s, 'chicago', t, { side: 0.1, drift: 0.05, lift: -0.05, d0: 10, dE: 11, fov: 44 }),
      (t) => ({ p: orbit(ORIGIN, 34, -2.2 + 0.09 * t, 0.5), l: new V3(0, -2, 0), fov: 50 }),
      (t, s) =>
        dogShot(s, 'newyork', t, { side: -0.5, drift: -0.05, lift: 0.3, d0: 10, dE: 11, fov: 44 }),
      (t, s) =>
        dogShot(s, 'ballpark', t, { side: 0.6, drift: 0.05, lift: 0.5, d0: 11, dE: 10, fov: 44 }),
    ],
  },
  {
    at: 40,
    name: 'stave',
    cut: true,
    // just inside the ring of the stave, down the line of notes as they come round to the playhead, then craning
    // up over the phrase until the storm stands beyond them. Worked out in the stave's own frame (its ring is level
    // there), then taken out into the world.
    fn: (t, s, ck) => {
      const st = s.stave
      const k = ease(t / (8 * ck.bar))
      const a = st.playhead + 0.5 - 0.01 * t
      const r = st.radius - 2.2 - 1.2 * k
      const p = new V3(r * Math.cos(a), 1.1 + 3.2 * k + 0.25 * Math.sin(t * 0.4), r * Math.sin(a))
      const a2 = a - 0.42 - 0.08 * k
      const lr = st.radius - 0.8 - 12 * k
      const l = new V3(lr * Math.cos(a2), 0.3 + 4 * k, lr * Math.sin(a2))
      return { p: p.applyMatrix4(st.matrix), l: l.applyMatrix4(st.matrix), fov: 54 }
    },
  },
  {
    at: 48,
    name: 'newyork',
    cut: true,
    fn: (t, s) => dogShot(s, 'newyork', t, { side: 0.25, drift: 0.035 }),
  },
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

const BLEND = 3.2 // seconds
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

// a shot's frame at loop bars `bars` (shotIndex i), seconds into it from its own start
function frameOf(i, bars, s, ck) {
  const sh = SHOTS[i]
  const t = (bars - sh.at) * ck.bar
  if (sh.sub) {
    const k = Math.max(0, Math.min(sh.sub.length - 1, Math.floor((bars - sh.at) / 2)))
    const ts = (bars - sh.at - 2 * k) * ck.bar
    return pick(sh.sub[k](ts + 2, s, ck))
  }
  return pick(sh.fn(t, s, ck))
}

export function shotAt(bars, s, ck, reduced = false) {
  let i = SHOTS.length - 1
  while (i > 0 && SHOTS[i].at > bars) i--
  const cur = SHOTS[i]
  const ni = (i + 1) % SHOTS.length
  const next = SHOTS[ni]
  const nextAt = i + 1 < SHOTS.length ? next.at : BARS
  let out = frameOf(i, bars, s, ck)
  let name = cur.name
  // smooth blends start a little before the next shot's bar; cuts land on it (with reduced motion, cuts into a
  // shot blend too)
  const blendBars = BLEND / ck.bar
  if (!(next.cut && !reduced) && !cur.sub && bars > nextAt - blendBars) {
    const w = ease((bars - (nextAt - blendBars)) / blendBars)
    const nb = i + 1 < SHOTS.length ? bars : bars - BARS
    // the next shot as if it had already started (its fn reads negative seconds fine)
    const nf = frameOf(ni, Math.max(nb, next.at - blendBars), s, ck)
    out = mixShot(out, nf, w)
    if (w > 0.5) name = next.name
  }
  return { ...out, name }
}

// ------------------------------------------------------------------ passes
const bump = (x, a, b, ramp) => clamp01(Math.min((x - a) / ramp, (b - x) / ramp))
export function fxAt(bars, beat, reduced) {
  const morph = attractorAt(bars)
  const drop = bars >= 32 && bars < 40 ? 1 - 0.5 * clamp01((bars - 38) / 2) : 0
  const kick = reduced ? 0 : beat.kick
  // a swell on the first beat of every eight-bar phrase
  const phrase = reduced ? 0 : Math.floor(bars) % 8 === 0 ? Math.exp(-(bars % 1) * 4 * 1.6) : 0
  // the kaleidoscope: the last phrase, and two bars in the middle of the drop
  const kal = ease(bump(bars, 56.5, 63.2, 1.2)) + (bars >= 36 && bars < 38 ? 0.9 : 0)
  return {
    chaos: 1.35 * morph.k + 0.7 * drop,
    kaleido: reduced ? 0 : Math.min(1, kal),
    seg: bars >= 36 && bars < 38 ? 8 : 6,
    aberration: reduced ? 0 : 0.0012 * morph.k + 0.0016 * drop * (0.4 + 0.6 * kick),
    bloom: 0.5 + 0.16 * kick + 0.14 * drop + 0.22 * phrase + 0.1 * morph.k,
    exposure: 1 + 0.05 * kick + 0.12 * phrase,
    // the dogs bounce to the kick
    bounce: kick * (0.6 + 0.4 * drop),
  }
}
