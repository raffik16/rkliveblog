'use client'

import { useRef } from 'react'
import { motion } from 'framer-motion'
import { useClockTime, useFullscreen } from '../hooks/useClockTime'

export default function ArtDeco() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { isFullscreen, toggleFullscreen, handleKeyDown } = useFullscreen(containerRef)
  const time = useClockTime(true)

  const clockSize = isFullscreen ? 400 : 280

  return (
    <div
      ref={containerRef}
      className="relative flex h-full min-h-[400px] w-full cursor-pointer items-center justify-center overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #2d2d2d 100%)',
      }}
      onClick={toggleFullscreen}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label="Art Deco clock - click for fullscreen"
    >
      {/* Art Deco geometric pattern */}
      <div className="absolute inset-0 opacity-5">
        <svg viewBox="0 0 200 200" className="h-full w-full">
          <pattern id="artDecoPattern" patternUnits="userSpaceOnUse" width="40" height="40">
            <path d="M0 20 L20 0 L40 20 L20 40 Z" fill="none" stroke="#C9A227" strokeWidth="0.5" />
            <circle cx="20" cy="20" r="5" fill="none" stroke="#C9A227" strokeWidth="0.3" />
          </pattern>
          <rect width="200" height="200" fill="url(#artDecoPattern)" />
        </svg>
      </div>

      {/* Sunburst rays */}
      <div className="absolute inset-0 flex items-center justify-center">
        <svg viewBox="0 0 600 600" className="h-full w-full opacity-20">
          {[...Array(24)].map((_, i) => {
            const angle = i * 15
            return (
              <line
                key={i}
                x1="300"
                y1="300"
                x2={300 + Math.cos((angle * Math.PI) / 180) * 300}
                y2={300 + Math.sin((angle * Math.PI) / 180) * 300}
                stroke="url(#goldRay)"
                strokeWidth="2"
              />
            )
          })}
          <defs>
            <linearGradient id="goldRay" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#C9A227" stopOpacity="1" />
              <stop offset="100%" stopColor="#C9A227" stopOpacity="0" />
            </linearGradient>
          </defs>
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
            {/* Chrome gradient */}
            <linearGradient id="chromeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#E8E8E8" />
              <stop offset="25%" stopColor="#B8B8B8" />
              <stop offset="50%" stopColor="#E8E8E8" />
              <stop offset="75%" stopColor="#A8A8A8" />
              <stop offset="100%" stopColor="#D8D8D8" />
            </linearGradient>
            {/* Gold accent */}
            <linearGradient id="artDecoGold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#C9A227" />
              <stop offset="50%" stopColor="#FFD700" />
              <stop offset="100%" stopColor="#C9A227" />
            </linearGradient>
          </defs>

          {/* Outer chrome bezel */}
          <circle cx="150" cy="150" r="148" fill="url(#chromeGradient)" />
          <circle cx="150" cy="150" r="140" fill="#0a0a0a" />

          {/* Gold inner ring */}
          <circle
            cx="150"
            cy="150"
            r="135"
            fill="none"
            stroke="url(#artDecoGold)"
            strokeWidth="3"
          />

          {/* Geometric face pattern */}
          <circle cx="150" cy="150" r="130" fill="#0f0f0f" />

          {/* Concentric gold rings */}
          <circle
            cx="150"
            cy="150"
            r="120"
            fill="none"
            stroke="#C9A227"
            strokeWidth="0.5"
            opacity="0.5"
          />
          <circle
            cx="150"
            cy="150"
            r="100"
            fill="none"
            stroke="#C9A227"
            strokeWidth="0.5"
            opacity="0.3"
          />
          <circle
            cx="150"
            cy="150"
            r="80"
            fill="none"
            stroke="#C9A227"
            strokeWidth="0.5"
            opacity="0.2"
          />

          {/* Art Deco numerals - stylized geometric */}
          {['12', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11'].map((num, i) => {
            const angle = (i * 30 - 90) * (Math.PI / 180)
            const x = 150 + Math.cos(angle) * 105
            const y = 150 + Math.sin(angle) * 105
            return (
              <text
                key={i}
                x={x}
                y={y + 6}
                textAnchor="middle"
                fill="url(#artDecoGold)"
                fontSize="18"
                fontFamily="sans-serif"
                fontWeight="300"
                letterSpacing="2"
              >
                {num}
              </text>
            )
          })}

          {/* Geometric hour markers - triangles */}
          {[...Array(12)].map((_, i) => {
            const angle = (i * 30 - 90) * (Math.PI / 180)
            const x = 150 + Math.cos(angle) * 125
            const y = 150 + Math.sin(angle) * 125
            const rotation = i * 30
            return (
              <polygon
                key={i}
                points={`${x},${y - 6} ${x - 4},${y + 4} ${x + 4},${y + 4}`}
                fill="#C9A227"
                transform={`rotate(${rotation}, ${x}, ${y})`}
              />
            )
          })}

          {/* Minute markers - small diamonds */}
          {[...Array(60)].map((_, i) => {
            if (i % 5 === 0) return null
            const angle = (i * 6 - 90) * (Math.PI / 180)
            const x = 150 + Math.cos(angle) * 125
            const y = 150 + Math.sin(angle) * 125
            return <circle key={i} cx={x} cy={y} r="1.5" fill="#C9A227" opacity="0.6" />
          })}

          {/* Center sunburst */}
          <g>
            {[...Array(12)].map((_, i) => {
              const angle = i * 30 * (Math.PI / 180)
              return (
                <line
                  key={i}
                  x1={150 + Math.cos(angle) * 15}
                  y1={150 + Math.sin(angle) * 15}
                  x2={150 + Math.cos(angle) * 25}
                  y2={150 + Math.sin(angle) * 25}
                  stroke="#C9A227"
                  strokeWidth="2"
                />
              )
            })}
            <circle cx="150" cy="150" r="14" fill="#0a0a0a" stroke="#C9A227" strokeWidth="2" />
          </g>
        </svg>

        {/* Hour hand - geometric arrow */}
        <motion.div
          className="absolute top-1/2 left-1/2"
          style={{
            width: 14,
            height: clockSize * 0.24,
            transformOrigin: 'center bottom',
            marginLeft: -7,
            marginTop: -clockSize * 0.24,
          }}
          animate={{ rotate: time.smoothHourAngle }}
        >
          <svg viewBox="0 0 20 90" className="h-full w-full">
            <path d="M10 0 L4 30 L7 30 L7 90 L13 90 L13 30 L16 30 Z" fill="url(#artDecoGold)" />
          </svg>
        </motion.div>

        {/* Minute hand - sleek geometric */}
        <motion.div
          className="absolute top-1/2 left-1/2"
          style={{
            width: 10,
            height: clockSize * 0.36,
            transformOrigin: 'center bottom',
            marginLeft: -5,
            marginTop: -clockSize * 0.36,
          }}
          animate={{ rotate: time.smoothMinuteAngle }}
        >
          <svg viewBox="0 0 14 120" className="h-full w-full">
            <path d="M7 0 L2 25 L5 25 L5 120 L9 120 L9 25 L12 25 Z" fill="url(#artDecoGold)" />
          </svg>
        </motion.div>

        {/* Second hand - thin gold needle */}
        <motion.div
          className="absolute top-1/2 left-1/2"
          style={{
            width: 2,
            height: clockSize * 0.42,
            background: 'linear-gradient(to top, #C9A227 0%, #FFD700 100%)',
            transformOrigin: 'center bottom',
            marginLeft: -1,
            marginTop: -clockSize * 0.42,
          }}
          animate={{ rotate: time.smoothSecondAngle }}
        />

        {/* Center jewel */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            width: 14,
            height: 14,
            background: 'radial-gradient(circle at 30% 30%, #FFD700 0%, #C9A227 50%, #8B6914 100%)',
            boxShadow: '0 0 10px 2px rgba(201, 162, 39, 0.5)',
          }}
        />
      </div>

      {/* Time display */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-center">
        <div className="text-3xl font-light tracking-[0.5em]" style={{ color: '#C9A227' }}>
          {String(time.hours || 12).padStart(2, '0')}:{String(time.minutes).padStart(2, '0')}
        </div>
        <div className="mt-1 text-xs tracking-[0.3em] opacity-60" style={{ color: '#C9A227' }}>
          THE ROARING TWENTIES • 1925
        </div>
      </div>

      {/* Fullscreen indicator */}
      <div className="absolute top-4 right-4 text-xs text-amber-400/40">
        {isFullscreen ? 'ESC to exit' : 'Click for fullscreen'}
      </div>
    </div>
  )
}
