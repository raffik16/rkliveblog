// Three hot dogs, built the teardown way: from their real numbers, one part at a time, so each one can come apart into
// an exploded view and go back together. Every pose is a function of two inputs, how far apart it is (explode, 0..1)
// and how far the frank is sliced (slice, 0..1); nothing is keyframed per part.
//
//   Chicago   all-beef frank in a steamed poppy seed bun, "dragged through the garden": yellow mustard, neon green
//             relish, chopped white onions, two tomato wedges, a dill pickle spear, two sport peppers, celery salt.
//   Ballpark  the frank, yellow mustard in a zigzag, a line of ketchup, chopped onions.
//   New York  spicy brown mustard, sauerkraut, onions in red sauce.
//
// The numbers: an 8-to-the-pound frank (57 g) 152 mm long is 22 mm across at the density of water. The bun is a
// 6-inch, 146 mm, hinged at the bottom; its halves open 19.5° each, and a 22 mm frank resting in that V sits with its
// axis 33 mm above the hinge (r / sin 19.5°), its top level with the crust.
import * as THREE from 'three'
import { Mesher, col, mix } from './mesher.js'
import { rng, clamp01, easeInOutCubic } from '../../teardown/kit/util.js'

export const SPEC = {
  frank: { length: 0.152, dia: 0.022, bend: 0.004, slices: 12 },
  bun: { length: 0.146, width: 0.06, height: 0.045, open: 0.34, end: 0.026 },
}
const R = SPEC.frank.dia / 2
const HINGE = R / Math.sin(SPEC.bun.open) // frank axis above the bun's hinge

const C = {
  casing: col('#a43f1f'),
  casingHi: col('#c25a2e'),
  char: col('#341509'),
  meat: col('#b0584a'),
  meatCore: col('#c46c5c'),
  crust: col('#d4904a'),
  crustTop: col('#a8622a'),
  crustLow: col('#ecc690'),
  crumb: col('#f6e5c0'),
  crumbDark: col('#e2c999'),
  poppy: col('#1f2027'),
  mustard: col('#ffcc14'),
  brown: col('#9c6418'),
  ketchup: col('#b3100b'),
  onion: col('#f2f0e6'),
  relish: col('#2bd11a'),
  skin: col('#d22114'),
  pickleSkin: col('#2c5716'),
  pickleWart: col('#4f7d26'),
  pickleFlesh: col('#a9c24e'),
  pickleCore: col('#dfe08e'),
  pepper: col('#93b83a'),
  pepperStem: col('#5a7424'),
  celery: col('#87834f'),
  kraut: col('#eedfa6'),
  sauce: col('#a8301a'),
}

// ------------------------------------------------------------------ the frank
const frankR = (x) => {
  const L = SPEC.frank.length
  const tip = R * 1.15 // the twisted ends run a little longer than a half sphere
  const e = (Math.abs(x) - (L / 2 - tip)) / tip
  return e <= 0 ? R : R * Math.sqrt(Math.max(0, 1 - e * e))
}
// the frank's axis bends a little, ends down
const frankY = (x) => {
  const L = SPEC.frank.length
  const k = (2 * x) / L
  return SPEC.frank.bend * (1 - k * k) - SPEC.frank.bend * 0.5
}
const frankSlope = (x) => {
  const L = SPEC.frank.length
  return (-8 * SPEC.frank.bend * x) / (L * L)
}
/** Height of the frank's top surface above x, offset z from its axis. */
export const frankTop = (x, z = 0) => {
  const r = frankR(x)
  return frankY(x) + Math.sqrt(Math.max(0, r * r - z * z))
}

// grill marks, rolled three times on the grate: stripes across the frank inside three bands round it
function charAt(x, th) {
  const bands = [Math.PI / 2, Math.PI / 2 + 2.1, Math.PI / 2 - 2.1]
  let band = 0
  for (const b of bands) {
    let d = Math.abs(((th - b + Math.PI * 3) % (Math.PI * 2)) - Math.PI)
    band = Math.max(band, 1 - clamp01((d - 0.42) / 0.12))
  }
  const s = (x + 0.004 * Math.sin(th)) / 0.0105
  const d = Math.abs(s - Math.floor(s) - 0.5)
  return band * clamp01((d - 0.36) / 0.08)
}

/** One slice of the frank between x0 and x1, centred on its own middle. `step` and `radial` set the detail. */
function frankSlice(x0, x1, { step = 0.001, radial = 44 } = {}) {
  const xc = (x0 + x1) / 2
  const m = new Mesher()
  const nu = Math.max(4, Math.round((x1 - x0) / step))
  m.grid(
    nu,
    radial,
    (u, v) => {
      const x = x0 + (x1 - x0) * u
      const r = frankR(x)
      const th = v * Math.PI * 2
      const ch = charAt(x, th)
      const hi = 0.5 + 0.5 * Math.sin(x * 260 + th * 3)
      const c = mix(mix(C.casing, C.casingHi, hi * 0.35), C.char, ch * 0.85)
      return { p: [x - xc, r * Math.cos(th), r * Math.sin(th)], c }
    },
    { wrapV: true }
  )
  // the cut faces: pink emulsion, a thin dark ring of casing
  const RING = [0, 0.35, 0.7, 0.86, 0.9, 1]
  for (const x of [x0, x1]) {
    const r = frankR(x)
    if (r < R * 0.2) continue
    m.grid(
      RING.length - 1,
      radial,
      (u, v) => {
        const k = RING[Math.round(u * (RING.length - 1))]
        const th = v * Math.PI * 2
        const c = k > 0.89 ? C.casing : mix(C.meatCore, C.meat, k)
        return { p: [x - xc, r * k * Math.cos(th), r * k * Math.sin(th)], c }
      },
      { wrapV: true }
    )
  }
  return m.build()
}

// ------------------------------------------------------------------ the bun
const BUN_TOP = 2.4 // superellipse powers: a round top, a flat bottom
const BUN_BOTTOM = 5.5
function bunEnds(x) {
  const { length: L, end } = SPEC.bun
  const k = (Math.abs(x) - (L / 2 - end)) / end
  return k <= 0 ? 1 : Math.pow(Math.max(0, 1 - k * k), 0.55)
}
/** A point on half a bun, before it is opened: x along it, phi from the bottom (-pi/2) to the top (pi/2). */
function bunPoint(x, phi, side) {
  const { width: W, height: H } = SPEC.bun
  const e = bunEnds(x)
  const a = (W / 2) * e
  const b = (H / 2) * Math.pow(e, 0.7)
  const s = Math.sin(phi)
  const c = Math.cos(phi)
  const y = s >= 0 ? b * Math.pow(s, 2 / BUN_TOP) : -b * Math.pow(-s, 2 / BUN_BOTTOM)
  const z = side * a * Math.pow(Math.abs(c), 2 / 2.7)
  // the hinge (the bottom of the cut) is the origin
  return [x, y + H / 2, z]
}

/** Half a hinged bun, crust and crumb, poppy seeds baked into its crust. side +1 is the front (z > 0) half. */
function bunHalf(side, seed, { nu = 72, nv = 30, seeds = 300 } = {}) {
  const L = SPEC.bun.length
  const r = rng(seed)
  const m = new Mesher()
  const inside = [0, SPEC.bun.height / 2, (side * SPEC.bun.width) / 5]
  // crust
  m.grid(
    nu,
    nv,
    (u, v) => {
      const x = (u - 0.5) * L
      const phi = -Math.PI / 2 + v * Math.PI
      const p = bunPoint(x, phi, side)
      const s = Math.sin(phi)
      const c =
        s > 0 ? mix(C.crust, C.crustTop, Math.pow(s, 3) * 0.9) : mix(C.crust, C.crustLow, -s)
      return { p, c }
    },
    { inside }
  )
  // crumb: the cut face, with a little colour noise so it reads as bread
  m.grid(
    nu,
    Math.max(4, Math.round(nv / 3)),
    (u, v) => {
      const x = (u - 0.5) * L
      const top = bunPoint(x, Math.PI / 2, side)[1]
      const bot = bunPoint(x, -Math.PI / 2, side)[1]
      const n = 0.5 + 0.5 * Math.sin(x * 900 + v * 37) * Math.sin(x * 410 - v * 23)
      // toasted where it meets the crust, a shallow pressed groove where the frank lay
      const e = bunEnds(x)
      const rim = Math.max(1 - Math.min(v, 1 - v) / 0.08, 1 - (1 - (1 - e) * 8))
      const groove = Math.exp(-Math.pow((v - 0.72) / 0.12, 2)) * 0.5
      const c = mix(mix(C.crumb, C.crumbDark, n * 0.6 + groove), C.crust, clamp01(rim) * 0.85)
      return { p: [x, bot + (top - bot) * v, 0], c }
    },
    { inside }
  )
  // poppy seeds on the upper crust
  const seedGeo = new THREE.SphereGeometry(1, 6, 4)
  const M = new THREE.Matrix4()
  const q = new THREE.Quaternion()
  const pos = new THREE.Vector3()
  const scl = new THREE.Vector3()
  const nrm = new THREE.Vector3()
  for (let i = 0; i < seeds; i++) {
    const x = (r() - 0.5) * (L - 0.024)
    const phi = 0.15 + r() * (Math.PI / 2 - 0.15)
    const p = bunPoint(x, phi, side)
    const pu = bunPoint(x + 1e-4, phi, side)
    const pv = bunPoint(x, phi + 1e-3, side)
    const du = new THREE.Vector3(pu[0] - p[0], pu[1] - p[1], pu[2] - p[2])
    const dv = new THREE.Vector3(pv[0] - p[0], pv[1] - p[1], pv[2] - p[2])
    nrm
      .crossVectors(du, dv)
      .normalize()
      .multiplyScalar(side > 0 ? -1 : 1)
    if (nrm.y < 0) nrm.negate()
    pos.set(p[0], p[1], p[2]).addScaledVector(nrm, 0.0003)
    q.setFromUnitVectors(new THREE.Vector3(0, 1, 0), nrm)
    q.multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), r() * 6.28))
    scl.set(0.0011, 0.0005, 0.0007)
    M.compose(pos, q, scl)
    m.add(seedGeo.clone().applyMatrix4(M), C.poppy)
  }
  seedGeo.dispose()
  return m.build()
}

// ------------------------------------------------------------------ toppings
/** A bead of sauce along a curve, with round ends. */
function bead(points, radius, color, { seg = 6, radial = 10 } = {}) {
  const curve = new THREE.CatmullRomCurve3(points)
  const m = new Mesher()
  const tube = new THREE.TubeGeometry(
    curve,
    Math.max(24, Math.round(points.length * seg)),
    radius,
    radial,
    false
  )
  m.add(tube, color)
  for (const u of [0, 1]) {
    const cap = new THREE.SphereGeometry(radius, radial, Math.max(4, radial - 2))
    const p = curve.getPoint(u)
    cap.translate(p.x, p.y, p.z)
    m.add(cap, color)
  }
  return m.build()
}
function zigzag({ amp, period, lift, from = -0.062, to = 0.062, phase = 0, zOff = 0 }) {
  const pts = []
  for (let x = from; x <= to + 1e-9; x += 0.002) {
    const z = zOff + amp * Math.sin(((x - from) / period) * Math.PI * 2 + phase)
    pts.push(new THREE.Vector3(x, frankTop(x, z) + lift, z))
  }
  return pts
}

/** A tomato wedge's cut face: skin, flesh, three seed chambers. Drawn once, shared by every wedge. */
let tomatoTex = null
function tomatoFace() {
  if (tomatoTex) return tomatoTex
  const S = 256
  const cv = document.createElement('canvas')
  cv.width = cv.height = S
  const g = cv.getContext('2d')
  const c = S / 2
  g.fillStyle = '#c81c10'
  g.fillRect(0, 0, S, S)
  g.fillStyle = '#ee4a30'
  g.beginPath()
  g.arc(c, c, S * 0.47, 0, Math.PI * 2)
  g.fill()
  const r = rng(5)
  for (let k = 0; k < 3; k++) {
    const a = Math.PI * (0.18 + (k * 0.64) / 2)
    g.fillStyle = '#ffab5c'
    g.beginPath()
    g.ellipse(
      c + Math.cos(a) * S * 0.25,
      c + Math.sin(a) * S * 0.25,
      S * 0.13,
      S * 0.08,
      a,
      0,
      Math.PI * 2
    )
    g.fill()
    g.fillStyle = '#fff1b8'
    for (let i = 0; i < 9; i++) {
      const rr = S * 0.06 * Math.sqrt(r())
      const aa = r() * Math.PI * 2
      g.beginPath()
      g.ellipse(
        c + Math.cos(a) * S * 0.25 + Math.cos(aa) * rr,
        c + Math.sin(a) * S * 0.25 + Math.sin(aa) * rr * 0.7,
        3,
        2,
        aa,
        0,
        Math.PI * 2
      )
      g.fill()
    }
  }
  g.fillStyle = '#f8765a'
  g.beginPath()
  g.arc(c, c, S * 0.1, 0, Math.PI * 2)
  g.fill()
  tomatoTex = new THREE.CanvasTexture(cv)
  tomatoTex.colorSpace = THREE.SRGBColorSpace
  tomatoTex.anisotropy = 4
  return tomatoTex
}
/** Half a slice of a 52 mm tomato, 7 mm thick: the face carries the texture, the rim is skin. */
function tomatoWedge() {
  const sh = new THREE.Shape()
  sh.absarc(0, 0, 1, 0, Math.PI, false)
  sh.closePath()
  const g = new THREE.ExtrudeGeometry(sh, {
    depth: 0.27,
    bevelEnabled: true,
    bevelThickness: 0.04,
    bevelSize: 0.04,
    bevelSegments: 2,
    curveSegments: 28,
  })
  // the faces' uvs are the shape's own coordinates, -1..1: into the texture's 0..1
  const uv = g.attributes.uv
  const grp = g.groups[0]
  for (let i = grp.start; i < grp.start + grp.count; i++)
    uv.setXY(i, uv.getX(i) * 0.5 + 0.5, uv.getY(i) * 0.5 + 0.5)
  g.translate(0, 0, -0.135)
  g.scale(0.017, 0.017, 0.017)
  return g
}

/** A quarter-spear of a dill pickle, 120 mm long, skin out. */
function pickleSpear() {
  const L = 0.12
  const RR = 0.017
  const taper = (x) => {
    const k = Math.abs(x) / (L / 2)
    return 1 - 0.35 * Math.pow(k, 3)
  }
  const wart = (x, th) =>
    0.5 + 0.5 * Math.sin(x * 520 + Math.sin(th * 9) * 2) * Math.sin(th * 23 + x * 80)
  const a0 = -Math.PI / 4
  const a1 = Math.PI / 4
  const m = new Mesher()
  const inside = { inside: [0, RR * 0.55, 0] }
  m.grid(
    48,
    14,
    (u, v) => {
      const x = (u - 0.5) * L
      const th = a0 + (a1 - a0) * v
      const w = wart(x, th)
      const r = RR * taper(x) * (1 + 0.035 * w)
      return {
        p: [x, r * Math.cos(th), r * Math.sin(th)],
        c: mix(C.pickleSkin, C.pickleWart, w * w),
      }
    },
    inside
  )
  const flesh = (k) =>
    k > 0.93 ? C.pickleSkin : k < 0.45 ? mix(C.pickleCore, C.pickleFlesh, k / 0.45) : C.pickleFlesh
  for (const th of [a0, a1])
    m.grid(
      48,
      8,
      (u, v) => {
        const x = (u - 0.5) * L
        const r = RR * taper(x) * v
        return { p: [x, r * Math.cos(th), r * Math.sin(th)], c: flesh(v) }
      },
      inside
    )
  for (const x of [-L / 2, L / 2])
    m.grid(
      6,
      12,
      (u, v) => {
        const th = a0 + (a1 - a0) * v
        const r = RR * taper(x) * u
        return { p: [x, r * Math.cos(th), r * Math.sin(th)], c: flesh(u) }
      },
      inside
    )
  return m.build()
}

/** A pickled sport pepper: 40 mm, slender, a little bent, its stem on. */
function sportPepper() {
  const pts = []
  const N = 24
  const len = 0.04
  for (let i = 0; i <= N; i++) {
    const k = i / N
    const r =
      0.0052 *
      Math.pow(Math.sin(Math.PI * Math.min(1, k * 1.08) * 0.5 + 0.0001), 0.6) *
      (1 - 0.85 * Math.pow(k, 2.2))
    pts.push(new THREE.Vector2(Math.max(r, 1e-5), k * len))
  }
  pts[N].x = 0
  const g = new THREE.LatheGeometry(pts, 20)
  const stem = new THREE.CylinderGeometry(0.0011, 0.0016, 0.006, 8)
  stem.translate(0, -0.002, 0)
  // bend it: lean the tip over
  const p = g.attributes.position
  for (let i = 0; i < p.count; i++) {
    const y = p.getY(i)
    p.setX(i, p.getX(i) + 6 * y * y)
  }
  g.computeVertexNormals()
  const m = new Mesher()
  m.add(g, C.pepper)
  m.add(stem, C.pepperStem)
  const out = m.build()
  out.rotateZ(-Math.PI / 2)
  out.translate(-len / 2, 0, 0)
  return out
}

/** Strands of sauerkraut, a loose mat on top of the frank. */
function kraut(r) {
  const m = new Mesher()
  for (let i = 0; i < 46; i++) {
    const x0 = (r() - 0.5) * 0.12
    const z0 = (r() - 0.5) * 0.02
    const a = r() * Math.PI * 2
    const len = 0.012 + r() * 0.02
    const pts = []
    for (let k = 0; k <= 6; k++) {
      const s = (k / 6 - 0.5) * len
      const x = x0 + Math.cos(a) * s
      const z = Math.max(-0.012, Math.min(0.012, z0 + Math.sin(a) * s * 0.6))
      pts.push(
        new THREE.Vector3(x, frankTop(x, z) + 0.0018 + 0.0014 * Math.sin(k + i) + r() * 0.002, z)
      )
    }
    const tube = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 10, 0.0009, 5, false)
    m.add(tube, mix(C.kraut, col('#d8c47c'), r()))
  }
  return m.build()
}

// ------------------------------------------------------------------ materials, shared by every dog
export function foodMaterials() {
  const phys = (o) => new THREE.MeshPhysicalMaterial(o)
  return {
    frank: phys({
      vertexColors: true,
      roughness: 0.42,
      clearcoat: 0.85,
      clearcoatRoughness: 0.28,
      envMapIntensity: 0.7,
    }),
    bun: phys({
      vertexColors: true,
      roughness: 0.78,
      sheen: 0.7,
      sheenColor: new THREE.Color('#ffd9a0'),
      sheenRoughness: 0.55,
      envMapIntensity: 0.6,
    }),
    sauce: phys({ vertexColors: true, roughness: 0.26, clearcoat: 0.7, clearcoatRoughness: 0.2 }),
    // yellow mustard and neon relish fluoresce a little under the club's UV
    mustard: phys({
      color: C.mustard,
      roughness: 0.3,
      clearcoat: 0.6,
      clearcoatRoughness: 0.25,
      emissive: C.mustard,
      emissiveIntensity: 0.22,
    }),
    relish: phys({
      color: C.relish,
      roughness: 0.35,
      clearcoat: 0.6,
      emissive: C.relish,
      emissiveIntensity: 0.4,
    }),
    onion: phys({ color: C.onion, roughness: 0.22, clearcoat: 0.5, envMapIntensity: 0.8 }),
    veg: phys({ vertexColors: true, roughness: 0.36, clearcoat: 0.55, clearcoatRoughness: 0.3 }),
    tomatoFace: phys({
      map: tomatoFace(),
      roughness: 0.5,
      clearcoat: 0.3,
      clearcoatRoughness: 0.4,
      envMapIntensity: 0.5,
    }),
    tomatoSkin: phys({
      color: C.skin,
      roughness: 0.3,
      clearcoat: 0.7,
      clearcoatRoughness: 0.25,
      envMapIntensity: 0.6,
    }),
    celery: phys({ color: C.celery, roughness: 0.8 }),
  }
}

// ------------------------------------------------------------------ one dog
const TOPPINGS = {
  chicago: ['mustard', 'relish', 'onions', 'tomato', 'pickle', 'peppers', 'celery'],
  ballpark: ['mustard', 'ketchup', 'onions'],
  newyork: ['brown', 'kraut', 'sauce'],
}

const V3 = THREE.Vector3
const Q = (x, y, z) => new THREE.Quaternion().setFromEuler(new THREE.Euler(x, y, z))

/**
 * Build one dog. Returns {root, update(t, explode, slice), radius}; root's origin is the frank's middle.
 * M: foodMaterials(); the geometry comes from `shared`, so three dogs cost one set of buffers.
 */
function buildDog(style, M, shared, seed) {
  const r = rng(seed)
  const root = new THREE.Group()
  const parts = []
  // home and out: [position, quaternion]; delay 0 leaves first, 1 last; lift: how high it arcs on the way
  const part = (obj, home, out, delay, lift = 0.012) => {
    root.add(obj)
    obj.matrixAutoUpdate = false
    parts.push({ obj, hp: home[0], hq: home[1], op: out[0], oq: out[1], delay, lift })
    return obj
  }
  const mesh = (g, m) => new THREE.Mesh(g, m)

  // bun: the back half (-z) and the front half (+z), opened on their hinge
  const A = SPEC.bun.open
  part(
    mesh(shared.bunBack, M.bun),
    [new V3(0, -HINGE, 0), Q(-A, 0, 0)],
    [new V3(0, -0.058, -0.04), Q(-0.62, 0, 0)],
    0.9,
    0
  )
  part(
    mesh(shared.bunFront, M.bun),
    [new V3(0, -HINGE, 0), Q(A, 0, 0)],
    [new V3(0, -0.066, 0.034), Q(2.15, 0, 0)],
    0.95,
    0
  )

  // the frank, as slices that sit flush until it is sliced
  const slices = []
  const n = SPEC.frank.slices
  for (let i = 0; i < n; i++) {
    const x0 = -SPEC.frank.length / 2 + (i * SPEC.frank.length) / n
    const x1 = x0 + SPEC.frank.length / n
    const xc = (x0 + x1) / 2
    const o = mesh(shared.slices[i], M.frank)
    root.add(o)
    o.matrixAutoUpdate = false
    slices.push({ o, xc, y: frankY(xc), a: Math.atan(frankSlope(xc)) })
  }
  const FRANK_OUT = 0.03

  // toppings, in the order they come off (top first)
  const tops = TOPPINGS[style]
  let layer = 0
  const LIFT = (k) => 0.046 + 0.016 * k
  // the sauces and the kraut lift off in layers, each tipped a little
  const LAYERS = [
    ['mustard', M.mustard],
    ['brown', M.sauce],
    ['ketchup', M.sauce],
    ['sauce', M.sauce],
    ['kraut', M.veg],
  ]
  for (const [k, mat] of LAYERS) {
    if (!tops.includes(k)) continue
    const y = LIFT(layer++)
    part(
      mesh(shared[k], mat),
      [new V3(), new THREE.Quaternion()],
      [new V3(0, y, 0.004 * layer), Q(0.08 * (layer % 2 ? 1 : -1), 0, 0)],
      0.55 - 0.08 * layer
    )
  }

  // loose pieces: instanced, each with its own way out
  const loose = []
  const scatter = (geo, mat, count, place, outLift, spread, size, delay) => {
    const im = new THREE.InstancedMesh(geo, mat, count)
    im.frustumCulled = false
    root.add(im)
    const items = []
    for (let i = 0; i < count; i++) {
      const hp = place()
      const hq = Q(r() * 6.28, r() * 6.28, r() * 6.28)
      const op = new V3(
        hp.x * spread[0],
        outLift + (r() - 0.5) * spread[1],
        hp.z * spread[2] + (r() - 0.5) * 0.02
      )
      const s = size[0] + (size[1] - size[0]) * r()
      const s3 = new V3(s * (0.6 + 0.8 * r()), s * (0.6 + 0.8 * r()), s * (0.6 + 0.8 * r()))
      items.push({
        hp,
        hq,
        op,
        s: s3,
        axis: new V3(r() - 0.5, r() - 0.5, r() - 0.5).normalize(),
        spin: 0.6 + r() * 1.4,
        d: delay + r() * 0.15,
      })
    }
    loose.push({ im, items })
  }
  const onTop = (spreadZ, lift) => () => {
    const x = (r() - 0.5) * 0.12
    const z = (r() - 0.5) * spreadZ
    return new V3(
      x,
      frankTop(x, Math.min(R * 0.9, Math.abs(z)) * Math.sign(z)) + lift + r() * 0.003,
      z
    )
  }
  if (tops.includes('onions'))
    scatter(
      shared.cube,
      M.onion,
      64,
      onTop(0.024, 0.004),
      LIFT(layer++),
      [1.25, 0.02, 2.2],
      [0.0026, 0.004],
      0.35
    )
  if (tops.includes('relish'))
    scatter(
      shared.chunk,
      M.relish,
      96,
      onTop(0.02, 0.0052),
      LIFT(layer++),
      [1.3, 0.024, 2.4],
      [0.0015, 0.0026],
      0.25
    )

  // tomato wedges along the front, the pickle spear along the back, the peppers on top
  if (tops.includes('tomato')) {
    for (const sx of [-1, 1]) {
      const g = mesh(shared.tomato, [M.tomatoFace, M.tomatoSkin])
      part(
        g,
        [new V3(sx * 0.03, 0.007, 0.019), Q(-0.45, 0, sx * 0.06)],
        [new V3(sx * 0.055, LIFT(layer) + 0.004, 0.055), Q(-0.25, sx * 0.25, sx * 0.1)],
        0.3
      )
    }
    layer++
  }
  if (tops.includes('pickle')) {
    part(
      mesh(shared.pickle, M.veg),
      [new V3(0, 0.008, -0.012), Q(-Math.PI / 4, 0, 0)],
      [new V3(0, LIFT(layer++) + 0.004, -0.04), Q(-0.2, 0.12, 0)],
      0.2
    )
  }
  if (tops.includes('peppers')) {
    for (const sx of [-1, 1])
      part(
        mesh(shared.pepper, M.veg),
        [new V3(sx * 0.024, frankTop(sx * 0.024) + 0.006, 0.003 * sx), Q(0, sx * 0.2, 0.05)],
        [new V3(sx * 0.04, LIFT(layer) + 0.006, 0.012), Q(0.3, sx * 0.5, sx * 0.4)],
        0.1
      )
    layer++
  }
  if (tops.includes('celery'))
    scatter(
      shared.speck,
      M.celery,
      160,
      onTop(0.022, 0.0075),
      LIFT(layer++) + 0.01,
      [1.4, 0.03, 3],
      [0.0006, 0.001],
      0
    )

  // how big the dog is, whole (for the storm's points that live inside it)
  const radius = Math.hypot(SPEC.bun.length, SPEC.bun.height * 2.2) / 2

  const mtx = new THREE.Matrix4()
  const pos = new V3()
  const q = new THREE.Quaternion()
  const q2 = new THREE.Quaternion()
  const one = new V3(1, 1, 1)
  const scl = new V3()
  const Y = new V3(0, 1, 0)
  const Z = new V3(0, 0, 1)
  let atRest = false

  // each part leaves on its own share of the explosion: delay 0 first, 1 last (and back in the reverse order)
  const stage = (e, d) => clamp01((e - d * 0.4) / 0.6)

  /** t: seconds (keeps exploded parts drifting); explode 0..1; slice 0..1. */
  const update = (t, explode, slice) => {
    // whole and still: posed once, then nothing to do until it moves again
    const rest = explode < 1e-4 && slice < 1e-4
    if (rest && atRest) return
    atRest = rest
    if (rest) explode = slice = 0
    for (const p of parts) {
      const k = stage(explode, p.delay)
      const ke = easeInOutCubic(k)
      pos.lerpVectors(p.hp, p.op, ke)
      pos.y += Math.sin(Math.PI * k) * p.lift
      // a slow drift while it hangs in the air
      pos.y += 0.0025 * Math.sin(t * 0.9 + p.delay * 9) * ke
      q.slerpQuaternions(p.hq, p.oq, ke)
      q2.setFromAxisAngle(Y, 0.12 * Math.sin(t * 0.5 + p.delay * 5) * ke)
      q.premultiply(q2)
      mtx.compose(pos, q, one)
      p.obj.matrix.copy(mtx)
    }
    // the frank: up out of the bun, then its slices fan out along x and turn their cut faces to the front
    const kf = easeInOutCubic(stage(explode, 0.75))
    const ks = easeInOutCubic(slice)
    for (let i = 0; i < slices.length; i++) {
      const s = slices[i]
      const mid = i - (slices.length - 1) / 2
      pos.set(
        s.xc + mid * 0.0085 * ks,
        s.y * (1 - ks) +
          kf * FRANK_OUT +
          ks * (0.004 * Math.sin(i * 0.9 + t * 1.3)) +
          Math.sin(Math.PI * kf) * 0.01,
        ks * 0.012 * Math.cos(i * 0.7)
      )
      q.setFromAxisAngle(Z, s.a * (1 - ks))
      // not quite face-on: the cut and a little of the casing both show
      q2.setFromAxisAngle(Y, (-Math.PI / 2) * ks * (0.78 + 0.08 * Math.sin(i + t * 0.7)))
      q.premultiply(q2)
      mtx.compose(pos, q, one)
      s.o.matrix.copy(mtx)
    }
    for (const L of loose) {
      for (let i = 0; i < L.items.length; i++) {
        const it = L.items[i]
        const k = stage(explode, it.d)
        const ke = easeInOutCubic(k)
        pos.lerpVectors(it.hp, it.op, ke)
        pos.y += Math.sin(Math.PI * k) * 0.02
        q.setFromAxisAngle(it.axis, it.spin * t * ke + k * 3)
        q.multiply(it.hq)
        scl.copy(it.s)
        mtx.compose(pos, q, scl)
        L.im.setMatrixAt(i, mtx)
      }
      L.im.instanceMatrix.needsUpdate = true
    }
  }
  update(0, 0, 0)

  return { root, update, radius }
}

/** All three dogs, sharing their geometry and materials. */
export function buildHotDogs() {
  const M = foodMaterials()
  const n = SPEC.frank.slices
  const slices = []
  for (let i = 0; i < n; i++) {
    const x0 = -SPEC.frank.length / 2 + (i * SPEC.frank.length) / n
    slices.push(frankSlice(x0, x0 + SPEC.frank.length / n))
  }
  const chunk = new THREE.IcosahedronGeometry(1, 0)
  const shared = {
    slices,
    bunBack: bunHalf(-1, 3),
    bunFront: bunHalf(1, 4),
    mustard: bead(zigzag({ amp: 0.0068, period: 0.021, lift: 0.0022 }), 0.0029, C.mustard),
    brown: bead(zigzag({ amp: 0.0058, period: 0.017, lift: 0.0022, phase: 1 }), 0.0027, C.brown),
    ketchup: bead(
      zigzag({ amp: 0.0016, period: 0.05, lift: 0.0045, zOff: -0.0035, from: -0.058, to: 0.058 }),
      0.0026,
      C.ketchup
    ),
    sauce: bead(
      zigzag({ amp: 0.003, period: 0.04, lift: 0.0062, zOff: 0.002, from: -0.055, to: 0.055 }),
      0.0042,
      C.sauce
    ),
    kraut: kraut(rng(17)),
    tomato: tomatoWedge(),
    pickle: pickleSpear(),
    pepper: sportPepper(),
    cube: new THREE.BoxGeometry(1, 1, 1),
    chunk,
    speck: new THREE.OctahedronGeometry(1, 0),
  }
  const dogs = {
    chicago: buildDog('chicago', M, shared, 101),
    ballpark: buildDog('ballpark', M, shared, 202),
    newyork: buildDog('newyork', M, shared, 303),
  }
  return { dogs, materials: M, shared }
}

/** Geometry for the flying parts: the same parts at a lower detail, each one draw call with its colours baked in. */
export function partGeometries() {
  const A = SPEC.bun.open
  const L = SPEC.frank.length
  const posed = (geo, p, q) =>
    geo.clone().applyMatrix4(new THREE.Matrix4().compose(p, q, new V3(1, 1, 1)))
  const lowFrank = frankSlice(-L / 2, L / 2, { step: 0.006, radial: 14 })
  const lowBack = bunHalf(-1, 3, { nu: 22, nv: 10, seeds: 0 })
  const lowFront = bunHalf(1, 4, { nu: 22, nv: 10, seeds: 0 })
  // a whole small dog: both bun halves opened, the frank, a mustard zigzag bright enough to read at a distance
  const mustard = C.mustard.clone().multiplyScalar(1.6)
  const dog = new Mesher()
  dog.append(posed(lowBack, new V3(0, -HINGE, 0), Q(-A, 0, 0)))
  dog.append(posed(lowFront, new V3(0, -HINGE, 0), Q(A, 0, 0)))
  dog.append(lowFrank)
  dog.append(
    bead(zigzag({ amp: 0.0068, period: 0.021, lift: 0.0022 }), 0.0032, mustard, {
      seg: 1.2,
      radial: 5,
    })
  )
  return {
    dog: dog.build(),
    frank: lowFrank,
    // a single coin of frank, both cut faces showing
    coin: frankSlice(-0.0065, 0.0065, { step: 0.004, radial: 18 }),
    bun: lowFront,
    pickle: pickleSpear(),
    pepper: sportPepper(),
    tomato: tomatoWedge(),
  }
}
