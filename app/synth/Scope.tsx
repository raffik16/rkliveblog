'use client'

import { useEffect, useRef } from 'react'
import type { SynthEngine } from './engine'
import styles from './synth.module.css'

// An oscilloscope: the waveform leaving the synth, drawn every frame from the analyser node.
export default function Scope({ engine }: { engine: SynthEngine }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const g = canvas?.getContext('2d')
    if (!canvas || !g) return

    let frame = 0
    let samples: Float32Array<ArrayBuffer> | null = null
    const signal = getComputedStyle(canvas).getPropertyValue('--ed-signal').trim() || '#d7ff3d'

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(canvas.clientWidth * dpr)
      canvas.height = Math.round(canvas.clientHeight * dpr)
    }
    const observer = new ResizeObserver(resize)
    observer.observe(canvas)
    resize()

    const draw = () => {
      frame = requestAnimationFrame(draw)
      const { width, height } = canvas
      const mid = height / 2
      g.clearRect(0, 0, width, height)

      // Centre line
      g.strokeStyle = 'rgba(255, 255, 255, 0.14)'
      g.lineWidth = 1
      g.beginPath()
      g.moveTo(0, mid)
      g.lineTo(width, mid)
      g.stroke()

      const analyser = engine.analyser
      if (!analyser) return
      if (!samples || samples.length !== analyser.fftSize) {
        samples = new Float32Array(analyser.fftSize)
      }
      analyser.getFloatTimeDomainData(samples)

      // Start each frame where the wave crosses zero going up. Without this the picture
      // starts at a random point in the wave every frame and the trace jitters sideways.
      const shown = samples.length / 2
      let start = 0
      for (let i = 1; i < shown; i++) {
        if (samples[i - 1] < 0 && samples[i] >= 0) {
          start = i
          break
        }
      }

      g.strokeStyle = signal
      g.lineWidth = Math.max(1.5, height / 90)
      g.lineJoin = 'round'
      g.beginPath()
      for (let i = 0; i < shown; i++) {
        const x = (i / (shown - 1)) * width
        const y = mid - samples[start + i] * mid * 0.9
        if (i === 0) g.moveTo(x, y)
        else g.lineTo(x, y)
      }
      g.stroke()
    }
    draw()

    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
    }
  }, [engine])

  return (
    <canvas
      ref={canvasRef}
      className={styles.scope}
      role="img"
      aria-label="Oscilloscope showing the waveform being played"
    />
  )
}
