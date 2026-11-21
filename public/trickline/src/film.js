// The Trickline film: R-07's run through Civic Plaza's three stations, cut like the simulator's plant film. One
// camera at one angle (azimuth 32, elevation 26) that only pans and zooms; the story moves through clicks, the
// station switcher and its dropdown. Every number on the page is read from the scene at that frame: the process
// sheets fill as the tricks happen, the speeds and the air times come from the solved run.
//
// The film's clock runs slow through each trick (4x at S1 and S2, 5x at S3). tauAt(t) maps film time to world
// time; the scene, the cards and the numbers run on world time, the cursor, the clicks and the card pops on film
// time. render(t) is a pure function of t.
import * as THREE from 'three'
import { TOY, createToyStage } from './simulator/airport-shared/style.js'
import { createToyUI, ICONS } from './simulator/airport-shared/ui.js'
import { createSelection } from './simulator/airport-shared/select.js'
import { thumb } from './simulator/airport-shared/thumbs.js'
import { BOARD, PLAZA, RAIL_SLOPE } from './layout.js'
import { RUN, POP, TRICK_INFO, heroAt, secondAt } from './motion.js'
import { buildWorld, groundAt } from './world.js'
import { buildBoard, buildRider } from './rider.js'

const D2R = Math.PI / 180
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x))
const sm = (x) => {
  const u = clamp(x)
  return u * u * u * (u * (u * 6 - 15) + 10)
}
const ss = (a, b, t) => sm((t - a) / (b - a))
const lerp = (a, b, k) => a + (b - a) * k
const pc = (a, b, t) => clamp((t - a) / (b - a))
const kmh = (v) => (v * 3.6).toFixed(1)
const deg = (r) => Math.round(r / D2R)
const V = (x = 0, y = 0, z = 0) => new THREE.Vector3(x, y, z)

const { S1, S2, S3, GR, OFF, pushes, brake } = RUN
const AIRS = { S1, S2, S3 }
const GRIP = BOARD.grip
const GRIND_LEN = GR.sOff // metres of rail the hangers slide
const RAIL_DEG = Math.round((RAIL_SLOPE / D2R) * 10) / 10

// ------------------------------------------------------------------------------------------- the film's clock
// the slow windows, in world time: from just before each pop to just after each landing, eased in and out
const SLOW = [
  { a: S1.tp - 0.25, b: S1.tl + 0.2, r: 0.25 },
  { a: S2.tp - 0.25, b: S2.tl + 0.2, r: 0.25 },
  { a: S3.tp - 0.25, b: OFF.tl + 0.25, r: 0.2 },
]
const RAMP = 0.16
const slowW = (s, tau) => ss(s.a - RAMP, s.a, tau) * (1 - ss(s.b, s.b + RAMP, tau))
const rateAt = (tau) => SLOW.reduce((r, s) => Math.min(r, 1 - (1 - s.r) * slowW(s, tau)), 1)
const WARP = (() => {
  const dt = 0.0005
  const n = Math.ceil(RUN.end / dt)
  const film = new Float64Array(n + 1)
  for (let i = 1; i <= n; i++) film[i] = film[i - 1] + dt / rateAt((i - 0.5) * dt)
  return { dt, n, film }
})()
export const DUR = WARP.film[WARP.n]
/** film time at world time tau */
export function filmOf(tau) {
  const f = clamp(tau / WARP.dt, 0, WARP.n)
  const i = Math.min(WARP.n - 1, Math.floor(f))
  return lerp(WARP.film[i], WARP.film[i + 1], f - i)
}
/** world time at film time t */
export function tauAt(t) {
  const F = WARP.film
  if (t <= 0) return 0
  if (t >= DUR) return WARP.n * WARP.dt
  let lo = 0
  let hi = WARP.n
  while (hi - lo > 1) {
    const mid = (lo + hi) >> 1
    if (F[mid] <= t) lo = mid
    else hi = mid
  }
  return (lo + (t - F[lo]) / (F[hi] - F[lo])) * WARP.dt
}
const slowFactor = (tau) => {
  for (const s of SLOW) if (slowW(s, tau) > 0.5) return Math.round(1 / s.r)
  return 0
}

// ------------------------------------------------------------------------------------------- the run, tabled
// the board's and the pelvis's paths every 10 ms, for the camera's smoothing, the speeds and the peaks
const PATH = (() => {
  const dt = 0.01
  const n = Math.ceil((RUN.end + 0.4) / dt)
  const A = () => new Float32Array(n + 1)
  const P = { dt, n, bx: A(), by: A(), bz: A(), px: A(), py: A(), pz: A(), sp: A(), peak: A() }
  for (let i = 0; i <= n; i++) {
    const h = heroAt(i * dt)
    P.bx[i] = h.board.pos.x
    P.by[i] = h.board.pos.y
    P.bz[i] = h.board.pos.z
    P.px[i] = h.pose.pelvis.x
    P.py[i] = h.pose.pelvis.y
    P.pz[i] = h.pose.pelvis.z
  }
  // the rider's speed: the pelvis's, central differences
  for (let i = 0; i <= n; i++) {
    const a = Math.max(0, i - 1)
    const b = Math.min(n, i + 1)
    P.sp[i] = Math.hypot(P.px[b] - P.px[a], P.py[b] - P.py[a], P.pz[b] - P.pz[a]) / ((b - a) * dt)
    P.peak[i] = Math.max(P.sp[i], i ? P.peak[i - 1] : 0)
  }
  return P
})()
const at = (arr, tau) => {
  const f = clamp(tau / PATH.dt, 0, PATH.n)
  const i = Math.min(PATH.n - 1, Math.floor(f))
  return lerp(arr[i], arr[i + 1], f - i)
}
/** the board's height over the line under it (the deck, the channel bridged, the stairs' nosings), and its peak in
 *  each air: over the stairs that is how far it clears the steps */
const clearAt = (tau) => at(PATH.by, tau) - GRIP - groundAt(at(PATH.bx, tau))
const peakOver = (A) => {
  let m = 0
  for (let tau = A.tp; tau <= A.tl; tau += PATH.dt) m = Math.max(m, clearAt(tau))
  return m
}
const PEAK = { S1: peakOver(S1), S2: peakOver(S2) }

// ------------------------------------------------------------------------------------------- what the run reads
const uTau = (A, u) => A.tp + u * A.T
const airAt = (tau) => [S1, S2, S3, OFF].reduce((s, A) => s + clamp(tau - A.tp, 0, A.T), 0)
const airsDone = (tau) => [S1, S2, S3, OFF].filter((A) => tau >= A.tl).length
const longestAir = (tau) =>
  [S1, S2, S3, OFF].filter((A) => tau >= A.tl).reduce((m, A) => Math.max(m, A.T), 0)
const PASS = { S1: S1.tl + 0.3, S2: S2.tl + 0.3, S3: OFF.tl + 0.3 }
const passed = (tau) => Object.values(PASS).filter((p) => tau >= p).length
const landedAt = (tau) => (tau >= OFF.tl ? 'S3' : tau >= S2.tl ? 'S2' : tau >= S1.tl ? 'S1' : null)
const STATION_END = { S1: S1.tl + 0.5, S2: S2.tl + 0.5, S3: OFF.tl + 0.5 }
const STATION_START = { S1: S1.tp - 0.95, S2: S2.tp - 0.95, S3: S3.tp - 0.95 }
/** the flip and shove so far at a station, in degrees */
const turnAt = (k, tau, h) => {
  const I = TRICK_INFO[k]
  const A = AIRS[k]
  if (tau < uTau(A, I.flip[0])) return { phi: 0, psi: 0 }
  if (tau >= A.tl || h.station !== k || !(h.phase === 'flip' || h.phase === 'air'))
    return { phi: I.phi, psi: I.psi }
  return { phi: Math.abs(h.flip.phi) / D2R, psi: Math.abs(h.flip.psi) / D2R }
}
const NAMES = { S1: 'Fountain gap', S2: 'Four-stair', S3: 'Ten-stair rail' }
const TRICK = { S1: 'Hardflip', S2: 'Laser flip', S3: 'Kickflip BS 50-50' }

/** each station's process sheet: [op, what, progress 0..1] */
function opsFor(k, tau, h) {
  const A = AIRS[k]
  const I = TRICK_INFO[k]
  const approach = [
    'OP10',
    `Approach · ${kmh(at(PATH.sp, Math.min(tau, A.tp - 0.45)))} km/h`,
    pc(A.tp - 3.0, A.tp - 0.42, tau),
  ]
  const pop = ['OP20', `Pop · tail down ${deg(POP.pitch)}°`, pc(A.tp - 0.42, A.tp, tau)]
  const t = turnAt(k, tau, h)
  if (k === 'S3') {
    const g = clamp((tau - GR.t0) / GR.T)
    return [
      ['OP10', `Approach · drift to the rail`, pc(A.tp - 3.0, A.tp - 0.42, tau)],
      ['OP20', `Pop · kickflip ${Math.round(t.phi)}°`, pc(A.tp - 0.42, uTau(A, I.flip[1]), tau)],
      ['OP30', 'Catch · over the rail', pc(uTau(A, I.flip[1]), A.tl, tau)],
      ['OP40', 'Lock · both trucks on', pc(A.tl, A.tl + 0.1, tau)],
      ['OP50', `Grind · ${(g * GRIND_LEN).toFixed(2)} m of ${GRIND_LEN.toFixed(2)}`, g],
      ['OP60', 'Pop off · land', pc(OFF.tp, OFF.tl + 0.5, tau)],
    ]
  }
  const turn =
    k === 'S1'
      ? `Flip · ${Math.round(t.phi)}° + shove ${Math.round(t.psi)}°`
      : `Flip · heel ${Math.round(t.phi)}° + shove ${Math.round(t.psi)}°`
  return [
    approach,
    pop,
    ['OP30', turn, pc(uTau(A, I.flip[0]), uTau(A, I.flip[1]), tau)],
    ['OP40', 'Catch · both feet back on', pc(uTau(A, I.flip[1]), uTau(A, I.catch), tau)],
    [
      'OP50',
      k === 'S2'
        ? `Land · ${(PLAZA.upper.y - PLAZA.middle.y).toFixed(1)} m down`
        : 'Land · roll away',
      pc(A.tl, A.tl + 0.5, tau),
    ],
  ]
}
const stationProg = (k, tau, h) => {
  const ops = opsFor(k, tau, h)
  return ops.reduce((s, o) => s + o[2], 0) / ops.length
}
const stationState = (k, tau) =>
  tau < STATION_START[k]
    ? ['Waiting', 'wait']
    : tau < STATION_END[k]
      ? ['In process', 'in']
      : ['Passed', 'go']

/** R-07's stage: [status, detail, class] */
function riderStage(tau, h) {
  const k = h.station
  const land = landedAt(tau)
  switch (h.phase) {
    case 'idle':
      return ['Ready', 'Upper terrace · one foot down', 'wait']
    case 'push': {
      const i = pushes.findIndex((p) => tau >= p.s - 0.3 && tau <= p.back + 0.25)
      return ['Pushing', `Push ${Math.max(1, i + 1)} · ${kmh(at(PATH.sp, tau))} km/h`, 'in']
    }
    case 'setup':
      return ['Setting up', `${k} · feet set for the ${TRICK[k].toLowerCase()}`, 'in']
    case 'flip':
      return ['Flipping', `${k} · ${TRICK[k]}`, 'in']
    case 'air':
      return [
        'Caught',
        k === 'S3' ? 'S3 · dropping onto the rail' : `${k} · ${TRICK[k]} · landing`,
        'in',
      ]
    case 'grind':
      return [
        'Grinding',
        `S3 · 50-50 · ${(h.grindU * GRIND_LEN).toFixed(2)} of ${GRIND_LEN.toFixed(2)} m`,
        'in',
      ]
    case 'pop-off':
      return ['Popping off', 'S3 · off the end of the rail', 'in']
    case 'land':
      return ['Landed', `${land} · ${TRICK[land]} clean`, 'go']
    case 'brake':
      return ['Braking', 'Lower plaza · foot brake', 'go']
  }
  if (!k) return ['Line done', '3 / 3 stations clean', 'go']
  const A = AIRS[k]
  return [
    'Rolling',
    `To ${k} · ${TRICK[k]} · ${Math.max(0, A.xp - h.board.pos.x).toFixed(1)} m`,
    'in',
  ]
}
const whereOf = (tau) =>
  tau < STATION_START.S1
    ? 'Upper terrace'
    : tau < STATION_END.S1
      ? 'S1 · gap'
      : tau < STATION_START.S2
        ? 'Upper terrace'
        : tau < STATION_END.S2
          ? 'S2 · 4-stair'
          : tau < STATION_START.S3
            ? 'Middle terrace'
            : tau < STATION_END.S3
              ? 'S3 · rail'
              : 'Lower plaza'
const LINE = { x0: RUN.xs[0], x1: RUN.xs[Math.floor(RUN.end / RUN.dt)] }
const lineProg = (h) => clamp((h.board.pos.x - LINE.x0) / (LINE.x1 - LINE.x0))

// ------------------------------------------------------------------------------------------- the page's words
// three-shade glyphs in the toolkit's style for the KPI cards and the tracker
Object.assign(ICONS, {
  stairs: `<svg viewBox="0 0 40 40" width="26" height="26"><path d="M4 35V27h8v-8h8v-8h8V3h8v32z" fill="#3166ea"/><path d="M4 27h8v-8h8v-8h8V3h8v3h-5v8h-8v8h-8v8H4z" fill="#6f98f7"/></svg>`,
  gauge: `<svg viewBox="0 0 40 40" width="26" height="26"><path d="M4 29a16 16 0 0132 0z" fill="#6f98f7"/><path d="M9 29a11 11 0 0122 0z" fill="#3166ea"/><path d="M20 29l7-10" stroke="#fff" stroke-width="3" stroke-linecap="round"/><circle cx="20" cy="29" r="3.2" fill="#2448c8"/></svg>`,
  air: `<svg viewBox="0 0 40 40" width="26" height="26"><path d="M5 33C10 9 30 9 35 33" stroke="#6f98f7" stroke-width="3.4" fill="none" stroke-linecap="round" stroke-dasharray="2 5"/><rect x="11" y="10" width="18" height="5.5" rx="2.75" fill="#3166ea" transform="rotate(-14 20 13)"/><circle cx="14" cy="19" r="2.4" fill="#2448c8"/><circle cx="25" cy="16.4" r="2.4" fill="#2448c8"/></svg>`,
  deck: `<svg viewBox="0 0 40 40" width="26" height="26"><path d="M3 15c2 3 4 4 7 4h20c3 0 5-1 7-4" stroke="#6f98f7" stroke-width="3" fill="none" stroke-linecap="round"/><rect x="7" y="16" width="26" height="5" rx="2.5" fill="#3166ea"/><circle cx="12" cy="26" r="4" fill="#1a2440"/><circle cx="28" cy="26" r="4" fill="#1a2440"/></svg>`,
})
const sv = (d, sw = 2) =>
  `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#fff" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`
const STEP_ICONS = {
  push: sv('<path d="M3 12h13M12 7l5 5-5 5"/><path d="M3 18h6"/>'),
  flip: sv('<path d="M20 12a8 8 0 11-2.6-5.9"/><path d="M20 3v5h-5"/>'),
  rail: sv('<path d="M3 7l18 9M7 9v11M17 14v6"/>'),
  flag: sv('<path d="M5 21V4h12l-2.5 4.5L17 13H5"/>'),
}
export const UI_WORDS = {
  brand: 'Trickline',
  search: 'Search riders, boards, spots, sheets...',
  user: ['Juno Park', 'Session lead'],
  trackIcon: 'deck',
  dropTitle: 'LINE 1 · STATIONS',
  stepIcons: STEP_ICONS,
  kpis: [
    {
      ic: 'stairs',
      k: 'Stations passed',
      key: 'a',
      v: '0 / 3',
      d: '0 clean',
      s: 'Line 1 · S1 · S2 · S3',
    },
    {
      ic: 'gauge',
      k: 'Rider speed, km/h',
      key: 'b',
      v: '0.0',
      d: 'peak 0.0',
      s: 'R-07 · board 0712',
    },
    { ic: 'air', k: 'Air time', key: 'c', v: '0.00 s', d: '0 airs', s: 'longest —' },
  ],
}
const SITES = {
  L1: ['L1', 'Civic Plaza · Line 1', '3 stations · 1 rider'],
  S1: ['S1', 'S1 · Fountain gap', 'Hardflip · 1.7 m of water'],
  S2: [
    'S2',
    'S2 · Four-stair',
    `Laser flip · ${(PLAZA.upper.y - PLAZA.middle.y).toFixed(1)} m drop`,
  ],
  S3: ['S3', 'S3 · Ten-stair rail', `Kickflip BS 50-50 · ${RAIL_DEG}°`],
}

// ------------------------------------------------------------------------------------------- the story
const AZ = 32
const EL = 26
const T_DROP = filmOf(S1.tl + 0.5)
const CLICKS = [
  { t: 1.6, at: 'rider', card: 'rider' },
  { t: filmOf(4.35), at: 'board', card: 'board' },
  { t: filmOf(S1.tp - 1.4), at: 'S1', card: 'S1', site: 'S1' },
  { t: T_DROP, ui: 'dd', drop: 'open' },
  { t: T_DROP + 0.95, ui: 'drop1', card: 'S2', site: 'S2' },
  { t: filmOf(S3.tp - 1.35), at: 'S3', card: 'S3', site: 'S3' },
  { t: filmOf(OFF.tl + 2.55), at: 'rider', card: 'rider', site: 'L1' },
  { t: DUR - 4.75, ui: 'home', tool: 6, card: 'site', site: 'L1' },
]
export const FILM_CLICKS = CLICKS.map((c) => c.t)
/** film times worth jumping to: the stations' slow windows, a beat early */
export const CHAPTERS = [
  { key: 'S1', label: 'S1 · Hardflip', t: filmOf(S1.tp - 1.2) },
  { key: 'S2', label: 'S2 · Laser flip', t: filmOf(S2.tp - 1.2) },
  { key: 'S3', label: 'S3 · Kickflip BS 50-50', t: filmOf(S3.tp - 1.3) },
]
const T_HOME = CLICKS.at(-1).t

// the camera's holds on the stations, in world time: in, out, and where it looks. A hold with `pre` first widens to
// take in R-07 and the station together (pk of the way from the rider to it, at distance pd or more), so the cursor
// can click a station while the rider is still on the way to it.
const HOLDS = [
  {
    pre: [S1.tp - 3.0, S1.tp - 2.0],
    pk: 0.55,
    pd: 17,
    tin: [S1.tp - 1.2, S1.tp - 0.3],
    tout: [S1.tl - 0.05, S1.tl + 0.95],
    x: (S1.xp + S1.xl) / 2,
    y: PLAZA.upper.y + 0.8,
    z: 0.1,
    d: 11,
  },
  {
    tin: [S2.tp - 1.1, S2.tp - 0.3],
    tout: [S2.tl - 0.05, S2.tl + 0.95],
    x: (S2.xp + S2.xl) / 2 + 0.25,
    y: 2.95,
    z: 0.1,
    d: 12.5,
  },
  {
    pre: [S3.tp - 3.1, S3.tp - 2.1],
    pk: 0.5,
    pd: 19,
    tin: [S3.tp - 1.5, S3.tp - 0.4],
    tout: [OFF.tl - 0.05, OFF.tl + 0.75],
    x: 5.0,
    y: 2.0,
    z: -0.4,
    d: 17.5,
  },
]
const HOME = { x: -5, y: 1, z: -1.5, d: 148 }

export async function createFilm({ app, canvas, capture = false }) {
  // the labels on the plaza and the UI are set in Inter: wait for it (or give up after 2.5 s and use what is there)
  await Promise.race([
    Promise.all(
      [
        'italic 800 64px Inter',
        '800 16px Inter',
        '700 16px Inter',
        '600 16px Inter',
        '500 16px Inter',
      ].map((f) => document.fonts.load(f))
    ),
    new Promise((r) => setTimeout(r, 2500)),
  ]).catch(() => {})

  const st = createToyStage(canvas, { fov: 28 })
  st.camera.near = 0.5
  st.scene.fog.near = 260
  st.scene.fog.far = 900
  st.gtao.updateGtaoMaterial({ radius: 0.55, thickness: 0.35, distanceExponent: 1.3, scale: 1.0 })
  st.gtao.blendIntensity = 0.7
  st.sun.shadow.bias = -0.0003
  const W = buildWorld()
  st.scene.add(W.root)
  W.pose(0)

  // ------------------------------------------------------------------ thumbnails
  // the stations are snapshots of the plaza itself, from the cards' angle; the rider and the board are their models
  const SUN_DIR = V(-0.78, 1, -0.36).normalize()
  const shadowBox = (cx, cz, S) => {
    const sc = st.sun.shadow.camera
    sc.left = sc.bottom = -S
    sc.right = sc.top = S
    sc.updateProjectionMatrix()
    st.sun.shadow.normalBias = S * 0.0011
    st.sun.target.position.set(cx, 0, cz)
    st.sun.position.copy(st.sun.target.position).addScaledVector(SUN_DIR, 420)
    st.sun.target.updateMatrixWorld()
  }
  const snap = (target, dist, { az = 38, el = 30, size = 176 } = {}) => {
    const r = st.renderer
    r.setPixelRatio(1)
    r.setSize(size, size, false)
    const cam = new THREE.PerspectiveCamera(24, 1, 0.3, 900)
    cam.position.set(
      target.x + dist * Math.cos(el * D2R) * Math.sin(az * D2R),
      target.y + dist * Math.sin(el * D2R),
      target.z + dist * Math.cos(el * D2R) * Math.cos(az * D2R)
    )
    cam.lookAt(target)
    shadowBox(target.x, target.z, Math.max(10, dist * 0.7))
    r.render(st.scene, cam)
    return r.domElement.toDataURL('image/png')
  }
  const P = PLAZA
  const TH = {
    S1: snap(V((P.gap.x0 + P.gap.x1) / 2, P.upper.y - 0.1, 0.3), 7.2),
    S2: snap(V(P.four.x0 + 0.45, (P.upper.y + P.middle.y) / 2, 0.2), 7.6),
    S3: snap(V(5.35, 1.05, -0.7), 9.6),
    site: snap(V(-4, 0.5, -1), 86, { el: 34 }),
  }
  {
    // R-07 on 0712, rolling, moved to the origin
    const r = buildRider({ tee: TOY.blue, number: '07', cap: TOY.white, ink: TOY.white })
    const b = buildBoard({ number: '0712' })
    const h = heroAt(7.0)
    const d = h.board.pos
      .clone()
      .negate()
      .setY(-(h.board.pos.y - GRIP))
    const P2 = h.pose
    r.pose({
      ...P2,
      pelvis: P2.pelvis.clone().add(d),
      look: P2.look.clone().add(d),
      feet: P2.feet.map((f) => ({ pos: f.pos.clone().add(d), dir: f.dir, up: f.up })),
      hands: P2.hands?.map((x) => x.clone().add(d)),
    })
    b.group.position.copy(h.board.pos).add(d)
    b.group.quaternion.copy(h.board.quat)
    const g = new THREE.Group()
    g.add(r.group, b.group)
    TH.rider = thumb(g, { pad: 1.02 })
    // the board on its side: the yellow bottom, the trucks, the wheels
    const b2 = buildBoard({ number: '0712' })
    b2.group.rotation.set(-2.2, -0.35, 0.18)
    TH.board = thumb(b2.group, { pad: 1.0 })
  }

  // ------------------------------------------------------------------ the page
  // the live pill keeps one width whatever it says, so the switcher and its dropdown button stay put; the open
  // dropdown sits over the zoom tools
  const fix = document.createElement('style')
  fix.textContent =
    '.wt .live{width:140px;justify-content:center;white-space:nowrap}.wt .drop{z-index:4;background:#fff}'
  document.head.appendChild(fix)
  const ui = createToyUI(app, UI_WORDS)
  const sel = createSelection(st.scene, st, { core: 0.14, halo: 0.5, pad: 0.05 })
  const rs = () => {
    const r = Math.min(window.devicePixelRatio || 1, 2)
    const k = Math.min(window.innerWidth / 1600, window.innerHeight / 900)
    return capture ? r : clamp(k * r, 0.6, 1.5)
  }
  const resize = (k) => st.resize(1600, 900, k ?? rs())
  resize()

  // ------------------------------------------------------------------ the camera
  const ride = (tau) => {
    let x = 0
    let y = 0
    let z = 0
    const N = 9
    for (let i = 0; i < N; i++) {
      const tt = tau + (i / (N - 1) - 0.5) * 0.9
      const bx = at(PATH.bx, tt)
      x += bx
      z += at(PATH.bz, tt)
      y += groundAt(bx)
    }
    return { x: x / N + 1.1, y: y / N + 0.95, z: z / N, d: lerp(12.5, 15.5, ss(1.2, 4.6, tau)) }
  }
  const camAt = (t) => {
    const tau = tauAt(t)
    const c = ride(tau)
    // first the wide shots that show a station before R-07 reaches it, then the holds on the stations themselves
    for (const H of HOLDS) {
      if (!H.pre) continue
      const w = ss(H.pre[0], H.pre[1], tau) * (1 - ss(H.tout[0], H.tout[1], tau))
      if (w <= 0) continue
      c.x = lerp(c.x, H.x, H.pk * w)
      c.y = lerp(c.y, H.y, H.pk * w)
      c.z = lerp(c.z, H.z, H.pk * w)
      c.d = lerp(c.d, Math.max(c.d, H.pd), w)
    }
    for (const H of HOLDS) {
      const w = ss(H.tin[0], H.tin[1], tau) * (1 - ss(H.tout[0], H.tout[1], tau))
      if (w <= 0) continue
      c.x = lerp(c.x, H.x, w)
      c.y = lerp(c.y, H.y, w)
      c.z = lerp(c.z, H.z, w)
      c.d = lerp(c.d, H.d, w)
    }
    // home: out over the whole plaza, the zoom even in log distance; the target moves as the view widens, so R-07
    // stays in frame on the way out
    const w = ss(T_HOME, T_HOME + 2.9, t)
    if (w > 0) {
      const d = Math.exp(lerp(Math.log(c.d), Math.log(HOME.d), w))
      const k = (d - c.d) / (HOME.d - c.d)
      c.x = lerp(c.x, HOME.x, k)
      c.y = lerp(c.y, HOME.y, k)
      c.z = lerp(c.z, HOME.z, k)
      c.d = d
    }
    return {
      tx: c.x,
      ty: c.y,
      tz: c.z,
      az: AZ * D2R,
      el: EL * D2R,
      d: c.d,
      fov: 28,
      sx: -110,
      sy: 26,
    }
  }
  // a camera for projecting points at another moment than this frame's (where the cursor clicked)
  const pcam = new THREE.PerspectiveCamera(28, 16 / 9, 0.5, 2000)
  const projectWith = (p, cam) => {
    const { tx, ty, tz, az, el, d } = cam
    pcam.position.set(
      tx + d * Math.cos(el) * Math.sin(az),
      ty + d * Math.sin(el),
      tz + d * Math.cos(el) * Math.cos(az)
    )
    pcam.lookAt(tx, ty, tz)
    pcam.setViewOffset(1600, 900, -cam.sx, -cam.sy, 1600, 900)
    pcam.updateMatrixWorld()
    const v = p.clone().project(pcam)
    return v.z > 1 ? null : [(v.x * 0.5 + 0.5) * 1600, (-v.y * 0.5 + 0.5) * 900]
  }

  // ------------------------------------------------------------------ the cursor and the clicks
  let UIAT = null // measured below, once everything the first update needs exists
  const pointOf = (c, tau, h) => (c.ui ? null : W.clickAt[c.at](h ?? heroAt(tau)))
  const restAt = new Map() // where each click left the cursor: projected at the click's own moment
  const rest = (i) => {
    if (!restAt.has(i)) {
      const c = CLICKS[i]
      restAt.set(
        i,
        c.ui ? UIAT[c.ui] : (projectWith(pointOf(c, tauAt(c.t)), camAt(c.t)) ?? [800, 450])
      )
    }
    return restAt.get(i)
  }
  const GLIDE = 1.0
  const cursorAt = (t, tau, h) => {
    let prev = [1050, 620]
    let hand = true
    for (let i = 0; i < CLICKS.length; i++) {
      const c = CLICKS[i]
      if (t < c.t - GLIDE) return { p: prev, hand }
      if (t < c.t) {
        // the glide aims at where the thing is now, so the click lands on it
        const target = c.ui ? UIAT[c.ui] : (st.project(pointOf(c, tau, h)) ?? prev)
        const k = sm((t - (c.t - GLIDE)) / GLIDE)
        return {
          p: [
            lerp(prev[0], target[0], k),
            lerp(prev[1], target[1], k) - 16 * Math.sin(Math.PI * k),
          ],
          hand: !c.ui,
        }
      }
      prev = rest(i)
      hand = !c.ui
    }
    return { p: prev, hand }
  }
  const clickAt = (t) => {
    let v = 0
    for (const c of CLICKS) if (t >= c.t && t < c.t + 0.7) v = Math.max(v, 1 - (t - c.t) / 0.7)
    return v
  }
  const T_PICK = T_DROP + 0.95
  const dropOpen = (t) => ss(T_DROP, T_DROP + 0.3, t) * (1 - ss(T_PICK + 0.05, T_PICK + 0.3, t))
  const selection = (t) => {
    let cur = { kind: 'site', t0: -1 }
    for (const c of CLICKS) if (c.card && t >= c.t) cur = { kind: c.card, t0: c.t }
    return cur
  }
  const siteAt = (t) => {
    let s = 'L1'
    for (const c of CLICKS) if (c.site && t >= c.t) s = c.site
    return s
  }

  // ------------------------------------------------------------------ the cards
  const boardState = (h) =>
    h.phase === 'flip'
      ? ['Flipping', 'in']
      : h.phase === 'air' || h.phase === 'pop-off'
        ? ['In the air', 'in']
        : h.phase === 'grind'
          ? ['Grinding', 'in']
          : h.phase === 'brake'
            ? ['Braking', 'go']
            : h.phase === 'idle'
              ? ['Parked', 'wait']
              : ['Rolling', 'go']
  const flipsLogged = (tau) =>
    ['S1', 'S2', 'S3'].filter((k) => tau >= uTau(AIRS[k], TRICK_INFO[k].catch))
  function cardAt(t, kind, t0, tau, h) {
    const pop = ss(t0, t0 + 0.35, t)
    if (kind === 'rider') {
      const [s, txt, cls] = riderStage(tau, h)
      const next = h.station ? `${h.station} · ${TRICK[h.station]}` : 'Done · ride away'
      return {
        pop,
        thumb: TH.rider,
        org: 'RIDER · LINE 1',
        title: 'R-07',
        sub: 'Board 0712 · regular stance',
        stat: s,
        statCls: cls,
        statText: txt,
        prog: lineProg(h),
        progText: `${Math.round(100 * lineProg(h))}%`,
        rows: [
          ['Speed', `${kmh(at(PATH.sp, tau))} km/h`],
          ['Board', '0712', 1],
          ['Stance', 'Regular · left foot forward'],
          ['Next', next],
          ['Clean', `${passed(tau)} / 3 stations`],
          ['Air time', `${airAt(tau).toFixed(2)} s`],
        ],
      }
    }
    if (kind === 'board') {
      const [s, cls] = boardState(h)
      const logged = flipsLogged(tau)
      return {
        pop,
        thumb: TH.board,
        org: 'BOARD · R-07',
        title: '0712',
        sub: `Popsicle · ${(2 * BOARD.half).toFixed(2)} m · ${deg(BOARD.kickAngle)}° kicks`,
        stat: s,
        statCls: cls,
        statText: `Trucks ${(2 * BOARD.truckX).toFixed(2)} m apart · ${Math.round(2000 * BOARD.wheelR)} mm wheels`,
        prog: logged.length / 3,
        progText: `${logged.length}/3 flips`,
        rows: [
          [
            'Deck',
            `${(2 * BOARD.half).toFixed(2)} × ${BOARD.W.toFixed(2)} m · ${Math.round(1000 * BOARD.deck)} mm`,
          ],
          [
            'Flips logged',
            logged.length
              ? logged.map((k) => TRICK[k].replace('Kickflip BS 50-50', 'Kickflip')).join(' · ')
              : 'none yet',
          ],
          ['Flip now', `${deg(Math.abs(h.flip.phi))}° · shove ${deg(Math.abs(h.flip.psi))}°`],
          ['Pitch now', `${deg(Math.abs(h.flip.theta))}°`],
          ['Rider', 'R-07', 1],
        ],
      }
    }
    if (kind === 'S1' || kind === 'S2' || kind === 'S3') {
      const A = AIRS[kind]
      const [s, cls] = stationState(kind, tau)
      const ops = opsFor(kind, tau, h)
      const air = clamp(tau - A.tp, 0, A.T)
      const tn = turnAt(kind, tau, h)
      const eta = A.tp - tau
      const statText =
        s === 'Waiting'
          ? `R-07 in ${eta.toFixed(1)} s · ${Math.max(0, A.xp - h.board.pos.x).toFixed(1)} m out`
          : s === 'Passed'
            ? `R-07 · clean · ${(kind === 'S3' ? A.T + OFF.T : A.T).toFixed(2)} s in the air`
            : `R-07 · ${ops.find((o) => o[2] < 1)?.[1].split(' · ')[0] ?? 'Land'}`
      let stats
      if (kind === 'S3') {
        const g = clamp((tau - GR.t0) / GR.T)
        const v = tau < GR.t0 ? null : tau < GR.t1 ? GR.v0 + GR.a * (tau - GR.t0) : GR.vEnd
        stats = [
          ['Air to the rail', `${air.toFixed(2)} s`, `of ${A.T.toFixed(2)}`, air / A.T],
          ['Kickflip', `${Math.round(tn.phi)}°`, 'of 360°', tn.phi / 360, true],
          ['Grind', `${(g * GRIND_LEN).toFixed(2)} m`, `of ${GRIND_LEN.toFixed(2)}`, g, true],
          [
            'Rail speed',
            v == null ? '—' : `${v.toFixed(1)} m/s`,
            v == null ? '' : tau < GR.t1 ? 'down the rail' : 'at the pop-off',
            v == null ? 0 : clamp((v - 4) / 2.2),
          ],
        ]
      } else {
        const hn = tau >= A.tp && tau < A.tl ? Math.max(0, clearAt(tau)) : 0
        const after = tau >= A.tl
        stats = [
          [
            kind === 'S1' ? 'Board height' : 'Over the steps',
            after ? `${PEAK[kind].toFixed(2)} m` : `${hn.toFixed(2)} m`,
            after ? 'peak' : `of ${PEAK[kind].toFixed(2)}`,
            after ? 1 : clamp(hn / PEAK[kind]),
          ],
          ['Air time', `${air.toFixed(2)} s`, `of ${A.T.toFixed(2)}`, air / A.T],
          [
            kind === 'S1' ? 'Flip' : 'Heelflip',
            `${Math.round(tn.phi)}°`,
            `of ${Math.round(TRICK_INFO[kind].phi)}°`,
            tn.phi / TRICK_INFO[kind].phi,
            true,
          ],
          [
            'Shove',
            `${Math.round(tn.psi)}°`,
            `of ${Math.round(TRICK_INFO[kind].psi)}°`,
            tn.psi / TRICK_INFO[kind].psi,
            true,
          ],
        ]
      }
      return {
        pop,
        thumb: TH[kind],
        org: `${kind} · ${NAMES[kind].toUpperCase()}`,
        title: TRICK[kind],
        sub:
          kind === 'S1'
            ? `${(P.gap.x1 - P.gap.x0).toFixed(1)} m channel · deck to deck`
            : kind === 'S2'
              ? `${P.four.n} × ${P.four.rise.toFixed(1)} m risers · ${(P.upper.y - P.middle.y).toFixed(1)} m drop`
              : `${P.ten.n} stairs · rail at ${RAIL_DEG}°`,
        stat: s,
        statCls: cls,
        statText,
        prog: 0,
        progText: '',
        stats,
        fleet: { title: 'Process sheet', meta: `${ops[0][0]}–${ops.at(-1)[0]}`, rows: ops },
      }
    }
    // the line
    const n = passed(tau)
    return {
      pop,
      thumb: TH.site,
      org: 'CIVIC PLAZA',
      title: 'Line 1',
      sub: 'Push → S1 → S2 → S3 → ride away',
      stat: n < 3 ? 'Running' : 'Complete',
      statCls: 'go',
      statText: `1 rider on the line · ${n} / 3 stations passed`,
      prog: lineProg(h),
      progText: `${Math.round(100 * lineProg(h))}%`,
      rows: [
        ['Rider on the line', 'R-07 · board 0712', 1],
        ['Stations', 'S1 gap · S2 4-stair · S3 rail'],
        ['Line length', `${Math.round(LINE.x1 - LINE.x0)} m · ${P.upper.y.toFixed(1)} m down`],
        ['Air time', `${airAt(tau).toFixed(2)} s · ${airsDone(tau)} airs`],
        ['Session', 'Juno Park · F-01 filming'],
      ],
    }
  }

  const trackFor = (tau, h) => {
    const state = (a, b) => (tau < a ? '' : tau < b ? 'on' : 'done')
    const steps = [
      ['Push', 'Upper terrace', 'push', state(0, STATION_START.S1)],
      ['Hardflip', 'S1 · gap', 'flip', state(STATION_START.S1, STATION_END.S1)],
      ['Laser flip', 'S2 · 4-stair', 'flip', state(STATION_START.S2, STATION_END.S2)],
      ['K-flip 50-50', 'S3 · rail', 'rail', state(STATION_START.S3, STATION_END.S3)],
      ['Ride away', 'Lower plaza', 'flag', tau < STATION_END.S3 ? '' : 'on'],
    ]
    const edges = [0, STATION_START.S1, STATION_START.S2, STATION_START.S3, STATION_END.S3]
    let fill = 0
    for (let i = 0; i < 4; i++)
      if (tau >= edges[i]) fill = (i + pc(edges[i], edges[i + 1], tau)) / 4
    const [s, txt, cls] = riderStage(tau, h)
    return {
      title: 'Run Tracking',
      meta: 'R-07 · board 0712 · Line 1',
      fill,
      steps,
      ship: {
        thumb: TH.rider,
        id: 'R-07 · 0712',
        to: 'Line 1 · S1 → S2 → S3',
        stat: s,
        statCls: cls,
        meta: `${kmh(at(PATH.sp, tau))} km/h · ${airAt(tau).toFixed(2)} s air`,
      },
    }
  }
  const tableFor = (kind, tau, h, s2) => {
    const tabs = [
      ['People', '5'],
      ['Boards', '2'],
      ['Spots', '4'],
    ]
    if (kind === 'S1' || kind === 'S2' || kind === 'S3') {
      const row = (k, where) => {
        const [st2, cls] = stationState(k, tau)
        const p = Math.round(100 * stationProg(k, tau, h))
        return { id: k, org: NAMES[k], dot: TOY.blue, where, stat: st2, cls, p, pt: `${p}%` }
      }
      return {
        tabs,
        active: 2,
        site: 'Civic Plaza',
        rows: [
          row('S1', '1.7 m of water'),
          row('S2', `${P.four.n} × ${P.four.rise.toFixed(1)} m`),
          row('S3', `${P.ten.n} stairs · rail`),
          {
            id: 'P-1',
            org: 'Manual pad',
            dot: TOY.teal,
            where: 'Lower plaza',
            stat: 'Open',
            cls: 'wait',
            p: null,
            pt: 'R-02 near',
          },
        ],
      }
    }
    if (kind === 'board') {
      const [bs, bc] = boardState(h)
      return {
        tabs,
        active: 1,
        site: 'Civic Plaza',
        rows: [
          {
            id: '0712',
            org: 'R-07 · Line 1',
            dot: TOY.yellow,
            where: whereOf(tau),
            stat: bs,
            cls: bc,
            p: Math.round((100 * flipsLogged(tau).length) / 3),
            pt: `${flipsLogged(tau).length}/3 flips`,
          },
          {
            id: '0233',
            org: 'R-02 · free ride',
            dot: TOY.teal,
            where: 'Lower plaza · loop',
            stat: 'Rolling',
            cls: 'go',
            p: null,
            pt: `${kmh(s2.speed)} km/h`,
          },
        ],
      }
    }
    const [rs2, rc] = riderStage(tau, h)
    return {
      tabs,
      active: 0,
      site: 'Civic Plaza',
      rows: [
        {
          id: 'R-07',
          org: 'Line 1',
          dot: TOY.blue,
          where: whereOf(tau),
          stat: rs2,
          cls: rc,
          p: Math.round(100 * lineProg(h)),
          pt: `${Math.round(100 * lineProg(h))}%`,
        },
        {
          id: 'R-02',
          org: 'Free ride',
          dot: TOY.teal,
          where: 'Lower plaza · loop',
          stat: 'Cruising',
          cls: 'go',
          p: null,
          pt: `${kmh(s2.speed)} km/h`,
        },
        {
          id: 'F-01',
          org: 'Filmer',
          dot: TOY.orange,
          where: 'Lower plaza',
          stat: 'Recording',
          cls: 'in',
          p: null,
          pt: `${Math.floor(tau / 60)}:${String(Math.floor(tau % 60)).padStart(2, '0')}`,
        },
        {
          id: 'B-1',
          org: 'Bench',
          dot: TOY.shade,
          where: 'Middle terrace',
          stat: 'Watching',
          cls: 'wait',
          p: null,
          pt: '2 people',
        },
      ],
    }
  }
  const kpiFor = (tau) => {
    const n = passed(tau)
    const done = airsDone(tau)
    return {
      a: [`${n} / 3`, `${n} clean`, 'Line 1 · S1 · S2 · S3'],
      b: [kmh(at(PATH.sp, tau)), `peak ${kmh(at(PATH.peak, tau))}`, 'R-07 · board 0712'],
      c: [
        `${airAt(tau).toFixed(2)} s`,
        `${done} air${done === 1 ? '' : 's'}`,
        done ? `longest ${longestAir(tau).toFixed(2)} s` : 'longest —',
      ],
    }
  }
  const dropFor = (tau, h, t) => ({
    open: dropOpen(t),
    sites: [
      [
        'S1',
        'Fountain gap',
        'Hardflip · 1.7 m of water',
        Math.round(100 * stationProg('S1', tau, h)),
      ],
      [
        'S2',
        'Four-stair',
        `Laser flip · ${(P.upper.y - P.middle.y).toFixed(1)} m drop`,
        Math.round(100 * stationProg('S2', tau, h)),
      ],
      ['S3', 'Ten-stair rail', 'Kickflip BS 50-50', Math.round(100 * stationProg('S3', tau, h))],
      ['L1', 'Lower plaza', 'Ride away · brake', Math.round(100 * pc(OFF.tl, brake.t1, tau))],
    ],
    on: t > T_PICK - 0.35 ? 1 : 0,
  })

  // ------------------------------------------------------------------ the marks on the map
  const underUI = ([x, y]) =>
    (x > 1130 && y < 520) || (x > 1080 && y > 650) || (x < 1000 && y > 725) || (x < 780 && y < 185)
  const pinsAt = (t, h) => {
    const out = []
    const pin = (v, a = 1) => {
      const s = st.project(v)
      if (a > 0.001 && s && s[0] > 20 && s[0] < 1580 && s[1] > 80 && s[1] < 880 && !underUI(s))
        out.push({ kind: 'pin', x: s[0], y: s[1], a })
    }
    const c = CLICKS
    if (t < c[0].t) pin(W.anchors.rider(h), 1 - ss(c[0].t - 0.3, c[0].t, t))
    if (t > 2.3 && t < c[2].t)
      pin(W.anchors.S1(), ss(2.3, 2.7, t) * (1 - ss(c[2].t - 0.3, c[2].t, t)))
    const s2in = filmOf(S1.tl + 0.15)
    if (t > s2in && t < c[4].t)
      pin(W.anchors.S2(), ss(s2in, s2in + 0.4, t) * (1 - ss(c[4].t - 0.3, c[4].t, t)))
    const s3in = filmOf(S2.tl + 0.5)
    if (t > s3in && t < c[5].t)
      pin(W.anchors.S3(), ss(s3in, s3in + 0.4, t) * (1 - ss(c[5].t - 0.3, c[5].t, t)))
    if (t > T_HOME + 1.6) {
      const a = ss(T_HOME + 1.6, T_HOME + 2.2, t)
      for (const k of ['S1', 'S2', 'S3']) pin(W.anchors[k](), a)
      pin(W.anchors.rider(h), a)
    }
    return out
  }
  const SEL_TEXT = (kind, tau, h) => {
    if (kind === 'rider') return ['R-07', riderStage(tau, h)[0]]
    if (kind === 'board') return ['0712', boardState(h)[0]]
    return [`${kind} · ${TRICK[kind]}`, stationState(kind, tau)[0]]
  }
  const routeFor = (kind, tau) => {
    if (kind === 'rider') {
      const pts = []
      for (let i = 0; i <= 32; i++) {
        const tt = Math.min(RUN.end, tau + i * 0.1)
        const x = at(PATH.bx, tt)
        pts.push(V(x, groundAt(x), at(PATH.bz, tt)))
      }
      return pts
    }
    return W.stationRoute[kind] ?? null
  }

  // ------------------------------------------------------------------ one frame
  function frameState(t, layout = false) {
    const tau = tauAt(t)
    const { hero: h, second: s2 } = layout
      ? { hero: heroAt(tau), second: secondAt(tau) }
      : W.pose(tau)
    const s = selection(t)
    const site = siteAt(t)
    const slow = slowFactor(tau)
    const clockS = 52 + Math.floor(tau)
    const live = slow
      ? `Slow-mo ${slow}×`
      : `Live 16:${41 + Math.floor(clockS / 60)}:${String(clockS % 60).padStart(2, '0')}`
    let tool = -1
    for (const c of CLICKS) if (c.tool != null && t >= c.t && t < c.t + 0.6) tool = c.tool
    const out = {
      live,
      site: SITES[site],
      kpi: kpiFor(tau),
      card: cardAt(t, s.kind, s.t0, tau, h),
      track: trackFor(tau, h),
      table: tableFor(s.kind, tau, h, s2),
      drop: layout ? { ...dropFor(tau, h, t), open: 1 } : dropFor(tau, h, t),
      tool,
      tags: [],
      cursor: [1050, 620],
      hand: true,
      click: 0,
    }
    return Object.assign(out, { _tau: tau, _h: h, _s: s })
  }

  // where the UI's own buttons are, in the 1600 x 900 frame (measured once, with the dropdown laid out open)
  UIAT = (() => {
    const box = app.getBoundingClientRect()
    const scale = box.width / 1600 || 1
    const c = (el) => {
      const r = el.getBoundingClientRect()
      return [(r.left + r.width / 2 - box.left) / scale, (r.top + r.height / 2 - box.top) / scale]
    }
    const q = (k) => ui.el.querySelector(`[data-k="${k}"]`)
    // lay the dropdown out (open, no transform) to find its second item
    ui.update(frameState(0, true))
    const drop = q('drop')
    const tf = drop.style.transform
    drop.style.transform = 'none'
    const item = drop.querySelectorAll('.it')[1]
    const out = { dd: c(q('dd')), drop1: item ? c(item) : [960, 186], home: c(q('tool6')) }
    drop.style.transform = tf
    return out
  })()

  window.TRICKLINE = { st, W, camAt, projectWith, tauAt, filmOf, DUR, CLICKS }
  return {
    DUR,
    CHAPTERS,
    resize,
    tauAt,
    render(t) {
      t = clamp(t, 0, DUR)
      const fs = frameState(t)
      const { _tau: tau, _h: h, _s: s } = fs
      // the selection: a box round the selected thing, its route on the ground
      const obj = s.kind === 'site' ? null : W.select[s.kind]
      const fadeIn = ss(s.t0, s.t0 + 0.3, t)
      sel.box(obj, fadeIn)
      sel.route(obj ? routeFor(s.kind, tau) : null, ss(s.t0, s.t0 + 0.9, t), 1)
      sel.update()
      // the camera, its shadows and its AO scaled to what it sees
      const cam = camAt(t)
      shadowBox(cam.tx, cam.tz, Math.max(12, 0.62 * cam.d))
      st.camera.near = clamp(cam.d * 0.04, 0.3, 8)
      st.gtao.gtaoMaterial.uniforms.radius.value = clamp(0.052 * cam.d, 0.5, 5)
      st.frame(cam)
      // the marks and the cursor, over the frame just drawn
      fs.tags = pinsAt(t, h)
      if (obj) {
        const a = st.project(W.anchors[s.kind](h))
        const [txt, sub] = SEL_TEXT(s.kind, tau, h)
        if (a && !underUI(a))
          fs.tags.push({ kind: 'sel', x: a[0], y: a[1], text: txt, sub, a: fadeIn })
      }
      const cur = cursorAt(t, tau, h)
      fs.cursor = cur.p.map((v) => +v.toFixed(1))
      fs.hand = cur.hand
      fs.click = clickAt(t)
      ui.update(fs)
      return { tau }
    },
  }
}
