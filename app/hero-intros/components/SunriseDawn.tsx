'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import type { HeroIntroProps } from '../types'

export default function SunriseDawn({ isFullscreen, isPlaying }: HeroIntroProps) {
  const [animationKey, setAnimationKey] = useState(0)

  useEffect(() => {
    if (isPlaying) {
      setAnimationKey((k) => k + 1)
    }
  }, [isPlaying])

  return (
    <div key={animationKey} className="relative h-full w-full overflow-hidden">
      {/* Sky gradient that transitions from night to day */}
      <motion.div
        className="absolute inset-0"
        initial={{
          background: 'linear-gradient(180deg, #0f172a 0%, #1e1b4b 30%, #312e81 60%, #4c1d95 100%)',
        }}
        animate={{
          background: 'linear-gradient(180deg, #7dd3fc 0%, #fcd34d 30%, #fb923c 60%, #f97316 100%)',
        }}
        transition={{ duration: 3, ease: 'easeOut' }}
      />

      {/* Stars (fade out) */}
      {Array.from({ length: 50 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute h-1 w-1 rounded-full bg-white"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 60}%`,
          }}
          initial={{ opacity: 0.8, scale: 1 }}
          animate={{ opacity: 0, scale: 0 }}
          transition={{ duration: 2, delay: 0.5 + Math.random() * 1 }}
        />
      ))}

      {/* Mountains silhouette */}
      <div className="absolute bottom-0 left-0 right-0 h-1/3">
        <svg viewBox="0 0 400 150" className="h-full w-full" preserveAspectRatio="xMidYMax slice">
          <motion.path
            d="M0,150 L0,100 L40,80 L80,95 L120,60 L160,85 L200,40 L240,70 L280,55 L320,80 L360,65 L400,90 L400,150 Z"
            initial={{ fill: '#1e1b4b' }}
            animate={{ fill: '#1e3a5f' }}
            transition={{ duration: 3 }}
          />
          <motion.path
            d="M0,150 L0,120 L50,100 L100,115 L150,90 L200,110 L250,85 L300,105 L350,95 L400,110 L400,150 Z"
            initial={{ fill: '#312e81' }}
            animate={{ fill: '#0f4c5c' }}
            transition={{ duration: 3 }}
          />
        </svg>
      </div>

      {/* Sun rising */}
      <motion.div
        className="absolute left-1/2 -translate-x-1/2"
        initial={{ bottom: '-10%' }}
        animate={{ bottom: '35%' }}
        transition={{ duration: 3, ease: [0.4, 0, 0.2, 1] }}
      >
        {/* Sun glow */}
        <motion.div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            width: isFullscreen ? 300 : 180,
            height: isFullscreen ? 300 : 180,
          }}
          initial={{ opacity: 0.3 }}
          animate={{ opacity: 0.8 }}
          transition={{ duration: 3 }}
        >
          <div
            className="h-full w-full rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(251,191,36,0.6) 0%, rgba(251,146,60,0.3) 40%, transparent 70%)',
            }}
          />
        </motion.div>

        {/* Sun disc */}
        <motion.div
          className="relative rounded-full"
          style={{
            width: isFullscreen ? 120 : 70,
            height: isFullscreen ? 120 : 70,
            background: 'radial-gradient(circle at 30% 30%, #fef08a 0%, #fbbf24 50%, #f59e0b 100%)',
            boxShadow: '0 0 60px rgba(251,191,36,0.8), 0 0 120px rgba(251,146,60,0.5)',
          }}
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 3 }}
        />

        {/* Sun rays */}
        {Array.from({ length: 12 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute left-1/2 top-1/2 origin-bottom"
            style={{
              width: 4,
              height: isFullscreen ? 200 : 120,
              background: 'linear-gradient(180deg, rgba(251,191,36,0.4) 0%, transparent 100%)',
              transform: `translate(-50%, -100%) rotate(${i * 30}deg)`,
            }}
            initial={{ opacity: 0, scaleY: 0 }}
            animate={{ opacity: 0.6, scaleY: 1 }}
            transition={{ duration: 1.5, delay: 2 + i * 0.1 }}
          />
        ))}
      </motion.div>

      {/* Clouds */}
      {[
        { x: '10%', y: '20%', scale: 1, delay: 1.5 },
        { x: '70%', y: '15%', scale: 0.8, delay: 1.8 },
        { x: '40%', y: '25%', scale: 1.2, delay: 2.1 },
      ].map((cloud, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{ left: cloud.x, top: cloud.y, transform: `scale(${cloud.scale})` }}
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 0.9, x: 0 }}
          transition={{ duration: 1.5, delay: cloud.delay }}
        >
          <div className="flex gap-1">
            <div className="h-8 w-12 rounded-full bg-white/90" />
            <div className="-ml-4 h-12 w-16 rounded-full bg-white/90" />
            <div className="-ml-4 h-10 w-14 rounded-full bg-white/90" />
            <div className="-ml-4 h-8 w-10 rounded-full bg-white/90" />
          </div>
        </motion.div>
      ))}

      {/* Content */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5, duration: 1 }}
      >
        <div className="text-center">
          <motion.div
            className="mb-4 text-5xl"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 2.8 }}
          >
            🌅
          </motion.div>
          <motion.h1
            className={`font-bold ${isFullscreen ? 'text-5xl' : 'text-2xl'}`}
            style={{
              background: 'linear-gradient(180deg, #fef3c7 0%, #f59e0b 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '0 2px 20px rgba(251,191,36,0.5)',
            }}
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 3 }}
          >
            A New Dawn
          </motion.h1>
          <motion.p
            className={`mt-3 text-amber-100 ${isFullscreen ? 'text-lg' : 'text-xs'}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3.3 }}
          >
            Every sunrise brings new opportunities
          </motion.p>
        </div>
      </motion.div>

      {/* Birds flying */}
      {Array.from({ length: 5 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-lg text-gray-700/60"
          initial={{ left: '-5%', top: `${20 + i * 8}%` }}
          animate={{ left: '110%' }}
          transition={{
            duration: 8 + i * 2,
            delay: 2.5 + i * 0.3,
            ease: 'linear',
          }}
        >
          🐦
        </motion.div>
      ))}

      {/* Replay button */}
      <motion.button
        className="absolute bottom-4 right-4 z-20 rounded-full bg-orange-700/80 px-4 py-2 text-sm text-orange-100 backdrop-blur-sm transition-colors hover:bg-orange-600"
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
