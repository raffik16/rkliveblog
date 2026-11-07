// Chaos is an art form: Roller Grill Sessions. A VJ backdrop with no controls. Three hot dogs (a Chicago dog, a ballpark
// dog and a New York dog) come apart into exploded views and go back together inside the five strange attractors of
// /chaos, while the storm carries flying parts and notes, a ring of stave plays a melody round the whole room, more
// dogs drift in the space beyond, and Hot Dog City spreads out under a night sky, the set's name crawling round it on a
// ribbon board and a giant roller grill turning at the plaza's edge (hot dogs spin on the roller grill, DJs spin
// records). Everything counts in bars at the
// set's tempo (124 bpm, or ?bpm=), so the teardowns, camera moves and pulses land on the downbeat, and everything
// eases: there are no cuts and no steps. It plays itself, tunes its own quality to the GPU behind the loader, and
// stops when the page goes away.
import * as THREE from 'three'
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js'
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js'
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js'
import { warmComposer } from '../../teardown/kit/warm.js'
import { ATTRACTOR_NAMES, buildAttractor } from '../../scene/attractors.js'
import { buildStorm, flowPhases, FLOW } from '../../scene/storm.js'
import { buildHotDogs, lowDog, partGeometries } from './hotdog.js'
import { buildFlyers } from './flyers.js'
import { buildStave, STAVE } from './stave.js'
import { buildCity, CITY } from './city.js'
import { buildDrifters } from './drifters.js'
import { buildGrill } from './grill.js'
import { buildMarquee, DEFAULT_TITLE } from './marquee.js'
import { attractorAt, beatAt, clock, fxAt, shotAt, teardownAt } from './director.js'

// one palette per attractor (slow, mid, fast): ketchup, relish, club ice, mustard, magenta
const PALETTES = [
  ['#4a0508', '#ff2a1a', '#ffd6c2'], // Lorenz
  ['#062e0a', '#3dff2a', '#e8ffd6'], // Aizawa
  ['#03294a', '#19c8ff', '#dcf8ff'], // Thomas
  ['#3a2600', '#ffc21a', '#fff4c4'], // Halvorsen
  ['#3d0630', '#ff2ea8', '#ffe0f4'], // Rössler
]
// what each dog's points burn with as they leave it: yellow mustard, ketchup, spicy brown mustard
const ACCENTS = ['#ffd21f', '#ff3b2f', '#ff9a1f']
const DOGS = ['chicago', 'ballpark', 'newyork']
// where they stand on the ring round the storm
const RING = 15.5
const PLACES = [
  { az: 0.95 + 0.62, y: 1.6 },
  { az: 0.95 + 0.62 + 2.1, y: -0.6 },
  { az: 0.95 + 0.62 + 4.2, y: 2.4 },
]
const DOG_SCALE = 52 // a 152 mm frank, about eight units long

// Before bloom: no pixel brighter than K times white, hue kept, so a glossy highlight stays a sparkle, not a halo.
const CLAMP = {
  uniforms: { tDiffuse: { value: null } },
  vertexShader: /* glsl */ `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
  fragmentShader: /* glsl */ `
    uniform sampler2D tDiffuse;
    varying vec2 vUv;
    void main() {
      vec4 c = texture2D(tDiffuse, vUv);
      float m = max(c.r, max(c.g, c.b));
      gl_FragColor = vec4(c.rgb * min(1.0, 3.0 / max(m, 1e-4)), 1.0);
    }`,
}

const FINISH = {
  uniforms: {
    tDiffuse: { value: null },
    uKal: { value: 0 },
    uSeg: { value: 6 },
    uRot: { value: 0 },
    uAspect: { value: 1 },
    uAb: { value: 0 },
    uTime: { value: 0 },
  },
  vertexShader: /* glsl */ `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
  fragmentShader: /* glsl */ `
    uniform sampler2D tDiffuse;
    uniform float uKal;
    uniform float uSeg;
    uniform float uRot;
    uniform float uAspect;
    uniform float uAb;
    uniform float uTime;
    varying vec2 vUv;
    vec3 grab(vec2 uv) {
      vec2 d = (uv - 0.5) * uAb * (0.6 + length(uv - 0.5) * 2.0);
      return vec3(texture2D(tDiffuse, uv + d).r, texture2D(tDiffuse, uv).g, texture2D(tDiffuse, uv - d).b);
    }
    vec2 kal(vec2 uv) {
      vec2 p = (uv - 0.5) * vec2(uAspect, 1.0);
      float r = length(p);
      float seg = 6.2831853 / uSeg;
      float a = mod(atan(p.y, p.x) + uRot, seg);
      a = abs(a - seg * 0.5);
      vec2 q = r * vec2(cos(a), sin(a)) * 0.92;
      return q / vec2(uAspect, 1.0) + 0.5;
    }
    float hash(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233)) + uTime) * 43758.5453); }
    void main() {
      vec3 c = grab(vUv);
      vec2 v = (vUv - 0.5) * vec2(uAspect, 1.0);
      // the kaleidoscope opens as a disc from the middle of the frame (uKal 0 closed, 1 covering it), soft-edged
      if (uKal > 0.001) {
        float rr = length(v) / length(vec2(uAspect, 1.0) * 0.5);
        float edge = uKal * 1.55 - 0.25;
        float m = 1.0 - smoothstep(edge - 0.32, edge, rr);
        c = mix(c, grab(kal(vUv)), m * smoothstep(0.0, 0.2, uKal));
      }
      c *= 1.0 - 0.4 * smoothstep(0.35, 1.05, length(v) * 1.15);
      c += (hash(vUv * 731.0) - 0.5) * 0.0012;
      gl_FragColor = vec4(max(c, 0.0), 1.0);
    }`,
}

function clubEnvironment(renderer) {
  // a dark club: a warm key box, magenta and cyan washes, a low strip of mustard light. HDR values, so the glossy
  // casings, the lacquered notes and the wet toppings pick up real highlights.
  const env = new THREE.Scene()
  env.background = new THREE.Color('#040306')
  const box = (w, h, hex, k, pos) => {
    const c = new THREE.Color(hex)
    const m = new THREE.Mesh(
      new THREE.PlaneGeometry(w, h),
      new THREE.MeshBasicMaterial({
        color: new THREE.Color(c.r * k, c.g * k, c.b * k),
        side: THREE.DoubleSide,
      })
    )
    m.position.set(...pos)
    m.lookAt(0, 0, 0)
    env.add(m)
  }
  box(9, 4, '#fff0dc', 3.0, [0, 9, 2])
  box(2.5, 8, '#ff3df0', 2.6, [-8, 1, 3])
  box(2.5, 8, '#2ee6ff', 2.4, [8, 2, -3])
  box(12, 1.2, '#ffc21a', 1.4, [0, -3, -9])
  box(4, 4, '#ffffff', 1.3, [3, 3, 9])
  const pm = new THREE.PMREMGenerator(renderer)
  const tex = pm.fromScene(env, 0.04).texture
  pm.dispose()
  env.traverse((m) => {
    if (m.isMesh) {
      m.geometry.dispose()
      m.material.dispose()
    }
  })
  return tex
}

const hasWebGL2 = () => {
  try {
    return !!document.createElement('canvas').getContext('webgl2')
  } catch {
    return false
  }
}

/** The set's name: ?title= if given (up to 40 characters), else Roller Grill Sessions. */
export function titleFrom(search) {
  const v = (new URLSearchParams(search).get('title') || '').trim().replace(/\s+/g, ' ')
  return v ? v.slice(0, 40).toUpperCase() : DEFAULT_TITLE
}

/** The tempo from ?bpm=, kept to what a set plays. */
export function tempoFrom(search) {
  const v = Number(new URLSearchParams(search).get('bpm'))
  return Number.isFinite(v) && v >= 60 && v <= 200 ? v : 124
}

/**
 * Mount the set into `host` (an element that fills the screen). Returns a function that tears everything down, at
 * any point of the boot. The boot runs in stages and yields between them, reporting each through
 * onProgress(label, 0..1); its last stage renders the opening frame behind the loader to find the quality tier this
 * GPU holds at full frame rate. Then onReady.
 *
 * Hooks for reviewing stills (not controls): ?t=<seconds> or ?bar=<bar> starts there, ?pause renders one frame and
 * waits for window.__hotdog.renderAt(t), ?tier=<0-5> fixes the quality tier. Settings a DJ may want (not controls
 * either): ?bpm=<60-200> sets the tempo, ?title=<name> the set's name on the board.
 *
 * @param {HTMLElement} host
 * @param {{onReady?: () => void, onUnsupported?: () => void, onProgress?: (label: string, k: number) => void,
 *   font?: string}} [options] font: a CSS font family for the set's name (the board and the record's label)
 * @returns {() => void}
 */
export function startHotDogSet(host, options = {}) {
  if (!hasWebGL2()) {
    options.onUnsupported?.()
    return () => {}
  }
  const q = new URLSearchParams(location.search)
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
  const small = matchMedia('(pointer: coarse)').matches || Math.min(innerWidth, innerHeight) < 700
  const speed = reduced ? 0.5 : 1
  const ck = clock(tempoFrom(location.search))
  const progress = (label, k) => options.onProgress?.(label, k)
  const yieldNow = () => new Promise((r) => setTimeout(r, 0))
  const nextFrame = () => new Promise((r) => requestAnimationFrame(r))

  let alive = true
  let raf = 0
  let renderer = null
  let scene = null
  let storm = null
  let composer = null
  let target = null
  let ro = null
  let resizeTimer = 0
  const canvas = document.createElement('canvas')
  canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;display:block'
  host.appendChild(canvas)

  const onLost = (e) => {
    e.preventDefault()
    alive = false
    cancelAnimationFrame(raf)
  }
  canvas.addEventListener('webglcontextlost', onLost)
  let onVisibility = null

  const boot = async () => {
    renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: false,
      alpha: false,
      powerPreference: 'high-performance',
      preserveDrawingBuffer: q.has('pause'),
    })
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.05
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.info.autoReset = false

    scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(40, 1, 0.05, 470)
    const hemi = new THREE.HemisphereLight('#3a3550', '#0a0806', 0.75)
    scene.add(hemi)
    const hemiBase = new THREE.Color('#3a3550')
    // the key rides with the camera, up and to the right of it, so whichever dog is in shot is lit from the front;
    // the club washes stay put in the room and catch them from the sides and behind
    const key = new THREE.DirectionalLight('#ffe7cc', 2.6)
    key.position.set(6, 10, 8)
    scene.add(key, key.target)
    const keyRight = new THREE.Vector3()
    const keyUp = new THREE.Vector3()
    // two club washes from either side: they take the storm's colours and breathe with the kick
    const washA = new THREE.DirectionalLight('#ff5ad8', 0.5)
    washA.position.set(-9, 4, -6)
    scene.add(washA)
    const washB = new THREE.DirectionalLight('#2ee6ff', 0.55)
    washB.position.set(9, -2, -8)
    scene.add(washB)

    // ---------------------------------------------------------- the stages
    const attractors = []
    for (let i = 0; i < ATTRACTOR_NAMES.length; i++) {
      progress(`INTEGRATING THE ${ATTRACTOR_NAMES[i].toUpperCase()} ATTRACTOR`, 0.08 + 0.05 * i)
      await yieldNow()
      if (!alive) return
      attractors.push(buildAttractor(i))
    }
    const count = small ? 150000 : 280000
    progress(`SEEDING ${count.toLocaleString('en-US')} PARTICLES`, 0.36)
    await yieldNow()
    if (!alive) return
    storm = buildStorm(attractors, { count })
    scene.add(storm.group)

    progress('STEAMING THE POPPY SEED BUNS', 0.44)
    await yieldNow()
    if (!alive) return
    const { dogs, materials: food } = buildHotDogs()

    progress('DRAGGING ONE THROUGH THE GARDEN', 0.52)
    await yieldNow()
    if (!alive) return
    const holds = DOGS.map((k, i) => {
      const hold = new THREE.Group()
      hold.add(dogs[k].root)
      hold.scale.setScalar(DOG_SCALE)
      const pl = PLACES[i]
      hold.position.set(RING * Math.cos(pl.az), pl.y, RING * Math.sin(pl.az))
      scene.add(hold)
      return hold
    })

    progress('SCORING THE MELODY', 0.58)
    await yieldNow()
    if (!alive) return
    const glow = { value: 1 }
    const stave = buildStave(glow)
    scene.add(stave.group)
    stave.group.updateMatrixWorld(true)

    progress('THROWING THE PARTS IN THE AIR', 0.63)
    await yieldNow()
    if (!alive) return
    const parts = partGeometries()
    const flyers = buildFlyers(attractors, parts, food, glow)
    scene.add(flyers.group)

    progress('ZONING HOT DOG CITY', 0.65)
    // the set's name is drawn in the display font: wait for it (briefly) so the board is not drawn in a fallback
    const title = titleFrom(location.search)
    const font = options.font || 'sans-serif'
    await Promise.race([
      document.fonts?.load(`100px ${font}`, title).catch(() => {}),
      new Promise((r) => setTimeout(r, 2500)),
    ])
    if (!alive) return
    const wholeDogs = ['mustard', 'ballpark', 'garden'].map((k) => lowDog(k))
    const city = buildCity({ coin: parts.coin, dogs: wholeDogs, title, font })
    scene.add(city.group)

    progress('FIRING UP THE ROLLER GRILL', 0.66)
    await yieldNow()
    if (!alive) return
    const grill = buildGrill(parts.frank, CITY.ground)
    scene.add(grill.group)
    const marquee = buildMarquee(title, font)
    scene.add(marquee.group)

    progress('LAUNCHING THE BLIMPS', 0.67)
    await yieldNow()
    if (!alive) return
    const drifters = buildDrifters(wholeDogs)
    scene.add(drifters.group)

    progress('LIGHTING THE CLUB', 0.69)
    await yieldNow()
    if (!alive) return
    // the sky dome covers the background; the fog takes the horizon's colour, so the far side of town melts into it
    scene.background = new THREE.Color('#05040a')
    scene.fog = new THREE.FogExp2('#1a0c2a', 0.005)
    scene.environment = clubEnvironment(renderer)
    scene.environmentIntensity = 0.75

    const pal = PALETTES.map((p) => p.map((h) => new THREE.Color(h)))
    storm.uniforms.uAcc.value.forEach((c, i) => c.set(ACCENTS[i]))
    const [streakObj, sparkObj] = storm.group.children
    const washABase = new THREE.Color('#ff5ad8')
    const washBBase = new THREE.Color('#2ee6ff')

    // -------------------------------------------------------- post, in half float: the HDR the bloom reads from
    target = new THREE.WebGLRenderTarget(4, 4, { type: THREE.HalfFloatType, samples: 4 })
    composer = new EffectComposer(renderer, target)
    composer.addPass(new RenderPass(scene, camera))
    composer.addPass(new ShaderPass(CLAMP))
    const bloom = new UnrealBloomPass(new THREE.Vector2(4, 4), 0.55, 0.45, 1.2)
    composer.addPass(bloom)
    const finish = new ShaderPass(FINISH)
    composer.addPass(finish)
    composer.addPass(new OutputPass())

    // -------------------------------------------------------- quality tiers
    // Resolution is the last thing to go: a slow GPU first draws fewer particles and parts, then fewer pixels. The
    // pixel ratio is capped at 2, which is native on nearly every screen and projector a set plays on.
    const dpr = devicePixelRatio || 1
    const cap = (x) => Math.min(dpr, x)
    const TIERS = [
      { pr: cap(2), density: 1, parts: 1 },
      { pr: cap(2), density: 0.7, parts: 1 },
      { pr: cap(1.75), density: 0.55, parts: 0.85 },
      { pr: cap(1.5), density: 0.45, parts: 0.7 },
      { pr: cap(1.25), density: 0.35, parts: 0.6 },
      { pr: cap(1), density: 0.3, parts: 0.5 },
    ]
    let tier = small ? 1 : 0
    const fixedTier = q.has('tier')
    if (fixedTier) tier = Math.max(0, Math.min(TIERS.length - 1, Number(q.get('tier')) || 0))

    // Resizing a canvas clears it; done between frames the browser shows that empty canvas for a frame. So a resize
    // only marks the size dirty, and the next frame applies it right before it draws.
    let W = 0
    let H = 0
    let PR = 0
    let sizeDirty = true
    let streakBase = 0
    const applySize = () => {
      sizeDirty = false
      const w = host.clientWidth || innerWidth
      const h = host.clientHeight || innerHeight
      const T = TIERS[tier]
      if (w !== W || h !== H || T.pr !== PR) {
        W = w
        H = h
        PR = T.pr
        renderer.setPixelRatio(T.pr)
        renderer.setSize(W, H, false)
        composer.setPixelRatio(T.pr)
        composer.setSize(W, H)
        camera.aspect = W / H
        camera.updateProjectionMatrix()
        const db = renderer.getDrawingBufferSize(new THREE.Vector2())
        storm.setViewport(db.x, db.y, T.pr)
        streakBase = streakObj.material.uniforms.uBright.value
        finish.uniforms.uAspect.value = W / H
      }
    }
    // the share of particles and parts drawn: set outright while tuning, then eased toward a new tier over a couple of
    // seconds once the set plays, so a change of tier never pops
    let density = TIERS[tier].density
    let partShare = TIERS[tier].parts
    let easeTiers = false
    const easeToward = (dt) => {
      const T = TIERS[tier]
      const k = Math.min(1, dt * 1.2)
      density += (T.density - density) * k
      partShare += (T.parts - partShare) * k
    }
    ro = new ResizeObserver(() => {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(() => (sizeDirty = true), 150)
    })
    ro.observe(host)

    // -------------------------------------------------------- one frame, as a function of t
    const portrait = (p, l) => {
      const a = W / H
      if (a >= 1.15) return
      const k = Math.pow(1.15 / a, 0.8)
      p.sub(l).multiplyScalar(k).add(l)
    }
    const centre = {
      chicago: new THREE.Vector3(),
      ballpark: new THREE.Vector3(),
      newyork: new THREE.Vector3(),
    }
    const shotState = {
      centre,
      explode: { chicago: 0, ballpark: 0, newyork: 0 },
      slice: { chicago: 0, ballpark: 0, newyork: 0 },
      stave: { radius: STAVE.radius, playhead: STAVE.playhead, matrix: stave.group.matrixWorld },
    }
    const sparkBase = sparkObj.material.uniforms.uBright.value
    const radius = dogs.chicago.radius * DOG_SCALE

    // dogs and their points, at time t
    const poseDogs = (t, bars, bounce) => {
      const td = teardownAt(bars)
      DOGS.forEach((k, i) => {
        const pl = PLACES[i]
        const hold = holds[i]
        const { explode, slice } = td[k]
        shotState.explode[k] = explode
        shotState.slice[k] = slice
        dogs[k].update(t, explode, slice)
        hold.position.set(
          RING * Math.cos(pl.az),
          pl.y + 0.35 * Math.sin(t * 0.45 + i * 2),
          RING * Math.sin(pl.az)
        )
        // broadside out of the ring, swaying a little
        hold.rotation.set(
          0.07 * Math.sin(t * 0.2 + i),
          Math.PI / 2 - pl.az + 0.28 * Math.sin(t * 0.13 + i * 1.7),
          0.05 * Math.sin(t * 0.17 + i)
        )
        // the bounce: squash on the kick, keep the volume
        const b = bounce * (1 - 0.6 * explode)
        hold.scale.set(
          DOG_SCALE * (1 + 0.018 * b),
          DOG_SCALE * (1 - 0.036 * b),
          DOG_SCALE * (1 + 0.018 * b)
        )
        hold.updateMatrix()
        centre[k].copy(hold.position)
      })
      return td
    }

    const horizon = new THREE.Color()
    let frame = 0
    const render = (t) => {
      if (sizeDirty) applySize()
      const T = TIERS[tier]
      if (!easeTiers) {
        density = T.density
        partShare = T.parts
      }
      storm.setDensity(density)
      const bt = beatAt(t, ck)
      const bars = bt.bars
      const tm = t % 3600
      const at = attractorAt(bars)
      const fx = fxAt(bars, bt, reduced)
      const kick = reduced ? 0 : bt.kick

      poseDogs(t, bars, fx.bounce)

      // storm
      const u = storm.uniforms
      const [fa, fb] = flowPhases(t)
      u.uA.value = at.a
      u.uB.value = at.b
      u.uMorph.value = at.m
      u.uFlowA.value = fa
      u.uFlowB.value = fb
      u.uTime.value = tm
      u.uChaos.value = fx.chaos
      const t2 = t - FLOW.trail
      const bars2 = beatAt(t2, ck).bars
      const at2 = attractorAt(bars2)
      const [fa2, fb2] = flowPhases(t2)
      u.uFlowA2.value = fa2
      u.uFlowB2.value = fb2
      u.uTime2.value = ((t2 % 3600) + 3600) % 3600
      u.uMorph2.value = at2.a === at.a && at2.b === at.b ? at2.m : at.a !== at.b ? 0 : at.m
      const td2 = teardownAt(bars2)
      DOGS.forEach((k, i) => {
        u.uRel.value[i] = shotState.explode[k]
        u.uRel2.value[i] = td2[k].explode
        u.uMach.value[i].copy(centre[k])
        u.uMachR.value[i] = radius
      })
      for (let i = 0; i < 3; i++) {
        u.uPalA.value[i].copy(pal[at.a][i])
        u.uPalB.value[i].copy(pal[at.b][i])
      }
      // the storm breathes with the kick
      streakObj.material.uniforms.uBright.value = streakBase * (1 + 0.18 * kick)
      sparkObj.material.uniforms.uBright.value = sparkBase * (1 + 0.3 * kick)

      const mm = at.m * at.m * (3 - 2 * at.m)
      hemi.color.copy(pal[at.a][1]).lerp(pal[at.b][1], mm).lerp(hemiBase, 0.5)
      washA.color.copy(washABase).lerp(pal[at.a][1], 0.35)
      washA.intensity = 0.45 + 0.5 * kick
      washB.color.copy(washBBase).lerp(pal[at.b][2], 0.25)
      washB.intensity = 0.55 + 0.4 * kick

      // camera
      const shot = shotAt(bars, shotState, ck)
      portrait(shot.p, shot.l)
      shot.p.x += 0.05 * Math.sin(t * 0.71) + 0.025 * Math.sin(t * 1.93)
      shot.p.y += 0.04 * Math.sin(t * 0.53 + 1) + 0.02 * Math.sin(t * 2.3)
      camera.position.copy(shot.p)
      camera.up.copy(shot.up)
      camera.lookAt(shot.l)
      camera.updateMatrixWorld()
      if (Math.abs(camera.fov - shot.fov) > 1e-3) {
        camera.fov = shot.fov
        camera.updateProjectionMatrix()
      }
      u.uScale.value = (H * T.pr) / (2 * Math.tan((camera.fov * Math.PI) / 360))
      keyRight.setFromMatrixColumn(camera.matrixWorld, 0)
      keyUp.setFromMatrixColumn(camera.matrixWorld, 1)
      key.position.copy(camera.position).addScaledVector(keyRight, 7).addScaledVector(keyUp, 9)
      key.target.position.copy(shot.l)
      key.target.updateMatrixWorld()

      glow.value = 1 + 0.6 * kick
      flyers.update(t, at.a, at.b, at.m, fx.chaos, 1.15, partShare, bt, camera.position)
      stave.update(bt.beats, kick)
      horizon.copy(pal[at.a][1]).lerp(pal[at.b][1], mm)
      city.update(t, bt.beats, horizon, T.pr)
      grill.update(bt.beats)
      marquee.update(bt.beats, kick)
      drifters.update(t, bt.beats, camera.position)

      // passes
      bloom.strength = fx.bloom
      renderer.toneMappingExposure = 1.05 * fx.exposure
      finish.uniforms.uKal.value = fx.kaleido
      finish.uniforms.uRot.value = tm * 0.07
      finish.uniforms.uAb.value = fx.aberration
      finish.uniforms.uTime.value = (frame % 997) * 0.37

      renderer.info.reset()
      composer.render()
      frame++
    }

    window.__hotdog = {
      renderAt: (s) => render(s),
      clock: ck,
      get tier() {
        return tier
      },
      info: () => ({ ...renderer.info.render }),
    }

    let t = Number(q.get('t')) || (Number(q.get('bar')) || 0) * ck.bar

    // -------------------------------------------------------- compile every program before the first frame
    progress('COMPILING SHADERS', 0.74)
    await yieldNow()
    if (!alive) return
    render(t)
    await Promise.race([
      warmComposer(renderer, composer, scene, camera).catch(() => {}),
      new Promise((r) => setTimeout(r, 4000)),
    ])
    if (!alive) return

    // -------------------------------------------------------- find this GPU's tier, behind the loader
    const timeFrames = async (n) => {
      const ts = []
      let prev = await nextFrame()
      const start = prev
      for (let i = 0; i < n + 3; i++) {
        render(t)
        const now = await nextFrame()
        if (i >= 3) ts.push(now - prev)
        prev = now
        if (!alive) return Infinity
        if (now - start > 1500 && ts.length >= 4) break
      }
      ts.sort((a, b) => a - b)
      return ts[ts.length >> 1]
    }
    const GOOD = 21 // ms: about 48 fps or better
    if (!fixedTier && !q.has('pause')) {
      progress('TUNING TO THIS SCREEN', 0.84)
      const t0 = performance.now()
      let med = await timeFrames(12)
      while (alive && med > GOOD && tier < TIERS.length - 1 && performance.now() - t0 < 4000) {
        progress('TUNING TO THIS SCREEN', Math.min(0.97, 0.84 + 0.03 * tier))
        tier++
        sizeDirty = true
        const next = await timeFrames(12)
        if (next > med * 0.88) {
          tier--
          sizeDirty = true
          break
        }
        med = next
      }
      if (!alive) return
    }
    progress('READY', 1)

    // -------------------------------------------------------- the loop
    let last = 0
    let watchFrom = 0
    let acc = 0
    let n = 0
    let slow = 0
    let probe = null
    let locked = fixedTier
    let drops = 0
    const loop = (now) => {
      if (!alive) return
      raf = requestAnimationFrame(loop)
      const dt = last ? Math.min(0.1, (now - last) / 1000) : 0
      last = now
      t += dt * speed
      easeToward(dt)
      render(t)
      if (locked) return
      if (!watchFrom) watchFrom = now + 3000
      if (now < watchFrom || dt <= 0) return
      acc += dt
      n++
      if (acc < 3) return
      const avg = (acc / n) * 1000
      acc = 0
      n = 0
      if (probe) {
        if (avg > probe.avg * 0.9) {
          tier = probe.from
          sizeDirty = true
          locked = true
        }
        probe = null
        return
      }
      slow = avg > 26 ? slow + 1 : 0
      if (slow >= 2 && tier < TIERS.length - 1 && drops < 2) {
        probe = { from: tier, avg }
        tier++
        drops++
        sizeDirty = true
        slow = 0
        watchFrom = now + 1500
      }
    }
    onVisibility = () => {
      last = 0
      watchFrom = 0
      acc = 0
      n = 0
      slow = 0
    }
    document.addEventListener('visibilitychange', onVisibility)

    easeTiers = true
    options.onReady?.()
    if (!q.has('pause')) raf = requestAnimationFrame(loop)
  }

  boot().catch((e) => {
    console.error(e)
    if (alive) options.onUnsupported?.()
  })

  return () => {
    alive = false
    cancelAnimationFrame(raf)
    clearTimeout(resizeTimer)
    ro?.disconnect()
    if (onVisibility) document.removeEventListener('visibilitychange', onVisibility)
    canvas.removeEventListener('webglcontextlost', onLost)
    if (window.__hotdog) delete window.__hotdog
    const textures = new Set()
    scene?.traverse((o) => {
      if (o.geometry) o.geometry.dispose()
      const mats = o.material ? (Array.isArray(o.material) ? o.material : [o.material]) : []
      for (const m of mats) {
        for (const v of Object.values(m)) if (v && v.isTexture) textures.add(v)
        m.dispose()
      }
    })
    for (const tx of textures) tx.dispose()
    storm?.texture.dispose()
    scene?.environment?.dispose()
    scene?.background?.dispose?.()
    if (composer) {
      for (const p of composer.passes) p.dispose?.()
      composer.dispose()
    }
    target?.dispose()
    renderer?.dispose()
    canvas.remove()
  }
}
