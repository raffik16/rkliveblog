// Hot Dog City: the land the set plays over. A night sky with stars and a moon that is a slice of frank; a city of
// about a thousand towers round the storm, their windows lit by a shader rather than textures; hot dog skyscrapers,
// mustard and ketchup bottle towers and neon hot dog signs on its skyline; and at its heart, under the storm, a plaza
// that is a record, spinning once every sixteen bars. Fog melts the far side of town into the glow on the horizon.
//
// Everything that moves is a smooth function of time: the record turns, the stars twinkle, the neon breathes and the
// aviation lights fade up and down on the bar.
import * as THREE from 'three'
import { rng } from '../../teardown/kit/util.js'
import { trebleClef } from './notes.js'
import { selfLit } from './mesher.js'
import { GRILL } from './grill.js'

export const CITY = {
  ground: -16,
  inner: 82, // no block nearer the storm than this
  outer: 240,
  cell: 11, // a block, street centre to street centre
  plaza: 54, // the record's radius
}

const smooth = (x) => {
  const k = Math.min(1, Math.max(0, x))
  return k * k * (3 - 2 * k)
}

// ------------------------------------------------------------------ sky
const SKY = {
  vertexShader: /* glsl */ `
    varying vec3 vDir;
    void main() {
      vDir = normalize(position);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }`,
  fragmentShader: /* glsl */ `
    uniform vec3 uZenith;
    uniform vec3 uHorizon;
    uniform vec3 uGlow;
    varying vec3 vDir;
    void main() {
      float y = vDir.y;
      vec3 c = mix(uHorizon, uZenith, smoothstep(0.0, 0.6, y));
      // the city's light, hugging the horizon
      c += uGlow * exp(-max(y, 0.0) * 8.0) * 0.6;
      // below the horizon (behind the ground), fall to the fog's colour
      c = mix(uHorizon * 0.8, c, smoothstep(-0.12, 0.0, y));
      gl_FragColor = vec4(c, 1.0);
    }`,
}

const STARS = {
  vertexShader: /* glsl */ `
    attribute float aSize;
    attribute float aPhase;
    uniform float uTime;
    uniform float uPr;
    varying float vA;
    void main() {
      vec4 mv = modelViewMatrix * vec4(position, 1.0);
      gl_Position = projectionMatrix * mv;
      gl_PointSize = aSize * uPr;
      float h = normalize(position).y;
      vA = (0.55 + 0.45 * sin(uTime * (0.6 + aPhase) + aPhase * 40.0)) * smoothstep(0.08, 0.3, h);
    }`,
  fragmentShader: /* glsl */ `
    varying float vA;
    void main() {
      vec2 q = gl_PointCoord * 2.0 - 1.0;
      float d = dot(q, q);
      if (d > 1.0) discard;
      gl_FragColor = vec4(vec3(0.85, 0.9, 1.0) * exp(-d * 4.0) * vA * 1.4, 1.0);
    }`,
}

function radialSprite(inner, outer) {
  const S = 256
  const c = document.createElement('canvas')
  c.width = c.height = S
  const g = c.getContext('2d')
  const gr = g.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, S / 2)
  gr.addColorStop(0, inner)
  gr.addColorStop(1, outer)
  g.fillStyle = gr
  g.fillRect(0, 0, S, S)
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  return t
}

// ------------------------------------------------------------------ the record
function recordTexture(title, font) {
  const S = 2048
  const cv = document.createElement('canvas')
  cv.width = cv.height = S
  const g = cv.getContext('2d')
  const c = S / 2
  const R = S / 2
  const r = rng(19)
  g.fillStyle = '#060609'
  g.fillRect(0, 0, S, S)
  // grooves: hundreds of fine rings, with gaps between the tracks
  const gaps = [0.42, 0.55, 0.68, 0.82]
  for (let k = 0; k < 520; k++) {
    const rr = R * (0.24 + 0.74 * (k / 520))
    if (gaps.some((gp) => Math.abs(rr / R - gp) < 0.006)) continue
    g.strokeStyle = `rgba(255,255,255,${0.05 + 0.07 * r()})`
    g.lineWidth = 1.4
    g.beginPath()
    g.arc(c, c, rr, 0, Math.PI * 2)
    g.stroke()
  }
  // the label: ketchup red, a mustard ring, a hot dog
  g.fillStyle = '#b8102a'
  g.beginPath()
  g.arc(c, c, R * 0.2, 0, Math.PI * 2)
  g.fill()
  g.strokeStyle = '#ffd21f'
  g.lineWidth = 7
  g.beginPath()
  g.arc(c, c, R * 0.185, 0, Math.PI * 2)
  g.stroke()
  const s = R * 0.0016
  g.save()
  g.translate(c, c - R * 0.035)
  g.scale(s, s)
  g.fillStyle = '#e8a35a'
  g.beginPath()
  g.ellipse(0, 18, 92, 30, 0, 0, Math.PI * 2)
  g.fill()
  g.fillStyle = '#8f2c16'
  g.beginPath()
  g.ellipse(0, 4, 100, 15, 0, 0, Math.PI * 2)
  g.fill()
  g.strokeStyle = '#ffd21f'
  g.lineWidth = 6
  g.beginPath()
  for (let i = 0; i <= 14; i++) g.lineTo(-80 + i * 11.4, i % 2 ? -4 : 6)
  g.stroke()
  g.restore()
  g.fillStyle = '#ffd21f'
  // the set's name, shrunk to fit the label
  g.textAlign = 'center'
  let px = Math.round(R * 0.03)
  g.font = `${px}px ${font}`
  const fit = (R * 0.3) / Math.max(1, g.measureText(title).width)
  if (fit < 1) px = Math.floor(px * fit)
  g.font = `${px}px ${font}`
  g.fillText(title, c, c + R * 0.075)
  g.font = `${Math.round(R * 0.018)}px monospace`
  g.fillText('SIDE A · 33⅓', c, c + R * 0.115)
  g.fillStyle = '#050507'
  g.beginPath()
  g.arc(c, c, R * 0.012, 0, Math.PI * 2)
  g.fill()
  const tex = new THREE.CanvasTexture(cv)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 8
  return tex
}

// ------------------------------------------------------------------ towers
// Windows from the facade's own coordinates: a grid of lit and dark panes per face, seeded per building, faded to
// their average glow where a pane is smaller than a pixel so the far side of town does not shimmer.
function towerMaterial(windows) {
  const m = new THREE.MeshStandardMaterial({
    color: '#0d0b15',
    roughness: 0.82,
    metalness: 0.15,
    envMapIntensity: 0.25,
  })
  m.onBeforeCompile = (sh) => {
    sh.uniforms.uWindows = windows
    sh.vertexShader = sh.vertexShader
      .replace(
        '#include <common>',
        '#include <common>\nvarying vec3 vFacade;\nvarying vec3 vFacN;\nvarying float vSeed;'
      )
      .replace(
        '#include <begin_vertex>',
        `#include <begin_vertex>
        vec3 bScale = vec3(length(instanceMatrix[0].xyz), length(instanceMatrix[1].xyz), length(instanceMatrix[2].xyz));
        vFacade = position * bScale;
        vFacN = normal;
        vSeed = float(gl_InstanceID);`
      )
    sh.fragmentShader = sh.fragmentShader
      .replace(
        '#include <common>',
        '#include <common>\nuniform float uWindows;\nvarying vec3 vFacade;\nvarying vec3 vFacN;\nvarying float vSeed;'
      )
      .replace(
        '#include <emissivemap_fragment>',
        `#include <emissivemap_fragment>
        {
          float wall = 1.0 - step(0.5, abs(vFacN.y));
          float u = abs(vFacN.x) > 0.5 ? vFacade.z : vFacade.x;
          vec2 cell = vec2(u / 1.5, vFacade.y / 2.1);
          vec2 id = floor(cell);
          vec2 f = fract(cell);
          float h = fract(sin(dot(id + vec2(vSeed * 1.37, vSeed * 0.71) + vFacN.xz * 17.0, vec2(12.9898, 78.233))) * 43758.5453);
          vec2 e = smoothstep(vec2(0.16, 0.2), vec2(0.24, 0.28), f) * (1.0 - smoothstep(vec2(0.76, 0.72), vec2(0.84, 0.8), f));
          vec2 fw = fwidth(cell);
          float far = smoothstep(0.3, 0.9, max(fw.x, fw.y));
          float lit = mix(e.x * e.y * step(0.74, h) * (0.55 + 0.6 * fract(h * 97.0)), 0.07, far);
          vec3 wc = h > 0.965 ? vec3(1.6, 0.25, 1.4) : h > 0.93 ? vec3(0.2, 1.2, 1.6) : vec3(1.6, 1.05, 0.55);
          wc = mix(wc, vec3(1.45, 0.95, 0.62), far);
          totalEmissiveRadiance += wc * lit * wall * step(1.4, vFacade.y) * uWindows;
        }`
      )
  }
  m.customProgramCacheKey = () => 'city-towers'
  return m
}

/** A squeeze bottle, standing: a lathe, body and nozzle coloured per vertex. */
function bottle(body, cap) {
  const P = [
    [0, 0],
    [5.0, 0],
    [5.5, 0.7],
    [5.6, 3],
    [5.6, 31],
    [5.3, 33.5],
    [3.8, 36.8],
    [2.3, 38.2],
    [2.3, 39.4],
    [2.6, 39.6],
    [2.6, 42.4],
    [1.4, 43],
    [0.6, 47],
    [0.32, 48.6],
    [0, 48.7],
  ]
  const g = new THREE.LatheGeometry(
    P.map(([x, y]) => new THREE.Vector2(x, y)),
    40
  )
  const pos = g.attributes.position
  const col = new Float32Array(pos.count * 3)
  const a = new THREE.Color(body)
  const b = new THREE.Color(cap)
  for (let i = 0; i < pos.count; i++) (pos.getY(i) < 39.5 ? a : b).toArray(col, i * 3)
  g.setAttribute('color', new THREE.BufferAttribute(col, 3))
  return g
}

/** A neon hot dog sign, facing +z: the bun's curve, the frank's outline, a mustard zigzag; some carry a treble clef. */
function neonSign(mats, withClef) {
  const tube = (pts, closed = false) =>
    new THREE.TubeGeometry(
      new THREE.CatmullRomCurve3(pts, closed, 'centripetal'),
      closed ? 200 : 140,
      0.3,
      6,
      closed
    )
  const V = (x, y) => new THREE.Vector3(x, y, 0)
  const bun = []
  for (let i = 0; i <= 40; i++) {
    const a = Math.PI + (i / 40) * Math.PI
    bun.push(V(11.5 * Math.cos(a), -0.6 + 4.6 * Math.sin(a)))
  }
  const frank = []
  for (let i = 0; i <= 12; i++) frank.push(V(-9.5 + (19 * i) / 12, 3))
  for (let i = 1; i < 12; i++) {
    const a = Math.PI / 2 - (i / 12) * Math.PI
    frank.push(V(9.5 + 1.6 * Math.cos(a), 1.4 + 1.6 * Math.sin(a)))
  }
  for (let i = 0; i <= 12; i++) frank.push(V(9.5 - (19 * i) / 12, -0.2))
  for (let i = 1; i < 12; i++) {
    const a = -Math.PI / 2 - (i / 12) * Math.PI
    frank.push(V(-9.5 + 1.6 * Math.cos(a), 1.4 + 1.6 * Math.sin(a)))
  }
  const mustard = []
  for (let i = 0; i <= 12; i++) mustard.push(V(-8 + (16 * i) / 12, 1.4 + (i % 2 ? 0.75 : -0.75)))
  const sign = new THREE.Group()
  sign.add(new THREE.Mesh(tube(bun), mats.bun))
  sign.add(new THREE.Mesh(tube(frank, true), mats.frank))
  sign.add(new THREE.Mesh(tube(mustard), mats.mustard))
  if (withClef) {
    const clef = new THREE.Mesh(trebleClef(), mats.clef)
    clef.scale.setScalar(1.5)
    clef.position.set(14.5, 2, 0)
    sign.add(clef)
  }
  return sign
}

// ------------------------------------------------------------------ the city
/**
 * coin: a frank-slice geometry (for the moon); dogs: low-detail whole dogs (for the hot dog skyscrapers); title: the
 * set's name, for the record's label, in `font`.
 * Returns {group, update(t, beats, glow), stars} where glow is the colour on the horizon this frame.
 */
export function buildCity({ coin, dogs, title, font = 'sans-serif' }) {
  const r = rng(71)
  const group = new THREE.Group()
  const { ground, inner, outer, cell, plaza } = CITY

  // sky, stars, moon --------------------------------------------------
  const skyU = {
    uZenith: { value: new THREE.Color('#020208') },
    uHorizon: { value: new THREE.Color('#1a0c2a') },
    uGlow: { value: new THREE.Color('#5a1e4a') },
  }
  const sky = new THREE.Mesh(
    new THREE.SphereGeometry(380, 48, 24),
    new THREE.ShaderMaterial({
      ...SKY,
      uniforms: skyU,
      side: THREE.BackSide,
      depthWrite: false,
    })
  )
  sky.renderOrder = -10
  sky.frustumCulled = false
  group.add(sky)

  const N = 2600
  const sp = new Float32Array(N * 3)
  const ss = new Float32Array(N)
  const sph = new Float32Array(N)
  for (let i = 0; i < N; i++) {
    const y = 0.1 + 0.9 * Math.pow(r(), 0.7)
    const a = r() * Math.PI * 2
    const h = Math.sqrt(1 - y * y)
    sp.set([350 * h * Math.cos(a), 350 * y, 350 * h * Math.sin(a)], i * 3)
    ss[i] = 0.8 + 2.2 * Math.pow(r(), 3)
    sph[i] = r()
  }
  const starGeo = new THREE.BufferGeometry()
  starGeo.setAttribute('position', new THREE.BufferAttribute(sp, 3))
  starGeo.setAttribute('aSize', new THREE.BufferAttribute(ss, 1))
  starGeo.setAttribute('aPhase', new THREE.BufferAttribute(sph, 1))
  const starMat = new THREE.ShaderMaterial({
    ...STARS,
    uniforms: { uTime: { value: 0 }, uPr: { value: 1 } },
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  })
  const stars = new THREE.Points(starGeo, starMat)
  stars.renderOrder = -9
  stars.frustumCulled = false
  group.add(stars)

  // the moon is a slice of frank, cut face to the city, glowing
  const moonGeo = coin.clone()
  moonGeo.rotateY(-Math.PI / 2)
  const moon = new THREE.Mesh(
    moonGeo,
    new THREE.MeshBasicMaterial({
      vertexColors: true,
      color: new THREE.Color(1.7, 1.55, 1.5),
      fog: false,
    })
  )
  const MOON_AZ = 0.95 + Math.PI + 0.42
  const MOON_EL = 0.36
  moon.position.set(
    300 * Math.cos(MOON_EL) * Math.cos(MOON_AZ),
    300 * Math.sin(MOON_EL),
    300 * Math.cos(MOON_EL) * Math.sin(MOON_AZ)
  )
  moon.scale.setScalar(900)
  moon.lookAt(0, 0, 0)
  group.add(moon)
  const halo = new THREE.Sprite(
    new THREE.SpriteMaterial({
      map: radialSprite('rgba(255,150,140,0.55)', 'rgba(255,120,120,0)'),
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      fog: false,
    })
  )
  halo.position.copy(moon.position).multiplyScalar(1.01)
  halo.scale.setScalar(62)
  halo.renderOrder = -8
  group.add(halo)

  // ground and plaza ------------------------------------------------------
  const groundU = { uCell: { value: cell }, uInner: { value: inner }, uOuter: { value: outer } }
  const groundMat = new THREE.MeshStandardMaterial({
    color: '#08070d',
    roughness: 0.6,
    metalness: 0.3,
    envMapIntensity: 0.3,
  })
  groundMat.onBeforeCompile = (sh) => {
    Object.assign(sh.uniforms, groundU)
    sh.vertexShader = sh.vertexShader
      .replace('#include <common>', '#include <common>\nvarying vec2 vCity;')
      .replace(
        '#include <begin_vertex>',
        '#include <begin_vertex>\nvCity = (modelMatrix * vec4(transformed, 1.0)).xz;'
      )
    sh.fragmentShader = sh.fragmentShader
      .replace(
        '#include <common>',
        '#include <common>\nvarying vec2 vCity;\nuniform float uCell;\nuniform float uInner;\nuniform float uOuter;'
      )
      .replace(
        '#include <emissivemap_fragment>',
        `#include <emissivemap_fragment>
        {
          // the streets, between the blocks: a warm line of street lights down the middle of each
          vec2 q = vCity / uCell;
          vec2 dist = (0.5 - abs(fract(q) - 0.5)) * uCell;
          float line = max(1.0 - smoothstep(0.05, 0.24, dist.x), 1.0 - smoothstep(0.05, 0.24, dist.y));
          vec2 fw = fwidth(q);
          line = mix(line, 0.035, smoothstep(0.02, 0.08, max(fw.x, fw.y)));
          float rr = length(vCity);
          float zone = smoothstep(uInner - 10.0, uInner, rr) * (1.0 - smoothstep(uOuter - 30.0, uOuter + 10.0, rr));
          totalEmissiveRadiance += vec3(1.0, 0.55, 0.22) * line * zone * 0.6;
          // a ring of light round the plaza
          totalEmissiveRadiance += vec3(1.0, 0.3, 0.8) * (1.0 - smoothstep(0.0, 0.9, abs(rr - 57.0))) * 0.9;
        }`
      )
  }
  groundMat.customProgramCacheKey = () => 'city-ground'
  const groundGeo = new THREE.CircleGeometry(340, 96)
  groundGeo.rotateX(-Math.PI / 2)
  const groundMesh = new THREE.Mesh(groundGeo, groundMat)
  groundMesh.position.y = ground
  group.add(groundMesh)

  const recordGeo = new THREE.CircleGeometry(plaza, 160)
  recordGeo.rotateX(-Math.PI / 2)
  const record = new THREE.Mesh(
    recordGeo,
    new THREE.MeshStandardMaterial({
      map: recordTexture(title, font),
      roughness: 0.3,
      metalness: 0.15,
      envMapIntensity: 0.9,
      polygonOffset: true,
      polygonOffsetFactor: -2,
      polygonOffsetUnits: -2,
    })
  )
  record.position.y = ground + 0.05
  group.add(record)

  // landmarks, placed first so the blocks keep clear of them ------------------------
  // the roller grill's lot stays clear
  const avoid = [[GRILL.radius * Math.cos(GRILL.az), GRILL.radius * Math.sin(GRILL.az), 22]]
  const at = (az, rad) => [rad * Math.cos(az), rad * Math.sin(az)]
  const faceIn = (o) => o.lookAt(0, o.position.y, 0)

  // hot dog skyscrapers: whole dogs stood on end, floodlit in their own colours
  const towerSelf = { value: 0.3 }
  const dogMat = selfLit(
    new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.55, envMapIntensity: 0.5 }),
    towerSelf
  )
  const standing = dogs.map((g) => {
    const s = g.clone()
    s.rotateZ(Math.PI / 2)
    s.computeBoundingBox()
    s.translate(0, -s.boundingBox.min.y, 0)
    s.computeBoundingBox()
    return s
  })
  const SKYSCRAPERS = [
    [0.3, 128, 240],
    [1.55, 146, 260],
    [2.6, 120, 220],
    [3.5, 152, 280],
    [4.45, 134, 240],
    [5.5, 124, 250],
  ]
  SKYSCRAPERS.forEach(([az, rad, s], i) => {
    const m = new THREE.Mesh(standing[i % standing.length], dogMat)
    const [x, z] = at(az, rad)
    m.position.set(x, ground, z)
    m.scale.setScalar(s)
    faceIn(m)
    group.add(m)
    avoid.push([x, z, 12])
  })

  // squeeze-bottle towers
  const bottleMat = selfLit(
    new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.32, envMapIntensity: 0.7 }),
    { value: 0.32 }
  )
  const mustardBottle = bottle('#ffcc14', '#ffe066')
  const ketchupBottle = bottle('#c8100c', '#e8301c')
  const BOTTLES = [
    [0.95, 168, mustardBottle, 1.15],
    [2.1, 176, ketchupBottle, 1.05],
    [3.95, 164, mustardBottle, 1.0],
    [5.05, 180, ketchupBottle, 1.2],
  ]
  for (const [az, rad, g, s] of BOTTLES) {
    const m = new THREE.Mesh(g, bottleMat)
    const [x, z] = at(az, rad)
    m.position.set(x, ground, z)
    m.scale.setScalar(s)
    group.add(m)
    avoid.push([x, z, 10])
  }

  // neon hot dog signs on poles at the plaza's edge, facing the storm
  const neon = {
    bun: new THREE.MeshBasicMaterial({ color: new THREE.Color('#ff7a2a').multiplyScalar(2.4) }),
    frank: new THREE.MeshBasicMaterial({ color: new THREE.Color('#ff2d55').multiplyScalar(2.6) }),
    mustard: new THREE.MeshBasicMaterial({ color: new THREE.Color('#ffd21f').multiplyScalar(2.8) }),
    clef: new THREE.MeshBasicMaterial({ color: new THREE.Color('#2ee6ff').multiplyScalar(2.4) }),
  }
  const neonBase = Object.fromEntries(Object.entries(neon).map(([k, m]) => [k, m.color.clone()]))
  const poleMat = new THREE.MeshStandardMaterial({
    color: '#16141c',
    roughness: 0.5,
    metalness: 0.6,
  })
  const SIGNS = [
    [0.62, 76, 24],
    [1.95, 82, 30],
    [3.0, 74, 22],
    [4.1, 84, 32],
    [5.15, 78, 26],
    [5.95, 88, 34],
  ]
  SIGNS.forEach(([az, rad, h], i) => {
    const [x, z] = at(az, rad)
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.7, h - 4.5, 8), poleMat)
    pole.position.set(x, ground + (h - 4.5) / 2, z)
    group.add(pole)
    const sign = neonSign(neon, i % 2 === 1)
    sign.position.set(x, ground + h, z)
    faceIn(sign)
    group.add(sign)
    avoid.push([x, z, 7])
  })

  // the blocks --------------------------------------------------------------------
  const blocks = []
  const n = Math.ceil(outer / cell)
  for (let i = -n; i < n; i++)
    for (let j = -n; j < n; j++) {
      const x = (i + 0.5) * cell
      const z = (j + 0.5) * cell
      const d = Math.hypot(x, z)
      if (d < inner || d > outer) continue
      if (r() < 0.1) continue // a park
      if (avoid.some(([ax, az, ar]) => Math.hypot(x - ax, z - az) < ar)) continue
      // downtown is a ring round the plaza; the skyline steps up from the plaza's edge and falls away outside
      // kept below the camera's eye line mostly, so the sky shows over the skyline
      const down = Math.exp(-Math.pow((d - 140) / 52, 2))
      let h = (5 + 24 * down) * (0.35 + 0.9 * Math.pow(r(), 1.8)) + 2
      if (r() < 0.05 * down) h *= 1.6
      h *= 0.35 + 0.65 * smooth((d - inner) / 40)
      blocks.push([x, z, cell * (0.5 + 0.28 * r()), cell * (0.5 + 0.28 * r()), Math.max(4, h)])
    }
  const windows = { value: 0.85 }
  const boxGeo = new THREE.BoxGeometry(1, 1, 1)
  boxGeo.translate(0, 0.5, 0)
  const towers = new THREE.InstancedMesh(boxGeo, towerMaterial(windows), blocks.length)
  const M = new THREE.Matrix4()
  const one = new THREE.Quaternion()
  blocks.forEach(([x, z, w, d, h], i) => {
    M.compose(new THREE.Vector3(x, ground, z), one, new THREE.Vector3(w, h, d))
    towers.setMatrixAt(i, M)
  })
  towers.frustumCulled = false
  group.add(towers)

  // aviation lights on the tallest towers and the landmarks, fading up and down on the bar
  const tops = blocks.filter((b) => b[4] > 48).map(([x, z, , , h]) => [x, ground + h + 0.7, z])
  SKYSCRAPERS.forEach(([az, rad, s], i) => {
    const [x, z] = at(az, rad)
    tops.push([x, ground + standing[i % standing.length].boundingBox.max.y * s + 0.8, z])
  })
  for (const [az, rad, , s] of BOTTLES) {
    const [x, z] = at(az, rad)
    tops.push([x, ground + 48.7 * s + 0.7, z])
  }
  const beaconMat = new THREE.MeshBasicMaterial({ color: '#ff2a1a' })
  const beacons = new THREE.InstancedMesh(
    new THREE.SphereGeometry(0.75, 10, 8),
    beaconMat,
    tops.length
  )
  tops.forEach((p, i) => beacons.setMatrixAt(i, M.makeTranslation(p[0], p[1], p[2])))
  beacons.frustumCulled = false
  group.add(beacons)

  const glowBase = new THREE.Color('#5a1e4a')
  /** t: seconds; beats: the beat clock; glow: a colour to lean the horizon toward (the storm's); pr: pixel ratio */
  const update = (t, beats, glow, pr = 1) => {
    record.rotation.y = (-2 * Math.PI * beats) / 64
    starMat.uniforms.uTime.value = t % 3600
    starMat.uniforms.uPr.value = pr
    skyU.uGlow.value.copy(glowBase).lerp(glow, 0.22)
    const bar = (beats / 4) % 1
    const blink = Math.pow(0.5 + 0.5 * Math.cos(2 * Math.PI * bar), 8)
    beaconMat.color.setRGB(1, 0.16, 0.1).multiplyScalar(0.25 + 2.2 * blink)
    const breathe = 0.86 + 0.14 * Math.sin((2 * Math.PI * beats) / 16)
    for (const k of Object.keys(neon)) neon[k].color.copy(neonBase[k]).multiplyScalar(breathe)
  }

  return { group, update, towers: blocks.length }
}
