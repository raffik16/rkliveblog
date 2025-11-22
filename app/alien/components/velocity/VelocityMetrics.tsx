'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { SpeedMetrics } from '../../types'

export default function VelocityMetrics() {
  const speedGaugeRef = useRef<HTMLCanvasElement>(null)
  const accelGaugeRef = useRef<HTMLCanvasElement>(null)
  const [metrics, setMetrics] = useState<SpeedMetrics>({
    velocity: 0,
    acceleration: 0,
    maxSpeed: 15000, // km/s (5% speed of light)
    currentMedium: 'air',
  })
  const [isAccelerating, setIsAccelerating] = useState(false)

  const drawGauge = (
    canvas: HTMLCanvasElement,
    value: number,
    max: number,
    label: string,
    color: string
  ) => {
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    const radius = Math.min(centerX, centerY) - 20

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Background arc
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius, 0.75 * Math.PI, 2.25 * Math.PI)
    ctx.strokeStyle = '#1f2937'
    ctx.lineWidth = 20
    ctx.stroke()

    // Value arc
    const angle = 0.75 * Math.PI + (value / max) * 1.5 * Math.PI
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius, 0.75 * Math.PI, angle)
    ctx.strokeStyle = color
    ctx.lineWidth = 20
    ctx.lineCap = 'round'
    ctx.stroke()

    // Center circle
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius - 40, 0, 2 * Math.PI)
    ctx.fillStyle = '#111827'
    ctx.fill()

    // Value text
    ctx.fillStyle = color
    ctx.font = 'bold 32px monospace'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(value.toFixed(0), centerX, centerY - 10)

    // Label
    ctx.fillStyle = '#9ca3af'
    ctx.font = '14px sans-serif'
    ctx.fillText(label, centerX, centerY + 25)
  }

  useEffect(() => {
    if (speedGaugeRef.current) {
      drawGauge(speedGaugeRef.current, metrics.velocity, metrics.maxSpeed, 'km/s', '#06b6d4')
    }
  }, [metrics.velocity, metrics.maxSpeed])

  useEffect(() => {
    if (accelGaugeRef.current) {
      drawGauge(accelGaugeRef.current, Math.abs(metrics.acceleration), 100, 'G-Force', '#a855f7')
    }
  }, [metrics.acceleration])

  const accelerate = () => {
    setIsAccelerating(true)
    gsap.to(metrics, {
      velocity: metrics.maxSpeed * 0.8,
      acceleration: 85,
      duration: 5,
      ease: 'power2.out',
      onUpdate: function () {
        setMetrics({ ...this.targets()[0] as SpeedMetrics })
      },
      onComplete: () => setIsAccelerating(false),
    })
  }

  const decelerate = () => {
    setIsAccelerating(true)
    gsap.to(metrics, {
      velocity: 0,
      acceleration: -50,
      duration: 3,
      ease: 'power2.in',
      onUpdate: function () {
        setMetrics({ ...this.targets()[0] as SpeedMetrics })
      },
      onComplete: () => {
        setMetrics((m) => ({ ...m, acceleration: 0 }))
        setIsAccelerating(false)
      },
    })
  }

  const instantStop = () => {
    gsap.to(metrics, {
      velocity: 0,
      acceleration: -200,
      duration: 0.5,
      ease: 'power4.in',
      onUpdate: function () {
        setMetrics({ ...this.targets()[0] as SpeedMetrics })
      },
      onComplete: () => {
        setMetrics((m) => ({ ...m, acceleration: 0 }))
      },
    })
  }

  const getSpeedOfLight = () => {
    const speedOfLight = 299792 // km/s
    return ((metrics.velocity / speedOfLight) * 100).toFixed(4)
  }

  return (
    <div className="w-full space-y-6 rounded-xl border border-gray-700 bg-gradient-to-br from-gray-900 to-black p-6">
      <h2 className="text-2xl font-bold text-cyan-400">Speed & Velocity Showcase</h2>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Speed Gauge */}
        <div className="flex flex-col items-center space-y-4">
          <canvas ref={speedGaugeRef} width={300} height={300} className="rounded-lg" />
          <div className="text-center">
            <div className="text-sm text-gray-400">Maximum Speed</div>
            <div className="font-mono text-2xl font-bold text-cyan-400">
              {metrics.maxSpeed.toLocaleString()} km/s
            </div>
            <div className="mt-2 text-sm text-purple-400">
              {getSpeedOfLight()}% Speed of Light
            </div>
          </div>
        </div>

        {/* Acceleration Gauge */}
        <div className="flex flex-col items-center space-y-4">
          <canvas ref={accelGaugeRef} width={300} height={300} className="rounded-lg" />
          <div className="text-center">
            <div className="text-sm text-gray-400">Current G-Force</div>
            <div
              className={`font-mono text-2xl font-bold ${metrics.acceleration > 50 ? 'text-red-400' : 'text-purple-400'}`}
            >
              {metrics.acceleration.toFixed(1)} G
            </div>
            <div className="mt-2 text-sm text-gray-400">
              {metrics.acceleration > 0 ? 'Accelerating' : 'Decelerating'}
            </div>
          </div>
        </div>
      </div>

      {/* Additional Metrics */}
      <div className="grid gap-4 rounded-lg bg-black/50 p-4 md:grid-cols-3">
        <div className="space-y-1">
          <div className="text-xs text-gray-500">Current Medium</div>
          <div className="font-mono text-lg font-bold uppercase text-cyan-300">
            {metrics.currentMedium}
          </div>
        </div>
        <div className="space-y-1">
          <div className="text-xs text-gray-500">Time to Max Speed</div>
          <div className="font-mono text-lg font-bold text-green-300">
            {isAccelerating ? 'IN PROGRESS' : '5.0 seconds'}
          </div>
        </div>
        <div className="space-y-1">
          <div className="text-xs text-gray-500">Distance/Hour</div>
          <div className="font-mono text-lg font-bold text-yellow-300">
            {(metrics.velocity * 3600).toLocaleString()} km
          </div>
        </div>
      </div>

      {/* Speed Records */}
      <div className="rounded-lg border border-cyan-900 bg-cyan-950/30 p-4">
        <h3 className="mb-3 text-sm font-semibold text-cyan-400">Velocity Comparisons</h3>
        <div className="grid gap-2 text-sm md:grid-cols-2">
          <div className="flex justify-between">
            <span className="text-gray-400">Earth Escape Velocity:</span>
            <span className="font-mono text-white">11.2 km/s</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Solar Escape Velocity:</span>
            <span className="font-mono text-white">617.5 km/s</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Current UFO Speed:</span>
            <span className="font-mono text-cyan-400">{metrics.velocity.toFixed(1)} km/s</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Speed of Light:</span>
            <span className="font-mono text-purple-400">299,792 km/s</span>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={accelerate}
          disabled={isAccelerating}
          className="rounded-lg bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-3 font-semibold text-white shadow-lg transition hover:from-green-500 hover:to-emerald-500 disabled:opacity-50"
        >
          🚀 Accelerate to 80%
        </button>
        <button
          onClick={decelerate}
          disabled={isAccelerating}
          className="rounded-lg bg-gradient-to-r from-yellow-600 to-orange-600 px-6 py-3 font-semibold text-white shadow-lg transition hover:from-yellow-500 hover:to-orange-500 disabled:opacity-50"
        >
          🛑 Decelerate
        </button>
        <button
          onClick={instantStop}
          className="rounded-lg bg-gradient-to-r from-red-600 to-pink-600 px-6 py-3 font-semibold text-white shadow-lg transition hover:from-red-500 hover:to-pink-500"
        >
          ⚡ Instant Stop
        </button>
      </div>
    </div>
  )
}
