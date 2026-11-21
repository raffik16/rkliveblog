// The rider and the board, in the simulator's toy look (style.js): chunky rounded forms, matte
// paint, navy for the dark parts. Toy metres, y up.
//
//   buildBoard({ number, bottom }) -> { group }
//       Origin at the centre of the grip, the top of the deck's flat middle. +x is the nose, +y the
//       grip side, +z the toe side of a regular rider. The wheels touch the ground at y = -BOARD.grip;
//       on a rail the hangers sit on it at y = -BOARD.hanger. R-07's bottom is yellow, the one yellow
//       thing on the map: in the simulator's palette yellow is kept for the machine doing the work.
//   buildRider({ tee, number, cap, ink }) -> { group, pose(P) }   (ink: the number's colour)
//       Every part is placed from scratch each frame by pose(P), from world-space joints:
//       P = { pelvis, side, up, twist, lean, bank, look, feet: [front, back], hands: [left, right] }
//       side runs from the right hip to the left one (toward the nose, for a regular rider standing
//       sideways), up is the pelvis's up, and the chest faces side × up. twist turns the chest about
//       up, lean tips it toward the chest's front, bank toward the left hip (radians). feet are
//       { pos, dir, up }: the middle of the sole, where the toes point, the sole's normal. hands
//       are wrist positions (null for relaxed arms). look is a point for the head to face.
//       The legs and arms are solved with two-bone IK; the knees bend toward the chest.
import * as THREE from 'three'
import { TOY, toyMat, rbox, mesh, labelTexture } from './simulator/airport-shared/style.js'
import { BOARD, BODY } from './layout.js'
import { solve2, legJoints } from './ik.js'

export { BOARD, BODY }

const SKIN = '#e0a98a'
const X = new THREE.Vector3(1, 0, 0)
const Y = new THREE.Vector3(0, 1, 0)
const Z = new THREE.Vector3(0, 0, 1)

export function buildBoard({ number = '0712', bottom = TOY.yellow } = {}) {
  const B = BOARD
  const g = new THREE.Group()
  g.name = 'board'
  const deck = toyMat(bottom, { paint: true, rough: 0.5 })
  const grip = toyMat(TOY.navy, { rough: 0.9 })
  const steel = toyMat('#c3cbe3', { rough: 0.4, metal: 0.2 })
  const shade = toyMat(TOY.shade, { rough: 0.55 })
  const wheel = toyMat(TOY.white, { rough: 0.45 })
  const bush = toyMat(TOY.blue, { rough: 0.6 })

  // the flat middle and the two kicks, each a rounded slab with its grip on top
  const slab = (len, cx, cy, rot) => {
    const s = new THREE.Group()
    s.add(mesh(rbox(len, B.deck, B.W, 0.014), deck, 0, -B.deck / 2, 0))
    s.add(mesh(rbox(len - 0.02, 0.006, B.W - 0.012, 0.003), grip, 0, 0.001, 0))
    s.position.set(cx, cy, 0)
    s.rotation.z = rot
    g.add(s)
  }
  slab(2 * B.flat + 0.02, 0, 0, 0)
  for (const sx of [1, -1]) {
    const a = B.kickAngle
    // the kick hinges on the end of the flat part and rises at 19 degrees
    slab(B.kick, sx * (B.flat + (Math.cos(a) * B.kick) / 2), (Math.sin(a) * B.kick) / 2, sx * a)
  }
  // the deck's graphic, under the flat part: the line's wordmark and the deck number
  const print = labelTexture(`TRICKLINE · ${number}`, {
    color: TOY.navy,
    w: 1024,
    h: 160,
    font: 'italic 800 104px Inter, system-ui, sans-serif',
  })
  const label = new THREE.Mesh(
    new THREE.PlaneGeometry(0.5, 0.078).rotateX(Math.PI / 2),
    new THREE.MeshStandardMaterial({ map: print, transparent: true, roughness: 0.6 })
  )
  label.position.set(0, -B.deck - 0.0015, 0)
  label.rotation.y = Math.PI // reads the right way round from the toe side
  g.add(label)

  for (const sx of [1, -1]) {
    const x = sx * B.truckX
    g.add(mesh(rbox(0.11, 0.014, 0.08, 0.005), shade, x, -B.deck - 0.007, 0)) // baseplate
    g.add(
      mesh(
        new THREE.CylinderGeometry(0.02, 0.02, 0.028, 14),
        bush,
        x - sx * 0.012,
        -B.deck - 0.026,
        0
      )
    ) // bushings
    g.add(mesh(rbox(0.05, 0.03, 0.2, 0.012), steel, x, B.axleY + 0.006, 0)) // hanger
    const axle = mesh(new THREE.CylinderGeometry(0.007, 0.007, 0.25, 8), steel, x, B.axleY, 0)
    axle.rotation.x = Math.PI / 2
    g.add(axle)
    for (const sz of [1, -1]) {
      const w = mesh(
        new THREE.CylinderGeometry(B.wheelR, B.wheelR, B.wheelW, 22),
        wheel,
        x,
        B.axleY,
        sz * B.wheelZ
      )
      w.rotation.x = Math.PI / 2
      g.add(w)
    }
  }
  return { group: g }
}

export function buildRider({
  tee = TOY.white,
  number = '07',
  cap = TOY.blue,
  ink = TOY.blue,
} = {}) {
  const g = new THREE.Group()
  g.name = 'rider'
  const M = {
    tee: toyMat(tee, { paint: true, rough: 0.62 }),
    pants: toyMat(TOY.navy, { rough: 0.72 }),
    skin: toyMat(SKIN, { rough: 0.62 }),
    shoe: toyMat(TOY.white, { rough: 0.55 }),
    sole: toyMat(TOY.navy, { rough: 0.8 }),
    cap: toyMat(cap, { paint: true, rough: 0.5 }),
    eye: toyMat(TOY.navy, { rough: 0.4 }),
  }
  const part = (geo, mat) => {
    const m = mesh(geo, mat)
    g.add(m)
    return m
  }
  const cap1 = (r, len, mat) => part(new THREE.CapsuleGeometry(r, len, 6, 14), mat)

  // feet: a group each, origin at the middle of the sole, +x where the toes point
  const foot = () => {
    const f = new THREE.Group()
    f.add(mesh(rbox(0.275, 0.024, 0.118, 0.01), M.sole, 0, 0.012, 0))
    f.add(mesh(rbox(0.255, 0.078, 0.11, 0.035), M.shoe, -0.008, 0.06, 0))
    g.add(f)
    return f
  }
  const feet = [foot(), foot()]
  const shins = [cap1(0.06, BODY.shin, M.pants), cap1(0.06, BODY.shin, M.pants)]
  const thighs = [cap1(0.074, BODY.thigh, M.pants), cap1(0.074, BODY.thigh, M.pants)]
  const knees = [
    part(new THREE.SphereGeometry(0.066, 16, 12), M.pants),
    part(new THREE.SphereGeometry(0.066, 16, 12), M.pants),
  ]
  const pelvis = part(rbox(0.34, 0.17, 0.23, 0.07), M.pants)
  const torso = part(rbox(...BODY.torso, 0.09), M.tee)
  const print = new THREE.Mesh(
    new THREE.PlaneGeometry(0.16, 0.16),
    new THREE.MeshStandardMaterial({
      map: labelTexture(number, {
        color: ink,
        w: 256,
        h: 256,
        font: 'italic 800 170px Inter, system-ui, sans-serif',
      }),
      transparent: true,
      roughness: 0.6,
    })
  )
  g.add(print)
  const shoulders = [
    part(new THREE.SphereGeometry(0.075, 16, 12), M.tee),
    part(new THREE.SphereGeometry(0.075, 16, 12), M.tee),
  ]
  const uppers = [cap1(0.054, BODY.upper, M.skin), cap1(0.054, BODY.upper, M.skin)]
  const sleeves = [cap1(0.066, 0.1, M.tee), cap1(0.066, 0.1, M.tee)]
  const fores = [cap1(0.047, BODY.fore, M.skin), cap1(0.047, BODY.fore, M.skin)]
  const hands = [
    part(new THREE.SphereGeometry(0.056, 14, 10), M.skin),
    part(new THREE.SphereGeometry(0.056, 14, 10), M.skin),
  ]
  const neck = cap1(0.05, BODY.neck, M.skin)
  // the head: a group with +x the way the face looks
  const head = new THREE.Group()
  head.add(mesh(new THREE.SphereGeometry(BODY.head, 26, 18), M.skin))
  const crown = mesh(
    new THREE.SphereGeometry(BODY.head + 0.012, 26, 14, 0, Math.PI * 2, 0, Math.PI * 0.5),
    M.cap
  )
  crown.position.y = 0.02
  crown.rotation.z = -0.18 // tipped back a little, the cap sits high on the forehead
  head.add(crown)
  head.add(mesh(rbox(0.13, 0.018, 0.2, 0.008), M.cap, BODY.head * 0.92, 0.035, 0))
  for (const s of [-1, 1])
    head.add(
      mesh(new THREE.SphereGeometry(0.019, 10, 8), M.eye, BODY.head * 0.93, -0.012, s * 0.055)
    )
  g.add(head)

  // scratch vectors
  const v = () => new THREE.Vector3()
  const fwd = v()
  const sideT = v()
  const upT = v()
  const fwdT = v()
  const q = new THREE.Quaternion()
  const m4 = new THREE.Matrix4()
  const elbow = v()

  const between = (m, a, b) => {
    m.position.addVectors(a, b).multiplyScalar(0.5)
    const d = new THREE.Vector3().subVectors(b, a)
    m.quaternion.setFromUnitVectors(Y, d.normalize())
  }
  const frame = (o, xAxis, yAxis) => {
    const z = new THREE.Vector3().crossVectors(xAxis, yAxis).normalize()
    const y = new THREE.Vector3().crossVectors(z, xAxis).normalize()
    m4.makeBasis(xAxis.clone().normalize(), y, z)
    o.quaternion.setFromRotationMatrix(m4)
  }

  const pose = (P) => {
    const side = P.side.clone().normalize()
    const up = P.up.clone().normalize()
    fwd.crossVectors(side, up).normalize()
    // pelvis
    pelvis.position.copy(P.pelvis)
    frame(pelvis, side, up)
    // the chest: twist about up, lean toward the front, bank toward the left hip
    q.setFromAxisAngle(up, P.twist ?? 0)
    sideT.copy(side).applyQuaternion(q)
    fwdT.copy(fwd).applyQuaternion(q)
    upT.copy(up)
    if (P.lean) {
      q.setFromAxisAngle(sideT, P.lean)
      upT.applyQuaternion(q)
      fwdT.applyQuaternion(q)
    }
    if (P.bank) {
      q.setFromAxisAngle(fwdT, P.bank)
      upT.applyQuaternion(q)
      sideT.applyQuaternion(q)
    }
    const [tw, th] = BODY.torso
    const base = P.pelvis.clone().addScaledVector(up, BODY.spine)
    torso.position.copy(base).addScaledVector(upT, th / 2)
    frame(torso, sideT, upT)
    print.position
      .copy(torso.position)
      .addScaledVector(fwdT, BODY.torso[2] / 2 + 0.002)
      .addScaledVector(upT, 0.06)
    frame(print, sideT.clone().negate(), upT)
    print.quaternion.multiply(q.setFromAxisAngle(Y, Math.PI / 2)) // the plane's +z to the chest's front
    const neckBase = base.clone().addScaledVector(upT, th - 0.02)
    const neckTop = neckBase.clone().addScaledVector(upT, BODY.neck)
    between(neck, neckBase, neckTop)
    // the head looks at P.look, turned no further than the neck allows
    head.position.copy(neckTop).addScaledVector(upT, BODY.head * 0.92)
    const look = P.look ? P.look.clone().sub(head.position) : fwdT.clone()
    look.addScaledVector(upT, -look.dot(upT)).normalize()
    if (look.dot(fwdT) < -0.2) look.addScaledVector(fwdT, -look.dot(fwdT) - 0.2).normalize()
    look.addScaledVector(upT, -0.25).normalize() // eyes a little down, at the board and the spot
    frame(head, look, upT)

    // legs: hip -> knee -> ankle, the knees out toward the chest (ik.js, shared with the clearance sweep)
    for (let i = 0; i < 2; i++) {
      const L = legJoints(P, i, BODY)
      between(thighs[i], L.hip, L.knee)
      between(shins[i], L.knee, L.ankle)
      knees[i].position.copy(L.knee)
      // the foot hangs from the ankle the leg could reach
      const ff = feet[i]
      ff.position
        .copy(L.ankle)
        .addScaledVector(L.dir, -BODY.ankle[0])
        .addScaledVector(L.fu, -BODY.ankle[1])
      frame(ff, L.dir, L.fu)
    }
    // arms: shoulder -> elbow -> wrist, elbows down and back
    for (let i = 0; i < 2; i++) {
      const s = i === 0 ? 1 : -1
      const sh = base
        .clone()
        .addScaledVector(upT, th - 0.09)
        .addScaledVector(sideT, s * BODY.shoulder)
      shoulders[i].position.copy(sh)
      const target =
        P.hands?.[i] ??
        sh
          .clone()
          .addScaledVector(upT, -0.5)
          .addScaledVector(sideT, s * 0.08)
          .addScaledVector(fwdT, 0.05)
      const pole = upT
        .clone()
        .multiplyScalar(-0.6)
        .addScaledVector(fwdT, -0.5)
        .addScaledVector(sideT, s * 0.4)
      const wrist = solve2(sh, target, BODY.upper, BODY.fore, pole, elbow)
      between(uppers[i], sh, elbow)
      const sleeveEnd = sh.clone().lerp(elbow, 0.42)
      between(sleeves[i], sh, sleeveEnd)
      between(fores[i], elbow, wrist)
      hands[i].position
        .copy(wrist)
        .addScaledVector(new THREE.Vector3().subVectors(wrist, elbow).normalize(), 0.03)
    }
  }
  // a standing pose so the model has a shape before the first frame (thumbnails)
  pose({
    pelvis: new THREE.Vector3(0, 0.98, 0),
    side: X,
    up: Y,
    look: new THREE.Vector3(2, 1.6, 3),
    feet: [
      { pos: new THREE.Vector3(0.2, 0, 0.02), dir: Z.clone().applyAxisAngle(Y, 0.4), up: Y },
      { pos: new THREE.Vector3(-0.22, 0, 0.02), dir: Z.clone(), up: Y },
    ],
    hands: null,
  })
  return { group: g, pose }
}
