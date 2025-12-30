'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import type { HeroIntroProps } from '../types'

export default function OrigamiUnfold({ isFullscreen, isPlaying }: HeroIntroProps) {
  const [animationKey, setAnimationKey] = useState(0)

  useEffect(() => {
    if (isPlaying) {
      setAnimationKey((k) => k + 1)
    }
  }, [isPlaying])

  const size = isFullscreen ? 350 : 210

  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-gradient-to-br from-rose-50 via-white to-pink-50">
      {/* Japanese pattern background */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0L60 30L30 60L0 30Z' fill='none' stroke='%23be185d' stroke-width='0.5'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Content revealed */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3, duration: 0.8 }}
      >
        <div className="text-center">
          <motion.div
            className="mb-4 text-5xl"
            initial={{ scale: 0, rotate: 180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 3.2, type: 'spring' }}
          >
            🦢
          </motion.div>
          <motion.h1
            className={`font-light tracking-wide text-rose-800 ${isFullscreen ? 'text-5xl' : 'text-2xl'}`}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 3.4 }}
          >
            Unfold Your Story
          </motion.h1>
          <motion.p
            className={`mt-3 text-rose-600 ${isFullscreen ? 'text-lg' : 'text-xs'}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3.7 }}
          >
            From paper to possibility
          </motion.p>
        </div>
      </motion.div>

      {/* Origami crane unfolding */}
      <div
        key={animationKey}
        className="relative z-10"
        style={{
          width: size,
          height: size,
          perspective: '1000px',
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Base paper layer */}
        <motion.div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(135deg, #fce7f3 0%, #fbcfe8 50%, #f9a8d4 100%)',
            boxShadow: '0 10px 40px rgba(190,24,93,0.2)',
          }}
          initial={{ rotateY: 0, scale: 1 }}
          animate={{ rotateY: 0, scale: 0.3, opacity: 0 }}
          transition={{ duration: 2.5, ease: [0.4, 0, 0.2, 1], delay: 0.5 }}
        />

        {/* Folded triangles that unfold */}
        {[
          { rotate: 0, delay: 0.3, origin: 'bottom right' },
          { rotate: 90, delay: 0.5, origin: 'bottom left' },
          { rotate: 180, delay: 0.7, origin: 'top left' },
          { rotate: 270, delay: 0.9, origin: 'top right' },
        ].map((fold, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              width: '50%',
              height: '50%',
              top: fold.rotate >= 180 ? 0 : '50%',
              left: fold.rotate === 90 || fold.rotate === 180 ? 0 : '50%',
              transformOrigin: fold.origin,
              transformStyle: 'preserve-3d',
            }}
            initial={{ rotateX: 0, rotateY: 0 }}
            animate={{ rotateX: -180, opacity: 0 }}
            transition={{
              duration: 0.8,
              ease: [0.4, 0, 0.2, 1],
              delay: fold.delay,
            }}
          >
            <div
              className="h-full w-full"
              style={{
                background: `linear-gradient(${45 + fold.rotate}deg, #fce7f3 0%, #f9a8d4 100%)`,
                clipPath:
                  fold.rotate === 0
                    ? 'polygon(0 0, 100% 0, 0 100%)'
                    : fold.rotate === 90
                      ? 'polygon(100% 0, 100% 100%, 0 100%)'
                      : fold.rotate === 180
                        ? 'polygon(0 0, 100% 100%, 0 100%)'
                        : 'polygon(0 0, 100% 0, 100% 100%)',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
              }}
            />
          </motion.div>
        ))}

        {/* Inner folds */}
        {[
          { x: 0.25, y: 0.25, delay: 1.1 },
          { x: 0.75, y: 0.25, delay: 1.3 },
          { x: 0.25, y: 0.75, delay: 1.5 },
          { x: 0.75, y: 0.75, delay: 1.7 },
        ].map((inner, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              width: '25%',
              height: '25%',
              left: `${inner.x * 100 - 12.5}%`,
              top: `${inner.y * 100 - 12.5}%`,
              transformStyle: 'preserve-3d',
            }}
            initial={{ scale: 1, rotateZ: 45, opacity: 1 }}
            animate={{ scale: 0, rotateZ: 180, opacity: 0 }}
            transition={{
              duration: 0.6,
              ease: [0.4, 0, 0.2, 1],
              delay: inner.delay,
            }}
          >
            <div
              className="h-full w-full"
              style={{
                background: 'linear-gradient(135deg, #fbcfe8 0%, #ec4899 100%)',
                clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
              }}
            />
          </motion.div>
        ))}

        {/* Central crane shape */}
        <motion.div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          initial={{ scale: 1, rotateY: 0, opacity: 1 }}
          animate={{ scale: 0, rotateY: 360, opacity: 0 }}
          transition={{ duration: 1, ease: [0.4, 0, 0.2, 1], delay: 2 }}
        >
          <svg
            width={size * 0.4}
            height={size * 0.4}
            viewBox="0 0 100 100"
            className="text-pink-500"
          >
            {/* Simple crane silhouette */}
            <path
              d="M50,10 L70,50 L90,40 L70,55 L80,90 L50,70 L20,90 L30,55 L10,40 L30,50 Z"
              fill="currentColor"
              stroke="#be185d"
              strokeWidth="1"
            />
          </svg>
        </motion.div>
      </div>

      {/* Floating petals */}
      {Array.from({ length: 15 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-xl"
          style={{
            left: `${Math.random() * 100}%`,
            top: '-10%',
          }}
          animate={{
            y: ['0vh', '110vh'],
            x: [0, Math.sin(i) * 100],
            rotate: [0, 360],
          }}
          transition={{
            duration: 5 + Math.random() * 3,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: 'linear',
          }}
        >
          🌸
        </motion.div>
      ))}

      {/* Replay button */}
      <motion.button
        className="absolute bottom-4 right-4 z-20 rounded-full bg-rose-600/80 px-4 py-2 text-sm text-rose-100 backdrop-blur-sm transition-colors hover:bg-rose-500"
        onClick={() => setAnimationKey((k) => k + 1)}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 4 }}
      >
        Replay
      </motion.button>
    </div>
  )
}
