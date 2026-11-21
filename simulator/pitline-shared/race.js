// Pitline's race, as pure functions of time. No three.js and no DOM here, so the same code runs the page, the
// collision sweep and the checks in Node.
//
// A path is a smooth curve through control points (centripetal Catmull-Rom), resampled every DS metres. A speed
// profile on a path is the fastest a car can go at each point: capped by the corner (v = sqrt(alat / curvature)), by a
// limit (the pit lane's limiter, a stop in a box), and by how hard it can accelerate and brake (a forward and a
// backward pass). The time table integrates the profile with dt = 2 ds / (v0 + v1), which is exact for constant
// acceleration and stays finite when a car brakes to a standstill. Inverting it gives the distance along the path at
// any time, so every car is placed from scratch every frame.

export const DS = 0.5;

/** dense points [[x, z]] through control points, centripetal Catmull-Rom */
export function catmull(pts, closed = false, per = 24) {
  const P = closed ? pts : [pts[0], ...pts, pts[pts.length - 1]];
  const n = P.length;
  const out = [];
  const segs = closed ? n : n - 3;
  const at = (i) => P[((i % n) + n) % n];
  const knot = (a, b) => Math.pow(Math.hypot(b[0] - a[0], b[1] - a[1]), 0.5) || 1e-4;
  for (let s = 0; s < segs; s++) {
    const i = closed ? s : s + 1;
    const p0 = at(i - 1);
    const p1 = at(i);
    const p2 = at(i + 1);
    const p3 = at(i + 2);
    const t0 = 0;
    const t1 = t0 + knot(p0, p1);
    const t2 = t1 + knot(p1, p2);
    const t3 = t2 + knot(p2, p3);
    for (let k = 0; k < per; k++) {
      const t = t1 + ((t2 - t1) * k) / per;
      const q = [0, 1].map((c) => {
        const A1 = ((t1 - t) / (t1 - t0)) * p0[c] + ((t - t0) / (t1 - t0)) * p1[c];
        const A2 = ((t2 - t) / (t2 - t1)) * p1[c] + ((t - t1) / (t2 - t1)) * p2[c];
        const A3 = ((t3 - t) / (t3 - t2)) * p2[c] + ((t - t2) / (t3 - t2)) * p3[c];
        const B1 = ((t2 - t) / (t2 - t0)) * A1 + ((t - t0) / (t2 - t0)) * A2;
        const B2 = ((t3 - t) / (t3 - t1)) * A2 + ((t - t1) / (t3 - t1)) * A3;
        return ((t2 - t) / (t2 - t1)) * B1 + ((t - t1) / (t2 - t1)) * B2;
      });
      out.push(q);
    }
  }
  if (!closed) out.push(pts[pts.length - 1]);
  return out;
}

/** a path resampled every DS metres: x, z, heading tangent, signed curvature, length; at(s) interpolates */
export function makePath(dense, closed = false) {
  const cum = [0];
  for (let i = 1; i < dense.length; i++) cum.push(cum[i - 1] + Math.hypot(dense[i][0] - dense[i - 1][0], dense[i][1] - dense[i - 1][1]));
  let total = cum[cum.length - 1];
  if (closed) total += Math.hypot(dense[0][0] - dense[dense.length - 1][0], dense[0][1] - dense[dense.length - 1][1]);
  const ring = closed ? [...dense, dense[0]] : dense;
  const ringCum = closed ? [...cum, total] : cum;
  const n = Math.floor(total / DS) + 1;
  const X = new Float64Array(n);
  const Z = new Float64Array(n);
  let j = 0;
  for (let i = 0; i < n; i++) {
    const s = Math.min(i * DS, total);
    while (j < ringCum.length - 2 && ringCum[j + 1] < s) j++;
    const k = (s - ringCum[j]) / (ringCum[j + 1] - ringCum[j] || 1);
    X[i] = ring[j][0] + (ring[j + 1][0] - ring[j][0]) * k;
    Z[i] = ring[j][1] + (ring[j + 1][1] - ring[j][1]) * k;
  }
  const idx = (i) => (closed ? ((i % n) + n) % n : Math.min(n - 1, Math.max(0, i)));
  const TX = new Float64Array(n);
  const TZ = new Float64Array(n);
  const K = new Float64Array(n);
  for (let i = 0; i < n; i++) {
    const a = idx(i - 2);
    const b = idx(i + 2);
    const dx = X[b] - X[a];
    const dz = Z[b] - Z[a];
    const l = Math.hypot(dx, dz) || 1;
    TX[i] = dx / l;
    TZ[i] = dz / l;
  }
  // curvature from the turn of the heading over +-4 m, smoothed
  const W = 8;
  for (let i = 0; i < n; i++) {
    const a = idx(i - W);
    const b = idx(i + W);
    let d = Math.atan2(TZ[b], TX[b]) - Math.atan2(TZ[a], TX[a]);
    while (d > Math.PI) d -= 2 * Math.PI;
    while (d < -Math.PI) d += 2 * Math.PI;
    K[i] = d / (2 * W * DS);
  }
  const L = closed ? n * DS : total;
  const wrap = (s) => (closed ? ((s % L) + L) % L : Math.min(Math.max(s, 0), total));
  const sample = (A, s) => {
    const f = wrap(s) / DS;
    const i = Math.floor(f);
    const k = f - i;
    return A[idx(i)] + (A[idx(i + 1)] - A[idx(i)]) * k;
  };
  return {
    X, Z, TX, TZ, K, n, L, closed,
    /** {x, z, tx, tz, k} at distance s */
    at(s) {
      const tx = sample(TX, s);
      const tz = sample(TZ, s);
      const l = Math.hypot(tx, tz) || 1;
      return {x: sample(X, s), z: sample(Z, s), tx: tx / l, tz: tz / l, k: sample(K, s)};
    },
    /** nearest sample index to (x, z) */
    nearest(x, z, from = 0, to = n) {
      let best = from;
      let bd = Infinity;
      for (let i = from; i < to; i++) {
        const d = (X[i] - x) ** 2 + (Z[i] - z) ** 2;
        if (d < bd) {
          bd = d;
          best = i;
        }
      }
      return best;
    },
  };
}

/**
 * The fastest speed at every sample: min(vtop, corner limit, limit(s)), then accelerate forward at acc and brake
 * backward at brk. v0 / v1 pin the speed at the ends of an open path (a pit path joins the track at track speed).
 */
export function profile(path, {vtop, alat, acc, brk, limit = null, v0 = null, v1 = null, laps = 3}) {
  const {n, K, closed} = path;
  const cap = new Float64Array(n);
  for (let i = 0; i < n; i++) {
    const k = Math.abs(K[i]);
    cap[i] = Math.min(vtop, k > 1e-6 ? Math.sqrt(alat / k) : vtop, limit ? limit(i * DS) : Infinity);
  }
  if (v0 != null) cap[0] = Math.min(cap[0], v0);
  if (v1 != null) cap[n - 1] = Math.min(cap[n - 1], v1);
  const v = Float64Array.from(cap);
  // a closed lap runs the passes round a few times so the start line settles
  const reps = closed ? laps : 1;
  for (let r = 0; r < reps; r++) {
    for (let j = 1; j < n * (closed ? 1 : 1) + (closed ? 1 : 0); j++) {
      const i = j % n;
      const p = (j - 1) % n;
      v[i] = Math.min(v[i], Math.sqrt(v[p] * v[p] + 2 * acc * DS));
    }
    for (let j = closed ? n : n - 2; j >= 0; j--) {
      const i = ((j % n) + n) % n;
      const q = (i + 1) % n;
      if (!closed && i === n - 1) continue;
      v[i] = Math.min(v[i], Math.sqrt(v[q] * v[q] + 2 * brk * DS));
    }
  }
  return v;
}

/** cumulative time at every sample of a speed profile (a closed lap gets one more entry: the full lap) */
export function timeTable(v, closed = false) {
  const n = v.length;
  const T = new Float64Array(closed ? n + 1 : n);
  for (let i = 1; i < T.length; i++) {
    const a = v[(i - 1) % n];
    const b = v[i % n];
    T[i] = T[i - 1] + (2 * DS) / Math.max(a + b, 1e-6);
  }
  return T;
}

/** distance and speed at time t on a profile with time table T (constant acceleration inside a sample) */
export function sAt(T, v, t) {
  const n = v.length;
  if (t <= 0) return {s: 0, v: v[0], a: 0};
  if (t >= T[T.length - 1]) return {s: (T.length - 1) * DS, v: v[(T.length - 1) % n], a: 0};
  let lo = 0;
  let hi = T.length - 1;
  while (hi - lo > 1) {
    const m = (lo + hi) >> 1;
    if (T[m] <= t) lo = m;
    else hi = m;
  }
  const va = v[lo % n];
  const vb = v[hi % n];
  const a = (vb * vb - va * va) / (2 * DS);
  const tau = t - T[lo];
  return {s: lo * DS + va * tau + 0.5 * a * tau * tau, v: va + a * tau, a};
}

/** time at distance s on a time table */
export function tAt(T, s) {
  const f = Math.min(Math.max(s / DS, 0), T.length - 1);
  const i = Math.floor(f);
  return T[i] + (T[Math.min(i + 1, T.length - 1)] - T[i]) * (f - i);
}
