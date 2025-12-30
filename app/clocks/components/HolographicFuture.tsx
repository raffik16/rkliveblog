'use client'

import { useRef } from 'react'
import { motion } from 'framer-motion'
import { useClockTime, useFullscreen } from '../hooks/useClockTime'

export default function HolographicFuture() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { isFullscreen, toggleFullscreen, handleKeyDown } = useFullscreen(containerRef)
  const time = useClockTime(true)

  const clockSize = isFullscreen ? 400 : 280

  return (
    <div
      ref={containerRef}
      className="relative flex h-full min-h-[400px] w-full cursor-pointer items-center justify-center overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #0a0a1a 0%, #1a0a2e 50%, #0a1a2e 100%)',
      }}
      onClick={toggleFullscreen}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label="Holographic Future clock - click for fullscreen"
    >
      {/* Animated grid background */}
      <div className="absolute inset-0 opacity-20">
        <svg viewBox="0 0 400 400" className="h-full w-full">
          <defs>
            <pattern id="holoGrid" patternUnits="userSpaceOnUse" width="40" height="40">
              <path
                d="M40 0 L0 0 0 40"
                fill="none"
                stroke="#00FFFF"
                strokeWidth="0.5"
                opacity="0.3"
              />
            </pattern>
          </defs>
          <rect width="400" height="400" fill="url(#holoGrid)" />
        </svg>
      </div>

      {/* Floating particles */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: Math.random() * 4 + 2,
            height: Math.random() * 4 + 2,
            background: i % 2 === 0 ? '#00FFFF' : '#FF00FF',
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            opacity: 0.4,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.6, 0.2],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}

      {/* Holographic projection base */}
      <motion.div
        className="absolute bottom-16 h-4 w-48 rounded-full"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(0,255,255,0.3) 0%, transparent 70%)',
          filter: 'blur(4px)',
        }}
        animate={{
          scaleX: [1, 1.1, 1],
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{ duration: 2, repeat: Infinity }}
      />

      {/* Main holographic clock */}
      <motion.div
        className="relative"
        style={{
          width: clockSize,
          height: clockSize,
        }}
        animate={{
          rotateY: [0, 5, 0, -5, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        {/* Holographic glow layers */}
        <div
          className="absolute inset-0 rounded-full opacity-20"
          style={{
            background: 'radial-gradient(circle, #00FFFF 0%, transparent 70%)',
            filter: 'blur(40px)',
          }}
        />
        <div
          className="absolute inset-0 rounded-full opacity-10"
          style={{
            background: 'radial-gradient(circle, #FF00FF 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />

        <svg viewBox="0 0 300 300" className="h-full w-full">
          <defs>
            {/* Holographic gradient */}
            <linearGradient id="holoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00FFFF" />
              <stop offset="50%" stopColor="#FF00FF" />
              <stop offset="100%" stopColor="#00FFFF" />
            </linearGradient>
            {/* Glow filter */}
            <filter id="holoGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Outer ring - holographic */}
          <circle
            cx="150"
            cy="150"
            r="145"
            fill="none"
            stroke="url(#holoGradient)"
            strokeWidth="1"
            opacity="0.6"
            filter="url(#holoGlow)"
          />

          {/* Inner rings with animation */}
          {[130, 115, 100].map((r, i) => (
            <motion.circle
              key={i}
              cx="150"
              cy="150"
              r={r}
              fill="none"
              stroke="#00FFFF"
              strokeWidth="0.5"
              opacity={0.3 - i * 0.1}
              strokeDasharray="10 5"
              initial={{ rotate: 0 }}
              animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
              transition={{
                duration: 30 + i * 10,
                repeat: Infinity,
                ease: 'linear',
              }}
              style={{ transformOrigin: '150px 150px' }}
            />
          ))}

          {/* Hour markers - glowing dots */}
          {[...Array(12)].map((_, i) => {
            const angle = (i * 30 - 90) * (Math.PI / 180)
            const x = 150 + Math.cos(angle) * 125
            const y = 150 + Math.sin(angle) * 125
            return (
              <g key={i}>
                <circle cx={x} cy={y} r="4" fill="#00FFFF" opacity="0.8" filter="url(#holoGlow)" />
                <circle cx={x} cy={y} r="2" fill="#FFFFFF" />
              </g>
            )
          })}

          {/* Digital time display - holographic style */}
          <text
            x="150"
            y="130"
            textAnchor="middle"
            fill="url(#holoGradient)"
            fontSize="36"
            fontFamily="monospace"
            fontWeight="100"
            filter="url(#holoGlow)"
          >
            {String(time.hours || 12).padStart(2, '0')}:{String(time.minutes).padStart(2, '0')}
          </text>

          {/* Seconds arc */}
          <motion.circle
            cx="150"
            cy="150"
            r="70"
            fill="none"
            stroke="#FF00FF"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray={2 * Math.PI * 70}
            strokeDashoffset={2 * Math.PI * 70 * (1 - time.seconds / 60)}
            transform="rotate(-90 150 150)"
            filter="url(#holoGlow)"
          />

          {/* Seconds display */}
          <text
            x="150"
            y="165"
            textAnchor="middle"
            fill="#FF00FF"
            fontSize="20"
            fontFamily="monospace"
            fontWeight="100"
          >
            :{String(time.seconds).padStart(2, '0')}
          </text>

          {/* Center core */}
          <motion.circle
            cx="150"
            cy="150"
            r="15"
            fill="none"
            stroke="url(#holoGradient)"
            strokeWidth="2"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{ transformOrigin: '150px 150px' }}
          />
          <circle cx="150" cy="150" r="8" fill="#00FFFF" opacity="0.8" filter="url(#holoGlow)" />

          {/* Floating data points */}
          <motion.g
            animate={{ rotate: 360 }}
            transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
            style={{ transformOrigin: '150px 150px' }}
          >
            {[0, 72, 144, 216, 288].map((angle, i) => {
              const rad = (angle - 90) * (Math.PI / 180)
              const x = 150 + Math.cos(rad) * 90
              const y = 150 + Math.sin(rad) * 90
              return (
                <g key={i}>
                  <line
                    x1="150"
                    y1="150"
                    x2={x}
                    y2={y}
                    stroke="#00FFFF"
                    strokeWidth="0.3"
                    opacity="0.3"
                  />
                  <circle cx={x} cy={y} r="3" fill="#FF00FF" filter="url(#holoGlow)" />
                </g>
              )
            })}
          </motion.g>
        </svg>

        {/* Holographic noise/scan lines */}
        <motion.div
          className="pointer-events-none absolute inset-0 overflow-hidden rounded-full"
          style={{
            background:
              'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,255,0.03) 2px, rgba(0,255,255,0.03) 4px)',
          }}
          animate={{
            backgroundPosition: ['0 0', '0 100px'],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'linear',
          }}
        />

        {/* Glitch effect (occasional) */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background:
              'linear-gradient(90deg, transparent 0%, rgba(255,0,255,0.1) 50%, transparent 100%)',
          }}
          animate={{
            opacity: [0, 0, 0.5, 0],
            x: [-10, 10, -10],
          }}
          transition={{
            duration: 0.2,
            repeat: Infinity,
            repeatDelay: 5,
          }}
        />
      </motion.div>

      {/* Era label */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-center">
        <motion.span
          className="text-xs tracking-[0.5em]"
          style={{
            background: 'linear-gradient(90deg, #00FFFF, #FF00FF)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
          animate={{
            opacity: [0.6, 1, 0.6],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          TOMORROW • 2030
        </motion.span>
      </div>

      {/* Fullscreen indicator */}
      <div className="absolute top-4 right-4 text-xs text-cyan-400/40">
        {isFullscreen ? 'ESC to exit' : 'Click for fullscreen'}
      </div>
    </div>
  )
}
