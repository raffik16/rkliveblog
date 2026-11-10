'use client'

import { useEffect, useRef } from 'react'
import { STEPS, cutoffHz, type ArpMode, type Pattern, type SynthEngine, type Wave } from './engine'
import { KNOBS, WAVES, noteName, type KnobKey, type Settings } from './params'
import styles from './synth.module.css'

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
  /** The control last moved and when (performance.now), so its page can be shown for a moment */
  focus: { key: KnobKey | 'wave'; at: number } | null
}

// The screen is drawn on a 320 x 300 grid and scaled to whatever size the canvas is
const W = 320
const H = 300
const MAIN = { top: 38, bottom: 196 }
const SEQ = { top: 212, bottom: 286 }
// How long a control's page stays up after it was last moved, and how long it takes to fade
const PAGE_HOLD = 1400
const PAGE_FADE = 350
const BOOT = 900

const ARP_GLYPH: Record<ArpMode, string> = { up: '↑', down: '↓', updown: '↕', random: '?' }

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

    let frame = 0
    let scale = 1
    let samples: Float32Array<ArrayBuffer> | null = null
    let spectrum: Uint8Array<ArrayBuffer> | null = null
    const started = performance.now()

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2.5)
      canvas.width = Math.round(canvas.clientWidth * dpr)
      canvas.height = Math.round((canvas.clientWidth * dpr * H) / W)
      scale = canvas.width / W
    }
    const observer = new ResizeObserver(resize)
    observer.observe(canvas)
    resize()

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
    }

    const glowLine = (color: string, width: number, trace: () => void) => {
      g.lineJoin = 'round'
      g.lineCap = 'round'
      g.strokeStyle = color
      g.shadowColor = color
      g.shadowBlur = 10 * scale
      g.lineWidth = width
      g.beginPath()
      trace()
      g.stroke()
      g.shadowBlur = 0
    }

    // ------------------------------------------------------------------ what is playing
    const drawScope = () => {
      const mid = (MAIN.top + MAIN.bottom) / 2
      const half = (MAIN.bottom - MAIN.top) / 2
      const analyser = engine.analyser

      g.strokeStyle = white(0.1)
      g.lineWidth = 1
      g.beginPath()
      g.moveTo(0, mid)
      g.lineTo(W, mid)
      g.stroke()

      if (!analyser) {
        text('PRESS A KEY', W / 2, mid - 14, 10, white(0.45), 'center')
        return
      }

      // Spectrum, faint, behind the trace: 44 bars from 40 Hz to 14 kHz on a log scale
      if (!spectrum || spectrum.length !== analyser.frequencyBinCount) {
        spectrum = new Uint8Array(analyser.frequencyBinCount)
      }
      analyser.getByteFrequencyData(spectrum)
      const hzPerBin = analyser.context.sampleRate / analyser.fftSize
      const bars = 44
      g.fillStyle = cyan
      for (let i = 0; i < bars; i++) {
        const freq = 40 * Math.pow(14000 / 40, i / (bars - 1))
        const level = spectrum[Math.min(spectrum.length - 1, Math.round(freq / hzPerBin))] / 255
        const height = level * level * half * 1.7
        g.globalAlpha *= 0.22
        g.fillRect((i / bars) * W + 1, MAIN.bottom - height, W / bars - 2, height)
        g.globalAlpha /= 0.22
      }

      if (!samples || samples.length !== analyser.fftSize) {
        samples = new Float32Array(analyser.fftSize)
      }
      analyser.getFloatTimeDomainData(samples)
      const data = samples

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
          const x = (i / (shown - 1)) * W
          const y = mid - data[start + i] * half * 0.92
          if (i === 0) g.moveTo(x, y)
          else g.lineTo(x, y)
        }
      })
    }

    // ------------------------------------------------- the control being moved, as a picture
    const GRAPH = { left: 14, right: W - 14, top: 104, bottom: 190 }

    const drawWavePage = (s: Settings, now: number) => {
      const mid = (GRAPH.top + GRAPH.bottom) / 2
      const half = (GRAPH.bottom - GRAPH.top) / 2 - 4
      const width = GRAPH.right - GRAPH.left
      const trace = (offset: number) => () => {
        for (let i = 0; i <= width; i++) {
          const y = mid - wave(s.wave, (i / width) * 2.5 + offset) * half
          if (i === 0) g.moveTo(GRAPH.left + i, y)
          else g.lineTo(GRAPH.left + i, y)
        }
      }
      // The second oscillator, drifting against the first at the speed they beat at
      if (s.detune > 0) glowLine(cyan, 1.2, trace(calm ? 0.12 : (now / 1000) * s.detune * 0.05))
      glowLine(lime, 1.8, trace(0))
    }

    const drawFilterPage = (s: Settings, now: number) => {
      const width = GRAPH.right - GRAPH.left
      const height = GRAPH.bottom - GRAPH.top
      const yOf = (db: number) => GRAPH.top + ((24 - db) / 60) * height
      const curve = (cutoff: number) => () => {
        for (let i = 0; i <= width; i += 2) {
          const freq = 20 * Math.pow(1000, i / width) // 20 Hz to 20 kHz
          const db = Math.max(-36, Math.min(24, lowpassDb(freq, cutoff, s.resonance)))
          if (i === 0) g.moveTo(GRAPH.left + i, yOf(db))
          else g.lineTo(GRAPH.left + i, yOf(db))
        }
      }

      g.strokeStyle = white(0.12)
      g.lineWidth = 1
      g.beginPath()
      g.moveTo(GRAPH.left, yOf(0))
      g.lineTo(GRAPH.right, yOf(0))
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
      const width = GRAPH.right - GRAPH.left
      const height = GRAPH.bottom - GRAPH.top - 6
      // Square roots so a 5 ms attack is still visible next to a 4 second release
      const raw = [
        0.12 + Math.sqrt(s.attack / 2),
        0.12 + Math.sqrt(s.decay / 2),
        0.45,
        0.12 + Math.sqrt(s.release / 4),
      ]
      const total = raw.reduce((sum, n) => sum + n, 0)
      const xs = [GRAPH.left]
      raw.forEach((n) => xs.push(xs[xs.length - 1] + (n / total) * width))
      const top = GRAPH.bottom - height
      const hold = GRAPH.bottom - height * s.sustain
      const ys = [GRAPH.bottom, top, hold, hold, GRAPH.bottom]
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
        text(
          'ADSR'[i],
          (xs[i] + xs[i + 1]) / 2,
          GRAPH.bottom + 4 - height - 8,
          8,
          white(i === lit ? 0.9 : 0.35),
          'center'
        )
      }
    }

    const drawBarPage = (position: number, key: string, s: Settings, now: number) => {
      const y = (GRAPH.top + GRAPH.bottom) / 2
      const width = GRAPH.right - GRAPH.left
      g.fillStyle = white(0.12)
      g.fillRect(GRAPH.left, y - 3, width, 6)
      g.fillStyle = white(0.92)
      g.fillRect(GRAPH.left, y - 3, width * position, 6)
      if (key === 'tempo' && !calm) {
        // A dot that blinks on the beat at the tempo being dialled in
        const beat = ((now / 1000) * s.tempo) / 60
        g.globalAlpha *= 1 - (beat - Math.floor(beat))
        g.fillStyle = lime
        g.beginPath()
        g.arc(GRAPH.right - 6, 62, 5, 0, Math.PI * 2)
        g.fill()
      }
    }

    const drawPage = (st: ScreenState, now: number) => {
      const key = st.focus!.key
      const s = st.settings
      if (key === 'wave') {
        text('WAVEFORM', 14, 56, 9, white(0.5))
        text(
          WAVES.find((w) => w.id === s.wave)!.label.toUpperCase(),
          14,
          88,
          28,
          white(0.96),
          'left',
          600
        )
        drawWavePage(s, now)
        return
      }
      const def = KNOBS.find((k) => k.key === key)!
      const value = s[key]
      text(def.name.toUpperCase(), 14, 56, 9, white(0.5))
      text(def.format(value), 14, 88, 28, white(0.96), 'left', 600)
      if (def.page === 'wave') drawWavePage(s, now)
      else if (def.page === 'filter') drawFilterPage(s, now)
      else if (def.page === 'env') drawEnvPage(s, key)
      else drawBarPage((value - def.min) / (def.max - def.min), key, s, now)
    }

    // ------------------------------------------------------------------------- the pattern
    const drawPattern = (st: ScreenState) => {
      const left = 14
      const column = (W - 28) / STEPS
      const notes = st.pattern.filter((n): n is number => n !== null)
      const low = notes.length ? Math.min(...notes) : 48
      const high = Math.max(notes.length ? Math.max(...notes) : 60, low + 7)
      const current = engine.currentStep()
      const lane = SEQ.bottom - SEQ.top - 16

      for (let i = 0; i < STEPS; i++) {
        const x = left + i * column
        if (i === current) {
          g.fillStyle = white(0.12)
          g.fillRect(x, SEQ.top, column - 1, SEQ.bottom - SEQ.top)
        } else if (i % 4 === 0) {
          g.fillStyle = white(0.045)
          g.fillRect(x, SEQ.top, column - 1, SEQ.bottom - SEQ.top)
        }
        if (st.recording && !st.playing && i === st.cursor) {
          g.strokeStyle = red
          g.lineWidth = 1
          g.strokeRect(x + 0.5, SEQ.top + 0.5, column - 2, SEQ.bottom - SEQ.top - 1)
        }
        const midi = st.pattern[i]
        if (midi === null) {
          g.fillStyle = white(0.18)
          g.fillRect(x + column / 2 - 1.5, SEQ.bottom - 5, 2, 2)
          continue
        }
        const y = SEQ.bottom - 12 - ((midi - low) / (high - low)) * lane
        if (i === current) {
          g.shadowColor = lime
          g.shadowBlur = 8 * scale
        }
        g.fillStyle = i === current ? lime : white(0.85)
        g.fillRect(x + 1.5, y, column - 4, 5)
        g.shadowBlur = 0
      }

      const sounding = current >= 0 ? st.pattern[current] : null
      const label = sounding !== null ? noteName(sounding) : st.playing ? '·' : 'PATTERN'
      text(label, left, SEQ.top - 6, 8, white(0.45))
      text(`${notes.length}/${STEPS}`, W - 14, SEQ.top - 6, 8, white(0.45), 'right')
    }

    // --------------------------------------------------------------------------- one frame
    const draw = () => {
      frame = requestAnimationFrame(draw)
      const st = state.current
      const now = performance.now()

      g.setTransform(scale, 0, 0, scale, 0, 0)
      g.globalAlpha = 1
      g.fillStyle = '#05060a'
      g.fillRect(0, 0, W, H)
      g.textBaseline = 'alphabetic'

      // Power-on: the picture opens out from a horizontal line
      const boot = calm ? 1 : Math.min(1, (now - started) / BOOT)
      if (boot < 1) {
        const open = 1 - Math.pow(1 - boot, 3)
        g.save()
        g.beginPath()
        g.rect(0, (H / 2) * (1 - open), W, H * open)
        g.clip()
      }

      // Status line
      text((st.preset ?? 'Custom').toUpperCase(), 14, 22, 9, white(0.9))
      text(`${Math.round(st.settings.tempo)} BPM`, W - 14, 22, 9, white(0.55), 'right')
      let x = 84
      if (st.playing) {
        text('▶ PLAY', x, 22, 9, lime)
        x += 54
      }
      if (st.recording) {
        text('● REC', x, 22, 9, red)
        x += 48
      }
      if (st.arp) text(`ARP ${ARP_GLYPH[st.arpMode]}`, x, 22, 9, cyan)
      g.fillStyle = white(0.12)
      g.fillRect(0, 30, W, 1)
      g.fillRect(0, 200, W, 1)

      // Main area: the scope, or the page of the control being moved, cross-fading
      const age = st.focus ? now - st.focus.at : Infinity
      const page = age < PAGE_HOLD ? 1 : Math.max(0, 1 - (age - PAGE_HOLD) / PAGE_FADE)
      g.save()
      g.beginPath()
      g.rect(0, 31, W, 169)
      g.clip()
      if (page < 1) {
        g.globalAlpha = 1 - page
        drawScope()
      }
      if (page > 0) {
        g.globalAlpha = page
        drawPage(st, now)
      }
      g.restore()
      g.globalAlpha = 1

      drawPattern(st)
      if (boot < 1) g.restore()
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
