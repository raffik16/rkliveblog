// The harmony machine: a harmonograph swinging a funnel of sand with an LED on it, over a
// steel plate that a speaker sets ringing, watched by a camera with its shutter open.
//
// Every frame:
//   1. the pendulums run forward in small fixed steps (pendulum.ts), tracing the funnel's path
//   2. that path is added to the photograph as light (renderer.ts → light)
//   3. sand falls from the funnel along the same path, at a steady rate in time
//   4. every grain on the plate takes a step: thrown about where the plate shakes, still where
//      it doesn't, so it drifts onto the plate's still lines
//   5. the camera's view is drawn
//
// Time on the plate runs faster than real time (state.speed): the pendulums are real-sized and
// swing at real rates, and a real exposure would take several minutes.

import { ChordAudio } from './audio'
import {
  chordHz,
  intervalById,
  linearRgb,
  pendulumHz,
  ratioOf,
  ROOT_HZ,
  type Interval,
  type Tuning,
} from './intervals'
import { Harmonograph } from './pendulum'
import { EXTENT, Renderer, SEGMENT, type CompositeParams } from './renderer'

type Vec3 = [number, number, number]

export interface Layers {
  light: boolean
  sand: boolean
  pattern: boolean
}

export interface MachineState {
  interval: string
  tuning: Tuning
  layers: Layers
  /** How hard the speaker drives the plate, 0..1 (also how loud the chord is) */
  drive: number
  /** How fast sand pours, 0..1 */
  flow: number
  /** Pendulum seconds per real second */
  speed: number
  /** Whether swings get the third, rotary pendulum */
  third: boolean
  running: boolean
  sound: boolean
}

export interface Hud {
  /** Seconds the shutter has been open, in pendulum time */
  exposure: number
  shutter: boolean
  /** Grains poured since the plate was last swept */
  poured: number
  /** 0 when the swing starts, 1 when it has died away */
  progress: number
  running: boolean
  holding: boolean
}

export interface Quality {
  /** Size of the light and sand textures, square */
  simSize: number
  maxGrains: number
}

/** Pendulum time per path step: about 6 ms, so even the fastest swing draws a smooth curve */
const SUB = 1 / 360
/** The rotary pendulum swings this much faster than the root; the slow turn of the figure */
const ROTARY_DETUNE = 0.0035
/** Seconds for each pendulum's swing to fall to 1/e: root, upper, rotary */
const DAMPING: Vec3 = [74, 62, 96]
/** Light the LED leaves per second (sets how bright one pass of the swing comes out) */
const LED_POWER = 0.0021
const EXPOSURE = 1.0
const BLOOM_GAIN = 0.2
/** Grains per second of pendulum time at full flow (on the full-size simulation) */
const SAND_RATE = 9000
/** How widely the sand stream scatters where it lands, plate units */
const SCATTER = 0.0022
/** How far a thrown grain hops at random, and how fast it slides towards the still lines */
const JITTER = 0.02
const DRIFT = 0.15
/**
 * How hard the plate has to shake to throw sand, in units of its biggest swing. Each grain's own
 * threshold falls somewhere between none and twice this, most of them low.
 */
const THRESHOLD = 0.015
/** Seconds for the plate to ring up into a new mode, and for the LED to change colour */
const RING_UP = 0.7
const COLOUR_FADE = 1.4
/** The first swing is always the same one, picked for how it looks */
const FIRST_SEED = 0x51f15e

function mulberry32(seed: number) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const smoothstep = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)))
  return t * t * (3 - 2 * t)
}

const mix3 = (a: Vec3, b: Vec3, t: number): Vec3 => [
  a[0] + (b[0] - a[0]) * t,
  a[1] + (b[1] - a[1]) * t,
  a[2] + (b[2] - a[2]) * t,
]

const modeOf = (i: Interval): Vec3 => [i.p, i.q, i.sign]
const paletteOf = (i: Interval): [Vec3, Vec3] => [linearRgb(i.colors[0]), linearRgb(i.colors[1])]

export class Machine {
  readonly canvas: HTMLCanvasElement
  readonly audio = new ChordAudio()
  private gl: WebGL2RenderingContext
  private r: Renderer
  private quality: Quality
  private pend = new Harmonograph()
  private state: MachineState
  private onHud: (h: Hud) => void

  private raf = 0
  private last = 0
  private time = 0
  private visible = true
  private dirty = true
  private sandDirty = true
  private lost = false

  private mode: Vec3
  private modeOld: Vec3
  private modeMix = 1
  private palette: [Vec3, Vec3]
  private paletteOld: [Vec3, Vec3]
  private paletteMix = 1
  private drive: number

  private subAcc = 0
  private spawnAcc = 0
  private seed = 1
  private exposure = 0
  private poured = 0
  private hudAt = 0
  private shutter = true
  private rand = mulberry32(FIRST_SEED)
  /** Pendulum time still to run through at full speed (developing a still) */
  private developLeft = 0

  private path = new Float32Array(2 * 1024)
  private segs = new Float32Array(SEGMENT * 1024)
  private grains = new Float32Array(4 * 4096)

  constructor(
    canvas: HTMLCanvasElement,
    state: MachineState,
    quality: Quality,
    onHud: (h: Hud) => void
  ) {
    this.canvas = canvas
    this.state = { ...state, layers: { ...state.layers } }
    this.quality = quality
    this.onHud = onHud
    const gl = canvas.getContext('webgl2', {
      alpha: false,
      antialias: false,
      depth: false,
      stencil: false,
      premultipliedAlpha: false,
      preserveDrawingBuffer: false,
      powerPreference: 'high-performance',
    })
    if (!gl) throw new Error('unsupported')
    this.gl = gl
    const maxTex = gl.getParameter(gl.MAX_TEXTURE_SIZE) as number
    this.r = new Renderer(gl, Math.min(quality.simSize, maxTex), quality.maxGrains)

    const interval = intervalById(state.interval)
    this.mode = this.modeOld = modeOf(interval)
    this.palette = this.paletteOld = paletteOf(interval)
    this.drive = state.drive
    this.retune(false)
    this.pend.thirdOn = state.third
    this.pend.setDamping(...DAMPING)
    this.pend.release(this.rand)
    this.rand = mulberry32((Date.now() ^ FIRST_SEED) >>> 0)
    this.audio.setDrive(state.drive)

    canvas.addEventListener('webglcontextlost', this.onLost)
    canvas.addEventListener('webglcontextrestored', this.onRestored)
    this.raf = requestAnimationFrame(this.tick)
  }

  // ------------------------------------------------------------------------------- controls

  set(patch: Partial<MachineState>) {
    const prev = this.state
    const next = { ...prev, ...patch, layers: { ...prev.layers, ...(patch.layers || {}) } }
    this.state = next
    if (next.interval !== prev.interval) {
      const interval = intervalById(next.interval)
      // The plate rings up into its new mode from wherever the old one was
      this.modeOld = this.modeMix < 1 ? this.blendMode() : this.mode
      this.mode = modeOf(interval)
      this.modeMix = 0
      this.paletteOld = this.paletteMix < 1 ? this.blendPalette() : this.palette
      this.palette = paletteOf(interval)
      this.paletteMix = 0
    }
    if (next.interval !== prev.interval || next.tuning !== prev.tuning) this.retune(true)
    if (next.third !== prev.third) {
      this.pend.thirdOn = next.third
      if (!next.third) this.pend.quietThird()
    }
    if (next.drive !== prev.drive) this.audio.setDrive(next.drive)
    if (next.sound !== prev.sound) this.audio.setOn(next.sound)
    if (next.running && !prev.running) this.last = 0
    this.dirty = true
  }

  /** Pendulums and chord to the current interval and tuning */
  private retune(glide: boolean) {
    const interval = intervalById(this.state.interval)
    const [root, upper] = chordHz(interval, this.state.tuning)
    const w = 2 * Math.PI * pendulumHz(ROOT_HZ)
    this.pend.tune(w, w * ratioOf(interval, this.state.tuning), w * (1 + ROTARY_DETUNE))
    this.audio.setChord(root, upper)
    if (!glide) this.dirty = true
  }

  /** Let the pendulum go again from a new start. The shutter opens if it had closed */
  swing() {
    this.pend.setDamping(...DAMPING)
    this.pend.release(this.rand)
    this.shutter = true
    if (!this.state.running) this.set({ running: true })
    this.dirty = true
  }

  sweep() {
    this.r.clearSand()
    this.poured = 0
    this.sandDirty = true
    this.dirty = true
  }

  newExposure() {
    this.r.clearLight()
    this.exposure = 0
    this.dirty = true
  }

  /** Run this many seconds of pendulum time as fast as possible, then show the result */
  develop(seconds: number) {
    this.developLeft = seconds
  }

  // ------------------------------------------------------------------------------- the hand

  /** Screen coordinates to plate units */
  toPlate(clientX: number, clientY: number): [number, number] {
    const rect = this.canvas.getBoundingClientRect()
    const x = ((clientX - rect.left) / rect.width) * 2 - 1
    const y = 1 - ((clientY - rect.top) / rect.height) * 2
    return [x * EXTENT, y * EXTENT]
  }

  grab(clientX: number, clientY: number) {
    const [x, y] = this.toPlate(clientX, clientY)
    this.pend.grab(x, y)
    this.shutter = true
    if (!this.state.running) this.set({ running: true })
  }

  drag(clientX: number, clientY: number) {
    if (!this.pend.holding) return
    const [x, y] = this.toPlate(clientX, clientY)
    this.pend.moveHand(x, y)
  }

  letGo() {
    if (!this.pend.holding) return
    this.pend.setDamping(...DAMPING)
    this.pend.letGo()
  }

  /** Whether a point on screen is on (or near) the funnel */
  nearFunnel(clientX: number, clientY: number, radius = 0.16) {
    const [x, y] = this.toPlate(clientX, clientY)
    return Math.hypot(x - this.pend.x, y - this.pend.y) < radius
  }

  // ------------------------------------------------------------------------------- the page

  resize(cssWidth: number, cssHeight: number, dpr: number) {
    const scale = Math.min(dpr || 1, 2)
    const w = Math.max(1, Math.min(2048, Math.round(cssWidth * scale)))
    const h = Math.max(1, Math.min(2048, Math.round(cssHeight * scale)))
    if (this.canvas.width !== w || this.canvas.height !== h) {
      this.canvas.width = w
      this.canvas.height = h
      this.dirty = true
    }
  }

  setVisible(visible: boolean) {
    this.visible = visible
    if (visible) this.dirty = true
  }

  // ------------------------------------------------------------------------------- the loop

  private tick = (now: number) => {
    this.raf = requestAnimationFrame(this.tick)
    if (this.lost) return
    const dt = this.last ? Math.min(0.05, (now - this.last) / 1000) : 1 / 60
    this.last = now
    this.time += dt

    if (this.modeMix < 1) {
      this.modeMix = Math.min(1, this.modeMix + dt / RING_UP)
      this.dirty = true
    }
    if (this.paletteMix < 1) this.paletteMix = Math.min(1, this.paletteMix + dt / COLOUR_FADE)
    this.drive += (this.state.drive - this.drive) * (1 - Math.exp(-dt / 0.25))

    let ran = false
    if (this.developLeft > 0) {
      // Developing a still: as much pendulum time as fits in ~12 ms, coarsely, unseen
      const until = performance.now() + 12
      while (this.developLeft > 0 && performance.now() < until) {
        const step = Math.min(0.25, this.developLeft)
        this.simulate(step, 10)
        this.developLeft -= step
      }
      ran = true
    } else if (this.state.running || this.pend.holding) {
      this.simulate(dt * this.state.speed, 45)
      ran = true
    }

    if (this.visible && (ran || this.dirty)) this.draw(ran)

    if (now - this.hudAt > 100) {
      this.hudAt = now
      this.onHud({
        exposure: this.exposure,
        shutter: this.shutter,
        poured: this.poured,
        progress: this.pend.progress(),
        running: this.state.running,
        holding: this.pend.holding,
      })
    }
  }

  private ensure(n: number) {
    if (this.path.length < 2 * (n + 1)) this.path = new Float32Array(2 * (n + 1) * 2)
    if (this.segs.length < SEGMENT * n) this.segs = new Float32Array(SEGMENT * n * 2)
  }

  /** Run the machine forward by simDt seconds of pendulum time */
  private simulate(simDt: number, sandStepsPerSecond: number) {
    const pend = this.pend
    const r = this.r
    const acc = this.subAcc + simDt
    const n = Math.floor(acc / SUB)
    this.subAcc = acc - n * SUB
    this.ensure(n)

    // 1, 2: the swing, and the light it leaves while the shutter is open
    const led = this.ledColour()
    const k = LED_POWER * r.lightUnit
    const cr = led[0] * k
    const cg = led[1] * k
    const cb = led[2] * k
    const path = this.path
    const segs = this.segs
    let x0 = pend.x
    let y0 = pend.y
    path[0] = x0
    path[1] = y0
    let count = 0
    for (let i = 0; i < n; i++) {
      pend.step(SUB)
      const x1 = pend.x
      const y1 = pend.y
      path[2 * i + 2] = x1
      path[2 * i + 3] = y1
      if (this.shutter) {
        const o = count * SEGMENT
        segs[o] = x0
        segs[o + 1] = y0
        segs[o + 2] = x1
        segs[o + 3] = y1
        segs[o + 4] = cr
        segs[o + 5] = cg
        segs[o + 6] = cb
        segs[o + 7] = SUB
        count++
      }
      x0 = x1
      y0 = y1
    }
    r.drawLight(segs, count, this.sigma())
    if (this.shutter) this.exposure += simDt
    // The swing has died away: close the shutter rather than burn a dot into the picture
    if (this.shutter && pend.resting) this.shutter = false

    // 3: sand, at a steady rate in time, so it heaps up where the funnel slows at the turns
    const gate = pend.holding ? 1 : smoothstep(0.03, 0.09, pend.reach())
    // Fewer, so the same amount of sand, on the smaller simulation used on phones
    const scale = Math.min(1, (this.r.simSize / 1536) ** 2 * 1.6)
    const rate = SAND_RATE * scale * Math.pow(this.state.flow, 1.5) * gate
    const want = rate * simDt + this.spawnAcc
    let grains = Math.floor(want)
    this.spawnAcc = want - grains
    grains = Math.min(grains, 16384)
    if (grains > 0) {
      if (this.grains.length < grains * 4) this.grains = new Float32Array(grains * 8)
      const g = this.grains
      const rand = this.rand
      for (let j = 0; j < grains; j++) {
        // a random moment within this step, and a little scatter where it lands
        const t = rand() * n
        const i = Math.min(Math.floor(t), Math.max(n - 1, 0))
        const f = t - i
        const ax = n > 0 ? path[2 * i] : pend.x
        const ay = n > 0 ? path[2 * i + 1] : pend.y
        const bx = n > 0 ? path[2 * i + 2] : ax
        const by = n > 0 ? path[2 * i + 3] : ay
        const u1 = Math.max(rand(), 1e-9)
        const u2 = rand()
        const rad = SCATTER * Math.sqrt(-2 * Math.log(u1))
        g[4 * j] = ax + (bx - ax) * f + rad * Math.cos(6.2831853 * u2)
        g[4 * j + 1] = ay + (by - ay) * f + rad * Math.sin(6.2831853 * u2)
        g[4 * j + 2] = 0
        g[4 * j + 3] = 1
      }
      r.spawn(g, grains)
      this.poured += grains
    }

    // 4: the plate shakes the sand, in steps short enough for the walk to stay smooth
    if (r.used) {
      const steps = Math.max(1, Math.ceil(simDt * sandStepsPerSecond))
      const h = simDt / steps
      const mode = this.mode
      const modeOld = this.modeOld
      for (let s = 0; s < steps; s++) {
        this.seed = (Math.imul(this.seed, 1664525) + 1013904223) >>> 0
        r.stepSand(
          { dt: h, drive: this.drive, mode, modeOld, modeMix: this.modeMix, seed: this.seed },
          JITTER,
          DRIFT,
          THRESHOLD
        )
      }
    }
    this.sandDirty = true
  }

  /** The blur spot the camera makes of the LED: a little under a texel, never smaller */
  private sigma() {
    return Math.max(0.0011, (0.8 * 2 * EXTENT) / this.r.simSize)
  }

  /** A grain, in sand-texture pixels: the same size on the plate whatever the texture's size */
  private get grainSize() {
    return Math.max(1, this.r.simSize / 768)
  }

  private blendMode(): Vec3 {
    // Mid-change, the plate is between two modes; the shader mixes them, so keep the newer one
    return this.modeMix < 0.5 ? this.modeOld : this.mode
  }

  private blendPalette(): [Vec3, Vec3] {
    const t = this.paletteMix
    return [
      mix3(this.paletteOld[0], this.palette[0], t),
      mix3(this.paletteOld[1], this.palette[1], t),
    ]
  }

  /** The LED's colour now: it fades from the first colour to the second over each swing */
  private ledColour(): Vec3 {
    const t = this.pend.progress()
    const now = mix3(this.palette[0], this.palette[1], t)
    if (this.paletteMix >= 1) return now
    const was = mix3(this.paletteOld[0], this.paletteOld[1], t)
    return mix3(was, now, this.paletteMix)
  }

  private params(funnel: boolean, grain: number): CompositeParams {
    const l = this.state.layers
    const led = this.ledColour()
    return {
      layers: [l.light ? 1 : 0, l.sand ? 1 : 0, l.pattern ? 1 : 0, funnel ? 1 : 0],
      funnel: [this.pend.x, this.pend.y],
      led,
      mode: this.mode,
      modeOld: this.modeOld,
      modeMix: this.modeMix,
      drive: this.drive,
      room: 1,
      grain,
      time: this.time,
    }
  }

  private draw(ran: boolean) {
    if (this.sandDirty) {
      this.r.renderSand(this.grainSize)
      this.sandDirty = false
    }
    if (ran) this.r.bloom()
    this.r.composite(this.params(true, 0.016), EXPOSURE, BLOOM_GAIN)
    this.dirty = false
  }

  // ------------------------------------------------------------------------------- the photo

  /** The exposure so far as a print: the camera's view without the funnel, and a caption */
  async photo(title: string, detail: string, site: string, font: string): Promise<Blob | null> {
    if (this.lost) return null
    const gl = this.gl
    const size = Math.min(
      2048,
      gl.getParameter(gl.MAX_TEXTURE_SIZE) as number,
      gl.getParameter(gl.MAX_RENDERBUFFER_SIZE) as number
    )
    this.r.renderSand(this.grainSize)
    this.r.bloom()
    const pixels = this.r.snapshot(size, this.params(false, 0.01), EXPOSURE, BLOOM_GAIN)
    this.dirty = true

    const band = Math.round(size * 0.075)
    const canvas = document.createElement('canvas')
    canvas.width = size
    canvas.height = size + band
    const ctx = canvas.getContext('2d')
    if (!ctx) return null
    const image = ctx.createImageData(size, size)
    const row = size * 4
    for (let y = 0; y < size; y++) {
      image.data.set(pixels.subarray((size - 1 - y) * row, (size - y) * row), y * row)
    }
    ctx.putImageData(image, 0, 0)
    ctx.fillStyle = '#07080c'
    ctx.fillRect(0, size, size, band)
    const pad = Math.round(size * 0.035)
    const mid = size + band / 2
    ctx.textBaseline = 'middle'
    ctx.font = `600 ${Math.round(band * 0.25)}px ${font}`
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)'
    ctx.fillText(title, pad, mid - band * 0.15)
    ctx.font = `400 ${Math.round(band * 0.2)}px ${font}`
    ctx.fillStyle = 'rgba(255, 255, 255, 0.55)'
    ctx.fillText(detail, pad, mid + band * 0.2)
    ctx.textAlign = 'right'
    ctx.fillText(site, size - pad, mid + band * 0.2)
    return new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.93))
  }

  // ------------------------------------------------------------------------------- losing it

  private onLost = (e: Event) => {
    e.preventDefault()
    this.lost = true
  }

  private onRestored = () => {
    // The GPU took everything with it: build again on a fresh exposure and a swept plate
    try {
      this.r = new Renderer(this.gl, this.quality.simSize, this.quality.maxGrains)
      this.lost = false
      this.exposure = 0
      this.poured = 0
      this.sandDirty = true
      this.dirty = true
    } catch {
      // leave it lost; the page offers a reload
    }
  }

  destroy() {
    cancelAnimationFrame(this.raf)
    this.canvas.removeEventListener('webglcontextlost', this.onLost)
    this.canvas.removeEventListener('webglcontextrestored', this.onRestored)
    this.audio.dispose()
    this.r.dispose()
    this.gl.getExtension('WEBGL_lose_context')?.loseContext()
  }
}
