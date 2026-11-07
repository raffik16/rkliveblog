// Chaos is an art form. Three machines from elvarofficial/teardown run whole inside five strange attractors, come
// apart into the storm and come back together, all at once, on a two-minute loop that never draws the same frame
// twice (the storm's flow is not periodic with the loop). No controls: it plays itself, adapts its own quality to the
// GPU it lands on, and stops when the page goes away.
import * as THREE from 'three'
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js'
import { AfterimagePass } from 'three/addons/postprocessing/AfterimagePass.js'
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js'
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js'
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js'
import { warmComposer } from '../teardown/kit/warm.js'
import { buildAttractors } from './attractors.js'
import { buildStorm, flowPhases } from './storm.js'
import { buildDebris } from './debris.js'
import { buildMachines, LOOP } from './machines.js'
import { attractorAt, captionAt, fxAt, shotAt, titleAt } from './director.js'

// one palette per attractor: slow, mid, fast
const PALETTES = [
  ['#5c0a1a', '#ff4d1a', '#ffd9a8'], // Lorenz: ember
  ['#25095c', '#a43dff', '#ffc4f2'], // Aizawa: violet
  ['#04304a', '#19b4ff', '#dcf8ff'], // Thomas: ice
  ['#3d2600', '#f2b632', '#fff3cc'], // Halvorsen: teardown amber
  ['#40061f', '#ff2e5f', '#ffe1ea'], // Rössler: rose
]
// what each machine's points burn with as they leave it: the V8's combustion, the beest's joints, the gear's legs
const ACCENTS = ['#ff6a1f', '#d1322a', '#e8572a']

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
      if (uKal > 0.001) c = mix(c, grab(kal(vUv)), uKal);
      vec2 v = (vUv - 0.5) * vec2(uAspect, 1.0);
      c *= 1.0 - 0.42 * smoothstep(0.35, 1.05, length(v) * 1.15);
      c += (hash(vUv * 731.0) - 0.5) * 0.0012;
      gl_FragColor = vec4(max(c, 0.0), 1.0);
    }`,
}

function studioEnvironment(renderer) {
  // dark room, a few soft boxes: the gloss-black and metal parts need something bright to catch
  const env = new THREE.Scene()
  env.background = new THREE.Color('#050506')
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
  box(9, 5, '#fff1dc', 3.2, [0, 9, 1])
  box(2, 8, '#bcd6ff', 2.4, [-8, 1, 3])
  box(2, 7, '#ffcf9e', 2.0, [8, 2, -3])
  box(10, 1.5, '#ff6a3a', 1.0, [0, -3, -9])
  box(4, 4, '#ffffff', 1.4, [3, 3, 9])
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

function backdrop() {
  const c = document.createElement('canvas')
  c.width = 256
  c.height = 256
  const g = c.getContext('2d')
  const gr = g.createRadialGradient(128, 118, 4, 128, 128, 182)
  gr.addColorStop(0, '#0f0c14')
  gr.addColorStop(0.55, '#07060a')
  gr.addColorStop(1, '#020203')
  g.fillStyle = gr
  g.fillRect(0, 0, 256, 256)
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

const hasWebGL2 = () => {
  try {
    const c = document.createElement('canvas')
    return !!c.getContext('webgl2')
  } catch {
    return false
  }
}

/**
 * Mount the piece into `host` (an element that fills the screen). `overlay` holds the caption elements; any of them
 * may be missing. Returns a function that tears everything down.
 *
 * Hooks for reviewing stills (not controls): ?t=<seconds> starts there, ?pause renders one frame and waits for
 * window.__chaos.renderAt(t), ?tier=<0-4> fixes the quality tier.
 *
 * @param {HTMLElement} host
 * @param {{title?: HTMLElement | null, leftBox?: HTMLElement | null, rightBox?: HTMLElement | null,
 *   left?: (HTMLElement | null)[], right?: (HTMLElement | null)[]}} [overlay]
 * @param {{onReady?: () => void, onUnsupported?: () => void}} [options]
 * @returns {() => void}
 */
export function startChaos(host, overlay = {}, options = {}) {
  if (!hasWebGL2()) {
    options.onUnsupported?.()
    return () => {}
  }
  const q = new URLSearchParams(location.search)
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
  const small = matchMedia('(pointer: coarse)').matches || Math.min(innerWidth, innerHeight) < 700
  const speed = reduced ? 0.4 : 1

  const canvas = document.createElement('canvas')
  canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;display:block'
  host.appendChild(canvas)

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: false,
    alpha: false,
    powerPreference: 'high-performance',
    preserveDrawingBuffer: q.has('pause'),
  })
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.05
  renderer.outputColorSpace = THREE.SRGBColorSpace
  // count a whole frame (every pass), not just the last draw
  renderer.info.autoReset = false

  const scene = new THREE.Scene()
  scene.background = backdrop()
  scene.environment = studioEnvironment(renderer)
  scene.environmentIntensity = 0.7
  const camera = new THREE.PerspectiveCamera(40, 1, 0.05, 400)

  // the sky light takes the storm's colour, so everything near it reads as lit by it
  const hemi = new THREE.HemisphereLight('#3a3550', '#0a0806', 0.7)
  scene.add(hemi)
  const hemiBase = new THREE.Color('#3a3550')
  const key = new THREE.DirectionalLight('#ffe7cc', 2.5)
  key.position.set(6, 10, 8)
  scene.add(key)
  const rim = new THREE.DirectionalLight('#9fc2ff', 1.7)
  rim.position.set(-8, 3, -10)
  scene.add(rim)

  const attractors = buildAttractors()
  const storm = buildStorm(attractors, { count: small ? 110000 : 200000 })
  scene.add(storm.points)
  const debris = buildDebris(attractors)
  scene.add(debris.group)
  const machines = buildMachines()
  scene.add(machines.group)

  const pal = PALETTES.map((p) => p.map((h) => new THREE.Color(h)))
  storm.uniforms.uAcc.value.forEach((c, i) => c.set(ACCENTS[i]))

  // ------------------------------------------------------------ post
  const target = new THREE.WebGLRenderTarget(4, 4, {
    type: THREE.HalfFloatType,
    samples: small ? 0 : 4,
  })
  const composer = new EffectComposer(renderer, target)
  composer.addPass(new RenderPass(scene, camera))
  const trails = new AfterimagePass(0)
  composer.addPass(trails)
  const bloom = new UnrealBloomPass(new THREE.Vector2(4, 4), 0.6, 0.5, 1.0)
  composer.addPass(bloom)
  const finish = new ShaderPass(FINISH)
  composer.addPass(finish)
  composer.addPass(new OutputPass())

  // ------------------------------------------------------------ quality tiers
  const dpr = devicePixelRatio || 1
  const TIERS = [
    { pr: Math.min(dpr, 2), density: 1, parts: 1, trails: true },
    { pr: Math.min(dpr, 1.5), density: 0.8, parts: 1, trails: true },
    { pr: Math.min(dpr, 1.2), density: 0.62, parts: 0.8, trails: true },
    { pr: Math.min(dpr, 1), density: 0.46, parts: 0.65, trails: false },
    { pr: Math.min(dpr, 0.75), density: 0.34, parts: 0.5, trails: false },
  ]
  let tier = small ? 2 : 0
  if (q.has('tier')) tier = Math.max(0, Math.min(TIERS.length - 1, Number(q.get('tier')) || 0))
  let W = 1
  let H = 1
  const applySize = () => {
    W = host.clientWidth || innerWidth
    H = host.clientHeight || innerHeight
    const T = TIERS[tier]
    renderer.setPixelRatio(T.pr)
    renderer.setSize(W, H, false)
    composer.setPixelRatio(T.pr)
    composer.setSize(W, H)
    camera.aspect = W / H
    camera.updateProjectionMatrix()
    storm.setDensity(T.density)
    trails.enabled = T.trails && !reduced
    finish.uniforms.uAspect.value = W / H
  }
  applySize()
  const ro = new ResizeObserver(applySize)
  ro.observe(host)

  // ------------------------------------------------------------ captions
  const setText = (el, s) => {
    if (el && el.textContent !== s) el.textContent = s
  }
  const setAlpha = (el, a) => {
    if (!el) return
    const v = a.toFixed(3)
    if (el.style.opacity !== v) el.style.opacity = v
  }
  const fmtInt = (n) => n.toLocaleString('en-US')
  let lastCaption = -1

  // ------------------------------------------------------------ one frame, as a function of t
  const portrait = (p, l) => {
    // tall screens: step back along the view line so the same width of the scene fits
    const a = W / H
    if (a >= 1.15) return
    const k = Math.pow(1.15 / a, 0.8)
    p.sub(l).multiplyScalar(k).add(l)
  }
  let frame = 0
  let noTrails = false
  const render = (t) => {
    const tau = ((t % LOOP) + LOOP) % LOOP
    const tm = t % 3600
    const ms = machines.update(t, tau)
    const at = attractorAt(tau)
    const fx = fxAt(tau)
    const T = TIERS[tier]

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
    for (let i = 0; i < 3; i++) {
      u.uPalA.value[i].copy(pal[at.a][i])
      u.uPalB.value[i].copy(pal[at.b][i])
    }
    u.uMach.value[0].copy(ms.centre.v8)
    u.uMach.value[1].copy(ms.centre.beast)
    u.uMach.value[2].copy(ms.centre.gear)
    u.uRel.value[0] = ms.explode.v8
    u.uRel.value[1] = ms.explode.beast
    u.uRel.value[2] = ms.explode.gear
    u.uMachR.value[0] = ms.radius.v8
    u.uMachR.value[1] = ms.radius.beast
    u.uMachR.value[2] = ms.radius.gear
    const mm = at.m * at.m * (3 - 2 * at.m)
    hemi.color.copy(pal[at.a][1]).lerp(pal[at.b][1], mm).lerp(hemiBase, 0.45)

    debris.update(t, at.a, at.b, at.m, fx.chaos, 1.25, T.parts)

    // camera
    const shot = shotAt(tau, ms)
    portrait(shot.p, shot.l)
    // a little life in the hand
    shot.p.x += 0.06 * Math.sin(t * 0.71) + 0.03 * Math.sin(t * 1.93)
    shot.p.y += 0.05 * Math.sin(t * 0.53 + 1) + 0.02 * Math.sin(t * 2.3)
    camera.position.copy(shot.p)
    camera.up.copy(shot.up)
    camera.lookAt(shot.l)
    if (Math.abs(camera.fov - shot.fov) > 1e-3) {
      camera.fov = shot.fov
      camera.updateProjectionMatrix()
    }
    u.uScale.value = (H * T.pr) / (2 * Math.tan((camera.fov * Math.PI) / 360))

    // passes
    trails.uniforms.damp.value = reduced || noTrails ? 0 : fx.trails
    bloom.strength = fx.bloom
    finish.uniforms.uKal.value = reduced ? 0 : fx.kaleido
    finish.uniforms.uRot.value = tm * 0.07
    finish.uniforms.uAb.value = reduced ? 0 : fx.aberration
    finish.uniforms.uTime.value = (frame % 997) * 0.37

    renderer.info.reset()
    composer.render()
    frame++

    // captions, at 12 Hz
    const slot = Math.floor(t * 12)
    if (slot !== lastCaption) {
      lastCaption = slot
      setAlpha(overlay.title, titleAt(tau))
      const ca = captionAt(tau)
      const A = attractors[at.a]
      const B = attractors[at.b]
      if (at.a === at.b) {
        setText(overlay.left?.[0], `${A.name.toUpperCase()} ATTRACTOR`)
        setText(overlay.left?.[1], `${A.params} · λ₁ ${A.lambda.toFixed(3)}`)
      } else {
        setText(overlay.left?.[0], `${A.name.toUpperCase()} → ${B.name.toUpperCase()}`)
        setText(
          overlay.left?.[1],
          `MORPH ${String(Math.round(at.m * 100)).padStart(2, '0')}% · λ₁ ${A.lambda.toFixed(3)} → ${B.lambda.toFixed(3)}`
        )
      }
      let right
      if (shot.name === 'v8' || shot.name === 'beast' || shot.name === 'gear')
        right = ms.readout[shot.name]
      else if (shot.name === 'multiverse' || shot.name === 'all')
        right = [
          'EVERYTHING · EVERYWHERE · ALL AT ONCE',
          `${fmtInt(Math.round(storm.count * T.density))} POINTS · ${debris.total} PARTS · 3 MACHINES`,
        ]
      else
        right = [
          `${fmtInt(Math.round(storm.count * T.density))} POINTS · ${debris.total} PARTS · 3 MACHINES · 5 ATTRACTORS`,
          `LOOP ${tau.toFixed(1).padStart(5, '0')} s · FRAME ${fmtInt(frame)}`,
        ]
      setText(overlay.right?.[0], right[0])
      setText(overlay.right?.[1], right[1])
      setAlpha(overlay.leftBox, ca)
      setAlpha(overlay.rightBox, ca)
    }
  }

  // ------------------------------------------------------------ the loop
  let raf = 0
  let alive = true
  let t = Number(q.get('t')) || 0
  let last = 0
  // frame-time watch: after a settling period, drop a tier whenever the average frame is slow
  let watchFrom = 0
  let acc = 0
  let n = 0
  const loop = (now) => {
    if (!alive) return
    raf = requestAnimationFrame(loop)
    const dt = last ? Math.min(0.1, (now - last) / 1000) : 0
    last = now
    t += dt * speed
    render(t)
    if (!watchFrom) watchFrom = now + 2500
    if (now > watchFrom && dt > 0) {
      acc += dt
      n++
      if (acc > 2) {
        const avg = (acc / n) * 1000
        if (avg > 23 && tier < TIERS.length - 1) {
          tier++
          applySize()
          watchFrom = now + 1500
        }
        acc = 0
        n = 0
      }
    }
  }
  const onVisibility = () => {
    // do not count the time away, and do not judge the GPU on the first frames back
    last = 0
    watchFrom = 0
    acc = 0
    n = 0
  }
  document.addEventListener('visibilitychange', onVisibility)
  const onLost = (e) => {
    e.preventDefault()
    alive = false
    cancelAnimationFrame(raf)
  }
  canvas.addEventListener('webglcontextlost', onLost)

  // test hook: render any moment on demand (the page's own review loop uses it)
  window.__chaos = {
    renderAt: (s) => {
      // a still has no history: one frame without trails flushes whatever the last still left in them
      noTrails = true
      render(s)
      noTrails = false
      render(s)
    },
    get tier() {
      return tier
    },
    info: () => ({ ...renderer.info.render }),
  }

  // compile every program before the first frame so the page never stalls on first draw
  render(t)
  const warm = warmComposer(renderer, composer, scene, camera).catch(() => {})
  Promise.race([warm, new Promise((r) => setTimeout(r, 4000))]).then(() => {
    if (!alive) return
    options.onReady?.()
    if (!q.has('pause')) raf = requestAnimationFrame(loop)
  })

  return () => {
    alive = false
    cancelAnimationFrame(raf)
    ro.disconnect()
    document.removeEventListener('visibilitychange', onVisibility)
    canvas.removeEventListener('webglcontextlost', onLost)
    if (window.__chaos) delete window.__chaos
    scene.traverse((o) => {
      if (o.geometry) o.geometry.dispose()
      const mats = o.material ? (Array.isArray(o.material) ? o.material : [o.material]) : []
      for (const m of mats) {
        for (const v of Object.values(m)) if (v && v.isTexture) v.dispose()
        m.dispose()
      }
    })
    storm.texture.dispose()
    scene.environment?.dispose()
    scene.background?.dispose?.()
    for (const p of composer.passes) p.dispose?.()
    composer.dispose()
    target.dispose()
    renderer.dispose()
    canvas.remove()
  }
}
