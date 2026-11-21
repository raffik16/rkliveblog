// The scene: the plaza, R-07 on board 0712 (the line's work item), R-02 carving a loop on the lower plaza, F-01
// filming from the bottom of the stairs, two people on the middle terrace's bench. pose(tau) puts everyone where
// motion.js says they are at world time tau; nothing here keeps state between frames.
//
//   buildWorld() -> {root, pose(tau) -> {hero, second}, anchors, select, stationRoute, groundAt}
//
//   anchors[name](h)     a world point to pin a tag, a pin or the cursor to (rider, board, S1, S2, S3)
//   select[name]         the object a selection box rides: proxies for the rider and the stations, the board itself
//   stationRoute[name]   the line through a station, for the route ribbon (the rider's own comes from the film)
//   groundAt(x)          the ground under the line with the stairs and the channel bridged, for ribbons and glows
import * as THREE from 'three'
import { TOY, toyMat, rbox, mesh } from './simulator/airport-shared/style.js'
import { BOARD, PLAZA, railTop, surfaceAt } from './layout.js'
import { buildPlaza } from './plaza.js'
import { buildBoard, buildRider } from './rider.js'
import { RUN, heroAt, secondAt, filmerAt, watchersAt } from './motion.js'

const V = (x = 0, y = 0, z = 0) => new THREE.Vector3(x, y, z)

/** the ground a line is drawn on: the terraces, a straight run over each flight's nosings, the channel bridged */
export function groundAt(x) {
  const P = PLAZA
  const flight = (f, top) => top - (f.rise / f.tread) * (x - f.x0)
  if (x < P.four.x0) return P.upper.y
  if (x < P.four.x0 + P.four.n * P.four.tread)
    return Math.max(P.middle.y, flight(P.four, P.upper.y))
  if (x < P.ten.x0) return P.middle.y
  if (x < P.ten.x0 + P.ten.n * P.ten.tread) return Math.max(0, flight(P.ten, P.middle.y))
  return 0
}

/** an invisible unit box: scaled and placed per frame, it gives a selection box any size */
function proxy(name) {
  const o = new THREE.Group()
  o.name = name
  const m = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial())
  m.visible = false
  o.add(m)
  o.userData.selPad = 0
  return o
}

/** F-01's camera: a body, a lens hood, a handle and the red light that blinks while it records */
function buildCamera() {
  const g = new THREE.Group()
  const body = toyMat(TOY.navy, { rough: 0.5 })
  const trim = toyMat(TOY.shade, { rough: 0.5 })
  g.add(mesh(rbox(0.16, 0.1, 0.09, 0.02), body, -0.02, 0, 0))
  const lens = mesh(new THREE.CylinderGeometry(0.035, 0.04, 0.09, 16), trim, 0.09, 0, 0)
  lens.rotation.z = Math.PI / 2
  g.add(lens)
  g.add(mesh(rbox(0.12, 0.025, 0.03, 0.01), body, -0.03, 0.065, 0))
  const rec = new THREE.Mesh(
    new THREE.SphereGeometry(0.012, 10, 8),
    toyMat(TOY.red, { emissive: TOY.red })
  )
  rec.position.set(0.04, 0.03, 0.047)
  g.add(rec)
  return { group: g, rec }
}

export function buildWorld() {
  const root = new THREE.Group()
  const plaza = buildPlaza()
  root.add(plaza.group)

  // R-07 and board 0712: the work item. The yellow bottom is the one yellow thing on the map.
  const hero = {
    rider: buildRider({ tee: TOY.blue, number: '07', cap: TOY.white, ink: TOY.white }),
    board: buildBoard({ number: '0712' }),
  }
  // R-02 on a white-bottomed board, carving the lower plaza
  const second = {
    rider: buildRider({ tee: TOY.teal, number: '02', cap: TOY.blueLight, ink: TOY.white }),
    board: buildBoard({ number: '0233', bottom: TOY.white }),
  }
  const filmer = buildRider({ tee: TOY.white, number: '', cap: TOY.navy })
  const cam = buildCamera()
  const watchers = [
    buildRider({ tee: TOY.blueLight, number: '', cap: TOY.blue }),
    buildRider({ tee: TOY.white, number: '', cap: TOY.teal }),
  ]
  root.add(
    hero.rider.group,
    hero.board.group,
    second.rider.group,
    second.board.group,
    filmer.group,
    cam.group
  )
  for (const w of watchers) root.add(w.group)

  // what a selection box rides: a proxy round R-07 (posed per frame), the board itself, a box round each station
  const riderBox = proxy('R-07')
  hero.board.group.userData.selPad = 0.05
  const P = PLAZA
  const station = (name, c, s, extra = {}) => {
    const o = proxy(name)
    o.position.copy(c)
    o.scale.copy(s)
    Object.assign(o.userData, extra)
    return o
  }
  const select = {
    rider: riderBox,
    board: hero.board.group,
    S1: station(
      'S1',
      V((P.gap.x0 + P.gap.x1) / 2, (P.gap.floor + P.upper.y) / 2 + 0.06, 0),
      V(P.gap.x1 - P.gap.x0 + 0.34, P.upper.y - P.gap.floor + 0.22, P.zMax - P.zMin + 0.1),
      { groundY: P.gap.water }
    ),
    S2: station(
      'S2',
      V(P.four.x0 + (P.four.n - 1) * P.four.tread * 0.5, (P.upper.y + P.middle.y) / 2 + 0.04, 0),
      V((P.four.n - 1) * P.four.tread + 0.3, P.upper.y - P.middle.y + 0.18, P.zMax - P.zMin + 0.1),
      { noGlow: true }
    ),
    S3: station(
      'S3',
      V(
        (P.rail.x0 + P.rail.x1) / 2,
        (railTop(P.rail.x0) + railTop(P.rail.x1)) / 2 - 0.12,
        P.rail.z
      ),
      V(P.rail.x1 - P.rail.x0 + 0.2, railTop(P.rail.x0) - railTop(P.rail.x1) + 0.5, 0.26),
      { noGlow: true }
    ),
  }
  root.add(riderBox, select.S1, select.S2, select.S3)

  // a line through each station: the board's path from just before the pop to just after the landing, on the ground
  const pathPts = (t0, t1, n = 48) => {
    const out = []
    for (let i = 0; i <= n; i++) {
      const b = heroAt(t0 + ((t1 - t0) * i) / n).board.pos
      out.push(V(b.x, groundAt(b.x), b.z))
    }
    return out
  }
  const { S1, S2, S3, OFF } = RUN
  const stationRoute = {
    S1: pathPts(S1.tp - 0.6, S1.tl + 0.45),
    S2: pathPts(S2.tp - 0.6, S2.tl + 0.45),
    S3: pathPts(S3.tp - 0.6, OFF.tl + 0.45, 72),
  }

  const headTop = (pose) => pose.pelvis.clone().addScaledVector(pose.up, 1.02)
  const anchors = {
    rider: (h) => headTop(h.pose).add(V(0, 0.22, 0)),
    board: (h) => h.board.pos.clone().add(V(0, 0.3, 0)),
    S1: () => V((P.gap.x0 + P.gap.x1) / 2, P.upper.y + 0.05, 1.1),
    S2: () => V(P.four.x0 + 0.5, P.upper.y - 0.25, 1.1),
    // on the steps in front of the rail, so the tag never covers the rider on it
    S3: () => V(P.ten.x0 + 1.2, groundAt(P.ten.x0 + 1.2) + 0.05, P.rail.z + 2.0),
  }
  // where the cursor clicks each thing: the rider's middle, the board, the water in the channel, the stairs' top
  // step, the rail's upper end (the stations' points stay clear of the cards in the frames where they are clicked)
  const clickAt = {
    rider: (h) => h.pose.pelvis.clone().add(V(0, 0.2, 0)),
    board: (h) => h.board.pos.clone(),
    S1: () => V((P.gap.x0 + P.gap.x1) / 2 + 0.2, P.gap.water, 0.3),
    S2: () => V(P.four.x0 + 0.48, P.upper.y - 0.3, 1.6),
    S3: () => V(P.ten.x0 + 0.9, railTop(P.ten.x0 + 0.9) + 0.02, P.rail.z),
  }

  const tmpQ = new THREE.Quaternion()
  return {
    root,
    plaza,
    hero,
    anchors,
    clickAt,
    select,
    stationRoute,
    groundAt,
    /** everyone at world time tau */
    pose(tau) {
      plaza.setTime(tau)
      const h = heroAt(tau)
      hero.rider.pose(h.pose)
      hero.board.group.position.copy(h.board.pos)
      hero.board.group.quaternion.copy(h.board.quat)
      hero.board.group.userData.groundY = surfaceAt(h.board.pos.x, h.board.pos.z)
      // the rider's box: from under the board to over the head, the board's length, along the line
      const top = headTop(h.pose).y + 0.06
      const bottom = Math.min(h.board.pos.y - BOARD.grip, h.pose.pelvis.y - 1.05) - 0.03
      const mid = h.pose.pelvis.clone().lerp(h.board.pos, 0.5)
      riderBox.position.set(mid.x, (top + bottom) / 2, mid.z)
      riderBox.scale.set(BOARD.half * 2 + 0.16, top - bottom, 0.74)
      riderBox.quaternion.copy(tmpQ.setFromUnitVectors(V(1, 0, 0), h.T.clone().setY(0).normalize()))
      riderBox.userData.groundY = surfaceAt(mid.x, mid.z)

      const s = secondAt(tau)
      second.rider.pose(s.pose)
      second.board.group.position.copy(s.board.pos)
      second.board.group.quaternion.copy(s.board.quat)

      const f = filmerAt(tau, h.pose.pelvis)
      filmer.pose(f.pose)
      cam.group.position.copy(f.cam)
      cam.group.quaternion.setFromUnitVectors(V(1, 0, 0), f.aim)
      cam.rec.visible = f.rec

      watchersAt(tau, h.pose.pelvis).forEach((p, i) => watchers[i].pose(p))
      return { hero: h, second: s }
    },
  }
}
