// Padline's last scene: a toy space station floating high above a toy Earth, in the toy airport's look
// (../airport-shared/style.js): chunky bevelled forms, matte paint with a soft clearcoat, white and blue, the solar
// cells deep blue. No flags, no agency marks, no real names. Toy metres, y up.
//
//   buildToyStation()
//       -> {group, dockPort: {pos, dir}, setArrays(a), setArm(k), dims}
//       Origin at the middle of the truss (the station floats; nothing is on the ground). The integrated truss runs
//       along x from -42 to +42, a 3.3 m square section centred on y = 0, z = 0. Four pairs of big solar wings on the
//       outboard truss (pairs at x = +/-27.6 and +/-38.2): each wing 9.3 m wide (x) and 30.5 m long, one of each pair
//       reaching +z and one -z from the truss, the cells facing +y at a = 0, tips at z = +/-32.4. White radiators on
//       the middle truss (x = +/-8.85..19.15) fold out behind it toward -z (to z = -15.6).
//       The pressurised modules hang below the truss centre on one line along z, axis y = -5.2 (radius 2.1 to 2.35):
//       front node z 15.1..21.7 with the docking adapter on its +z end and two side modules (+x to x = 10.4, -x to
//       x = -18.8 with its little platform), the lab z 4.4..15.1, the central node z -2.6..4.4 (under the truss, a
//       windowed cupola under its +x flank), then the two older off-white modules to z = -29.9, the last one with its
//       own small solar wings (x = +/-2.3..14.6 at z = -25.5).
//       dockPort.pos = (0, -5.2, 24.35): the centre of the port ring's outer face (ring radius 1.1 outer, 0.78 inner);
//       dockPort.dir = (0, 0, 1). Nothing stands in front of the port: a capsule of radius 2.0 flies in along that axis
//       freely (nothing of the station lies within 23 m of the axis beyond the ring face, at any a and any k; the arm
//       never reaches past z = 20 and stays above y = 2, 7 m over the axis).
//       setArrays(a): turns all 8 big wings (and the outboard truss that carries them) about the truss axis (x) to
//       angle a (rad, any value; a = 0 flat with the cells facing up, a > 0 tips the +z wings down and their cells
//       toward +z).
//       setArm(k): the two-boom arm on the truss top at x = 4.2: k = 0 stowed, folded flat along the truss toward +x;
//       k = 1 the ready pose, both booms out toward +z over the front, the end effector's tip at (3.4, 3.0, 19.6)
//       above the front node. Boom lengths 10.5 and 9.5. On the way the elbow unfolds upward (at k = 0.5 the arm
//       stands up to y = 15.8). Joint angles eased between the two (smoothstep), pure in k (clamped 0..1).
//       dims: {span, length, height} of the bounding box at a = 0, k = 0: {span: 85.7, length: 64.85, height: 12.54}
//       (x -42.85..42.85, z -32.4..32.4, y -8.77 at the cupola up to 3.77 at the stowed arm).
//   buildToyEarth({radius = 4000})
//       -> {group, update(t)}
//       The Earth far below. The group's origin is the top of the sphere (its centre at y = -radius): put the group
//       380 m below the station. A deep blue ocean with soft pale-sand and sage land masses (drawn in the shader, so
//       the coasts stay crisp at any distance), about 1000 puffy flattened toy clouds 15-70 m across floating 9-16 m
//       above the surface (instanced, in 12 sectors so the ones out of view are culled), faint cloud shadows, and a
//       soft blue glow along the limb. The Earth casts and receives no shadows (the stage's 460 m shadow box would
//       show its edge on it). update(t): the surface turns 0.4 deg a second about the x axis, so the ground drifts
//       toward -z under the station (28 m/s at radius 4000); the clouds turn 12% faster. Pure in t (seconds).
//       284k triangles in all; from the film's angle (d 60 to 400) 6-8 draw calls and 105-120k triangles in view.
//   SPACE: {bg, fog: {color, near, far}, sun: {color, intensity}, hemi: {sky, ground, intensity}}
//       The scene settings for orbit: a deep navy beyond the Earth, a pale blue haze toward the horizon (the fog
//       starts 650 m from the camera, so the station stays clean with the camera up to about 600 m away), a strong
//       white sun, and a hemisphere light whose ground colour is the Earth's blue bouncing up onto the station's
//       undersides. With the camera 200-400 m out, the limb lies 2000-2300 m away, at the stage camera's far plane
//       (2000): the fog and the glow hide the clip.
//   ORBIT: the colours style.js does not carry (truss, inset, cells, port, ocean, land, glow).
//
// Static parts are merged per material, repeated parts (every solar cell, the clouds) instanced: the station is 26
// draw calls (200k triangles). No textures, no fonts, nothing async: build it any time.
import * as THREE from 'three'
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js'
import { TOY, rbox, toyMat } from '../airport-shared/style.js'

const PI = Math.PI
const TAU = PI * 2
const D2R = PI / 180
const clamp = (v, a, b) => Math.min(b, Math.max(a, v))
const lerp = (a, b, t) => a + (b - a) * t
const sstep = (u) => {
  const v = clamp(u, 0, 1)
  return v * v * (3 - 2 * v)
}
const V = (x = 0, y = 0, z = 0) => new THREE.Vector3(x, y, z)
const _p = V()
const _q = new THREE.Quaternion()
const _e = new THREE.Euler()
const _s = V(1, 1, 1)
const mat4 = (x = 0, y = 0, z = 0, rx = 0, ry = 0, rz = 0, sx = 1, sy = 1, sz = 1) =>
  new THREE.Matrix4().compose(
    _p.set(x, y, z),
    _q.setFromEuler(_e.set(rx, ry, rz)),
    _s.set(sx, sy, sz)
  )

/** colours style.js does not carry */
export const ORBIT = {
  truss: '#dfe4f2', // the truss frame: a light grey just under the modules' white
  inset: '#8e9ac2', // the darker inset panels between the truss's struts
  cells: '#2442b4', // solar cells
  backing: '#d3ddf8', // the blanket behind the cells: the thin light lines between them
  port: '#b3bdd9', // the docking ring
  ocean: '#1f4bb8',
  shallow: '#4c80e4', // the pale band hugging the coasts
  sand: '#dccb9f', // soft land, pale and muted so the station stays the hero
  sage: '#97b890',
  cloud: '#ffffff',
  cloudShadow: '#0c1f6a',
  glow: '#8fbcff', // the atmosphere along the limb
}

/** the scene settings for orbit (set them on the stage: scene.background, scene.fog, the sun, the hemisphere light) */
export const SPACE = {
  bg: '#111a3a',
  fog: { color: '#8eb2f0', near: 650, far: 2400 },
  sun: { color: '#ffffff', intensity: 2.5 },
  hemi: { sky: '#f3f6ff', ground: '#a7bdf2', intensity: 1.05 },
}

// ------------------------------------------------------------------------------------------------ materials
let MATS = null
function mats() {
  if (MATS) return MATS
  MATS = {
    white: toyMat(TOY.white, { paint: true, rough: 0.5 }),
    old: toyMat(TOY.panel, { paint: true, rough: 0.55 }),
    blue: toyMat(TOY.blue, { paint: true, rough: 0.45 }),
    truss: toyMat(ORBIT.truss, { rough: 0.55 }),
    inset: toyMat(ORBIT.inset, { rough: 0.7 }),
    shade: toyMat(TOY.shade, { rough: 0.6 }),
    port: toyMat(ORBIT.port, { rough: 0.4 }),
    cells: toyMat(ORBIT.cells, { rough: 0.3 }),
    backing: toyMat(ORBIT.backing, { rough: 0.6 }),
    glass: toyMat(TOY.glass, { rough: 0.16 }),
    navy: toyMat(TOY.navy, { rough: 0.7 }),
  }
  return MATS
}

// ------------------------------------------------------------------------------------------------ geometry kit
// (the merge-per-material pattern of airside.js, plus a matrix stack for nested placements)
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
const GEO = new Map()
const cached = (key, make) => {
  if (!GEO.has(key)) GEO.set(key, make())
  return GEO.get(key)
}
/** a lathe with a rounded-rectangle profile: a cylinder (or a tapered one) with soft edges, axis y, centred */
function rcyl(rb, rt, h, b = 0.12, seg = 32) {
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
/** a ring (an annulus with rounded edges), axis y, centred: inner radius ri, outer ro, height h */
function rring(ri, ro, h, b = 0.08, seg = 48) {
  return cached(`rring|${ri}|${ro}|${h}|${b}|${seg}`, () => {
    const pts = []
    const arc = (cx, cy, a0, a1) => {
      for (let k = 0; k <= 4; k++) {
        const a = lerp(a0, a1, k / 4)
        pts.push(new THREE.Vector2(cx + b * Math.cos(a), cy + b * Math.sin(a)))
      }
    }
    // counter-clockwise in (r, y), so the normals face out
    arc(ro - b, -h / 2 + b, -PI / 2, 0)
    arc(ro - b, h / 2 - b, 0, PI / 2)
    arc(ri + b, h / 2 - b, PI / 2, PI)
    arc(ri + b, -h / 2 + b, PI, PI * 1.5)
    pts.push(pts[0].clone())
    return new THREE.LatheGeometry(pts, seg)
  })
}

class Kit {
  constructor() {
    this.parts = new Map()
    this.stack = [new THREE.Matrix4()]
  }
  /** run fn with every part placed in the frame m (nested in the current frame) */
  at(m, fn) {
    this.stack.push(this.stack[this.stack.length - 1].clone().multiply(m))
    fn()
    this.stack.pop()
    return this
  }
  add(mat, geo, m) {
    const g = clean(geo)
    if (m) g.applyMatrix4(m)
    if (this.stack.length > 1) g.applyMatrix4(this.stack[this.stack.length - 1])
    if (!this.parts.has(mat)) this.parts.set(mat, [])
    this.parts.get(mat).push(g)
    return this
  }
  box(mat, w, h, d, x, y, z, r = null, rx = 0, ry = 0, rz = 0) {
    return this.add(mat, rbox(w, h, d, r ?? Math.min(w, h, d) * 0.2), mat4(x, y, z, rx, ry, rz))
  }
  /** a soft-edged cylinder; axis 'y' | 'x' | 'z' (rb at the -axis end) */
  cyl(mat, rb, rt, h, x, y, z, axis = 'y', b = 0.12, seg = 32) {
    const m =
      axis === 'x'
        ? mat4(x, y, z, 0, 0, -PI / 2)
        : axis === 'z'
          ? mat4(x, y, z, PI / 2, 0, 0)
          : mat4(x, y, z)
    return this.add(mat, rcyl(rb, rt, h, b, seg), m)
  }
  ring(mat, ri, ro, h, x, y, z, axis = 'z', b = 0.08) {
    const m =
      axis === 'x'
        ? mat4(x, y, z, 0, 0, -PI / 2)
        : axis === 'z'
          ? mat4(x, y, z, PI / 2, 0, 0)
          : mat4(x, y, z)
    return this.add(mat, rring(ri, ro, h, b), m)
  }
  build(group = new THREE.Group()) {
    for (const [mat, list] of this.parts) {
      const m = new THREE.Mesh(mergeGeometries(list, false), mat)
      m.castShadow = m.receiveShadow = true
      group.add(m)
    }
    return group
  }
}
/** a square bar between two points, built at its true length so the bevels never stretch */
function bar(K, mat, a, b, w, r = 0.08) {
  const d = new THREE.Vector3().subVectors(b, a)
  const len = d.length()
  const q = new THREE.Quaternion().setFromUnitVectors(V(0, 1, 0), d.multiplyScalar(1 / len))
  K.add(
    mat,
    rbox(w, len, w, r, 1),
    new THREE.Matrix4().compose(a.clone().add(b).multiplyScalar(0.5), q, V(1, 1, 1))
  )
}
function instanced(geo, mat, matrices) {
  const im = new THREE.InstancedMesh(geo, mat, matrices.length)
  matrices.forEach((m, i) => im.setMatrixAt(i, m))
  im.instanceMatrix.needsUpdate = true
  im.castShadow = im.receiveShadow = true
  im.computeBoundingSphere()
  im.computeBoundingBox()
  return im
}

// ------------------------------------------------------------------------------------------------ the station
const TH = 1.63 // the truss's half section (longerons' outer faces)
const Y = -5.2 // the module line's axis
const PORT_Z = 24.35 // the docking ring's outer face
const PAIRS = [27.6, 38.2] // the wing pairs' x (both sides)
const WING = { w: 9.3, root: 3.0, cell0: 4.45, cell1: 31.75, tip: 32.4 }
const ARM = { x: 4.2, z: -0.7, L1: 10.5, L2: 9.5, w: 1.55, base: TH + 0.45, shoulder: 0.95 }
// joint angles: [yaw, shoulder pitch, elbow, wrist] stowed and ready
const ARM_STOW = [0, 0, PI, 0]
const ARM_READY = [-88 * D2R, 18 * D2R, -30 * D2R, -40 * D2R]

/** a stretch of the truss from x0 to x1: a dark inset core, light longerons, bulkhead ribs, a zigzag on every face */
function trussSpan(K, M, x0, x1) {
  const len = x1 - x0
  const cx = (x0 + x1) / 2
  K.box(M.inset, len, 2.7, 2.7, cx, 0, 0, 0.25)
  for (const sy of [-1, 1])
    for (const sz of [-1, 1]) K.box(M.truss, len, 0.62, 0.62, cx, sy * 1.32, sz * 1.32, 0.22)
  const n = Math.max(1, Math.round(len / 3.6))
  const bay = len / n
  for (let i = 0; i <= n; i++) K.box(M.truss, 0.44, 3.12, 3.12, x0 + i * bay, 0, 0, 0.2)
  for (let i = 0; i < n; i++) {
    const xa = x0 + i * bay + 0.2
    const xb = x0 + (i + 1) * bay - 0.2
    const f = i % 2 ? 1 : -1
    for (const s of [-1, 1]) {
      bar(K, M.truss, V(xa, s * 1.37, f * 1.12), V(xb, s * 1.37, -f * 1.12), 0.32)
      bar(K, M.truss, V(xa, f * 1.12, s * 1.37), V(xb, -f * 1.12, s * 1.37), 0.32)
    }
  }
}

/** a module body along z on the module line: a fat soft-edged cylinder */
const zmod = (K, mat, r, z0, z1, b = 0.85) =>
  K.cyl(mat, r, r, z1 - z0, 0, Y, (z0 + z1) / 2, 'z', b, 40)
const band = (K, M, r, z, x = 0, axis = 'z') =>
  axis === 'z'
    ? K.cyl(M.blue, r + 0.08, r + 0.08, 0.5, x, Y, z, 'z', 0.18, 40)
    : K.cyl(M.blue, r + 0.08, r + 0.08, 0.5, x, Y, z, 'x', 0.18, 40)
const collar = (K, M, z, r = 1.55) => K.cyl(M.shade, r, r, 0.9, 0, Y, z, 'z', 0.25, 32)

function buildStationStatic(M) {
  const K = new Kit()
  // --- the truss's fixed middle (x -21.2..21.2), its segment collars and the two rotary joints
  trussSpan(K, M, -21.2, 21.2)
  for (const sx of [-1, 1]) {
    K.box(M.truss, 0.9, 3.75, 3.75, sx * 10.6, 0, 0, 0.35)
    K.cyl(M.truss, 2.1, 2.1, 1.6, sx * 22.0, 0, 0, 'x', 0.3, 40)
    K.cyl(M.blue, 2.22, 2.22, 0.55, sx * 22.0, 0, 0, 'x', 0.18, 40)
  }
  // --- the radiators: three long white fins each side, folded out behind the truss toward -z
  for (const sx of [-1, 1]) {
    const xc = sx * 14
    K.cyl(M.shade, 0.55, 0.55, 1.5, xc, 0, -2.25, 'z', 0.15)
    K.at(mat4(xc, 0, -2.95, 0.1, 0, 0), () => {
      K.box(M.shade, 11.2, 0.6, 0.8, 0, 0, -0.2, 0.25)
      for (const fx of [-3.6, 0, 3.6]) {
        K.box(M.white, 3.1, 0.34, 12.2, fx, 0, -6.6, 0.15)
        for (let i = 0; i < 5; i++) K.box(M.shade, 2.6, 0.1, 0.24, fx, 0.19, -1.9 - i * 2.35, 0.04)
      }
    })
  }
  // --- the mount from the truss down onto the central node
  K.box(M.truss, 3.6, 2.5, 5.0, 0, -2.6, 0.9, 0.45)
  K.box(M.inset, 3.75, 1.2, 3.6, 0, -2.45, 0.9, 0.3)
  // --- the arm's base plate on the truss top
  K.box(M.blue, 2.4, 0.5, 2.4, ARM.x, TH + 0.2, ARM.z, 0.2)

  // --- the module line, front to back
  // front node with the docking adapter
  zmod(K, M.white, 2.35, 15.1, 21.7, 0.9)
  band(K, M, 2.35, 16.2)
  band(K, M, 2.35, 20.6)
  K.cyl(M.white, 1.62, 1.3, 1.9, 0, Y, 22.65, 'z', 0.3, 40) // the adapter cone
  K.cyl(M.blue, 1.56, 1.5, 0.4, 0, Y, 22.35, 'z', 0.12, 40)
  K.cyl(M.blue, 1.34, 1.34, 0.45, 0, Y, 23.72, 'z', 0.12, 40) // the short adapter under the ring
  K.ring(M.port, 0.78, 1.1, 0.42, 0, Y, PORT_Z - 0.21, 'z', 0.1) // the port ring, its face at PORT_Z
  K.cyl(M.navy, 0.82, 0.82, 0.2, 0, Y, PORT_Z - 0.38, 'z', 0.05, 32) // the hatch, recessed
  for (let i = 0; i < 4; i++) {
    const a = PI / 4 + (i * PI) / 2
    K.box(M.port, 0.36, 0.36, 0.3, 1.12 * Math.cos(a), Y + 1.12 * Math.sin(a), PORT_Z - 0.27, 0.1) // latches, behind the face
  }
  // the docking target on its post above the port
  K.box(M.shade, 0.3, 1.4, 0.3, 0, Y + 2.0, 23.05, 0.1)
  K.cyl(M.white, 0.8, 0.8, 0.18, 0, Y + 2.7, 23.2, 'z', 0.07, 32)
  K.box(M.navy, 1.2, 0.2, 0.08, 0, Y + 2.7, 23.31, 0.03)
  K.box(M.navy, 0.2, 1.2, 0.08, 0, Y + 2.7, 23.31, 0.03)
  // the two side modules off the front node
  const fz = 18.4
  for (const sx of [-1, 1]) K.cyl(M.shade, 1.4, 1.4, 1.3, sx * 2.45, Y, fz, 'x', 0.25)
  K.cyl(M.white, 2.2, 2.2, 7.0, 6.5, Y, fz, 'x', 0.85, 40) // +x: x 3.0..10.0
  band(K, M, 2.2, fz, 4.0, 'x')
  band(K, M, 2.2, fz, 9.0, 'x')
  K.cyl(M.shade, 0.9, 0.9, 0.5, 10.15, Y, fz, 'x', 0.15)
  K.cyl(M.white, 2.3, 2.3, 10.4, -8.2, Y, fz, 'x', 0.85, 40) // -x: x -13.4..-3.0
  band(K, M, 2.3, fz, -4.0, 'x')
  band(K, M, 2.3, fz, -12.4, 'x')
  K.cyl(M.white, 1.65, 1.65, 3.6, -9.0, Y + 2.0 + 1.6, fz, 'y', 0.6, 32) // its logistics module, on top
  K.cyl(M.blue, 1.73, 1.73, 0.4, -9.0, Y + 4.4, fz, 'y', 0.14, 32)
  K.cyl(M.shade, 0.95, 0.95, 1.0, -13.8, Y, fz, 'x', 0.2) // and its porch
  K.box(M.shade, 4.6, 0.8, 4.6, -16.5, Y - 0.9, fz, 0.3)
  K.box(M.white, 1.6, 1.1, 1.6, -15.6, Y + 0.05, fz - 1.1, 0.3)
  K.box(M.blue, 1.4, 0.9, 1.4, -17.4, Y - 0.05, fz + 1.0, 0.3)
  collar(K, M, 15.1)
  // the lab
  zmod(K, M.white, 2.3, 4.4, 15.1)
  band(K, M, 2.3, 5.5)
  band(K, M, 2.3, 14.0)
  for (const z of [7.9, 11.4]) K.cyl(M.old, 2.34, 2.34, 0.16, 0, Y, z, 'z', 0.05, 40)
  collar(K, M, 4.4)
  // the central node, a short stub on its -x side and the cupola under its +x flank
  zmod(K, M.white, 2.35, -2.6, 4.4, 0.9)
  band(K, M, 2.35, -1.5)
  band(K, M, 2.35, 3.3)
  K.cyl(M.shade, 1.4, 1.4, 1.2, -2.6, Y, 0.9, 'x', 0.25)
  K.cyl(M.navy, 0.9, 0.9, 0.2, -3.2, Y, 0.9, 'x', 0.05)
  const cd = V(Math.sin(50 * D2R), -Math.cos(50 * D2R), 0)
  K.at(
    new THREE.Matrix4().compose(
      V(0, Y, 0.9).addScaledVector(cd, 2.05),
      new THREE.Quaternion().setFromUnitVectors(V(0, 1, 0), cd),
      V(1, 1, 1)
    ),
    () => {
      K.cyl(M.shade, 1.3, 1.3, 0.9, 0, 0.25, 0, 'y', 0.2)
      K.cyl(M.white, 1.72, 1.72, 0.38, 0, 0.82, 0, 'y', 0.14, 40)
      K.add(M.glass, new THREE.CylinderGeometry(1.08, 1.5, 0.95, 8), mat4(0, 1.45, 0))
      for (let i = 0; i < 8; i++) {
        const a = (i * PI) / 4
        bar(
          K,
          M.white,
          V(1.52 * Math.sin(a), 0.98, 1.52 * Math.cos(a)),
          V(1.1 * Math.sin(a), 1.93, 1.1 * Math.cos(a)),
          0.22,
          0.06
        )
      }
      K.cyl(M.white, 1.2, 1.2, 0.3, 0, 2.0, 0, 'y', 0.12, 40)
      K.cyl(M.glass, 0.8, 0.8, 0.14, 0, 2.16, 0, 'y', 0.05, 32)
    }
  )
  collar(K, M, -2.6, 1.5)
  // the older modules, off-white: the first tapers toward the node
  K.cyl(M.old, 2.1, 1.5, 3.0, 0, Y, -4.1, 'z', 0.5, 40)
  zmod(K, M.old, 2.1, -14.6, -5.6, 0.8)
  band(K, M, 2.1, -6.2)
  band(K, M, 2.1, -13.5)
  collar(K, M, -14.6, 1.35)
  // the second: a ball up front, a slim section, a fat aft section with its own small wings, an aft port
  K.add(
    M.old,
    cached('ball', () => new THREE.SphereGeometry(1.55, 32, 20)),
    mat4(0, Y, -15.8)
  )
  zmod(K, M.old, 1.9, -21.2, -16.6, 0.6)
  K.cyl(M.old, 2.35, 1.9, 1.3, 0, Y, -21.85, 'z', 0.3, 40)
  zmod(K, M.old, 2.35, -28.5, -22.5, 0.6)
  K.cyl(M.old, 1.3, 2.25, 1.0, 0, Y, -29.0, 'z', 0.3, 40)
  K.ring(M.port, 0.5, 0.95, 0.4, 0, Y, -29.7, 'z', 0.1)
  band(K, M, 1.9, -17.4)
  band(K, M, 2.35, -23.0)
  band(K, M, 2.35, -28.0)
  for (const z of [-18.2, -19.6]) K.cyl(M.glass, 0.32, 0.32, 0.3, 1.82, Y + 0.5, z, 'x', 0.08, 20) // little windows
  for (const sx of [-1, 1]) {
    K.cyl(M.blue, 0.42, 0.42, 1.6, sx * 3.0, Y, -25.5, 'x', 0.12)
    K.box(M.white, 0.9, 0.6, 3.6, sx * 4.1, Y, -25.5, 0.22)
    K.box(M.backing, 9.6, 0.1, 3.3, sx * 9.35, Y - 0.05, -25.5, 0.04)
    K.box(M.white, 9.7, 0.32, 0.32, sx * 9.35, Y + 0.06, -25.5, 0.1)
    K.box(M.white, 0.5, 0.45, 3.6, sx * 14.35, Y, -25.5, 0.15)
  }
  return K
}

/** the small wings' cells (static) */
function smallCellMatrices() {
  const out = []
  for (const sx of [-1, 1]) {
    for (let c = 0; c < 5; c++) {
      const x = sx * (4.55 + 0.96 + c * 1.92)
      for (const sz of [-1, 1]) out.push(mat4(x, Y + 0.02, -25.5 + sz * 0.9))
    }
  }
  return out
}

/** the rotating part: the outboard truss both sides and the 8 big wings */
function buildArrays(M) {
  const K = new Kit()
  const cells = []
  for (const sx of [-1, 1]) {
    trussSpan(K, M, sx > 0 ? 22.8 : -42.0, sx > 0 ? 42.0 : -22.8)
    K.box(M.truss, 0.8, 3.6, 3.6, sx * 42.2, 0, 0, 0.4)
    for (const px of PAIRS) {
      const xp = sx * px
      K.box(M.truss, 1.2, 3.75, 3.75, xp, 0, 0, 0.35)
      for (const s of [-1, 1]) {
        K.cyl(M.blue, 0.8, 0.8, 1.6, xp, 0, s * 2.3, 'z', 0.22) // beta gimbal
        K.box(M.white, WING.w, 1.0, 1.35, xp, 0, s * (WING.root + 0.675), 0.35) // blanket box
        const len = WING.cell1 - WING.cell0 + 0.3
        K.box(M.backing, 9.0, 0.1, len, xp, -0.06, (s * (WING.cell0 + WING.cell1)) / 2, 0.04)
        K.box(
          M.white,
          0.5,
          0.42,
          WING.tip - WING.root - 1.0,
          xp,
          0.1,
          (s * (WING.root + WING.tip)) / 2,
          0.15
        ) // mast
        K.box(M.white, WING.w, 0.5, 0.65, xp, 0, s * WING.tip - s * 0.3, 0.2) // tip bar
        // 2 blankets either side of the mast, each 2 cells across and 12 along
        const rows = 12
        const pitch = (WING.cell1 - WING.cell0) / rows
        for (const bx of [-1, 1]) {
          for (let c = 0; c < 2; c++) {
            const x = xp + bx * (0.4 + 0.18 + 0.86 + c * (1.72 + 0.25))
            for (let r = 0; r < rows; r++)
              cells.push(mat4(x, 0.03, s * (WING.cell0 + pitch * (r + 0.5))))
          }
        }
      }
    }
  }
  const pitch = (WING.cell1 - WING.cell0) / 12
  return { K, cells, cellGeo: rbox(1.72, 0.14, pitch - 0.25, 0.05, 1) }
}

/** the two-boom arm: a chain of groups, one per joint, each with its own merged meshes */
function buildArm(M) {
  const yaw = new THREE.Group()
  yaw.position.set(ARM.x, ARM.base, ARM.z)
  new Kit()
    .cyl(M.white, 0.62, 0.62, 0.9, 0, 0.45, 0, 'y', 0.15)
    .cyl(M.blue, 0.74, 0.74, 1.35, 0, ARM.shoulder, 0, 'z', 0.2)
    .build(yaw)
  const pitch = new THREE.Group()
  pitch.position.set(0, ARM.shoulder, 0)
  yaw.add(pitch)
  new Kit()
    .cyl(M.white, 0.42, 0.42, ARM.L1 - 1.3, ARM.L1 / 2, 0, 0, 'x', 0.15, 24)
    .cyl(M.blue, 0.5, 0.5, 0.5, 1.0, 0, 0, 'x', 0.15, 24)
    .cyl(M.blue, 0.66, 0.66, ARM.w + 1.15, ARM.L1, 0, ARM.w / 2, 'z', 0.2)
    .build(pitch)
  const elbow = new THREE.Group()
  elbow.position.set(ARM.L1, 0, ARM.w)
  pitch.add(elbow)
  new Kit()
    .cyl(M.white, 0.4, 0.4, ARM.L2 - 1.2, ARM.L2 / 2, 0, 0, 'x', 0.15, 24)
    .cyl(M.blue, 0.48, 0.48, 0.5, ARM.L2 - 1.0, 0, 0, 'x', 0.15, 24)
    .build(elbow)
  const wrist = new THREE.Group()
  wrist.position.set(ARM.L2, 0, 0)
  elbow.add(wrist)
  new Kit()
    .cyl(M.blue, 0.58, 0.58, 1.1, 0, 0, 0, 'z', 0.2)
    .cyl(M.white, 0.48, 0.48, 1.25, 1.0, 0, 0, 'x', 0.15, 24)
    .cyl(M.navy, 0.36, 0.36, 0.14, 1.65, 0, 0, 'x', 0.05, 24)
    .build(wrist)
  const set = (k) => {
    const s = sstep(k)
    const q = ARM_STOW.map((a, i) => lerp(a, ARM_READY[i], s))
    yaw.rotation.y = q[0]
    pitch.rotation.z = q[1]
    elbow.rotation.z = q[2]
    wrist.rotation.z = q[3]
  }
  return { group: yaw, set, tip: wrist }
}

export function buildToyStation() {
  const M = mats()
  const group = new THREE.Group()
  group.name = 'toy-station'
  buildStationStatic(M).build(group)
  group.add(instanced(rbox(1.7, 0.12, 1.28, 0.04, 1), M.cells, smallCellMatrices()))

  const arrays = new THREE.Group()
  group.add(arrays)
  const A = buildArrays(M)
  A.K.build(arrays)
  arrays.add(instanced(A.cellGeo, M.cells, A.cells))

  const arm = buildArm(M)
  group.add(arm.group)

  const setArrays = (a) => {
    arrays.rotation.x = a
  }
  const setArm = (k) => arm.set(clamp(k, 0, 1))
  setArrays(0)
  setArm(0)
  group.updateMatrixWorld(true)
  const box = new THREE.Box3().setFromObject(group, true)
  const size = box.getSize(V())
  const dims = { span: +size.x.toFixed(2), length: +size.z.toFixed(2), height: +size.y.toFixed(2) }
  return { group, dockPort: { pos: V(0, Y, PORT_Z), dir: V(0, 0, 1) }, setArrays, setArm, dims }
}

// ------------------------------------------------------------------------------------------------ the Earth
// 3D simplex noise (Ashima Arts / Stefan Gustavson, MIT)
const NOISE = /* glsl */ `
vec3 e_mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 e_mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 e_permute(vec4 x) { return e_mod289(((x * 34.0) + 10.0) * x); }
vec4 e_taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
float e_snoise(vec3 v) {
  const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = e_mod289(i);
  vec4 p = e_permute(e_permute(e_permute(i.z + vec4(0.0, i1.z, i2.z, 1.0)) + i.y + vec4(0.0, i1.y, i2.y, 1.0)) + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = e_taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
}
float e_fbm(vec3 p) {
  float s = 0.0, a = 0.5;
  for (int i = 0; i < 5; i++) { s += a * e_snoise(p); p = p * 2.07 + vec3(17.3, -9.1, 4.7); a *= 0.47; }
  return s;
}
`

function earthMaterial() {
  const m = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.82, metalness: 0 })
  const U = {
    uOcean: { value: new THREE.Color(ORBIT.ocean) },
    uShallow: { value: new THREE.Color(ORBIT.shallow) },
    uSand: { value: new THREE.Color(ORBIT.sand) },
    uSage: { value: new THREE.Color(ORBIT.sage) },
  }
  m.onBeforeCompile = (sh) => {
    Object.assign(sh.uniforms, U)
    sh.vertexShader = sh.vertexShader
      .replace('#include <common>', '#include <common>\nvarying vec3 vEarthDir;')
      .replace('#include <begin_vertex>', '#include <begin_vertex>\nvEarthDir = position;')
    sh.fragmentShader = sh.fragmentShader
      .replace(
        '#include <common>',
        `#include <common>\nvarying vec3 vEarthDir;\nuniform vec3 uOcean;\nuniform vec3 uShallow;\nuniform vec3 uSand;\nuniform vec3 uSage;\n${NOISE}`
      )
      .replace(
        '#include <color_fragment>',
        /* glsl */ `#include <color_fragment>
        {
          vec3 d = normalize(vEarthDir);
          // the continents: broad soft blobs with gently wavy coasts (> 0 is land)
          float c = e_fbm(d * 2.3 + vec3(3.1, 7.7, 1.3)) + 0.2 * e_snoise(d * 0.9 + vec3(-2.0, 5.0, 9.0)) - 0.1;
          float aa = fwidth(c) * 1.1 + 1e-5;
          float land = smoothstep(-aa, aa, c);
          float shallow = smoothstep(-0.11, -0.01, c);
          vec3 sea = mix(uOcean, uShallow, shallow * 0.6);
          float v = e_snoise(d * 4.2 + vec3(1.7, -3.3, 2.9)) + 1.4 * c - 0.12;
          float va = fwidth(v) * 1.1 + 1e-5;
          vec3 ground = mix(uSand, uSage, smoothstep(-va, va, v));
          diffuseColor.rgb = mix(sea, ground, land);
        }`
      )
  }
  m.customProgramCacheKey = () => 'toy-earth-1'
  return m
}

/** a soft glow along the limb: brightest where the view ray grazes the surface, fading out into space and in */
function glowMaterial(R) {
  return new THREE.ShaderMaterial({
    uniforms: {
      uColor: { value: new THREE.Color(ORBIT.glow) },
      uR: { value: R },
      uOut: { value: 34 },
      uIn: { value: 70 },
      uGain: { value: 0.95 },
    },
    vertexShader: /* glsl */ `
      varying vec3 vWorld;
      varying vec3 vCentre;
      void main() {
        vec4 w = modelMatrix * vec4(position, 1.0);
        vWorld = w.xyz;
        vCentre = (modelMatrix * vec4(0.0, 0.0, 0.0, 1.0)).xyz;
        gl_Position = projectionMatrix * viewMatrix * w;
      }`,
    fragmentShader: /* glsl */ `
      uniform vec3 uColor;
      uniform float uR, uOut, uIn, uGain;
      varying vec3 vWorld;
      varying vec3 vCentre;
      void main() {
        vec3 dir = normalize(vWorld - cameraPosition);
        vec3 oc = vCentre - cameraPosition;
        float tc = dot(oc, dir);
        float h = length(oc - dir * tc) - uR;
        float g = h > 0.0 ? exp(-h / uOut) : exp(h / uIn);
        gl_FragColor = vec4(uColor * g * uGain, 1.0);
      }`,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    fog: false,
  })
}

/** a seeded random stream, so the clouds land in the same places every build */
function rng(seed) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** one puffy toy cloud, about 2 x 1.25 across and 0.6 tall: flattened domes on a flat base */
function cloudGeometry() {
  return cached('cloud', () => {
    const dome = new THREE.SphereGeometry(1, 12, 3, 0, TAU, 0, PI / 2)
    const parts = [
      [0, 0, 0, 1.0, 0.36, 0.64],
      [-0.34, 0, 0.05, 0.56, 0.62, 0.48],
      [0.32, 0, -0.06, 0.5, 0.5, 0.44],
    ].map(([x, y, z, sx, sy, sz]) => clean(dome).applyMatrix4(mat4(x, y, z, 0, 0, 0, sx, sy, sz)))
    parts.push(
      clean(new THREE.CircleGeometry(1, 12)).applyMatrix4(mat4(0, 0, 0, PI / 2, 0, 0, 1.0, 1, 0.64))
    )
    return mergeGeometries(parts, false)
  })
}

export function buildToyEarth({ radius = 4000 } = {}) {
  const R = radius
  const group = new THREE.Group()
  group.name = 'toy-earth'

  // the surface: poles on the x axis (the spin axis), so the band that passes under the station is the equator
  const spin = new THREE.Group()
  spin.position.y = -R
  group.add(spin)
  const sphere = new THREE.SphereGeometry(R, 200, 100)
  sphere.rotateZ(PI / 2)
  const surface = new THREE.Mesh(sphere, earthMaterial())
  surface.castShadow = surface.receiveShadow = false
  spin.add(surface)

  // the clouds: fields of puffs in the band the camera can see (x from -0.66 R to +0.32 R: rotation about x keeps x)
  const clouds = new THREE.Group()
  clouds.position.y = -R
  group.add(clouds)
  const rnd = rng(20261121)
  const SECT = 12
  const puffs = Array.from({ length: SECT }, () => [])
  const shadows = Array.from({ length: SECT }, () => [])
  const X = V(1, 0, 0)
  const n = V()
  const tx = V()
  const tz = V()
  const basis = new THREE.Matrix4()
  const yawM = new THREE.Matrix4()
  for (let f = 0; f < 330; f++) {
    const cx = lerp(-0.52, 0.22, rnd())
    const th = rnd() * TAU
    const rr = Math.sqrt(1 - cx * cx)
    const centre = V(cx, rr * Math.cos(th), rr * Math.sin(th))
    const count = 1 + Math.floor(rnd() * 6)
    const spread = (50 + rnd() * 170) / R
    const big = 0.7 + rnd() * 0.6
    for (let i = 0; i < count; i++) {
      // a point around the field centre, on the sphere
      tx.copy(X).addScaledVector(centre, -centre.x).normalize()
      tz.crossVectors(tx, centre)
      const a = rnd() * TAU
      const d = spread * Math.sqrt(rnd())
      n.copy(centre)
        .addScaledVector(tx, Math.cos(a) * d)
        .addScaledVector(tz, Math.sin(a) * d)
        .normalize()
      tx.copy(X).addScaledVector(n, -n.x).normalize()
      tz.crossVectors(tx, n)
      const size = (9 + rnd() * 14) * big
      const alt = 9 + rnd() * 7
      const sx = size * (0.9 + rnd() * 0.5)
      const sz = size * (0.8 + rnd() * 0.5)
      const sy = size * (0.75 + rnd() * 0.35)
      basis.makeBasis(tx, n, tz)
      yawM.makeRotationY(rnd() * TAU)
      const rot = basis.clone().multiply(yawM)
      const sector = Math.floor(((Math.atan2(n.z, n.y) + TAU) % TAU) / (TAU / SECT)) % SECT
      puffs[sector].push(
        rot
          .clone()
          .scale(V(sx, sy, sz))
          .setPosition(n.clone().multiplyScalar(R + alt))
      )
      // the shadow: where the sun (from -x -z, high) drops the cloud's middle onto the ground when it passes under the station
      const hm = alt + 0.25 * sy
      const sp = n
        .clone()
        .multiplyScalar(R)
        .addScaledVector(tx, 0.78 * hm)
        .addScaledVector(tz, 0.36 * hm)
        .normalize()
      tx.copy(X).addScaledVector(sp, -sp.x).normalize()
      tz.crossVectors(tx, sp)
      basis.makeBasis(tx, sp, tz)
      shadows[sector].push(
        basis
          .clone()
          .multiply(yawM)
          .scale(V(sx * 0.92, 1, sz * 0.92))
          .setPosition(sp.multiplyScalar(R + 1.4))
      )
    }
  }
  const cloudMat = new THREE.MeshStandardMaterial({ color: ORBIT.cloud, roughness: 0.95 })
  const shadowMat = new THREE.MeshBasicMaterial({
    color: ORBIT.cloudShadow,
    transparent: true,
    opacity: 0.14,
    depthWrite: false,
  })
  const shadowGeo = new THREE.CircleGeometry(1, 20).rotateX(-PI / 2).scale(1, 1, 0.62)
  const cgeo = cloudGeometry()
  let cloudCount = 0
  for (let s = 0; s < SECT; s++) {
    if (!puffs[s].length) continue
    cloudCount += puffs[s].length
    const c = instanced(cgeo, cloudMat, puffs[s])
    c.castShadow = c.receiveShadow = false
    clouds.add(c)
    const sh = instanced(shadowGeo, shadowMat, shadows[s])
    sh.castShadow = sh.receiveShadow = false
    sh.renderOrder = 1
    clouds.add(sh)
  }

  // the glow along the limb
  const glow = new THREE.Mesh(
    new THREE.SphereGeometry(R + 200, 160, 80).rotateZ(PI / 2),
    glowMaterial(R)
  )
  glow.position.y = -R
  glow.renderOrder = 2
  glow.castShadow = glow.receiveShadow = false
  group.add(glow)

  const W = 0.4 * D2R
  group.userData.cloudCount = cloudCount
  return {
    group,
    update(t) {
      spin.rotation.x = -W * t
      clouds.rotation.x = -W * 1.12 * t
    },
  }
}
