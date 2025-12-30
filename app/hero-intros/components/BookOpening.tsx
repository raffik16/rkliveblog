'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import type { HeroIntroProps } from '../types'

export default function BookOpening({ isFullscreen, isPlaying }: HeroIntroProps) {
  const [animationKey, setAnimationKey] = useState(0)

  useEffect(() => {
    if (isPlaying) {
      setAnimationKey((k) => k + 1)
    }
  }, [isPlaying])

  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-gradient-to-br from-amber-100 via-amber-50 to-orange-100">
      {/* Ambient library background */}
      <div className="absolute inset-0 opacity-30">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 30% 20%, rgba(139,69,19,0.3) 0%, transparent 50%),
                              radial-gradient(circle at 70% 80%, rgba(139,69,19,0.2) 0%, transparent 40%)`,
          }}
        />
      </div>

      {/* Content revealed behind the book */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
      >
        <div className="text-center">
          <motion.div
            className="mb-4 text-5xl"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 2.3, type: 'spring' }}
          >
            📖
          </motion.div>
          <motion.h1
            className={`font-serif font-bold text-amber-900 ${isFullscreen ? 'text-5xl' : 'text-2xl'}`}
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 2.5 }}
          >
            A New Chapter Begins
          </motion.h1>
          <motion.p
            className={`mt-3 text-amber-700 ${isFullscreen ? 'text-lg' : 'text-xs'}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.8 }}
          >
            Every great story starts with turning the first page
          </motion.p>
        </div>
      </motion.div>

      {/* Book Container */}
      <div
        key={animationKey}
        className="relative"
        style={{
          perspective: '2000px',
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Right page (static back) */}
        <motion.div
          className="absolute rounded-r-md shadow-2xl"
          style={{
            width: isFullscreen ? '300px' : '180px',
            height: isFullscreen ? '400px' : '240px',
            background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
            transformOrigin: 'left center',
          }}
          initial={{ rotateY: 0 }}
          animate={{ rotateY: -160 }}
          transition={{ duration: 2, ease: [0.4, 0, 0.2, 1], delay: 0.5 }}
        >
          {/* Page lines */}
          <div className="absolute inset-4 flex flex-col gap-2">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="h-1 rounded bg-amber-300/50"
                style={{ width: `${70 + Math.random() * 25}%` }}
              />
            ))}
          </div>
        </motion.div>

        {/* Left cover (opens) */}
        <motion.div
          className="relative overflow-hidden rounded-l-md shadow-2xl"
          style={{
            width: isFullscreen ? '300px' : '180px',
            height: isFullscreen ? '400px' : '240px',
            background: 'linear-gradient(135deg, #78350f 0%, #92400e 50%, #78350f 100%)',
            transformOrigin: 'right center',
            transformStyle: 'preserve-3d',
          }}
          initial={{ rotateY: 0 }}
          animate={{ rotateY: 160 }}
          transition={{ duration: 2, ease: [0.4, 0, 0.2, 1], delay: 0.3 }}
        >
          {/* Book spine texture */}
          <div className="absolute top-0 left-0 h-full w-6 bg-gradient-to-r from-amber-950 via-amber-900 to-amber-800" />

          {/* Gold decorations */}
          <div className="absolute inset-6 rounded border-2 border-amber-500/60">
            <div className="absolute inset-4 rounded border border-amber-500/40" />
          </div>

          {/* Title emboss */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className={`text-center font-serif text-amber-400 ${isFullscreen ? 'text-2xl' : 'text-sm'}`}
              style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}
            >
              <div className="mb-2">✦</div>
              <div>STORIES</div>
              <div className="mt-1 text-xs tracking-widest">Vol. I</div>
            </div>
          </div>

          {/* Corner decorations */}
          {['top-4 left-8', 'top-4 right-4', 'bottom-4 left-8', 'bottom-4 right-4'].map(
            (pos, i) => (
              <div
                key={i}
                className={`absolute ${pos} h-6 w-6 text-amber-500/60`}
                style={{
                  transform: `rotate(${i * 90}deg)`,
                }}
              >
                ❧
              </div>
            )
          )}
        </motion.div>

        {/* Right cover */}
        <motion.div
          className="absolute top-0 left-0 overflow-hidden rounded-r-md shadow-2xl"
          style={{
            width: isFullscreen ? '300px' : '180px',
            height: isFullscreen ? '400px' : '240px',
            background: 'linear-gradient(135deg, #78350f 0%, #92400e 50%, #78350f 100%)',
            transformOrigin: 'left center',
            x: isFullscreen ? '300px' : '180px',
          }}
          initial={{ rotateY: 0 }}
          animate={{ rotateY: -160 }}
          transition={{ duration: 2, ease: [0.4, 0, 0.2, 1], delay: 0.5 }}
        >
          {/* Spine */}
          <div className="absolute top-0 right-0 h-full w-6 bg-gradient-to-l from-amber-950 via-amber-900 to-amber-800" />

          {/* Gold border */}
          <div className="absolute inset-6 rounded border-2 border-amber-500/60">
            <div className="absolute inset-4 rounded border border-amber-500/40" />
          </div>
        </motion.div>
      </div>

      {/* Floating dust particles */}
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute h-1 w-1 rounded-full bg-amber-400/60"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}

      {/* Replay button */}
      <motion.button
        className="absolute right-4 bottom-4 z-20 rounded-full bg-amber-800/80 px-4 py-2 text-sm text-amber-100 backdrop-blur-sm transition-colors hover:bg-amber-700"
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
