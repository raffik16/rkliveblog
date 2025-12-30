'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import type { HeroIntroProps } from '../types'

export default function GrandDoor({ isFullscreen, isPlaying }: HeroIntroProps) {
  const [animationKey, setAnimationKey] = useState(0)

  useEffect(() => {
    if (isPlaying) {
      setAnimationKey((k) => k + 1)
    }
  }, [isPlaying])

  const doorWidth = isFullscreen ? 200 : 120
  const doorHeight = isFullscreen ? 450 : 280

  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-gradient-to-b from-stone-900 via-stone-800 to-stone-900">
      {/* Stone wall texture */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.2'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* Revealed content */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-sky-200 via-amber-50 to-emerald-100"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
      >
        {/* Light rays coming through */}
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ delay: 1.8, duration: 1.5 }}
        >
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="absolute left-1/2 top-0 h-full origin-top"
              style={{
                width: '150px',
                background: 'linear-gradient(180deg, rgba(255,255,200,0.3) 0%, transparent 100%)',
                transform: `translateX(-50%) rotate(${(i - 3.5) * 8}deg)`,
              }}
            />
          ))}
        </motion.div>

        <div className="relative z-10 text-center">
          <motion.div
            className="mb-4 text-5xl"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 2.2, type: 'spring', stiffness: 200 }}
          >
            🏛️
          </motion.div>
          <motion.h1
            className={`font-serif font-bold text-stone-800 ${isFullscreen ? 'text-5xl' : 'text-2xl'}`}
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 2.5 }}
          >
            Welcome Home
          </motion.h1>
          <motion.p
            className={`mt-3 text-stone-600 ${isFullscreen ? 'text-lg' : 'text-xs'}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.8 }}
          >
            Beyond these doors, your journey awaits
          </motion.p>
        </div>
      </motion.div>

      {/* Door Frame */}
      <div
        key={animationKey}
        className="relative z-10"
        style={{
          perspective: '1500px',
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Stone archway */}
        <div
          className="absolute -inset-8 rounded-t-full"
          style={{
            background: 'linear-gradient(135deg, #44403c 0%, #292524 50%, #1c1917 100%)',
            boxShadow: 'inset 0 0 30px rgba(0,0,0,0.5)',
          }}
        />

        {/* Keystone */}
        <div
          className="absolute -top-12 left-1/2 -translate-x-1/2"
          style={{
            width: '60px',
            height: '40px',
            background: 'linear-gradient(180deg, #57534e 0%, #44403c 100%)',
            clipPath: 'polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)',
          }}
        />

        {/* Left Door */}
        <motion.div
          className="absolute overflow-hidden rounded-tl-full shadow-2xl"
          style={{
            width: doorWidth,
            height: doorHeight,
            right: doorWidth,
            background: 'linear-gradient(135deg, #78350f 0%, #451a03 100%)',
            transformOrigin: 'left center',
            transformStyle: 'preserve-3d',
          }}
          initial={{ rotateY: 0 }}
          animate={{ rotateY: -110 }}
          transition={{ duration: 2, ease: [0.25, 0.1, 0.25, 1], delay: 0.5 }}
        >
          {/* Door panels */}
          <div className="absolute inset-4 flex flex-col gap-3">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="flex-1 rounded border border-amber-900/50 bg-gradient-to-br from-amber-900/30 to-transparent"
              />
            ))}
          </div>

          {/* Iron studs */}
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="absolute h-3 w-3 rounded-full bg-gradient-to-br from-gray-400 to-gray-600"
              style={{
                top: `${15 + i * 15}%`,
                right: '15%',
                boxShadow: 'inset 1px 1px 2px rgba(255,255,255,0.3), 2px 2px 4px rgba(0,0,0,0.5)',
              }}
            />
          ))}

          {/* Door handle */}
          <div
            className="absolute right-4 top-1/2 h-16 w-4 -translate-y-1/2 rounded-full"
            style={{
              background: 'linear-gradient(90deg, #b8860b 0%, #daa520 50%, #b8860b 100%)',
              boxShadow: '2px 2px 6px rgba(0,0,0,0.5)',
            }}
          />
        </motion.div>

        {/* Right Door */}
        <motion.div
          className="overflow-hidden rounded-tr-full shadow-2xl"
          style={{
            width: doorWidth,
            height: doorHeight,
            background: 'linear-gradient(225deg, #78350f 0%, #451a03 100%)',
            transformOrigin: 'right center',
            transformStyle: 'preserve-3d',
          }}
          initial={{ rotateY: 0 }}
          animate={{ rotateY: 110 }}
          transition={{ duration: 2, ease: [0.25, 0.1, 0.25, 1], delay: 0.5 }}
        >
          {/* Door panels */}
          <div className="absolute inset-4 flex flex-col gap-3">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="flex-1 rounded border border-amber-900/50 bg-gradient-to-bl from-amber-900/30 to-transparent"
              />
            ))}
          </div>

          {/* Iron studs */}
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="absolute h-3 w-3 rounded-full bg-gradient-to-br from-gray-400 to-gray-600"
              style={{
                top: `${15 + i * 15}%`,
                left: '15%',
                boxShadow: 'inset 1px 1px 2px rgba(255,255,255,0.3), 2px 2px 4px rgba(0,0,0,0.5)',
              }}
            />
          ))}

          {/* Door handle */}
          <div
            className="absolute left-4 top-1/2 h-16 w-4 -translate-y-1/2 rounded-full"
            style={{
              background: 'linear-gradient(90deg, #b8860b 0%, #daa520 50%, #b8860b 100%)',
              boxShadow: '-2px 2px 6px rgba(0,0,0,0.5)',
            }}
          />
        </motion.div>
      </div>

      {/* Replay button */}
      <motion.button
        className="absolute bottom-4 right-4 z-20 rounded-full bg-stone-700/80 px-4 py-2 text-sm text-stone-100 backdrop-blur-sm transition-colors hover:bg-stone-600"
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
