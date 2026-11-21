// Toy airport ground vehicles, built to look like the reference video trucks and forklifts
//: toy proportions at about 1.5x real, chunky bevelled bodies,
// matte paint with a soft clearcoat, dark tyres with light hubs and a dark cap, dark glass, crisp printed liveries.
// Blue + white everywhere, teal for the Kestrel livery, yellow only on the work machines (forklift, belt-loader boom,
// high-loader lifts). Colours and materials come from ./style.js; the few colours it has no entry for are in GSE_COLORS.
//
// Toy metres, y up, nose toward +x, the right side is +z, origin on the ground at the vehicle's centre. Wheels spin
// about their local z; every builder returns {group, roll(distance), ...}: roll turns the wheels for that distance.
//
//   buildToyBoxTruck({livery = 'aurora' | 'kestrel' | 'plain'}) -> {group, roll, setSteer(a), rear: {x, y}}   12.3 m
//   buildToyForklift()             -> {group, roll, setForks(h)}                h = fork lift above ground, 0..2.4
//   buildToyTug({livery, number})  -> {group, roll, setSteer, hitch}            4.6 m, hitch = rear coupling (local)
//   buildToyDolly()                -> {group, roll, slot, slotY, hitch, eye}    4.4 m, slot: Group on the deck centre
//   buildToyULD({color, id})       -> {group, roll}                             2.4 x 2.2 x 2.2, contour toward +x
//   buildToyBeltLoader({livery})   -> {group, roll, setBoom(k), setBelt(d), tip}       k 0..1: belt top end y 1.5..3.4
//   buildToyHighLoader({livery})   -> {group, roll, setFront(h), setRear(h), slotFront, slotRear}  deck tops, front 1.4..3.6
//   buildToyCateringTruck({livery})-> {group, roll, setSteer, setBox(h)}        box floor h 1.55..5.6 (5.0 = L1 sill)
//   buildToyFuelTruck({livery})    -> {group, roll, setSteer, setHose(k, target?), wingPoint}  target: local Vector3
//   buildToyPushback({livery})     -> {group, roll, setSteer}                   7 m
//   buildToyBus({livery})          -> {group, roll, setSteer}                   14 m, doors both sides
//   buildToyFollowMe()             -> {group, roll, setSteer}                   6.2 m
//   buildToyStairs({livery})       -> {group, roll, setTop(h)}                  platform floor h 3.4..5.8 (5.0 = sill)
//   buildToyCone(), buildToyChocks({gap}) -> {group, roll}  (roll is a no-op on the static props)
//
// Static parts are merged per material and cached per variant, so a second copy only costs draw calls; moving parts
// (wheels, booms, decks, scissors, forks, the hose) are separate meshes on shared geometry.
import * as THREE from 'three';
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';
import {TOY, rbox, toyMat} from './style.js';

const PI = Math.PI;
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const lerp = (a, b, t) => a + (b - a) * t;
const smooth = (a, b, v) => {
  const t = clamp((v - a) / (b - a), 0, 1);
  return t * t * (3 - 2 * t);
};
const V2 = (x, y) => new THREE.Vector2(x, y);
const V3 = (x, y, z) => new THREE.Vector3(x, y, z);

/** colours the shared palette has no entry for, sampled from the reference frames */
export const GSE_COLORS = {
  ink: '#1d2231', // the forklift's mast, cage and seat, grilles, mirrors: the reference's near-black parts
  tyre: '#1f2433',
  hub: '#c9cfdf', // the light-grey hub disc
  hubCap: '#8a94b0',
  chassis: '#2b3248', // frames and tanks under the bodies
  bumper: '#e8ecf6',
  lamp: '#fbf1d4', // cream headlights
  steel: '#a9b3cf', // scissor arms and rams on the service trucks
  tealLight: '#8fe0d4',
  text: '#1d2748', // wordmarks
  tagline: '#6b78a3',
};
const C = GSE_COLORS;

const LIVERY = {
  aurora: {accent: TOY.blue, deep: TOY.blueDeep, light: TOY.blueLight, cab: TOY.blue, mark: 'aurora', name: 'Aurora', frame: true},
  kestrel: {accent: TOY.teal, deep: '#178f83', light: C.tealLight, cab: TOY.white, mark: 'kestrel', name: 'Kestrel', frame: false, stripe: TOY.teal},
  plain: {accent: TOY.blue, deep: TOY.blueDeep, light: TOY.blueLight, cab: TOY.blue, mark: null, name: null, frame: true},
};
const liv = (k) => LIVERY[k] ?? LIVERY.aurora;

// ================================================================ materials
const paint = (color, rough = 0.5) => toyMat(color, {paint: true, rough});
let MM = null;
function mats() {
  if (MM) return MM;
  const glow = (color, emissive, k, rough = 0.35) => {
    const m = new THREE.MeshStandardMaterial({color, roughness: rough, emissive, emissiveIntensity: k});
    return m;
  };
  MM = {
    white: paint(TOY.white),
    panel: paint(TOY.panel),
    blue: paint(TOY.blue, 0.48),
    yellow: paint(TOY.yellow, 0.5),
    ink: toyMat(C.ink, {rough: 0.62}),
    chassis: toyMat(C.chassis, {rough: 0.66}),
    tyre: toyMat(C.tyre, {rough: 0.82}),
    hub: toyMat(C.hub, {rough: 0.42}),
    hubCap: toyMat(C.hubCap, {rough: 0.45, metal: 0.1}),
    glass: toyMat(TOY.glass, {paint: true, rough: 0.12}),
    bumper: paint(C.bumper),
    steel: toyMat(C.steel, {rough: 0.42, metal: 0.25}),
    rubber: toyMat('#2a2f40', {rough: 0.85}),
    lamp: glow(C.lamp, '#fff1c8', 0.22, 0.3),
    tail: glow('#f0656a', TOY.red, 0.35, 0.3),
    beacon: glow('#ffb072', '#ff7a1f', 0.9, 0.3),
    cone: paint(TOY.orange, 0.52),
  };
  return MM;
}

// ================================================================ textures
const TEX = new Map();
function canvasTex(key, w, h, draw, {repeat = false} = {}) {
  if (TEX.has(key)) return TEX.get(key);
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  draw(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  if (repeat) t.wrapS = t.wrapT = THREE.RepeatWrapping;
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
const FONT = 'Inter, "Segoe UI", system-ui, sans-serif';

/** the operator marks: aurora = a rounded square with a white sun over a horizon, kestrel = two wing chevrons */
function drawMark(g, kind, x, y, s, L) {
  g.save();
  if (kind === 'aurora') {
    g.fillStyle = L.accent;
    g.beginPath();
    g.roundRect(x, y, s, s, s * 0.26);
    g.fill();
    g.fillStyle = 'rgba(255,255,255,0.28)';
    g.beginPath();
    g.roundRect(x + s * 0.5, y, s * 0.5, s, [0, s * 0.26, s * 0.26, 0]);
    g.fill();
    g.strokeStyle = '#ffffff';
    g.lineCap = 'round';
    g.lineWidth = s * 0.1;
    g.beginPath();
    g.arc(x + s * 0.5, y + s * 0.7, s * 0.27, PI * 1.08, PI * 1.92);
    g.stroke();
    g.beginPath();
    g.moveTo(x + s * 0.2, y + s * 0.72);
    g.lineTo(x + s * 0.8, y + s * 0.72);
    g.stroke();
    g.fillStyle = '#ffffff';
    g.beginPath();
    g.arc(x + s * 0.5, y + s * 0.7, s * 0.1, PI, 0);
    g.fill();
  } else if (kind === 'kestrel') {
    const wing = (dx, col) => {
      g.fillStyle = col;
      g.beginPath();
      g.moveTo(x + dx, y + s * 0.78);
      g.lineTo(x + dx + s * 0.32, y + s * 0.22);
      g.lineTo(x + dx + s * 0.5, y + s * 0.5);
      g.lineTo(x + dx + s * 0.68, y + s * 0.22);
      g.lineTo(x + dx + s * 1.0, y + s * 0.78);
      g.lineTo(x + dx + s * 0.82, y + s * 0.78);
      g.lineTo(x + dx + s * 0.68, y + s * 0.52);
      g.lineTo(x + dx + s * 0.5, y + s * 0.82);
      g.lineTo(x + dx + s * 0.32, y + s * 0.52);
      g.lineTo(x + dx + s * 0.18, y + s * 0.78);
      g.closePath();
      g.fill();
    };
    wing(0, L.accent);
    wing(s * 0.24, L.deep);
  } else if (kind === 'cube') {
    // an isometric crate: top light, left accent, right deep
    const cx = x + s / 2;
    const q = s * 0.46;
    g.fillStyle = L.light;
    g.beginPath();
    g.moveTo(cx, y + s * 0.04);
    g.lineTo(cx + q, y + s * 0.27);
    g.lineTo(cx, y + s * 0.5);
    g.lineTo(cx - q, y + s * 0.27);
    g.closePath();
    g.fill();
    g.fillStyle = L.accent;
    g.beginPath();
    g.moveTo(cx - q, y + s * 0.27);
    g.lineTo(cx, y + s * 0.5);
    g.lineTo(cx, y + s * 0.98);
    g.lineTo(cx - q, y + s * 0.74);
    g.closePath();
    g.fill();
    g.fillStyle = L.deep;
    g.beginPath();
    g.moveTo(cx + q, y + s * 0.27);
    g.lineTo(cx, y + s * 0.5);
    g.lineTo(cx, y + s * 0.98);
    g.lineTo(cx + q, y + s * 0.74);
    g.closePath();
    g.fill();
  }
  g.restore();
}

/**
 * One side of a box body, the way the reference's trucks are printed: an accent rim along the top and the front edge, a swoosh
 * along the bottom that rises toward the rear with a light stripe over it, the mark + wordmark + tagline near the front.
 * frontLeft: the front of the vehicle is at the canvas's left (the -z side seen from outside).
 */
function drawSide(g, w, h, L, {frontLeft, title, tagline, frame = L.frame, swoosh = true, mark = L.mark, rise = 0.13, base = 0.79}) {
  const X = (u) => (frontLeft ? u * w : (1 - u) * w);
  const top = (u) => h * (base - rise * Math.pow(u, 1.35) + 0.018 * Math.sin(u * PI * 2));
  if (swoosh) {
    const band = (off, th, col) => {
      g.fillStyle = col;
      g.beginPath();
      for (let i = 0; i <= 60; i++) {
        const u = i / 60;
        g.lineTo(X(u), top(u) + off);
      }
      for (let i = 60; i >= 0; i--) {
        const u = i / 60;
        g.lineTo(X(u), th === null ? h : top(u) + off + th);
      }
      g.closePath();
      g.fill();
    };
    band(-h * 0.062, h * 0.034, L.light);
    band(0, null, L.accent);
  }
  if (frame) {
    g.fillStyle = L.accent;
    g.fillRect(0, 0, w, h * 0.048);
    g.fillRect(frontLeft ? 0 : w - h * 0.048, 0, h * 0.048, h);
  }
  if (title) {
    const ms = h * 0.3;
    g.font = `800 ${h * 0.25}px ${FONT}`;
    const tw = g.measureText(title).width;
    g.font = `600 ${h * 0.074}px ${FONT}`;
    const gw = tagline ? g.measureText(tagline).width : 0;
    const bw = (mark ? ms + h * 0.08 : 0) + Math.max(tw, gw);
    const x0 = frontLeft ? w * 0.09 : w * 0.91 - bw;
    const y0 = h * 0.38;
    if (mark) drawMark(g, mark, x0, y0 - ms / 2, ms, L);
    const tx = x0 + (mark ? ms + h * 0.08 : 0);
    g.fillStyle = C.text;
    g.textBaseline = 'alphabetic';
    g.font = `800 ${h * 0.25}px ${FONT}`;
    g.fillText(title, tx, y0 + h * 0.065);
    if (tagline) {
      g.fillStyle = C.tagline;
      g.font = `600 ${h * 0.074}px ${FONT}`;
      g.fillText(tagline, tx + h * 0.012, y0 + h * 0.165);
    }
  }
}
const sideTex = (key, w, h, L, opts) => canvasTex(`side|${key}`, w, h, (g) => drawSide(g, w, h, L, opts));

/** a text plate: fg text, optional rounded bg, sized to the text */
function textTex(text, {fg = C.text, bg = null, weight = 800, px = 96, pad = 26} = {}) {
  const key = `txt|${text}|${fg}|${bg}|${weight}|${px}`;
  if (TEX.has(key)) return TEX.get(key);
  const probe = document.createElement('canvas').getContext('2d');
  probe.font = `${weight} ${px}px ${FONT}`;
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
    g.font = `${weight} ${px}px ${FONT}`;
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    g.fillText(text, W / 2, H / 2 + px * 0.04);
  });
}

// ================================================================ geometry kit
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
const sphere = (r) => cg(`sp|${r}`, () => new THREE.SphereGeometry(r, 18, 12));
const dome = (r) => cg(`dome|${r}`, () => new THREE.SphereGeometry(r, 18, 8, 0, PI * 2, 0, PI / 2));
const planeG = (w, h) => cg(`pl|${w.toFixed(3)}|${h.toFixed(3)}`, () => new THREE.PlaneGeometry(w, h));

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
/** a fender: a half ring in the xy plane around the origin, extruded d along z */
const fender = (rIn, rOut, d) =>
  cg(`fd|${rIn}|${rOut}|${d}`, () => {
    const s = new THREE.Shape();
    s.absarc(0, 0, rOut, 0.05, PI - 0.05, false);
    s.absarc(0, 0, rIn, PI - 0.05, 0.05, true);
    const b = Math.min(0.05, (rOut - rIn) * 0.3);
    const g = new THREE.ExtrudeGeometry(s, {depth: d - 2 * b, bevelEnabled: true, bevelThickness: b, bevelSize: b, bevelSegments: 3, curveSegments: 24});
    g.translate(0, 0, -(d - 2 * b) / 2);
    return g;
  });

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
  /** the same box on both sides, z0..z1 and -z1..-z0 */
  pair(mat, x0, x1, y0, y1, z0, z1, r) {
    this.ext(mat, x0, x1, y0, y1, z0, z1, r);
    return this.ext(mat, x0, x1, y0, y1, -z1, -z0, r);
  }
  /** a cylinder along 'x', 'y' or 'z' */
  cyl(mat, r0, r1, h, x, y, z, axis = 'y', seg = 20) {
    const g = cylG(r0, r1, h, seg);
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
  /** a square bar with rounded edges between two points (cage posts, rails) */
  bar(mat, a, b, t = 0.12) {
    const A = V3(...a);
    const d = V3(...b).sub(A);
    const len = d.length();
    _q.setFromUnitVectors(V3(0, 1, 0), d.clone().normalize());
    return this.put(mat, rb(t, len + t, t, t * 0.4), _m.compose(A.addScaledVector(d, 0.5), _q, _s.set(1, 1, 1)));
  }
  /** a flat print of width w, height h facing +z, turned by ry */
  print(mat, w, h, x, y, z, ry = 0, rx = 0) {
    return this.add(mat, planeG(w, h), x, y, z, rx, ry, 0);
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

// ================================================================ wheels
/** a chunky tyre with round shoulders, axis along z */
function tyreGeo(r, w) {
  return cg(`tyre|${r}|${w}`, () => {
    const ri = r * 0.54;
    const hw = w / 2;
    const c = Math.min(hw * 0.78, (r - ri) * 0.62);
    const pts = [V2(ri, -hw * 0.84), V2((ri + r - c) / 2, -hw * 1.0)];
    for (let i = 0; i <= 7; i++) {
      const a = -PI / 2 + (PI / 2) * (i / 7);
      pts.push(V2(r - c + c * Math.cos(a), -hw + c + c * Math.sin(a)));
    }
    for (let i = 0; i <= 7; i++) {
      const a = (PI / 2) * (i / 7);
      pts.push(V2(r - c + c * Math.cos(a), hw - c + c * Math.sin(a)));
    }
    pts.push(V2((ri + r - c) / 2, hw * 1.0), V2(ri, hw * 0.84));
    const g = new THREE.LatheGeometry(pts, 44);
    g.rotateX(PI / 2);
    return g;
  });
}
/** the light hub disc with a stepped centre, both faces */
function hubGeo(r, w) {
  return cg(`hub|${r}|${w}`, () => {
    const P = new Parts();
    const ri = r * 0.54;
    P.cyl(null, ri + 0.004, ri + 0.004, w * 0.76, 0, 0, 0, 'z', 36);
    P.cyl(null, ri * 0.8, ri * 0.86, w * 0.84, 0, 0, 0, 'z', 32);
    return mergeGeometries(P.map.get(null), false);
  });
}
/** the dark cap and 5 nuts, so a turning wheel reads as turning */
function capGeo(r, w) {
  return cg(`cap|${r}|${w}`, () => {
    const P = new Parts();
    const ri = r * 0.54;
    P.cyl(null, ri * 0.3, ri * 0.3, w * 0.9, 0, 0, 0, 'z', 24);
    for (let k = 0; k < 5; k++) {
      const a = (k / 5) * PI * 2;
      P.cyl(null, ri * 0.075, ri * 0.075, w * 0.88, Math.cos(a) * ri * 0.55, Math.sin(a) * ri * 0.55, 0, 'z', 8);
    }
    return mergeGeometries(P.map.get(null), false);
  });
}
/** one wheel: a group (tyre, hub, cap) spinning about its local z, centred at its axle */
function makeWheel(r, w) {
  const M = mats();
  const g = new THREE.Group();
  part(tyreGeo(r, w), M.tyre, g);
  part(hubGeo(r, w), M.hub, g);
  part(capGeo(r, w), M.hubCap, g);
  g.userData.r = r;
  return g;
}
/** a pair of wheels at x, +-z; steer = true puts each on a pivot */
function axle(parent, list, r, w, x, z, steer = null) {
  for (const sz of [-1, 1]) {
    const wh = makeWheel(r, w);
    if (steer) {
      const pivot = new THREE.Group();
      pivot.position.set(x, r, sz * z);
      pivot.add(wh);
      parent.add(pivot);
      steer.push(pivot);
    } else {
      wh.position.set(x, r, sz * z);
      parent.add(wh);
    }
    list.push(wh);
  }
}
const roller = (wheels) => (d) => {
  for (const w of wheels) w.rotation.z = -d / w.userData.r;
};
const steerer = (pivots) => (a) => {
  for (const p of pivots) p.rotation.y = a;
};

/** a bar mesh (unit length along x) placed from a to b in its parent's frame */
const _d = new THREE.Vector3();
function placeBar(m, ax, ay, az, bx, by, bz, stretch = true) {
  _d.set(bx - ax, by - ay, bz - az);
  const len = _d.length();
  m.position.set((ax + bx) / 2, (ay + by) / 2, (az + bz) / 2);
  m.quaternion.setFromUnitVectors(V3(1, 0, 0), _d.normalize());
  if (stretch) m.scale.set(len, 1, 1);
}
/** a bar of unit length along x with a rounded-rectangle section t (y) by d (z), safe to stretch along x */
const barGeo = (t, d, r = Math.min(t, d) * 0.35) =>
  cg(`bar|${t}|${d}|${r}`, () => {
    const s = roundedPoly([V2(-d / 2, -t / 2), V2(d / 2, -t / 2), V2(d / 2, t / 2), V2(-d / 2, t / 2)], r);
    const g = new THREE.ExtrudeGeometry(s, {depth: 1, bevelEnabled: false, curveSegments: 6});
    g.rotateY(PI / 2);
    g.translate(-0.5, 0, 0);
    return g;
  });

/**
 * A scissor lift: n arm pairs per side at +-z, base pivot at x0, arm length L, between yBase and the deck's underside.
 * Returns set(top) where top is the deck underside height. Arms live in parent's frame.
 */
function scissor(parent, mat, {x0, L, z, yBase, stages = 1, t = 0.16, d = 0.14, dir = 1}) {
  const arms = [];
  const geo = rb(L + t, t, d, Math.min(t, d) * 0.4);
  for (let s = 0; s < stages; s++)
    for (const sz of [-1, 1])
      for (const k of [0, 1]) {
        const m = part(geo, mat, parent);
        m.userData = {s, k, sz};
        arms.push(m);
      }
  const tube = part(cylG(0.06, 0.06, 1, 10), mat, parent);
  const tube2 = part(cylG(0.06, 0.06, 1, 10), mat, parent);
  return (top) => {
    const rise = Math.max(0.04, top - yBase);
    const hs = rise / stages;
    const th = Math.asin(clamp(hs / L, 0, 0.98));
    const span = L * Math.cos(th);
    for (const m of arms) {
      const {s, k, sz} = m.userData;
      const ya = yBase + s * hs;
      const yb = ya + hs;
      const xa = x0;
      const xb = x0 + dir * span;
      // the arms are rounded boxes of unit length: stretch along x, keep the section
      if (k === 0) placeBar(m, xa, ya, sz * z, xb, yb, sz * z, false);
      else placeBar(m, xa, yb, sz * z, xb, ya, sz * z, false);
    }
    const midY = yBase + hs / 2;
    tube.position.set(x0 + (dir * span) / 2, midY, 0);
    tube.rotation.set(PI / 2, 0, 0);
    tube.scale.set(1, z * 2, 1);
    tube2.position.set(x0 + dir * span, yBase + 0.08, 0);
    tube2.rotation.set(PI / 2, 0, 0);
    tube2.scale.set(1, z * 2, 1);
  };
}

/** a hydraulic ram between two points in parent's frame: dark barrel + steel rod; returns set(a, b) */
function ram(parent, rBarrel = 0.1, lBarrel = 1.2) {
  const M = mats();
  const barrel = part(cg(`ramb|${rBarrel}|${lBarrel}`, () => new THREE.CylinderGeometry(rBarrel, rBarrel, lBarrel, 14).rotateZ(-PI / 2).translate(lBarrel / 2, 0, 0)), M.ink, parent);
  const rod = part(cg(`ramr|${rBarrel}`, () => new THREE.CylinderGeometry(rBarrel * 0.55, rBarrel * 0.55, 1, 12).rotateZ(-PI / 2).translate(0.5, 0, 0)), M.steel, parent);
  return (a, b) => {
    _d.subVectors(b, a);
    const len = _d.length();
    _d.normalize();
    const q = new THREE.Quaternion().setFromUnitVectors(V3(1, 0, 0), _d);
    barrel.position.copy(a);
    barrel.quaternion.copy(q);
    rod.position.copy(b);
    rod.quaternion.copy(q).multiply(new THREE.Quaternion().setFromAxisAngle(V3(0, 1, 0), PI));
    rod.scale.set(Math.max(0.05, len - lBarrel * 0.6), 1, 1);
  };
}

// ================================================================ the cab-over cab (box, catering, fuel, stairs)
/**
 * The reference's truck cab: a chunky rounded box over the front axle, a big dark windshield, a dark side window close to the
 * front corner, a dark grille with light slats, cream lamps at the lower corners, a light bumper, black mirrors.
 */
function cab(P, {x0, x1, y0 = 0.62, top, W, color, wheelX, wheelR, stripe = null, seam}) {
  const M = mats();
  const b = 0.17;
  const key = [x0, x1, y0, top, W, wheelX, wheelR].join('|');
  P.add(paint(color, 0.46), extrude(`cab|${key}`, () => profile(x0, x1, y0, top, {arches: [[wheelX, wheelR, wheelR + 0.15]], rc: [0.14, 0.34, 0.44, 0.34]}, b), W, b));
  const hw = W / 2;
  const H = top - y0;
  // the reference's proportions, top down: a blue band, a big windshield (a third of the cab), a band, the grille, the bumper
  const wt = Math.min(top - 0.12 * H, top - 0.46);
  const wb = top - 0.5 * H;
  // windshield and side windows
  P.ext(M.glass, x1 - 0.08, x1 + 0.035, wb, wt, -hw + 0.27, hw - 0.27, 0.05);
  for (const s of [-1, 1]) {
    P.ext(M.glass, x1 - Math.min(1.62, (x1 - x0) * 0.56), x1 - 0.34, wb, wt, s > 0 ? hw - 0.06 : -hw - 0.035, s > 0 ? hw + 0.035 : -hw + 0.06, 0.05);
    // door seam and handle
    P.ext(paint(seam), x1 - Math.min(1.8, (x1 - x0) * 0.62), x1 - Math.min(1.76, (x1 - x0) * 0.62) + 0.04, y0 + 0.85, top - 0.3, s > 0 ? hw - 0.02 : -hw - 0.012, s > 0 ? hw + 0.012 : -hw + 0.02, 0.008);
    P.ext(M.ink, x1 - 1.45, x1 - 1.15, wb - 0.3, wb - 0.22, s > 0 ? hw - 0.02 : -hw - 0.04, s > 0 ? hw + 0.04 : -hw + 0.02, 0.02);
    // the mirror on its arm, level with the windshield
    P.bar(M.ink, [x1 - 0.2, wt - 0.25, s * (hw - 0.05)], [x1 - 0.05, wt - 0.25, s * (hw + 0.36)], 0.07);
    P.ext(M.ink, x1 - 0.12, x1 + 0.02, wt - 0.95, wt - 0.12, s * (hw + 0.32) - 0.1, s * (hw + 0.32) + 0.1, 0.05);
    if (stripe) P.ext(paint(stripe, 0.46), x0 + 0.22, x1 - 0.3, wb - 0.55, wb - 0.33, s > 0 ? hw - 0.02 : -hw - 0.02, s > 0 ? hw + 0.02 : -hw + 0.02, 0.01);
  }
  // grille with slats, lamps, bumper
  const gb = y0 + 0.18 * H;
  const gt = wb - 0.07 * H;
  P.ext(M.ink, x1 - 0.06, x1 + 0.04, gb, gt, -0.92, 0.92, 0.06);
  const n = 5;
  for (let k = 0; k < n; k++) P.ext(M.bumper, x1 + 0.01, x1 + 0.065, gb + ((gt - gb) * (k + 0.55)) / (n + 0.1) - 0.03, gb + ((gt - gb) * (k + 0.55)) / (n + 0.1) + 0.03, -0.8, 0.8, 0.02);
  for (const s of [-1, 1]) P.ext(M.lamp, x1 - 0.05, x1 + 0.045, gb, gb + 0.1 * H, s > 0 ? hw - 0.62 : -hw + 0.2, s > 0 ? hw - 0.2 : -hw + 0.62, 0.06);
  P.ext(M.bumper, x1 - 0.3, x1 + 0.28, y0 - 0.06, y0 + 0.56, -hw - 0.08, hw + 0.08, 0.2);
}

// ================================================================ the reference's box truck
export function buildToyBoxTruck({livery = 'aurora'} = {}) {
  const L = liv(livery);
  const M = mats();
  const group = new THREE.Group();
  const W = 3.5;
  const BW = 3.72;
  const R = 0.75;
  const bx0 = -6.05;
  const bx1 = 2.95;
  const by0 = 1.55;
  const by1 = 5.45;
  const rearLen = 1.0;
  tpl(`boxtruck|${livery}`, (P) => {
    cab(P, {x0: 3.05, x1: 6.0, top: 4.1, W, color: L.cab, wheelX: 4.35, wheelR: R, stripe: L.stripe, seam: L.cab === TOY.white ? TOY.shade : TOY.blueDeep});
    // chassis, side guards and tank, under-ride bar, tail lamps
    P.ext(M.chassis, -5.95, 3.6, 0.95, 1.6, -1.05, 1.05, 0.08);
    P.ext(M.chassis, -1.75, 2.6, 0.8, 1.52, -1.62, 1.62, 0.16);
    P.ext(M.chassis, -6.14, -5.86, 0.72, 1.04, -1.74, 1.74, 0.09);
    for (const s of [-1, 1]) P.ext(M.tail, -6.18, -6.1, 0.78, 0.98, s * 1.5 - 0.17, s * 1.5 + 0.17, 0.03);
    // the box: body and the rear door frame, a touch proud of it
    P.ext(M.white, bx0 + rearLen - 0.05, bx1, by0, by1, -BW / 2, BW / 2, 0.24);
    P.ext(M.panel, bx0, bx0 + rearLen, by0 - 0.02, by1 + 0.02, -BW / 2 - 0.02, BW / 2 + 0.02, 0.22);
    // the printed sides
    const dx0 = bx0 + rearLen + 0.08;
    const dx1 = bx1 - 0.2;
    const dy0 = by0 + 0.2;
    const dy1 = by1 - 0.2;
    const dw = dx1 - dx0;
    const dh = dy1 - dy0;
    const cw = 2048;
    const ch = Math.round((cw * dh) / dw);
    const title = L.name;
    const tagline = livery === 'kestrel' ? 'Freight and catering, all day' : 'Air cargo, door to door';
    for (const s of [-1, 1]) {
      const tex = sideTex(`box|${livery}|${s}`, cw, ch, L, {frontLeft: s < 0, title, tagline, mark: L.mark ?? null});
      P.print(decalMat(tex), dw, dh, (dx0 + dx1) / 2, (dy0 + dy1) / 2, s * (BW / 2 + 0.004), s > 0 ? 0 : PI);
    }
    // the front of the box above the cab: an accent rim on top
    if (L.frame) P.print(decalMat(canvasTex(`boxfront|${livery}`, 512, 64, (g, w, h) => {
      g.fillStyle = L.accent;
      g.fillRect(0, 0, w, h);
    })), BW - 0.5, 0.16, bx1 + 0.004, by1 - 0.3, 0, PI / 2);
    // rear doors: seams, lock bars, a small mark
    const rearTex = canvasTex(`rear|${livery}`, 512, 512, (g, w, h) => {
      g.strokeStyle = 'rgba(40,52,90,0.35)';
      g.lineWidth = 5;
      g.strokeRect(14, 14, w - 28, h - 28);
      g.beginPath();
      g.moveTo(w / 2, 14);
      g.lineTo(w / 2, h - 14);
      g.stroke();
      if (L.mark) drawMark(g, L.mark, w * 0.62, h * 0.14, w * 0.17, L);
      g.fillStyle = L.accent;
      g.fillRect(14, h - 70, w - 28, 56);
    });
    P.print(decalMat(rearTex), BW - 0.36, by1 - by0 - 0.3, bx0 - 0.004, (by0 + by1) / 2, 0, -PI / 2);
    for (const z of [-1.25, -0.42, 0.42, 1.25]) P.cyl(M.steel, 0.045, 0.045, by1 - by0 - 0.7, bx0 - 0.07, (by0 + by1) / 2, z, 'y', 10);
  }, group);
  const wheels = [];
  const steer = [];
  axle(group, wheels, R, 0.64, 4.35, 1.4, steer);
  for (const x of [-2.75, -4.22]) axle(group, wheels, R, 0.64, x, 1.5);
  return {group, roll: roller(wheels), setSteer: steerer(steer), rear: {x: bx0 - 0.04, y: by0}, length: 12.3};
}

// ================================================================ the reference's forklift
export function buildToyForklift() {
  const M = mats();
  const group = new THREE.Group();
  const body = new THREE.Group();
  body.position.x = -0.45; // origin at the middle of the whole length, forks included
  group.add(body);
  tpl('forklift', (P) => {
    // the blue chassis with the front arch, the yellow counterweight body with the rear arch
    // the reference's split: the blue body is the front half and nearly as tall as the yellow counterweight behind it
    P.add(M.blue, extrude('fl-base', () => profile(-0.6, 1.02, 0.3, 1.48, {arches: [[0.62, 0.5, 0.56]], rc: [0.1, 0.24, 0.28, 0.1]}, 0.14), 1.74, 0.14));
    P.add(M.yellow, extrude('fl-cw', () => profile(-1.82, -0.32, 0.28, 1.7, {arches: [[-1.12, 0.4, 0.46]], rc: [0.2, 0.12, 0.34, 0.52]}, 0.2), 1.86, 0.2));
    // the yellow cowl along the front top of the body
    P.ext(M.yellow, 0.3, 1.08, 1.4, 1.58, -0.89, 0.89, 0.08);
    // dash, steering column and wheel
    P.ext(M.ink, 0.6, 0.98, 1.52, 1.96, -0.46, 0.46, 0.1);
    P.rod(M.ink, [0.66, 1.9, 0], [0.38, 2.22, 0], 0.06);
    P.add(M.ink, cg('fl-wheel', () => new THREE.TorusGeometry(0.22, 0.045, 10, 28).rotateX(PI / 2).rotateZ(0.55)), 0.36, 2.24, 0);
    // the seat over the seam between body and counterweight
    P.ext(M.ink, -0.95, -0.22, 1.66, 1.88, -0.44, 0.44, 0.1);
    P.add(M.ink, rb(0.18, 0.78, 0.84, 0.08), -0.95, 2.18, 0, 0, 0, 0.14);
    // the overhead guard: 4 posts, a frame and 5 slats across
    const t = 0.14;
    const gy = 3.12;
    const rx = -1.02;
    for (const s of [-1, 1]) {
      P.bar(M.ink, [rx, 1.6, s * 0.8], [rx, gy, s * 0.8], t);
      P.bar(M.ink, [0.94, 1.5, s * 0.8], [0.66, gy, s * 0.8], t);
      P.ext(M.ink, rx - 0.12, 0.78, gy - 0.08, gy + 0.08, s * 0.8 - 0.08, s * 0.8 + 0.08, 0.05);
    }
    for (const x of [rx - 0.05, 0.72]) P.ext(M.ink, x - 0.08, x + 0.08, gy - 0.08, gy + 0.08, -0.88, 0.88, 0.05);
    for (const z of [-0.48, -0.16, 0.16, 0.48]) P.ext(M.ink, rx - 0.05, 0.72, gy - 0.05, gy + 0.06, z - 0.07, z + 0.07, 0.035);
    P.beacon(rx + 0.05, gy + 0.08, 0, 0.11);
    // the mast: 2 uprights, cross bars, tilt rams
    for (const s of [-1, 1]) {
      P.ext(M.ink, 1.12, 1.3, 0.22, 3.38, s * 0.5 - 0.09, s * 0.5 + 0.09, 0.05);
      P.rod(M.ink, [0.78, 1.05, s * 0.58], [1.13, 1.5, s * 0.52], 0.055);
    }
    P.ext(M.ink, 1.1, 1.32, 3.2, 3.36, -0.6, 0.6, 0.05);
    P.ext(M.ink, 1.1, 1.32, 0.34, 0.52, -0.6, 0.6, 0.05);
    P.ext(M.ink, 1.12, 1.3, 1.72, 1.84, -0.5, 0.5, 0.04);
    // rear lamps on the counterweight
    for (const s of [-1, 1]) P.ext(M.tail, -1.86, -1.8, 1.2, 1.36, s * 0.66 - 0.1, s * 0.66 + 0.1, 0.03);
  }, body);
  // the carriage: plate, load backrest, 2 forks
  const carriage = new THREE.Group();
  body.add(carriage);
  tpl('forklift-carriage', (P) => {
    P.ext(M.ink, 1.31, 1.47, 0.14, 1.02, -0.64, 0.64, 0.06);
    for (const z of [-0.5, 0.5]) P.ext(M.ink, 1.34, 1.44, 1.0, 1.42, z - 0.05, z + 0.05, 0.02);
    P.ext(M.ink, 1.33, 1.45, 1.36, 1.46, -0.6, 0.6, 0.03);
    for (const s of [-1, 1]) {
      P.ext(M.ink, 1.44, 1.54, 0.04, 0.78, s * 0.36 - 0.09, s * 0.36 + 0.09, 0.03);
      P.ext(M.ink, 1.44, 2.72, 0.02, 0.12, s * 0.36 - 0.09, s * 0.36 + 0.09, 0.035);
    }
  }, carriage);
  const wheels = [];
  axle(body, wheels, 0.5, 0.44, 0.62, 0.74);
  axle(body, wheels, 0.4, 0.38, -1.12, 0.74);
  const setForks = (h) => {
    carriage.position.y = clamp(h, 0, 2.4);
  };
  setForks(0);
  return {group, roll: roller(wheels), setForks, length: 4.6};
}

// ================================================================ baggage tug
export function buildToyTug({livery = 'aurora', number = '12'} = {}) {
  const L = liv(livery);
  const M = mats();
  const group = new THREE.Group();
  const W = 2.3;
  const R = 0.48;
  tpl(`tug|${livery}|${number}`, (P) => {
    P.add(paint(L.accent, 0.46), extrude('tug-body', () => profile(-2.2, 2.25, 0.3, 1.28, {arches: [[1.38, R, R + 0.13], [-1.32, R, R + 0.13]], rc: [0.2, 0.3, 0.36, 0.3]}, 0.15), W, 0.15));
    // the white hood and the cab
    P.ext(M.white, 0.28, 2.16, 1.12, 1.6, -1.04, 1.04, 0.24);
    P.ext(M.white, -2.08, 0.42, 1.12, 1.82, -1.12, 1.12, 0.2);
    P.ext(M.glass, -1.95, 0.32, 1.7, 2.62, -1.04, 1.04, 0.1);
    for (const x of [-1.96, 0.3]) for (const s of [-1, 1]) P.ext(M.white, x - 0.1, x + 0.1, 1.7, 2.66, s * 1.06 - 0.1, s * 1.06 + 0.1, 0.05);
    P.ext(M.white, -2.14, 0.5, 2.6, 2.9, -1.17, 1.17, 0.13);
    P.beacon(-0.8, 2.9, 0, 0.13);
    // lamps, bumper, hitch
    for (const s of [-1, 1]) P.ext(M.lamp, 2.2, 2.27, 0.88, 1.08, s * 0.72 - 0.17, s * 0.72 + 0.17, 0.04);
    P.ext(M.rubber, 2.12, 2.42, 0.4, 0.74, -1.06, 1.06, 0.14);
    P.ext(M.ink, -2.42, -2.14, 0.44, 0.72, -0.3, 0.3, 0.06);
    P.cyl(M.steel, 0.06, 0.06, 0.5, -2.32, 0.6, 0);
    // the fleet number on the cab sides
    for (const s of [-1, 1]) P.text(`T-${number}`, {fg: L.accent, px: 110}, 0.36, -0.82, 1.45, s * 1.125, s > 0 ? 0 : PI);
  }, group);
  const wheels = [];
  const steer = [];
  axle(group, wheels, R, 0.42, 1.38, 0.95, steer);
  axle(group, wheels, R, 0.42, -1.32, 0.95);
  return {group, roll: roller(wheels), setSteer: steerer(steer), hitch: V3(-2.4, 0.6, 0), length: 4.6};
}

// ================================================================ baggage dolly
export function buildToyDolly({livery = 'aurora'} = {}) {
  const L = liv(livery);
  const M = mats();
  const group = new THREE.Group();
  const cx = -0.45;
  const deckY = 1.0;
  tpl(`dolly|${livery}`, (P) => {
    P.ext(paint(L.accent, 0.46), cx - 1.65, cx + 1.65, 0.62, 0.94, -1.36, 1.36, 0.14);
    P.ext(M.panel, cx - 1.6, cx + 1.6, 0.86, deckY - 0.02, -1.3, 1.3, 0.05);
    for (let k = 0; k < 10; k++) P.cyl(M.steel, 0.055, 0.055, 2.3, cx - 1.42 + k * 0.315, deckY - 0.01, 0, 'z', 10);
    // corner stops and low side guides
    for (const xs of [-1, 1])
      for (const s of [-1, 1]) P.ext(M.white, cx + xs * 1.56 - 0.08, cx + xs * 1.56 + 0.08, deckY - 0.1, deckY + 0.42, s * 1.26 - 0.08, s * 1.26 + 0.08, 0.05);
    for (const s of [-1, 1]) P.ext(M.white, cx - 1.5, cx + 1.5, deckY - 0.04, deckY + 0.1, s * 1.27 - 0.05, s * 1.27 + 0.05, 0.03);
    // tow bar with its ring, rear hitch
    P.bar(M.ink, [cx + 1.6, 0.68, -0.5], [cx + 2.45, 0.56, 0], 0.1);
    P.bar(M.ink, [cx + 1.6, 0.68, 0.5], [cx + 2.45, 0.56, 0], 0.1);
    P.add(M.ink, cg('ring', () => new THREE.TorusGeometry(0.14, 0.045, 8, 20)), cx + 2.6, 0.56, 0, PI / 2, 0, 0);
    P.ext(M.ink, cx - 1.88, cx - 1.6, 0.56, 0.76, -0.24, 0.24, 0.05);
  }, group);
  const slot = new THREE.Group();
  slot.position.set(cx, deckY + 0.04, 0);
  group.add(slot);
  const wheels = [];
  axle(group, wheels, 0.36, 0.3, cx + 1.05, 1.08);
  axle(group, wheels, 0.36, 0.3, cx - 1.05, 1.08);
  return {group, roll: roller(wheels), slot, slotY: deckY + 0.04, hitch: V3(cx - 1.85, 0.66, 0), eye: V3(cx + 2.6, 0.56, 0), length: 4.6};
}

// ================================================================ ULD (LD3 contour)
export function buildToyULD({color = TOY.blue, id = 'AKE 40217 AU'} = {}) {
  const M = mats();
  const group = new THREE.Group();
  const D = 2.2;
  const pts = [V2(-1.11, 0.15), V2(0.45, 0.15), V2(1.11, 0.88), V2(1.11, 2.11), V2(-1.11, 2.11)];
  tpl(`uld|${color}|${id}`, (P) => {
    P.add(M.panel, extrude('uld-body', () => roundedPoly(pts.map((p) => p.clone()), [0.1, 0.12, 0.16, 0.16, 0.16]), D, 0.09));
    P.ext(M.chassis, -1.18, 0.5, 0, 0.12, -1.08, 1.08, 0.04);
    // the door curtain on +z: inset contour, 3 straps, the id plate
    const inset = [V2(-1.0, 0.24), V2(0.38, 0.24), V2(1.0, 0.94), V2(1.0, 2.0), V2(-1.0, 2.0)];
    for (const s of [-1, 1]) {
      P.add(paint(color, 0.6), extrude(`uld-door`, () => roundedPoly(inset, 0.1), 0.08, 0.025), 0, 0, s * (D / 2 + 0.01));
      for (const y of [0.62, 1.22, 1.78]) {
        const xr = y < 0.94 ? 0.38 + ((y - 0.24) / 0.7) * 0.62 - 0.12 : 0.88;
        P.ext(M.white, -0.96, xr, y - 0.05, y + 0.05, s > 0 ? D / 2 + 0.03 : -D / 2 - 0.07, s > 0 ? D / 2 + 0.07 : -D / 2 - 0.03, 0.02);
      }
    }
    P.text(id, {fg: C.text, bg: TOY.white, px: 80, pad: 22}, 0.24, -0.35, 2.06, D / 2 + 0.08);
    // the same plate on the back
    P.text(id, {fg: C.text, bg: TOY.white, px: 80, pad: 22}, 0.24, 0.35, 2.06, -D / 2 - 0.08, PI);
  }, group);
  return {group, roll() {}, width: 2.4, depth: D, height: 2.2};
}

// ================================================================ belt loader
export function buildToyBeltLoader({livery = 'aurora'} = {}) {
  const L = liv(livery);
  const M = mats();
  const group = new THREE.Group();
  const W = 2.5;
  const R = 0.5;
  const pivot = V3(-4.5, 1.22, 0.42);
  const BL = 9.6; // boom length along its own axis
  const BT = 0.22; // belt surface above the boom axis
  tpl(`belt|${livery}`, (P) => {
    P.add(M.white, extrude('belt-chassis', () => profile(-4.75, 4.1, 0.3, 1.3, {arches: [[-3.05, R, R + 0.13], [2.75, R, R + 0.13]], rc: [0.2, 0.3, 0.32, 0.28]}, 0.15), W, 0.15));
    for (const s of [-1, 1]) P.ext(paint(L.accent, 0.46), -2.35, 2.05, 0.74, 0.98, s > 0 ? W / 2 - 0.02 : -W / 2 - 0.02, s > 0 ? W / 2 + 0.02 : -W / 2 + 0.02, 0.01);
    // the driver's cab on the left, beside the boom
    P.ext(M.white, 0.55, 2.35, 1.22, 1.74, -1.26, -0.42, 0.14);
    P.ext(M.glass, 0.65, 2.25, 1.67, 2.5, -1.2, -0.48, 0.08);
    for (const x of [0.66, 2.24]) for (const z of [-1.2, -0.48]) P.ext(M.white, x - 0.08, x + 0.08, 1.67, 2.52, z - 0.07, z + 0.07, 0.04);
    P.ext(M.white, 0.5, 2.4, 2.48, 2.68, -1.3, -0.38, 0.09);
    P.beacon(1.45, 2.68, -0.84, 0.12);
    // the boom's rear pivot bracket and the front lift mount
    P.ext(M.ink, pivot.x - 0.3, pivot.x + 0.35, 1.02, 1.37, pivot.z - 0.85, pivot.z + 0.85, 0.06);
    P.ext(M.ink, 2.0, 2.5, 1.17, 1.42, pivot.z - 0.75, pivot.z + 0.75, 0.06);
    for (const s of [-1, 1]) P.ext(M.lamp, 4.07, 4.13, 0.86, 1.06, s * 0.8 - 0.15, s * 0.8 + 0.15, 0.03);
    P.ext(M.rubber, 3.98, 4.28, 0.36, 0.64, -1.1, 1.1, 0.12);
  }, group);
  // the boom, pivoting at its rear end
  const boom = new THREE.Group();
  boom.position.copy(pivot);
  group.add(boom);
  tpl('belt-boom', (P) => {
    for (const s of [-1, 1]) P.ext(M.yellow, 0, BL, -0.3, 0.34, s * 0.62 - 0.1, s * 0.62 + 0.1, 0.09);
    P.ext(M.yellow, 0.2, BL - 0.2, -0.44, -0.2, -0.66, 0.66, 0.08);
    for (const x of [0.16, BL - 0.16]) P.cyl(M.ink, 0.14, 0.14, 1.18, x, BT - 0.12, 0, 'z', 18);
    // hand rails on the upper half
    for (const s of [-1, 1]) {
      const z = s * 0.66;
      for (let x = 4.6; x <= 9.3; x += 1.175) P.rod(M.white, [x, 0.3, z], [x, 1.2, z], 0.045);
      P.rod(M.white, [4.6, 1.2, z], [9.3, 1.2, z], 0.05);
      P.rod(M.white, [4.6, 0.75, z], [9.3, 0.75, z], 0.035);
    }
    P.ext(M.rubber, BL - 0.05, BL + 0.2, -0.32, 0.34, -0.68, 0.68, 0.1);
  }, boom);
  // the belt: a plane on top of the boom with its own scrolling texture
  const beltTex = canvasTex(`belt-rubber`, 256, 128, (g, w, h) => {
    g.fillStyle = '#272c3b';
    g.fillRect(0, 0, w, h);
    g.lineCap = 'round';
    g.strokeStyle = '#4b5470';
    g.lineWidth = 14;
    for (const x0 of [64, 192]) {
      g.beginPath();
      g.moveTo(x0 - 26, 14);
      g.lineTo(x0 + 16, h / 2);
      g.lineTo(x0 - 26, h - 14);
      g.stroke();
    }
  }, {repeat: true}).clone();
  beltTex.wrapS = beltTex.wrapT = THREE.RepeatWrapping;
  beltTex.repeat.set((BL - 0.3) / 0.6, 1);
  beltTex.needsUpdate = true;
  const belt = part(cg('belt-plane', () => new THREE.PlaneGeometry(BL - 0.3, 1.14).rotateX(-PI / 2)), new THREE.MeshStandardMaterial({map: beltTex, roughness: 0.8}), boom);
  belt.position.set(BL / 2, BT, 0);
  // the lift links from the chassis mount to the boom underside
  const links = [-1, 1].map((s) => {
    const m = part(barGeo(0.2, 0.16), M.yellow, group);
    m.userData.s = s;
    return m;
  });
  const setRam = ram(group, 0.1, 1.0);
  const tipY = (a) => pivot.y + BL * Math.sin(a) + BT * Math.cos(a);
  const solve = (y) => {
    let lo = 0;
    let hi = 0.6;
    for (let i = 0; i < 40; i++) {
      const mid = (lo + hi) / 2;
      if (tipY(mid) < y) lo = mid;
      else hi = mid;
    }
    return (lo + hi) / 2;
  };
  const a0 = solve(1.5);
  const a1 = solve(3.4);
  const tip = V3();
  const A = V3();
  const B = V3();
  const setBoom = (k) => {
    const a = lerp(a0, a1, clamp(k, 0, 1));
    boom.rotation.z = a;
    const ca = Math.cos(a);
    const sa = Math.sin(a);
    // a boom-local point (bx, by) in the vehicle frame
    const at = (bx, by, out) => out.set(pivot.x + bx * ca - by * sa, pivot.y + bx * sa + by * ca, pivot.z);
    at(6.6, -0.42, B);
    for (const m of links) {
      const z = pivot.z + m.userData.s * 0.5;
      placeBar(m, 2.25, 1.32, z, B.x, B.y, z);
      m.scale.x += 0.2;
    }
    A.set(0.6, 1.27, pivot.z);
    at(3.6, -0.44, B);
    setRam(A, B);
    at(BL, BT, tip);
  };
  setBoom(0);
  const setBelt = (d) => {
    beltTex.offset.x = -d / 0.6;
  };
  const wheels = [];
  axle(group, wheels, R, 0.44, 2.75, 1.0);
  axle(group, wheels, R, 0.44, -3.05, 1.0);
  return {group, roll: roller(wheels), setBoom, setBelt, tip, length: 10.4};
}

// ================================================================ high loader
export function buildToyHighLoader({livery = 'aurora'} = {}) {
  const L = liv(livery);
  const M = mats();
  const group = new THREE.Group();
  const R = 0.5;
  const chassisTop = 0.92;
  const DT = 0.32; // deck thickness
  tpl(`hl|${livery}`, (P) => {
    P.ext(M.white, -4.5, 4.35, 0.42, chassisTop, -1.32, 1.32, 0.16);
    for (const s of [-1, 1]) P.ext(paint(L.accent, 0.46), -4.3, 4.15, 0.48, 0.66, s > 0 ? 1.3 : -1.36, s > 0 ? 1.36 : -1.3, 0.03);
    // fenders over the corner wheels
    for (const x of [-3.3, 2.9]) for (const s of [-1, 1]) P.add(M.white, fender(R + 0.08, R + 0.24, 0.56), x, R, s * 1.5);
    P.ext(M.rubber, 4.3, 4.55, 0.42, 0.78, -1.2, 1.2, 0.12);
    P.ext(M.ink, -4.62, -4.42, 0.45, 0.75, -0.9, 0.9, 0.06);
  }, group);
  // decks: groups whose y is the deck top
  const deck = (key, x0, x1, hw, make) => {
    const g = new THREE.Group();
    group.add(g);
    tpl(key, (P) => {
      P.ext(M.panel, x0, x1, -DT, 0, -hw, hw, 0.12);
      // roller rows printed on top
      const rollTex = canvasTex(`rollers`, 256, 256, (c, w, h) => {
        for (let k = 0; k < 10; k++) {
          c.fillStyle = 'rgba(120,134,175,0.55)';
          c.beginPath();
          c.roundRect(k * 25.6 + 7, 8, 11, h - 16, 5);
          c.fill();
        }
      });
      P.print(decalMat(rollTex), x1 - x0 - 0.5, hw * 2 - 0.6, (x0 + x1) / 2, 0.005, 0, 0, -PI / 2);
      make(P);
    }, g);
    return g;
  };
  const rear = deck('hl-rear', -4.45, 0.8, 1.76, (P) => {
    for (const s of [-1, 1]) P.ext(M.yellow, -4.4, 0.75, 0, 0.22, s * 1.6 - 0.12, s * 1.6 + 0.12, 0.08);
    for (const s of [-1, 1]) P.ext(M.yellow, -4.42, -4.2, 0, 0.6, s * 1.4 - 0.11, s * 1.4 + 0.11, 0.06);
  });
  const front = deck('hl-front', 1.0, 4.55, 1.42, (P) => {
    for (const s of [-1, 1]) {
      const z = s * 1.32;
      for (const x of [1.2, 2.2, 3.2]) P.rod(M.yellow, [x, 0, z], [x, 1.05, z], 0.055);
      P.rod(M.yellow, [1.2, 1.05, z], [3.2, 1.05, z], 0.06);
      P.rod(M.yellow, [1.2, 0.55, z], [3.2, 0.55, z], 0.045);
    }
    P.ext(M.rubber, 4.45, 4.7, -0.32, 0.06, -1.32, 1.32, 0.1);
    // the operator's cab hung on the left side of the front deck
    P.ext(M.white, 1.35, 2.95, -1.05, 0.25, -2.12, -1.42, 0.14);
    P.ext(M.glass, 1.45, 2.85, 0.2, 1.38, -2.06, -1.48, 0.08);
    for (const x of [1.46, 2.84]) for (const z of [-2.06, -1.48]) P.ext(M.white, x - 0.07, x + 0.07, 0.2, 1.4, z - 0.06, z + 0.06, 0.03);
    P.ext(M.white, 1.3, 3.0, 1.36, 1.56, -2.16, -1.38, 0.09);
    P.beacon(2.15, 1.56, -1.77, 0.11);
  });
  const slotRear = new THREE.Group();
  slotRear.position.set(-1.85, 0, 0);
  rear.add(slotRear);
  const slotFront = new THREE.Group();
  slotFront.position.set(2.75, 0, 0);
  front.add(slotFront);
  const yellowSteel = M.yellow;
  const setFS = scissor(group, yellowSteel, {x0: 1.35, L: 2.9, z: 1.0, yBase: chassisTop + 0.04});
  const setRS = scissor(group, yellowSteel, {x0: -4.15, L: 4.5, z: 1.2, yBase: chassisTop + 0.04});
  const setFront = (h) => {
    h = clamp(h, 1.4, 3.6);
    front.position.y = h;
    setFS(h - DT);
  };
  const setRear = (h) => {
    h = clamp(h, 1.32, 3.3);
    rear.position.y = h;
    setRS(h - DT);
  };
  setFront(1.4);
  setRear(1.32);
  const wheels = [];
  axle(group, wheels, R, 0.46, 2.9, 1.5);
  axle(group, wheels, R, 0.46, -3.3, 1.5);
  return {group, roll: roller(wheels), setFront, setRear, slotFront, slotRear, length: 9.2};
}

// ================================================================ catering truck
export function buildToyCateringTruck({livery = 'aurora'} = {}) {
  const L = liv(livery);
  const M = mats();
  const group = new THREE.Group();
  const W = 3.3;
  const BW = 3.4;
  const R = 0.62;
  const subTop = 1.55;
  const bx0 = -4.85;
  const bx1 = 2.35;
  const BH = 3.2;
  tpl(`cat|${livery}`, (P) => {
    cab(P, {x0: 2.6, x1: 5.0, top: 3.7, W, color: L.cab, wheelX: 3.65, wheelR: R, stripe: L.stripe, seam: L.cab === TOY.white ? TOY.shade : TOY.blueDeep});
    P.ext(M.chassis, -4.95, 2.8, 0.85, 1.35, -1.0, 1.0, 0.08);
    P.ext(M.white, -4.9, 2.4, 1.3, subTop, -1.55, 1.55, 0.1);
    P.ext(M.chassis, -5.08, -4.86, 0.66, 0.96, -1.6, 1.6, 0.08);
    for (const s of [-1, 1]) P.ext(M.tail, -5.12, -5.06, 0.7, 0.9, s * 1.35 - 0.15, s * 1.35 + 0.15, 0.03);
  }, group);
  // the box, floor at its group's y
  const box = new THREE.Group();
  group.add(box);
  tpl(`cat-box|${livery}`, (P) => {
    P.ext(M.white, bx0, bx1, 0, BH, -BW / 2, BW / 2, 0.24);
    P.ext(paint(L.accent, 0.46), bx0 + 0.05, bx1 - 0.05, -0.18, 0.02, -BW / 2 + 0.05, BW / 2 - 0.05, 0.06);
    const dw = bx1 - bx0 - 0.5;
    const dh = BH - 0.4;
    for (const s of [-1, 1]) {
      const tex = sideTex(`cat|${livery}|${s}`, 2048, Math.round((2048 * dh) / dw), L, {frontLeft: s < 0, title: L.name ?? 'Aurora', tagline: 'Sky kitchen, gate to galley', mark: L.mark ?? 'aurora', frame: true});
      P.print(decalMat(tex), dw, dh, (bx0 + bx1) / 2, BH / 2, s * (BW / 2 + 0.004), s > 0 ? 0 : PI);
    }
    // the front door the crew wheels the trolleys through
    P.ext(paint(L.accent, 0.46), bx1 - 0.04, bx1 + 0.03, 0.15, 2.65, -0.78, 0.78, 0.05);
    P.ext(M.glass, bx1 - 0.02, bx1 + 0.05, 0.3, 2.5, -0.62, 0.62, 0.04);
    // rear door lines
    P.ext(paint(TOY.shade), bx0 - 0.03, bx0 + 0.02, 0.3, 2.9, -0.04, 0.04, 0.01);
  }, box);
  // the platform that slides out over the cab once the box is up
  const plat = new THREE.Group();
  box.add(plat);
  tpl('cat-plat', (P) => {
    P.ext(M.panel, 0, 1.75, -0.14, 0.02, -1.45, 1.45, 0.06);
    for (const s of [-1, 1]) {
      const z = s * 1.38;
      for (const x of [0.25, 1.0, 1.65]) P.rod(M.white, [x, 0, z], [x, 1.1, z], 0.045);
      P.rod(M.white, [0.25, 1.1, z], [1.65, 1.1, z], 0.05);
    }
    P.ext(M.rubber, 1.68, 1.85, -0.16, 0.06, -1.4, 1.4, 0.05);
  }, plat);
  const setS = scissor(group, M.steel, {x0: -4.3, L: 5.8, z: 1.05, yBase: subTop, stages: 1, t: 0.18, d: 0.14});
  const setBox = (h) => {
    h = clamp(h, subTop + 0.02, 5.6);
    box.position.y = h;
    setS(h);
    const out = smooth(4.0, 4.7, h);
    plat.position.x = bx1 - 1.75 + out * 1.8;
    plat.visible = out > 0.01;
  };
  setBox(subTop);
  const wheels = [];
  const steer = [];
  axle(group, wheels, R, 0.6, 3.65, 1.32, steer);
  for (const x of [-2.55, -3.9]) axle(group, wheels, R, 0.6, x, 1.4);
  return {group, roll: roller(wheels), setSteer: steerer(steer), setBox, length: 10.3};
}

// ================================================================ fuel truck
export function buildToyFuelTruck({livery = 'aurora'} = {}) {
  const L = liv(livery);
  const M = mats();
  const group = new THREE.Group();
  const W = 3.4;
  const R = 0.66;
  const tx0 = -4.85;
  const tx1 = 2.75;
  const ty0 = 1.45;
  const ty1 = 4.2;
  const TW = 3.4;
  const reelP = V3(-5.2, 3.0, 0);
  tpl(`fuel|${livery}`, (P) => {
    cab(P, {x0: 3.1, x1: 5.6, top: 3.95, W, color: L.cab, wheelX: 4.2, wheelR: R, stripe: L.stripe, seam: L.cab === TOY.white ? TOY.shade : TOY.blueDeep});
    P.ext(M.chassis, -5.5, 3.2, 0.85, 1.48, -1.0, 1.0, 0.08);
    // the tank: a pill, white, accent band printed along it
    P.ext(M.white, tx0, tx1, ty0, ty1, -TW / 2, TW / 2, 0.8);
    const dw = tx1 - tx0 - 1.7;
    for (const s of [-1, 1]) {
      const tex = canvasTex(`fuel-side|${livery}|${s}`, 2048, 320, (g, w, h) => {
        g.fillStyle = L.accent;
        g.fillRect(0, h * 0.58, w, h * 0.42);
        g.fillStyle = L.light;
        g.fillRect(0, h * 0.44, w, h * 0.08);
        const fl = s < 0;
        const ms = h * 0.4;
        g.font = `800 ${h * 0.3}px ${FONT}`;
        const t1 = 'JET A-1';
        const tw = g.measureText(t1).width;
        const x0 = fl ? w * 0.06 : w * 0.94 - tw - ms - 30;
        if (L.mark) drawMark(g, L.mark, x0, h * 0.02, ms, L);
        g.fillStyle = C.text;
        g.textBaseline = 'middle';
        g.fillText(t1, x0 + ms + 30, h * 0.22);
        g.fillStyle = '#ffffff';
        g.font = `800 ${h * 0.2}px ${FONT}`;
        const t2 = `${(L.name ?? 'Aurora').toUpperCase()} FUEL`;
        const t2w = g.measureText(t2).width;
        g.fillText(t2, fl ? w * 0.94 - t2w : w * 0.06, h * 0.79);
      });
      P.print(decalMat(tex), dw, (dw * 320) / 2048, (tx0 + tx1) / 2, 2.82, s * (TW / 2 + 0.004), s > 0 ? 0 : PI);
    }
    // the catwalk rails and hatches on top
    for (const s of [-1, 1]) {
      for (let x = -3.9; x <= 1.9; x += 1.45) P.rod(M.steel, [x, ty1 - 0.02, s * 1.05], [x, ty1 + 0.55, s * 1.05], 0.04);
      P.rod(M.steel, [-3.9, ty1 + 0.55, s * 1.05], [1.9, ty1 + 0.55, s * 1.05], 0.045);
    }
    for (const x of [-2.6, -0.4, 1.6]) P.cyl(M.panel, 0.42, 0.46, 0.18, x, ty1 + 0.05, 0, 'y', 24);
    // the rear cabinet and the hose reel on it
    P.ext(paint(L.accent, 0.46), -5.55, -4.8, 0.9, 2.55, -1.62, 1.62, 0.16);
    P.ext(M.glass, -5.58, -5.5, 1.2, 2.3, -1.3, 1.3, 0.04);
    P.cyl(M.ink, 0.52, 0.52, 1.5, reelP.x, reelP.y, 0, 'z', 28);
    for (const s of [-1, 1]) P.cyl(M.hub, 0.62, 0.62, 0.06, reelP.x, reelP.y, s * 0.78, 'z', 28);
    for (const s of [-1, 1]) P.ext(M.steel, reelP.x - 0.08, reelP.x + 0.08, 2.5, reelP.y, s * 0.86 - 0.05, s * 0.86 + 0.05, 0.03);
    // placard and lamps at the back
    P.text('3', {fg: TOY.white, bg: TOY.red, px: 90, pad: 30}, 0.36, -5.59, 3.7, 0, -PI / 2);
    for (const s of [-1, 1]) P.ext(M.tail, -5.6, -5.55, 0.95, 1.15, s * 1.35 - 0.15, s * 1.35 + 0.15, 0.03);
  }, group);
  // the hose: instanced segments along a sagging curve from the reel to the target
  const N = 30;
  const seg = new THREE.InstancedMesh(cg('hose-seg', () => new THREE.CylinderGeometry(0.11, 0.11, 1, 12)), M.ink, N);
  seg.castShadow = seg.receiveShadow = true;
  group.add(seg);
  const nozzle = new THREE.Group();
  part(rb(0.3, 0.3, 0.3, 0.08), M.ink, nozzle);
  part(cylG(0.13, 0.13, 0.18, 16), M.steel, nozzle).position.y = 0.2;
  group.add(nozzle);
  const wingPoint = V3(-3.4, 3.0, 4.2);
  const park = V3(reelP.x + 0.1, reelP.y - 0.62, 0.9);
  const P0 = V3(reelP.x, reelP.y + 0.52, 0.5);
  const mm = new THREE.Matrix4();
  const q = new THREE.Quaternion();
  const a = V3();
  const b = V3();
  const ctl = V3();
  const end = V3();
  const bez = (t, out) => {
    const u = 1 - t;
    return out.set(0, 0, 0).addScaledVector(P0, u * u).addScaledVector(ctl, 2 * u * t).addScaledVector(end, t * t);
  };
  const setHose = (k, target = wingPoint) => {
    k = clamp(k, 0, 1);
    end.lerpVectors(park, target, k);
    seg.visible = k > 0.01;
    ctl.lerpVectors(P0, end, 0.5);
    ctl.y = Math.max(P0.y, end.y) + 0.6 - 1.4 * k;
    for (let i = 0; i < N; i++) {
      bez(i / N, a);
      bez((i + 1) / N, b);
      _d.subVectors(b, a);
      const len = _d.length();
      q.setFromUnitVectors(V3(0, 1, 0), _d.normalize());
      mm.compose(a.clone().add(b).multiplyScalar(0.5), q, V3(1, len + 0.02, 1));
      seg.setMatrixAt(i, mm);
    }
    seg.instanceMatrix.needsUpdate = true;
    nozzle.position.copy(end);
    nozzle.position.y -= 0.15;
  };
  setHose(0);
  const wheels = [];
  const steer = [];
  axle(group, wheels, R, 0.62, 4.2, 1.38, steer);
  for (const x of [-2.4, -3.85]) axle(group, wheels, R, 0.62, x, 1.42);
  return {group, roll: roller(wheels), setSteer: steerer(steer), setHose, wingPoint, length: 11.2};
}

// ================================================================ pushback tug
export function buildToyPushback({livery = 'aurora', number = '03'} = {}) {
  const L = liv(livery);
  const M = mats();
  const group = new THREE.Group();
  const W = 3.8;
  const R = 0.7;
  tpl(`pb|${livery}|${number}`, (P) => {
    P.add(paint(L.accent, 0.46), extrude('pb-body', () => profile(-3.5, 3.5, 0.32, 1.78, {arches: [[2.15, R, R + 0.12], [-2.15, R, R + 0.12]], rc: [0.3, 0.3, 0.42, 0.42]}, 0.22), W, 0.22));
    P.ext(M.white, -3.25, 3.25, 1.66, 1.94, -1.78, 1.78, 0.14);
    for (const s of [-1, 1]) {
      P.ext(M.rubber, s > 0 ? 3.4 : -3.7, s > 0 ? 3.7 : -3.4, 0.44, 1.0, -1.62, 1.62, 0.15);
      for (const z of [-1, 1]) P.ext(s > 0 ? M.lamp : M.tail, s > 0 ? 3.44 : -3.53, s > 0 ? 3.53 : -3.44, 1.2, 1.42, z * 1.3 - 0.22, z * 1.3 + 0.22, 0.05);
    }
    P.ext(M.ink, 3.62, 3.98, 0.56, 0.84, -0.34, 0.34, 0.08);
    P.cyl(M.steel, 0.07, 0.07, 0.6, 3.84, 0.7, 0);
    // the cab on the left, low and wide
    P.ext(M.glass, -1.5, 0.6, 1.9, 2.72, -1.72, -0.32, 0.1);
    for (const x of [-1.5, 0.6]) for (const z of [-1.72, -0.32]) P.ext(M.white, x - 0.09, x + 0.09, 1.9, 2.74, z - 0.08, z + 0.08, 0.04);
    P.ext(M.white, -1.7, 0.8, 2.7, 2.94, -1.86, -0.18, 0.12);
    P.beacon(-0.45, 2.94, -1.02, 0.13);
    P.beacon(2.6, 1.94, 1.2, 0.12);
    for (const s of [-1, 1]) P.text(`PB ${number}`, {fg: TOY.white, px: 110}, 0.4, 0, 1.18, s * (W / 2 + 0.004), s > 0 ? 0 : PI);
  }, group);
  const wheels = [];
  const steer = [];
  axle(group, wheels, R, 0.66, 2.15, 1.42, steer);
  axle(group, wheels, R, 0.66, -2.15, 1.42);
  return {group, roll: roller(wheels), setSteer: steerer(steer), length: 7.3};
}

// ================================================================ apron bus
export function buildToyBus({livery = 'aurora'} = {}) {
  const L = liv(livery);
  const M = mats();
  const group = new THREE.Group();
  const W = 4.2;
  const R = 0.62;
  const hw = W / 2;
  const doors = [-2.6, 2.6];
  tpl(`bus|${livery}`, (P) => {
    P.add(M.white, extrude('bus-body', () => profile(-7, 7, 0.42, 4.3, {arches: [[5.0, R, R + 0.16], [-5.0, R, R + 0.16]], rc: [0.32, 0.32, 0.45, 0.45]}, 0.26), W, 0.26));
    // the side print: the accent skirt (cut round the arches), the name
    for (const s of [-1, 1]) {
      const tex = canvasTex(`bus-side|${livery}|${s}`, 2048, 560, (g, w, h) => {
        const sx = w / 13.4;
        const X = (x) => (s > 0 ? (x + 6.7) * sx : (6.7 - x) * sx);
        const Y = (y) => (4.0 - y) * (h / 3.5);
        g.fillStyle = L.accent;
        g.fillRect(0, Y(1.32), w, Y(0.5) - Y(1.32));
        g.fillStyle = L.light;
        g.fillRect(0, Y(1.46), w, Y(1.36) - Y(1.46));
        g.globalCompositeOperation = 'destination-out';
        for (const x of [-5, 5]) {
          g.beginPath();
          g.arc(X(x), Y(R), (R + 0.2) * sx, 0, PI * 2);
          g.fill();
        }
        for (const x of doors) g.fillRect(X(x) - 1.0 * sx, Y(4), 2.0 * sx, h);
        g.globalCompositeOperation = 'source-over';
        g.fillStyle = '#ffffff';
        g.font = `800 ${h * 0.13}px ${FONT}`;
        g.textAlign = 'center';
        g.textBaseline = 'middle';
        g.fillText((L.name ?? 'Aurora').toUpperCase(), X(0), Y(0.9));
      });
      P.print(decalMat(tex), 13.4, 3.5, 0, 2.25, s * (hw + 0.004), s > 0 ? 0 : PI);
    }
    // the window band, the doors, pillars
    for (const s of [-1, 1]) {
      const z0 = s > 0 ? hw - 0.05 : -hw - 0.035;
      const z1 = s > 0 ? hw + 0.035 : -hw + 0.05;
      P.ext(M.glass, -6.45, 6.35, 1.78, 3.8, z0, z1, 0.08);
      for (const x of doors) {
        P.ext(M.glass, x - 0.92, x + 0.92, 0.55, 3.8, z0, z1, 0.08);
        P.ext(M.white, x - 0.03, x + 0.03, 0.6, 3.75, z0 + s * 0.03, z1 + s * 0.03, 0.01);
        P.ext(paint(L.accent, 0.46), x - 0.98, x - 0.92, 0.55, 3.82, z0 + s * 0.01, z1 + s * 0.01, 0.01);
        P.ext(paint(L.accent, 0.46), x + 0.92, x + 0.98, 0.55, 3.82, z0 + s * 0.01, z1 + s * 0.01, 0.01);
      }
      for (const x of [-5.3, -4.15, -0.6, 0.6, 4.15, 5.3]) P.ext(M.white, x - 0.06, x + 0.06, 1.8, 3.78, z0 + s * 0.03, z1 + s * 0.03, 0.02);
    }
    // front: windshield, sign, lamps; back: window, lamps
    P.ext(M.glass, 6.94, 7.03, 1.25, 3.72, -hw + 0.35, hw - 0.35, 0.1);
    P.ext(M.ink, 6.95, 7.04, 3.8, 4.06, -1.2, 1.2, 0.05);
    P.text('GATE B 12', {fg: '#ffd27a', px: 90}, 0.2, 7.05, 3.93, 0, PI / 2);
    for (const s of [-1, 1]) P.ext(M.lamp, 6.96, 7.04, 0.72, 0.98, s * 1.6 - 0.3, s * 1.6 + 0.3, 0.06);
    P.ext(M.glass, -7.03, -6.94, 2.1, 3.7, -hw + 0.45, hw - 0.45, 0.1);
    for (const s of [-1, 1]) P.ext(M.tail, -7.04, -6.96, 0.72, 0.98, s * 1.6 - 0.3, s * 1.6 + 0.3, 0.06);
    // the roof pod
    P.ext(M.panel, -3.6, 2.6, 4.18, 4.62, -1.35, 1.35, 0.2);
  }, group);
  const wheels = [];
  const steer = [];
  axle(group, wheels, R, 0.6, 5.0, 1.72, steer);
  axle(group, wheels, R, 0.6, -5.0, 1.72);
  return {group, roll: roller(wheels), setSteer: steerer(steer), doors, length: 14};
}

// ================================================================ follow-me car
export function buildToyFollowMe() {
  const M = mats();
  const group = new THREE.Group();
  const W = 2.8;
  const R = 0.56;
  tpl('followme', (P) => {
    P.add(M.white, extrude('fm-body', () => profile(-3.1, 3.1, 0.36, 1.62, {arches: [[1.95, R, R + 0.12], [-1.95, R, R + 0.12]], rc: [0.25, 0.3, 0.5, 0.4]}, 0.2), W, 0.2));
    // the greenhouse: glass all round, white pillars and roof
    P.ext(M.glass, -2.55, 0.95, 1.52, 2.42, -1.24, 1.24, 0.2);
    for (const x of [-2.5, -0.85, 0.9]) for (const s of [-1, 1]) P.ext(M.white, x - 0.09, x + 0.09, 1.55, 2.42, s * 1.24 - 0.06, s * 1.24 + 0.06, 0.03);
    P.ext(M.white, -2.68, 1.02, 2.36, 2.62, -1.32, 1.32, 0.22);
    // blue check band on the doors
    const chk = canvasTex('fm-check', 1024, 64, (g, w, h) => {
      for (let i = 0; i < 32; i++)
        for (const j of [0, 1]) {
          g.fillStyle = (i + j) % 2 ? TOY.blue : '#ffffff';
          g.fillRect(i * 32, j * 32, 32, 32);
        }
    });
    for (const s of [-1, 1]) P.print(decalMat(chk, {opaque: true}), 2.4, 0.19, -0.35, 1.25, s * (W / 2 + 0.004), s > 0 ? 0 : PI);
    // the FOLLOW ME box on the roof
    P.ext(M.yellow, -1.75, 0.15, 2.66, 3.22, -1.05, 1.05, 0.1);
    const sign = canvasTex('fm-sign', 1024, 256, (g, w, h) => {
      g.fillStyle = TOY.yellow;
      g.fillRect(0, 0, w, h);
      g.fillStyle = C.text;
      g.font = `900 ${h * 0.5}px ${FONT}`;
      g.textAlign = 'center';
      g.textBaseline = 'middle';
      g.fillText('FOLLOW ME', w / 2, h / 2 + 6);
    });
    const sm = decalMat(sign, {opaque: true});
    P.print(sm, 1.9, 0.46, 0.155, 2.94, 0, PI / 2);
    P.print(sm, 1.9, 0.46, -1.755, 2.94, 0, -PI / 2);
    for (const s of [-1, 1]) P.print(sm, 1.75, 0.42, -0.8, 2.94, s * 1.055, s > 0 ? 0 : PI);
    for (const s of [-1, 1]) P.beacon(-0.8, 3.22, s * 0.7, 0.13);
    for (const s of [-1, 1]) P.ext(M.lamp, 3.04, 3.1, 1.1, 1.3, s * 0.95 - 0.22, s * 0.95 + 0.22, 0.04);
    for (const s of [-1, 1]) P.ext(M.tail, -3.1, -3.04, 1.1, 1.3, s * 0.95 - 0.2, s * 0.95 + 0.2, 0.04);
  }, group);
  const wheels = [];
  const steer = [];
  axle(group, wheels, R, 0.5, 1.95, 1.15, steer);
  axle(group, wheels, R, 0.5, -1.95, 1.15);
  return {group, roll: roller(wheels), setSteer: steerer(steer), length: 6.2};
}

// ================================================================ passenger stairs truck
export function buildToyStairs({livery = 'aurora'} = {}) {
  const L = liv(livery);
  const M = mats();
  const group = new THREE.Group();
  const W = 3.0;
  const R = 0.56;
  const deckTop = 1.45;
  const foot = V3(-4.75, deckTop, 0);
  const topX = 1.55; // the flight lands on the platform's rear edge
  const FW = 2.5; // flight width
  tpl(`stairs|${livery}`, (P) => {
    cab(P, {x0: 2.85, x1: 4.95, top: 3.05, W, color: L.cab, wheelX: 3.85, wheelR: R, stripe: L.stripe, seam: L.cab === TOY.white ? TOY.shade : TOY.blueDeep});
    P.ext(M.chassis, -4.9, 2.95, 0.6, 1.2, -1.0, 1.0, 0.08);
    P.ext(M.white, -4.95, 2.75, 1.1, deckTop, -1.5, 1.5, 0.14);
    for (const s of [-1, 1]) P.ext(paint(L.accent, 0.46), -4.7, 2.5, 1.18, 1.32, s > 0 ? 1.49 : -1.53, s > 0 ? 1.53 : -1.49, 0.02);
    // the outer legs of the platform's telescopic posts
    for (const x of [1.95, 4.0]) for (const s of [-1, 1]) P.ext(paint(L.accent, 0.46), x - 0.13, x + 0.13, deckTop, 3.1, s * 1.05 - 0.13, s * 1.05 + 0.13, 0.06);
  }, group);
  // the inner legs, stretched to the platform
  const legs = [];
  for (const x of [1.95, 4.0])
    for (const s of [-1, 1]) {
      const m = part(cg('st-leg', () => new THREE.CylinderGeometry(0.08, 0.08, 1, 12).translate(0, 0.5, 0)), M.steel, group);
      m.position.set(x, 3.0, s * 1.05);
      legs.push(m);
    }
  // the platform with rails and a canopy, floor at its group's y
  const plat = new THREE.Group();
  group.add(plat);
  tpl(`st-plat|${livery}`, (P) => {
    P.ext(M.panel, topX, 4.6, -0.22, 0, -1.45, 1.45, 0.08);
    P.ext(paint(L.accent, 0.46), topX, 4.6, -0.32, -0.16, -1.48, 1.48, 0.06);
    for (const s of [-1, 1]) {
      const z = s * 1.38;
      P.ext(paint(L.accent, 0.46), topX + 0.05, 4.4, 0, 0.6, z - 0.06, z + 0.06, 0.03);
      for (const x of [topX + 0.1, 3.0, 4.4]) P.rod(M.white, [x, 0, z], [x, 1.15, z], 0.05);
      P.rod(M.white, [topX + 0.1, 1.15, z], [4.4, 1.15, z], 0.055);
      // canopy posts
      for (const x of [topX + 0.12, 4.45]) P.ext(M.white, x - 0.07, x + 0.07, 0, 2.55, z - 0.06, z + 0.06, 0.03);
    }
    P.ext(M.white, topX - 0.1, 4.7, 2.5, 2.74, -1.55, 1.55, 0.12);
    P.ext(paint(L.accent, 0.46), topX - 0.12, 4.72, 2.4, 2.52, -1.57, 1.57, 0.04);
    P.ext(M.rubber, 4.55, 4.75, -0.24, 0.08, -1.35, 1.35, 0.08);
  }, plat);
  // the flight: side stringers stretched between foot and platform, level treads instanced
  const flight = new THREE.Group();
  group.add(flight);
  const stringers = [-1, 1].map((s) => {
    const m = part(barGeo(0.62, 0.16, 0.07), paint(L.accent, 0.46), flight);
    m.userData.s = s;
    return m;
  });
  const rails = [-1, 1].map((s) => {
    const m = part(cg('st-rail', () => new THREE.CylinderGeometry(0.055, 0.055, 1, 10).rotateZ(PI / 2)), M.white, flight);
    m.userData.s = s;
    return m;
  });
  const NT = 15;
  const treads = new THREE.InstancedMesh(rb(0.46, 0.1, FW - 0.1, 0.04), paint(TOY.shade), NT);
  treads.castShadow = treads.receiveShadow = true;
  flight.add(treads);
  const NP = 6;
  const posts = new THREE.InstancedMesh(cylG(0.045, 0.045, 1, 8), M.white, NP * 2);
  posts.castShadow = true;
  flight.add(posts);
  const m4 = new THREE.Matrix4();
  const setTop = (h) => {
    h = clamp(h, 3.4, 5.8);
    plat.position.y = h;
    for (const m of legs) m.scale.y = Math.max(0.05, h - 0.3 - 3.0);
    const tx = topX;
    const ty = h;
    for (const m of stringers) {
      const z = m.userData.s * (FW / 2);
      placeBar(m, foot.x, foot.y + 0.1, z, tx, ty - 0.12, z);
    }
    for (const m of rails) {
      const z = m.userData.s * (FW / 2);
      placeBar(m, foot.x + 0.2, foot.y + 1.15, z, tx, ty + 1.15, z);
    }
    for (let i = 0; i < NT; i++) {
      const t = (i + 0.6) / (NT + 0.4);
      m4.makeTranslation(lerp(foot.x, tx, t), lerp(foot.y, ty, t) + 0.02, 0);
      treads.setMatrixAt(i, m4);
    }
    treads.instanceMatrix.needsUpdate = true;
    for (let i = 0; i < NP; i++) {
      const t = (i + 0.2) / NP;
      for (const s of [0, 1]) {
        m4.compose(V3(lerp(foot.x + 0.2, tx, t), lerp(foot.y, ty, t) + 0.6, (s ? 1 : -1) * (FW / 2)), new THREE.Quaternion(), V3(1, 1.15, 1));
        posts.setMatrixAt(i * 2 + s, m4);
      }
    }
    posts.instanceMatrix.needsUpdate = true;
  };
  setTop(5.0);
  const wheels = [];
  axle(group, wheels, R, 0.5, 3.85, 1.2);
  axle(group, wheels, R, 0.5, -3.3, 1.2);
  return {group, roll: roller(wheels), setTop, length: 10};
}

// ================================================================ cone, chocks
export function buildToyCone() {
  const M = mats();
  const group = new THREE.Group();
  tpl('cone', (P) => {
    P.ext(M.ink, -0.36, 0.36, 0, 0.12, -0.36, 0.36, 0.06);
    P.cyl(M.cone, 0.07, 0.29, 0.92, 0, 0.12 + 0.46, 0, 'y', 28);
    P.add(M.cone, sphere(0.075), 0, 1.04, 0);
    P.cyl(M.white, 0.155, 0.205, 0.2, 0, 0.62, 0, 'y', 28);
  }, group);
  return {group, roll() {}};
}

export function buildToyChocks({gap = 1.3} = {}) {
  const M = mats();
  const group = new THREE.Group();
  tpl(`chocks|${gap}`, (P) => {
    const wedge = () => roundedPoly([V2(-0.32, 0), V2(0.32, 0), V2(0.32, 0.12), V2(-0.12, 0.42), V2(-0.32, 0.42)], 0.07);
    for (const s of [-1, 1]) P.add(M.yellow, extrude('chock', wedge, 0.5, 0.05), s * (gap / 2 + 0.32), 0, 0, 0, s > 0 ? 0 : PI, 0);
    P.rod(M.ink, [-gap / 2 - 0.3, 0.36, 0], [gap / 2 + 0.3, 0.36, 0], 0.025);
  }, group);
  return {group, roll() {}};
}
