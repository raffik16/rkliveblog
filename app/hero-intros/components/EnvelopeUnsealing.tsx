'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import type { HeroIntroProps } from '../types'

export default function EnvelopeUnsealing({ isFullscreen, isPlaying }: HeroIntroProps) {
  const [animationKey, setAnimationKey] = useState(0)

  useEffect(() => {
    if (isPlaying) {
      setAnimationKey((k) => k + 1)
    }
  }, [isPlaying])

  const envelopeWidth = isFullscreen ? 400 : 240
  const envelopeHeight = isFullscreen ? 280 : 170

  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-gradient-to-br from-rose-50 via-amber-50 to-rose-100">
      {/* Decorative background */}
      <div className="absolute inset-0 opacity-20">
        {Array.from({ length: 30 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-2xl"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              rotate: [0, 10, -10, 0],
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          >
            💌
          </motion.div>
        ))}
      </div>

      {/* Letter content revealed */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5, duration: 0.8 }}
      >
        <div className="text-center">
          <motion.div
            className="mb-4 text-5xl"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 2.8, type: 'spring' }}
          >
            💝
          </motion.div>
          <motion.h1
            className={`font-serif font-bold text-rose-800 ${isFullscreen ? 'text-5xl' : 'text-2xl'}`}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 3 }}
          >
            You Have Mail
          </motion.h1>
          <motion.p
            className={`mt-3 text-rose-600 ${isFullscreen ? 'text-lg' : 'text-xs'}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3.3 }}
          >
            A special message awaits you inside
          </motion.p>
        </div>
      </motion.div>

      {/* Envelope */}
      <div
        key={animationKey}
        className="relative z-10"
        style={{
          width: envelopeWidth,
          height: envelopeHeight,
          perspective: '1000px',
        }}
      >
        {/* Envelope body */}
        <div
          className="absolute inset-0 rounded-lg shadow-2xl"
          style={{
            background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
          }}
        >
          {/* Bottom flap pattern */}
          <div
            className="absolute right-0 bottom-0 left-0"
            style={{
              height: '60%',
              background: 'linear-gradient(180deg, transparent 0%, rgba(217,119,6,0.1) 100%)',
            }}
          />
        </div>

        {/* Letter inside */}
        <motion.div
          className="absolute right-4 left-4 rounded bg-white shadow-lg"
          style={{
            top: '10%',
            height: '80%',
          }}
          initial={{ y: 0 }}
          animate={{ y: -envelopeHeight * 0.6 }}
          transition={{ delay: 1.5, duration: 1, ease: [0.4, 0, 0.2, 1] }}
        >
          {/* Letter lines */}
          <div className="flex h-full flex-col gap-2 p-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-2 rounded bg-rose-200/60"
                style={{ width: `${50 + Math.random() * 40}%` }}
              />
            ))}
            <div className="mt-auto text-right font-serif text-rose-400">❤️</div>
          </div>
        </motion.div>

        {/* Top flap (opens) */}
        <motion.div
          className="absolute top-0 right-0 left-0 origin-bottom"
          style={{
            height: envelopeHeight * 0.55,
            transformStyle: 'preserve-3d',
          }}
          initial={{ rotateX: 0 }}
          animate={{ rotateX: 180 }}
          transition={{ duration: 1, ease: [0.4, 0, 0.2, 1], delay: 0.3 }}
        >
          {/* Flap front */}
          <div
            className="absolute inset-0 rounded-t-lg"
            style={{
              background: 'linear-gradient(180deg, #fde68a 0%, #fcd34d 100%)',
              clipPath: 'polygon(0 100%, 50% 0%, 100% 100%)',
              backfaceVisibility: 'hidden',
            }}
          >
            {/* Wax seal */}
            <motion.div
              className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2"
              initial={{ scale: 1 }}
              animate={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <div
                className="flex h-12 w-12 items-center justify-center rounded-full font-serif text-amber-100 shadow-lg"
                style={{
                  background: 'radial-gradient(circle at 30% 30%, #ef4444 0%, #b91c1c 100%)',
                }}
              >
                ✉
              </div>
            </motion.div>
          </div>

          {/* Flap back (visible when flipped) */}
          <div
            className="absolute inset-0 rounded-t-lg"
            style={{
              background: 'linear-gradient(180deg, #fef3c7 0%, #fde68a 100%)',
              clipPath: 'polygon(0 100%, 50% 0%, 100% 100%)',
              backfaceVisibility: 'hidden',
              transform: 'rotateX(180deg)',
            }}
          />
        </motion.div>

        {/* Side flaps (decorative) */}
        <div
          className="absolute right-0 bottom-0 left-0"
          style={{
            height: '50%',
          }}
        >
          <svg viewBox="0 0 100 50" className="h-full w-full" preserveAspectRatio="none">
            <path d="M0,0 L50,50 L100,0 L100,50 L0,50 Z" fill="#fcd34d" />
            <path
              d="M0,0 L50,50 L100,0"
              fill="none"
              stroke="#d97706"
              strokeWidth="0.5"
              opacity="0.3"
            />
          </svg>
        </div>
      </div>

      {/* Floating hearts */}
      {Array.from({ length: 10 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-xl text-rose-400/60"
          style={{
            left: `${10 + Math.random() * 80}%`,
            bottom: '-20px',
          }}
          initial={{ y: 0, opacity: 0 }}
          animate={{ y: -500, opacity: [0, 1, 1, 0] }}
          transition={{
            duration: 4 + Math.random() * 2,
            repeat: Infinity,
            delay: 2 + Math.random() * 2,
          }}
        >
          ♥
        </motion.div>
      ))}

      {/* Replay button */}
      <motion.button
        className="absolute right-4 bottom-4 z-20 rounded-full bg-rose-700/80 px-4 py-2 text-sm text-rose-100 backdrop-blur-sm transition-colors hover:bg-rose-600"
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
