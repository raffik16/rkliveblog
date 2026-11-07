// Copied unchanged from raffi.website (raffi-website-com-25/composables/useFibreField.js) so the
// blog's backdrop (components/edition/EdBackdrop.tsx) draws the same field. Keep the two in sync;
// file references below are to the main site's repo.
//
// Fibre field for the page backdrop (EdBackdrop): the menu's fibre language
// (components/EdMenuFibers.vue) spread across a virtual canvas.
//
// - A few small hubs (filled dots) sit sparsely in a vertical
//   tile that is taller than the viewport and repeats seamlessly, so scroll
//   parallax can move it forever. Hubs favour the outer gutters (the screen
//   edges on phones) and pour their bundles in toward the page, like the
//   menu's corner hub.
// - Every strand that touches a hub starts (or ends) at ONE exact point: the
//   centre of the hub's dot (ANCHOR = 0). Strands are drawn first and the
//   filled dot on top, so they all appear to pour out of its centre. They fan
//   out with different tangents: bundles pour into the lower half-plane
//   (lowAngle()), and a cable end that has to climb to a hub above swings
//   out to its side first (handle()), so it leaves the dot sideways.
// - Each hub pours a bundle of hairline cubic-Bezier strands that start
//   turning right out of the dot and fan out, fading with distance, plus a
//   smaller back bundle (down along the screen edge for edge hubs).
//   Neighbouring hubs are joined by braided "cables" of strands (S or C
//   curves, never near-straight) that run anchor to anchor and splay in the
//   middle.
// - Short comets of light stream outward along bundles and along cables.
// - Text knock-down: the host hands in the page's text line boxes; a hub that
//   sits on (or within ~30px of) copy fades its glow, dot, bright bundle root
//   and comets down, so the brightest marks never land in a paragraph. (The
//   menu clips its light out of label boxes; this is the backdrop's version.)
//
// Three canvases (all in the DOM, stacked):
// - `strandCanvas` holds strands, hubs and nodes. It is taller than the
//   viewport by MARGIN above and below and is only redrawn every STRAND_EVERY
//   drawn frames (strands drift on 7-20s sines, a 50-100ms step is invisible)
//   or when parallax has moved it past its margin. In between, parallax is a
//   compositor-only CSS transform (whole device pixels): no per-frame blit.
// - `lightCanvas` holds only the comets, redrawn every drawn frame (~30Hz).
//   Scroll frames in between only move it with the same CSS transform
//   (move()), so scrolling never forces an extra full-viewport repaint.
// - `titleCanvas` (optional) holds the bundles that reach into display titles
//   while they reveal (drawTitles(), see "title bundles" below). It is sized
//   only while a title is active and redrawn every frame then, clearing just
//   the box it drew last frame; 0x0 otherwise.
//
// Cost control (this runs on every page):
// - each strand fades out in 5 solid steps (sub-Beziers split at fixed t)
//   instead of a gradient: same look at hairline width, ~5x cheaper to
//   rasterise on software-canvas devices. The bright first step is stroked
//   per strand (so light builds up where a bundle converges on its hub); the
//   fainter steps are batched into a few Path2Ds per style class (and per
//   quantised text-dim level for the step next to a hub);
// - rgba() strings are pre-built per colour (129 alpha steps); Bezier maths
//   writes into per-strand Float64Arrays, no per-frame allocation;
// - strands outside the viewport (+ margin) are skipped per tile copy;
// - text boxes are sorted by top, so each hub's lookup is a binary search.

const TAU = Math.PI * 2;
const HUB_R = 4.5;
const ANCHOR = 0;           // anchor: the dot's centre (offset below it, in px)
const LOW_MIN = 0.3;        // bundles leave >= this many rad below horizontal
const FOLD_K = 0.3;         // a cable handle pointing up dips this much of its angle below horizontal
const MARGIN = 72;          // css px of layer above/below the viewport
const STRAND_EVERY = 3;     // strand layer refresh: every 3rd drawn frame
const DRIFT_PAD = 44;       // css px of drift allowance for culling
const HUB_PAD = 40;         // css px: hub copies drawn this far out of view

// Peak alphas (the whole canvas is further scaled by CSS opacity per tone).
const BUNDLE_A = 0.34;
const CABLE_A = 0.26;
const COMET_A = 0.8;
const DOT_A = 0.9;          // filled hub dot, opaque enough to hide the strand roots
const SQUARE_A = 0.2;
const GLOW_A = 0.1;

// Fade profile along a strand: segment ends (Bezier t) and relative alpha.
// Bundles keep light through the middle, where they turn, and fade late.
const BUNDLE_STEPS = [0.14, 0.32, 0.52, 0.74, 1];
const BUNDLE_FADE = [0.85, 0.75, 0.55, 0.3, 0.12];
// Strands that end on a square node brighten into it instead of vanishing.
const SQUARE_FADE = [0.85, 0.75, 0.55, 0.42, 0.55];
const CABLE_STEPS = [0.16, 0.36, 0.64, 0.84, 1];
const CABLE_FADE = [0.8, 0.56, 0.36, 0.56, 0.8];

// Text knock-down: distance from a hub to the nearest text box (css px) ->
// brightness factor, eased over DIM_TAU seconds.
const KNOCK_NEAR = 2;
const KNOCK_FAR = 34;
const DIM_MIN = 0.2;
const DIM_TAU = 0.25;
const DIM_BUCKETS = 6;      // quantised levels for the batched second step

// Hub columns (fractions of the viewport width) for even / odd rows: outer
// gutters first, so hubs mostly sit beside the text column, not in it.
const COLS = {
  2: [[0.05, 0.91], [0.09, 0.95]],
  3: [[0.07, 0.47, 0.91], [0.1, 0.56, 0.94]],
  4: [[0.06, 0.36, 0.63, 0.92], [0.09, 0.42, 0.69, 0.95]],
};

const WHITE = [246, 251, 255];
const ICE = [214, 236, 255];
const CYAN = [60, 200, 255];
const GLOW = [170, 222, 255];

const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
// Fold an angle into the lower half-plane (y down): mirror upward directions
// across the horizontal, then keep LOW_MIN off it. Continuous everywhere, so a
// drifting handle never flips sides.
const lowAngle = (a) => {
  let t = Math.atan2(Math.sin(a), Math.cos(a));
  if (t < 0) t = -t;
  return clamp(t, LOW_MIN, Math.PI - LOW_MIN);
};
const mixc = (a, b, t) => a.map((v, i) => Math.round(v + (b[i] - v) * t));

function prng(seed) {
  let a = seed | 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const ramps = new Map();
function ramp(c) {
  const key = c.join(',');
  let r = ramps.get(key);
  if (!r) {
    r = [];
    for (let i = 0; i <= 128; i++) r.push(`rgba(${key},${(i / 128).toFixed(4)})`);
    ramps.set(key, r);
  }
  return r;
}
const qa = (r, a) => r[a <= 0 ? 0 : a >= 1 ? 128 : (a * 128 + 0.5) | 0];

export function createFibreField(strandCanvas, lightCanvas, { dprCap = 1.5, titleCanvas = null } = {}) {
  const layer = strandCanvas;
  const canvas = lightCanvas;
  const lctx = layer.getContext('2d');
  const ctx = canvas.getContext('2d');
  if (!ctx || !lctx) return null;
  layer.style.top = `${-MARGIN}px`;

  const DOT_R = ramp(WHITE);
  const SQUARE_R = ramp(ICE);

  let vw = 0;
  let vh = 0;
  let dpr = 1;
  let T = 1;                // virtual tile height (repeats vertically)
  let hubs = [];
  let strands = [];
  let cometStrands = [];
  let glowGrad = null;
  let layerOff = 0;
  let layerOk = false;
  let lastSec = NaN;        // time of the last strand render (dim easing)
  let shiftPx = NaN;        // current CSS translateY of the strand canvas
  let lightPx = 0;          // current CSS translateY of the light canvas
  let cometShift = 0;       // strand-canvas shift the comets were drawn at
  let lit = true;           // light canvas holds comets from the last frame
  let frame = 0;
  let scrollY = 0;          // document scroll of the current draw
  let text = null;          // Float32Array [x0, y0, x1, y1]* (document px), sorted by y0
  let textN = 0;
  let textMaxH = 0;
  let fixedT = null;        // Float32Array [x0, y0, x1, y1]* of position: fixed copy, viewport px
  let fixedN = 0;
  let fixedS = null;        // per fixed box: 1 = on its own opaque surface
  let bx = 0;
  let by = 0;
  // 16 style classes: kind (bundle/cable) x tint (ice/cyan) x alpha x width.
  // Phones get a little more alpha: the canvas is upscaled (DPR cap), which
  // softens hairlines.
  let STYLES = [];
  function buildStyles(boost) {
    STYLES = [];
    for (let g = 0; g < 16; g++) {
      const kind = g >> 3;
      const r = ramp((g >> 2) & 1 ? mixc(CYAN, ICE, 0.45) : mixc(ICE, WHITE, 0.5));
      const A = (kind ? CABLE_A : BUNDLE_A) * ((g >> 1) & 1 ? 1 : 0.62) * boost;
      const fade = kind ? CABLE_FADE : BUNDLE_FADE;
      STYLES.push({
        width: kind ? (g & 1 ? 0.65 : 0.42) : g & 1 ? 0.82 : 0.5,
        r,
        A,
        fade,
        cols: fade.map((f) => qa(r, f * A)),
        sq: SQUARE_FADE.map((f) => qa(r, f * A)),
      });
    }
  }
  const REST = new Float64Array(8);
  const SEGS = [0, 1, 2, 3, 4].map(() => new Float64Array(8));

  // ---------- geometry ----------
  // De Casteljau split of c at t into left / right (right may alias c).
  function splitAt(c, t, left, right) {
    const x01 = c[0] + (c[2] - c[0]) * t;
    const y01 = c[1] + (c[3] - c[1]) * t;
    const x12 = c[2] + (c[4] - c[2]) * t;
    const y12 = c[3] + (c[5] - c[3]) * t;
    const x23 = c[4] + (c[6] - c[4]) * t;
    const y23 = c[5] + (c[7] - c[5]) * t;
    const xa = x01 + (x12 - x01) * t;
    const ya = y01 + (y12 - y01) * t;
    const xb = x12 + (x23 - x12) * t;
    const yb = y12 + (y23 - y12) * t;
    const xm = xa + (xb - xa) * t;
    const ym = ya + (yb - ya) * t;
    const x0 = c[0];
    const y0 = c[1];
    const x3 = c[6];
    const y3 = c[7];
    left[0] = x0; left[1] = y0; left[2] = x01; left[3] = y01;
    left[4] = xa; left[5] = ya; left[6] = xm; left[7] = ym;
    right[0] = xm; right[1] = ym; right[2] = xb; right[3] = yb;
    right[4] = x23; right[5] = y23; right[6] = x3; right[7] = y3;
  }

  function bez(c, t) {
    const u = 1 - t;
    const a = u * u * u;
    const b = 3 * u * u * t;
    const d = 3 * u * t * t;
    const e = t * t * t;
    bx = a * c[0] + b * c[2] + d * c[4] + e * c[6];
    by = a * c[1] + b * c[3] + d * c[5] + e * c[7];
  }

  function placeHubs(sec) {
    for (const h of hubs) {
      h.cx = h.x + Math.sin(sec * h.w + h.ph) * h.ax;
      h.cy = h.y + Math.cos(sec * h.w * 0.8 + h.ph) * h.ay;
    }
  }

  // Bundle strand: it leaves the hub's anchor (all strands of every bundle
  // at one point, the dot's centre) along the departure direction d (the
  // bundle axis folded below horizontal, leaning a little toward vertical) and bends
  // steadily toward its end, close to a circular arc (end tangent ~1.6-2x the
  // chord angle off the axis), so the turn is spread along the bright root
  // instead of piling up in the faint tail. c1 sits a short handle out along
  // d (a few px either side), c2 a handle back from the end along the end
  // tangent, in the axis (u, v) frame. Both breathe a little.
  function bundleCurve(s, sec) {
    const c = s.c;
    const h = s.h;
    const ux = s.ux;
    const uy = s.uy;
    const ox = h.cx;
    const oy = h.cy + ANCHOR;
    const ex = ox + s.dx + Math.sin(sec * s.w2 + s.ph2) * s.ae;
    const ey = oy + s.dy + Math.cos(sec * s.w1 + s.ph1) * s.ae;
    const qx = ex - ox;
    const qy = ey - oy;
    const along = qx * ux + qy * uy;
    const side = qy * ux - qx * uy;
    const breath = 1 + 0.12 * Math.sin(sec * 0.5 + s.ph2);
    const a1 = s.h1 * breath;
    const v1 = s.j1 + s.a1 * 0.5 * Math.sin(sec * s.w1 + s.ph1);
    const a2 = along - s.tc * s.h2 + s.a2 * 0.9 * Math.cos(sec * s.w2 * 0.8 + s.ph1);
    const v2 = side - s.ts * s.h2 + s.a2 * Math.sin(sec * s.w2 + s.ph2);
    const dx = s.ddx;
    const dy = s.ddy;
    c[0] = ox;
    c[1] = oy;
    c[2] = ox + dx * a1 - dy * v1;
    c[3] = oy + dy * a1 + dx * v1;
    c[4] = ox + ux * a2 - uy * v2;
    c[5] = oy + uy * a2 + ux * v2;
    c[6] = ex;
    c[7] = ey;
  }

  // Cable strand between two hubs: runs from anchor to anchor and bows out
  // (an S, or a C for some cables), each strand slightly differently. An
  // end whose handle points up (the other hub is above) would climb straight
  // out of the top of its dot, so it swings out to the strand's side for that
  // end (fixed at build) and dips FOLD_K of its upward angle below the
  // horizontal, full length: the cable leaves the dot sideways, then climbs.
  // Continuous while the handle stays on its side.
  function handle(c, i, x, y, hx, hy, side) {
    let ex = hx;
    let ey = hy;
    if (hy < 0) {
      const len = Math.hypot(hx, hy);
      const t = FOLD_K * Math.atan2(-hy, side * hx);
      ex = side * Math.cos(t) * len;
      ey = Math.sin(t) * len;
    }
    c[i] = x + ex;
    c[i + 1] = y + ey;
  }

  // Raw (unfolded) cable handles at time sec -> HND [x1, y1, x2, y2], plus
  // the anchors.
  const HND = new Float64Array(4);
  function cableRaw(s, sec, c) {
    const a = s.a;
    const b = s.b;
    const ox = a.cx;
    const oy = a.cy + ANCHOR;
    const ex = b.cx;
    const ey = b.cy + s.bk * T + ANCHOR;
    const qx = ex - ox;
    const qy = ey - oy;
    const L = Math.hypot(qx, qy) || 1;
    const nx = -qy / L;
    const ny = qx / L;
    const w1 = L * s.e1 + s.a1 * Math.sin(sec * s.w1 + s.ph1);
    const w2 = L * s.e2 + s.a2 * Math.sin(sec * s.w2 + s.ph2);
    HND[0] = qx * 0.32 + nx * w1;
    HND[1] = qy * 0.32 + ny * w1;
    HND[2] = -qx * 0.32 + nx * w2;
    HND[3] = -qy * 0.32 + ny * w2;
    c[0] = ox;
    c[1] = oy;
    c[6] = ex;
    c[7] = ey;
  }

  function cableCurve(s, sec) {
    const c = s.c;
    cableRaw(s, sec, c);
    handle(c, 2, c[0], c[1], HND[0], HND[1], s.sa);
    handle(c, 4, c[6], c[7], HND[2], HND[3], s.sb);
  }

  const curve = (s, sec) => (s.kind ? cableCurve(s, sec) : bundleCurve(s, sec));

  // ---------- text knock-down ----------
  // Brightness factor for a hub at (x, y) in document px (at document
  // scroll sy, for fixed copy): DIM_MIN on or right next to text, 1 from
  // KNOCK_FAR px away.
  function textDim(x, y, sy = scrollY) {
    if (!textN && !fixedN) return 1;
    let d2 = KNOCK_FAR * KNOCK_FAR;
    if (textN) {
      const t = text;
      const yTop = y + KNOCK_FAR;
      // first box whose top is below the search window
      let lo = 0;
      let hi = textN;
      while (lo < hi) {
        const m = (lo + hi) >> 1;
        if (t[m * 4 + 1] > yTop) hi = m;
        else lo = m + 1;
      }
      const yMin = y - KNOCK_FAR - textMaxH;
      for (let i = lo - 1; i >= 0; i--) {
        const o = i * 4;
        if (t[o + 1] < yMin) break;
        const dx = x < t[o] ? t[o] - x : x > t[o + 2] ? x - t[o + 2] : 0;
        const dy = y < t[o + 1] ? t[o + 1] - y : y > t[o + 3] ? y - t[o + 3] : 0;
        const q = dx * dx + dy * dy;
        if (q < d2) {
          d2 = q;
          if (q === 0) break;
        }
      }
    }
    // Fixed copy sits at the same screen spot at any scroll.
    const ys = y - sy;
    for (let i = 0; i < fixedN; i++) {
      const o = i * 4;
      const f = fixedT;
      const dx = x < f[o] ? f[o] - x : x > f[o + 2] ? x - f[o + 2] : 0;
      const dy = ys < f[o + 1] ? f[o + 1] - ys : ys > f[o + 3] ? ys - f[o + 3] : 0;
      const q = dx * dx + dy * dy;
      if (q < d2) d2 = q;
    }
    const u = clamp((Math.sqrt(d2) - KNOCK_NEAR) / (KNOCK_FAR - KNOCK_NEAR), 0, 1);
    return DIM_MIN + (1 - DIM_MIN) * u * u * (3 - 2 * u);
  }

  const dimOf = (h, k) => {
    const v = h.dm.get(k);
    return v === undefined ? 1 : v;
  };

  // Hub copies near the view and their (eased) text dim. Layer-space y of a
  // tile point is y + k*T; document y adds (scroll - parallax offset).
  function updateDims(lo, hi, offset, ease) {
    const toDoc = scrollY - offset;
    for (const h of hubs) {
      h.k0 = Math.ceil((lo - h.cy - HUB_PAD) / T);
      h.k1 = Math.floor((hi - h.cy + HUB_PAD) / T);
      for (const k of h.dm.keys()) if (k < h.k0 || k > h.k1) h.dm.delete(k);
      for (let k = h.k0; k <= h.k1; k++) {
        const target = textDim(h.cx, h.cy + k * T + toDoc);
        const prev = h.dm.get(k);
        h.dm.set(k, prev === undefined ? target : prev + (target - prev) * ease);
      }
    }
  }

  // ---------- layout ----------
  function resize(w, h) {
    vw = w;
    vh = h;
    dpr = Math.min(window.devicePixelRatio || 1, dprCap);
    const cw = Math.max(1, Math.round(vw * dpr));
    const ch = Math.max(1, Math.round(vh * dpr));
    if (canvas.width !== cw || canvas.height !== ch) {
      canvas.width = cw;
      canvas.height = ch;
    }
    const lh = Math.max(1, Math.round((vh + MARGIN * 2) * dpr));
    if (layer.width !== cw || layer.height !== lh) {
      layer.width = cw;
      layer.height = lh;
    }
    layer.style.height = `${vh + MARGIN * 2}px`;
    // Both canvases get an explicit height: when the viewport changes height
    // (a phone's toolbar showing or hiding) before the host calls resize(),
    // neither stretches, so the comets stay registered on their strands.
    canvas.style.height = `${vh}px`;
    if (tAlloc) allocTitles();
    layerOk = false;
    lit = true;
  }

  function build({ lowPower = false } = {}) {
    const rnd = prng(1515);
    const R = (a, b) => a + (b - a) * rnd();
    const small = vw < 720;
    buildStyles(small ? 1.22 : 1);
    T = Math.round(Math.max(vh * 1.6, small ? 1150 : 1300));
    const reach = small ? clamp(vw * 0.78, 240, 360) : clamp(vw * 0.34, 320, 560);
    const cols = small ? 2 : vw >= 1680 ? 4 : 3;
    const rows = Math.max(2, Math.round(T / (small ? 400 : 470)));

    hubs = [];
    strands = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const edge = c === 0 ? -1 : c === cols - 1 ? 1 : 0;
        // Edge hubs are what keep the screen edges alive: skip them less.
        if (rnd() < (edge ? 0.08 : 0.3) && hubs.length > 1) continue;
        const ax = small ? R(3, 7) : R(8, 16);
        const keep = ax + HUB_R + (small ? 3 : 8);
        const x = clamp((COLS[cols][r % 2][c] + R(-0.03, 0.03)) * vw, keep, vw - keep);
        const y = ((r + 0.5 + R(-0.22, 0.22)) / rows) * T;
        // Bundles pour in toward the page with a slight downward lean.
        const left = edge ? edge < 0 : x < vw / 2;
        const phi = (left ? 0.35 : Math.PI - 0.35) + R(-0.8, 0.8);
        // Back bundle: edge hubs run it down along their edge (a bundle
        // pointing off-screen would be wasted); others pour it backwards and
        // down. Everything pours down and out of the dot's centre, so no
        // bundle points straight up. (The coin flip that used to pick up or
        // down stays, so the rest of the seeded layout is unchanged.)
        rnd();
        const back = edge
          ? Math.PI / 2 + (edge < 0 ? -0.3 : 0.3) + R(-0.25, 0.25)
          : lowAngle(phi + Math.PI + R(-0.7, 0.7));
        hubs.push({
          x, y, phi, back,
          ax, ay: R(6, 12), w: TAU / R(12, 20), ph: R(0, TAU),
          cx: x, cy: y,
          dm: new Map(), k0: 0, k1: -1,
          i: hubs.length,
        });
      }
    }

    const base = (kind) => {
      const tint = rnd();
      const cyan = tint < 0.22;
      const s = {
        kind,
        a1: R(4, 11), a2: R(4, 11),
        w1: TAU / R(7, 13), w2: TAU / R(8, 15),
        ph1: R(0, TAU), ph2: R(0, TAU),
        cy: cyan ? 1 : 0,
        ac: rnd() < 0.5 ? 0 : 1,
        wc: rnd() < 0.5 ? 0 : 1,
        width: 0.6,
        head: ramp(cyan ? mixc(CYAN, WHITE, 0.55) : WHITE),
        comet: false,
        rev: false,
        spd: R(70, 140), tl: R(30, 60), gp: R(2600, 9000), off: rnd(), ca: R(0.4, 0.75),
        square: false,
        c: new Float64Array(8),
        g: 0,
        seg0: '',
        steps: null,
        dur: 1, tail: 0.2, period: 1, o: 0, minY: 0, maxY: 0, k0: 0, k1: -1,
      };
      return s;
    };

    // Raster cost scales with canvas area, so low-power phones (small canvas)
    // keep most of their strands; big low-power screens get the real cut.
    const nMain = small ? (lowPower ? 11 : 13) : lowPower ? 10 : 16;
    const nBack = small ? (lowPower ? 4 : 5) : lowPower ? 3 : 6;
    const cometP = lowPower ? 0.32 : 0.42;
    // Ends sit 0.3-1.25 rad off the bundle axis (never on it, so every strand
    // visibly turns), mostly to one side like the menu's one-sided pour.
    const addBundle = (h, phi, n, spread, lenK) => {
      const lean = rnd() < 0.5 ? 1 : -1;
      for (let i = 0; i < n; i++) {
        const s = base(0);
        const del = (rnd() < 0.72 ? lean : -lean) * R(0.3, spread);
        const ang = phi + del;
        s.h = h;
        s.ux = Math.cos(phi);
        s.uy = Math.sin(phi);
        // Departure out of the dot's centre: the axis folded below horizontal,
        // leaning a quarter of the way toward vertical.
        const dep = lowAngle(phi);
        const d = dep + (Math.PI / 2 - dep) * 0.25;
        s.ddx = Math.cos(d);
        s.ddy = Math.sin(d);
        s.L = reach * lenK * R(0.45, 1.1);
        s.dx = Math.cos(ang) * s.L;
        s.dy = Math.sin(ang) * s.L;
        // Arc handles (css px) and the end tangent's angle off the axis.
        s.h1 = s.L * R(0.25, 0.4);
        s.h2 = s.L * R(0.2, 0.35);
        const th = del * R(1.6, 2.0);
        s.tc = Math.cos(th);
        s.ts = Math.sin(th);
        s.j1 = R(-3, 3);
        s.ae = R(3, 9);
        s.square = rnd() < 0.09;
        if (s.square) s.ac = 1;
        s.comet = rnd() < cometP;
        strands.push(s);
      }
    };
    for (const h of hubs) {
      addBundle(h, h.phi, nMain, 1.25, 1);
      addBundle(h, h.back, nBack, 1.0, 0.6);
    }

    // Cables: each hub to its nearest neighbour (and sometimes the second),
    // across the tile seam too, so the repeat is invisible.
    const maxLen = small ? 560 : 760;
    const nCable = lowPower ? 3 : small ? 4 : 5;
    const seen = new Set();
    // keep the sign, at least `min` away from zero
    const atLeast = (v, min) => (v < 0 ? Math.min(v, -min) : Math.max(v, min));
    hubs.forEach((A, i) => {
      const cand = [];
      hubs.forEach((B, j) => {
        if (j === i) return;
        for (let k = -1; k <= 1; k++) {
          const d = Math.hypot(B.x - A.x, B.y + k * T - A.y);
          if (d < maxLen && d > 120) cand.push({ j, k, d });
        }
      });
      cand.sort((p, q) => p.d - q.d);
      const take = rnd() < 0.5 ? 2 : 1;
      for (const { j, k } of cand.slice(0, take)) {
        const key = i < j ? `${i}:${j}:${k}` : `${j}:${i}:${-k}`;
        if (seen.has(key)) continue;
        seen.add(key);
        const sgn = rnd() < 0.5 ? 1 : -1;
        // Mostly C-curves (one bow); the S-curves are lopsided so their
        // (straight) inflection sits off-centre. Both clearly curved.
        const S = rnd() >= 0.65;
        const e1 = sgn * (S ? R(0.18, 0.26) : R(0.12, 0.22));
        const e2 = S ? -e1 * R(0.5, 0.7) : sgn * R(0.09, 0.17);
        const rev = rnd() < 0.5;
        for (let n = 0; n < nCable; n++) {
          const s = base(1);
          s.a = A;
          s.b = hubs[j];
          s.bk = k;
          s.e1 = atLeast(e1 + R(-0.04, 0.04), 0.08);
          s.e2 = atLeast(e2 + R(-0.04, 0.04), 0.08);
          R(0, 1); // (end jitter, retired: cables meet at the anchors)
          R(0, 1);
          s.sa = 1; // fold sides, set below
          s.sb = 1;
          s.comet = rnd() < 0.5;
          s.rev = rev;
          s.spd = R(90, 160);
          s.tl = R(40, 70);
          s.gp = R(3000, 9000);
          strands.push(s);
        }
      }
    });

    // Cable ends: the side each end swings out to if its handle has to fold
    // (see handle()): the side the handle leans to at rest, else the side
    // the other hub is on, else the bow's side.
    placeHubs(0);
    const sideOf = (...v) => {
      for (const x of v) if (Math.abs(x) > 1e-3) return x > 0 ? 1 : -1;
      return 1;
    };
    for (const s of strands) {
      if (!s.kind) continue;
      cableRaw(s, 0, s.c);
      const [h1x, h1y, h2x, h2y] = HND;
      const qx = s.c[6] - s.c[0];
      s.sa = sideOf(Math.abs(h1x) > 0.15 * Math.hypot(h1x, h1y) ? h1x : 0, qx, h1x);
      s.sb = sideOf(Math.abs(h2x) > 0.15 * Math.hypot(h2x, h2y) ? h2x : 0, -qx, h2x);
    }

    // Per-strand timing, culling bounds and the fade colours.
    for (const s of strands) {
      curve(s, 0);
      const c = s.c;
      let len = 0;
      bez(c, 0);
      let px = bx;
      let py = by;
      for (let i = 1; i <= 10; i++) {
        bez(c, i / 10);
        len += Math.hypot(bx - px, by - py);
        px = bx;
        py = by;
      }
      len = Math.max(1, len);
      s.dur = (len / s.spd) * 1000;
      s.tail = Math.min(0.35, s.tl / len);
      s.period = s.dur * (1 + s.tail) + s.gp;
      s.o = s.off * s.period;
      s.minY = Math.min(c[1], c[3], c[5], c[7]) - DRIFT_PAD;
      s.maxY = Math.max(c[1], c[3], c[5], c[7]) + DRIFT_PAD;

      s.g = s.kind * 8 + s.cy * 4 + s.ac * 2 + s.wc;
      s.width = STYLES[s.g].width;
      s.seg0 = STYLES[s.g].cols[0];
      s.steps = s.kind ? CABLE_STEPS : BUNDLE_STEPS;
    }
    cometStrands = strands.filter((s) => s.comet);

    glowGrad = lctx.createRadialGradient(0, 0, 0, 0, 0, 30);
    glowGrad.addColorStop(0, `rgba(${GLOW.join(',')},1)`);
    glowGrad.addColorStop(1, `rgba(${GLOW.join(',')},0)`);
    layerOk = false;
    lastSec = NaN;
  }

  // ---------- drawing ----------
  function renderLayer(sec, offset, still) {
    const dt = sec - lastSec;
    const ease = still || !(dt > 0 && dt < 2) ? 1 : 1 - Math.exp(-dt / DIM_TAU);
    lastSec = sec;
    layerOff = offset;
    layerOk = true;
    lctx.setTransform(1, 0, 0, 1, 0, 0);
    lctx.globalAlpha = 1;
    lctx.clearRect(0, 0, layer.width, layer.height);
    placeHubs(sec);
    const lo = offset - MARGIN;
    const hi = offset + vh + MARGIN;
    const shift = MARGIN - offset;
    updateDims(lo, hi, offset, ease);

    lctx.lineCap = 'butt';
    lctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    // [((style * 4 + step - 1) * DIM_BUCKETS + dim level] -> Path2D
    const batch = [];
    for (const s of strands) {
      curve(s, sec);
      s.k0 = Math.ceil((lo - s.maxY) / T);
      s.k1 = Math.floor((hi - s.minY) / T);
      if (s.k1 < s.k0) continue;
      // Split once into the fade segments, then place them per tile copy.
      const steps = s.steps;
      REST.set(s.c);
      let prev = 0;
      for (let i = 0; i < 4; i++) {
        splitAt(REST, (steps[i] - prev) / (1 - prev), SEGS[i], REST);
        prev = steps[i];
      }
      SEGS[4].set(REST);
      const st = STYLES[s.g];
      lctx.lineWidth = s.width;
      for (let k = s.k0; k <= s.k1; k++) {
        const yo = k * T + shift;
        // Text dim of the hub this end of the strand leaves from / arrives at.
        const vA = dimOf(s.kind ? s.a : s.h, k);
        const vB = s.kind ? dimOf(s.b, k + s.bk) : 1;
        // Bright root, stroked on its own so light builds up at the hub.
        let q = SEGS[0];
        lctx.globalAlpha = vA;
        lctx.strokeStyle = s.seg0;
        lctx.beginPath();
        lctx.moveTo(q[0], q[1] + yo);
        lctx.bezierCurveTo(q[2], q[3] + yo, q[4], q[5] + yo, q[6], q[7] + yo);
        lctx.stroke();
        lctx.globalAlpha = 1;
        for (let i = 1; i < 5; i++) {
          q = SEGS[i];
          if (s.square && i >= 3) {
            lctx.strokeStyle = st.sq[i];
            lctx.beginPath();
            lctx.moveTo(q[0], q[1] + yo);
            lctx.bezierCurveTo(q[2], q[3] + yo, q[4], q[5] + yo, q[6], q[7] + yo);
            lctx.stroke();
            continue;
          }
          const v = s.kind ? (i === 4 ? vB : 1) : i === 1 ? vA : 1;
          const lvl = v >= 0.995 ? 0 : Math.round(((1 - v) / (1 - DIM_MIN)) * (DIM_BUCKETS - 1));
          const bi = ((s.g << 2) + i - 1) * DIM_BUCKETS + lvl;
          const path = batch[bi] || (batch[bi] = new Path2D());
          path.moveTo(q[0], q[1] + yo);
          path.bezierCurveTo(q[2], q[3] + yo, q[4], q[5] + yo, q[6], q[7] + yo);
        }
      }
    }
    for (let bi = 0; bi < batch.length; bi++) {
      const path = batch[bi];
      if (!path) continue;
      const lvl = bi % DIM_BUCKETS;
      const gi = (bi - lvl) / DIM_BUCKETS;
      const st = STYLES[gi >> 2];
      const i = (gi & 3) + 1;
      lctx.lineWidth = st.width;
      lctx.strokeStyle = lvl
        ? qa(st.r, st.fade[i] * st.A * (1 - (lvl * (1 - DIM_MIN)) / (DIM_BUCKETS - 1)))
        : st.cols[i];
      lctx.stroke(path);
    }

    // Site motif: a few tiny hollow squares where strands end.
    lctx.lineWidth = 0.8;
    lctx.strokeStyle = qa(SQUARE_R, SQUARE_A);
    lctx.beginPath();
    for (const s of strands) {
      if (!s.square || s.k1 < s.k0) continue;
      const x = Math.round(s.c[6]) - 2;
      for (let k = s.k0; k <= s.k1; k++) {
        lctx.rect(x, Math.round(s.c[7] + k * T + shift) - 2, 4, 4);
      }
    }
    lctx.stroke();

    // Hubs: soft glow, then a filled dot over the point every strand starts
    // from (drawn after the strands, so they pour out of its centre), each
    // faded by its text dim.
    const breathe = 0.85 + 0.15 * Math.sin(sec * 0.7);
    for (const h of hubs) {
      for (let k = h.k0; k <= h.k1; k++) {
        const v = dimOf(h, k);
        const x = h.cx;
        const y = h.cy + k * T + shift;
        lctx.globalAlpha = GLOW_A * breathe * v * v;
        lctx.setTransform(dpr, 0, 0, dpr, x * dpr, y * dpr);
        lctx.fillStyle = glowGrad;
        lctx.fillRect(-30, -30, 60, 60);
        lctx.globalAlpha = 1;
        lctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        lctx.fillStyle = qa(DOT_R, DOT_A * v);
        lctx.beginPath();
        lctx.arc(x, y + ANCHOR, HUB_R, 0, TAU);
        lctx.fill();
      }
    }
    lctx.globalAlpha = 1;
    lctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function comet(g, c, head, tail, r, a, w, rev) {
    let fade = 1;
    if (head > 1) fade = 1 - (head - 1) / tail;
    const h1 = head < 1 ? head : 1;
    const h0 = head - tail > 0 ? head - tail : 0;
    if (h1 <= h0 || fade <= 0 || a <= 0.004) return;
    const N = 6;
    bez(c, rev ? 1 - h0 : h0);
    let px = bx;
    let py = by;
    g.lineWidth = w;
    for (let i = 1; i <= N; i++) {
      const t = h0 + ((h1 - h0) * i) / N;
      bez(c, rev ? 1 - t : t);
      const k = i / N;
      const al = a * fade * k * k;
      if (al > 0.006) {
        g.strokeStyle = qa(r, al);
        g.beginPath();
        g.moveTo(px, py);
        g.lineTo(bx, by);
        g.stroke();
      }
      px = bx;
      py = by;
    }
  }

  // ---------- title bundles ----------
  // While a display title reveals (composables/useFibreTitles.js), a bundle
  // of fibres reaches from the nearest hub above and ahead of it, or from a
  // dot that eases in at the right screen edge, into the title's reveal
  // front: the strands arc in ABOVE the unrevealed letters and dive onto
  // the clip edge (or, while a label such as a chapter head's
  // "03  HOW I WORK" sits low over the front, come down just past it and run
  // in under it), their ends spread down the cap band, and comets stream
  // along them into the fill. Only when there is no room above anywhere on
  // the front's side (and for the hero) do they arch in along the band. A
  // bundle always grows out of its source (its drawn amount eases on its own
  // clock), and a change of approach is a cross-fade. Drawn on a third
  // canvas (titleCanvas) while a title is active (its front moves with the
  // page, so it can't wait for the strand layer's cadence): every frame
  // while anything moves, at the host's idle cadence while parked; nothing
  // at all otherwise.
  //
  // Copy safety: the bundle lives in the box [landing, screen right] x
  // [ceiling, band bottom], where the ceiling is the lowest non-title text
  // line above the band on that side (the field's text boxes; the host
  // re-reads the copy around a title when it starts revealing). Hub sources
  // must sit inside that box; every control point is kept in it, and a hub
  // that leaves it lets go within ~0.15s.
  const tctx = titleCanvas ? titleCanvas.getContext('2d') : null;
  if (titleCanvas) {
    titleCanvas.width = 0;          // no backing store until a title reveals
    titleCanvas.height = 0;
  }
  const TITLE_A = 0.5;
  const TITLE_STEPS = [0.18, 0.46, 0.76, 1];
  const TITLE_FADE = [0.95, 0.5, 0.42, 1];
  const T_TAU = 0.28;               // s: source weight easing (hub <-> edge dot)
  let tAlloc = false;
  const tBox = [0, 0, 0, 0];        // css px drawn last frame (cleared next frame)
  let tDirty = false;
  let tSmall = false;
  let TR_ICE = null;
  let TR_CYAN = null;
  let TR_HEAD = null;
  let TR_HEADC = null;
  const TLV = new Float64Array(8);  // drawn part (0..reach)
  const TRS = new Float64Array(8);
  const TSG = [0, 1, 2, 3].map(() => new Float64Array(8));

  function allocTitles() {
    if (!titleCanvas) return;
    const cw = Math.max(1, Math.round(vw * dpr));
    const ch = Math.max(1, Math.round(vh * dpr));
    if (titleCanvas.width !== cw || titleCanvas.height !== ch) {
      titleCanvas.width = cw;
      titleCanvas.height = ch;
    }
    titleCanvas.style.height = `${vh}px`;
    tAlloc = true;
    tDirty = false;
  }

  function releaseTitles() {
    if (!titleCanvas || !tAlloc) return;
    titleCanvas.width = 0;
    titleCanvas.height = 0;
    tAlloc = false;
    tDirty = false;
  }

  function clearTitleBox() {
    if (!tDirty) return;
    tctx.setTransform(1, 0, 0, 1, 0, 0);
    const x0 = Math.max(0, Math.floor(tBox[0] * dpr) - 2);
    const y0 = Math.max(0, Math.floor(tBox[1] * dpr) - 2);
    const x1 = Math.min(titleCanvas.width, Math.ceil(tBox[2] * dpr) + 2);
    const y1 = Math.min(titleCanvas.height, Math.ceil(tBox[3] * dpr) + 2);
    if (x1 > x0 && y1 > y0) tctx.clearRect(x0, y0, x1 - x0, y1 - y0);
    tDirty = false;
  }

  const grow = (x, y, pad) => {
    if (x - pad < tBox[0]) tBox[0] = x - pad;
    if (y - pad < tBox[1]) tBox[1] = y - pad;
    if (x + pad > tBox[2]) tBox[2] = x + pad;
    if (y + pad > tBox[3]) tBox[3] = y + pad;
  };

  // Per-title strand parameters (seeded by the title, stable for its life).
  function titleState(o) {
    let fs = o.e.fs;
    if (fs && fs.small === tSmall) return fs;
    const rnd = prng(9157 + o.e.id * 131);
    const R = (a, b) => a + (b - a) * rnd();
    const n = tSmall ? 8 : 11;
    const perm = Array.from({ length: n }, (_, i) => i);
    for (let i = n - 1; i > 0; i--) {
      const j = (rnd() * (i + 1)) | 0;
      [perm[i], perm[j]] = [perm[j], perm[i]];
    }
    const st = [];
    for (let i = 0; i < n; i++) {
      st.push({
        v: 0.06 + 0.88 * ((perm[i] + 0.2 + 0.6 * rnd()) / n), // end height in the cap band
        u: rnd(),                 // how high the strand bows out of its source
        a: R(0.02, 0.16),         // approach offset ahead of the landing (x capH)
        h2: rnd(),                // how high above the band it turns down
        l1: R(0.2, 0.42),         // departure handle (x distance)
        fan: R(-1, 1),            // departure fan out of a hub
        wc: rnd() < 0.45 ? 1 : 0,
        cy: rnd() < 0.25 ? 1 : 0,
        per: R(1250, 2100),       // comet period (ms)
        ph: rnd(),
        tl: R(0.16, 0.26),        // comet tail (fraction of the strand)
        c: new Float64Array(8),
      });
    }
    // visA / visB: how much of the bundle from above / along the band is
    // drawn (each eases on its own, so a bundle always grows out of its
    // source and a change of approach is a cross-fade). vis = their sum,
    // mode = the approach being eased toward.
    fs = o.e.fs = { st, small: tSmall, src: new Map(), b0: NaN, b1: NaN, ap: NaN, last: 0, mode: '', vis: 0, visA: 0, visB: 0, land: 0 };
    return fs;
  }

  // Lowest bottom (screen px) of non-title copy over [x0, vw] between `span`
  // above the band and the band's bottom. Boxes taller than `big` are the
  // title's own glyph boxes (or other display type) and don't count. Fixed
  // copy counts only above the band top b0 (a fixed button beside the band
  // floats over it the way it floats over the title), and not when it sits
  // on its own opaque surface (the call launcher: it hides what passes
  // behind it).
  function ceilingAbove(x0, top, bottom, big, sy, b0) {
    let yC = top;
    for (let i = 0; i < fixedN; i++) {
      const k = i * 4;
      const f = fixedT;
      if (fixedS && fixedS[i]) continue;
      if (f[k + 2] < x0 || f[k] > vw || f[k + 3] - f[k + 1] > big || f[k + 3] >= b0) continue;
      if (f[k + 3] > yC) yC = f[k + 3];
    }
    if (!textN) return yC;
    const t = text;
    const yMax = bottom + sy;
    let lo = 0;
    let hi = textN;
    while (lo < hi) {
      const m = (lo + hi) >> 1;
      if (t[m * 4 + 1] > yMax) hi = m;
      else lo = m + 1;
    }
    const yMin = top + sy - textMaxH;
    for (let i = lo - 1; i >= 0; i--) {
      const k = i * 4;
      if (t[k + 1] < yMin) break;
      if (t[k + 2] < x0 || t[k] > vw) continue;
      if (t[k + 3] - t[k + 1] > big) continue;
      const b = t[k + 3] - sy;
      if (b > yC) yC = b;
    }
    return yC;
  }

  // A label sitting low over the band (bottom less than `need` px above the
  // cap top, but not down in it) that starts at or left of the front,
  // chained with neighbours less than `gap` px apart: a chapter head's
  // "03  HOW I WORK". Returns its right end (screen px), or F - 16 when there
  // is none. The bundle comes down past it and runs in under it.
  const LOWB = [];
  function labelEnd(F, b0, b1, need, big, gap, sy) {
    let end = F - 16;
    if (!textN) return end;
    const t = text;
    const yMax = b0 + (b1 - b0) * 0.1 + sy;
    let lo = 0;
    let hi = textN;
    while (lo < hi) {
      const m = (lo + hi) >> 1;
      if (t[m * 4 + 1] > yMax) hi = m;
      else lo = m + 1;
    }
    const yLow = b0 - need + sy;
    const yMin = yLow - textMaxH;
    LOWB.length = 0;
    for (let i = lo - 1; i >= 0; i--) {
      const k = i * 4;
      if (t[k + 1] < yMin) break;
      if (t[k + 3] <= yLow || t[k + 3] > yMax || t[k + 2] < end || t[k] > vw) continue;
      if (t[k + 3] - t[k + 1] > big) continue;
      LOWB.push(t[k], t[k + 2]);
    }
    for (let grew = LOWB.length > 0; grew;) {
      grew = false;
      for (let j = 0; j < LOWB.length; j += 2) {
        if (LOWB[j] <= end + gap && LOWB[j + 1] > end) {
          end = LOWB[j + 1];
          grew = true;
        }
      }
    }
    return end;
  }

  // Control points of strand s from source (sx, sy0) into the front.
  // Above (default): out of the source, up into the free room over the
  // band (at most `ap` above the cap top), then down onto the band at the
  // landing XL and into the front, the end somewhere down the cap band. With
  // no label over the front the landing is the front itself (the strands
  // dive straight onto the clip edge); past a label (g -> 1) they come down
  // beyond it and run in under it, inside the band.
  // Band: no room above anywhere on the front's side. The hero (o.band: its
  // letters ahead of the front haven't risen, its colophon sits above) keeps
  // to the lower band; other titles arch through the band, low out of the
  // edge dot, over the upper band and down onto the front, so long runs
  // still read as curves.
  function titleCtrl(c, s, o, band, sx, sy0, port, ap, yC, b0, capH, dist, base, XL, g) {
    const F = o.front;
    c[0] = sx;
    c[1] = sy0;
    c[6] = F;
    if (band) {
      const b1 = b0 + capH;
      if (o.band) {
        // A shallow bow that stays under the x-height (the colophon).
        const yM = b1 - capH * 0.32;
        c[2] = sx - (sx - F) * s.l1;
        c[3] = yM - capH * (0.06 + 0.2 * s.u);
        c[4] = F + (sx - F) * (0.1 + 0.16 * s.h2);
        c[5] = yM - capH * (0.04 + 0.12 * (1 + s.fan));
        c[7] = b1 - (0.08 + 0.5 * s.v) * capH;
        return;
      }
      c[2] = sx - (sx - F) * s.l1;
      c[3] = b0 + capH * (0.02 + 0.2 * s.u);
      c[4] = F + (sx - F) * (0.12 + 0.2 * s.h2);
      c[5] = b0 + capH * (0.04 + 0.12 * (1 + s.fan));
      c[7] = b1 - (0.1 + 0.62 * s.v) * capH;
      return;
    }
    if (port) {
      c[2] = sx - (sx - XL) * s.l1;
      c[3] = b0 - ap * (0.62 + 0.38 * s.u);
    } else {
      const d = lowAngle(lowAngle(base) + s.fan * 0.24);
      const L1 = dist * s.l1;
      c[2] = sx + Math.cos(d) * L1;
      c[3] = clamp(sy0 + Math.sin(d) * L1, yC + 8, b0 - capH * 0.12);
    }
    c[4] = XL + s.a * capH;
    const yUp = b0 - ap * (0.22 + 0.5 * s.h2);
    c[5] = yUp + (b0 + capH * (0.04 + 0.4 * s.v) - yUp) * g;
    c[7] = b0 + s.v * capH;
  }

  // One bundle from source (sx, sy0) into the front, weight w, drawn to
  // `env` (its reach and brightness).
  function titleBundle(o, fs, band, sx, sy0, port, w, env, ap, yC, now, XL, g) {
    const b0 = o.top + fs.b0;
    const capH = fs.b1 - fs.b0;
    const reach = smoothstep01(env / 0.55);
    if (reach < 0.02) return;
    const A = TITLE_A * (tSmall ? 1.2 : 1) * (band && !o.band ? 0.8 : 1) * w * Math.min(1, env * 1.25);
    const dist = Math.hypot(sx - XL, sy0 - b0);
    const base = Math.atan2(b0 + capH * 0.5 - sy0, XL - sx);
    const ca = COMET_A * 0.95 * w * env;
    tctx.globalCompositeOperation = 'source-over';
    for (const s of fs.st) {
      const c = s.c;
      titleCtrl(c, s, o, band, sx, sy0, port, ap, yC, b0, capH, dist, base, XL, g);
      // The drawn part grows from the source toward the front with the
      // envelope (and retracts into the source as it eases out).
      if (reach < 1) splitAt(c, reach, TLV, TRS);
      else TLV.set(c);
      // Fade steps over the full strand's t, cut at the reach.
      REST.set(TLV);
      let prev = 0;
      let m = 0;
      for (let i = 0; i < 4; i++) {
        const b = TITLE_STEPS[i];
        if (b >= reach - 1e-4) {
          TSG[m++].set(REST);
          break;
        }
        splitAt(REST, (b - prev) / (reach - prev), TSG[m++], REST);
        prev = b;
      }
      const r = s.cy ? TR_CYAN : TR_ICE;
      tctx.lineWidth = s.wc ? 0.85 : 0.55;
      for (let i = 0; i < m; i++) {
        const q = TSG[i];
        // Last drawn step brightens as it nears the front.
        const f = i === m - 1 && reach < 1 ? TITLE_FADE[i] * (0.6 + 0.4 * reach) : TITLE_FADE[i];
        tctx.strokeStyle = qa(r, A * f);
        tctx.beginPath();
        tctx.moveTo(q[0], q[1]);
        tctx.bezierCurveTo(q[2], q[3], q[4], q[5], q[6], q[7]);
        tctx.stroke();
      }
      grow(c[0], c[1], 4);
      grow(c[2], c[3], 4);
      grow(c[4], c[5], 4);
      grow(c[6], c[7], 4);
    }
    // Comets streaming into the letters (along the same curves).
    if (ca > 0.01) {
      tctx.globalCompositeOperation = 'lighter';
      for (const s of fs.st) {
        const h = ((now / s.per + s.ph) % 1) * (1 + s.tl);
        if (h - s.tl >= reach) continue;
        if (reach < 1) splitAt(s.c, reach, TLV, TRS);
        else TLV.set(s.c);
        comet(tctx, TLV, h / reach, s.tl / reach, s.cy ? TR_HEADC : TR_HEAD, ca, (s.wc ? 0.85 : 0.55) * 1.8, false);
      }
      tctx.globalCompositeOperation = 'source-over';
    }
  }

  const smoothstep01 = (x) => {
    const t = clamp(x, 0, 1);
    return t * t * (3 - 2 * t);
  };

  // A bundle's drawn amount eases toward its target on its own clock: up at
  // most VIS_RATE per second (so it always grows out of its source, even
  // when the envelope is already high: a late text read, a change of
  // approach), down a little faster.
  const VIS_UP = 0.16;
  const VIS_DOWN = 0.1;
  const VIS_RATE = 2.6;
  const easeVis = (v, t, dt) => {
    if (t > v) v += Math.min((t - v) * (1 - Math.exp(-dt / VIS_UP)), VIS_RATE * dt);
    else v += (t - v) * (1 - Math.exp(-dt / VIS_DOWN));
    return v < 0.002 && t === 0 ? 0 : v;
  };
  const LAND_GAP = 18;              // css px between a label's end and the landing
  let tYOff = 0;                    // layer offset the strand canvas shows this frame

  // Draws one title's bundles; returns true while something is still easing
  // (the host may drop to its idle cadence when nothing is).
  function drawTitle(o, now, sy) {
    const fs = titleState(o);
    const gap = fs.last ? (now - fs.last) / 1000 : Infinity;
    // New, or woken after a sleep: start from nothing.
    const first = !(gap < 0.25);
    const dt = first ? 1 / 60 : Math.min(0.05, gap);
    fs.last = now;
    const k = (tau) => 1 - Math.exp(-dt / tau);
    if (first) {
      fs.visA = 0;
      fs.visB = 0;
      fs.vis = 0;
      fs.mode = '';
      fs.src.clear();
      fs.b0 = NaN;
      fs.ap = NaN;
    }
    // Cap band relative to the title's box, eased (a multi-line title
    // switches lines without a jump).
    const r0 = o.c0 - o.top;
    const r1 = o.c1 - o.top;
    let busy = false;
    if (Number.isNaN(fs.b0)) {
      fs.b0 = r0;
      fs.b1 = r1;
    } else {
      fs.b0 += (r0 - fs.b0) * k(0.08);
      fs.b1 += (r1 - fs.b1) * k(0.08);
      busy = Math.abs(r0 - fs.b0) > 0.2 || Math.abs(r1 - fs.b1) > 0.2;
    }
    const b0 = o.top + fs.b0;
    const b1 = o.top + fs.b1;
    const capH = Math.max(4, fs.b1 - fs.b0);
    const F = o.front;
    const big = capH * 0.8;
    // Landing: where the bundle comes down onto the band. The front itself,
    // or just past a label sitting low over it (it would leave no room for
    // an arc), so the strands still come from above: down beyond the label,
    // then in under it.
    const end = labelEnd(F, b0, b1, Math.max(capH * 0.45, 28) + 12, big, Math.max(capH * 0.5, 24), sy);
    const XL = Math.max(F + 2, end + LAND_GAP);
    const g = smoothstep01((XL - F - 2) / Math.max(24, capH * 0.5));
    fs.land = XL;
    // Free room over the band from the landing to the screen edge.
    const yC = ceilingAbove(XL - 16, b0 - vh * 0.42, b1, big, sy, b0);
    const room = b0 - yC - 12;
    fs.ceil = yC;
    const apT = clamp(room, 0, Math.min(capH * 1.5, vh * 0.24));
    if (Number.isNaN(fs.ap)) fs.ap = apT;
    else fs.ap += (apT - fs.ap) * k(apT < fs.ap ? 0.05 : 0.2);
    if (Math.abs(apT - fs.ap) > 0.3) busy = true;
    const ap = Math.min(fs.ap, Math.max(0, b0 - yC - 6));
    // Approach: from above whenever there is room over the band on the
    // front's side (with hysteresis), else along the band. A change is a
    // cross-fade: the old bundle retracts into its source, the new one grows
    // out of its own.
    let above = false;
    if (!o.band && XL < vw - Math.max(capH * 0.6, 40)) {
      above = room >= (fs.mode === 'above' ? Math.max(capH * 0.16, 12) : Math.max(capH * 0.3, 22));
    }
    fs.mode = above ? 'above' : 'band';
    const squeeze = smoothstep01((ap - capH * 0.1) / (capH * 0.22));
    // A band that has left the screen lets go.
    const env = b1 > -capH * 0.25 && b0 < vh + capH * 0.25 ? o.env : 0;
    const tA = above ? env * squeeze : 0;
    const tB = above ? 0 : env;
    fs.visA = easeVis(fs.visA, tA, dt);
    fs.visB = easeVis(fs.visB, tB, dt);
    fs.vis = fs.visA + fs.visB;
    if (Math.abs(tA - fs.visA) > 0.002 || Math.abs(tB - fs.visB) > 0.002) busy = true;

    // Nearest usable hub (above the band, ahead of the landing, under the
    // ceiling, within reach); the edge dot takes the rest of the weight.
    const src = fs.src;
    const yLo = yC + 14;
    const yHi = b0 - capH * 0.2;
    let best = null;
    let bestW = 0;
    let bestK = 0;
    if (fs.visA > 0 || tA > 0) {
      const reachMax = tSmall ? 380 : 640;
      for (const h of hubs) {
        for (let kk = h.k0; kk <= h.k1; kk++) {
          const hy = h.cy + kk * T - tYOff;
          if (hy <= yLo || hy >= yHi) continue;
          const hx = h.cx;
          const d = Math.hypot(hx - XL, hy - b0);
          if (d >= reachMax) continue;
          const v = dimOf(h, kk);
          const wt = smoothstep01((hx - XL - vw * 0.08) / (vw * 0.08))
            * smoothstep01((hy - yLo) / 30)
            * smoothstep01((yHi - hy) / 36)
            * (1 - smoothstep01((d - reachMax * 0.6) / (reachMax * 0.4)))
            * v * v;
          if (wt > bestW) {
            bestW = wt;
            best = h;
            bestK = kk;
          }
        }
      }
    }
    const bestKey = best ? best.i * 4096 + bestK : -1;
    if (best && !src.has(bestKey)) src.set(bestKey, { w: 0, h: best, k: bestK });
    if (!src.has(-1)) src.set(-1, { w: first ? 1 : 0, h: null, k: 0 });
    for (const [key, s] of src) {
      const target = key === -1 ? 1 - bestW : key === bestKey ? bestW : 0;
      let tau = T_TAU;
      if (key !== -1 && key !== bestKey) {
        // A hub that no longer qualifies (the room moved off it, or the
        // band left the screen) lets go quickly: its strands would cross copy.
        const hy = s.h.cy + s.k * T - tYOff;
        if (hy <= yLo - 2 || hy >= yHi + 2 || env === 0) tau = 0.05;
      }
      s.w += (target - s.w) * (first ? 1 : k(tau));
      if (Math.abs(target - s.w) > 0.003) busy = true;
      if (s.w < 0.004 && target === 0) src.delete(key);
    }
    if (fs.vis < 0.004) return busy;

    // Soft light where the strands meet the front (under the letters, it
    // shows through the outline ahead of the fill).
    const gA = 0.2 * fs.vis;
    if (gA > 0.004) {
      const cyM = b0 + capH * 0.5;
      tctx.globalAlpha = gA;
      tctx.setTransform(dpr * (capH * 0.3) / 30, 0, 0, dpr * (capH * 0.55) / 30, F * dpr, cyM * dpr);
      tctx.fillStyle = glowGrad;
      tctx.fillRect(-30, -30, 60, 60);
      tctx.globalAlpha = 1;
      tctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      grow(F, cyM, capH * 0.8);
    }

    const portX = vw - (tSmall ? 12 : 26);
    if (fs.visA >= 0.004) {
      const portY = b0 - ap * 0.3;
      for (const [key, s] of src) {
        if (s.w < 0.004) continue;
        if (key === -1) {
          titleBundle(o, fs, false, portX, portY, true, s.w, fs.visA, ap, yC, now, XL, g);
          edgeDot(portX, portY, smoothstep01(fs.visA / 0.4) * s.w);
        } else {
          const hx = s.h.cx;
          const hy = s.h.cy + s.k * T - tYOff + ANCHOR;
          titleBundle(o, fs, false, hx, hy, false, s.w, fs.visA, ap, yC, now, XL, g);
          // The strand layer draws this hub's dot; take the strands' roots
          // out from under it here, so they pour out of its centre without
          // the title canvas brightening the dot (it may be knocked down
          // over copy).
          tctx.globalCompositeOperation = 'destination-out';
          tctx.fillStyle = '#000';
          tctx.beginPath();
          tctx.arc(hx, hy, HUB_R, 0, TAU);
          tctx.fill();
          tctx.globalCompositeOperation = 'source-over';
          grow(hx, hy, 8);
        }
      }
    }
    if (fs.visB >= 0.004) {
      const portY = b0 + capH * 0.68;
      titleBundle(o, fs, true, portX, portY, true, 1, fs.visB, 0, yC, now, F, 0);
      edgeDot(portX, portY, smoothstep01(fs.visB / 0.4));
    }
    return busy;
  }

  // The edge dot a bundle leaves from when no hub is near: eases in with it.
  function edgeDot(x, y, e) {
    if (e <= 0.01) return;
    tctx.globalAlpha = GLOW_A * e;
    tctx.setTransform(dpr, 0, 0, dpr, x * dpr, y * dpr);
    tctx.fillStyle = glowGrad;
    tctx.fillRect(-30, -30, 60, 60);
    tctx.globalAlpha = 1;
    tctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    tctx.fillStyle = qa(DOT_R, DOT_A * e);
    tctx.beginPath();
    tctx.arc(x, y, HUB_R * (0.55 + 0.45 * e), 0, TAU);
    tctx.fill();
    grow(x, y, 32);
  }

  // Active titles this frame (from sampleFibreTitles); sy: document scroll;
  // offset: the parallax offset the host applies to the strand layer this
  // frame (hub copies are placed where that layer will show them, whichever
  // of the two runs first in the frame). Returns true while some bundle is
  // still easing.
  function drawTitles(now, list, n, sy, offset) {
    if (!tctx || !vw) return false;
    clearTitleBox();
    if (!n) return false;
    if (!tAlloc) allocTitles();
    tSmall = vw < 720;
    if (!TR_ICE) {
      TR_ICE = ramp(mixc(ICE, WHITE, 0.5));
      TR_CYAN = ramp(mixc(CYAN, ICE, 0.45));
      TR_HEAD = ramp(WHITE);
      TR_HEADC = ramp(mixc(CYAN, WHITE, 0.55));
    }
    tYOff = layerOff - (Number.isFinite(offset) ? Math.round((layerOff - offset) * dpr) / dpr : shiftPx || 0);
    tBox[0] = Infinity;
    tBox[1] = Infinity;
    tBox[2] = -Infinity;
    tBox[3] = -Infinity;
    tctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    tctx.lineCap = 'round';
    let busy = false;
    for (let i = 0; i < n; i++) if (drawTitle(list[i], now, sy)) busy = true;
    tctx.globalAlpha = 1;
    tctx.globalCompositeOperation = 'source-over';
    tDirty = tBox[2] > tBox[0];
    return busy;
  }

  // Nothing active any more: clear and free the canvas.
  function clearTitles() {
    if (!tctx) return;
    if (tAlloc) clearTitleBox();
    releaseTitles();
  }

  // Both canvases follow the parallax offset with a compositor transform.
  // The light canvas only moves by how far the strands moved since the
  // comets were last drawn (a few px at most), so comets stay on their
  // strands between comet frames.
  function setShift(shift) {
    if (shift !== shiftPx) {
      shiftPx = shift;
      layer.style.transform = shift ? `translate3d(0,${shift}px,0)` : '';
    }
    const d = lit ? shift - cometShift : 0;
    if (d !== lightPx) {
      lightPx = d;
      canvas.style.transform = d ? `translate3d(0,${d}px,0)` : '';
    }
  }

  // time: ms (rAF clock); offset: parallax px; still: single static frame;
  // sy: document scroll (for the text knock-down).
  function draw(time, offset, still = false, sy = 0) {
    if (!vw || !hubs.length) return;
    frame++;
    scrollY = sy;
    const sec = time / 1000;
    if (!layerOk || still || frame % STRAND_EVERY === 0 || Math.abs(layerOff - offset) > MARGIN - 8) {
      renderLayer(sec, offset, still);
    }
    // Parallax between strand renders: move the strand canvas on the
    // compositor, snapped to whole device pixels so hairlines stay crisp.
    const shift = Math.round((layerOff - offset) * dpr) / dpr;

    // Comets ride the geometry of the last strand render (same snapped
    // offset), so they never drift off their strand.
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    if (lit) ctx.clearRect(0, 0, canvas.width, canvas.height);
    lit = false;
    ctx.globalCompositeOperation = 'lighter';
    ctx.lineCap = 'round';
    // Effective offset the strand canvas is showing right now.
    const yOff = layerOff - shift;
    for (const s of cometStrands) {
      if (s.k1 < s.k0) continue;
      const h = ((time + s.o) % s.period) / s.dur;
      if (h >= 1 + s.tail) continue;
      const p = h < 1 ? h : 1;
      const a = COMET_A * s.ca * (s.kind ? 1 : 1 - p * 0.7);
      for (let k = s.k0; k <= s.k1; k++) {
        // Comets leaving a knocked-down hub stay dim until they clear it.
        let v;
        if (s.kind) {
          const at = s.rev ? 1 - p : p;
          v = at < 0.5
            ? dimOf(s.a, k) + (1 - dimOf(s.a, k)) * Math.min(1, at / 0.3)
            : dimOf(s.b, k + s.bk) + (1 - dimOf(s.b, k + s.bk)) * Math.min(1, (1 - at) / 0.3);
        } else {
          const v0 = dimOf(s.h, k);
          v = v0 + (1 - v0) * Math.min(1, p / 0.4);
        }
        ctx.setTransform(dpr, 0, 0, dpr, 0, (k * T - yOff) * dpr);
        comet(ctx, s.c, h, s.tail, s.head, a * v, s.width * 1.7, s.rev);
      }
      lit = true;
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    cometShift = shift;
    setShift(shift);
  }

  // Scroll frames between drawn frames: transforms only. Returns false when
  // the strand layer has run out of margin (the caller then draws).
  function move(offset) {
    if (!layerOk || Math.abs(layerOff - offset) > MARGIN - 8) return false;
    setShift(Math.round((layerOff - offset) * dpr) / dpr);
    return true;
  }

  // Text line boxes in document px ([x0, y0, x1, y1]*, sorted by y0), the
  // tallest box's height, the boxes of position: fixed copy in viewport px
  // (same layout, any order) and, per fixed box, 1 when it sits on its own
  // opaque surface; null clears.
  function setText(boxes, maxH = 0, fixed = null, solid = null) {
    text = boxes && boxes.length ? boxes : null;
    textN = text ? text.length >> 2 : 0;
    textMaxH = maxH;
    fixedT = fixed && fixed.length ? fixed : null;
    fixedN = fixedT ? fixedT.length >> 2 : 0;
    fixedS = fixedT && solid && solid.length === fixedN ? solid : null;
  }

  // Would the text dim of any drawn hub change at document scroll `sy`?
  // (Reduced motion repaints its still frame only when it would.)
  function wouldChange(sy) {
    if (!layerOk) return true;
    const toDoc = sy - layerOff;
    for (const h of hubs) {
      for (const [k, v] of h.dm) {
        if (Math.abs(textDim(h.cx, h.cy + k * T + toDoc, sy) - v) > 0.04) return true;
      }
    }
    return false;
  }

  // Debug/verification: on-screen hub copies with their current dim.
  function probe() {
    const out = [];
    for (const h of hubs) {
      for (const [k, v] of h.dm) {
        out.push({ x: h.cx, y: h.cy + k * T - layerOff + (shiftPx || 0), v });
      }
    }
    return out;
  }

  function destroy() {
    canvas.width = 0;
    canvas.height = 0;
    layer.width = 0;
    layer.height = 0;
    layer.style.transform = '';
    canvas.style.transform = '';
    canvas.style.height = '';
    releaseTitles();
    hubs = [];
    strands = [];
    cometStrands = [];
    text = null;
    textN = 0;
  }

  return { resize, build, draw, move, setText, wouldChange, probe, destroy, drawTitles, clearTitles };
}
