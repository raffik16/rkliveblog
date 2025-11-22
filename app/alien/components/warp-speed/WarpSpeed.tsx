'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { WarpMetrics } from '../../types'

export default function WarpSpeed() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const starsRef = useRef<any[]>([])
  const animationRef = useRef<number>()
  const [warpMetrics, setWarpMetrics] = useState<WarpMetrics>({
    engaged: false,
    warpFactor: 1,
    distortionField: 0,
    energyConsumption: 0,
    spacetimeCurvature: 0,
  })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = 600

    // Initialize stars
    const starCount = 800
    starsRef.current = Array.from({ length: starCount }, () => ({
      x: Math.random() * canvas.width - canvas.width / 2,
      y: Math.random() * canvas.height - canvas.height / 2,
      z: Math.random() * canvas.width,
      prevX: 0,
      prevY: 0,
    }))

    const animate = () => {
      ctx.fillStyle = 'rgba(0, 0, 10, 0.2)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.save()
      ctx.translate(canvas.width / 2, canvas.height / 2)

      const speed = warpMetrics.engaged ? warpMetrics.warpFactor * 10 : 2

      starsRef.current.forEach((star) => {
        star.z -= speed

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
          ctx.strokeStyle = `rgba(100, 150, 255, ${1 - star.z / canvas.width})`
          ctx.lineWidth = size
          ctx.stroke()
        }

        // Draw star
        ctx.fillStyle = warpMetrics.engaged
          ? `rgba(150, 200, 255, ${1 - star.z / canvas.width})`
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
    }
  }, [warpMetrics])

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
        setWarpMetrics({ ...this.targets()[0] as WarpMetrics, engaged: false })
      },
    })
  }

  return (
    <div className="relative w-full overflow-hidden rounded-xl border border-gray-700 bg-black">
      <canvas ref={canvasRef} className="h-[600px] w-full" />

      <div className="absolute left-6 top-6 space-y-2 rounded-lg bg-black/80 p-4 backdrop-blur-sm">
        <h3 className="text-xl font-bold text-cyan-400">Warp Drive System</h3>
        <div className="space-y-1 text-sm">
          <div className="flex justify-between gap-4">
            <span className="text-gray-400">Status:</span>
            <span className={warpMetrics.engaged ? 'text-green-400' : 'text-red-400'}>
              {warpMetrics.engaged ? 'ENGAGED' : 'STANDBY'}
            </span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-gray-400">Warp Factor:</span>
            <span className="font-mono text-cyan-300">{warpMetrics.warpFactor.toFixed(1)}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-gray-400">Distortion Field:</span>
            <span className="font-mono text-purple-300">
              {warpMetrics.distortionField.toFixed(1)}%
            </span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-gray-400">Energy:</span>
            <span className="font-mono text-yellow-300">
              {warpMetrics.energyConsumption.toFixed(1)} GW
            </span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-gray-400">Spacetime Curve:</span>
            <span className="font-mono text-pink-300">
              {warpMetrics.spacetimeCurvature.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      <div className="absolute bottom-6 left-6 flex flex-wrap gap-2">
        {[1, 2, 3, 5, 7, 9].map((factor) => (
          <button
            key={factor}
            onClick={() => engageWarp(factor)}
            className="rounded bg-cyan-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-cyan-500"
          >
            Warp {factor}
          </button>
        ))}
        <button
          onClick={disengageWarp}
          className="rounded bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-500"
        >
          Disengage
        </button>
      </div>
    </div>
  )
}
