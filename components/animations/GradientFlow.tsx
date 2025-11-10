'use client'

import { motion } from 'framer-motion'
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
  return (
    <motion.div
      className={`relative ${className}`}
      style={{
        background: `linear-gradient(45deg, ${colors.join(', ')})`,
        backgroundSize: '300% 300%',
      }}
      animate={{
        backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: 'linear',
      }}
    >
      {children}
    </motion.div>
  )
}
