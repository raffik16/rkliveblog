// The three teardown machines, whole and running, at the edge of the storm: the cross-plane V8 turning on its own
// crank, the Strandbeest walking a ring around the storm on Jansen's eleven numbers, the Cessna 337 main gear folding
// and dropping on its 32-tooth pinion. Each comes apart and goes back together on its own schedule, and at the end of
// every loop all three come apart at once. Nothing is keyframed but the explode amounts; every pose comes from the
// machine's own math.
import * as THREE from 'three'
import { buildEngine } from '../teardown/v8/engine.js'
import { psi, strokeOf, ORDER } from '../teardown/v8/kin.js'
import { buildBeast, bodyAt, S as BEAST_S } from '../teardown/strandbeest/beast.js'
import { buildGear, G as GEAR } from '../teardown/cessna/gear.js'
import { keyed, smooth } from '../teardown/kit/util.js'

export const LOOP = 120

// explode amount 0..1 against loop time (seconds); the director frames each one as it happens
const EXPLODE = {
  v8: [
    [0, 0],
    [30.5, 0],
    [34, 1],
    [40.5, 1],
    [44.5, 0],
    [66, 0],
    [68, 0.45],
    [72, 0.45],
    [74, 0],
    [100, 0],
    [104, 1],
    [112.5, 1],
    [117.5, 0],
    [120, 0],
  ],
  beast: [
    [0, 0],
    [48, 0],
    [51.5, 1],
    [56, 1],
    [59.5, 0],
    [100.5, 0],
    [104.5, 1],
    [112.5, 1],
    [117.5, 0],
    [120, 0],
  ],
  gear: [
    [0, 0],
    [18, 0],
    [20.5, 0.55],
    [25, 0.55],
    [27.5, 0],
    [77, 0],
    [80, 1],
    [85, 1],
    [88.5, 0],
    [101, 0],
    [105, 1],
    [112.5, 1],
    [117.5, 0],
    [120, 0],
  ],
}

const RING = { r: 16, y: -7.4 } // the Strandbeest's walk
const V8_AT = new THREE.Vector3(12.6, 2.2, -8.6)
const GEAR_AT = new THREE.Vector3(-13.2, 4.2, -7.2)
const BEAST_SCALE = 1.8
const BEAST_RPS = 0.32

const BEAST_PALETTE = {
  tube: '#f4f1eb',
  joint: '#d1322a',
  steel: '#646870',
  foot: '#8c8780',
  sail: '#fbf9f5',
  trace: '#e0662b',
}

/** How far apart each machine is at loop time tau (0 whole, 1 fully exploded). */
export function explodeAt(tau) {
  const t = ((tau % LOOP) + LOOP) % LOOP
  return { v8: keyed(EXPLODE.v8, t), beast: keyed(EXPLODE.beast, t), gear: keyed(EXPLODE.gear, t) }
}

export function buildMachines() {
  const group = new THREE.Group()

  // ---------------------------------------------------------------- V8
  const v8 = buildEngine({})
  // the liners are lit by a dark room here, not the film's pale studio: less mirror, or they burn out under bloom
  v8.M.glass.envMapIntensity = 0.35
  v8.M.glass.roughness = 0.3
  const v8Hold = new THREE.Group()
  v8Hold.add(v8.root)
  v8Hold.scale.setScalar(5.4)
  v8Hold.position.copy(V8_AT)
  group.add(v8Hold)

  // ---------------------------------------------------------------- Strandbeest
  const beast = buildBeast(BEAST_PALETTE)
  const beastHold = new THREE.Group()
  beastHold.add(beast.group)
  beastHold.scale.setScalar(BEAST_SCALE)
  group.add(beastHold)

  // ---------------------------------------------------------------- Cessna 337 main gear
  const gear = buildGear()
  const gearHold = new THREE.Group()
  gearHold.add(gear.root)
  gearHold.scale.setScalar(3.4)
  gearHold.position.copy(GEAR_AT)
  group.add(gearHold)

  for (const o of [v8.root, beast.group, gear.root])
    o.traverse((m) => {
      if (m.isMesh) {
        m.castShadow = false
        m.receiveShadow = false
      }
    })

  // where each machine's middle is, in its holder's frame, and how big it is (whole)
  const measure = (hold) => {
    hold.updateMatrixWorld(true)
    const box = new THREE.Box3().setFromObject(hold)
    const c = box.getCenter(new THREE.Vector3())
    const s = box.getSize(new THREE.Vector3())
    const local = hold.worldToLocal(c.clone())
    return { local, radius: s.length() / 2 }
  }
  v8.update(0, { explode: 0, arrows: 0 })
  beast.update(0, 0, 1, {})
  gear.update({})
  const sizes = { v8: measure(v8Hold), beast: measure(beastHold), gear: measure(gearHold) }

  const centre = { v8: new THREE.Vector3(), beast: new THREE.Vector3(), gear: new THREE.Vector3() }
  const state = {
    explode: { v8: 0, beast: 0, gear: 0 },
    radius: { v8: sizes.v8.radius, beast: sizes.beast.radius, gear: sizes.gear.radius },
    centre,
    beastPhi: 0,
    readout: { v8: '', beast: '', gear: '' },
  }

  /** t: seconds since the start (continuous); tau: loop time. */
  const update = (t, tau) => {
    const ex = explodeAt(tau)
    state.explode = ex

    // V8: the crank turns slowly enough to follow one piston, and breathes a little faster now and then
    const th = 150 * t + 40 * Math.sin(t * 0.21)
    v8.update(th, { explode: ex.v8, charge: 1, arrows: 0 })
    v8Hold.rotation.set(0.18 + 0.1 * Math.sin(t * 0.13), t * 0.11, 0.08 * Math.sin(t * 0.17))
    v8Hold.position.set(V8_AT.x, V8_AT.y + 0.35 * Math.sin(t * 0.4), V8_AT.z)

    // Strandbeest: the crank drives the walk; the distance walked carries it round the ring
    const theta = 2 * Math.PI * BEAST_RPS * t
    beast.update(theta, t, 1, { explode: ex.beast })
    const walked = -bodyAt(theta).x * BEAST_S * BEAST_SCALE
    const phi = 0.4 + walked / RING.r
    state.beastPhi = phi
    beastHold.position.set(RING.r * Math.cos(phi), RING.y, RING.r * Math.sin(phi))
    beastHold.rotation.set(0, Math.PI / 2 - phi, 0)

    // Cessna gear: folds up and drops down, wheels spinning, the whole assembly turning slowly in the air
    const fold = 0.5 - 0.5 * Math.cos((2 * Math.PI * t) / 11)
    const stroke = smooth((fold - 0.12) / 0.76)
    gear.update({ stroke, roll: t * 5, explode: ex.gear })
    gearHold.rotation.set(0.35 + 0.15 * Math.sin(t * 0.12), -t * 0.09, 0.12 * Math.sin(t * 0.15))
    gearHold.position.set(GEAR_AT.x, GEAR_AT.y + 0.3 * Math.sin(t * 0.33 + 1), GEAR_AT.z)

    for (const [k, hold] of [
      ['v8', v8Hold],
      ['beast', beastHold],
      ['gear', gearHold],
    ]) {
      // the holders sit straight under an untransformed group: their own matrix is their world matrix, and the
      // renderer walks the machines' parts once per frame anyway
      hold.updateMatrix()
      centre[k].copy(sizes[k].local).applyMatrix4(hold.matrix)
    }

    // the real numbers, for the captions
    const crank = ((th % 360) + 360) % 360
    const c1 = strokeOf(psi(1, th))
    state.readout.v8 = [
      `V8 · CROSS-PLANE · FIRING ${ORDER.join('-')}`,
      `CRANK ${String(Math.round(crank)).padStart(3, '0')}° · CYL 1 ${c1} · TEARDOWN ${Math.round(ex.v8 * 100)}%`,
    ]
    const bc = ((((theta * 180) / Math.PI) % 360) + 360) % 360
    state.readout.beast = [
      `STRANDBEEST · 20 LEGS · 11 HOLY NUMBERS · ONE CRANK`,
      `CRANK ${String(Math.round(bc)).padStart(3, '0')}° · WALKED ${walked.toFixed(1)} · TEARDOWN ${Math.round(ex.beast * 100)}%`,
    ]
    state.readout.gear = [
      `CESSNA 337 MAIN GEAR · 32T PINION · MODULE 4`,
      `RACK ${String(Math.round(stroke * GEAR.stroke * 1000)).padStart(3, '0')} MM · PINION ${String(Math.round(stroke * 180)).padStart(3, '0')}° · TEARDOWN ${Math.round(ex.gear * 100)}%`,
    ]
    return state
  }

  const materials = new Set()
  group.traverse((m) => {
    if (m.isMesh)
      (Array.isArray(m.material) ? m.material : [m.material]).forEach((x) => materials.add(x))
  })
  // teardown's own rule for glossy metal under a low light: roughness at least 0.45, envMapIntensity about 0.5.
  // These machines were lit for a pale studio; in the dark their polished faces would only streak and bloom.
  for (const m of materials) {
    if (m.isMeshStandardMaterial && m.metalness > 0.5) {
      m.roughness = Math.max(m.roughness, 0.45)
      m.envMapIntensity = 0.55
    }
    // the gloss-black clearcoat, back-lit by the rim light at a grazing angle, turns to a mirror line and blooms
    if (m.isMeshPhysicalMaterial && m.clearcoat > 0)
      m.clearcoatRoughness = Math.max(m.clearcoatRoughness, 0.34)
  }

  return { group, update, state, materials: [...materials] }
}
