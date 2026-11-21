// Padline's world: a toy launch site on a lavender coast, and the space station in orbit, on one clock. The hero is
// booster B1107: the erector rolls it out of the hangar, stands it up on Pad 7, it flies, separates, turns round and
// lands on LZ-2; then the site switcher jumps to the station, where the capsule it carried docks.
//   Pad 7 at the origin (the mount), the hangar at x = -112 (rails between), the tank farm north of the pad, the sea
//   beyond z = -162, LZ-2 out east by the shore at (200, -118), the perimeter road along z = 40, the recovery crew
//   waiting on LZ-2's access road.
// The work is a pure function of the film clock t (T below). Render any second out of order and it looks the same.
import * as THREE from 'three'
import { TOY, toyMat, rbox, mesh } from '../airport-shared/style.js'
import { buildToyFence, buildToyTrees } from '../airport-shared/airside.js'
import { buildToyFuelTruck, buildToyFollowMe, buildToyBus } from '../airport-shared/gse.js'
import {
  STACK,
  buildToyBooster,
  buildToyUpperStage,
  buildToyCapsule,
  buildToyErector,
} from './rocket.js'
import { buildFlame, createPuffs, hash, life } from './effects.js'
import {
  buildToyIntegrationHangar,
  buildToyRails,
  buildToyLaunchMount,
  buildToyTankFarm,
  buildToyPipeRack,
  buildToyWaterTower,
  buildToyLightningTower,
  buildToyLandingZone,
  buildToyBoosterTrailer,
  buildToyMobileCrane,
  buildToyControlCenter,
} from './complex.js'
import { buildToyStation, buildToyEarth, SPACE } from './orbit.js'

const PI = Math.PI
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x))
const sm = (x) => {
  const u = clamp(x)
  return u * u * (3 - 2 * u)
}
const ss = (a, b, t) => sm((t - a) / (b - a))
const lerp = (a, b, k) => a + (b - a) * k
const V = (x = 0, y = 0, z = 0) => new THREE.Vector3(x, y, z)
export const yawOf = (t) => Math.atan2(-t.z, t.x)

export const DUR = 48.7
export const T = {
  door: [-6.4, -3.6], // the hangar door is open before the film starts
  roll: [-3.4, 7.0], // the erector rolls 64 m to the pad (a fifth of the way out at t = 0)
  raise: [7.6, 13.4], // up to vertical
  clamps: [13.3, 14.1], // the hold-downs close on the skirt
  fuel: [11.0, 17.0], // propellant load 0 -> 100 %
  retract: [15.0, 16.2], // the strongback leans back, the cradles open
  ignite: 17.4,
  lift: 18.0,
  sep: 25.2,
  flip: [25.7, 27.7],
  boostback: [27.6, 29.0],
  fins: [28.4, 29.3],
  upright: [29.0, 31.2],
  entry: [31.0, 32.1],
  landing: [34.3, 36.4], // the landing burn
  legs: [34.9, 35.9],
  touch: 36.4,
  convoy: [36.5, 40.4],
  orbit: 40.9, // the site switcher jumps to the station
  approach: [40.9, 45.8], // the capsule closes from 52 m to soft capture
  hold: [43.0, 43.7], // the 20 m hold point
  capture: 45.8,
}
export const PAD = { x: 0, z: 0 }
export const LZ = { x: 200, z: -118 }
export const HANGAR = { x: -112, z: 0 }
const ROAD = 40
const SEA = -162
const HINGE_X = -7.5
const ROLL = 64 // the erector's run from the hangar to the pad
const MOUNT_Y = 6.0

// ------------------------------------------------------------------------------------------------ the flight, as tables
// The ascent: distance flown s(tau) = 1.25 tau^3 from liftoff, pitching over toward -z (downrange, out to sea) by 28 deg.
const ASC = (() => {
  const ds = 0.5
  const pts = [V(0, MOUNT_Y, 0)]
  const dirs = [V(0, 1, 0)]
  for (let s = ds; s <= 4200; s += ds) {
    const phi = ((28 * PI) / 180) * clamp((s - 30) / 520) ** 1.2
    const d = V(0, Math.cos(phi), -Math.sin(phi))
    pts.push(pts[pts.length - 1].clone().addScaledVector(d, ds))
    dirs.push(d)
  }
  return { ds, pts, dirs }
})()
const ascS = (tau) => 1.25 * Math.max(0, tau) ** 3
const ascAt = (s) => {
  const i = clamp(Math.floor(s / ASC.ds), 0, ASC.pts.length - 2)
  const k = clamp(s / ASC.ds - i)
  return {
    p: ASC.pts[i].clone().lerp(ASC.pts[i + 1], k),
    d: ASC.dirs[i]
      .clone()
      .lerp(ASC.dirs[i + 1], k)
      .normalize(),
  }
}
const TAU_SEP = T.sep - T.lift
const S_SEP = ascS(TAU_SEP)
const V_SEP = 3 * 1.25 * TAU_SEP ** 2

// The booster's way home, base positions: up and over the top, back toward the coast, down onto LZ-2.
const LEG_FOOT = 1.52 // the legs' feet are this far below the nozzles when they are down
const BASE_LANDED = V(LZ.x, LEG_FOOT + 0.12, LZ.z)
const RET = (() => {
  const p0 = ascAt(S_SEP).p
  const pts = [
    p0,
    p0.clone().add(V(6, 36, -14)),
    p0.clone().add(V(46, 30, -16)),
    V(112, 290, -112),
    V(172, 120, -120),
    V(LZ.x, 34, LZ.z),
    BASE_LANDED,
  ]
  const curve = new THREE.CatmullRomCurve3(pts, false, 'centripetal')
  const L = curve.getLength()
  // speed along it: slow over the top, fast down the middle, braking to nothing at touchdown
  const n = 400
  const cum = [0]
  for (let i = 1; i <= n; i++) {
    const x = (i - 0.5) / n
    cum.push(cum[i - 1] + x ** 0.7 * (1 - x) ** 1.35)
  }
  const tot = cum[n]
  const frac = (x) => {
    const f = clamp(x) * n
    const i = Math.min(n - 1, Math.floor(f))
    return lerp(cum[i], cum[i + 1], f - i) / tot
  }
  return { curve, L, frac }
})()
const retAt = (t) => RET.curve.getPointAt(RET.frac((t - T.sep) / (T.touch - T.sep)))

// attitudes, as quaternions turning the rocket's +y onto a direction
const qUp = (d) => new THREE.Quaternion().setFromUnitVectors(V(0, 1, 0), d.clone().normalize())
const Q_SEP = qUp(ascAt(S_SEP).d)
const Q_BACK = qUp(V(0.92, -0.12, -0.08)) // turned round, lying on its side, nose toward LZ-2: ready to burn back
const Q_DOWN = qUp(V(-0.34, 1, 0.04)) // engines first, leaning into the fall toward LZ-2
const Q_VERT = qUp(V(0, 1, 0))
const boosterQ = (t) => {
  const q = new THREE.Quaternion()
  if (t < T.flip[0]) return q.copy(Q_SEP)
  if (t < T.boostback[1]) return q.slerpQuaternions(Q_SEP, Q_BACK, ss(...T.flip, t))
  if (t < T.landing[0])
    return q.slerpQuaternions(Q_BACK, Q_DOWN, ss(T.boostback[1], T.upright[1] + 1.0, t))
  return q.slerpQuaternions(Q_DOWN, Q_VERT, ss(T.landing[0], T.touch - 0.25, t))
}

export function buildWorld() {
  const root = new THREE.Group()
  const ground = new THREE.Group()
  root.add(ground)
  const add = (o, x = 0, z = 0, ry = 0, y = 0, parent = ground) => {
    o.position.set(x, y, z)
    o.rotation.y = ry
    parent.add(o)
    return o
  }
  const flat = (w, d, color, x, z, y = 0.01) => {
    const m = new THREE.Mesh(
      new THREE.PlaneGeometry(w, d).rotateX(-PI / 2),
      toyMat(color, { rough: 0.95 })
    )
    m.position.set(x, y, z)
    m.receiveShadow = true
    ground.add(m)
    return m
  }

  // ---------------------------------------------------------------- ground, sea, roads
  flat(3200, 3200, TOY.ground, 0, 0, 0)
  // the sea to the north: a deeper periwinkle with white wave dashes and a pale shore
  flat(3200, 1600, '#aebff2', 0, SEA - 800, 0.03)
  flat(3200, 7, '#e9edf8', 0, SEA + 2.5, 0.035)
  const waves = new THREE.InstancedMesh(
    rbox(7, 0.06, 0.5, 0.02),
    toyMat('#f4f6fd', { rough: 0.9 }),
    220
  )
  {
    const m = new THREE.Matrix4()
    for (let i = 0; i < 220; i++) {
      m.makeTranslation(-420 + hash(i, 1) * 900, 0.06, SEA - 10 - hash(i, 2) * 260)
      waves.setMatrixAt(i, m)
    }
    waves.receiveShadow = true
    ground.add(waves)
  }
  const road = '#ccd6f4'
  flat(560, 12, road, 40, ROAD, 0.02)
  for (let x = -235; x < 320; x += 9) flat(4, 0.45, TOY.lane, x, ROAD, 0.03)
  // the crawlerway-style road from the perimeter road up to LZ-2, and a spur to the pad
  flat(12, ROAD - LZ.z - 18, road, LZ.x, (ROAD + LZ.z + 18) / 2, 0.021)
  flat(12, ROAD - 28, road, 30, (ROAD + 28) / 2, 0.021)

  // ---------------------------------------------------------------- Pad 7: the mount, the rails, the hangar, the farm
  const mount = buildToyLaunchMount()
  add(mount.group, PAD.x, PAD.z)
  add(buildToyRails({ length: 150 + HINGE_X }), -150, 0)
  const hangar = buildToyIntegrationHangar()
  add(hangar.group, HANGAR.x, HANGAR.z)
  const farm = buildToyTankFarm()
  add(farm.group, -6, -52)
  // the farm's pipes leave its slab at (20, -38) heading for the pad
  add(buildToyPipeRack({ length: 24 }), 20, -38, -PI / 2)
  add(buildToyWaterTower(), 38, -56)
  for (const [x, z] of [
    [-24, -24],
    [24, -24],
    [-24, 24],
    [24, 24],
  ])
    add(buildToyLightningTower({ h: 52 }), x, z)
  add(buildToyControlCenter(), -48, 70)
  // the propellant tankers at the farm
  const tankers = [0, 1].map((i) => {
    const tr = buildToyFuelTruck({ livery: 'plain' })
    add(tr.group, -36 + i * 15, -34.2, 0) // between the apron (z -30) and the farm's slab (z -38)
    return tr
  })

  // ---------------------------------------------------------------- LZ-2 and the recovery crew
  const lz = buildToyLandingZone({ r: 18 })
  add(lz, LZ.x, LZ.z)
  const crane = buildToyMobileCrane()
  ground.add(crane.group)
  const trailer = buildToyBoosterTrailer()
  ground.add(trailer.group)
  const chase = buildToyFollowMe()
  ground.add(chase.group)
  // the convoy waits in line on LZ-2's access road, a safe 100 m back, then drives up to the pad
  const convoyPath = (pts) => {
    const c = new THREE.CatmullRomCurve3(
      pts.map(([x, z]) => V(x, 0, z)),
      false,
      'centripetal'
    )
    return { c, L: c.getLength() }
  }
  const pChase = convoyPath([
    [LZ.x + 2.5, LZ.z + 78],
    [LZ.x + 2.5, LZ.z + 50],
    [LZ.x + 4, LZ.z + 32],
    [LZ.x + 15, LZ.z + 25],
    [LZ.x + 22, LZ.z + 20],
  ])
  const pCrane = convoyPath([
    [LZ.x - 2.5, LZ.z + 98],
    [LZ.x - 2.5, LZ.z + 50],
    [LZ.x - 4, LZ.z + 32],
    [LZ.x - 15, LZ.z + 25],
    [LZ.x - 23, LZ.z + 17],
  ])
  const pTrailer = convoyPath([
    [LZ.x, LZ.z + 130],
    [LZ.x, LZ.z + 76],
    [LZ.x, LZ.z + 42],
  ])

  // ---------------------------------------------------------------- the site's traffic: a bus and a patrol car on the road
  const bus = buildToyBus({ livery: 'aurora' })
  ground.add(bus.group)
  const patrol = buildToyFollowMe()
  ground.add(patrol.group)

  // ---------------------------------------------------------------- landscape
  for (let x = -230; x < 300; x += 30) add(buildToyFence({ length: 30 }), x + 15, ROAD + 10)
  const trees = []
  for (let x = -230; x < 300; x += 14)
    if (Math.abs(x - 30) > 10)
      trees.push({ x: x + 3 * Math.sin(x), z: ROAD + 15, size: 0.95 + 0.15 * Math.sin(x * 1.7) })
  for (const [x, z, s] of [
    [-80, 70, 1.2],
    [-92, 66, 1.0],
    [-20, 76, 1.1],
    [60, 62, 1.2],
    [70, 70, 1.0],
    [130, 70, 1.1],
    [240, 60, 1.2],
    [250, -30, 1.1],
    [238, -14, 1.0],
    [120, -60, 1.2],
    [132, -40, 1.0],
    [-170, -40, 1.1],
    [-160, 50, 1.2],
    [-60, -90, 1.0],
    [80, -100, 1.1],
    [150, -20, 1.0],
    [160, 10, 1.1],
    [250, -150, 1.0],
  ])
    trees.push({ x, z, size: s })
  ground.add(buildToyTrees(trees))

  // ---------------------------------------------------------------- the rocket and the erector
  const te = buildToyErector()
  ground.add(te.group)
  const booster = buildToyBooster()
  root.add(booster.group)
  const upper = buildToyUpperStage()
  root.add(upper.group)
  const fBooster = buildFlame({ r: 2.0, len: 20 })
  booster.group.add(fBooster.group)
  const fLand = buildFlame({ r: 0.85, len: 11 })
  booster.group.add(fLand.group)
  const fUpper = buildFlame({ r: 1.3, len: 14, color: 'vacuum' })
  fUpper.group.position.y = -3.1
  upper.group.add(fUpper.group)
  const puffs = createPuffs(root, 520)

  // ---------------------------------------------------------------- orbit: the station, the Earth, a second capsule
  const orbit = new THREE.Group()
  orbit.visible = false
  root.add(orbit)
  const station = buildToyStation()
  orbit.add(station.group)
  const earth = buildToyEarth({ radius: 4000 })
  earth.group.position.y = -380
  orbit.add(earth.group)
  const cap2 = buildToyCapsule()
  cap2.setNose(1)
  orbit.add(cap2.group)
  const port = station.dockPort.pos.clone()
  const portDir = station.dockPort.dir.clone().normalize()
  const capQ = new THREE.Quaternion()

  // ---------------------------------------------------------------- poses
  const M = new THREE.Matrix4()
  const tmp = V()
  const placeStack = (m) => {
    booster.group.matrixAutoUpdate = false
    booster.group.matrix.copy(m)
    upper.group.matrixAutoUpdate = false
    upper.group.matrix.copy(m).multiply(new THREE.Matrix4().makeTranslation(0, STACK.upper, 0))
    booster.group.matrixWorldNeedsUpdate = upper.group.matrixWorldNeedsUpdate = true
  }
  const setObj = (g, p, q) => {
    g.matrixAutoUpdate = false
    g.matrix.compose(p, q, V(1, 1, 1))
    g.matrixWorldNeedsUpdate = true
  }
  const drive = (veh, path, k, yawOffset = 0) => {
    const u = clamp(k)
    const p = path.c.getPointAt(u)
    const tg = path.c.getTangentAt(u)
    veh.group.position.set(p.x, 0, p.z)
    veh.group.rotation.y = yawOf(tg) + yawOffset
    veh.roll(path.L * u)
  }
  // the stack's world matrix while the erector holds it
  const teMatrix = () => {
    te.group.updateMatrix()
    return M.copy(te.group.matrix).multiply(te.rocketMatrix(new THREE.Matrix4()))
  }
  const state = {}
  const rocketAt = (t) => {
    // where the booster's base is and which way it points, after liftoff
    if (t < T.sep) {
      const { p, d } = ascAt(ascS(t - T.lift))
      return { p, q: qUp(d), d }
    }
    return { p: retAt(t), q: boosterQ(t) }
  }
  const upperAt = (t) => {
    const dt = t - T.sep
    const s = S_SEP + V_SEP * dt + 60 * Math.max(0, dt - 0.8) ** 2
    const { p, d } = ascAt(s)
    // it drifts a couple of metres clear of the booster before its engine lights
    return {
      p: p.add(V(0, 0, -1.5 * Math.min(dt, 1))).addScaledVector(d, STACK.upper + 1.2 * dt),
      q: qUp(d),
    }
  }

  const pose = (t) => {
    const inOrbit = t >= T.orbit
    ground.visible = !inOrbit
    orbit.visible = inOrbit
    booster.group.visible = !inOrbit
    upper.group.visible = !inOrbit && t < T.sep + 6

    // ---- the hangar door, the erector's run, the raise
    hangar.setDoor(ss(...T.door, t))
    const runK = ss(...T.roll, t)
    te.group.position.set(HINGE_X - ROLL * (1 - runK), 0, 0)
    te.roll(ROLL * runK)
    const lean = ((3.2 * PI) / 180) * ss(...T.retract, t)
    te.setAngle((PI / 2) * ss(...T.raise, t) - lean)
    te.setClaws(1 - ss(T.retract[0] + 0.3, T.retract[1], t))
    mount.setClamps(ss(...T.clamps, t) * (1 - ss(T.lift - 0.15, T.lift + 0.15, t)))

    // ---- the stack
    let flameK = 0
    let landK = 0
    if (t < T.retract[0] + 0.01) placeStack(teMatrix())
    else if (t < T.lift) {
      // standing on the clamps while the strongback leans away
      placeStack(M.makeTranslation(0, MOUNT_Y, 0))
    } else if (t < T.sep) {
      const r = rocketAt(t)
      placeStack(M.compose(r.p, r.q, V(1, 1, 1)))
    } else {
      const r = rocketAt(t)
      setObj(booster.group, r.p, r.q)
      const u = upperAt(t)
      setObj(upper.group, u.p, u.q)
    }
    if (t >= T.ignite && t < T.sep)
      flameK = ss(T.ignite, T.ignite + 0.5, t) * (1 - ss(T.sep - 0.25, T.sep, t))
    // the boostback burn (all nine), the entry burn (three), the landing burn (one)
    if (t > T.boostback[0] && t < T.boostback[1])
      flameK = Math.max(
        flameK,
        0.7 *
          ss(T.boostback[0], T.boostback[0] + 0.3, t) *
          (1 - ss(T.boostback[1] - 0.3, T.boostback[1], t))
      )
    if (t > T.entry[0] && t < T.entry[1])
      landK = Math.max(
        landK,
        ss(T.entry[0], T.entry[0] + 0.25, t) * (1 - ss(T.entry[1] - 0.25, T.entry[1], t))
      )
    if (t > T.landing[0] && t < T.touch + 0.2)
      landK = Math.max(
        landK,
        ss(T.landing[0], T.landing[0] + 0.3, t) * (1 - ss(T.touch - 0.1, T.touch + 0.2, t))
      )
    fBooster.set(flameK * (t < T.lift ? 0.55 + 0.45 * ss(T.ignite, T.lift + 0.6, t) : 1), t)
    fLand.set(landK, t)
    fUpper.set(t > T.sep + 0.8 ? ss(T.sep + 0.8, T.sep + 1.2, t) : 0, t)
    booster.setFins(ss(...T.fins, t))
    booster.setLegs(ss(...T.legs, t))

    // ---- the farm, the tankers
    const fuel = ss(...T.fuel, t)
    farm.setFill(1 - 0.35 * fuel, 1 - 0.25 * fuel)

    // ---- the recovery crew
    const ck = (d) => ss(T.convoy[0] + d, T.convoy[1] + d * 0.3, t)
    drive(chase, pChase, ck(0))
    drive(crane, pCrane, ck(0.35))
    drive(trailer, pTrailer, ck(0.7))
    crane.setBoom(0)
    crane.setSwing(0)

    // ---- the traffic: the bus runs west on the far lane, the patrol car east on the near one
    {
      const x = 260 - ((t * 11 + 40) % 520)
      bus.group.position.set(x, 0, ROAD - 3.2)
      bus.group.rotation.y = PI
      bus.roll(t * 11)
      bus.group.visible = x > -230 && x < 255
      const x2 = -220 + ((t * 13 + 120) % 470)
      patrol.group.position.set(x2, 0, ROAD + 3.2)
      patrol.group.rotation.y = 0
      patrol.roll(t * 13)
      patrol.group.visible = x2 > -225 && x2 < 245
    }

    // ---- orbit
    if (inOrbit) {
      earth.update(t)
      station.setArrays(0.22 + 0.012 * (t - T.orbit))
      station.setArm(ss(T.orbit, T.orbit + 3.5, t))
      const gap =
        t < T.hold[0]
          ? lerp(52, 20, ss(T.approach[0], T.hold[0], t))
          : t < T.hold[1]
            ? 20
            : lerp(20, 0, ss(T.hold[1], T.capture, t))
      station.group.updateMatrixWorld(true)
      tmp.copy(port).addScaledVector(portDir, cap2.ringY + gap)
      const dirW = portDir.clone().applyQuaternion(station.group.quaternion)
      capQ.setFromUnitVectors(V(0, 1, 0), dirW.negate())
      setObj(cap2.group, station.group.localToWorld(tmp.clone()), capQ)
      cap2.group.updateMatrixWorld(true)
      state.gap = gap
    }

    // ---- puffs
    root.updateMatrixWorld(true)
    puffs.begin()
    emit(t, inOrbit)
    puffs.end()
    state.fuel = fuel
    state.inOrbit = inOrbit
    return state
  }

  // every puff is a function of its own birth time
  const emit = (t, inOrbit) => {
    if (inOrbit) {
      // the capsule's thrusters: short bursts at the hold point and just before capture
      for (const [b0, n] of [
        [42.6, 8],
        [45.2, 8],
      ]) {
        for (let i = 0; i < n; i++) {
          const b = b0 + i * 0.05
          const age = t - b
          const L = 0.9
          if (age <= 0 || age >= L) continue
          const a = (i * 2 * PI) / 4 + PI / 4
          const out = V(Math.cos(a), 0, Math.sin(a))
          const w = cap2.group.localToWorld(V(1.4 * Math.cos(a), 5.1, 1.4 * Math.sin(a)))
          const dirW = out.applyQuaternion(cap2.group.quaternion)
          w.addScaledVector(dirW, 2.5 * age)
          puffs.puff(w.x, w.y, w.z, 0.55 * life(age, L))
        }
      }
      return
    }
    // the trench: steam pours out of the exit toward +x and climbs, from ignition on
    for (let i = 0; i < 120; i++) {
      const b = T.ignite + i * 0.045
      const L = 5.5 + 2.5 * hash(i, 1)
      const age = t - b
      if (age <= 0 || age >= L) continue
      const ang = (hash(i, 2) - 0.5) * 1.3
      const run = 30 * (1 - Math.exp(-age / 1.3)) * (0.6 + 0.6 * hash(i, 3))
      const x = 34 + Math.cos(ang) * run
      const z = Math.sin(ang) * run * 1.2
      const y = 2.5 + 2.2 * age + 2 * hash(i, 4)
      puffs.puff(x, y, z, (3.2 + 4.2 * hash(i, 5)) * life(age, L))
    }
    // a ring of steam round the deck in the first seconds
    for (let i = 0; i < 40; i++) {
      const b = T.ignite + 0.2 + i * 0.04
      const L = 3.8 + 1.4 * hash(i, 11)
      const age = t - b
      if (age <= 0 || age >= L) continue
      const a = hash(i, 12) * 2 * PI
      const run = 9 + 10 * (1 - Math.exp(-age / 0.9))
      puffs.puff(
        Math.cos(a) * run,
        3 + 1.6 * age,
        Math.sin(a) * run,
        (2.4 + 2 * hash(i, 13)) * life(age, L)
      )
    }
    // the contrail: a puff left behind every 0.045 s at the base of the climbing rocket
    for (let i = 0; i < 150; i++) {
      const b = T.lift + 0.5 + i * 0.045
      if (b > T.sep) break
      const L = 5.5
      const age = t - b
      if (age <= 0 || age >= L) continue
      const p = ascAt(ascS(b - T.lift)).p
      const g = 1 + 0.5 * (b - T.lift)
      puffs.puff(
        p.x + 2 * (hash(i, 21) - 0.5) + 1.2 * age,
        p.y - 2 + 3 * (hash(i, 22) - 0.5),
        p.z + 2 * (hash(i, 23) - 0.5),
        (1.4 + 0.9 * g) * life(age, L)
      )
    }
    // propellant vapour: liquid oxygen boils off the second stage and the booster's top while it loads
    const vents = [V(2.4, 37.2, 0.6), V(-0.8, 37.0, 2.4), V(2.3, 25.8, -0.9)]
    for (let i = 0; i < 60; i++) {
      const b = T.fuel[0] + 1.2 + i * 0.11
      if (b > T.lift - 0.3) break
      const L = 2.6
      const age = t - b
      if (age <= 0 || age >= L) continue
      const v = vents[i % 3]
      const x = v.x + 1.6 * age + 0.6 * hash(i, 31)
      const z = v.z + 0.4 * age
      const y = MOUNT_Y + v.y - 2.6 * age * age * 0.5 - 0.4 * age
      puffs.puff(x, y, z, 1.25 * life(age, L))
    }
    // the farm's vents puff while it pumps
    for (let i = 0; i < 24; i++) {
      const b = T.fuel[0] + i * 0.26
      const L = 3.0
      const age = t - b
      if (age <= 0 || age >= L || !farm.vents?.length) continue
      const v = farm.group.localToWorld(farm.vents[i % farm.vents.length].clone())
      puffs.puff(v.x + 1.2 * age, v.y + 1.8 * age, v.z + 0.3 * age, 1.3 * life(age, L))
    }
    // cold-gas thrusters at the top of the booster while it turns round
    for (let i = 0; i < 18; i++) {
      const b = T.flip[0] + 0.15 + i * 0.1
      const L = 0.8
      const age = t - b
      if (age <= 0 || age >= L) continue
      const side = i % 2 ? 1 : -1
      booster.group.updateMatrixWorld()
      const w = V(side * (2.6 + 3 * age), 29.4, 0).applyMatrix4(booster.group.matrixWorld)
      puffs.puff(w.x, w.y, w.z, 0.9 * life(age, L))
    }
    // touchdown: dust and steam skate out across the pad
    for (let i = 0; i < 46; i++) {
      const b = T.touch - 0.6 + i * 0.022
      const L = 2.6 + 1.2 * hash(i, 41)
      const age = t - b
      if (age <= 0 || age >= L) continue
      const a = hash(i, 42) * 2 * PI
      const run = 3 + 20 * (1 - Math.exp(-age / 0.7))
      puffs.puff(
        LZ.x + Math.cos(a) * run,
        1.2 + 0.7 * age,
        LZ.z + Math.sin(a) * run,
        (1.8 + 1.6 * hash(i, 43)) * life(age, L),
        0.35
      )
    }
    // the landed booster breathes off a little vapour
    for (let i = 0; i < 16; i++) {
      const b = T.touch + 0.4 + i * 0.3
      const L = 2.4
      const age = t - b
      if (age <= 0 || age >= L) continue
      puffs.puff(LZ.x + 1.8 + 1.1 * age, 27 + 1.2 * age, LZ.z - 0.4, 0.9 * life(age, L))
    }
  }

  pose(0)

  // ---------------------------------------------------------------- what the film reads
  const at = (o, dy) => o.getWorldPosition(V()).add(V(0, dy, 0))
  const anchors = {
    te: () => at(te.group, 0).add(V(-24, 12, 0)),
    stack: () => booster.group.localToWorld(V(0, 24, 0)),
    booster: () => booster.group.localToWorld(V(0, 31, 0)),
    farm: () => at(farm.group, 22),
    lz: () => V(LZ.x, 3, LZ.z),
    crane: () => at(crane.group, 7),
    capsule: () => cap2.group.localToWorld(V(0, 8.5, 0)),
    station: () => station.group.localToWorld(V(0, 12, 0)),
  }
  const routes = {
    te: (t) => (t < T.roll[1] ? [V(te.group.position.x - 24, 0, 0), V(HINGE_X - 24, 0, 0)] : null),
    booster: (t) => {
      if (t < T.sep || t >= T.touch) return null
      const pts = []
      const n = 40
      const f0 = RET.frac((t - T.sep) / (T.touch - T.sep))
      for (let i = 0; i <= n; i++) {
        const p = RET.curve.getPointAt(lerp(f0, 1, i / n))
        pts.push(V(p.x, 0, p.z))
      }
      return pts
    },
    crane: (t) =>
      t < T.convoy[1] + 0.1
        ? Array.from({ length: 33 }, (_, i) =>
            pCrane.c.getPointAt(lerp(ss(T.convoy[0] + 0.35, T.convoy[1] + 0.1, t), 1, i / 32))
          )
        : null,
  }
  const bodies = [
    { name: 'chase', g: chase.group },
    { name: 'crane', g: crane.group },
    { name: 'trailer', g: trailer.group },
    { name: 'bus', g: bus.group },
    { name: 'patrol', g: patrol.group },
    ...tankers.map((tr, i) => ({ name: `tanker${i}`, g: tr.group })),
  ]
  return {
    root,
    pose,
    trees,
    anchors,
    routes,
    bodies,
    rocketAt,
    objects: {
      te,
      booster,
      upper,
      mount,
      hangar,
      farm,
      lz,
      crane,
      trailer,
      chase,
      station,
      earth,
      cap2,
      puffs,
    },
    SPACE,
    ascAt,
    retAt,
  }
}
