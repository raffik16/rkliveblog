// Padline's launch complex: the buildings, the pad and the ground machines around the rocket, in the toy airport's
// look (airport-shared/style.js, airside.js, gse.js): chunky bevelled forms, matte paint on the structures and a soft
// clearcoat on the vehicles, blue + white on the lavender ground, yellow only on the crane. Every colour comes from
// style.js; the few it lacks (concrete, rail steel, the scorched deflector) are in PAD below. Toy metres, y up,
// origin on the ground (y = 0) under the middle of each thing unless stated. Vehicles face +x, their right side is +z.
//
//   buildToyIntegrationHangar() -> {group, setDoor(k), door: {x: 32, width: 15, height: 13}}
//       The horizontal integration hangar: 64 (x) by 30 (z), a blue barrel roof 15.6 tall, eaves at 12, centred on the
//       origin. The +x end wall (x = +32) has the door: 15 wide (z -7.5..7.5) by 13 high, floor at y = 0. setDoor(k):
//       0 closed .. 1 open, linear; three telescoping leaves per side slide out to z +/-7.7..10.5 in front of the
//       wall, so at 1 the whole 15 x 13 opening is clear. Closed, the leaves stop 0.56 above the floor so rails pass
//       under them. The -x end wall carries a matching closed door (static). The inside is one lit, shadowless room
//       and nothing stands in it. PADLINE signs: above the door, on the +z long wall, painted on the roof.
//   buildToyRails({length = 150}) -> Group
//       Two rails at z = +/-3.0 along +x from x = 0 to x = length: a concrete bed 6.8 wide (z +/-3.4) 0.14 high,
//       sleepers every 1.5 m (instanced), rail tops at y = 0.52 (group.userData.railTop).
//   buildToyLaunchMount() -> {group, deckY: 6.0, hinge: Vector3(-7.5, 0.9, 0), setClamps(k)}
//       The pad at the origin. A steel table 10 x 10 (x, z -5..5), deck top exactly y = 6.0, a round opening of
//       radius 2.6 at the origin (a steel ring r 2.6..3.4 flush with the deck). Four legs at x +/-4, z +/-4.55 on
//       footings, clear of the trench. Four hold-down clamps on the 45-degree diagonals (post at radius 3.95):
//       setClamps(1) = jaws closed on the skirt (jaw face at radius 2.3, y 7.25..7.95), 0 = arms swung 100 deg about
//       their posts, clear of radius 2.75. Nothing of the mount rises above y = 7.95. Under the deck a curved flame
//       deflector (top at x -3.5, y 4.2, running down to the trench floor at x 6.5) turns the exhaust toward +x;
//       the flame trench is a concrete channel 7 wide inside (z +/-3.5, walls 0.6 thick to +/-4.1, 3.0 high) from its
//       back wall at x -4.2 out to x = +34, open at the +x end. Hinge brackets on low concrete pedestals at
//       (-7.5, 0.9, +/-3.2): the pedestals stand outboard (|z| 3.6..4.8, top 0.5), a steel pin on the hinge axis
//       reaches inward from each to |z| = 2.87, so a lug centred on z = +/-3.2 hangs on it. Clear for the erector:
//       nothing at x < -5 rises above y = 0.9 inside |z| < 2.8, and the rail bed (|z| < 3.4) is free from x = -7.5
//       back. A concrete apron 62 x 60 (x -26..36, z -30..30, top y = 0.06) with painted joints and a keep-clear ring.
//   buildToyTankFarm() -> {group, setFill(lox, rp1), vents: [Vector3]}
//       The propellant farm, 56 x 28 (x, z +/-28, +/-14) on a concrete slab: the LOX sphere (radius 7, centre
//       (-14, 9.6, -2), 8 legs, top 16.6, vent stack to 18.3), two RP-1 tanks (radius 2.4, 15.4 long, along x at
//       z -8.3 and -2.6, inside a bund), a row of 8 helium/nitrogen bottles (z 9.5), a pump house (x -5.5..1.5,
//       z 7.5..12.5) and a pipe rack (z 3.5) that turns at x 26 and leaves the slab at (26, 0, +14) heading +z, in
//       the same 3-pipe order as buildToyPipeRack turned by rotation.y = -PI/2. setFill(lox, rp1), each 0..1, drives
//       the two gauge boards (facing the film camera). vents (local): [LOX sphere top, LOX line relief valve, pump
//       house stack].
//   buildToyPipeRack({length = 40}) -> Group
//       A pipe bridge along +x from x = 0 to length on blue T-supports every <= 6 m: three pipes at z -0.75 (LOX,
//       white, r 0.36), 0 (RP-1, steel, r 0.27), +0.75 (gas, light blue, r 0.22), all resting on y = 2.3; top 3.02.
//   buildToyWaterTower() -> Group
//       The sound-suppression water tower: a white tank (radius 7, y 22.6..31.2) with a blue PADLINE band, a domed
//       roof, a balcony, on 6 splayed legs (footprint radius 7.7) and a central riser; beacon at 36.4.
//   buildToyLightningTower({h = 52}) -> Group
//       A slim white tapered mast (radius 0.8 at the foot, 0.34 at the top) with blue bands, a red beacon and a steel
//       spike to y = h, on a 2.6 m square footing.
//   buildToyLandingZone({r = 18}) -> Group
//       A round pad (radius r, top 0.14) on a round apron (radius r + 5, top 0.08), painted with a big ring, a
//       cross and "LZ-2" near the edge on the +x +z side, set to read from the film camera (azimuth 38). Blue edge
//       lights at r + 1.6. A road stub 8 wide from the apron toward +z to z = r + 30. Nothing above 0.15.
//   buildToyBoosterTrailer() -> {group, roll(d), slot, axisY: 3.4}
//       36 m overall (x -18..18), facing +x: a blue cab-over tractor (the box truck's cab) with a gooseneck on its
//       fifth wheel, two blue side girders (z +/-2.55..2.95, y 1.35..2.45) and a 3-axle rear bogie. The booster lies
//       between the girders in two saddles that cup its bottom +/-32 deg: aft saddle at x -12.8..-11.6 (rocket
//       y 4.8..6.0), forward saddle at x 3.4..4.6 (rocket y 21..22.2). slot: an Object3D at (-17.6, 3.4, 0), the
//       booster's axis at its engine end (nozzle exits); the booster runs toward +x from it, ending at x 9.4. Add the
//       booster as a child of slot with its y axis turned onto +x (rotation.z = -PI/2), rolled so its folded legs sit
//       on the 45-degree diagonals: they then clear the saddles and the girders. roll(d) turns all 12 wheels.
//   buildToyMobileCrane() -> {group, roll(d), setBoom(k), setSwing(a), hook}
//       A yellow all-terrain crane, 14 m (x -7..7), 4 axles, a low yellow cab at the front. The upper turns about the
//       slew centre at x = -3.15: setSwing(a) (radians, +a turns the boom from +x toward -z). setBoom(k), 0..1: the
//       outriggers slide out and jack down (k 0..0.18), the boom luffs from 0 (stowed along the carrier, over the cab)
//       to 60 deg (k 0..0.7) and telescopes from 11.5 to 31.5 m (k 0.35..1); the rope pays out. At k = 1 the boom head
//       is 31 m up and the hook 28.6 m up. hook: an Object3D at the hook's bottom (attach loads to it). Total height
//       stowed 5.0.
//   buildToyControlCenter() -> Group
//       The launch control building: 40 (x) by 24 (z), roof 7.7 with a blue parapet to 8.3, ribbon windows, a blue
//       entrance canopy on +z, a stair tower to 10.4 with a radome, two dishes and roof plant. PADLINE · LAUNCH
//       CONTROL on the +z parapet.
//
// Static parts are merged per material and built once per variant (copies share geometry and materials); repeats
// are instanced; moving parts are their own meshes. Text uses Inter: build after document.fonts has loaded it (runSim
// does that before setup).
import * as THREE from 'three'
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js'
import { TOY, rbox, toyMat } from '../airport-shared/style.js'
import { AIRSIDE } from '../airport-shared/airside.js'
import { GSE_COLORS } from '../airport-shared/gse.js'

const PI = Math.PI
const TAU = PI * 2
const D2R = PI / 180
const clamp = (v, a, b) => Math.min(b, Math.max(a, v))
const lerp = (a, b, t) => a + (b - a) * t
const sat = (v) => clamp(v, 0, 1)
const sstep = (u) => {
  const v = sat(u)
  return v * v * (3 - 2 * v)
}
const V = (x = 0, y = 0, z = 0) => new THREE.Vector3(x, y, z)
const V2 = (x, y) => new THREE.Vector2(x, y)
const _p = new THREE.Vector3()
const _q = new THREE.Quaternion()
const _e = new THREE.Euler()
const _s = new THREE.Vector3()
const mat4 = (x = 0, y = 0, z = 0, rx = 0, ry = 0, rz = 0, sx = 1, sy = 1, sz = 1) =>
  new THREE.Matrix4().compose(
    _p.set(x, y, z),
    _q.setFromEuler(_e.set(rx, ry, rz)),
    _s.set(sx, sy, sz)
  )
const C = GSE_COLORS
/** the film camera's azimuth: signs and gauges turn to it */
const FILM_AZ = 38 * D2R

/** colours style.js has no entry for */
export const PAD = {
  concrete: '#dde2f1', // pad structures, piers, the trench walls, the rail bed: a step under the apron
  concreteDeep: '#c4cce6', // the trench floor, the farm's bund floor
  scorch: '#a2abca', // the flame deflector and the trench's inner lining
  rail: '#8f99bb', // rail webs and feet
  sleeper: '#b5bdd9',
  lzPad: '#c3cce9', // the landing pad, a shade under the apron so the white paint reads
  yellowDeep: '#e0a02e', // the crane's inner faces (machines.js's BUILD_COLORS.yellowDeep)
}

// ================================================================================================ materials
const SIDE = new Map()
function sideMat(color, side, rough) {
  const key = `${color}|${side}|${rough}`
  if (!SIDE.has(key))
    SIDE.set(key, new THREE.MeshStandardMaterial({ color, roughness: rough, side }))
  return SIDE.get(key)
}
const paint = (color, rough = 0.5) => toyMat(color, { paint: true, rough })
const glow = (color, emissive, k, rough = 0.35) =>
  new THREE.MeshStandardMaterial({ color, roughness: rough, emissive, emissiveIntensity: k })
let MATS = null
function mats() {
  if (MATS) return MATS
  MATS = {
    // structures: matte
    white: toyMat(TOY.white),
    tank: toyMat(TOY.white, { rough: 0.42 }),
    panel: toyMat(TOY.panel),
    wall: toyMat(AIRSIDE.wall, { rough: 0.72 }),
    roof: toyMat(TOY.roof, { rough: 0.62 }),
    blue: toyMat(TOY.blue, { rough: 0.5 }),
    blueDeep: toyMat(TOY.blueDeep, { rough: 0.5 }),
    blueLight: toyMat(TOY.blueLight, { rough: 0.5 }),
    navy: toyMat(TOY.navy, { rough: 0.7 }),
    glass: toyMat(TOY.glass, { rough: 0.16 }),
    window: toyMat(AIRSIDE.window, { rough: 0.4 }),
    shade: toyMat(TOY.shade, { rough: 0.6 }),
    slat: toyMat(AIRSIDE.slat, { rough: 0.6 }),
    steel: toyMat(AIRSIDE.steel, { rough: 0.45 }),
    post: toyMat(AIRSIDE.post, { rough: 0.45 }),
    apron: toyMat(TOY.road, { rough: 0.9 }),
    concrete: toyMat(PAD.concrete, { rough: 0.85 }),
    concreteDeep: toyMat(PAD.concreteDeep, { rough: 0.88 }),
    scorch: toyMat(PAD.scorch, { rough: 0.7 }),
    rail: toyMat(PAD.rail, { rough: 0.4, metal: 0.2 }),
    sleeper: toyMat(PAD.sleeper, { rough: 0.85 }),
    lz: toyMat(PAD.lzPad, { rough: 0.88 }),
    room: sideMat(AIRSIDE.interior, THREE.BackSide, 0.9),
    red: glow('#f0656a', TOY.red, 0.9, 0.3),
    // vehicles: the soft clearcoat (gse.js's set)
    vWhite: paint(TOY.white),
    vBlue: paint(TOY.blue, 0.48),
    vBlueDeep: paint(TOY.blueDeep, 0.48),
    vYellow: paint(TOY.yellow, 0.5),
    vYellowDeep: paint(PAD.yellowDeep, 0.56),
    ink: toyMat(C.ink, { rough: 0.62 }),
    chassis: toyMat(C.chassis, { rough: 0.66 }),
    tyre: toyMat(C.tyre, { rough: 0.82 }),
    hub: toyMat(C.hub, { rough: 0.42 }),
    hubCap: toyMat(C.hubCap, { rough: 0.45, metal: 0.1 }),
    vGlass: toyMat(TOY.glass, { paint: true, rough: 0.12 }),
    bumper: paint(C.bumper),
    vSteel: toyMat(C.steel, { rough: 0.42, metal: 0.25 }),
    lamp: glow(C.lamp, '#fff1c8', 0.22, 0.3),
    tail: glow('#f0656a', TOY.red, 0.35, 0.3),
    beacon: glow('#ffb072', '#ff7a1f', 0.9, 0.3),
  }
  return MATS
}

// ================================================================================================ geometry kit
const GEO = new Map()
const cached = (key, make) => {
  if (!GEO.has(key)) GEO.set(key, make())
  return GEO.get(key)
}
const once = (make) => {
  let v = null
  return () => (v ??= make())
}
/** keep only position, normal, uv and drop the index, so anything merges with anything */
function clean(g) {
  const out = g.index ? g.toNonIndexed() : g.clone()
  for (const k of Object.keys(out.attributes))
    if (!['position', 'normal', 'uv'].includes(k)) out.deleteAttribute(k)
  if (!out.attributes.normal) out.computeVertexNormals()
  if (!out.attributes.uv)
    out.setAttribute(
      'uv',
      new THREE.BufferAttribute(new Float32Array(out.attributes.position.count * 2), 2)
    )
  out.morphAttributes = {}
  out.clearGroups()
  return out
}
/** a lathe with a rounded-rectangle profile: a cylinder (or a tapered one) with soft edges, axis y, centred */
function rcyl(rb, rt, h, b = 0.12, seg = 32) {
  return cached(`rcyl|${rb}|${rt}|${h}|${b}|${seg}`, () => {
    const bb = Math.max(0.002, Math.min(b, h / 2 - 1e-3, Math.min(rb, rt) - 1e-3))
    const pts = [V2(1e-4, -h / 2)]
    const arc = (cx, cy, a0, a1) => {
      for (let k = 0; k <= 4; k++) {
        const a = lerp(a0, a1, k / 4)
        pts.push(V2(cx + bb * Math.cos(a), cy + bb * Math.sin(a)))
      }
    }
    arc(rb - bb, -h / 2 + bb, -PI / 2, 0)
    arc(rt - bb, h / 2 - bb, 0, PI / 2)
    pts.push(V2(1e-4, h / 2))
    return new THREE.LatheGeometry(pts, seg)
  })
}
/** a lathe from [r, y] pairs (y increasing = normals out) */
const lathe = (key, pairs, seg = 48) =>
  cached(
    `lathe|${key}|${seg}`,
    () =>
      new THREE.LatheGeometry(
        pairs.map(([r, y]) => V2(r, y)),
        seg
      )
  )

/** collects transformed parts per material; freeze() gives one merged geometry per material */
class Kit {
  constructor() {
    this.parts = new Map()
    this.frame = null
  }
  put(mat, geo, m) {
    const g = clean(geo)
    if (m) g.applyMatrix4(m)
    if (this.frame) g.applyMatrix4(this.frame)
    if (!this.parts.has(mat)) this.parts.set(mat, [])
    this.parts.get(mat).push(g)
    return this
  }
  at(mat, geo, x = 0, y = 0, z = 0, rx = 0, ry = 0, rz = 0, sx = 1, sy = 1, sz = 1) {
    return this.put(mat, geo, mat4(x, y, z, rx, ry, rz, sx, sy, sz))
  }
  /** a rounded box, centred */
  box(mat, w, h, d, x, y, z, r = null, rx = 0, ry = 0, rz = 0) {
    return this.put(mat, rbox(w, h, d, r ?? Math.min(w, h, d) * 0.2), mat4(x, y, z, rx, ry, rz))
  }
  /** a rounded box between two corners */
  ext(mat, x0, x1, y0, y1, z0, z1, r = null) {
    return this.box(mat, x1 - x0, y1 - y0, z1 - z0, (x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2, r)
  }
  /** a plain box (small repeated ribs: bevels under 5 cm never show) */
  flat(mat, w, h, d, x, y, z, rx = 0, ry = 0, rz = 0) {
    return this.put(
      mat,
      cached(`box|${w}|${h}|${d}`, () => new THREE.BoxGeometry(w, h, d)),
      mat4(x, y, z, rx, ry, rz)
    )
  }
  /** a soft-edged cylinder; axis 'y' | 'x' | 'z' */
  cyl(mat, rb, rt, h, x, y, z, axis = 'y', b = 0.12, seg = 32) {
    const m =
      axis === 'x'
        ? mat4(x, y, z, 0, 0, -PI / 2)
        : axis === 'z'
          ? mat4(x, y, z, PI / 2, 0, 0)
          : mat4(x, y, z)
    return this.put(mat, rcyl(rb, rt, h, b, seg), m)
  }
  /** a plain round tube between two points ([x, y, z] or Vector3) */
  tube(mat, r, a, b, seg = 12) {
    const A = Array.isArray(a) ? V(...a) : a.clone()
    const B = Array.isArray(b) ? V(...b) : b.clone()
    const d = B.clone().sub(A)
    const len = d.length()
    const q = new THREE.Quaternion().setFromUnitVectors(V(0, 1, 0), d.multiplyScalar(1 / len))
    const geo = cached(`tube|${r}|${seg}`, () => new THREE.CylinderGeometry(r, r, 1, seg))
    return this.put(
      mat,
      geo,
      new THREE.Matrix4().compose(A.add(B).multiplyScalar(0.5), q, V(1, len, 1))
    )
  }
  /** a square bar with rounded edges between two points */
  bar(mat, a, b, t = 0.12) {
    const A = Array.isArray(a) ? V(...a) : a.clone()
    const B = Array.isArray(b) ? V(...b) : b.clone()
    const d = B.clone().sub(A)
    const len = d.length()
    const q = new THREE.Quaternion().setFromUnitVectors(V(0, 1, 0), d.multiplyScalar(1 / len))
    return this.put(
      mat,
      rbox(t, len + t, t, t * 0.4),
      new THREE.Matrix4().compose(A.add(B).multiplyScalar(0.5), q, V(1, 1, 1))
    )
  }
  /** run fn with every part placed through matrix m */
  within(m, fn) {
    const old = this.frame
    this.frame = old ? old.clone().multiply(m) : m.clone()
    fn()
    this.frame = old
    return this
  }
  freeze() {
    return [...this.parts].map(([mat, list]) => ({ mat, geo: mergeGeometries(list, false) }))
  }
}
/** a Group from a frozen kit; geometry and materials are shared, not copied */
function thaw(frozen, group = new THREE.Group()) {
  for (const { geo, mat } of frozen) {
    const m = new THREE.Mesh(geo, mat)
    m.castShadow = !mat.transparent && mat.side !== THREE.BackSide && !mat.userData.noCast
    m.receiveShadow = !mat.userData.noShadow && mat.side !== THREE.BackSide
    group.add(m)
  }
  return group
}
/** one mesh from a one-off kit (moving parts) */
function single(mat, build) {
  const K = new Kit()
  build(K, mat)
  return K.freeze()[0].geo
}
function meshOf(geo, mat, parent) {
  const m = new THREE.Mesh(geo, mat)
  m.castShadow = !mat.transparent && !mat.userData.noCast
  m.receiveShadow = true
  if (parent) parent.add(m)
  return m
}
/** a wall slab from an outline (x, y pairs in the wall frame) with rectangular holes [x0, y0, x1, y1], t thick behind z = 0 */
function wallSlab(outline, holes = [], t = 0.4) {
  const sh = new THREE.Shape(outline.map(([x, y]) => V2(x, y)))
  for (const [a, b, c, d] of holes)
    sh.holes.push(new THREE.Path([V2(a, b), V2(c, b), V2(c, d), V2(a, d)]))
  const g = new THREE.ExtrudeGeometry(sh, { depth: t, bevelEnabled: false, curveSegments: 4 })
  g.translate(0, 0, -t)
  return g
}
/** vertical ribs on a wall, in the wall's frame (x along it, y up, face at z = 0, ribs out toward +z) */
function ribs(
  K,
  mat,
  frame,
  x0,
  x1,
  top,
  { pitch = 0.82, w = 0.17, d = 0.07, gaps = [], y0 = 0 } = {}
) {
  const n = Math.floor((x1 - x0) / pitch)
  const off = (x1 - x0 - n * pitch) / 2
  for (let k = 0; k <= n; k++) {
    const x = x0 + off + k * pitch
    if (x < x0 + 0.25 || x > x1 - 0.25) continue
    let yb = y0
    for (const [a, b, yt] of gaps) if (x > a && x < b) yb = Math.max(yb, yt)
    const yt = top(x) - 0.05
    if (yt - yb < 0.15) continue
    K.put(
      mat,
      cached(`rib|${w}|${d}`, () => new THREE.BoxGeometry(w, 1, d)),
      frame.clone().multiply(mat4(x, (yb + yt) / 2, d / 2, 0, 0, 0, 1, yt - yb, 1))
    )
  }
}
/** a shape (in the x, z ground plane: shape y = -z) extruded upward from y0 to y1 with every edge rounded by b */
function slabUp(key, makeShape, y0, y1, b = 0.08) {
  return cached(`slab|${key}|${y0}|${y1}|${b}`, () => {
    const h = y1 - y0
    const g = new THREE.ExtrudeGeometry(makeShape(), {
      depth: Math.max(0.002, h - 2 * b),
      bevelEnabled: b > 0,
      bevelThickness: b,
      bevelSize: b,
      bevelSegments: 3,
      curveSegments: 48,
    })
    g.translate(0, 0, b)
    g.rotateX(-PI / 2)
    g.translate(0, y0, 0)
    return g
  })
}
/** a rounded rectangle path centred on the origin */
function roundRect(path, w, h, r, hole = false) {
  const x0 = -w / 2
  const y0 = -h / 2
  const pts = [
    [x0 + r, y0],
    [x0 + w - r, y0],
    [x0 + w, y0, x0 + w, y0 + r],
    [x0 + w, y0 + h - r],
    [x0 + w, y0 + h, x0 + w - r, y0 + h],
    [x0 + r, y0 + h],
    [x0, y0 + h, x0, y0 + h - r],
    [x0, y0 + r],
    [x0, y0, x0 + r, y0],
  ]
  if (hole) {
    // holes must wind the other way
    path.moveTo(x0 + r, y0)
    path.quadraticCurveTo(x0, y0, x0, y0 + r)
    path.lineTo(x0, y0 + h - r)
    path.quadraticCurveTo(x0, y0 + h, x0 + r, y0 + h)
    path.lineTo(x0 + w - r, y0 + h)
    path.quadraticCurveTo(x0 + w, y0 + h, x0 + w, y0 + h - r)
    path.lineTo(x0 + w, y0 + r)
    path.quadraticCurveTo(x0 + w, y0, x0 + w - r, y0)
    path.closePath()
    return path
  }
  path.moveTo(...pts[0])
  path.lineTo(...pts[1])
  path.quadraticCurveTo(...pts[2])
  path.lineTo(...pts[3])
  path.quadraticCurveTo(...pts[4])
  path.lineTo(...pts[5])
  path.quadraticCurveTo(...pts[6])
  path.lineTo(...pts[7])
  path.quadraticCurveTo(...pts[8])
  return path
}
/** a strip of a cylinder whose axis runs along x through (y = cy, z = cz): x0..x1, angle a0..a1 measured from +y toward
 *  +z. uv.u runs along +x, uv.v = 1 at a0: text printed on it reads along +x with its top toward a0. */
function barrelStrip(R, cy, cz, x0, x1, a0, a1, nx = 24, na = 16) {
  const pos = []
  const nor = []
  const uv = []
  const idx = []
  for (let j = 0; j <= na; j++) {
    const a = lerp(a0, a1, j / na)
    const ny = Math.cos(a)
    const nz = Math.sin(a)
    for (let i = 0; i <= nx; i++) {
      pos.push(lerp(x0, x1, i / nx), cy + R * ny, cz + R * nz)
      nor.push(0, ny, nz)
      uv.push(i / nx, 1 - j / na)
    }
  }
  for (let j = 0; j < na; j++)
    for (let i = 0; i < nx; i++) {
      const p = j * (nx + 1) + i
      const q = p + nx + 1
      idx.push(p, q, p + 1, p + 1, q, q + 1)
    }
  const g = new THREE.BufferGeometry()
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
  g.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3))
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2))
  g.setIndex(idx)
  return g
}

// ------------------------------------------------------------------------------------------------ vehicle kit (gse.js's)
/** a side profile x0..x1 by y0..y1, corner radii rc = [rear-bottom, front-bottom, front-top, rear-top], arches cut
 *  into the bottom edge [[x, cy, R]]; inset by the bevel b so the extruded walls land on the outline */
function profile(x0, x1, y0, y1, { arches = [], rc = [0.15, 0.15, 0.15, 0.15] } = {}, b = 0) {
  x0 += b
  x1 -= b
  y0 += b
  y1 -= b
  const [r0, r1, r2, r3] = rc.map((r) => Math.max(0.02, r - b))
  const s = new THREE.Shape()
  s.moveTo(x0 + r0, y0)
  for (const [ax, cy, R0] of [...arches].sort((p, q) => p[0] - q[0])) {
    const R = R0 + b
    const a = Math.asin(clamp((y0 - cy) / R, -1, 1))
    s.lineTo(ax - R * Math.cos(a), y0)
    s.absarc(ax, cy, R, PI - a, a, true)
  }
  s.lineTo(x1 - r1, y0)
  s.absarc(x1 - r1, y0 + r1, r1, -PI / 2, 0, false)
  s.lineTo(x1, y1 - r2)
  s.absarc(x1 - r2, y1 - r2, r2, 0, PI / 2, false)
  s.lineTo(x0 + r3, y1)
  s.absarc(x0 + r3, y1 - r3, r3, PI / 2, PI, false)
  s.lineTo(x0, y0 + r0)
  s.absarc(x0 + r0, y0 + r0, r0, PI, PI * 1.5, false)
  return s
}
/** a shape extruded `depth` along z (centred), every edge rounded by the bevel b */
function extrude(key, makeShape, depth, b = 0.12) {
  return cached(`ex|${key}|${depth}|${b}`, () => {
    const g = new THREE.ExtrudeGeometry(makeShape(), {
      depth: Math.max(0.002, depth - 2 * b),
      bevelEnabled: b > 0,
      bevelThickness: b,
      bevelSize: b,
      bevelSegments: 4,
      curveSegments: 20,
    })
    g.translate(0, 0, -(depth - 2 * b) / 2)
    return g
  })
}
/** the reference's cab-over cab (gse.js), with the wheel arch optional */
function cab(K, { x0, x1, y0 = 0.62, top, W, color, arches = [], stripe = null, seam }) {
  const M = mats()
  const b = 0.17
  const key = [x0, x1, y0, top, W, JSON.stringify(arches)].join('|')
  K.put(
    paint(color, 0.46),
    extrude(
      `cab|${key}`,
      () => profile(x0, x1, y0, top, { arches, rc: [0.14, 0.34, 0.44, 0.34] }, b),
      W,
      b
    )
  )
  const hw = W / 2
  const H = top - y0
  const wt = Math.min(top - 0.12 * H, top - 0.46)
  const wb = top - 0.5 * H
  K.ext(M.vGlass, x1 - 0.08, x1 + 0.035, wb, wt, -hw + 0.27, hw - 0.27, 0.05)
  for (const s of [-1, 1]) {
    K.ext(
      M.vGlass,
      x1 - Math.min(1.62, (x1 - x0) * 0.56),
      x1 - 0.34,
      wb,
      wt,
      s > 0 ? hw - 0.06 : -hw - 0.035,
      s > 0 ? hw + 0.035 : -hw + 0.06,
      0.05
    )
    K.ext(
      paint(seam),
      x1 - Math.min(1.8, (x1 - x0) * 0.62),
      x1 - Math.min(1.76, (x1 - x0) * 0.62) + 0.04,
      y0 + Math.min(0.85, H * 0.3),
      top - 0.3,
      s > 0 ? hw - 0.02 : -hw - 0.012,
      s > 0 ? hw + 0.012 : -hw + 0.02,
      0.008
    )
    K.ext(
      M.ink,
      x1 - Math.min(1.45, (x1 - x0) * 0.5),
      x1 - Math.min(1.15, (x1 - x0) * 0.4),
      wb - 0.3,
      wb - 0.22,
      s > 0 ? hw - 0.02 : -hw - 0.04,
      s > 0 ? hw + 0.04 : -hw + 0.02,
      0.02
    )
    K.bar(
      M.ink,
      [x1 - 0.2, wt - 0.25, s * (hw - 0.05)],
      [x1 - 0.05, wt - 0.25, s * (hw + 0.36)],
      0.07
    )
    K.ext(
      M.ink,
      x1 - 0.12,
      x1 + 0.02,
      wt - 0.95,
      wt - 0.12,
      s * (hw + 0.32) - 0.1,
      s * (hw + 0.32) + 0.1,
      0.05
    )
    if (stripe)
      K.ext(
        paint(stripe, 0.46),
        x0 + 0.22,
        x1 - 0.3,
        wb - 0.55,
        wb - 0.33,
        s > 0 ? hw - 0.02 : -hw - 0.02,
        s > 0 ? hw + 0.02 : -hw + 0.02,
        0.01
      )
  }
  const gb = y0 + 0.18 * H
  const gt = wb - 0.07 * H
  K.ext(M.ink, x1 - 0.06, x1 + 0.04, gb, gt, -0.92, 0.92, 0.06)
  const n = 5
  for (let k = 0; k < n; k++) {
    const y = gb + ((gt - gb) * (k + 0.55)) / (n + 0.1)
    K.ext(M.bumper, x1 + 0.01, x1 + 0.065, y - 0.03, y + 0.03, -0.8, 0.8, 0.02)
  }
  for (const s of [-1, 1])
    K.ext(
      M.lamp,
      x1 - 0.05,
      x1 + 0.045,
      gb,
      gb + 0.1 * H,
      s > 0 ? hw - 0.62 : -hw + 0.2,
      s > 0 ? hw - 0.2 : -hw + 0.62,
      0.06
    )
  K.ext(M.bumper, x1 - 0.3, x1 + 0.28, y0 - 0.06, y0 + 0.56, -hw - 0.08, hw + 0.08, 0.2)
}
/** an orange beacon on a dark ring */
function beacon(K, x, y, z, r = 0.16) {
  const M = mats()
  K.cyl(M.ink, r * 1.05, r * 1.15, r * 0.5, x, y + r * 0.25, z, 'y', 0.03, 18)
  K.at(
    M.beacon,
    cached(`dome|${r}`, () => new THREE.SphereGeometry(r, 18, 8, 0, TAU, 0, PI / 2)),
    x,
    y + r * 0.5,
    z
  )
}
/** a chunky tyre with round shoulders, axis along z */
function tyreGeo(r, w) {
  return cached(`tyre|${r}|${w}`, () => {
    const ri = r * 0.54
    const hw = w / 2
    const c = Math.min(hw * 0.78, (r - ri) * 0.62)
    const pts = [V2(ri, -hw * 0.84), V2((ri + r - c) / 2, -hw * 1.0)]
    for (let i = 0; i <= 7; i++) {
      const a = -PI / 2 + (PI / 2) * (i / 7)
      pts.push(V2(r - c + c * Math.cos(a), -hw + c + c * Math.sin(a)))
    }
    for (let i = 0; i <= 7; i++) {
      const a = (PI / 2) * (i / 7)
      pts.push(V2(r - c + c * Math.cos(a), hw - c + c * Math.sin(a)))
    }
    pts.push(V2((ri + r - c) / 2, hw * 1.0), V2(ri, hw * 0.84))
    const g = new THREE.LatheGeometry(pts, 44)
    g.rotateX(PI / 2)
    return g
  })
}
/** the light hub disc with a stepped centre */
function hubGeo(r, w) {
  return cached(`hub|${r}|${w}`, () => {
    const ri = r * 0.54
    const a = new THREE.CylinderGeometry(ri + 0.004, ri + 0.004, w * 0.76, 36).rotateX(PI / 2)
    const b = new THREE.CylinderGeometry(ri * 0.8, ri * 0.86, w * 0.84, 32).rotateX(PI / 2)
    return mergeGeometries([clean(a), clean(b)], false)
  })
}
/** the dark cap and 5 nuts, so a turning wheel reads as turning */
function capGeo(r, w) {
  return cached(`cap|${r}|${w}`, () => {
    const ri = r * 0.54
    const parts = [
      clean(new THREE.CylinderGeometry(ri * 0.3, ri * 0.3, w * 0.9, 24).rotateX(PI / 2)),
    ]
    for (let k = 0; k < 5; k++) {
      const a = (k / 5) * TAU
      parts.push(
        clean(
          new THREE.CylinderGeometry(ri * 0.075, ri * 0.075, w * 0.88, 8)
            .rotateX(PI / 2)
            .translate(Math.cos(a) * ri * 0.55, Math.sin(a) * ri * 0.55, 0)
        )
      )
    }
    return mergeGeometries(parts, false)
  })
}
/** wheels of one size as 3 instanced meshes (tyre, hub, cap); returns roll(d), a pure setter */
function wheelSet(parent, r, w, list) {
  const M = mats()
  const ims = [
    [tyreGeo(r, w), M.tyre],
    [hubGeo(r, w), M.hub],
    [capGeo(r, w), M.hubCap],
  ].map(([g, m]) => {
    const im = new THREE.InstancedMesh(g, m, list.length)
    im.castShadow = im.receiveShadow = true
    parent.add(im)
    return im
  })
  const m = new THREE.Matrix4()
  const roll = (d) => {
    const a = -d / r
    list.forEach(([x, z], i) => {
      m.compose(_p.set(x, r, z), _q.setFromEuler(_e.set(0, 0, a)), _s.set(1, 1, 1))
      for (const im of ims) im.setMatrixAt(i, m)
    })
    for (const im of ims) im.instanceMatrix.needsUpdate = true
  }
  roll(0)
  for (const im of ims) im.computeBoundingSphere()
  return roll
}
const pairs = (xs, z) =>
  xs.flatMap((x) => [
    [x, -z],
    [x, z],
  ])

// ================================================================================================ textures
const SRGB = THREE.SRGBColorSpace
const FONT = (weight, px, italic = false) =>
  `${italic ? 'italic ' : ''}${weight} ${px}px Inter, "Segoe UI", system-ui, sans-serif`
const TEX = new Map()
function canvasTex(key, w, h, draw) {
  if (TEX.has(key)) return TEX.get(key)
  const c = document.createElement('canvas')
  c.width = w
  c.height = h
  draw(c.getContext('2d'), w, h)
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = SRGB
  t.anisotropy = 8
  TEX.set(key, t)
  return t
}
function rr(g, x, y, w, h, r) {
  const k = Math.min(r, w / 2, h / 2)
  g.beginPath()
  g.moveTo(x + k, y)
  g.arcTo(x + w, y, x + w, y + h, k)
  g.arcTo(x + w, y + h, x, y + h, k)
  g.arcTo(x, y + h, x, y, k)
  g.arcTo(x, y, x + w, y, k)
  g.closePath()
}
/** the PADLINE mark: a toy rocket standing on a pad line, in a box of half-size s centred on (cx, cy) */
function drawPadMark(g, cx, cy, s, color, cut = null) {
  g.save()
  g.translate(cx, cy)
  g.fillStyle = color
  const w = 0.27 * s
  g.beginPath()
  g.moveTo(0, -0.98 * s)
  g.bezierCurveTo(w * 0.9, -0.78 * s, w, -0.5 * s, w, -0.25 * s)
  g.lineTo(w, 0.18 * s)
  g.lineTo(0.56 * s, 0.46 * s)
  g.lineTo(0.56 * s, 0.64 * s)
  g.lineTo(w, 0.52 * s)
  g.lineTo(-w, 0.52 * s)
  g.lineTo(-0.56 * s, 0.64 * s)
  g.lineTo(-0.56 * s, 0.46 * s)
  g.lineTo(-w, 0.18 * s)
  g.lineTo(-w, -0.25 * s)
  g.bezierCurveTo(-w, -0.5 * s, -w * 0.9, -0.78 * s, 0, -0.98 * s)
  g.closePath()
  g.fill()
  rr(g, -0.86 * s, 0.76 * s, 1.72 * s, 0.17 * s, 0.085 * s)
  g.fill()
  if (cut) {
    g.fillStyle = cut
    g.beginPath()
    g.arc(0, -0.3 * s, 0.11 * s, 0, TAU)
    g.fill()
  } else {
    g.globalCompositeOperation = 'destination-out'
    g.beginPath()
    g.arc(0, -0.3 * s, 0.11 * s, 0, TAU)
    g.fill()
  }
  g.restore()
}
/** text on a rounded plate (bg null = transparent); returns {tex, aspect} */
function plate(
  text,
  {
    bg = TOY.blue,
    fg = '#ffffff',
    px = 92,
    h = 150,
    padX = 0.42,
    radius = 0.26,
    weight = 800,
    italic = false,
    mark = false,
  } = {}
) {
  const key = ['plate', text, bg, fg, px, h, padX, radius, weight, italic, mark].join('|')
  if (TEX.has(key)) return TEX.get(key)
  const m = document.createElement('canvas').getContext('2d')
  m.font = FONT(weight, px, italic)
  const markW = mark ? h * 0.82 : 0
  const w = Math.ceil(m.measureText(text).width + 2 * h * padX + markW)
  const tex = canvasTex(key, w, h, (g) => {
    if (bg) {
      rr(g, 1, 1, w - 2, h - 2, h * radius)
      g.fillStyle = bg
      g.fill()
    }
    if (mark) drawPadMark(g, h * padX + markW * 0.38, h / 2, h * 0.34, fg, bg)
    g.font = FONT(weight, px, italic)
    g.fillStyle = fg
    g.textAlign = 'center'
    g.textBaseline = 'middle'
    g.fillText(text, (w + markW) / 2, h / 2 + px * 0.04)
  })
  const out = { tex, aspect: w / h }
  TEX.set(key, out)
  return out
}
/** the wall sign: a white rounded panel, the mark, PADLINE in blue and a line under it */
function signTex(name, sub) {
  const key = ['sign', name, sub].join('|')
  if (TEX.has(key)) return TEX.get(key)
  const m = document.createElement('canvas').getContext('2d')
  m.font = FONT(800, 92, true)
  const w1 = m.measureText(name).width
  m.font = FONT(600, 42)
  const w2 = m.measureText(sub).width
  const w = Math.ceil(Math.max(w1, w2) + 250)
  const h = 200
  const tex = canvasTex(key, w, h, (g) => {
    rr(g, 2, 2, w - 4, h - 4, 30)
    g.fillStyle = '#ffffff'
    g.fill()
    drawPadMark(g, 98, h / 2, 66, TOY.blue, '#ffffff')
    g.fillStyle = TOY.blue
    g.font = FONT(800, 92, true)
    g.textBaseline = 'middle'
    g.fillText(name, 180, h / 2 - 22)
    g.fillStyle = TOY.blueLight
    g.font = FONT(600, 42)
    g.fillText(sub, 184, h / 2 + 50)
  })
  const out = { tex, aspect: w / h }
  TEX.set(key, out)
  return out
}
/** a band of repeated text for the tanks: bg colour, fg text, reps copies around */
function bandTex(
  text,
  { bg = TOY.blue, fg = '#ffffff', w = 4096, h = 192, reps = 3, px = 112 } = {}
) {
  return canvasTex(['band', text, bg, fg, w, h, reps, px].join('|'), w, h, (g) => {
    g.fillStyle = bg
    g.fillRect(0, 0, w, h)
    g.fillStyle = fg
    g.font = FONT(800, px, true)
    g.textAlign = 'center'
    g.textBaseline = 'middle'
    for (let i = 0; i < reps; i++) {
      const cx = (w * (i + 0.5)) / reps
      g.fillText(text, cx + h * 0.4, h / 2 + px * 0.04)
      drawPadMark(g, cx - g.measureText(text).width / 2 - h * 0.18, h / 2, h * 0.34, fg, bg)
    }
  })
}
const DECAL = new Map()
function decalMat(tex) {
  if (!DECAL.has(tex)) {
    const m = new THREE.MeshStandardMaterial({
      map: tex,
      transparent: true,
      roughness: 0.55,
      polygonOffset: true,
      polygonOffsetFactor: -2,
      polygonOffsetUnits: -2,
    })
    m.depthWrite = false
    m.userData.noCast = true
    DECAL.set(tex, m)
  }
  return DECAL.get(tex)
}
/** a flat decal facing +z, h tall */
function decal(tex, aspect, h) {
  const m = new THREE.Mesh(
    cached(`plane|${aspect.toFixed(4)}|${h}`, () => new THREE.PlaneGeometry(h * aspect, h)),
    decalMat(tex)
  )
  m.receiveShadow = true
  return m
}
/** a decal lying flat on the ground (facing +y), w along x, d along z */
function groundDecal(tex, w, d) {
  const m = new THREE.Mesh(
    cached(`gplane|${w}|${d}`, () => new THREE.PlaneGeometry(w, d).rotateX(-PI / 2)),
    decalMat(tex)
  )
  m.receiveShadow = true
  return m
}
/** a printed band around a vertical tank: an open cylinder slightly proud of the skin */
function bandMesh(tex, r, h, seg = 96) {
  const mat = cached(
    `bandmat|${tex.uuid}`,
    () => new THREE.MeshStandardMaterial({ map: tex, roughness: 0.5 })
  )
  const m = new THREE.Mesh(
    cached(`band|${r}|${h}|${seg}`, () => new THREE.CylinderGeometry(r, r, h, seg, 1, true)),
    mat
  )
  m.castShadow = false
  m.receiveShadow = true
  return m
}

// ================================================================================================ 1. the integration hangar
const HF = {
  W: 64,
  D: 30,
  eave: 12,
  top: 15.6,
  doorW: 15,
  doorH: 13,
  leafW: 2.8,
  leafY0: 0.56,
  leafY1: 13.5,
}
const hifArc = once(() => {
  const { D, eave, top } = HF
  const sag = top - eave
  const R = ((D / 2) ** 2 + sag * sag) / (2 * sag)
  const cy = top - R
  return { R, cy, y: (u) => cy + Math.sqrt(Math.max(0, R * R - u * u)), a0: Math.asin(D / 2 / R) }
})
/** the door leaves: closed centres (per side, |z|), the open stack, and the track each rides (x in front of the wall) */
const LEAVES = [
  { closed: 1.4, x: HF.W / 2 + 1.41 },
  { closed: 4.05, x: HF.W / 2 + 1.12 },
  { closed: 6.7, x: HF.W / 2 + 0.83 },
]
const LEAF_OPEN = 9.1
const leafGeo = once(() => {
  const { leafW: w } = HF
  const h = HF.leafY1 - HF.leafY0
  const panel = new Kit()
  panel.flat(null, w - 0.3, h - 0.3, 0.14, 0, h / 2, 0)
  for (let y = 0.7; y < h - 0.4; y += 0.62) panel.flat(null, w - 0.32, 0.07, 0.2, 0, y, 0)
  const frame = new Kit()
  frame.box(null, w, 0.34, 0.26, 0, h - 0.17, 0, 0.1)
  frame.box(null, w, 0.34, 0.26, 0, 0.17, 0, 0.1)
  frame.box(null, w, 0.26, 0.24, 0, h * 0.42, 0, 0.08)
  for (const s of [-1, 1]) frame.box(null, 0.3, h, 0.26, s * (w / 2 - 0.15), h / 2, 0, 0.1)
  return { panel: panel.freeze()[0].geo, frame: frame.freeze()[0].geo }
})
/** the door frame, the track, and (static) closed leaves when closedLeaves; built in the end wall's frame */
function hangarDoor(K, frame, closedLeaves) {
  const M = mats()
  const { doorW, doorH } = HF
  K.within(frame, () => {
    // posts and header, proud of the wall (local z = out)
    for (const s of [-1, 1])
      K.box(M.blue, 0.9, doorH + 0.8, 0.7, s * (doorW / 2 + 0.45), (doorH + 0.8) / 2, 0.25, 0.28)
    K.box(M.blue, doorW + 1.8, 0.8, 0.7, 0, doorH + 0.4, 0.25, 0.28)
    // the top track the leaves hang from, and the threshold
    K.box(M.blueDeep, 20.8, 0.36, 0.95, 0, HF.leafY1 + 0.18, 1.08, 0.14)
    K.box(M.shade, doorW + 1.8, 0.08, 1.6, 0, 0.04, 0.8, 0.03)
    if (closedLeaves) {
      const G = leafGeo()
      for (const s of [-1, 1])
        for (const L of LEAVES) {
          const m = mat4(s * L.closed, HF.leafY0, L.x - HF.W / 2)
          K.put(M.slat, G.panel, m)
          K.put(M.blue, G.frame, m)
        }
    }
  })
}
const hangarKit = once(() => {
  const M = mats()
  const K = new Kit()
  const { W, D, eave, doorW, doorH } = HF
  const A = hifArc()
  const outline = [
    [-D / 2, 0],
    [D / 2, 0],
    [D / 2, eave],
  ]
  for (let k = 1; k < 48; k++) {
    const u = D / 2 - (D * k) / 48
    outline.push([u, A.y(u)])
  }
  outline.push([-D / 2, eave])
  // the end walls: the door end (+x) and the back (-x), in frames whose local x runs along the wall, z out
  const front = mat4(W / 2, 0, 0, 0, PI / 2, 0)
  const back = mat4(-W / 2, 0, 0, 0, -PI / 2, 0)
  const gaps = [[-doorW / 2 - 0.95, doorW / 2 + 0.95, doorH + 0.8]]
  K.put(M.wall, wallSlab(outline, [[-doorW / 2, 0, doorW / 2, doorH]], 0.5), front)
  ribs(K, M.wall, front, -D / 2, D / 2, A.y, { gaps })
  K.put(M.wall, wallSlab(outline, [], 0.5), back)
  ribs(K, M.wall, back, -D / 2, D / 2, A.y, { gaps })
  hangarDoor(K, front, false)
  hangarDoor(K, back, true)
  // the long walls, a band of high windows, a personnel door on +z
  for (const s of [-1, 1]) {
    const fr = s > 0 ? mat4(0, 0, D / 2) : mat4(0, 0, -D / 2, 0, PI, 0)
    K.put(
      M.wall,
      wallSlab(
        [
          [-W / 2, 0],
          [W / 2, 0],
          [W / 2, eave],
          [-W / 2, eave],
        ],
        [],
        0.5
      ),
      fr
    )
    ribs(K, M.wall, fr, -W / 2, W / 2, () => eave, { gaps: s > 0 ? [[18.6, 21.4, 3.2]] : [] })
    for (let x = -W / 2 + 4.2; x < W / 2 - 3; x += 4.6)
      K.box(M.window, 3.2, 1.5, 0.3, x, eave - 2.3, s * (D / 2 + 0.06), 0.12)
  }
  K.box(M.blue, 2.4, 3.2, 0.3, 20, 1.6, D / 2 + 0.1, 0.12)
  K.box(M.glass, 1.6, 2.5, 0.3, 20, 1.3, D / 2 + 0.16, 0.08)
  K.box(M.blue, 3.2, 0.3, 1.4, 20, 3.35, D / 2 + 0.6, 0.1)
  // the barrel roof along x: a shell, ribs over it, deep blue trims at both ends, gutters along the eaves
  const shellShape = (r0, r1, aa) => {
    const sh = new THREE.Shape()
    sh.absarc(0, A.cy, r1, PI / 2 - aa, PI / 2 + aa, false)
    sh.absarc(0, A.cy, r0, PI / 2 + aa, PI / 2 - aa, true)
    return sh
  }
  const roofFrame = mat4(0, 0, 0, 0, PI / 2, 0)
  const shell = new THREE.ExtrudeGeometry(shellShape(A.R - 0.1, A.R + 0.25, A.a0 + 0.012), {
    depth: W + 1.2,
    bevelEnabled: false,
    curveSegments: 80,
  })
  shell.translate(0, 0, -(W + 1.2) / 2)
  K.put(M.roof, shell, roofFrame)
  const rib = new THREE.ExtrudeGeometry(shellShape(A.R + 0.2, A.R + 0.36, A.a0 + 0.01), {
    depth: 0.24,
    bevelEnabled: false,
    curveSegments: 80,
  })
  for (let x = -W / 2 - 0.25; x < W / 2 + 0.3; x += 1.0)
    K.put(M.roof, rib, roofFrame.clone().multiply(mat4(0, 0, x)))
  const trim = new THREE.ExtrudeGeometry(shellShape(A.R - 0.35, A.R + 0.55, A.a0 + 0.03), {
    depth: 0.6,
    bevelEnabled: false,
    curveSegments: 80,
  })
  K.put(M.blueDeep, trim, roofFrame.clone().multiply(mat4(0, 0, W / 2 - 0.1)))
  K.put(M.blueDeep, trim, roofFrame.clone().multiply(mat4(0, 0, -W / 2 - 0.5)))
  for (const s of [-1, 1])
    K.box(M.blueDeep, W + 1.6, 0.5, 0.5, 0, eave + 0.05, s * (D / 2 + 0.35), 0.16)
  for (const [x, z] of [
    [-W / 2, -D / 2],
    [W / 2, -D / 2],
    [-W / 2, D / 2],
    [W / 2, D / 2],
  ])
    K.box(M.blue, 0.8, eave + 0.3, 0.8, x, eave / 2, z, 0.24)
  // downpipes on the long walls
  for (const s of [-1, 1])
    for (const x of [-W / 6, W / 6])
      K.box(M.blue, 0.32, eave - 0.4, 0.32, x, (eave - 0.4) / 2, s * (D / 2 + 0.25), 0.12)
  // the hall: the end-wall outline shrunk a little, extruded along x, seen from inside, lit and shadowless
  const hall = new THREE.ExtrudeGeometry(
    new THREE.Shape(outline.map(([u, y]) => V2(u * 0.97, y * 0.97 + 0.01))),
    { depth: W - 1.2, bevelEnabled: false, curveSegments: 4 }
  )
  hall.translate(0, 0, -(W - 1.2) / 2)
  K.put(M.room, hall, roofFrame)
  return K.freeze()
})
export function buildToyIntegrationHangar() {
  const M = mats()
  const { W, D, doorW, doorH } = HF
  const group = thaw(hangarKit())
  group.name = 'integration-hangar'
  // the moving leaves: three per side on three tracks
  const G = leafGeo()
  const leaves = []
  for (const s of [-1, 1])
    for (const L of LEAVES) {
      const g = new THREE.Group()
      g.position.set(L.x, HF.leafY0, 0)
      g.rotation.y = PI / 2
      meshOf(G.panel, M.slat, g)
      meshOf(G.frame, M.blue, g)
      group.add(g)
      leaves.push({ g, s, L })
    }
  const setDoor = (k) => {
    const u = sat(k)
    for (const { g, s, L } of leaves) g.position.z = -s * lerp(L.closed, LEAF_OPEN, u)
  }
  setDoor(0)
  // signs: a plate above the door, the big panel on the +z wall, the name painted on the roof
  const p = plate('PADLINE', { px: 100, h: 150, padX: 0.34, mark: true })
  const pb = new THREE.Mesh(rbox(p.aspect * 1.05 + 0.2, 1.25, 0.16, 0.08), M.blue)
  pb.position.set(W / 2 + 0.1, doorH + 1.55, 0)
  pb.rotation.y = PI / 2
  pb.castShadow = pb.receiveShadow = true
  group.add(pb)
  const pd = decal(p.tex, p.aspect, 1.05)
  pd.position.set(W / 2 + 0.19, doorH + 1.55, 0)
  pd.rotation.y = PI / 2
  group.add(pd)
  const s = signTex('PADLINE', 'Horizontal Integration')
  const sh = 3.2
  const sp = new THREE.Mesh(rbox(s.aspect * sh + 0.1, sh + 0.1, 0.2, 0.1), M.white)
  sp.position.set(0, 6.6, D / 2 + 0.16)
  sp.castShadow = sp.receiveShadow = true
  group.add(sp)
  const sd = decal(s.tex, s.aspect, sh)
  sd.position.set(0, 6.6, D / 2 + 0.27)
  group.add(sd)
  const A = hifArc()
  const roofText = canvasTex('hif-roof', 2048, 512, (g, w, h) => {
    g.fillStyle = '#ffffff'
    g.font = FONT(800, 330, true)
    g.textAlign = 'center'
    g.textBaseline = 'middle'
    const tw = g.measureText('PADLINE').width
    g.fillText('PADLINE', w / 2 + 150, h / 2 + 14)
    drawPadMark(g, w / 2 - tw / 2 - 40, h / 2, 190, '#ffffff')
  })
  const strip = new THREE.Mesh(
    cached('hif-strip', () => barrelStrip(A.R + 0.39, A.cy, 0, -16, 16, -0.07, 0.17, 32, 12)),
    decalMat(roofText)
  )
  group.add(strip)
  return { group, setDoor, door: { x: W / 2, width: doorW, height: doorH } }
}

// ================================================================================================ 2. rails
export const RAIL_TOP = 0.52
export function buildToyRails({ length = 150 } = {}) {
  const M = mats()
  const frozen = cached(`rails|${length}`, () => {
    const K = new Kit()
    K.ext(M.concrete, 0, length, 0, 0.14, -3.4, 3.4, 0.05)
    for (const s of [-1, 1]) {
      const z = s * 3.0
      K.ext(M.rail, 0, length, 0.3, 0.37, z - 0.19, z + 0.19, 0.025)
      K.ext(M.rail, 0, length, 0.34, 0.45, z - 0.05, z + 0.05, 0.02)
      K.ext(M.steel, 0, length, 0.42, RAIL_TOP, z - 0.11, z + 0.11, 0.035)
    }
    return K.freeze()
  })
  const group = thaw(frozen)
  group.name = 'rails'
  const pitch = 1.5
  const n = Math.max(1, Math.floor((length - 0.4) / pitch) + 1)
  const im = new THREE.InstancedMesh(rbox(0.56, 0.16, 6.5, 0.05), M.sleeper, n)
  const m = new THREE.Matrix4()
  for (let i = 0; i < n; i++) im.setMatrixAt(i, m.makeTranslation(0.4 + i * pitch, 0.22, 0))
  im.castShadow = im.receiveShadow = true
  im.computeBoundingSphere()
  group.add(im)
  group.userData.railTop = RAIL_TOP
  return group
}

// ================================================================================================ 3. the launch mount
const MOUNT = {
  deckY: 6.0,
  half: 5,
  hole: 2.6,
  ring: 3.4,
  clampR: 3.95,
  trenchIn: 3.5,
  trenchOut: 4.1,
  trenchH: 3.0,
  trenchEnd: 34,
  back: -4.2,
  legX: 4.0,
  legZ: 4.55,
}
const mountKit = once(() => {
  const M = mats()
  const K = new Kit()
  const { deckY, half, hole, ring, trenchIn, trenchOut, trenchH, trenchEnd, back, legX, legZ } =
    MOUNT
  // the apron
  K.ext(M.apron, -26, 36, -0.04, 0.06, -30, 30, 0.05)
  // the flame trench: floor, side walls and back wall, light caps, a dark lining where the flame hits
  K.ext(M.concreteDeep, back + 0.6, trenchEnd, 0, 0.14, -trenchIn - 0.02, trenchIn + 0.02, 0.05)
  for (const s of [-1, 1]) {
    K.ext(
      M.concrete,
      back,
      trenchEnd,
      0,
      trenchH,
      s > 0 ? trenchIn : -trenchOut,
      s > 0 ? trenchOut : -trenchIn,
      0.2
    )
    K.ext(
      M.panel,
      back - 0.08,
      trenchEnd + 0.08,
      trenchH - 0.06,
      trenchH + 0.16,
      s > 0 ? trenchIn - 0.08 : -trenchOut - 0.08,
      s > 0 ? trenchOut + 0.08 : -trenchIn + 0.08,
      0.08
    )
    K.ext(
      M.scorch,
      back + 0.6,
      12,
      0.14,
      trenchH - 0.35,
      s > 0 ? trenchIn - 0.05 : -trenchIn,
      s > 0 ? trenchIn : -trenchIn + 0.05,
      0.02
    )
  }
  K.ext(M.concrete, back, back + 0.6, 0, trenchH, -trenchOut, trenchOut, 0.2)
  K.ext(
    M.panel,
    back - 0.08,
    back + 0.68,
    trenchH - 0.06,
    trenchH + 0.16,
    -trenchOut - 0.08,
    trenchOut + 0.08,
    0.08
  )
  // the deflector: a curved ramp from the back wall (y 4.2) down to the floor at x 6.5, across the trench
  const x0 = back + 0.6
  const yTop = 4.2
  const xe = 6.5
  const ye = 0.14
  const R = ((xe - x0) ** 2 + (yTop - ye) ** 2) / (2 * (yTop - ye))
  const cy = ye + R
  const tS = Math.atan2(yTop - cy, x0 - xe)
  const defl = new THREE.Shape()
  defl.moveTo(x0, ye)
  defl.lineTo(x0, yTop)
  for (let i = 1; i <= 24; i++) {
    const t = lerp(tS, -PI / 2, i / 24)
    defl.lineTo(xe + R * Math.cos(t), cy + R * Math.sin(t))
  }
  defl.lineTo(x0, ye)
  const dg = new THREE.ExtrudeGeometry(defl, {
    depth: 2 * trenchIn - 0.3,
    bevelEnabled: true,
    bevelThickness: 0.06,
    bevelSize: 0.06,
    bevelSegments: 2,
    curveSegments: 4,
  })
  dg.translate(0, 0, -(2 * trenchIn - 0.3) / 2)
  K.put(M.scorch, dg)
  // legs on footings beside the trench, girders under the deck
  for (const sx of [-1, 1])
    for (const sz of [-1, 1]) {
      K.ext(
        M.concrete,
        sx * legX - 0.7,
        sx * legX + 0.7,
        0,
        0.45,
        sz > 0 ? trenchOut + 0.05 : -legZ - 0.8,
        sz > 0 ? legZ + 0.8 : -trenchOut - 0.05,
        0.12
      )
      K.box(M.blueDeep, 1.0, 4.3 - 0.3, 0.8, sx * legX, 0.3 + (4.3 - 0.3) / 2, sz * legZ, 0.16)
    }
  for (const sz of [-1, 1]) K.box(M.blueDeep, 2 * half - 0.2, 0.7, 0.8, 0, 4.62, sz * legZ, 0.16)
  for (const sx of [-1, 1]) K.box(M.blueDeep, 1.0, 0.7, 2 * half - 0.2, sx * legX, 4.62, 0, 0.16)
  // the deck: a blue table under a light top, the steel ring around the opening
  const deckShape = (b) => () => {
    const s = roundRect(new THREE.Shape(), 2 * (half - b), 2 * (half - b), 1.0 - b)
    s.holes.push(new THREE.Path().absarc(0, 0, ring, 0, TAU, true))
    return s
  }
  K.put(M.blueDeep, slabUp('deck-lo', deckShape(0.1), 4.95, 5.62, 0.1))
  K.put(M.panel, slabUp('deck-hi', deckShape(0.06), 5.6, deckY, 0.06))
  const ringShape = () => {
    const s = new THREE.Shape().absarc(0, 0, ring + 0.02, 0, TAU, false)
    s.holes.push(new THREE.Path().absarc(0, 0, hole, 0, TAU, true))
    return s
  }
  K.put(M.steel, slabUp('deck-ring', ringShape, 4.95, deckY, 0.05))
  // the clamp bases and posts on the diagonals
  for (let i = 0; i < 4; i++) {
    const a = PI / 4 + (i * PI) / 2
    const cx = Math.cos(a) * MOUNT.clampR
    const cz = Math.sin(a) * MOUNT.clampR
    K.box(M.blueDeep, 1.6, 0.42, 1.4, cx, deckY + 0.21, cz, 0.14, 0, -a, 0)
    K.cyl(M.steel, 0.4, 0.4, 1.4, cx, deckY + 0.7, cz, 'y', 0.1, 20)
  }
  // the erector's hinge brackets: low concrete pedestals outboard, a steel eye, a pin reaching in to |z| 2.87
  for (const s of [-1, 1]) {
    K.ext(M.concrete, -8.2, -6.8, 0, 0.5, s > 0 ? 3.6 : -4.8, s > 0 ? 4.8 : -3.6, 0.12)
    K.ext(M.blueDeep, -7.95, -7.05, 0.45, 0.95, s > 0 ? 3.62 : -4.45, s > 0 ? 4.45 : -3.62, 0.08)
    K.cyl(M.blueDeep, 0.45, 0.45, 0.83, -7.5, 0.9, s * 4.035, 'z', 0.08, 24)
    K.cyl(M.steel, 0.2, 0.2, 0.8, -7.5, 0.9, s * 3.25, 'z', 0.04, 18)
    K.cyl(M.steel, 0.3, 0.3, 0.12, -7.5, 0.9, s * 2.93, 'z', 0.03, 18)
  }
  return K.freeze()
})
/** the clamp arm, in its own frame: post axis at the origin (deck level y = 0), local +x pointing in at the rocket;
 *  a hinge collar on the post, a chunky arm, a jaw whose dark pad meets the skirt at radius 2.3 */
const clampGeo = once(() => {
  const j = MOUNT.clampR - 2.3
  return {
    arm: single(null, (K) => {
      K.cyl(null, 0.58, 0.58, 0.75, 0, 1.55, 0, 'y', 0.14, 24)
      K.ext(null, 0, j - 0.3, 1.32, 1.92, -0.34, 0.34, 0.16)
      K.ext(null, j - 0.62, j - 0.08, 1.1, 1.95, -0.52, 0.52, 0.16)
    }),
    pad: single(null, (K) => K.ext(null, j - 0.14, j, 1.16, 1.86, -0.44, 0.44, 0.05)),
  }
})
function apronTex() {
  return canvasTex('pad-apron', 2048, 2048, (g, w, h) => {
    // the apron is 62 x 60 m: x -26..36, z -30..30
    const sx = w / 62
    const sz = h / 60
    const X = (x) => (x + 26) * sx
    const Z = (z) => (z + 30) * sz
    g.strokeStyle = 'rgba(152, 164, 206, 0.55)'
    g.lineWidth = 0.13 * sx
    for (let x = -24; x < 36; x += 6) {
      g.beginPath()
      g.moveTo(X(x), 0)
      g.lineTo(X(x), h)
      g.stroke()
    }
    for (let z = -24; z < 30; z += 6) {
      g.beginPath()
      g.moveTo(0, Z(z))
      g.lineTo(w, Z(z))
      g.stroke()
    }
    // the keep-clear ring around the mount, dashed blue
    g.strokeStyle = TOY.blue
    g.lineWidth = 0.45 * sx
    g.setLineDash([2.2 * sx, 1.4 * sx])
    g.beginPath()
    g.ellipse(X(0), Z(0), 13 * sx, 13 * sz, 0, 0, TAU)
    g.stroke()
    g.setLineDash([])
    // the rail ends: two blue bars where the erector stops
    g.fillStyle = TOY.blue
    for (const s of [-1, 1]) g.fillRect(X(-7.0), Z(s * 3.0 - 0.9), 0.5 * sx, 1.8 * sz)
  })
}
export function buildToyLaunchMount() {
  const M = mats()
  const group = thaw(mountKit())
  group.name = 'launch-mount'
  const ap = groundDecal(apronTex(), 62, 60)
  ap.position.set(5, 0.062, 0)
  group.add(ap)
  // the name on the deck's +z and +x faces
  const p = plate('PADLINE', { bg: null, fg: '#ffffff', px: 110, h: 150, padX: 0.1, mark: true })
  for (const [x, z, ry] of [
    [0, MOUNT.half + 0.015, 0],
    [MOUNT.half + 0.015, 0, PI / 2],
  ]) {
    const d = decal(p.tex, p.aspect, 0.46)
    d.position.set(x, 5.28, z)
    d.rotation.y = ry
    group.add(d)
  }
  // the clamps: each arm turns about its post; 1 closed, 0 swung back
  const arms = []
  for (let i = 0; i < 4; i++) {
    const a = PI / 4 + (i * PI) / 2
    const pivot = new THREE.Group()
    pivot.position.set(Math.cos(a) * MOUNT.clampR, MOUNT.deckY, Math.sin(a) * MOUNT.clampR)
    pivot.rotation.y = PI - a // local +x points in at the axis
    const arm = new THREE.Group()
    pivot.add(arm)
    meshOf(clampGeo().arm, M.blueDeep, arm)
    meshOf(clampGeo().pad, M.navy, arm)
    group.add(pivot)
    arms.push(arm)
  }
  const setClamps = (k) => {
    const r = (1 - sat(k)) * 100 * D2R
    for (const arm of arms) arm.rotation.y = r
  }
  setClamps(1)
  return { group, deckY: MOUNT.deckY, hinge: V(-7.5, 0.9, 0), setClamps }
}

// ================================================================================================ 5. the pipe rack
const RACK = {
  beamTop: 2.3,
  pipes: [
    { oz: -0.75, r: 0.36, mat: 'white' },
    { oz: 0, r: 0.27, mat: 'steel' },
    { oz: 0.75, r: 0.22, mat: 'blueLight' },
  ],
}
/**
 * a rack along local +x in frame `frame`: T-supports from `from` to len (inset 1 m from the ends, at most 6 m apart),
 * pipe i from start[i] to end[i] (default 0..len) with flanges between supports
 */
function rackInto(
  K,
  { len, frame = new THREE.Matrix4(), start = null, end = null, from = 0, caps = true }
) {
  const M = mats()
  K.within(frame, () => {
    const span = len - from - 2
    const n = Math.max(1, Math.ceil(span / 6))
    const xs = Array.from({ length: n + 1 }, (_, i) => from + 1 + (span * i) / n)
    for (const x of xs) {
      K.box(M.concrete, 0.9, 0.3, 0.9, x, 0.15, 0, 0.08)
      K.box(M.blue, 0.34, 1.75, 0.34, x, 0.3 + 0.875, 0, 0.1)
      K.box(M.blue, 0.4, 0.3, 2.5, x, 2.15, 0, 0.1)
      for (const s of [-1, 1]) K.bar(M.blue, [x, 1.45, s * 0.12], [x, 2.02, s * 0.72], 0.12)
    }
    RACK.pipes.forEach((p, i) => {
      const a = start ? start[i] : 0
      const b = end ? end[i] : len
      const y = RACK.beamTop + p.r
      K.cyl(M[p.mat], p.r, p.r, b - a, (a + b) / 2, y, p.oz, 'x', Math.min(0.08, p.r * 0.3), 20)
      for (let k = 0; k < xs.length - 1; k++) {
        const fx = (xs[k] + xs[k + 1]) / 2
        if (fx > a + 0.4 && fx < b - 0.4)
          K.cyl(M[p.mat], p.r + 0.07, p.r + 0.07, 0.18, fx, y, p.oz, 'x', 0.04, 20)
      }
      if (caps)
        for (const x of [a, b])
          K.cyl(M.steel, p.r + 0.05, p.r + 0.05, 0.12, x, y, p.oz, 'x', 0.03, 20)
    })
  })
}
export function buildToyPipeRack({ length = 40 } = {}) {
  const frozen = cached(`rack|${length}`, () => {
    const K = new Kit()
    rackInto(K, { len: length })
    return K.freeze()
  })
  const g = thaw(frozen)
  g.name = 'pipe-rack'
  return g
}

// ================================================================================================ 4. the tank farm
const FARM = {
  W: 56,
  D: 28,
  lox: { x: -14, y: 9.6, z: -2, R: 7 },
  rp1: { x: 10, y: 3.3, zs: [-8.3, -2.6], r: 2.4, len: 15.4 },
  rackZ: 6.4,
  rackX0: -6.5,
  rackX1: 26,
}
/** a horizontal capsule tank along x (cylinder + elliptic heads), centred */
const capsuleGeo = (r, len, head) =>
  cached(`capsule|${r}|${len}|${head}`, () => {
    const body = len / 2 - head
    const pts = []
    for (let i = 0; i <= 10; i++) {
      const t = (i / 10) * (PI / 2)
      pts.push([r * Math.sin(t), -body - head * Math.cos(t)])
    }
    for (let i = 0; i <= 10; i++) {
      const t = (i / 10) * (PI / 2)
      pts.push([r * Math.cos(t), body + head * Math.sin(t)])
    }
    pts[0][0] = 1e-4
    pts[pts.length - 1][0] = 1e-4
    return new THREE.LatheGeometry(
      pts.map(([a, b]) => V2(a, b)),
      48
    ).rotateZ(-PI / 2)
  })
const GAUGE = { w: 1.5, h: 7.0, y0: 1.3, barW: 0.86, barY0: 1.65, barH: 5.4 }
function gaugeInto(K, x, z) {
  const M = mats()
  const fr = mat4(x, 0, z, 0, FILM_AZ, 0)
  K.within(fr, () => {
    K.box(M.concrete, 1.4, 0.3, 1.0, 0, 0.15, 0, 0.08)
    K.box(M.blue, 0.3, GAUGE.y0, 0.3, 0, GAUGE.y0 / 2 + 0.2, 0, 0.1)
    K.box(M.white, GAUGE.w, GAUGE.h, 0.32, 0, GAUGE.y0 + GAUGE.h / 2, 0, 0.12)
    K.box(
      M.shade,
      GAUGE.barW + 0.16,
      GAUGE.barH + 0.16,
      0.06,
      0,
      GAUGE.barY0 + GAUGE.barH / 2,
      0.15,
      0.03
    )
    for (let i = 1; i < 4; i++)
      K.box(
        M.post,
        0.32,
        0.05,
        0.04,
        -GAUGE.barW / 2 - 0.12,
        GAUGE.barY0 + (GAUGE.barH * i) / 4,
        0.18,
        0.01
      )
  })
}
const farmKit = once(() => {
  const M = mats()
  const K = new Kit()
  const { W, D, lox, rp1 } = FARM
  // the slab
  K.ext(M.apron, -W / 2, W / 2, -0.04, 0.06, -D / 2, D / 2, 0.05)
  // ---- the LOX sphere on 8 legs with X braces
  const legs = Array.from({ length: 8 }, (_, i) => PI / 8 + (i * PI) / 4)
  const legAt = (a, y) => [lox.x + Math.cos(a) * lox.R, y, lox.z + Math.sin(a) * lox.R]
  for (const a of legs) {
    const [x, , z] = legAt(a, 0)
    K.box(M.concrete, 1.4, 0.5, 1.4, x, 0.25, z, 0.12)
    K.cyl(M.blue, 0.44, 0.44, lox.y + 0.4 - 0.5, x, 0.5 + (lox.y + 0.4 - 0.5) / 2, z, 'y', 0.1, 20)
  }
  for (let i = 0; i < 8; i++) {
    const a = legs[i]
    const b = legs[(i + 1) % 8]
    K.tube(M.blue, 0.11, legAt(a, 1.2), legAt(b, 6.6), 8)
    K.tube(M.blue, 0.11, legAt(b, 1.2), legAt(a, 6.6), 8)
    K.tube(M.blue, 0.13, legAt(a, 1.0), legAt(b, 1.0), 8)
  }
  K.at(
    M.tank,
    cached('lox-sphere', () => new THREE.SphereGeometry(lox.R, 64, 40)),
    lox.x,
    lox.y,
    lox.z
  )
  // top platform, rail, vent stack
  const top = lox.y + lox.R
  K.cyl(M.steel, 1.9, 1.9, 0.22, lox.x, top - 0.05, lox.z, 'y', 0.06, 32)
  K.at(
    M.blue,
    cached('lox-rail', () => new THREE.TorusGeometry(1.8, 0.06, 6, 40).rotateX(PI / 2)),
    lox.x,
    top + 0.95,
    lox.z
  )
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * TAU
    K.tube(
      M.blue,
      0.05,
      [lox.x + Math.cos(a) * 1.8, top, lox.z + Math.sin(a) * 1.8],
      [lox.x + Math.cos(a) * 1.8, top + 0.95, lox.z + Math.sin(a) * 1.8],
      6
    )
  }
  K.cyl(M.steel, 0.28, 0.28, 1.7, lox.x + 0.6, top + 0.85, lox.z - 0.4, 'y', 0.06, 16)
  K.cyl(M.steel, 0.42, 0.42, 0.3, lox.x + 0.6, top + 1.7, lox.z - 0.4, 'y', 0.08, 16)
  // a ladder up the +x +z side, from the ground to the equator, then a stair band over the shoulder is left out
  // ---- the LOX line: out of the sphere's bottom, along +z, then into the rack along +x
  const lp = RACK.pipes[0]
  const ly = RACK.beamTop + lp.r
  const lz = FARM.rackZ + lp.oz
  K.cyl(M.white, lp.r, lp.r, lz - lox.z, lox.x, ly, (lz + lox.z) / 2, 'z', 0.08, 20)
  K.at(
    M.white,
    cached('elbow-lox', () => new THREE.SphereGeometry(lp.r, 20, 12)),
    lox.x,
    ly,
    lz
  )
  // relief valve stack on the LOX line
  K.cyl(M.steel, 0.13, 0.13, 1.7, -4, ly + 0.36 + 0.85, lz, 'y', 0.04, 12)
  K.cyl(M.steel, 0.26, 0.26, 0.3, -4, ly + 0.36 + 1.7, lz, 'y', 0.06, 12)
  // ---- the rack: along x at z = 3.5 from x -14 (the LOX line) / -6.5 to the corner at x = 26, then +z off the slab
  const X0 = FARM.rackX0
  const X1 = FARM.rackX1
  rackInto(K, {
    len: X1 - X0,
    frame: mat4(X0, 0, FARM.rackZ),
    start: RACK.pipes.map((p, i) => (i === 0 ? lox.x - X0 : 0)),
    end: RACK.pipes.map((p) => X1 - p.oz - X0),
    from: -4.5,
    caps: false,
  })
  const zLen = D / 2 - FARM.rackZ
  rackInto(K, {
    len: zLen,
    frame: mat4(X1, 0, FARM.rackZ, 0, -PI / 2, 0),
    start: RACK.pipes.map((p) => p.oz),
    from: 1.5,
    caps: false,
  })
  for (const p of RACK.pipes)
    K.at(
      M[p.mat],
      cached(`elbow|${p.r}`, () => new THREE.SphereGeometry(p.r, 20, 12)),
      X1 - p.oz,
      RACK.beamTop + p.r,
      FARM.rackZ + p.oz
    )
  // a cap on the two pipes that start at the rack's head
  for (const p of RACK.pipes.slice(1))
    K.cyl(
      M.steel,
      p.r + 0.05,
      p.r + 0.05,
      0.12,
      X0,
      RACK.beamTop + p.r,
      FARM.rackZ + p.oz,
      'x',
      0.03,
      20
    )
  // ---- the RP-1 tanks in their bund
  K.ext(M.concreteDeep, 0.6, 19.4, 0, 0.1, -11.8, 0.8, 0.04)
  for (const [a, b, c, d] of [
    [0.6, 19.4, -11.8, -11.4],
    [0.6, 19.4, 0.4, 0.8],
    [0.6, 1.0, -11.8, 0.8],
    [19.0, 19.4, -11.8, 0.8],
  ])
    K.ext(M.concrete, a, b, 0, 0.9, c, d, 0.12)
  for (const z of rp1.zs) {
    K.at(M.tank, capsuleGeo(rp1.r, rp1.len, 1.2), rp1.x, rp1.y, z)
    for (const sx of [-1, 1]) {
      K.cyl(M.blue, rp1.r + 0.04, rp1.r + 0.04, 0.6, rp1.x + sx * 5.4, rp1.y, z, 'x', 0.06, 48)
      K.box(M.concrete, 1.0, 1.5, 3.4, rp1.x + sx * 4.4, 0.75, z, 0.12)
    }
    // a manway and vent on top
    K.cyl(M.steel, 0.5, 0.5, 0.5, rp1.x - 3, rp1.y + rp1.r + 0.1, z, 'y', 0.08, 20)
    K.cyl(M.steel, 0.12, 0.12, 1.2, rp1.x + 3, rp1.y + rp1.r + 0.5, z, 'y', 0.03, 12)
  }
  // RP-1 line from the front tank to the rack
  const rp = RACK.pipes[1]
  K.cyl(
    M.steel,
    rp.r,
    rp.r,
    FARM.rackZ + 1.0,
    rp1.x + 6,
    RACK.beamTop + rp.r,
    (FARM.rackZ - 1.0) / 2,
    'z',
    0.06,
    20
  )
  // ---- the bottle row: helium and nitrogen, on a plinth with a steel frame
  const bx = Array.from({ length: 8 }, (_, i) => 3.4 + i * 2.2)
  K.ext(M.concrete, 2.0, 20.2, 0, 0.4, 8.4, 10.6, 0.1)
  const bottle = lathe(
    'bottle',
    [
      [1e-4, 0],
      [0.7, 0.02],
      [0.8, 0.15],
      [0.8, 6.5],
      [0.74, 6.9],
      [0.55, 7.25],
      [0.3, 7.45],
      [1e-4, 7.5],
    ],
    32
  )
  for (const x of bx) {
    K.at(M.blueLight, bottle, x, 0.4, 9.5)
    K.cyl(M.white, 0.56, 0.4, 0.5, x, 7.6, 9.5, 'y', 0.1, 20)
    K.cyl(M.steel, 0.1, 0.1, 0.5, x, 8.1, 9.5, 'y', 0.03, 10)
  }
  for (const z of [8.55, 10.45]) K.box(M.steel, 18.0, 0.16, 0.16, 11.1, 5.8, z, 0.06)
  for (const x of [2.3, 19.9])
    for (const z of [8.55, 10.45]) K.box(M.steel, 0.18, 5.4, 0.18, x, 0.4 + 2.7, z, 0.06)
  // gas header from the bottles to the rack
  const gp = RACK.pipes[2]
  K.cyl(M.blueLight, gp.r, gp.r, 17.6, 11.1, 0.95, 7.9, 'x', 0.05, 16)
  K.cyl(
    M.blueLight,
    gp.r,
    gp.r,
    7.9 - (FARM.rackZ + gp.oz),
    19.9,
    0.95,
    (7.9 + FARM.rackZ + gp.oz) / 2,
    'z',
    0.05,
    16
  )
  K.cyl(
    M.blueLight,
    gp.r,
    gp.r,
    RACK.beamTop + gp.r - 0.95,
    19.9,
    (RACK.beamTop + gp.r + 0.95) / 2,
    FARM.rackZ + gp.oz,
    'y',
    0.05,
    16
  )
  // ---- the pump house
  K.box(M.white, 7.0, 5.2, 5.0, -2, 2.6, 10.7, 0.3)
  K.box(M.roof, 7.6, 0.5, 5.6, -2, 5.35, 10.7, 0.18)
  K.box(M.blue, 1.8, 2.8, 0.2, -3.6, 1.4, 13.22, 0.08)
  for (let i = 0; i < 4; i++) K.box(M.navy, 0.2, 0.12, 2.6, 1.52, 2.4 + i * 0.42, 10.7, 0.03)
  K.box(M.window, 1.8, 1.0, 0.2, 0.2, 3.2, 13.22, 0.08)
  K.cyl(M.steel, 0.3, 0.3, 2.2, 0.6, 5.6 + 1.1, 9.7, 'y', 0.06, 16)
  K.cyl(M.steel, 0.44, 0.44, 0.3, 0.6, 7.8, 9.7, 'y', 0.08, 16)
  // ---- the gauges, turned to the film camera
  gaugeInto(K, lox.x, 9.0)
  gaugeInto(K, 22.8, -5.0)
  return K.freeze()
})
export function buildToyTankFarm() {
  const M = mats()
  const { lox, rp1 } = FARM
  const group = thaw(farmKit())
  group.name = 'tank-farm'
  // the LOX band and the RP-1 label
  const band = bandMesh(bandTex('LOX', { reps: 8, px: 120 }), lox.R + 0.06, 1.8)
  band.position.set(lox.x, lox.y, lox.z)
  band.rotation.y = PI / 8 // the names sit between the legs
  group.add(band)
  const rpTex = canvasTex('rp1-label', 1024, 256, (g, w, h) => {
    g.fillStyle = TOY.blue
    g.font = FONT(800, 170, true)
    g.textAlign = 'center'
    g.textBaseline = 'middle'
    g.fillText('RP-1', w / 2 + 70, h / 2 + 8)
    drawPadMark(g, w / 2 - 250, h / 2, 90, TOY.blue)
  })
  const lab = new THREE.Mesh(
    cached('rp1-strip', () =>
      barrelStrip(
        rp1.r + 0.02,
        rp1.y,
        rp1.zs[1],
        rp1.x - 4,
        rp1.x + 4,
        PI / 2 - 0.42,
        PI / 2 + 0.42,
        16,
        10
      )
    ),
    decalMat(rpTex)
  )
  group.add(lab)
  // the gauges: labels and the two fill bars
  const bars = []
  for (const [x, z, name, mat] of [
    [lox.x, 9.0, 'LOX', M.blue],
    [22.8, -5.0, 'RP-1', M.blueDeep],
  ]) {
    const fr = new THREE.Group()
    fr.position.set(x, 0, z)
    fr.rotation.y = FILM_AZ
    group.add(fr)
    const p = plate(name, { px: 96, h: 150, padX: 0.24 })
    const d = decal(p.tex, p.aspect, 0.6)
    d.position.set(0, GAUGE.y0 + GAUGE.h - 0.55, 0.17)
    fr.add(d)
    const bar = meshOf(
      cached('gauge-bar', () => new THREE.BoxGeometry(GAUGE.barW, 1, 0.08).translate(0, 0.5, 0)),
      mat,
      fr
    )
    bar.position.set(0, GAUGE.barY0, 0.2)
    bar.castShadow = false
    bars.push(bar)
  }
  const setFill = (loxK, rp1K) => {
    ;[loxK, rp1K].forEach((k, i) => {
      const v = sat(k)
      bars[i].scale.y = Math.max(1e-3, v * GAUGE.barH)
      bars[i].visible = v > 0.002
    })
  }
  setFill(1, 1)
  const vents = [
    V(lox.x + 0.6, lox.y + lox.R + 1.9, lox.z - 0.4),
    V(-4, RACK.beamTop + RACK.pipes[0].r + 0.36 + 1.9, FARM.rackZ + RACK.pipes[0].oz),
    V(0.6, 8.0, 9.7),
  ]
  return { group, setFill, vents }
}

// ================================================================================================ 6. the water tower
const WT = { legs: 6, rb: 7.0, rt: 5.4, legTop: 22.4, R: 7, y0: 22.6, y1: 31.2 }
const waterKit = once(() => {
  const M = mats()
  const K = new Kit()
  const { legs, rb, rt, legTop, R, y0, y1 } = WT
  const angs = Array.from({ length: legs }, (_, i) => PI / 6 + (i * TAU) / legs)
  const at = (a, y) => {
    const r = lerp(rb, rt, (y - 0.6) / (legTop - 0.6))
    return [Math.cos(a) * r, y, Math.sin(a) * r]
  }
  for (const a of angs) {
    const [x, , z] = at(a, 0.6)
    K.box(M.concrete, 1.5, 0.6, 1.5, x, 0.3, z, 0.14)
    K.tube(M.white, 0.5, at(a, 0.6), at(a, legTop + 0.4), 16)
    K.cyl(M.white, 0.62, 0.62, 0.5, x, 0.85, z, 'y', 0.12, 16)
  }
  const rings = [0.9, 8.0, 15.3, legTop - 0.4]
  for (let i = 0; i < legs; i++) {
    const a = angs[i]
    const b = angs[(i + 1) % legs]
    for (const y of rings.slice(1)) K.tube(M.blue, 0.17, at(a, y), at(b, y), 8)
    for (let j = 0; j < rings.length - 1; j++) {
      K.tube(M.blue, 0.1, at(a, rings[j] + 0.2), at(b, rings[j + 1] - 0.2), 6)
      K.tube(M.blue, 0.1, at(b, rings[j] + 0.2), at(a, rings[j + 1] - 0.2), 6)
    }
  }
  // the riser, the bowl under the tank, the tank, the roof, the balcony
  K.cyl(M.white, 1.1, 1.1, y0 - 1.0, 0, (y0 - 1.0) / 2, 0, 'y', 0.12, 32)
  K.box(M.concrete, 3.0, 0.5, 3.0, 0, 0.25, 0, 0.14)
  const bowl = []
  for (let i = 0; i <= 12; i++) {
    const t = (i / 12) * (PI / 2)
    bowl.push([R * Math.sin(t) + 1e-4, y0 - 2.4 * Math.cos(t)])
  }
  K.put(M.tank, lathe('wt-bowl', bowl, 64))
  K.cyl(M.tank, R, R, y1 - y0, 0, (y0 + y1) / 2, 0, 'y', 0.2, 64)
  const roof = [
    [R + 0.12, y1 - 0.1],
    [R + 0.12, y1 + 0.15],
  ]
  for (let i = 0; i <= 12; i++) {
    const t = (i / 12) * (PI / 2)
    roof.push([(R + 0.1) * Math.cos(t) + 1e-4, y1 + 0.15 + 3.2 * Math.sin(t)])
  }
  K.put(M.roof, lathe('wt-roof', roof, 64))
  K.put(
    M.steel,
    lathe(
      'wt-deck',
      [
        [R - 0.2, y0 - 0.3],
        [R + 1.2, y0 - 0.3],
        [R + 1.2, y0],
        [R - 0.2, y0],
      ],
      64
    )
  )
  K.at(
    M.blue,
    cached('wt-rail', () => new THREE.TorusGeometry(R + 1.1, 0.07, 6, 72).rotateX(PI / 2)),
    0,
    y0 + 1.1,
    0
  )
  for (let i = 0; i < 24; i++) {
    const a = (i / 24) * TAU
    K.tube(
      M.blue,
      0.05,
      [Math.cos(a) * (R + 1.1), y0, Math.sin(a) * (R + 1.1)],
      [Math.cos(a) * (R + 1.1), y0 + 1.1, Math.sin(a) * (R + 1.1)],
      6
    )
  }
  // a ladder up the riser
  for (const s of [-1, 1]) K.tube(M.steel, 0.05, [1.25, 1, s * 0.3], [1.25, y0 - 2.6, s * 0.3], 6)
  for (let y = 1.4; y < y0 - 2.6; y += 0.6)
    K.tube(M.steel, 0.035, [1.25, y, -0.3], [1.25, y, 0.3], 6)
  // the finial and its beacon
  K.cyl(M.steel, 0.3, 0.14, 1.6, 0, y1 + 3.35 + 0.8, 0, 'y', 0.05, 16)
  K.at(
    M.red,
    cached('beacon-ball', () => new THREE.SphereGeometry(0.32, 16, 10)),
    0,
    y1 + 5.2,
    0
  )
  return K.freeze()
})
export function buildToyWaterTower() {
  const g = thaw(waterKit())
  g.name = 'water-tower'
  const band = bandMesh(bandTex('PADLINE', { reps: 3, px: 120 }), WT.R + 0.04, 2.4)
  band.position.y = 27.6
  band.rotation.y = FILM_AZ - PI / 3
  g.add(band)
  return g
}

// ================================================================================================ 7. the lightning tower
export function buildToyLightningTower({ h = 52 } = {}) {
  const M = mats()
  const frozen = cached(`lightning|${h}`, () => {
    const K = new Kit()
    const r0 = 0.8
    const r1 = 0.34
    const yTop = h - 5.4
    const rAt = (y) => lerp(r0, r1, (y - 0.6) / (yTop - 0.6))
    K.box(M.concrete, 2.6, 0.6, 2.6, 0, 0.3, 0, 0.2)
    K.cyl(M.white, r0, r1, yTop - 0.6, 0, (yTop + 0.6) / 2, 0, 'y', 0.08, 20)
    for (let y = 5; y < yTop - 3; y += 8)
      K.cyl(M.blue, rAt(y) + 0.05, rAt(y + 1.2) + 0.05, 1.2, 0, y + 0.6, 0, 'y', 0.04, 20)
    K.cyl(M.blue, 0.5, 0.42, 0.7, 0, yTop + 0.25, 0, 'y', 0.1, 20)
    K.put(
      M.steel,
      cached(`spike|${h}`, () =>
        new THREE.ConeGeometry(0.16, h - yTop - 0.55, 12).translate(0, (h + yTop + 0.55) / 2, 0)
      )
    )
    K.at(
      M.red,
      cached('beacon-lt', () => new THREE.SphereGeometry(0.26, 14, 10)),
      0,
      yTop + 0.8,
      0
    )
    return K.freeze()
  })
  const g = thaw(frozen)
  g.name = 'lightning-tower'
  return g
}

// ================================================================================================ 8. the landing zone
function lzTex(r, label) {
  return canvasTex(`lz|${r}|${label}`, 2048, 2048, (g, W) => {
    const s = W / (2 * r)
    const c = W / 2
    g.fillStyle = '#ffffff'
    g.strokeStyle = '#ffffff'
    // the big ring
    g.lineWidth = 1.7 * s
    g.beginPath()
    g.arc(c, c, 0.68 * r * s, 0, TAU)
    g.stroke()
    // a thin inner ring
    g.lineWidth = 0.4 * s
    g.beginPath()
    g.arc(c, c, 0.36 * r * s, 0, TAU)
    g.stroke()
    // the cross: four bars with a gap at the centre
    const a = 0.1 * r * s
    const b = 0.56 * r * s
    const hw = 0.75 * s
    for (const [dx, dy] of [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ]) {
      if (dx) g.fillRect(dx > 0 ? c + a : c - b, c - hw, b - a, 2 * hw)
      else g.fillRect(c - hw, dy > 0 ? c + a : c - b, 2 * hw, b - a)
    }
    // hash marks on the diagonals, across the big ring
    g.lineWidth = 0.9 * s
    for (let i = 0; i < 4; i++) {
      const t = PI / 4 + (i * PI) / 2
      const r0 = 0.6 * r * s
      const r1 = 0.76 * r * s
      g.beginPath()
      g.moveTo(c + Math.cos(t) * r0, c + Math.sin(t) * r0)
      g.lineTo(c + Math.cos(t) * r1, c + Math.sin(t) * r1)
      g.stroke()
    }
    // the centre dot
    g.beginPath()
    g.arc(c, c, 0.55 * s, 0, TAU)
    g.fill()
    // the name, toward the film camera (+x +z), turned to read at its azimuth (canvas x = world x, canvas y = world z)
    g.save()
    const rr0 = 0.855 * r
    g.translate(c + Math.sin(FILM_AZ) * rr0 * s, c + Math.cos(FILM_AZ) * rr0 * s)
    g.rotate(-FILM_AZ)
    g.font = FONT(900, 0.22 * r * s)
    g.textAlign = 'center'
    g.textBaseline = 'middle'
    g.fillText(label, 0, 0.012 * r * s)
    g.restore()
  })
}
export function buildToyLandingZone({ r = 18 } = {}) {
  const M = mats()
  const frozen = cached(`lz|${r}`, () => {
    const K = new Kit()
    K.cyl(M.apron, r + 5, r + 5, 0.12, 0, 0.02, 0, 'y', 0.04, 96)
    K.cyl(M.lz, r, r, 0.16, 0, 0.06, 0, 'y', 0.05, 96)
    // the road stub heading +z, with a white centre line
    K.ext(M.apron, -4, 4, -0.04, 0.07, r + 3, r + 30, 0.03)
    for (let z = r + 6; z < r + 29; z += 4) K.flat(M.white, 0.22, 0.02, 2.0, 0, 0.08, z + 1)
    for (const s of [-1, 1]) K.flat(M.white, 0.16, 0.02, 25.5, s * 3.5, 0.08, r + 16.75)
    // edge lights
    const n = 24
    for (let i = 0; i < n; i++) {
      const a = (i / n) * TAU
      K.cyl(
        M.blueLight,
        0.3,
        0.24,
        0.1,
        Math.cos(a) * (r + 1.6),
        0.13,
        Math.sin(a) * (r + 1.6),
        'y',
        0.04,
        14
      )
    }
    return K.freeze()
  })
  const g = thaw(frozen)
  g.name = 'landing-zone'
  const paintM = new THREE.Mesh(
    cached(`lz-disc|${r}`, () => new THREE.CircleGeometry(r - 0.06, 96).rotateX(-PI / 2)),
    decalMat(lzTex(r, 'LZ-2'))
  )
  paintM.position.y = 0.141
  paintM.receiveShadow = true
  g.add(paintM)
  return g
}

// ================================================================================================ 9. the booster trailer
const TR = {
  slotX: -17.6,
  axisY: 3.4,
  rb: 2.3,
  gz0: 2.55,
  gz1: 2.95,
  gy0: 1.35,
  gy1: 2.45,
  saddles: [
    [-12.8, -11.6],
    [3.4, 4.6],
  ],
  cup: 1.25,
}
const trailerKit = once(() => {
  const M = mats()
  const K = new Kit()
  const { gz0, gz1, gy0, gy1, axisY, rb, cup } = TR
  // ---- the tractor
  cab(K, {
    x0: 14.75,
    x1: 17.7,
    top: 4.1,
    W: 3.5,
    color: TOY.blue,
    arches: [[16.05, 0.75, 0.9]],
    seam: TOY.blueDeep,
  })
  K.ext(M.chassis, 10.3, 17.4, 0.95, 1.55, -1.05, 1.05, 0.08)
  for (const s of [-1, 1]) {
    K.ext(M.vBlue, 13.45, 14.6, 0.62, 1.42, s > 0 ? 1.05 : -1.72, s > 0 ? 1.72 : -1.05, 0.16)
    K.ext(M.ink, 10.3, 13.5, 1.6, 1.7, s > 0 ? 1.05 : -1.9, s > 0 ? 1.9 : -1.05, 0.04)
  }
  K.ext(M.ink, 11.15, 12.65, 1.5, 1.74, -1.1, 1.1, 0.08)
  K.cyl(M.vSteel, 0.13, 0.13, 3.2, 14.5, 3.15, -1.42, 'y', 0.04, 12)
  K.cyl(M.ink, 0.15, 0.15, 0.25, 14.5, 4.8, -1.42, 'y', 0.04, 12)
  beacon(K, 16.3, 4.1, -1.15)
  beacon(K, 16.3, 4.1, 1.15)
  // ---- the gooseneck on the fifth wheel, the headstock joining it to the girders
  K.ext(M.vBlue, 9.6, 13.4, 1.74, 2.55, -1.45, 1.45, 0.2)
  K.ext(M.vBlue, 9.6, 10.1, gy0, 2.55, -gz1, gz1, 0.14)
  // ---- the side girders, the rear bogie's suspension, the low cross members and their hangers
  for (const s of [-1, 1]) {
    K.ext(M.vBlue, -17.9, 10.1, gy0, gy1, s > 0 ? gz0 : -gz1, s > 0 ? gz1 : -gz0, 0.16)
    K.ext(
      M.vBlueDeep,
      -17.6,
      9.5,
      gy1 - 0.02,
      gy1 + 0.06,
      s > 0 ? gz0 + 0.06 : -gz1 + 0.06,
      s > 0 ? gz1 - 0.06 : -gz0 - 0.06,
      0.02
    )
    for (const x of [-13.9, -15.3, -16.7])
      K.ext(
        M.ink,
        x - 0.5,
        x + 0.5,
        gy0 - 0.12,
        gy0 + 0.02,
        s > 0 ? gz0 : -gz1,
        s > 0 ? gz1 : -gz0,
        0.04
      )
    K.ext(M.tail, -17.98, -17.88, 1.7, 2.05, s > 0 ? 2.6 : -2.9, s > 0 ? 2.9 : -2.6, 0.03)
    // side marker lamps along the girders
    for (let x = -14; x < 9; x += 6)
      K.ext(
        M.beacon,
        x - 0.12,
        x + 0.12,
        1.84,
        1.96,
        s > 0 ? gz1 - 0.01 : -gz1 - 0.03,
        s > 0 ? gz1 + 0.03 : -gz1 + 0.01,
        0.02
      )
  }
  for (const x of [-13.9, -15.3, -16.7]) K.cyl(M.ink, 0.11, 0.11, 5.4, x, 0.6, 0, 'z', 0.03, 12)
  for (const x of [-6.5, -1.0]) {
    K.ext(M.chassis, x - 0.25, x + 0.25, 0.62, 0.9, -gz1 + 0.05, gz1 - 0.05, 0.06)
    for (const s of [-1, 1])
      K.ext(
        M.chassis,
        x - 0.22,
        x + 0.22,
        0.62,
        gy0 + 0.05,
        s > 0 ? gz0 + 0.02 : -gz1 + 0.08,
        s > 0 ? gz1 - 0.08 : -gz0 - 0.02,
        0.05
      )
  }
  // the rear: an under-ride bar below the engines and a light bar
  K.ext(M.chassis, -18.0, -17.78, 0.45, 0.75, -gz1, gz1, 0.06)
  for (const s of [-1, 1])
    K.ext(
      M.chassis,
      -17.95,
      -17.7,
      0.6,
      gy0 + 0.05,
      s > 0 ? gz0 + 0.02 : -gz1 + 0.08,
      s > 0 ? gz1 - 0.08 : -gz0 - 0.02,
      0.05
    )
  // ---- the saddles: a cross member under the booster and a cradle cupping its bottom +/-32 deg, lined in rubber
  const cradle = () => {
    const s = new THREE.Shape()
    s.moveTo(-cup - 0.15, 0.95)
    s.lineTo(cup + 0.15, 0.95)
    const yAt = (z) => axisY - Math.sqrt(rb * rb - z * z)
    s.lineTo(cup + 0.15, yAt(cup) + 0.05)
    for (let i = 0; i <= 20; i++) {
      const z = lerp(cup, -cup, i / 20)
      s.lineTo(z, yAt(z) - 0.08)
    }
    s.lineTo(-cup - 0.15, yAt(cup) + 0.05)
    s.closePath()
    return s
  }
  const liner = () => {
    const s = new THREE.Shape()
    const pts = []
    for (let i = 0; i <= 20; i++) {
      const z = lerp(-cup, cup, i / 20)
      pts.push([z, axisY - Math.sqrt(rb * rb - z * z)])
    }
    s.moveTo(pts[0][0], pts[0][1] - 0.09)
    for (const [z, y] of pts) s.lineTo(z, y - 0.09)
    for (let i = pts.length - 1; i >= 0; i--) s.lineTo(pts[i][0], pts[i][1] - 0.005)
    s.closePath()
    return s
  }
  for (const [a, b] of TR.saddles) {
    const len = b - a
    const fr = mat4((a + b) / 2, 0, 0, 0, PI / 2, 0) // the shape's x runs along -z, the extrusion along x
    K.put(M.vBlueDeep, extrude(`cradle|${len}`, cradle, len, 0.06), fr)
    K.put(M.ink, extrude(`liner|${len}`, liner, len + 0.1, 0.005), fr)
    K.ext(M.chassis, a - 0.05, b + 0.05, 0.6, 0.98, -gz1 + 0.05, gz1 - 0.05, 0.08)
    for (const s of [-1, 1])
      K.ext(
        M.chassis,
        a + 0.1,
        b - 0.1,
        0.6,
        gy0 + 0.05,
        s > 0 ? gz0 + 0.02 : -gz1 + 0.08,
        s > 0 ? gz1 - 0.08 : -gz0 - 0.02,
        0.06
      )
  }
  return K.freeze()
})
export function buildToyBoosterTrailer() {
  const group = new THREE.Group()
  group.name = 'booster-trailer'
  thaw(trailerKit(), group)
  // the name on both girders
  const p = plate('PADLINE', { bg: null, fg: '#ffffff', px: 110, h: 150, padX: 0.1, mark: true })
  for (const s of [-1, 1]) {
    const d = decal(p.tex, p.aspect, 0.62)
    d.position.set(-4.2 * s, (TR.gy0 + TR.gy1) / 2 + 0.02, s * (TR.gz1 + 0.012))
    d.rotation.y = s > 0 ? 0 : PI
    group.add(d)
  }
  const rollA = wheelSet(group, 0.75, 0.64, [...pairs([16.05], 1.4), ...pairs([12.6, 11.2], 1.5)])
  const rollB = wheelSet(group, 0.6, 0.5, pairs([-13.9, -15.3, -16.7], 2.7))
  const slot = new THREE.Object3D()
  slot.name = 'booster-slot'
  slot.position.set(TR.slotX, TR.axisY, 0)
  group.add(slot)
  const roll = (d) => {
    rollA(d)
    rollB(d)
  }
  return { group, roll, slot, axisY: TR.axisY }
}

// ================================================================================================ 10. the mobile crane
const CR = {
  slewX: -3.15,
  pivot: [-1.4, 4.3],
  boomY: 0.2,
  axles: [4.1, 2.45, -2.35, -4.0],
  R: 0.7,
  outX: [5.2, -6.1],
  ramA: [0.8, 2.9],
  ramB: [6.0, -0.55],
}
const craneCarrierKit = once(() => {
  const M = mats()
  const K = new Kit()
  const W = 3.0
  // chassis and the yellow deck body with four arches
  K.ext(M.chassis, -6.9, 6.2, 0.75, 1.45, -0.95, 0.95, 0.1)
  K.put(
    M.vYellow,
    extrude(
      'crane-deck',
      () => profile(-7.0, 5.62, 1.45, 2.1, { rc: [0.32, 0.22, 0.22, 0.32] }, 0.12),
      W,
      0.12
    )
  )
  // lockers between the axle pairs and behind the rear pair, the walkway plate, the slew pedestal
  for (const s of [-1, 1]) {
    K.ext(M.vYellowDeep, -1.45, 1.55, 0.78, 1.5, s > 0 ? 0.95 : -1.48, s > 0 ? 1.48 : -0.95, 0.1)
    K.ext(M.ink, -1.3, 1.4, 1.05, 1.12, s > 0 ? 1.46 : -1.5, s > 0 ? 1.5 : -1.46, 0.015)
  }
  K.ext(M.vYellowDeep, -7.0, -4.95, 0.7, 1.5, -1.48, 1.48, 0.14)
  K.ext(M.vYellowDeep, -6.7, 5.2, 2.08, 2.14, -1.35, 1.35, 0.02)
  K.cyl(M.ink, 1.45, 1.45, 0.16, CR.slewX, 2.12, 0, 'y', 0.04, 40)
  // outrigger housings across the deck, front and rear
  for (const x of CR.outX) K.ext(M.vYellowDeep, x - 0.32, x + 0.32, 0.9, 1.55, -1.5, 1.5, 0.08)
  // the boom rest over the front axles
  K.ext(M.ink, 4.25, 4.75, 2.1, 3.95, -0.32, 0.32, 0.08)
  K.ext(M.ink, 4.15, 4.85, 3.85, 3.97, -0.62, 0.62, 0.04)
  // the low cab
  cab(K, { x0: 5.6, x1: 7.0, y0: 0.62, top: 2.8, W: W, color: TOY.yellow, seam: PAD.yellowDeep })
  beacon(K, 6.0, 2.8, -1.0, 0.14)
  beacon(K, 6.0, 2.8, 1.0, 0.14)
  for (const s of [-1, 1])
    K.ext(M.tail, -7.06, -6.98, 1.25, 1.55, s * 1.1 - 0.18, s * 1.1 + 0.18, 0.03)
  return K.freeze()
})
const craneUpperKit = once(() => {
  const M = mats()
  const K = new Kit()
  const [px, py] = CR.pivot
  K.cyl(M.vYellowDeep, 1.3, 1.3, 0.3, 0, 2.35, 0, 'y', 0.06, 40)
  K.ext(M.vYellow, -1.9, 1.7, 2.5, 3.6, -1.25, 1.25, 0.22)
  // side plates carrying the boom foot
  for (const s of [-1, 1])
    K.ext(
      M.vYellow,
      px - 0.75,
      px + 1.6,
      3.2,
      py + 0.55,
      s > 0 ? 0.6 : -0.86,
      s > 0 ? 0.86 : -0.6,
      0.12
    )
  // the counterweight: blue, the brand's block
  K.ext(M.vBlue, -3.45, -1.75, 2.45, 3.95, -1.4, 1.4, 0.3)
  K.ext(M.vBlueDeep, -3.5, -1.7, 2.8, 2.9, -1.45, 1.45, 0.03)
  // engine cover and grille
  K.ext(M.vYellow, -1.9, -0.6, 3.55, 4.05, -0.5, 0.5, 0.15)
  // the operator's cab on the +z side, dark glass on three sides
  K.ext(M.vYellow, -0.6, 1.95, 2.5, 4.5, 0.95, 1.9, 0.24)
  K.ext(M.vGlass, 1.9, 1.99, 3.05, 4.25, 1.05, 1.8, 0.04)
  K.ext(M.vGlass, -0.3, 1.65, 3.15, 4.25, 1.88, 1.93, 0.03)
  K.ext(M.ink, -0.65, 2.0, 4.45, 4.58, 0.9, 1.95, 0.04)
  beacon(K, -2.6, 3.95, -0.9, 0.13)
  return K.freeze()
})
const boomGeos = once(() => {
  const yo = CR.boomY
  const base = new Kit()
  base.ext(null, -0.9, 10.6, yo - 0.525, yo + 0.525, -0.475, 0.475, 0.16)
  base.cyl(null, 0.45, 0.45, 1.32, 0, 0, 0, 'z', 0.08, 20)
  base.ext(null, CR.ramB[0] - 0.3, CR.ramB[0] + 0.3, CR.ramB[1] - 0.1, yo - 0.4, -0.32, 0.32, 0.08)
  const s2 = new Kit()
  s2.ext(null, 0, 11.0, yo - 0.425, yo + 0.425, -0.39, 0.39, 0.12)
  const s3 = new Kit()
  s3.ext(null, 0, 11.0, yo - 0.34, yo + 0.34, -0.31, 0.31, 0.1)
  s3.ext(null, 10.9, 11.6, yo - 0.5, yo + 0.4, -0.36, 0.36, 0.12)
  const head = new Kit()
  head.cyl(null, 0.42, 0.42, 0.5, 11.45, yo - 0.12, 0, 'z', 0.06, 20)
  const stripe = new Kit()
  for (const s of [-1, 1])
    stripe.ext(
      null,
      7.5,
      10.4,
      yo - 0.12,
      yo + 0.12,
      s > 0 ? 0.46 : -0.49,
      s > 0 ? 0.49 : -0.46,
      0.02
    )
  return {
    base: base.freeze()[0].geo,
    s2: s2.freeze()[0].geo,
    s3: s3.freeze()[0].geo,
    head: head.freeze()[0].geo,
    stripe: stripe.freeze()[0].geo,
  }
})
const outriggerGeos = once(() => {
  const beam = new Kit()
  beam.ext(null, -0.2, 0.2, -0.2, 0.2, -2.6, 0, 0.06)
  beam.cyl(null, 0.24, 0.24, 0.9, 0, 0.1, -0.1, 'y', 0.06, 16)
  const jack = new Kit()
  jack.cyl(null, 0.13, 0.13, 1.0, 0, -0.5, 0, 'y', 0.03, 12)
  jack.cyl(null, 0.42, 0.42, 0.12, 0, -0.94, 0, 'y', 0.04, 20)
  return { beam: beam.freeze()[0].geo, jack: jack.freeze()[0].geo }
})
export function buildToyMobileCrane() {
  const M = mats()
  const group = new THREE.Group()
  group.name = 'mobile-crane'
  thaw(craneCarrierKit(), group)
  const roll = wheelSet(group, CR.R, 0.64, pairs(CR.axles, 1.15))
  // outriggers: beams slide out along z, jacks drop to the ground
  const G = outriggerGeos()
  const outs = []
  for (const x of CR.outX)
    for (const s of [-1, 1]) {
      const beam = meshOf(G.beam, M.vYellow, group)
      const jack = meshOf(G.jack, M.ink, group)
      beam.rotation.y = s > 0 ? 0 : PI
      outs.push({ beam, jack, x, s })
    }
  // the upper
  const upper = new THREE.Group()
  upper.position.x = CR.slewX
  group.add(upper)
  thaw(craneUpperKit(), upper)
  const B = boomGeos()
  const boom = new THREE.Group()
  boom.position.set(CR.pivot[0], CR.pivot[1], 0)
  upper.add(boom)
  meshOf(B.base, M.vYellow, boom)
  meshOf(B.stripe, M.vBlue, boom)
  const s2 = meshOf(B.s2, M.vYellow, boom)
  const s3 = new THREE.Group()
  boom.add(s3)
  meshOf(B.s3, M.vYellow, s3)
  meshOf(B.head, M.ink, s3)
  // the luffing ram: a barrel on the turret, a rod from the boom's lug
  const barrelL = 3.2
  const barrel = meshOf(
    cached('crane-barrel', () =>
      new THREE.CylinderGeometry(0.21, 0.21, barrelL, 16)
        .rotateZ(-PI / 2)
        .translate(barrelL / 2, 0, 0)
    ),
    M.ink,
    upper
  )
  const rod = meshOf(
    cached('crane-rod', () =>
      new THREE.CylinderGeometry(0.12, 0.12, 1, 14).rotateZ(-PI / 2).translate(0.5, 0, 0)
    ),
    M.vSteel,
    upper
  )
  // rope and hook block
  const rope = meshOf(
    cached('crane-rope', () =>
      new THREE.CylinderGeometry(0.045, 0.045, 1, 6).translate(0, -0.5, 0)
    ),
    M.ink,
    upper
  )
  rope.castShadow = false
  const block = new THREE.Group()
  upper.add(block)
  meshOf(
    cached('hook-block', () =>
      single(null, (K) => {
        K.ext(null, -0.3, 0.3, -0.8, 0, -0.26, 0.26, 0.12)
        K.ext(null, -0.36, 0.36, -0.55, -0.35, -0.3, 0.3, 0.06)
      })
    ),
    M.vYellow,
    block
  )
  meshOf(
    cached('hook', () =>
      single(null, (K) => {
        K.cyl(null, 0.07, 0.07, 0.3, 0, -0.95, 0, 'y', 0.02, 10)
        K.put(
          null,
          new THREE.TorusGeometry(0.2, 0.065, 8, 20, PI * 1.5)
            .rotateZ(PI * 0.75)
            .translate(0, -1.3, 0)
        )
      })
    ),
    M.ink,
    block
  )
  const hook = new THREE.Object3D()
  hook.name = 'crane-hook'
  hook.position.y = -1.52
  block.add(hook)
  const yo = CR.boomY
  const head = new THREE.Vector2()
  const tmpA = new THREE.Vector2()
  const tmpB = new THREE.Vector2()
  const setBoom = (k) => {
    const u = sat(k)
    const ang = 60 * D2R * sstep(u / 0.7)
    const ext = sstep((u - 0.35) / 0.65)
    const out = sstep(u / 0.12)
    const jackK = sstep((u - 0.06) / 0.12)
    boom.rotation.z = ang
    const a2 = -0.4 + 10 * ext
    const a3 = -0.3 + 20 * ext
    s2.position.x = a2
    s3.position.x = a3
    // ram from the turret to the lug
    const c = Math.cos(ang)
    const sn = Math.sin(ang)
    tmpA.set(CR.ramA[0], CR.ramA[1])
    tmpB.set(
      CR.pivot[0] + CR.ramB[0] * c - CR.ramB[1] * sn,
      CR.pivot[1] + CR.ramB[0] * sn + CR.ramB[1] * c
    )
    const dx = tmpB.x - tmpA.x
    const dy = tmpB.y - tmpA.y
    const L = Math.hypot(dx, dy)
    const dir = Math.atan2(dy, dx)
    barrel.position.set(tmpA.x, tmpA.y, 0)
    barrel.rotation.z = dir
    rod.position.set(tmpB.x, tmpB.y, 0)
    rod.rotation.z = dir + PI
    rod.scale.x = Math.max(0.1, L - barrelL + 0.6)
    // the rope leaves the head sheave's front and hangs straight down
    const hx = a3 + 11.45 + 0.42
    const hy = yo - 0.12
    head.set(CR.pivot[0] + hx * c - hy * sn, CR.pivot[1] + hx * sn + hy * c)
    const ropeL = lerp(0.1, 1.6, u)
    rope.position.set(head.x, head.y, 0)
    rope.scale.y = ropeL
    block.position.set(head.x, head.y - ropeL, 0)
    // outriggers
    for (const o of outs) {
      const zEnd = 1.86 + 2.1 * out
      o.beam.position.set(o.x, 1.22, o.s * zEnd)
      const jy = lerp(0.95, 0.0, jackK)
      o.jack.position.set(o.x, jy + 1.0, o.s * (zEnd - 0.1))
    }
  }
  const setSwing = (a) => {
    upper.rotation.y = a
  }
  setBoom(0)
  setSwing(0)
  return { group, roll, setBoom, setSwing, hook }
}

// ================================================================================================ 11. the control center
const CC = { W: 40, D: 24, H: 7.6 }
/** a parabolic dish with its axis along +y, rim radius R, depth d, on its back a hub; returns geometry */
const dishGeo = (R, d) =>
  cached(`dish|${R}|${d}`, () => {
    const f = (r) => (d * r * r) / (R * R)
    const pts = []
    const t = 0.12
    for (let i = 12; i >= 0; i--) {
      const r = (R * i) / 12
      pts.push([r + 1e-4, f(r) - t])
    }
    pts.reverse()
    const outer = pts.map(([r, y]) => V2(r, y))
    const inner = []
    for (let i = 12; i >= 0; i--) {
      const r = (R * i) / 12
      inner.push(V2(r + 1e-4, f(r)))
    }
    return new THREE.LatheGeometry([...outer, V2(R + 0.05, d - t * 0.5), ...inner], 40)
  })
function dishInto(K, { x, y, z, R, yaw, tilt }) {
  const M = mats()
  const d = R * 0.32
  K.cyl(M.blue, 0.55, 0.55, y - CC.H - 0.1, x, (y + CC.H + 0.1) / 2, z, 'y', 0.1, 20)
  K.box(M.blueDeep, 1.4, 0.6, 1.4, x, y, z, 0.15)
  const fr = mat4(x, y + 0.6, z, 0, yaw, 0).multiply(mat4(0, 0, 0, 0, 0, -tilt))
  K.within(fr, () => {
    K.put(M.white, dishGeo(R, d))
    K.cyl(M.steel, 0.4, 0.4, 0.5, 0, -0.2, 0, 'y', 0.08, 16)
    const fy = R * 0.95
    for (let i = 0; i < 3; i++) {
      const a = (i / 3) * TAU
      K.tube(
        M.steel,
        0.05,
        [Math.cos(a) * R * 0.92, d * 0.85, Math.sin(a) * R * 0.92],
        [0, fy, 0],
        6
      )
    }
    K.cyl(M.steel, 0.16, 0.2, 0.5, 0, fy, 0, 'y', 0.04, 12)
  })
}
const ccKit = once(() => {
  const M = mats()
  const K = new Kit()
  const { W, D, H } = CC
  K.box(M.white, W, H, D, 0, H / 2, 0, 0.45)
  // the parapet ring and the roof membrane inside it
  K.box(M.blue, W + 0.3, 0.9, 0.55, 0, H + 0.25, D / 2 - 0.12, 0.2)
  K.box(M.blue, W + 0.3, 0.9, 0.55, 0, H + 0.25, -D / 2 + 0.12, 0.2)
  K.box(M.blue, 0.55, 0.9, D + 0.3, W / 2 - 0.12, H + 0.25, 0, 0.2)
  K.box(M.blue, 0.55, 0.9, D + 0.3, -W / 2 + 0.12, H + 0.25, 0, 0.2)
  K.box(M.shade, W - 0.8, 0.12, D - 0.8, 0, H + 0.04, 0, 0.04)
  // ribbon windows on all four faces, two floors, with white mullions
  const faces = [
    [W, D / 2, 0],
    [W, -D / 2, PI],
    [D, W / 2, PI / 2],
    [D, -W / 2, -PI / 2],
  ]
  for (const [len, off, ry] of faces) {
    const fr = new THREE.Matrix4().makeRotationY(ry).multiply(mat4(0, 0, Math.abs(off)))
    K.within(fr, () => {
      for (const [y0, y1] of [
        [1.2, 3.0],
        [4.3, 6.3],
      ]) {
        const skip = ry === 0 && y0 < 2
        const segs = skip
          ? [
              [-len / 2 + 1.4, -13.5],
              [-6.5, len / 2 - 1.4],
            ]
          : [[-len / 2 + 1.4, len / 2 - 1.4]]
        for (const [a, b] of segs) {
          K.ext(M.window, a, b, y0, y1, -0.1, 0.08, 0.06)
          for (let x = a + 2.4; x < b - 0.5; x += 2.4)
            K.flat(M.white, 0.14, y1 - y0, 0.06, x, (y0 + y1) / 2, 0.1)
        }
      }
    })
  }
  // the entrance on +z: glass doors under a blue canopy on two posts
  K.ext(M.glass, -13.2, -6.8, 0.05, 3.0, D / 2 - 0.1, D / 2 + 0.1, 0.06)
  K.ext(M.blue, -14.5, -5.5, 3.3, 3.8, D / 2 - 0.2, D / 2 + 3.6, 0.18)
  for (const x of [-14.0, -6.0]) K.box(M.blue, 0.3, 3.3, 0.3, x, 1.65, D / 2 + 3.3, 0.1)
  K.ext(M.panel, -15, -5, -0.02, 0.1, D / 2, D / 2 + 4.2, 0.04)
  // the stair tower and its radome
  K.ext(M.blue, 16, 21, 0, 10.4, -3, 3.5, 0.3)
  K.ext(M.blueDeep, 15.9, 21.1, 10.2, 10.55, -3.1, 3.6, 0.12)
  K.box(M.window, 1.4, 7.0, 0.2, 18.5, 4.4, 3.52, 0.06)
  K.cyl(M.white, 1.6, 1.6, 0.9, 18.5, 11.0, 0.25, 'y', 0.12, 32)
  K.at(
    M.white,
    cached('radome', () => new THREE.SphereGeometry(2.3, 40, 24, 0, TAU, 0, PI * 0.62)),
    18.5,
    12.4,
    0.25
  )
  // roof plant: boxes and fans
  for (const [x, z] of [
    [-15, -6],
    [-9.5, -6],
  ]) {
    K.box(M.panel, 4.2, 1.4, 2.6, x, H + 0.8, z, 0.25)
    for (const s of [-1, 1]) K.cyl(M.navy, 0.75, 0.75, 0.1, x + s * 1.0, H + 1.52, z, 'y', 0.03, 24)
  }
  // the dishes
  dishInto(K, { x: -4, y: 10.0, z: -4.5, R: 3.6, yaw: -PI / 4, tilt: 50 * D2R })
  dishInto(K, { x: 4.5, y: 9.3, z: 5.5, R: 2.0, yaw: -PI / 4, tilt: 42 * D2R })
  dishInto(K, { x: -16, y: 9.3, z: 4.5, R: 1.8, yaw: -PI / 4, tilt: 58 * D2R })
  return K.freeze()
})
export function buildToyControlCenter() {
  const g = thaw(ccKit())
  g.name = 'control-center'
  const { W, D, H } = CC
  const p = plate('PADLINE  ·  LAUNCH CONTROL', {
    bg: null,
    fg: '#ffffff',
    px: 104,
    h: 150,
    padX: 0.1,
    mark: true,
  })
  const d = decal(p.tex, p.aspect, 0.72)
  d.position.set(-2, H + 0.27, D / 2 + 0.165)
  g.add(d)
  const s = signTex('PADLINE', 'Launch Control')
  const sh = 1.45
  const sp = new THREE.Mesh(rbox(0.2, sh + 0.1, s.aspect * sh + 0.1, 0.08), mats().white)
  sp.position.set(21.12, 5.6, 0.25)
  sp.castShadow = sp.receiveShadow = true
  g.add(sp)
  const sd = decal(s.tex, s.aspect, sh)
  sd.position.set(21.23, 5.6, 0.25)
  sd.rotation.y = PI / 2
  g.add(sd)
  void W
  return g
}
