'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import Navigation from '@/components/quiet-hands/Navigation'

const SCAN_STEPS = [
  {
    title: 'Notice your feet',
    description: 'Feel where they touch the ground. The pressure, the temperature.',
  },
  {
    title: 'Notice your hands',
    description: "What are they doing right now? Where are they resting? What's their temperature?",
  },
  {
    title: 'Notice your shoulders',
    description: 'Are they tense? Relaxed? Let them drop just a little.',
  },
  {
    title: 'Notice your jaw',
    description: "Is it clenched? Let it soften. You don't need to hold it tight.",
  },
  {
    title: 'Notice your breath',
    description: 'Just observe. Is it shallow? Deep? Fast? Slow? No need to change it.',
  },
  {
    title: 'Take it all in',
    description: "You've just checked in with yourself. That's awareness in action.",
  },
]

export default function ScanPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [isComplete, setIsComplete] = useState(false)

  const handleNext = () => {
    if (currentStep < SCAN_STEPS.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      setIsComplete(true)
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-stone-50 pb-24 dark:from-stone-900 dark:to-stone-900">
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

          <div className="inline-flex items-center gap-2 rounded-full bg-sky-100 px-3 py-1 text-sm text-sky-700 dark:bg-sky-900/30 dark:text-sky-400">
            Body Scan
          </div>

          <h1 className="mt-4 text-2xl font-light text-stone-800 dark:text-stone-100">
            Quick Check-In
          </h1>
          <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
            A gentle scan through your body. Take your time.
          </p>
        </motion.header>

        {/* Progress */}
        <div className="mb-8 flex gap-1">
          {SCAN_STEPS.map((_, index) => (
            <div
              key={index}
              className={`h-1 flex-1 rounded-full transition-colors ${
                index <= currentStep
                  ? 'bg-sky-400 dark:bg-sky-500'
                  : 'bg-stone-200 dark:bg-stone-700'
              }`}
            />
          ))}
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {!isComplete ? (
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="mb-8"
            >
              <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-stone-200/50 dark:bg-stone-800 dark:ring-stone-700">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-sky-100 dark:bg-sky-900/30">
                  <span className="text-2xl font-light text-sky-600 dark:text-sky-400">
                    {currentStep + 1}
                  </span>
                </div>
                <h2 className="mb-3 text-xl font-medium text-stone-800 dark:text-stone-100">
                  {SCAN_STEPS[currentStep].title}
                </h2>
                <p className="text-stone-600 dark:text-stone-300">
                  {SCAN_STEPS[currentStep].description}
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-8 text-center"
            >
              <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-sky-100 dark:bg-sky-900/30">
                <svg
                  className="h-10 w-10 text-sky-600 dark:text-sky-400"
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
                Scan complete
              </h2>
              <p className="text-stone-500 dark:text-stone-400">
                You just gave yourself a moment of awareness. That matters.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Actions */}
        <div className="space-y-3">
          {!isComplete ? (
            <>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleNext}
                className="w-full rounded-xl bg-sky-500 py-4 font-medium text-white shadow-sm transition-colors hover:bg-sky-600 dark:bg-sky-600 dark:hover:bg-sky-500"
              >
                {currentStep < SCAN_STEPS.length - 1 ? 'Next' : 'Complete'}
              </motion.button>
              {currentStep > 0 && (
                <button
                  onClick={handleBack}
                  className="w-full text-sm text-stone-500 hover:text-stone-700 dark:text-stone-400"
                >
                  ← Previous
                </button>
              )}
            </>
          ) : (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push('/quiet-hands')}
              className="w-full rounded-xl bg-sky-500 py-4 font-medium text-white shadow-sm transition-colors hover:bg-sky-600 dark:bg-sky-600 dark:hover:bg-sky-500"
            >
              Done
            </motion.button>
          )}
        </div>
      </div>

      <Navigation />
    </div>
  )
}
