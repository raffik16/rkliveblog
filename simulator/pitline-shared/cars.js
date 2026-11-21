// Pitline's cars and pit equipment: a modern open-wheel single-seater rebuilt in the house toy style, the loose wheels,
// the yellow pit machines that replace a pit crew (wheel carts, front and rear jacks), the release light, tyre racks in
// blankets and the team transporter. Toy proportions, generous bevels on every edge, matte paint with a soft clearcoat,
// crisp dark tyres with a compound band and light hubs, dark glass, numbers printed cleanly. Colours and materials come
// from ./style.js; the few it has no entry for are in CAR_COLORS.
//
// The geometry kit (Parts / tpl: static parts merged per material and cached per variant, prep, profile, roundedPoly,
// extrude, roller, steerer, the cab-over cab and the printed truck side) is copied from the simulator skill's
// sims/airport-shared/gse.js (MIT, Nyxera0x/simulator); loft() follows taperedSlab in airside.js, rcylG machines.js.
//
// Metres, y up, every model faces +x, the right side is +z, the origin is on the ground. Every builder returns {group, ...}.
//
//   buildRaceCar({team = 'halcyon', number = '9', compound = 'medium', scale = 1})
//     -> {group, roll(d), setSteer(a), setDRS(k), setWheelOff(i, k), setWheelVisible(i, v), setCompound(i, c), hub(i),
//         hubWorld(i), wheels, length: 8.4 * scale, scale}
//     Wheels i = 0..3: FL (2.6, 0.62, -1.22), FR (2.6, 0.62, 1.22), RL (-2.6, 0.62, -1.22), RR (-2.6, 0.62, 1.22).
//     scale is applied to group.scale, so hub(i) is in the group's UNSCALED local units (the numbers above) and
//     group.localToWorld(car.hub(i)) (or car.hubWorld(i)) is the true point at any scale; roll(d) takes the distance
//     in the parent's (world) metres. setSteer(a): a > 0 steers left. setDRS(k): the upper flap pivots up to 35 deg
//     about its trailing edge (as on the real car: the leading edge lifts and the slot gap opens). setWheelOff(i, k):
//     wheel i slides 0.9 m outward along its axle at k = 1. Jack points (unjacked): front x = 4.2, rear x = -4.0, both
//     y = 0.30 on the car's centreline. A jacked car is group.position.y = 0.32.
//   buildWheel({compound = 'medium', side = 1, front = false}) -> {group, roll(d), setCompound(c), radius: 0.62, width}
//     axle along local z; side = -1 turns it round (its outer face toward -z). front: 0.55 wide, else 0.70.
//   buildWheelCart() -> {group, roll(d), setShift(k), setCradle(y), slots: [a, b], slotX: 0.86, length: 2.6}
//     slots: Object3Ds at the wheel centres, local (0.86, y, 0.8 - 1.6k -/+ 0.8): k = 0 puts slot a on the centreline,
//     k = 1 slot b. setCradle(y) sets the slots' wheel-centre height (0.62 car down, 0.94 car jacked; default 0.62).
//     A slot's own frame is turned so a buildWheel().group added with no transform has its axle along the cart's x.
//     To serve hub H whose outward axle direction is n (car +-z), face the cart along -n and put its origin at
//     H + n * (0.9 + slotX) on the ground: the centreline slot is then exactly where setWheelOff(i, 1) leaves the wheel.
//   buildPitJack({end = 'front' | 'rear'}) -> {group, roll(d), setLift(h), length: 2.0}
//     The pad (0.30 x 0.28) is at local x = +1.0, its top at y = 0.18 + h. It meets the car's jack point (y = 0.30) at
//     h = 0.12 and has the car up 0.32 at h = 0.44 (the clamp): car.group.position.y = max(0, h - 0.12).
//     Front jack: turned to face -x, origin at car x = +5.2. Rear jack: facing +x, origin at car x = -5.0.
//   buildPitLight() -> {group, setLight('red' | 'green' | 'off')}   3 m, a stack light on a post, reads from any side
//   buildTyreRack({compound = 'medium', n = 4}) -> {group, length}  wheels in blue blankets, 2 levels, along x
//   buildTeamTruck({team = 'halcyon'}) -> {group, roll(d), setSteer(a), length: 16}
//
// Static parts are merged per material and cached per variant, so a second car only costs draw calls (about 17 per
// car: 8 static, the DRS flap, two per wheel); moving parts (wheels, the flap, the cart's carriage, the jack's pad) are
// separate meshes on shared geometry. Text uses Inter: build after document.fonts has loaded it (runSim does).
import * as THREE from 'three';
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';
import {RoundedBoxGeometry} from 'three/addons/geometries/RoundedBoxGeometry.js';
import {TOY, rbox, toyMat} from './style.js';

const PI = Math.PI;
const D2R = PI / 180;
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const lerp = (a, b, t) => a + (b - a) * t;
const V2 = (x, y) => new THREE.Vector2(x, y);
const V3 = (x, y, z) => new THREE.Vector3(x, y, z);

/** colours the shared palette has no entry for (the first ones sampled by gse.js from the reference frames) */
export const CAR_COLORS = {
  ink: '#1d2231', // suspension, intakes, the cockpit, mast and beams: the reference's near-black parts
  carbon: '#262c3e', // the floor, diffuser and beam wing
  tyre: '#1f2433',
  hub: '#c9cfdf', // the light-grey hub disc
  hubCap: '#8a94b0',
  chassis: '#2b3248',
  bumper: '#e8ecf6',
  lamp: '#fbf1d4',
  steel: '#a9b3cf',
  text: '#1d2748',
  tagline: '#6b78a3',
  signal: '#33d17a', // the release light's green (TOY.green is kept for the trees)
};
const C = CAR_COLORS;
const FONT = 'Inter, "Segoe UI", system-ui, sans-serif';

// ================================================================ materials
const paint = (color, rough = 0.5) => toyMat(color, {paint: true, rough});
let MM = null;
function mats() {
  if (MM) return MM;
  const glow = (color, emissive, k, rough = 0.35) => new THREE.MeshStandardMaterial({color, roughness: rough, emissive, emissiveIntensity: k});
  MM = {
    white: paint(TOY.white),
    panel: paint(TOY.panel),
    blue: paint(TOY.blue, 0.48),
    yellow: paint(TOY.yellow, 0.5),
    ink: toyMat(C.ink, {rough: 0.62}),
    carbon: toyMat(C.carbon, {rough: 0.58}),
    chassis: toyMat(C.chassis, {rough: 0.66}),
    hub: toyMat(C.hub, {rough: 0.42}),
    glass: toyMat(TOY.glass, {paint: true, rough: 0.12}),
    bumper: paint(C.bumper),
    steel: toyMat(C.steel, {rough: 0.42, metal: 0.25}),
    rubber: toyMat('#2a2f40', {rough: 0.85}),
    blanket: toyMat(TOY.blue, {rough: 0.9}),
    lamp: glow(C.lamp, '#fff1c8', 0.22, 0.3),
    tail: glow('#f0656a', TOY.red, 0.35, 0.3),
    rain: glow('#f0656a', TOY.red, 0.9, 0.3),
    beacon: glow('#ffb072', '#ff7a1f', 0.9, 0.3),
    redOn: glow('#ff6b6f', TOY.red, 1.6, 0.3),
    redOff: toyMat('#6a3442', {rough: 0.3}),
    greenOn: glow('#6cf0a4', C.signal, 1.4, 0.3),
    greenOff: toyMat('#2c5a48', {rough: 0.3}),
  };
  return MM;
}
/** a matte material that takes its colours from the geometry (wheels: tyre, band, hub and nut in one mesh) */
const VCM = new Map();
function vcMat(rough) {
  if (!VCM.has(rough)) VCM.set(rough, new THREE.MeshStandardMaterial({vertexColors: true, roughness: rough}));
  return VCM.get(rough);
}

// ================================================================ textures
const TEX = new Map();
function canvasTex(key, w, h, draw) {
  if (TEX.has(key)) return TEX.get(key);
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  draw(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  TEX.set(key, t);
  return t;
}
const DECALS = new Map();
/** a printed layer: the texture's alpha is the print, it never casts shadows */
function decalMat(tex, {rough = 0.5, opaque = false} = {}) {
  const key = tex.uuid + rough + opaque;
  if (DECALS.has(key)) return DECALS.get(key);
  const m = new THREE.MeshStandardMaterial({
    map: tex,
    roughness: rough,
    transparent: !opaque,
    depthWrite: opaque,
    polygonOffset: true,
    polygonOffsetFactor: -2,
    polygonOffsetUnits: -4,
  });
  m.userData.noCast = true;
  DECALS.set(key, m);
  return m;
}
/** a text plate: fg text, optional rounded bg, sized to the text */
function textTex(text, {fg = C.text, bg = null, weight = 800, px = 96, pad = 26, italic = false} = {}) {
  const key = `txt|${text}|${fg}|${bg}|${weight}|${px}|${italic}`;
  if (TEX.has(key)) return TEX.get(key);
  const font = `${italic ? 'italic ' : ''}${weight} ${px}px ${FONT}`;
  const probe = document.createElement('canvas').getContext('2d');
  probe.font = font;
  const W = Math.ceil(probe.measureText(text).width + pad * 2);
  const H = Math.ceil(px * 1.3 + pad);
  return canvasTex(key, W, H, (g) => {
    if (bg) {
      g.fillStyle = bg;
      g.beginPath();
      g.roundRect(0, 0, W, H, H * 0.22);
      g.fill();
    }
    g.fillStyle = fg;
    g.font = font;
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    g.fillText(text, W / 2, H / 2 + px * 0.04);
  });
}

// ================================================================ geometry kit (gse.js)
const GEO = new Map();
const cg = (key, make) => {
  let g = GEO.get(key);
  if (!g) GEO.set(key, (g = make()));
  return g;
};
/** a rounded box; r defaults to a generous 20% of the smallest side */
function rb(w, h, d, r) {
  r = r ?? Math.min(w, h, d) * 0.2;
  r = Math.min(r, Math.min(w, h, d) / 2 - 1e-3);
  if (r < 0.006) return cg(`b|${w}|${h}|${d}`, () => new THREE.BoxGeometry(w, h, d));
  return rbox(w, h, d, r, 3);
}
const cylG = (r0, r1, h, seg = 20) => cg(`cy|${r0}|${r1}|${h}|${seg}`, () => new THREE.CylinderGeometry(r0, r1, h, seg));
const sphere = (r) => cg(`sp|${r}`, () => new THREE.SphereGeometry(r, 24, 16));
const dome = (r) => cg(`dome|${r}`, () => new THREE.SphereGeometry(r, 18, 8, 0, PI * 2, 0, PI / 2));
/** a soft-edged cylinder (lathe with rounded rims), axis y, centred */
function rcylG(r0, r1, h, b = 0.06, seg = 28) {
  return cg(`rcyl|${r0}|${r1}|${h}|${b}|${seg}`, () => {
    const bb = Math.min(b, h / 2 - 1e-3, Math.min(r0, r1) - 1e-3);
    const pts = [V2(1e-4, -h / 2)];
    const arc = (cx, cy, a0, a1) => {
      for (let k = 0; k <= 4; k++) {
        const a = lerp(a0, a1, k / 4);
        pts.push(V2(cx + bb * Math.cos(a), cy + bb * Math.sin(a)));
      }
    };
    arc(r0 - bb, -h / 2 + bb, -PI / 2, 0);
    arc(r1 - bb, h / 2 - bb, 0, PI / 2);
    pts.push(V2(1e-4, h / 2));
    return new THREE.LatheGeometry(pts, seg);
  });
}

/**
 * A side profile x0..x1 by y0..y1 with corner radii rc = [rear-bottom, front-bottom, front-top, rear-top] and wheel
 * arches [[x, cy, R]] cut into the bottom edge. Inset by the bevel b so the extruded walls land on the outline.
 */
function profile(x0, x1, y0, y1, {arches = [], rc = [0.15, 0.15, 0.15, 0.15]} = {}, b = 0) {
  x0 += b;
  x1 -= b;
  y0 += b;
  y1 -= b;
  const [r0, r1, r2, r3] = rc.map((r) => Math.max(0.02, r - b));
  const s = new THREE.Shape();
  s.moveTo(x0 + r0, y0);
  for (const [ax, cy, R0] of [...arches].sort((p, q) => p[0] - q[0])) {
    const R = R0 + b;
    const a = Math.asin(clamp((y0 - cy) / R, -1, 1));
    s.lineTo(ax - R * Math.cos(a), y0);
    s.absarc(ax, cy, R, PI - a, a, true);
  }
  s.lineTo(x1 - r1, y0);
  s.absarc(x1 - r1, y0 + r1, r1, -PI / 2, 0, false);
  s.lineTo(x1, y1 - r2);
  s.absarc(x1 - r2, y1 - r2, r2, 0, PI / 2, false);
  s.lineTo(x0 + r3, y1);
  s.absarc(x0 + r3, y1 - r3, r3, PI / 2, PI, false);
  s.lineTo(x0, y0 + r0);
  s.absarc(x0 + r0, y0 + r0, r0, PI, PI * 1.5, false);
  return s;
}
/** a polygon with every corner rounded by r (or r[i]) */
function roundedPoly(pts, r) {
  const s = new THREE.Shape();
  const n = pts.length;
  for (let i = 0; i < n; i++) {
    const p = pts[i];
    const a = pts[(i - 1 + n) % n];
    const c = pts[(i + 1) % n];
    const ri = Array.isArray(r) ? r[i] : r;
    const da = a.clone().sub(p);
    const dc = c.clone().sub(p);
    const k = Math.min(ri, da.length() / 2, dc.length() / 2);
    const p1 = p.clone().addScaledVector(da.normalize(), k);
    const p2 = p.clone().addScaledVector(dc.normalize(), k);
    if (i === 0) s.moveTo(p1.x, p1.y);
    else s.lineTo(p1.x, p1.y);
    s.quadraticCurveTo(p.x, p.y, p2.x, p2.y);
  }
  s.closePath();
  return s;
}
/** a shape extruded `depth` along z (centred), every edge rounded by the bevel b */
function extrude(key, makeShape, depth, b = 0.12) {
  return cg(`ex|${key}|${depth}|${b}`, () => {
    const g = new THREE.ExtrudeGeometry(makeShape(), {
      depth: Math.max(0.002, depth - 2 * b),
      bevelEnabled: b > 0,
      bevelThickness: b,
      bevelSize: b,
      bevelSegments: 4,
      curveSegments: 20,
    });
    g.translate(0, 0, -(depth - 2 * b) / 2);
    return g;
  });
}
/** a shape drawn in the ground plane (shape x = x, shape y = -z) extruded h up, centred on y = 0 */
function extrudeY(key, makeShape, h, b = 0.12) {
  return cg(`exy|${key}|${h}|${b}`, () => extrude(`xy|${key}`, makeShape, h, b).clone().rotateX(-PI / 2));
}
/** a plan outline symmetric about z = 0 from its +z half [[x, z], ...] (front to back) */
const planShape = (half) => () =>
  roundedPoly([...half.map(([x, z]) => V2(x, -z)), ...[...half].reverse().map(([x, z]) => V2(x, z))], 0.12);

/**
 * A rounded box lofted along x between two sections A (rear, smaller x) and B (front): {x, w (along z), h (along y),
 * y, z (the section centre)}. Width, height and centre change linearly; the normals go through the deformation's
 * inverse transpose (as taperedSlab in airside.js), so the bevels stay soft. r is the bevel at A.
 */
function loft(key, A, B, r = 0.1) {
  return cg(`loft|${key}`, () => {
    const L = B.x - A.x;
    const rr = Math.min(r, A.h / 2 - 1e-3, A.w / 2 - 1e-3, L / 2 - 1e-3);
    const g = prep(new RoundedBoxGeometry(L, A.h, A.w, 5, rr));
    const pos = g.attributes.position;
    const nor = g.attributes.normal;
    const kq = B.h / A.h;
    const ks = B.w / A.w;
    const az = A.z ?? 0;
    const bz = B.z ?? 0;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const z = pos.getZ(i);
      const t = x / L + 0.5;
      const q = lerp(1, kq, t);
      const s = lerp(1, ks, t);
      pos.setXYZ(i, A.x + t * L, lerp(A.y, B.y, t) + y * q, lerp(az, bz, t) + z * s);
      const a = (B.y - A.y + y * (kq - 1)) / L;
      const b = (bz - az + z * (ks - 1)) / L;
      const nx = nor.getX(i);
      const ny = nor.getY(i) / q;
      const nz = nor.getZ(i) / s;
      const mx = nx - a * ny - b * nz;
      const l = Math.hypot(mx, ny, nz) || 1;
      nor.setXYZ(i, mx / l, ny / l, nz / l);
    }
    return g;
  });
}
/**
 * A sculpted body: a rounded trapezoid section swept along x through stations [{x, w, wt = w, h, y, z = 0, r = 0.6}]
 * (w the bottom width along z, wt the top width, h the height, y/z the section centre, r the corner rounding as a
 * fraction of the half size), interpolated smoothly between stations, both ends closed with a rounded bevel of radius
 * up to e (as a rounded box's). Smooth normals all round: the toy look's bevels without a single hard edge.
 */
function sweep(key, stations, {e = 0.12, slices = 40, k = 5} = {}) {
  return cg(`sweep|${key}`, () => {
    const S = stations.map((s) => ({x: s.x, w: s.w, wt: s.wt ?? s.w, h: s.h, y: s.y, z: s.z ?? 0, r: s.r ?? 0.6}));
    const P = ['w', 'wt', 'h', 'y', 'z', 'r'];
    // a cubic Hermite through the stations (finite-difference tangents), per parameter
    const at = (x) => {
      let i = 0;
      while (i < S.length - 2 && x > S[i + 1].x) i++;
      const a = S[i];
      const b = S[i + 1];
      const t = clamp((x - a.x) / (b.x - a.x), 0, 1);
      const h00 = 2 * t ** 3 - 3 * t ** 2 + 1;
      const h10 = t ** 3 - 2 * t ** 2 + t;
      const h01 = -2 * t ** 3 + 3 * t ** 2;
      const h11 = t ** 3 - t ** 2;
      const tan = (j, p) => {
        const l = S[Math.max(0, j - 1)];
        const r = S[Math.min(S.length - 1, j + 1)];
        return ((r[p] - l[p]) / (r.x - l.x)) * (b.x - a.x);
      };
      const o = {};
      for (const p of P) o[p] = h00 * a[p] + h10 * tan(i, p) + h01 * b[p] + h11 * tan(i + 1, p);
      return o;
    };
    // the section: points round a rounded trapezoid, CCW in (u = z, v = y), each with its outward normal
    const section = (s) => {
      const q = [V2(-s.w / 2, -s.h / 2), V2(s.w / 2, -s.h / 2), V2(s.wt / 2, s.h / 2), V2(-s.wt / 2, s.h / 2)];
      const rc0 = (s.r * Math.min(s.w, s.wt, s.h)) / 2;
      const pts = [];
      for (let i = 0; i < 4; i++) {
        const p = q[i];
        const u = q[(i + 3) % 4].clone().sub(p);
        const v = q[(i + 1) % 4].clone().sub(p);
        const lu = u.length();
        const lv = v.length();
        u.normalize();
        v.normalize();
        const th = Math.acos(clamp(u.dot(v), -1, 1));
        const rc = Math.min(rc0, (Math.min(lu, lv) / 2) * Math.tan(th / 2));
        const c = p.clone().addScaledVector(u.clone().add(v).normalize(), rc / Math.sin(th / 2));
        const t1 = p.clone().addScaledVector(u, rc / Math.tan(th / 2));
        const t2 = p.clone().addScaledVector(v, rc / Math.tan(th / 2));
        const a1 = Math.atan2(t1.y - c.y, t1.x - c.x);
        let da = Math.atan2(t2.y - c.y, t2.x - c.x) - a1;
        while (da > PI) da -= 2 * PI;
        while (da < -PI) da += 2 * PI;
        for (let j = 0; j <= k; j++) {
          const a = a1 + (da * j) / k;
          pts.push({u: c.x + rc * Math.cos(a), v: c.y + rc * Math.sin(a), nu: Math.cos(a), nv: Math.sin(a), rc});
        }
      }
      return pts;
    };
    const x0 = S[0].x;
    const x1 = S[S.length - 1].x;
    const rings = [];
    const ring = (x, d) => {
      const s = at(clamp(x, x0, x1));
      rings.push({x, s, pts: section(s), d});
    };
    const eOf = (s) => Math.min(e, 0.96 * (s.r * Math.min(s.w, s.wt, s.h)) / 2, (x1 - x0) / 3);
    const eA = eOf(at(x0));
    const eB = eOf(at(x1));
    const NB = 5;
    for (let j = NB; j >= 1; j--) {
      const th = (PI / 2) * (j / NB);
      ring(x0 + eA * (1 - Math.sin(th)), eA * (1 - Math.cos(th)));
    }
    for (let i = 0; i <= slices; i++) ring(lerp(x0 + eA, x1 - eB, i / slices), 0);
    for (let j = 1; j <= NB; j++) {
      const th = (PI / 2) * (j / NB);
      ring(x1 - eB * (1 - Math.sin(th)), eB * (1 - Math.cos(th)));
    }
    const N = rings[0].pts.length;
    const pos = [];
    for (const R of rings)
      for (const p of R.pts) {
        const d = Math.min(R.d, p.rc * 0.98);
        pos.push(R.x, R.s.y + p.v - p.nv * d, R.s.z + p.u - p.nu * d);
      }
    const cen = (R) => pos.push(R.x, R.s.y, R.s.z);
    cen(rings[0]);
    cen(rings[rings.length - 1]);
    const idx = [];
    for (let a = 0; a < rings.length - 1; a++)
      for (let j = 0; j < N; j++) {
        const v00 = a * N + j;
        const v01 = a * N + ((j + 1) % N);
        const v10 = (a + 1) * N + j;
        const v11 = (a + 1) * N + ((j + 1) % N);
        idx.push(v00, v10, v11, v00, v11, v01);
      }
    const c0 = rings.length * N;
    const c1 = c0 + 1;
    const last = (rings.length - 1) * N;
    for (let j = 0; j < N; j++) {
      idx.push(c0, (j + 1) % N, j);
      idx.push(c1, last + j, last + ((j + 1) % N));
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    g.setIndex(idx);
    g.computeVertexNormals();
    return g;
  });
}
/** a round tube through points (CatmullRom), open ends */
const tubeG = (key, pts, r, seg = 48) => cg(`tube|${key}`, () => new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts.map((p) => V3(...p)), false, 'centripetal'), seg, r, 12, false));

const _m = new THREE.Matrix4();
const _q = new THREE.Quaternion();
const _e = new THREE.Euler();
const _p = new THREE.Vector3();
const _s = new THREE.Vector3();
const KEEP = ['position', 'normal', 'uv'];
function prep(geo) {
  const g = geo.index ? geo.toNonIndexed() : geo.clone();
  for (const k of Object.keys(g.attributes)) if (!KEEP.includes(k)) g.deleteAttribute(k);
  if (!g.attributes.normal) g.computeVertexNormals();
  if (!g.attributes.uv) g.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(g.attributes.position.count * 2), 2));
  g.morphAttributes = {};
  g.clearGroups();
  return g;
}

/** collects transformed parts per material; merged() gives one geometry per material */
class Parts {
  constructor() {
    this.map = new Map();
  }
  put(mat, geo, m4) {
    const g = prep(geo);
    g.applyMatrix4(m4);
    if (!this.map.has(mat)) this.map.set(mat, []);
    this.map.get(mat).push(g);
    return this;
  }
  add(mat, geo, x = 0, y = 0, z = 0, rx = 0, ry = 0, rz = 0, sx = 1, sy = 1, sz = 1) {
    _e.set(rx, ry, rz);
    _q.setFromEuler(_e);
    return this.put(mat, geo, _m.compose(_p.set(x, y, z), _q, _s.set(sx, sy, sz)));
  }
  /** a rounded box between two corners */
  ext(mat, x0, x1, y0, y1, z0, z1, r) {
    return this.add(mat, rb(x1 - x0, y1 - y0, z1 - z0, r), (x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2);
  }
  /** a cylinder along 'x', 'y' or 'z' */
  cyl(mat, r0, r1, h, x, y, z, axis = 'y', seg = 20) {
    const g = cylG(r0, r1, h, seg);
    if (axis === 'x') return this.add(mat, g, x, y, z, 0, 0, -PI / 2);
    if (axis === 'z') return this.add(mat, g, x, y, z, PI / 2, 0, 0);
    return this.add(mat, g, x, y, z);
  }
  /** a soft-edged cylinder along 'x', 'y' or 'z' */
  rcyl(mat, r0, r1, h, x, y, z, axis = 'y', b = 0.06, seg = 28) {
    const g = rcylG(r0, r1, h, b, seg);
    if (axis === 'x') return this.add(mat, g, x, y, z, 0, 0, -PI / 2);
    if (axis === 'z') return this.add(mat, g, x, y, z, PI / 2, 0, 0);
    return this.add(mat, g, x, y, z);
  }
  /** a round bar between two points */
  rod(mat, a, b, r = 0.05, seg = 10) {
    const A = V3(...a);
    const d = V3(...b).sub(A);
    const len = d.length();
    _q.setFromUnitVectors(V3(0, 1, 0), d.clone().normalize());
    return this.put(mat, cylG(r, r, len, seg), _m.compose(A.addScaledVector(d, 0.5), _q, _s.set(1, 1, 1)));
  }
  /** a flat print w x h facing +z, turned by ry (and rx), uv = [x, y, w, h] of a W x H atlas (canvas px) */
  print(mat, w, h, x, y, z, ry = 0, rx = 0, rz = 0, uv = null) {
    return this.add(mat, planeUV(w, h, uv), x, y, z, rx, ry, rz);
  }
  /** a text plate of height h, facing +z turned by ry */
  text(text, opts, h, x, y, z, ry = 0) {
    const tex = textTex(text, opts);
    const a = tex.image.width / tex.image.height;
    return this.print(decalMat(tex), h * a, h, x, y, z, ry);
  }
  /** an orange beacon on a dark ring */
  beacon(x, y, z, r = 0.14) {
    const M = mats();
    this.cyl(M.ink, r * 1.05, r * 1.15, r * 0.5, x, y + r * 0.25, z, 'y', 18);
    return this.add(M.beacon, dome(r), x, y + r * 0.5, z);
  }
  merged() {
    return [...this.map].map(([mat, list]) => [mat, mergeGeometries(list, false)]);
  }
}
/** a plane w x h whose uvs show the rect [x, y, w, h] (canvas px) of a W x H texture */
function planeUV(w, h, uv) {
  const key = `pl|${w.toFixed(3)}|${h.toFixed(3)}|${uv ? uv.join(',') : ''}`;
  return cg(key, () => {
    const g = new THREE.PlaneGeometry(w, h);
    if (uv) {
      const [rx, ry, rw, rh, W, H] = uv;
      const a = g.attributes.uv;
      for (let i = 0; i < a.count; i++) a.setXY(i, (rx + a.getX(i) * rw) / W, 1 - (ry + (1 - a.getY(i)) * rh) / H);
    }
    return g;
  });
}

const TPL = new Map();
/** the static meshes of a model, built once per key and shared between copies */
function tpl(key, make, parent = new THREE.Group()) {
  let list = TPL.get(key);
  if (!list) {
    const P = new Parts();
    make(P);
    list = P.merged();
    TPL.set(key, list);
  }
  for (const [mat, geo] of list) {
    const m = new THREE.Mesh(geo, mat);
    m.castShadow = !mat.userData.noCast;
    m.receiveShadow = true;
    parent.add(m);
  }
  return parent;
}
const part = (geo, mat, parent) => {
  const m = new THREE.Mesh(geo, mat);
  m.castShadow = m.receiveShadow = true;
  if (parent) parent.add(m);
  return m;
};
const roller = (wheels) => (d) => {
  for (const w of wheels) w.rotation.z = -d / w.userData.r;
};
const steerer = (pivots) => (a) => {
  for (const p of pivots) p.rotation.y = a;
};

// ================================================================ wheels
/** a lathe about z from [[radius, axial], ...] in one colour; points run from the -z face outward round to the +z face */
function lathePiece(pts, hex, seg) {
  const g = prep(new THREE.LatheGeometry(pts.map(([r, a]) => V2(r, a)), seg).rotateX(PI / 2));
  const c = new THREE.Color(hex);
  const n = g.attributes.position.count;
  const col = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) col.set([c.r, c.g, c.b], i * 3);
  g.setAttribute('color', new THREE.BufferAttribute(col, 3));
  return g;
}
const arcPts = (cx, ca, c, a0, a1, n = 7) => Array.from({length: n + 1}, (_, i) => {
  const a = lerp(a0, a1, i / n);
  return [cx + c * Math.cos(a), ca + c * Math.sin(a)];
});
/** the rubber: chunky round shoulders, a flat sidewall carrying the compound band (null = plain), axis z */
function tyrePieces(r, w, band, {ri = r * 0.58, grow = 0, body = C.tyre} = {}) {
  const hw = w / 2 + grow;
  const R = r + grow;
  const c = Math.min(hw * 0.75, (R - ri) * 0.5);
  const f0 = ri + (R - c - ri) * 0.3;
  const f1 = ri + (R - c - ri) * 0.86;
  const seg = 56;
  const out = [];
  const lip = ri + (f0 - ri) * 0.5;
  out.push(lathePiece([[ri, -hw * 0.86], [lip, -hw * 0.985], [f0, -hw]], body, seg));
  out.push(lathePiece([[f0, -hw], [f1, -hw]], band ?? body, seg));
  out.push(lathePiece([[f1, -hw], ...arcPts(R - c, -hw + c, c, -PI / 2, 0), ...arcPts(R - c, hw - c, c, 0, PI / 2), [f1, hw]], body, seg));
  out.push(lathePiece([[f1, hw], [f0, hw]], band ?? body, seg));
  out.push(lathePiece([[f0, hw], [lip, hw * 0.985], [ri, hw * 0.86]], body, seg));
  return out;
}
/** the light hub disc (both faces, flush with the tyre's bead), the dark centre nut and 5 grey dots so a turn reads */
function rimPieces(r, w, {ri = r * 0.58} = {}) {
  const hw = w / 2;
  const hh = hw * 0.86;
  const e = Math.min(0.03, ri * 0.08);
  const out = [lathePiece([[1e-4, -hh], [ri - e, -hh], [ri + 0.004, -hh + e], [ri + 0.004, hh - e], [ri - e, hh], [1e-4, hh]], C.hub, 48)];
  const rn = r * 0.16;
  const hn = hh + r * 0.055;
  const en = rn * 0.25;
  out.push(lathePiece([[1e-4, -hn], [rn - en, -hn], [rn, -hn + en], [rn, hn - en], [rn - en, hn], [1e-4, hn]], C.ink, 24));
  for (let k = 0; k < 5; k++) {
    const a = (k / 5) * PI * 2;
    const d = new THREE.CylinderGeometry(r * 0.048, r * 0.048, hh * 2 + 0.014, 12).rotateX(PI / 2).translate(Math.cos(a) * ri * 0.6, Math.sin(a) * ri * 0.6, 0);
    const g = prep(d);
    const c = new THREE.Color(C.hubCap);
    const col = new Float32Array(g.attributes.position.count * 3);
    for (let i = 0; i < g.attributes.position.count; i++) col.set([c.r, c.g, c.b], i * 3);
    g.setAttribute('color', new THREE.BufferAttribute(col, 3));
    out.push(g);
  }
  return out;
}
const compoundColor = (c) => (c === 'soft' ? TOY.soft : c === 'hard' ? TOY.hard : c === 'medium' ? TOY.medium : null);
const tyreVC = (r, w, compound) => cg(`tyreVC|${r}|${w}|${compound}`, () => mergeGeometries(tyrePieces(r, w, compoundColor(compound)), false));
const rimVC = (r, w) => cg(`rimVC|${r}|${w}`, () => mergeGeometries(rimPieces(r, w), false));
/** a small machine wheel in one mesh: tyre, hub and nut */
const smallWheelVC = (r, w) => cg(`swVC|${r}|${w}`, () => mergeGeometries([...tyrePieces(r, w, null, {ri: r * 0.56}), ...rimPieces(r, w, {ri: r * 0.56})], false));

const WHEEL_R = 0.62;
/** a race wheel: group (orientation) > spin (turns about z) > tyre + rim */
function raceWheel(w, compound) {
  const group = new THREE.Group();
  const spin = new THREE.Group();
  spin.userData.r = WHEEL_R;
  group.add(spin);
  const tyre = part(tyreVC(WHEEL_R, w, compound), vcMat(0.84), spin);
  part(rimVC(WHEEL_R, w), vcMat(0.42), spin);
  return {group, spin, setCompound: (c) => (tyre.geometry = tyreVC(WHEEL_R, w, c))};
}
/** a machine wheel: one mesh spinning about its local z, at x, r, +-z */
function smallAxle(parent, list, r, w, x, z) {
  for (const s of [-1, 1]) {
    const m = part(smallWheelVC(r, w), vcMat(0.7), parent);
    m.position.set(x, r, s * z);
    m.userData.r = r;
    list.push(m);
  }
}

export function buildWheel({compound = 'medium', side = 1, front = false} = {}) {
  const w = front ? 0.55 : 0.7;
  const wh = raceWheel(w, compound);
  if (side < 0) wh.group.rotation.y = PI;
  return {group: wh.group, roll: (d) => (wh.spin.rotation.z = -d / WHEEL_R), setCompound: wh.setCompound, radius: WHEEL_R, width: w};
}

// ================================================================ the race car
const LIV = (team) => (TOY.livery[team] ? team : 'halcyon');
const ATLAS = {W: 1024, H: 512, numTrim: [0, 0, 512, 256], numBody: [512, 0, 512, 256], name: [0, 256, 1024, 256]};
const uvOf = (k) => [...ATLAS[k], ATLAS.W, ATLAS.H];
/** the car's prints in one texture: the number in the trim colour, the number in the body colour, the team name */
function carAtlas(team, number) {
  const liv = TOY.livery[team];
  return canvasTex(`atlas|${team}|${number}`, ATLAS.W, ATLAS.H, (g) => {
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    g.font = `italic 900 220px ${FONT}`;
    g.fillStyle = liv.trim;
    g.fillText(number, 256, 136);
    g.fillStyle = liv.body;
    g.fillText(number, 768, 136);
    g.font = `italic 900 150px ${FONT}`;
    g.letterSpacing = '10px';
    g.fillStyle = liv.trim;
    g.fillText(team.toUpperCase(), 512, 392);
  });
}

// the sculpted body's stations, rear to front: {x, w (bottom width), wt (top width), h, y (centre), r}
const HULL = [
  {x: -0.7, w: 0.86, wt: 0.72, h: 0.84, y: 0.6, r: 0.7},
  {x: 0.4, w: 0.88, wt: 0.74, h: 0.84, y: 0.6, r: 0.7},
  {x: 1.3, w: 0.78, wt: 0.64, h: 0.72, y: 0.67, r: 0.7},
  {x: 2.2, w: 0.62, wt: 0.52, h: 0.56, y: 0.74, r: 0.7},
  {x: 3.0, w: 0.5, wt: 0.42, h: 0.42, y: 0.62, r: 0.7},
  {x: 3.8, w: 0.38, wt: 0.33, h: 0.29, y: 0.49, r: 0.7},
  {x: 4.3, w: 0.32, wt: 0.28, h: 0.22, y: 0.43, r: 0.7},
];
const PODS = [
  {x: -2.6, w: 0.52, wt: 0.4, h: 0.26, y: 0.33, r: 0.8},
  {x: -2.0, w: 0.96, wt: 0.76, h: 0.38, y: 0.38, r: 0.6},
  {x: -1.1, w: 1.6, wt: 1.3, h: 0.52, y: 0.45, r: 0.55},
  {x: -0.2, w: 1.94, wt: 1.6, h: 0.6, y: 0.49, r: 0.55},
  {x: 0.6, w: 2.0, wt: 1.66, h: 0.6, y: 0.49, r: 0.55},
  {x: 1.0, w: 1.96, wt: 1.62, h: 0.56, y: 0.47, r: 0.55},
];
const COVER = [
  {x: -3.08, w: 0.26, wt: 0.2, h: 0.32, y: 0.6, r: 0.8},
  {x: -2.4, w: 0.42, wt: 0.3, h: 0.52, y: 0.68, r: 0.7},
  {x: -1.6, w: 0.62, wt: 0.36, h: 0.8, y: 0.81, r: 0.6},
  {x: -0.9, w: 0.76, wt: 0.4, h: 1.06, y: 0.94, r: 0.6},
  {x: -0.3, w: 0.8, wt: 0.42, h: 1.14, y: 0.98, r: 0.6},
  {x: -0.08, w: 0.78, wt: 0.4, h: 1.1, y: 0.97, r: 0.6},
];

function carStatic(P, team, number) {
  const liv = TOY.livery[team];
  const M = mats();
  const body = paint(liv.body, 0.46);
  const trim = paint(liv.trim, 0.46);
  const accent = paint(liv.accent, 0.46);
  const ink = M.ink;
  const carbon = M.carbon;
  const decal = decalMat(carAtlas(team, number));

  // the floor 0.12 off the ground, wide between the wheels, and the diffuser rising behind it
  P.add(carbon, extrudeY('floor', planShape([[2.05, 0.36], [1.62, 1.04], [-1.7, 1.04], [-1.96, 0.8], [-2.14, 0.78]]), 0.06, 0.025), 0, 0.15, 0);
  P.add(carbon, loft('diffuser', {x: -3.42, w: 1.5, h: 0.05, y: 0.46}, {x: -2.06, w: 1.56, h: 0.05, y: 0.16}, 0.02));
  // the tub and the nose in one sculpted piece, dropping to the wing (underside 0.45 at the front axle), a trim tip,
  // and the front jack point under it (y = 0.30 at x = 4.2)
  P.add(body, sweep('hull', HULL, {e: 0.14, slices: 48}));
  P.add(trim, sweep('nosetip', [{x: 4.12, w: 0.36, wt: 0.31, h: 0.26, y: 0.448, r: 0.8}, {x: 4.3, w: 0.33, wt: 0.29, h: 0.23, y: 0.435, r: 0.8}, {x: 4.48, w: 0.25, wt: 0.22, h: 0.16, y: 0.42, r: 0.8}], {e: 0.07, slices: 8}));
  P.ext(ink, 4.1, 4.3, 0.3, 0.345, -0.1, 0.1, 0.02);
  // the cockpit opening, a dark helmet dome, the halo, the mirrors
  P.ext(ink, -0.1, 1.0, 0.86, 1.045, -0.25, 0.25, 0.1);
  P.add(M.glass, sphere(0.2), 0.16, 1.03, 0, 0, 0, 0, 1.12, 0.92, 0.96);
  const halo = [[-0.24, 0.97, -0.34], [0.1, 1.17, -0.37], [0.56, 1.2, -0.29], [0.86, 1.2, 0], [0.56, 1.2, 0.29], [0.1, 1.17, 0.37], [-0.24, 0.97, 0.34]];
  P.add(ink, tubeG('halo', halo, 0.055));
  P.add(ink, tubeG('halo-pillar', [[0.84, 1.21, 0], [1.02, 1.13, 0], [1.22, 0.97, 0]], 0.055, 12));
  for (const s of [-1, 1]) {
    P.rod(ink, [0.98, 0.98, s * 0.3], [0.98, 1.06, s * 0.56], 0.025);
    P.ext(body, 0.91, 1.05, 1.0, 1.12, s > 0 ? 0.5 : -0.76, s > 0 ? 0.76 : -0.5, 0.045);
  }
  // the sidepods: one broad body across the car on the floor, coke-bottling in to the gearbox, dark intakes in front
  P.add(body, sweep('pods', PODS, {e: 0.2, slices: 36}));
  for (const s of [-1, 1]) P.ext(ink, 0.84, 1.0, 0.4, 0.7, s > 0 ? 0.5 : -0.94, s > 0 ? 0.94 : -0.5, 0.08);
  // the engine cover rising to the airbox over the driver, its dark intake, the fin
  P.add(body, sweep('cover', COVER, {e: 0.13, slices: 40}));
  P.ext(ink, -0.2, -0.08, 1.3, 1.5, -0.14, 0.14, 0.05);
  P.add(trim, extrude('fin', () => roundedPoly([V2(-1.02, 1.36), V2(-1.42, 1.5), V2(-2.98, 1.3), V2(-2.98, 0.72), V2(-2.3, 0.88)], [0.05, 0.14, 0.07, 0.03, 0.1]), 0.05, 0.018));
  // gearbox, rear crash structure with the rain light and the rear jack point under it (y = 0.30 at x = -4.0)
  P.add(ink, loft('gbox', {x: -3.05, w: 0.24, h: 0.26, y: 0.45}, {x: -1.9, w: 0.4, h: 0.42, y: 0.45}, 0.08));
  P.add(ink, loft('crash', {x: -4.14, w: 0.18, h: 0.15, y: 0.45}, {x: -2.95, w: 0.26, h: 0.24, y: 0.47}, 0.06));
  P.ext(ink, -4.1, -3.9, 0.3, 0.4, -0.1, 0.1, 0.03);
  P.ext(M.rain, -4.18, -4.1, 0.41, 0.49, -0.07, 0.07, 0.02);
  // the front wing: two halves of mainplane + two trim flaps either side of the nose, endplates, pylons to the nose
  for (const s of [-1, 1]) {
    P.add(body, rb(0.64, 0.09, 1.18, 0.04), 4.3, 0.15, s * 0.81);
    P.add(trim, rb(0.38, 0.065, 1.14, 0.03), 4.0, 0.27, s * 0.83, 0, 0, -0.32);
    P.add(trim, rb(0.28, 0.055, 1.04, 0.025), 3.8, 0.39, s * 0.88, 0, 0, -0.62);
    P.add(body, extrude('fw-end', () => roundedPoly([V2(3.64, 0.06), V2(4.64, 0.06), V2(4.64, 0.24), V2(4.32, 0.47), V2(3.64, 0.47)], [0.04, 0.05, 0.1, 0.1, 0.06]), 0.06, 0.02), 0, 0, s * 1.42);
    P.ext(ink, 3.98, 4.34, 0.2, 0.4, s > 0 ? 0.13 : -0.27, s > 0 ? 0.27 : -0.13, 0.03);
  }
  // the rear wing: endplates, mainplane, beam wing, a swan-neck pylon
  for (const s of [-1, 1]) P.add(body, extrude('rw-end', () => roundedPoly([V2(-3.8, 0.64), V2(-3.22, 0.64), V2(-3.0, 1.02), V2(-3.0, 1.48), V2(-3.8, 1.48)], [0.05, 0.1, 0.12, 0.08, 0.06]), 0.06, 0.02), 0, 0, s * 0.89);
  P.add(body, rb(0.46, 0.09, 1.76, 0.04), -3.3, 1.12, 0, 0, 0, -0.12);
  P.add(carbon, rb(0.32, 0.06, 1.76, 0.025), -3.46, 0.71, 0, 0, 0, -0.18);
  P.add(ink, extrude('rw-pylon', () => roundedPoly([V2(-3.62, 0.48), V2(-3.36, 0.48), V2(-3.18, 1.1), V2(-3.38, 1.1)], 0.04), 0.06, 0.02));
  // suspension: wishbones, push rods, track rods from the tub and the gearbox to the uprights
  const rod = (a, b) => P.rod(ink, a, b, 0.032);
  for (const s of [-1, 1]) {
    rod([2.25, 0.5, s * 0.26], [2.6, 0.4, s * 0.96]);
    rod([2.95, 0.48, s * 0.24], [2.6, 0.4, s * 0.96]);
    rod([2.3, 0.84, s * 0.26], [2.6, 0.84, s * 0.92]);
    rod([2.9, 0.82, s * 0.22], [2.6, 0.84, s * 0.92]);
    rod([2.78, 0.62, s * 0.24], [2.78, 0.62, s * 0.94]);
    rod([-2.25, 0.34, s * 0.14], [-2.6, 0.36, s * 0.9]);
    rod([-2.95, 0.36, s * 0.12], [-2.6, 0.36, s * 0.9]);
    rod([-2.3, 0.72, s * 0.18], [-2.6, 0.86, s * 0.88]);
    rod([-2.88, 0.7, s * 0.14], [-2.6, 0.86, s * 0.88]);
    rod([-2.4, 0.56, s * 0.16], [-2.4, 0.56, s * 0.9]);
  }
  // the hubs: a dark upright and brake drum with a steel axle stub, seen when a wheel slides off
  for (const [x, w] of [[2.6, 0.55], [-2.6, 0.7]])
    for (const s of [-1, 1]) {
      const hw = w / 2;
      P.rcyl(ink, 0.25, 0.25, hw * 0.9, x, 0.62, s * (1.22 - hw * 0.55), 'z', 0.04);
      P.rcyl(M.steel, 0.075, 0.075, 0.3, x, 0.62, s * 1.16, 'z', 0.02, 16);
    }
  // prints: the number on the nose (reads from the +z side) and on both faces of the fin, the team name on the endplates
  const noseSlope = Math.atan2(-0.51, 2.36);
  P.add(decal, cg('nose-num', () => planeUV(0.7, 0.35, uvOf('numTrim')).clone().rotateX(-PI / 2)), 3.2, 0.778, 0, 0, 0, noseSlope);
  for (const s of [-1, 1]) {
    P.print(decal, 0.78, 0.39, -2.36, 1.16, s * 0.032, s > 0 ? 0 : PI, 0, 0, uvOf('numBody'));
    P.print(decal, 0.76, 0.19, -3.38, 1.2, s * 0.924, s > 0 ? 0 : PI, 0, 0, uvOf('name'));
  }
  // light accents: the endplate tops and the sidepod lips
  for (const s of [-1, 1]) P.ext(accent, -3.78, -3.04, 1.42, 1.5, s * 0.89 - 0.038, s * 0.89 + 0.038, 0.02);
}

export function buildRaceCar({team = 'halcyon', number = '9', compound = 'medium', scale = 1} = {}) {
  const key = LIV(team);
  const liv = TOY.livery[key];
  const number_ = String(number);
  const group = new THREE.Group();
  group.scale.setScalar(scale);
  tpl(`car|${key}|${number_}`, (P) => carStatic(P, key, number_), group);
  // the DRS flap, pivoting about its trailing edge
  const drs = new THREE.Group();
  drs.position.set(-3.78, 1.44, 0);
  group.add(drs);
  tpl(`drs|${key}`, (P) => P.ext(paint(liv.trim, 0.46), 0, 0.37, -0.034, 0.034, -0.87, 0.87, 0.03), drs);
  const REST = -32 * D2R;
  const setDRS = (k) => (drs.rotation.z = REST + clamp(k, 0, 1) * 35 * D2R);
  setDRS(0);
  // the wheels: pivot (steers) > slide (along the axle) > wheel (visibility) > spin
  const wheels = [];
  const HUBS = [V3(2.6, WHEEL_R, -1.22), V3(2.6, WHEEL_R, 1.22), V3(-2.6, WHEEL_R, -1.22), V3(-2.6, WHEEL_R, 1.22)];
  for (let i = 0; i < 4; i++) {
    const front = i < 2;
    const s = i % 2 ? 1 : -1;
    const pivot = new THREE.Group();
    pivot.position.copy(HUBS[i]);
    const slide = new THREE.Group();
    pivot.add(slide);
    const wh = raceWheel(front ? 0.55 : 0.7, compound);
    slide.add(wh.group);
    group.add(pivot);
    wheels.push({pivot, slide, s, front, ...wh});
  }
  const roll = (d) => {
    for (const w of wheels) w.spin.rotation.z = -d / (WHEEL_R * scale);
  };
  const setSteer = (a) => {
    for (const w of wheels) if (w.front) w.pivot.rotation.y = a;
  };
  const setWheelOff = (i, k) => {
    const w = wheels[i];
    w.slide.position.z = w.s * 0.9 * clamp(k, 0, 1);
  };
  const setWheelVisible = (i, v) => (wheels[i].group.visible = !!v);
  const setCompound = (i, c) => wheels[i].setCompound(c);
  const hub = (i, target = new THREE.Vector3()) => target.copy(HUBS[i]);
  const hubWorld = (i, target = new THREE.Vector3()) => {
    group.updateWorldMatrix(true, false);
    return group.localToWorld(target.copy(HUBS[i]));
  };
  return {group, roll, setSteer, setDRS, setWheelOff, setWheelVisible, setCompound, hub, hubWorld, wheels: wheels.map((w) => w.group), length: 8.4 * scale, scale};
}

// ================================================================ the wheel cart (a tiny wheel-changing forklift)
export function buildWheelCart() {
  const M = mats();
  const group = new THREE.Group();
  const SLOT_X = 0.86;
  tpl('cart', (P) => {
    // the yellow body over two small axles, a rubber bumper behind, a dark pod with a sensor band and a beacon on top
    P.add(M.yellow, extrude('cart-body', () => profile(-1.32, 0.04, 0.1, 0.8, {arches: [[-0.98, 0.22, 0.29], [-0.2, 0.22, 0.29]], rc: [0.14, 0.12, 0.2, 0.34]}, 0.14), 1.16, 0.14));
    P.ext(M.rubber, -1.44, -1.22, 0.16, 0.44, -0.46, 0.46, 0.09);
    P.ext(M.ink, -1.18, -0.42, 0.74, 1.02, -0.4, 0.4, 0.11);
    P.ext(M.glass, -0.5, -0.38, 0.84, 0.96, -0.32, 0.32, 0.04);
    for (const s of [-1, 1]) P.ext(M.glass, -1.0, -0.56, 0.84, 0.96, s * 0.4 - 0.03, s * 0.4 + 0.03, 0.02);
    P.beacon(-0.82, 1.02, 0, 0.11);
    for (const s of [-1, 1]) P.ext(M.lamp, 0.02, 0.06, 0.5, 0.64, s * 0.42 - 0.1, s * 0.42 + 0.1, 0.03);
    // the mast: two dark uprights, top and bottom bars, tilt rams
    for (const s of [-1, 1]) {
      P.ext(M.ink, 0.02, 0.16, 0.12, 1.66, s * 0.4 - 0.07, s * 0.4 + 0.07, 0.04);
      P.rod(M.ink, [-0.34, 0.74, s * 0.42], [0.02, 1.02, s * 0.4], 0.04);
    }
    P.ext(M.ink, 0.0, 0.18, 1.54, 1.68, -0.5, 0.5, 0.05);
    P.ext(M.ink, 0.0, 0.18, 0.14, 0.28, -0.5, 0.5, 0.05);
  }, group);
  // the lift (up and down the mast) carries the shift (across the cart), which carries the beam, tines and slots
  const lift = new THREE.Group();
  group.add(lift);
  tpl('cart-lift', (P) => P.ext(M.ink, 0.15, 0.2, -0.24, 0.24, -0.52, 0.52, 0.03), lift);
  const shift = new THREE.Group();
  lift.add(shift);
  tpl('cart-shift', (P) => {
    P.ext(M.yellow, 0.18, 0.34, -0.14, 0.14, -1.64, 1.64, 0.07);
    // three tines grip the two wheels at their equator, light pads where they touch
    for (const z of [-1.52, 0, 1.52]) {
      const t = z === 0 ? 0.09 : 0.05;
      P.ext(M.ink, 0.3, 1.24, -0.05, 0.05, z - t, z + t, 0.03);
      if (z <= 0) P.ext(M.bumper, 0.56, 1.16, -0.07, 0.07, z + t - 0.01, z + t + 0.045, 0.02);
      if (z >= 0) P.ext(M.bumper, 0.56, 1.16, -0.07, 0.07, z - t - 0.045, z - t + 0.01, 0.02);
    }
    // the wheel guns: a dark boss per slot that meets the hub's centre nut
    for (const z of [-0.8, 0.8]) {
      P.rcyl(M.ink, 0.13, 0.13, 0.16, 0.41, 0, z, 'x', 0.03);
      P.rcyl(M.steel, 0.075, 0.075, 0.05, 0.5, 0, z, 'x', 0.015, 16);
    }
  }, shift);
  const slots = [-0.8, 0.8].map((z) => {
    const s = new THREE.Object3D();
    s.position.set(SLOT_X, 0, z);
    s.rotation.y = -PI / 2;
    shift.add(s);
    return s;
  });
  const setShift = (k) => (shift.position.z = 0.8 - 1.6 * clamp(k, 0, 1));
  const setCradle = (y) => (lift.position.y = clamp(y, 0.3, 1.3));
  setShift(0);
  setCradle(0.62);
  const wheels = [];
  smallAxle(group, wheels, 0.22, 0.2, -0.98, 0.5);
  smallAxle(group, wheels, 0.22, 0.2, -0.2, 0.5);
  return {group, roll: roller(wheels), setShift, setCradle, slots, slotX: SLOT_X, length: 2.6};
}

// ================================================================ the jacks
export function buildPitJack({end = 'front'} = {}) {
  const M = mats();
  const group = new THREE.Group();
  const L = 2.0;
  const PAD_X = L / 2;
  tpl(`jack|${end}`, (P) => {
    P.add(M.yellow, extrude('jack-body', () => profile(-1.02, 0.2, 0.08, 0.6, {arches: [[-0.74, 0.17, 0.23], [-0.06, 0.17, 0.23]], rc: [0.12, 0.12, 0.22, 0.28]}, 0.12), 0.9, 0.12));
    P.ext(M.rubber, -1.12, -0.94, 0.12, 0.36, -0.36, 0.36, 0.08);
    P.ext(M.ink, -0.9, -0.3, 0.56, 0.76, -0.32, 0.32, 0.09);
    P.ext(M.glass, -0.38, -0.27, 0.6, 0.71, -0.24, 0.24, 0.035);
    P.beacon(-0.62, 0.76, 0, 0.1);
    // the ram housing and the low beam that slides under the car, a roller under its tip
    P.ext(M.ink, 0.12, 0.38, 0.05, 0.46, -0.22, 0.22, 0.07);
    P.ext(M.ink, 0.3, 1.24, 0.03, 0.105, -0.1, 0.1, 0.03);
    P.cyl(M.rubber, 0.035, 0.035, 0.16, 1.17, 0.036, 0, 'z', 12);
    P.ext(M.yellow, 0.36, 0.4, 0.14, 0.38, -0.12, 0.12, 0.015);
    for (const s of [-1, 1]) P.text(end === 'rear' ? 'R' : 'F', {fg: C.text, px: 120, pad: 10}, 0.26, -0.42, 0.34, s * 0.452, s > 0 ? 0 : PI);
  }, group);
  const head = new THREE.Group();
  head.position.x = PAD_X;
  group.add(head);
  tpl('jack-head', (P) => {
    P.ext(M.yellow, -0.15, 0.15, -0.065, -0.026, -0.14, 0.14, 0.015);
    P.ext(M.rubber, -0.13, 0.13, -0.034, 0, -0.12, 0.12, 0.012);
  }, head);
  const rod = part(cylG(0.045, 0.045, 1, 14), M.steel, group);
  rod.position.x = PAD_X;
  const setLift = (h) => {
    const top = 0.18 + clamp(h, 0, 0.44);
    head.position.y = top;
    const y0 = 0.1;
    const y1 = top - 0.06;
    rod.scale.y = Math.max(0.005, y1 - y0);
    rod.position.y = (y0 + y1) / 2;
  };
  setLift(0);
  const wheels = [];
  smallAxle(group, wheels, 0.17, 0.16, -0.74, 0.36);
  smallAxle(group, wheels, 0.17, 0.16, -0.06, 0.36);
  return {group, roll: roller(wheels), setLift, length: L};
}

// ================================================================ the release light
export function buildPitLight() {
  const M = mats();
  const group = new THREE.Group();
  tpl('pitlight', (P) => {
    P.rcyl(M.blue, 0.42, 0.46, 0.14, 0, 0.07, 0, 'y', 0.05);
    P.cyl(M.white, 0.075, 0.075, 2.1, 0, 1.18, 0, 'y', 16);
    P.rcyl(M.ink, 0.25, 0.25, 0.14, 0, 2.27, 0, 'y', 0.05);
    P.rcyl(M.ink, 0.25, 0.25, 0.06, 0, 2.66, 0, 'y', 0.02);
    P.rcyl(M.ink, 0.25, 0.22, 0.12, 0, 2.94, 0, 'y', 0.05);
  }, group);
  const lens = (y) => {
    const m = part(rcylG(0.24, 0.24, 0.3, 0.03, 32), M.redOff, group);
    m.position.y = y;
    m.castShadow = false;
    return m;
  };
  const red = lens(2.8);
  const green = lens(2.49);
  const setLight = (state) => {
    red.material = state === 'red' ? M.redOn : M.redOff;
    green.material = state === 'green' ? M.greenOn : M.greenOff;
  };
  setLight('red');
  return {group, setLight};
}

// ================================================================ tyre rack
export function buildTyreRack({compound = 'medium', n = 4} = {}) {
  const M = mats();
  const group = new THREE.Group();
  const cols = Math.max(1, Math.ceil(n / 2));
  const levels = n > 1 ? 2 : 1;
  const dx = 1.38;
  const len = cols * dx + 0.2;
  const w = 0.7;
  tpl(`rack|${compound}|${n}`, (P) => {
    const band = toyMat(compoundColor(compound) ?? TOY.medium, {rough: 0.6});
    const x0 = -len / 2;
    const y0 = [0.14, 1.5];
    // the trolley: a light deck per level on white posts, small dark casters
    for (let l = 0; l < levels; l++) P.ext(M.panel, x0, -x0, y0[l] - 0.08, y0[l], -0.5, 0.5, 0.04);
    for (const x of [x0 + 0.06, -x0 - 0.06]) for (const s of [-1, 1]) P.ext(M.white, x - 0.06, x + 0.06, 0.06, levels > 1 ? 2.9 : 1.5, s * 0.44 - 0.06, s * 0.44 + 0.06, 0.03);
    P.ext(M.white, x0, -x0, (levels > 1 ? 2.9 : 1.5) - 0.08, levels > 1 ? 2.94 : 1.54, -0.5, 0.5, 0.04);
    for (const x of [x0 + 0.16, -x0 - 0.16]) for (const s of [-1, 1]) P.cyl(M.ink, 0.05, 0.05, 0.06, x, 0.05, s * 0.36, 'z', 12);
    // the wheels standing in the rack, axles along z, each in a blue blanket with the compound band on it
    let k = 0;
    for (let l = 0; l < levels; l++)
      for (let c = 0; c < cols && k < n; c++, k++) {
        const x = x0 + 0.1 + dx * (c + 0.5);
        const y = y0[l] + WHEEL_R + 0.03;
        for (const g of tyrePieces(WHEEL_R, w, '#ffffff', {grow: 0.035})) {
          // the pieces come coloured; split them between blanket and band by their colour
          const isBand = g.attributes.color.getX(0) > 0.9;
          P.add(isBand ? band : M.blanket, g, x, y, 0);
        }
        P.add(M.hub, rcylG(WHEEL_R * 0.58, WHEEL_R * 0.58, w * 0.86, 0.03, 40), x, y, 0, PI / 2, 0, 0);
        P.rcyl(M.ink, 0.1, 0.1, w * 0.86 + 0.07, x, y, 0, 'z', 0.025, 20);
      }
  }, group);
  return {group, length: len};
}

// ================================================================ the team transporter (gse.js cab and printed side)
function cab(P, {x0, x1, y0 = 0.62, top, W, color, wheelX, wheelR, stripe = null, seam}) {
  const M = mats();
  const b = 0.17;
  const key = [x0, x1, y0, top, W, wheelX, wheelR].join('|');
  P.add(paint(color, 0.46), extrude(`cab|${key}`, () => profile(x0, x1, y0, top, {arches: [[wheelX, wheelR, wheelR + 0.15]], rc: [0.14, 0.34, 0.44, 0.34]}, b), W, b));
  const hw = W / 2;
  const H = top - y0;
  const wt = Math.min(top - 0.12 * H, top - 0.46);
  const wb = top - 0.5 * H;
  P.ext(M.glass, x1 - 0.08, x1 + 0.035, wb, wt, -hw + 0.27, hw - 0.27, 0.05);
  for (const s of [-1, 1]) {
    P.ext(M.glass, x1 - Math.min(1.62, (x1 - x0) * 0.56), x1 - 0.34, wb, wt, s > 0 ? hw - 0.06 : -hw - 0.035, s > 0 ? hw + 0.035 : -hw + 0.06, 0.05);
    P.ext(paint(seam), x1 - Math.min(1.8, (x1 - x0) * 0.62), x1 - Math.min(1.76, (x1 - x0) * 0.62) + 0.04, y0 + 0.85, top - 0.3, s > 0 ? hw - 0.02 : -hw - 0.012, s > 0 ? hw + 0.012 : -hw + 0.02, 0.008);
    P.ext(M.ink, x1 - 1.45, x1 - 1.15, wb - 0.3, wb - 0.22, s > 0 ? hw - 0.02 : -hw - 0.04, s > 0 ? hw + 0.04 : -hw + 0.02, 0.02);
    P.rod(M.ink, [x1 - 0.2, wt - 0.25, s * (hw - 0.05)], [x1 - 0.05, wt - 0.25, s * (hw + 0.36)], 0.04);
    P.ext(M.ink, x1 - 0.12, x1 + 0.02, wt - 0.95, wt - 0.12, s * (hw + 0.32) - 0.1, s * (hw + 0.32) + 0.1, 0.05);
    if (stripe) P.ext(paint(stripe, 0.46), x0 + 0.22, x1 - 0.3, wb - 0.55, wb - 0.33, s > 0 ? hw - 0.02 : -hw - 0.02, s > 0 ? hw + 0.02 : -hw + 0.02, 0.01);
  }
  const gb = y0 + 0.18 * H;
  const gt = wb - 0.07 * H;
  P.ext(M.ink, x1 - 0.06, x1 + 0.04, gb, gt, -0.92, 0.92, 0.06);
  const n = 5;
  for (let k = 0; k < n; k++) P.ext(M.bumper, x1 + 0.01, x1 + 0.065, gb + ((gt - gb) * (k + 0.55)) / (n + 0.1) - 0.03, gb + ((gt - gb) * (k + 0.55)) / (n + 0.1) + 0.03, -0.8, 0.8, 0.02);
  for (const s of [-1, 1]) P.ext(M.lamp, x1 - 0.05, x1 + 0.045, gb, gb + 0.1 * H, s > 0 ? hw - 0.62 : -hw + 0.2, s > 0 ? hw - 0.2 : -hw + 0.62, 0.06);
  P.ext(M.bumper, x1 - 0.3, x1 + 0.28, y0 - 0.06, y0 + 0.56, -hw - 0.08, hw + 0.08, 0.2);
}
/** one trailer side: a team-colour swoosh rising toward the rear with a light stripe over it, the accent rim, the name */
function drawSide(g, w, h, L, {frontLeft, title, tagline, rise = 0.13, base = 0.79}) {
  const X = (u) => (frontLeft ? u * w : (1 - u) * w);
  const top = (u) => h * (base - rise * Math.pow(u, 1.35) + 0.018 * Math.sin(u * PI * 2));
  const band = (off, th, col) => {
    g.fillStyle = col;
    g.beginPath();
    for (let i = 0; i <= 60; i++) g.lineTo(X(i / 60), top(i / 60) + off);
    for (let i = 60; i >= 0; i--) g.lineTo(X(i / 60), th === null ? h : top(i / 60) + off + th);
    g.closePath();
    g.fill();
  };
  band(-h * 0.062, h * 0.034, L.light);
  band(0, null, L.accent);
  g.fillStyle = L.accent;
  g.fillRect(0, 0, w, h * 0.048);
  g.fillRect(frontLeft ? 0 : w - h * 0.048, 0, h * 0.048, h);
  g.textBaseline = 'alphabetic';
  g.font = `italic 900 ${h * 0.25}px ${FONT}`;
  g.letterSpacing = `${h * 0.012}px`;
  const tw = g.measureText(title).width;
  const x0 = frontLeft ? w * 0.09 : w * 0.91 - tw;
  g.fillStyle = L.text;
  g.fillText(title, x0, h * 0.44);
  g.letterSpacing = '0px';
  g.fillStyle = C.tagline;
  g.font = `600 ${h * 0.074}px ${FONT}`;
  g.fillText(tagline, x0 + h * 0.012, h * 0.545);
}

export function buildTeamTruck({team = 'halcyon'} = {}) {
  const key = LIV(team);
  const liv = TOY.livery[key];
  const M = mats();
  const group = new THREE.Group();
  const white = liv.body === TOY.white;
  const tone = white ? liv.trim : liv.body;
  const L = {accent: tone, light: white ? liv.accent : liv.accent === TOY.white ? TOY.blueLight : liv.accent, text: tone === TOY.navy ? TOY.navy : C.text};
  const R = 0.75;
  const W = 3.4;
  const BW = 3.7;
  const bx0 = -8.0;
  const bx1 = 4.75;
  const by0 = 1.7;
  const by1 = 5.4;
  tpl(`truck|${key}`, (P) => {
    cab(P, {x0: 5.1, x1: 8.0, top: 4.2, W, color: liv.body, wheelX: 6.6, wheelR: R, stripe: white ? liv.trim : null, seam: white ? TOY.shade : TOY.navy});
    // tractor chassis, fairing tanks, fifth wheel
    P.ext(M.chassis, 1.0, 5.4, 0.95, 1.6, -1.05, 1.05, 0.08);
    P.ext(paint(tone, 0.46), 4.3, 5.08, 0.72, 1.5, -1.66, 1.66, 0.18);
    P.ext(M.ink, 1.6, 3.8, 1.55, 1.68, -1.1, 1.1, 0.05);
    // the trailer: white box with a light rear frame, dark chassis, side guards between the axle groups
    P.ext(M.white, bx0 + 0.6, bx1, by0, by1, -BW / 2, BW / 2, 0.26);
    P.ext(M.panel, bx0, bx0 + 0.7, by0 - 0.02, by1 + 0.02, -BW / 2 - 0.02, BW / 2 + 0.02, 0.24);
    P.ext(M.chassis, bx0 + 0.3, bx1 - 0.2, 1.2, 1.75, -1.1, 1.1, 0.08);
    for (const s of [-1, 1]) P.ext(paint(tone, 0.46), -3.7, 0.6, 0.85, 1.6, s * 1.62 - 0.05, s * 1.62 + 0.05, 0.04);
    for (const s of [-1, 1]) P.ext(M.tail, bx0 - 0.04, bx0 + 0.04, 0.95, 1.2, s * 1.4 - 0.18, s * 1.4 + 0.18, 0.03);
    P.ext(M.chassis, bx0 - 0.08, bx0 + 0.2, 0.75, 1.05, -1.7, 1.7, 0.08);
    // the printed sides and the rear doors
    const dx0 = bx0 + 0.7;
    const dx1 = bx1 - 0.2;
    const dy0 = by0 + 0.2;
    const dy1 = by1 - 0.2;
    const dw = dx1 - dx0;
    const dh = dy1 - dy0;
    const cw = 2048;
    const ch = Math.round((cw * dh) / dw);
    for (const s of [-1, 1]) {
      const tex = canvasTex(`truckside|${key}|${s}`, cw, ch, (g) => drawSide(g, cw, ch, L, {frontLeft: s < 0, title: key.toUpperCase(), tagline: 'Racing  ·  Pit lane logistics'}));
      P.print(decalMat(tex), dw, dh, (dx0 + dx1) / 2, (dy0 + dy1) / 2, s * (BW / 2 + 0.004), s > 0 ? 0 : PI);
    }
    const rear = canvasTex(`truckrear|${key}`, 512, 512, (g, w, h) => {
      g.strokeStyle = 'rgba(40,52,90,0.35)';
      g.lineWidth = 5;
      g.strokeRect(14, 14, w - 28, h - 28);
      g.beginPath();
      g.moveTo(w / 2, 14);
      g.lineTo(w / 2, h - 14);
      g.stroke();
      g.fillStyle = tone;
      g.fillRect(14, h - 70, w - 28, 56);
    });
    P.print(decalMat(rear), BW - 0.36, by1 - by0 - 0.3, bx0 - 0.004, (by0 + by1) / 2, 0, -PI / 2);
    // the front of the box above the cab: a team-colour rim
    P.ext(paint(tone, 0.46), bx1 - 0.04, bx1 + 0.02, by1 - 0.42, by1 - 0.16, -BW / 2 + 0.2, BW / 2 - 0.2, 0.01);
  }, group);
  const wheels = [];
  const steer = [];
  for (const s of [-1, 1]) {
    const pivot = new THREE.Group();
    pivot.position.set(6.6, R, s * 1.42);
    const m = part(smallWheelVC(R, 0.62), vcMat(0.72), pivot);
    m.userData.r = R;
    wheels.push(m);
    steer.push(pivot);
    group.add(pivot);
  }
  for (const x of [3.3, 2.05, -5.0, -6.25, -7.5]) smallAxle(group, wheels, R, 0.62, x, 1.48);
  return {group, roll: roller(wheels), setSteer: steerer(steer), length: 16};
}
