// The skate plaza: three terraces in a line, the work stations of the run. Toy metres, y up, the run goes
// toward +x along z = 0, the camera looks from the +z side.
//
//   S1  the fountain gap: a 1.7 m water channel across the upper terrace (y 2.4)
//   S2  the four-stair: 4 risers of 0.2 m from the upper terrace down to the middle one (y 1.6)
//   S3  the ten-stair rail: 10 risers of 0.16 m down to the lower plaza (y 0), a handrail at z = -0.75 whose top
//       runs 0.72 m over the nosings, 26.6 degrees down
//
//   buildPlaza()      -> {group, setTime(tau), spots, marks}
//
// The heights the motion rides on (surfaceAt, railTop) are in layout.js, shared with the motion and the sweep.
import * as THREE from 'three'
import { TOY, toyMat, rbox, mesh, labelTexture } from './simulator/airport-shared/style.js'
import {
  buildToyTrees,
  buildToyFence,
  buildToyCityBlock,
} from './simulator/airport-shared/airside.js'
import { PLAZA, RAIL_SLOPE, railTop, surfaceAt } from './layout.js'

export { PLAZA }
const railTopAny = (x) => 2.32 - 0.5 * (x - PLAZA.ten.x0)

function stairs(g, { x0, n, rise, tread }, top, M) {
  // step i stands from the floor below the run to its tread; a light-blue nosing strip on every edge
  const W = PLAZA.zMax - PLAZA.zMin
  // tread i runs from riser i - 1 to riser i; its nosing is the edge at riser i
  for (let i = 1; i < n; i++) {
    const y = top - rise * i
    const x = x0 + tread * (i - 0.5)
    g.add(mesh(rbox(tread + 0.004, y, W, 0.035), M.step, x, y / 2, 0))
    g.add(mesh(rbox(0.07, 0.025, W - 0.1, 0.01), M.nosing, x0 + tread * i - 0.035, y - 0.008, 0))
  }
  g.add(mesh(rbox(0.07, 0.025, W - 0.1, 0.01), M.nosing, x0 - 0.035, top - 0.008, 0))
}

function bench(len = 2.2) {
  const g = new THREE.Group()
  const M = {
    seat: toyMat(TOY.white, { paint: true, rough: 0.5 }),
    leg: toyMat(TOY.blue, { paint: true }),
  }
  g.add(mesh(rbox(len, 0.1, 0.5, 0.04), M.seat, 0, 0.45, 0))
  for (const s of [-1, 1])
    g.add(mesh(rbox(0.12, 0.42, 0.42, 0.03), M.leg, s * (len / 2 - 0.25), 0.21, 0))
  return g
}

function plate(text, w = 0.95) {
  const g = new THREE.Group()
  g.add(mesh(rbox(w, 0.02, w * 0.62, 0.008), toyMat(TOY.blue, { paint: true }), 0, 0.01, 0))
  const label = new THREE.Mesh(
    new THREE.PlaneGeometry(w * 0.86, w * 0.43).rotateX(-Math.PI / 2),
    new THREE.MeshStandardMaterial({
      map: labelTexture(text, {
        color: TOY.white,
        w: 512,
        h: 256,
        font: 'italic 800 190px Inter, system-ui, sans-serif',
      }),
      transparent: true,
      roughness: 0.6,
    })
  )
  label.position.y = 0.022
  g.add(label)
  return g
}

export function buildPlaza() {
  const P = PLAZA
  const g = new THREE.Group()
  g.name = 'plaza'
  const M = {
    ground: toyMat(TOY.ground, { rough: 0.95 }),
    paving: toyMat(TOY.road, { rough: 0.9 }),
    top: toyMat('#eef1fb', { rough: 0.85 }),
    side: toyMat(TOY.white, { rough: 0.7 }),
    step: toyMat(TOY.white, { rough: 0.75 }),
    nosing: toyMat(TOY.blueLight, { rough: 0.6 }),
    coping: toyMat(TOY.blue, { paint: true, rough: 0.45 }),
    channel: toyMat(TOY.groundDeep, { rough: 0.8 }),
    rail: toyMat(TOY.blueDeep, { paint: true, rough: 0.32, metal: 0.25 }),
    pad: toyMat(TOY.white, { rough: 0.7 }),
    planter: toyMat(TOY.panel, { rough: 0.7 }),
  }
  const W = P.zMax - P.zMin

  // the ground all round, and the plaza's paving under the terraces and the lower plaza
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(260, 200).rotateX(-Math.PI / 2), M.ground)
  ground.position.set(-5, 0, -30)
  ground.receiveShadow = true
  g.add(ground)
  const paving = new THREE.Mesh(new THREE.PlaneGeometry(108, 30).rotateX(-Math.PI / 2), M.paving)
  paving.position.set(-4, 0.004, -2)
  paving.receiveShadow = true
  g.add(paving)

  // a terrace: a white block with a paler top and a blue coping along its long edges
  const block = (x0, x1, h, { copeEnd = false } = {}) => {
    const w = x1 - x0
    const cx = (x0 + x1) / 2
    g.add(mesh(rbox(w, h - 0.03, W, 0.05), M.side, cx, (h - 0.03) / 2, 0))
    g.add(mesh(rbox(w, 0.04, W - 0.04, 0.015), M.top, cx, h - 0.02, 0))
    for (const z of [P.zMin + 0.08, P.zMax - 0.08])
      g.add(mesh(rbox(w, 0.1, 0.16, 0.04), M.coping, cx, h - 0.03, z))
    if (copeEnd) g.add(mesh(rbox(0.16, 0.1, W, 0.04), M.coping, x0 + 0.08, h - 0.03, 0))
  }
  // the upper terrace, cut by the fountain channel
  block(P.upper.x0, P.gap.x0, P.upper.y, { copeEnd: true })
  block(P.gap.x1, P.four.x0, P.upper.y)
  // the channel: a floor 0.5 m down, the water 0.32 m down, a jet every 1.1 m
  g.add(
    mesh(
      rbox(P.gap.x1 - P.gap.x0 + 0.02, P.gap.floor, W, 0.04),
      M.channel,
      (P.gap.x0 + P.gap.x1) / 2,
      P.gap.floor / 2,
      0
    )
  )
  const water = new THREE.Mesh(
    new THREE.BoxGeometry(P.gap.x1 - P.gap.x0, 0.04, W - 0.02),
    new THREE.MeshPhysicalMaterial({
      color: '#7fa2f6',
      roughness: 0.12,
      metalness: 0,
      transmission: 0,
      transparent: true,
      opacity: 0.82,
      clearcoat: 1,
      clearcoatRoughness: 0.1,
    })
  )
  water.position.set((P.gap.x0 + P.gap.x1) / 2, P.gap.water - 0.02, 0)
  water.receiveShadow = true
  g.add(water)
  for (const x of [P.gap.x0, P.gap.x1])
    g.add(
      mesh(
        rbox(0.14, 0.06, W, 0.025),
        M.coping,
        x + (x === P.gap.x0 ? -0.07 : 0.07),
        P.upper.y - 0.03,
        0
      )
    )
  const jetMat = toyMat('#f4f7ff', { rough: 0.25, opacity: 0.86 })
  const jets = []
  for (let z = P.zMin + 0.75; z <= P.zMax - 0.7; z += 1.1) {
    if (Math.abs(z) < 0.6) continue // none under the rider's line
    const jet = new THREE.Group()
    const col = new THREE.Mesh(new THREE.CapsuleGeometry(0.045, 1, 4, 10), jetMat)
    const cap = new THREE.Mesh(new THREE.SphereGeometry(0.075, 14, 10), jetMat)
    jet.add(col, cap)
    jet.position.set((P.gap.x0 + P.gap.x1) / 2, P.gap.water, z)
    g.add(jet)
    jets.push({ col, cap, phase: z * 1.7 })
  }

  // the four-stair and the middle terrace
  stairs(g, P.four, P.upper.y, M)
  block(P.middle.x0, P.middle.x1, P.middle.y)
  // the ten-stair down to the lower plaza
  stairs(g, P.ten, P.middle.y, M)

  // the handrail: a tube on three posts, rounded ends
  const R = P.rail
  const drop = R.r / Math.cos(RAIL_SLOPE) // the sloping tube's axis under its top (railTop is the top, straight up)
  const a = new THREE.Vector3(R.x0, railTop(R.x0) - drop, R.z)
  const b = new THREE.Vector3(R.x1, railTop(R.x1) - drop, R.z)
  const tube = mesh(new THREE.CylinderGeometry(R.r, R.r, a.distanceTo(b), 18), M.rail)
  tube.position.copy(a).add(b).multiplyScalar(0.5)
  tube.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), b.clone().sub(a).normalize())
  g.add(tube)
  for (const p of [a, b]) g.add(mesh(new THREE.SphereGeometry(R.r, 16, 12), M.rail, p.x, p.y, p.z))
  for (const x of R.posts) {
    const floor = surfaceAt(x + 0.001, R.z)
    const top = railTopAny(x) - drop
    g.add(
      mesh(
        new THREE.CylinderGeometry(0.022, 0.022, top - floor, 14),
        M.rail,
        x,
        (top + floor) / 2,
        R.z
      )
    )
    g.add(mesh(new THREE.CylinderGeometry(0.05, 0.055, 0.03, 16), M.rail, x, floor + 0.015, R.z))
  }

  // the stations' floor plates, the way a plant numbers its cells
  const marks = {
    S1: new THREE.Vector3(P.gap.x0 - 1.4, P.upper.y + 0.0, 2.6),
    S2: new THREE.Vector3(P.four.x0 - 1.6, P.upper.y + 0.0, 2.6),
    S3: new THREE.Vector3(P.ten.x0 - 1.6, P.middle.y + 0.0, 2.6),
  }
  for (const [k, p] of Object.entries(marks)) {
    const pl = plate(k)
    pl.position.copy(p)
    g.add(pl)
  }
  // the plaza's name on the upper terrace's face
  const sign = new THREE.Mesh(
    new THREE.PlaneGeometry(7.2, 0.9),
    new THREE.MeshStandardMaterial({
      map: labelTexture('CIVIC PLAZA', {
        color: TOY.blue,
        w: 2048,
        h: 256,
        font: 'italic 800 190px Inter, system-ui, sans-serif',
      }),
      transparent: true,
      roughness: 0.6,
    })
  )
  sign.position.set(-34, 1.35, P.zMax + 0.012)
  g.add(sign)

  // planters along the terraces' back edge, benches, the manual pad on the lower plaza
  const plant = (x, y, z, w = 2.6) => {
    g.add(mesh(rbox(w, 0.5, 0.9, 0.08), M.planter, x, y + 0.25, z))
  }
  for (const x of [-42, -36, -29, -17]) plant(x, P.upper.y, P.zMin + 0.75)
  for (const x of [-8.5, 0.2]) plant(x, P.middle.y, P.zMin + 0.75)
  const benches = [
    { x: -4.4, y: P.middle.y, z: P.zMin + 0.7, rot: 0 },
    { x: 13.5, y: 0, z: 6.2, rot: Math.PI },
    { x: 26, y: 0, z: 6.2, rot: Math.PI },
  ]
  for (const b of benches) {
    const bb = bench()
    bb.position.set(b.x, b.y, b.z)
    bb.rotation.y = b.rot
    g.add(bb)
  }
  g.add(mesh(rbox(4.2, 0.32, 1.5, 0.06), M.pad, 22, 0.16, -6.4))
  g.add(mesh(rbox(4.2, 0.06, 0.12, 0.03), M.coping, 22, 0.32, -6.4 + 0.69))
  g.add(mesh(rbox(4.2, 0.06, 0.12, 0.03), M.coping, 22, 0.32, -6.4 - 0.69))

  // trees: bushes in the planters, a row behind the terraces, clumps round the lower plaza
  const T = []
  for (let x = -54; x <= 40; x += 6.5)
    T.push({
      x: x + ((x * 7) % 3),
      z: -9.5 - ((x * 13) % 4) * 0.4,
      size: 0.55 + ((x * 3) % 5) * 0.04,
      rot: x,
    })
  for (const [x, z, s] of [
    [33, -3, 0.6],
    [36, 2, 0.55],
    [31, 7, 0.5],
    [-58, -2, 0.6],
    [-56, 4, 0.5],
  ])
    T.push({ x, z, size: s, rot: x })
  g.add(buildToyTrees(T))
  // the planters' bushes, lifted onto their terraces
  const lifted = buildToyTrees([
    ...[-42, -36, -29, -17].map((x) => ({ x, z: P.zMin + 0.75, kind: 'bush', size: 0.42 })),
    ...[-8.5, 0.2].map((x) => ({ x, z: P.zMin + 0.75, kind: 'bush', size: 0.42 })),
  ])
  lifted.children.forEach((im) => {
    for (let i = 0; i < im.count; i++) {
      const m = new THREE.Matrix4()
      im.getMatrixAt(i, m)
      const p = new THREE.Vector3().setFromMatrixPosition(m)
      m.setPosition(p.x, (p.x < -14 ? P.upper.y : P.middle.y) + 0.5, p.z)
      im.setMatrixAt(i, m)
    }
    im.instanceMatrix.needsUpdate = true
    im.computeBoundingSphere()
  })
  g.add(lifted)

  // the fence at the back of the plaza and the city behind it
  for (const [x, len] of [
    [-38, 48],
    [16, 48],
  ]) {
    const f = buildToyFence({ length: len })
    f.position.set(x, 0, -14)
    g.add(f)
  }
  const city = [
    [-60, -34, 26, 18, 7],
    [-30, -38, 30, 20, 5],
    [0, -34, 22, 18, 9],
    [26, -36, 28, 18, 6],
    [54, -32, 22, 18, 8],
    [-86, -20, 22, 30, 6],
    [74, -6, 18, 24, 5],
  ]
  city.forEach(([x, z, w, d, f], i) => {
    const c = buildToyCityBlock({ w, d, floors: f, seed: i + 3 })
    c.position.set(x, 0, z)
    g.add(c)
  })

  const spots = {
    S1: new THREE.Vector3((P.gap.x0 + P.gap.x1) / 2, P.upper.y, 0),
    S2: new THREE.Vector3(P.four.x0 + 0.5, P.upper.y - 0.4, 0),
    S3: new THREE.Vector3(P.ten.x0 + 1.5, P.middle.y - 0.2, R.z),
  }
  return {
    group: g,
    spots,
    marks,
    /** the fountain's jets rise and fall on the world clock */
    setTime(tau) {
      for (const j of jets) {
        const h =
          0.34 + 0.16 * Math.sin(tau * 2.3 + j.phase) + 0.06 * Math.sin(tau * 5.1 + j.phase * 2)
        j.col.scale.set(1, h, 1)
        j.col.position.y = h / 2
        j.cap.position.y = h + 0.02
      }
    },
  }
}
