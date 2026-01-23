'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import Navigation from '@/components/quiet-hands/Navigation'

const SURF_PROMPTS = [
  'Notice the urge. Where do you feel it in your body?',
  'Observe its intensity. Is it rising, peaking, or falling?',
  'Remember: urges are like waves. They rise, crest, and fall.',
  "You don't have to fight the wave. You can ride it.",
  'Stay curious. What does the urge feel like right now?',
  'Notice any changes. Has the intensity shifted?',
  "You're still here. The urge hasn't swept you away.",
  'Keep observing. Waves always pass.',
]

export default function SurfPage() {
  const router = useRouter()
  const [isActive, setIsActive] = useState(false)
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0)
  const [seconds, setSeconds] = useState(0)
  const [isComplete, setIsComplete] = useState(false)

  const stop = useCallback(() => {
    setIsActive(false)
    setIsComplete(true)
  }, [])

  useEffect(() => {
    if (!isActive) return

    const timer = setInterval(() => {
      setSeconds((prev) => prev + 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [isActive])

  useEffect(() => {
    if (!isActive) return

    const promptInterval = setInterval(() => {
      setCurrentPromptIndex((prev) => (prev + 1) % SURF_PROMPTS.length)
    }, 8000)

    return () => clearInterval(promptInterval)
  }, [isActive])

  const start = () => {
    setIsActive(true)
    setSeconds(0)
    setCurrentPromptIndex(0)
  }

  const reset = () => {
    setIsActive(false)
    setIsComplete(false)
    setSeconds(0)
    setCurrentPromptIndex(0)
  }

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60)
    const remainingSecs = secs % 60
    return `${mins}:${remainingSecs.toString().padStart(2, '0')}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-stone-50 pb-24 dark:from-stone-900 dark:to-stone-900">
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

          <div className="inline-flex items-center gap-2 rounded-full bg-teal-100 px-3 py-1 text-sm text-teal-700 dark:bg-teal-900/30 dark:text-teal-400">
            Urge Surfing
          </div>

          <h1 className="mt-4 text-2xl font-light text-stone-800 dark:text-stone-100">
            Ride the Wave
          </h1>
          <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
            Observe the urge without acting on it. Urges rise, peak, and fall.
          </p>
        </motion.header>

        {/* Intro */}
        {!isActive && !isComplete && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-stone-200/50 dark:bg-stone-800 dark:ring-stone-700">
              <h2 className="mb-3 font-medium text-stone-800 dark:text-stone-100">
                What is urge surfing?
              </h2>
              <p className="text-sm text-stone-600 dark:text-stone-300">
                Urges are like ocean waves—they rise, reach a peak, and then naturally subside.
                Instead of fighting the wave or being swept away by it, you can learn to observe it
                with curiosity.
              </p>
            </div>

            <div className="rounded-2xl bg-teal-50 p-6 ring-1 ring-teal-200/50 dark:bg-teal-900/20 dark:ring-teal-800/30">
              <h2 className="mb-3 font-medium text-teal-800 dark:text-teal-200">How it works</h2>
              <ul className="space-y-2 text-sm text-teal-700 dark:text-teal-300">
                <li>• Notice where you feel the urge in your body</li>
                <li>• Observe its intensity without judgment</li>
                <li>• Stay curious as it changes moment to moment</li>
                <li>• Remember: every wave eventually passes</li>
              </ul>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={start}
              className="w-full rounded-xl bg-teal-500 py-4 font-medium text-white shadow-sm transition-colors hover:bg-teal-600 dark:bg-teal-600 dark:hover:bg-teal-500"
            >
              Start Surfing
            </motion.button>
          </motion.div>
        )}

        {/* Active Surfing */}
        {isActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8 text-center"
          >
            {/* Wave Animation */}
            <div className="relative h-32 overflow-hidden rounded-2xl bg-gradient-to-b from-teal-100 to-teal-200 dark:from-teal-900/30 dark:to-teal-800/30">
              <motion.div
                animate={{
                  x: [0, -100, 0],
                  y: [0, -10, 0, 10, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="absolute right-0 bottom-0 left-0"
              >
                <svg viewBox="0 0 1440 100" className="w-[200%]">
                  <path
                    fill="currentColor"
                    className="text-teal-400/50 dark:text-teal-600/50"
                    d="M0,50 C200,100 400,0 600,50 C800,100 1000,0 1200,50 C1400,100 1440,50 1440,50 L1440,100 L0,100 Z"
                  />
                </svg>
              </motion.div>
            </div>

            {/* Timer */}
            <div className="text-3xl font-light text-stone-800 dark:text-stone-100">
              {formatTime(seconds)}
            </div>

            {/* Prompt */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPromptIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5 }}
                className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-stone-200/50 dark:bg-stone-800 dark:ring-stone-700"
              >
                <p className="text-lg text-stone-700 dark:text-stone-200">
                  {SURF_PROMPTS[currentPromptIndex]}
                </p>
              </motion.div>
            </AnimatePresence>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={stop}
              className="w-full rounded-xl bg-teal-500 py-4 font-medium text-white shadow-sm transition-colors hover:bg-teal-600 dark:bg-teal-600 dark:hover:bg-teal-500"
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
            <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-teal-100 dark:bg-teal-900/30">
              <svg
                className="h-10 w-10 text-teal-600 dark:text-teal-400"
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
              You surfed for {formatTime(seconds)}
            </h2>
            <p className="mb-8 text-stone-500 dark:text-stone-400">
              You observed the urge without acting on it. That's a powerful skill.
            </p>

            <div className="space-y-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => router.push('/quiet-hands')}
                className="w-full rounded-xl bg-teal-500 py-4 font-medium text-white shadow-sm transition-colors hover:bg-teal-600 dark:bg-teal-600 dark:hover:bg-teal-500"
              >
                Done
              </motion.button>
              <button
                onClick={reset}
                className="w-full text-sm text-stone-500 hover:text-stone-700 dark:text-stone-400"
              >
                Surf again
              </button>
            </div>
          </motion.div>
        )}
      </div>

      <Navigation />
    </div>
  )
}
