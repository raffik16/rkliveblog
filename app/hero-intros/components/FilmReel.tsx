'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import type { HeroIntroProps } from '../types'

export default function FilmReel({ isFullscreen, isPlaying }: HeroIntroProps) {
  const [animationKey, setAnimationKey] = useState(0)
  const [phase, setPhase] = useState<'countdown' | 'projecting' | 'playing'>('countdown')
  const [countdownNumber, setCountdownNumber] = useState(3)

  useEffect(() => {
    if (isPlaying) {
      setAnimationKey((k) => k + 1)
    }
  }, [isPlaying])

  useEffect(() => {
    setPhase('countdown')
    setCountdownNumber(3)

    const t1 = setTimeout(() => setCountdownNumber(2), 600)
    const t2 = setTimeout(() => setCountdownNumber(1), 1200)
    const t3 = setTimeout(() => setPhase('projecting'), 1800)
    const t4 = setTimeout(() => setPhase('playing'), 3000)

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
      clearTimeout(t4)
    }
  }, [animationKey])

  return (
    <div
      key={animationKey}
      className="relative flex h-full w-full items-center justify-center overflow-hidden bg-black"
    >
      {/* Film grain effect */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-20 opacity-20"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%' height='100%' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
        animate={{ opacity: phase === 'playing' ? 0.1 : 0.3 }}
      />

      {/* Vignette */}
      <div
        className="pointer-events-none absolute inset-0 z-10"
        style={{
          background: 'radial-gradient(circle, transparent 30%, rgba(0,0,0,0.8) 100%)',
        }}
      />

      {/* Countdown phase */}
      {phase === 'countdown' && (
        <div className="relative z-30">
          {/* Countdown circle */}
          <motion.div
            className="relative flex items-center justify-center"
            style={{
              width: isFullscreen ? 200 : 120,
              height: isFullscreen ? 200 : 120,
            }}
          >
            {/* Rotating sweep */}
            <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" fill="none" stroke="#444" strokeWidth="2" />
              <motion.circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="#fff"
                strokeWidth="3"
                strokeDasharray="283"
                strokeDashoffset="283"
                animate={{ strokeDashoffset: 0 }}
                transition={{ duration: 0.5, ease: 'linear' }}
                style={{ transformOrigin: 'center', transform: 'rotate(-90deg)' }}
              />
            </svg>

            {/* Number */}
            <motion.span
              key={countdownNumber}
              className={`font-mono font-bold text-white ${isFullscreen ? 'text-8xl' : 'text-5xl'}`}
              initial={{ scale: 2, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {countdownNumber}
            </motion.span>
          </motion.div>

          {/* Film scratches */}
          <motion.div
            className="absolute inset-0"
            animate={{ x: [0, 2, -1, 0] }}
            transition={{ duration: 0.1, repeat: Infinity }}
          >
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="absolute h-full w-px bg-white/20"
                style={{ left: `${20 + i * 30}%` }}
              />
            ))}
          </motion.div>
        </div>
      )}

      {/* Projecting phase - light beam */}
      {phase === 'projecting' && (
        <motion.div
          className="absolute inset-0 z-30 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Projector light cone */}
          <motion.div
            className="absolute"
            style={{
              width: '200%',
              height: '200%',
              background:
                'conic-gradient(from 180deg at 50% 0%, transparent 70deg, rgba(255,255,255,0.1) 85deg, rgba(255,255,255,0.3) 90deg, rgba(255,255,255,0.1) 95deg, transparent 110deg)',
            }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          />

          {/* Dust particles in light */}
          {Array.from({ length: 30 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute h-1 w-1 rounded-full bg-white/60"
              style={{
                left: `${30 + Math.random() * 40}%`,
                top: `${20 + Math.random() * 60}%`,
              }}
              animate={{
                y: [-20, 20],
                opacity: [0.3, 0.8, 0.3],
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random(),
              }}
            />
          ))}
        </motion.div>
      )}

      {/* Playing phase - content revealed */}
      {phase === 'playing' && (
        <motion.div
          className="absolute inset-0 z-30 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Sepia-toned content */}
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(135deg, #1a1a0a 0%, #2d2d1a 50%, #1a1a0a 100%)',
            }}
          />

          <div className="relative z-10 text-center">
            <motion.div
              className="mb-4 text-5xl"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: 'spring' }}
            >
              🎬
            </motion.div>
            <motion.h1
              className={`font-serif font-bold text-amber-100 ${isFullscreen ? 'text-5xl' : 'text-2xl'}`}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}
            >
              Now Showing
            </motion.h1>
            <motion.p
              className={`mt-3 text-amber-200/80 ${isFullscreen ? 'text-lg' : 'text-xs'}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              The feature presentation begins
            </motion.p>
          </div>
        </motion.div>
      )}

      {/* Film sprocket holes (sides) */}
      <div className="absolute top-0 bottom-0 left-0 z-40 flex w-8 flex-col justify-around bg-black py-2">
        {Array.from({ length: 15 }).map((_, i) => (
          <motion.div
            key={i}
            className="mx-auto h-4 w-4 rounded-sm bg-gray-900"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 0.1, repeat: Infinity, delay: i * 0.01 }}
          />
        ))}
      </div>
      <div className="absolute top-0 right-0 bottom-0 z-40 flex w-8 flex-col justify-around bg-black py-2">
        {Array.from({ length: 15 }).map((_, i) => (
          <motion.div
            key={i}
            className="mx-auto h-4 w-4 rounded-sm bg-gray-900"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 0.1, repeat: Infinity, delay: i * 0.01 }}
          />
        ))}
      </div>

      {/* Replay button */}
      <motion.button
        className="absolute right-12 bottom-4 z-50 rounded-full bg-gray-800/80 px-4 py-2 text-sm text-gray-100 backdrop-blur-sm transition-colors hover:bg-gray-700"
        onClick={() => setAnimationKey((k) => k + 1)}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3.5 }}
      >
        Replay
      </motion.button>
    </div>
  )
}
