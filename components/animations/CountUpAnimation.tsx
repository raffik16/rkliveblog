'use client'

import { motion, useInView, useMotionValue, useSpring } from 'framer-motion'
import { useEffect, useRef } from 'react'

interface CountUpAnimationProps {
  value: number
  duration?: number
  className?: string
  prefix?: string
  suffix?: string
}

export default function CountUpAnimation({
  value,
  duration = 2,
  className = '',
  prefix = '',
  suffix = '',
}: CountUpAnimationProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const motionValue = useMotionValue(0)
  const springValue = useSpring(motionValue, { duration: duration * 1000 })
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  useEffect(() => {
    if (isInView) {
      motionValue.set(value)
    }
  }, [motionValue, isInView, value])

  useEffect(() => {
    const unsubscribe = springValue.on('change', (latest) => {
      if (ref.current) {
        ref.current.textContent = prefix + Math.floor(latest).toLocaleString() + suffix
      }
    })

    return () => unsubscribe()
  }, [springValue, prefix, suffix])

  return <span ref={ref} className={className}></span>
}
