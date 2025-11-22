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
    maxSpeed: 15000,
    currentMedium: 'air',
  })
  const [isAccelerating, setIsAccelerating] = useState(false)
  const [targetSpeed, setTargetSpeed] = useState(80)
  const [accelerationRate, setAccelerationRate] = useState(5)

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

    ctx.beginPath()
    ctx.arc(centerX, centerY, radius, 0.75 * Math.PI, 2.25 * Math.PI)
    ctx.strokeStyle = '#1f2937'
    ctx.lineWidth = 20
    ctx.stroke()

    const angle = 0.75 * Math.PI + (value / max) * 1.5 * Math.PI
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius, 0.75 * Math.PI, angle)
    ctx.strokeStyle = color
    ctx.lineWidth = 20
    ctx.lineCap = 'round'
    ctx.stroke()

    ctx.beginPath()
    ctx.arc(centerX, centerY, radius - 40, 0, 2 * Math.PI)
    ctx.fillStyle = '#111827'
    ctx.fill()

    ctx.fillStyle = color
    ctx.font = 'bold 32px monospace'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(value.toFixed(0), centerX, centerY - 10)

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
      velocity: metrics.maxSpeed * (targetSpeed / 100),
      acceleration: 85 * (accelerationRate / 5),
      duration: accelerationRate,
      ease: 'power2.out',
      onUpdate: function () {
        setMetrics({ ...(this.targets()[0] as SpeedMetrics) })
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
        setMetrics({ ...(this.targets()[0] as SpeedMetrics) })
      },
      onComplete: () => {
        setMetrics((m) => ({ ...m, acceleration: 0 }))
        setIsAccelerating(false)
      },
    })
  }

  const getSpeedOfLight = () => {
    const speedOfLight = 299792
    return ((metrics.velocity / speedOfLight) * 100).toFixed(4)
  }

  return (
    <div className="relative h-[calc(100vh-300px)] min-h-[600px] w-full overflow-hidden rounded-xl border border-gray-700 bg-gradient-to-br from-gray-900 to-black p-6">
      <div className="grid h-full gap-6 md:grid-cols-2">
        <canvas ref={speedGaugeRef} width={300} height={300} className="rounded-lg" />
        <canvas ref={accelGaugeRef} width={300} height={300} className="rounded-lg" />
      </div>

      {/* Fixed Control Panel */}
      <div className="absolute top-4 left-4 w-80 space-y-3 rounded-lg border border-cyan-900/50 bg-black/90 p-4 backdrop-blur-md">
        <h2 className="text-xl font-bold text-cyan-400">🚀 Velocity Control</h2>

        <div className="space-y-2 rounded-lg border border-gray-800 bg-black/50 p-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-400">Current Speed:</span>
            <span className="font-mono text-cyan-300">{metrics.velocity.toFixed(0)} km/s</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Speed of Light:</span>
            <span className="font-mono text-purple-300">{getSpeedOfLight()}%</span>
          </div>
        </div>

        <div className="space-y-2">
          <label className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Target Speed</span>
            <span className="font-mono text-cyan-400">{targetSpeed}%</span>
          </label>
          <input
            type="range"
            min="10"
            max="100"
            step="5"
            value={targetSpeed}
            onChange={(e) => setTargetSpeed(parseInt(e.target.value))}
            className="w-full accent-cyan-500"
          />
        </div>

        <div className="space-y-2">
          <label className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Acceleration Duration</span>
            <span className="font-mono text-purple-400">{accelerationRate}s</span>
          </label>
          <input
            type="range"
            min="1"
            max="10"
            step="1"
            value={accelerationRate}
            onChange={(e) => setAccelerationRate(parseInt(e.target.value))}
            className="w-full accent-purple-500"
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={accelerate}
            disabled={isAccelerating}
            className="flex-1 rounded bg-green-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-500 disabled:opacity-50"
          >
            🚀 Accelerate
          </button>
          <button
            onClick={decelerate}
            disabled={isAccelerating}
            className="flex-1 rounded bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-500 disabled:opacity-50"
          >
            🛑 Stop
          </button>
        </div>

        {/* Alien Presets */}
        <div className="space-y-2 rounded-lg border border-purple-900 bg-purple-950/30 p-3">
          <div className="text-sm font-semibold text-purple-400">👽 Alien Presets</div>
          <div className="space-y-1">
            <button
              onClick={() => {
                setTargetSpeed(30)
                setAccelerationRate(8)
                accelerate()
              }}
              className="w-full rounded bg-purple-800/50 px-3 py-2 text-left text-xs text-white transition hover:bg-purple-700/50"
            >
              <div className="font-semibold">Cautious Approach</div>
              <div className="text-gray-400">Slow & steady</div>
            </button>
            <button
              onClick={() => {
                setTargetSpeed(90)
                setAccelerationRate(2)
                accelerate()
              }}
              className="w-full rounded bg-purple-800/50 px-3 py-2 text-left text-xs text-white transition hover:bg-purple-700/50"
            >
              <div className="font-semibold">Emergency Escape</div>
              <div className="text-gray-400">Maximum thrust</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
