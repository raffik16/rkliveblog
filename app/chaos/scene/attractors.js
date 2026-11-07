// Five strange attractors, integrated once at load. Each is a deterministic system of three ODEs that never settles
// and never repeats: the storm the machines run inside. Every trajectory is sampled at a fixed time step (so a particle
// riding it speeds up exactly where the real system does), re-centred, turned upright and scaled to one common radius.
// The largest Lyapunov exponent is measured the same way (Benettin: two neighbours a hair apart, renormalised every
// step), so the number on screen comes from the same integrator that draws the shape.

export const L = 16384 // samples per trajectory
export const RADIUS = 8 // world units the attractor is scaled to

const SYSTEMS = [
  {
    key: 'lorenz',
    name: 'Lorenz',
    params: 'σ 10 · ρ 28 · β 8/3',
    f: (x, y, z, o) => {
      o[0] = 10 * (y - x)
      o[1] = x * (28 - z) - y
      o[2] = x * y - (8 / 3) * z
    },
    p0: [0.1, 0, 0],
    dt: 0.0055,
    lyT: 200,
    // (x, y, z) -> world: the butterfly stands up, its two wings (the lobes round C+ and C-) left and right
    axes: (x, y, z) => [(x + y) * Math.SQRT1_2, z, (x - y) * Math.SQRT1_2],
  },
  {
    key: 'aizawa',
    name: 'Aizawa',
    params: 'a .95 · b .7 · c .6 · d 3.5 · e .25 · f .1',
    f: (x, y, z, o) => {
      o[0] = (z - 0.7) * x - 3.5 * y
      o[1] = 3.5 * x + (z - 0.7) * y
      o[2] =
        0.6 + 0.95 * z - (z * z * z) / 3 - (x * x + y * y) * (1 + 0.25 * z) + 0.1 * z * x * x * x
    },
    p0: [0.1, 0, 0],
    dt: 0.011,
    lyT: 1500,
    axes: (x, y, z) => [x, z, y],
  },
  {
    key: 'thomas',
    name: 'Thomas',
    params: 'b 0.1998',
    f: (x, y, z, o) => {
      const b = 0.1998
      o[0] = Math.sin(y) - b * x
      o[1] = Math.sin(z) - b * y
      o[2] = Math.sin(x) - b * z
    },
    p0: [1.1, 1.1, -0.01],
    dt: 0.07,
    lyT: 2000,
    axes: (x, y, z) => [x, y, z],
  },
  {
    key: 'halvorsen',
    name: 'Halvorsen',
    params: 'a 1.27',
    f: (x, y, z, o) => {
      const a = 1.27
      o[0] = -a * x - 4 * y - 4 * z - y * y
      o[1] = -a * y - 4 * z - 4 * x - z * z
      o[2] = -a * z - 4 * x - 4 * y - x * x
    },
    p0: [-1.48, -1.51, 2.04],
    dt: 0.0065,
    lyT: 200,
    axes: (x, y, z) => [x, y, z],
  },
  {
    key: 'rossler',
    name: 'Rössler',
    params: 'a .2 · b .2 · c 5.7',
    f: (x, y, z, o) => {
      o[0] = -y - z
      o[1] = x + 0.2 * y
      o[2] = 0.2 + z * (x - 5.7)
    },
    p0: [1, 1, 0],
    dt: 0.032,
    lyT: 2000,
    axes: (x, y, z) => [x, z * 0.55, y],
  },
]

// one classical Runge-Kutta step of size h, in place
function rk4(f, p, h, k) {
  const [k1, k2, k3, k4, q] = k
  f(p[0], p[1], p[2], k1)
  for (let i = 0; i < 3; i++) q[i] = p[i] + (h / 2) * k1[i]
  f(q[0], q[1], q[2], k2)
  for (let i = 0; i < 3; i++) q[i] = p[i] + (h / 2) * k2[i]
  f(q[0], q[1], q[2], k3)
  for (let i = 0; i < 3; i++) q[i] = p[i] + h * k3[i]
  f(q[0], q[1], q[2], k4)
  for (let i = 0; i < 3; i++) p[i] += (h / 6) * (k1[i] + 2 * k2[i] + 2 * k3[i] + k4[i])
}
const scratch = () => [0, 1, 2, 3, 4].map(() => new Float64Array(3))

/** The largest Lyapunov exponent, per unit of the system's own time. */
function lyapunov(sys, start) {
  const k = scratch()
  const h = sys.dt
  const a = Float64Array.from(start)
  const d0 = 1e-8
  const b = Float64Array.from([a[0] + d0, a[1], a[2]])
  let sum = 0
  const steps = Math.round(sys.lyT / h)
  for (let n = 0; n < steps; n++) {
    rk4(sys.f, a, h, k)
    rk4(sys.f, b, h, k)
    const dx = b[0] - a[0]
    const dy = b[1] - a[1]
    const dz = b[2] - a[2]
    const d = Math.hypot(dx, dy, dz) || d0
    sum += Math.log(d / d0)
    for (let i = 0; i < 3; i++) b[i] = a[i] + ((b[i] - a[i]) * d0) / d
  }
  return sum / (steps * h)
}

function build(sys) {
  const k = scratch()
  const sub = 4
  const h = sys.dt / sub
  const p = Float64Array.from(sys.p0)
  // fall onto the attractor first
  for (let n = 0; n < 6000 * sub; n++) rk4(sys.f, p, h, k)
  const start = Float64Array.from(p)
  const raw = new Float64Array(L * 3)
  for (let n = 0; n < L; n++) {
    const [x, y, z] = sys.axes(p[0], p[1], p[2])
    raw[n * 3] = x
    raw[n * 3 + 1] = y
    raw[n * 3 + 2] = z
    for (let s = 0; s < sub; s++) rk4(sys.f, p, h, k)
  }
  // centre on the mean, scale so 98% of the samples sit inside RADIUS
  const c = [0, 0, 0]
  for (let n = 0; n < L; n++) for (let i = 0; i < 3; i++) c[i] += raw[n * 3 + i] / L
  const dist = new Float64Array(L)
  for (let n = 0; n < L; n++)
    dist[n] = Math.hypot(raw[n * 3] - c[0], raw[n * 3 + 1] - c[1], raw[n * 3 + 2] - c[2])
  const sorted = Float64Array.from(dist).sort()
  const scale = RADIUS / sorted[Math.floor(L * 0.98)]
  const pos = new Float32Array(L * 3)
  for (let n = 0; n < L; n++)
    for (let i = 0; i < 3; i++) pos[n * 3 + i] = (raw[n * 3 + i] - c[i]) * scale
  // speed along the curve, 0..1 against the system's own fast end (the 96th percentile)
  const spd = new Float32Array(L)
  for (let n = 0; n < L; n++) {
    const m = (n + 1) % L
    spd[n] = Math.hypot(
      pos[m * 3] - pos[n * 3],
      pos[m * 3 + 1] - pos[n * 3 + 1],
      pos[m * 3 + 2] - pos[n * 3 + 2]
    )
  }
  spd[L - 1] = spd[L - 2] // the seam is not a real step
  const ss = Float32Array.from(spd).sort()
  const top = ss[Math.floor(L * 0.96)] || 1
  for (let n = 0; n < L; n++) spd[n] = Math.min(1, spd[n] / top)
  return {
    key: sys.key,
    name: sys.name,
    params: sys.params,
    pos,
    spd,
    lambda: lyapunov(sys, start),
  }
}

/** Every attractor, built once. */
export function buildAttractors() {
  return SYSTEMS.map(build)
}

/** The attractors' names, in build order, and one of them built on its own (the loader reports them one by one). */
export const ATTRACTOR_NAMES = SYSTEMS.map((s) => s.name)
export const buildAttractor = (i) => build(SYSTEMS[i])

/** Position on attractor `a` at curve parameter u (0..1), linear between samples, written into out. */
export function sampleAt(a, u, out) {
  const f = (((u % 1) + 1) % 1) * L
  const n = Math.floor(f)
  const k = f - n
  const m = (n + 1) % L
  const P = a.pos
  out[0] = P[n * 3] + (P[m * 3] - P[n * 3]) * k
  out[1] = P[n * 3 + 1] + (P[m * 3 + 1] - P[n * 3 + 1]) * k
  out[2] = P[n * 3 + 2] + (P[m * 3 + 2] - P[n * 3 + 2]) * k
  return out
}
