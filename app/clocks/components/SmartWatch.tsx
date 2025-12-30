'use client'

import { useRef, useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useClockTime, useFullscreen } from '../hooks/useClockTime'

export default function SmartWatch() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { isFullscreen, toggleFullscreen, handleKeyDown } = useFullscreen(containerRef)
  const time = useClockTime(true)
  const [steps] = useState(Math.floor(Math.random() * 5000) + 3000)
  const [heartRate] = useState(Math.floor(Math.random() * 20) + 65)
  const [battery] = useState(Math.floor(Math.random() * 40) + 60)

  const watchSize = isFullscreen ? 380 : 260

  // Activity ring progress
  const moveProgress = 0.75
  const exerciseProgress = 0.45
  const standProgress = 0.9

  const ActivityRing = ({
    progress,
    color,
    radius,
    strokeWidth,
  }: {
    progress: number
    color: string
    radius: number
    strokeWidth: number
  }) => {
    const circumference = 2 * Math.PI * radius
    const offset = circumference - progress * circumference

    return (
      <g>
        {/* Background ring */}
        <circle
          cx="150"
          cy="150"
          r={radius}
          fill="none"
          stroke={`${color}33`}
          strokeWidth={strokeWidth}
        />
        {/* Progress ring */}
        <motion.circle
          cx="150"
          cy="150"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform="rotate(-90 150 150)"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
        />
      </g>
    )
  }

  return (
    <div
      ref={containerRef}
      className="relative flex h-full min-h-[400px] w-full cursor-pointer items-center justify-center overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0f1f2e 100%)',
      }}
      onClick={toggleFullscreen}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label="Smart Watch clock - click for fullscreen"
    >
      {/* Watch body */}
      <div
        className="relative"
        style={{
          width: watchSize,
          height: watchSize,
        }}
      >
        {/* Watch case - titanium look */}
        <div
          className="absolute inset-0 rounded-[20%]"
          style={{
            background: 'linear-gradient(145deg, #3a3a3a 0%, #1a1a1a 50%, #2a2a2a 100%)',
            boxShadow: '0 10px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)',
          }}
        />

        {/* Digital crown */}
        <div
          className="absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2"
          style={{
            width: 16,
            height: 40,
            background: 'linear-gradient(90deg, #2a2a2a 0%, #4a4a4a 50%, #2a2a2a 100%)',
            borderRadius: 4,
          }}
        />

        {/* Screen */}
        <div
          className="absolute overflow-hidden rounded-[15%]"
          style={{
            top: '8%',
            left: '8%',
            right: '8%',
            bottom: '8%',
            background: '#000',
          }}
        >
          <svg viewBox="0 0 300 300" className="h-full w-full">
            {/* OLED black background */}
            <rect width="300" height="300" fill="#000" />

            {/* Activity rings */}
            <ActivityRing progress={moveProgress} color="#FF2D55" radius={115} strokeWidth={12} />
            <ActivityRing
              progress={exerciseProgress}
              color="#00FF00"
              radius={100}
              strokeWidth={12}
            />
            <ActivityRing progress={standProgress} color="#00D4FF" radius={85} strokeWidth={12} />

            {/* Digital time display */}
            <text
              x="150"
              y="145"
              textAnchor="middle"
              fill="white"
              fontSize="52"
              fontFamily="SF Pro Display, -apple-system, sans-serif"
              fontWeight="200"
            >
              {String(time.hours || 12).padStart(2, '0')}:{String(time.minutes).padStart(2, '0')}
            </text>

            {/* Seconds */}
            <text
              x="150"
              y="175"
              textAnchor="middle"
              fill="#00D4AA"
              fontSize="20"
              fontFamily="SF Pro Display, -apple-system, sans-serif"
              fontWeight="300"
            >
              :{String(time.seconds).padStart(2, '0')}
            </text>

            {/* Date */}
            <text
              x="150"
              y="200"
              textAnchor="middle"
              fill="#666"
              fontSize="14"
              fontFamily="SF Pro Display, -apple-system, sans-serif"
            >
              {new Date()
                .toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
                .toUpperCase()}
            </text>

            {/* Complications */}
            {/* Steps */}
            <g transform="translate(60, 250)">
              <text x="0" y="0" fill="#00FF00" fontSize="10" fontFamily="sans-serif">
                👟
              </text>
              <text x="18" y="0" fill="#aaa" fontSize="12" fontFamily="SF Pro Display, sans-serif">
                {steps.toLocaleString()}
              </text>
            </g>

            {/* Heart rate */}
            <g transform="translate(130, 250)">
              <motion.text
                x="0"
                y="0"
                fill="#FF2D55"
                fontSize="10"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.8, repeat: Infinity }}
              >
                ❤️
              </motion.text>
              <text x="18" y="0" fill="#aaa" fontSize="12" fontFamily="SF Pro Display, sans-serif">
                {heartRate}
              </text>
            </g>

            {/* Battery */}
            <g transform="translate(200, 250)">
              <text x="0" y="0" fill={battery > 20 ? '#00FF00' : '#FF2D55'} fontSize="10">
                🔋
              </text>
              <text x="18" y="0" fill="#aaa" fontSize="12" fontFamily="SF Pro Display, sans-serif">
                {battery}%
              </text>
            </g>

            {/* Notification dot */}
            <circle cx="270" cy="30" r="6" fill="#FF2D55">
              <animate attributeName="opacity" values="1;0.5;1" dur="2s" repeatCount="indefinite" />
            </circle>
          </svg>
        </div>

        {/* Screen reflection */}
        <div
          className="pointer-events-none absolute rounded-[15%]"
          style={{
            top: '8%',
            left: '8%',
            right: '8%',
            bottom: '8%',
            background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%)',
          }}
        />
      </div>

      {/* Watch band hint */}
      <div
        className="absolute top-0 left-1/2 h-8 w-20 -translate-x-1/2 rounded-t-lg"
        style={{
          background: 'linear-gradient(180deg, #1a1a1a 0%, #2a2a2a 100%)',
        }}
      />
      <div
        className="absolute bottom-0 left-1/2 h-8 w-20 -translate-x-1/2 rounded-b-lg"
        style={{
          background: 'linear-gradient(0deg, #1a1a1a 0%, #2a2a2a 100%)',
        }}
      />

      {/* Era label */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
        <span className="text-xs tracking-[0.3em] text-cyan-400/60">CONNECTED AGE • 2015</span>
      </div>

      {/* Fullscreen indicator */}
      <div className="absolute top-4 right-4 text-xs text-cyan-400/40">
        {isFullscreen ? 'ESC to exit' : 'Click for fullscreen'}
      </div>
    </div>
  )
}
