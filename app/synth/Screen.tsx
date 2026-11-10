'use client'

import { useEffect, useRef } from 'react'
import { STEPS, cutoffHz, type ArpMode, type Pattern, type SynthEngine, type Wave } from './engine'
import { KNOBS, WAVES, noteName, type KnobKey, type Settings } from './params'
import styles from './synth.module.css'

/** A finger moving on a held pad */
export interface Expression {
  /** The pitch bend of the last two seconds: (time in ms, cents) pairs, oldest first */
  trail: number[]
  /** 0..1, how far the note is being pushed into the reverb right now */
  amount: number
}

/** Everything the screen draws from. The synth keeps it up to date; the screen reads it each frame. */
export interface ScreenState {
  settings: Settings
  pattern: Pattern
  preset: string | undefined
  playing: boolean
  recording: boolean
  /** The step the next recorded note lands on while stopped */
  cursor: number
  arp: boolean
  arpMode: ArpMode
  expression: Expression
  /** The control last moved and when (performance.now), so its page can be shown for a moment */
  focus: { key: KnobKey | 'wave' | 'touch'; at: number } | null
}

// How long a control's page stays up after it was last moved, and how long it takes to fade
const PAGE_HOLD = 1400
const PAGE_FADE = 350
const BOOT = 900
// How much of a finger's recent movement the expression page shows
const TRAIL_MS = 1500
// With nothing sounding and nothing changing for this long, the screen stops redrawing.
// A canvas repainted sixty times a second for no reason is a phone battery being emptied.
const IDLE_AFTER = 700
// A frame that takes longer than this to draw is a slow one; this many in a row and the glow
// around the lines, the most expensive thing drawn, is dropped for the rest of the visit
const SLOW_FRAME_MS = 9
const SLOW_FRAMES = 20
// The width the screen was designed at. Narrower canvases get less room, not smaller text.
const DESIGN_WIDTH = 320
const STATUS_HEIGHT = 30

const ARP_GLYPH: Record<ArpMode, string> = { up: '↑', down: '↓', updown: '↕', random: '?' }

// The screen is whatever size the layout gives it, from a wide strip on a phone to a near
// square on a desktop, so where things go is worked out from the size rather than fixed.
function arrange(width: number, height: number) {
  const pad = width < 250 ? 10 : 14
  // The pattern along the bottom, where there is room for it under the main area
  const strip = height >= 236 ? Math.min(96, Math.max(72, height * 0.3)) : 0
  const main = { top: STATUS_HEIGHT + 1, bottom: height - strip }
  // A control's name and value stack up large when the main area is tall enough
  const tall = main.bottom - main.top >= 150
  return {
    width,
    height,
    pad,
    main,
    tall,
    graph: {
      left: pad,
      right: width - pad,
      top: main.top + (tall ? 72 : 34),
      bottom: main.bottom - 8,
    },
    pattern: strip ? { top: main.bottom + 20, bottom: height - 10 } : null,
  }
}

const wave = (type: Wave, phase: number) => {
  const p = phase - Math.floor(phase)
  switch (type) {
    case 'sine':
      return Math.sin(p * Math.PI * 2)
    case 'triangle':
      return p < 0.25 ? p * 4 : p < 0.75 ? 2 - p * 4 : p * 4 - 4
    case 'sawtooth':
      return 2 * ((p + 0.5) % 1) - 1
    default:
      return p < 0.5 ? 1 : -1
  }
}

// How much a low-pass filter lets through at one frequency, in dB. The same maths the
// browser's BiquadFilterNode runs (the "Audio EQ Cookbook" low-pass), worked out by hand so
// the curve can be drawn for any setting without an audio node.
function lowpassDb(freq: number, cutoff: number, resonanceDb: number, sampleRate = 48000) {
  const w0 = (2 * Math.PI * Math.min(cutoff, sampleRate * 0.49)) / sampleRate
  const alpha = Math.sin(w0) / (2 * Math.pow(10, resonanceDb / 20))
  const cos = Math.cos(w0)
  const b = [(1 - cos) / 2, 1 - cos, (1 - cos) / 2]
  const a = [1 + alpha, -2 * cos, 1 - alpha]
  const w = (2 * Math.PI * freq) / sampleRate
  const mag = (c: number[]) => {
    const re = c[0] + c[1] * Math.cos(w) + c[2] * Math.cos(2 * w)
    const im = c[1] * Math.sin(w) + c[2] * Math.sin(2 * w)
    return Math.hypot(re, im)
  }
  return 20 * Math.log10(mag(b) / mag(a) + 1e-9)
}

interface Props {
  engine: SynthEngine
  state: React.RefObject<ScreenState>
}

export default function Screen({ engine, state }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const g = canvas?.getContext('2d')
    if (!canvas || !g) return

    const css = getComputedStyle(canvas)
    const mono = css.fontFamily
    const lime = css.getPropertyValue('--ed-signal').trim() || '#d7ff3d'
    const cyan = css.getPropertyValue('--ed-cyan').trim() || '#3cc8ff'
    const red = '#ff4d6d'
    const white = (alpha: number) => `rgba(255, 255, 255, ${alpha})`
    const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const touch = window.matchMedia('(hover: none)').matches

    let frame = 0
    // Canvas pixels per unit the drawing code works in
    let scale = 1
    let lay = arrange(DESIGN_WIDTH, 300)
    let samples: Float32Array<ArrayBuffer> | null = null
    let spectrum: Uint8Array<ArrayBuffer> | null = null
    let drawn: ScreenState | null = null
    let resized = true
    let lastBusy = performance.now()
    let slowFrames = 0
    let glow = true
    const started = performance.now()

    const resize = () => {
      const width = canvas.clientWidth
      const height = canvas.clientHeight
      if (!width || !height) return
      const dpr = Math.min(window.devicePixelRatio || 1, 2.5)
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      // Text grows a little on a big screen and never shrinks below nine tenths of its size
      const zoom = Math.min(1.6, Math.max(0.9, width / DESIGN_WIDTH))
      scale = dpr * zoom
      lay = arrange(width / zoom, height / zoom)
      resized = true
    }
    const observer = new ResizeObserver(resize)
    observer.observe(canvas)
    resize()
    // Text drawn before the web font arrived is in the fallback font, and an idle screen is
    // not redrawn: draw it again once the fonts are in
    document.fonts?.ready.then(() => {
      resized = true
    })

    const text = (
      value: string,
      x: number,
      y: number,
      size: number,
      color: string,
      align: CanvasTextAlign = 'left',
      weight = 500
    ) => {
      g.font = `${weight} ${size}px ${mono}`
      g.textAlign = align
      g.fillStyle = color
      g.fillText(value, x, y)
      return g.measureText(value).width
    }

    const glowLine = (color: string, width: number, trace: () => void) => {
      g.lineJoin = 'round'
      g.lineCap = 'round'
      g.strokeStyle = color
      g.shadowColor = color
      g.shadowBlur = glow ? 10 * scale : 0
      g.lineWidth = width
      g.beginPath()
      trace()
      g.stroke()
      g.shadowBlur = 0
    }

    // ------------------------------------------------------------------ what is playing
    const drawScope = (analyser: AnalyserNode | null, data: Float32Array | null) => {
      const { main, width } = lay
      const mid = (main.top + main.bottom) / 2
      const half = (main.bottom - main.top) / 2 - 2

      g.strokeStyle = white(0.1)
      g.lineWidth = 1
      g.beginPath()
      g.moveTo(0, mid)
      g.lineTo(width, mid)
      g.stroke()

      if (!analyser || !data) {
        text(touch ? 'TAP A PAD' : 'PRESS A KEY', width / 2, mid - 10, 10, white(0.62), 'center')
        // The one thing nobody would guess
        if (half > 34) {
          const more = touch ? 'THEN WIGGLE YOUR FINGER ON IT' : 'OR HOLD A PAD AND WIGGLE'
          text(more, width / 2, mid + 18, 8, white(0.6), 'center')
        }
        return
      }

      // Spectrum, faint, behind the trace: bars from 40 Hz to 14 kHz on a log scale
      if (!spectrum || spectrum.length !== analyser.frequencyBinCount) {
        spectrum = new Uint8Array(analyser.frequencyBinCount)
      }
      analyser.getByteFrequencyData(spectrum)
      const hzPerBin = analyser.context.sampleRate / analyser.fftSize
      const bars = Math.round(width / 7.3)
      const alpha = g.globalAlpha
      g.globalAlpha = alpha * 0.22
      g.fillStyle = cyan
      for (let i = 0; i < bars; i++) {
        const freq = 40 * Math.pow(14000 / 40, i / (bars - 1))
        const level = spectrum[Math.min(spectrum.length - 1, Math.round(freq / hzPerBin))] / 255
        const height = level * level * half * 1.7
        g.fillRect((i / bars) * width + 1, main.bottom - height, width / bars - 2, height)
      }
      g.globalAlpha = alpha

      // Start each frame where the wave crosses zero going up. Without this the picture
      // starts at a random point in the wave every frame and the trace jitters sideways.
      const shown = data.length / 2
      let start = 0
      for (let i = 1; i < shown; i++) {
        if (data[i - 1] < 0 && data[i] >= 0) {
          start = i
          break
        }
      }
      glowLine(lime, 1.6, () => {
        for (let i = 0; i < shown; i++) {
          const x = (i / (shown - 1)) * width
          const y = mid - Math.max(-1, Math.min(1, data[start + i])) * half * 0.92
          if (i === 0) g.moveTo(x, y)
          else g.lineTo(x, y)
        }
      })
    }

    // ------------------------------------------------- the control being moved, as a picture
    const drawWavePage = (s: Settings, now: number) => {
      const { graph } = lay
      const mid = (graph.top + graph.bottom) / 2
      const half = (graph.bottom - graph.top) / 2 - 4
      const width = graph.right - graph.left
      const trace = (offset: number) => () => {
        for (let i = 0; i <= width; i++) {
          const y = mid - wave(s.wave, (i / width) * 2.5 + offset) * half
          if (i === 0) g.moveTo(graph.left + i, y)
          else g.lineTo(graph.left + i, y)
        }
      }
      // The second oscillator, drifting against the first at the speed they beat at
      if (s.detune > 0) glowLine(cyan, 1.2, trace(calm ? 0.12 : (now / 1000) * s.detune * 0.05))
      glowLine(lime, 1.8, trace(0))
    }

    const drawFilterPage = (s: Settings, now: number) => {
      const { graph } = lay
      const width = graph.right - graph.left
      const height = graph.bottom - graph.top
      const yOf = (db: number) => graph.top + ((24 - db) / 60) * height
      const curve = (cutoff: number) => () => {
        for (let i = 0; i <= width; i += 2) {
          const freq = 20 * Math.pow(1000, i / width) // 20 Hz to 20 kHz
          const db = Math.max(-36, Math.min(24, lowpassDb(freq, cutoff, s.resonance)))
          if (i === 0) g.moveTo(graph.left + i, yOf(db))
          else g.lineTo(graph.left + i, yOf(db))
        }
      }

      g.strokeStyle = white(0.12)
      g.lineWidth = 1
      g.beginPath()
      g.moveTo(graph.left, yOf(0))
      g.lineTo(graph.right, yOf(0))
      g.stroke()

      const base = cutoffHz(s.cutoff)
      // Where the envelope throws the filter open to at the start of each note
      if (s.envAmount > 0.01) {
        g.setLineDash([3, 4])
        g.strokeStyle = white(0.4)
        g.lineWidth = 1.2
        g.beginPath()
        curve(base * Math.pow(2, s.envAmount * 4))()
        g.stroke()
        g.setLineDash([])
      }
      // The curve itself, swaying with the LFO at its real rate and depth
      const sway = calm ? 0 : Math.sin((now / 1000) * s.lfoRate * Math.PI * 2) * s.lfoDepth * 2
      glowLine(lime, 1.8, curve(base * Math.pow(2, sway)))
    }

    const drawEnvPage = (s: Settings, key: string) => {
      const { graph } = lay
      const width = graph.right - graph.left
      const lettered = graph.bottom - graph.top > 44
      const top = graph.top + (lettered ? 12 : 2)
      const height = graph.bottom - top
      // Square roots so a 5 ms attack is still visible next to a 4 second release
      const raw = [
        0.12 + Math.sqrt(s.attack / 2),
        0.12 + Math.sqrt(s.decay / 2),
        0.45,
        0.12 + Math.sqrt(s.release / 4),
      ]
      const total = raw.reduce((sum, n) => sum + n, 0)
      const xs = [graph.left]
      raw.forEach((n) => xs.push(xs[xs.length - 1] + (n / total) * width))
      const hold = graph.bottom - height * s.sustain
      const ys = [graph.bottom, top, hold, hold, graph.bottom]
      const lit = ['attack', 'decay', 'sustain', 'release'].indexOf(key)

      g.fillStyle = white(0.06)
      g.beginPath()
      xs.forEach((x, i) => (i === 0 ? g.moveTo(x, ys[i]) : g.lineTo(x, ys[i])))
      g.fill()

      for (let i = 0; i < 4; i++) {
        const segment = () => {
          g.moveTo(xs[i], ys[i])
          g.lineTo(xs[i + 1], ys[i + 1])
        }
        if (i === lit) {
          glowLine(lime, 2.4, segment)
        } else {
          g.strokeStyle = white(0.55)
          g.lineWidth = 1.4
          g.beginPath()
          segment()
          g.stroke()
        }
        if (lettered) {
          const x = (xs[i] + xs[i + 1]) / 2
          text('ADSR'[i], x, graph.top + 6, 8, white(i === lit ? 0.95 : 0.6), 'center')
        }
      }
    }

    const drawBarPage = (position: number, key: string, s: Settings, now: number) => {
      const { graph, tall, main } = lay
      const y = (graph.top + graph.bottom) / 2
      const width = graph.right - graph.left
      g.fillStyle = white(0.12)
      g.fillRect(graph.left, y - 3, width, 6)
      g.fillStyle = white(0.92)
      g.fillRect(graph.left, y - 3, width * position, 6)
      if (key === 'tempo' && !calm) {
        // A dot that blinks on the beat at the tempo being dialled in
        const beat = ((now / 1000) * s.tempo) / 60
        g.globalAlpha *= 1 - (beat - Math.floor(beat))
        g.fillStyle = lime
        g.beginPath()
        g.arc(graph.right - 6, tall ? main.top + 30 : y - 14, 4.5, 0, Math.PI * 2)
        g.fill()
      }
    }

    // A finger on a pad: the bend it has drawn over the last moment, newest at the right,
    // over a band that swells with how much of the note is going to the reverb
    const drawTouchPage = (st: ScreenState, now: number) => {
      const { graph } = lay
      const mid = (graph.top + graph.bottom) / 2
      const half = (graph.bottom - graph.top) / 2 - 3
      const width = graph.right - graph.left
      const { trail, amount } = st.expression

      if (amount > 0.01) {
        const alpha = g.globalAlpha
        g.globalAlpha = alpha * (0.12 + amount * 0.28)
        g.fillStyle = cyan
        g.fillRect(graph.left, mid - half * amount, width, half * amount * 2)
        g.globalAlpha = alpha
      }
      g.strokeStyle = white(0.12)
      g.lineWidth = 1
      g.beginPath()
      g.moveTo(graph.left, mid)
      g.lineTo(graph.right, mid)
      g.stroke()

      glowLine(lime, 1.8, () => {
        let drawing = false
        for (let i = 0; i < trail.length; i += 2) {
          const age = now - trail[i]
          if (age > TRAIL_MS) continue
          const x = graph.right - (age / TRAIL_MS) * width
          const y = mid - (trail[i + 1] / 100) * half
          if (drawing) g.lineTo(x, y)
          else g.moveTo(x, y)
          drawing = true
        }
      })
    }

    // The control's name and value: stacked and large where there is room, on one line where not
    const heading = (name: string, value: string) => {
      const { main, pad, width, tall } = lay
      if (tall) {
        text(name, pad, main.top + 25, 9, white(0.62))
        text(value, pad, main.top + 57, 28, white(0.96), 'left', 600)
      } else {
        text(name, pad, main.top + 21, 9, white(0.62))
        text(value, width - pad, main.top + 23, 17, white(0.96), 'right', 600)
      }
    }

    const drawPage = (st: ScreenState, now: number) => {
      const key = st.focus!.key
      const s = st.settings
      const room = lay.graph.bottom - lay.graph.top >= 16
      if (key === 'touch') {
        const trail = st.expression.trail
        const cents = Math.round(trail.length ? trail[trail.length - 1] : 0)
        heading('BEND', `${cents > 0 ? '+' : cents < 0 ? '−' : ''}${Math.abs(cents)} ct`)
        if (room) drawTouchPage(st, now)
        return
      }
      if (key === 'wave') {
        heading('WAVEFORM', WAVES.find((w) => w.id === s.wave)!.label.toUpperCase())
        if (room) drawWavePage(s, now)
        return
      }
      const def = KNOBS.find((k) => k.key === key)!
      const value = s[key]
      heading(def.name.toUpperCase(), def.format(value))
      if (!room) return
      if (def.page === 'wave') drawWavePage(s, now)
      else if (def.page === 'filter') drawFilterPage(s, now)
      else if (def.page === 'env') drawEnvPage(s, key)
      else drawBarPage((value - def.min) / (def.max - def.min), key, s, now)
    }

    // ------------------------------------------------------------------------- the pattern
    const drawPattern = (st: ScreenState, area: { top: number; bottom: number }) => {
      const { pad, width } = lay
      const column = (width - pad * 2) / STEPS
      const notes = st.pattern.filter((n): n is number => n !== null)
      const low = notes.length ? Math.min(...notes) : 48
      const high = Math.max(notes.length ? Math.max(...notes) : 60, low + 7)
      const current = engine.currentStep()
      const lane = area.bottom - area.top - 16

      for (let i = 0; i < STEPS; i++) {
        const x = pad + i * column
        if (i === current) {
          g.fillStyle = white(0.12)
          g.fillRect(x, area.top, column - 1, area.bottom - area.top)
        } else if (i % 4 === 0) {
          g.fillStyle = white(0.045)
          g.fillRect(x, area.top, column - 1, area.bottom - area.top)
        }
        if (st.recording && !st.playing && i === st.cursor) {
          g.strokeStyle = red
          g.lineWidth = 1
          g.strokeRect(x + 0.5, area.top + 0.5, column - 2, area.bottom - area.top - 1)
        }
        const midi = st.pattern[i]
        if (midi === null) {
          g.fillStyle = white(0.18)
          g.fillRect(x + column / 2 - 1.5, area.bottom - 5, 2, 2)
          continue
        }
        const y = area.bottom - 12 - ((midi - low) / (high - low)) * lane
        if (i === current && glow) {
          g.shadowColor = lime
          g.shadowBlur = 8 * scale
        }
        g.fillStyle = i === current ? lime : white(0.85)
        g.fillRect(x + 1.5, y, column - 4, 5)
        g.shadowBlur = 0
      }

      const sounding = current >= 0 ? st.pattern[current] : null
      const label = sounding !== null ? noteName(sounding) : st.playing ? '·' : 'PATTERN'
      text(label, pad, area.top - 6, 8, white(0.6))
      text(`${notes.length}/${STEPS}`, width - pad, area.top - 6, 8, white(0.6), 'right')
    }

    const drawStatus = (st: ScreenState) => {
      const { pad, width } = lay
      const y = 21
      const tempo = `${Math.round(st.settings.tempo)} BPM`
      const left = pad + text((st.preset ?? 'Custom').toUpperCase(), pad, y, 9, white(0.9)) + 12
      const right = width - pad - text(tempo, width - pad, y, 9, white(0.62), 'right') - 10

      // What is switched on, spelled out where it fits and as symbols where it does not
      const flags: [long: string, short: string, color: string][] = []
      if (st.playing) flags.push(['▶ PLAY', '▶', lime])
      if (st.recording) flags.push(['● REC', '●', red])
      if (st.arp) flags.push([`ARP ${ARP_GLYPH[st.arpMode]}`, `A${ARP_GLYPH[st.arpMode]}`, cyan])
      g.font = `500 9px ${mono}`
      const widthOf = (which: 0 | 1) =>
        flags.reduce((sum, flag) => sum + g.measureText(flag[which]).width + 10, 0)
      const which = left + widthOf(0) <= right ? 0 : 1
      if (left + widthOf(which) > right) return
      let x = left
      for (const flag of flags) x += text(flag[which], x, y, 9, flag[2]) + 10
    }

    // --------------------------------------------------------------------------- one frame
    const draw = () => {
      frame = requestAnimationFrame(draw)
      const st = state.current
      const now = performance.now()

      // Reading the analyser is cheap; it is how the screen knows whether to wake up
      const analyser = engine.analyser
      let sounding = false
      if (analyser) {
        if (!samples || samples.length !== analyser.fftSize) {
          samples = new Float32Array(analyser.fftSize)
        }
        analyser.getFloatTimeDomainData(samples)
        for (let i = 0; i < samples.length; i += 8) {
          if (Math.abs(samples[i]) > 0.0015) {
            sounding = true
            break
          }
        }
      }

      const age = st.focus ? now - st.focus.at : Infinity
      const paging = age < PAGE_HOLD + PAGE_FADE
      const booting = now - started < BOOT
      if (sounding || st.playing || paging || booting || resized || st !== drawn) lastBusy = now
      if (now - lastBusy > IDLE_AFTER) return
      drawn = st
      resized = false

      const { width, height, main } = lay
      g.setTransform(scale, 0, 0, scale, 0, 0)
      g.globalAlpha = 1
      g.fillStyle = '#05060a'
      g.fillRect(0, 0, width, height)
      g.textBaseline = 'alphabetic'

      // Power-on: the picture opens out from a horizontal line
      const boot = calm ? 1 : Math.min(1, (now - started) / BOOT)
      if (boot < 1) {
        const open = 1 - Math.pow(1 - boot, 3)
        g.save()
        g.beginPath()
        g.rect(0, (height / 2) * (1 - open), width, height * open)
        g.clip()
      }

      drawStatus(st)
      g.fillStyle = white(0.12)
      g.fillRect(0, STATUS_HEIGHT, width, 1)
      if (lay.pattern) g.fillRect(0, main.bottom, width, 1)

      // Main area: the scope, or the page of the control being moved, cross-fading
      const page = age < PAGE_HOLD ? 1 : Math.max(0, 1 - (age - PAGE_HOLD) / PAGE_FADE)
      g.save()
      g.beginPath()
      g.rect(0, main.top, width, main.bottom - main.top)
      g.clip()
      if (page < 1) {
        g.globalAlpha = 1 - page
        drawScope(analyser, samples)
      }
      if (page > 0) {
        g.globalAlpha = page
        drawPage(st, now)
      }
      g.restore()
      g.globalAlpha = 1

      if (lay.pattern) drawPattern(st, lay.pattern)
      if (boot < 1) g.restore()

      if (glow) {
        slowFrames = performance.now() - now > SLOW_FRAME_MS ? slowFrames + 1 : 0
        if (slowFrames >= SLOW_FRAMES) glow = false
      }
    }
    draw()

    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
    }
  }, [engine, state])

  return (
    <canvas
      ref={canvasRef}
      className={styles.screen}
      role="img"
      aria-label="Synth display: the waveform being played, the control being adjusted, and the sequencer pattern"
    />
  )
}
