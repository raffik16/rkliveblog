'use client'

import { useRef } from 'react'
import { motion } from 'framer-motion'
import { useClockTime, useFullscreen } from '../hooks/useClockTime'

export default function SovietConstructivist() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { isFullscreen, toggleFullscreen, handleKeyDown } = useFullscreen(containerRef)
  const time = useClockTime(false) // Ticking for industrial feel

  const clockSize = isFullscreen ? 400 : 280

  return (
    <div
      ref={containerRef}
      className="relative flex h-full min-h-[400px] w-full cursor-pointer items-center justify-center overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%)',
      }}
      onClick={toggleFullscreen}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label="Soviet Constructivist clock - click for fullscreen"
    >
      {/* Constructivist diagonal lines */}
      <div className="absolute inset-0 opacity-10">
        <svg viewBox="0 0 400 400" className="h-full w-full">
          {[...Array(20)].map((_, i) => (
            <line
              key={i}
              x1={i * 40 - 200}
              y1="0"
              x2={i * 40 + 200}
              y2="400"
              stroke="#CC0000"
              strokeWidth="1"
            />
          ))}
        </svg>
      </div>

      {/* Red star at top */}
      <div className="absolute top-6">
        <svg width="40" height="40" viewBox="0 0 40 40">
          <polygon
            points="20,0 24,14 40,14 27,23 32,38 20,28 8,38 13,23 0,14 16,14"
            fill="#CC0000"
          />
        </svg>
      </div>

      {/* Main clock */}
      <div
        className="relative"
        style={{
          width: clockSize,
          height: clockSize,
        }}
      >
        <svg viewBox="0 0 300 300" className="h-full w-full">
          <defs>
            {/* Soviet red */}
            <linearGradient id="sovietRed" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#CC0000" />
              <stop offset="50%" stopColor="#8B0000" />
              <stop offset="100%" stopColor="#CC0000" />
            </linearGradient>
          </defs>

          {/* Outer black ring */}
          <circle cx="150" cy="150" r="148" fill="#1a1a1a" stroke="#CC0000" strokeWidth="4" />

          {/* Inner face - dark with red accents */}
          <circle cx="150" cy="150" r="140" fill="#0a0a0a" />

          {/* Geometric inner patterns */}
          <circle cx="150" cy="150" r="130" fill="none" stroke="#CC0000" strokeWidth="2" />
          <circle cx="150" cy="150" r="100" fill="none" stroke="#333" strokeWidth="1" />

          {/* Hammer and sickle at center (stylized) */}
          <g transform="translate(150, 150)" opacity="0.2">
            <path d="M-15 -5 L-15 15 L-10 15 L-10 0 L0 0 L0 -5 Z" fill="#CC0000" />
            <path d="M5 -15 Q20 0 5 15 Q0 10 5 5 Q15 0 5 -10 Z" fill="#CC0000" />
          </g>

          {/* Bold industrial numerals */}
          {['12', '3', '6', '9'].map((num, i) => {
            const positions = [
              { x: 150, y: 55 },
              { x: 245, y: 155 },
              { x: 150, y: 255 },
              { x: 55, y: 155 },
            ]
            return (
              <text
                key={i}
                x={positions[i].x}
                y={positions[i].y}
                textAnchor="middle"
                fill="#CC0000"
                fontSize="28"
                fontFamily="sans-serif"
                fontWeight="900"
              >
                {num}
              </text>
            )
          })}

          {/* Hour markers - thick industrial */}
          {[...Array(12)].map((_, i) => {
            if (i % 3 === 0) return null // Skip main hours
            const angle = (i * 30 - 90) * (Math.PI / 180)
            const x1 = 150 + Math.cos(angle) * 115
            const y1 = 150 + Math.sin(angle) * 115
            const x2 = 150 + Math.cos(angle) * 130
            const y2 = 150 + Math.sin(angle) * 130
            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#CC0000" strokeWidth="4" />
          })}

          {/* Minute markers - short strokes */}
          {[...Array(60)].map((_, i) => {
            if (i % 5 === 0) return null
            const angle = (i * 6 - 90) * (Math.PI / 180)
            const x1 = 150 + Math.cos(angle) * 125
            const y1 = 150 + Math.sin(angle) * 125
            const x2 = 150 + Math.cos(angle) * 130
            const y2 = 150 + Math.sin(angle) * 130
            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#666" strokeWidth="1" />
          })}

          {/* Center industrial hub */}
          <circle cx="150" cy="150" r="15" fill="#1a1a1a" stroke="#CC0000" strokeWidth="2" />
          <circle cx="150" cy="150" r="8" fill="#CC0000" />
        </svg>

        {/* Hour hand - bold rectangular */}
        <motion.div
          className="absolute top-1/2 left-1/2"
          style={{
            width: 14,
            height: clockSize * 0.24,
            background: '#CC0000',
            transformOrigin: 'center bottom',
            marginLeft: -7,
            marginTop: -clockSize * 0.24,
            clipPath: 'polygon(20% 0, 80% 0, 100% 100%, 0% 100%)',
          }}
          animate={{ rotate: time.hourAngle }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        />

        {/* Minute hand - bold arrow */}
        <motion.div
          className="absolute top-1/2 left-1/2"
          style={{
            width: 10,
            height: clockSize * 0.36,
            background: '#CC0000',
            transformOrigin: 'center bottom',
            marginLeft: -5,
            marginTop: -clockSize * 0.36,
            clipPath: 'polygon(30% 0, 70% 0, 100% 100%, 0% 100%)',
          }}
          animate={{ rotate: time.minuteAngle }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        />

        {/* Second hand - thin black with red tip */}
        <motion.div
          className="absolute top-1/2 left-1/2"
          style={{
            width: 3,
            height: clockSize * 0.4,
            transformOrigin: 'center bottom',
            marginLeft: -1.5,
            marginTop: -clockSize * 0.4,
          }}
          animate={{ rotate: time.secondAngle }}
          transition={{ duration: 0.1, ease: 'linear' }}
        >
          <div
            className="h-full w-full"
            style={{
              background: 'linear-gradient(to top, #1a1a1a 70%, #CC0000 70%)',
            }}
          />
        </motion.div>

        {/* Center cap */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            width: 12,
            height: 12,
            background: '#CC0000',
            border: '2px solid #1a1a1a',
          }}
        />
      </div>

      {/* Slogan */}
      <div
        className="absolute bottom-12 left-1/2 -translate-x-1/2 px-4 py-1 text-center"
        style={{ background: '#CC0000' }}
      >
        <span className="text-xs font-bold tracking-[0.3em] text-white">ВРЕМЯ ВПЕРЁД</span>
      </div>

      {/* Time display */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-center">
        <div className="text-2xl font-bold tracking-widest" style={{ color: '#CC0000' }}>
          {String(time.hours || 12).padStart(2, '0')}:{String(time.minutes).padStart(2, '0')}:
          {String(time.seconds).padStart(2, '0')}
        </div>
        <div className="mt-1 text-xs tracking-wider text-gray-400 opacity-60">USSR • 1960</div>
      </div>

      {/* Fullscreen indicator */}
      <div className="absolute top-4 right-4 text-xs text-red-400/40">
        {isFullscreen ? 'ESC to exit' : 'Click for fullscreen'}
      </div>
    </div>
  )
}
