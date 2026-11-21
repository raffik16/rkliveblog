// The toy airport's airside kit, built to the reference video
//: toy proportions, generous bevels, matte paint with a soft clearcoat, crisp
// printed liveries and numbers, blue + white on lavender. Every colour and material comes from ./style.js; the few
// colours style.js lacks are in AIRSIDE below, sampled from the reference frames. Toy metres, y up.
//
//   buildToyAirliner({livery = 'aurora' | 'kestrel', reg})
//       -> {group, setGear(k), setCargoDoor(i, k), setFans(a), setBeacons(on), doors, parts, dims}
//       A fat toy twin-jet: fuselage 46 m (nose tip x = +23, tail x = -23), 7 m across, span 44 m, fin tip 15.2 m,
//       nacelles 3.64 m across. Origin on the ground under the middle of the fuselage. Nose toward +x, the left side
//       (passenger doors) is -z, the right side (cargo doors) is +z. Main gear at x = -1, nose gear at x = 18.2.
//       setGear(1) down and locked, 0 stowed. setCargoDoor(0 fwd | 1 aft, 0..1) swings the door up and out (1 = 175 deg, standing up beside the skin).
//       setFans(a) turns both fans to angle a (rad). setBeacons(on) lights the red beacons and the nav lights.
//       doors.{L1, R1, cargoFwd, cargoAft, fuel}: {x, y, z, sill, width, height, normal} in the aircraft's frame,
//       (x, y, z) = the centre of the sill on the skin, normal = outward unit vector. Cargo sills y = 3.2 (z = +2.1),
//       L1 / R1 sills y = 5.0 (z = -/+3.35), the fuel coupling faces down at y = 3.15 under the right wing.
//       Use jet.group.localToWorld(new Vector3(d.x, d.y, d.z)) for world positions.
//   buildToyTerminal({gates = 3, spacing = 60, letter = 'B', first = 10})
//       -> {group, gates: [{x, z, bridgeAnchor, stopX, stopZ, stop, park, sign}], length}
//       A pier along x centred on x = 0. The apron face is +z: the wall stands at z = 0, the glass gate fronts stick
//       out to z = 2.9, the building runs back to z = -28. Gate i: stand centre line x; bridgeAnchor (Vector3, y = 0)
//       is where its jet bridge's rotunda stands (12 m to the stand's -x side, 9 m out). stopX / stopZ = where a
//       nose-in aircraft's nose tip stops (stop is the same point as a Vector3). park = {x, z, rotY} puts a
//       buildToyAirliner group there nose-in, its L1 door in reach of the bridge: jet.group.position.set(p.x, 0, p.z);
//       jet.group.rotation.y = p.rotY. sign = 'B10' etc.
//   buildToyJetBridge({label}) -> {group, setExtend(m), setYaw(a), setHeight(h), setCabinYaw(a), dock(point, normal),
//                                   limits, state, parts}
//       Origin on the ground under the rotunda axis, rotunda floor 5.0. At yaw 0 the tunnels run along +x; setYaw(a)
//       turns them about y (+a toward -z). setExtend(m) = horizontal distance from the rotunda axis to the cab's pivot
//       (limits.extend), setHeight(h) = cab floor height (limits.height). dock(worldPoint, worldNormal) solves all of
//       them so the canopy meets a door sill: pass the door's world sill centre and its world outward normal.
//   buildToyCargoTerminal({docks = 6, stock = true}) -> {group, docks: [{x, z, normal, number}], setDoor(i, k), length,
//                                   depth}
//       The reference's warehouse: sawtooth blue roof, light ribbed walls, blue door frames, dock plates D1..Dn. The dock wall is
//       z = 0 facing +z, the building runs back to z = -36, centred on x = 0. Dock doors 5.2 x 6.0 at ground level.
//       setDoor(i, 0..1) rolls shutter i up (1 = open). stock = pallets of cardboard inside the open docks.
//   buildToyTower() -> Group (36 m)
//   buildToyHangar({label = 'HANGAR 2'}) -> Group (64 x 52 x 24, door 50 x 15.5 facing +z, front z = 0, back z = -52)
//   buildToyApronLight() -> Group (24 m, lamps face +z; group.userData.setOn(0..1))
//   buildToyTree({size = 1, kind = 'tree' | 'bush'}) -> Group     buildToyTrees([{x, z, size, kind, rot}]) -> Group
//       (instanced, use it for rows and clumps)
//   buildToyFence({length = 30}) -> Group  (along x from -length/2 to length/2, 2.4 m tall, posts every 3 m)
//   buildToyCityBlock({w = 24, d = 18, floors = 5, seed = 1}) -> Group  (centred, windows on all four faces)
//
// Static parts are merged per material, repeated parts instanced, and every static kit is built once and shared
// between copies. Text uses Inter: build after document.fonts has loaded it (runSim does that before setup).
// Each livery + reg pair paints one 4096 x 1024 fuselage texture (about 21 MB on the GPU): reuse regs across copies.
import * as THREE from 'three';
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';
import {TOY, rbox, toyMat} from './style.js';

const PI = Math.PI;
const TAU = PI * 2;
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const lerp = (a, b, t) => a + (b - a) * t;
const sat = (v) => clamp(v, 0, 1);
const sstep = (u) => {
  const v = sat(u);
  return v * v * (3 - 2 * v);
};
const V = (x = 0, y = 0, z = 0) => new THREE.Vector3(x, y, z);
const _p = new THREE.Vector3();
const _q = new THREE.Quaternion();
const _e = new THREE.Euler();
const _s = new THREE.Vector3();
const mat4 = (x = 0, y = 0, z = 0, rx = 0, ry = 0, rz = 0, sx = 1, sy = 1, sz = 1) =>
  new THREE.Matrix4().compose(_p.set(x, y, z), _q.setFromEuler(_e.set(rx, ry, rz)), _s.set(sx, sy, sz));

/** colours style.js does not carry, sampled from the reference frames */
export const AIRSIDE = {
  wall: '#e8ecf7', // the reference's corrugated warehouse wall: near white with a lavender cast (TOY.wall reads too blue on a wall)
  interior: '#d3d9ee', // the lit inside of an open dock
  interiorDeep: '#bcc5e3',
  wing: '#dce2f3', // wings and fairings, a step down from the white fuselage
  hub: '#e8ecf6',
  post: '#98a3c6', // fence posts and rails
  pane: '#eef1fb', // translucent fence panels
  window: '#9cb2ef', // city block windows, periwinkle
  slat: '#dfe4f2', // roll-up shutters
  pallet: '#c99a62',
  tealLight: '#8fdcd2', // the kestrel cheatline
  tealDeep: '#178f83',
  steel: '#c3cbe3', // gear legs, exhaust cones
};

const LIVERY = {
  aurora: {name: 'AURORA', main: TOY.blue, light: TOY.blueLight, deep: TOY.blueDeep, reg: 'AU-NBA', mark: 'aurora'},
  kestrel: {name: 'KESTREL', main: TOY.teal, light: AIRSIDE.tealLight, deep: AIRSIDE.tealDeep, reg: 'KS-TRL', mark: 'kestrel'},
};

// ------------------------------------------------------------------------------------------------ materials
let MATS = null;
function mats() {
  if (MATS) return MATS;
  MATS = {
    white: toyMat(TOY.white),
    paintWhite: toyMat(TOY.white, {paint: true, rough: 0.5}),
    panel: toyMat(TOY.panel),
    wall: toyMat(AIRSIDE.wall, {rough: 0.72}),
    roof: toyMat(TOY.roof, {rough: 0.62}),
    blue: toyMat(TOY.blue, {rough: 0.5}),
    blueDeep: toyMat(TOY.blueDeep, {rough: 0.5}),
    blueLight: toyMat(TOY.blueLight, {rough: 0.5}),
    navy: toyMat(TOY.navy, {rough: 0.7}),
    glass: toyMat(TOY.glass, {rough: 0.16}),
    shade: toyMat(TOY.shade, {rough: 0.6}),
    wing: toyMat(AIRSIDE.wing, {paint: true, rough: 0.5}),
    hub: toyMat(AIRSIDE.hub, {rough: 0.42}),
    steel: toyMat(AIRSIDE.steel, {rough: 0.45}),
    tyre: toyMat(TOY.navy, {rough: 0.82}),
    green: toyMat(TOY.green, {rough: 0.72}),
    greenDeep: toyMat(TOY.greenDeep, {rough: 0.72}),
    trunk: toyMat(TOY.trunk, {rough: 0.8}),
    post: toyMat(AIRSIDE.post, {rough: 0.45}),
    pane: toyMat(AIRSIDE.pane, {opacity: 0.55, rough: 0.3}),
    window: toyMat(AIRSIDE.window, {rough: 0.4}),
    cardboard: toyMat(TOY.cardboard, {rough: 0.82}),
    pallet: toyMat(AIRSIDE.pallet, {rough: 0.85}),
    slat: toyMat(AIRSIDE.slat, {rough: 0.6}),
    fan: toyMat('#2c3a5e', {rough: 0.5}),
    // the inside of openings: seen from inside (BackSide) and kept out of the shadow so it reads lit, like the reference's docks
    room: sideMat(AIRSIDE.interior, THREE.BackSide, 0.9),
    roomDeep: sideMat(AIRSIDE.interiorDeep, THREE.BackSide, 0.9),
    hold: sideMat('#9ba7cc', THREE.DoubleSide, 0.85),
  };
  return MATS;
}
const SIDE = new Map();
function sideMat(color, side, rough) {
  const key = `${color}|${side}|${rough}`;
  if (!SIDE.has(key)) SIDE.set(key, new THREE.MeshStandardMaterial({color, roughness: rough, side}));
  return SIDE.get(key);
}
const paint = (color) => toyMat(color, {paint: true, rough: 0.48});

// ------------------------------------------------------------------------------------------------ geometry kit
/** keep only position, normal, uv and drop the index, so anything merges with anything */
function clean(g) {
  const out = g.index ? g.toNonIndexed() : g.clone();
  for (const k of Object.keys(out.attributes)) if (!['position', 'normal', 'uv'].includes(k)) out.deleteAttribute(k);
  if (!out.attributes.normal) out.computeVertexNormals();
  if (!out.attributes.uv) out.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(out.attributes.position.count * 2), 2));
  out.morphAttributes = {};
  out.clearGroups();
  return out;
}
/** a non-indexed geometry mirrored in z, its triangles turned so they still face out */
function mirrorZ(g) {
  const out = clean(g);
  out.applyMatrix4(new THREE.Matrix4().makeScale(1, 1, -1));
  for (const a of Object.values(out.attributes)) {
    const n = a.itemSize;
    for (let t = 0; t < a.count; t += 3) {
      for (let c = 0; c < n; c++) {
        const i1 = (t + 1) * n + c;
        const i2 = (t + 2) * n + c;
        const tmp = a.array[i1];
        a.array[i1] = a.array[i2];
        a.array[i2] = tmp;
      }
    }
    a.needsUpdate = true;
  }
  return out;
}
/** a lathe with a rounded-rectangle profile: a cylinder (or a tapered one) with soft edges, axis y, centred */
const GEO = new Map();
const cached = (key, make) => {
  if (!GEO.has(key)) GEO.set(key, make());
  return GEO.get(key);
};
function rcyl(rb, rt, h, b = 0.12, seg = 32) {
  return cached(`rcyl|${rb}|${rt}|${h}|${b}|${seg}`, () => {
    const bb = Math.min(b, h / 2 - 1e-3, Math.min(rb, rt) - 1e-3);
    const pts = [new THREE.Vector2(1e-4, -h / 2)];
    const arc = (cx, cy, a0, a1) => {
      for (let k = 0; k <= 4; k++) {
        const a = lerp(a0, a1, k / 4);
        pts.push(new THREE.Vector2(cx + bb * Math.cos(a), cy + bb * Math.sin(a)));
      }
    };
    arc(rb - bb, -h / 2 + bb, -PI / 2, 0);
    arc(rt - bb, h / 2 - bb, 0, PI / 2);
    pts.push(new THREE.Vector2(1e-4, h / 2));
    return new THREE.LatheGeometry(pts, seg);
  });
}
/** a lathe from [r, a] pairs along y (a increasing = normals out) */
const lathe = (pairs, seg = 40) => new THREE.LatheGeometry(pairs.map(([r, a]) => new THREE.Vector2(r, a)), seg);

class Kit {
  constructor() {
    this.parts = new Map();
  }
  add(mat, geo, m) {
    const g = clean(geo);
    if (m) g.applyMatrix4(m);
    if (!this.parts.has(mat)) this.parts.set(mat, []);
    this.parts.get(mat).push(g);
    return this;
  }
  box(mat, w, h, d, x, y, z, r = null, rx = 0, ry = 0, rz = 0) {
    return this.add(mat, rbox(w, h, d, r ?? Math.min(w, h, d) * 0.2), mat4(x, y, z, rx, ry, rz));
  }
  /** a plain box for small repeated ribs (bevels under 5 cm never show) */
  flat(mat, w, h, d, x, y, z, rx = 0, ry = 0, rz = 0) {
    return this.add(mat, cached(`box|${w}|${h}|${d}`, () => new THREE.BoxGeometry(w, h, d)), mat4(x, y, z, rx, ry, rz));
  }
  /** a soft-edged cylinder; axis 'y' | 'x' | 'z' */
  cyl(mat, rb, rt, h, x, y, z, axis = 'y', b = 0.12, seg = 32) {
    const m = axis === 'x' ? mat4(x, y, z, 0, 0, -PI / 2) : axis === 'z' ? mat4(x, y, z, PI / 2, 0, 0) : mat4(x, y, z);
    return this.add(mat, rcyl(rb, rt, h, b, seg), m);
  }
  freeze() {
    return [...this.parts].map(([mat, list]) => ({mat, geo: mergeGeometries(list, false)}));
  }
  build() {
    return thaw(this.freeze());
  }
}
/** a Group from a frozen kit; geometry and materials are shared, not copied */
function thaw(frozen, group = new THREE.Group()) {
  for (const {geo, mat} of frozen) {
    const m = new THREE.Mesh(geo, mat);
    m.castShadow = !mat.transparent && mat.side !== THREE.BackSide;
    m.receiveShadow = !mat.userData.noShadow && mat.side !== THREE.BackSide;
    group.add(m);
  }
  return group;
}
/** a square bar between two points, built at its true length so the bevels never stretch */
function bar(K, mat, a, b, w, r = 0.06) {
  const d = new THREE.Vector3().subVectors(b, a);
  const len = d.length();
  const q = new THREE.Quaternion().setFromUnitVectors(V(0, 1, 0), d.multiplyScalar(1 / len));
  K.add(mat, rbox(w, len, w, r, 1), new THREE.Matrix4().compose(a.clone().add(b).multiplyScalar(0.5), q, V(1, 1, 1)));
}
const once = (make) => {
  let v = null;
  return () => (v ??= make());
};

/**
 * a tapered slab (wings, fins, tailplanes): a rounded box chord x thickness x span, the span along +z from 0, the
 * chord centred on x = 0 at the root. Toward the tip the chord and the thickness shrink, the leading edge sweeps back
 * by `sweep` and the slab rises by `rise`. Normals follow the deformation, so the bevels stay soft.
 */
function taperedSlab({root, tip, span, tRoot, tTip, sweep, rise = 0, r = 0.45}) {
  const g = clean(rbox(root, tRoot, span, Math.min(tRoot * r, root * 0.3), 4));
  const pos = g.attributes.position;
  const nor = g.attributes.normal;
  const ks = tip / root;
  const kt = tTip / tRoot;
  const shift = root / 2 - sweep - tip / 2; // the chord centre's x at the tip
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const z = pos.getZ(i);
    const t = z / span + 0.5;
    const s = lerp(1, ks, t);
    const q = lerp(1, kt, t);
    pos.setXYZ(i, x * s + shift * t, y * q + rise * t, t * span);
    // the normal goes through the inverse transpose of the deformation's jacobian
    const a = s;
    const b = q;
    const c = (x * (ks - 1) + shift) / span;
    const d = (y * (kt - 1) + rise) / span;
    const nx = nor.getX(i) / a;
    const ny = nor.getY(i) / b;
    const nz = -c * nx - d * ny + nor.getZ(i);
    const l = Math.hypot(nx, ny, nz) || 1;
    nor.setXYZ(i, nx / l, ny / l, nz / l);
  }
  return g;
}

// ------------------------------------------------------------------------------------------------ textures
const SRGB = THREE.SRGBColorSpace;
const FONT = (weight, px, italic = false) => `${italic ? 'italic ' : ''}${weight} ${px}px Inter, "Segoe UI", system-ui, sans-serif`;
function rr(g, x, y, w, h, r) {
  const k = Math.min(r, w / 2, h / 2);
  g.beginPath();
  g.moveTo(x + k, y);
  g.arcTo(x + w, y, x + w, y + h, k);
  g.arcTo(x + w, y + h, x, y + h, k);
  g.arcTo(x, y + h, x, y, k);
  g.arcTo(x, y, x + w, y, k);
  g.closePath();
}
function canvasTex(w, h, draw) {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  draw(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = SRGB;
  t.anisotropy = 8;
  return t;
}
const TEX = new Map();
/** text on a rounded plate (bg null = transparent); returns {tex, aspect} */
function plate(text, {bg = TOY.blue, fg = '#ffffff', px = 92, h = 150, padX = 0.42, radius = 0.26, weight = 800, italic = false} = {}) {
  const key = ['plate', text, bg, fg, px, h, padX, radius, weight, italic].join('|');
  if (TEX.has(key)) return TEX.get(key);
  const m = document.createElement('canvas').getContext('2d');
  m.font = FONT(weight, px, italic);
  const w = Math.ceil(m.measureText(text).width + 2 * h * padX);
  const tex = canvasTex(w, h, (g) => {
    if (bg) {
      rr(g, 1, 1, w - 2, h - 2, h * radius);
      g.fillStyle = bg;
      g.fill();
    }
    g.font = FONT(weight, px, italic);
    g.fillStyle = fg;
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    g.fillText(text, w / 2, h / 2 + px * 0.04);
  });
  const out = {tex, aspect: w / h};
  TEX.set(key, out);
  return out;
}
/** the brand marks: 'aurora' (a rising sun of arcs), 'kestrel' (a gull wing), 'cube' (the airport's box mark) */
function drawMark(g, kind, cx, cy, s, color) {
  g.save();
  g.translate(cx, cy);
  g.fillStyle = color;
  g.strokeStyle = color;
  g.lineCap = 'round';
  if (kind === 'aurora') {
    g.lineWidth = s * 0.13;
    for (let k = 0; k < 3; k++) {
      g.beginPath();
      g.arc(0, s * 0.32, s * (0.36 + 0.24 * k), PI * 1.06, PI * 1.94);
      g.stroke();
    }
    g.beginPath();
    g.arc(0, s * 0.32, s * 0.17, PI, TAU);
    g.closePath();
    g.fill();
  } else if (kind === 'kestrel') {
    g.beginPath();
    g.moveTo(-s * 0.95, -s * 0.12);
    g.quadraticCurveTo(-s * 0.42, -s * 0.62, s * 0.02, s * 0.12);
    g.quadraticCurveTo(s * 0.42, -s * 0.62, s * 0.95, -s * 0.12);
    g.quadraticCurveTo(s * 0.4, -s * 0.2, s * 0.02, s * 0.56);
    g.quadraticCurveTo(-s * 0.4, -s * 0.2, -s * 0.95, -s * 0.12);
    g.fill();
  } else {
    // an isometric cube, the reference's app-icon language
    const k = s * 0.62;
    const top = [
      [0, -k],
      [k * 0.87, -k * 0.5],
      [0, 0],
      [-k * 0.87, -k * 0.5],
    ];
    const poly = (pts, a) => {
      g.globalAlpha = a;
      g.beginPath();
      pts.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y)));
      g.closePath();
      g.fill();
    };
    poly(top, 0.62);
    poly([[-k * 0.87, -k * 0.5], [0, 0], [0, k], [-k * 0.87, k * 0.5]], 1);
    poly([[k * 0.87, -k * 0.5], [0, 0], [0, k], [k * 0.87, k * 0.5]], 0.82);
    g.globalAlpha = 1;
  }
  g.restore();
}
/** a mark on a transparent square, optionally in a filled disc; mirror = drawn flipped left-right */
function markTex(kind, {fg = '#ffffff', disc = null, mirror = false, size = 512} = {}) {
  const key = ['mark', kind, fg, disc, mirror, size].join('|');
  if (TEX.has(key)) return TEX.get(key);
  const tex = canvasTex(size, size, (g, w, h) => {
    if (mirror) {
      g.translate(w, 0);
      g.scale(-1, 1);
    }
    if (disc) {
      g.fillStyle = disc;
      g.beginPath();
      g.arc(w / 2, h / 2, w * 0.48, 0, TAU);
      g.fill();
    }
    drawMark(g, kind, w / 2, h / 2, w * (disc ? 0.3 : 0.44), fg);
  });
  TEX.set(key, tex);
  return tex;
}
const DECAL = new Map();
function decalMat(tex) {
  if (!DECAL.has(tex)) {
    const m = new THREE.MeshStandardMaterial({map: tex, transparent: true, roughness: 0.55, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2});
    m.depthWrite = false;
    DECAL.set(tex, m);
  }
  return DECAL.get(tex);
}
/** a flat decal facing +z, h tall */
function decal(tex, aspect, h) {
  const m = new THREE.Mesh(cached(`plane|${aspect.toFixed(4)}|${h}`, () => new THREE.PlaneGeometry(h * aspect, h)), decalMat(tex));
  m.receiveShadow = true;
  return m;
}

// ================================================================================================ the airliner
const JET = {R: 3.5, Yc: 6.0, nose: 23, tail: -23, noseLen: 6.5, tailLen: 12.5, capLen: 0.9, rEnd: 0.72, droop: 1.15, up: 0.6};
const SILL_CARGO = 3.2;
const SILL_PAX = 5.0;
const CARGO_H = 2.4;
const PAX_H = 2.4;
/** the fuselage's radius and centre height at station x */
function fusAt(x) {
  const {R, Yc, nose, tail, noseLen, tailLen, capLen, rEnd, droop, up} = JET;
  const n0 = nose - noseLen;
  const t0 = tail + tailLen;
  const t1 = tail + capLen;
  if (x >= n0) {
    const s = sat((x - n0) / noseLen);
    return {r: R * Math.pow(Math.max(0, 1 - Math.pow(s, 2.3)), 1 / 2.3), yc: Yc - droop * Math.pow(s, 1.6)};
  }
  if (x >= t0) return {r: R, yc: Yc};
  if (x >= t1) {
    const k = sstep((t0 - x) / (t0 - t1));
    const r = R - (R - rEnd) * k;
    return {r, yc: Yc + R - up * k - r};
  }
  const u = sat((t1 - x) / capLen);
  return {r: rEnd * Math.sqrt(Math.max(0, 1 - u * u)), yc: Yc + R - up - rEnd};
}
function fusDer(x) {
  const h = 0.004;
  const a = fusAt(x - h);
  const b = fusAt(x + h);
  return {dr: (b.r - a.r) / (2 * h), dy: (b.yc - a.yc) / (2 * h)};
}
/** right-side angle (from the top, toward +z) of the skin at height y on the constant section */
const thAt = (y) => Math.acos(clamp((y - JET.Yc) / JET.R, -1, 1));
const TH = {cargoTop: thAt(SILL_CARGO + CARGO_H), cargoSill: thAt(SILL_CARGO), paxSill: thAt(SILL_PAX), paxTop: thAt(SILL_PAX + PAX_H)};
const CARGO_DOORS = [
  {x0: 9.25, x1: 12.0},
  {x0: -10.25, x1: -7.5},
];
const PAX_DOOR = {x0: 14.0, x1: 15.75};

const jetGrid = once(() => {
  const {nose, tail, noseLen, tailLen, capLen} = JET;
  const t1 = tail + capLen;
  const t0 = tail + tailLen;
  const n0 = nose - noseLen;
  const xs = [];
  const Nc = 12;
  for (let k = 0; k < Nc; k++) xs.push(t1 - capLen * Math.cos(((k / Nc) * PI) / 2));
  const nt = Math.ceil((t0 - t1) / 0.25);
  for (let k = 0; k < nt; k++) xs.push(t1 + ((t0 - t1) * k) / nt);
  const nm = Math.round((n0 - t0) / 0.25);
  for (let k = 0; k < nm; k++) xs.push(t0 + 0.25 * k);
  const Nn = 36;
  for (let k = 0; k <= Nn; k++) xs.push(n0 + noseLen * Math.sin(((k / Nn) * PI) / 2));
  // the angles round the section, with the cargo door edges on the grid
  const ths = [];
  const N = 128;
  for (let k = 0; k <= N; k++) ths.push((k / N) * TAU);
  for (const t of [TH.cargoTop, TH.cargoSill]) {
    let best = 0;
    for (let k = 1; k < ths.length; k++) if (Math.abs(ths[k] - t) < Math.abs(ths[best] - t)) best = k;
    if (Math.abs(ths[best] - t) < 0.012) ths[best] = t;
    else ths.push(t);
  }
  ths.sort((a, b) => a - b);
  // arc length along the side, for u
  const S = [0];
  for (let i = 1; i < xs.length; i++) S.push(S[i - 1] + Math.hypot(xs[i] - xs[i - 1], fusAt(xs[i]).r - fusAt(xs[i - 1]).r));
  const Stot = S[S.length - 1];
  const uOf = (x) => {
    if (x <= xs[0]) return 0;
    for (let i = 1; i < xs.length; i++) if (x <= xs[i]) return lerp(S[i - 1], S[i], (x - xs[i - 1]) / (xs[i] - xs[i - 1])) / Stot;
    return 1;
  };
  return {xs, ths, S, Stot, uOf};
});

/** a piece of the skin over stations xs[i0..i1] and angles ths[j0..j1], pushed out by dr; skip(i, j) drops a quad */
function skin(i0, i1, j0, j1, {dr = 0, flip = false, skip = null} = {}) {
  const {xs, ths, S, Stot} = jetGrid();
  const nx = i1 - i0 + 1;
  const nt = j1 - j0 + 1;
  const pos = new Float32Array(nx * nt * 3);
  const nor = new Float32Array(nx * nt * 3);
  const uv = new Float32Array(nx * nt * 2);
  for (let a = 0; a < nx; a++) {
    const x = xs[i0 + a];
    const {r, yc} = fusAt(x);
    const {dr: rp, dy: yp} = fusDer(x);
    const rr0 = Math.max(0, r + dr);
    for (let b = 0; b < nt; b++) {
      const th = ths[j0 + b];
      const c = Math.cos(th);
      const s = Math.sin(th);
      const k = a * nt + b;
      pos.set([x, yc + rr0 * c, rr0 * s], k * 3);
      let n0 = -rp - c * yp;
      const l = Math.hypot(n0, c, s);
      const f = flip ? -1 : 1;
      nor.set([(f * n0) / l, (f * c) / l, (f * s) / l], k * 3);
      uv.set([S[i0 + a] / Stot, th / TAU], k * 2);
    }
  }
  const idx = [];
  for (let a = 0; a < nx - 1; a++) {
    for (let b = 0; b < nt - 1; b++) {
      if (skip && skip(i0 + a, j0 + b)) continue;
      const p = a * nt + b;
      const q = (a + 1) * nt + b;
      if (flip) idx.push(p, q, q + 1, p, q + 1, p + 1);
      else idx.push(p, q + 1, q, p, p + 1, q + 1);
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  g.setAttribute('normal', new THREE.BufferAttribute(nor, 3));
  g.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
  g.setIndex(idx);
  return g;
}
const iOfX = (x) => jetGrid().xs.findIndex((v) => Math.abs(v - x) < 1e-6);
const jOfTh = (t) => jetGrid().ths.findIndex((v) => Math.abs(v - t) < 1e-9);
/** the quads between two rings of points (a band), used for door edges and the reveal round a hole */
function band(a, b) {
  const pos = [];
  for (let k = 0; k < a.length - 1; k++) pos.push(...a[k], ...b[k], ...b[k + 1], ...a[k], ...b[k + 1], ...a[k + 1]);
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.computeVertexNormals();
  return g;
}
const skinPt = (x, th, dr) => {
  const {r, yc} = fusAt(x);
  return [x, yc + (r + dr) * Math.cos(th), (r + dr) * Math.sin(th)];
};
/** the rim of a door rectangle (stations i0..i1, angles j0..j1) at depth dr, as four polylines */
function rim(i0, i1, j0, j1, dr) {
  const {xs, ths} = jetGrid();
  const top = [];
  const sill = [];
  const fwd = [];
  const aft = [];
  for (let i = i0; i <= i1; i++) {
    top.push(skinPt(xs[i], ths[j0], dr));
    sill.push(skinPt(xs[i], ths[j1], dr));
  }
  for (let j = j0; j <= j1; j++) {
    aft.push(skinPt(xs[i0], ths[j], dr));
    fwd.push(skinPt(xs[i1], ths[j], dr));
  }
  return {top, sill, fwd, aft};
}

const jetGeo = once(() => {
  const {xs, ths} = jetGrid();
  const doors = CARGO_DOORS.map(({x0, x1}) => ({i0: iOfX(x0), i1: iOfX(x1), j0: jOfTh(TH.cargoTop), j1: jOfTh(TH.cargoSill)}));
  const hole = (i, j) => doors.some((d) => i >= d.i0 && i < d.i1 && j >= d.j0 && j < d.j1);
  const fuselage = skin(0, xs.length - 1, 0, ths.length - 1, {skip: hole});
  // the open hold behind each door: a reveal 1.1 m deep and a back wall
  const holdParts = [];
  const panels = doors.map((d) => {
    const o = rim(d.i0, d.i1, d.j0, d.j1, 0);
    const i = rim(d.i0, d.i1, d.j0, d.j1, -1.1);
    for (const k of ['top', 'sill', 'fwd', 'aft']) holdParts.push(clean(band(o[k], i[k])));
    holdParts.push(clean(skin(d.i0, d.i1, d.j0, d.j1, {dr: -1.1})));
    // the door: the skin itself, a lining 12 cm in and the edges between
    const outer = skin(d.i0, d.i1, d.j0, d.j1);
    const inner = rim(d.i0, d.i1, d.j0, d.j1, -0.12);
    const lining = [clean(skin(d.i0, d.i1, d.j0, d.j1, {dr: -0.12, flip: true}))];
    for (const k of ['top', 'sill', 'fwd', 'aft']) lining.push(clean(band(o[k], inner[k])));
    const th = ths[d.j0];
    const hinge = V(0, JET.Yc + JET.R * Math.cos(th), JET.R * Math.sin(th));
    const shift = new THREE.Matrix4().makeTranslation(-hinge.x, -hinge.y, -hinge.z);
    outer.applyMatrix4(shift);
    const lin = mergeGeometries(lining, false);
    lin.applyMatrix4(shift);
    return {outer, lining: lin, hinge};
  });
  return {fuselage, hold: mergeGeometries(holdParts, false), panels};
});

/** the livery, painted straight onto the fuselage's uv: u along the side, v round the section from the crown */
function liveryTexture(liv, reg) {
  const key = ['livery', liv.name, reg].join('|');
  if (TEX.has(key)) return TEX.get(key);
  const W = 4096;
  const H = 1024;
  const {xs, S, Stot, uOf} = jetGrid();
  const pxU = W / Stot; // px per metre along
  const pxV = H / (TAU * JET.R); // px per metre round, on the constant section
  const kx = pxU / pxV;
  const rgb = (hex) => {
    const c = new THREE.Color(hex);
    return [c.r, c.g, c.b].map((v) => Math.round(v * 255));
  };
  const cWhite = rgb(TOY.white);
  const cMain = rgb(liv.main);
  const cLight = rgb(liv.light);
  const cGlass = rgb('#26365e');
  const cFrame = rgb('#e6ebf7');
  // the belly band's top edge: low along the cabin, sweeping up into the tail so the tail cone is all colour
  const bandTop = (x) => 4.78 + 0.012 * (20 - x) + 5.0 * sstep((-6.5 - x) / 11.5) - 1.1 * sstep((x - 16) / 7);
  const tex = canvasTex(W, H, (g) => {
    const img = g.createImageData(W, H);
    const d = img.data;
    const cosT = new Float32Array(H);
    const sinT = new Float32Array(H);
    for (let j = 0; j < H; j++) {
      const th = ((j + 0.5) / H) * TAU;
      cosT[j] = Math.cos(th);
      sinT[j] = Math.sin(th);
    }
    let seg = 1;
    for (let i = 0; i < W; i++) {
      const s = ((i + 0.5) / W) * Stot;
      while (seg < S.length - 1 && S[seg] < s) seg++;
      const x = lerp(xs[seg - 1], xs[seg], (s - S[seg - 1]) / (S[seg] - S[seg - 1]));
      const {r, yc} = fusAt(x);
      const {dr, dy} = fusDer(x);
      const bt = bandTop(x);
      for (let j = 0; j < H; j++) {
        const c = cosT[j];
        const sn = sinT[j];
        const y = yc + r * c;
        let R0 = cWhite[0];
        let G0 = cWhite[1];
        let B0 = cWhite[2];
        const mix = (col, t) => {
          R0 += (col[0] - R0) * t;
          G0 += (col[1] - G0) * t;
          B0 += (col[2] - B0) * t;
        };
        const aa = 0.03;
        const kb = sat((bt - y) / aa + 0.5);
        if (kb > 0) mix(cMain, kb);
        const kl = sat((y - (bt + 0.2)) / aa + 0.5) * sat((bt + 0.4 - y) / aa + 0.5);
        if (kl > 0) mix(cLight, kl);
        // the cockpit visor: where the skin faces up-and-out between two elevations, ahead of a slanted rear edge
        if (x > 16.9) {
          const nx = -dr - c * dy;
          const l = Math.hypot(nx, c, sn);
          const ny = c / l;
          const xr = 18.05 + 0.7 * sat((ny - 0.36) / 0.34);
          const kw = sat((ny - 0.36) / 0.025 + 0.5) * sat((0.72 - ny) / 0.025 + 0.5) * sat((x - xr) / 0.03 + 0.5) * sat((21.95 - x) / 0.03 + 0.5);
          if (kw > 0) {
            // two posts: the centre one and the side one between the front and the side panes
            const post = Math.max(sat(1 - Math.abs(r * sn) / 0.07), sat(1 - Math.abs(x - 20.0) / 0.07) * sat((Math.abs(sn) - 0.45) / 0.05));
            mix(cGlass, kw);
            if (post > 0) mix(cFrame, post * kw);
          }
        }
        const k = (j * W + i) * 4;
        d[k] = R0;
        d[k + 1] = G0;
        d[k + 2] = B0;
        d[k + 3] = 255;
      }
    }
    g.putImageData(img, 0, 0);
    const px = (x) => uOf(x) * W;
    const py = (th) => (th / TAU) * H;
    // windows: round and oversized, a light rim round dark glass, both sides
    const wy = 6.78;
    const wr = 0.3;
    const thR = thAt(wy);
    for (const th of [thR, TAU - thR]) {
      for (let x = 12.9; x > -6.8; x -= 1.27) {
        g.fillStyle = '#d7deef';
        g.beginPath();
        g.ellipse(px(x), py(th), (wr + 0.07) * pxU, (wr + 0.07) * pxV, 0, 0, TAU);
        g.fill();
        g.fillStyle = TOY.glass;
        g.beginPath();
        g.ellipse(px(x), py(th), wr * pxU, wr * pxV, 0, 0, TAU);
        g.fill();
      }
    }
    // door outlines: L1 / R1 painted, the cargo doors' seams on their own panels
    const outline = (x0, x1, t0, t1, rad = 0.28) => {
      g.strokeStyle = '#b4bed9';
      g.lineWidth = 3;
      const a = Math.min(px(x0), px(x1));
      const b = Math.max(px(x0), px(x1));
      const c = Math.min(py(t0), py(t1));
      const e = Math.max(py(t0), py(t1));
      rr(g, a + 2, c + 2, b - a - 4, e - c - 4, rad * pxV);
      g.stroke();
    };
    outline(PAX_DOOR.x0, PAX_DOOR.x1, TH.paxTop, TH.paxSill);
    outline(PAX_DOOR.x0, PAX_DOOR.x1, TAU - TH.paxTop, TAU - TH.paxSill);
    for (const {x0, x1} of CARGO_DOORS) outline(x0, x1, TH.cargoTop, TH.cargoSill, 0.12);
    // the title above the windows and the registration under them; the left side is drawn turned 180 degrees
    const text = (str, x, y, hM, font, color, th) => {
      const right = th < PI;
      g.save();
      g.translate(px(x), py(th));
      if (!right) g.rotate(PI);
      g.scale(kx, 1);
      g.font = font(hM * pxV);
      g.fillStyle = color;
      g.textAlign = 'center';
      g.textBaseline = 'middle';
      g.fillText(str, 0, 0);
      g.restore();
    };
    const titleY = 8.02;
    const thT = thAt(titleY);
    for (const th of [thT, TAU - thT]) text(liv.name, 5.2, titleY, 1.62, (p) => FONT(800, p, true), liv.main, th);
    const thReg = thAt(5.95);
    for (const th of [thReg, TAU - thReg]) text(reg, -3.4, 5.95, 0.6, (p) => FONT(700, p), TOY.navy, th);
    // the brand mark at the nose, ahead of L1, on both sides
    const thM = thAt(7.75);
    for (const [th, flip] of [
      [thM, false],
      [TAU - thM, true],
    ]) {
      g.save();
      g.translate(px(13.0), py(th));
      if (flip) g.rotate(PI);
      g.scale(kx, 1);
      drawMark(g, liv.mark, 0, 0, 0.62 * pxV, liv.main);
      g.restore();
    }
  });
  tex.flipY = false;
  TEX.set(key, tex);
  return tex;
}

/** the static body of one livery: wings, tail, engines, fairing, pylons, fuel pod */
const JET_STATIC = new Map();
function jetStatic(livKey) {
  if (JET_STATIC.has(livKey)) return JET_STATIC.get(livKey);
  const liv = LIVERY[livKey];
  const M = mats();
  const main = paint(liv.main);
  const K = new Kit();
  // wings: low on the body, swept, thick at the root; winglets in the livery colour
  const wing = taperedSlab({root: 9.0, tip: 3.0, span: 20.6, tRoot: 1.3, tTip: 0.55, sweep: 8.9, rise: 1.0, r: 0.48});
  K.add(M.wing, wing, mat4(-0.5, 4.0, 1.4));
  K.add(M.wing, mirrorZ(clean(wing).applyMatrix4(mat4(-0.5, 4.0, 1.4))));
  const winglet = taperedSlab({root: 2.3, tip: 1.0, span: 2.1, tRoot: 0.34, tTip: 0.2, sweep: 1.4, r: 0.45});
  const wl = clean(winglet).applyMatrix4(mat4(-6.3, 4.92, 21.8, -PI / 2, 0, 0));
  K.add(main, wl);
  K.add(main, mirrorZ(wl));
  // the belly fairing where the wing meets the body
  K.box(M.wing, 10.4, 1.7, 6.6, -0.6, 3.15, 0, 0.8);
  // tailplanes and the fin
  const stab = taperedSlab({root: 4.6, tip: 2.0, span: 8.0, tRoot: 0.52, tTip: 0.26, sweep: 3.0, rise: 0.55, r: 0.48});
  K.add(M.wing, stab, mat4(-19.9, 7.75, 0.5));
  K.add(M.wing, mirrorZ(clean(stab).applyMatrix4(mat4(-19.9, 7.75, 0.5))));
  const fin = taperedSlab({root: 7.4, tip: 3.2, span: 7.0, tRoot: 0.76, tTip: 0.42, sweep: 4.8, r: 0.46});
  K.add(main, fin, mat4(-18.45, 8.25, 0, -PI / 2, 0, 0));
  // engines: fat nacelles in the livery colour, a light intake lip, a steel exhaust cone, pylons into the wing
  const body = lathe([
    [1.25, -5.2],
    [1.42, -4.8],
    [1.62, -4.0],
    [1.76, -3.0],
    [1.82, -1.9],
    [1.82, -0.9],
    [1.81, -0.5],
  ]);
  const lip = lathe([
    [1.81, -0.5],
    [1.79, -0.22],
    [1.72, -0.06],
    [1.6, 0.02],
    [1.5, -0.02],
    [1.45, -0.16],
    [1.43, -0.7],
  ]);
  const cone = lathe([
    [0.02, -6.55],
    [0.45, -6.2],
    [0.84, -5.6],
    [1.0, -5.0],
    [1.02, -4.6],
  ]);
  for (const z of [-ENG.z, ENG.z]) {
    const m = mat4(ENG.x, ENG.y, z, 0, 0, -PI / 2);
    K.add(main, body, m);
    K.add(M.paintWhite, lip, m);
    K.add(M.steel, cone, m);
    K.add(M.navy, new THREE.CircleGeometry(1.44, 40), mat4(ENG.x - 0.66, ENG.y, z, 0, PI / 2, 0));
    K.add(M.navy, new THREE.RingGeometry(0.98, 1.27, 40), mat4(ENG.x - 5.18, ENG.y, z, 0, -PI / 2, 0));
    K.box(M.wing, 5.6, 1.0, 0.62, ENG.x - 3.4, ENG.y + 1.78, z, 0.28);
  }
  // the fuel coupling pod under the right wing
  K.box(M.wing, 0.8, 1.0, 0.8, FUEL.x, FUEL.y + 0.62, FUEL.z, 0.2);
  K.cyl(M.navy, 0.26, 0.26, 0.2, FUEL.x, FUEL.y + 0.1, FUEL.z, 'y', 0.06, 20);
  const out = K.freeze();
  JET_STATIC.set(livKey, out);
  return out;
}
const ENG = {x: 6.2, y: 2.35, z: 7.6};
const FUEL = {x: -1.8, y: 3.15, z: 11.6};
const GEAR = {main: {x: -1.0, y: 3.62, z: 3.95, axle: 0.82}, nose: {x: 18.2, y: 2.6, axle: 0.55}};

/** a toy tyre: dark, chunky, a soft rounded tread, axis z; and its light hub */
const tyreGeo = (R, w) =>
  cached(`tyre|${R}|${w}`, () => {
    const ri = R * 0.56;
    const c = w * 0.32;
    const pts = [[ri, -w / 2]];
    for (let k = 0; k <= 5; k++) {
      const a = -PI / 2 + (k / 5) * (PI / 2);
      pts.push([R - c + c * Math.cos(a), -w / 2 + c + c * Math.sin(a)]);
    }
    for (let k = 0; k <= 5; k++) {
      const a = (k / 5) * (PI / 2);
      pts.push([R - c + c * Math.cos(a), w / 2 - c + c * Math.sin(a)]);
    }
    pts.push([ri, w / 2]);
    return lathe(pts, 36).applyMatrix4(mat4(0, 0, 0, PI / 2, 0, 0));
  });
function wheel(K, R, w, x, y, z) {
  K.add(mats().tyre, tyreGeo(R, w), mat4(x, y, z));
  K.add(mats().hub, rcyl(R * 0.58, R * 0.58, w * 0.82, 0.06, 28), mat4(x, y, z, PI / 2, 0, 0));
  K.add(mats().steel, rcyl(R * 0.22, R * 0.22, w * 0.92, 0.04, 20), mat4(x, y, z, PI / 2, 0, 0));
}
const mainGearKit = once(() => {
  const M = mats();
  const K = new Kit();
  const {y, axle} = GEAR.main;
  const L = y - axle;
  K.cyl(M.steel, 0.24, 0.24, L + 0.2, 0, -L / 2, 0, 'y', 0.08, 20);
  K.box(M.steel, 0.42, 0.34, 1.0, 0, -L, 0, 0.12);
  K.box(M.steel, 0.16, 1.2, 0.16, 0.34, -L * 0.55, 0, 0.06, 0, 0, 0.5);
  wheel(K, 0.82, 0.62, 0, -L, -0.46);
  wheel(K, 0.82, 0.62, 0, -L, 0.46);
  return K.freeze();
});
const noseGearKit = once(() => {
  const M = mats();
  const K = new Kit();
  const {y, axle} = GEAR.nose;
  const L = y - axle;
  K.cyl(M.steel, 0.18, 0.18, L + 0.2, 0, -L / 2, 0, 'y', 0.06, 18);
  K.box(M.steel, 0.3, 0.26, 0.7, 0, -L, 0, 0.1);
  wheel(K, 0.55, 0.42, 0, -L, -0.34);
  wheel(K, 0.55, 0.42, 0, -L, 0.34);
  return K.freeze();
});
const fanKit = once(() => {
  const K = new Kit();
  K.add(mats().paintWhite, lathe([
    [0.56, -0.66],
    [0.53, -0.44],
    [0.41, -0.22],
    [0.22, -0.08],
    [0.01, -0.02],
  ]), mat4(0, 0, 0, 0, 0, -PI / 2));
  for (let k = 0; k < 16; k++) {
    const a = (k / 16) * TAU;
    const m = mat4(0, 0, 0, a, 0, 0).multiply(mat4(-0.58, 0.98, 0, 0, 0.55, 0));
    K.add(mats().fan, cached('blade', () => new THREE.BoxGeometry(0.1, 0.88, 0.3)), m);
  }
  return K.freeze();
});

export function buildToyAirliner({livery = 'aurora', reg} = {}) {
  const liv = LIVERY[livery] ?? LIVERY.aurora;
  reg = reg ?? liv.reg;
  const M = mats();
  const G = jetGeo();
  const tex = liveryTexture(liv, reg);
  const skinMat = cached(`skinmat|${livery}|${reg}`, () => new THREE.MeshPhysicalMaterial({map: tex, roughness: 0.46, clearcoat: 0.35, clearcoatRoughness: 0.35}));
  const group = new THREE.Group();
  group.name = `airliner-${livery}`;
  const fus = new THREE.Mesh(G.fuselage, skinMat);
  fus.castShadow = fus.receiveShadow = true;
  group.add(fus);
  const hold = new THREE.Mesh(G.hold, M.hold);
  hold.receiveShadow = true;
  group.add(hold);
  const body = thaw(jetStatic(livery));
  group.add(body);
  // the fin's mark, both sides
  const finMark = (side) => {
    const m = decal(markTex(liv.mark, {fg: '#ffffff', mirror: side < 0}), 1, 3.3);
    m.position.set(-19.2, 11.7, side * 0.36);
    m.rotation.y = side > 0 ? 0 : PI;
    return m;
  };
  group.add(finMark(1), finMark(-1));
  // cargo doors on hinges along their top edge
  const cargo = G.panels.map((p) => {
    const pivot = new THREE.Group();
    pivot.position.copy(p.hinge);
    const outer = new THREE.Mesh(p.outer, skinMat);
    const lining = new THREE.Mesh(p.lining, M.hold);
    outer.castShadow = outer.receiveShadow = lining.castShadow = lining.receiveShadow = true;
    pivot.add(outer, lining);
    group.add(pivot);
    return pivot;
  });
  // gear
  const mainL = thaw(mainGearKit());
  const mainR = thaw(mainGearKit());
  mainL.position.set(GEAR.main.x, GEAR.main.y, -GEAR.main.z);
  mainR.position.set(GEAR.main.x, GEAR.main.y, GEAR.main.z);
  const nose = thaw(noseGearKit());
  nose.position.set(GEAR.nose.x, GEAR.nose.y, 0);
  group.add(mainL, mainR, nose);
  // fans
  const fans = [-ENG.z, ENG.z].map((z) => {
    const f = thaw(fanKit());
    f.position.set(ENG.x - 0.02, ENG.y, z);
    group.add(f);
    return f;
  });
  // beacons and nav lights, each airliner its own materials so they switch alone
  const lamp = (color) => new THREE.MeshStandardMaterial({color, emissive: color, emissiveIntensity: 1.6, roughness: 0.3});
  const red = lamp(TOY.red);
  const navR = lamp(TOY.red);
  const navG = lamp('#3ddc84');
  const navW = lamp('#ffffff');
  const lamps = [];
  const bulb = (mat, x, y, z, s = 0.24) => {
    const m = new THREE.Mesh(rcyl(s, s * 0.8, s * 1.2, s * 0.45, 16), mat);
    m.position.set(x, y, z);
    group.add(m);
    lamps.push(m);
    return m;
  };
  bulb(red, 0.5, JET.Yc + JET.R + 0.12, 0, 0.26);
  bulb(red, -3.0, 2.22, 0, 0.26).rotation.x = PI;
  bulb(navR, -5.2, 5.05, -22.05, 0.18);
  bulb(navG, -5.2, 5.05, 22.05, 0.18);
  bulb(navW, -23.05, fusAt(-22.9).yc, 0, 0.16).rotation.z = PI / 2;

  const setGear = (k) => {
    const u = 1 - sat(k);
    mainL.rotation.x = -u * 1.55;
    mainR.rotation.x = u * 1.55;
    nose.rotation.z = u * 1.6;
  };
  const setCargoDoor = (i, k) => {
    if (cargo[i]) cargo[i].rotation.x = -sstep(k) * 3.05;
  };
  const setFans = (a) => {
    for (const f of fans) f.rotation.x = a;
  };
  const setBeacons = (on) => {
    for (const m of [red, navR, navG, navW]) m.emissiveIntensity = on ? 1.6 : 0;
  };
  setGear(1);
  const R = JET.R;
  const sideZ = (th) => R * Math.sin(th);
  const cargoDoor = ({x0, x1}) => ({x: (x0 + x1) / 2, y: SILL_CARGO, z: sideZ(TH.cargoSill), sill: SILL_CARGO, width: x1 - x0, height: CARGO_H, normal: V(0, 0, 1)});
  const pax = (s) => ({x: (PAX_DOOR.x0 + PAX_DOOR.x1) / 2, y: SILL_PAX, z: s * sideZ(TH.paxSill), sill: SILL_PAX, width: PAX_DOOR.x1 - PAX_DOOR.x0, height: PAX_H, normal: V(0, 0, s)});
  const doors = {
    L1: pax(-1),
    R1: pax(1),
    cargoFwd: cargoDoor(CARGO_DOORS[0]),
    cargoAft: cargoDoor(CARGO_DOORS[1]),
    fuel: {x: FUEL.x, y: FUEL.y, z: FUEL.z, sill: FUEL.y, width: 0.52, height: 0, normal: V(0, -1, 0)},
  };
  return {
    group,
    setGear,
    setCargoDoor,
    setFans,
    setBeacons,
    doors,
    parts: {fuselage: fus, body, cargoDoors: cargo, gear: {mainL, mainR, nose}, fans, lamps},
    dims: {length: 46, noseX: JET.nose, tailX: JET.tail, span: 44.2, finTip: 15.25, diameter: 7, nacelle: 3.64, mainGearX: GEAR.main.x, noseGearX: GEAR.nose.x},
  };
}

// ================================================================================================ walls and roofs
/**
 * vertical ribs on a wall, in the wall's own frame (x along it, y up, the face at z = 0, ribs out toward +z).
 * top(x) = the wall's height at x; gaps = [[x0, x1, yTop]] where ribs only run from yTop up.
 */
function ribs(K, mat, frame, x0, x1, top, {pitch = 0.78, w = 0.17, d = 0.07, gaps = [], y0 = 0} = {}) {
  const n = Math.floor((x1 - x0) / pitch);
  const off = (x1 - x0 - n * pitch) / 2;
  for (let k = 0; k <= n; k++) {
    const x = x0 + off + k * pitch;
    if (x < x0 + 0.25 || x > x1 - 0.25) continue;
    let yb = y0;
    for (const [a, b, yt] of gaps) if (x > a && x < b) yb = Math.max(yb, yt);
    const yt = top(x) - 0.05;
    if (yt - yb < 0.15) continue;
    K.add(mat, cached(`rib|${w}|${d}`, () => new THREE.BoxGeometry(w, 1, d)), frame.clone().multiply(mat4(x, (yb + yt) / 2, d / 2, 0, 0, 0, 1, yt - yb, 1)));
  }
}
/** a wall slab from an outline (x, y pairs in the wall frame) with rectangular holes [x0, y0, x1, y1], t thick behind z = 0 */
function wallSlab(outline, holes = [], t = 0.4) {
  const sh = new THREE.Shape(outline.map(([x, y]) => new THREE.Vector2(x, y)));
  for (const [a, b, c, d] of holes) {
    sh.holes.push(new THREE.Path([new THREE.Vector2(a, b), new THREE.Vector2(c, b), new THREE.Vector2(c, d), new THREE.Vector2(a, d)]));
  }
  const g = new THREE.ExtrudeGeometry(sh, {depth: t, bevelEnabled: false, curveSegments: 4});
  g.translate(0, 0, -t);
  return g;
}
/** a sloped roof sheet with ribs running down the slope: from (a: [x, y]) high edge to (b) low edge in the x-y plane,
 *  spanning z0..z1; the sheet's top faces up. Ribs every pitch along z. */
function roofSheet(K, matRoof, ax, ay, bx, by, z0, z1, {t = 0.32, pitch = 0.92, over = 0.55, frame = new THREE.Matrix4()} = {}) {
  const len = Math.hypot(bx - ax, by - ay);
  const ang = Math.atan2(by - ay, bx - ax);
  const cx = (ax + bx) / 2;
  const cy = (ay + by) / 2;
  const L = len + over * 2;
  const Z = z1 - z0 + over * 2;
  const m = frame.clone().multiply(mat4(cx, cy, (z0 + z1) / 2, 0, 0, ang));
  K.add(matRoof, rbox(L, t, Z, 0.12, 2), m);
  const n = Math.floor((Z - 0.6) / pitch);
  for (let k = 0; k <= n; k++) {
    const z = -Z / 2 + 0.3 + (Z - 0.6 - n * pitch) / 2 + k * pitch;
    K.add(matRoof, cached(`rrib|${L.toFixed(3)}`, () => new THREE.BoxGeometry(L - 0.2, 0.1, 0.2)), m.clone().multiply(mat4(0, t / 2 + 0.04, z)));
  }
  return m;
}

// ================================================================================================ the cargo terminal
export function buildToyCargoTerminal({docks = 6, stock = true, name = 'CARGO C', sign = ['AURORA CARGO', 'Cross-dock  ·  Apron C']} = {}) {
  const M = mats();
  const P = 10; // dock pitch
  const margin = 6;
  const L = docks * P + margin * 2;
  const D = 36;
  const nMod = Math.max(2, Math.round(L / 24));
  const Wm = L / nMod;
  const H1 = 14.6;
  const H0 = 11.0;
  const x0 = -L / 2;
  const top = (x) => {
    const k = clamp(Math.floor((x - x0) / Wm), 0, nMod - 1);
    return H1 - ((H1 - H0) * (x - x0 - k * Wm)) / Wm;
  };
  const DW = 5.2;
  const DH = 6.0;
  const dockX = Array.from({length: docks}, (_, i) => x0 + margin + P * (i + 0.5));
  const key = `cargo|${docks}|${stock}`;
  const frozen = cached(key, () => {
    const K = new Kit();
    // the sawtooth outline of the front and back walls
    const saw = [[x0, 0], [x0 + L, 0], [x0 + L, H0]];
    for (let k = nMod - 1; k >= 0; k--) {
      saw.push([x0 + k * Wm, H1]);
      if (k > 0) saw.push([x0 + k * Wm, H0]);
    }
    saw.push([x0, 0]);
    saw.pop();
    const holes = dockX.map((x) => [x - DW / 2, 0, x + DW / 2, DH]);
    const front = new THREE.Matrix4();
    K.add(M.wall, wallSlab(saw, holes, 0.42), front);
    ribs(K, M.wall, front, x0, x0 + L, top, {gaps: dockX.map((x) => [x - DW / 2 - 0.62, x + DW / 2 + 0.62, DH + 0.62])});
    const back = mat4(0, 0, -D, 0, PI, 0);
    const sawB = saw.map(([x, y]) => [-x, y]).reverse();
    K.add(M.wall, wallSlab(sawB, [], 0.42), back);
    ribs(K, M.wall, back, -x0 - L, -x0, (x) => top(-x));
    // end walls: the high end (-x) and the low end (+x)
    const endHi = mat4(x0, 0, -D / 2, 0, -PI / 2, 0);
    K.add(M.wall, wallSlab([[-D / 2, 0], [D / 2, 0], [D / 2, H1], [-D / 2, H1]], [], 0.42), endHi);
    ribs(K, M.wall, endHi, -D / 2, D / 2, () => H1);
    const endLo = mat4(x0 + L, 0, -D / 2, 0, PI / 2, 0);
    K.add(M.wall, wallSlab([[-D / 2, 0], [D / 2, 0], [D / 2, H0], [-D / 2, H0]], [], 0.42), endLo);
    ribs(K, M.wall, endLo, -D / 2, D / 2, () => H0);
    // the sawtooth roof: one monopitch per module falling toward +x, a clerestory of glass at each step
    for (let k = 0; k < nMod; k++) {
      const a = x0 + k * Wm;
      roofSheet(K, M.roof, a, H1 + 0.15, a + Wm, H0 + 0.15, -D, 0, {over: 0.5});
      // trims: the slanted edge on front and back, the gutter along the low edge
      const ang = Math.atan2(H0 - H1, Wm);
      const len = Math.hypot(Wm, H1 - H0);
      for (const z of [0.62, -D - 0.62]) K.box(M.blueDeep, len + 1.0, 0.62, 0.42, a + Wm / 2, (H1 + H0) / 2 + 0.25, z, 0.16, 0, 0, ang);
      K.box(M.blueDeep, 0.5, 0.5, D + 1.6, a + Wm + 0.35, H0 + 0.05, -D / 2, 0.16);
      if (k < nMod - 1) {
        K.box(M.glass, 0.3, H1 - H0 - 0.4, D - 1.0, a + Wm - 0.05, (H1 + H0) / 2 + 0.2, -D / 2, 0.1);
      }
    }
    K.box(M.blueDeep, 0.5, 0.5, D + 1.6, x0 - 0.35, H1 + 0.08, -D / 2, 0.16);
    // corner trims, tall and blue
    for (const [x, z, h] of [
      [x0, 0, H1],
      [x0 + L, 0, H0],
      [x0, -D, H1],
      [x0 + L, -D, H0],
    ])
      K.box(M.blue, 0.72, h + 0.2, 0.72, x, h / 2 + 0.05, z, 0.22);
    // downpipes under each module's low edge on the dock wall
    for (let k = 1; k < nMod; k++) K.box(M.blue, 0.32, H0 - 0.4, 0.32, x0 + k * Wm - 0.5, (H0 - 0.4) / 2, 0.34, 0.12);
    // dock doors: blue frames, bumpers, the lit room behind, a plate with the number
    dockX.forEach((x, i) => {
      const f = 0.58;
      for (const s of [-1, 1]) {
        K.box(M.blue, f, DH + f, 0.5, x + s * (DW / 2 + f / 2 - 0.04), (DH + f) / 2, 0.2, 0.2);
        K.box(M.navy, 0.42, 0.72, 0.4, x + s * (DW / 2 - 0.1), 0.42, 0.52, 0.12);
      }
      K.box(M.blue, DW + 2 * f - 0.08, f, 0.5, x, DH + f / 2, 0.2, 0.2);
      K.add(M.room, new THREE.BoxGeometry(DW, DH, 4.0), mat4(x, DH / 2 - 0.01, -0.42 - 2.0));
      if (stock && i % 3 !== 1) palletStack(K, x - 0.6, -2.6, i);
    });
    return K.freeze();
  });
  const group = thaw(frozen);
  group.name = 'cargo-terminal';
  // dock plates, signs and the roof logo (decals)
  dockX.forEach((x, i) => {
    const p = plate(`D${i + 1}`, {px: 100, h: 140, padX: 0.3});
    const m = decal(p.tex, p.aspect, 0.95);
    m.position.set(x - DW / 2 + 0.5, DH + 1.35, 0.11);
    group.add(m);
  });
  const sx = docks >= 3 ? (dockX[1] + dockX[2]) / 2 : dockX[0] + P / 2;
  const signT = signTex(sign[0], sign[1]);
  const sw = signT.aspect * 1.6;
  const sp = new THREE.Mesh(rbox(sw + 0.1, 1.7, 0.18, 0.08), M.white);
  sp.position.set(sx, DH + 3.1, 0.12);
  sp.castShadow = sp.receiveShadow = true;
  group.add(sp);
  const sg = decal(signT.tex, signT.aspect, 1.6);
  sg.position.set(sx, DH + 3.1, 0.22);
  group.add(sg);
  const box = new THREE.Mesh(rbox(5.2, 1.3, 0.3, 0.12), M.blueDeep);
  box.position.set(x0 - 0.2, 9.0, -D * 0.3);
  box.rotation.y = -PI / 2;
  box.castShadow = true;
  group.add(box);
  // the roof logo: a white disc with the cube and the name, lying on the middle module's slope
  const lm = Math.floor(nMod / 2);
  const ang = Math.atan2(H1 - H0, Wm);
  const slopeQ = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, -ang)).multiply(new THREE.Quaternion().setFromEuler(new THREE.Euler(-PI / 2, 0, 0)));
  const nrm = V(0, 1, 0).applyAxisAngle(V(0, 0, 1), -ang);
  const lx = x0 + lm * Wm + Wm / 2;
  const onSlope = (z, lift) => V(lx, (H1 + H0) / 2 + 0.15, z).addScaledVector(nrm, 0.16 + lift);
  const logo = decal(markTex('cube', {fg: TOY.blue, disc: '#ffffff'}), 1, 8.5);
  logo.position.copy(onSlope(-D / 2 - 2.5, 0.16));
  logo.quaternion.copy(slopeQ);
  group.add(logo);
  const lt = plate(name, {bg: null, fg: '#ffffff', px: 110, h: 150, padX: 0.1});
  const ltm = decal(lt.tex, lt.aspect, 2.0);
  ltm.position.copy(onSlope(-D / 2 + 3.6, 0.16));
  ltm.quaternion.copy(slopeQ);
  group.add(ltm);
  // roll-up shutters, each its own mesh
  const shutters = dockX.map((x) => {
    const s = new THREE.Mesh(shutterGeo(DW, DH), M.slat);
    s.position.set(x, DH / 2, -0.21);
    s.castShadow = s.receiveShadow = true;
    group.add(s);
    return s;
  });
  const setDoor = (i, k) => {
    if (shutters[i]) shutters[i].position.y = DH / 2 + sat(k) * (DH + 0.3);
  };
  for (let i = 0; i < docks; i++) setDoor(i, 1);
  return {
    group,
    docks: dockX.map((x, i) => ({x, z: 0, normal: V(0, 0, 1), number: `D${i + 1}`})),
    setDoor,
    length: L,
    depth: D,
  };
}
const shutterGeo = (w, h) =>
  cached(`shutter|${w}|${h}`, () => {
    const parts = [clean(new THREE.BoxGeometry(w, h, 0.08))];
    for (let y = 0.3; y < h - 0.1; y += 0.42) parts.push(clean(new THREE.BoxGeometry(w, 0.07, 0.12)).translate(0, y - h / 2, 0));
    return mergeGeometries(parts, false);
  });
/** stock inside a dock: kept out of the building's shadow so the open doors read lit, like the reference's */
const litMats = once(() => {
  const mk = (color) => {
    const m = new THREE.MeshStandardMaterial({color, roughness: 0.82});
    m.userData.noShadow = true;
    return m;
  };
  return {cardboard: mk(TOY.cardboard), pallet: mk(AIRSIDE.pallet)};
});
function palletStack(K, x, z, seed) {
  const M = litMats();
  K.box(M.pallet, 2.3, 0.28, 2.0, x, 0.16, z, 0.06);
  const rows = 2 + (seed % 2);
  for (let a = 0; a < 2; a++)
    for (let b = 0; b < 2; b++)
      for (let c = 0; c < rows; c++) {
        K.box(M.cardboard, 1.08, 0.86, 0.96, x - 0.56 + a * 1.12, 0.3 + 0.44 + c * 0.88, z - 0.49 + b * 0.98, 0.08);
      }
}
/** the reference's wall sign: a white rounded panel, the cube mark, a name in blue and a line under it */
function signTex(name, sub) {
  const key = ['sign', name, sub].join('|');
  if (TEX.has(key)) return TEX.get(key);
  const m = document.createElement('canvas').getContext('2d');
  m.font = FONT(800, 92);
  const w = Math.ceil(m.measureText(name).width + 320);
  const h = 200;
  const tex = canvasTex(w, h, (g) => {
    rr(g, 2, 2, w - 4, h - 4, 30);
    g.fillStyle = '#ffffff';
    g.fill();
    drawMark(g, 'cube', 96, h / 2, 70, TOY.blue);
    g.fillStyle = TOY.blue;
    g.font = FONT(800, 92);
    g.textBaseline = 'middle';
    g.fillText(name, 180, h / 2 - 22);
    g.fillStyle = TOY.blueLight;
    g.font = FONT(600, 42);
    g.fillText(sub, 184, h / 2 + 50);
  });
  const out = {tex, aspect: w / h};
  TEX.set(key, out);
  return out;
}

// ================================================================================================ the terminal pier
const TERM = {D: 28, H: 12.5, ridge: 15.4, bayW: 26, bayD: 2.9, bayY0: 4.4, bayY1: 11.2, anchorDX: -12, anchorZ: 9.0, stopZ: 14.9};
export function buildToyTerminal({gates = 3, spacing = 60, letter = 'B', first = 10} = {}) {
  const M = mats();
  const L = gates * spacing;
  const x0 = -L / 2;
  const {D, H, ridge, bayW, bayD, bayY0, bayY1} = TERM;
  const gx = Array.from({length: gates}, (_, i) => x0 + spacing * (i + 0.5));
  const frozen = cached(`terminal|${gates}|${spacing}`, () => {
    const K = new Kit();
    const front = new THREE.Matrix4();
    // the walls: a flat front and back, the two-gable ends
    K.add(M.wall, wallSlab([[x0, 0], [x0 + L, 0], [x0 + L, H], [x0, H]], [], 0.42), front);
    const doorsX = gx.flatMap((x) => [x - 7, x + 7]);
    ribs(K, M.wall, front, x0, x0 + L, () => H, {gaps: doorsX.map((x) => [x - 2.6, x + 2.6, 4.0])});
    const back = mat4(0, 0, -D, 0, PI, 0);
    K.add(M.wall, wallSlab([[x0, 0], [x0 + L, 0], [x0 + L, H], [x0, H]], [], 0.42), back);
    ribs(K, M.wall, back, x0, x0 + L, () => H);
    // the two-gable ends: ridges at z = -D/4 and -3D/4, a valley in the middle
    const q = D / 4;
    const gableTop = (u) => H + (ridge - H) * Math.max(0, 1 - Math.abs(Math.abs(u) - q) / q);
    for (const [ex, ry] of [
      [x0, -PI / 2],
      [x0 + L, PI / 2],
    ]) {
      const fr = mat4(ex, 0, -D / 2, 0, ry, 0);
      const out = [[-D / 2, 0], [D / 2, 0], [D / 2, H], [q, ridge], [0, H], [-q, ridge], [-D / 2, H]];
      K.add(M.wall, wallSlab(out, [], 0.42), fr);
      ribs(K, M.wall, fr, -D / 2, D / 2, gableTop);
    }
    // the roof: two gables with ridges along x, ribs running down each slope
    const alpha = Math.atan2(ridge - H, q);
    const slopeLen = Math.hypot(q, ridge - H) + 0.7;
    for (const zc of [-q, -3 * q]) {
      for (const s of [1, -1]) {
        // the slope from the ridge at zc down to the eave at zc + s q; its normal leans toward s z
        const nrm = V(0, Math.cos(alpha), s * Math.sin(alpha));
        const c = V(0, (H + ridge) / 2, zc + (s * q) / 2).addScaledVector(nrm, 0.18);
        const m = mat4(0, c.y, c.z, s * alpha, 0, 0);
        K.add(M.roof, rbox(L + 1.0, 0.32, slopeLen, 0.12, 2), m);
        const n = Math.floor((L + 0.4) / 0.92);
        for (let k = 0; k <= n; k++) {
          const x = x0 - 0.2 + k * 0.92 + (L + 0.4 - n * 0.92) / 2;
          K.add(M.roof, cached(`trib|${slopeLen.toFixed(3)}`, () => new THREE.BoxGeometry(0.2, 0.1, slopeLen - 0.25)), m.clone().multiply(mat4(x, 0.2, 0)));
        }
        // the slanted trims at both gable ends
        for (const ex of [x0 - 0.62, x0 + L + 0.62]) K.box(M.blueDeep, 0.42, 0.62, slopeLen + 0.1, ex, c.y + 0.12, c.z, 0.16, s * alpha, 0, 0);
      }
    }
    K.box(M.blueDeep, L + 1.6, 0.55, 0.55, 0, H + 0.08, 0.5, 0.18);
    K.box(M.blueDeep, L + 1.6, 0.55, 0.55, 0, H + 0.08, -D - 0.5, 0.18);
    K.box(M.blueDeep, L + 1.6, 0.5, 0.6, 0, H + 0.1, -D / 2, 0.18);
    for (const [x, z] of [
      [x0, 0],
      [x0 + L, 0],
      [x0, -D],
      [x0 + L, -D],
    ])
      K.box(M.blue, 0.72, H + 0.2, 0.72, x, H / 2 + 0.05, z, 0.22);
    // the floor line of the departure level, a blue fascia across the whole front
    K.box(M.blue, L, 0.5, 0.36, 0, 4.15, 0.12, 0.14);
    for (const x of gx) {
      // the glass gate front: dark glass in a thick blue frame, mullions, a blue cap
      const gy = (bayY0 + bayY1) / 2;
      const gh = bayY1 - bayY0;
      K.box(M.glass, bayW - 0.6, gh - 0.4, bayD - 0.3, x, gy, bayD / 2 - 0.1, 0.18);
      K.box(M.blue, bayW + 0.4, 0.62, bayD + 0.4, x, bayY0, bayD / 2, 0.22);
      K.box(M.blue, bayW + 0.8, 0.72, bayD + 0.8, x, bayY1 + 0.1, bayD / 2 + 0.05, 0.26);
      for (const s of [-1, 1]) K.box(M.blue, 0.62, gh + 0.2, bayD + 0.3, x + s * (bayW / 2 - 0.1), gy, bayD / 2, 0.2);
      const nm = 6;
      for (let k = 1; k < nm; k++) K.box(M.blue, 0.24, gh - 0.3, 0.26, x - bayW / 2 + (bayW * k) / nm, gy, bayD - 0.2, 0.08);
      K.box(M.blue, bayW - 0.4, 0.22, 0.24, x, gy + 0.9, bayD - 0.2, 0.08);
      // service doors under the gate front
      for (const s of [-1, 1]) {
        const dx = x + s * 7;
        for (const t of [-1, 1]) K.box(M.blue, 0.5, 3.9, 0.46, dx + t * 2.35, 1.95, 0.18, 0.16);
        K.box(M.blue, 5.2, 0.5, 0.46, dx, 3.9, 0.18, 0.16);
        K.add(M.shade, shutterGeo(4.2, 3.65), mat4(dx, 1.83, 0.02));
      }
      // the fixed link out to the rotunda
      const ax = x + TERM.anchorDX;
      const lz0 = bayD;
      const lz1 = TERM.anchorZ - JB.rotR + 0.2;
      K.box(M.white, 2.9, 3.05, lz1 - lz0 + 0.4, ax, JB.floor - 0.25 + 1.52, (lz0 + lz1) / 2, 0.3);
      K.box(M.blue, 2.98, 0.5, lz1 - lz0 + 0.42, ax, JB.floor - 0.06, (lz0 + lz1) / 2, 0.2);
      K.box(M.glass, 3.0, 0.5, lz1 - lz0 - 0.6, ax, JB.floor + 1.55, (lz0 + lz1) / 2, 0.14);
    }
    return K.freeze();
  });
  const group = thaw(frozen);
  group.name = 'terminal';
  const out = gx.map((x, i) => {
    const sign = `${letter}${first + i}`;
    const p = plate(sign, {px: 104, h: 150, padX: 0.36});
    const m = decal(p.tex, p.aspect, 1.9);
    m.position.set(x, bayY1 + 1.55, bayD + 0.48);
    group.add(m);
    const stand = new THREE.Mesh(rbox(p.aspect * 1.9 + 0.5, 2.3, 0.3, 0.12), M.blue);
    stand.position.set(x, bayY1 + 1.55, bayD + 0.3);
    stand.castShadow = true;
    group.add(stand);
    return {
      x,
      z: 0,
      bridgeAnchor: V(x + TERM.anchorDX, 0, TERM.anchorZ),
      stopX: x,
      stopZ: TERM.stopZ,
      stop: V(x, 0, TERM.stopZ),
      park: {x, z: TERM.stopZ + JET.nose, rotY: PI / 2},
      sign,
    };
  });
  // the roof logo on the front slope of the first gable
  const ang = Math.atan2(ridge - H, D / 4);
  const q = new THREE.Quaternion().setFromEuler(new THREE.Euler(-PI / 2 + ang, 0, 0));
  const nrm = V(0, Math.cos(ang), Math.sin(ang));
  const yz = (z) => H + ((ridge - H) * (0 - z)) / (D / 4);
  const onRoof = (x) => V(x, yz(-D / 8), -D / 8).addScaledVector(nrm, 0.62);
  const logo = decal(markTex('cube', {fg: TOY.blue, disc: '#ffffff'}), 1, 6.4);
  logo.position.copy(onRoof(-10));
  logo.quaternion.copy(q);
  group.add(logo);
  const lt = plate(`PIER ${letter}`, {bg: null, fg: '#ffffff', px: 110, h: 150, padX: 0.1});
  const ltm = decal(lt.tex, lt.aspect, 2.4);
  ltm.position.copy(onRoof(-10 + 4.0 + (lt.aspect * 2.4) / 2));
  ltm.quaternion.copy(q);
  group.add(ltm);
  return {group, gates: out, length: L};
}

// ================================================================================================ the jet bridge
const JB = {floor: 5.0, rotR: 2.5, pivotX: 2.3, LA: 10.5, LB: 10.0, gap: 0.4, ov: 1.4, cj: 0.4, front: 3.45, hRange: [3.0, 7.4], wA: 2.9, hA: 3.05, wB: 3.3, hB: 3.4};
const jbKits = once(() => {
  const M = mats();
  const rot = new Kit();
  rot.box(M.panel, 2.6, 0.4, 2.6, 0, 0.2, 0, 0.14);
  rot.cyl(M.panel, 0.78, 0.7, JB.floor - 0.5, 0, (JB.floor - 0.5) / 2 + 0.3, 0, 'y', 0.12);
  rot.cyl(M.white, JB.rotR, JB.rotR, 3.5, 0, JB.floor - 0.4 + 1.75, 0, 'y', 0.3, 40);
  rot.cyl(M.blue, JB.rotR + 0.08, JB.rotR + 0.08, 0.55, 0, JB.floor - 0.12, 0, 'y', 0.2, 40);
  rot.cyl(M.blue, JB.rotR + 0.16, JB.rotR + 0.1, 0.5, 0, JB.floor + 3.25, 0, 'y', 0.2, 40);
  const tunnel = (L, w, h, white) => {
    const K = new Kit();
    // centred on the inner tunnel's axis, so the outer one sleeves it
    const yb = -0.25 - (h - JB.hA) / 2;
    K.box(white, L, h, w, L / 2, yb + h / 2, 0, 0.32);
    K.box(M.blue, L + 0.02, 0.55, w + 0.06, L / 2, yb + 0.3, 0, 0.2);
    K.box(M.glass, L - 1.2, 0.56, w + 0.05, L / 2, yb + h * 0.62, 0, 0.16);
    return K.freeze();
  };
  const cab = new Kit();
  cab.box(M.blue, 3.0, 3.6, 3.9, 1.15, -0.3 + 1.8, 0, 0.36);
  cab.box(M.glass, 1.3, 1.1, 3.94, 2.0, 2.05, 0, 0.18);
  for (let k = 0; k < 3; k++) cab.box(M.navy, 0.26, 3.5 - k * 0.12, 3.75 - k * 0.12, 2.75 + k * 0.24, -0.3 + 1.8, 0, 0.12);
  cab.box(M.navy, 0.18, 0.5, 3.0, 3.36, -0.12, 0, 0.08);
  const col = new Kit();
  // the drive column's bogie (static) and a post that is scaled to the tunnel's height
  col.box(M.blue, 0.8, 0.55, 3.1, 0, 1.05, 0, 0.18);
  for (const z of [-1.05, 1.05]) wheel(col, 0.6, 0.48, 0, 0.6, z);
  const post = new Kit();
  for (const z of [-0.85, 0.85]) post.box(M.blue, 0.42, 1, 0.42, 0, 0.5, z, 0.08);
  return {rot: rot.freeze(), A: tunnel(JB.LA, JB.wA, JB.hA, M.white), B: tunnel(JB.LB, JB.wB, JB.hB, M.panel), cab: cab.freeze(), col: col.freeze(), post: post.freeze()};
});
export function buildToyJetBridge({label = ''} = {}) {
  const S = jbKits();
  const group = new THREE.Group();
  group.name = 'jet-bridge';
  group.add(thaw(S.rot));
  const yawG = new THREE.Group();
  group.add(yawG);
  const pitchG = new THREE.Group();
  pitchG.position.set(JB.pivotX, JB.floor, 0);
  yawG.add(pitchG);
  const tA = thaw(S.A);
  const tB = thaw(S.B);
  pitchG.add(tA, tB);
  const cabin = thaw(S.cab);
  yawG.add(cabin);
  if (label) {
    const p = plate(label, {bg: '#ffffff', fg: TOY.blue, px: 100, h: 150, padX: 0.3});
    for (const s of [-1, 1]) {
      const m = decal(p.tex, p.aspect, 0.86);
      m.position.set(0.62, 2.82, s * 1.97);
      m.rotation.y = s > 0 ? 0 : PI;
      cabin.add(m);
    }
  }
  const column = thaw(S.col);
  const post = thaw(S.post);
  post.position.y = 1.2;
  column.add(post);
  yawG.add(column);
  const cMin = JB.gap;
  const cMax = JB.LA - JB.ov;
  const Lmin = cMin + JB.LB + JB.cj;
  const Lmax = cMax + JB.LB + JB.cj;
  const state = {yaw: 0, extend: 16, height: JB.floor, cabinYaw: 0, pitch: 0};
  const limits = {extend: [JB.pivotX + Lmin, JB.pivotX + Lmax], height: JB.hRange.slice(), front: JB.front};
  const solve = () => {
    const h = clamp(state.height, ...JB.hRange);
    const rise = h - JB.floor;
    let run = Math.max(1, state.extend - JB.pivotX);
    let len = clamp(Math.hypot(run, rise), Lmin, Lmax);
    run = Math.sqrt(Math.max(1, len * len - rise * rise));
    const pitch = Math.atan2(rise, run);
    state.pitch = pitch;
    pitchG.rotation.z = pitch;
    tB.position.x = clamp(len - JB.cj - JB.LB, cMin, cMax);
    cabin.position.set(JB.pivotX + Math.cos(pitch) * len, h, 0);
    // the column stands 2.4 m in from the outer tunnel's end, its posts up to the tunnel's floor
    const sD = tB.position.x + JB.LB - 2.4;
    column.position.set(JB.pivotX + Math.cos(pitch) * sD, 0, 0);
    const topY = JB.floor + Math.sin(pitch) * sD - 0.3;
    post.scale.y = Math.max(0.3, topY - 1.2);
  };
  const setYaw = (a) => {
    state.yaw = a;
    yawG.rotation.y = a;
  };
  const setExtend = (m) => {
    state.extend = clamp(m, ...limits.extend);
    solve();
  };
  const setHeight = (h) => {
    state.height = clamp(h, ...JB.hRange);
    solve();
  };
  const setCabinYaw = (a) => {
    state.cabinYaw = a;
    cabin.rotation.y = a;
  };
  /** the canopy against a door: point = the sill's centre, normal = the door's outward normal, both in world space */
  const dock = (point, normal, gap = 0.06) => {
    group.updateWorldMatrix(true, false);
    const inv = new THREE.Matrix4().copy(group.matrixWorld).invert();
    const p = point.clone().applyMatrix4(inv);
    const n = normal.clone().transformDirection(inv);
    n.y = 0;
    n.normalize();
    const piv = p.clone().addScaledVector(n, JB.front + gap);
    const yaw = Math.atan2(-piv.z, piv.x);
    setYaw(yaw);
    state.height = clamp(p.y, ...JB.hRange);
    setExtend(Math.hypot(piv.x, piv.z));
    const head = Math.atan2(n.z, -n.x);
    setCabinYaw(head - yaw);
    return {yaw, extend: state.extend, height: state.height, cabinYaw: head - yaw};
  };
  setExtend(limits.extend[0] + 1);
  return {group, setExtend, setYaw, setHeight, setCabinYaw, dock, limits, state, parts: {yaw: yawG, pitch: pitchG, tunnels: [tA, tB], cabin, column}};
}

// ================================================================================================ the tower
const towerKit = once(() => {
  const M = mats();
  const K = new Kit();
  K.box(M.white, 10, 4.6, 10, 0, 2.3, 0, 0.5);
  K.box(M.blue, 10.3, 0.6, 10.3, 0, 4.5, 0, 0.24);
  K.box(M.glass, 3.2, 2.6, 0.3, 0, 1.3, 5.02, 0.12);
  K.box(M.blue, 3.8, 0.4, 0.5, 0, 2.75, 5.05, 0.14);
  K.cyl(M.white, 2.35, 2.2, 21, 0, 4.8 + 10.5, 0, 'y', 0.3, 40);
  for (const y of [10, 16, 22]) K.cyl(M.blue, 2.42, 2.42, 0.45, 0, y, 0, 'y', 0.16, 40);
  for (let y = 7; y < 24; y += 3) K.box(M.glass, 0.7, 1.1, 0.3, 0, y + 1.2, 2.25, 0.12);
  K.add(M.white, lathe([
    [2.2, 25.6],
    [2.6, 26.3],
    [3.6, 27.1],
    [4.4, 27.6],
  ], 40));
  K.cyl(M.blue, 4.9, 4.9, 0.72, 0, 27.95, 0, 'y', 0.26, 40);
  // the cab: a faceted dark-glass band leaning out, white posts at the facets
  const nf = 10;
  K.add(M.glass, new THREE.CylinderGeometry(4.85, 4.35, 3.3, nf, 1, true), mat4(0, 28.3 + 1.65, 0));
  for (let k = 0; k < nf; k++) {
    const a = (k / nf) * TAU;
    bar(K, M.white, V(Math.sin(a) * 4.38, 28.25, Math.cos(a) * 4.38), V(Math.sin(a) * 4.9, 31.65, Math.cos(a) * 4.9), 0.24);
  }
  K.cyl(M.blue, 5.3, 5.3, 0.75, 0, 31.9, 0, 'y', 0.3, 40);
  K.cyl(M.white, 2.4, 2.1, 1.4, 0, 33.0, 0, 'y', 0.25, 32);
  K.cyl(M.panel, 0.16, 0.12, 3.0, 0.8, 35.0, 0.6, 'y', 0.05, 12);
  K.box(M.white, 3.0, 0.3, 0.7, -0.6, 34.1, -0.2, 0.12);
  K.box(M.blue, 0.5, 0.5, 0.5, -0.6, 33.85, -0.2, 0.12);
  return K.freeze();
});
export function buildToyTower() {
  const g = thaw(towerKit());
  g.name = 'tower';
  const lamp = new THREE.Mesh(rcyl(0.26, 0.2, 0.4, 0.12, 16), new THREE.MeshStandardMaterial({color: TOY.red, emissive: TOY.red, emissiveIntensity: 1.5}));
  lamp.position.set(0.8, 36.7, 0.6);
  g.add(lamp);
  const p = plate('TWR', {bg: TOY.blue, fg: '#ffffff', px: 100, h: 150, padX: 0.3});
  const m = decal(p.tex, p.aspect, 1.2);
  m.position.set(0, 3.3, 5.17);
  g.add(m);
  return g;
}

// ================================================================================================ the hangar
const HG = {W: 64, D: 52, eave: 11, top: 24, doorW: 50, doorH: 15.5};
const hangarKit = once(() => {
  const M = mats();
  const K = new Kit();
  const {W, D, eave, top, doorW, doorH} = HG;
  const sag = top - eave;
  const R = (Math.pow(W / 2, 2) + sag * sag) / (2 * sag);
  const cy = top - R;
  const arcY = (x) => cy + Math.sqrt(Math.max(0, R * R - x * x));
  const a0 = Math.asin(W / 2 / R);
  // front and back walls: a rectangle under the arc
  const outline = [[-W / 2, 0], [W / 2, 0], [W / 2, eave]];
  for (let k = 1; k < 40; k++) {
    const x = W / 2 - (W * k) / 40;
    outline.push([x, arcY(x)]);
  }
  outline.push([-W / 2, eave]);
  K.add(M.wall, wallSlab(outline, [[-doorW / 2, 0, doorW / 2, doorH]], 0.5));
  ribs(K, M.wall, new THREE.Matrix4(), -W / 2, W / 2, arcY, {gaps: [[-doorW / 2 - 0.9, doorW / 2 + 0.9, doorH + 0.9]], pitch: 0.82});
  const back = mat4(0, 0, -D, 0, PI, 0);
  K.add(M.wall, wallSlab(outline.map(([x, y]) => [x, y]), [], 0.5), back);
  ribs(K, M.wall, back, -W / 2, W / 2, arcY, {pitch: 0.82});
  for (const s of [-1, 1]) {
    const fr = mat4((s * W) / 2, 0, -D / 2, 0, (s * PI) / 2, 0);
    K.add(M.wall, wallSlab([[-D / 2, 0], [D / 2, 0], [D / 2, eave], [-D / 2, eave]], [], 0.5), fr);
    ribs(K, M.wall, fr, -D / 2, D / 2, () => eave, {pitch: 0.82});
    // a band of high windows
    for (let z = -D + 5; z < -3; z += 4.4) K.box(M.window, 0.3, 1.5, 3.0, (s * W) / 2 + s * 0.08, eave - 2.4, z, 0.12);
  }
  // the barrel roof: a shell under ribs that run over the arc, blue trims at both ends
  const shellShape = (r0, r1, aa) => {
    const sh = new THREE.Shape();
    sh.absarc(0, cy, r1, PI / 2 - aa, PI / 2 + aa, false);
    sh.absarc(0, cy, r0, PI / 2 + aa, PI / 2 - aa, true);
    return sh;
  };
  const shell = new THREE.ExtrudeGeometry(shellShape(R - 0.1, R + 0.25, a0 + 0.012), {depth: D + 1.2, bevelEnabled: false, curveSegments: 72});
  shell.translate(0, 0, -D - 0.6);
  K.add(M.roof, shell);
  const rib = new THREE.ExtrudeGeometry(shellShape(R + 0.2, R + 0.36, a0 + 0.01), {depth: 0.24, bevelEnabled: false, curveSegments: 72});
  for (let z = -D - 0.2; z < 0.3; z += 1.0) K.add(M.roof, rib, mat4(0, 0, z));
  const trim = new THREE.ExtrudeGeometry(shellShape(R - 0.35, R + 0.55, a0 + 0.03), {depth: 0.6, bevelEnabled: false, curveSegments: 72});
  K.add(M.blueDeep, trim, mat4(0, 0, 0.2));
  K.add(M.blueDeep, trim, mat4(0, 0, -D - 0.8));
  for (const [x, z] of [
    [-W / 2, 0],
    [W / 2, 0],
    [-W / 2, -D],
    [W / 2, -D],
  ])
    K.box(M.blue, 0.8, eave + 0.3, 0.8, x, eave / 2, z, 0.24);
  // the door: a thick blue frame, leaves parked at both sides, the lit hall behind
  const f = 0.9;
  for (const s of [-1, 1]) K.box(M.blue, f, doorH + f, 0.7, s * (doorW / 2 + f / 2 - 0.05), (doorH + f) / 2, 0.25, 0.28);
  K.box(M.blue, doorW + 2 * f, f, 0.7, 0, doorH + f / 2, 0.25, 0.28);
  // the door leaves, slid aside in front of the wall
  for (const s of [-1, 1]) {
    const x = s * (doorW / 2 + 3.4);
    K.add(M.shade, shutterGeo(6.0, doorH - 0.3), mat4(x, (doorH - 0.3) / 2 + 0.05, 0.62));
    K.box(M.blue, 6.3, 0.4, 0.36, x, doorH - 0.1, 0.66, 0.12);
    K.box(M.blue, 6.3, 0.34, 0.36, x, 0.2, 0.66, 0.12);
    for (const e of [-1, 1]) K.box(M.blue, 0.3, doorH - 0.2, 0.36, x + e * 3.0, doorH / 2, 0.66, 0.1);
  }
  // the hall: the wall outline shrunk a little and extruded, seen from inside
  const hall = new THREE.ExtrudeGeometry(new THREE.Shape(outline.map(([x, y]) => new THREE.Vector2(x * 0.97, y * 0.97 + 0.01))), {depth: D - 1.2, bevelEnabled: false, curveSegments: 4});
  K.add(sideMat('#a8b2d6', THREE.BackSide, 0.9), hall, mat4(0, 0, -D + 0.6));
  return K.freeze();
});
export function buildToyHangar({label = 'HANGAR 2'} = {}) {
  const g = thaw(hangarKit());
  g.name = 'hangar';
  const p = plate(label, {bg: TOY.blue, fg: '#ffffff', px: 100, h: 150, padX: 0.34});
  const m = decal(p.tex, p.aspect, 2.4);
  m.position.set(0, HG.doorH + 3.0, 0.05);
  g.add(m);
  const logo = decal(markTex('cube', {fg: TOY.blue, disc: '#ffffff'}), 1, 3.4);
  logo.position.set(0, HG.doorH + 6.1, 0.05);
  g.add(logo);
  return g;
}

// ================================================================================================ the apron light
const lightKit = once(() => {
  const M = mats();
  const K = new Kit();
  K.box(M.panel, 1.9, 0.7, 1.9, 0, 0.35, 0, 0.22);
  K.cyl(M.white, 0.58, 0.4, 22.6, 0, 0.7 + 11.3, 0, 'y', 0.14, 24);
  K.cyl(M.blue, 0.5, 0.5, 0.5, 0, 6, 0, 'y', 0.16, 24);
  K.cyl(M.panel, 1.5, 1.5, 0.24, 0, 22.4, 0, 'y', 0.1, 28);
  // the head: a blue housing tilted down toward +z
  K.box(M.blue, 4.4, 2.0, 0.9, 0, 23.7, 0.35, 0.3, 0.32, 0, 0);
  K.box(M.blue, 0.4, 1.2, 0.4, 0, 22.9, 0, 0.12);
  return K.freeze();
});
export function buildToyApronLight() {
  const g = thaw(lightKit());
  g.name = 'apron-light';
  const lamp = new THREE.MeshStandardMaterial({color: '#fff8e8', emissive: '#fff4dc', emissiveIntensity: 1.2, roughness: 0.3});
  const head = new THREE.Group();
  head.position.set(0, 23.7, 0.35);
  head.rotation.x = 0.32;
  for (let a = 0; a < 3; a++)
    for (let b = 0; b < 2; b++) {
      const m = new THREE.Mesh(rbox(1.15, 0.7, 0.2, 0.08), lamp);
      m.position.set(-1.35 + a * 1.35, -0.42 + b * 0.84, 0.42);
      head.add(m);
    }
  g.add(head);
  g.userData.setOn = (k) => (lamp.emissiveIntensity = 1.2 * sat(k));
  return g;
}

// ================================================================================================ trees, fences, city
const TREE = {trunkH: 2.7, trunkR: 0.2, crown: [2.0, 2.55, 2.0], bush: [1.8, 1.15, 1.8]};
const treeGeo = once(() => ({
  trunk: rcyl(TREE.trunkR, TREE.trunkR * 0.75, TREE.trunkH + 0.6, 0.05, 12).clone().translate(0, (TREE.trunkH + 0.6) / 2, 0),
  crown: new THREE.SphereGeometry(1, 32, 22).scale(...TREE.crown).translate(0, TREE.trunkH + TREE.crown[1] * 0.92, 0),
  bush: new THREE.SphereGeometry(1, 28, 14, 0, TAU, 0, PI / 2).scale(...TREE.bush),
}));
export function buildToyTree({size = 1, kind = 'tree'} = {}) {
  const M = mats();
  const G = treeGeo();
  const g = new THREE.Group();
  g.name = kind;
  const add = (geo, mat) => {
    const m = new THREE.Mesh(geo, mat);
    m.castShadow = m.receiveShadow = true;
    g.add(m);
  };
  if (kind === 'bush') add(G.bush, M.greenDeep);
  else {
    add(G.trunk, M.trunk);
    add(G.crown, M.green);
  }
  g.scale.setScalar(size);
  return g;
}
/** many trees at once: [{x, z, size = 1, kind = 'tree' | 'bush', rot = 0}] -> one Group of instanced meshes */
export function buildToyTrees(list) {
  const M = mats();
  const G = treeGeo();
  const g = new THREE.Group();
  g.name = 'trees';
  const trees = list.filter((t) => (t.kind ?? 'tree') === 'tree');
  const bushes = list.filter((t) => t.kind === 'bush');
  const inst = (geo, mat, items) => {
    if (!items.length) return;
    const im = new THREE.InstancedMesh(geo, mat, items.length);
    items.forEach((t, i) => im.setMatrixAt(i, mat4(t.x, 0, t.z, 0, t.rot ?? 0, 0, t.size ?? 1, t.size ?? 1, t.size ?? 1)));
    im.castShadow = im.receiveShadow = true;
    im.computeBoundingSphere();
    g.add(im);
  };
  inst(G.trunk, M.trunk, trees);
  inst(G.crown, M.green, trees);
  inst(G.bush, M.greenDeep, bushes);
  return g;
}
export function buildToyFence({length = 30} = {}) {
  const M = mats();
  const n = Math.max(1, Math.round(length / 3));
  const step = length / n;
  const frozen = cached(`fence|${n}|${step.toFixed(3)}`, () => {
    const K = new Kit();
    const H = 2.4;
    for (let k = 0; k <= n; k++) K.box(M.post, 0.2, H + 0.1, 0.2, -length / 2 + k * step, (H + 0.1) / 2, 0, 0.07);
    K.box(M.post, length + 0.1, 0.12, 0.12, 0, H, 0, 0.05);
    K.box(M.post, length + 0.1, 0.12, 0.12, 0, 0.18, 0, 0.05);
    for (let k = 0; k < n; k++) K.box(M.pane, step - 0.2, H - 0.32, 0.05, -length / 2 + (k + 0.5) * step, H / 2 + 0.09, 0, 0.02);
    return K.freeze();
  });
  const g = thaw(frozen);
  g.name = 'fence';
  return g;
}
export function buildToyCityBlock({w = 24, d = 18, floors = 5, seed = 1} = {}) {
  const M = mats();
  const fh = 3.3;
  const H = floors * fh + 1.4;
  const frozen = cached(`city|${w}|${d}|${floors}`, () => {
    const K = new Kit();
    K.box(M.white, w, H, d, 0, H / 2, 0, 0.5);
    K.box(M.white, w - 1.6, 0.5, d - 1.6, 0, H + 0.2, 0, 0.2);
    K.box(M.blue, 3.4, 3.0, 0.4, w * 0.18, 1.5, d / 2, 0.14);
    K.box(M.glass, 2.6, 2.4, 0.42, w * 0.18, 1.3, d / 2 + 0.02, 0.1);
    return K.freeze();
  });
  const g = thaw(frozen);
  g.name = 'city-block';
  // windows: periwinkle squares on every face, one per bay and floor
  const mats4 = [];
  const faces = [
    [w, d / 2, 0],
    [w, -d / 2, PI],
    [d, w / 2, PI / 2],
    [d, -w / 2, -PI / 2],
  ];
  let rnd = seed * 9301 + 49297;
  const rand = () => ((rnd = (rnd * 9301 + 49297) % 233280) / 233280);
  for (const [len, off, ry] of faces) {
    const nb = Math.max(1, Math.floor((len - 2.4) / 2.6));
    const sx = (len - 2.4) / nb;
    for (let f = 1; f < floors; f++) {
      for (let b = 0; b < nb; b++) {
        if (rand() < 0.04) continue;
        const u = -len / 2 + 1.2 + sx * (b + 0.5);
        const y = 1.2 + f * fh + fh * 0.45;
        // the face's own frame turned about y, the window pushed out onto the wall
        mats4.push(new THREE.Matrix4().makeRotationY(ry).multiply(mat4(u, y, Math.abs(off) + 0.03)));
      }
    }
  }
  const im = new THREE.InstancedMesh(rbox(1.15, 1.35, 0.14, 0.05), M.window, mats4.length);
  mats4.forEach((m, i) => im.setMatrixAt(i, m));
  im.castShadow = false;
  im.receiveShadow = true;
  im.computeBoundingSphere();
  g.add(im);
  return g;
}
