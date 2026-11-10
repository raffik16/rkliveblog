// Saturn V · Apollo 11 ascent, as a teardown: the stack flies from the pad to parking orbit on one input (mission
// time), the skin cuts open to show six tanks draining, and the panels read the same model that poses the parts.
import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {makeModel, T, S1, S2, S3, FLOW} from './kin.js';

const model = makeModel();
const q = new URLSearchParams(location.search);
const app = document.getElementById('app');
document.title = 'Saturn V Teardown · Apollo 11 ascent';

// ---------- stage ----------
const canvas = document.createElement('canvas');
canvas.id = 'gl';
app.appendChild(canvas);
const renderer = new THREE.WebGLRenderer({canvas, antialias: true, preserveDrawingBuffer: true});
renderer.localClippingEnabled = true;
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(30, 1, 1, 30000);
camera.position.set(110, 70, 230);
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.enablePan = false;
controls.minDistance = 25;
controls.maxDistance = 600;
controls.target.set(0, 55, 0);
scene.add(new THREE.HemisphereLight(0xffffff, 0x8a8f99, 1.5));
const sun = new THREE.DirectionalLight(0xffffff, 2.2);
sun.position.set(120, 200, 160);
scene.add(sun);

// ---------- materials ----------
const clip = new THREE.Plane(new THREE.Vector3(0, 0, -1), 0);
const skins = [];
const skin = (color, rough = 0.6) => {
  const m = new THREE.MeshStandardMaterial({color, roughness: rough, metalness: 0.05, side: THREE.DoubleSide});
  skins.push(m);
  return m;
};
const WHITE = skin(0xf2f1ec);
const BLACK = skin(0x1c1d21);
const SILVER = skin(0xc9ced6, 0.35);
const METAL = new THREE.MeshStandardMaterial({color: 0x4a4d55, roughness: 0.5, metalness: 0.6, side: THREE.DoubleSide});
const SHELL = new THREE.MeshStandardMaterial({color: 0x9aa3b0, roughness: 0.5, transparent: true, opacity: 0.28, side: THREE.DoubleSide, depthWrite: false});
const LIQ = {
  rp1: new THREE.MeshStandardMaterial({color: 0xd98a2b, roughness: 0.4}),
  lox: new THREE.MeshStandardMaterial({color: 0x6fb6ee, roughness: 0.4}),
  lh2: new THREE.MeshStandardMaterial({color: 0xb9a8f5, roughness: 0.4}),
};

// ---------- geometry: metres, y up, engine exits at y = 0 ----------
const tube = (rTop, rBot, y0, y1, mat, parent) => {
  const m = new THREE.Mesh(new THREE.CylinderGeometry(rTop, rBot, y1 - y0, 56, 1, true), mat);
  m.position.y = (y0 + y1) / 2;
  parent.add(m);
  return m;
};
const bell = (rThroat, rExit, len, y, x, z, parent) => {
  const pts = [];
  for (let i = 0; i <= 12; i++) {
    const k = i / 12;
    pts.push(new THREE.Vector2(rThroat + (rExit - rThroat) * Math.pow(k, 0.62), len * (1 - k)));
  }
  const m = new THREE.Mesh(new THREE.LatheGeometry(pts, 32), METAL);
  m.position.set(x, y, z);
  parent.add(m);
  const cap = new THREE.Mesh(new THREE.CylinderGeometry(rThroat * 1.6, rThroat * 1.6, len * 0.22, 20), METAL);
  cap.position.set(x, y + len * 1.08, z);
  parent.add(cap);
  return m;
};
const tanks = [];
const tank = (r, y0, y1, liq, parent) => {
  tube(r, r, y0, y1, SHELL, parent);
  for (const [yy, flip] of [[y1, 1], [y0, -1]]) {
    const dome = new THREE.Mesh(new THREE.SphereGeometry(r, 40, 12, 0, Math.PI * 2, 0, Math.PI / 2), SHELL);
    dome.scale.y = 0.38 * flip;
    dome.position.y = yy;
    parent.add(dome);
  }
  const liquid = new THREE.Mesh(new THREE.CylinderGeometry(r * 0.97, r * 0.97, 1, 48), LIQ[liq]);
  parent.add(liquid);
  tanks.push({liquid, y0, h: y1 - y0});
};
const cluster = (n, ring) => (n === 1 ? [[0, 0]] : [[0, 0], [ring, ring], [-ring, ring], [ring, -ring], [-ring, -ring]]);

const rig = new THREE.Group();
scene.add(rig);
const g1 = new THREE.Group(); // S-IC
const gRing = new THREE.Group(); // S-IC / S-II interstage
const g2 = new THREE.Group(); // S-II and the S-IVB aft interstage
const g3 = new THREE.Group(); // S-IVB, instrument unit, spacecraft
const gLes = new THREE.Group(); // launch escape tower
rig.add(g1, gRing, g2, g3, gLes);
const R = S1.dia / 2;

// S-IC: 42.1 m, five F-1s, RP-1 below, LOX above.
tube(R, R, 3.6, 10.5, BLACK, g1);
tube(R, R, 10.5, 20.5, WHITE, g1);
tube(R, R, 20.5, 24.5, BLACK, g1);
tube(R, R, 24.5, 39.5, WHITE, g1);
tube(R, R, 39.5, 42.1, BLACK, g1);
for (const [x, z] of cluster(5, 2.6)) bell(0.46, 1.83, 5.6, 0, x, z, g1);
for (let i = 0; i < 4; i++) {
  const a = (i * Math.PI) / 2 + Math.PI / 4;
  const fair = new THREE.Mesh(new THREE.ConeGeometry(2.1, 8.5, 24, 1, true), WHITE);
  fair.position.set(Math.cos(a) * 4.7, 6.6, Math.sin(a) * 4.7);
  g1.add(fair);
  const fin = new THREE.Mesh(new THREE.BoxGeometry(3.4, 5.2, 0.25), BLACK);
  fin.position.set(Math.cos(a) * 7.6, 3.6, Math.sin(a) * 7.6);
  fin.rotation.y = -a;
  g1.add(fin);
}
tank(4.75, 7.5, 18.8, 'rp1', g1);
tank(4.75, 23.2, 40.0, 'lox', g1);
// Interstage ring: it stays on for 30 s after staging, then drops past the lit J-2s.
tube(R, R, 42.1, 47.6, WHITE, gRing);
// S-II: 24.9 m, five J-2s, LOX below a common bulkhead, LH2 above.
tube(R, R, 47.6, 49.6, BLACK, g2);
tube(R, R, 49.6, 65.0, WHITE, g2);
tube(R, R, 65.0, 67.0, BLACK, g2);
tube(3.3, R, 67.0, 72.8, WHITE, g2);
for (const [x, z] of cluster(5, 2.2)) bell(0.25, 1.02, 3.4, 42.9, x, z, g2);
tank(4.75, 48.6, 51.6, 'lox', g2);
tank(4.75, 54.4, 65.2, 'lh2', g2);
// S-IVB: 17.8 m with its aft interstage, one J-2.
tube(3.3, 3.3, 72.8, 84.8, WHITE, g3);
tube(3.3, 3.3, 84.8, 85.7, BLACK, g3);
bell(0.25, 1.02, 3.4, 67.6, 0, 0, g3);
tube(3.2, 0.6, 71.0, 73.2, METAL, g3);
tank(3.1, 74.2, 76.4, 'lox', g3);
tank(3.1, 78.6, 83.4, 'lh2', g3);
// Spacecraft: adapter with the lunar module inside, service module, command module.
tube(1.95, 3.3, 85.7, 94.2, WHITE, g3);
const lm = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 2.0, 3.2, 8), new THREE.MeshStandardMaterial({color: 0xc9a23a, roughness: 0.45, metalness: 0.5}));
lm.position.y = 88.4;
g3.add(lm);
bell(0.3, 1.25, 2.6, 91.4, 0, 0, g3);
tube(1.95, 1.95, 94.2, 98.0, SILVER, g3);
tube(0.35, 1.95, 98.0, 101.4, SILVER, g3);
// Launch escape tower.
tube(0.33, 0.33, 104.2, 109.6, WHITE, gLes);
tube(0.02, 0.33, 109.6, 110.6, WHITE, gLes);
tube(0.33, 1.2, 101.4, 104.2, METAL, gLes);

// Plumes: one cone per cluster, sized from the model.
const plume = (color, parent, y) => {
  const m = new THREE.Mesh(
    new THREE.CylinderGeometry(0.72, 1, 1, 32, 1, true),
    new THREE.MeshBasicMaterial({color, transparent: true, opacity: 0.6, depthWrite: false, side: THREE.DoubleSide}),
  );
  m.userData.y = y;
  parent.add(m);
  return m;
};
const plumes = [plume(0xf0531c, g1, 0.5), plume(0x9cc9ff, g2, 43), plume(0x9cc9ff, g3, 67.7)];
const cores = [plume(0xffd27a, g1, 0.5), plume(0xe6f2ff, g2, 43), plume(0xe6f2ff, g3, 67.7)];

// Pad: mobile launcher deck and the umbilical tower, at true scale, falling away with altitude.
const pad = new THREE.Group();
scene.add(pad);
const padMat = new THREE.MeshStandardMaterial({color: 0x8a8d92, roughness: 0.9});
const deck = new THREE.Mesh(new THREE.BoxGeometry(49, 7.6, 41), padMat);
deck.position.set(-8, -4.2, 0);
const lut = new THREE.Mesh(new THREE.BoxGeometry(12, 116, 12, 2, 16, 2), new THREE.MeshBasicMaterial({color: 0xa33a22, wireframe: true}));
lut.position.set(-24, 58, 0);
const ground = new THREE.Mesh(new THREE.CircleGeometry(4000, 48), new THREE.MeshStandardMaterial({color: 0xb9bdb2, roughness: 1}));
ground.rotation.x = -Math.PI / 2;
ground.position.y = -8;
pad.add(deck, lut, ground);

// ---------- console ----------
const EVENTS = [
  [T.start, 'Ignition'], [0, 'Liftoff'], [T.tower, 'Tower clear'], [model.mach1, 'Mach 1'], [model.maxQ.t, 'Max Q'],
  [T.s1ceco, 'Centre engine off'], [T.s1oeco, 'S-IC cutoff'], [T.s2ign, 'S-II ignition'], [T.skirt, 'Skirt off'],
  [T.les, 'Tower jettison'], [T.s2ceco, 'S-II centre off'], [T.s2oeco, 'S-II cutoff'], [T.s4ign, 'S-IVB ignition'], [T.s4cut, 'Orbit'],
];
const ui = document.createElement('div');
ui.className = 'ui';
ui.innerHTML = `
<header class="hd"><div class="ttl"><i></i>SATURN V <span>/ APOLLO 11 ASCENT</span></div><div class="clk" id="clk">T-00:06</div><div class="cap" id="cap"></div></header>
<section class="pn left" id="read"></section>
<section class="pn right">
  <h3>Tanks</h3><div id="tanks"></div>
  <h3>Load on the crew <b id="gNow"></b></h3><svg id="gChart" viewBox="0 0 300 90" preserveAspectRatio="none"></svg>
  <h3>Altitude <b id="hNow"></b></h3><svg id="hChart" viewBox="0 0 300 90" preserveAspectRatio="none"></svg>
</section>
<footer class="ft">
  <div class="chips" id="chips"></div>
  <input id="scrub" type="range" min="${T.start}" max="${T.end}" step="0.1" value="${T.start}" aria-label="Mission time">
  <div class="rowb">
    <span class="grp"><button id="play" class="on">Pause</button></span>
    <span class="grp" id="speed"><button data-v="1">1×</button><button data-v="10" class="on">10×</button><button data-v="60">60×</button></span>
    <span class="grp" id="look"><button data-v="solid">Solid</button><button data-v="cut" class="on">Cutaway</button><button data-v="xray">X-ray</button></span>
    <span class="grp"><button id="explode">Explode</button></span>
    <span class="grp" id="view"><button data-v="stack" class="on">Stack</button><button data-v="engines">Engines</button><button data-v="capsule">Spacecraft</button></span>
  </div>
</footer><div id="cursor"></div>`;
app.appendChild(ui);
const $ = (id) => document.getElementById(id);
$('chips').innerHTML = EVENTS.map(([t, n], i) => `<button data-i="${i}">${n}</button>`).join('');
const TANKS = [['S-IC RP-1', 'rp1', 'rp1'], ['S-IC LOX', 'lox', 'lox1'], ['S-II LH2', 'lh2', 'lh2'], ['S-II LOX', 'lox', 'lox2'], ['S-IVB LH2', 'lh2', 'lh3'], ['S-IVB LOX', 'lox', 'lox3']];
$('tanks').innerHTML = TANKS.map(([n, c], i) => `<div class="tk"><span>${n}</span><i><u class="${c}" id="tk${i}"></u></i><em id="tv${i}"></em></div>`).join('');
const fmt = (v, d = 0) => v.toLocaleString('en-US', {minimumFractionDigits: d, maximumFractionDigits: d});
const READ = [
  ['Altitude', (s) => `${fmt(s.alt / 1000, 1)} km`], ['Speed', (s) => `${fmt(s.vSpace)} m/s`], ['Mach', (s) => (s.alt > 90000 ? 'vacuum' : fmt(s.mach, 2))],
  ['Downrange', (s) => `${fmt(Math.max(0, s.range / 1000))} km`], ['Load', (s) => `${fmt(s.g, 2)} g`], ['Dynamic pressure', (s) => `${fmt(s.q / 1000, 1)} kPa`],
  ['Thrust', (s) => `${fmt(s.thrust / 1e6, 2)} MN`], ['Mass', (s) => `${fmt(s.mass / 1000)} t`], ['Burning', (s) => `${fmt(s.flow)} kg/s`],
  ['Pitch', (s) => `${fmt(s.pitch, 1)}°`], ['Engines lit', (s) => (s.eng[0] ? `${s.eng[0]} × F-1` : s.eng[1] ? `${s.eng[1]} × J-2` : s.eng[2] ? '1 × J-2' : 'none')],
];
$('read').innerHTML = READ.map(([n], i) => `<div class="rd"><span>${n}</span><b id="rd${i}"></b></div>`).join('');

// Charts: the whole flight drawn once from the table, plus a cursor.
const chart = (svg, arr, max) => {
  let d = '';
  for (let i = 0; i <= 300; i++) {
    const t = T.start + ((T.end - T.start) * i) / 300;
    d += `${i ? 'L' : 'M'}${i} ${(88 - (model.at(arr, t) / max) * 84).toFixed(1)}`;
  }
  svg.innerHTML = `<path d="${d}" class="ln"/><line class="cu" y1="0" y2="90"/>`;
  return svg.querySelector('.cu');
};
const gCur = chart($('gChart'), model.tab.g, 4);
const hCur = chart($('hChart'), model.tab.alt, 200000);

const caption = (t) => {
  if (t < T.start + 3) return 'On the pad. 2,950 t, of which 2,710 t is propellant.';
  if (t < 0) return 'Ignition. Five F-1s come up to thrust while the hold-down arms keep the stack on the pad.';
  if (t < T.tower) return 'Liftoff. 33.9 MN under 2,950 t is 1.17 g, so the first 12 seconds only clear the tower.';
  if (t < model.mach1 - 4) return 'Pitch programme. The stack tips downrange and the S-IC burns 13 t of propellant a second.';
  if (t < model.maxQ.t + 6) return 'Through Mach 1 to max Q. The air is thinning but the speed is not, and the load on the skin peaks.';
  if (t < T.s1ceco) return 'Thrust climbs as the air thins, mass falls, and the load on the crew builds.';
  if (t < T.s1oeco) return 'Centre engine off. Four F-1s carry on, which keeps the load under 4 g.';
  if (t < T.s2ign) return 'Staging. The empty S-IC drops away at 63 km.';
  if (t < T.skirt) return 'S-II burning. Five J-2s on liquid hydrogen: one seventh of the thrust, far better mileage.';
  if (t < T.les) return 'The interstage ring drops clear of the lit engines.';
  if (t < T.s2ceco) return 'Escape tower gone. The S-II does the long push: six and a half minutes, mostly sideways.';
  if (t < T.s2oeco) return 'S-II centre engine off, then a leaner mixture to use up both tanks evenly.';
  if (t < T.s4ign) return 'Second staging. The S-II is spent at 6.7 km/s.';
  if (t < T.s4cut) return 'S-IVB burning. One J-2 adds the last 880 m/s, flying level.';
  return 'Cutoff. Level at 191 km. Most of the S-IVB propellant is still aboard for the burn to the Moon.';
};

// ---------- state ----------
const st = {t: Number(q.get('t') ?? T.start), playing: !q.has('paused'), speed: Number(q.get('speed') ?? 10), look: q.get('look') || 'cut', explode: 0, explodeTo: 0, view: q.get('view') || 'stack', auto: !q.has('notour') && !matchMedia('(prefers-reduced-motion: reduce)').matches};
const setGroup = (id, v) => document.querySelectorAll(`#${id} button`).forEach((b) => b.classList.toggle('on', b.dataset.v === String(v)));
const setLook = (v) => {
  st.look = v;
  setGroup('look', v);
  for (const m of skins) {
    m.clippingPlanes = v === 'cut' ? [clip] : [];
    m.transparent = v === 'xray';
    m.opacity = v === 'xray' ? 0.14 : 1;
    m.depthWrite = v !== 'xray';
    m.needsUpdate = true;
  }
  SHELL.clippingPlanes = v === 'cut' ? [clip] : [];
  SHELL.needsUpdate = true;
};
let camGoal = null;
const setView = (v) => {
  st.view = v;
  setGroup('view', v);
  camGoal = v === 'engines' ? {dy: -1, dist: 62, el: -0.12} : v === 'capsule' ? {dy: 1, dist: 70, el: 0.1} : {dy: 0, dist: 262, el: 0.18};
};
const setSpeed = (v) => {
  st.speed = v;
  setGroup('speed', v);
};
const setPlay = (p) => {
  st.playing = p;
  $('play').textContent = p ? 'Pause' : 'Play';
  $('play').classList.toggle('on', p);
};
const setExplode = (on) => {
  st.explodeTo = on ? 1 : 0;
  $('explode').classList.toggle('on', on);
};
$('look').onclick = (e) => e.target.dataset.v && setLook(e.target.dataset.v);
$('view').onclick = (e) => e.target.dataset.v && setView(e.target.dataset.v);
$('speed').onclick = (e) => e.target.dataset.v && setSpeed(Number(e.target.dataset.v));
$('play').onclick = () => {
  if (!st.playing && st.t >= T.end) st.t = T.start;
  setPlay(!st.playing);
};
$('explode').onclick = () => setExplode(!st.explodeTo);
$('scrub').oninput = (e) => (st.t = Number(e.target.value));
$('chips').onclick = (e) => {
  if (e.target.dataset.i) st.t = EVENTS[e.target.dataset.i][0];
};
setLook(st.look);
setView(st.view);
setSpeed(st.speed);
setPlay(st.playing);
if (q.has('explode')) st.explode = st.explodeTo = 1;

// ---------- auto tour: the page drives itself until someone touches it ----------
const TOUR = [
  [0, () => { st.t = T.start; setPlay(true); setSpeed(1); setLook('solid'); setView('stack'); setExplode(false); }, '#look [data-v=solid]'],
  [9, () => setSpeed(10), '#speed [data-v="10"]'],
  [12, () => setLook('cut'), '#look [data-v=cut]'],
  [19, () => setView('engines'), '#view [data-v=engines]'],
  [24, () => setView('stack'), '#view [data-v=stack]'],
  [27, () => setSpeed(1), '#speed [data-v="1"]'],
  [33, () => setSpeed(60), '#speed [data-v="60"]'],
  [36, () => setLook('xray'), '#look [data-v=xray]'],
  [40, () => setView('capsule'), '#view [data-v=capsule]'],
  [44, () => { setView('stack'); setLook('cut'); }, '#view [data-v=stack]'],
  [48, () => { setPlay(false); st.t = T.start; setExplode(true); }, '#explode'],
  [54, () => setExplode(false), '#explode'],
  [57, () => {}, null],
];
let tourT = 0;
let tourI = 0;
let quiet = 0;
const cursor = $('cursor');
const handOver = () => {
  quiet = 0;
  if (st.auto) {
    st.auto = false;
    cursor.style.opacity = 0;
  }
};
for (const ev of ['pointerdown', 'wheel', 'keydown', 'touchstart']) addEventListener(ev, (e) => e.isTrusted && handOver(), {passive: true, capture: true});
addEventListener('keydown', (e) => {
  if (e.key === ' ') { e.preventDefault(); $('play').click(); }
  if (e.key === 'ArrowRight') st.t = Math.min(T.end, st.t + 5);
  if (e.key === 'ArrowLeft') st.t = Math.max(T.start, st.t - 5);
});
const runTour = (dt) => {
  if (!st.auto) {
    quiet += dt;
    if (quiet > 25 && !q.has('notour')) { st.auto = true; tourT = 0; tourI = 0; }
    return;
  }
  tourT += dt;
  while (tourI < TOUR.length && tourT >= TOUR[tourI][0]) {
    const [, fn, sel] = TOUR[tourI++];
    fn();
    const el = sel && document.querySelector(sel);
    if (el) {
      const r = el.getBoundingClientRect();
      cursor.style.opacity = 1;
      cursor.style.transform = `translate(${r.left + r.width / 2}px, ${r.top + r.height / 2}px)`;
    }
  }
  if (tourI >= TOUR.length) { tourT = 0; tourI = 0; }
};

// ---------- frame: everything below is a function of st.t ----------
const SKY = [new THREE.Color(0xdfe9f3), new THREE.Color(0x0a0f1e)];
const bg = new THREE.Color();
const tmp = new THREE.Vector3();
const smooth = (a, b, x) => { const k = Math.min(1, Math.max(0, (x - a) / (b - a))); return k * k * (3 - 2 * k); };
const drop = (g, dt, v, a, away = 0) => {
  g.visible = dt < 26;
  g.position.set(dt > 0 ? away * dt : 0, dt > 0 ? -(v * dt + a * dt * dt) : 0, 0);
  g.rotation.z = dt > 0 ? 0.012 * dt : 0;
};
function pose(s, wall) {
  const t = s.t;
  drop(g1, t - T.sep1, 3, 0.9);
  drop(gRing, t - T.skirt, 2, 1.2);
  drop(g2, t - T.sep2, 3, 0.9);
  const lt = t - T.les;
  gLes.visible = lt < 9;
  gLes.position.set(lt > 0 ? 9 * lt : 0, lt > 0 ? 14 * lt : 0, 0);
  // Exploded view spreads the stages along the axis.
  const e = st.explode;
  gRing.position.y += 10 * e;
  g2.position.y += 20 * e;
  g3.position.y = 32 * e;
  gLes.position.y += 44 * e;
  tanks.forEach((k, i) => {
    const f = Math.max(0.001, s.fill[i]);
    k.liquid.scale.y = k.h * f;
    k.liquid.position.y = k.y0 + (k.h * f) / 2;
    k.liquid.visible = s.fill[i] > 0.004;
  });
  // Plumes: longer and wider as the outside pressure falls.
  const wide = 1 + 5 * smooth(8000, 70000, s.alt);
  const flick = 1 + 0.05 * Math.sin(wall * 47) + 0.03 * Math.sin(wall * 113);
  const sizes = [[s.eng[0] / 5, 5.6 * wide, 90 + 60 * smooth(0, 60000, s.alt)], [s.eng[1] / 5, 6.5, 46], [s.eng[2], 2.6, 30]];
  sizes.forEach(([on, r, len], i) => {
    const ramp = i === 0 && t < 0 ? smooth(T.start + 3, -0.5, t) : 1;
    for (const [m, k] of [[plumes[i], 1], [cores[i], 0.45]]) {
      m.visible = on > 0;
      m.scale.set(r * k * Math.sqrt(on), len * k * flick * ramp, r * k * Math.sqrt(on));
      m.position.y = m.userData.y - (len * k * flick * ramp) / 2;
      m.material.opacity = (i === 0 ? 0.55 : 0.28) * (k === 1 ? 1 : 1.5);
    }
  });
  rig.rotation.z = (-(90 - s.pitch) * Math.PI) / 180;
  pad.visible = s.alt < 2500;
  pad.position.y = -s.alt;
  bg.lerpColors(SKY[0], SKY[1], smooth(9000, 75000, s.alt));
  scene.background = bg;
}
const camState = {yc: 55, dist: 262};
function aim(s, dt) {
  const top = 101 + 54 * st.explode;
  const base = s.stage === 0 ? 0 : s.stage === 1 ? 43 : 68;
  const mid = (base + top) / 2;
  const span = top - base;
  const goalY = st.view === 'engines' ? base + 4 : st.view === 'capsule' ? 93 : mid;
  const k = 1 - Math.exp(-dt * 3);
  camState.yc += (goalY - camState.yc) * k;
  rig.updateMatrixWorld();
  tmp.set(0, camState.yc, 0).applyMatrix4(rig.matrixWorld);
  const delta = tmp.clone().sub(controls.target);
  controls.target.copy(tmp);
  camera.position.add(delta);
  if (camGoal) {
    const want = st.view === 'stack' ? Math.max(120, span * 2.5) * (innerWidth < 820 ? 1.5 : 1) : camGoal.dist;
    const off = camera.position.clone().sub(controls.target);
    const d = off.length();
    const nd = d + (want - d) * k;
    off.multiplyScalar(nd / d);
    off.y += (Math.sin(camGoal.el) * nd - off.y) * k;
    camera.position.copy(controls.target).add(off);
    if (Math.abs(want - d) < 1) camGoal = st.view === 'stack' && st.auto ? camGoal : null;
  }
}
function panels(s) {
  const tt = Math.abs(s.t);
  $('clk').textContent = `T${s.t < 0 ? '-' : '+'}${String(Math.floor(tt / 60)).padStart(2, '0')}:${String(Math.floor(tt % 60)).padStart(2, '0')}`;
  $('cap').textContent = caption(s.t);
  READ.forEach(([, f], i) => ($(`rd${i}`).textContent = f(s)));
  TANKS.forEach(([, , key], i) => {
    $(`tk${i}`).style.width = `${Math.max(0, s.fill[i]) * 100}%`;
    $(`tv${i}`).textContent = `${fmt(s.tons[key] / 1000)} t`;
  });
  const x = ((s.t - T.start) / (T.end - T.start)) * 300;
  for (const c of [gCur, hCur]) { c.setAttribute('x1', x); c.setAttribute('x2', x); }
  $('gNow').textContent = `${fmt(s.g, 2)} g`;
  $('hNow').textContent = `${fmt(s.alt / 1000, 1)} km`;
  $('scrub').value = s.t;
  let cur = 0;
  EVENTS.forEach(([t], i) => { if (s.t >= t - 0.05) cur = i; });
  document.querySelectorAll('#chips button').forEach((b, i) => b.classList.toggle('on', i === cur));
}
const resize = () => {
  const w = innerWidth;
  const h = innerHeight;
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  // Keep the machine clear of the panels: shift the projection centre into the open part of the screen.
  if (w >= 820) camera.setViewOffset(w, h, 0, h * 0.05, w, h);
  else camera.setViewOffset(w, h, 0, h * 0.06, w, h);
  camera.updateProjectionMatrix();
};
addEventListener('resize', resize);
resize();
let last = performance.now();
let wall = 0;
function frame(now) {
  const dt = Math.min(0.1, (now - last) / 1000);
  last = now;
  wall += dt;
  runTour(dt);
  if (st.playing) {
    st.t += dt * st.speed;
    if (st.t >= T.end) { st.t = T.end; if (st.auto) st.t = T.start; else setPlay(false); }
  }
  st.explode += (st.explodeTo - st.explode) * (1 - Math.exp(-dt * 5));
  const s = model.state(st.t);
  pose(s, wall);
  aim(s, dt);
  controls.update();
  panels(s);
  renderer.render(scene, camera);
  requestAnimationFrame(frame);
}
window.SIM = {st, model, FLOW, S1, S2, S3};
requestAnimationFrame(frame);
