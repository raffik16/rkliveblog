'use client'

import { useRef } from 'react'
import { motion } from 'framer-motion'
import { useClockTime, useFullscreen } from '../hooks/useClockTime'

export default function AtomicStarburst() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { isFullscreen, toggleFullscreen, handleKeyDown } = useFullscreen(containerRef)
  const time = useClockTime(true)

  const clockSize = isFullscreen ? 420 : 300

  // Colors for the balls
  const ballColors = [
    '#FF6B35',
    '#FFD700',
    '#4ECDC4',
    '#FF6B35',
    '#A8E6CF',
    '#FFD93D',
    '#6BCB77',
    '#FF6B35',
    '#4D96FF',
    '#F38181',
    '#AA96DA',
    '#FCBAD3',
  ]

  return (
    <div
      ref={containerRef}
      className="relative flex h-full min-h-[400px] w-full cursor-pointer items-center justify-center overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #1a3a4a 100%)',
      }}
      onClick={toggleFullscreen}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label="Atomic Starburst clock - click for fullscreen"
    >
      {/* Atomic orbit rings in background */}
      <div className="absolute inset-0 flex items-center justify-center opacity-10">
        {[100, 150, 200].map((r, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full border border-white"
            style={{
              width: r * 2,
              height: r * 2,
            }}
            animate={{ rotate: 360 }}
            transition={{
              duration: 20 + i * 10,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        ))}
      </div>

      {/* Main clock - starburst design */}
      <div
        className="relative"
        style={{
          width: clockSize,
          height: clockSize,
        }}
      >
        {/* Starburst rays */}
        <svg viewBox="0 0 300 300" className="absolute inset-0 h-full w-full">
          {[...Array(12)].map((_, i) => {
            const angle = i * 30 * (Math.PI / 180)
            const x2 = 150 + Math.cos(angle) * 145
            const y2 = 150 + Math.sin(angle) * 145
            return (
              <line
                key={i}
                x1="150"
                y1="150"
                x2={x2}
                y2={y2}
                stroke="#FF6B35"
                strokeWidth="3"
                opacity="0.6"
              />
            )
          })}
        </svg>

        {/* Ball clock markers */}
        {[...Array(12)].map((_, i) => {
          const angle = (i * 30 - 90) * (Math.PI / 180)
          const x = 50 + Math.cos(angle) * 42
          const y = 50 + Math.sin(angle) * 42
          return (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                width: `${isFullscreen ? 5 : 4}%`,
                height: `${isFullscreen ? 5 : 4}%`,
                left: `${x}%`,
                top: `${y}%`,
                transform: 'translate(-50%, -50%)',
                background: ballColors[i],
                boxShadow: `0 4px 8px rgba(0,0,0,0.3), inset 0 2px 4px rgba(255,255,255,0.3)`,
              }}
              animate={{
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 2,
                delay: i * 0.1,
                repeat: Infinity,
              }}
            />
          )
        })}

        {/* Central hub with atomic design */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            width: clockSize * 0.15,
            height: clockSize * 0.15,
            background: 'radial-gradient(circle at 30% 30%, #FFD700 0%, #FF6B35 50%, #CC4400 100%)',
            boxShadow: '0 4px 12px rgba(255, 107, 53, 0.5)',
          }}
        />

        {/* Orbiting electrons */}
        {[0, 120, 240].map((offset, i) => (
          <motion.div
            key={i}
            className="absolute top-1/2 left-1/2"
            style={{
              width: clockSize * 0.25,
              height: clockSize * 0.25,
              marginLeft: -clockSize * 0.125,
              marginTop: -clockSize * 0.125,
            }}
            animate={{ rotate: 360 }}
            transition={{
              duration: 3,
              delay: i * 0.3,
              repeat: Infinity,
              ease: 'linear',
            }}
          >
            <div
              className="absolute rounded-full"
              style={{
                width: 8,
                height: 8,
                top: 0,
                left: '50%',
                transform: 'translateX(-50%)',
                background: '#4ECDC4',
                boxShadow: '0 0 10px 2px rgba(78, 205, 196, 0.5)',
              }}
            />
          </motion.div>
        ))}

        {/* Hour hand - retro style */}
        <motion.div
          className="absolute top-1/2 left-1/2"
          style={{
            width: 10,
            height: clockSize * 0.22,
            transformOrigin: 'center bottom',
            marginLeft: -5,
            marginTop: -clockSize * 0.22,
          }}
          animate={{ rotate: time.smoothHourAngle }}
        >
          <svg viewBox="0 0 16 80" className="h-full w-full">
            <path d="M8 0 L3 20 L3 75 L8 80 L13 75 L13 20 Z" fill="#FFD700" />
          </svg>
        </motion.div>

        {/* Minute hand */}
        <motion.div
          className="absolute top-1/2 left-1/2"
          style={{
            width: 8,
            height: clockSize * 0.32,
            transformOrigin: 'center bottom',
            marginLeft: -4,
            marginTop: -clockSize * 0.32,
          }}
          animate={{ rotate: time.smoothMinuteAngle }}
        >
          <svg viewBox="0 0 12 100" className="h-full w-full">
            <path d="M6 0 L2 18 L2 95 L6 100 L10 95 L10 18 Z" fill="#FFD700" />
          </svg>
        </motion.div>

        {/* Second hand with atomic symbol tip */}
        <motion.div
          className="absolute top-1/2 left-1/2"
          style={{
            width: 4,
            height: clockSize * 0.38,
            transformOrigin: '50% 80%',
            marginLeft: -2,
            marginTop: -clockSize * 0.38 * 0.8,
          }}
          animate={{ rotate: time.smoothSecondAngle }}
        >
          <div
            className="h-full w-full"
            style={{
              background: 'linear-gradient(to top, #4ECDC4 0%, #FF6B35 100%)',
              borderRadius: 2,
            }}
          />
          {/* Atomic tip */}
          <div
            className="absolute -top-2 left-1/2 -translate-x-1/2 rounded-full"
            style={{
              width: 10,
              height: 10,
              background: '#4ECDC4',
              boxShadow: '0 0 8px 2px rgba(78, 205, 196, 0.6)',
            }}
          />
        </motion.div>

        {/* Center cap */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            width: 16,
            height: 16,
            background: 'radial-gradient(circle at 30% 30%, #FFF 0%, #FFD700 50%, #FF6B35 100%)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
          }}
        />
      </div>

      {/* Time display */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-center">
        <div className="text-2xl font-light tracking-[0.3em]" style={{ color: '#FFD700' }}>
          {String(time.hours || 12).padStart(2, '0')}:{String(time.minutes).padStart(2, '0')}:
          {String(time.seconds).padStart(2, '0')}
        </div>
        <div className="mt-1 text-xs tracking-wider opacity-60" style={{ color: '#4ECDC4' }}>
          MID-CENTURY MODERN • 1955
        </div>
      </div>

      {/* Fullscreen indicator */}
      <div className="absolute top-4 right-4 text-xs text-teal-400/40">
        {isFullscreen ? 'ESC to exit' : 'Click for fullscreen'}
      </div>
    </div>
  )
}
