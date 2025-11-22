'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { AntiGravityMetrics } from '../../types'

export default function AntiGravity() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const craftRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<number | undefined>(undefined)
  const particlesRef = useRef<any[]>([])

  const [metrics, setMetrics] = useState<AntiGravityMetrics>({
    gravityReduction: 0,
    fieldStrength: 0,
    windSpeed: 25,
    windDirection: 90,
    stabilityIndex: 100,
  })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = canvas.offsetWidth
    canvas.height = 400

    // Initialize wind particles
    particlesRef.current = Array.from({ length: 100 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 2 + 1,
      speed: Math.random() * 2 + 1,
    }))

    const animate = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Calculate wind vector
      const windRadians = (metrics.windDirection * Math.PI) / 180
      const windVelocityX = Math.cos(windRadians) * metrics.windSpeed * 0.1
      const windVelocityY = Math.sin(windRadians) * metrics.windSpeed * 0.1

      // Draw wind particles
      particlesRef.current.forEach((particle) => {
        // Move particle based on wind
        particle.x += windVelocityX * particle.speed
        particle.y += windVelocityY * particle.speed

        // Wrap around
        if (particle.x > canvas.width) particle.x = 0
        if (particle.x < 0) particle.x = canvas.width
        if (particle.y > canvas.height) particle.y = 0
        if (particle.y < 0) particle.y = canvas.height

        // Draw particle
        ctx.fillStyle = `rgba(100, 200, 255, ${particle.size / 3})`
        ctx.fillRect(particle.x, particle.y, particle.size, particle.size)
      })

      // Draw anti-gravity field (centered)
      if (metrics.gravityReduction > 0) {
        const centerX = canvas.width / 2
        const centerY = canvas.height / 2
        const fieldRadius = (metrics.fieldStrength / 100) * 150

        // Ripple effect
        for (let i = 0; i < 3; i++) {
          ctx.beginPath()
          ctx.arc(centerX, centerY, fieldRadius + i * 20, 0, 2 * Math.PI)
          ctx.strokeStyle = `rgba(138, 43, 226, ${0.3 - i * 0.1})`
          ctx.lineWidth = 2
          ctx.stroke()
        }

        // Field glow
        const gradient = ctx.createRadialGradient(
          centerX,
          centerY,
          0,
          centerX,
          centerY,
          fieldRadius
        )
        gradient.addColorStop(0, 'rgba(138, 43, 226, 0.3)')
        gradient.addColorStop(1, 'rgba(138, 43, 226, 0)')
        ctx.fillStyle = gradient
        ctx.fillRect(0, 0, canvas.width, canvas.height)
      }

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [metrics])

  const engageAntiGravity = (strength: number) => {
    gsap.to(metrics, {
      gravityReduction: strength,
      fieldStrength: strength,
      stabilityIndex: 100 - strength * 0.2,
      duration: 2,
      ease: 'power2.out',
      onUpdate: function () {
        setMetrics({ ...this.targets()[0] as AntiGravityMetrics })
      },
    })

    // Animate craft floating
    if (craftRef.current) {
      gsap.to(craftRef.current, {
        y: -strength * 0.5,
        duration: 2,
        ease: 'power2.out',
      })
    }
  }

  const disableAntiGravity = () => {
    gsap.to(metrics, {
      gravityReduction: 0,
      fieldStrength: 0,
      stabilityIndex: 100,
      duration: 2,
      ease: 'power2.in',
      onUpdate: function () {
        setMetrics({ ...this.targets()[0] as AntiGravityMetrics })
      },
    })

    if (craftRef.current) {
      gsap.to(craftRef.current, {
        y: 0,
        duration: 2,
        ease: 'bounce.out',
      })
    }
  }

  const changeWindDirection = () => {
    const newDirection = (metrics.windDirection + 45) % 360
    setMetrics((m) => ({ ...m, windDirection: newDirection }))
  }

  const getWindArrow = () => {
    return (
      <svg
        width="60"
        height="60"
        viewBox="0 0 60 60"
        style={{ transform: `rotate(${metrics.windDirection}deg)` }}
        className="transition-transform duration-500"
      >
        <path
          d="M30 10 L35 25 L32 25 L32 50 L28 50 L28 25 L25 25 Z"
          fill="currentColor"
          className="text-cyan-400"
        />
      </svg>
    )
  }

  return (
    <div className="w-full space-y-4 rounded-xl border border-gray-700 bg-gradient-to-br from-gray-900 to-black p-6">
      <h2 className="text-2xl font-bold text-purple-400">Anti-Gravity System + Wind Tracking</h2>

      <div className="relative overflow-hidden rounded-lg border border-purple-900 bg-black">
        <canvas ref={canvasRef} className="h-[400px] w-full" />

        {/* UFO Craft */}
        <div
          ref={craftRef}
          className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        >
          <div className="relative">
            {/* Main body */}
            <div className="relative h-16 w-32 rounded-full bg-gradient-to-b from-gray-400 to-gray-700 shadow-2xl">
              {/* Dome */}
              <div className="absolute left-1/2 top-0 h-8 w-12 -translate-x-1/2 -translate-y-3 rounded-t-full bg-gradient-to-b from-purple-400 to-purple-700 opacity-80" />

              {/* Bottom lights */}
              <div className="absolute bottom-1 left-1/2 flex -translate-x-1/2 gap-1">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-1.5 w-1.5 animate-pulse rounded-full bg-purple-400"
                    style={{ animationDelay: `${i * 0.2}s` }}
                  />
                ))}
              </div>
            </div>

            {/* Anti-gravity beam */}
            {metrics.gravityReduction > 0 && (
              <div
                className="absolute left-1/2 top-full h-32 w-20 -translate-x-1/2 bg-gradient-to-b from-purple-500/50 to-transparent blur-md"
                style={{ opacity: metrics.gravityReduction / 100 }}
              />
            )}
          </div>
        </div>

        {/* Wind direction indicator */}
        <div className="absolute right-4 top-4 rounded-lg bg-black/80 p-3 backdrop-blur-sm">
          <div className="text-center">
            <div className="mb-2 text-xs text-gray-400">Wind Direction</div>
            {getWindArrow()}
            <div className="mt-2 font-mono text-sm text-cyan-400">{metrics.windDirection}°</div>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border border-purple-900 bg-purple-950/30 p-4">
          <div className="text-xs text-gray-400">Gravity Reduction</div>
          <div className="mt-1 font-mono text-2xl font-bold text-purple-400">
            {metrics.gravityReduction.toFixed(1)}%
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-800">
            <div
              className="h-full bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-500"
              style={{ width: `${metrics.gravityReduction}%` }}
            />
          </div>
        </div>

        <div className="rounded-lg border border-cyan-900 bg-cyan-950/30 p-4">
          <div className="text-xs text-gray-400">Field Strength</div>
          <div className="mt-1 font-mono text-2xl font-bold text-cyan-400">
            {metrics.fieldStrength.toFixed(1)} T
          </div>
          <div className="mt-2 text-xs text-gray-500">Tesla Units</div>
        </div>

        <div className="rounded-lg border border-blue-900 bg-blue-950/30 p-4">
          <div className="text-xs text-gray-400">Wind Speed</div>
          <div className="mt-1 font-mono text-2xl font-bold text-blue-400">
            {metrics.windSpeed.toFixed(1)} km/h
          </div>
          <div className="mt-2 text-xs text-gray-500">Current Conditions</div>
        </div>

        <div className="rounded-lg border border-green-900 bg-green-950/30 p-4">
          <div className="text-xs text-gray-400">Stability Index</div>
          <div className="mt-1 font-mono text-2xl font-bold text-green-400">
            {metrics.stabilityIndex.toFixed(0)}
          </div>
          <div className="mt-2 text-xs text-gray-500">
            {metrics.stabilityIndex > 90 ? 'Excellent' : 'Good'}
          </div>
        </div>

        <div className="rounded-lg border border-yellow-900 bg-yellow-950/30 p-4">
          <div className="text-xs text-gray-400">Wind Resistance</div>
          <div className="mt-1 font-mono text-2xl font-bold text-yellow-400">
            {metrics.gravityReduction > 0 ? 'NULLIFIED' : 'NORMAL'}
          </div>
          <div className="mt-2 text-xs text-gray-500">Anti-Gravity Active</div>
        </div>

        <div className="rounded-lg border border-orange-900 bg-orange-950/30 p-4">
          <div className="text-xs text-gray-400">Hover Height</div>
          <div className="mt-1 font-mono text-2xl font-bold text-orange-400">
            {(metrics.gravityReduction * 0.5).toFixed(0)} m
          </div>
          <div className="mt-2 text-xs text-gray-500">Above Ground</div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => engageAntiGravity(50)}
          className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-purple-500"
        >
          50% Reduction
        </button>
        <button
          onClick={() => engageAntiGravity(75)}
          className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-purple-500"
        >
          75% Reduction
        </button>
        <button
          onClick={() => engageAntiGravity(99)}
          className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-purple-500"
        >
          99% Reduction
        </button>
        <button
          onClick={disableAntiGravity}
          className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-500"
        >
          Disable
        </button>
        <button
          onClick={changeWindDirection}
          className="rounded-lg bg-cyan-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-cyan-500"
        >
          🌪️ Change Wind Direction
        </button>
      </div>
    </div>
  )
}
