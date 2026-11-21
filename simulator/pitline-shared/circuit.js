// Pitline's circuit buildings: the pit building and its garages, the pit wall and the teams' stands on it, the
// grandstand, the start gantry, the aero lab with its wind tunnel, the paddock's motorhomes, marshal posts and trees.
// Built to the simulator skill's reference films (Rampline, Plantline, Buildline, Stockline): toy proportions,
// generous bevels, matte paint with a soft sheen, dark glass, crisp printed names, blue + white on lavender, low.
// Every colour comes from ./style.js; the few it lacks are in CIRCUIT below (taken from the skill's airport and plant
// kits, which sampled them from the reference frames). Metres, y up, every group's origin on the ground.
//
//   buildPitBuilding({teams, bay = 30}) -> {group, garages: [{team, centre}], length, raceControl}
//       Front face on local z = 0 facing +z, 16 m deep (z -16..0), roof 9.0 m, the terrace rail to 9.9. Centred on
//       x = 0: the garages from x = -length/2, one per team, bay apart; race control's block (18 m) at the +x end.
//       garages[i].centre = the point on the ground at the middle of the garage's opening (z = 0); openings 22 x 5.5.
//       Inside each: a light epoxy floor, a team-colour threshold stripe, tyres in blankets on a rack and in a stack
//       (+x side), tool chests along the -x wall, an engineers' desk and a timing screen (-x side, back of the view).
//       The middle of each garage (|x - centre.x| < 3) is kept clear for a car. raceControl = its block's centre.
//   buildPitWall({length}) -> {group}         along local x, 1.2 m high, 0.8 thick; catch fence on the -z side.
//   buildPitWallStand({team}) -> {group, anchor}   8 m long, straddles the pit wall's line (z = 0); the track side
//       is local +z (monitors face +z), the strategists' deck and bench on the pit-lane side (-z, out to z = -1.8).
//       anchor = Vector3 above the canopy.
//   buildGrandstand({length = 80, rows = 8}) -> {group}   faces +z (front wall at z = 0, rows rising toward -z),
//       5.9 m high, 0.4 + rows * 0.9 deep.
//   buildStartGantry({span = 18}) -> {group, setLights(n)}   beam along local x at 6.5 m (posts at x = +-span/2),
//       the track runs along z; 5 pods with lamps on both faces. setLights(0) off, 1..5 first n red, -1 all green.
//   buildAeroLab() -> {group, mount, setFan(angle), setBelt(distance), flow, anchor, strut}
//       A cutaway hall 70 x 30 (x -35..35, z -15..15): back and -x walls 8 m, the camera-side walls cut to 2.4 m.
//       A closed-circuit tunnel laid flat: the test section along x at z = 4 (x -6..6, glass sides and top, the belt in
//       its floor), the contraction cone upstream (+x), the fan in a cut-open blue housing on the return leg (z =
//       -8.5), corners and the return loop; the control room at the +x end, a model shop at the -x end.
//       Air flows toward -x through the test section. mount = Object3D at the belt's surface, (0, 0.82, 4), where a
//       60% car sits facing +x. flow = {x0: -6, x1: 6, y0: 0.82, y1: 3.38, z0: 1.55, z1: 6.45}. setFan(a) turns the
//       rotor to angle a (rad), setBelt(d) moves the belt d metres (its surface runs toward -x). strut = the overhead
//       sting (tip 0.95 above the belt at x = -0.4); hide it if the model does not want it.
//   buildMotorhome({team}) -> {group}       20 x 8, two storeys (7.3 m), faces +z, team-colour glass bands and roof.
//   buildMarshalPost() -> {group}           a hut with a flag board, faces +z.
//   buildToyTree({size, kind}), buildToyTrees([{x, z, size, kind, rot}])   copied from the skill's airside.js.
//
// Static parts are merged per material and every variant's kit is built once and shared between copies; repeats are
// instanced (grandstand seats, trees). Text uses Inter: build after document.fonts has loaded it.
import * as THREE from 'three';
import {mergeGeometries, mergeVertices} from 'three/addons/utils/BufferGeometryUtils.js';
import {TOY, rbox, toyMat} from './style.js';

/** colours style.js does not carry (from the skill's AIRSIDE and PLANT tables, sampled from the reference frames) */
export const CIRCUIT = {
  wall: '#e8ecf7', // the reference's light wall: near white with a lavender cast
  wallIn: '#eff2fb', // the plain inner face of a cut wall
  interior: '#d3d9ee', // the lit inside of an opening
  floor: '#e8ecf8', // a hall floor, a step lighter than the lot
  epoxy: '#f4f6fd', // the garages' epoxy floor
  post: '#98a3c6', // fence posts and rails
  pane: '#eef1fb', // translucent fence and balustrade panels
  tunnelGlass: '#cfdcff', // the test section's glass
  steel: '#c3cbe3',
  ink: '#1d2231',
  screen: '#121a30', // screens, before their picture
  ductIn: '#7f8bb3', // the inside of the tunnel's ducts
  fanIn: '#2c3a5e', // the inside of the fan housing
};

// ================================================================ helpers (copied from the skill's airside.js, MIT)
const PI = Math.PI;
const TAU = PI * 2;
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const lerp = (a, b, t) => a + (b - a) * t;
const sat = (v) => clamp(v, 0, 1);
const V = (x = 0, y = 0, z = 0) => new THREE.Vector3(x, y, z);
const _p = new THREE.Vector3();
const _q = new THREE.Quaternion();
const _e = new THREE.Euler();
const _s = new THREE.Vector3();
const mat4 = (x = 0, y = 0, z = 0, rx = 0, ry = 0, rz = 0, sx = 1, sy = 1, sz = 1) =>
  new THREE.Matrix4().compose(_p.set(x, y, z), _q.setFromEuler(_e.set(rx, ry, rz)), _s.set(sx, sy, sz));

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
const GEO = new Map();
const cached = (key, make) => {
  if (!GEO.has(key)) GEO.set(key, make());
  return GEO.get(key);
};
const once = (make) => {
  let v = null;
  return () => (v ??= make());
};
/** a lathe with a rounded-rectangle profile: a cylinder (or a tapered one) with soft edges, axis y, centred */
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
  /** a flat horizontal patch facing up (floor paint, decks) */
  patch(mat, w, d, x, y, z, ry = 0) {
    return this.add(mat, cached(`patch|${w}|${d}`, () => new THREE.PlaneGeometry(w, d).rotateX(-PI / 2)), mat4(x, y, z, 0, ry, 0));
  }
  /** a flat vertical picture facing +z (turned by ry), w x h */
  pic(mat, w, h, x, y, z, ry = 0) {
    return this.add(mat, cached(`pic|${w}|${h}`, () => new THREE.PlaneGeometry(w, h)), mat4(x, y, z, 0, ry, 0));
  }
  freeze() {
    return [...this.parts].map(([mat, list]) => ({mat, geo: mergeGeometries(list, false)}));
  }
}
/** glass and mist stay out of the GTAO depth pass (it draws them as solid and would shade what is behind); from the
 *  skill's plant-shared/line.js */
function hideFromAO(r, scene, cam, geo) {
  geo.setDrawRange(0, scene.overrideMaterial ? 0 : Infinity);
}
/** a Group from a frozen kit; geometry and materials are shared, not copied */
function thaw(frozen, group = new THREE.Group()) {
  for (const {geo, mat} of frozen) {
    const m = new THREE.Mesh(geo, mat);
    m.castShadow = !mat.transparent && mat.side !== THREE.BackSide && !mat.userData.noCast;
    m.receiveShadow = !mat.userData.noShadow && mat.side !== THREE.BackSide;
    if (mat.userData.noAO) m.onBeforeRender = hideFromAO;
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
/** vertical ribs on a wall, in the wall's own frame (x along it, y up, the face at z = 0, ribs out toward +z) */
function ribs(K, mat, frame, x0, x1, top, {pitch = 0.78, w = 0.17, d = 0.07, gaps = [], y0 = 0} = {}) {
  const n = Math.floor((x1 - x0) / pitch);
  const off = (x1 - x0 - n * pitch) / 2;
  for (let k = 0; k <= n; k++) {
    const x = x0 + off + k * pitch;
    if (x < x0 + 0.25 || x > x1 - 0.25) continue;
    let yb = y0;
    let skip = false;
    for (const [a, b, yt] of gaps) if (x > a && x < b) yt === null ? (skip = true) : (yb = Math.max(yb, yt));
    const yt = top(x) - 0.05;
    if (skip || yt - yb < 0.15) continue;
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

// ================================================================ materials
const SIDE = new Map();
function sideMat(color, side, rough) {
  const key = `${color}|${side}|${rough}`;
  if (!SIDE.has(key)) SIDE.set(key, new THREE.MeshStandardMaterial({color, roughness: rough, side}));
  return SIDE.get(key);
}
const paint = (color, rough = 0.48) => toyMat(color, {paint: true, rough});
const LIT = new Map();
/** kept out of the shadows, so an interior under a deep building reads lit like the reference's open docks */
function lit(color, {rough = 0.62, sheen = false, offset = 0} = {}) {
  const key = [color, rough, sheen, offset].join('|');
  if (!LIT.has(key)) {
    const m = sheen
      ? new THREE.MeshPhysicalMaterial({color, roughness: rough, clearcoat: 0.3, clearcoatRoughness: 0.4})
      : new THREE.MeshStandardMaterial({color, roughness: rough});
    if (offset) {
      m.polygonOffset = true;
      m.polygonOffsetFactor = -offset;
      m.polygonOffsetUnits = -2 * offset;
      m.userData.noCast = true;
    }
    m.userData.noShadow = true;
    LIT.set(key, m);
  }
  return LIT.get(key);
}
const FLOOR = new Map();
/** floor paint: flat, never casts, pulled toward the camera so it never fights the floor under it */
function floorPaint(color, k = 2, rough = 0.85) {
  const key = `${color}|${k}|${rough}`;
  if (!FLOOR.has(key)) {
    const m = new THREE.MeshStandardMaterial({color, roughness: rough, polygonOffset: true, polygonOffsetFactor: -k, polygonOffsetUnits: -2 * k});
    m.userData.noCast = true;
    FLOOR.set(key, m);
  }
  return FLOOR.get(key);
}
const PANE = new Map();
/** see-through panes (fences, balustrades, the tunnel's glass), kept out of the AO pass */
function paneMat(color, opacity, rough = 0.2) {
  const key = `${color}|${opacity}|${rough}`;
  if (!PANE.has(key)) {
    const m = new THREE.MeshStandardMaterial({color, roughness: rough, transparent: true, opacity, depthWrite: false});
    m.userData.noAO = true;
    PANE.set(key, m);
  }
  return PANE.get(key);
}
let MATS = null;
function mats() {
  if (MATS) return MATS;
  MATS = {
    white: toyMat(TOY.white),
    paintWhite: paint(TOY.white, 0.5),
    panel: toyMat(TOY.panel),
    wall: toyMat(CIRCUIT.wall, {rough: 0.72}),
    wallIn: toyMat(CIRCUIT.wallIn, {rough: 0.8}),
    roof: toyMat(TOY.roof, {rough: 0.62}),
    blue: toyMat(TOY.blue, {rough: 0.5}),
    paintBlue: paint(TOY.blue, 0.46),
    blueDeep: toyMat(TOY.blueDeep, {rough: 0.5}),
    blueLight: toyMat(TOY.blueLight, {rough: 0.5}),
    navy: toyMat(TOY.navy, {rough: 0.7}),
    glass: toyMat(TOY.glass, {rough: 0.16}),
    shade: toyMat(TOY.shade, {rough: 0.6}),
    steel: toyMat(CIRCUIT.steel, {rough: 0.45}),
    post: toyMat(CIRCUIT.post, {rough: 0.45}),
    ink: toyMat(CIRCUIT.ink, {rough: 0.62}),
    green: toyMat(TOY.green, {rough: 0.72}),
    greenDeep: toyMat(TOY.greenDeep, {rough: 0.72}),
    trunk: toyMat(TOY.trunk, {rough: 0.8}),
    yellow: paint(TOY.yellow, 0.5),
    floor: floorPaint(CIRCUIT.floor, 0, 0.92),
    pane: paneMat(CIRCUIT.pane, 0.5, 0.3),
    rail: paneMat('#dfe7ff', 0.38, 0.15),
    tunnel: paneMat(CIRCUIT.tunnelGlass, 0.2, 0.12),
    tunnelTop: paneMat('#dfe8ff', 0.12, 0.12),
    room: sideMat(CIRCUIT.interior, THREE.BackSide, 0.9),
    ductIn: sideMat(CIRCUIT.ductIn, THREE.BackSide, 0.85),
    fanIn: sideMat(CIRCUIT.fanIn, THREE.BackSide, 0.8),
  };
  return MATS;
}
/** a team's strongest colour: the body, or the trim when the body is white (kite) */
const teamInk = (team) => {
  const L = TOY.livery[team] ?? TOY.livery.halcyon;
  return L.body.toLowerCase() === TOY.white ? L.trim : L.body;
};
const teamName = (team) => team.toUpperCase();

// ================================================================ textures (plate, sign and mark from airside.js)
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
const texOnce = (key, make) => {
  if (!TEX.has(key)) TEX.set(key, make());
  return TEX.get(key);
};
/** text on a rounded plate (bg null = transparent); returns {tex, aspect} */
function plate(text, {bg = TOY.blue, fg = '#ffffff', px = 92, h = 150, padX = 0.42, radius = 0.26, weight = 800, italic = false} = {}) {
  const key = ['plate', text, bg, fg, px, h, padX, radius, weight, italic].join('|');
  return texOnce(key, () => {
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
    return {tex, aspect: w / h};
  });
}
/** the reference's app-icon cube */
function drawCube(g, cx, cy, s, color) {
  g.save();
  g.translate(cx, cy);
  g.fillStyle = color;
  const k = s * 0.62;
  const poly = (pts, a) => {
    g.globalAlpha = a;
    g.beginPath();
    pts.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y)));
    g.closePath();
    g.fill();
  };
  poly([[0, -k], [k * 0.87, -k * 0.5], [0, 0], [-k * 0.87, -k * 0.5]], 0.62);
  poly([[-k * 0.87, -k * 0.5], [0, 0], [0, k], [-k * 0.87, k * 0.5]], 1);
  poly([[k * 0.87, -k * 0.5], [0, 0], [0, k], [k * 0.87, k * 0.5]], 0.82);
  g.globalAlpha = 1;
  g.restore();
}
/** the cube mark in a disc */
const markTex = (fg, disc) =>
  texOnce(`mark|${fg}|${disc}`, () =>
    canvasTex(512, 512, (g, w, h) => {
      g.fillStyle = disc;
      g.beginPath();
      g.arc(w / 2, h / 2, w * 0.48, 0, TAU);
      g.fill();
      drawCube(g, w / 2, h / 2, w * 0.3, fg);
    }),
  );
/** the reference's wall sign: a white rounded panel, the cube mark, a name in blue and a line under it */
function signTex(name, sub) {
  return texOnce(['sign', name, sub].join('|'), () => {
    const m = document.createElement('canvas').getContext('2d');
    m.font = FONT(800, 92);
    const w1 = m.measureText(name).width;
    m.font = FONT(600, 42);
    const w = Math.ceil(Math.max(w1, m.measureText(sub).width) + 320);
    const h = 200;
    const tex = canvasTex(w, h, (g) => {
      rr(g, 2, 2, w - 4, h - 4, 30);
      g.fillStyle = '#ffffff';
      g.fill();
      drawCube(g, 96, h / 2, 70, TOY.blue);
      g.fillStyle = TOY.blue;
      g.font = FONT(800, 92);
      g.textBaseline = 'middle';
      g.fillText(name, 180, h / 2 - 22);
      g.fillStyle = TOY.blueLight;
      g.font = FONT(600, 42);
      g.fillText(sub, 184, h / 2 + 50);
    });
    return {tex, aspect: w / h};
  });
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
/** a decal placed in a group: position, turned by ry about y (or laid flat with flat = true) */
function stick(group, tex, aspect, h, x, y, z, ry = 0, flat = false) {
  const m = decal(tex, aspect, h);
  m.position.set(x, y, z);
  if (flat) m.rotation.set(-PI / 2, 0, ry);
  else m.rotation.y = ry;
  group.add(m);
  return m;
}
const SCREEN = new Map();
/** a lit screen: its picture glows a little, and no shadow falls on it */
function screenMat(tex, k = 0.75) {
  const key = `${tex.uuid}|${k}`;
  if (!SCREEN.has(key)) {
    const m = new THREE.MeshStandardMaterial({map: tex, emissive: '#ffffff', emissiveMap: tex, emissiveIntensity: k, roughness: 0.35});
    m.userData.noShadow = true;
    m.userData.noCast = true;
    SCREEN.set(key, m);
  }
  return SCREEN.get(key);
}
const TEAM_ORDER = ['halcyon', 'tidewater', 'vela', 'northwind', 'kite'];
const CODES = {halcyon: 'HAL', tidewater: 'TID', vela: 'VEL', northwind: 'NOR', kite: 'KIT'};
/** the timing tower: ten rows, a position, a team colour chip, a code and a gap */
const timingTex = once(() =>
  canvasTex(512, 256, (g, w, h) => {
    g.fillStyle = CIRCUIT.screen;
    g.fillRect(0, 0, w, h);
    g.fillStyle = TOY.blue;
    g.fillRect(0, 0, w, 30);
    g.fillStyle = '#ffffff';
    g.font = FONT(800, 20);
    g.textBaseline = 'middle';
    g.fillText('LAP 31 / 52', 14, 16);
    g.textAlign = 'right';
    g.fillText('LIVE', w - 14, 16);
    g.textAlign = 'left';
    const order = ['halcyon', 'tidewater', 'halcyon', 'vela', 'tidewater', 'northwind', 'kite', 'vela', 'northwind', 'kite'];
    const rowH = (h - 36) / 10;
    order.forEach((t, i) => {
      const y = 36 + i * rowH;
      if (i % 2) {
        g.fillStyle = 'rgba(255,255,255,0.05)';
        g.fillRect(0, y, w, rowH);
      }
      g.fillStyle = '#ffffff';
      g.font = FONT(700, 15);
      g.fillText(String(i + 1), 12, y + rowH / 2);
      g.fillStyle = TOY.livery[t].body === TOY.white ? TOY.livery[t].trim : TOY.livery[t].body;
      g.fillRect(40, y + 4, 6, rowH - 8);
      g.fillStyle = '#ffffff';
      g.fillText(CODES[t], 56, y + rowH / 2);
      g.fillStyle = TOY.blueLight;
      g.textAlign = 'right';
      g.fillText(i ? `+${(i * 1.734).toFixed(3)}` : 'LEADER', w * 0.62, y + rowH / 2);
      g.fillStyle = i % 3 ? '#8fdcd2' : TOY.yellow;
      g.fillText(`1:${(31 + ((i * 7) % 5) * 0.271).toFixed(3)}`, w - 14, y + rowH / 2);
      g.textAlign = 'left';
    });
  }),
);
/** a small monitor picture: a trace and a few bars */
const monitorTex = (seed = 0) =>
  texOnce(`monitor|${seed}`, () =>
    canvasTex(256, 160, (g, w, h) => {
      g.fillStyle = CIRCUIT.screen;
      g.fillRect(0, 0, w, h);
      g.fillStyle = TOY.blue;
      g.fillRect(0, 0, w, 18);
      g.strokeStyle = seed % 2 ? '#8fdcd2' : TOY.blueLight;
      g.lineWidth = 4;
      g.beginPath();
      for (let x = 0; x <= w; x += 8) {
        const y = h * 0.55 - Math.sin(x * 0.045 + seed) * 26 - Math.sin(x * 0.11 + seed * 2) * 10;
        x ? g.lineTo(x, y) : g.moveTo(x, y);
      }
      g.stroke();
      for (let k = 0; k < 5; k++) {
        g.fillStyle = k === seed % 5 ? TOY.yellow : '#3d4c7a';
        g.fillRect(14 + k * 46, h - 30, 34, 16);
      }
    }),
  );
/** the aero lab's video wall: a car in profile with smoke lines bending over it */
const flowTex = once(() =>
  canvasTex(768, 256, (g, w, h) => {
    g.fillStyle = CIRCUIT.screen;
    g.fillRect(0, 0, w, h);
    const grd = g.createLinearGradient(0, 0, w, 0);
    grd.addColorStop(0, '#3166ea');
    grd.addColorStop(0.5, '#21b3a3');
    grd.addColorStop(1, '#f2b33a');
    g.lineWidth = 4;
    for (let k = 0; k < 11; k++) {
      const y0 = 40 + k * 16;
      g.strokeStyle = grd;
      g.globalAlpha = 0.85;
      g.beginPath();
      for (let x = 0; x <= w; x += 6) {
        const u = (x - w * 0.52) / 150;
        const bump = Math.exp(-u * u) * 40 * Math.exp(-Math.abs(y0 - 180) / 70);
        const wake = x < w * 0.3 ? Math.sin(x * 0.05 + k) * 4 : 0;
        x ? g.lineTo(x, y0 - bump + wake) : g.moveTo(x, y0 - bump);
      }
      g.stroke();
    }
    g.globalAlpha = 1;
    // the car's silhouette, nose to the right
    g.fillStyle = '#e9edf8';
    g.beginPath();
    g.moveTo(w * 0.33, 214);
    g.lineTo(w * 0.33, 168);
    g.lineTo(w * 0.37, 168);
    g.lineTo(w * 0.38, 186);
    g.quadraticCurveTo(w * 0.47, 166, w * 0.53, 176);
    g.quadraticCurveTo(w * 0.62, 186, w * 0.7, 200);
    g.lineTo(w * 0.72, 214);
    g.closePath();
    g.fill();
    g.fillStyle = '#ffffff';
    g.font = FONT(800, 26);
    g.fillText('TUNNEL 1  ·  RUN 214', 18, 28);
    g.fillStyle = '#8fdcd2';
    g.textAlign = 'right';
    g.fillText('CL 3.42   CD 0.86', w - 18, 28);
  }),
);
/** the marshals' flag board: yellow, green, blue, red-and-yellow, white, chequered */
const flagTex = once(() =>
  canvasTex(384, 256, (g, w, h) => {
    rr(g, 0, 0, w, h, 26);
    g.fillStyle = '#ffffff';
    g.fill();
    const cw = 104;
    const ch = 92;
    const cell = (i, draw) => {
      const x = 22 + (i % 3) * (cw + 14);
      const y = 26 + Math.floor(i / 3) * (ch + 22);
      g.save();
      rr(g, x, y, cw, ch, 12);
      g.clip();
      draw(x, y);
      g.restore();
    };
    const fill = (c) => (x, y) => {
      g.fillStyle = c;
      g.fillRect(x, y, cw, ch);
    };
    cell(0, fill(TOY.yellow));
    cell(1, fill('#3fcf7a'));
    cell(2, fill(TOY.blue));
    cell(3, (x, y) => {
      for (let k = 0; k < 6; k++) {
        g.fillStyle = k % 2 ? TOY.red : TOY.yellow;
        g.fillRect(x + (k * cw) / 6, y, cw / 6 + 1, ch);
      }
    });
    cell(4, (x, y) => {
      g.fillStyle = '#e3e8f5';
      g.fillRect(x, y, cw, ch);
      g.fillStyle = '#ffffff';
      g.fillRect(x + 8, y + 8, cw - 16, ch - 16);
    });
    cell(5, (x, y) => {
      for (let a = 0; a < 6; a++)
        for (let b = 0; b < 6; b++) {
          g.fillStyle = (a + b) % 2 ? '#ffffff' : TOY.navy;
          g.fillRect(x + (a * cw) / 6, y + (b * ch) / 6, cw / 6 + 1, ch / 6 + 1);
        }
    });
  }),
);
/** a painted floor arrow pointing -x with a word after it */
function arrowTex(word) {
  return texOnce(`arrow|${word}`, () => {
    const h = 150;
    const m = document.createElement('canvas').getContext('2d');
    m.font = FONT(800, 96);
    const w = Math.ceil(m.measureText(word).width + 260);
    const tex = canvasTex(w, h, (g) => {
      g.fillStyle = TOY.blueLight;
      for (const x0 of [20, 100]) {
        g.beginPath();
        g.moveTo(x0, h / 2);
        g.lineTo(x0 + 60, 18);
        g.lineTo(x0 + 92, 18);
        g.lineTo(x0 + 32, h / 2);
        g.lineTo(x0 + 92, h - 18);
        g.lineTo(x0 + 60, h - 18);
        g.closePath();
        g.fill();
      }
      g.font = FONT(800, 96);
      g.textBaseline = 'middle';
      g.fillText(word, 220, h / 2 + 4);
    });
    return {tex, aspect: w / h};
  });
}
/** the rolling road's belt: dark, a light seam every metre, light edges */
function beltTex() {
  const t = canvasTex(128, 128, (g, w, h) => {
    g.fillStyle = '#2b3248';
    g.fillRect(0, 0, w, h);
    g.fillStyle = '#5a6690';
    g.fillRect(0, 0, 10, h);
    g.fillStyle = '#3a4466';
    g.fillRect(w / 2 - 3, 0, 6, h);
    g.fillStyle = '#c8d0e4';
    g.fillRect(0, 0, w, 7);
    g.fillRect(0, h - 7, w, 7);
  });
  t.wrapS = THREE.RepeatWrapping;
  return t;
}

// ================================================================ geometry
/**
 * a tube along +x whose cross-sections are rounded rectangles in the y-z plane: secs = [{x, cy, w, h, r}], w across z,
 * h along y, r the corner radius (r = w / 2 = h / 2 makes a circle). Linear between sections, smooth normals, the seam
 * on the floor. Seen from outside it is the duct's skin; the same geometry with a BackSide material is its inside.
 */
function ductGeo(secs, K = 7) {
  const ring = (s) => {
    const a = s.w / 2;
    const b = s.h / 2;
    const r = Math.max(0.05, Math.min(s.r, a - 1e-3, b - 1e-3));
    const pts = [[0, -b]];
    for (const [cz, cy, a0] of [
      [a - r, -b + r, -PI / 2],
      [a - r, b - r, 0],
      [-a + r, b - r, PI / 2],
      [-a + r, -b + r, PI],
    ])
      for (let k = 0; k <= K; k++) {
        const t = a0 + (k / K) * (PI / 2);
        pts.push([cz + r * Math.cos(t), cy + r * Math.sin(t)]);
      }
    pts.push([0, -b]);
    return pts;
  };
  const n = 4 * (K + 1) + 2;
  const pos = [];
  const uv = [];
  secs.forEach((s, i) => {
    ring(s).forEach(([z, y], j) => {
      pos.push(s.x, s.cy + y, z);
      uv.push(j / (n - 1), i / (secs.length - 1));
    });
  });
  const idx = [];
  for (let i = 0; i < secs.length - 1; i++)
    for (let j = 0; j < n - 1; j++) {
      const a = i * n + j;
      const b = (i + 1) * n + j;
      idx.push(a, b, a + 1, b, b + 1, a + 1);
    }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
}
/** a closed shape with rounded corners from [x, y] points and radii */
function roundedShape(pts, radii) {
  const s = new THREE.Shape();
  const n = pts.length;
  const P = pts.map(([x, y]) => new THREE.Vector2(x, y));
  for (let i = 0; i < n; i++) {
    const p = P[i];
    const a = P[(i + n - 1) % n];
    const b = P[(i + 1) % n];
    const r = typeof radii === 'number' ? radii : radii[i];
    const da = a.clone().sub(p);
    const db = b.clone().sub(p);
    const k = Math.min(r, da.length() / 2, db.length() / 2);
    const p0 = p.clone().add(da.normalize().multiplyScalar(k));
    const p1 = p.clone().add(db.normalize().multiplyScalar(k));
    if (i === 0) s.moveTo(p0.x, p0.y);
    else s.lineTo(p0.x, p0.y);
    s.quadraticCurveTo(p.x, p.y, p1.x, p1.y);
  }
  s.closePath();
  return s;
}
/** a plan shape [x, z] extruded up from y0 to y1 with soft top and bottom edges */
function plinthGeo(key, pts, radii, y0, y1, bevel = 0.3) {
  return cached(`plinth|${key}`, () => {
    // the shape's y is -z so the extrusion, turned up, keeps the plan the right way round
    const sh = roundedShape(
      pts.map(([x, z]) => [x, -z]),
      radii,
    );
    const g = new THREE.ExtrudeGeometry(sh, {depth: y1 - y0 - 2 * bevel, bevelEnabled: true, bevelSize: bevel, bevelThickness: bevel, bevelSegments: 3, curveSegments: 6});
    g.rotateX(-PI / 2);
    g.translate(0, y0 + bevel, 0);
    return smoothed(g);
  });
}
/** soft shading over a faceted geometry: weld the vertices and average the normals */
function smoothed(geo) {
  const g = geo.clone();
  g.deleteAttribute('normal');
  g.deleteAttribute('uv');
  const w = mergeVertices(g, 1e-4);
  w.computeVertexNormals();
  return w;
}
/** a box whose top is bigger than its bottom on chosen sides (leaning glass): bottom [x0, x1, z0, z1], top [...], h */
function leanBox(b, t, h) {
  const g = new THREE.BoxGeometry(1, 1, 1).toNonIndexed();
  const p = g.attributes.position;
  for (let i = 0; i < p.count; i++) {
    const up = p.getY(i) > 0;
    const R = up ? t : b;
    p.setXYZ(i, p.getX(i) < 0 ? R[0] : R[1], up ? h : 0, p.getZ(i) < 0 ? R[2] : R[3]);
  }
  g.deleteAttribute('normal');
  g.computeVertexNormals();
  return g;
}

// ================================================================================================ the pit building
const PIT = {D: 16, openW: 22, openH: 5.5, f: 0.55, wallTop: 7.3, glassY: 7.95, slab: [8.45, 9.0], rcW: 18, roomW: 24, roomD: 13.2};
const DEFAULT_TEAMS = ['vela', 'northwind', 'halcyon', 'tidewater', 'kite'];
export function buildPitBuilding({teams = DEFAULT_TEAMS, bay = 30} = {}) {
  const M = mats();
  const n = teams.length;
  const Lg = n * bay;
  const L = Lg + PIT.rcW;
  const x0 = -L / 2;
  const xr0 = x0 + Lg;
  const xrc = xr0 + PIT.rcW / 2;
  const mid = (x0 + xr0) / 2;
  const gx = teams.map((_, i) => x0 + bay * (i + 0.5));
  const {D, openW, openH, f} = PIT;
  const frozen = cached(`pit|${teams.join(',')}|${bay}`, () => {
    const K = new Kit();
    // ---- the garage block: the front wall with its openings, ribbed like the reference's warehouse
    const top = PIT.wallTop;
    K.add(M.wall, wallSlab([[x0, 0], [xr0, 0], [xr0, top], [x0, top]], gx.map((x) => [x - openW / 2, 0, x + openW / 2, openH]), 0.5));
    ribs(K, M.wall, new THREE.Matrix4(), x0, xr0, () => top - 0.05, {pitch: 0.8, gaps: gx.map((x) => [x - openW / 2 - f - 0.1, x + openW / 2 + f + 0.1, null])});
    // the fascia over each opening is smooth, the team's board sits on it
    for (const x of gx) K.box(M.white, openW + 2 * f, top - openH - f - 0.05, 0.12, x, (openH + f + top) / 2, 0.02, 0.04);
    // back, end and the upper storey's core behind the glass
    K.box(M.wall, Lg, top + 0.1, 0.5, mid, (top + 0.1) / 2, -D + 0.25, 0.12);
    K.box(M.wall, 0.5, PIT.slab[0], D, x0 + 0.25, PIT.slab[0] / 2, -D / 2, 0.12);
    K.box(M.wall, Lg, PIT.slab[0] - top + 0.1, D - 0.8, mid, (PIT.slab[0] + top) / 2, -D / 2 - 0.4, 0.1);
    // the hospitality storey: a dark glass ribbon with white mullions over a white sill
    K.box(M.glass, Lg - 0.4, PIT.slab[0] - top - 0.1, 0.3, mid, (PIT.slab[0] + top) / 2, -0.55, 0.08);
    for (let x = x0 + 1.5; x < xr0 - 0.5; x += 3) K.box(M.white, 0.16, PIT.slab[0] - top - 0.1, 0.16, x, (PIT.slab[0] + top) / 2, -0.38, 0.05);
    K.box(M.white, Lg + 0.3, 0.26, 1.0, mid, top + 0.03, -0.12, 0.1);
    // the roof slab overhangs the glass; a blue fascia along its front edge
    const [s0, s1] = PIT.slab;
    K.box(M.white, Lg + 0.5, s1 - s0, D + 1.1, mid - 0.25, (s0 + s1) / 2, -D / 2 + 0.55, 0.2);
    K.box(M.blue, Lg + 0.56, 0.3, 0.2, mid - 0.25, (s0 + s1) / 2, 1.12, 0.08);
    // the roof: a blue ribbed field over the back, the terrace deck along the front behind a glass balustrade
    const zt = -4.4;
    K.box(M.roof, Lg - 0.5, 0.1, D + zt - 0.3, mid, s1 + 0.04, (zt - D) / 2 - 0.05, 0.04);
    for (let x = x0 + 0.9; x < xr0 - 0.6; x += 0.92) K.flat(M.roof, 0.18, 0.08, D + zt - 0.6, x, s1 + 0.12, (zt - D) / 2 - 0.05);
    K.box(M.panel, Lg - 0.5, 0.08, -zt + 0.6, mid, s1 + 0.03, zt / 2 + 0.3, 0.03);
    K.box(M.white, Lg - 0.5, 0.32, 0.3, mid, s1 + 0.15, zt, 0.1);
    for (let x = x0 + 0.5; x <= xr0 - 0.4; x += 3) K.box(M.white, 0.12, 0.92, 0.12, x, s1 + 0.46, 0.75, 0.04);
    K.add(M.rail, cached(`rail|${Lg}`, () => new THREE.BoxGeometry(Lg - 1, 0.78, 0.04)), mat4(mid, s1 + 0.44, 0.75));
    K.box(M.white, Lg - 0.9, 0.12, 0.18, mid, s1 + 0.92, 0.75, 0.05);
    for (const z of [zt + 0.5, -1.6]) K.box(M.white, 0.12, 0.92, 0.12, x0 + 0.5, s1 + 0.46, z, 0.04);
    K.box(M.white, 0.18, 0.12, -zt + 0.4, x0 + 0.5, s1 + 0.92, zt / 2 + 0.35, 0.05);
    K.add(M.rail, cached(`railEnd`, () => new THREE.BoxGeometry(0.04, 0.78, -zt + 0.2)), mat4(x0 + 0.5, s1 + 0.44, zt / 2 + 0.35));
    // planters along the terrace, low hedges in them
    for (let x = x0 + 8; x < xr0 - 4; x += 15) {
      K.box(M.white, 3.2, 0.42, 0.9, x, s1 + 0.21, zt + 0.95, 0.14);
      K.add(M.greenDeep, cached('hedge', () => new THREE.SphereGeometry(1, 24, 10, 0, TAU, 0, PI / 2).scale(1.45, 0.42, 0.36)), mat4(x, s1 + 0.4, zt + 0.95));
    }
    // plant units on the blue field
    for (let x = x0 + 18; x < xr0 - 10; x += 30) {
      K.box(M.white, 3.6, 0.6, 2.4, x, s1 + 0.38, -11.8, 0.2);
      for (const dx of [-0.9, 0.9]) K.cyl(M.navy, 0.62, 0.62, 0.06, x + dx, s1 + 0.7, -11.8, 'y', 0.02, 24);
    }
    // corner trims
    K.box(M.blue, 0.7, s0 + 0.05, 0.7, x0, (s0 + 0.05) / 2, 0, 0.22);
    K.box(M.blue, 0.7, s0 + 0.05, 0.7, x0, (s0 + 0.05) / 2, -D, 0.22);
    // ---- the garages
    gx.forEach((cx, i) => garage(K, cx, teams[i]));
    // ---- race control: a white block, a glass control room leaning out over the front and the +x end
    const rw = PIT.rcW;
    K.box(M.white, rw, 6.7, D, xrc, 3.35, -D / 2, 0.35);
    K.box(M.blue, rw + 0.3, 0.4, D + 0.3, xrc, 6.7, -D / 2, 0.14);
    K.box(M.glass, 7.2, 3.2, 0.2, xrc - 3.2, 1.6, 0.02, 0.08);
    for (let x = xrc - 6.4; x <= xrc + 0.1; x += 2.4) K.box(M.white, 0.14, 3.2, 0.14, x, 1.6, 0.12, 0.04);
    K.box(M.blue, 8.6, 0.3, 2.4, xrc - 3.2, 3.5, 1.05, 0.12);
    for (const s of [-1, 1]) K.box(M.white, 0.2, 3.35, 0.2, xrc - 3.2 + s * 4.0, 1.68, 2.05, 0.06);
    // a window band on the +x end
    K.box(M.glass, 0.2, 1.5, D - 4, xr0 + rw + 0.02, 4.4, -D / 2, 0.08);
    const rcBot = [xr0 + 0.4, xr0 + rw - 0.2, -D + 0.3, -0.3];
    const rcTop = [xr0 + 0.4, xr0 + rw + 0.6, -D + 0.3, 0.6];
    K.add(M.glass, leanBox(rcBot, rcTop, 2.7), mat4(0, 6.9, 0));
    for (let x = xr0 + 1.5; x < xr0 + rw; x += 2.6) bar(K, M.white, V(x, 6.9, -0.22), V(x, 9.6, 0.68), 0.16, 0.05);
    for (let z = -2.4; z > -D + 1; z -= 2.6) bar(K, M.white, V(xr0 + rw - 0.12, 6.9, z), V(xr0 + rw + 0.68, 9.6, z), 0.16, 0.05);
    bar(K, M.white, V(xr0 + rw - 0.12, 6.9, -0.22), V(xr0 + rw + 0.68, 9.6, 0.68), 0.2, 0.06);
    K.box(M.blue, rw + 1.6, 0.42, D + 1.4, xrc + 0.3, 9.76, -D / 2 + 0.3, 0.16);
    K.box(M.white, rw + 1.0, 0.12, D + 0.8, xrc + 0.3, 10.0 - 0.06, -D / 2 + 0.3, 0.04);
    return K.freeze();
  });
  const group = thaw(frozen);
  group.name = 'pit-building';
  // team boards over the openings
  gx.forEach((cx, i) => {
    const t = teams[i];
    const Lv = TOY.livery[t] ?? TOY.livery.halcyon;
    const p = plate(teamName(t), {bg: null, fg: Lv.trim, px: 104, h: 150, padX: 0.1, italic: true});
    stick(group, p.tex, p.aspect, 0.72, cx, 6.68, 0.315);
  });
  // race control's name on its front and its +x end, the mark on its roof
  const rc = plate('RACE CONTROL', {bg: TOY.white, fg: TOY.blue, px: 96, h: 150, padX: 0.3});
  stick(group, rc.tex, rc.aspect, 1.0, xrc + 3.6, 5.2, 0.03);
  stick(group, rc.tex, rc.aspect, 1.0, xr0 + PIT.rcW + 0.03, 5.6, -D / 2, PI / 2);
  stick(group, markTex(TOY.blue, '#ffffff'), 1, 9.0, xrc + 0.3, 10.005, -D / 2 + 0.3, 0, true);
  return {
    group,
    garages: gx.map((x, i) => ({team: teams[i], centre: V(x, 0, 0)})),
    length: L,
    raceControl: V(xrc, 0, -D / 2),
  };
}
/** one garage: its portal, its board and what the camera sees inside (the front ~6 m: deeper is hidden by the lintel) */
function garage(K, cx, team) {
  const M = mats();
  const {openW, openH, f, roomW, roomD} = PIT;
  const Lv = TOY.livery[team] ?? TOY.livery.halcyon;
  const ink = teamInk(team);
  // the portal: thick blue posts and lintel
  for (const s of [-1, 1]) K.box(M.blue, f, openH + f, 0.75, cx + s * (openW / 2 + f / 2 - 0.04), (openH + f) / 2, 0.08, 0.2);
  K.box(M.blue, openW + 2 * f - 0.08, f, 0.75, cx, openH + f / 2, 0.08, 0.2);
  // the team board: the body colour, an accent line along its foot
  K.box(paint(Lv.body), 11.2, 0.95, 0.3, cx, 6.62, 0.16, 0.14);
  K.box(paint(Lv.accent), 10.9, 0.1, 0.06, cx, 6.22, 0.32, 0.03);
  // the room, lit, seen from inside
  K.add(M.room, cached(`room`, () => new THREE.BoxGeometry(roomW, 6.2, roomD)), mat4(cx, 3.09, -0.45 - roomD / 2));
  K.patch(lit(CIRCUIT.epoxy, {rough: 0.4, sheen: true}), roomW - 0.1, roomD - 0.1, cx, 0.012, -0.5 - roomD / 2);
  K.patch(lit(ink, {offset: 2}), openW - 1, 0.32, cx, 0.02, -1.0);
  K.patch(lit(TOY.white, {offset: 2}), 0.16, 5.4, cx - 3.1, 0.02, -4.0);
  K.patch(lit(TOY.white, {offset: 2}), 0.16, 5.4, cx + 3.1, 0.02, -4.0);
  const white = lit(TOY.white, {sheen: true, rough: 0.5});
  const steel = lit(CIRCUIT.steel, {rough: 0.45});
  const navy = lit(TOY.navy, {rough: 0.7});
  // tool chests along the -x wall, their drawers facing +x
  for (const z of [-1.3, -2.75, -4.2]) {
    const x = cx - roomW / 2 + 0.55;
    K.box(lit(ink, {sheen: true, rough: 0.45}), 0.8, 1.0, 1.3, x, 0.62, z, 0.12);
    K.box(white, 0.86, 0.08, 1.36, x, 1.14, z, 0.03);
    for (let k = 0; k < 4; k++) K.flat(lit(TOY.white), 0.02, 0.05, 1.08, x + 0.41, 0.35 + k * 0.2, z);
    for (const dz of [-0.5, 0.5]) K.cyl(navy, 0.07, 0.07, 0.08, x, 0.07, z + dz, 'x', 0.02, 12);
  }
  // the engineers' desk and the timing screen behind it, facing the opening
  const ex = cx - 6.4;
  K.box(white, 4.6, 0.12, 1.0, ex, 0.98, -2.55, 0.04);
  for (const s of [-1, 1]) K.box(white, 0.12, 0.92, 0.9, ex + s * 2.2, 0.48, -2.55, 0.04);
  [-1.45, 0, 1.45].forEach((dx, k) => {
    K.box(navy, 1.1, 0.68, 0.08, ex + dx, 1.48, -2.75, 0.03);
    K.pic(screenMat(monitorTex(k)), 1.0, 0.6, ex + dx, 1.48, -2.705);
    K.box(steel, 0.08, 0.2, 0.08, ex + dx, 1.1, -2.78, 0.02);
  });
  for (const dx of [-1.4, 0, 1.4]) {
    K.cyl(navy, 0.26, 0.26, 0.12, ex + dx, 0.72, -1.75, 'y', 0.04, 16);
    K.cyl(steel, 0.05, 0.05, 0.62, ex + dx, 0.35, -1.75, 'y', 0.02, 8);
  }
  for (const s of [-1, 1]) K.box(steel, 0.1, 2.3, 0.1, ex + s * 1.6, 1.15, -3.5, 0.03);
  K.box(navy, 3.6, 1.2, 0.12, ex, 1.85, -3.46, 0.05);
  K.pic(screenMat(timingTex(), 0.8), 3.45, 1.08, ex, 1.85, -3.395);
  // tyres in blankets: a two-level rack of six standing wheels, and a stack of four lying flat
  const rx = cx + 5.6;
  const rz = -2.2;
  K.box(steel, 4.7, 0.16, 0.95, rx, 0.3, rz, 0.05);
  K.box(steel, 4.7, 0.1, 0.95, rx, 1.78, rz, 0.04);
  for (const s of [-1, 1]) K.box(white, 0.14, 3.2, 0.95, rx + s * 2.35, 1.6, rz, 0.05);
  K.box(white, 4.84, 0.14, 0.2, rx, 3.2, rz, 0.05);
  for (const s of [-1, 1]) for (const e of [-1, 1]) K.cyl(navy, 0.09, 0.09, 0.08, rx + s * 2.1, 0.1, rz + e * 0.35, 'z', 0.02, 12);
  for (const y of [1.04, 2.5]) for (const dx of [-1.45, 0, 1.45]) blanketWheel(K, rx + dx, y, rz, 'z', y > 2 ? TOY.medium : TOY.soft);
  for (let k = 0; k < 4; k++) blanketWheel(K, cx + 9.4, 0.33 + k * 0.62, -1.15, 'y', TOY.hard);
}
/** a wheel in a blue tyre blanket: the blanket, the rim showing in the middle, a band in the compound colour */
function blanketWheel(K, x, y, z, axis, band) {
  const blanket = lit(TOY.blue, {sheen: true, rough: 0.55});
  const navy = lit(TOY.navy, {rough: 0.7});
  const hub = lit('#c9cfdf', {rough: 0.42});
  K.cyl(blanket, 0.66, 0.66, 0.6, x, y, z, axis, 0.2, 28);
  K.cyl(navy, 0.36, 0.36, 0.64, x, y, z, axis, 0.05, 20);
  K.cyl(hub, 0.17, 0.17, 0.68, x, y, z, axis, 0.04, 14);
  const ring = cached('blanketBand', () => new THREE.TorusGeometry(0.5, 0.045, 8, 36));
  const m = lit(band, {rough: 0.5});
  for (const s of [-1, 1]) {
    if (axis === 'z') K.add(m, ring, mat4(x, y, z + s * 0.3));
    else K.add(m, ring, mat4(x, y + s * 0.3, z, PI / 2, 0, 0));
  }
}

// ================================================================================================ the pit wall
export function buildPitWall({length = 200} = {}) {
  const M = mats();
  const H = 1.2;
  const T = 0.8;
  const n = Math.max(1, Math.round(length / 4));
  const step = length / n;
  const frozen = cached(`pitwall|${length}`, () => {
    const K = new Kit();
    K.box(M.white, length, H - 0.16, T, 0, (H - 0.16) / 2, 0, 0.14);
    K.box(M.blue, length + 0.06, 0.22, T + 0.08, 0, H - 0.11, 0, 0.08);
    for (const s of [-1, 1]) K.box(M.blueLight, length, 0.14, 0.06, 0, 0.14, s * (T / 2 + 0.02), 0.03);
    // the catch fence on the track side (-z): posts every 4 m leaning their tops out over the track, see-through panels
    const zf = -T / 2 + 0.14;
    const H1 = H + 2.2;
    for (let k = 0; k <= n; k++) {
      const x = -length / 2 + k * step;
      K.box(M.post, 0.14, H1 - H + 0.1, 0.14, x, (H + H1) / 2, zf, 0.04);
      bar(K, M.post, V(x, H1 - 0.05, zf), V(x, H1 + 0.55, zf - 0.55), 0.12, 0.04);
    }
    K.box(M.post, length, 0.1, 0.1, 0, H1, zf, 0.03);
    K.box(M.post, length, 0.1, 0.1, 0, H1 + 0.55, zf - 0.55, 0.03);
    K.box(M.post, length, 0.08, 0.08, 0, H + 0.12, zf, 0.02);
    K.add(M.pane, cached(`fence|${length}`, () => new THREE.BoxGeometry(length, H1 - H - 0.2, 0.03)), mat4(0, (H + H1) / 2, zf));
    K.add(M.pane, cached(`fenceTop|${length}`, () => new THREE.BoxGeometry(length, 0.74, 0.03)), mat4(0, H1 + 0.27, zf - 0.27, PI / 4, 0, 0));
    return K.freeze();
  });
  const group = thaw(frozen);
  group.name = 'pit-wall';
  return {group};
}

// ================================================================================================ the pit wall stand
export function buildPitWallStand({team = 'halcyon'} = {}) {
  const M = mats();
  const Lv = TOY.livery[team] ?? TOY.livery.halcyon;
  const ink = teamInk(team);
  const L = 8;
  const frozen = cached(`stand|${team}`, () => {
    const K = new Kit();
    // the deck on the pit-lane side (-z), on short legs, a step at the +x end
    K.box(M.panel, L, 0.24, 1.5, 0, 0.82, -1.15, 0.1);
    for (const x of [-3.7, 0, 3.7]) K.box(M.steel, 0.2, 0.7, 0.2, x, 0.35, -1.65, 0.06);
    K.box(M.panel, 1.0, 0.2, 0.9, L / 2 + 0.4, 0.42, -1.2, 0.08);
    // the desk on top of the wall, its monitors in a row facing the track (+z), screens on both faces
    K.box(M.white, L, 0.14, 0.85, 0, 1.95, -0.22, 0.05);
    for (const x of [-3.6, 0, 3.6]) K.box(M.white, 0.16, 0.72, 0.9, x, 1.56, -0.25, 0.05);
    for (let k = 0; k < 6; k++) {
      const x = -3.1 + k * 1.24;
      K.box(M.navy, 1.1, 0.72, 0.1, x, 2.5, 0.04, 0.04);
      K.pic(screenMat(monitorTex(k)), 1.0, 0.62, x, 2.5, 0.095);
      K.pic(screenMat(monitorTex(k + 1)), 1.0, 0.62, x, 2.5, -0.015, PI);
      K.box(M.steel, 0.1, 0.3, 0.1, x, 2.1, 0.04, 0.03);
    }
    // the strategists' high bench: stools in the team colour
    for (let k = 0; k < 6; k++) {
      const x = -3.1 + k * 1.24;
      K.cyl(paint(ink), 0.27, 0.27, 0.14, x, 1.72, -1.05, 'y', 0.05, 20);
      K.cyl(M.steel, 0.06, 0.06, 0.8, x, 1.3, -1.05, 'y', 0.02, 10);
    }
    K.box(M.steel, L - 0.4, 0.08, 0.08, 0, 1.25, -0.7, 0.03);
    // the canopy: posts at the back, a slab in the team colour, a white edge
    for (const x of [-3.7, 3.7]) K.box(M.white, 0.2, 3.0, 0.2, x, 2.4, -1.75, 0.06);
    K.box(paint(ink), L + 0.6, 0.3, 2.3, 0, 3.92, -0.8, 0.12);
    K.box(M.white, L + 0.66, 0.1, 2.36, 0, 3.74, -0.8, 0.04);
    K.box(paint(Lv.accent), L + 0.64, 0.08, 0.06, 0, 3.86, 0.37, 0.03);
    return K.freeze();
  });
  const group = thaw(frozen);
  group.name = 'pit-wall-stand';
  const p = plate(teamName(team), {bg: null, fg: ink === Lv.trim ? TOY.white : Lv.trim, px: 104, h: 150, padX: 0.1, italic: true});
  stick(group, p.tex, p.aspect, 0.22, 0, 3.92, 0.36);
  stick(group, p.tex, p.aspect, 0.22, 0, 3.92, -1.96, PI);
  stick(group, p.tex, p.aspect, 1.05, 0, 4.075, -0.8, 0, true);
  return {group, anchor: V(0, 5.2, -0.8)};
}

// ================================================================================================ the grandstand
export function buildGrandstand({length = 80, rows = 8} = {}) {
  const M = mats();
  const front = 1.3;
  const rise = 0.5;
  const depth = 0.9;
  const yRow = (k) => front + k * rise;
  const zRow = (k) => -0.4 - (k + 0.5) * depth;
  const zb = -0.4 - rows * depth;
  const top = Math.min(5.9, yRow(rows - 1) + 1.1);
  const aisles = [];
  const na = Math.max(1, Math.round(length / 20));
  for (let k = 1; k < na; k++) aisles.push(-length / 2 + (k * length) / na);
  const frozen = cached(`stand|${length}|${rows}`, () => {
    const K = new Kit();
    K.box(M.white, length, front + 0.2, 0.5, 0, (front + 0.2) / 2, -0.15, 0.15);
    K.box(M.blue, length + 0.1, 0.18, 0.6, 0, front + 0.2, -0.15, 0.06);
    for (let k = 0; k < rows; k++) K.box(M.panel, length, yRow(k), depth + 0.02, 0, yRow(k) / 2, zRow(k), 0.06);
    // the back wall, a blue band along its inside
    K.box(M.white, length + 1.0, top, 0.5, 0, top / 2, zb - 0.25, 0.15);
    K.box(M.blue, length, 0.45, 0.06, 0, top - 0.5, zb + 0.02, 0.02);
    // end walls on the stepped profile, a blue coping on the slope
    const prof = [[-0.1, 0], [-zb + 0.5, 0], [-zb + 0.5, top], [-0.1, front + 0.35]];
    for (const X of [length / 2 + 0.5, -length / 2]) {
      K.add(M.white, wallSlab(prof, [], 0.5), mat4(X, 0, 0, 0, PI / 2, 0));
      bar(K, M.blue, V(X - 0.25, front + 0.35, 0.1), V(X - 0.25, top, zb - 0.5), 0.62, 0.12);
    }
    // aisles: white steps
    for (const xa of aisles)
      for (let k = 0; k < rows; k++) {
        K.box(M.white, 1.3, 0.1, depth, xa, yRow(k) + 0.05, zRow(k), 0.03);
        K.box(M.white, 1.3, 0.1, depth / 2, xa, yRow(k) + rise / 2 + 0.05, zRow(k) - depth / 4, 0.03);
      }
    return K.freeze();
  });
  const group = thaw(frozen);
  group.name = 'grandstand';
  // the seats, instanced
  const seat = cached('seat', () => {
    const a = clean(rbox(0.46, 0.14, 0.42, 0.06)).translate(0, 0.42, 0.02);
    const b = clean(rbox(0.46, 0.46, 0.1, 0.05)).translate(0, 0.66, -0.2);
    const c = clean(rbox(0.12, 0.36, 0.12, 0.04)).translate(0, 0.18, 0);
    return mergeGeometries([a, b, c], false);
  });
  const list = [];
  for (let k = 0; k < rows; k++)
    for (let x = -length / 2 + 0.55; x <= length / 2 - 0.5; x += 0.56) {
      if (aisles.some((a) => Math.abs(x - a) < 0.95)) continue;
      list.push(mat4(x, yRow(k), zRow(k) + 0.1));
    }
  const im = new THREE.InstancedMesh(seat, paint(TOY.blue, 0.46), list.length);
  list.forEach((m, i) => im.setMatrixAt(i, m));
  im.castShadow = im.receiveShadow = true;
  im.computeBoundingSphere();
  group.add(im);
  return {group};
}

// ================================================================================================ the start gantry
export function buildStartGantry({span = 18} = {}) {
  const M = mats();
  const Y = 6.5;
  const frozen = cached(`gantry|${span}`, () => {
    const K = new Kit();
    for (const s of [-1, 1]) {
      const x = s * (span / 2 + 0.6);
      K.box(M.blue, 1.6, 0.5, 1.6, x, 0.25, 0, 0.2);
      K.box(M.white, 0.9, Y + 0.5, 0.9, x, (Y + 0.5) / 2 + 0.3, 0, 0.26);
      K.box(M.blue, 0.96, 0.4, 0.96, x, 2.2, 0, 0.14);
    }
    K.box(M.white, span + 2.6, 1.1, 1.1, 0, Y, 0, 0.32);
    for (const s of [-1, 1]) K.box(M.blue, span + 2.2, 0.28, 0.06, 0, Y + 0.22, s * 0.56, 0.03);
    // the five pods hang under the beam
    for (let i = 0; i < 5; i++) {
      const x = (i - 2) * 1.3;
      K.box(M.navy, 0.95, 1.55, 0.62, x, Y - 0.55 - 0.78, 0, 0.2);
      K.box(M.steel, 0.2, 0.3, 0.2, x, Y - 0.6, 0, 0.05);
    }
    return K.freeze();
  });
  const group = thaw(frozen);
  group.name = 'start-gantry';
  const lampGeo = cached('lamps', () => {
    const list = [];
    for (const s of [-1, 1]) for (const dy of [-0.36, 0.36]) list.push(clean(rcyl(0.26, 0.26, 0.1, 0.03, 24)).applyMatrix4(mat4(0, dy, s * 0.31, PI / 2, 0, 0)));
    return mergeGeometries(list, false);
  });
  const LAMP = once(() => ({
    off: toyMat('#2a3352', {rough: 0.3}),
    red: new THREE.MeshStandardMaterial({color: TOY.red, emissive: TOY.red, emissiveIntensity: 1.8, roughness: 0.3}),
    green: new THREE.MeshStandardMaterial({color: '#3fd67a', emissive: '#3fd67a', emissiveIntensity: 1.6, roughness: 0.3}),
  }))();
  const pods = [];
  for (let i = 0; i < 5; i++) {
    const m = new THREE.Mesh(lampGeo, LAMP.off);
    m.position.set((i - 2) * 1.3, Y - 0.55 - 0.78, 0);
    group.add(m);
    pods.push(m);
  }
  const p = plate('START', {bg: TOY.blue, fg: '#ffffff', px: 100, h: 150, padX: 0.3});
  for (const s of [-1, 1]) stick(group, p.tex, p.aspect, 0.56, s * (span / 2 - 1.4), Y - 0.14, s * 0.6, s > 0 ? 0 : PI);
  const setLights = (n) => {
    pods.forEach((m, i) => (m.material = n === -1 ? LAMP.green : i < n ? LAMP.red : LAMP.off));
  };
  setLights(0);
  return {group, setLights};
}

// ================================================================================================ the aero lab
const LAB = {W: 70, D: 30, H: 8, low: 2.4, t: 0.5, zT: 4, xT: 6, belt: 0.8, tsW: 5, tsH: 2.6, yR: 3.6, rR: 3.1, zB: -8.5, xC: 19.5, cS: 8, cH: 7.6};
export function buildAeroLab() {
  const M = mats();
  const {W, D, H, low, t, zT, xT, belt, tsW, tsH, yR, rR, zB, xC, cS, cH} = LAB;
  const frozen = cached('aerolab', () => {
    const K = new Kit();
    // ---- the hall: floor, the tall back and -x walls, the cut-down camera-side walls, blue caps on every cut
    K.patch(M.floor, W - 0.6, D - 0.6, 0, 0.012, 0);
    const walls = [
      // [cx, cz, length, ry (0: runs along x), height, outside normal]
      {cx: 0, cz: -D / 2, len: W, ry: 0, h: H, out: -1},
      {cx: -W / 2, cz: 0, len: D - 2 * t, ry: PI / 2, h: H, out: -1},
      {cx: 0, cz: D / 2, len: W, ry: 0, h: low, out: 1},
      {cx: W / 2, cz: 0, len: D - 2 * t, ry: PI / 2, h: low, out: 1},
    ];
    for (const w of walls) {
      const along = w.ry === 0;
      const at = (x, z) => (along ? [w.cx + x, w.cz + z] : [w.cx + z, w.cz + x]);
      const box = (mat, l, h, d, u, y, n, r) => {
        const [x, z] = at(u, n);
        K.box(mat, along ? l : d, h, along ? d : l, x, y, z, r);
      };
      const o = w.out;
      box(M.wall, w.len, w.h, t * 0.6, 0, w.h / 2, o * t * 0.2, 0.08);
      box(M.wallIn, w.len - 0.1, w.h - 0.05, t * 0.45, 0, w.h / 2 - 0.02, -o * t * 0.25, 0.06);
      box(M.blue, w.len + 0.06, 0.28, t + 0.22, 0, w.h + 0.12, 0, 0.11);
      box(M.blueLight, w.len - 0.1, 0.3, 0.08, 0, 0.17, o * (t / 2 + 0.03), 0.03);
      // ribs on the outer face (the low walls face the camera)
      const [fx, fz] = at(0, o * t * 0.5);
      const frame = mat4(fx, 0, fz, 0, w.ry + (o < 0 ? PI : 0), 0);
      ribs(K, M.wall, frame, -w.len / 2, w.len / 2, () => w.h - 0.02, {pitch: 0.8, y0: 0.36});
      // tall walls: blue pilasters on the inner face every 10 m
      if (w.h > low)
        for (let u = -w.len / 2 + 10; u < w.len / 2 - 1; u += 10) box(M.blue, 0.6, w.h - 0.1, 0.35, u, (w.h - 0.1) / 2, -o * (t / 2 + 0.15), 0.14);
    }
    // corner posts: tall where a tall wall ends, low on the front corner
    for (const [x, z, h] of [
      [-W / 2, -D / 2, H],
      [W / 2, -D / 2, H],
      [-W / 2, D / 2, H],
      [W / 2, D / 2, low],
    ])
      K.box(M.blue, 0.9, h + 0.45, 0.9, x, (h + 0.45) / 2, z, 0.26);
    // ---- the tunnel: the test section's plinth and frame, glass sides and roof
    const yTop = belt + tsH;
    K.box(M.paintWhite, 2 * xT + 0.4, belt, tsW + 1.4, 0, belt / 2, zT, 0.16);
    K.box(lit(CIRCUIT.steel, {rough: 0.5}), 2 * xT, 0.03, tsW - 0.1, 0, belt + 0.005, zT, 0.01);
    for (const s of [-1, 1]) {
      K.box(M.blue, 10.6, 0.08, 0.16, 0, belt + 0.04, zT + s * 1.88, 0.03);
      // the glass walls, a white sill under them and an edge beam over them
      K.add(M.tunnel, cached('tsSide', () => new THREE.BoxGeometry(2 * xT, tsH, 0.05)), mat4(0, belt + tsH / 2, zT + s * (tsW / 2 + 0.03)));
      K.box(M.paintWhite, 2 * xT, 0.16, 0.32, 0, belt + 0.08, zT + s * (tsW / 2 + 0.08), 0.06);
      K.box(M.paintWhite, 2 * xT, 0.2, 0.3, 0, yTop + 0.06, zT + s * (tsW / 2 + 0.08), 0.08);
    }
    K.add(M.tunnelTop, cached('tsTop', () => new THREE.BoxGeometry(2 * xT, 0.05, tsW + 0.1)), mat4(0, yTop + 0.03, zT));
    // the end frames: blue rings where the cone and the diffuser join
    for (const s of [-1, 1]) {
      const x = s * xT;
      K.box(M.paintBlue, 0.5, 0.36, tsW + 0.9, x, yTop + 0.12, zT, 0.12);
      for (const e of [-1, 1]) K.box(M.paintBlue, 0.5, tsH + 0.5, 0.36, x, belt + tsH / 2, zT + e * (tsW / 2 + 0.2), 0.12);
    }
    // the overhead strut's housing on the roof (the strut itself is its own mesh)
    K.box(M.paintBlue, 1.6, 0.5, 1.1, -0.4, yTop + 0.3, zT, 0.18);
    K.box(M.paintWhite, 2.6, 0.24, 1.8, -0.4, yTop + 0.1, zT, 0.08);
    // the contraction: the floor stays flat, the walls and the roof open out into the settling chamber
    const xs = [];
    const sm5 = (u) => u * u * u * (u * (u * 6 - 15) + 10);
    const cone = [];
    for (let k = 0; k <= 16; k++) {
      const u = k / 16;
      const e = sm5(u);
      const h = tsH + (6.0 - tsH) * e;
      cone.push({x: xT + 6.2 * u, cy: belt + h / 2, w: tsW + 4.2 * e, h, r: 0.5 + 0.9 * e});
    }
    const settle = {x: xC - cS / 2 + 0.1, cy: belt + 3.0, w: tsW + 4.2, h: 6.0, r: 1.4};
    cone.push(settle);
    const coneGeo = ductGeo(cone);
    K.add(M.paintWhite, coneGeo);
    K.add(M.ductIn, coneGeo);
    for (const x of [xT + 9.05]) {
      const bandGeo = cached(`band|${x}`, () => ductGeo([{...settle, x, w: settle.w + 0.24, h: settle.h + 0.24, cy: settle.cy}, {...settle, x: x + 0.5, w: settle.w + 0.24, h: settle.h + 0.24, cy: settle.cy}]));
      K.add(M.paintBlue, bandGeo);
    }
    const foot = cone.map((s) => [s.x, zT + s.w / 2 + 0.2]).concat(cone.map((s) => [s.x, zT - s.w / 2 - 0.2]).reverse());
    K.add(M.paintWhite, plinthGeo('coneFoot', foot, 0.3, 0, belt + 0.01, 0.12));
    // the diffuser: out of the test section, opening into the round return duct
    const diff = [];
    for (let k = 0; k <= 8; k++) {
      const u = k / 8;
      diff.push({x: -xT - (xC - cS / 2 + 0.2 - xT) * u, cy: lerp(belt + tsH / 2, yR, u), w: lerp(tsW, 2 * rR, u), h: lerp(tsH, 2 * rR, u), r: lerp(0.5, rR, u * u)});
    }
    const diffGeo = ductGeo(diff.reverse());
    K.add(M.paintWhite, diffGeo);
    K.add(M.ductIn, diffGeo);
    // the corners: chunky blocks with a mitred outer corner, blue bands where the ducts go in
    const corner = (cx, cz, sx, sz, w = cS, d = cS) => {
      const c = 3.2;
      const bv = 0.4;
      const hw = w / 2 - bv;
      const hd = d / 2 - bv;
      const pts = [[-hw, -hd], [hw, -hd], [hw, hd], [-hw, hd]];
      // cut the outer corner (the one toward sx, sz) at 45 degrees: a mitred corner like a real tunnel's
      const out = [];
      pts.forEach(([x, z], i) => {
        if (Math.sign(x) !== sx || Math.sign(z) !== sz) return out.push([x, z]);
        const [ax, az] = pts[(i + 3) % 4];
        const [bx, bz] = pts[(i + 1) % 4];
        const ka = c / Math.hypot(ax - x, az - z);
        const kb = c / Math.hypot(bx - x, bz - z);
        out.push([x + (ax - x) * ka, z + (az - z) * ka], [x + (bx - x) * kb, z + (bz - z) * kb]);
      });
      const g = plinthGeo(`corner|${w}|${d}|${sx}|${sz}`, out, 1.0, 0, cH, bv);
      K.add(M.paintWhite, g, mat4(cx, 0, cz));
      // a blue band round the block's middle
      K.add(M.paintBlue, plinthGeo(`cband|${w}|${d}|${sx}|${sz}`, out.map(([x, z]) => [x * 1.012 + Math.sign(x) * 0.33, z * 1.012 + Math.sign(z) * 0.33]), 1.0, cH - 1.05, cH - 0.55, 0.12), mat4(cx, 0, cz));
    };
    corner(-xC, zT, -1, 1);
    corner(-xC, zB, -1, -1);
    corner(xC, zB, 1, -1);
    corner(xC, zT, 1, 1, cS, 10.4);
    // the return circuit: round ducts on saddles, the fan in its housing on the back leg
    const xF0 = -7.5;
    const xF1 = 0.5;
    const round = (x, r = rR) => ({x, cy: yR, w: 2 * r, h: 2 * r, r});
    const back1 = ductGeo([round(-xC + cS / 2 - 0.2), round(xF0), round(xF0 + 1.6, 3.65)]);
    const back2 = ductGeo([round(xF1 - 1.6, 3.65), round(xF1), round(xC - cS / 2 + 0.2)]);
    for (const g of [back1, back2]) {
      K.add(M.paintWhite, g, mat4(0, 0, zB));
      K.add(M.ductIn, g, mat4(0, 0, zB));
    }
    const legL = ductGeo([round(zB + cS / 2 - 0.2), round(zT - cS / 2 + 0.2)]);
    const legR = ductGeo([round(zB + cS / 2 - 0.2), round(zT - 5.2 + 0.2)]);
    K.add(M.paintWhite, legL, mat4(-xC, 0, 0, 0, -PI / 2, 0));
    K.add(M.paintWhite, legR, mat4(xC, 0, 0, 0, -PI / 2, 0));
    // flanges: blue rings at the joints
    const ring = cached('flange', () => new THREE.TorusGeometry(rR + 0.04, 0.2, 12, 64));
    for (const x of [-xC + cS / 2 + 0.3, -11.5, 6.5, xC - cS / 2 - 0.3]) K.add(M.paintBlue, ring, mat4(x, yR, zB, 0, PI / 2, 0));
    for (const [x, z] of [
      [-xC, zB + cS / 2 + 0.3],
      [-xC, zT - cS / 2 - 0.3],
      [xC, zB + cS / 2 + 0.3],
      [xC, zT - 5.2 - 0.3],
    ])
      K.add(M.paintBlue, ring, mat4(x, yR, z));
    K.add(M.paintBlue, cached('flangeD', () => new THREE.TorusGeometry(rR + 0.04, 0.2, 12, 64)), mat4(-xC + cS / 2 + 0.3, yR, zT, 0, PI / 2, 0));
    // saddles under the round ducts
    const saddle = (x, z, alongX) => {
      K.box(M.paintBlue, alongX ? 0.9 : 4.6, 0.36, alongX ? 4.6 : 0.9, x, 0.18, z, 0.12);
      K.box(M.paintWhite, alongX ? 0.6 : 3.6, 0.7, alongX ? 3.6 : 0.6, x, 0.65, z, 0.16);
    };
    for (const x of [-12.8, 4.0, 10.5]) saddle(x, zB, true);
    saddle(-11.0, zT, true);
    // the fan housing: bigger than the duct, blue, cut open on the camera side so the rotor shows; dark inside
    const Rf = 3.95;
    const Lf = xF1 - xF0 - 3.2;
    const xFc = (xF0 + xF1) / 2;
    const th0 = 0.2;
    const thL = (3 * PI) / 2 - 0.55;
    const shell = (r, mat) => K.add(mat, cached(`fanShell|${r}`, () => new THREE.CylinderGeometry(r, r, Lf, 64, 1, true, th0, thL)), mat4(xFc, yR, zB, 0, 0, -PI / 2));
    shell(Rf, M.paintBlue);
    shell(Rf - 0.25, M.fanIn);
    const cone2 = (x0, x1, r0, r1) => ductGeo([{x: x0, cy: yR, w: 2 * r0, h: 2 * r0, r: r0}, {x: x1, cy: yR, w: 2 * r1, h: 2 * r1, r: r1}]);
    for (const [a, b, r0, r1] of [
      [xF0 + 1.55, xF0 + 1.6, 3.65, Rf],
      [xF1 - 1.6, xF1 - 1.55, Rf, 3.65],
    ]) {
      const g = cone2(a, b, r0, r1);
      K.add(M.paintBlue, g, mat4(0, 0, zB));
    }
    // the cut edges: blue lips along the opening
    for (const th of [th0, th0 + thL]) {
      const y = -(Rf - 0.12) * Math.sin(th);
      const z = (Rf - 0.12) * Math.cos(th);
      K.box(M.paintBlue, Lf, 0.36, 0.34, xFc, yR + y, zB + z, 0.12, th + PI / 2, 0, 0);
    }
    for (const x of [xFc - Lf / 2, xFc + Lf / 2]) K.add(M.paintBlue, cached('fanRim', () => new THREE.TorusGeometry(Rf - 0.08, 0.24, 12, 72)), mat4(x, yR, zB, 0, PI / 2, 0));
    // the motor nacelle (fixed), on four struts; the rotor (its own mesh) spins in front of it
    K.add(M.paintWhite, cached('nacelle', () => lathe([[0.01, -2.2], [1.25, -2.15], [1.35, -1.6], [1.35, 1.2], [1.1, 1.9], [0.55, 2.3], [0.01, 2.36]], 40)), mat4(xFc + 0.9, yR, zB, 0, 0, -PI / 2));
    for (let k = 0; k < 4; k++) {
      const a = PI / 4 + (k * PI) / 2;
      bar(K, M.steel, V(xFc + 1.6, yR + 1.2 * Math.sin(a), zB + 1.2 * Math.cos(a)), V(xFc + 1.6, yR + (Rf - 0.2) * Math.sin(a), zB + (Rf - 0.2) * Math.cos(a)), 0.22, 0.06);
    }
    // ---- the control room at the +x end: cut away like the hall, desks with screens facing the operators (+x)
    const crx = [24.6, 34.2];
    const crz = [0.2, 13.8];
    const cxm = (crx[0] + crx[1]) / 2;
    const czm = (crz[0] + crz[1]) / 2;
    K.box(M.panel, crx[1] - crx[0], 0.2, crz[1] - crz[0], cxm, 0.1, czm, 0.06);
    K.patch(lit('#dfe5f6', {offset: 1}), crx[1] - crx[0] - 0.6, crz[1] - crz[0] - 0.6, cxm, 0.205, czm);
    K.box(M.white, 0.3, 1.0, crz[1] - crz[0], crx[0], 0.6, czm, 0.1);
    K.box(M.white, crx[1] - crx[0], 2.6, 0.3, cxm, 1.4, crz[0], 0.1);
    K.box(M.white, crx[1] - crx[0], 1.0, 0.3, cxm, 0.6, crz[1], 0.1);
    K.add(M.pane, cached('crGlassX', () => new THREE.BoxGeometry(0.05, 1.4, crz[1] - crz[0] - 0.4)), mat4(crx[0], 1.8, czm));
    K.add(M.pane, cached('crGlassZ', () => new THREE.BoxGeometry(crx[1] - crx[0] - 0.4, 1.4, 0.05)), mat4(cxm, 1.8, crz[1]));
    K.box(M.blue, 0.36, 0.14, crz[1] - crz[0] + 0.3, crx[0], 2.55, czm, 0.05);
    K.box(M.blue, crx[1] - crx[0] + 0.3, 0.14, 0.36, cxm, 2.55, crz[1], 0.05);
    for (const z of [crz[0] + 4.6, crz[0] + 9.2]) K.box(M.white, 0.2, 2.6, 0.2, crx[0], 1.4, z, 0.05);
    K.pic(screenMat(flowTex(), 0.8), 6.0, 2.0, cxm - 0.4, 1.45, crz[0] + 0.16);
    K.box(M.navy, 6.3, 2.2, 0.06, cxm - 0.4, 1.45, crz[0] + 0.13, 0.03);
    for (const [dx, mon] of [
      [26.4, 5],
      [29.6, 5],
    ]) {
      const z0 = crz[0] + 3.0;
      const zl = crz[1] - crz[0] - 4.4;
      K.box(M.white, 1.1, 0.12, zl, dx, 0.98, z0 + zl / 2, 0.04);
      for (const s of [0, 1]) K.box(M.white, 0.9, 0.86, 0.12, dx, 0.6, z0 + s * zl, 0.04);
      for (let k = 0; k < mon; k++) {
        const z = z0 + 0.8 + (k * (zl - 1.6)) / (mon - 1);
        K.box(M.navy, 0.08, 0.66, 1.05, dx - 0.2, 1.5, z, 0.03);
        K.pic(screenMat(monitorTex(k + 2)), 0.95, 0.56, dx - 0.15, 1.5, z, PI / 2);
        K.cyl(M.navy, 0.28, 0.28, 0.12, dx + 1.0, 0.75, z, 'y', 0.04, 16);
        K.cyl(M.steel, 0.05, 0.05, 0.5, dx + 1.0, 0.45, z, 'y', 0.02, 8);
      }
    }
    // ---- the model shop at the -x end: benches with spare wings, a parts rack
    for (const [x, z] of [
      [-28.5, 8.0],
      [-28.5, 11.6],
    ]) {
      K.box(M.white, 5.0, 0.14, 1.6, x, 0.95, z, 0.05);
      for (const s of [-1, 1]) K.box(M.white, 0.14, 0.88, 1.4, x + s * 2.3, 0.46, z, 0.04);
      K.box(M.paintBlue, 3.2, 0.12, 0.7, x - 0.4, 1.12, z - 0.2, 0.05);
      K.box(M.paintWhite, 0.6, 0.3, 0.5, x + 1.6, 1.17, z + 0.2, 0.08);
    }
    K.box(M.steel, 0.5, 2.4, 6.0, -34.2, 1.2, 9.0, 0.08);
    for (const y of [0.8, 1.6]) for (const dz of [-1.8, 0, 1.8]) K.box(M.paintBlue, 0.4, 0.14, 1.4, -33.9, y, 9.0 + dz, 0.05);
    return K.freeze();
  });
  const group = thaw(frozen);
  group.name = 'aero-lab';
  // the sign on the back wall, and the hall's name plate on the low front wall
  const sg = signTex('AERO LAB · TUNNEL 1', 'Rolling road  ·  60% model  ·  closed circuit');
  const sh = 2.2;
  const sw = sg.aspect * sh;
  const sp = new THREE.Mesh(rbox(sw + 0.2, sh + 0.2, 0.2, 0.1), M.white);
  sp.position.set(9, H - 1.75, -D / 2 + t / 2 + 0.12);
  sp.castShadow = sp.receiveShadow = true;
  group.add(sp);
  stick(group, sg.tex, sg.aspect, sh, 9, H - 1.75, -D / 2 + t / 2 + 0.23);
  const np = plate('AERO LAB', {bg: TOY.blue, fg: '#ffffff', px: 100, h: 150, padX: 0.3});
  stick(group, np.tex, np.aspect, 1.0, -22, low / 2 + 0.1, D / 2 + t / 2 + 0.11);
  const tp = plate('TUNNEL 1', {bg: TOY.blue, fg: '#ffffff', px: 100, h: 150, padX: 0.3});
  stick(group, tp.tex, tp.aspect, 0.8, xT + 7.6, LAB.belt + 3.0, zT + (tsW + 4.2) / 2 + 0.02);
  // flow arrows on the floor by the test section: the air runs toward -x
  const ar = arrowTex('AIRFLOW');
  stick(group, ar.tex, ar.aspect, 0.9, 0, 0.02, zT + tsW / 2 + 1.4, 0, true);
  // the belt: its own mesh with a moving texture; drums at both ends
  const bt = beltTex();
  bt.repeat.set(10, 1);
  const beltMat = new THREE.MeshStandardMaterial({map: bt, roughness: 0.75});
  const beltMesh = new THREE.Mesh(new THREE.PlaneGeometry(10, 3.6).rotateX(-PI / 2), beltMat);
  beltMesh.position.set(0, belt + 0.02, zT);
  beltMesh.receiveShadow = true;
  group.add(beltMesh);
  const drums = [-5.05, 5.05].map((x) => {
    const tex = canvasTex(128, 8, (g, w, h) => {
      g.fillStyle = '#3a4466';
      g.fillRect(0, 0, w, h);
      g.fillStyle = '#c8d0e4';
      for (let k = 0; k < 4; k++) g.fillRect((k * w) / 4, 0, w * 0.08, h);
    });
    const m = new THREE.Mesh(cached('drum', () => new THREE.CylinderGeometry(0.16, 0.16, 3.6, 24).rotateX(PI / 2)), new THREE.MeshStandardMaterial({map: tex, roughness: 0.4}));
    m.position.set(x, belt - 0.12, zT);
    group.add(m);
    return m;
  });
  const setBelt = (d) => {
    bt.offset.x = (((d / 1.0) % 1) + 1) % 1;
    for (const m of drums) m.rotation.z = d / 0.16;
  };
  // the overhead strut: a white blade from the roof down to the model's airbox
  const strut = new THREE.Group();
  strut.name = 'strut';
  {
    const K = new Kit();
    const y0 = belt + 0.02 + 0.95;
    const y1 = belt + tsH + 0.05;
    K.box(M.paintWhite, 0.5, y1 - y0, 0.12, -0.4, (y0 + y1) / 2, zT, 0.05);
    K.box(M.paintBlue, 0.6, 0.18, 0.2, -0.4, y0 + 0.06, zT, 0.06);
    thaw(K.freeze(), strut);
  }
  group.add(strut);
  // the rotor: spinner, hub and nine broad blades, turning about x
  const rotor = new THREE.Group();
  rotor.position.set((-7.5 + 0.5) / 2 - 1.2, LAB.yR, LAB.zB);
  {
    const K = new Kit();
    K.add(M.paintBlue, lathe([[0.01, -1.2], [0.6, -1.05], [1.0, -0.7], [1.25, -0.2], [1.3, 0.3]], 32), mat4(0, 0, 0, 0, 0, -PI / 2));
    const nb = 9;
    for (let k = 0; k < nb; k++) {
      const a = (k / nb) * TAU;
      const m = new THREE.Matrix4().makeRotationX(a).multiply(mat4(0, 2.45, 0, 0, 0.62, 0));
      K.add(M.paintWhite, rbox(1.05, 2.4, 0.16, 0.07, 2), m);
    }
    thaw(K.freeze(), rotor);
  }
  group.add(rotor);
  const setFan = (a) => {
    rotor.rotation.x = a;
  };
  // the mount: on the belt's surface in the middle of the test section
  const mount = new THREE.Object3D();
  mount.name = 'mount';
  mount.position.set(0, belt + 0.02, zT);
  group.add(mount);
  setBelt(0);
  setFan(0.3);
  return {
    group,
    mount,
    setFan,
    setBelt,
    flow: {x0: -xT, x1: xT, y0: belt + 0.02, y1: belt + tsH - 0.02, z0: zT - tsW / 2 + 0.05, z1: zT + tsW / 2 - 0.05},
    anchor: V(0, 7.2, zT),
    strut,
  };
}

// ================================================================================================ the motorhome
export function buildMotorhome({team = 'halcyon'} = {}) {
  const M = mats();
  const Lv = TOY.livery[team] ?? TOY.livery.halcyon;
  const ink = teamInk(team);
  const L = 20;
  const D = 8;
  const frozen = cached(`motorhome|${team}`, () => {
    const K = new Kit();
    const tint = toyMat('#' + new THREE.Color(ink).lerp(new THREE.Color(TOY.glass), 0.3).getHexString(), {rough: 0.14});
    // the ground storey: white, a team-colour glass band across the front and round the +x end
    K.box(M.white, L, 3.3, D, 0, 1.65, 0, 0.3);
    K.box(tint, L - 2.4, 2.1, 0.2, 0.6, 1.55, D / 2 + 0.01, 0.08);
    K.box(tint, 0.2, 2.1, D - 2.0, L / 2 + 0.01, 1.55, 0, 0.08);
    // the entrance: dark glass doors under a team-colour awning, steps
    K.box(M.glass, 2.2, 2.4, 0.2, -L / 2 + 1.7, 1.2, D / 2 + 0.02, 0.06);
    K.box(paint(ink), 3.6, 0.2, 2.2, -L / 2 + 1.7, 2.9, D / 2 + 1.0, 0.08);
    K.box(M.panel, 3.2, 0.2, 1.4, -L / 2 + 1.7, 0.1, D / 2 + 0.7, 0.06);
    // the upper storey overhangs the front a little; another glass band; the roof in the team colour
    K.box(M.panel, L + 0.4, 0.3, D + 1.2, 0, 3.45, 0.4, 0.12);
    K.box(M.white, L, 3.0, D + 0.8, 0, 5.1, 0.4, 0.3);
    K.box(tint, L - 1.6, 1.4, 0.2, 0, 4.95, D / 2 + 0.81, 0.08);
    K.box(tint, 0.2, 1.4, D - 1.2, L / 2 + 0.01, 4.95, 0.4, 0.08);
    for (let x = -L / 2 + 2.4; x < L / 2 - 1.6; x += 3.2) K.box(M.white, 0.16, 1.4, 0.16, x, 4.95, D / 2 + 0.92, 0.05);
    K.box(paint(ink), L + 0.5, 0.42, D + 1.3, 0, 6.8, 0.4, 0.16);
    K.box(M.white, L + 0.56, 0.12, D + 1.36, 0, 6.62, 0.4, 0.04);
    K.box(paint(Lv.accent), L + 0.54, 0.1, 0.06, 0, 6.98, D / 2 + 1.07, 0.03);
    // a roof unit and planters by the door
    K.box(M.white, 4, 0.5, 2.4, 4, 7.26, -1.4, 0.18);
    for (const x of [-L / 2 + 4.6, L / 2 - 1.2]) {
      K.box(M.white, 1.4, 0.6, 1.0, x, 0.3, D / 2 + 1.0, 0.14);
      K.add(M.greenDeep, cached('hedgeS', () => new THREE.SphereGeometry(1, 20, 10, 0, TAU, 0, PI / 2).scale(0.62, 0.5, 0.44)), mat4(x, 0.58, D / 2 + 1.0));
    }
    return K.freeze();
  });
  const group = thaw(frozen);
  group.name = 'motorhome';
  const p = plate(teamName(team), {bg: null, fg: ink, px: 104, h: 150, padX: 0.1, italic: true});
  stick(group, p.tex, p.aspect, 0.56, -2, 6.12, D / 2 + 0.82);
  return {group};
}

// ================================================================================================ the marshal post
export function buildMarshalPost() {
  const M = mats();
  const frozen = cached('marshal', () => {
    const K = new Kit();
    K.box(M.panel, 3.4, 0.2, 2.8, 0, 0.1, 0, 0.08);
    K.box(M.white, 2.6, 2.3, 2.2, -0.2, 1.35, 0, 0.2);
    K.box(M.glass, 1.8, 0.85, 0.12, -0.2, 1.8, 1.1, 0.05);
    K.box(M.glass, 0.12, 0.85, 1.2, 1.1, 1.8, -0.2, 0.05);
    K.box(M.blue, 3.1, 0.32, 2.8, -0.2, 2.62, 0, 0.12);
    // the flag board on two posts, facing +z
    for (const x of [1.25, 2.75]) K.box(M.post, 0.12, 2.9, 0.12, x, 1.45, 0.85, 0.04);
    K.box(M.white, 1.9, 1.32, 0.12, 2.0, 2.3, 0.88, 0.06);
    K.pic(new THREE.MeshStandardMaterial({map: flagTex(), roughness: 0.5}), 1.8, 1.2, 2.0, 2.3, 0.945);
    return K.freeze();
  });
  const group = thaw(frozen);
  group.name = 'marshal-post';
  return {group};
}

// ================================================================================================ trees (copied from airside.js)
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
