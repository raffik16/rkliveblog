// Padline's rocket and its transporter-erector, in the toy airport's look (../airport-shared/style.js): a fat toy
// two-stage booster in the shape of a Falcon 9 with a cargo capsule on top, and the strongback that rolls it out of the
// hangar and stands it up. No logos. Toy metres, y up.
//
//   buildToyBooster()  -> {group, setLegs(k), setFins(k), dims}
//       Origin at the centre of the nozzle exits, the stage along +y. Engines y 0..1.4, white body to y = 27.0, the
//       dark interstage 27.0..30.5 (hollow, open at the top). Four landing legs folded along the body (y 1.7..10.3):
//       setLegs(1) swings them down and out to feet 1.5 m below the nozzles, 10.5 m out. Four grid fins on the
//       interstage: setFins(1) turns them out flat.
//   buildToyUpperStage() -> {group, capsule, dims}
//       Origin at the bottom of the stage's body (stack y = 30.5); its vacuum engine hangs below to y = -3.1 (inside
//       the interstage when stacked). Body to y = 7.5, payload adapter, then capsule.group at y = 7.7.
//   buildToyCapsule()  -> {group, setNose(k), ringY, dims}
//       Origin at the bottom of the trunk. Trunk y 0..2.8 (half wrapped in solar cells), capsule 2.8..5.7, nose cap to
//       6.45. setNose(1) swings the cap open to the side; the docking ring (radius 1.0) under it faces +y, its face at
//       y = ringY (6.0).
//   STACK: the heights where the parts meet when stacked: {upper: 30.5, capsule: 38.2, top: 44.65, R: 2.3}
//
//   buildToyErector()  -> {group, setAngle(a), setClaws(k), roll(d), rocketMatrix(out), HINGE, dims}
//       The transporter-erector. Origin on the ground under the hinge pin, the frame running back along -x on bogies over
//       rails at z = +/-3.0 (wheels on the rail tops, y = 0.52). The strongback pivots about the hinge at (0, 0.9, 0): setAngle(a) with
//       a = 0 lying flat along -x, a = PI / 2 standing up. Two yellow rams follow it. setClaws(k): the cradles' upper
//       halves from closed (1) to swung open (0). rocketMatrix(out) writes the matrix that puts a rocket (origin at its
//       nozzles, axis +y) in its cradles, in the erector's frame: base 5.1 m behind the hinge, axis 7.5 m above it.
import * as THREE from 'three'
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js'
import { TOY, rbox, toyMat } from '../airport-shared/style.js'

const PI = Math.PI
const V = (x = 0, y = 0, z = 0) => new THREE.Vector3(x, y, z)
const clamp = (v, a, b) => Math.min(b, Math.max(a, v))
const lerp = (a, b, k) => a + (b - a) * k

export const STACK = { upper: 30.5, capsule: 38.2, top: 44.65, R: 2.3 }
export const ROCKET_COLORS = {
  ink: '#232a40', // interstage, legs: the toy's black
  engine: '#3a4361',
  engineRim: '#8a94b0',
  fin: '#aab4cf', // grid fins read as bare metal against the dark interstage
  cells: '#2a3fa6', // solar cells on the trunk
  shield: '#3b4156', // the capsule's heat shield
  steel: '#c3cbe3',
}
const RC = ROCKET_COLORS

// ------------------------------------------------------------------------------------------------ geometry kit
// (the merge-per-material pattern of airside.js)
const _p = V()
const _q = new THREE.Quaternion()
const _e = new THREE.Euler()
const _s = V(1, 1, 1)
export const mat4 = (x = 0, y = 0, z = 0, rx = 0, ry = 0, rz = 0) =>
  new THREE.Matrix4().compose(_p.set(x, y, z), _q.setFromEuler(_e.set(rx, ry, rz)), _s.set(1, 1, 1))
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
const GEO = new Map()
const cached = (key, make) => {
  if (!GEO.has(key)) GEO.set(key, make())
  return GEO.get(key)
}
/** a soft-edged cylinder (or a tapered one), axis y, centred */
export function rcyl(rb, rt, h, b = 0.12, seg = 40) {
  return cached(`rcyl|${rb}|${rt}|${h}|${b}|${seg}`, () => {
    const bb = Math.min(b, h / 2 - 1e-3, Math.min(rb, rt) - 1e-3)
    const pts = [new THREE.Vector2(1e-4, -h / 2)]
    const arc = (cx, cy, a0, a1) => {
      for (let k = 0; k <= 4; k++) {
        const a = lerp(a0, a1, k / 4)
        pts.push(new THREE.Vector2(cx + bb * Math.cos(a), cy + bb * Math.sin(a)))
      }
    }
    arc(rb - bb, -h / 2 + bb, -PI / 2, 0)
    arc(rt - bb, h / 2 - bb, 0, PI / 2)
    pts.push(new THREE.Vector2(1e-4, h / 2))
    return new THREE.LatheGeometry(pts, seg)
  })
}
/** a lathe through [r, y] pairs (y increasing = normals out) */
export const lathe = (pairs, seg = 40) =>
  new THREE.LatheGeometry(
    pairs.map(([r, y]) => new THREE.Vector2(r, y)),
    seg
  )

export class Kit {
  constructor() {
    this.parts = new Map()
  }
  add(mat, geo, m) {
    const g = clean(geo)
    if (m) g.applyMatrix4(m)
    if (!this.parts.has(mat)) this.parts.set(mat, [])
    this.parts.get(mat).push(g)
    return this
  }
  box(mat, w, h, d, x, y, z, r = null, rx = 0, ry = 0, rz = 0) {
    return this.add(mat, rbox(w, h, d, r ?? Math.min(w, h, d) * 0.2), mat4(x, y, z, rx, ry, rz))
  }
  /** a rounded box on the surface of a body of revolution: at azimuth a (from +z toward +x), leaning back by lean */
  onSurface(mat, w, h, d, r, y, a, lean = 0, bevel = null) {
    const m = new THREE.Matrix4().makeTranslation(r * Math.sin(a), y, r * Math.cos(a))
    m.multiply(new THREE.Matrix4().makeRotationY(a)).multiply(
      new THREE.Matrix4().makeRotationX(-lean)
    )
    return this.add(mat, rbox(w, h, d, bevel ?? Math.min(w, h, d) * 0.3), m)
  }
  cyl(mat, rb, rt, h, x, y, z, axis = 'y', b = 0.12, seg = 32) {
    const m =
      axis === 'x'
        ? mat4(x, y, z, 0, 0, -PI / 2)
        : axis === 'z'
          ? mat4(x, y, z, PI / 2, 0, 0)
          : mat4(x, y, z)
    return this.add(mat, rcyl(rb, rt, h, b, seg), m)
  }
  /** a square bar between two points, built at its true length */
  bar(mat, a, b, w, r = 0.08) {
    const d = V().subVectors(b, a)
    const len = d.length()
    const q = new THREE.Quaternion().setFromUnitVectors(V(0, 1, 0), d.multiplyScalar(1 / len))
    return this.add(
      mat,
      rbox(w, len, w, Math.min(r, w * 0.3), 1),
      new THREE.Matrix4().compose(a.clone().add(b).multiplyScalar(0.5), q, V(1, 1, 1))
    )
  }
  build(group = new THREE.Group()) {
    for (const [mat, list] of this.parts) {
      const m = new THREE.Mesh(mergeGeometries(list, false), mat)
      m.castShadow = !mat.transparent
      m.receiveShadow = true
      group.add(m)
    }
    return group
  }
}

let MATS = null
function mats() {
  if (MATS) return MATS
  MATS = {
    white: toyMat(TOY.white, { paint: true, rough: 0.46 }),
    panel: toyMat(TOY.panel, { rough: 0.55 }),
    ink: toyMat(RC.ink, { rough: 0.62 }),
    engine: toyMat(RC.engine, { rough: 0.42, metal: 0.25 }),
    rim: toyMat(RC.engineRim, { rough: 0.4, metal: 0.2 }),
    fin: toyMat(RC.fin, { rough: 0.4, metal: 0.15 }),
    cells: toyMat(RC.cells, { rough: 0.3 }),
    shield: toyMat(RC.shield, { rough: 0.7 }),
    glass: toyMat(TOY.glass, { rough: 0.16 }),
    blue: toyMat(TOY.blue, { paint: true, rough: 0.5 }),
    blueDeep: toyMat(TOY.blueDeep, { paint: true, rough: 0.5 }),
    steel: toyMat(RC.steel, { rough: 0.45 }),
    yellow: toyMat(TOY.yellow, { paint: true, rough: 0.5 }),
    tyre: toyMat(TOY.navy, { rough: 0.82 }),
    hub: toyMat('#c9cfdf', { rough: 0.42 }),
    // the inside of the interstage, seen through its open top
    inside: new THREE.MeshStandardMaterial({
      color: '#1b2034',
      roughness: 0.9,
      side: THREE.BackSide,
    }),
  }
  return MATS
}

// ------------------------------------------------------------------------------------------------ booster
const LEG = { hingeR: 2.5, hingeY: 1.7, len: 8.6, deploy: (112 * PI) / 180 }
export function buildToyBooster() {
  const M = mats()
  const group = new THREE.Group()
  group.name = 'booster'
  const K = new Kit()
  const R = STACK.R
  // the body: white, a soft shoulder at the bottom, a thin blue ring under the interstage
  K.add(M.white, rcyl(R, R, 25.6, 0.22, 48), mat4(0, 1.4 + 12.8, 0))
  K.add(M.blue, rcyl(R + 0.03, R + 0.03, 0.34, 0.06, 48), mat4(0, 26.2, 0))
  // the engine skirt (octaweb) and nine bells
  K.add(M.ink, rcyl(R + 0.06, R - 0.1, 0.62, 0.16, 48), mat4(0, 1.32, 0))
  K.add(M.ink, rcyl(R - 0.25, R - 0.25, 0.4, 0.08, 40), mat4(0, 0.98, 0))
  const bell = cached('bell', () =>
    lathe(
      [
        [0.53, 0.0],
        [0.5, 0.12],
        [0.41, 0.5],
        [0.31, 0.95],
        [0.28, 1.2],
        [0.32, 1.32],
      ],
      24
    )
  )
  const rim = cached('bellRim', () => new THREE.TorusGeometry(0.52, 0.045, 6, 24).rotateX(PI / 2))
  const engines = [
    [0, 0],
    ...Array.from({ length: 8 }, (_, i) => [
      1.45 * Math.cos((i * PI) / 4 + PI / 8),
      1.45 * Math.sin((i * PI) / 4 + PI / 8),
    ]),
  ]
  for (const [x, z] of engines) {
    K.add(M.engine, bell, mat4(x, 0, z))
    K.add(M.rim, rim, mat4(x, 0.03, z))
  }
  // a little navy serial near the bottom: drawn as four ticks (no text on the rocket)
  for (let i = 0; i < 4; i++) K.box(M.ink, 0.12, 0.7, 0.1, -0.9 + i * 0.32, 4.2, R + 0.01, 0.04)
  // the interstage: a hollow dark sleeve, open at the top
  K.add(
    M.ink,
    lathe(
      [
        [R, 27.0],
        [R, 30.2],
        [R - 0.08, 30.45],
        [R - 0.2, 30.5],
      ],
      48
    )
  )
  K.add(
    M.inside,
    lathe(
      [
        [R - 0.18, 27.2],
        [R - 0.18, 30.5],
      ],
      48
    )
  )
  K.add(M.ink, new THREE.RingGeometry(R - 0.2, R, 48).rotateX(-PI / 2), mat4(0, 30.49, 0))
  K.add(M.ink, new THREE.CircleGeometry(R - 0.16, 32).rotateX(-PI / 2), mat4(0, 27.25, 0))
  // grid fin hinge blocks
  // legs and grid fins line up on the four quarters (the pad's hold-down clamps take the diagonals)
  const finAz = [0, 1, 2, 3].map((i) => (i * PI) / 2)
  for (const a of finAz)
    K.box(M.fin, 0.5, 0.34, 0.5, (R + 0.08) * Math.cos(a), 27.85, (R + 0.08) * Math.sin(a), 0.08)
  // leg hinge blocks at the bottom
  for (const a of finAz)
    K.box(
      M.ink,
      0.9,
      0.5,
      0.7,
      (R + 0.1) * Math.cos(a),
      LEG.hingeY,
      (R + 0.1) * Math.sin(a),
      0.12,
      0,
      -a,
      0
    )
  K.build(group)

  // ---- grid fins: a lattice paddle 1.9 wide, 1.7 long; hinged at its foot, folded up against the interstage
  const finKit = new Kit()
  const fw = 1.9
  const fl = 1.7
  const ft = 0.32
  finKit.box(M.fin, ft, 0.16, fw, 0, 0.08, 0, 0.05)
  finKit.box(M.fin, ft, 0.16, fw, 0, fl - 0.08, 0, 0.05)
  finKit.box(M.fin, ft, fl, 0.16, 0, fl / 2, -fw / 2 + 0.08, 0.05)
  finKit.box(M.fin, ft, fl, 0.16, 0, fl / 2, fw / 2 - 0.08, 0.05)
  for (let i = 1; i < 5; i++) {
    finKit.box(M.fin, ft * 0.8, 0.07, fw - 0.2, 0, (i * fl) / 5, 0, 0.02)
    finKit.box(M.fin, ft * 0.8, fl - 0.2, 0.07, 0, fl / 2, -fw / 2 + (i * fw) / 5, 0.02)
  }
  const finGeo = finKit.build()
  const fins = finAz.map((a) => {
    const piv = new THREE.Group()
    piv.position.set((R + 0.28) * Math.cos(a), 27.9, (R + 0.28) * Math.sin(a))
    piv.rotation.y = -a
    const arm = new THREE.Group()
    arm.add(finGeo.clone())
    piv.add(arm)
    group.add(piv)
    return arm
  })

  // ---- landing legs: dark tapered blades with a foot, hinged at the bottom; a strut shows once they open
  const legKit = new Kit()
  const blade = (() => {
    const g = clean(rbox(0.72, LEG.len, 1.6, 0.26, 2))
    const pos = g.attributes.position
    for (let i = 0; i < pos.count; i++) {
      const y = pos.getY(i) + LEG.len / 2 // 0 at the hinge
      const k = lerp(1, 0.5, y / LEG.len)
      pos.setZ(i, pos.getZ(i) * k)
      pos.setY(i, y)
    }
    g.computeVertexNormals()
    return g
  })()
  legKit.add(M.ink, blade)
  legKit.box(M.white, 0.1, 1.4, 0.6, 0.37, 5.6, 0, 0.04) // a white tick down each leg
  const legGeo = legKit.build()
  const footGeo = rcyl(0.8, 0.62, 0.3, 0.12, 24)
  const strutGeo = rcyl(0.22, 0.22, 1, 0.06, 12)
  const legs = finAz.map((a) => {
    const piv = new THREE.Group()
    piv.position.set(LEG.hingeR * Math.cos(a), LEG.hingeY, LEG.hingeR * Math.sin(a))
    piv.rotation.y = -a
    const arm = new THREE.Group()
    arm.add(legGeo.clone())
    const foot = new THREE.Mesh(footGeo, M.ink)
    foot.castShadow = foot.receiveShadow = true
    foot.position.y = LEG.len
    arm.add(foot)
    piv.add(arm)
    const strut = new THREE.Mesh(strutGeo, M.steel)
    strut.castShadow = true
    piv.add(strut)
    group.add(piv)
    return { arm, foot, strut }
  })
  const sa = V()
  const sb = V()
  const up = V(0, 1, 0)
  return {
    group,
    /** k 0 folded up along the body, 1 down and locked */
    setLegs(k) {
      const th = LEG.deploy * clamp(k, 0, 1)
      for (const L of legs) {
        L.arm.rotation.z = -th
        // the foot stays level with the ground once the leg is down
        L.foot.rotation.z = th
        // the strut: from the body (6.3 m up) to 4.6 m along the leg, in the pivot's frame (x out, y up)
        L.strut.visible = th > 0.08
        if (L.strut.visible) {
          sa.set(-0.12, 6.3, 0)
          sb.set(4.2 * Math.sin(th), 4.2 * Math.cos(th), 0)
          const d = sb.clone().sub(sa)
          L.strut.scale.set(1, d.length(), 1)
          L.strut.position.copy(sa).add(sb).multiplyScalar(0.5)
          L.strut.quaternion.setFromUnitVectors(up, d.normalize())
        }
      }
    },
    /** k 0 folded flat against the interstage, 1 out flat */
    setFins(k) {
      for (const f of fins) f.rotation.z = (-PI / 2) * clamp(k, 0, 1)
    },
    dims: {
      R,
      height: 30.5,
      legSpan: 2 * (LEG.hingeR + LEG.len * Math.sin(LEG.deploy)),
      footY: LEG.hingeY + LEG.len * Math.cos(LEG.deploy),
    },
  }
}

// ------------------------------------------------------------------------------------------------ capsule
export function buildToyCapsule() {
  const M = mats()
  const group = new THREE.Group()
  group.name = 'capsule'
  const K = new Kit()
  // the trunk: white, half wrapped in solar cells, a ring at the top
  K.add(M.white, rcyl(2.12, 2.12, 2.8, 0.16, 48), mat4(0, 1.4, 0))
  K.add(
    M.cells,
    new THREE.CylinderGeometry(2.16, 2.16, 2.0, 32, 1, true, -PI / 2, PI),
    mat4(0, 1.4, 0)
  )
  for (let i = 0; i < 9; i++) {
    const a = -PI / 2 + (i * PI) / 8
    K.box(M.steel, 0.05, 2.0, 0.05, 2.17 * Math.sin(a), 1.4, 2.17 * Math.cos(a), 0.01)
  }
  // the capsule: a dark heat shield lip, a white cone with soft shoulders
  K.add(M.shield, rcyl(2.14, 2.1, 0.34, 0.1, 48), mat4(0, 2.95, 0))
  K.add(
    M.white,
    lathe(
      [
        [2.08, 3.1],
        [2.02, 3.3],
        [1.6, 4.6],
        [1.24, 5.55],
        [1.12, 5.72],
        [0.6, 5.74],
      ],
      48
    )
  )
  // two windows and four thruster pods on the cone (its surface leans in 0.30 rad)
  const lean = Math.atan2(2.02 - 1.24, 5.55 - 3.3)
  for (const a of [0.42, -0.42]) K.onSurface(M.glass, 0.52, 0.44, 0.14, 1.75, 4.25, a, lean, 0.12)
  for (let i = 0; i < 4; i++)
    K.onSurface(M.ink, 0.46, 0.32, 0.16, 1.36, 5.1, PI / 4 + (i * PI) / 2, lean, 0.06)
  // the docking ring under the cap
  K.add(M.steel, rcyl(1.02, 1.0, 0.32, 0.08, 32), mat4(0, 5.86, 0))
  K.add(M.ink, new THREE.CircleGeometry(0.72, 24).rotateX(-PI / 2), mat4(0, 6.025, 0))
  K.build(group)
  // the nose cap, hinged at its +x edge
  const hinge = new THREE.Group()
  hinge.position.set(1.12, 5.74, 0)
  const cap = new THREE.Mesh(
    cached('noseCap', () =>
      lathe(
        [
          [1.2, 0.0],
          [1.18, 0.18],
          [1.0, 0.48],
          [0.62, 0.68],
          [0.01, 0.76],
        ],
        40
      )
    ),
    M.white
  )
  cap.position.set(-1.12, 0, 0)
  cap.castShadow = cap.receiveShadow = true
  hinge.add(cap)
  group.add(hinge)
  return {
    group,
    /** 0 closed, 1 swung open to the side */
    setNose(k) {
      hinge.rotation.z = (-115 * PI * clamp(k, 0, 1)) / 180
    },
    ringY: 6.03,
    dims: { R: 2.14, height: 6.45 },
  }
}

// ------------------------------------------------------------------------------------------------ upper stage
export function buildToyUpperStage() {
  const M = mats()
  const group = new THREE.Group()
  group.name = 'upper'
  const K = new Kit()
  const R = STACK.R
  K.add(M.white, rcyl(R, R, 7.5, 0.2, 48), mat4(0, 3.75, 0))
  K.add(M.ink, rcyl(R + 0.02, R + 0.02, 0.22, 0.05, 48), mat4(0, 0.2, 0))
  // the payload adapter: a short cone from the stage to the trunk
  K.add(
    M.panel,
    lathe(
      [
        [R - 0.02, 7.45],
        [R - 0.08, 7.6],
        [2.14, 7.72],
      ],
      48
    )
  )
  // the vacuum engine: a big dark bell hanging into the interstage
  K.add(
    M.engine,
    lathe(
      [
        [1.52, -3.1],
        [1.4, -2.6],
        [1.0, -1.55],
        [0.62, -0.7],
        [0.48, -0.2],
        [0.55, 0.0],
      ],
      40
    )
  )
  K.add(M.rim, new THREE.TorusGeometry(1.5, 0.06, 6, 40).rotateX(PI / 2), mat4(0, -3.08, 0))
  K.add(M.ink, rcyl(0.9, 0.7, 0.5, 0.1, 24), mat4(0, -0.05, 0))
  K.build(group)
  const capsule = buildToyCapsule()
  capsule.group.position.y = 7.7
  group.add(capsule.group)
  return { group, capsule, dims: { R, height: 7.7 + 6.45, bellY: -3.1 } }
}

// ------------------------------------------------------------------------------------------------ the erector
const TE = {
  len: 51, // the strongback and the frame, back from the hinge
  hingeY: 0.9,
  spine: [-0.2, 2.2], // the strongback's depth, measured from the hinge axis toward the rocket
  halfW: 1.15,
  rocketBase: -5.1, // the rocket's nozzles, along the strongback from the hinge
  rocketAxis: 7.5, // the rocket's axis above the strongback's hinge line
  cradles: [-17.5, -27.5, -37.5, -45.5], // 12.4, 22.4, 32.4 and 40.4 m up the rocket: clear of the legs and the grid fins
  ramBase: [-21, 0.95],
  ramTop: [-10, 1.0],
  ramZ: 1.95,
  bogies: [-2.2, -10.5, -19, -28, -37, -46.5],
}
export function buildToyErector() {
  const M = mats()
  const group = new THREE.Group()
  group.name = 'erector'
  const R = STACK.R

  // ---- the rolling frame: two blue side beams on six bogies, cross members, a deck plate at the hinge end
  const F = new Kit()
  const fy = 0.62
  for (const z of [-2.6, 2.6]) F.box(M.blue, TE.len, 0.55, 0.6, -TE.len / 2, fy, z, 0.14)
  for (let x = -1; x > -TE.len; x -= 4.25) F.box(M.blue, 0.5, 0.4, 4.8, x, fy, 0, 0.1)
  F.box(M.blue, 3.2, 0.5, 5.8, -1.6, fy + 0.05, 0, 0.16)
  // the hinge pins
  for (const z of [-1.8, 1.8]) F.cyl(M.steel, 0.45, 0.45, 0.8, 0, TE.hingeY, z, 'z', 0.08, 20)
  for (const z of [-1.8, 1.8]) F.box(M.blue, 1.4, 0.9, 0.5, 0, 0.6, z * 1.18, 0.1)
  // the rams' base lugs
  for (const z of [-TE.ramZ, TE.ramZ])
    F.box(M.yellow, 1.2, 0.6, 0.5, TE.ramBase[0], TE.ramBase[1] - 0.05, z, 0.12)
  // bogies: a dark truck over each rail
  for (const x of TE.bogies) for (const z of [-3, 3]) F.box(M.ink, 2.6, 0.5, 0.7, x, 0.98, z, 0.14)
  F.build(group)
  const wheelGeo = rcyl(0.34, 0.34, 0.3, 0.06, 20)
  const hubGeo = rcyl(0.16, 0.16, 0.34, 0.04, 12)
  const wheels = []
  for (const x of TE.bogies)
    for (const z of [-3, 3])
      for (const dx of [-0.75, 0.75]) {
        const w = new THREE.Group()
        w.position.set(x + dx, 0.86, z) // on rail tops at y = 0.52
        w.rotation.x = PI / 2
        const t = new THREE.Mesh(wheelGeo, M.tyre)
        const h = new THREE.Mesh(hubGeo, M.hub)
        t.castShadow = true
        w.add(t, h)
        group.add(w)
        wheels.push(w)
      }

  // ---- the strongback: a white lattice spine with blue cradles; built lying along -x, pivoting about z
  const pivot = new THREE.Group()
  pivot.position.set(0, TE.hingeY, 0)
  group.add(pivot)
  const S = new Kit()
  const [y0, y1] = TE.spine
  const hw = TE.halfW
  const lw = 0.36
  for (const y of [y0 + lw / 2, y1 - lw / 2])
    for (const z of [-hw + lw / 2, hw - lw / 2])
      S.box(M.white, TE.len - 1, lw, lw, -TE.len / 2 - 0.5, y, z, 0.1)
  const step = 4.25
  for (let x = -2; x > -TE.len + 0.5; x -= step) {
    for (const z of [-hw + lw / 2, hw - lw / 2])
      S.box(M.white, 0.28, y1 - y0 - lw, 0.28, x, (y0 + y1) / 2, z, 0.08)
    for (const y of [y0 + lw / 2, y1 - lw / 2])
      S.box(M.white, 0.28, 0.28, 2 * hw - lw, x, y, 0, 0.08)
    if (x - step > -TE.len + 0.5)
      for (const z of [-hw + lw / 2, hw - lw / 2]) {
        S.bar(M.panel, V(x, y0 + lw, z), V(x - step, y1 - lw, z), 0.22, 0.06)
      }
  }
  // the foot: a solid block at the hinge, the lugs that hold the pins
  S.box(M.white, 3.2, y1 - y0, 2 * hw, -1.6, (y0 + y1) / 2, 0, 0.3)
  for (const z of [-1.8, 1.8]) S.box(M.white, 1.3, 1.2, 0.45, 0, 0.1, z, 0.14)
  // the rams' top lugs
  for (const z of [-1, 1])
    S.box(
      M.yellow,
      1.0,
      0.8,
      TE.ramZ - hw + 0.5,
      TE.ramTop[0],
      TE.ramTop[1],
      (z * (hw + TE.ramZ + 0.5)) / 2,
      0.12
    )
  // the cradles: a blue saddle post from the spine to a lower half-ring under the rocket
  const ax = TE.rocketAxis
  for (const x of TE.cradles) {
    S.box(M.blue, 1.1, ax - R - y1 + 0.35, 2.6, x, (y1 + ax - R) / 2 + 0.1, 0, 0.18)
    S.add(M.blue, new THREE.TorusGeometry(R + 0.32, 0.3, 10, 28, PI), mat4(x, ax, 0, 0, PI / 2, PI))
  }
  // a PADLINE-blue band on the spine's face, near the top
  S.box(M.blue, 6, 0.1, 2 * hw - 0.3, -TE.len + 5, y1 + 0.02, 0, 0.04)
  S.build(pivot)
  // the cradles' upper halves, hinged at the +z side of each ring
  const claws = TE.cradles.map((x) => {
    const h = new THREE.Group()
    h.position.set(x, ax, R + 0.32)
    const c = new THREE.Mesh(
      cached('claw', () => new THREE.TorusGeometry(R + 0.32, 0.26, 10, 28, PI).rotateY(PI / 2)),
      M.blue
    )
    c.position.set(0, 0, -(R + 0.32))
    c.castShadow = c.receiveShadow = true
    h.add(c)
    pivot.add(h)
    return h
  })

  // ---- the rams: a yellow tube from the frame, a steel sleeve, a chrome rod to the strongback (posed each frame)
  const tubeGeo = rcyl(0.42, 0.42, 1, 0.08, 20)
  const midGeo = rcyl(0.32, 0.32, 1, 0.06, 18)
  const rodGeo = rcyl(0.22, 0.22, 1, 0.05, 16)
  const mk = (geo, mat) => {
    const m = new THREE.Mesh(geo, mat)
    m.castShadow = m.receiveShadow = true
    group.add(m)
    return m
  }
  const rams = [-TE.ramZ, TE.ramZ].map((z) => ({
    z,
    tube: mk(tubeGeo, M.yellow),
    mid: mk(midGeo, M.steel),
    rod: mk(rodGeo, M.hub),
  }))
  const up = V(0, 1, 0)
  const place = (m, a, dir, s0, s1) => {
    m.position.copy(a).addScaledVector(dir, (s0 + s1) / 2)
    m.scale.set(1, s1 - s0, 1)
    m.quaternion.setFromUnitVectors(up, dir)
  }
  const A = V()
  const P = V()
  const D = V()
  const state = { angle: 0 }
  const api = {
    group,
    pivot,
    HINGE: V(0, TE.hingeY, 0),
    /** 0 lying flat along -x, PI / 2 standing up */
    setAngle(a) {
      state.angle = a
      pivot.rotation.z = -a
      const c = Math.cos(a)
      const s = Math.sin(a)
      const [tx, ty] = TE.ramTop
      for (const r of rams) {
        A.set(TE.ramBase[0], TE.ramBase[1], r.z)
        // the top lug, turned with the strongback: (x, y) -> (x cos a + y sin a, -x sin a + y cos a) about the hinge
        P.set(tx * c + ty * s, TE.hingeY - tx * s + ty * c, r.z)
        D.subVectors(P, A)
        const L = D.length()
        D.multiplyScalar(1 / L)
        place(r.tube, A, D, -0.4, 9.0)
        place(r.rod, A, D, L - 8.6, L + 0.3)
        const m0 = (9.0 + L - 8.6) / 2
        place(r.mid, A, D, Math.max(0.5, m0 - 4.3), Math.max(1.0, m0 + 4.3))
      }
    },
    /** the cradles' upper halves: 1 closed round the rocket, 0 swung open */
    setClaws(k) {
      for (const c of claws) c.rotation.x = ((1 - clamp(k, 0, 1)) * 100 * PI) / 180
    },
    roll(d) {
      for (const w of wheels) w.rotation.y = -d / 0.34
    },
    /** the matrix (in the erector's frame) that seats a rocket, nozzles at its origin and axis +y, in the cradles */
    rocketMatrix(out = new THREE.Matrix4()) {
      pivot.updateMatrix()
      return out.copy(pivot.matrix).multiply(mat4(TE.rocketBase, TE.rocketAxis, 0, 0, 0, PI / 2))
    },
    dims: { len: TE.len, hingeY: TE.hingeY, rocketBase: TE.rocketBase, rocketAxis: TE.rocketAxis },
  }
  api.setAngle(0)
  api.setClaws(1)
  return api
}
