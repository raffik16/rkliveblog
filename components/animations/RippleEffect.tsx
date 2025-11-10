'use client'

import { motion } from 'framer-motion'
import { ReactNode, useState } from 'react'

interface RippleEffectProps {
  children: ReactNode
  className?: string
  rippleColor?: string
}

export default function RippleEffect({
  children,
  className = '',
  rippleColor = 'rgba(255, 91, 4, 0.3)',
}: RippleEffectProps) {
  const [ripples, setRipples] = useState<{ x: number; y: number; id: number }[]>([])

  const addRipple = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const id = Date.now()

    setRipples((prev) => [...prev, { x, y, id }])

    setTimeout(() => {
      setRipples((prev) => prev.filter((ripple) => ripple.id !== id))
    }, 800)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      const rect = e.currentTarget.getBoundingClientRect()
      const x = rect.width / 2
      const y = rect.height / 2
      const id = Date.now()

      setRipples((prev) => [...prev, { x, y, id }])

      setTimeout(() => {
        setRipples((prev) => prev.filter((ripple) => ripple.id !== id))
      }, 800)
    }
  }

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      onClick={addRipple}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label="Click to create ripple effect"
      style={{ cursor: 'pointer' }}
    >
      {children}
      {ripples.map((ripple) => (
        <motion.span
          key={ripple.id}
          className="pointer-events-none absolute rounded-full"
          style={{
            left: ripple.x,
            top: ripple.y,
            backgroundColor: rippleColor,
          }}
          initial={{ width: 0, height: 0, opacity: 1 }}
          animate={{
            width: 500,
            height: 500,
            opacity: 0,
          }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      ))}
    </div>
  )
}
