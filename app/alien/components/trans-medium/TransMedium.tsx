'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { TransMediumData } from '../../types'

export default function TransMedium() {
  const craftRef = useRef<HTMLDivElement>(null)
  const [medium, setMedium] = useState<TransMediumData>({
    medium: 'air',
    altitude: 5000,
    pressure: 1,
    temperature: 15,
    performanceLoss: 0,
  })
  const [transitioning, setTransitioning] = useState(false)

  const transitionToMedium = (newMedium: 'air' | 'water' | 'space') => {
    setTransitioning(true)

    const mediumData: Record<string, TransMediumData> = {
      air: {
        medium: 'air',
        altitude: 5000,
        pressure: 1,
        temperature: 15,
        performanceLoss: 0,
      },
      water: {
        medium: 'water',
        depth: 500,
        pressure: 51,
        temperature: 4,
        performanceLoss: 2, // Minimal performance loss!
      },
      space: {
        medium: 'space',
        altitude: 100000,
        pressure: 0,
        temperature: -270,
        performanceLoss: 0,
      },
    }

    // Animate craft movement
    if (craftRef.current) {
      const positions = {
        air: { y: 200, rotation: 0 },
        water: { y: 400, rotation: 5 },
        space: { y: 50, rotation: -10 },
      }

      gsap.to(craftRef.current, {
        y: positions[newMedium].y,
        rotation: positions[newMedium].rotation,
        duration: 2,
        ease: 'power2.inOut',
        onComplete: () => {
          setMedium(mediumData[newMedium])
          setTransitioning(false)
        },
      })
    }
  }

  const getMediumColor = () => {
    switch (medium.medium) {
      case 'air':
        return 'from-sky-400 to-blue-200'
      case 'water':
        return 'from-blue-900 to-blue-600'
      case 'space':
        return 'from-black to-purple-900'
    }
  }

  const getMediumParticles = () => {
    switch (medium.medium) {
      case 'air':
        return '☁️'
      case 'water':
        return '💧'
      case 'space':
        return '✨'
    }
  }

  return (
    <div className="relative w-full overflow-hidden rounded-xl border border-gray-700">
      {/* Environment Background */}
      <div className={`h-[600px] bg-gradient-to-b ${getMediumColor()} relative`}>
        {/* Particles */}
        <div className="absolute inset-0 overflow-hidden">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute animate-float text-2xl opacity-30"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${5 + Math.random() * 5}s`,
              }}
            >
              {getMediumParticles()}
            </div>
          ))}
        </div>

        {/* Alien Craft */}
        <div
          ref={craftRef}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{ y: 200 }}
        >
          <div className="relative">
            {/* Craft Body */}
            <div className="relative h-20 w-40 rounded-full bg-gradient-to-b from-gray-300 to-gray-600 shadow-2xl">
              {/* Dome */}
              <div className="absolute left-1/2 top-0 h-10 w-16 -translate-x-1/2 -translate-y-4 rounded-t-full bg-gradient-to-b from-cyan-300 to-cyan-600 opacity-70" />

              {/* Lights */}
              <div className="absolute bottom-0 left-1/2 flex -translate-x-1/2 gap-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-2 w-2 animate-pulse rounded-full bg-cyan-400"
                    style={{ animationDelay: `${i * 0.2}s` }}
                  />
                ))}
              </div>

              {/* Energy Field */}
              {!transitioning && (
                <div className="absolute inset-0 animate-ping rounded-full border-2 border-cyan-400 opacity-50" />
              )}
            </div>

            {/* Propulsion Effect */}
            <div className="absolute left-1/2 top-full h-20 w-1 -translate-x-1/2 bg-gradient-to-b from-cyan-400 to-transparent blur-sm" />
          </div>
        </div>

        {/* Water Surface Line (when in water) */}
        {medium.medium === 'water' && (
          <div className="absolute left-0 right-0 top-1/3 border-t-4 border-dashed border-blue-300 opacity-50" />
        )}

        {/* Metrics Display */}
        <div className="absolute right-6 top-6 space-y-2 rounded-lg bg-black/80 p-4 backdrop-blur-sm">
          <h3 className="text-xl font-bold text-cyan-400">Trans-Medium Travel</h3>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between gap-4">
              <span className="text-gray-400">Current Medium:</span>
              <span className="font-mono uppercase text-cyan-300">{medium.medium}</span>
            </div>
            {medium.altitude !== undefined && (
              <div className="flex justify-between gap-4">
                <span className="text-gray-400">Altitude:</span>
                <span className="font-mono text-green-300">{medium.altitude.toFixed(0)} m</span>
              </div>
            )}
            {medium.depth !== undefined && (
              <div className="flex justify-between gap-4">
                <span className="text-gray-400">Depth:</span>
                <span className="font-mono text-blue-300">{medium.depth.toFixed(0)} m</span>
              </div>
            )}
            <div className="flex justify-between gap-4">
              <span className="text-gray-400">Pressure:</span>
              <span className="font-mono text-purple-300">{medium.pressure.toFixed(1)} atm</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-gray-400">Temperature:</span>
              <span className="font-mono text-orange-300">{medium.temperature.toFixed(1)}°C</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-gray-400">Performance Loss:</span>
              <span
                className={`font-mono ${medium.performanceLoss < 5 ? 'text-green-300' : 'text-red-300'}`}
              >
                {medium.performanceLoss.toFixed(1)}%
              </span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-gray-400">Status:</span>
              <span className={transitioning ? 'text-yellow-400' : 'text-green-400'}>
                {transitioning ? 'TRANSITIONING' : 'STABLE'}
              </span>
            </div>
          </div>
        </div>

        {/* Medium Controls */}
        <div className="absolute bottom-6 left-6 flex gap-2">
          <button
            onClick={() => transitionToMedium('space')}
            disabled={transitioning || medium.medium === 'space'}
            className="rounded bg-purple-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-purple-500 disabled:opacity-50"
          >
            🚀 Space
          </button>
          <button
            onClick={() => transitionToMedium('air')}
            disabled={transitioning || medium.medium === 'air'}
            className="rounded bg-sky-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-500 disabled:opacity-50"
          >
            ☁️ Air
          </button>
          <button
            onClick={() => transitionToMedium('water')}
            disabled={transitioning || medium.medium === 'water'}
            className="rounded bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:opacity-50"
          >
            🌊 Water
          </button>
        </div>

        {/* Performance Badge */}
        <div className="absolute bottom-6 right-6">
          <div className="rounded-full bg-green-600 px-4 py-2 text-sm font-bold text-white shadow-lg">
            ⚡ No Performance Compromise
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0) translateX(0);
          }
          50% {
            transform: translateY(-20px) translateX(10px);
          }
        }
        .animate-float {
          animation: float linear infinite;
        }
      `}</style>
    </div>
  )
}
