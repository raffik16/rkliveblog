// The record's label: the set's name under the hot dog, alternating with the other names the night could go by. The
// name holds for four bars, then cross-fades into the next over the last bar (smootherstep, so it never pops):
// Roller Grill Sessions, then Bun 2 Bun, then Roller Grill Sessions, then Buns Per Minute, and so on. Each name is
// drawn once at load; a long one breaks onto two lines.
import * as THREE from 'three'

export const DEFAULT_TITLE = 'ROLLER GRILL SESSIONS'
export const ALSO_KNOWN_AS = [
  'BUN 2 BUN',
  'BUNS PER MINUTE',
  'FOOTLONG (EXTENDED MIX)',
  'DIJON VU',
  'LET THE MEAT DROP',
  'BUN & BASS',
  'MUSTARD ON THE BEAT',
  'FRANKFURTER TECHNO',
]

const HOLD_BARS = 4
const FADE_BARS = 1

const smoother = (x) => {
  const k = Math.min(1, Math.max(0, x))
  return k * k * k * (k * (k * 6 - 15) + 10)
}

/** One name, centred on a transparent canvas, as large as fits: one line, or two if that lets it be bigger. */
function nameTexture(name, font) {
  const W = 1024
  const H = 320
  const c = document.createElement('canvas')
  c.width = W
  c.height = H
  const g = c.getContext('2d')
  const widthAt = (text, px) => {
    g.font = `${px}px ${font}`
    return g.measureText(text).width
  }
  // the size each layout allows: one line, or each way of breaking the name in two at a space
  const max = 150
  const fit = (lines) => {
    const lineH = Math.min(max, (H * 0.9) / lines.length / 1.05)
    const widest = Math.max(...lines.map((l) => widthAt(l, 100)))
    return Math.min(lineH, (100 * W * 0.94) / widest)
  }
  // the biggest two-line break, used only when it buys noticeably bigger type than one line
  const one = { lines: [name], px: fit([name]) }
  let two = null
  const words = name.split(' ')
  for (let i = 1; i < words.length; i++) {
    const lines = [words.slice(0, i).join(' '), words.slice(i).join(' ')]
    const px = fit(lines)
    if (!two || px > two.px) two = { lines, px }
  }
  const best = two && two.px > one.px * 1.25 ? two : one
  const { lines, px } = best
  g.font = `${px}px ${font}`
  g.textAlign = 'center'
  g.textBaseline = 'middle'
  g.fillStyle = '#ffd21f'
  g.shadowColor = 'rgba(80, 0, 10, 0.6)'
  g.shadowBlur = px * 0.08
  const lh = px * 1.05
  lines.forEach((l, i) => g.fillText(l, W / 2, H / 2 + (i - (lines.length - 1) / 2) * lh))
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 8
  return tex
}

/**
 * The names, as two layers lying on the label that cross-fade into each other. width: the space they fill on the
 * label (world units); the group lies flat (text up) at its origin. title: the set's name; font: a CSS font family.
 */
export function buildLabelNames(title, font, width) {
  // the night's other names (with a name of its own, Roller Grill Sessions becomes one of them)
  const others = [DEFAULT_TITLE, ...ALSO_KNOWN_AS].filter((n) => n !== title)
  // the set's name between each of the others
  const order = others.flatMap((n) => [title, n])
  const cache = new Map()
  const tex = order.map((n) => {
    if (!cache.has(n)) cache.set(n, nameTexture(n, font))
    return cache.get(n)
  })

  const geo = new THREE.PlaneGeometry(width, (width * 320) / 1024)
  geo.rotateX(-Math.PI / 2)
  const layer = (offset) =>
    new THREE.Mesh(
      geo,
      new THREE.MeshStandardMaterial({
        map: tex[0],
        emissiveMap: tex[0],
        emissive: new THREE.Color(0.45, 0.45, 0.45),
        roughness: 0.4,
        transparent: true,
        depthWrite: false,
        polygonOffset: true,
        polygonOffsetFactor: -4 - offset,
        polygonOffsetUnits: -4 - offset,
      })
    )
  const a = layer(0)
  const b = layer(1)
  a.renderOrder = 1
  b.renderOrder = 2
  const group = new THREE.Group()
  group.add(a, b)

  const set = (mesh, t, opacity) => {
    if (mesh.material.map !== t) {
      mesh.material.map = t
      mesh.material.emissiveMap = t
    }
    mesh.material.opacity = opacity
    mesh.visible = opacity > 0.001
  }
  /** beats: the set's beat clock. */
  const update = (beats) => {
    const slot = beats / 4 / HOLD_BARS
    const i = Math.floor(slot)
    const into = (slot - i) * HOLD_BARS // bars into this name
    const w = smoother((into - (HOLD_BARS - FADE_BARS)) / FADE_BARS)
    const n = order.length
    const cur = ((i % n) + n) % n
    set(a, tex[cur], 1 - w)
    set(b, tex[(cur + 1) % n], w)
  }
  update(0)
  return { group, update, textures: [...cache.values()] }
}
