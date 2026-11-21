// The circuit's surfaces, built from the layout's paths: the track ribbon, white edge lines, blue-and-white kerbs on
// the corners, a run-off band and a low barrier round the outside, the pit lane with its fast lane, working lane,
// lines and box outlines, the start line and the grid. Everything lies flat on the ground a few centimetres apart, so
// nothing flickers.
import * as THREE from 'three';
import {TOY, toyMat, labelTexture} from './style.js';
import {DS, track, PIT, GARAGE_X, TEAMS, START_X, CARS, pitOf} from './layout.js';

const UP = new THREE.Vector3(0, 1, 0);

/**
 * a flat ribbon along a path between lateral offsets a and b (left of the heading is +), from s0 to s1, at height y.
 * colorAt(s) gives per-vertex colours (kerbs).
 */
function ribbon(path, {a, b, y = 0.02, s0 = 0, s1 = path.L, step = 1, colorAt = null, widthAt = null}) {
  const pos = [];
  const col = [];
  const idx = [];
  const n = Math.max(2, Math.ceil((s1 - s0) / step) + 1);
  for (let i = 0; i < n; i++) {
    const s = Math.min(s0 + i * step, s1);
    const p = path.at(s);
    // left normal of the heading (tx, tz) seen from above with y up: (tz, -tx)
    const nx = p.tz;
    const nz = -p.tx;
    const [aa, bb] = widthAt ? widthAt(s, a, b) : [a, b];
    pos.push(p.x + nx * aa, y, p.z + nz * aa, p.x + nx * bb, y, p.z + nz * bb);
    if (colorAt) {
      const c = new THREE.Color(colorAt(s));
      col.push(c.r, c.g, c.b, c.r, c.g, c.b);
    }
    if (i) {
      const k = 2 * i;
      idx.push(k - 2, k - 1, k, k - 1, k + 1, k);
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  if (colorAt) g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
  g.setIndex(idx);
  // make every face point up whichever way the strip winds
  g.computeVertexNormals();
  const nrm = g.getAttribute('normal');
  for (let i = 0; i < nrm.count; i++) nrm.setXYZ(i, 0, 1, 0);
  // and wind the triangles so they face up
  const P = g.getAttribute('position');
  const I = g.getIndex();
  const v0 = new THREE.Vector3();
  const v1 = new THREE.Vector3();
  const v2 = new THREE.Vector3();
  for (let i = 0; i < I.count; i += 3) {
    v0.fromBufferAttribute(P, I.getX(i));
    v1.fromBufferAttribute(P, I.getX(i + 1));
    v2.fromBufferAttribute(P, I.getX(i + 2));
    const ny = new THREE.Vector3().subVectors(v1, v0).cross(new THREE.Vector3().subVectors(v2, v0)).dot(UP);
    if (ny < 0) {
      const t = I.getX(i + 1);
      I.setX(i + 1, I.getX(i + 2));
      I.setX(i + 2, t);
    }
  }
  return g;
}

const flat = (geo, mat, order = 0) => {
  const m = new THREE.Mesh(geo, mat);
  m.receiveShadow = true;
  m.renderOrder = order;
  return m;
};

/** stretches of the lap where the track bends: [[s0, s1, side]] (side +1: the corner turns left, -1 right) */
function corners(path, k0 = 1 / 140) {
  const out = [];
  let cur = null;
  for (let i = 0; i <= path.n; i++) {
    const k = i < path.n ? path.K[i] : 0;
    const on = Math.abs(k) > k0;
    if (on && !cur) cur = {s0: i * DS, side: Math.sign(k), sum: 0};
    if (on && cur) cur.sum += k;
    if (!on && cur) {
      cur.s1 = i * DS;
      out.push([cur.s0 - 6, cur.s1 + 6, Math.sign(cur.sum)]);
      cur = null;
    }
  }
  return out;
}

export const TRACK_HALF = 7;

/** the whole circuit surface: returns a Group */
export function buildCircuitSurface() {
  const g = new THREE.Group();
  g.name = 'circuit-surface';
  const L = track.L;
  // which side is outside: the lap turns mostly one way; outside is away from the turn
  let turn = 0;
  for (let i = 0; i < track.n; i++) turn += track.K[i];
  const OUT = Math.sign(turn); // lateral sign of the outside (the left normal is +)
  const H = TRACK_HALF;

  // run-off round the outside, a narrow verge inside
  g.add(flat(ribbon(track, {a: OUT * H, b: OUT * (H + 9), y: 0.012, step: 2}), toyMat(TOY.runoff, {rough: 0.9}), 0));
  g.add(flat(ribbon(track, {a: -OUT * H, b: -OUT * (H + 2.2), y: 0.012, step: 2}), toyMat(TOY.runoff, {rough: 0.9}), 0));
  // the track
  g.add(flat(ribbon(track, {a: -H, b: H, y: 0.03, step: 1}), toyMat(TOY.asphalt, {rough: 0.8}), 1));
  // edge lines
  const lineMat = toyMat(TOY.line, {rough: 0.6});
  g.add(flat(ribbon(track, {a: H - 0.75, b: H - 0.35, y: 0.045, step: 1}), lineMat, 2));
  g.add(flat(ribbon(track, {a: -H + 0.35, b: -H + 0.75, y: 0.045, step: 1}), lineMat, 2));

  // kerbs: blue and white in 2 m blocks on both edges through every corner, wider on the inside
  const kerbMat = new THREE.MeshStandardMaterial({vertexColors: true, roughness: 0.6});
  const stripe = (s) => (Math.floor(s / 2.2) % 2 ? TOY.kerb : TOY.white);
  for (const [s0, s1, side] of corners(track)) {
    const inner = -side; // the centre of a bend with positive curvature lies on the right (-)
    // the kerb is a thin raised strip: two ribbons, a top and a lip
    g.add(flat(ribbon(track, {a: inner * (H - 0.2), b: inner * (H + 1.6), y: 0.09, s0, s1, step: 1.1, colorAt: stripe}), kerbMat, 3));
    g.add(flat(ribbon(track, {a: -inner * (H - 0.2), b: -inner * (H + 1.1), y: 0.08, s0: s0 + 4, s1: s1 - 4, step: 1.1, colorAt: stripe}), kerbMat, 3));
  }

  // the start line: a white bar across the track and a chequered strip, then the grid slots behind it
  const sl = track.at(0);
  const startTex = (() => {
    const c = document.createElement('canvas');
    c.width = 64;
    c.height = 512;
    const x = c.getContext('2d');
    x.fillStyle = TOY.white;
    x.fillRect(0, 0, 64, 512);
    x.fillStyle = TOY.navy;
    for (let r = 0; r < 32; r++) for (let q = 0; q < 4; q++) if ((r + q) % 2) x.fillRect(q * 16, r * 16, 16, 16);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  })();
  const chk = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 2 * H - 0.6).rotateX(-Math.PI / 2), new THREE.MeshStandardMaterial({map: startTex, roughness: 0.7}));
  chk.position.set(sl.x - 1.2, 0.05, sl.z);
  chk.renderOrder = 3;
  chk.receiveShadow = true;
  g.add(chk);
  const bar = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 2 * H - 0.6).rotateX(-Math.PI / 2), lineMat);
  bar.position.set(sl.x + 0.2, 0.05, sl.z);
  bar.receiveShadow = true;
  g.add(bar);
  for (let k = 0; k < 6; k++) {
    const side = k % 2 ? 1 : -1;
    const x0 = sl.x - 10 - k * 8;
    const slot = new THREE.Mesh(new THREE.PlaneGeometry(0.35, 3.2).rotateX(-Math.PI / 2), lineMat);
    slot.position.set(x0, 0.05, sl.z + side * 3.2);
    g.add(slot);
    const tick = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 0.35).rotateX(-Math.PI / 2), lineMat);
    tick.position.set(x0 - 0.7, 0.05, sl.z + side * 3.2 + side * 1.6);
    g.add(tick);
  }

  // a low barrier round the outside: white with a blue cap, broken where the pit lane leaves and joins
  const barrier = new THREE.Group();
  const bw = toyMat(TOY.white, {rough: 0.55});
  const bb = toyMat(TOY.blue, {rough: 0.5, paint: true});
  const seg = 6;
  const base = new THREE.BoxGeometry(seg + 0.15, 0.8, 0.55);
  const cap = new THREE.BoxGeometry(seg + 0.15, 0.18, 0.62);
  const items = [];
  for (let s = 0; s < L; s += seg) {
    const p = track.at(s + seg / 2);
    const off = OUT * (H + 9.4);
    items.push({x: p.x + p.tz * off, z: p.z - p.tx * off, yaw: Math.atan2(-p.tz, p.tx)});
  }
  const inst = (geo, mat, y) => {
    const im = new THREE.InstancedMesh(geo, mat, items.length);
    const m4 = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    items.forEach((it, i) => {
      q.setFromAxisAngle(UP, it.yaw);
      m4.compose(new THREE.Vector3(it.x, y, it.z), q, new THREE.Vector3(1, 1, 1));
      im.setMatrixAt(i, m4);
    });
    im.castShadow = im.receiveShadow = true;
    barrier.add(im);
  };
  inst(base, bw, 0.4);
  inst(cap, bb, 0.86);
  g.add(barrier);

  g.add(buildPitLaneSurface());
  return g;
}

/** the pit lane: entry and exit lanes, the fast lane, the working lane, lines, box outlines and team names */
function buildPitLaneSurface() {
  const g = new THREE.Group();
  g.name = 'pit-lane';
  const pitMat = toyMat(TOY.asphaltPit, {rough: 0.85});
  const lineMat = toyMat(TOY.line, {rough: 0.6});
  const bayMat = toyMat(TOY.bay, {rough: 0.6});
  // the entry and exit lanes follow the hero's pit path outside the boxes (it leaves the fast lane only at its box)
  const hero = CARS.find((c) => c.hero);
  const P = pitOf(hero).P.path;
  const sA = P.nearest(PIT.entryX + 10, PIT.fast) * DS;
  const sB = P.nearest(PIT.exitX - 10, PIT.fast) * DS;
  g.add(flat(ribbon(P, {a: -3.6, b: 3.6, y: 0.025, s0: 0, s1: sA, step: 1}), pitMat, 1));
  g.add(flat(ribbon(P, {a: -3.6, b: 3.6, y: 0.025, s0: sB, s1: P.L, step: 1}), pitMat, 1));
  // the straight part: a slab from the building's front to the pit wall
  const x0 = PIT.entryX - 2;
  const x1 = PIT.exitX + 2;
  const slab = new THREE.Mesh(new THREE.PlaneGeometry(x1 - x0, PIT.wall - PIT.front).rotateX(-Math.PI / 2), pitMat);
  slab.position.set((x0 + x1) / 2, 0.026, (PIT.front + PIT.wall) / 2);
  slab.receiveShadow = true;
  slab.renderOrder = 1;
  g.add(slab);
  // the line between the working lane and the fast lane, the entry and exit lines across the lane
  const strip = (w, d, x, z, mat = lineMat) => {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, d).rotateX(-Math.PI / 2), mat);
    m.position.set(x, 0.04, z);
    m.receiveShadow = true;
    m.renderOrder = 2;
    g.add(m);
  };
  strip(x1 - x0 - 4, 0.3, (x0 + x1) / 2, 11);
  strip(0.6, PIT.wall - 11 - 0.6, PIT.entryX, (11 + PIT.wall) / 2);
  strip(0.6, PIT.wall - 11 - 0.6, PIT.exitX, (11 + PIT.wall) / 2);
  // "PIT 80" painted at the entry line
  const word = (text, x, z, rot) => {
    const tex = labelTexture(text, {color: TOY.white, font: '800 170px Inter, system-ui, sans-serif', w: 1024, h: 256});
    const m = new THREE.Mesh(new THREE.PlaneGeometry(10, 2.5).rotateX(-Math.PI / 2), new THREE.MeshStandardMaterial({map: tex, transparent: true, roughness: 0.7, depthWrite: false}));
    m.rotation.y = rot;
    m.position.set(x, 0.045, z);
    m.renderOrder = 3;
    g.add(m);
  };
  word('PIT  80', PIT.entryX + 9, PIT.fast, 0);
  // box outlines: a yellow rectangle per garage, 11 m by 6.4 m, on the working lane
  for (let i = 0; i < GARAGE_X.length; i++) {
    const bx = GARAGE_X[i];
    const w = 11;
    const d = 6.4;
    const t = 0.28;
    strip(w, t, bx, PIT.box - d / 2, bayMat);
    strip(w, t, bx, PIT.box + d / 2, bayMat);
    strip(t, d, bx - w / 2, PIT.box, bayMat);
    strip(t, d, bx + w / 2, PIT.box, bayMat);
    // the stop mark where the front wheels go
    strip(0.28, 2.4, bx + 2.6, PIT.box - 1.22, bayMat);
    strip(0.28, 2.4, bx + 2.6, PIT.box + 1.22, bayMat);
    // the team's name on the lane in front of its box
    const lv = TOY.livery[TEAMS[i]];
    const tex = labelTexture(TEAMS[i].toUpperCase(), {color: lv.body === TOY.white || lv.body === '#f6f8fd' ? TOY.blue : lv.body, font: '800 130px Inter, system-ui, sans-serif', w: 1024, h: 256});
    const m = new THREE.Mesh(new THREE.PlaneGeometry(9, 2.2).rotateX(-Math.PI / 2), new THREE.MeshStandardMaterial({map: tex, transparent: true, roughness: 0.7, depthWrite: false}));
    m.position.set(bx, 0.045, PIT.box + d / 2 + 1.5);
    m.renderOrder = 3;
    g.add(m);
  }
  return g;
}

/** the pit lane's surface outline for a mini map: [[x, z]] */
export const trackPolyline = (step = 6) => {
  const out = [];
  for (let s = 0; s < track.L; s += step) {
    const p = track.at(s);
    out.push([p.x, p.z]);
  }
  return out;
};

export {START_X};
