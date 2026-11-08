// The flyers: what a robot hot dog teardown leaves in the air, and the notes of the set, caught in the storm. Small
// whole robot dogs, franks on their chrome collars, segments with the machine inside showing, bun halves, pickle
// spears, sport peppers, tomato wedges; the hardware, spur gears slowly turning, hex nuts, bolts, coil springs and hobby
// servos; and every kind of note. Each rides the same attractor curve as the points by the same formula, on the CPU:
// a few hundred instanced meshes, every matrix recomposed per frame, a pure function of t. They also report where
// they are and how fast they are going (bodies), for the fur to feel them pass.
import * as THREE from 'three'
import { sampleAt } from '../../scene/attractors.js'
import { FLOW, swirl } from '../../scene/storm.js'
import { rng } from '../../teardown/kit/util.js'
import { noteGlyphs, noteMaterial, NEON } from './notes.js'
import { selfLit } from './mesher.js'
import { gear, hexNut, bolt, spring, servo, METAL } from './robot.js'

const V3 = THREE.Vector3

// scale a geometry so its longest side is 1
const unit = (g) => {
  const out = g.clone()
  out.computeBoundingBox()
  const s = out.boundingBox.getSize(new V3())
  const c = out.boundingBox.getCenter(new V3())
  out.translate(-c.x, -c.y, -c.z)
  out.scale(1 / Math.max(s.x, s.y, s.z), 1 / Math.max(s.x, s.y, s.z), 1 / Math.max(s.x, s.y, s.z))
  return out
}

/** parts: partGeometries(); food: foodMaterials(); glow: the shared {value} uniform for the notes. */
export function buildFlyers(attractors, parts, food, glow, { seed = 37 } = {}) {
  // food and painted parts (their LEDs light themselves), and bare metal
  const colored = selfLit(
    new THREE.MeshPhysicalMaterial({
      vertexColors: true,
      roughness: 0.48,
      clearcoat: 0.6,
      clearcoatRoughness: 0.3,
    })
  )
  const metal = selfLit(
    new THREE.MeshStandardMaterial({
      vertexColors: true,
      roughness: 0.46,
      metalness: 1,
      envMapIntensity: 0.75,
    })
  )
  const glyphs = noteGlyphs()
  const noteMat = noteMaterial(glow)
  const KINDS = [
    { geo: unit(parts.dog), mat: colored, n: 26, size: [0.9, 1.35] },
    { geo: unit(parts.frank), mat: colored, n: 22, size: [0.8, 1.2] },
    { geo: unit(parts.coin), mat: colored, n: 40, size: [0.22, 0.34], spin: 2 },
    { geo: unit(parts.bun), mat: colored, n: 14, size: [0.8, 1.1] },
    { geo: unit(parts.pickle), mat: colored, n: 16, size: [0.7, 1] },
    { geo: unit(parts.pepper), mat: colored, n: 20, size: [0.32, 0.48], spin: 1 },
    {
      geo: unit(parts.tomato),
      mat: [food.tomatoFace, food.tomatoSkin],
      n: 16,
      size: [0.36, 0.5],
      spin: 1,
    },
    // the hardware: gears turn on their own axles as they fly
    { geo: unit(gear()), mat: metal, n: 22, size: [0.5, 0.8], spin: 0.7 },
    {
      geo: unit(gear({ teeth: 20, windows: 6, color: METAL.steel })),
      mat: metal,
      n: 12,
      size: [0.8, 1.1],
      spin: 0.5,
    },
    { geo: unit(hexNut()), mat: metal, n: 26, size: [0.2, 0.32], spin: 1 },
    { geo: unit(bolt()), mat: metal, n: 22, size: [0.36, 0.56] },
    { geo: unit(spring()), mat: metal, n: 14, size: [0.38, 0.55] },
    { geo: unit(servo()), mat: colored, n: 14, size: [0.42, 0.6] },
    { geo: unit(glyphs.quarter.geo), mat: noteMat, n: 40, size: [0.6, 1], note: true },
    { geo: unit(glyphs.eighth.geo), mat: noteMat, n: 40, size: [0.6, 1], note: true },
    { geo: unit(glyphs.pair.geo), mat: noteMat, n: 30, size: [0.8, 1.2], note: true },
    { geo: unit(glyphs.sixteenths.geo), mat: noteMat, n: 18, size: [0.8, 1.2], note: true },
    { geo: unit(glyphs.half.geo), mat: noteMat, n: 18, size: [0.6, 1], note: true },
    { geo: unit(glyphs.whole.geo), mat: noteMat, n: 12, size: [0.3, 0.45], note: true, spin: 1 },
    { geo: unit(glyphs.sharp.geo), mat: noteMat, n: 16, size: [0.45, 0.7], note: true },
    { geo: unit(glyphs.clef.geo), mat: noteMat, n: 12, size: [1.1, 1.5], note: true },
  ]
  const r = rng(seed)
  const group = new THREE.Group()
  const items = []
  for (const kind of KINDS) {
    const mesh = new THREE.InstancedMesh(kind.geo, kind.mat, kind.n)
    mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage)
    mesh.frustumCulled = false
    group.add(mesh)
    kind.mesh = mesh
    for (let i = 0; i < kind.n; i++) {
      if (kind.note)
        mesh.setColorAt(i, new THREE.Color(NEON[Math.floor(r() * NEON.length)]).multiplyScalar(1.1))
      const axis = new V3(r() * 2 - 1, r() * 2 - 1, r() * 2 - 1).normalize()
      const q0 = new THREE.Quaternion().setFromEuler(
        new THREE.Euler(r() * 6.28, r() * 6.28, r() * 6.28)
      )
      items.push({
        mesh,
        i,
        u0: r(),
        rate: FLOW.rate * (1 + (r() * 2 - 1) * 0.22),
        delay: r(),
        // beside the filaments, not on them, so the light stays readable through the parts
        jit: (() => {
          const d = [r() * 2 - 1, r() * 2 - 1, r() * 2 - 1]
          const k = (0.6 + 2.4 * Math.pow(r(), 0.7)) / (Math.hypot(...d) || 1)
          return d.map((x) => x * k)
        })(),
        size: kind.size[0] + (kind.size[1] - kind.size[0]) * r(),
        axis,
        q0,
        // notes tumble slower than food: they should stay readable
        tumble: (kind.note ? 0.15 + r() * 0.35 : 0.25 + r() * 0.9) * (r() < 0.5 ? -1 : 1),
        spin: kind.spin ? (1 + r() * 2) * kind.spin * (r() < 0.5 ? -1 : 1) : 0,
        note: !!kind.note,
        // a note pops on the beat by its own share of the bar
        beatShare: Math.floor(r() * 4),
      })
    }
  }

  // where each one is, its velocity and its size: x y z, vx vy vz, radius (0 while it is not drawn)
  const bodies = new Float32Array(items.length * 7)
  let lastT = null

  const pa = [0, 0, 0]
  const pb = [0, 0, 0]
  const sw = [0, 0, 0]
  const pos = new V3()
  const q = new THREE.Quaternion()
  const qs = new THREE.Quaternion()
  const Z = new V3(0, 0, 1)
  const sc = new V3()
  const M4 = new THREE.Matrix4()

  /**
   * t: seconds; a, b: attractor indices; morph 0..1; chaos: turbulence; scale: overall size; density: share drawn;
   * beat: {n: whole beats so far, kick: 0..1}; eye: the camera's position
   */
  const update = (
    t,
    a,
    b,
    morph,
    chaos,
    scale = 1,
    density = 1,
    beat = { n: 0, kick: 0 },
    eye = null
  ) => {
    const A = attractors[a]
    const B = attractors[b]
    const beatInBar = ((beat.n % 4) + 4) % 4
    const dt = lastT === null ? 0 : t - lastT
    const moving = dt > 1e-4 && dt < 0.2
    lastT = t
    for (let n = 0; n < items.length; n++) {
      const it = items[n]
      const x = it.u0 + it.rate * t
      const u = x - Math.floor(x)
      let m = Math.min(1, Math.max(0, (morph - it.delay * 0.45) / 0.55))
      m = m * m * (3 - 2 * m)
      const fly = Math.sin(Math.PI * m)
      sampleAt(A, u, pa)
      sampleAt(B, u, pb)
      for (let k = 0; k < 3; k++) pa[k] = pa[k] + (pb[k] - pa[k]) * m + it.jit[k] * (1 + 2 * fly)
      swirl([pa[0] * 0.45, pa[1] * 0.45, pa[2] * 0.45], t, sw)
      const kSw = fly * chaos + 0.035
      pos.set(pa[0] + sw[0] * kSw, pa[1] + sw[1] * kSw, pa[2] + sw[2] * kSw)
      const seam = Math.min(1, u / 0.004, (1 - u) / 0.004)
      const keep = (it.i + 0.5) / it.mesh.count <= density ? 1 : 0
      const pop = it.note && it.beatShare === beatInBar ? 1 + 0.28 * beat.kick : 1
      // nothing fills the lens: a part shrinks away as the camera reaches it
      let near = 1
      if (eye) {
        const d = pos.distanceTo(eye)
        near = Math.min(1, Math.max(0, (d - 1.2) / 3.3))
        near = near * near * (3 - 2 * near)
      }
      const s = it.size * scale * seam * keep * pop * near
      q.setFromAxisAngle(it.axis, it.tumble * t).multiply(it.q0)
      if (it.spin) q.multiply(qs.setFromAxisAngle(Z, it.spin * t))
      sc.set(s, s, s)
      M4.compose(pos, q, sc)
      it.mesh.setMatrixAt(it.i, M4)
      const o = n * 7
      for (let k = 0; k < 3; k++) {
        bodies[o + 3 + k] = moving ? (pos.getComponent(k) - bodies[o + k]) / dt : 0
        bodies[o + k] = pos.getComponent(k)
      }
      bodies[o + 6] = s * 0.5
    }
    for (const k of KINDS) k.mesh.instanceMatrix.needsUpdate = true
  }
  return { group, update, bodies }
}
