// WebGL 2 for the harmony machine. Per frame:
//
//   grains ──transform feedback──> grains'      every grain on the plate takes a step (GPU)
//   new grains ──bufferSubData──> grains         sand leaving the funnel joins them
//   path segments ──instanced──> light (+=)      the LED's path is added to the exposure
//   grains ──points──> sand                       the sand drawn into a density texture
//   light ──down ×5, up ×4──> bloom               the glow of an overexposed light trail
//   light + bloom + sand ──composite──> screen    the camera's view
//
// The light texture is the photograph: it is only ever added to, until a new exposure.

import * as S from './shaders'

type Uniforms = Record<string, WebGLUniformLocation | null>

interface Program {
  prog: WebGLProgram
  u: Uniforms
}

interface Target {
  tex: WebGLTexture
  fbo: WebGLFramebuffer
  w: number
  h: number
}

export interface SandStep {
  dt: number
  drive: number
  mode: [number, number, number]
  modeOld: [number, number, number]
  modeMix: number
  seed: number
}

export interface CompositeParams {
  layers: [number, number, number, number]
  funnel: [number, number]
  led: [number, number, number]
  mode: [number, number, number]
  modeOld: [number, number, number]
  modeMix: number
  drive: number
  room: number
  grain: number
  time: number
}

/** Floats per grain: x, y, liveliness, alive */
const GRAIN = 4
/** Floats per light segment: ax, ay, bx, by, r, g, b, seconds */
export const SEGMENT = 8
const SEGMENT_CAPACITY = 4096
const BLOOM_LEVELS = 5

/** How far the simulation textures reach, in plate units (the plate is -1..1) */
export const EXTENT = 1.1

function compile(gl: WebGL2RenderingContext, type: number, source: string) {
  const shader = gl.createShader(type)
  if (!shader) throw new Error('createShader failed')
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS) && !gl.isContextLost()) {
    const log = gl.getShaderInfoLog(shader)
    gl.deleteShader(shader)
    throw new Error(`Shader did not compile: ${log}`)
  }
  return shader
}

function link(gl: WebGL2RenderingContext, vsSrc: string, fsSrc: string, varyings?: string[]) {
  const vs = compile(gl, gl.VERTEX_SHADER, vsSrc)
  const fs = compile(gl, gl.FRAGMENT_SHADER, fsSrc)
  const prog = gl.createProgram()
  if (!prog) throw new Error('createProgram failed')
  gl.attachShader(prog, vs)
  gl.attachShader(prog, fs)
  if (varyings) gl.transformFeedbackVaryings(prog, varyings, gl.INTERLEAVED_ATTRIBS)
  gl.linkProgram(prog)
  gl.deleteShader(vs)
  gl.deleteShader(fs)
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS) && !gl.isContextLost()) {
    throw new Error(`Program did not link: ${gl.getProgramInfoLog(prog)}`)
  }
  const u: Uniforms = {}
  const count = gl.getProgramParameter(prog, gl.ACTIVE_UNIFORMS) as number
  for (let i = 0; i < count; i++) {
    const info = gl.getActiveUniform(prog, i)
    if (info) u[info.name] = gl.getUniformLocation(prog, info.name)
  }
  return { prog, u }
}

export class Renderer {
  readonly gl: WebGL2RenderingContext
  readonly simSize: number
  readonly maxGrains: number
  /** Whether light and sand get half-float textures (true almost everywhere) */
  readonly hdr: boolean

  private update: Program
  private sandDraw: Program
  private light: Program
  private down: Program
  private up: Program
  private comp: Program

  private grainBuf: WebGLBuffer[] = []
  private grainVao: WebGLVertexArrayObject[] = []
  private tf: WebGLTransformFeedback
  private src = 0
  /** Slots that hold a grain (or did): what each step runs over */
  used = 0
  /** Next slot to fill; wraps, so the oldest grain makes way once the plate is full */
  private head = 0

  private segBuf: WebGLBuffer
  private segVao: WebGLVertexArrayObject
  private emptyVao: WebGLVertexArrayObject

  private lightT: Target
  private sandT: Target
  private blooms: Target[] = []

  /** Scale on everything written to the light texture (smaller where it is only 8 bits) */
  readonly lightUnit: number
  /** What one grain adds to the sand texture */
  readonly sandUnit: number

  constructor(gl: WebGL2RenderingContext, simSize: number, maxGrains: number) {
    this.gl = gl
    this.simSize = simSize
    this.maxGrains = maxGrains

    const floatExt =
      gl.getExtension('EXT_color_buffer_float') || gl.getExtension('EXT_color_buffer_half_float')
    let hdr = !!floatExt
    if (hdr) {
      // Some drivers list the extension but can't render to a half-float target after all
      const probe = this.target(4, 4, true)
      gl.bindFramebuffer(gl.FRAMEBUFFER, probe.fbo)
      hdr = gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE
      gl.bindFramebuffer(gl.FRAMEBUFFER, null)
      this.deleteTarget(probe)
    }
    this.hdr = hdr
    this.lightUnit = hdr ? 1 : 0.2
    this.sandUnit = hdr ? 1 : 1 / 24

    this.update = link(gl, S.SAND_UPDATE_VS, S.DISCARD_FS, ['v_grain'])
    this.sandDraw = link(gl, S.SAND_DRAW_VS, S.SAND_DRAW_FS)
    this.light = link(gl, S.LIGHT_VS, S.LIGHT_FS)
    this.down = link(gl, S.FULLSCREEN_VS, S.DOWN_FS)
    this.up = link(gl, S.FULLSCREEN_VS, S.UP_FS)
    this.comp = link(gl, S.FULLSCREEN_VS, S.COMPOSITE_FS)

    // Two copies of every grain, read from one and written to the other in turn
    for (let i = 0; i < 2; i++) {
      const buf = gl.createBuffer()
      const vao = gl.createVertexArray()
      if (!buf || !vao) throw new Error('Out of buffers')
      gl.bindVertexArray(vao)
      gl.bindBuffer(gl.ARRAY_BUFFER, buf)
      gl.bufferData(gl.ARRAY_BUFFER, maxGrains * GRAIN * 4, gl.DYNAMIC_COPY)
      gl.enableVertexAttribArray(0)
      gl.vertexAttribPointer(0, 4, gl.FLOAT, false, GRAIN * 4, 0)
      this.grainBuf.push(buf)
      this.grainVao.push(vao)
    }
    gl.bindVertexArray(null)
    gl.bindBuffer(gl.ARRAY_BUFFER, null)
    const tf = gl.createTransformFeedback()
    if (!tf) throw new Error('No transform feedback')
    this.tf = tf

    const segBuf = gl.createBuffer()
    const segVao = gl.createVertexArray()
    const emptyVao = gl.createVertexArray()
    if (!segBuf || !segVao || !emptyVao) throw new Error('Out of buffers')
    gl.bindVertexArray(segVao)
    gl.bindBuffer(gl.ARRAY_BUFFER, segBuf)
    gl.bufferData(gl.ARRAY_BUFFER, SEGMENT_CAPACITY * SEGMENT * 4, gl.DYNAMIC_DRAW)
    gl.enableVertexAttribArray(0)
    gl.vertexAttribPointer(0, 4, gl.FLOAT, false, SEGMENT * 4, 0)
    gl.vertexAttribDivisor(0, 1)
    gl.enableVertexAttribArray(1)
    gl.vertexAttribPointer(1, 4, gl.FLOAT, false, SEGMENT * 4, 16)
    gl.vertexAttribDivisor(1, 1)
    gl.bindVertexArray(null)
    gl.bindBuffer(gl.ARRAY_BUFFER, null)
    this.segBuf = segBuf
    this.segVao = segVao
    this.emptyVao = emptyVao

    this.lightT = this.target(simSize, simSize, hdr)
    this.sandT = this.target(simSize, simSize, hdr)
    let size = simSize
    for (let i = 0; i < BLOOM_LEVELS; i++) {
      size = Math.max(8, size >> 1)
      this.blooms.push(this.target(size, size, hdr))
    }
    this.clearLight()
  }

  private target(w: number, h: number, hdr: boolean): Target {
    const gl = this.gl
    const tex = gl.createTexture()
    const fbo = gl.createFramebuffer()
    if (!tex || !fbo) throw new Error('Out of textures')
    gl.bindTexture(gl.TEXTURE_2D, tex)
    if (hdr) gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA16F, w, h, 0, gl.RGBA, gl.HALF_FLOAT, null)
    else gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, null)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo)
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0)
    gl.bindFramebuffer(gl.FRAMEBUFFER, null)
    gl.bindTexture(gl.TEXTURE_2D, null)
    return { tex, fbo, w, h }
  }

  private deleteTarget(t: Target) {
    this.gl.deleteTexture(t.tex)
    this.gl.deleteFramebuffer(t.fbo)
  }

  private bindTarget(t: Target | null) {
    const gl = this.gl
    gl.bindFramebuffer(gl.FRAMEBUFFER, t ? t.fbo : null)
    if (t) gl.viewport(0, 0, t.w, t.h)
    else gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight)
  }

  private fullscreen() {
    const gl = this.gl
    gl.bindVertexArray(this.emptyVao)
    gl.drawArrays(gl.TRIANGLES, 0, 3)
    gl.bindVertexArray(null)
  }

  /** Start a new photograph */
  clearLight() {
    const gl = this.gl
    this.bindTarget(this.lightT)
    gl.clearColor(0, 0, 0, 0)
    gl.clear(gl.COLOR_BUFFER_BIT)
    for (const b of this.blooms) {
      this.bindTarget(b)
      gl.clear(gl.COLOR_BUFFER_BIT)
    }
    this.bindTarget(null)
  }

  /** Sweep the plate */
  clearSand() {
    this.used = 0
    this.head = 0
  }

  /** New grains (GRAIN floats each) onto the plate */
  spawn(data: Float32Array, count: number) {
    if (count <= 0) return
    const gl = this.gl
    gl.bindBuffer(gl.ARRAY_BUFFER, this.grainBuf[this.src])
    let from = 0
    let left = count
    while (left > 0) {
      const k = Math.min(left, this.maxGrains - this.head)
      gl.bufferSubData(gl.ARRAY_BUFFER, this.head * GRAIN * 4, data, from * GRAIN, k * GRAIN)
      this.head = (this.head + k) % this.maxGrains
      this.used = Math.min(this.maxGrains, this.used + k)
      from += k
      left -= k
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, null)
  }

  /** Every grain takes one step */
  stepSand(s: SandStep, jitter: number, drift: number, threshold: number) {
    if (!this.used) return
    const gl = this.gl
    const { prog, u } = this.update
    gl.useProgram(prog)
    gl.uniform1f(u.u_dt, s.dt)
    gl.uniform1f(u.u_drive, s.drive)
    gl.uniform3fv(u.u_mode, s.mode)
    gl.uniform3fv(u.u_modeOld, s.modeOld)
    gl.uniform1f(u.u_modeMix, s.modeMix)
    gl.uniform1ui(u.u_seed, s.seed >>> 0)
    gl.uniform1f(u.u_jitter, jitter)
    gl.uniform1f(u.u_drift, drift)
    gl.uniform1f(u.u_threshold, threshold)

    gl.bindVertexArray(this.grainVao[this.src])
    gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, this.tf)
    gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 0, this.grainBuf[1 - this.src])
    gl.enable(gl.RASTERIZER_DISCARD)
    gl.beginTransformFeedback(gl.POINTS)
    gl.drawArrays(gl.POINTS, 0, this.used)
    gl.endTransformFeedback()
    gl.disable(gl.RASTERIZER_DISCARD)
    gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 0, null)
    gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, null)
    gl.bindVertexArray(null)
    this.src = 1 - this.src
  }

  /** Add the LED's path to the exposure. sigma is the blur spot's size in plate units */
  drawLight(data: Float32Array, count: number, sigma: number) {
    if (count <= 0) return
    const gl = this.gl
    this.bindTarget(this.lightT)
    gl.enable(gl.BLEND)
    gl.blendFunc(gl.ONE, gl.ONE)
    const { prog, u } = this.light
    gl.useProgram(prog)
    gl.uniform1f(u.u_sigma, sigma)
    gl.uniform1f(u.u_extent, EXTENT)
    gl.bindVertexArray(this.segVao)
    gl.bindBuffer(gl.ARRAY_BUFFER, this.segBuf)
    for (let from = 0; from < count; from += SEGMENT_CAPACITY) {
      const k = Math.min(SEGMENT_CAPACITY, count - from)
      gl.bufferSubData(gl.ARRAY_BUFFER, 0, data, from * SEGMENT, k * SEGMENT)
      gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0, 4, k)
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, null)
    gl.bindVertexArray(null)
    gl.disable(gl.BLEND)
    this.bindTarget(null)
  }

  /** Draw every grain into the sand texture */
  renderSand(pointSize: number) {
    const gl = this.gl
    this.bindTarget(this.sandT)
    gl.clearColor(0, 0, 0, 0)
    gl.clear(gl.COLOR_BUFFER_BIT)
    if (this.used) {
      gl.enable(gl.BLEND)
      gl.blendFunc(gl.ONE, gl.ONE)
      const { prog, u } = this.sandDraw
      gl.useProgram(prog)
      gl.uniform1f(u.u_extent, EXTENT)
      gl.uniform1f(u.u_pointSize, pointSize)
      gl.uniform1f(u.u_unit, this.sandUnit)
      gl.bindVertexArray(this.grainVao[this.src])
      gl.drawArrays(gl.POINTS, 0, this.used)
      gl.bindVertexArray(null)
      gl.disable(gl.BLEND)
    }
    this.bindTarget(null)
  }

  /** The glow around bright light, from five progressively smaller copies of the exposure */
  bloom() {
    const gl = this.gl
    let src = this.lightT
    gl.useProgram(this.down.prog)
    gl.activeTexture(gl.TEXTURE0)
    gl.uniform1i(this.down.u.u_src, 0)
    for (const dst of this.blooms) {
      this.bindTarget(dst)
      gl.bindTexture(gl.TEXTURE_2D, src.tex)
      gl.uniform2f(this.down.u.u_texel, 1 / src.w, 1 / src.h)
      this.fullscreen()
      src = dst
    }
    gl.useProgram(this.up.prog)
    gl.uniform1i(this.up.u.u_src, 0)
    gl.uniform1f(this.up.u.u_weight, 1)
    gl.enable(gl.BLEND)
    gl.blendFunc(gl.ONE, gl.ONE)
    for (let i = this.blooms.length - 1; i > 0; i--) {
      const from = this.blooms[i]
      this.bindTarget(this.blooms[i - 1])
      gl.bindTexture(gl.TEXTURE_2D, from.tex)
      gl.uniform2f(this.up.u.u_texel, 1 / from.w, 1 / from.h)
      this.fullscreen()
    }
    gl.disable(gl.BLEND)
    gl.bindTexture(gl.TEXTURE_2D, null)
    this.bindTarget(null)
  }

  /** The camera's view, to the canvas or (for a saved photograph) to a target */
  composite(c: CompositeParams, exposure: number, bloomGain: number, target: Target | null = null) {
    const gl = this.gl
    this.bindTarget(target)
    const { prog, u } = this.comp
    gl.useProgram(prog)
    gl.activeTexture(gl.TEXTURE0)
    gl.bindTexture(gl.TEXTURE_2D, this.lightT.tex)
    gl.activeTexture(gl.TEXTURE1)
    gl.bindTexture(gl.TEXTURE_2D, this.blooms[0].tex)
    gl.activeTexture(gl.TEXTURE2)
    gl.bindTexture(gl.TEXTURE_2D, this.sandT.tex)
    gl.uniform1i(u.u_light, 0)
    gl.uniform1i(u.u_bloom, 1)
    gl.uniform1i(u.u_sand, 2)
    const outW = target ? target.w : gl.drawingBufferWidth
    gl.uniform2f(u.u_simTexel, 1 / this.simSize, 1 / this.simSize)
    gl.uniform1f(u.u_pixel, (2 * EXTENT) / outW)
    gl.uniform1f(u.u_extent, EXTENT)
    gl.uniform1f(u.u_exposure, exposure / this.lightUnit)
    gl.uniform1f(u.u_bloomGain, bloomGain)
    gl.uniform1f(u.u_sandUnit, this.sandUnit)
    gl.uniform4fv(u.u_layers, c.layers)
    gl.uniform2fv(u.u_funnel, c.funnel)
    gl.uniform3fv(u.u_led, c.led)
    gl.uniform3fv(u.u_mode, c.mode)
    gl.uniform3fv(u.u_modeOld, c.modeOld)
    gl.uniform1f(u.u_modeMix, c.modeMix)
    gl.uniform1f(u.u_drive, c.drive)
    gl.uniform1f(u.u_room, c.room)
    gl.uniform1f(u.u_grain, c.grain)
    gl.uniform1f(u.u_time, c.time)
    this.fullscreen()
    for (const unit of [gl.TEXTURE2, gl.TEXTURE1, gl.TEXTURE0]) {
      gl.activeTexture(unit)
      gl.bindTexture(gl.TEXTURE_2D, null)
    }
    this.bindTarget(null)
  }

  /** The camera's view at size × size, without the funnel, as RGBA bytes (bottom row first) */
  snapshot(size: number, c: CompositeParams, exposure: number, bloomGain: number) {
    const gl = this.gl
    const t = this.target(size, size, false)
    this.composite(c, exposure, bloomGain, t)
    const pixels = new Uint8Array(size * size * 4)
    gl.bindFramebuffer(gl.FRAMEBUFFER, t.fbo)
    gl.readPixels(0, 0, size, size, gl.RGBA, gl.UNSIGNED_BYTE, pixels)
    gl.bindFramebuffer(gl.FRAMEBUFFER, null)
    this.deleteTarget(t)
    return pixels
  }

  dispose() {
    const gl = this.gl
    if (gl.isContextLost()) return
    for (const p of [this.update, this.sandDraw, this.light, this.down, this.up, this.comp]) {
      gl.deleteProgram(p.prog)
    }
    for (const b of this.grainBuf) gl.deleteBuffer(b)
    for (const v of this.grainVao) gl.deleteVertexArray(v)
    gl.deleteTransformFeedback(this.tf)
    gl.deleteBuffer(this.segBuf)
    gl.deleteVertexArray(this.segVao)
    gl.deleteVertexArray(this.emptyVao)
    for (const t of [this.lightT, this.sandT, ...this.blooms]) this.deleteTarget(t)
  }
}
