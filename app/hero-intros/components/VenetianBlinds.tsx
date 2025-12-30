'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import type { HeroIntroProps } from '../types'

export default function VenetianBlinds({ isFullscreen, isPlaying }: HeroIntroProps) {
  const [animationKey, setAnimationKey] = useState(0)

  useEffect(() => {
    if (isPlaying) {
      setAnimationKey((k) => k + 1)
    }
  }, [isPlaying])

  const slatsCount = 20
  const slats = Array.from({ length: slatsCount }, (_, i) => i)

  return (
    <div className="relative h-full w-full overflow-hidden">
      {/* Morning scene behind blinds */}
      <div className="absolute inset-0 bg-gradient-to-b from-sky-300 via-sky-200 to-amber-100">
        {/* Sun */}
        <motion.div
          className="absolute right-1/4 top-1/4"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
        >
          <div className="h-24 w-24 rounded-full bg-gradient-to-br from-yellow-200 via-yellow-300 to-orange-300 shadow-lg shadow-yellow-300/50" />
          {/* Sun rays */}
          {Array.from({ length: 12 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute left-1/2 top-1/2 h-32 w-1 origin-bottom bg-gradient-to-t from-yellow-300/40 to-transparent"
              style={{
                transform: `translate(-50%, -100%) rotate(${i * 30}deg)`,
              }}
              initial={{ opacity: 0, scaleY: 0 }}
              animate={{ opacity: 1, scaleY: 1 }}
              transition={{ delay: 1.8 + i * 0.05, duration: 0.5 }}
            />
          ))}
        </motion.div>

        {/* Content */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 0.8 }}
        >
          <div className="text-center">
            <motion.div
              className="mb-4 text-5xl"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 2.2 }}
            >
              🌅
            </motion.div>
            <motion.h1
              className={`font-bold text-sky-900 ${isFullscreen ? 'text-5xl' : 'text-2xl'}`}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 2.4 }}
            >
              Good Morning
            </motion.h1>
            <motion.p
              className={`mt-3 text-sky-700 ${isFullscreen ? 'text-lg' : 'text-xs'}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.7 }}
            >
              A new day brings new possibilities
            </motion.p>
          </div>
        </motion.div>

        {/* City silhouette */}
        <div className="absolute bottom-0 left-0 right-0 h-1/4">
          <svg viewBox="0 0 400 100" className="h-full w-full" preserveAspectRatio="xMidYMax slice">
            <path
              d="M0,100 L0,60 L20,60 L20,40 L35,40 L35,50 L50,50 L50,30 L70,30 L70,50 L90,50 L90,45 L110,45 L110,55 L130,55 L130,25 L145,25 L145,15 L155,15 L155,25 L170,25 L170,55 L190,55 L190,35 L220,35 L220,45 L240,45 L240,20 L260,20 L260,45 L280,45 L280,50 L310,50 L310,40 L340,40 L340,55 L360,55 L360,45 L380,45 L380,60 L400,60 L400,100 Z"
              className="fill-sky-800/30"
            />
          </svg>
        </div>
      </div>

      {/* Window frame */}
      <div className="absolute inset-4 border-8 border-stone-200 shadow-inner" style={{ boxShadow: 'inset 0 0 20px rgba(0,0,0,0.1)' }}>
        {/* Venetian blinds */}
        <div key={animationKey} className="relative h-full w-full overflow-hidden">
          {slats.map((i) => (
            <motion.div
              key={i}
              className="absolute left-0 right-0 origin-top"
              style={{
                top: `${(i / slatsCount) * 100}%`,
                height: `${(1 / slatsCount) * 100 + 1}%`,
              }}
              initial={{ rotateX: 0 }}
              animate={{ rotateX: 85 }}
              transition={{
                duration: 0.6,
                delay: 0.3 + i * 0.05,
                ease: [0.4, 0, 0.2, 1],
              }}
            >
              <div
                className="h-full w-full"
                style={{
                  background: 'linear-gradient(180deg, #e7e5e4 0%, #d6d3d1 50%, #a8a29e 100%)',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                  transformStyle: 'preserve-3d',
                }}
              >
                {/* Slat texture */}
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      'repeating-linear-gradient(90deg, transparent 0px, rgba(255,255,255,0.1) 1px, transparent 2px)',
                  }}
                />
              </div>
            </motion.div>
          ))}

          {/* Pull cord */}
          <motion.div
            className="absolute right-4 top-0 flex flex-col items-center"
            initial={{ y: 0 }}
            animate={{ y: 30 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="h-full w-0.5 bg-stone-400" />
            <div className="mt-2 h-4 w-4 rounded-full bg-stone-300 shadow" />
          </motion.div>
        </div>
      </div>

      {/* Window sill */}
      <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-b from-stone-100 to-stone-200" />

      {/* Light beams through blinds */}
      <motion.div
        className="pointer-events-none absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ delay: 1, duration: 1.5 }}
      >
        {Array.from({ length: slatsCount - 1 }).map((_, i) => (
          <div
            key={i}
            className="absolute left-0 right-0"
            style={{
              top: `${((i + 0.5) / slatsCount) * 100}%`,
              height: '3px',
              background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,200,0.8) 50%, transparent 100%)',
              filter: 'blur(2px)',
            }}
          />
        ))}
      </motion.div>

      {/* Replay button */}
      <motion.button
        className="absolute bottom-4 right-4 z-20 rounded-full bg-sky-800/80 px-4 py-2 text-sm text-sky-100 backdrop-blur-sm transition-colors hover:bg-sky-700"
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
