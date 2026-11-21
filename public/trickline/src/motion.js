// The run as a function of world time tau: where the rider, the board and everyone else are. No meshes and no
// DOM here (three.js maths only), so the clearance sweep runs it in Node.
//
// The timetable is solved once from the plaza's geometry: the pushes on the upper terrace bring R-07 to S1, every
// air is a ballistic arc of the pelvis (g = 9.81) between a pop and a landing that are set by the spot, and the
// rail's lock is placed where the board meets the rail dropping 0.6 m/s faster than the rail falls, which the
// legs take up as the hangers lock on.
//
//   RUN                     the solved timetable (times, places, speeds, every air's numbers)
//   heroAt(tau)             -> {pose, board: {pos, quat}, speed, phase, flip: {phi, psi, theta}, ...}
//   secondAt(tau)           R-02 carving its loop on the lower plaza
//   filmerAt(tau, heroPos)  F-01 on the lower plaza, aiming the camera at R-07
//   watchersAt(tau, heroPos) two people on the middle terrace's bench
//
// A pose is what rider.js's pose() takes: {pelvis, side, up, twist, lean, bank, look, feet, hands}.
import * as THREE from 'three'
import { BOARD, BODY, PLAZA, RAIL_SLOPE, railTop, surfaceAt } from './layout.js'

export const G = 9.81
const GRIP = BOARD.grip
const ALPHA = RAIL_SLOPE
const HANG_V = BOARD.hanger / Math.cos(ALPHA) // the grip over the rail top, straight up, in a 50-50
const RAIL_Z = PLAZA.rail.z
const DECEL = 0.1 // rolling on smooth paving
// leg extension: the pelvis's height over the grip it stands on
export const E = {
  ride: 0.88,
  pop: 0.82,
  crouch: 0.6,
  tuck: 0.6,
  land: 0.84,
  lock: 0.72,
  grind: 0.66,
  off: 0.84,
}
const SHIFT_T = -0.02 // the pelvis sits this far behind the board's middle
const SHIFT_N = -0.03 // and this far toward the heel side
// A push: 4 m/s^2 while the foot is down, for no more than 0.46 s and no longer than a 0.72 m stroke (what the
// leg reaches either side of the hip), the foot down 0.27 m beside the board's toe edge. The standing leg bends
// 12 cm so the other one reaches the ground.
export const PUSH = {
  a: 4.0,
  stroke: 0.72,
  tmax: 0.46,
  lead: 0.16,
  ret: 0.34,
  between: 0.12,
  dip: 0.12,
  side: 0.27,
  hip: 0.07,
}
// The lock on the rail: the board's middle meets it at x 5.1, dropping 0.6 m/s faster than the rail falls (the legs
// take that up). The board stays clear of the rail on its toe side until 0.185 s before the lock, crosses over it
// in the next 0.115 s, and the legs hold their tuck until 0.12 s before the lock, then reach down to it.
export const LOCK = { x: 5.1, dv: 0.6, cross: [0.185, 0.07], hold: -0.585, reach: 0.12 }

const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x))
const smooth = (x) => {
  const u = clamp(x)
  return u * u * (3 - 2 * u)
}
const smoother = (x) => {
  const u = clamp(x)
  return u * u * u * (u * (u * 6 - 15) + 10)
}
const ss = (a, b, t) => smoother((t - a) / (b - a))
const lerp = (a, b, k) => a + (b - a) * k
/** 0 outside (a, b), rising to 1 in the middle, smooth at both ends */
const bump = (a, b, t) => {
  const u = (t - a) / (b - a)
  return u <= 0 || u >= 1 ? 0 : Math.sin(Math.PI * u) ** 2
}
const herm = (p0, m0, p1, m1, s) => {
  const s2 = s * s
  const s3 = s2 * s
  return (
    (2 * s3 - 3 * s2 + 1) * p0 + (s3 - 2 * s2 + s) * m0 + (-2 * s3 + 3 * s2) * p1 + (s3 - s2) * m1
  )
}
/** a free flip's angle: close to a steady spin, eased where the flick starts it and the feet stop it */
const spin = (s) => lerp(clamp(s), smoother(s), 0.55)

const V = (x = 0, y = 0, z = 0) => new THREE.Vector3(x, y, z)
const AX = V(1, 0, 0)
const AY = V(0, 1, 0)
const AZ = V(0, 0, 1)
const Tdir = (h) => V(Math.cos(h), 0, -Math.sin(h))
const Ndir = (h) => V(Math.sin(h), 0, Math.cos(h))
const qa = (axis, a) => new THREE.Quaternion().setFromAxisAngle(axis, a)
const BODY_REACH = BODY.thigh + BODY.shin - 0.012
const BODY_ANKLE = BODY.ankle

// ------------------------------------------------------------------------------------------- the pop's geometry
// The back foot snaps the tail down and the board turns about its back axle (the back wheels keep rolling)
// until the tail touches the ground: that angle is the pop (31 degrees for this board).
const AXLE = { x: -BOARD.truckX, y: BOARD.axleY } // the back axle in the board's frame
/** the board's middle relative to the back axle, pitched nose-up by th, in the (T, U) plane */
const pivotOffset = (th) => [
  -AXLE.x * Math.cos(th) + AXLE.y * Math.sin(th),
  -AXLE.x * Math.sin(th) - AXLE.y * Math.cos(th),
]
export const POP = (() => {
  const a = BOARD.kickAngle
  // the tail's tip, underneath: the kick's top edge less the deck's thickness along the kick's normal
  const tip = [
    -(BOARD.flat + BOARD.kick * Math.cos(a)) - BOARD.deck * Math.sin(a) - AXLE.x,
    BOARD.kick * Math.sin(a) - BOARD.deck * Math.cos(a) - AXLE.y,
  ]
  // the tip's height over the axle, turned by th, reaches -wheelR (the ground)
  let lo = 0
  let hi = 1.2
  for (let i = 0; i < 60; i++) {
    const th = (lo + hi) / 2
    const y = tip[0] * Math.sin(th) + tip[1] * Math.cos(th)
    if (y > -BOARD.wheelR) lo = th
    else hi = th
  }
  const pitch = (lo + hi) / 2
  const [cx, cy] = pivotOffset(pitch)
  // where the pivoted middle sits relative to the level one: back along T, up
  return { pitch, lead: 0.07, dx: AXLE.x + cx, dy: BOARD.wheelR + cy - GRIP }
})()

// ------------------------------------------------------------------------------------------- foot spots on the deck
// x along the board (toward the rider's front foot), z toward the toes, yaw of the toes toward +x
const FOOT = {
  front: { x: 0.17, z: 0.0, yaw: 0.6 },
  back: { x: -0.22, z: 0.0, yaw: -0.12 },
  tail: { x: -0.355, z: 0.02, yaw: 0.05 },
  push: { x: 0.12, z: 0.03, yaw: 1.32 },
  kick: { x: 0.06, z: -0.04, yaw: 0.75 }, // kickflip setup: behind the bolts, angled
  heel: { x: 0.1, z: 0.07, yaw: 0.25 }, // heelflip setup: toes over the toe edge
  hard: { x: 0.12, z: -0.03, yaw: 0.55 },
  tailToe: { x: -0.35, z: 0.05, yaw: 0.1 }, // the toe-side corner of the tail, for a frontside scoop
  grindF: { x: 0.2, z: 0.0, yaw: 0.45 },
  grindB: { x: -0.21, z: 0.0, yaw: -0.1 },
}
/** where a sole centred at x rests on the deck: on the flat, on a kick (19 degrees up past the flat middle), or
 *  across the bend between them, its heel on the flat and its toe on the kick. Height and normal, board frame. */
function deckFoot(x, yaw) {
  const a = BOARD.kickAngle
  const l = 0.1375 * Math.abs(Math.sin(yaw)) + 0.059 * Math.abs(Math.cos(yaw)) // the sole's reach along the board
  const ax = Math.abs(x)
  const sg = Math.sign(x) || 1
  const over = ax + l - BOARD.flat
  if (over <= 0) return { y: 0, n: [0, 1] }
  if (ax - l >= BOARD.flat)
    return { y: (ax - BOARD.flat) * Math.tan(a), n: [-sg * Math.sin(a), Math.cos(a)] }
  const yr = over * Math.tan(a)
  const b = Math.atan(yr / (2 * l))
  return { y: yr / 2, n: [-sg * Math.sin(b), Math.cos(b)] }
}

// ------------------------------------------------------------------------------------------- the timetable
function solve() {
  const P = PLAZA
  const dt = 1 / 2000
  const R = { dt, xs: [0], vs: [0], pushes: [] }
  let t = 0
  let x = 0
  let v = 0
  const plantAcc = (tt) => {
    let a = 0
    for (const p of R.pushes) if (tt >= p.p0 && tt < p.p1) a += PUSH.a
    return a
  }
  const brakeAcc = (tt) =>
    R.brake && tt >= R.brake.t0 && tt < R.brake.t1
      ? R.brake.decel * ss(R.brake.t0, R.brake.t0 + 0.2, tt)
      : 0
  const roll = (until) => {
    while (!until()) {
      const a = plantAcc(t) - (v > 0 ? DECEL + brakeAcc(t) : 0)
      v = Math.max(0, v + a * dt)
      x += v * dt
      t += dt
      R.xs.push(x)
      R.vs.push(v)
    }
  }
  const fly = (t1, vx) => {
    while (t + dt <= t1 + 1e-9) {
      x += vx * dt
      t += dt
      R.xs.push(x)
      R.vs.push(vx)
    }
  }
  // a push: the foot leaves the board at s, is down PUSH.lead later (the first is down from the start), and stays
  // down until the stroke or the time runs out
  const push = (s, first = false) => {
    const p0 = first ? s : s + PUSH.lead
    roll(() => t >= p0 - 1e-9)
    const down = Math.min(PUSH.tmax, (-v + Math.sqrt(v * v + 2 * PUSH.a * PUSH.stroke)) / PUSH.a)
    const p = { s, p0, p1: p0 + down, back: p0 + down + PUSH.ret, dv: PUSH.a * down, first }
    R.pushes.push(p)
    return p
  }

  // the idle, then five pushes on the upper terrace (the first foot is already down)
  R.idle = 2.5
  let s = R.idle
  for (let i = 0; i < 5; i++) s = push(s, i === 0).back + PUSH.between
  R.stance = [R.pushes.at(-1).back, R.pushes.at(-1).back + 0.45]

  // S1, the hardflip over the channel: pop 0.32 m before it, land 0.62 m past it, deck to deck
  const S1 = {
    xp: P.gap.x0 - 0.32,
    xl: P.gap.x1 + 0.62,
    y0: P.upper.y,
    y1: P.upper.y,
    base0: 0,
    base1: Math.PI,
  }
  S1.tp = R.stance[1] + 1.2
  roll(() => t >= S1.tp - 1e-9)
  // place the start so that the pop lands where the spot needs it
  R.x0 = S1.xp - x
  R.xs = R.xs.map((q) => q + R.x0)
  x += R.x0
  S1.vx = v
  S1.T = (S1.xl - S1.xp) / S1.vx
  S1.pel0 = S1.y0 + GRIP + E.pop
  S1.pel1 = S1.y1 + GRIP + E.land
  S1.vy0 = (S1.pel1 - S1.pel0 + 0.5 * G * S1.T * S1.T) / S1.T
  S1.tl = S1.tp + S1.T
  fly(S1.tl, S1.vx)
  S1.vyl = S1.vy0 - G * S1.T
  v = S1.vx * 0.985

  // S2, the laser flip down the four-stair: pop 0.42 m before the top step, a 2.05 m/s pop
  const S2 = {
    xp: P.four.x0 - 0.42,
    y0: P.upper.y,
    y1: P.middle.y,
    vy0: 2.05,
    base0: Math.PI,
    base1: Math.PI,
  }
  roll(() => x >= S2.xp)
  S2.tp = t
  S2.vx = v
  S2.pel0 = S2.y0 + GRIP + E.pop
  S2.pel1 = S2.y1 + GRIP + E.land
  S2.T = (S2.vy0 + Math.sqrt(S2.vy0 * S2.vy0 + 2 * G * (S2.pel0 - S2.pel1))) / G
  S2.xl = S2.xp + S2.vx * S2.T
  S2.tl = S2.tp + S2.T
  fly(S2.tl, S2.vx)
  S2.vyl = S2.vy0 - G * S2.T
  v = S2.vx * 0.97
  // one push on the middle terrace
  push(S2.tl + 0.85)
  R.stance2 = [R.pushes.at(-1).back, R.pushes.at(-1).back + 0.4]

  // S3, kickflip backside 50-50 down the ten-stair rail. The lock's place and its drop speed fix the fall from the
  // arc's top, the arc's top fixes the pop, and the approach speed depends on where the pop is, so it is solved a
  // few times over.
  const S3 = { y0: P.middle.y, base0: Math.PI, base1: Math.PI }
  const mark = { t, x, v, n: R.xs.length }
  let xp = 2.6
  for (let it = 0; it < 8; it++) {
    t = mark.t
    x = mark.x
    v = mark.v
    R.xs.length = R.vs.length = mark.n
    roll(() => x >= xp)
    const vx = v
    const vyl = -0.5 * vx - LOCK.dv
    const tal = -vyl / G // apex -> lock
    const pelLock = railTop(LOCK.x) + HANG_V + E.lock
    const apex = pelLock + 0.5 * G * tal * tal
    const pel0 = S3.y0 + GRIP + E.pop
    const vy0 = Math.sqrt(2 * G * (apex - pel0))
    const tpa = vy0 / G
    Object.assign(S3, { vx, vyl, tal, tpa, vy0, pel0, pelLock, apex, T: tpa + tal })
    xp = LOCK.x - vx * S3.T // the board's middle at the pop
  }
  S3.xp = x
  S3.tp = t
  S3.tl = S3.tp + S3.T
  S3.xbLock = S3.xp + S3.vx * S3.T
  fly(S3.tl, S3.vx)

  // the grind: down the rail at g sin(a) less the hangers' friction, 2.2 m/s^2, to the pop-off
  const GR = { t0: S3.tl, xb0: S3.xbLock, xOff: 6.72, a: 2.2 }
  GR.v0 = S3.vx / Math.cos(ALPHA)
  GR.sOff = (GR.xOff - GR.xb0) / Math.cos(ALPHA)
  GR.T = (-GR.v0 + Math.sqrt(GR.v0 * GR.v0 + 2 * GR.a * GR.sOff)) / GR.a
  GR.t1 = GR.t0 + GR.T
  GR.vEnd = GR.v0 + GR.a * GR.T
  GR.xbAt = (tt) => {
    const u = clamp(tt - GR.t0, 0, GR.T)
    return GR.xb0 + Math.cos(ALPHA) * (GR.v0 * u + 0.5 * GR.a * u * u)
  }
  while (t + dt <= GR.t1 + 1e-9) {
    t += dt
    x = GR.xbAt(t)
    R.xs.push(x)
    R.vs.push(Math.cos(ALPHA) * (GR.v0 + GR.a * (t - GR.t0)))
  }

  // the pop-off: the rail's speed plus a 0.9 m/s pop, onto the lower plaza
  const OFF = { tp: GR.t1, y1: 0, base0: Math.PI, base1: Math.PI, popUp: 0.9 }
  OFF.vx = GR.vEnd * Math.cos(ALPHA)
  OFF.vy0 = -GR.vEnd * Math.sin(ALPHA) + OFF.popUp
  OFF.xp = GR.xOff
  OFF.pel0 = railTop(GR.xOff) + HANG_V + E.off
  OFF.pel1 = GRIP + E.land
  OFF.T = (OFF.vy0 + Math.sqrt(OFF.vy0 * OFF.vy0 + 2 * G * (OFF.pel0 - OFF.pel1))) / G
  OFF.tl = OFF.tp + OFF.T
  OFF.xl = OFF.xp + OFF.vx * OFF.T
  OFF.vyl = OFF.vy0 - G * OFF.T
  x = GR.xOff
  fly(OFF.tl, OFF.vx)
  v = OFF.vx * 0.95

  // roll out, foot-brake, coast (the film zooms out over the plaza while R-07 rolls away)
  R.brake = { t0: OFF.tl + 1.15, t1: OFF.tl + 3.55, decel: 1.15 }
  R.end = OFF.tl + 9.6
  roll(() => t >= R.end + 0.5)
  Object.assign(R, { S1, S2, S3, GR, OFF })
  return R
}
export const RUN = solve()

/** the along-line position and speed at tau */
function track(tau) {
  const f = clamp(tau, 0, (RUN.xs.length - 2) * RUN.dt) / RUN.dt
  const i = Math.floor(f)
  const k = f - i
  return { x: lerp(RUN.xs[i], RUN.xs[i + 1], k), v: lerp(RUN.vs[i], RUN.vs[i + 1], k) }
}

// ------------------------------------------------------------------------------------------- the lateral line
// z of the rider's line as a function of x on the ground: straight down the terraces, a drift toward the rail on
// the middle terrace (the board's middle 0.5 m from it at the pop, closing at 8 cm per metre), out to the right
// after the rail.
const APPROACH = { len: 5.0, z: -0.5, slope: -0.08 }
function zLine(x) {
  const { S3, OFF } = RUN
  const a = S3.xp - APPROACH.len
  if (x <= a) return 0
  if (x <= S3.xp)
    return (
      APPROACH.z *
      herm(0, 0, 1, (APPROACH.slope * APPROACH.len) / APPROACH.z, (x - a) / APPROACH.len)
    )
  if (x < OFF.xl) return APPROACH.z + APPROACH.slope * (x - S3.xp) // (in the air: only the heading's estimate reads it)
  const s = clamp((x - OFF.xl) / 9.5)
  return lerp(RAIL_Z + 0.06, 1.35, herm(0, 0, 1, 0, s))
}
const zSlope = (x) => (zLine(x + 0.01) - zLine(x)) / 0.01
const headingAt = (x) => Math.atan(-zSlope(x))

// ------------------------------------------------------------------------------------------- the tricks
// Each air: the pelvis flies its arc; a "foot plane" hangs under it at the leg extension e(u) (the board the feet
// would stand on); the real board flips under the foot plane, a gap below it, and meets it again at the catch.
// The feet ride the board through the pop and the flick (att*), let go of it (rel: the u over which they leave),
// and follow their own path over the foot plane (front, back) back down onto it at the catch. u runs 0..1.
const keysAt = (u, list) => {
  // list: [[u, value], ...] eased between neighbours; values are numbers or {x, z, yaw, lift}
  if (u <= list[0][0]) return list[0][1]
  for (let i = 0; i < list.length - 1; i++) {
    const [ua, a] = list[i]
    const [ub, b] = list[i + 1]
    if (u <= ub) {
      const k = smooth((u - ua) / (ub - ua))
      if (typeof a === 'number') return lerp(a, b, k)
      const out = {}
      for (const key of Object.keys(a)) out[key] = lerp(a[key], b[key] ?? a[key], k)
      return out
    }
  }
  return list.at(-1)[1]
}
const F = (spot, lift = 0, dx = 0, dz = 0) => ({
  x: spot.x + dx,
  z: spot.z + dz,
  yaw: spot.yaw,
  lift,
})

const TRICKS = {
  S1: {
    name: 'Hardflip',
    flip: [0.05, 0.6],
    catch: 0.62,
    rot: (s) => ({
      phi: -2 * Math.PI * spin(s),
      psi: Math.PI * spin(s),
      theta: 1.22 * Math.sin(Math.PI * clamp(s)) ** 1.6,
    }),
    gap: (s) => 0.24 * Math.sin(Math.PI * clamp(s)) ** 1.5,
    e: () => [
      [0, null],
      [0.3, E.tuck],
      [0.56, E.tuck + 0.02],
      [1, E.land],
    ],
    attF: [
      [0, F(FOOT.hard)],
      [0.08, F(FOOT.hard, 0, 0.1, -0.02)],
    ],
    attB: [
      [0, F(FOOT.tailToe)],
      [0.08, F(FOOT.tailToe, 0, 0, 0.02)],
    ],
    rel: [
      [0.03, 0.12],
      [0.04, 0.13],
    ],
    front: [
      [0, F(FOOT.hard)],
      [0.12, F(FOOT.hard, 0.14, 0.18, -0.1)],
      [0.24, F(FOOT.hard, 0.26, 0.24, -0.14)],
      [0.44, F(FOOT.front, 0.2, 0.12, -0.04)],
      [0.56, F(FOOT.front, 0.07, 0.02, 0)],
      [0.62, F(FOOT.front)],
    ],
    back: [
      [0, F(FOOT.tailToe)],
      [0.13, F(FOOT.tailToe, 0.12, 0, 0.08)],
      [0.28, F(FOOT.back, 0.28, -0.12, 0.06)],
      [0.47, F(FOOT.back, 0.3, -0.1, 0.02)],
      [0.56, F(FOOT.back, 0.09, -0.03, 0)],
      [0.62, F(FOOT.back)],
    ],
    twist: (u) => -0.18 * bump(0.02, 0.6, u),
    setup: { front: FOOT.hard, back: FOOT.tailToe },
  },
  S2: {
    name: 'Laser flip',
    flip: [0.03, 0.56],
    catch: 0.58,
    rot: (s) => ({
      phi: 2 * Math.PI * spin(s),
      psi: 2 * Math.PI * spin(s),
      theta: 0.12 * Math.sin(2 * Math.PI * clamp(s)),
    }),
    gap: (s) => 0.17 * Math.sin(Math.PI * clamp(s)) ** 0.9,
    e: () => [
      [0, null],
      [0.28, E.tuck],
      [0.52, E.tuck + 0.04],
      [0.82, 0.8],
      [1, E.land],
    ],
    attF: [
      [0, F(FOOT.heel)],
      [0.06, F(FOOT.heel, 0, 0.08, 0.03)],
    ],
    attB: [
      [0, F(FOOT.tailToe)],
      [0.07, F(FOOT.tailToe, 0, 0, 0.02)],
    ],
    rel: [
      [0.02, 0.1],
      [0.04, 0.12],
    ],
    front: [
      [0, F(FOOT.heel)],
      [0.1, F(FOOT.heel, 0.12, 0.16, 0.12)],
      [0.24, F(FOOT.heel, 0.2, 0.2, 0.16)],
      [0.44, F(FOOT.front, 0.14, 0.1, 0.02)],
      [0.53, F(FOOT.front, 0.05, 0.02, 0)],
      [0.58, F(FOOT.front)],
    ],
    back: [
      [0, F(FOOT.tailToe)],
      [0.12, F(FOOT.tailToe, 0.1, 0.04, 0.14)],
      [0.26, F(FOOT.back, 0.2, -0.12, 0.06)],
      [0.44, F(FOOT.back, 0.14, -0.06, 0.02)],
      [0.53, F(FOOT.back, 0.05, -0.02, 0)],
      [0.58, F(FOOT.back)],
    ],
    twist: (u) => 0.34 * bump(0.0, 0.62, u),
    setup: { front: FOOT.heel, back: FOOT.tailToe },
  },
  S3: {
    name: 'Kickflip backside 50-50',
    flip: [0.04, 0.46],
    catch: 0.5,
    rot: (s) => ({ phi: -2 * Math.PI * spin(s), psi: 0, theta: 0 }),
    gap: (s) => 0.15 * Math.sin(Math.PI * clamp(s)) ** 1.2,
    // the tuck holds over the rail, then the legs reach the board down onto it
    e: (A) => [
      [0, null],
      [0.3, E.tuck],
      [1 - LOCK.reach / A.T, E.tuck + 0.01],
      [1, E.lock],
    ],
    attF: [
      [0, F(FOOT.kick)],
      [0.07, F(FOOT.kick, 0, 0.12, -0.02)],
    ],
    attB: [
      [0, F(FOOT.tail)],
      [0.08, F(FOOT.tail)],
    ],
    rel: [
      [0.03, 0.11],
      [0.05, 0.14],
    ],
    front: [
      [0, F(FOOT.kick)],
      [0.11, F(FOOT.kick, 0.1, 0.16, -0.12)],
      [0.24, F(FOOT.kick, 0.18, 0.18, -0.12)],
      [0.4, F(FOOT.grindF, 0.1, 0.04, 0)],
      [0.5, F(FOOT.grindF)],
    ],
    back: [
      [0, F(FOOT.tail)],
      [0.14, F(FOOT.tail, 0.1, 0.04, 0)],
      [0.34, F(FOOT.grindB, 0.1, -0.04, 0)],
      [0.5, F(FOOT.grindB)],
    ],
    twist: (u) => -0.1 * bump(0.0, 0.5, u),
    setup: { front: FOOT.kick, back: FOOT.tail },
  },
}
export const TRICK_NAMES = Object.fromEntries(Object.entries(TRICKS).map(([k, v]) => [k, v.name]))
/** what the process sheets read: each trick's name, its flip window and catch (in u), the whole flip and shove */
export const TRICK_INFO = Object.fromEntries(
  Object.entries(TRICKS).map(([k, tk]) => {
    const r = tk.rot(1)
    return [
      k,
      {
        name: tk.name,
        flip: tk.flip,
        catch: tk.catch,
        phi: Math.abs(r.phi) * (180 / Math.PI),
        psi: Math.abs(r.psi) * (180 / Math.PI),
      },
    ]
  })
)

/** a monotone-ish curve through [u, v] keys with flat ends (the e(u) profiles) */
function curve(list, u) {
  for (let i = 0; i < list.length - 1; i++) {
    const [ua, a] = list[i]
    const [ub, b] = list[i + 1]
    if (u <= ub) return lerp(a, b, smoother((u - ua) / (ub - ua)))
  }
  return list.at(-1)[1]
}

// ------------------------------------------------------------------------------------------- the hero
/** 0 sideways .. 1 turned to face forward and push (or brake) */
function stanceAt(tau) {
  const { pushes, brake } = RUN
  let push = 0
  for (const p of pushes)
    push = Math.max(push, ss(p.s - 0.3, p.s, tau) * (1 - ss(p.back - 0.1, p.back + 0.25, tau)))
  if (tau < pushes[0].p0) push = 1
  push = Math.max(
    push,
    0.8 * ss(brake.t0 - 0.35, brake.t0, tau) * (1 - ss(brake.t1, brake.t1 + 0.4, tau))
  )
  return push
}

/** how far the standing leg bends while the other foot is down (the first push from the start) */
function pushDip(tau) {
  let k = 0
  for (const p of RUN.pushes) {
    const on = p.first ? 1 : ss(p.p0 - 0.14, p.p0 + 0.02, tau)
    k = Math.max(k, on * (1 - ss(p.p1 - 0.02, p.p1 + 0.16, tau)))
  }
  return PUSH.dip * k
}

/** the leg extension on the ground: riding height, the push dips, the landings' absorb, the crouch before a pop */
function eGround(tau) {
  const { S1, S2, S3, OFF, brake } = RUN
  let e = E.ride - pushDip(tau)
  e -=
    0.06 * ss(brake.t0 - 0.2, brake.t0 + 0.2, tau) * (1 - ss(brake.t1 - 0.1, brake.t1 + 0.3, tau))
  // the landings: a critically damped settle from the touchdown's speed
  for (const A of [S1, S2, OFF]) {
    if (tau >= A.tl) {
      const t = tau - A.tl
      const w = 9
      const a0 = E.land - E.ride
      const b0 = A.vyl + w * a0
      e += (a0 + b0 * t) * Math.exp(-w * t)
    }
  }
  // the crouch and the pop's extension, ending at the pop's speed
  for (const A of [S1, S2, S3]) {
    const t0 = A.tp - 0.42
    const t1 = A.tp - 0.15
    if (tau > t0 && tau < A.tp) {
      if (tau < t1) e = lerp(e, E.crouch, smooth((tau - t0) / (t1 - t0)))
      else e = herm(E.crouch, 0, E.pop, A.vy0 * (A.tp - t1), (tau - t1) / (A.tp - t1))
    }
  }
  return e
}

/** which spot the rider is heading for at tau */
function nextSpot(tau) {
  const { S1, S2 } = RUN
  if (tau < S1.tl) return 'S1'
  if (tau < S2.tl) return 'S2'
  if (tau < RUN.OFF.tl) return 'S3'
  return null
}

/** a foot on the board (or on the foot plane) at deck spot f: {x, z, yaw, lift}; lift is along the deck's normal */
function footWorld(o, qb, f, out) {
  const d = deckFoot(f.x, f.yaw)
  const up = V(d.n[0], d.n[1], 0)
  const p = V(f.x, d.y, f.z).addScaledVector(up, f.lift ?? 0)
  const dir = V(Math.sin(f.yaw), 0, Math.cos(f.yaw))
  dir.addScaledVector(up, -dir.dot(up)).normalize()
  out.pos = p.applyQuaternion(qb).add(o)
  out.dir = dir.applyQuaternion(qb)
  out.up = up.applyQuaternion(qb)
  return out
}
const blendFoot = (a, b, w) => ({
  pos: a.pos.clone().lerp(b.pos, w),
  dir: a.dir.clone().lerp(b.dir, w).normalize(),
  up: a.up.clone().lerp(b.up, w).normalize(),
})

/** the arm targets: hanging, out for balance, or swinging with a push; in the body's frame */
function handsFor(pelvis, S, U, Fw, k) {
  // k: {bal 0..1, swing -1..1}
  const hang = [
    pelvis.clone().addScaledVector(S, 0.25).addScaledVector(U, -0.02).addScaledVector(Fw, 0.1),
    pelvis.clone().addScaledVector(S, -0.25).addScaledVector(U, -0.02).addScaledVector(Fw, 0.1),
  ]
  const bal = [
    pelvis.clone().addScaledVector(S, 0.62).addScaledVector(U, 0.36).addScaledVector(Fw, 0.16),
    pelvis.clone().addScaledVector(S, -0.58).addScaledVector(U, 0.34).addScaledVector(Fw, 0.02),
  ]
  const out = hang.map((h, i) => h.lerp(bal[i], k.bal ?? 0))
  if (k.swing) {
    out[0].addScaledVector(Fw, 0.22 * k.swing).addScaledVector(U, 0.05 * Math.abs(k.swing))
    out[1].addScaledVector(Fw, -0.26 * k.swing).addScaledVector(U, 0.05 * Math.abs(k.swing))
  }
  return out
}

/** the body frame from the stance frame: side turned by yaw g about up */
function bodyFrame(T, U, g) {
  const S = T.clone().applyAxisAngle(U, g)
  const Fw = new THREE.Vector3().crossVectors(S, U).normalize()
  return { S, Fw }
}

/** a foot stepping off the board to a spot on the ground beside it (k 0 -> 1; run k back down to step back on):
 *  up off the deck first, out past its edge, then down. Board-frame coordinates: along T, along N, height. */
function stepOff(k, on, to) {
  return {
    t: herm(on.t, 0, to.t, to.m ?? 0, k),
    n: lerp(on.n, to.n, ss(0.1, 0.65, k)),
    h: lerp(on.h + 0.04 * smooth(k / 0.3), 0, ss(0.45, 1, k)),
  }
}
const onDeck = (foot, mid, T, N, ys) => {
  const rel = foot.pos.clone().sub(mid)
  return { t: rel.dot(T), n: rel.dot(N), h: foot.pos.y - ys }
}
const fromBoard = (r, mid, T, N, ys) => {
  const p = mid.clone().addScaledVector(T, r.t).addScaledVector(N, r.n)
  p.y = ys + r.h
  return p
}

/** the push foot (the back one) at tau, or null: off the board and down beside its toe edge half a stroke ahead of
 *  the hip, planted in the world for the stroke, then back up onto the board. Off the ground it moves in the
 *  board's frame, leaving and meeting the ground at the ground's speed (still). */
function pushFoot(tau, onBoard, mid, T, N, ys) {
  for (const p of RUN.pushes) {
    if ((tau < p.s && !p.first) || tau > p.back) continue // the first foot is down from the start
    const b0 = track(p.p0)
    const b1 = track(p.p1)
    const L = b1.x - b0.x
    const a0 = PUSH.hip + 0.06 + L / 2 // the sole's middle at touchdown, ahead of the board's middle
    const hp = headingAt(b0.x)
    const plant = V(b0.x, 0, zLine(b0.x))
      .addScaledVector(Tdir(hp), a0)
      .addScaledVector(Ndir(hp), PUSH.side)
    plant.y = surfaceAt(plant.x, plant.z)
    const pdir = Tdir(hp).applyAxisAngle(AY, -0.18)
    const on = onDeck(onBoard, mid, T, N, ys)
    let pos
    let k
    if (tau < p.p0) {
      // stepping off, landing still (at the ground's speed in the board's frame)
      k = (tau - p.s) / (p.p0 - p.s)
      pos = fromBoard(
        stepOff(k, on, { t: a0, n: PUSH.side, m: -b0.v * (p.p0 - p.s) }),
        mid,
        T,
        N,
        ys
      )
    } else if (tau <= p.p1) {
      k = 1
      pos = plant.clone()
    } else {
      // back up: the knee lifts the foot off the ground, forward and over the deck, down onto it
      const q = (tau - p.p1) / (p.back - p.p1)
      k = 1 - smooth(q)
      const r = {
        t: herm(a0 - L, -b1.v * (p.back - p.p1), on.t, 0, q),
        n: lerp(PUSH.side, on.n, ss(0.5, 0.95, q)),
        h: lerp(0, on.h, ss(0.3, 1, q)) + 0.14 * Math.sin(Math.PI * q) ** 2,
      }
      pos = fromBoard(r, mid, T, N, ys)
    }
    if (p.first && tau < p.p0) {
      k = 1
      pos = plant.clone()
    }
    return {
      pos,
      dir: onBoard.dir.clone().lerp(pdir, k).normalize(),
      up: onBoard.up.clone().lerp(AY, k).normalize(),
      down: (tau >= p.p0 || p.first) && tau <= p.p1,
    }
  }
  return null
}

/** pull a foot in toward the hip if its ankle would be out of the leg's reach (a foot in the air only) */
function withinReach(foot, hip, R = BODY_REACH) {
  const ankle = foot.pos
    .clone()
    .addScaledVector(foot.dir, BODY_ANKLE[0])
    .addScaledVector(foot.up, BODY_ANKLE[1])
  const d = ankle.distanceTo(hip)
  if (d <= R) return foot
  const to = hip.clone().add(
    ankle
      .clone()
      .sub(hip)
      .multiplyScalar(R / d)
  )
  foot.pos.add(to.sub(ankle))
  return foot
}

/** R-07 at world time tau */
export function heroAt(tau) {
  const { S1, S2, S3, GR, OFF, pushes, brake } = RUN
  const out = { tau }
  const tr = track(tau)
  out.speed = tr.v
  // which air are we in?
  const airs = [
    ['S1', S1],
    ['S2', S2],
    ['S3', S3],
    ['OFF', OFF],
  ]
  let air = null
  for (const [k, A] of airs) if (tau >= A.tp && tau < A.tl) air = [k, A]
  const grinding = tau >= GR.t0 && tau < GR.t1
  // the board's own turn: the hardflip leaves it the other way round (the shove-it's half turn), from its landing
  const base = tau < S1.tl ? 0 : Math.PI

  let pelvis
  let o // the foot plane's (or the board's) middle
  let qfp // the foot plane's rotation
  let qb // the board's
  let T
  let U = AY.clone()
  let N
  let feet
  let gamma = 0.12
  let lean = 0.1
  let twist = 0.06
  let bank = 0
  let hands
  let look
  out.flip = { phi: 0, psi: 0, theta: 0 }

  if (air) {
    const [key, A] = air
    const u = (tau - A.tp) / A.T
    const dt = tau - A.tp
    const tk = TRICKS[key]
    out.phase = key === 'OFF' ? 'pop-off' : u < tk.catch ? 'flip' : 'air'
    out.u = u
    out.station = key === 'OFF' ? 'S3' : key
    // the heading: straight on, except S3's drift onto the rail
    const h0 = key === 'S3' ? Math.atan(-APPROACH.slope) : headingAt(A.xp)
    const h = key === 'S3' ? lerp(h0, 0, ss(0.1, 0.8, u)) : key === 'OFF' ? 0 : h0
    T = Tdir(h)
    N = Ndir(h)
    // the pelvis's arc
    const px = A.xp + SHIFT_T + A.vx * dt
    const py = A.pel0 + A.vy0 * dt - 0.5 * G * dt * dt
    let pz
    if (key === 'S3')
      pz = herm(APPROACH.z + SHIFT_N, APPROACH.slope * A.vx * A.T, RAIL_Z + SHIFT_N, 0, u)
    else if (key === 'OFF') pz = lerp(RAIL_Z, zLine(OFF.xl), ss(0, 1, u)) + SHIFT_N
    else pz = zLine(A.xp) + SHIFT_N
    pelvis = V(px, py, pz)
    // where the board sat at the pop: pivoted on its back axle (or on the rail, for the pop-off)
    let e0
    let dT0
    let th0
    if (key === 'OFF') {
      e0 = E.off
      dT0 = SHIFT_T
      th0 = -ALPHA
    } else {
      e0 = A.pel0 - (A.y0 + GRIP + POP.dy)
      dT0 = SHIFT_T - POP.dx
      th0 = POP.pitch
    }
    // the leg extension through the air
    const eKeys = tk
      ? tk.e(A).map(([uu, ev]) => [uu, ev ?? e0])
      : [
          [0, e0],
          [0.4, 0.68],
          [1, E.land],
        ]
    const e = curve(eKeys, u)
    const dTv = lerp(dT0, SHIFT_T, ss(0, 0.25, u))
    // the foot plane levels as the front foot drags up the board; S3 tips it to the rail's slope after the catch;
    // the pop-off levels it from the rail's slope
    let th
    if (key === 'OFF') th = -ALPHA * (1 - ss(0.05, 0.75, u))
    else th = th0 * (1 - ss(0, 0.24, u)) - (key === 'S3' ? ALPHA * ss(0.5, 0.68, u) : 0)
    qfp = qa(AY, h).multiply(qa(AZ, th))
    o = pelvis.clone().addScaledVector(U, -e).addScaledVector(T, -dTv).addScaledVector(N, -SHIFT_N)
    if (key === 'S3') {
      // the board stays clear of the rail on its toe side, crosses over it when it is above it, then drops onto it
      const uc0 = 1 - LOCK.cross[0] / A.T
      const uc1 = 1 - LOCK.cross[1] / A.T
      const m0 = APPROACH.slope * A.vx * A.T
      o.z =
        u < uc0
          ? herm(APPROACH.z, m0 * uc0, LOCK.hold, 0, u / uc0)
          : u < uc1
            ? herm(LOCK.hold, 0, RAIL_Z, 0, (u - uc0) / (uc1 - uc0))
            : RAIL_Z
    }
    // the board: flips under the foot plane until the catch
    let qt = new THREE.Quaternion()
    let gap = 0
    if (tk) {
      const s = (u - tk.flip[0]) / (tk.flip[1] - tk.flip[0])
      const r = s <= 0 ? { phi: 0, psi: 0, theta: 0 } : s >= 1 ? tk.rot(1) : tk.rot(s)
      out.flip = r
      out.flipS = clamp(s)
      qt = qa(AY, r.psi).multiply(qa(AZ, r.theta)).multiply(qa(AX, r.phi))
      gap = s > 0 && s < 1 ? tk.gap(s) : 0
    }
    const upFP = AY.clone().applyQuaternion(qfp)
    const ob = o.clone().addScaledVector(upFP, -gap)
    qb = qfp.clone().multiply(qt).multiply(qa(AY, base))
    out.board = { pos: ob, quat: qb }
    // the feet: on the board, then their own way over the foot plane
    if (tk) {
      const qbs = qfp.clone().multiply(qt) // the deck's own frame (the base turn left out, as for the foot spots)
      const free = [keysAt(u, tk.front), keysAt(u, tk.back)].map((f) => footWorld(o, qfp, f, {}))
      const att = [keysAt(u, tk.attF), keysAt(u, tk.attB)].map((f) => footWorld(ob, qbs, f, {}))
      feet = free.map((fr, i) => blendFoot(att[i], fr, ss(tk.rel[i][0], tk.rel[i][1], u)))
    } else {
      // pop-off: off the grind spots, onto the riding ones
      feet = [
        keysAt(u, [
          [0, F(FOOT.grindF)],
          [0.5, F(FOOT.front)],
        ]),
        keysAt(u, [
          [0, F(FOOT.grindB)],
          [0.5, F(FOOT.back)],
        ]),
      ].map((f) => footWorld(o, qfp, f, {}))
    }
    gamma = 0.08
    lean = 0.22 - 0.1 * u
    twist = tk ? tk.twist(u) : 0
    const balk = key === 'OFF' ? 1 - 0.4 * u : ss(0, 0.2, u) * (1 - 0.5 * ss(0.75, 1, u))
    const bf = bodyFrame(T, U, gamma)
    hands = handsFor(pelvis, bf.S, U, bf.Fw, { bal: balk })
    look = (tk && u < tk.catch ? ob.clone() : o.clone())
      .addScaledVector(T, 0.4 + 2.2 * u)
      .addScaledVector(U, -0.2)
    if (key === 'S3' && u > 0.4) look = V(GR.xOff, railTop(GR.xOff), RAIL_Z)
  } else if (grinding) {
    out.phase = 'grind'
    out.station = 'S3'
    const xb = GR.xbAt(tau)
    T = AX.clone()
    N = AZ.clone()
    o = V(xb, railTop(xb) + HANG_V, RAIL_Z)
    qfp = qa(AZ, -ALPHA)
    qb = qfp.clone().multiply(qa(AY, base))
    out.board = { pos: o.clone(), quat: qb }
    // e: the legs take up the lock's drop (a critically damped settle into the grind's crouch), then crouch and
    // extend into the pop-off at 0.9 m/s
    const t = tau - GR.t0
    const w = 9
    const a0 = E.lock - E.grind
    const b0 = -LOCK.dv + w * a0
    const eAt = (tt) => E.grind + (a0 + b0 * tt) * Math.exp(-w * tt)
    let e = eAt(t)
    const c0 = GR.T - 0.1
    if (t > c0) {
      const de = (b0 - w * (a0 + b0 * c0)) * Math.exp(-w * c0)
      e = herm(eAt(c0), de * 0.1, E.off, OFF.popUp * 0.1, (t - c0) / 0.1)
    }
    pelvis = o.clone().addScaledVector(U, e).addScaledVector(T, SHIFT_T).addScaledVector(N, SHIFT_N)
    feet = [footWorld(o, qfp, F(FOOT.grindF), {}), footWorld(o, qfp, F(FOOT.grindB), {})]
    gamma = 0.08
    lean = 0.16
    twist = -0.08
    bank = 0.06
    const bf = bodyFrame(T, U, gamma)
    hands = handsFor(pelvis, bf.S, U, bf.Fw, { bal: 1 })
    look = V(GR.xOff + 1.6, 0.6, RAIL_Z)
    out.grindU = t / GR.T
  } else {
    // on the ground (the track follows the board's middle)
    const xb = tr.x
    const h = headingAt(xb)
    T = Tdir(h)
    N = Ndir(h)
    const z = zLine(xb)
    const ys = surfaceAt(xb, z)
    let th = 0
    let ob = V(xb, ys + GRIP, z)
    // the pivot onto the tail just before each pop, about the back axle
    for (const A of [S1, S2, S3]) {
      if (tau >= A.tp - POP.lead && tau < A.tp) {
        th = POP.pitch * ((tau - (A.tp - POP.lead)) / POP.lead) ** 2
        const [cx, cy] = pivotOffset(th)
        ob = V(xb, ys + BOARD.wheelR, z)
          .addScaledVector(T, AXLE.x + cx)
          .add(V(0, cy, 0))
      }
    }
    qfp = qa(AY, h).multiply(qa(AZ, th))
    qb = qfp.clone().multiply(qa(AY, base))
    o = ob
    out.board = { pos: ob.clone(), quat: qb }
    out.station = nextSpot(tau)
    const e = eGround(tau)
    const push = stanceAt(tau)
    gamma = lerp(0.12, 1.18, push)
    lean = lerp(0.1, 0.26, push)
    twist = lerp(0.06, 0, push)
    // weight over the front foot while pushing
    pelvis = V(xb, ys + GRIP + e, z)
      .addScaledVector(T, lerp(SHIFT_T, 0.11, push))
      .addScaledVector(N, lerp(SHIFT_N, 0.1, push))
    // a crouch leans the chest over the board
    for (const A of [S1, S2, S3]) lean += 0.22 * bump(A.tp - 0.5, A.tp + 0.05, tau)
    // the feet: ride, push or brake, then the setup for the next spot
    let front = F(FOOT.front)
    let back = F(FOOT.back)
    front = keysAt(push, [
      [0, front],
      [1, F(FOOT.push)],
    ])
    const spot = nextSpot(tau)
    const A = spot ? RUN[spot] : null
    if (A && tau > A.tp - 1.0) {
      const tk = TRICKS[spot]
      const k1 = ss(A.tp - 0.95, A.tp - 0.7, tau)
      const k2 = ss(A.tp - 0.78, A.tp - 0.5, tau)
      front = keysAt(k1, [
        [0, front],
        [1, F(tk.setup.front)],
      ])
      back = keysAt(k2, [
        [0, back],
        [1, F(tk.setup.back)],
      ])
      back.lift = 0.05 * bump(A.tp - 0.78, A.tp - 0.5, tau)
    }
    feet = [footWorld(ob, qfp, front, {}), footWorld(ob, qfp, back, {})]
    const bf = bodyFrame(T, U, gamma)
    const hipB = pelvis.clone().addScaledVector(bf.S, -0.115).addScaledVector(U, -0.04)
    // the push foot
    const pf = pushFoot(tau, feet[1], V(xb, ys, z), T, N, ys)
    if (pf) feet[1] = pf.down ? pf : withinReach(pf, hipB)
    // the foot brake: the back foot drags on the paving beside the board's toe edge
    if (tau > brake.t0 - 0.35 && tau < brake.t1 + 0.4) {
      const k = ss(brake.t0 - 0.35, brake.t0, tau) * (1 - ss(brake.t1, brake.t1 + 0.4, tau))
      const mid = V(xb, ys, z)
      const onBoard = feet[1]
      feet[1] = withinReach(
        {
          pos: fromBoard(
            stepOff(k, onDeck(onBoard, mid, T, N, ys), { t: -0.14, n: 0.27 }),
            mid,
            T,
            N,
            ys
          ),
          dir: onBoard.dir.clone().lerp(Tdir(h).applyAxisAngle(AY, -0.5), k).normalize(),
          up: onBoard.up.clone().lerp(AY, k).normalize(),
        },
        hipB
      )
      out.braking = k
    }
    let swing = 0
    for (const p of pushes)
      if (tau > p.s && tau < p.back + 0.2)
        swing =
          Math.sin((2 * Math.PI * (tau - p.s)) / (p.back + 0.2 - p.s)) *
          bump(p.s, p.back + 0.2, tau)
    let bal = 0
    for (const A2 of [S1, S2, S3]) bal = Math.max(bal, ss(A2.tp - 0.35, A2.tp, tau))
    for (const A2 of [S1, S2, OFF])
      if (tau >= A2.tl) bal = Math.max(bal, 0.6 * (1 - ss(A2.tl, A2.tl + 0.7, tau)))
    hands = handsFor(pelvis, bf.S, U, bf.Fw, { bal, swing })
    const ahead = spot
      ? {
          S1: V(PLAZA.gap.x0, PLAZA.upper.y, 0),
          S2: V(PLAZA.four.x0, PLAZA.upper.y, 0),
          S3: V(PLAZA.ten.x0 + 1, 2.2, RAIL_Z),
        }[spot]
      : null
    look =
      ahead && ahead.x - xb < 9 && ahead.x > xb
        ? ahead
        : pelvis
            .clone()
            .addScaledVector(T, 6)
            .setY(ys + 0.4)
    out.phase =
      tau < pushes[0].p0 ? 'idle' : out.braking > 0.5 ? 'brake' : push > 0.5 ? 'push' : 'roll'
    for (const A2 of [S1, S2, S3]) if (tau >= A2.tp - 0.95 && tau < A2.tp) out.phase = 'setup'
    for (const A2 of [S1, S2, OFF]) if (tau >= A2.tl && tau < A2.tl + 0.5) out.phase = 'land'
  }

  // the rider's frame: side along the stance's travel turned by the body yaw
  const bf = bodyFrame(T, U, gamma)
  out.pose = { pelvis, side: bf.S, up: U, twist, lean, bank, look, feet, hands }
  out.T = T
  out.N = N
  return out
}

// ------------------------------------------------------------------------------------------- R-02's loop
const LOOP = new THREE.CatmullRomCurve3(
  [
    [13.6, -5.0],
    [15.8, -8.9],
    [22, -9.7],
    [28.6, -8.5],
    [30.6, -5.0],
    [27.2, -3.1],
    [21.0, -2.9],
    [15.8, -3.0],
  ].map(([x, z]) => V(x, 0, z)),
  true,
  'centripetal'
)
const LOOP_LEN = LOOP.getLength()
export function secondAt(tau) {
  const v = 3.1
  const s = (((tau * v + 7) % LOOP_LEN) + LOOP_LEN) % LOOP_LEN
  const u = LOOP.getUtoTmapping(s / LOOP_LEN)
  const p = LOOP.getPoint(u)
  const t = LOOP.getTangent(u)
  const t2 = LOOP.getTangent((u + 0.004) % 1)
  // curvature: the tangent's turn per metre, signed (toward +y = a left turn)
  const turn =
    Math.atan2(t.x * t2.z - t.z * t2.x, t.x * t2.x + t.z * t2.z) / (0.004 * LOOP_LEN || 1)
  const lean = Math.atan((v * v * turn) / G)
  const h = Math.atan2(-t.z, t.x)
  const T = Tdir(h)
  const N = Ndir(h)
  // the board banks into the turn about its long axis
  const qb = qa(AY, h).multiply(qa(AX, -lean * 0.6))
  const ob = p.clone().add(V(0, GRIP, 0))
  const pelvis = ob
    .clone()
    .addScaledVector(AY, E.ride)
    .addScaledVector(T, SHIFT_T)
    .addScaledVector(N, SHIFT_N - lean * 0.5)
  const feet = [footWorld(ob, qb, F(FOOT.front), {}), footWorld(ob, qb, F(FOOT.back), {})]
  const S = T.clone().applyAxisAngle(AY, 0.12)
  const Fw = new THREE.Vector3().crossVectors(S, AY).normalize()
  return {
    board: { pos: ob, quat: qb },
    pose: {
      pelvis,
      side: S,
      up: AY.clone().applyAxisAngle(T, lean * 0.5),
      twist: 0.05,
      lean: 0.1,
      bank: 0,
      look: pelvis.clone().addScaledVector(T, 5).setY(0.3),
      feet,
      hands: handsFor(pelvis, S, AY, Fw, { bal: 0.25 }),
    },
    speed: v,
    pos: p,
  }
}

// ------------------------------------------------------------------------------------------- F-01 and the bench
export const FILMER = V(9.4, 0, 2.5)
function standing(at, face, { crouch = 0, handsAt = null, look = null } = {}) {
  const Fw = face.clone().setY(0).normalize()
  const S = new THREE.Vector3().crossVectors(AY, Fw).normalize()
  const pelvis = at
    .clone()
    .add(V(0, 0.97 - crouch, 0))
    .addScaledVector(Fw, -0.03)
  const foot = (s) => ({
    pos: at
      .clone()
      .addScaledVector(S, s * 0.13)
      .addScaledVector(Fw, s * 0.04),
    dir: Fw.clone().applyAxisAngle(AY, -s * 0.15),
    up: AY.clone(),
  })
  return {
    pelvis,
    side: S,
    up: AY.clone(),
    twist: 0,
    lean: 0.06 + crouch * 0.4,
    bank: 0,
    look: look ?? pelvis.clone().addScaledVector(Fw, 4),
    feet: [foot(1), foot(-1)],
    hands: handsAt,
  }
}
export function filmerAt(tau, heroPos) {
  // the filmer turns with the rider, a beat behind, never more than the body would
  const aim = heroPos.clone().sub(FILMER).setY(0)
  const face = aim.lengthSq() > 1e-6 ? aim.normalize() : V(-1, 0, 0)
  const S = new THREE.Vector3().crossVectors(AY, face).normalize()
  const cam = FILMER.clone()
    .add(V(0, 1.18, 0))
    .addScaledVector(face, 0.36)
  const hands = [
    cam
      .clone()
      .addScaledVector(S, 0.08)
      .add(V(0, -0.05, 0)),
    cam
      .clone()
      .addScaledVector(S, -0.09)
      .add(V(0, -0.06, 0)),
  ]
  const pose = standing(FILMER, face, { crouch: 0.1, handsAt: hands, look: heroPos })
  return {
    pose,
    cam,
    aim: heroPos.clone().sub(cam).normalize(),
    rec: Math.floor(tau * 2) % 2 === 0,
  }
}
export const WATCHERS = [
  V(-5.0, PLAZA.middle.y, PLAZA.zMin + 0.7),
  V(-3.8, PLAZA.middle.y, PLAZA.zMin + 0.7),
]
export function watchersAt(tau, heroPos) {
  return WATCHERS.map((b, i) => {
    const pelvis = b.clone().add(V(0, 0.58, 0.02))
    const knees = 0.5
    const foot = (s) => ({
      pos: b.clone().add(V(s * 0.14, 0, knees + 0.04)),
      dir: AZ.clone(),
      up: AY.clone(),
    })
    const hands = [
      pelvis.clone().add(V(0.17, 0.02, 0.36)),
      pelvis.clone().add(V(-0.17, 0.02, 0.36)),
    ]
    return {
      pelvis,
      side: AX.clone(),
      up: AY.clone(),
      twist: 0,
      lean: 0.18 + 0.04 * Math.sin(tau * 0.7 + i),
      bank: 0,
      look: heroPos.clone().add(V(0, 0.5, 0)),
      feet: [foot(1), foot(-1)],
      hands,
    }
  })
}
