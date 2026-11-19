import { FRAGMENT, MAX_LIGHTS, VERTEX } from './shader'
import type { WorldKey } from './world'

/** Everything the shader needs for one frame */
export interface Frame {
  key: WorldKey
  time: number
  flow: number
  travel: number
  gazeX: number
  gazeY: number
  youX: number
  youY: number
  scene: number
  white: number
  dark: number
  phos: number
  lid: number
  shake: number
  grain: number
  lights: Float32Array
  lightColours: Float32Array
  lightCount: number
}

export const lightBuffers = () => ({
  lights: new Float32Array(MAX_LIGHTS * 4),
  lightColours: new Float32Array(MAX_LIGHTS * 3),
})

const UNIFORMS = [
  'uRes',
  'uTime',
  'uFlow',
  'uGaze',
  'uTravel',
  'uSkyTop',
  'uSkyHor',
  'uSunCol',
  'uFog',
  'uLandFar',
  'uLandNear',
  'uSeaCol',
  'uCloudCol',
  'uSun',
  'uHorizon',
  'uMoon',
  'uStars',
  'uClouds',
  'uHills',
  'uCity',
  'uCityNear',
  'uWindows',
  'uWater',
  'uHouse',
  'uGrass',
  'uSeeds',
  'uFlies',
  'uRain',
  'uSnow',
  'uLeaves',
  'uWarp',
  'uVig',
  'uExpo',
  'uGrain',
  'uScene',
  'uWhite',
  'uDark',
  'uPhos',
  'uLid',
  'uShake',
  'uYou',
  'uNL',
  'uL',
  'uLC',
] as const

type UniformName = (typeof UNIFORMS)[number]

// The most pixels the dream is drawn at. It is soft by nature, so it is drawn smaller than the
// screen and scaled up: a phone draws a fraction of its pixels, a big monitor about a megapixel.
const PIXEL_BUDGET = 1_000_000

export class Renderer {
  private gl: WebGL2RenderingContext
  private program: WebGLProgram
  private u = {} as Record<UniformName, WebGLUniformLocation | null>
  private width = 0
  private height = 0
  private cssWidth = 0
  private cssHeight = 0
  /** Drops when frames are slow (see adapt), so slow machines draw fewer pixels */
  private quality = 1
  private frameTimes: number[] = []
  /** the screen's own time between frames, as far as it has shown it (see adapt) */
  private pace = Infinity
  private ceiling = 1
  private calm = 0
  lost = false

  private constructor(gl: WebGL2RenderingContext, program: WebGLProgram) {
    this.gl = gl
    this.program = program
    for (const name of UNIFORMS) this.u[name] = gl.getUniformLocation(program, name)
  }

  /** null when the browser has no WebGL 2 or the shader will not build: the dream then runs on
   *  colours alone (see Director.fallback) */
  static create(canvas: HTMLCanvasElement): Renderer | null {
    let gl: WebGL2RenderingContext | null = null
    try {
      gl = canvas.getContext('webgl2', {
        alpha: true,
        premultipliedAlpha: true,
        antialias: false,
        depth: false,
        stencil: false,
        preserveDrawingBuffer: false,
        powerPreference: 'high-performance',
      })
    } catch {
      return null
    }
    if (!gl) return null
    const program = build(gl)
    if (!program) return null
    const renderer = new Renderer(gl, program)
    canvas.addEventListener('webglcontextlost', (event) => {
      event.preventDefault()
      renderer.lost = true
    })
    return renderer
  }

  /** Size the drawing to the window. Call on resize; cheap when nothing changed. */
  resize(cssWidth: number, cssHeight: number) {
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
    const full = cssWidth * cssHeight * dpr * dpr
    const scale = Math.min(1, Math.sqrt(PIXEL_BUDGET / Math.max(full, 1))) * this.quality
    const width = Math.max(2, Math.round(cssWidth * dpr * scale))
    const height = Math.max(2, Math.round(cssHeight * dpr * scale))
    this.cssWidth = cssWidth
    this.cssHeight = cssHeight
    if (width === this.width && height === this.height) return
    this.width = width
    this.height = height
    const canvas = this.gl.canvas as HTMLCanvasElement
    canvas.width = width
    canvas.height = height
  }

  /** Feed it the time between frames. Frames are judged against the screen's own pace, the
   *  quickest they have come (the eyelids at the start are cheap to draw), so a phone saving
   *  battery at 30 a second keeps its sharp picture: only missed frames cost pixels, and the
   *  pixels come back when there is room again. Nothing asks for more than 60 a second. */
  adapt(frameMs: number) {
    // a stall, or a tab coming back, says nothing about the drawing
    if (frameMs > 250) return
    this.frameTimes.push(frameMs)
    if (this.frameTimes.length < 40) return
    const sorted = [...this.frameTimes].sort((a, b) => a - b)
    this.frameTimes.length = 0
    const quick = sorted[Math.floor(sorted.length * 0.1)]
    const slow = sorted[Math.floor(sorted.length * 0.75)]
    // the pace may relax a little, in case the screen itself slows down (battery saving)
    this.pace = Math.min(this.pace * 1.01, quick)
    // and where it was too slow before is tried again only now and then
    this.ceiling = Math.min(1, this.ceiling * 1.0008)
    const target = Math.max(this.pace, 16)
    let next = this.quality
    if (slow > target * 1.4) {
      // missing frames: fewer pixels, and don't climb straight back to where it was slow
      this.ceiling = this.quality * 0.96
      this.calm = 0
      next = Math.max(0.45, this.quality * 0.85)
    } else if (slow < target * 1.15 && ++this.calm >= 6) {
      this.calm = 0
      next = Math.min(1, this.ceiling, this.quality * 1.05)
    }
    if (Math.abs(next - this.quality) > 0.01) {
      this.quality = next
      this.resize(this.cssWidth, this.cssHeight)
    }
  }

  render(f: Frame) {
    if (this.lost) return
    const gl = this.gl
    const u = this.u
    const k = f.key
    gl.viewport(0, 0, this.width, this.height)
    gl.useProgram(this.program)
    gl.uniform2f(u.uRes, this.width, this.height)
    gl.uniform1f(u.uTime, f.time)
    gl.uniform1f(u.uFlow, f.flow)
    gl.uniform2f(u.uGaze, f.gazeX, f.gazeY)
    gl.uniform1f(u.uTravel, f.travel)
    gl.uniform3fv(u.uSkyTop, k.skyTop)
    gl.uniform3fv(u.uSkyHor, k.skyHor)
    gl.uniform3fv(u.uSunCol, k.sun)
    gl.uniform3fv(u.uFog, k.fog)
    gl.uniform3fv(u.uLandFar, k.landFar)
    gl.uniform3fv(u.uLandNear, k.landNear)
    gl.uniform3fv(u.uSeaCol, k.sea)
    gl.uniform3fv(u.uCloudCol, k.cloud)
    gl.uniform4f(u.uSun, k.sunX, k.sunY, k.sunSize, k.sunGlow)
    gl.uniform1f(u.uHorizon, k.horizon)
    gl.uniform1f(u.uMoon, k.moon)
    gl.uniform1f(u.uStars, k.stars)
    gl.uniform1f(u.uClouds, k.clouds)
    gl.uniform1f(u.uHills, k.hills)
    gl.uniform1f(u.uCity, k.city)
    gl.uniform1f(u.uCityNear, k.cityNear)
    gl.uniform1f(u.uWindows, k.windows)
    gl.uniform1f(u.uWater, k.water)
    gl.uniform1f(u.uHouse, k.house)
    gl.uniform1f(u.uGrass, k.grass)
    gl.uniform1f(u.uSeeds, k.seeds)
    gl.uniform1f(u.uFlies, k.flies)
    gl.uniform1f(u.uRain, k.rain)
    gl.uniform1f(u.uSnow, k.snow)
    gl.uniform1f(u.uLeaves, k.leaves)
    gl.uniform1f(u.uWarp, k.warp)
    gl.uniform1f(u.uVig, k.vignette)
    gl.uniform1f(u.uExpo, k.exposure)
    gl.uniform1f(u.uGrain, f.grain)
    gl.uniform1f(u.uScene, f.scene)
    gl.uniform1f(u.uWhite, f.white)
    gl.uniform1f(u.uDark, f.dark)
    gl.uniform1f(u.uPhos, f.phos)
    gl.uniform1f(u.uLid, f.lid)
    gl.uniform1f(u.uShake, f.shake)
    gl.uniform2f(u.uYou, f.youX, f.youY)
    gl.uniform1i(u.uNL, f.lightCount)
    gl.uniform4fv(u.uL, f.lights)
    gl.uniform3fv(u.uLC, f.lightColours)
    gl.drawArrays(gl.TRIANGLES, 0, 3)
  }

  dispose() {
    const gl = this.gl
    gl.deleteProgram(this.program)
    gl.getExtension('WEBGL_lose_context')?.loseContext()
  }
}

function build(gl: WebGL2RenderingContext): WebGLProgram | null {
  const compile = (type: number, source: string) => {
    const shader = gl.createShader(type)
    if (!shader) return null
    gl.shaderSource(shader, source)
    gl.compileShader(shader)
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error('[dream] shader:', gl.getShaderInfoLog(shader))
      gl.deleteShader(shader)
      return null
    }
    return shader
  }
  const vs = compile(gl.VERTEX_SHADER, VERTEX)
  const fs = compile(gl.FRAGMENT_SHADER, FRAGMENT)
  if (!vs || !fs) return null
  const program = gl.createProgram()
  if (!program) return null
  gl.attachShader(program, vs)
  gl.attachShader(program, fs)
  gl.linkProgram(program)
  gl.deleteShader(vs)
  gl.deleteShader(fs)
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error('[dream] program:', gl.getProgramInfoLog(program))
    return null
  }
  return program
}
