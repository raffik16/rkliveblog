'use client'

import { useRef } from 'react'
import { motion } from 'framer-motion'
import { useClockTime, useFullscreen } from '../hooks/useClockTime'

export default function VictorianRailway() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { isFullscreen, toggleFullscreen, handleKeyDown } = useFullscreen(containerRef)
  const time = useClockTime(true)

  const clockSize = isFullscreen ? 420 : 300

  return (
    <div
      ref={containerRef}
      className="relative flex h-full min-h-[400px] w-full cursor-pointer items-center justify-center overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 50%, #4a5568 100%)',
      }}
      onClick={toggleFullscreen}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label="Victorian Railway clock - click for fullscreen"
    >
      {/* Victorian iron lattice background */}
      <div className="absolute inset-0 opacity-10">
        <svg viewBox="0 0 100 100" className="h-full w-full">
          <pattern id="ironLattice" patternUnits="userSpaceOnUse" width="20" height="20">
            <path d="M0 10 L10 0 L20 10 L10 20 Z" fill="none" stroke="#1C1C1C" strokeWidth="0.5" />
          </pattern>
          <rect width="100" height="100" fill="url(#ironLattice)" />
        </svg>
      </div>

      {/* Station name plate */}
      <div
        className="absolute top-6 px-6 py-2"
        style={{
          background: '#1C1C1C',
          border: '2px solid #B8860B',
          borderRadius: 4,
        }}
      >
        <span className="font-serif text-sm tracking-[0.3em] text-amber-100">
          PADDINGTON STATION
        </span>
      </div>

      {/* Main clock */}
      <div
        className="relative"
        style={{
          width: clockSize,
          height: clockSize,
        }}
      >
        <svg viewBox="0 0 300 300" className="h-full w-full drop-shadow-2xl">
          <defs>
            {/* Cast iron gradient */}
            <linearGradient id="castIron" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1C1C1C" />
              <stop offset="50%" stopColor="#2F2F2F" />
              <stop offset="100%" stopColor="#1C1C1C" />
            </linearGradient>
            {/* Brass accent */}
            <linearGradient id="brassRing" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#D4A574" />
              <stop offset="50%" stopColor="#B8860B" />
              <stop offset="100%" stopColor="#CD853F" />
            </linearGradient>
          </defs>

          {/* Outer iron frame */}
          <circle cx="150" cy="150" r="148" fill="url(#castIron)" />
          <circle cx="150" cy="150" r="145" fill="none" stroke="#2F2F2F" strokeWidth="6" />

          {/* Brass bezel */}
          <circle cx="150" cy="150" r="140" fill="none" stroke="url(#brassRing)" strokeWidth="4" />

          {/* White enamel face */}
          <circle cx="150" cy="150" r="135" fill="#FFFEF0" />

          {/* Railway company emblem at 12 o'clock */}
          <g transform="translate(150, 55)">
            <circle cx="0" cy="0" r="20" fill="none" stroke="#1C1C1C" strokeWidth="1.5" />
            <text
              x="0"
              y="5"
              textAnchor="middle"
              fontSize="8"
              fontFamily="serif"
              fill="#1C1C1C"
              fontWeight="bold"
            >
              GWR
            </text>
          </g>

          {/* Bold Roman numerals - iconic railway style */}
          {['XII', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI'].map(
            (num, i) => {
              const angle = (i * 30 - 90) * (Math.PI / 180)
              const radius = num === 'XII' ? 95 : 100
              const x = 150 + Math.cos(angle) * radius
              const y = 150 + Math.sin(angle) * radius
              if (i === 0) return null // Skip XII, handled by emblem
              return (
                <text
                  key={i}
                  x={x}
                  y={y + 7}
                  textAnchor="middle"
                  fill="#1C1C1C"
                  fontSize="20"
                  fontFamily="serif"
                  fontWeight="bold"
                >
                  {num}
                </text>
              )
            }
          )}

          {/* Hour markers - bold lines */}
          {[...Array(12)].map((_, i) => {
            const angle = (i * 30 - 90) * (Math.PI / 180)
            const x1 = 150 + Math.cos(angle) * 120
            const y1 = 150 + Math.sin(angle) * 120
            const x2 = 150 + Math.cos(angle) * 130
            const y2 = 150 + Math.sin(angle) * 130
            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#1C1C1C" strokeWidth="4" />
          })}

          {/* Minute markers */}
          {[...Array(60)].map((_, i) => {
            if (i % 5 === 0) return null
            const angle = (i * 6 - 90) * (Math.PI / 180)
            const x1 = 150 + Math.cos(angle) * 125
            const y1 = 150 + Math.sin(angle) * 125
            const x2 = 150 + Math.cos(angle) * 130
            const y2 = 150 + Math.sin(angle) * 130
            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#1C1C1C" strokeWidth="1" />
          })}

          {/* Inner decorative circle */}
          <circle
            cx="150"
            cy="150"
            r="75"
            fill="none"
            stroke="#1C1C1C"
            strokeWidth="0.5"
            opacity="0.3"
          />

          {/* Center hub */}
          <circle cx="150" cy="150" r="12" fill="url(#brassRing)" />
          <circle cx="150" cy="150" r="8" fill="#1C1C1C" />
        </svg>

        {/* Hour hand - heavy spade style */}
        <motion.div
          className="absolute top-1/2 left-1/2"
          style={{
            width: 16,
            height: clockSize * 0.26,
            transformOrigin: 'center bottom',
            marginLeft: -8,
            marginTop: -clockSize * 0.26,
          }}
          animate={{ rotate: time.smoothHourAngle }}
        >
          <svg viewBox="0 0 24 100" className="h-full w-full">
            {/* Spade-shaped hour hand */}
            <path
              d="M12 100 L8 95 L10 50 L6 45 L6 35 Q12 15 12 0 Q12 15 18 35 L18 45 L14 50 L16 95 Z"
              fill="#1C1C1C"
            />
          </svg>
        </motion.div>

        {/* Minute hand - long elegant spade */}
        <motion.div
          className="absolute top-1/2 left-1/2"
          style={{
            width: 12,
            height: clockSize * 0.38,
            transformOrigin: 'center bottom',
            marginLeft: -6,
            marginTop: -clockSize * 0.38,
          }}
          animate={{ rotate: time.smoothMinuteAngle }}
        >
          <svg viewBox="0 0 18 130" className="h-full w-full">
            <path
              d="M9 130 L6 125 L7 55 L4 50 L4 40 Q9 15 9 0 Q9 15 14 40 L14 50 L11 55 L12 125 Z"
              fill="#1C1C1C"
            />
          </svg>
        </motion.div>

        {/* Second hand - thin red */}
        <motion.div
          className="absolute top-1/2 left-1/2"
          style={{
            width: 2,
            height: clockSize * 0.42,
            background: '#8B0000',
            transformOrigin: 'center bottom',
            marginLeft: -1,
            marginTop: -clockSize * 0.42,
            borderRadius: 1,
          }}
          animate={{ rotate: time.smoothSecondAngle }}
        />

        {/* Counterweight on second hand */}
        <motion.div
          className="absolute top-1/2 left-1/2"
          style={{
            width: 8,
            height: clockSize * 0.08,
            background: '#8B0000',
            transformOrigin: 'center top',
            marginLeft: -4,
            borderRadius: 4,
          }}
          animate={{ rotate: time.smoothSecondAngle }}
        />

        {/* Center cap */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            width: 18,
            height: 18,
            background: 'radial-gradient(circle at 30% 30%, #D4A574 0%, #B8860B 50%, #8B7355 100%)',
            boxShadow: '0 2px 4px rgba(0,0,0,0.5)',
          }}
        />
      </div>

      {/* Time display */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-center text-amber-100">
        <div className="font-serif text-3xl tracking-widest">
          {String(time.hours || 12).padStart(2, '0')}:{String(time.minutes).padStart(2, '0')}:
          {String(time.seconds).padStart(2, '0')}
        </div>
        <div className="mt-1 text-xs tracking-wider opacity-60">GREENWICH MEAN TIME • 1840</div>
      </div>

      {/* Fullscreen indicator */}
      <div className="absolute top-4 right-4 text-xs text-amber-200/40">
        {isFullscreen ? 'ESC to exit' : 'Click for fullscreen'}
      </div>
    </div>
  )
}
