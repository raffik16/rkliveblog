'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Navigation from '@/components/quiet-hands/Navigation'

const TIMER_OPTIONS = [
  { seconds: 30, label: '30 seconds' },
  { seconds: 60, label: '1 minute' },
  { seconds: 120, label: '2 minutes' },
  { seconds: 300, label: '5 minutes' },
]

export default function ResistPage() {
  const router = useRouter()
  const [selectedTime, setSelectedTime] = useState<number | null>(null)
  const [timeRemaining, setTimeRemaining] = useState<number>(0)
  const [isRunning, setIsRunning] = useState(false)
  const [isComplete, setIsComplete] = useState(false)

  const startTimer = (seconds: number) => {
    setSelectedTime(seconds)
    setTimeRemaining(seconds)
    setIsRunning(true)
  }

  const resetTimer = useCallback(() => {
    setSelectedTime(null)
    setTimeRemaining(0)
    setIsRunning(false)
    setIsComplete(false)
  }, [])

  useEffect(() => {
    if (!isRunning || timeRemaining <= 0) return

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          setIsRunning(false)
          setIsComplete(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [isRunning, timeRemaining])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const progress = selectedTime ? ((selectedTime - timeRemaining) / selectedTime) * 100 : 0

  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-50 to-stone-50 pb-24 dark:from-stone-900 dark:to-stone-900">
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

          <div className="inline-flex items-center gap-2 rounded-full bg-violet-100 px-3 py-1 text-sm text-violet-700 dark:bg-violet-900/30 dark:text-violet-400">
            Pause & Choose
          </div>

          <h1 className="mt-4 text-2xl font-light text-stone-800 dark:text-stone-100">
            Create Some Space
          </h1>
          <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
            Wait before acting. Even a short pause can change things.
          </p>
        </motion.header>

        {/* Timer Selection */}
        {!selectedTime && !isComplete && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            <p className="mb-4 text-sm text-stone-600 dark:text-stone-300">
              Choose how long you'd like to wait. This isn't about willpower—it's about giving
              yourself time to make a choice.
            </p>
            {TIMER_OPTIONS.map((option) => (
              <motion.button
                key={option.seconds}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => startTimer(option.seconds)}
                className="w-full rounded-xl bg-white p-4 text-left shadow-sm ring-1 ring-stone-200/50 transition-all hover:bg-violet-50 dark:bg-stone-800 dark:ring-stone-700 dark:hover:bg-stone-700"
              >
                <span className="font-medium text-stone-700 dark:text-stone-200">
                  {option.label}
                </span>
              </motion.button>
            ))}
          </motion.div>
        )}

        {/* Active Timer */}
        {isRunning && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <div className="relative mb-8 inline-flex h-48 w-48 items-center justify-center">
              {/* Progress ring */}
              <svg className="absolute h-full w-full -rotate-90">
                <circle
                  cx="96"
                  cy="96"
                  r="88"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="8"
                  className="text-stone-200 dark:text-stone-700"
                />
                <circle
                  cx="96"
                  cy="96"
                  r="88"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="8"
                  strokeLinecap="round"
                  className="text-violet-500 dark:text-violet-400"
                  strokeDasharray={553}
                  strokeDashoffset={553 - (553 * progress) / 100}
                  style={{ transition: 'stroke-dashoffset 1s linear' }}
                />
              </svg>
              <span className="text-5xl font-light text-stone-800 dark:text-stone-100">
                {formatTime(timeRemaining)}
              </span>
            </div>

            <p className="mb-8 text-stone-600 dark:text-stone-300">
              Just breathe. You're creating space between urge and action.
            </p>

            <button
              onClick={resetTimer}
              className="text-sm text-stone-500 hover:text-stone-700 dark:text-stone-400"
            >
              Cancel
            </button>
          </motion.div>
        )}

        {/* Complete */}
        {isComplete && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-violet-100 dark:bg-violet-900/30">
              <svg
                className="h-10 w-10 text-violet-600 dark:text-violet-400"
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
              You did it
            </h2>
            <p className="mb-8 text-stone-500 dark:text-stone-400">
              You created space. Now you can choose what comes next.
            </p>

            <div className="space-y-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => router.push('/quiet-hands')}
                className="w-full rounded-xl bg-violet-500 py-4 font-medium text-white shadow-sm transition-colors hover:bg-violet-600 dark:bg-violet-600 dark:hover:bg-violet-500"
              >
                Done
              </motion.button>
              <button
                onClick={resetTimer}
                className="w-full text-sm text-stone-500 hover:text-stone-700 dark:text-stone-400"
              >
                Try another pause
              </button>
            </div>
          </motion.div>
        )}
      </div>

      <Navigation />
    </div>
  )
}
