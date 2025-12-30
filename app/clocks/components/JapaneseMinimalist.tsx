'use client'

import { useRef } from 'react'
import { motion } from 'framer-motion'
import { useClockTime, useFullscreen } from '../hooks/useClockTime'

export default function JapaneseMinimalist() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { isFullscreen, toggleFullscreen, handleKeyDown } = useFullscreen(containerRef)
  const time = useClockTime(true)

  const clockSize = isFullscreen ? 400 : 280

  return (
    <div
      ref={containerRef}
      className="relative flex h-full min-h-[400px] w-full cursor-pointer items-center justify-center overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #fafafa 0%, #f0f0f0 50%, #e8e8e8 100%)',
      }}
      onClick={toggleFullscreen}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label="Japanese Minimalist clock - click for fullscreen"
    >
      {/* Subtle washi paper texture */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `radial-gradient(circle at 50% 50%, #e0e0e0 0.5px, transparent 0.5px)`,
          backgroundSize: '12px 12px',
        }}
      />

      {/* Main clock */}
      <div
        className="relative"
        style={{
          width: clockSize,
          height: clockSize,
        }}
      >
        <svg viewBox="0 0 300 300" className="h-full w-full">
          {/* Minimal outer ring */}
          <circle cx="150" cy="150" r="145" fill="none" stroke="#e0e0e0" strokeWidth="1" />

          {/* Inner face */}
          <circle cx="150" cy="150" r="140" fill="#fafafa" />

          {/* Single marker at 12 */}
          <circle cx="150" cy="30" r="3" fill="#2C2C2C" />

          {/* Subtle hour positions - just small dots */}
          {[...Array(12)].map((_, i) => {
            if (i === 0) return null // Skip 12, already marked
            const angle = (i * 30 - 90) * (Math.PI / 180)
            const x = 150 + Math.cos(angle) * 120
            const y = 150 + Math.sin(angle) * 120
            return <circle key={i} cx={x} cy={y} r="1.5" fill="#c0c0c0" />
          })}

          {/* Japanese character for "time" - 時 */}
          <text x="150" y="200" textAnchor="middle" fill="#e0e0e0" fontSize="24" fontFamily="serif">
            時
          </text>
        </svg>

        {/* Hour hand - thin, elegant */}
        <motion.div
          className="absolute top-1/2 left-1/2"
          style={{
            width: 4,
            height: clockSize * 0.22,
            background: '#2C2C2C',
            transformOrigin: 'center bottom',
            marginLeft: -2,
            marginTop: -clockSize * 0.22,
            borderRadius: 2,
          }}
          animate={{ rotate: time.smoothHourAngle }}
        />

        {/* Minute hand - very thin, long */}
        <motion.div
          className="absolute top-1/2 left-1/2"
          style={{
            width: 2,
            height: clockSize * 0.38,
            background: '#2C2C2C',
            transformOrigin: 'center bottom',
            marginLeft: -1,
            marginTop: -clockSize * 0.38,
            borderRadius: 1,
          }}
          animate={{ rotate: time.smoothMinuteAngle }}
        />

        {/* Second hand - hairline, silent sweep */}
        <motion.div
          className="absolute top-1/2 left-1/2"
          style={{
            width: 1,
            height: clockSize * 0.42,
            background: '#999',
            transformOrigin: 'center bottom',
            marginLeft: -0.5,
            marginTop: -clockSize * 0.42,
          }}
          animate={{ rotate: time.smoothSecondAngle }}
        />

        {/* Minimal center point */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            width: 6,
            height: 6,
            background: '#2C2C2C',
          }}
        />
      </div>

      {/* Time display - minimal */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center">
        <div className="text-xl font-light tracking-[1em] text-gray-400">
          {String(time.hours || 12).padStart(2, '0')}:{String(time.minutes).padStart(2, '0')}
        </div>
      </div>

      {/* Era label - very subtle */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2">
        <span className="text-[10px] tracking-[0.5em] text-gray-300">禅 • 1970</span>
      </div>

      {/* Fullscreen indicator */}
      <div className="absolute top-4 right-4 text-xs text-gray-300">
        {isFullscreen ? 'ESC' : '⛶'}
      </div>
    </div>
  )
}
