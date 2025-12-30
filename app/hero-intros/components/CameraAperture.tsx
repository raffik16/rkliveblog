'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import type { HeroIntroProps } from '../types'

export default function CameraAperture({ isFullscreen, isPlaying }: HeroIntroProps) {
  const [animationKey, setAnimationKey] = useState(0)

  useEffect(() => {
    if (isPlaying) {
      setAnimationKey((k) => k + 1)
    }
  }, [isPlaying])

  const bladeCount = 8
  const blades = Array.from({ length: bladeCount }, (_, i) => i)
  const size = isFullscreen ? 500 : 300

  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Camera body texture */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='3' cy='3' r='1'/%3E%3Ccircle cx='13' cy='13' r='1'/%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* Scene behind aperture */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        initial={{ opacity: 0, scale: 1.2 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
      >
        {/* Gradient background like looking through lens */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 via-blue-600 to-purple-700" />

        {/* Lens flare effect */}
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 0.5 }}
        >
          <div
            className="absolute top-1/3 left-1/3 h-32 w-32 rounded-full opacity-40"
            style={{
              background: 'radial-gradient(circle, rgba(255,255,255,0.8) 0%, transparent 70%)',
            }}
          />
          <div
            className="absolute top-1/2 right-1/4 h-16 w-16 rounded-full opacity-30"
            style={{
              background: 'radial-gradient(circle, rgba(255,200,100,0.8) 0%, transparent 70%)',
            }}
          />
        </motion.div>

        <div className="relative z-10 text-center">
          <motion.div
            className="mb-4 text-5xl"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 2.2, type: 'spring', stiffness: 200 }}
          >
            📷
          </motion.div>
          <motion.h1
            className={`font-bold text-white ${isFullscreen ? 'text-5xl' : 'text-2xl'}`}
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 2.5 }}
            style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.5)' }}
          >
            Focus
          </motion.h1>
          <motion.p
            className={`mt-3 text-white/80 ${isFullscreen ? 'text-lg' : 'text-xs'}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.8 }}
          >
            Capture the perfect moment
          </motion.p>
        </div>
      </motion.div>

      {/* Aperture blades */}
      <div
        key={animationKey}
        className="relative z-10"
        style={{
          width: size,
          height: size,
        }}
      >
        <svg
          viewBox="0 0 100 100"
          className="h-full w-full"
          style={{ filter: 'drop-shadow(0 0 10px rgba(0,0,0,0.5))' }}
        >
          <defs>
            <linearGradient id="bladeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2d2d2d" />
              <stop offset="50%" stopColor="#1a1a1a" />
              <stop offset="100%" stopColor="#0d0d0d" />
            </linearGradient>
          </defs>

          {blades.map((i) => {
            const angle = (i / bladeCount) * 360
            return (
              <motion.g
                key={i}
                style={{ transformOrigin: '50% 50%' }}
                initial={{ rotate: angle }}
                animate={{ rotate: angle + 45 }}
                transition={{
                  duration: 1.5,
                  ease: [0.4, 0, 0.2, 1],
                  delay: 0.3,
                }}
              >
                <motion.path
                  d="M50,50 L30,20 Q50,25 70,20 Z"
                  fill="url(#bladeGradient)"
                  stroke="#444"
                  strokeWidth="0.3"
                  initial={{ scale: 1 }}
                  animate={{ scale: 0.3 }}
                  transition={{
                    duration: 1.5,
                    ease: [0.4, 0, 0.2, 1],
                    delay: 0.3,
                  }}
                  style={{ transformOrigin: '50% 50%' }}
                />
              </motion.g>
            )
          })}

          {/* Center circle highlight */}
          <motion.circle
            cx="50"
            cy="50"
            r="5"
            fill="none"
            stroke="#666"
            strokeWidth="0.5"
            initial={{ r: 5, opacity: 1 }}
            animate={{ r: 45, opacity: 0 }}
            transition={{ duration: 1.5, delay: 0.3 }}
          />
        </svg>
      </div>

      {/* Lens ring */}
      <div
        className="pointer-events-none absolute z-20 rounded-full"
        style={{
          width: size * 1.15,
          height: size * 1.15,
          border: `${isFullscreen ? 20 : 12}px solid transparent`,
          background: `linear-gradient(135deg, #333 0%, #1a1a1a 50%, #333 100%) padding-box,
                       linear-gradient(135deg, #555 0%, #222 50%, #555 100%) border-box`,
        }}
      >
        {/* Lens markings */}
        {Array.from({ length: 24 }).map((_, i) => (
          <div
            key={i}
            className="absolute h-2 w-0.5 bg-gray-500"
            style={{
              top: '50%',
              left: '50%',
              transformOrigin: '0 0',
              transform: `rotate(${i * 15}deg) translateY(${-size * 0.57}px)`,
            }}
          />
        ))}
      </div>

      {/* Shutter sound indicator */}
      <motion.div
        className="absolute top-8 text-center text-white/60"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0] }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <div className="text-2xl">🔊</div>
        <div className="text-xs">*click*</div>
      </motion.div>

      {/* Replay button */}
      <motion.button
        className="absolute right-4 bottom-4 z-30 rounded-full bg-gray-700/80 px-4 py-2 text-sm text-gray-100 backdrop-blur-sm transition-colors hover:bg-gray-600"
        onClick={() => setAnimationKey((k) => k + 1)}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3 }}
      >
        Replay
      </motion.button>
    </div>
  )
}
