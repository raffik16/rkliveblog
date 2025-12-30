'use client'

import { useRef } from 'react'
import { motion } from 'framer-motion'
import { useClockTime, useFullscreen } from '../hooks/useClockTime'

export default function FrenchRococo() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { isFullscreen, toggleFullscreen, handleKeyDown } = useFullscreen(containerRef)
  const time = useClockTime(true)

  const clockSize = isFullscreen ? 400 : 280

  return (
    <div
      ref={containerRef}
      className="relative flex h-full min-h-[400px] w-full cursor-pointer items-center justify-center overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #1a1a2e 0%, #2d132c 50%, #4a1942 100%)',
      }}
      onClick={toggleFullscreen}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label="French Rococo clock - click for fullscreen"
    >
      {/* Decorative damask pattern */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 5 Q40 15 30 25 Q20 15 30 5 M30 35 Q40 45 30 55 Q20 45 30 35 M5 30 Q15 40 25 30 Q15 20 5 30 M35 30 Q45 40 55 30 Q45 20 35 30' fill='%23FFD700' fill-opacity='1'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Main clock with ornate frame */}
      <div
        className="relative"
        style={{
          width: clockSize * 1.3,
          height: clockSize * 1.4,
        }}
      >
        <svg viewBox="0 0 400 450" className="h-full w-full">
          <defs>
            {/* Gold gradient */}
            <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFD700" />
              <stop offset="25%" stopColor="#FFC125" />
              <stop offset="50%" stopColor="#DAA520" />
              <stop offset="75%" stopColor="#B8860B" />
              <stop offset="100%" stopColor="#FFD700" />
            </linearGradient>
            {/* Enamel white */}
            <radialGradient id="enamelWhite">
              <stop offset="0%" stopColor="#FFFFF0" />
              <stop offset="80%" stopColor="#F5F5DC" />
              <stop offset="100%" stopColor="#EEE8CD" />
            </radialGradient>
            {/* Shadow filter */}
            <filter id="goldShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="2" dy="2" stdDeviation="3" floodColor="#000" floodOpacity="0.3" />
            </filter>
          </defs>

          {/* Ornate frame - rococo scrollwork */}
          <g filter="url(#goldShadow)">
            {/* Top flourish */}
            <path
              d="M200 10 Q230 30 250 20 Q270 30 280 50 Q300 40 310 60 Q280 80 250 70 Q220 90 200 70 Q180 90 150 70 Q120 80 90 60 Q100 40 120 50 Q130 30 150 20 Q170 30 200 10"
              fill="url(#goldGradient)"
            />
            {/* Cherub at top */}
            <circle cx="200" cy="45" r="20" fill="url(#goldGradient)" />
            <circle cx="193" cy="42" r="3" fill="#4a1942" />
            <circle cx="207" cy="42" r="3" fill="#4a1942" />
            <path d="M195 50 Q200 55 205 50" fill="none" stroke="#4a1942" strokeWidth="1.5" />

            {/* Left scrollwork */}
            <path
              d="M70 150 Q40 180 50 220 Q30 250 50 280 Q40 320 70 350 Q90 340 100 360 Q80 380 90 400"
              fill="none"
              stroke="url(#goldGradient)"
              strokeWidth="8"
              strokeLinecap="round"
            />
            <circle cx="50" cy="250" r="15" fill="url(#goldGradient)" />

            {/* Right scrollwork */}
            <path
              d="M330 150 Q360 180 350 220 Q370 250 350 280 Q360 320 330 350 Q310 340 300 360 Q320 380 310 400"
              fill="none"
              stroke="url(#goldGradient)"
              strokeWidth="8"
              strokeLinecap="round"
            />
            <circle cx="350" cy="250" r="15" fill="url(#goldGradient)" />

            {/* Bottom flourish with flowers */}
            <path
              d="M120 420 Q150 440 200 430 Q250 440 280 420 Q260 400 270 380 Q230 390 200 380 Q170 390 130 380 Q140 400 120 420"
              fill="url(#goldGradient)"
            />
            {/* Rose decorations */}
            <circle cx="160" cy="410" r="12" fill="#C71585" opacity="0.8" />
            <circle cx="240" cy="410" r="12" fill="#C71585" opacity="0.8" />
          </g>

          {/* Clock face outer ring - gold */}
          <circle cx="200" cy="220" r="130" fill="url(#goldGradient)" filter="url(#goldShadow)" />
          <circle cx="200" cy="220" r="120" fill="url(#enamelWhite)" />

          {/* Decorative inner ring */}
          <circle
            cx="200"
            cy="220"
            r="110"
            fill="none"
            stroke="url(#goldGradient)"
            strokeWidth="2"
          />

          {/* Floral decorations around numbers */}
          {[...Array(12)].map((_, i) => {
            const angle = (i * 30 - 90) * (Math.PI / 180)
            const x = 200 + Math.cos(angle) * 95
            const y = 220 + Math.sin(angle) * 95
            return (
              <g key={i}>
                <circle cx={x} cy={y} r="4" fill="#C71585" opacity="0.6" />
                <circle cx={x} cy={y} r="2" fill="#FFD700" />
              </g>
            )
          })}

          {/* Elegant Roman numerals */}
          {['XII', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI'].map(
            (num, i) => {
              const angle = (i * 30 - 90) * (Math.PI / 180)
              const x = 200 + Math.cos(angle) * 75
              const y = 220 + Math.sin(angle) * 75
              return (
                <text
                  key={i}
                  x={x}
                  y={y + 5}
                  textAnchor="middle"
                  fill="#1a1a2e"
                  fontSize="14"
                  fontFamily="serif"
                  fontStyle="italic"
                >
                  {num}
                </text>
              )
            }
          )}

          {/* Minute markers with fleur-de-lis */}
          {[...Array(60)].map((_, i) => {
            if (i % 5 === 0) return null
            const angle = (i * 6 - 90) * (Math.PI / 180)
            const x = 200 + Math.cos(angle) * 105
            const y = 220 + Math.sin(angle) * 105
            return <circle key={i} cx={x} cy={y} r="1" fill="#DAA520" />
          })}

          {/* Center ornament */}
          <circle cx="200" cy="220" r="18" fill="url(#goldGradient)" />
          <circle cx="200" cy="220" r="12" fill="#C71585" opacity="0.3" />
        </svg>

        {/* Hour hand - ornate gold */}
        <motion.div
          className="absolute"
          style={{
            left: '50%',
            top: isFullscreen ? '48.5%' : '48%',
            width: 12,
            height: clockSize * 0.22,
            transformOrigin: 'center bottom',
            marginLeft: -6,
            marginTop: -clockSize * 0.22,
          }}
          animate={{ rotate: time.smoothHourAngle }}
        >
          <svg viewBox="0 0 20 100" className="h-full w-full">
            <path
              d="M10 100 L5 90 L7 50 L5 45 Q10 30 10 0 Q10 30 15 45 L13 50 L15 90 Z"
              fill="url(#goldGradient)"
              stroke="#B8860B"
              strokeWidth="0.5"
            />
          </svg>
        </motion.div>

        {/* Minute hand - elegant gold */}
        <motion.div
          className="absolute"
          style={{
            left: '50%',
            top: isFullscreen ? '48.5%' : '48%',
            width: 8,
            height: clockSize * 0.32,
            transformOrigin: 'center bottom',
            marginLeft: -4,
            marginTop: -clockSize * 0.32,
          }}
          animate={{ rotate: time.smoothMinuteAngle }}
        >
          <svg viewBox="0 0 16 140" className="h-full w-full">
            <path
              d="M8 140 L4 130 L5 70 L3 65 Q8 40 8 0 Q8 40 13 65 L11 70 L12 130 Z"
              fill="url(#goldGradient)"
              stroke="#B8860B"
              strokeWidth="0.5"
            />
          </svg>
        </motion.div>

        {/* Second hand - delicate */}
        <motion.div
          className="absolute"
          style={{
            left: '50%',
            top: isFullscreen ? '48.5%' : '48%',
            width: 2,
            height: clockSize * 0.35,
            background: 'linear-gradient(to top, #C71585 0%, #FF69B4 100%)',
            transformOrigin: 'center bottom',
            marginLeft: -1,
            marginTop: -clockSize * 0.35,
            borderRadius: 1,
          }}
          animate={{ rotate: time.smoothSecondAngle }}
        />

        {/* Center jewel */}
        <div
          className="absolute rounded-full"
          style={{
            left: '50%',
            top: isFullscreen ? '48.5%' : '48%',
            width: 16,
            height: 16,
            marginLeft: -8,
            marginTop: -8,
            background: 'radial-gradient(circle at 30% 30%, #FF69B4 0%, #C71585 50%, #8B0A50 100%)',
            boxShadow: '0 0 10px 2px rgba(199, 21, 133, 0.5)',
          }}
        />
      </div>

      {/* Time display */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-center text-amber-100">
        <div className="font-serif text-2xl tracking-widest italic">
          {String(time.hours || 12).padStart(2, '0')}:{String(time.minutes).padStart(2, '0')}:
          {String(time.seconds).padStart(2, '0')}
        </div>
        <div className="mt-1 text-xs tracking-wider opacity-60">VERSAILLES • 1750</div>
      </div>

      {/* Fullscreen indicator */}
      <div className="absolute top-4 right-4 text-xs text-amber-200/40">
        {isFullscreen ? 'ESC to exit' : 'Click for fullscreen'}
      </div>
    </div>
  )
}
