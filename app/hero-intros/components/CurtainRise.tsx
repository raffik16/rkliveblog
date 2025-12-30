'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import type { HeroIntroProps } from '../types'

export default function CurtainRise({ isFullscreen, isPlaying }: HeroIntroProps) {
  const [animationKey, setAnimationKey] = useState(0)

  useEffect(() => {
    if (isPlaying) {
      setAnimationKey((k) => k + 1)
    }
  }, [isPlaying])

  const curtainVariants = {
    closed: { y: 0 },
    open: { y: '-100%' },
  }

  const foldCount = 12
  const folds = Array.from({ length: foldCount }, (_, i) => i)

  return (
    <div className="relative h-full w-full overflow-hidden bg-gradient-to-b from-amber-950 via-amber-900 to-amber-800">
      {/* Stage/Website Content Behind */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
      >
        <div className="text-center">
          <motion.div
            className="mb-6 text-6xl"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 2, duration: 0.6 }}
          >
            🎭
          </motion.div>
          <motion.h1
            className={`font-serif font-bold tracking-wide text-amber-100 ${isFullscreen ? 'text-6xl' : 'text-3xl'}`}
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 2.2, duration: 0.6 }}
          >
            Welcome to the Show
          </motion.h1>
          <motion.p
            className={`mt-4 text-amber-200/80 ${isFullscreen ? 'text-xl' : 'text-sm'}`}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 2.5, duration: 0.5 }}
          >
            The stage is set, the audience awaits
          </motion.p>
        </div>
      </motion.div>

      {/* Spotlights */}
      <motion.div
        className="pointer-events-none absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 1 }}
      >
        <div
          className="absolute top-0 left-1/4 h-full w-1/3 opacity-20"
          style={{
            background: 'linear-gradient(180deg, rgba(255,215,0,0.4) 0%, transparent 70%)',
            transform: 'rotate(-15deg)',
          }}
        />
        <div
          className="absolute top-0 right-1/4 h-full w-1/3 opacity-20"
          style={{
            background: 'linear-gradient(180deg, rgba(255,215,0,0.4) 0%, transparent 70%)',
            transform: 'rotate(15deg)',
          }}
        />
      </motion.div>

      {/* Curtain */}
      <motion.div
        key={animationKey}
        className="absolute inset-0 z-10"
        variants={curtainVariants}
        initial="closed"
        animate="open"
        transition={{
          duration: 2,
          ease: [0.4, 0, 0.2, 1],
          delay: 0.3,
        }}
      >
        {/* Velvet curtain texture with folds */}
        <div className="relative h-full w-full">
          {/* Main curtain body */}
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(90deg, #8B0000 0%, #DC143C 10%, #8B0000 20%, #DC143C 30%, #8B0000 40%, #DC143C 50%, #8B0000 60%, #DC143C 70%, #8B0000 80%, #DC143C 90%, #8B0000 100%)',
            }}
          />

          {/* Fold shadows */}
          {folds.map((i) => (
            <div
              key={i}
              className="absolute top-0 h-full"
              style={{
                left: `${(i / foldCount) * 100}%`,
                width: `${100 / foldCount}%`,
                background: `linear-gradient(90deg,
                  rgba(0,0,0,0.3) 0%,
                  rgba(0,0,0,0) 30%,
                  rgba(255,255,255,0.1) 50%,
                  rgba(0,0,0,0) 70%,
                  rgba(0,0,0,0.3) 100%)`,
              }}
            />
          ))}

          {/* Vertical draping effect */}
          <div
            className="absolute inset-0"
            style={{
              background:
                'repeating-linear-gradient(180deg, transparent 0px, rgba(0,0,0,0.1) 20px, transparent 40px)',
            }}
          />

          {/* Gold trim at bottom */}
          <div
            className="absolute right-0 bottom-0 left-0 h-16"
            style={{
              background:
                'linear-gradient(180deg, transparent 0%, rgba(218,165,32,0.6) 50%, #B8860B 100%)',
            }}
          />

          {/* Tassel decorations */}
          <div className="absolute right-0 bottom-0 left-0 flex justify-around px-8">
            {[0, 1, 2, 3, 4].map((i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="h-8 w-1 rounded-full bg-yellow-600" />
                <div className="h-6 w-4 rounded-b-full bg-gradient-to-b from-yellow-600 to-yellow-700" />
              </div>
            ))}
          </div>
        </div>

        {/* Curtain rod */}
        <div className="absolute -top-2 right-0 left-0 h-6 bg-gradient-to-b from-yellow-700 via-yellow-500 to-yellow-700 shadow-lg" />
      </motion.div>

      {/* Replay button */}
      <motion.button
        className="absolute right-4 bottom-4 z-20 rounded-full bg-amber-900/80 px-4 py-2 text-sm text-amber-100 backdrop-blur-sm transition-colors hover:bg-amber-800"
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
