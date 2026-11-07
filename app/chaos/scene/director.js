// The director: one two-minute loop, everything a function of loop time. Eight shots, each a camera move written as
// a function of time and of where the machines are, blended into each other over five seconds; the attractor
// schedule (hold, then a six-second morph into the next); and the cues for the passes that only show up now and
// then (the colour fringing during a morph, the kaleidoscope before the finale).
import * as THREE from 'three'
import { LOOP } from './machines.js'
import { easeInOutCubic, clamp01 } from '../teardown/kit/util.js'

const V3 = THREE.Vector3

// ------------------------------------------------------------------ attractors
// morph windows: [start, end, from, to]; between them the 'from' of the next one holds
export const MORPHS = [
  [12, 18, 0, 1],
  [36, 42, 1, 2],
  [60, 66, 2, 3],
  [84, 90, 3, 4],
  [108, 114, 4, 0],
]
export function attractorAt(tau) {
  for (const [a, b, from, to] of MORPHS) {
    if (tau < a) return { a: from, b: from, m: 0, k: 0 }
    if (tau < b)
      return {
        a: from,
        b: to,
        m: (tau - a) / (b - a),
        k: Math.sin((Math.PI * (tau - a)) / (b - a)),
      }
  }
  return { a: MORPHS[0][2], b: MORPHS[0][2], m: 0, k: 0 }
}

// a 0..1 bump that rises over `ramp` seconds into [a, b] and falls over `ramp` out of it
const bump = (t, a, b, ramp) => clamp01(Math.min((t - a) / ramp, (b - t) / ramp) + 0)
const ease = easeInOutCubic

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

// each shot: (tau, machine state) -> {p, l, fov, up}
const SHOTS = [
  {
    at: 0,
    name: 'wide',
    fn: (t) => ({
      p: orbit(ORIGIN, 31 - 0.1 * t, 0.95 + 0.03 * t, 0.3 - 0.004 * t),
      l: new V3(0, -0.8, 0),
      fov: 40,
    }),
  },
  {
    at: 15,
    name: 'storm',
    fn: (t) => {
      const a = 0.16 * (t - 15) + 1.6
      const p = new V3(6.2 * Math.cos(a), 1.8 * Math.sin(0.35 * t), 6.2 * Math.sin(a))
      const l = new V3(3 * Math.cos(a + 1.05), 0.4, 3 * Math.sin(a + 1.05))
      return { p, l, fov: 60 }
    },
  },
  {
    at: 30,
    name: 'v8',
    fn: (t, s) => {
      const c = s.centre.v8
      const d = 7.4 + 4.2 * s.explode.v8
      // from outside the ring looking in: the storm stands behind the engine
      return {
        p: orbit(c, d, azOf(c) + 0.75 - 0.05 * (t - 30), 0.2 + 0.006 * (t - 30)),
        l: c.clone().multiplyScalar(0.92),
        fov: 38,
      }
    },
  },
  {
    at: 45,
    name: 'beast',
    fn: (t, s) => {
      const c = s.centre.beast
      const phi = s.beastPhi
      const radial = new V3(Math.cos(phi), 0, Math.sin(phi))
      const tangent = new V3(-Math.sin(phi), 0, Math.cos(phi))
      const d = 1 + 0.8 * s.explode.beast
      const p = c
        .clone()
        .addScaledVector(radial, 9 * d)
        .addScaledVector(tangent, 5 * d)
        .add(new V3(0, 1.3 + 0.04 * (t - 45), 0))
      const l = c
        .clone()
        .addScaledVector(radial, -1.5)
        .add(new V3(0, 0.6, 0))
      return { p, l, fov: 40 }
    },
  },
  {
    at: 60,
    name: 'above',
    fn: (t) => {
      const a = 0.05 * (t - 60) + 0.4
      return {
        p: new V3(1.5 * Math.cos(a), 34 - 0.2 * (t - 60), 1.5 * Math.sin(a)),
        l: new V3(0, -2, 0),
        fov: 46,
        up: new V3(Math.cos(a + 2.2), 0, Math.sin(a + 2.2)),
      }
    },
  },
  {
    at: 75,
    name: 'gear',
    fn: (t, s) => {
      const c = s.centre.gear
      const d = 6.6 + 3.4 * s.explode.gear
      return {
        p: orbit(c, d, azOf(c) - 0.8 + 0.05 * (t - 75), 0.1 + 0.012 * (t - 75)),
        l: c.clone().multiplyScalar(0.92),
        fov: 38,
      }
    },
  },
  {
    at: 90,
    name: 'multiverse',
    fn: (t) => {
      const a = 0.11 * (t - 90) - 0.6
      const roll = 0.35 * Math.sin(0.25 * (t - 90))
      return {
        p: orbit(ORIGIN, 20, a, 0.35 * Math.sin(0.2 * (t - 90)) + 0.12),
        l: new V3(0, 0, 0),
        fov: 44,
        up: new V3(Math.sin(roll), Math.cos(roll), 0),
      }
    },
  },
  {
    at: 105,
    name: 'all',
    fn: (t) => {
      const k = ease((t - 105) / 15)
      // lands on the opening shot's own path, so the loop closes without a seam
      return {
        p: orbit(
          ORIGIN,
          20 + 11 * k,
          0.95 - 0.03 * (120 - t) + 0.55 * (1 - k),
          0.3 + 0.1 * (1 - k)
        ),
        l: new V3(0, -0.8 * k, 0),
        fov: 40 + 6 * (1 - k),
      }
    },
  },
]

const BLEND = 5
const pick = (s) => ({ p: s.p, l: s.l, fov: s.fov, up: s.up || UP })
const mixShot = (a, b, w) => ({
  p: a.p.clone().lerp(b.p, w),
  l: a.l.clone().lerp(b.l, w),
  fov: a.fov + (b.fov - a.fov) * w,
  up: a.up.clone().lerp(b.up, w).normalize(),
})

export function shotAt(tau, s) {
  let i = SHOTS.length - 1
  while (i > 0 && SHOTS[i].at > tau) i--
  const cur = SHOTS[i]
  const nextAt = i + 1 < SHOTS.length ? SHOTS[i + 1].at : LOOP
  const prev = SHOTS[(i + SHOTS.length - 1) % SHOTS.length]
  const next = SHOTS[(i + 1) % SHOTS.length]
  const here = pick(cur.fn(tau, s))
  let out = here
  let name = cur.name
  if (tau < cur.at + BLEND / 2) {
    // blending in from the previous shot (the first shot's previous is the last, a loop earlier)
    const tp = i === 0 ? tau + LOOP : tau
    const w = ease((tau - (cur.at - BLEND / 2)) / BLEND)
    out = mixShot(pick(prev.fn(tp, s)), here, w)
  } else if (tau > nextAt - BLEND / 2) {
    const tn = i === SHOTS.length - 1 ? tau - LOOP : tau
    const w = ease((tau - (nextAt - BLEND / 2)) / BLEND)
    out = mixShot(here, pick(next.fn(tn, s)), w)
    if (w > 0.5) name = next.name
  }
  return { ...out, name }
}

// ------------------------------------------------------------------ passes
export function fxAt(tau) {
  const morph = attractorAt(tau)
  const kaleido = ease(bump(tau, 91, 103.5, 2.5))
  const finale = bump(tau, 103, 114, 3)
  return {
    chaos: 1.35 * morph.k,
    kaleido,
    // a trace of colour fringing toward the edges while the storm is loose, never enough to soften the frame
    aberration: 0.0012 * morph.k + 0.0007 * finale,
    bloom: 0.55 + 0.2 * finale + 0.12 * morph.k,
  }
}

// ------------------------------------------------------------------ captions
export function titleAt(tau) {
  return ease(bump(tau, 1.2, 10.5, 1.8))
}
/** Captions dip out across each shot change and come back once the new shot has settled. */
export function captionAt(tau) {
  let d = Infinity
  for (const s of SHOTS)
    d = Math.min(d, Math.abs(tau - s.at), Math.abs(tau - s.at - LOOP), Math.abs(tau - s.at + LOOP))
  return ease(clamp01((d - 1.6) / 1.4))
}
