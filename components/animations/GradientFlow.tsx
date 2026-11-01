'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { ReactNode } from 'react'

interface GradientFlowProps {
  children: ReactNode
  className?: string
  colors?: string[]
  duration?: number
}

export default function GradientFlow({
  children,
  className = '',
  colors = ['#FF5B04', '#075056', '#16232A', '#FF5B04'],
  duration = 8,
}: GradientFlowProps) {
  // MotionConfig's reducedMotion only covers transforms, so the background loop is skipped here
  const shouldReduceMotion = useReducedMotion()

  return (
    <motion.div
      className={`relative ${className}`}
      style={{
        background: `linear-gradient(45deg, ${colors.join(', ')})`,
        backgroundSize: '300% 300%',
        backgroundPosition: '0% 50%',
      }}
      animate={
        shouldReduceMotion
          ? undefined
          : {
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
            }
      }
      transition={
        shouldReduceMotion
          ? undefined
          : {
              duration,
              repeat: Infinity,
              ease: 'linear',
            }
      }
    >
      {children}
    </motion.div>
  )
}
