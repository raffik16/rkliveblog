'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'

interface MorphShapeProps {
  size?: number
  className?: string
  colors?: string[]
}

export default function MorphShape({
  size = 200,
  className = '',
  colors = ['#FF5B04', '#075056', '#16232A'],
}: MorphShapeProps) {
  const [currentShape, setCurrentShape] = useState(0)

  const shapes = [
    'M 50 10 L 90 90 L 10 90 Z', // Triangle
    'M 10 50 Q 10 10 50 10 Q 90 10 90 50 Q 90 90 50 90 Q 10 90 10 50', // Circle
    'M 10 10 L 90 10 L 90 90 L 10 90 Z', // Square
    'M 50 10 L 70 40 L 90 50 L 70 60 L 50 90 L 30 60 L 10 50 L 30 40 Z', // Star
  ]

  const toggleShape = () => {
    setCurrentShape((prev) => (prev + 1) % shapes.length)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      toggleShape()
    }
  }

  return (
    <div
      className={className}
      onClick={toggleShape}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label="Click to morph shape"
      style={{ cursor: 'pointer' }}
    >
      <svg width={size} height={size} viewBox="0 0 100 100">
        <motion.path
          d={shapes[currentShape]}
          fill={colors[currentShape % colors.length]}
          animate={{ d: shapes[currentShape] }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        />
      </svg>
    </div>
  )
}
