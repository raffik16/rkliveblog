'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { ReactNode } from 'react'

interface FloatingElementProps {
  children: ReactNode
  duration?: number
  yOffset?: number
  delay?: number
}

export default function FloatingElement({
  children,
  duration = 3,
  yOffset = 20,
  delay = 0,
}: FloatingElementProps) {
  const shouldReduceMotion = useReducedMotion()

  return (
    <motion.div
      animate={
        shouldReduceMotion
          ? undefined
          : {
              y: [0, -yOffset, 0],
            }
      }
      transition={
        shouldReduceMotion
          ? undefined
          : {
              duration,
              repeat: Infinity,
              ease: 'easeInOut',
              delay,
            }
      }
    >
      {children}
    </motion.div>
  )
}
