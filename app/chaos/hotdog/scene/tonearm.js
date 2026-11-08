// The tonearm is a robot: a mustard-yellow industrial arm standing at the edge of the record, playing it. Like a real
// tonearm it keeps one length and sweeps: its turret turns so the stylus, starting in the outer groove at the top of
// the loop, works its way in across the record over sixty bars; then the arm lifts, swings back out and drops onto
// the outer groove again as the loop comes round, every move from rest to rest. It keeps time while it plays: the
// head nods on every kick, LEDs glow on its head and arms, a ring of light round its base breathes on the bar. Its
// joints are solved each frame (two links, elbow up) so the head always points straight down at the groove; a
// hydraulic ram lifts the upper arm.
import * as THREE from 'three'
import { METAL } from './robot.js'

export const TONEARM = {
  az: 4.35, // where it stands round the record, opposite the opening shot
  radius: 64,
  shoulder: 8, // the shoulder's height above the record
  upper: 28,
  fore: 25,
  head: 5.2, // wrist to the stylus's tip
  reach: 50, // the turret's axis to the stylus: fixed, as a tonearm's length is
  outer: 46, // the groove radii it plays between (the stave rings the room inside them)
  inner: 29,
}

const smoother = (x) => {
  const k = Math.min(1, Math.max(0, x))
  return k * k * k * (k * (k * 6 - 15) + 10)
}

/** ground: the record's height. */
export function buildTonearm(ground) {
  const A = TONEARM
  const paint = new THREE.MeshStandardMaterial({
    color: '#f0b21c',
    roughness: 0.36,
    metalness: 0.2,
    envMapIntensity: 0.8,
  })
  const joint = new THREE.MeshStandardMaterial({
    color: '#1b1c22',
    roughness: 0.35,
    metalness: 0.7,
    envMapIntensity: 0.7,
  })
  const chrome = new THREE.MeshStandardMaterial({
    color: '#e6eaf0',
    roughness: 0.15,
    metalness: 1,
    envMapIntensity: 1.1,
  })
  const ledMat = new THREE.MeshBasicMaterial({ color: '#ff2a1a' })
  const ringMat = new THREE.MeshBasicMaterial({ color: '#ffd21f' })
  const stripMat = new THREE.MeshBasicMaterial({ color: '#2ee6ff' })
  const mesh = (g, m) => new THREE.Mesh(g, m)
  const cyl = (r0, r1, h, seg = 28) => new THREE.CylinderGeometry(r0, r1, h, seg)
  // a link along +x from 0 to len, with rounded ends, a dark cover plate on each side carrying a strip of LEDs, and
  // a cable along its top
  const link = (len, h, d, m) => {
    const g = new THREE.Group()
    const b = mesh(new THREE.BoxGeometry(len, h, d), m)
    b.position.x = len / 2
    g.add(b)
    for (const x of [0, len]) {
      const c = mesh(cyl(h / 2, h / 2, d, 28), m)
      c.rotation.x = Math.PI / 2
      c.position.x = x
      g.add(c)
    }
    for (const s of [-1, 1]) {
      const plate = mesh(new THREE.BoxGeometry(len * 0.72, h * 0.56, 0.24), joint)
      plate.position.set(len / 2, 0, s * (d / 2 + 0.06))
      g.add(plate)
      const strip = mesh(new THREE.BoxGeometry(len * 0.6, 0.36, 0.24), stripMat)
      strip.position.set(len / 2, -h * 0.12, s * (d / 2 + 0.16))
      g.add(strip)
    }
    const cable = mesh(cyl(0.26, 0.26, len * 0.7, 10), joint)
    cable.rotation.z = Math.PI / 2
    cable.position.set(len / 2, h / 2 + 0.16, 0)
    g.add(cable)
    return g
  }
  const pin = (r, len) => {
    const c = mesh(cyl(r, r, len), joint)
    c.rotation.x = Math.PI / 2
    return c
  }

  const group = new THREE.Group()
  group.position.set(A.radius * Math.cos(A.az), ground, A.radius * Math.sin(A.az))
  // its own +x points at the record's middle
  group.rotation.y = Math.PI - A.az
  group.updateMatrixWorld(true)

  // base and its ring of light, the turret that yaws
  const base = mesh(cyl(5.2, 5.8, 2.2, 40), joint)
  base.position.y = 1.1
  group.add(base)
  const ring = mesh(new THREE.TorusGeometry(5.5, 0.22, 8, 64), ringMat)
  ring.rotation.x = Math.PI / 2
  ring.position.y = 2.25
  group.add(ring)
  const turret = new THREE.Group()
  turret.position.y = 2.2
  group.add(turret)
  const tower = mesh(cyl(3.4, 3.9, A.shoulder - 2.2, 32), paint)
  tower.position.y = (A.shoulder - 2.2) / 2
  turret.add(tower)

  // the shoulder, the upper arm, the elbow, the forearm, the wrist, the head
  const shoulder = new THREE.Group()
  shoulder.position.y = A.shoulder - 2.2
  turret.add(shoulder)
  shoulder.add(pin(2.7, 6.6))
  shoulder.add(link(A.upper, 3.2, 3.6, paint))
  const elbow = new THREE.Group()
  elbow.position.x = A.upper
  shoulder.add(elbow)
  elbow.add(pin(2.1, 5.2))
  elbow.add(link(A.fore, 2.4, 2.6, paint))
  const wrist = new THREE.Group()
  wrist.position.x = A.fore
  elbow.add(wrist)
  wrist.add(pin(1.5, 3.6))
  // the head hangs along the wrist's +x: a cartridge, an LED, a cantilever and the stylus
  const cart = mesh(new THREE.BoxGeometry(3.2, 1.9, 2.2), joint)
  cart.position.x = 2.2
  wrist.add(cart)
  const stripe = mesh(new THREE.BoxGeometry(3.5, 0.4, 2.5), paint)
  stripe.position.set(2.2, 0.35, 0)
  wrist.add(stripe)
  const led = mesh(new THREE.SphereGeometry(0.32, 12, 8), ledMat)
  led.position.set(2.6, -0.2, 1.12)
  wrist.add(led)
  const cant = mesh(cyl(0.12, 0.08, 1.6, 8), chrome)
  cant.rotation.z = -Math.PI / 2
  cant.position.x = 4.4
  wrist.add(cant)
  const tip = mesh(new THREE.ConeGeometry(0.16, 0.6, 8), chrome)
  tip.rotation.z = -Math.PI / 2
  tip.position.x = A.head - 0.3
  wrist.add(tip)

  // the hydraulic ram: its barrel pinned to the turret, its rod to the upper arm
  const barrel = mesh(cyl(0.75, 0.75, 9, 16), joint)
  const rod = mesh(cyl(0.4, 0.4, 9, 12), chrome)
  turret.add(barrel, rod)
  const ramA = new THREE.Vector3(4.2, 1.2, 0)
  const ramB = new THREE.Vector3(9, -2.2, 0)
  // bolts round the base
  const steel = new THREE.MeshStandardMaterial({ color: METAL.steel, metalness: 1, roughness: 0.3 })
  const bolts = new THREE.InstancedMesh(cyl(0.35, 0.35, 0.4, 6), steel, 12)
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2
    bolts.setMatrixAt(
      i,
      new THREE.Matrix4().makeTranslation(4.6 * Math.cos(a), 2.3, 4.6 * Math.sin(a))
    )
  }
  group.add(bolts)

  const pa = new THREE.Vector3()
  const pb = new THREE.Vector3()
  const dir = new THREE.Vector3()
  const Y = new THREE.Vector3(0, 1, 0)
  const Z = new THREE.Vector3(0, 0, 1)

  // where the stylus is over the loop: the groove's radius and the height above it
  const course = (bars) => {
    if (bars < 60) return { r: A.outer - (A.outer - A.inner) * smoother(bars / 60), lift: 0 }
    return {
      r: A.inner + (A.outer - A.inner) * smoother((bars - 61) / 2),
      lift: 9 * smoother(bars - 60) * (1 - smoother(bars - 63)),
    }
  }
  // the turret's turn that puts a stylus `reach` away on the groove of radius r (the law of cosines)
  const yawFor = (r) => Math.acos((A.radius ** 2 + A.reach ** 2 - r * r) / (2 * A.radius * A.reach))

  /** bars: into the loop; beats: the beat clock; kick: 0..1 */
  const update = (bars, beats, kick) => {
    const c = course(bars)
    // the head nods on the kick: it lifts off the groove a hair and tips forward
    const nod = kick * 0.14
    turret.rotation.y = yawFor(c.r)
    // two links from the shoulder to the wrist, the head straight down from the wrist to the groove
    const sy = A.shoulder
    const wy = A.head + 0.05 + c.lift + kick * 0.35
    const dx = A.reach
    const dy = wy - sy
    const d = Math.min(A.upper + A.fore - 0.01, Math.hypot(dx, dy))
    const a1 =
      Math.atan2(dy, dx) +
      Math.acos(Math.min(1, (A.upper ** 2 + d * d - A.fore ** 2) / (2 * A.upper * d)))
    const e = -(
      Math.PI -
      Math.acos(Math.min(1, (A.upper ** 2 + A.fore ** 2 - d * d) / (2 * A.upper * A.fore)))
    )
    shoulder.rotation.z = a1
    elbow.rotation.z = e
    wrist.rotation.z = -Math.PI / 2 - a1 - e + nod
    // the ram, from its pin on the turret to its pin on the upper arm
    pb.copy(ramB).applyAxisAngle(Z, a1).add(shoulder.position)
    pa.copy(ramA)
    dir.subVectors(pb, pa)
    dir.normalize()
    barrel.quaternion.setFromUnitVectors(Y, dir)
    barrel.position.copy(pa).addScaledVector(dir, 4.5)
    rod.quaternion.copy(barrel.quaternion)
    rod.position.copy(pb).addScaledVector(dir, -4.5)
    ledMat.color.setRGB(1, 0.1, 0.05).multiplyScalar(1 + 0.5 * kick)
    stripMat.color.setRGB(0.18, 0.9, 1).multiplyScalar(0.9 + 0.2 * kick)
    const bar = (((beats / 4) % 1) + 1) % 1
    ringMat.color
      .setRGB(1, 0.72, 0.1)
      .multiplyScalar(0.6 + 1.6 * Math.pow(0.5 + 0.5 * Math.cos(2 * Math.PI * bar), 6))
  }
  update(0, 0, 0)
  return { group, update }
}
