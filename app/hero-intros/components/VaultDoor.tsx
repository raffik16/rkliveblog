'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import type { HeroIntroProps } from '../types'

export default function VaultDoor({ isFullscreen, isPlaying }: HeroIntroProps) {
  const [animationKey, setAnimationKey] = useState(0)
  const [dialRotation, setDialRotation] = useState(0)
  const [phase, setPhase] = useState<'locked' | 'unlocking' | 'opening' | 'open'>('locked')

  useEffect(() => {
    if (isPlaying) {
      setAnimationKey((k) => k + 1)
    }
  }, [isPlaying])

  useEffect(() => {
    setPhase('locked')
    setDialRotation(0)

    // Dial spinning animation
    const dialInterval = setInterval(() => {
      setDialRotation((r) => r + 15)
    }, 50)

    const t1 = setTimeout(() => {
      clearInterval(dialInterval)
      setPhase('unlocking')
    }, 1500)

    const t2 = setTimeout(() => setPhase('opening'), 2200)
    const t3 = setTimeout(() => setPhase('open'), 2500)

    return () => {
      clearInterval(dialInterval)
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
    }
  }, [animationKey])

  const vaultSize = isFullscreen ? 400 : 250

  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-gradient-to-br from-gray-800 via-gray-900 to-black">
      {/* Industrial background */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 50px,
            rgba(100,100,100,0.1) 50px,
            rgba(100,100,100,0.1) 51px
          ),
          repeating-linear-gradient(
            90deg,
            transparent,
            transparent 50px,
            rgba(100,100,100,0.1) 50px,
            rgba(100,100,100,0.1) 51px
          )`,
        }}
      />

      {/* Treasure content behind vault */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: phase === 'open' ? 1 : 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Golden glow */}
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(circle at center, rgba(251,191,36,0.3) 0%, rgba(0,0,0,0.9) 70%)',
          }}
        />

        {/* Treasure pile silhouette */}
        <motion.div
          className="absolute bottom-0 left-1/4 right-1/4 h-1/3"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: phase === 'open' ? 1 : 0, y: phase === 'open' ? 0 : 50 }}
          transition={{ delay: 0.3 }}
        >
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-2xl"
              style={{
                left: `${Math.random() * 100}%`,
                bottom: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -5, 0],
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 2 + Math.random(),
                repeat: Infinity,
                delay: Math.random(),
              }}
            >
              {['💰', '💎', '👑', '🏆', '💵'][i % 5]}
            </motion.div>
          ))}
        </motion.div>

        <div className="relative z-10 text-center">
          <motion.div
            className="mb-4 text-6xl"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: phase === 'open' ? 1 : 0, rotate: phase === 'open' ? 0 : -180 }}
            transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
          >
            🔓
          </motion.div>
          <motion.h1
            className={`font-bold text-amber-400 ${isFullscreen ? 'text-5xl' : 'text-2xl'}`}
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: phase === 'open' ? 0 : 30, opacity: phase === 'open' ? 1 : 0 }}
            transition={{ delay: 0.7 }}
            style={{ textShadow: '0 0 20px rgba(251,191,36,0.8)' }}
          >
            ACCESS GRANTED
          </motion.h1>
          <motion.p
            className={`mt-3 text-amber-200/80 ${isFullscreen ? 'text-lg' : 'text-xs'}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: phase === 'open' ? 1 : 0 }}
            transition={{ delay: 1 }}
          >
            The treasures within await you
          </motion.p>
        </div>
      </motion.div>

      {/* Vault Door */}
      <motion.div
        key={animationKey}
        className="relative z-10"
        style={{
          width: vaultSize,
          height: vaultSize,
          perspective: '1500px',
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Door frame */}
        <div
          className="absolute -inset-6 rounded-full"
          style={{
            background: 'linear-gradient(145deg, #4a4a4a 0%, #2a2a2a 50%, #1a1a1a 100%)',
            boxShadow: 'inset 0 0 30px rgba(0,0,0,0.8), 0 0 50px rgba(0,0,0,0.5)',
          }}
        />

        {/* Main door */}
        <motion.div
          className="absolute inset-0 overflow-hidden rounded-full"
          style={{
            background: 'linear-gradient(145deg, #555 0%, #333 50%, #222 100%)',
            transformOrigin: 'left center',
            transformStyle: 'preserve-3d',
            boxShadow: 'inset 0 0 20px rgba(0,0,0,0.5)',
          }}
          animate={{
            rotateY: phase === 'opening' || phase === 'open' ? -120 : 0,
          }}
          transition={{ duration: 1.5, ease: [0.4, 0, 0.2, 1] }}
        >
          {/* Bolt holes around edge */}
          {Array.from({ length: 12 }).map((_, i) => {
            const angle = (i / 12) * 360
            const x = 50 + 42 * Math.cos((angle * Math.PI) / 180)
            const y = 50 + 42 * Math.sin((angle * Math.PI) / 180)
            return (
              <div
                key={i}
                className="absolute h-3 w-3 rounded-full"
                style={{
                  left: `${x}%`,
                  top: `${y}%`,
                  transform: 'translate(-50%, -50%)',
                  background: 'linear-gradient(145deg, #666 0%, #333 100%)',
                  boxShadow: 'inset 1px 1px 2px rgba(255,255,255,0.2), inset -1px -1px 2px rgba(0,0,0,0.5)',
                }}
              />
            )
          })}

          {/* Inner ring */}
          <div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              width: '70%',
              height: '70%',
              border: '8px solid #444',
              boxShadow: 'inset 0 0 15px rgba(0,0,0,0.5)',
            }}
          />

          {/* Combination dial */}
          <motion.div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              width: '40%',
              height: '40%',
              background: 'linear-gradient(145deg, #3a3a3a 0%, #1a1a1a 100%)',
              border: '4px solid #555',
            }}
            animate={{ rotate: dialRotation }}
          >
            {/* Dial numbers */}
            {Array.from({ length: 12 }).map((_, i) => {
              const angle = (i / 12) * 360 - 90
              return (
                <div
                  key={i}
                  className="absolute text-xs font-bold text-gray-400"
                  style={{
                    left: '50%',
                    top: '50%',
                    transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-35%) rotate(${-angle}deg)`,
                  }}
                >
                  {i * 8}
                </div>
              )
            })}

            {/* Dial indicator */}
            <div
              className="absolute left-1/2 top-2 h-3 w-1 -translate-x-1/2 rounded-full bg-red-500"
              style={{ boxShadow: '0 0 5px rgba(239,68,68,0.8)' }}
            />
          </motion.div>

          {/* Handle wheel */}
          <motion.div
            className="absolute right-[15%] top-1/2 -translate-y-1/2"
            style={{
              width: '20%',
              height: '20%',
            }}
            animate={{
              rotate: phase === 'unlocking' ? 360 : 0,
            }}
            transition={{ duration: 0.7 }}
          >
            {/* Wheel spokes */}
            {[0, 60, 120].map((angle) => (
              <div
                key={angle}
                className="absolute left-1/2 top-1/2 h-1 w-full origin-left -translate-y-1/2 rounded-full bg-gradient-to-r from-gray-500 to-gray-400"
                style={{ transform: `translateY(-50%) rotate(${angle}deg)` }}
              />
            ))}
            {/* Center hub */}
            <div
              className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{
                background: 'linear-gradient(145deg, #666 0%, #333 100%)',
              }}
            />
          </motion.div>

          {/* Locking bolts */}
          {[-1, 0, 1].map((i) => (
            <motion.div
              key={i}
              className="absolute left-0 h-4 rounded-r-full"
              style={{
                top: `${45 + i * 10}%`,
                width: '15%',
                background: 'linear-gradient(90deg, #666 0%, #888 50%, #666 100%)',
              }}
              animate={{
                x: phase === 'unlocking' || phase === 'opening' || phase === 'open' ? -30 : 0,
              }}
              transition={{ duration: 0.3, delay: i * 0.1 + 0.2 }}
            />
          ))}
        </motion.div>
      </motion.div>

      {/* Status indicator */}
      <motion.div
        className="absolute top-8 flex items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <motion.div
          className="h-3 w-3 rounded-full"
          animate={{
            backgroundColor:
              phase === 'open'
                ? '#22c55e'
                : phase === 'unlocking' || phase === 'opening'
                  ? '#eab308'
                  : '#ef4444',
          }}
          style={{ boxShadow: '0 0 10px currentColor' }}
        />
        <span className="font-mono text-sm uppercase text-gray-400">
          {phase === 'open' ? 'OPEN' : phase === 'unlocking' ? 'UNLOCKING...' : phase === 'opening' ? 'OPENING...' : 'LOCKED'}
        </span>
      </motion.div>

      {/* Replay button */}
      <motion.button
        className="absolute bottom-4 right-4 z-20 rounded-full bg-gray-700/80 px-4 py-2 text-sm text-gray-100 backdrop-blur-sm transition-colors hover:bg-gray-600"
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
