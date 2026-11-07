// The marquee: the set's name on a ribbon board that rings the whole room, above the plaza and in front of the
// skyline, so whichever way the camera looks it can read it. The name runs round four times and crawls one way,
// once round every 64 bars; under it the other names the night could go by crawl the other way, once round every 32.
// Small hot dogs stand between the names. The board breathes with the kick, and nothing on it ever steps: it is a
// smooth function of the beat clock.
import * as THREE from 'three'

export const MARQUEE = { radius: 70, y: 4.6 }

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

// a little hot dog to stand between names: bun, frank, mustard
function hotDogGlyph(g, x, y, s) {
  g.save()
  g.translate(x, y)
  g.scale(s, s)
  g.fillStyle = '#f2a04c'
  g.beginPath()
  g.ellipse(0, 10, 46, 16, 0, 0, Math.PI * 2)
  g.fill()
  g.fillStyle = '#e0452a'
  g.beginPath()
  g.ellipse(0, 1, 52, 9, 0, 0, Math.PI * 2)
  g.fill()
  g.strokeStyle = '#ffe14a'
  g.lineWidth = 4
  g.lineJoin = 'round'
  g.beginPath()
  for (let i = 0; i <= 10; i++) g.lineTo(-40 + i * 8, i % 2 ? -3 : 3)
  g.stroke()
  g.restore()
}

/**
 * One strip of text for the board: the names in `parts`, each followed by a hot dog, on a transparent canvas
 * `aspect` times as wide as it is tall. The type is as large as fits, at most `maxPx`, with the spare width shared
 * out between the names. Returns the texture.
 */
function strip(parts, font, { aspect, fill, maxW = 8192, maxPx = 150 }) {
  const c = document.createElement('canvas')
  const g = c.getContext('2d')
  const textW = (p) => {
    g.font = `${p}px ${font}`
    return parts.reduce((w, t) => w + g.measureText(t).width, 0)
  }
  let size = maxPx
  for (let i = 0; i < 40; i++) {
    const W = Math.round(aspect * Math.ceil(size * 1.5))
    if (W <= maxW && textW(size) + size * 1.4 * parts.length <= W) break
    size = Math.floor(size * 0.92)
  }
  const H = Math.ceil(size * 1.5)
  const W = Math.round(aspect * H)
  c.width = W
  c.height = H
  const gap = (W - textW(size)) / parts.length
  g.font = `${size}px ${font}`
  g.textBaseline = 'middle'
  const grad = g.createLinearGradient(0, H * 0.2, 0, H * 0.8)
  fill.forEach((hex, i) => grad.addColorStop(i / (fill.length - 1), hex))
  let x = 0
  for (const t of parts) {
    g.shadowColor = fill[fill.length - 1]
    g.shadowBlur = size * 0.1
    g.fillStyle = grad
    g.fillText(t, x, H / 2)
    g.shadowBlur = 0
    x += g.measureText(t).width
    hotDogGlyph(g, x + gap / 2, H / 2, size / 130)
    x += gap
  }
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.wrapS = THREE.RepeatWrapping
  tex.anisotropy = 8
  return tex
}

/** A band of the board, `height` tall: an open cylinder whose inside carries `parts` round `times` times. */
function band(radius, height, times, parts, font, style, colorK) {
  const tex = strip(parts, font, { ...style, aspect: (2 * Math.PI * radius) / times / height })
  const geo = new THREE.CylinderGeometry(radius, radius, height, 360, 1, true)
  // read from inside the ring: run the strip the other way round
  const uv = geo.attributes.uv
  for (let i = 0; i < uv.count; i++) uv.setX(i, 1 - uv.getX(i))
  tex.repeat.set(times, 1)
  const mat = new THREE.MeshBasicMaterial({
    map: tex,
    color: new THREE.Color(colorK, colorK, colorK),
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    side: THREE.BackSide,
    fog: false,
  })
  const mesh = new THREE.Mesh(geo, mat)
  mesh.frustumCulled = false
  return { mesh, height, mat, base: colorK }
}

/** title: the set's name; font: a CSS font family for the board's type (loaded before this is called). */
export function buildMarquee(title, font) {
  const R = MARQUEE.radius
  const group = new THREE.Group()
  group.position.y = MARQUEE.y

  // the name four times round, the others once
  const main = band(
    R,
    8,
    4,
    [title],
    font,
    { fill: ['#fff3a8', '#ffd21f', '#ff6a1f'], maxW: 4096 },
    1.2
  )
  // the night's other names (with a name of its own, Roller Grill Sessions becomes one of them)
  const others = [DEFAULT_TITLE, ...ALSO_KNOWN_AS].filter((n) => n !== title)
  const aka = band(
    R,
    4.2,
    1,
    others,
    font,
    { fill: ['#e6fdff', '#2ee6ff', '#ff3df0'], maxW: 8192 },
    1.05
  )
  // the names sit under the title, the two bands' letters a little apart
  const gapY = 0.15 * main.height
  main.mesh.position.y = aka.height / 2 + gapY / 2
  aka.mesh.position.y = -main.height / 2 - gapY / 2
  group.add(main.mesh, aka.mesh)

  // the board behind the letters: dark glass, a line of light along its top and bottom edges
  const top = main.mesh.position.y + main.height * 0.42
  const bottom = aka.mesh.position.y - aka.height * 0.42
  const back = new THREE.Mesh(
    new THREE.CylinderGeometry(R + 0.3, R + 0.3, top - bottom, 180, 1, true),
    new THREE.MeshBasicMaterial({
      color: '#05030a',
      transparent: true,
      opacity: 0.38,
      depthWrite: false,
      side: THREE.BackSide,
      fog: false,
    })
  )
  back.position.y = (top + bottom) / 2
  back.renderOrder = 4
  group.add(back)
  const edgeMat = new THREE.MeshBasicMaterial({ color: '#ff3df0', fog: false })
  const edgeBase = new THREE.Color('#ff3df0').multiplyScalar(1.4)
  for (const y of [top, bottom]) {
    const g = new THREE.TorusGeometry(R + 0.2, 0.07, 5, 720)
    g.rotateX(Math.PI / 2)
    const e = new THREE.Mesh(g, edgeMat)
    e.position.y = y
    group.add(e)
  }
  main.mesh.renderOrder = 6
  aka.mesh.renderOrder = 6

  /** beats: the set's beat clock; kick: this beat's pulse (0..1). */
  const update = (beats, kick) => {
    main.mesh.rotation.y = (2 * Math.PI * beats) / (64 * 4)
    aka.mesh.rotation.y = (-2 * Math.PI * beats) / (32 * 4)
    const b = 1 + 0.12 * kick
    main.mat.color.setScalar(main.base * b)
    aka.mat.color.setScalar(aka.base * b)
    edgeMat.color.copy(edgeBase).multiplyScalar(0.85 + 0.25 * kick)
  }
  update(0, 0)
  return { group, update }
}
