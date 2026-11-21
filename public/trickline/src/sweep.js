// The clearance sweep: the simulator's collision check, scaled down to a skateboard. Every 2 ms through the run
// it rebuilds the board's outline (deck, kicks, trucks, wheels) and the rider's legs from the same pose the page
// draws, and measures how far anything goes into anything else:
//
//   ground   the board below the plaza's solid surface (the channel's floor, the steps, the paving)
//   rail     the board inside the handrail's tube or its posts (the hangers on the rail in the grind are the contact)
//   legs     the board inside a thigh, a shin or the pelvis (the hardflip goes vertical between the legs)
//   feet     a sole below the ground, or a sole inside the deck while the board flips
//   reach    a foot target the leg cannot reach (the foot would float)
//
// Run it from the repository root:  node public/trickline/src/sweep.js
// It prints the worst case of each check for every station and exits with 1 if any goes past its tolerance.
import * as THREE from 'three'
import { BOARD, BODY, PLAZA, RAIL_SLOPE, railTop, solidAt } from './layout.js'
import { heroAt, RUN } from './motion.js'
import { legJoints } from './ik.js'

const TOL = { ground: 0.004, rail: 0.002, legs: 0.004, feet: 0.006, reach: 0.006 }

// the board's outline in its own frame: the flat middle, and the kicks as rider.js builds them (slabs hinged on
// the flat's ends, their undersides the deck's thickness below the grip along the kick's normal)
const PTS = []
{
  const a = BOARD.kickAngle
  const add = (x, y, nx, ny) => {
    for (const z of [-BOARD.W / 2, 0, BOARD.W / 2]) {
      PTS.push({ p: new THREE.Vector3(x, y, z), kind: 'deck' })
      PTS.push({ p: new THREE.Vector3(x - BOARD.deck * nx, y - BOARD.deck * ny, z), kind: 'deck' })
    }
  }
  for (const x of [-0.26, -0.13, 0, 0.13, 0.26]) add(x, 0, 0, 1)
  for (const sx of [1, -1]) {
    for (const k of [0.25, 0.5, 0.75, 1]) {
      const d = k * BOARD.kick
      add(sx * (BOARD.flat + d * Math.cos(a)), d * Math.sin(a), -sx * Math.sin(a), Math.cos(a))
    }
  }
  for (const sx of [1, -1]) {
    const x = sx * BOARD.truckX
    PTS.push({ p: new THREE.Vector3(x, -BOARD.hanger, 0), kind: 'hanger' })
    PTS.push({ p: new THREE.Vector3(x, -BOARD.hanger, 0.06), kind: 'hanger' })
    PTS.push({ p: new THREE.Vector3(x, -BOARD.hanger, -0.06), kind: 'hanger' })
    for (const sz of [1, -1]) {
      for (let k = 0; k < 12; k++) {
        const t = (k / 12) * Math.PI * 2
        for (const dz of [-BOARD.wheelW / 2, BOARD.wheelW / 2]) {
          const p = new THREE.Vector3(
            x + BOARD.wheelR * Math.cos(t),
            BOARD.axleY + BOARD.wheelR * Math.sin(t),
            sz * BOARD.wheelZ + dz
          )
          PTS.push({ p, kind: 'wheel' })
        }
      }
    }
  }
}

// the rail as segments with radii: the tube and its posts
const RAIL = []
{
  const R = PLAZA.rail
  const drop = R.r / Math.cos(RAIL_SLOPE) // the axis under the tube's top, as plaza.js builds it
  const a = new THREE.Vector3(R.x0, railTop(R.x0) - drop, R.z)
  const b = new THREE.Vector3(R.x1, railTop(R.x1) - drop, R.z)
  RAIL.push({ a, b, r: R.r, kind: 'tube' })
  for (const x of R.posts) {
    const top = 2.32 - 0.5 * (x - PLAZA.ten.x0) - drop
    RAIL.push({
      a: new THREE.Vector3(x, 0, R.z),
      b: new THREE.Vector3(x, top, R.z),
      r: 0.022,
      kind: 'post',
    })
  }
}
const segDist = (p, a, b) => {
  const ab = b.clone().sub(a)
  const t = Math.min(1, Math.max(0, p.clone().sub(a).dot(ab) / ab.lengthSq()))
  return p.distanceTo(a.clone().addScaledVector(ab, t))
}

const worst = {}
let step = {}
const note = (station, check, v, tau, phase, what) => {
  const key = `${station}|${check}`
  if (!worst[key] || v > worst[key].v) worst[key] = { v, tau, phase, what }
  if (!step[check] || v > step[check].v) step[check] = { v, what }
}
// TRACE=a:b prints every step between world times a and b where anything goes in by more than half a millimetre
const trace = process.env.TRACE ? process.env.TRACE.split(':').map(Number) : null

const t0 = 0
const t1 = RUN.end
const M = new THREE.Matrix4()
const inv = new THREE.Matrix4()
for (let tau = t0; tau <= t1; tau += 0.002) {
  step = {}
  const h = heroAt(tau)
  const st = h.station ?? 'S3'
  const air = h.phase === 'flip' || h.phase === 'air' || h.phase === 'pop-off'
  const ground = !air && h.phase !== 'grind'
  M.compose(h.board.pos, h.board.quat, new THREE.Vector3(1, 1, 1))
  inv.copy(M).invert()
  const world = PTS.map((q) => ({ w: q.p.clone().applyMatrix4(M), kind: q.kind, local: q.p }))
  // ground: the wheels roll on it, so on the ground only the deck and the hangers count
  for (const q of world) {
    if (ground && q.kind === 'wheel') continue
    const pen = solidAt(q.w.x, q.w.z) - q.w.y
    if (pen > 0) note(st, 'ground', pen, tau, h.phase, q.kind)
  }
  // rail and posts
  for (const q of world) {
    for (const s of RAIL) {
      if (h.phase === 'grind' && q.kind === 'hanger' && s.kind === 'tube') continue
      const pen = s.r - segDist(q.w, s.a, s.b)
      if (pen > 0) note(st, 'rail', pen, tau, h.phase, `${q.kind} in ${s.kind}`)
    }
  }
  // legs (thigh, shin) and the pelvis, against the board
  const legs = [0, 1].map((i) => legJoints(h.pose, i, BODY))
  for (const [i, L] of legs.entries()) {
    note(st, 'reach', L.short, tau, h.phase, i ? 'back leg' : 'front leg')
    const caps = [
      [L.hip, L.knee, 0.074, 'thigh'],
      [L.knee, L.ankle, 0.06, 'shin'],
    ]
    for (const q of world) {
      for (const [a, b, r, what] of caps) {
        const pen = r - segDist(q.w, a, b)
        if (pen > 0)
          note(st, 'legs', pen, tau, h.phase, `${q.kind} in ${i ? 'back' : 'front'} ${what}`)
      }
      const pp = 0.13 - q.w.distanceTo(h.pose.pelvis)
      if (pp > 0) note(st, 'legs', pp, tau, h.phase, `${q.kind} in pelvis`)
    }
  }
  // soles: below the ground, or inside the deck
  for (const [i, f] of h.pose.feet.entries()) {
    const side = new THREE.Vector3().crossVectors(f.up, f.dir).normalize()
    for (const [a, b] of [
      [0.13, 0.055],
      [0.13, -0.055],
      [-0.13, 0.055],
      [-0.13, -0.055],
      [0, 0],
    ]) {
      const p = f.pos.clone().addScaledVector(f.dir, a).addScaledVector(side, b)
      const g = solidAt(p.x, p.z) - p.y
      if (g > 0) note(st, 'feet', g, tau, h.phase, `${i ? 'back' : 'front'} sole under the ground`)
      const l = p.clone().applyMatrix4(inv)
      const ax = Math.abs(l.x)
      const top = ax <= BOARD.flat ? 0 : (ax - BOARD.flat) * Math.tan(BOARD.kickAngle)
      if (ax < 0.44 && Math.abs(l.z) < BOARD.W / 2 && l.y < top - 0.002 && l.y > top - BOARD.deck)
        note(st, 'feet', top - l.y, tau, h.phase, `${i ? 'back' : 'front'} sole in the deck`)
    }
  }
  if (trace && tau >= trace[0] && tau <= trace[1]) {
    const bits = Object.entries(step)
      .filter(([, w]) => w.v > 0.0005)
      .map(([k, w]) => `${k} ${(w.v * 1000).toFixed(1)} (${w.what})`)
    if (bits.length)
      console.log(`${tau.toFixed(3)} ${h.phase} u ${(h.u ?? 0).toFixed(3)}  ${bits.join('  ')}`)
  }
}

const rows = []
let bad = false
for (const st of ['S1', 'S2', 'S3']) {
  for (const check of Object.keys(TOL)) {
    const w = worst[`${st}|${check}`]
    const v = w ? w.v : 0
    const over = v > TOL[check]
    bad ||= over
    rows.push([
      st,
      check,
      `${(v * 1000).toFixed(1)} mm`,
      over ? 'OVER' : 'ok',
      w ? `${w.tau.toFixed(3)} s ${w.phase} · ${w.what}` : '',
    ])
  }
}
const pad = (s, n) => String(s).padEnd(n)
console.log(`clearance sweep, tau ${t0.toFixed(2)}..${t1.toFixed(2)} s every 2 ms`)
for (const r of rows)
  console.log(`${pad(r[0], 4)}${pad(r[1], 8)}${pad(r[2], 10)}${pad(r[3], 6)}${r[4]}`)
process.exit(bad ? 1 : 0)
