'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Particle, ParticleConfig } from '../../types'

interface ParticlePreset {
  name: string
  config: ParticleConfig
}

const PARTICLE_PRESETS: ParticlePreset[] = [
  {
    name: 'Sparks',
    config: {
      type: 'spark',
      count: 15,
      lifetime: 0.4,
      speed: 300,
      size: 4,
      color: '#ffa500',
      gravity: 400,
      spread: 120,
      fadeOut: true,
    },
  },
  {
    name: 'Dust Cloud',
    config: {
      type: 'dust',
      count: 25,
      lifetime: 1.2,
      speed: 80,
      size: 10,
      color: '#8b7355',
      gravity: -20,
      spread: 180,
      fadeOut: true,
    },
  },
  {
    name: 'Trail',
    config: {
      type: 'trail',
      count: 3,
      lifetime: 0.3,
      speed: 20,
      size: 6,
      color: '#00ffff',
      gravity: 0,
      spread: 30,
      fadeOut: true,
    },
  },
  {
    name: 'Impact',
    config: {
      type: 'impact',
      count: 30,
      lifetime: 0.6,
      speed: 400,
      size: 5,
      color: '#ffffff',
      gravity: 600,
      spread: 360,
      fadeOut: true,
    },
  },
  {
    name: 'Fire Burst',
    config: {
      type: 'spark',
      count: 40,
      lifetime: 0.8,
      speed: 250,
      size: 8,
      color: '#ff4500',
      gravity: -100,
      spread: 90,
      fadeOut: true,
    },
  },
  {
    name: 'Snow',
    config: {
      type: 'dust',
      count: 50,
      lifetime: 3,
      speed: 30,
      size: 4,
      color: '#ffffff',
      gravity: 50,
      spread: 360,
      fadeOut: false,
    },
  },
]

export default function ParticlePlayground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number | undefined>(undefined)
  const particlesRef = useRef<Particle[]>([])
  const particleIdRef = useRef<number>(0)
  const lastTimeRef = useRef<number>(0)
  const isEmittingRef = useRef<boolean>(false)
  const emitPositionRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 })

  const [selectedPreset, setSelectedPreset] = useState<ParticlePreset>(PARTICLE_PRESETS[0])
  const [customConfig, setCustomConfig] = useState<ParticleConfig>(PARTICLE_PRESETS[0].config)
  const [particleCount, setParticleCount] = useState<number>(0)
  const [isCustomMode, setIsCustomMode] = useState(false)
  const [continuousEmit, setContinuousEmit] = useState(false)

  const activeConfig = isCustomMode ? customConfig : selectedPreset.config

  const createParticle = useCallback((x: number, y: number, config: ParticleConfig) => {
    const angleSpread = (config.spread * Math.PI) / 180
    const baseAngle = -Math.PI / 2

    for (let i = 0; i < config.count; i++) {
      const angle = baseAngle + (Math.random() - 0.5) * angleSpread
      const speed = config.speed * (0.5 + Math.random() * 0.5)

      const particle: Particle = {
        id: particleIdRef.current++,
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1,
        maxLife: config.lifetime * (0.5 + Math.random() * 0.5),
        size: config.size * (0.5 + Math.random() * 0.5),
        color: config.color,
        alpha: 1,
        type: config.type,
      }
      particlesRef.current.push(particle)
    }
  }, [])

  const updateParticles = useCallback(
    (deltaTime: number) => {
      particlesRef.current = particlesRef.current.filter((p) => {
        p.life -= deltaTime / p.maxLife
        p.alpha = activeConfig.fadeOut ? p.life : 1
        p.x += p.vx * deltaTime
        p.y += p.vy * deltaTime
        p.vy += activeConfig.gravity * deltaTime

        if (p.type === 'dust') {
          p.vx += (Math.random() - 0.5) * 50 * deltaTime
        }

        return p.life > 0
      })
      setParticleCount(particlesRef.current.length)
    },
    [activeConfig]
  )

  const drawParticles = useCallback((ctx: CanvasRenderingContext2D) => {
    particlesRef.current.forEach((p) => {
      ctx.save()
      ctx.globalAlpha = p.alpha

      if (p.type === 'spark') {
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 2)
        gradient.addColorStop(0, p.color)
        gradient.addColorStop(0.5, p.color + '80')
        gradient.addColorStop(1, 'transparent')

        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size * 2, 0, Math.PI * 2)
        ctx.fill()

        ctx.fillStyle = '#ffffff'
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size * 0.5, 0, Math.PI * 2)
        ctx.fill()
      } else if (p.type === 'dust') {
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size)
        gradient.addColorStop(0, p.color)
        gradient.addColorStop(1, 'transparent')

        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fill()
      } else if (p.type === 'trail') {
        ctx.strokeStyle = p.color
        ctx.lineWidth = p.size
        ctx.lineCap = 'round'
        ctx.beginPath()
        ctx.moveTo(p.x - p.vx * 0.05, p.y - p.vy * 0.05)
        ctx.lineTo(p.x, p.y)
        ctx.stroke()
      } else {
        ctx.fillStyle = p.color
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2)
        ctx.fill()
      }

      ctx.restore()
    })
  }, [])

  const animate = useCallback(
    (timestamp: number) => {
      const deltaTime = Math.min((timestamp - lastTimeRef.current) / 1000, 0.1)
      lastTimeRef.current = timestamp

      const canvas = canvasRef.current
      const ctx = canvas?.getContext('2d')
      if (!canvas || !ctx) return

      ctx.fillStyle = 'rgba(17, 24, 39, 0.2)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      if (continuousEmit && isEmittingRef.current) {
        createParticle(emitPositionRef.current.x, emitPositionRef.current.y, activeConfig)
      }

      updateParticles(deltaTime)
      drawParticles(ctx)

      if (isEmittingRef.current) {
        ctx.strokeStyle = '#4ade80'
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.arc(emitPositionRef.current.x, emitPositionRef.current.y, 10, 0, Math.PI * 2)
        ctx.stroke()
      }

      animationRef.current = requestAnimationFrame(animate)
    },
    [activeConfig, continuousEmit, createParticle, updateParticles, drawParticles]
  )

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    createParticle(x, y, activeConfig)
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    emitPositionRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    }
  }

  const handleMouseDown = () => {
    isEmittingRef.current = true
  }

  const handleMouseUp = () => {
    isEmittingRef.current = false
  }

  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault()
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const touch = e.touches[0]
    const x = touch.clientX - rect.left
    const y = touch.clientY - rect.top

    emitPositionRef.current = { x, y }
    createParticle(x, y, activeConfig)
    isEmittingRef.current = true
  }

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault()
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const touch = e.touches[0]
    emitPositionRef.current = {
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top,
    }
  }

  const handleTouchEnd = () => {
    isEmittingRef.current = false
  }

  const clearParticles = () => {
    particlesRef.current = []
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    lastTimeRef.current = performance.now()
    animationRef.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [animate])

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="relative">
        <canvas
          ref={canvasRef}
          className="h-[280px] w-full cursor-crosshair touch-none rounded-xl border border-gray-700 bg-gray-900 md:h-[400px]"
          onClick={handleCanvasClick}
          onMouseMove={handleMouseMove}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        />
        <div className="absolute top-2 left-2 rounded-lg bg-black/50 px-2 py-1 backdrop-blur md:top-4 md:left-4 md:px-3 md:py-2">
          <div className="text-xs text-gray-400 md:text-sm">
            Particles: <span className="font-mono text-white">{particleCount}</span>
          </div>
        </div>
        <div className="absolute top-2 right-2 rounded-lg bg-black/50 px-2 py-1 text-xs text-gray-400 backdrop-blur md:top-4 md:right-4 md:px-3 md:py-2 md:text-sm">
          Tap or drag to emit
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-gray-700 bg-gray-800/50 p-3 md:p-4">
          <div className="mb-3 flex items-center justify-between md:mb-4">
            <h3 className="text-sm font-semibold text-white md:text-base">Presets</h3>
            <label className="flex items-center gap-1.5 text-xs md:gap-2 md:text-sm">
              <input
                type="checkbox"
                checked={isCustomMode}
                onChange={(e) => setIsCustomMode(e.target.checked)}
                className="accent-orange-500"
              />
              <span className="text-gray-400">Custom</span>
            </label>
          </div>

          <div className="grid grid-cols-3 gap-1.5 md:grid-cols-2 md:gap-2">
            {PARTICLE_PRESETS.map((preset) => (
              <motion.button
                key={preset.name}
                onClick={() => {
                  setSelectedPreset(preset)
                  setCustomConfig(preset.config)
                  setIsCustomMode(false)
                }}
                className={`rounded-lg border p-2 text-left transition-all md:p-3 ${
                  selectedPreset.name === preset.name && !isCustomMode
                    ? 'border-orange-500 bg-orange-500/20'
                    : 'border-gray-700 bg-gray-900/50 hover:border-gray-600'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="truncate text-xs font-medium text-white md:text-sm">
                  {preset.name}
                </div>
                <div className="hidden text-xs text-gray-500 md:block">
                  {preset.config.count} particles
                </div>
              </motion.button>
            ))}
          </div>

          <div className="mt-3 flex gap-2 md:mt-4">
            <button
              onClick={clearParticles}
              className="flex-1 rounded-lg bg-gray-700 px-3 py-2 text-xs transition-colors hover:bg-gray-600 md:px-4 md:text-sm"
            >
              Clear All
            </button>
            <label className="flex cursor-pointer items-center gap-1.5 rounded-lg bg-gray-700 px-3 py-2 text-xs md:gap-2 md:px-4 md:text-sm">
              <input
                type="checkbox"
                checked={continuousEmit}
                onChange={(e) => setContinuousEmit(e.target.checked)}
                className="accent-orange-500"
              />
              <span>Continuous</span>
            </label>
          </div>
        </div>

        <div
          className={`rounded-xl border border-gray-700 bg-gray-800/50 p-3 md:p-4 ${!isCustomMode && 'opacity-50'}`}
        >
          <h3 className="mb-3 text-sm font-semibold text-white md:mb-4 md:text-base">
            Custom Configuration
          </h3>

          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm text-gray-400">
                Count: {customConfig.count}
              </label>
              <input
                type="range"
                min="1"
                max="100"
                value={customConfig.count}
                onChange={(e) =>
                  setCustomConfig((prev) => ({ ...prev, count: Number(e.target.value) }))
                }
                disabled={!isCustomMode}
                className="w-full accent-orange-500"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm text-gray-400">
                Lifetime: {customConfig.lifetime.toFixed(1)}s
              </label>
              <input
                type="range"
                min="0.1"
                max="5"
                step="0.1"
                value={customConfig.lifetime}
                onChange={(e) =>
                  setCustomConfig((prev) => ({ ...prev, lifetime: Number(e.target.value) }))
                }
                disabled={!isCustomMode}
                className="w-full accent-orange-500"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm text-gray-400">
                Speed: {customConfig.speed}
              </label>
              <input
                type="range"
                min="10"
                max="600"
                value={customConfig.speed}
                onChange={(e) =>
                  setCustomConfig((prev) => ({ ...prev, speed: Number(e.target.value) }))
                }
                disabled={!isCustomMode}
                className="w-full accent-orange-500"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm text-gray-400">Size: {customConfig.size}</label>
              <input
                type="range"
                min="1"
                max="20"
                value={customConfig.size}
                onChange={(e) =>
                  setCustomConfig((prev) => ({ ...prev, size: Number(e.target.value) }))
                }
                disabled={!isCustomMode}
                className="w-full accent-orange-500"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm text-gray-400">
                Gravity: {customConfig.gravity}
              </label>
              <input
                type="range"
                min="-500"
                max="1000"
                value={customConfig.gravity}
                onChange={(e) =>
                  setCustomConfig((prev) => ({ ...prev, gravity: Number(e.target.value) }))
                }
                disabled={!isCustomMode}
                className="w-full accent-orange-500"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm text-gray-400">
                Spread: {customConfig.spread}°
              </label>
              <input
                type="range"
                min="0"
                max="360"
                value={customConfig.spread}
                onChange={(e) =>
                  setCustomConfig((prev) => ({ ...prev, spread: Number(e.target.value) }))
                }
                disabled={!isCustomMode}
                className="w-full accent-orange-500"
              />
            </div>

            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-400">Color:</span>
              <input
                type="color"
                value={customConfig.color}
                onChange={(e) => setCustomConfig((prev) => ({ ...prev, color: e.target.value }))}
                disabled={!isCustomMode}
                className="h-8 w-12 cursor-pointer rounded"
              />

              <label className="flex items-center gap-2 text-sm text-gray-400">
                <input
                  type="checkbox"
                  checked={customConfig.fadeOut}
                  onChange={(e) =>
                    setCustomConfig((prev) => ({ ...prev, fadeOut: e.target.checked }))
                  }
                  disabled={!isCustomMode}
                  className="accent-orange-500"
                />
                Fade Out
              </label>
            </div>

            <div>
              <span className="mb-2 block text-sm text-gray-400">Type:</span>
              <div className="flex gap-2">
                {(['spark', 'dust', 'trail', 'impact'] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setCustomConfig((prev) => ({ ...prev, type }))}
                    disabled={!isCustomMode}
                    className={`rounded border px-3 py-1 text-sm ${
                      customConfig.type === type
                        ? 'border-orange-500 bg-orange-500/20 text-white'
                        : 'border-gray-600 text-gray-400'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
