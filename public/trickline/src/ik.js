// Two-bone IK for the legs and arms (and the clearance sweep, which rebuilds the legs to test them).
import * as THREE from 'three'

const X = new THREE.Vector3(1, 0, 0)
const Y = new THREE.Vector3(0, 1, 0)

/** knee (or elbow) of a two-bone chain from a to b with segment lengths l1, l2, bending toward pole */
export function solve2(a, b, l1, l2, pole, out) {
  const d = new THREE.Vector3().subVectors(b, a)
  let L = d.length()
  const max = l1 + l2 - 1e-4
  if (L > max) {
    d.multiplyScalar(max / L)
    L = max
  }
  L = Math.max(L, Math.abs(l1 - l2) + 1e-3)
  const u = d.clone().normalize()
  const along = (l1 * l1 - l2 * l2 + L * L) / (2 * L)
  const h = Math.sqrt(Math.max(0, l1 * l1 - along * along))
  const v = pole.clone().addScaledVector(u, -pole.dot(u))
  if (v.lengthSq() < 1e-8) v.copy(Math.abs(u.y) < 0.9 ? Y : X).addScaledVector(u, -u.y)
  v.normalize()
  out.copy(a).addScaledVector(u, along).addScaledVector(v, h)
  // the reachable end (b, pulled in if the chain could not reach it)
  return a.clone().add(d)
}

/** the hip, knee and reached ankle of leg i (0 = left, the front foot) for a pose; short = how far the target
 *  ankle is out of reach (0 when the leg gets there) */
export function legJoints(P, i, BODY) {
  const side = P.side.clone().normalize()
  const up = P.up.clone().normalize()
  const fwd = new THREE.Vector3().crossVectors(side, up).normalize()
  const F = P.feet[i]
  const dir = F.dir.clone().normalize()
  const fu = F.up.clone().normalize()
  const s = i === 0 ? 1 : -1
  const hip = P.pelvis
    .clone()
    .addScaledVector(side, s * BODY.hip)
    .addScaledVector(up, -BODY.hipDrop)
  const target = F.pos
    .clone()
    .addScaledVector(dir, BODY.ankle[0])
    .addScaledVector(fu, BODY.ankle[1])
  const pole = fwd
    .clone()
    .addScaledVector(side, s * 0.25)
    .addScaledVector(up, 0.1)
  const knee = new THREE.Vector3()
  const ankle = solve2(hip, target, BODY.thigh, BODY.shin, pole, knee)
  return {
    hip,
    knee,
    ankle,
    target,
    dir,
    fu,
    short: Math.max(0, hip.distanceTo(target) - BODY.thigh - BODY.shin),
  }
}
