'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import Navigation from '@/components/quiet-hands/Navigation'
import {
  getTodayCount,
  getPatternInsight,
  formatFeelingLabel,
  formatLocationLabel,
} from '@/lib/quiet-hands/storage'

export default function QuietHandsHome() {
  const [mounted, setMounted] = useState(false)
  const [todayCount, setTodayCount] = useState(0)
  const [pattern, setPattern] = useState<ReturnType<typeof getPatternInsight>>(null)

  useEffect(() => {
    setMounted(true)
    setTodayCount(getTodayCount())
    setPattern(getPatternInsight())
  }, [])

  if (!mounted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-stone-50 dark:bg-stone-900">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="h-8 w-8 rounded-full border-2 border-amber-200 border-t-amber-500"
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-50 to-amber-50/30 pb-24 dark:from-stone-900 dark:to-stone-900">
      <div className="mx-auto max-w-md px-4 py-8">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 text-center"
        >
          <h1 className="text-3xl font-light tracking-tight text-stone-800 dark:text-stone-100">
            Quiet Hands
          </h1>
          <p className="mt-2 text-sm text-stone-500 dark:text-stone-400">
            A gentle companion for awareness
          </p>
        </motion.header>

        {/* Primary Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-6 space-y-3"
        >
          <Link href="/quiet-hands/log?type=urge">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-stone-200/50 transition-shadow hover:shadow-md dark:bg-stone-800 dark:ring-stone-700"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30">
                  <svg
                    className="h-6 w-6 text-amber-600 dark:text-amber-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <div>
                  <h2 className="font-medium text-stone-800 dark:text-stone-100">
                    I'm feeling the urge
                  </h2>
                  <p className="text-sm text-stone-500 dark:text-stone-400">
                    I noticed before it started
                  </p>
                </div>
              </div>
            </motion.div>
          </Link>

          <Link href="/quiet-hands/log?type=caught">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-stone-200/50 transition-shadow hover:shadow-md dark:bg-stone-800 dark:ring-stone-700"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-100 dark:bg-rose-900/30">
                  <svg
                    className="h-6 w-6 text-rose-600 dark:text-rose-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                </div>
                <div>
                  <h2 className="font-medium text-stone-800 dark:text-stone-100">
                    I just caught myself
                  </h2>
                  <p className="text-sm text-stone-500 dark:text-stone-400">
                    I noticed after it started
                  </p>
                </div>
              </div>
            </motion.div>
          </Link>
        </motion.div>

        {/* Quick Tools */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-6"
        >
          <h3 className="mb-3 text-sm font-medium text-stone-600 dark:text-stone-400">
            Quick tools
          </h3>
          <div className="grid grid-cols-4 gap-2">
            {[
              { href: '/quiet-hands/scan', label: 'Scan', color: 'bg-sky-100 dark:bg-sky-900/30' },
              {
                href: '/quiet-hands/resist',
                label: 'Resist',
                color: 'bg-violet-100 dark:bg-violet-900/30',
              },
              {
                href: '/quiet-hands/surf',
                label: 'Surf',
                color: 'bg-teal-100 dark:bg-teal-900/30',
              },
              {
                href: '/quiet-hands/breathe',
                label: 'Breathe',
                color: 'bg-pink-100 dark:bg-pink-900/30',
              },
            ].map((tool) => (
              <Link key={tool.href} href={tool.href}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex flex-col items-center justify-center rounded-xl ${tool.color} p-4 transition-shadow hover:shadow-sm`}
                >
                  <span className="text-sm font-medium text-stone-700 dark:text-stone-200">
                    {tool.label}
                  </span>
                </motion.div>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Today's Count */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-6 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-stone-200/50 dark:bg-stone-800 dark:ring-stone-700"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-stone-500 dark:text-stone-400">Today's moments</p>
              <p className="text-2xl font-light text-stone-800 dark:text-stone-100">{todayCount}</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-stone-100 dark:bg-stone-700">
              <svg
                className="h-5 w-5 text-stone-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          </div>
          <p className="mt-2 text-xs text-stone-400 dark:text-stone-500">
            Every notice counts. This data is for you, not to judge you.
          </p>
        </motion.div>

        {/* Pattern Insight */}
        {pattern && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 p-5 ring-1 ring-amber-200/50 dark:from-amber-900/20 dark:to-orange-900/20 dark:ring-amber-800/30"
          >
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-800/50">
                <svg
                  className="h-4 w-4 text-amber-600 dark:text-amber-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-stone-700 dark:text-stone-200">
                  Pattern noticed
                </p>
                <p className="mt-1 text-sm text-stone-600 dark:text-stone-300">
                  You often feel{' '}
                  <span className="font-medium text-amber-700 dark:text-amber-400">
                    {formatFeelingLabel(pattern.feeling)}
                  </span>{' '}
                  when{' '}
                  <span className="font-medium text-amber-700 dark:text-amber-400">
                    {formatLocationLabel(pattern.location)}
                  </span>
                  <span className="ml-1 text-stone-400">— {pattern.count} times</span>
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      <Navigation />
    </div>
  )
}
