'use client'

import { useRef, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useClockTime, useFullscreen } from '../hooks/useClockTime'

export default function MedievalCathedral() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { isFullscreen, toggleFullscreen, handleKeyDown } = useFullscreen(containerRef)
  const time = useClockTime(false) // Ticking motion for medieval clock
  const [bellRing, setBellRing] = useState(false)

  // Ring bell on the hour
  useEffect(() => {
    if (time.minutes === 0 && time.seconds === 0) {
      setBellRing(true)
      setTimeout(() => setBellRing(false), 2000)
    }
  }, [time.minutes, time.seconds])

  const clockSize = isFullscreen ? 380 : 260

  return (
    <div
      ref={containerRef}
      className="relative flex h-full min-h-[400px] w-full cursor-pointer items-center justify-center overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
      }}
      onClick={toggleFullscreen}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label="Medieval Cathedral clock - click for fullscreen"
    >
      {/* Gothic architecture background */}
      <div className="absolute inset-0 opacity-10">
        <svg viewBox="0 0 400 400" className="h-full w-full">
          {/* Gothic arches */}
          <path
            d="M50 400 L50 200 Q100 100 150 200 L150 400 M250 400 L250 200 Q300 100 350 200 L350 400"
            fill="none"
            stroke="#8B4513"
            strokeWidth="2"
          />
          {/* Rose window hints */}
          <circle cx="200" cy="80" r="50" fill="none" stroke="#8B4513" strokeWidth="1" />
          <circle cx="200" cy="80" r="40" fill="none" stroke="#8B4513" strokeWidth="1" />
        </svg>
      </div>

      {/* Main clock face */}
      <div
        className="relative"
        style={{
          width: clockSize,
          height: clockSize,
        }}
      >
        <svg viewBox="0 0 300 300" className="h-full w-full">
          <defs>
            {/* Iron texture gradient */}
            <radialGradient id="ironGradient">
              <stop offset="0%" stopColor="#5C4033" />
              <stop offset="50%" stopColor="#4A3728" />
              <stop offset="100%" stopColor="#3D2914" />
            </radialGradient>
            {/* Gold accent gradient */}
            <linearGradient id="brassGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#D4A574" />
              <stop offset="50%" stopColor="#B8860B" />
              <stop offset="100%" stopColor="#8B7355" />
            </linearGradient>
          </defs>

          {/* Outer iron ring */}
          <circle cx="150" cy="150" r="145" fill="none" stroke="#2C1810" strokeWidth="10" />
          <circle cx="150" cy="150" r="140" fill="url(#ironGradient)" />

          {/* Decorative inner ring with studs */}
          <circle cx="150" cy="150" r="130" fill="none" stroke="#8B4513" strokeWidth="3" />

          {/* Iron studs around the edge */}
          {[...Array(24)].map((_, i) => {
            const angle = (i * 15 - 90) * (Math.PI / 180)
            const x = 150 + Math.cos(angle) * 135
            const y = 150 + Math.sin(angle) * 135
            return <circle key={i} cx={x} cy={y} r="4" fill="#2C1810" />
          })}

          {/* Clock face - parchment colored */}
          <circle cx="150" cy="150" r="115" fill="#F5DEB3" />
          <circle cx="150" cy="150" r="115" fill="none" stroke="#8B4513" strokeWidth="2" />

          {/* Roman numerals in gothic style */}
          {['XII', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI'].map(
            (num, i) => {
              const angle = (i * 30 - 90) * (Math.PI / 180)
              const x = 150 + Math.cos(angle) * 90
              const y = 150 + Math.sin(angle) * 90
              return (
                <text
                  key={i}
                  x={x}
                  y={y + 6}
                  textAnchor="middle"
                  fill="#2C1810"
                  fontSize="16"
                  fontFamily="serif"
                  fontWeight="bold"
                  style={{ fontVariant: 'small-caps' }}
                >
                  {num}
                </text>
              )
            }
          )}

          {/* Minute markers */}
          {[...Array(60)].map((_, i) => {
            if (i % 5 === 0) return null
            const angle = (i * 6 - 90) * (Math.PI / 180)
            const x1 = 150 + Math.cos(angle) * 105
            const y1 = 150 + Math.sin(angle) * 105
            const x2 = 150 + Math.cos(angle) * 110
            const y2 = 150 + Math.sin(angle) * 110
            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#8B4513" strokeWidth="1" />
          })}

          {/* Center decorative cross */}
          <circle cx="150" cy="150" r="25" fill="#8B4513" />
          <circle cx="150" cy="150" r="22" fill="url(#brassGradient)" />
          <path
            d="M150 130 L150 170 M130 150 L170 150"
            stroke="#2C1810"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>

        {/* Hour hand - heavy iron style */}
        <motion.div
          className="absolute top-1/2 left-1/2"
          style={{
            width: 10,
            height: clockSize * 0.25,
            background: 'linear-gradient(90deg, #1C1C1C 0%, #3D3D3D 50%, #1C1C1C 100%)',
            transformOrigin: 'center bottom',
            marginLeft: -5,
            marginTop: -clockSize * 0.25,
            borderRadius: '4px 4px 0 0',
            boxShadow: '2px 2px 4px rgba(0,0,0,0.5)',
          }}
          animate={{ rotate: time.hourAngle }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />

        {/* Minute hand - ornate iron */}
        <motion.div
          className="absolute top-1/2 left-1/2"
          style={{
            width: 6,
            height: clockSize * 0.35,
            background: 'linear-gradient(90deg, #2C2C2C 0%, #4A4A4A 50%, #2C2C2C 100%)',
            transformOrigin: 'center bottom',
            marginLeft: -3,
            marginTop: -clockSize * 0.35,
            borderRadius: '3px 3px 0 0',
            boxShadow: '2px 2px 4px rgba(0,0,0,0.5)',
          }}
          animate={{ rotate: time.minuteAngle }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        />

        {/* Center cap */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            width: 20,
            height: 20,
            background: 'radial-gradient(circle, #B8860B 0%, #8B7355 100%)',
            boxShadow: 'inset 0 -2px 4px rgba(0,0,0,0.3)',
          }}
        />
      </div>

      {/* Bell animation */}
      <motion.div
        className="absolute top-8"
        animate={bellRing ? { rotate: [-10, 10, -10, 10, 0] } : {}}
        transition={{ duration: 0.5, repeat: 3 }}
      >
        <svg width="40" height="50" viewBox="0 0 40 50">
          <path
            d="M20 5 L20 0 M10 10 Q5 15 5 30 L35 30 Q35 15 30 10 Q25 5 20 5 Q15 5 10 10 M5 30 L5 35 L35 35 L35 30 M17 35 L17 45 Q20 48 23 45 L23 35"
            fill="#B8860B"
            stroke="#8B7355"
            strokeWidth="1"
          />
        </svg>
      </motion.div>

      {/* Time display */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-center text-amber-100">
        <div className="font-serif text-2xl tracking-widest">
          {String(time.hours || 12).padStart(2, '0')}:{String(time.minutes).padStart(2, '0')}
        </div>
        <div className="mt-1 text-xs tracking-wider opacity-60">MEDIEVAL EUROPE • 1300 CE</div>
      </div>

      {/* Fullscreen indicator */}
      <div className="absolute top-4 right-4 text-xs text-amber-200/40">
        {isFullscreen ? 'ESC to exit' : 'Click for fullscreen'}
      </div>
    </div>
  )
}
