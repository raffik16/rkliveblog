'use client'

import { useState, useCallback, useEffect } from 'react'
import type { AnimationPhase } from '../types'

export function useAnimationState(duration: number = 2000) {
  const [phase, setPhase] = useState<AnimationPhase>('idle')
  const [progress, setProgress] = useState(0)

  const start = useCallback(() => {
    setPhase('entering')
    setProgress(0)
  }, [])

  const reset = useCallback(() => {
    setPhase('idle')
    setProgress(0)
  }, [])

  useEffect(() => {
    if (phase !== 'entering') return

    const startTime = Date.now()
    let animationFrame: number

    const animate = () => {
      const elapsed = Date.now() - startTime
      const newProgress = Math.min(elapsed / duration, 1)
      setProgress(newProgress)

      if (newProgress < 1) {
        animationFrame = requestAnimationFrame(animate)
      } else {
        setPhase('complete')
      }
    }

    animationFrame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationFrame)
  }, [phase, duration])

  return { phase, progress, start, reset }
}

export function useAutoReplay(interval: number = 4000) {
  const [key, setKey] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setKey((k) => k + 1)
    }, interval)
    return () => clearInterval(timer)
  }, [interval])

  const replay = useCallback(() => {
    setKey((k) => k + 1)
  }, [])

  return { key, replay }
}
