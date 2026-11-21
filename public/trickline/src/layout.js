// The numbers the models, the motion and the checks share: the board, the rider's body and the plaza's
// layout. Plain data and functions, no three.js, so the motion and the clearance sweep run in Node too.
// Toy metres, y up; the run goes toward +x along z = 0.

export const BOARD = {
  flat: 0.26, // half the length of the flat middle
  kick: 0.19, // length of the nose and the tail along the kick
  kickAngle: 0.33, // 19 degrees
  deck: 0.034,
  W: 0.24,
  truckX: 0.2, // the trucks' centres, either side of the middle
  wheelR: 0.036,
  wheelW: 0.04,
  wheelZ: 0.105,
  axleY: -0.08,
  grip: 0.116, // the grip's height over the ground when the board rolls
  hanger: 0.09, // the grip's height over a rail when the board grinds on its hangers
  half: 0.44, // middle to the tip of the nose or the tail, along x
}

export const BODY = {
  thigh: 0.43,
  shin: 0.43,
  hip: 0.115, // the hip joints, either side of the pelvis
  hipDrop: 0.04, // hip joints below the pelvis centre
  ankle: [-0.06, 0.085], // the ankle over the sole: back from the middle, up
  spine: 0.06, // the torso starts this far up from the pelvis centre
  torso: [0.4, 0.5, 0.25], // across, up, front to back
  shoulder: 0.2,
  upper: 0.29,
  fore: 0.27,
  neck: 0.07,
  head: 0.155,
}

export const PLAZA = {
  zMin: -4,
  zMax: 4,
  upper: { y: 2.4, x0: -52, x1: -14.0 },
  gap: { x0: -26.0, x1: -24.3, water: 2.08, floor: 1.9 },
  four: { x0: -14.0, n: 4, rise: 0.2, tread: 0.32 },
  middle: { y: 1.6, x0: -13.04, x1: 4.0 },
  ten: { x0: 4.0, n: 10, rise: 0.16, tread: 0.32 },
  rail: { z: -0.75, x0: 3.95, x1: 7.0, r: 0.025, posts: [3.95, 5.44, 7.0] },
  lower: { x0: 6.88, x1: 44 },
}
export const RAIL_SLOPE = Math.atan(0.5)

/** the top of the handrail's tube at x (null off its ends) */
export function railTop(x) {
  const R = PLAZA.rail
  if (x < R.x0 || x > R.x1) return null
  return 2.32 - 0.5 * (x - PLAZA.ten.x0)
}

/** the height of whatever you would stand on at (x, z) */
export function surfaceAt(x, z = 0) {
  const P = PLAZA
  if (z < P.zMin || z > P.zMax || x < P.upper.x0) return 0
  if (x < P.four.x0) return x > P.gap.x0 && x < P.gap.x1 ? P.gap.water : P.upper.y
  const f = P.four
  if (x < f.x0 + (f.n - 1) * f.tread)
    return P.upper.y - f.rise * (Math.floor((x - f.x0) / f.tread) + 1)
  if (x < P.ten.x0) return P.middle.y
  const t = P.ten
  if (x < t.x0 + (t.n - 1) * t.tread)
    return P.middle.y - t.rise * (Math.floor((x - t.x0) / t.tread) + 1)
  return 0
}

/** a solid's top under (x, z): like surfaceAt, but the channel's floor where surfaceAt gives the water */
export function solidAt(x, z = 0) {
  const P = PLAZA
  if (z >= P.zMin && z <= P.zMax && x > P.gap.x0 && x < P.gap.x1) return P.gap.floor
  return surfaceAt(x, z)
}
