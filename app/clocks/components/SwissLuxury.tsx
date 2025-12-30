'use client'

import { useRef } from 'react'
import { motion } from 'framer-motion'
import { useClockTime, useFullscreen } from '../hooks/useClockTime'

export default function SwissLuxury() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { isFullscreen, toggleFullscreen, handleKeyDown } = useFullscreen(containerRef)
  const time = useClockTime(true)

  const clockSize = isFullscreen ? 400 : 280

  // Moonphase calculation (simplified)
  const moonPhase = (time.hours + time.minutes / 60) / 24

  return (
    <div
      ref={containerRef}
      className="relative flex h-full min-h-[400px] w-full cursor-pointer items-center justify-center overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a3e 50%, #232350 100%)',
      }}
      onClick={toggleFullscreen}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label="Swiss Luxury clock - click for fullscreen"
    >
      {/* Subtle leather texture */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `radial-gradient(circle at 50% 50%, #2a2a4a 1px, transparent 1px)`,
          backgroundSize: '8px 8px',
        }}
      />

      {/* Main watch face */}
      <div
        className="relative"
        style={{
          width: clockSize,
          height: clockSize,
        }}
      >
        <svg viewBox="0 0 300 300" className="h-full w-full drop-shadow-2xl">
          <defs>
            {/* Rose gold gradient */}
            <linearGradient id="roseGold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#E8C4A8" />
              <stop offset="30%" stopColor="#D4A574" />
              <stop offset="60%" stopColor="#B87333" />
              <stop offset="100%" stopColor="#E8C4A8" />
            </linearGradient>
            {/* Silver dial */}
            <radialGradient id="silverDial">
              <stop offset="0%" stopColor="#F5F5F5" />
              <stop offset="50%" stopColor="#E8E8E8" />
              <stop offset="100%" stopColor="#D0D0D0" />
            </radialGradient>
            {/* Blue steel */}
            <linearGradient id="blueSteel" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4169E1" />
              <stop offset="50%" stopColor="#1E3A8A" />
              <stop offset="100%" stopColor="#4169E1" />
            </linearGradient>
          </defs>

          {/* Case - rose gold */}
          <circle cx="150" cy="150" r="148" fill="url(#roseGold)" />
          <circle cx="150" cy="150" r="143" fill="url(#silverDial)" />

          {/* Chapter ring */}
          <circle cx="150" cy="150" r="138" fill="none" stroke="#2C2C2C" strokeWidth="0.5" />
          <circle cx="150" cy="150" r="125" fill="none" stroke="#B87333" strokeWidth="0.3" />

          {/* Moonphase complication at 6 */}
          <g transform="translate(150, 210)">
            <clipPath id="moonClip">
              <circle cx="0" cy="0" r="18" />
            </clipPath>
            <circle cx="0" cy="0" r="18" fill="#0a0a1a" />
            <g clipPath="url(#moonClip)">
              <circle cx={-18 + moonPhase * 72} cy="0" r="16" fill="#F4E4BC" />
              {/* Stars */}
              {[...Array(8)].map((_, i) => (
                <circle
                  key={i}
                  cx={-15 + (i % 4) * 10}
                  cy={-10 + Math.floor(i / 4) * 20}
                  r="1"
                  fill="#FFD700"
                  opacity="0.6"
                />
              ))}
            </g>
            <circle cx="0" cy="0" r="18" fill="none" stroke="#B87333" strokeWidth="1" />
          </g>

          {/* Applied indices - Dauphine style */}
          {[...Array(12)].map((_, i) => {
            const angle = (i * 30 - 90) * (Math.PI / 180)
            const x1 = 150 + Math.cos(angle) * 115
            const y1 = 150 + Math.sin(angle) * 115
            const x2 = 150 + Math.cos(angle) * 130
            const y2 = 150 + Math.sin(angle) * 130
            const isMainHour = i % 3 === 0

            if (i === 6) return null // Skip 6 for moonphase

            return (
              <g key={i}>
                <line
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="url(#roseGold)"
                  strokeWidth={isMainHour ? 4 : 2}
                  strokeLinecap="round"
                />
                {/* Shadow for depth */}
                <line
                  x1={x1 + 1}
                  y1={y1 + 1}
                  x2={x2 + 1}
                  y2={y2 + 1}
                  stroke="rgba(0,0,0,0.2)"
                  strokeWidth={isMainHour ? 4 : 2}
                  strokeLinecap="round"
                />
              </g>
            )
          })}

          {/* Minute track */}
          {[...Array(60)].map((_, i) => {
            if (i % 5 === 0) return null
            const angle = (i * 6 - 90) * (Math.PI / 180)
            const x1 = 150 + Math.cos(angle) * 132
            const y1 = 150 + Math.sin(angle) * 132
            const x2 = 150 + Math.cos(angle) * 136
            const y2 = 150 + Math.sin(angle) * 136
            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#666" strokeWidth="0.5" />
          })}

          {/* Brand name */}
          <text
            x="150"
            y="95"
            textAnchor="middle"
            fill="#2C2C2C"
            fontSize="8"
            fontFamily="serif"
            letterSpacing="3"
          >
            CHRONOGRAPHE
          </text>
          <text
            x="150"
            y="108"
            textAnchor="middle"
            fill="#B87333"
            fontSize="6"
            fontFamily="serif"
            letterSpacing="2"
          >
            GENÈVE
          </text>

          {/* Center pinion */}
          <circle cx="150" cy="150" r="8" fill="url(#roseGold)" />
        </svg>

        {/* Hour hand - Dauphine */}
        <motion.div
          className="absolute top-1/2 left-1/2"
          style={{
            width: 16,
            height: clockSize * 0.22,
            transformOrigin: 'center bottom',
            marginLeft: -8,
            marginTop: -clockSize * 0.22,
            filter: 'drop-shadow(1px 1px 2px rgba(0,0,0,0.3))',
          }}
          animate={{ rotate: time.smoothHourAngle }}
        >
          <svg viewBox="0 0 24 80" className="h-full w-full">
            <path d="M12 0 L6 15 L6 75 L10 80 L14 80 L18 75 L18 15 Z" fill="url(#roseGold)" />
            {/* Facet highlight */}
            <path d="M12 0 L12 75 L6 75 L6 15 Z" fill="rgba(255,255,255,0.2)" />
          </svg>
        </motion.div>

        {/* Minute hand - Dauphine */}
        <motion.div
          className="absolute top-1/2 left-1/2"
          style={{
            width: 12,
            height: clockSize * 0.35,
            transformOrigin: 'center bottom',
            marginLeft: -6,
            marginTop: -clockSize * 0.35,
            filter: 'drop-shadow(1px 1px 2px rgba(0,0,0,0.3))',
          }}
          animate={{ rotate: time.smoothMinuteAngle }}
        >
          <svg viewBox="0 0 18 110" className="h-full w-full">
            <path d="M9 0 L4 15 L4 105 L7 110 L11 110 L14 105 L14 15 Z" fill="url(#roseGold)" />
            <path d="M9 0 L9 105 L4 105 L4 15 Z" fill="rgba(255,255,255,0.2)" />
          </svg>
        </motion.div>

        {/* Second hand - Blued steel */}
        <motion.div
          className="absolute top-1/2 left-1/2"
          style={{
            width: 3,
            height: clockSize * 0.42,
            transformOrigin: '50% 85%',
            marginLeft: -1.5,
            marginTop: -clockSize * 0.42 * 0.85,
          }}
          animate={{ rotate: time.smoothSecondAngle }}
        >
          <svg viewBox="0 0 6 140" className="h-full w-full">
            {/* Counterweight */}
            <circle cx="3" cy="130" r="5" fill="url(#blueSteel)" />
            {/* Main needle */}
            <path d="M3 0 L1 10 L2 120 L3 125 L4 120 L5 10 Z" fill="url(#blueSteel)" />
          </svg>
        </motion.div>

        {/* Center cap */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            width: 12,
            height: 12,
            background: 'radial-gradient(circle at 30% 30%, #E8C4A8 0%, #B87333 100%)',
            boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.5), 0 1px 3px rgba(0,0,0,0.3)',
          }}
        />
      </div>

      {/* Time display */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-center">
        <div className="text-2xl font-light tracking-[0.3em]" style={{ color: '#E8C4A8' }}>
          {String(time.hours || 12).padStart(2, '0')}:{String(time.minutes).padStart(2, '0')}:
          {String(time.seconds).padStart(2, '0')}
        </div>
        <div className="mt-1 text-xs tracking-[0.2em] opacity-60" style={{ color: '#B87333' }}>
          SWISS MADE • 1950
        </div>
      </div>

      {/* Fullscreen indicator */}
      <div className="absolute top-4 right-4 text-xs text-amber-200/40">
        {isFullscreen ? 'ESC to exit' : 'Click for fullscreen'}
      </div>
    </div>
  )
}
