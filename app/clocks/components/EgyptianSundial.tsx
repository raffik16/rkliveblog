'use client'

import { useRef } from 'react'
import { motion } from 'framer-motion'
import { useClockTime, useFullscreen } from '../hooks/useClockTime'

export default function EgyptianSundial() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { isFullscreen, toggleFullscreen, handleKeyDown } = useFullscreen(containerRef)
  const time = useClockTime(true)

  // Calculate shadow angle based on sun position (hour)
  const sunAngle = time.hours * 30 + time.minutes * 0.5 - 90 // Sun moves east to west
  const shadowLength = 80 + Math.sin((time.hours / 12) * Math.PI) * 40

  return (
    <div
      ref={containerRef}
      className="relative flex h-full min-h-[400px] w-full cursor-pointer items-center justify-center overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #2C1810 0%, #4A3728 50%, #8B7355 100%)',
      }}
      onClick={toggleFullscreen}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label="Egyptian Sundial clock - click for fullscreen"
    >
      {/* Desert sand texture overlay */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 20%, #D4A574 1px, transparent 1px),
                           radial-gradient(circle at 80% 80%, #C4956A 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Sun */}
      <motion.div
        className="absolute"
        animate={{
          x: Math.cos((sunAngle * Math.PI) / 180) * 150,
          y: Math.sin((sunAngle * Math.PI) / 180) * 80 - 50,
        }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        style={{
          width: 60,
          height: 60,
          borderRadius: '50%',
          background: 'radial-gradient(circle, #FFD700 0%, #FFA500 50%, #FF8C00 100%)',
          boxShadow: '0 0 60px 20px rgba(255, 215, 0, 0.4)',
        }}
      />

      {/* Sundial base - stone slab */}
      <div
        className="relative"
        style={{
          width: isFullscreen ? 400 : 280,
          height: isFullscreen ? 400 : 280,
        }}
      >
        {/* Stone circle with hieroglyphic markings */}
        <svg viewBox="0 0 300 300" className="h-full w-full">
          {/* Main stone circle */}
          <defs>
            <radialGradient id="stoneGradient">
              <stop offset="0%" stopColor="#D4A574" />
              <stop offset="50%" stopColor="#C4956A" />
              <stop offset="100%" stopColor="#A67B5B" />
            </radialGradient>
            <filter id="stoneTexture">
              <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="4" />
              <feDisplacementMap in="SourceGraphic" scale="5" />
            </filter>
          </defs>

          <circle cx="150" cy="150" r="140" fill="url(#stoneGradient)" />
          <circle cx="150" cy="150" r="140" fill="none" stroke="#8B7355" strokeWidth="4" />
          <circle cx="150" cy="150" r="130" fill="none" stroke="#6B5344" strokeWidth="1" />

          {/* Hour lines carved into stone */}
          {[...Array(12)].map((_, i) => {
            const angle = (i * 30 - 90) * (Math.PI / 180)
            const x1 = 150 + Math.cos(angle) * 100
            const y1 = 150 + Math.sin(angle) * 100
            const x2 = 150 + Math.cos(angle) * 125
            const y2 = 150 + Math.sin(angle) * 125
            return (
              <g key={i}>
                <line
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="#5C4033"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                {/* Hieroglyphic-style numerals */}
                <text
                  x={150 + Math.cos(angle) * 85}
                  y={150 + Math.sin(angle) * 85 + 5}
                  textAnchor="middle"
                  fill="#3D2914"
                  fontSize="14"
                  fontFamily="serif"
                  fontWeight="bold"
                >
                  {i === 0
                    ? 'XII'
                    : i <= 3
                      ? 'I'.repeat(i)
                      : i === 4
                        ? 'IV'
                        : i === 5
                          ? 'V'
                          : i === 6
                            ? 'VI'
                            : i === 7
                              ? 'VII'
                              : i === 8
                                ? 'VIII'
                                : i === 9
                                  ? 'IX'
                                  : i === 10
                                    ? 'X'
                                    : 'XI'}
                </text>
              </g>
            )
          })}

          {/* Central obelisk base */}
          <circle cx="150" cy="150" r="15" fill="#5C4033" />
          <circle cx="150" cy="150" r="12" fill="#6B5344" />

          {/* Eye of Ra decoration */}
          <ellipse cx="150" cy="50" rx="15" ry="8" fill="none" stroke="#3D2914" strokeWidth="2" />
          <circle cx="150" cy="50" r="4" fill="#3D2914" />
        </svg>

        {/* Shadow (gnomon shadow) */}
        <motion.div
          className="absolute top-1/2 left-1/2 origin-center"
          style={{
            width: 4,
            height: shadowLength,
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.1) 100%)',
            transformOrigin: 'center top',
            borderRadius: 2,
            filter: 'blur(2px)',
          }}
          animate={{
            rotate: time.smoothHourAngle + 180,
            height: shadowLength,
          }}
          transition={{ duration: 0.1, ease: 'linear' }}
        />

        {/* Gnomon (vertical pointer) */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{
            width: 0,
            height: 0,
            borderLeft: '8px solid transparent',
            borderRight: '8px solid transparent',
            borderBottom: '40px solid #3D2914',
            filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.5))',
          }}
        />
      </div>

      {/* Time display */}
      <div
        className="absolute bottom-4 left-1/2 -translate-x-1/2 text-center"
        style={{ color: '#D4A574' }}
      >
        <div className="font-serif text-2xl tracking-widest">
          {String(time.hours || 12).padStart(2, '0')}:{String(time.minutes).padStart(2, '0')}
        </div>
        <div className="mt-1 text-xs tracking-wider opacity-60">ANCIENT EGYPT • 1500 BCE</div>
      </div>

      {/* Fullscreen indicator */}
      <div className="absolute top-4 right-4 text-xs text-amber-200/40">
        {isFullscreen ? 'ESC to exit' : 'Click for fullscreen'}
      </div>
    </div>
  )
}
