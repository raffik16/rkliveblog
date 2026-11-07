// Chaos is an art form. Three machines from elvarofficial/teardown run whole inside five strange attractors, come
// apart into the storm and come back together, all at once, on a two-minute loop that never draws the same frame
// twice (the storm's flow is not periodic with the loop). No controls: it plays itself, adapts its own quality to the
// GPU it lands on, and stops when the page goes away.
import * as THREE from 'three'
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js'
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js'
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js'
import { warmComposer } from '../teardown/kit/warm.js'
import { rng } from '../teardown/kit/util.js'
import { ATTRACTOR_NAMES, buildAttractor } from './attractors.js'
import { buildStorm, flowPhases, FLOW } from './storm.js'
import { buildDebris } from './debris.js'
import { buildMachines, explodeAt, LOOP } from './machines.js'
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

// Before bloom: no pixel brighter than K times white, hue kept. A glossy face that lines up with a light can reach 50
// times white; tone mapping shows 2.5 and 50 as the same white, but bloom would spread the 50 into a halo across the
// frame. Capped, highlights stay sharp sparkles.
const CLAMP = {
  uniforms: { tDiffuse: { value: null } },
  vertexShader: /* glsl */ `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
  fragmentShader: /* glsl */ `
    uniform sampler2D tDiffuse;
    varying vec2 vUv;
    void main() {
      vec4 c = texture2D(tDiffuse, vUv);
      float m = max(c.r, max(c.g, c.b));
      gl_FragColor = vec4(c.rgb * min(1.0, 2.5 / max(m, 1e-4)), 1.0);
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
  // a near-black radial falloff; at 8 bits a gradient this dark bands, so each pixel gets a seeded ±1 level of dither
  const S = 1024
  const c = document.createElement('canvas')
  c.width = S
  c.height = S
  const g = c.getContext('2d')
  const gr = g.createRadialGradient(S / 2, S * 0.46, 8, S / 2, S / 2, S * 0.71)
  gr.addColorStop(0, '#0f0c14')
  gr.addColorStop(0.55, '#07060a')
  gr.addColorStop(1, '#020203')
  g.fillStyle = gr
  g.fillRect(0, 0, S, S)
  const img = g.getImageData(0, 0, S, S)
  const r = rng(7)
  for (let i = 0; i < img.data.length; i += 4) {
    const d = Math.round((r() - 0.5) * 2.2)
    img.data[i] = Math.max(0, img.data[i] + d)
    img.data[i + 1] = Math.max(0, img.data[i + 1] + d)
    img.data[i + 2] = Math.max(0, img.data[i + 2] + d)
  }
  g.putImageData(img, 0, 0)
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
 * may be missing. Returns a function that tears everything down, at any point of the boot.
 *
 * The boot runs in stages and yields between them, reporting each through onProgress(label, 0..1). Its last stage
 * renders the opening frame behind the loader to find the quality tier this GPU holds at full frame rate, so the
 * piece never visibly changes quality in its first seconds. Then onReady.
 *
 * Hooks for reviewing stills (not controls): ?t=<seconds> starts there, ?pause renders one frame and waits for
 * window.__chaos.renderAt(t), ?tier=<0-5> fixes the quality tier.
 *
 * @param {HTMLElement} host
 * @param {{title?: HTMLElement | null, leftBox?: HTMLElement | null, rightBox?: HTMLElement | null,
 *   left?: (HTMLElement | null)[], right?: (HTMLElement | null)[]}} [overlay]
 * @param {{onReady?: () => void, onUnsupported?: () => void, onProgress?: (label: string, k: number) => void}} [options]
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
  const progress = (label, k) => options.onProgress?.(label, k)
  // let the loader paint between stages
  const yieldNow = () => new Promise((r) => setTimeout(r, 0))
  const nextFrame = () => new Promise((r) => requestAnimationFrame(r))

  let alive = true
  let raf = 0
  // everything the boot builds, so a teardown mid-boot frees exactly what exists
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
    // count a whole frame (every pass), not just the last draw
    renderer.info.autoReset = false

    scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(40, 1, 0.05, 400)
    // the sky light takes the storm's colour, so everything near it reads as lit by it
    const hemi = new THREE.HemisphereLight('#3a3550', '#0a0806', 0.7)
    scene.add(hemi)
    const hemiBase = new THREE.Color('#3a3550')
    const key = new THREE.DirectionalLight('#ffe7cc', 2.5)
    key.position.set(6, 10, 8)
    scene.add(key)
    const rim = new THREE.DirectionalLight('#9fc2ff', 1.3)
    rim.position.set(-8, 3, -10)
    scene.add(rim)

    // ---------------------------------------------------------- the stages
    const attractors = []
    for (let i = 0; i < ATTRACTOR_NAMES.length; i++) {
      progress(`INTEGRATING THE ${ATTRACTOR_NAMES[i].toUpperCase()} ATTRACTOR`, 0.1 + 0.06 * i)
      await yieldNow()
      if (!alive) return
      attractors.push(buildAttractor(i))
    }
    const count = small ? 150000 : 280000
    progress(`SEEDING ${count.toLocaleString('en-US')} PARTICLES`, 0.42)
    await yieldNow()
    if (!alive) return
    storm = buildStorm(attractors, { count })
    scene.add(storm.group)

    progress('ASSEMBLING THE V8, THE STRANDBEEST AND THE GEAR', 0.5)
    await yieldNow()
    if (!alive) return
    const machines = buildMachines()
    scene.add(machines.group)

    progress('MACHINING THE LOOSE PARTS', 0.62)
    await yieldNow()
    if (!alive) return
    const debris = buildDebris(attractors)
    scene.add(debris.group)

    progress('LIGHTING THE STUDIO', 0.68)
    await yieldNow()
    if (!alive) return
    scene.background = backdrop()
    scene.environment = studioEnvironment(renderer)
    scene.environmentIntensity = 0.7

    const pal = PALETTES.map((p) => p.map((h) => new THREE.Color(h)))
    storm.uniforms.uAcc.value.forEach((c, i) => c.set(ACCENTS[i]))

    // -------------------------------------------------------- post
    // 4x MSAA on every device: the streaks are hairlines and the machines are thin tubes, both shimmer without it
    target = new THREE.WebGLRenderTarget(4, 4, { type: THREE.HalfFloatType, samples: 4 })
    composer = new EffectComposer(renderer, target)
    composer.addPass(new RenderPass(scene, camera))
    composer.addPass(new ShaderPass(CLAMP))
    const bloom = new UnrealBloomPass(new THREE.Vector2(4, 4), 0.6, 0.4, 1.3)
    composer.addPass(bloom)
    const finish = new ShaderPass(FINISH)
    composer.addPass(finish)
    composer.addPass(new OutputPass())

    // -------------------------------------------------------- quality tiers
    // Resolution is the last thing to go: a slow GPU first draws fewer particles and parts, and only then fewer
    // pixels. The pixel ratio is capped at 2 (a 3x phone at 2x is already sharp, and a third of the cost).
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

    // Resizing a canvas clears it. Done between frames, the browser shows that empty canvas for a frame: the black
    // flicker. So a resize only marks the size dirty, and the next frame applies it right before it draws.
    let W = 0
    let H = 0
    let PR = 0
    let sizeDirty = true
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
        finish.uniforms.uAspect.value = W / H
      }
      storm.setDensity(T.density)
    }
    // a run of resize events (a phone's toolbar sliding away) settles into one resize
    ro = new ResizeObserver(() => {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(() => (sizeDirty = true), 150)
    })
    ro.observe(host)

    // -------------------------------------------------------- captions
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

    // -------------------------------------------------------- one frame, as a function of t
    const portrait = (p, l) => {
      // tall screens: step back along the view line so the same width of the scene fits
      const a = W / H
      if (a >= 1.15) return
      const k = Math.pow(1.15 / a, 0.8)
      p.sub(l).multiplyScalar(k).add(l)
    }
    let frame = 0
    const render = (t) => {
      if (sizeDirty) applySize()
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
      // the streak tails: the same storm, FLOW.trail seconds earlier
      const t2 = t - FLOW.trail
      const at2 = attractorAt(tau - FLOW.trail)
      const [fa2, fb2] = flowPhases(t2)
      u.uFlowA2.value = fa2
      u.uFlowB2.value = fb2
      u.uTime2.value = ((t2 % 3600) + 3600) % 3600
      // morph progress on the head's own pair of attractors (across a window edge, the tail holds where the head is)
      u.uMorph2.value = at2.a === at.a && at2.b === at.b ? at2.m : at.a !== at.b ? 0 : at.m
      const ex2 = explodeAt(tau - FLOW.trail)
      u.uRel2.value[0] = ex2.v8
      u.uRel2.value[1] = ex2.beast
      u.uRel2.value[2] = ex2.gear
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
            'NOTHING HERE IS RANDOM',
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

    // test hook: render any moment on demand (the page's own review loop uses it)
    window.__chaos = {
      renderAt: (s) => render(s),
      get tier() {
        return tier
      },
      info: () => ({ ...renderer.info.render }),
    }

    let t = Number(q.get('t')) || 0

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
    // The opening frame, drawn again and again: the median time between frames says whether the GPU keeps up. Step
    // down until it does. If a step down does not make frames faster, the screen or a power mode is capping the
    // rate, not the GPU: step back up and stop.
    const timeFrames = async (n) => {
      const ts = []
      let prev = await nextFrame()
      const start = prev
      for (let i = 0; i < n + 3; i++) {
        render(t)
        const now = await nextFrame()
        // the first frames after a change carry its one-off costs
        if (i >= 3) ts.push(now - prev)
        prev = now
        if (!alive) return Infinity
        // a very slow GPU has said enough after a second and a half
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
    // After the reveal the tier only moves on sustained trouble: two slow 3-second windows in a row. A step that does
    // not help is undone, and then the watch stops for good.
    let watchFrom = 0
    let acc = 0
    let n = 0
    let slow = 0
    let probe = null // {from, avg}: a step down on trial
    let locked = fixedTier
    let drops = 0
    const loop = (now) => {
      if (!alive) return
      raf = requestAnimationFrame(loop)
      const dt = last ? Math.min(0.1, (now - last) / 1000) : 0
      last = now
      t += dt * speed
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
      // do not count the time away, and do not judge the GPU on the first frames back
      last = 0
      watchFrom = 0
      acc = 0
      n = 0
      slow = 0
    }
    document.addEventListener('visibilitychange', onVisibility)

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
    if (window.__chaos) delete window.__chaos
    scene?.traverse((o) => {
      if (o.geometry) o.geometry.dispose()
      const mats = o.material ? (Array.isArray(o.material) ? o.material : [o.material]) : []
      for (const m of mats) {
        for (const v of Object.values(m)) if (v && v.isTexture) v.dispose()
        m.dispose()
      }
    })
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
