// Music notes as solid glyphs, extruded and bevelled: whole, half, quarter, eighth, a beamed pair of eighths, a beamed
// pair of sixteenths, a sharp, and a treble clef drawn as one neon tube. Drawn in staff spaces: a notehead is one space
// tall, a stem three and a half, as engravers set them. Each glyph is centred on its notehead (the clef on its G line),
// so a glyph placed at a staff position sits on the right line.
//
// The material is black lacquer that glows in its own instance colour, and a shared uniform pulses the glow on the beat.
import * as THREE from 'three'

const HEAD_RX = 0.66 // notehead half-width, in staff spaces
const HEAD_RY = 0.47
const TILT = 0.36 // noteheads lean about 20 degrees
const STEM_W = 0.13
const STEM_H = 3.5

function head(path, cx, cy, hollow) {
  const sh = new THREE.Shape()
  sh.absellipse(cx, cy, HEAD_RX, HEAD_RY, 0, Math.PI * 2, false, TILT)
  if (hollow) {
    const h = new THREE.Path()
    h.absellipse(cx, cy, HEAD_RX * 0.62, HEAD_RY * 0.42, 0, Math.PI * 2, true, TILT + 0.25)
    sh.holes.push(h)
  }
  path.push(sh)
}
// the stem's right edge meets the head where the tilted ellipse is widest
const stemX = (cx) => cx + HEAD_RX * 0.93
function stem(path, cx, cy, h = STEM_H) {
  const x = stemX(cx)
  const sh = new THREE.Shape()
  sh.moveTo(x - STEM_W, cy + 0.1)
  sh.lineTo(x, cy + 0.18)
  sh.lineTo(x, cy + h)
  sh.lineTo(x - STEM_W, cy + h)
  sh.closePath()
  path.push(sh)
}
function flag(path, cx, cy, y0 = STEM_H) {
  const x = stemX(cx)
  const sh = new THREE.Shape()
  sh.moveTo(x - 0.02, cy + y0)
  sh.bezierCurveTo(x + 0.15, cy + y0 - 0.9, x + 1.25, cy + y0 - 1.25, x + 0.85, cy + y0 - 2.75)
  sh.bezierCurveTo(x + 1.0, cy + y0 - 1.75, x + 0.35, cy + y0 - 1.45, x - 0.02, cy + y0 - 1.15)
  sh.closePath()
  path.push(sh)
}
function beam(path, x0, y0, x1, y1, t = 0.5) {
  const sh = new THREE.Shape()
  sh.moveTo(x0 - STEM_W, y0 - t)
  sh.lineTo(x1, y1 - t)
  sh.lineTo(x1, y1)
  sh.lineTo(x0 - STEM_W, y0)
  sh.closePath()
  path.push(sh)
}

function extrude(shapes, depth = 0.34) {
  const g = new THREE.ExtrudeGeometry(shapes, {
    depth,
    bevelEnabled: true,
    bevelThickness: 0.07,
    bevelSize: 0.05,
    bevelSegments: 1,
    curveSegments: 12,
  })
  g.translate(0, 0, -depth / 2)
  g.computeVertexNormals()
  return g
}

/** Each glyph: geometry, how many beats it lasts on the staff, and its width in staff spaces. */
export function noteGlyphs() {
  const glyphs = {}
  let s = []
  head(s, 0, 0, true)
  glyphs.whole = { geo: extrude(s), beats: 4, width: 1.6 }

  s = []
  head(s, 0, 0, true)
  stem(s, 0, 0)
  glyphs.half = { geo: extrude(s), beats: 2, width: 1.4 }

  s = []
  head(s, 0, 0, false)
  stem(s, 0, 0)
  glyphs.quarter = { geo: extrude(s), beats: 1, width: 1.4 }

  s = []
  head(s, 0, 0, false)
  stem(s, 0, 0)
  flag(s, 0, 0)
  glyphs.eighth = { geo: extrude(s), beats: 0.5, width: 2.2 }

  // a beamed pair: the second note a step higher, so the beam climbs
  s = []
  const dx = 2.6
  head(s, 0, 0, false)
  head(s, dx, 0.5, false)
  stem(s, 0, 0, STEM_H)
  stem(s, dx, 0.5, STEM_H)
  beam(s, stemX(0), STEM_H, stemX(dx), STEM_H + 0.5)
  glyphs.pair = { geo: extrude(s), beats: 1, width: 4.2 }

  s = []
  head(s, 0, 1, false)
  head(s, dx, 0, false)
  stem(s, 0, 1, STEM_H)
  stem(s, dx, 0, STEM_H + 1)
  beam(s, stemX(0), STEM_H + 1, stemX(dx), STEM_H + 1)
  beam(s, stemX(0), STEM_H + 0.25, stemX(dx), STEM_H + 0.25)
  glyphs.sixteenths = { geo: extrude(s), beats: 0.5, width: 4.2 }

  // a sharp: two thin uprights, two thick rising bars
  s = []
  for (const x of [-0.32, 0.32]) {
    const sh = new THREE.Shape()
    sh.moveTo(x - 0.06, -1.5 + (x > 0 ? 0.25 : 0))
    sh.lineTo(x + 0.06, -1.5 + (x > 0 ? 0.25 : 0))
    sh.lineTo(x + 0.06, 1.5 + (x > 0 ? 0 : -0.25) + 0.25)
    sh.lineTo(x - 0.06, 1.5 + (x > 0 ? 0 : -0.25) + 0.25)
    sh.closePath()
    s.push(sh)
  }
  for (const y of [-0.55, 0.45]) {
    const sh = new THREE.Shape()
    sh.moveTo(-0.62, y - 0.18)
    sh.lineTo(0.62, y + 0.12)
    sh.lineTo(0.62, y + 0.42)
    sh.lineTo(-0.62, y + 0.12)
    sh.closePath()
    s.push(sh)
  }
  glyphs.sharp = { geo: extrude(s), beats: 0, width: 1.6 }

  glyphs.clef = { geo: trebleClef(), beats: 0, width: 3 }
  return glyphs
}

/** A treble clef as one stroke: the curl round the G line, up through the spine, over the top loop, down to the hook. */
export function trebleClef() {
  // staff spaces; the spiral's centre sits on the G line (y = 0)
  const P = [
    [0.18, 0.05],
    [0.42, 0.35],
    [0.18, 0.72],
    [-0.38, 0.62],
    [-0.75, 0.0],
    [-0.5, -0.82],
    [0.32, -1.08],
    [1.05, -0.62],
    [1.18, 0.28],
    [0.78, 1.15],
    [0.05, 1.82],
    [-0.62, 2.6],
    [-0.85, 3.55],
    [-0.55, 4.55],
    [-0.02, 5.15],
    [0.38, 4.95],
    [0.42, 4.2],
    [0.08, 3.25],
    [-0.12, 2.0],
    [-0.02, 0.4],
    [0.18, -1.3],
    [0.25, -2.6],
    [0.05, -3.25],
    [-0.42, -3.45],
    [-0.78, -3.15],
  ]
  const curve = new THREE.CatmullRomCurve3(
    P.map(([x, y]) => new THREE.Vector3(x, y, 0)),
    false,
    'centripetal'
  )
  const tube = new THREE.TubeGeometry(curve, 140, 0.15, 8, false)
  // the ball at the end of the hook, and a cap where the stroke begins
  const ball = new THREE.SphereGeometry(0.36, 16, 12)
  const end = curve.getPoint(1)
  ball.translate(end.x - 0.1, end.y + 0.1, 0)
  const cap = new THREE.SphereGeometry(0.15, 10, 8)
  const start = curve.getPoint(0)
  cap.translate(start.x, start.y, 0)
  const parts = [tube, ball, cap].map((g) => {
    const n = g.toNonIndexed()
    n.deleteAttribute('uv')
    return n
  })
  const count = parts.reduce((s, g) => s + g.attributes.position.count, 0)
  const out = new THREE.BufferGeometry()
  for (const name of ['position', 'normal']) {
    const arr = new Float32Array(count * 3)
    let o = 0
    for (const g of parts) {
      arr.set(g.attributes[name].array, o)
      o += g.attributes[name].array.length
    }
    out.setAttribute(name, new THREE.BufferAttribute(arr, 3))
  }
  return out
}

/**
 * The notes' material: black lacquer that emits its instance colour times uGlow. Returns the material and its glow
 * uniform (shared: set it once per frame).
 */
export function noteMaterial(glow) {
  const m = new THREE.MeshPhysicalMaterial({
    color: '#0b0b10',
    roughness: 0.28,
    metalness: 0.1,
    clearcoat: 1,
    clearcoatRoughness: 0.18,
    envMapIntensity: 0.9,
  })
  m.onBeforeCompile = (sh) => {
    sh.uniforms.uGlow = glow
    sh.fragmentShader = sh.fragmentShader
      .replace('#include <common>', '#include <common>\nuniform float uGlow;')
      .replace(
        '#include <emissivemap_fragment>',
        '#include <emissivemap_fragment>\n#ifdef USE_COLOR\n totalEmissiveRadiance += vColor.rgb * uGlow;\n#endif'
      )
  }
  m.customProgramCacheKey = () => 'note-glow'
  return m
}

// neon, one per glyph family
export const NEON = ['#ff3df0', '#2ee6ff', '#ffe23d', '#4dff6a', '#ff8a2e', '#9a5cff', '#ff4060']
