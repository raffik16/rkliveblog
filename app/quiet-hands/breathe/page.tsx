'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Navigation from '@/components/quiet-hands/Navigation'

type BreathPhase = 'inhale' | 'hold' | 'exhale' | 'rest'

const BREATH_PATTERNS = {
  relaxed: {
    name: 'Relaxed Breathing',
    description: 'A gentle 4-4-4-4 pattern',
    inhale: 4,
    holdIn: 4,
    exhale: 4,
    holdOut: 4,
  },
  calming: {
    name: 'Calming Breath',
    description: 'Longer exhale for relaxation (4-2-6-2)',
    inhale: 4,
    holdIn: 2,
    exhale: 6,
    holdOut: 2,
  },
  quick: {
    name: 'Quick Reset',
    description: 'A fast 3-1-3-1 cycle',
    inhale: 3,
    holdIn: 1,
    exhale: 3,
    holdOut: 1,
  },
}

type PatternKey = keyof typeof BREATH_PATTERNS

export default function BreathePage() {
  const router = useRouter()
  const [selectedPattern, setSelectedPattern] = useState<PatternKey | null>(null)
  const [isActive, setIsActive] = useState(false)
  const [phase, setPhase] = useState<BreathPhase>('inhale')
  const [countdown, setCountdown] = useState(0)
  const [cycles, setCycles] = useState(0)
  const [isComplete, setIsComplete] = useState(false)

  const pattern = selectedPattern ? BREATH_PATTERNS[selectedPattern] : null

  const stop = useCallback(() => {
    setIsActive(false)
    setIsComplete(true)
  }, [])

  useEffect(() => {
    if (!isActive || !pattern) return

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          // Move to next phase
          setPhase((currentPhase) => {
            switch (currentPhase) {
              case 'inhale':
                return 'hold'
              case 'hold':
                return 'exhale'
              case 'exhale':
                return 'rest'
              case 'rest':
                setCycles((c) => c + 1)
                return 'inhale'
            }
          })
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [isActive, pattern])

  useEffect(() => {
    if (!pattern || !isActive) return

    const durations: Record<BreathPhase, number> = {
      inhale: pattern.inhale,
      hold: pattern.holdIn,
      exhale: pattern.exhale,
      rest: pattern.holdOut,
    }

    setCountdown(durations[phase])
  }, [phase, pattern, isActive])

  const start = (patternKey: PatternKey) => {
    setSelectedPattern(patternKey)
    setIsActive(true)
    setPhase('inhale')
    setCycles(0)
    setCountdown(BREATH_PATTERNS[patternKey].inhale)
  }

  const reset = () => {
    setSelectedPattern(null)
    setIsActive(false)
    setIsComplete(false)
    setCycles(0)
  }

  const getPhaseLabel = () => {
    switch (phase) {
      case 'inhale':
        return 'Breathe in'
      case 'hold':
        return 'Hold'
      case 'exhale':
        return 'Breathe out'
      case 'rest':
        return 'Rest'
    }
  }

  const getCircleScale = () => {
    switch (phase) {
      case 'inhale':
        return 1.3
      case 'hold':
        return 1.3
      case 'exhale':
        return 1
      case 'rest':
        return 1
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-stone-50 pb-24 dark:from-stone-900 dark:to-stone-900">
      <div className="mx-auto max-w-md px-4 py-8">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <button
            onClick={() => router.push('/quiet-hands')}
            className="mb-4 flex items-center gap-2 text-sm text-stone-500 hover:text-stone-700 dark:text-stone-400 dark:hover:text-stone-200"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to home
          </button>

          <div className="inline-flex items-center gap-2 rounded-full bg-pink-100 px-3 py-1 text-sm text-pink-700 dark:bg-pink-900/30 dark:text-pink-400">
            Breathing
          </div>

          <h1 className="mt-4 text-2xl font-light text-stone-800 dark:text-stone-100">
            Simple Breathing
          </h1>
          <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
            A gentle rhythm to help settle your nervous system.
          </p>
        </motion.header>

        {/* Pattern Selection */}
        {!selectedPattern && !isComplete && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            <p className="mb-4 text-sm text-stone-600 dark:text-stone-300">
              Choose a breathing pattern. Each works differently—try what feels right.
            </p>
            {(Object.keys(BREATH_PATTERNS) as PatternKey[]).map((key) => (
              <motion.button
                key={key}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => start(key)}
                className="w-full rounded-xl bg-white p-4 text-left shadow-sm ring-1 ring-stone-200/50 transition-all hover:bg-pink-50 dark:bg-stone-800 dark:ring-stone-700 dark:hover:bg-stone-700"
              >
                <span className="block font-medium text-stone-700 dark:text-stone-200">
                  {BREATH_PATTERNS[key].name}
                </span>
                <span className="text-sm text-stone-500 dark:text-stone-400">
                  {BREATH_PATTERNS[key].description}
                </span>
              </motion.button>
            ))}
          </motion.div>
        )}

        {/* Active Breathing */}
        {isActive && pattern && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8 text-center"
          >
            {/* Breathing Circle */}
            <div className="flex items-center justify-center py-8">
              <motion.div
                animate={{ scale: getCircleScale() }}
                transition={{
                  duration:
                    phase === 'inhale' || phase === 'exhale'
                      ? phase === 'inhale'
                        ? pattern.inhale
                        : pattern.exhale
                      : 0.3,
                  ease: 'easeInOut',
                }}
                className="relative flex h-48 w-48 items-center justify-center"
              >
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-pink-200 to-pink-300 opacity-50 dark:from-pink-800/50 dark:to-pink-700/50" />
                <div className="absolute inset-4 rounded-full bg-gradient-to-br from-pink-100 to-pink-200 dark:from-pink-900/50 dark:to-pink-800/50" />
                <div className="relative text-center">
                  <p className="text-lg font-medium text-pink-800 dark:text-pink-200">
                    {getPhaseLabel()}
                  </p>
                  <p className="text-3xl font-light text-pink-600 dark:text-pink-300">
                    {countdown}
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Cycles counter */}
            <p className="text-sm text-stone-500 dark:text-stone-400">
              {cycles} {cycles === 1 ? 'cycle' : 'cycles'} completed
            </p>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={stop}
              className="w-full rounded-xl bg-pink-500 py-4 font-medium text-white shadow-sm transition-colors hover:bg-pink-600 dark:bg-pink-600 dark:hover:bg-pink-500"
            >
              I'm done
            </motion.button>
          </motion.div>
        )}

        {/* Complete */}
        {isComplete && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-pink-100 dark:bg-pink-900/30">
              <svg
                className="h-10 w-10 text-pink-600 dark:text-pink-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="mb-2 text-xl font-medium text-stone-800 dark:text-stone-100">
              {cycles} {cycles === 1 ? 'breath cycle' : 'breath cycles'}
            </h2>
            <p className="mb-8 text-stone-500 dark:text-stone-400">
              You gave your nervous system a moment to settle. That's kindness.
            </p>

            <div className="space-y-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => router.push('/quiet-hands')}
                className="w-full rounded-xl bg-pink-500 py-4 font-medium text-white shadow-sm transition-colors hover:bg-pink-600 dark:bg-pink-600 dark:hover:bg-pink-500"
              >
                Done
              </motion.button>
              <button
                onClick={reset}
                className="w-full text-sm text-stone-500 hover:text-stone-700 dark:text-stone-400"
              >
                Try another pattern
              </button>
            </div>
          </motion.div>
        )}
      </div>

      <Navigation />
    </div>
  )
}
