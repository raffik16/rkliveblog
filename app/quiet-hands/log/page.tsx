'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { addLog } from '@/lib/quiet-hands/storage'
import { FEELINGS, LOCATIONS } from '@/lib/quiet-hands/types'
import type { Feeling, Location, LogType } from '@/lib/quiet-hands/types'

function LogForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const type = (searchParams.get('type') as LogType) || 'urge'

  const [feeling, setFeeling] = useState<Feeling | ''>('')
  const [location, setLocation] = useState<Location | ''>('')
  const [note, setNote] = useState('')
  const [step, setStep] = useState<'feeling' | 'location' | 'note'>('feeling')

  const isUrge = type === 'urge'

  const handleSubmit = () => {
    if (!feeling || !location) return

    addLog({
      type,
      feeling,
      location,
      note: note.trim() || undefined,
    })

    router.push('/quiet-hands')
  }

  const handleFeelingSelect = (f: Feeling) => {
    setFeeling(f)
    setStep('location')
  }

  const handleLocationSelect = (l: Location) => {
    setLocation(l)
    setStep('note')
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-50 to-amber-50/30 dark:from-stone-900 dark:to-stone-900">
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
            Back
          </button>

          <div
            className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm ${
              isUrge
                ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                : 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400'
            }`}
          >
            {isUrge ? 'Feeling the urge' : 'Just caught myself'}
          </div>

          <h1 className="mt-4 text-2xl font-light text-stone-800 dark:text-stone-100">
            {step === 'feeling' && 'What are you feeling?'}
            {step === 'location' && 'Where are you?'}
            {step === 'note' && 'Anything to add?'}
          </h1>
          <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
            {step === 'feeling' && 'Just a quick check-in. No judgment.'}
            {step === 'location' && 'This helps spot patterns over time.'}
            {step === 'note' && "Optional — a few words if you'd like."}
          </p>
        </motion.header>

        {/* Feeling Selection */}
        {step === 'feeling' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-2 gap-2"
          >
            {FEELINGS.map((f) => (
              <motion.button
                key={f.value}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleFeelingSelect(f.value)}
                className={`rounded-xl p-4 text-left transition-all ${
                  feeling === f.value
                    ? 'bg-amber-100 ring-2 ring-amber-400 dark:bg-amber-900/30'
                    : 'bg-white hover:bg-stone-50 dark:bg-stone-800 dark:hover:bg-stone-700'
                } shadow-sm ring-1 ring-stone-200/50 dark:ring-stone-700`}
              >
                <span className="font-medium text-stone-700 dark:text-stone-200">{f.label}</span>
              </motion.button>
            ))}
          </motion.div>
        )}

        {/* Location Selection */}
        {step === 'location' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="grid grid-cols-2 gap-2">
              {LOCATIONS.map((l) => (
                <motion.button
                  key={l.value}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleLocationSelect(l.value)}
                  className={`rounded-xl p-4 text-left transition-all ${
                    location === l.value
                      ? 'bg-amber-100 ring-2 ring-amber-400 dark:bg-amber-900/30'
                      : 'bg-white hover:bg-stone-50 dark:bg-stone-800 dark:hover:bg-stone-700'
                  } shadow-sm ring-1 ring-stone-200/50 dark:ring-stone-700`}
                >
                  <span className="font-medium text-stone-700 dark:text-stone-200">{l.label}</span>
                </motion.button>
              ))}
            </div>

            <button
              onClick={() => setStep('feeling')}
              className="text-sm text-stone-500 hover:text-stone-700 dark:text-stone-400"
            >
              ← Change feeling
            </button>
          </motion.div>
        )}

        {/* Note & Submit */}
        {step === 'note' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="A thought, a trigger, anything..."
              className="w-full rounded-xl border-0 bg-white p-4 text-stone-700 shadow-sm ring-1 ring-stone-200/50 placeholder:text-stone-400 focus:ring-2 focus:ring-amber-400 dark:bg-stone-800 dark:text-stone-200 dark:ring-stone-700"
              rows={3}
            />

            <div className="rounded-xl bg-stone-100 p-4 dark:bg-stone-800">
              <p className="text-sm text-stone-600 dark:text-stone-300">
                <span className="font-medium">Summary:</span>{' '}
                {isUrge ? 'Feeling the urge' : 'Just caught myself'}, feeling{' '}
                <span className="text-amber-600 dark:text-amber-400">
                  {FEELINGS.find((f) => f.value === feeling)?.label.toLowerCase()}
                </span>
                , while{' '}
                <span className="text-amber-600 dark:text-amber-400">
                  {LOCATIONS.find((l) => l.value === location)?.label.toLowerCase()}
                </span>
              </p>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSubmit}
              className="w-full rounded-xl bg-amber-500 py-4 font-medium text-white shadow-sm transition-colors hover:bg-amber-600 dark:bg-amber-600 dark:hover:bg-amber-500"
            >
              Log this moment
            </motion.button>

            <button
              onClick={() => setStep('location')}
              className="w-full text-sm text-stone-500 hover:text-stone-700 dark:text-stone-400"
            >
              ← Change location
            </button>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default function LogPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-stone-50 dark:bg-stone-900">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="h-8 w-8 rounded-full border-2 border-amber-200 border-t-amber-500"
          />
        </div>
      }
    >
      <LogForm />
    </Suspense>
  )
}
