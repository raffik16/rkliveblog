'use client'

import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

interface CountUpAnimationProps {
  value: number
  duration?: number
  className?: string
  prefix?: string
  suffix?: string
  /** Use locale digit grouping (1,247). Turn off for years and similar values. */
  useGrouping?: boolean
  locale?: string
}

/**
 * Renders the final value as text on the server and on first paint, so the number is
 * always present for search engines, screen readers and no-JS visitors. It only counts
 * up from zero when the element starts out of view (so nobody sees it jump back to 0)
 * and the visitor has not asked for reduced motion.
 */
export default function CountUpAnimation({
  value,
  duration = 2,
  className = '',
  prefix = '',
  suffix = '',
  useGrouping = true,
  locale = 'en-US',
}: CountUpAnimationProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const reduceMotion = useReducedMotion()
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  const [shouldAnimate, setShouldAnimate] = useState(false)

  const format = (n: number) =>
    prefix +
    new Intl.NumberFormat(locale, { useGrouping, maximumFractionDigits: 0 }).format(n) +
    suffix
  const finalText = format(value)

  const count = useMotionValue(value)
  const text = useTransform(count, (latest) => format(Math.round(latest)))

  // Keep the displayed number in sync with the prop whenever we are not animating.
  useEffect(() => {
    if (!shouldAnimate) count.set(value)
  }, [count, shouldAnimate, value])

  // Decide once, after mount, whether a count-up is appropriate.
  useEffect(() => {
    const el = ref.current
    if (!el || reduceMotion) return
    const rect = el.getBoundingClientRect()
    const startsInView = rect.top < window.innerHeight && rect.bottom > 0
    if (!startsInView) {
      // Off screen, so resetting to zero is invisible.
      count.set(0)
      setShouldAnimate(true)
    }
    // Only evaluated on mount: later scroll positions must not reset the number.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!shouldAnimate || !isInView) return
    const controls = animate(count, value, { duration, ease: 'easeOut' })
    return () => controls.stop()
  }, [shouldAnimate, isInView, count, value, duration])

  return (
    <>
      <motion.span ref={ref} className={className} aria-hidden={shouldAnimate || undefined}>
        {text}
      </motion.span>
      {shouldAnimate && <span className="sr-only">{finalText}</span>}
    </>
  )
}
