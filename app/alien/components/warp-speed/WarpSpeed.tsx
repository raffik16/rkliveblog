'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { WarpMetrics } from '../../types'

export default function WarpSpeed() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const starsRef = useRef<Array<{ x: number; y: number; z: number; prevX: number; prevY: number }>>(
    []
  )
  const animationRef = useRef<number | undefined>(undefined)
  const [warpMetrics, setWarpMetrics] = useState<WarpMetrics>({
    engaged: false,
    warpFactor: 1,
    distortionField: 0,
    energyConsumption: 0,
    spacetimeCurvature: 0,
  })

  const [starDensity, setStarDensity] = useState(800)
  const [colorIntensity, setColorIntensity] = useState(100)
  const [trailLength, setTrailLength] = useState(0.2)
  const [heading, setHeading] = useState(0) // -45 to 45 degrees (left/right steering)
  const [tiltAngle, setTiltAngle] = useState(0) // Visual tilt for banking effect
  const [isPanelCollapsed, setIsPanelCollapsed] = useState(false) // Collapsible panel state

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Initialize stars
    starsRef.current = Array.from({ length: starDensity }, () => ({
      x: Math.random() * canvas.width - canvas.width / 2,
      y: Math.random() * canvas.height - canvas.height / 2,
      z: Math.random() * canvas.width,
      prevX: 0,
      prevY: 0,
    }))

    const animate = () => {
      ctx.fillStyle = `rgba(0, 0, 10, ${trailLength})`
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.save()
      ctx.translate(canvas.width / 2, canvas.height / 2)

      // Apply rotation based on heading (tilt effect)
      const tiltRad = (tiltAngle * Math.PI) / 180
      ctx.rotate(tiltRad)

      const speed = warpMetrics.engaged ? warpMetrics.warpFactor * 10 : 2

      // Calculate lateral drift based on heading - much gentler
      const driftX = heading * 0.05

      starsRef.current.forEach((star) => {
        star.z -= speed

        // Apply lateral movement based on heading - smooth and subtle
        star.x += driftX

        if (star.z <= 0) {
          star.z = canvas.width
          star.x = Math.random() * canvas.width - canvas.width / 2
          star.y = Math.random() * canvas.height - canvas.height / 2
        }

        const sx = (star.x / star.z) * canvas.width
        const sy = (star.y / star.z) * canvas.height

        const size = (1 - star.z / canvas.width) * 3

        // Draw warp trail
        if (warpMetrics.engaged) {
          ctx.beginPath()
          ctx.moveTo(star.prevX, star.prevY)
          ctx.lineTo(sx, sy)
          ctx.strokeStyle = `rgba(${100 * (colorIntensity / 100)}, ${150 * (colorIntensity / 100)}, 255, ${1 - star.z / canvas.width})`
          ctx.lineWidth = size
          ctx.stroke()
        }

        // Draw star
        const brightness = colorIntensity / 100
        ctx.fillStyle = warpMetrics.engaged
          ? `rgba(${150 * brightness}, ${200 * brightness}, 255, ${1 - star.z / canvas.width})`
          : `rgba(255, 255, 255, ${1 - star.z / canvas.width})`
        ctx.fillRect(sx, sy, size, size)

        star.prevX = sx
        star.prevY = sy
      })

      ctx.restore()

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [warpMetrics, starDensity, colorIntensity, trailLength, heading, tiltAngle])

  const engageWarp = (factor: number) => {
    setWarpMetrics({
      engaged: true,
      warpFactor: factor,
      distortionField: factor * 10,
      energyConsumption: Math.pow(factor, 3) * 1.5,
      spacetimeCurvature: factor * 0.8,
    })
  }

  const disengageWarp = () => {
    gsap.to(warpMetrics, {
      warpFactor: 1,
      distortionField: 0,
      energyConsumption: 0,
      spacetimeCurvature: 0,
      duration: 2,
      onUpdate: function () {
        setWarpMetrics({ ...(this.targets()[0] as WarpMetrics), engaged: false })
      },
    })
  }

  const handleWarpFactorChange = (value: number) => {
    // Always engage warp when slider is moved
    engageWarp(value)
  }

  const handleSteer = (direction: number) => {
    setHeading(direction)
    // Animate tilt/banking effect - very smooth and subtle
    gsap.to(
      { value: tiltAngle },
      {
        value: -direction * 0.15, // Much gentler banking (was 0.3)
        duration: 1.2, // Slower transition (was 0.5)
        ease: 'power1.inOut', // Smoother easing
        onUpdate: function () {
          setTiltAngle((this.targets()[0] as { value: number }).value)
        },
      }
    )
  }

  const centerSteering = () => {
    handleSteer(0)
  }

  const getHeadingDisplay = () => {
    if (heading === 0) return 'CENTER'
    if (heading > 0) return `RIGHT ${Math.abs(heading).toFixed(0)}°`
    return `LEFT ${Math.abs(heading).toFixed(0)}°`
  }

  return (
    <div className="relative h-[calc(100vh-300px)] min-h-[600px] w-full overflow-hidden rounded-xl border border-gray-700 bg-black">
      <canvas ref={canvasRef} className="h-full w-full" />

      {/* Heading Indicator - Top Center */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 rounded-lg border border-cyan-900/50 bg-black/90 px-6 py-3 backdrop-blur-md">
        <div className="text-center">
          <div className="text-xs text-gray-400">HEADING</div>
          <div className="mt-1 font-mono text-lg font-bold text-cyan-400">
            {getHeadingDisplay()}
          </div>
        </div>
      </div>

      {/* Fixed Control Panel - Top Left */}
      <div className="absolute top-4 left-4 max-h-[calc(100%-2rem)] w-80 overflow-y-auto rounded-lg border border-cyan-900/50 bg-black/90 backdrop-blur-md">
        <div className="flex items-center justify-between p-4 pb-3">
          <h3 className="text-xl font-bold text-cyan-400">🛸 Warp Drive System</h3>
          <button
            onClick={() => setIsPanelCollapsed(!isPanelCollapsed)}
            className="rounded-lg border border-cyan-700 bg-cyan-950/50 px-3 py-1 text-cyan-400 transition hover:bg-cyan-900/50 md:hidden"
            aria-label={isPanelCollapsed ? 'Expand panel' : 'Collapse panel'}
          >
            {isPanelCollapsed ? '▼' : '▲'}
          </button>
        </div>

        <div className={`space-y-3 px-4 pb-4 ${isPanelCollapsed ? 'hidden md:block' : 'block'}`}>
          {/* Status Metrics */}
          <div className="space-y-2 rounded-lg border border-gray-800 bg-black/50 p-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Status:</span>
              <span className={warpMetrics.engaged ? 'text-green-400' : 'text-red-400'}>
                {warpMetrics.engaged ? 'ENGAGED' : 'STANDBY'}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Warp Factor:</span>
              <span className="font-mono text-cyan-300">{warpMetrics.warpFactor.toFixed(1)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Distortion Field:</span>
              <span className="font-mono text-purple-300">
                {warpMetrics.distortionField.toFixed(1)}%
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Energy:</span>
              <span className="font-mono text-yellow-300">
                {warpMetrics.energyConsumption.toFixed(1)} GW
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Spacetime Curve:</span>
              <span className="font-mono text-pink-300">
                {warpMetrics.spacetimeCurvature.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Steering Control */}
          <div className="space-y-2 rounded-lg border border-orange-900 bg-orange-950/30 p-3">
            <label className="flex items-center justify-between text-sm">
              <span className="text-gray-400">🎯 Steering Control</span>
              <span className="font-mono text-orange-400">{heading.toFixed(0)}°</span>
            </label>
            <input
              type="range"
              min="-45"
              max="45"
              step="1"
              value={heading}
              onChange={(e) => handleSteer(parseFloat(e.target.value))}
              className="w-full accent-orange-500"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>← LEFT 45°</span>
              <span>CENTER</span>
              <span>RIGHT 45° →</span>
            </div>
            <div className="mt-2 grid grid-cols-3 gap-2">
              <button
                onClick={() => handleSteer(-30)}
                className="rounded bg-orange-700 px-2 py-1 text-xs font-semibold text-white transition hover:bg-orange-600"
              >
                ← Hard Left
              </button>
              <button
                onClick={centerSteering}
                className="rounded bg-green-700 px-2 py-1 text-xs font-semibold text-white transition hover:bg-green-600"
              >
                ⊙ Center
              </button>
              <button
                onClick={() => handleSteer(30)}
                className="rounded bg-orange-700 px-2 py-1 text-xs font-semibold text-white transition hover:bg-orange-600"
              >
                Hard Right →
              </button>
            </div>
          </div>

          {/* Warp Factor Slider */}
          <div className="space-y-2">
            <label className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Warp Factor Control</span>
              <span className="font-mono text-cyan-400">{warpMetrics.warpFactor.toFixed(1)}</span>
            </label>
            <input
              type="range"
              min="1"
              max="10"
              step="0.1"
              value={warpMetrics.warpFactor}
              onChange={(e) => handleWarpFactorChange(parseFloat(e.target.value))}
              className="w-full accent-cyan-500"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>Warp 1</span>
              <span>Warp 10</span>
            </div>
          </div>

          {/* Star Density Slider */}
          <div className="space-y-2">
            <label className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Star Field Density</span>
              <span className="font-mono text-purple-400">{starDensity}</span>
            </label>
            <input
              type="range"
              min="200"
              max="2000"
              step="100"
              value={starDensity}
              onChange={(e) => setStarDensity(parseInt(e.target.value))}
              className="w-full accent-purple-500"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>Sparse</span>
              <span>Dense</span>
            </div>
          </div>

          {/* Color Intensity Slider */}
          <div className="space-y-2">
            <label className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Color Intensity</span>
              <span className="font-mono text-blue-400">{colorIntensity}%</span>
            </label>
            <input
              type="range"
              min="0"
              max="200"
              step="10"
              value={colorIntensity}
              onChange={(e) => setColorIntensity(parseInt(e.target.value))}
              className="w-full accent-blue-500"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>Dim</span>
              <span>Vivid</span>
            </div>
          </div>

          {/* Trail Length Slider */}
          <div className="space-y-2">
            <label className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Trail Persistence</span>
              <span className="font-mono text-pink-400">{(trailLength * 100).toFixed(0)}%</span>
            </label>
            <input
              type="range"
              min="0.05"
              max="0.5"
              step="0.05"
              value={trailLength}
              onChange={(e) => setTrailLength(parseFloat(e.target.value))}
              className="w-full accent-pink-500"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>Sharp</span>
              <span>Long Trails</span>
            </div>
          </div>

          {/* Quick Presets */}
          <div className="space-y-2">
            <div className="text-sm text-gray-400">Quick Engage</div>
            <div className="grid grid-cols-3 gap-2">
              {[1, 3, 5, 7, 9, 9.9].map((factor) => (
                <button
                  key={factor}
                  onClick={() => engageWarp(factor)}
                  className="rounded bg-cyan-600 px-2 py-1 text-xs font-semibold text-white transition hover:bg-cyan-500"
                >
                  {factor === 9.9 ? 'MAX' : `W${factor}`}
                </button>
              ))}
            </div>
          </div>

          {/* Disengage Button */}
          <button
            onClick={disengageWarp}
            className="w-full rounded-lg bg-gradient-to-r from-red-600 to-pink-600 px-4 py-2 font-semibold text-white transition hover:from-red-500 hover:to-pink-500"
          >
            🛑 Disengage Warp Drive
          </button>

          {/* Alien Lifestyle Presets */}
          <div className="space-y-2 rounded-lg border border-purple-900 bg-purple-950/30 p-3">
            <div className="text-sm font-semibold text-purple-400">👽 Alien Presets</div>
            <div className="space-y-1">
              <button
                onClick={() => {
                  setStarDensity(1500)
                  setColorIntensity(150)
                  setTrailLength(0.3)
                  engageWarp(7)
                  centerSteering()
                }}
                className="w-full rounded bg-purple-800/50 px-3 py-2 text-left text-xs text-white transition hover:bg-purple-700/50"
              >
                <div className="font-semibold">Pleiadian Cruise</div>
                <div className="text-gray-400">High density, vivid colors</div>
              </button>
              <button
                onClick={() => {
                  setStarDensity(500)
                  setColorIntensity(80)
                  setTrailLength(0.4)
                  engageWarp(9)
                  handleSteer(20)
                }}
                className="w-full rounded bg-purple-800/50 px-3 py-2 text-left text-xs text-white transition hover:bg-purple-700/50"
              >
                <div className="font-semibold">Grey Scout Mode</div>
                <div className="text-gray-400">Minimal, evasive maneuvers</div>
              </button>
              <button
                onClick={() => {
                  setStarDensity(2000)
                  setColorIntensity(200)
                  setTrailLength(0.15)
                  engageWarp(5)
                  centerSteering()
                }}
                className="w-full rounded bg-purple-800/50 px-3 py-2 text-left text-xs text-white transition hover:bg-purple-700/50"
              >
                <div className="font-semibold">Arcturian Display</div>
                <div className="text-gray-400">Maximum visual impact</div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Visual Banking Indicator - Bottom Center */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
        <div className="flex items-center gap-2 rounded-lg border border-gray-700 bg-black/80 px-4 py-2 backdrop-blur-sm">
          <div className="text-xs text-gray-400">BANK:</div>
          <div
            className="h-8 w-24 rounded border border-gray-600 bg-gray-900"
            style={{ position: 'relative' }}
          >
            {/* Horizon line */}
            <div className="absolute top-1/2 left-0 h-px w-full bg-cyan-500" />
            {/* Bank indicator */}
            <div
              className="absolute top-1/2 left-1/2 h-1 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange-500 shadow-lg shadow-orange-500/50"
              style={{
                transform: `translate(-50%, -50%) rotate(${tiltAngle}deg) translateY(-8px)`,
              }}
            />
          </div>
          <div className="font-mono text-xs text-orange-400">{tiltAngle.toFixed(1)}°</div>
        </div>
      </div>
    </div>
  )
}
