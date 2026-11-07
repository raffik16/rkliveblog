// Robot hardware: what the animatronic hot dogs are built on, and what they shed into the storm. Spur gears, hex nuts,
// bolts, coil springs and hobby servos for the flying parts; the chrome collars between the frank's segments; the
// chassis inside the bun (a spine rail, two servos with their horns, a circuit board and the cables between them); a
// drone frame for the dogs that fly over the city, and the blur of a turning rotor. Painted in vertex colours, LEDs
// included (ledCol), so each one is one draw call.
import * as THREE from 'three'
import { Mesher, col, ledCol } from './mesher.js'

export const METAL = {
  steel: col('#9aa1ad'),
  chrome: col('#d8dde6'),
  brass: col('#c99a3a'),
  dark: col('#1c1d23'),
  servo: col('#1d3c8c'), // anodised blue
  horn: col('#ecebe6'),
  pcb: col('#0e5a2c'),
  chip: col('#101114'),
}
export const LED_RED = ledCol('#ff2a1a', 2.6)
export const LED_GREEN = ledCol('#2aff6a', 2.2)
export const LED_CYAN = ledCol('#2ee6ff', 2)

const V3 = THREE.Vector3
const place = (g, p, q = new THREE.Quaternion(), s = new V3(1, 1, 1)) =>
  g.applyMatrix4(new THREE.Matrix4().compose(p, q, s))
const box = (w, h, d, p, q) => place(new THREE.BoxGeometry(w, h, d), p, q)

/** A spur gear, face on to z, its outer radius 1: teeth, a bore and lightening windows between spokes. */
export function gear({ teeth = 12, depth = 0.22, windows = 5, color = METAL.brass } = {}) {
  const sh = new THREE.Shape()
  const root = 0.84
  const w = (Math.PI * 2) / teeth
  for (let i = 0; i < teeth; i++) {
    const a = i * w
    const pts = [
      [root, a],
      [root, a + w * 0.18],
      [1, a + w * 0.32],
      [1, a + w * 0.58],
      [root, a + w * 0.72],
    ]
    pts.forEach(([r, b], k) => {
      if (i === 0 && k === 0) sh.moveTo(r * Math.cos(b), r * Math.sin(b))
      else sh.lineTo(r * Math.cos(b), r * Math.sin(b))
    })
  }
  sh.closePath()
  const bore = new THREE.Path()
  bore.absarc(0, 0, 0.18, 0, Math.PI * 2, true)
  sh.holes.push(bore)
  for (let k = 0; k < windows; k++) {
    const a0 = (k / windows) * Math.PI * 2 + 0.2
    const a1 = ((k + 1) / windows) * Math.PI * 2 - 0.2
    const p = new THREE.Path()
    p.absarc(0, 0, 0.66, a0, a1, false)
    p.absarc(0, 0, 0.34, a1, a0, true)
    p.closePath()
    sh.holes.push(p)
  }
  const g = new THREE.ExtrudeGeometry(sh, {
    depth,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.025,
    bevelSegments: 1,
    curveSegments: 6,
  })
  g.translate(0, 0, -depth / 2)
  return new Mesher().add(g, color).build()
}

/** A hex nut, face on to z, 1 across its corners. */
export function hexNut({ color = METAL.steel } = {}) {
  const sh = new THREE.Shape()
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2 + Math.PI / 6
    if (i === 0) sh.moveTo(Math.cos(a), Math.sin(a))
    else sh.lineTo(Math.cos(a), Math.sin(a))
  }
  sh.closePath()
  const hole = new THREE.Path()
  hole.absarc(0, 0, 0.5, 0, Math.PI * 2, true)
  sh.holes.push(hole)
  const g = new THREE.ExtrudeGeometry(sh, {
    depth: 0.6,
    bevelEnabled: true,
    bevelThickness: 0.08,
    bevelSize: 0.07,
    bevelSegments: 1,
    curveSegments: 12,
  })
  g.translate(0, 0, -0.3)
  return new Mesher().add(g, color).build()
}

/** A hex-head bolt along y, its threads cut as a zigzag on the shank. */
export function bolt({ color = METAL.steel } = {}) {
  const m = new Mesher()
  m.add(place(new THREE.CylinderGeometry(1, 1, 0.62, 6), new V3(0, 0.31, 0)), color)
  const pts = [new THREE.Vector2(0, 0), new THREE.Vector2(0.5, 0)]
  const N = 22
  for (let k = 1; k <= N; k++) pts.push(new THREE.Vector2(k % 2 ? 0.42 : 0.52, -k * 0.11))
  pts.push(new THREE.Vector2(0.3, -N * 0.11 - 0.12), new THREE.Vector2(0, -N * 0.11 - 0.12))
  m.add(new THREE.LatheGeometry(pts, 14), color)
  return m.build()
}

/** A coil spring along y, five and a half turns. */
export function spring({ color = METAL.steel, turns = 5.5 } = {}) {
  class Helix extends THREE.Curve {
    getPoint(t, out = new V3()) {
      const a = t * turns * Math.PI * 2
      return out.set(Math.cos(a), (t - 0.5) * turns * 0.38, Math.sin(a))
    }
  }
  const g = new THREE.TubeGeometry(new Helix(), 160, 0.11, 6, false)
  return new Mesher().add(g, color).build()
}

/** A hobby servo, 1 long: the case, its mounting tabs, the output shaft and a four-arm horn on top, a status LED. */
export function servo({ body = METAL.servo, led = LED_RED } = {}) {
  const m = new Mesher()
  m.add(box(1, 0.95, 0.5, new V3(0, 0, 0)), body)
  m.add(box(1.36, 0.06, 0.5, new V3(0, 0.22, 0)), body)
  m.add(place(new THREE.CylinderGeometry(0.15, 0.17, 0.1, 14), new V3(0.25, 0.52, 0)), METAL.brass)
  m.add(place(new THREE.CylinderGeometry(0.17, 0.17, 0.05, 16), new V3(0.25, 0.6, 0)), METAL.horn)
  m.add(box(0.95, 0.05, 0.12, new V3(0.25, 0.6, 0)), METAL.horn)
  m.add(box(0.12, 0.05, 0.62, new V3(0.25, 0.6, 0)), METAL.horn)
  m.add(place(new THREE.OctahedronGeometry(0.06, 0), new V3(-0.36, 0.3, 0.26)), led)
  return m.build()
}

/**
 * Chrome collars round the frank where its segments meet: a band `bw` wide either side of each joint, on the end of
 * the segment that owns it. hl: half a segment's length; r: the frank's radius; ends: [left, right] which ends get one.
 */
export function collars(hl, r, bw, ends = [true, true], radial = 36) {
  const m = new Mesher()
  const prof = [
    [0, 0.97],
    [0.25, 1.05],
    [0.75, 1.05],
    [1, 0.97],
  ]
  ends.forEach((on, k) => {
    if (!on) return
    const x0 = k === 0 ? -hl : hl - bw
    m.grid(
      prof.length - 1,
      radial,
      (u, v) => {
        const [s, rk] = prof[Math.round(u * (prof.length - 1))]
        const th = v * Math.PI * 2
        return { p: [x0 + bw * s, r * rk * Math.cos(th), r * rk * Math.sin(th)], c: METAL.chrome }
      },
      { inside: [x0 + bw / 2, 0, 0], wrapV: true }
    )
  })
  return m.build()
}

/**
 * The chassis inside the bun, in the dog's own frame (metres, the frank's middle at the origin): a spine rail under
 * the frank, a servo at each end, a circuit board on the rail with its chips and LEDs, and cables from the board to
 * the servos. Hidden by the bun while the dog is whole; it shows when the bun comes off.
 */
export function chassis() {
  const m = new Mesher()
  m.add(box(0.124, 0.0055, 0.0062, new V3(0, -0.0195, 0)), METAL.steel)
  for (const sx of [-1, 1]) {
    const s = servo()
    s.scale(0.016, 0.016, 0.016)
    if (sx < 0) s.rotateY(Math.PI)
    s.translate(sx * 0.05, -0.0235, 0)
    m.append(s)
  }
  m.add(box(0.06, 0.0012, 0.009, new V3(0, -0.0162, 0)), METAL.pcb)
  m.add(box(0.011, 0.0016, 0.0062, new V3(-0.012, -0.0149, 0)), METAL.chip)
  m.add(box(0.007, 0.0014, 0.0048, new V3(0.007, -0.015, 0)), METAL.chip)
  for (const [x, c] of [
    [0.02, LED_GREEN],
    [0.0235, LED_RED],
    [0.027, LED_CYAN],
  ])
    m.add(box(0.0016, 0.0012, 0.0016, new V3(x, -0.0151, 0.0025)), c)
  const wire = [col('#c8201a'), col('#14141a'), col('#e8b81c')]
  for (const sx of [-1, 1])
    wire.forEach((c, k) => {
      const z = (k - 1) * 0.0016
      const pts = [
        new V3(sx * 0.028, -0.0156, z),
        new V3(sx * 0.034, -0.011 + k * 0.0012, z),
        new V3(sx * 0.041, -0.0105 + k * 0.0012, z * 1.5),
        new V3(sx * 0.046, -0.0145, z),
      ]
      m.add(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 16, 0.0007, 5, false), c)
    })
  return m.build()
}

// The drone frame under a flying dog (dog's frame, metres; +x is forward): a centre plate, four arms, four motors,
// green LEDs forward and red aft. MOTORS are the rotor hubs.
export const MOTORS = [
  [0.068, -0.047, 0.052],
  [0.068, -0.047, -0.052],
  [-0.068, -0.047, 0.052],
  [-0.068, -0.047, -0.052],
]
export const ROTOR_R = 0.036
export function droneFrame() {
  const m = new Mesher()
  m.add(box(0.05, 0.005, 0.036, new V3(0, -0.044, 0)), METAL.dark)
  m.add(box(0.03, 0.006, 0.02, new V3(-0.008, -0.04, 0)), METAL.servo)
  for (const [x, y, z] of MOTORS) {
    const len = Math.hypot(x, z)
    const q = new THREE.Quaternion().setFromAxisAngle(new V3(0, 1, 0), -Math.atan2(z, x))
    m.add(box(len, 0.004, 0.0065, new V3(x / 2, -0.05, z / 2), q), METAL.dark)
    m.add(
      place(new THREE.CylinderGeometry(0.0075, 0.0075, 0.01, 12), new V3(x, -0.0535, z)),
      METAL.dark
    )
    m.add(
      place(new THREE.CylinderGeometry(0.007, 0.0075, 0.004, 12), new V3(x, -0.0495, z)),
      METAL.chrome
    )
    m.add(
      place(new THREE.OctahedronGeometry(0.0024, 0), new V3(x * 1.08, -0.058, z * 1.08)),
      x > 0 ? LED_GREEN : LED_RED
    )
  }
  return m.build()
}

/** A turning rotor as the eye sees it: a faint disc with two blurred blades. Drawn once. */
let rotorTex = null
export function rotorTexture() {
  if (rotorTex) return rotorTex
  const S = 256
  const cv = document.createElement('canvas')
  cv.width = cv.height = S
  const g = cv.getContext('2d')
  const c = S / 2
  g.fillStyle = 'rgba(220,226,236,0.07)'
  g.beginPath()
  g.arc(c, c, c * 0.97, 0, Math.PI * 2)
  g.fill()
  g.lineCap = 'round'
  for (let b = 0; b < 2; b++)
    for (let i = 0; i < 48; i++) {
      const a = b * Math.PI - i * 0.026
      g.strokeStyle = `rgba(230,236,244,${0.32 * Math.pow(1 - i / 48, 2.2)})`
      g.lineWidth = S * 0.045
      g.beginPath()
      g.moveTo(c + Math.cos(a) * c * 0.16, c + Math.sin(a) * c * 0.16)
      g.lineTo(c + Math.cos(a) * c * 0.93, c + Math.sin(a) * c * 0.93)
      g.stroke()
    }
  g.strokeStyle = 'rgba(255,255,255,0.18)'
  g.lineWidth = 2
  g.beginPath()
  g.arc(c, c, c * 0.95, 0, Math.PI * 2)
  g.stroke()
  g.fillStyle = 'rgba(30,30,36,0.9)'
  g.beginPath()
  g.arc(c, c, c * 0.12, 0, Math.PI * 2)
  g.fill()
  rotorTex = new THREE.CanvasTexture(cv)
  rotorTex.colorSpace = THREE.SRGBColorSpace
  return rotorTex
}
