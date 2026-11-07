// Hot dog drones: whole robot dogs flying in the space between the storm and the city, each carried by a quadcopter
// frame (four motors, green LEDs forward and red aft, rotors spinning to a blur), on its own slow orbit, nose along
// its course, banking into the turn and bobbing as it holds altitude. Four big ones, heavy-lift drones, cruise over
// the rooftops with their nav lights fading on the bar. All of it a smooth function of time. Anything the camera
// comes close to shrinks away before it can fill the lens.
import * as THREE from 'three'
import { rng } from '../../teardown/kit/util.js'
import { Mesher, selfLit } from './mesher.js'
import { droneFrame, rotorTexture, MOTORS, ROTOR_R } from './robot.js'

const V3 = THREE.Vector3

/** dogs: low-detail whole-dog geometries (one per kind). */
export function buildDrifters(dogs, { seed = 53, perKind = 14 } = {}) {
  const r = rng(seed)
  const group = new THREE.Group()
  const mat = selfLit(
    new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.5, envMapIntensity: 0.6 }),
    { value: 0.16 }
  )
  // each kind of dog on its drone frame, one draw call
  const frame = droneFrame()
  const drones = dogs.map((g) => new Mesher().append(g).append(frame).build())
  frame.dispose()

  // the drifters: a band from just outside the stave out toward the city, from below the stave to above the storm
  const items = []
  for (const geo of drones) {
    const im = new THREE.InstancedMesh(geo, mat, perKind)
    im.instanceMatrix.setUsage(THREE.DynamicDrawUsage)
    im.frustumCulled = false
    group.add(im)
    for (let i = 0; i < perKind; i++)
      items.push({
        im,
        i,
        rad: 36 + 46 * Math.pow(r(), 0.8),
        y: -7 + 34 * r(),
        phi: r() * Math.PI * 2,
        w: (0.006 + 0.014 * r()) * (r() < 0.5 ? -1 : 1),
        bob: r() * 6.28,
        size: 22 + 20 * r(),
        spin: 30 + 8 * r(),
      })
  }

  // the heavy lifters: big drones high over the city
  const blimps = []
  const navRed = new THREE.MeshBasicMaterial({ color: '#ff2a1a' })
  const navGreen = new THREE.MeshBasicMaterial({ color: '#2aff6a' })
  const navGeo = new THREE.SphereGeometry(0.7, 10, 8)
  for (let k = 0; k < 4; k++) {
    const hold = new THREE.Group()
    const body = new THREE.Mesh(drones[k % drones.length], mat)
    const s = 190 + 40 * r()
    body.scale.setScalar(s)
    hold.add(body)
    const tail = new THREE.Mesh(navGeo, navRed)
    tail.position.set(-0.082 * s, 0.01 * s, 0)
    const nose = new THREE.Mesh(navGeo, navGreen)
    nose.position.set(0.082 * s, 0.01 * s, 0)
    hold.add(tail, nose)
    group.add(hold)
    blimps.push({
      hold,
      s,
      rad: 118 + 50 * r(),
      y: 40 + 20 * r(),
      phi: (k / 4) * Math.PI * 2 + r() * 0.8,
      w: (0.0035 + 0.003 * r()) * (k % 2 ? -1 : 1),
      bob: r() * 6.28,
      spin: 18 + 4 * r(),
    })
  }

  // the rotors, all of them in one draw: a blurred disc turning on each motor
  const rotorGeo = new THREE.CircleGeometry(ROTOR_R, 28)
  rotorGeo.rotateX(-Math.PI / 2)
  const rotorMat = new THREE.MeshBasicMaterial({
    map: rotorTexture(),
    color: '#c8d0dc',
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
  })
  const rotors = new THREE.InstancedMesh(rotorGeo, rotorMat, (items.length + blimps.length) * 4)
  rotors.instanceMatrix.setUsage(THREE.DynamicDrawUsage)
  rotors.frustumCulled = false
  rotors.renderOrder = 3
  group.add(rotors)
  const hubs = MOTORS.map(([x, y, z]) => new V3(x, y + 0.0008, z))

  const pos = new V3()
  const q = new THREE.Quaternion()
  const qs = new THREE.Quaternion()
  const sc = new V3()
  const M = new THREE.Matrix4()
  const R4 = new THREE.Matrix4()
  const E = new THREE.Euler()
  const Y = new V3(0, 1, 0)
  let nr = 0
  // the four rotors of a drone whose matrix is D; turning `a` (they counter-rotate in pairs)
  const spinRotors = (D, a) => {
    for (let k = 0; k < 4; k++) {
      qs.setFromAxisAngle(Y, (k === 0 || k === 3 ? 1 : -1) * a + k)
      R4.compose(hubs[k], qs, sc.set(1, 1, 1))
      rotors.setMatrixAt(nr++, R4.premultiply(D))
    }
  }

  /** t: seconds; beats: the beat clock; eye: the camera's position */
  const update = (t, beats, eye) => {
    nr = 0
    for (const it of items) {
      const phi = it.phi + it.w * t
      pos.set(
        it.rad * Math.cos(phi),
        it.y + 1.4 * Math.sin(t * 0.21 + it.bob),
        it.rad * Math.sin(phi)
      )
      const d = pos.distanceTo(eye)
      const near = Math.min(1, Math.max(0, (d - 4) / 9))
      const s = it.size * near * near * (3 - 2 * near)
      // nose along the course, banked into the turn, pitching a little as it holds its height
      const dir = it.w < 0 ? Math.PI : 0
      E.set(
        -0.16 * Math.sign(it.w) + 0.04 * Math.sin(t * 0.37 + it.bob),
        -(phi + Math.PI / 2) + dir + 0.06 * Math.sin(t * 0.23 + it.bob * 2),
        -0.05 + 0.05 * Math.cos(t * 0.21 + it.bob),
        'YXZ'
      )
      q.setFromEuler(E)
      sc.set(s, s, s)
      M.compose(pos, q, sc)
      it.im.setMatrixAt(it.i, M)
      spinRotors(M, it.spin * t)
    }
    for (const im of group.children) if (im.isInstancedMesh) im.instanceMatrix.needsUpdate = true

    const bar = (beats / 4) % 1
    const blink = Math.pow(0.5 + 0.5 * Math.cos(2 * Math.PI * bar), 10)
    navRed.color.setRGB(1, 0.16, 0.1).multiplyScalar(0.3 + 2.6 * blink)
    navGreen.color.setRGB(0.16, 1, 0.42).multiplyScalar(0.3 + 2.6 * blink)
    for (const b of blimps) {
      const phi = b.phi + b.w * t
      b.hold.position.set(
        b.rad * Math.cos(phi),
        b.y + 2 * Math.sin(t * 0.13 + b.bob),
        b.rad * Math.sin(phi)
      )
      // the long axis along the course, a slow pitch and roll
      const yaw = -(phi + Math.PI / 2) + (b.w < 0 ? Math.PI : 0)
      b.hold.rotation.set(0.04 * Math.sin(t * 0.17 + b.bob), yaw, 0.05 * Math.sin(t * 0.11 + b.bob))
      b.hold.updateMatrix()
      M.copy(b.hold.matrix).multiply(R4.makeScale(b.s, b.s, b.s))
      spinRotors(M, b.spin * t)
    }
    rotors.count = nr
    rotors.instanceMatrix.needsUpdate = true
  }

  return { group, update }
}
