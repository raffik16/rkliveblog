// Saturn V, Apollo 11 (SA-506): the math. One input, mission time t in seconds from liftoff, and every
// pose and readout as a function of it. No three.js in here.
//
// Event times are the Apollo 11 flight's. Stage masses, engine thrust and specific impulse are the published
// round figures. Altitude, speed, load and dynamic pressure are this model's own integration of them.

export const G0 = 9.80665;
const MU = 3.986004418e14; // m^3/s^2
const RE = 6.3781e6; // m
const V_ROT = 400; // m/s of the Earth's rotation that a 72 deg launch azimuth from 28.6 deg N keeps

// Event times, seconds from liftoff.
export const T = {
  start: -6,
  liftoff: 0,
  tower: 12,
  s1ceco: 135.2, // S-IC centre engine cutoff
  s1oeco: 161.6, // S-IC outboard engine cutoff
  sep1: 162.3, // S-IC / S-II separation
  s2ign: 164.0,
  skirt: 192.3, // S-II aft interstage ring drops
  les: 197.9, // launch escape tower jettison
  s2ceco: 460.6,
  s2shift: 498.0, // mixture ratio shift, 5.5 to 4.5
  s2oeco: 548.2,
  sep2: 549.0,
  s4ign: 552.2,
  s4cut: 699.3,
  insert: 709.3,
  end: 720,
};

// Stage data: metres, kilograms, newtons, seconds.
export const S1 = {name: 'S-IC', dry: 130000, prop: 2160000, n: 5, fSL: 6.77e6, ispSL: 263, ispVac: 304, len: 42.1, dia: 10.06};
export const S2 = {name: 'S-II', dry: 36000, prop: 444000, n: 5, fHi: 1.023e6, ispHi: 424, fLo: 0.8e6, ispLo: 428, len: 24.9, dia: 10.06};
export const S3 = {name: 'S-IVB', dry: 13500, prop: 105500, n: 1, f: 0.912e6, isp: 424, len: 17.8, dia: 6.6};
export const EXTRA = {interstage1: 5200, interstage2: 3650, iu: 2000, spacecraft: 45700, les: 4000};
export const AREA = Math.PI * (S1.dia / 2) ** 2;

const S1_MDOT = S1.fSL / (S1.ispSL * G0); // kg/s per F-1
const S1_FVAC = S1_MDOT * S1.ispVac * G0;
const S2_MDOT_HI = S2.fHi / (S2.ispHi * G0);
const S2_MDOT_LO = S2.fLo / (S2.ispLo * G0);
const S3_MDOT = S3.f / (S3.isp * G0);
export const FLOW = {f1: S1_MDOT, j2: S2_MDOT_HI, f1Vac: S1_FVAC};

// Oxidiser to fuel mass ratios, to split each stage's propellant into its two tanks.
const MIX = {s1: 2.27, s2: 5.5, s3: 5.0};

// Pitch programme: thrust angle above the local horizontal, degrees. Straight up to tower clear, a steady
// tip-over through the S-IC burn, then a linear tangent-like ramp for the two upper stages. The three
// angles were fitted so the stack arrives level at about 190 km (see fit.mjs).
export const PITCH = {s1End: 26.75, s1Pow: 0.8, upStart: 29.5, upEnd: 5.25};

const clamp01 = (x) => Math.min(1, Math.max(0, x));
const lerp = (a, b, k) => a + (b - a) * k;

export function pitchAt(t, P = PITCH) {
  if (t <= T.tower) return 90;
  if (t <= T.s1oeco) return 90 - (90 - P.s1End) * Math.pow((t - T.tower) / (T.s1oeco - T.tower), P.s1Pow);
  if (t <= T.s2ign) return P.s1End;
  return lerp(P.upStart, P.upEnd, clamp01((t - T.s2ign) / (T.s4cut - T.s2ign)));
}

/** Engines lit at time t: [F-1s, S-II J-2s, S-IVB J-2]. */
export function enginesAt(t) {
  const f1 = t < T.start + 3 ? 0 : t < T.s1ceco ? 5 : t < T.s1oeco ? 4 : 0;
  const j2 = t < T.s2ign ? 0 : t < T.s2ceco ? 5 : t < T.s2oeco ? 4 : 0;
  const j2b = t >= T.s4ign && t < T.s4cut ? 1 : 0;
  return [f1, j2, j2b];
}

/** Propellant burned per stage by time t (closed form, so render(t) stays pure). */
export function burnedAt(t) {
  const span = (a, b) => Math.max(0, Math.min(t, b) - a);
  const b1 = S1_MDOT * (5 * span(0, T.s1ceco) + 4 * span(T.s1ceco, T.s1oeco));
  const b2 =
    S2_MDOT_HI * (5 * span(T.s2ign, T.s2ceco) + 4 * span(T.s2ceco, T.s2shift)) + S2_MDOT_LO * 4 * span(T.s2shift, T.s2oeco);
  const b3 = S3_MDOT * span(T.s4ign, T.s4cut);
  return [b1, b2, b3];
}

export function massAt(t) {
  const [b1, b2, b3] = burnedAt(t);
  let m = EXTRA.iu + EXTRA.spacecraft + S3.dry + S3.prop - b3;
  if (t < T.sep2) m += S2.dry + S2.prop - b2 + EXTRA.interstage2;
  if (t < T.skirt) m += EXTRA.interstage1;
  if (t < T.les) m += EXTRA.les;
  if (t < T.sep1) m += S1.dry + S1.prop - b1;
  return m;
}

const pressure = (h) => 101325 * Math.exp(-h / 7400);
const density = (h) => 1.225 * Math.exp(-h / 7700);
const sound = (h) => Math.max(295, 340 - 0.0041 * h);
// Drag coefficient with a transonic bump.
const cd = (mach) => 0.3 + 0.25 * Math.exp(-(((mach - 1.1) / 0.45) ** 2));

export function thrustAt(t, h) {
  const [f1, j2, j2b] = enginesAt(t);
  if (f1) {
    const ramp = t < 0 ? clamp01((t - (T.start + 3)) / 2.5) : 1;
    return ramp * f1 * (S1_FVAC - (S1_FVAC - S1.fSL) * (pressure(h) / 101325));
  }
  if (j2) return j2 * (t < T.s2shift ? S2.fHi : S2.fLo);
  if (j2b) return S3.f;
  return 0;
}

/** Integrates the ascent once and returns typed arrays sampled every DT seconds from T.start to T.end. */
export const DT = 0.1;
export function integrate(P = PITCH) {
  const n = Math.round((T.end - T.start) / DT) + 1;
  const out = {
    n,
    alt: new Float32Array(n), // m
    vSpace: new Float32Array(n), // m/s, inertial
    vEarth: new Float32Array(n), // m/s, relative to the ground and air
    vr: new Float32Array(n), // m/s, climb rate
    range: new Float32Array(n), // m, downrange over the ground
    g: new Float32Array(n), // sensed load, g
    q: new Float32Array(n), // Pa
    mach: new Float32Array(n),
    mass: new Float32Array(n),
    thrust: new Float32Array(n),
    pitch: new Float32Array(n),
    path: new Float32Array(n), // flight path angle above horizontal, deg
  };
  let x = 0;
  let y = RE;
  let vx = V_ROT;
  let vy = 0;
  let ground = 0;
  for (let i = 0; i < n; i++) {
    const t = T.start + i * DT;
    const r = Math.hypot(x, y);
    const ux = x / r;
    const uy = y / r;
    const ex = uy;
    const ey = -ux;
    const h = Math.max(0, r - RE);
    const m = massAt(t);
    const F = thrustAt(t, h);
    const rot = (V_ROT * r) / RE;
    const ax_ = vx - ex * rot;
    const ay_ = vy - ey * rot;
    const va = Math.hypot(ax_, ay_);
    const q = 0.5 * density(h) * va * va;
    const mach = va / sound(h);
    const D = q * cd(mach) * AREA;
    const th = (pitchAt(t, P) * Math.PI) / 180;
    const tx = ux * Math.sin(th) + ex * Math.cos(th);
    const ty = uy * Math.sin(th) + ey * Math.cos(th);
    const vr = vx * ux + vy * uy;
    const vh = vx * ex + vy * ey;
    out.alt[i] = h;
    out.vSpace[i] = Math.hypot(vx, vy);
    out.vEarth[i] = va;
    out.vr[i] = vr;
    out.range[i] = ground;
    out.g[i] = t < 0 ? 1 : Math.max(0, F - D) / m / G0;
    out.q[i] = q;
    out.mach[i] = mach;
    out.mass[i] = m;
    out.thrust[i] = F;
    out.pitch[i] = pitchAt(t, P);
    out.path[i] = (Math.atan2(vr, vh - rot) * 180) / Math.PI;
    if (t < 0) continue; // held down until liftoff
    const gacc = MU / (r * r);
    let ax = (F * tx) / m - gacc * ux;
    let ay = (F * ty) / m - gacc * uy;
    if (va > 1e-3) {
      ax -= ((D / m) * ax_) / va;
      ay -= ((D / m) * ay_) / va;
    }
    vx += ax * DT;
    vy += ay * DT;
    x += vx * DT;
    y += vy * DT;
    ground += ((vh - rot) * DT * RE) / r;
  }
  return out;
}

/** Everything the page shows at time t, read from the table. */
export function makeModel() {
  const tab = integrate();
  const at = (arr, t) => {
    const f = clamp01((t - T.start) / (T.end - T.start)) * (tab.n - 1);
    const i = Math.min(tab.n - 2, Math.floor(f));
    return lerp(arr[i], arr[i + 1], f - i);
  };
  const peak = (arr, a, b) => {
    let best = -1;
    let bt = a;
    for (let t = a; t <= b; t += DT) {
      const v = at(arr, t);
      if (v > best) {
        best = v;
        bt = t;
      }
    }
    return {t: bt, v: best};
  };
  const maxQ = peak(tab.q, 0, T.s1oeco);
  let mach1 = 0;
  for (let t = 0; t < T.s1oeco; t += DT) {
    if (at(tab.mach, t) >= 1) {
      mach1 = t;
      break;
    }
  }
  const state = (t) => {
    const [b1, b2, b3] = burnedAt(t);
    const eng = enginesAt(t);
    const stage = t < T.sep1 ? 0 : t < T.sep2 ? 1 : 2;
    return {
      t,
      stage,
      eng,
      alt: at(tab.alt, t),
      vSpace: at(tab.vSpace, t),
      vEarth: at(tab.vEarth, t),
      vr: at(tab.vr, t),
      range: at(tab.range, t),
      g: at(tab.g, t),
      q: at(tab.q, t),
      mach: at(tab.mach, t),
      mass: massAt(t),
      thrust: at(tab.thrust, t),
      pitch: pitchAt(t),
      path: at(tab.path, t),
      // Fill of each tank, 0..1: [S-IC RP-1, S-IC LOX, S-II LH2, S-II LOX, S-IVB LH2, S-IVB LOX]
      fill: [
        1 - b1 / S1.prop, 1 - b1 / S1.prop,
        1 - b2 / S2.prop, 1 - b2 / S2.prop,
        1 - b3 / S3.prop, 1 - b3 / S3.prop,
      ],
      tons: {
        rp1: (S1.prop - b1) / (1 + MIX.s1), lox1: ((S1.prop - b1) * MIX.s1) / (1 + MIX.s1),
        lh2: (S2.prop - b2) / (1 + MIX.s2), lox2: ((S2.prop - b2) * MIX.s2) / (1 + MIX.s2),
        lh3: (S3.prop - b3) / (1 + MIX.s3), lox3: ((S3.prop - b3) * MIX.s3) / (1 + MIX.s3),
      },
      flow: eng[0] * S1_MDOT + eng[1] * (t < T.s2shift ? S2_MDOT_HI : S2_MDOT_LO) + eng[2] * S3_MDOT,
    };
  };
  return {tab, state, at, maxQ, mach1, orbitV: Math.sqrt(MU / (RE + at(tab.alt, T.s4cut)))};
}
