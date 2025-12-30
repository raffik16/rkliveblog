'use client'

import { useState, useEffect, useCallback } from 'react'

export interface ClockTime {
  hours: number
  minutes: number
  seconds: number
  milliseconds: number
  // Angles in degrees
  hourAngle: number
  minuteAngle: number
  secondAngle: number
  // Smooth angles (for continuous motion)
  smoothHourAngle: number
  smoothMinuteAngle: number
  smoothSecondAngle: number
}

export function useClockTime(smoothSeconds: boolean = true): ClockTime {
  const getTime = useCallback((): ClockTime => {
    const now = new Date()
    const hours = now.getHours() % 12
    const minutes = now.getMinutes()
    const seconds = now.getSeconds()
    const milliseconds = now.getMilliseconds()

    // Standard angles (ticking)
    const hourAngle = hours * 30 + minutes * 0.5
    const minuteAngle = minutes * 6
    const secondAngle = seconds * 6

    // Smooth angles (continuous sweep)
    const smoothSecondAngle = seconds * 6 + milliseconds * 0.006
    const smoothMinuteAngle = minutes * 6 + seconds * 0.1
    const smoothHourAngle = hours * 30 + minutes * 0.5 + seconds * (0.5 / 60)

    return {
      hours,
      minutes,
      seconds,
      milliseconds,
      hourAngle,
      minuteAngle,
      secondAngle,
      smoothHourAngle,
      smoothMinuteAngle,
      smoothSecondAngle: smoothSeconds ? smoothSecondAngle : secondAngle,
    }
  }, [smoothSeconds])

  const [time, setTime] = useState<ClockTime>(getTime)

  useEffect(() => {
    let animationFrameId: number

    const updateTime = () => {
      setTime(getTime())
      animationFrameId = requestAnimationFrame(updateTime)
    }

    animationFrameId = requestAnimationFrame(updateTime)

    return () => {
      cancelAnimationFrame(animationFrameId)
    }
  }, [getTime])

  return time
}

export function useFullscreen(elementRef: React.RefObject<HTMLElement | null>) {
  const [isFullscreen, setIsFullscreen] = useState(false)

  useEffect(() => {
    const handleChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener('fullscreenchange', handleChange)
    return () => document.removeEventListener('fullscreenchange', handleChange)
  }, [])

  const toggleFullscreen = useCallback(async () => {
    if (!elementRef.current) return

    try {
      if (!document.fullscreenElement) {
        await elementRef.current.requestFullscreen()
      } else {
        await document.exitFullscreen()
      }
    } catch (err) {
      console.error('Fullscreen error:', err)
    }
  }, [elementRef])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        toggleFullscreen()
      }
    },
    [toggleFullscreen]
  )

  return { isFullscreen, toggleFullscreen, handleKeyDown }
}
