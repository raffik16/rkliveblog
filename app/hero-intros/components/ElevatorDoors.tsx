'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import type { HeroIntroProps } from '../types'

export default function ElevatorDoors({ isFullscreen, isPlaying }: HeroIntroProps) {
  const [animationKey, setAnimationKey] = useState(0)
  const [floor, setFloor] = useState(1)

  useEffect(() => {
    if (isPlaying) {
      setAnimationKey((k) => k + 1)
    }
  }, [isPlaying])

  useEffect(() => {
    setFloor(1)
    const intervals = [
      setTimeout(() => setFloor(2), 400),
      setTimeout(() => setFloor(3), 800),
      setTimeout(() => setFloor(4), 1200),
      setTimeout(() => setFloor(5), 1600),
    ]
    return () => intervals.forEach(clearTimeout)
  }, [animationKey])

  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-gradient-to-b from-stone-200 via-stone-100 to-stone-200">
      {/* Marble texture */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0 Q25 10 50 0 T100 0 L100 100 Q75 90 50 100 T0 100Z' fill='%23a8a29e' fill-opacity='0.1'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Lobby content behind doors */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5, duration: 0.8 }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-amber-50 via-amber-100 to-amber-200" />

        {/* Chandelier */}
        <motion.div
          className="absolute top-8 left-1/2 -translate-x-1/2"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 2.8, duration: 0.6 }}
        >
          <div className="flex flex-col items-center">
            <div className="h-4 w-1 bg-amber-700" />
            <div className="relative h-16 w-32">
              {[-2, -1, 0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="absolute top-0 text-xl"
                  style={{ left: `${50 + i * 15}%`, transform: 'translateX(-50%)' }}
                  animate={{ opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                >
                  💡
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        <div className="relative z-10 text-center">
          <motion.div
            className="mb-4 text-5xl"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 3, type: 'spring' }}
          >
            🏢
          </motion.div>
          <motion.h1
            className={`font-light tracking-widest text-amber-900 ${isFullscreen ? 'text-5xl' : 'text-2xl'}`}
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 3.2 }}
          >
            WELCOME
          </motion.h1>
          <motion.p
            className={`mt-3 text-amber-700 ${isFullscreen ? 'text-lg' : 'text-xs'}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3.5 }}
          >
            You've arrived at your destination
          </motion.p>
        </div>
      </motion.div>

      {/* Elevator frame */}
      <div
        key={animationKey}
        className="relative z-10"
        style={{
          width: isFullscreen ? 400 : 250,
          height: isFullscreen ? 500 : 320,
        }}
      >
        {/* Frame border */}
        <div
          className="absolute -inset-4 rounded-lg"
          style={{
            background:
              'linear-gradient(135deg, #b8860b 0%, #daa520 30%, #ffd700 50%, #daa520 70%, #b8860b 100%)',
            boxShadow: '0 0 30px rgba(184,134,11,0.3)',
          }}
        />

        {/* Inner frame */}
        <div className="absolute inset-0 overflow-hidden rounded bg-gray-900">
          {/* Floor indicator above doors */}
          <div className="absolute -top-0 right-0 left-0 flex h-10 items-center justify-center bg-gradient-to-b from-gray-800 to-gray-900">
            <div className="flex items-center gap-2">
              <motion.span
                className="font-mono text-lg text-red-500"
                style={{ fontFamily: 'monospace', textShadow: '0 0 10px rgba(239,68,68,0.8)' }}
                key={floor}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {floor}
              </motion.span>
              <motion.span
                className="text-green-500"
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 0.5, repeat: floor < 5 ? Infinity : 0 }}
              >
                ▲
              </motion.span>
            </div>
          </div>

          {/* Left door */}
          <motion.div
            className="absolute top-10 bottom-0 left-0"
            style={{
              width: '50%',
              background:
                'linear-gradient(90deg, #a1a1aa 0%, #d4d4d8 20%, #a1a1aa 40%, #d4d4d8 60%, #a1a1aa 80%, #d4d4d8 100%)',
            }}
            initial={{ x: 0 }}
            animate={{ x: '-95%' }}
            transition={{ duration: 1.5, ease: [0.4, 0, 0.2, 1], delay: 2 }}
          >
            {/* Door panel lines */}
            <div className="absolute inset-2 border border-gray-400/30" />
            <div className="absolute inset-4 border border-gray-400/20" />

            {/* Reflection */}
            <div
              className="absolute inset-0 opacity-20"
              style={{
                background:
                  'linear-gradient(135deg, transparent 40%, rgba(255,255,255,0.5) 50%, transparent 60%)',
              }}
            />
          </motion.div>

          {/* Right door */}
          <motion.div
            className="absolute top-10 right-0 bottom-0"
            style={{
              width: '50%',
              background:
                'linear-gradient(90deg, #d4d4d8 0%, #a1a1aa 20%, #d4d4d8 40%, #a1a1aa 60%, #d4d4d8 80%, #a1a1aa 100%)',
            }}
            initial={{ x: 0 }}
            animate={{ x: '95%' }}
            transition={{ duration: 1.5, ease: [0.4, 0, 0.2, 1], delay: 2 }}
          >
            {/* Door panel lines */}
            <div className="absolute inset-2 border border-gray-400/30" />
            <div className="absolute inset-4 border border-gray-400/20" />

            {/* Reflection */}
            <div
              className="absolute inset-0 opacity-20"
              style={{
                background:
                  'linear-gradient(135deg, transparent 40%, rgba(255,255,255,0.5) 50%, transparent 60%)',
              }}
            />
          </motion.div>

          {/* Center gap/seam */}
          <div className="absolute top-10 bottom-0 left-1/2 w-px -translate-x-1/2 bg-gray-600" />
        </div>
      </div>

      {/* Ding sound indicator */}
      <motion.div
        className="absolute top-8 text-center"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: [0, 1, 0], scale: [0.5, 1, 0.5] }}
        transition={{ delay: 1.9, duration: 0.5 }}
      >
        <div className="text-3xl">🔔</div>
        <div className="text-xs text-gray-500">*ding*</div>
      </motion.div>

      {/* Replay button */}
      <motion.button
        className="absolute right-4 bottom-4 z-20 rounded-full bg-amber-800/80 px-4 py-2 text-sm text-amber-100 backdrop-blur-sm transition-colors hover:bg-amber-700"
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
