'use client'

import { motion, useScroll, useSpring } from 'framer-motion'

interface ScrollProgressProps {
  color?: string
  height?: number
  position?: 'top' | 'bottom'
  zIndex?: number
}

export default function ScrollProgress({
  color = '#FF5B04',
  height = 4,
  position = 'top',
  zIndex = 101,
}: ScrollProgressProps) {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  })

  return (
    <motion.div
      className="fixed right-0 left-0 z-50 origin-left"
      style={{
        scaleX,
        zIndex,
        height: `${height}px`,
        backgroundColor: color,
        [position]: 0,
      }}
    />
  )
}
