'use client'

import { useRef } from 'react'
import { motion } from 'framer-motion'
import { useClockTime, useFullscreen } from '../hooks/useClockTime'

export default function DigitalLED() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { isFullscreen, toggleFullscreen, handleKeyDown } = useFullscreen(containerRef)
  const time = useClockTime(false)

  // Seven-segment display patterns
  const segments: { [key: string]: boolean[] } = {
    '0': [true, true, true, true, true, true, false],
    '1': [false, true, true, false, false, false, false],
    '2': [true, true, false, true, true, false, true],
    '3': [true, true, true, true, false, false, true],
    '4': [false, true, true, false, false, true, true],
    '5': [true, false, true, true, false, true, true],
    '6': [true, false, true, true, true, true, true],
    '7': [true, true, true, false, false, false, false],
    '8': [true, true, true, true, true, true, true],
    '9': [true, true, true, true, false, true, true],
  }

  const SevenSegment = ({ digit, size = 60 }: { digit: string; size?: number }) => {
    const segs = segments[digit] || segments['0']
    const w = size * 0.6
    const h = size
    const t = size * 0.12 // segment thickness
    const g = size * 0.02 // gap

    // Segment positions: [a, b, c, d, e, f, g]
    // a = top, b = top-right, c = bottom-right, d = bottom
    // e = bottom-left, f = top-left, g = middle

    return (
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
        {/* a - top horizontal */}
        <polygon
          points={`${g + t / 2},${g} ${w - g - t / 2},${g} ${w - g - t},${t + g} ${g + t},${t + g}`}
          fill={segs[0] ? '#FF0000' : '#2a0000'}
          style={{ filter: segs[0] ? 'drop-shadow(0 0 4px #FF0000)' : 'none' }}
        />
        {/* b - top-right vertical */}
        <polygon
          points={`${w - g},${g + t / 2} ${w - g},${h / 2 - g / 2} ${w - t - g},${h / 2 - t / 2} ${w - t - g},${t + g}`}
          fill={segs[1] ? '#FF0000' : '#2a0000'}
          style={{ filter: segs[1] ? 'drop-shadow(0 0 4px #FF0000)' : 'none' }}
        />
        {/* c - bottom-right vertical */}
        <polygon
          points={`${w - g},${h / 2 + g / 2} ${w - g},${h - g - t / 2} ${w - t - g},${h - t - g} ${w - t - g},${h / 2 + t / 2}`}
          fill={segs[2] ? '#FF0000' : '#2a0000'}
          style={{ filter: segs[2] ? 'drop-shadow(0 0 4px #FF0000)' : 'none' }}
        />
        {/* d - bottom horizontal */}
        <polygon
          points={`${g + t},${h - t - g} ${w - g - t},${h - t - g} ${w - g - t / 2},${h - g} ${g + t / 2},${h - g}`}
          fill={segs[3] ? '#FF0000' : '#2a0000'}
          style={{ filter: segs[3] ? 'drop-shadow(0 0 4px #FF0000)' : 'none' }}
        />
        {/* e - bottom-left vertical */}
        <polygon
          points={`${g},${h / 2 + g / 2} ${t + g},${h / 2 + t / 2} ${t + g},${h - t - g} ${g},${h - g - t / 2}`}
          fill={segs[4] ? '#FF0000' : '#2a0000'}
          style={{ filter: segs[4] ? 'drop-shadow(0 0 4px #FF0000)' : 'none' }}
        />
        {/* f - top-left vertical */}
        <polygon
          points={`${g},${g + t / 2} ${t + g},${t + g} ${t + g},${h / 2 - t / 2} ${g},${h / 2 - g / 2}`}
          fill={segs[5] ? '#FF0000' : '#2a0000'}
          style={{ filter: segs[5] ? 'drop-shadow(0 0 4px #FF0000)' : 'none' }}
        />
        {/* g - middle horizontal */}
        <polygon
          points={`${g + t},${h / 2 - t / 2} ${w - g - t},${h / 2 - t / 2} ${w - g - t / 2},${h / 2} ${w - g - t},${h / 2 + t / 2} ${g + t},${h / 2 + t / 2} ${g + t / 2},${h / 2}`}
          fill={segs[6] ? '#FF0000' : '#2a0000'}
          style={{ filter: segs[6] ? 'drop-shadow(0 0 4px #FF0000)' : 'none' }}
        />
      </svg>
    )
  }

  const Colon = ({ size = 60, blink = true }: { size?: number; blink?: boolean }) => {
    const show = blink ? time.seconds % 2 === 0 : true
    return (
      <div className="mx-1 flex flex-col justify-center gap-2">
        <div
          className="rounded-sm"
          style={{
            width: size * 0.15,
            height: size * 0.15,
            background: show ? '#FF0000' : '#2a0000',
            boxShadow: show ? '0 0 8px #FF0000' : 'none',
          }}
        />
        <div
          className="rounded-sm"
          style={{
            width: size * 0.15,
            height: size * 0.15,
            background: show ? '#FF0000' : '#2a0000',
            boxShadow: show ? '0 0 8px #FF0000' : 'none',
          }}
        />
      </div>
    )
  }

  const digitSize = isFullscreen ? 100 : 60
  const hours = String(time.hours || 12).padStart(2, '0')
  const minutes = String(time.minutes).padStart(2, '0')
  const seconds = String(time.seconds).padStart(2, '0')

  return (
    <div
      ref={containerRef}
      className="relative flex h-full min-h-[400px] w-full cursor-pointer items-center justify-center overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #000000 0%, #0a0a0a 50%, #111111 100%)',
      }}
      onClick={toggleFullscreen}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label="Digital LED clock - click for fullscreen"
    >
      {/* Scan lines overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.3) 2px, rgba(0,0,0,0.3) 4px)',
        }}
      />

      {/* LED display housing */}
      <div
        className="relative rounded-lg p-6"
        style={{
          background: 'linear-gradient(145deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%)',
          border: '3px solid #2a2a2a',
          boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.8), 0 4px 20px rgba(0,0,0,0.5)',
        }}
      >
        {/* Display face with slight curve effect */}
        <div
          className="rounded p-4"
          style={{
            background: 'linear-gradient(180deg, #050505 0%, #0a0a0a 50%, #050505 100%)',
            boxShadow: 'inset 0 0 30px rgba(255,0,0,0.1)',
          }}
        >
          {/* Time display */}
          <div className="flex items-center justify-center">
            <SevenSegment digit={hours[0]} size={digitSize} />
            <SevenSegment digit={hours[1]} size={digitSize} />
            <Colon size={digitSize} />
            <SevenSegment digit={minutes[0]} size={digitSize} />
            <SevenSegment digit={minutes[1]} size={digitSize} />
            <Colon size={digitSize} />
            <SevenSegment digit={seconds[0]} size={digitSize} />
            <SevenSegment digit={seconds[1]} size={digitSize} />
          </div>

          {/* AM/PM indicator */}
          <div className="mt-2 mr-2 flex justify-end">
            <div className="flex gap-4">
              <span
                className="text-xs font-bold"
                style={{
                  color: new Date().getHours() < 12 ? '#FF0000' : '#2a0000',
                  textShadow: new Date().getHours() < 12 ? '0 0 8px #FF0000' : 'none',
                }}
              >
                AM
              </span>
              <span
                className="text-xs font-bold"
                style={{
                  color: new Date().getHours() >= 12 ? '#FF0000' : '#2a0000',
                  textShadow: new Date().getHours() >= 12 ? '0 0 8px #FF0000' : 'none',
                }}
              >
                PM
              </span>
            </div>
          </div>
        </div>

        {/* Brand label */}
        <div className="mt-3 text-center">
          <span className="text-xs tracking-[0.3em]" style={{ color: '#333' }}>
            CHRONO-DIGIT
          </span>
        </div>
      </div>

      {/* Reflection effect */}
      <div
        className="absolute bottom-0 left-1/2 h-1/4 w-3/4 -translate-x-1/2 opacity-5"
        style={{
          background: 'linear-gradient(to bottom, rgba(255,0,0,0.3) 0%, transparent 100%)',
          filter: 'blur(20px)',
        }}
      />

      {/* Era label */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
        <span className="text-xs tracking-[0.3em] text-red-900">DIGITAL REVOLUTION • 1975</span>
      </div>

      {/* Fullscreen indicator */}
      <div className="absolute top-4 right-4 text-xs text-red-900/60">
        {isFullscreen ? 'ESC to exit' : 'Click for fullscreen'}
      </div>
    </div>
  )
}
