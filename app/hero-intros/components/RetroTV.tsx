'use client'

import { motion } from 'framer-motion'
import { useEffect, useState, useRef } from 'react'
import type { HeroIntroProps } from '../types'

export default function RetroTV({ isFullscreen, isPlaying }: HeroIntroProps) {
  const [animationKey, setAnimationKey] = useState(0)
  const [phase, setPhase] = useState<'off' | 'static' | 'warming' | 'on'>('off')
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (isPlaying) {
      setAnimationKey((k) => k + 1)
    }
  }, [isPlaying])

  useEffect(() => {
    setPhase('off')
    const t1 = setTimeout(() => setPhase('static'), 300)
    const t2 = setTimeout(() => setPhase('warming'), 1500)
    const t3 = setTimeout(() => setPhase('on'), 2500)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
    }
  }, [animationKey])

  // Static noise effect
  useEffect(() => {
    if (phase !== 'static' && phase !== 'warming') return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationId: number
    const drawNoise = () => {
      const imageData = ctx.createImageData(canvas.width, canvas.height)
      const intensity = phase === 'static' ? 1 : 0.3
      for (let i = 0; i < imageData.data.length; i += 4) {
        const value = Math.random() * 255 * intensity
        imageData.data[i] = value
        imageData.data[i + 1] = value
        imageData.data[i + 2] = value
        imageData.data[i + 3] = 255
      }
      ctx.putImageData(imageData, 0, 0)
      animationId = requestAnimationFrame(drawNoise)
    }
    drawNoise()
    return () => cancelAnimationFrame(animationId)
  }, [phase])

  const tvWidth = isFullscreen ? 500 : 300
  const tvHeight = isFullscreen ? 400 : 240

  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-gradient-to-b from-amber-100 via-orange-100 to-amber-200">
      {/* 70s wallpaper pattern */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `radial-gradient(circle at 25px 25px, #c2410c 2px, transparent 0),
                            radial-gradient(circle at 75px 75px, #c2410c 2px, transparent 0)`,
          backgroundSize: '100px 100px',
        }}
      />

      {/* TV Set */}
      <div
        key={animationKey}
        className="relative"
        style={{
          width: tvWidth,
          height: tvHeight,
        }}
      >
        {/* TV Cabinet */}
        <div
          className="absolute inset-0 rounded-3xl shadow-2xl"
          style={{
            background: 'linear-gradient(135deg, #8B4513 0%, #654321 50%, #4a3520 100%)',
            border: '8px solid #5c3d2e',
          }}
        >
          {/* Wood grain texture */}
          <div
            className="absolute inset-0 rounded-2xl opacity-30"
            style={{
              backgroundImage: `repeating-linear-gradient(
                90deg,
                transparent 0px,
                rgba(0,0,0,0.1) 1px,
                transparent 2px,
                transparent 8px
              )`,
            }}
          />
        </div>

        {/* Screen bezel */}
        <div
          className="absolute rounded-lg"
          style={{
            top: '8%',
            left: '8%',
            right: '25%',
            bottom: '15%',
            background: 'linear-gradient(145deg, #1a1a1a 0%, #333 100%)',
            boxShadow: 'inset 0 0 20px rgba(0,0,0,0.8)',
          }}
        >
          {/* Screen (curved effect) */}
          <div
            className="absolute inset-2 overflow-hidden rounded"
            style={{
              background: phase === 'off' ? '#111' : 'transparent',
              boxShadow: 'inset 0 0 30px rgba(0,0,0,0.5)',
            }}
          >
            {/* Static noise canvas */}
            <canvas
              ref={canvasRef}
              width={200}
              height={150}
              className="absolute inset-0 h-full w-full"
              style={{
                opacity: phase === 'static' ? 1 : phase === 'warming' ? 0.5 : 0,
              }}
            />

            {/* Screen glow when warming up */}
            {phase === 'warming' && (
              <motion.div
                className="absolute inset-0 bg-white"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.8, 0.4, 0.6, 0.3] }}
                transition={{ duration: 1, times: [0, 0.2, 0.4, 0.6, 1] }}
              />
            )}

            {/* Content when on */}
            {phase === 'on' && (
              <motion.div
                className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                {/* Scan lines */}
                <div
                  className="pointer-events-none absolute inset-0 opacity-20"
                  style={{
                    backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.3) 2px, rgba(0,0,0,0.3) 4px)',
                  }}
                />

                <div className="relative z-10 text-center">
                  <motion.div
                    className="mb-2 text-4xl"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3, type: 'spring' }}
                  >
                    📺
                  </motion.div>
                  <motion.h1
                    className={`font-bold text-white ${isFullscreen ? 'text-2xl' : 'text-lg'}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}
                  >
                    Now Playing
                  </motion.h1>
                </div>
              </motion.div>
            )}

            {/* Screen reflection */}
            <div
              className="pointer-events-none absolute inset-0 rounded"
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%)',
              }}
            />
          </div>
        </div>

        {/* Control panel */}
        <div
          className="absolute right-4 top-1/4 bottom-1/4 flex w-16 flex-col items-center justify-around rounded-lg py-4"
          style={{
            background: 'linear-gradient(180deg, #2a2a2a 0%, #1a1a1a 100%)',
          }}
        >
          {/* Channel knob */}
          <motion.div
            className="flex h-10 w-10 items-center justify-center rounded-full"
            style={{
              background: 'linear-gradient(145deg, #c0c0c0 0%, #808080 100%)',
              boxShadow: '2px 2px 4px rgba(0,0,0,0.5)',
            }}
            animate={phase === 'static' ? { rotate: 45 } : { rotate: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="h-3 w-1 rounded-full bg-gray-600" />
          </motion.div>

          {/* Volume knob */}
          <div
            className="flex h-8 w-8 items-center justify-center rounded-full"
            style={{
              background: 'linear-gradient(145deg, #c0c0c0 0%, #808080 100%)',
            }}
          >
            <div className="h-2 w-0.5 rounded-full bg-gray-600" />
          </div>

          {/* Power light */}
          <motion.div
            className="h-3 w-3 rounded-full"
            style={{
              background: phase === 'off' ? '#333' : '#22c55e',
              boxShadow: phase !== 'off' ? '0 0 10px #22c55e' : 'none',
            }}
          />
        </div>

        {/* Speaker grille */}
        <div
          className="absolute bottom-3 left-1/4 right-1/3 h-8 rounded"
          style={{
            background: 'linear-gradient(180deg, #2a2a2a 0%, #1a1a1a 100%)',
          }}
        >
          {Array.from({ length: 15 }).map((_, i) => (
            <div
              key={i}
              className="absolute top-1 bottom-1 w-1 rounded-full bg-gray-700"
              style={{ left: `${5 + i * 6}%` }}
            />
          ))}
        </div>

        {/* Antenna */}
        <div className="absolute -top-16 left-1/3 flex gap-8">
          <motion.div
            className="h-16 w-1 origin-bottom rounded-full bg-gray-400"
            style={{ transform: 'rotate(-20deg)' }}
          />
          <motion.div
            className="h-16 w-1 origin-bottom rounded-full bg-gray-400"
            style={{ transform: 'rotate(20deg)' }}
          />
        </div>
      </div>

      {/* Floor shadow */}
      <div
        className="absolute bottom-20 left-1/2 h-4 -translate-x-1/2 rounded-full opacity-20"
        style={{
          width: tvWidth * 1.2,
          background: 'radial-gradient(ellipse, #000 0%, transparent 70%)',
        }}
      />

      {/* Replay button */}
      <motion.button
        className="absolute bottom-4 right-4 z-20 rounded-full bg-amber-800/80 px-4 py-2 text-sm text-amber-100 backdrop-blur-sm transition-colors hover:bg-amber-700"
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
