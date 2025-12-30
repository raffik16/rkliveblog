'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { clockData } from './types'
import {
  EgyptianSundial,
  MedievalCathedral,
  FrenchRococo,
  VictorianRailway,
  ArtDeco,
  SwissLuxury,
  SovietConstructivist,
  JapaneseMinimalist,
  AtomicStarburst,
  DigitalLED,
  SmartWatch,
  HolographicFuture,
} from './components'

const clockComponents: { [key: string]: React.ComponentType } = {
  egyptian: EgyptianSundial,
  medieval: MedievalCathedral,
  rococo: FrenchRococo,
  victorian: VictorianRailway,
  artdeco: ArtDeco,
  swiss: SwissLuxury,
  soviet: SovietConstructivist,
  japanese: JapaneseMinimalist,
  atomic: AtomicStarburst,
  digital: DigitalLED,
  smartwatch: SmartWatch,
  holographic: HolographicFuture,
}

export default function ClocksPage() {
  const [selectedClock, setSelectedClock] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'grid' | 'timeline'>('grid')

  const SelectedComponent = selectedClock ? clockComponents[selectedClock] : null

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-gray-800 bg-gray-950/90 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-light tracking-wide text-white">The Timekeepers</h1>
              <p className="mt-1 text-sm text-gray-400">
                A journey through the history of world clocks
              </p>
            </div>
            <div className="flex items-center gap-4">
              {/* View mode toggle */}
              <div className="flex rounded-lg bg-gray-800 p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`rounded-md px-3 py-1.5 text-sm transition-colors ${
                    viewMode === 'grid'
                      ? 'bg-gray-700 text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Grid
                </button>
                <button
                  onClick={() => setViewMode('timeline')}
                  className={`rounded-md px-3 py-1.5 text-sm transition-colors ${
                    viewMode === 'timeline'
                      ? 'bg-gray-700 text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Timeline
                </button>
              </div>
              <Link
                href="/blog/world-clocks-through-time"
                className="text-primary-500 hover:text-primary-400 text-sm transition-colors"
              >
                Read the story →
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="mx-auto max-w-7xl px-4 py-8">
        {viewMode === 'grid' ? (
          /* Grid View */
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {clockData.map((clock, index) => {
              const ClockComponent = clockComponents[clock.id]
              return (
                <motion.div
                  key={clock.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="group relative aspect-square cursor-pointer overflow-hidden rounded-xl"
                  style={{ background: clock.bgGradient }}
                  onClick={() => setSelectedClock(clock.id)}
                  onKeyDown={(e) => e.key === 'Enter' && setSelectedClock(clock.id)}
                  role="button"
                  tabIndex={0}
                  aria-label={`View ${clock.name} clock`}
                >
                  {/* Clock preview */}
                  <div className="pointer-events-none absolute inset-0 flex scale-75 items-center justify-center">
                    <ClockComponent />
                  </div>

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100">
                    <div className="absolute right-0 bottom-0 left-0 p-4">
                      <div className="mb-1 text-xs font-medium" style={{ color: clock.color }}>
                        {clock.year}
                      </div>
                      <h3 className="font-medium text-white">{clock.name}</h3>
                      <p className="mt-1 text-sm text-gray-400">{clock.description}</p>
                    </div>
                  </div>

                  {/* Click indicator */}
                  <div className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 opacity-0 transition-opacity group-hover:opacity-100">
                    <svg
                      className="h-4 w-4 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5"
                      />
                    </svg>
                  </div>
                </motion.div>
              )
            })}
          </div>
        ) : (
          /* Timeline View */
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute top-0 bottom-0 left-1/2 w-px bg-gradient-to-b from-gray-800 via-gray-700 to-gray-800" />

            <div className="space-y-16">
              {clockData.map((clock, index) => {
                const ClockComponent = clockComponents[clock.id]
                const isLeft = index % 2 === 0

                return (
                  <motion.div
                    key={clock.id}
                    initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`flex items-center gap-8 ${isLeft ? 'flex-row' : 'flex-row-reverse'}`}
                  >
                    {/* Content */}
                    <div className={`flex-1 ${isLeft ? 'text-right' : 'text-left'}`}>
                      <div className="mb-1 text-sm font-medium" style={{ color: clock.color }}>
                        {clock.year}
                      </div>
                      <h3 className="text-xl font-medium text-white">{clock.name}</h3>
                      <p className="mt-1 text-sm text-gray-400">{clock.era}</p>
                      <p className="mt-2 text-sm text-gray-500">{clock.description}</p>
                    </div>

                    {/* Timeline dot */}
                    <div
                      className="z-10 h-4 w-4 flex-shrink-0 rounded-full border-2"
                      style={{
                        borderColor: clock.color,
                        background: 'rgb(3 7 18)',
                      }}
                    />

                    {/* Clock preview */}
                    <div
                      className="group aspect-square max-w-[300px] flex-1 cursor-pointer overflow-hidden rounded-xl"
                      style={{ background: clock.bgGradient }}
                      onClick={() => setSelectedClock(clock.id)}
                      onKeyDown={(e) => e.key === 'Enter' && setSelectedClock(clock.id)}
                      role="button"
                      tabIndex={0}
                      aria-label={`View ${clock.name} clock`}
                    >
                      <div className="flex h-full w-full scale-90 items-center justify-center transition-transform group-hover:scale-95">
                        <ClockComponent />
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        )}
      </main>

      {/* Fullscreen Modal */}
      <AnimatePresence>
        {selectedClock && SelectedComponent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black"
            onClick={() => setSelectedClock(null)}
          >
            {/* Close button */}
            <button
              onClick={() => setSelectedClock(null)}
              className="absolute top-4 left-4 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20"
            >
              <svg
                className="h-5 w-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Navigation */}
            <div className="absolute bottom-4 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2">
              {clockData.map((clock) => (
                <button
                  key={clock.id}
                  onClick={(e) => {
                    e.stopPropagation()
                    setSelectedClock(clock.id)
                  }}
                  className={`h-3 w-3 rounded-full transition-all ${
                    selectedClock === clock.id ? 'scale-125' : 'opacity-50 hover:opacity-100'
                  }`}
                  style={{
                    background: selectedClock === clock.id ? clock.color : '#666',
                  }}
                  title={clock.name}
                />
              ))}
            </div>

            {/* Arrow navigation */}
            <button
              onClick={(e) => {
                e.stopPropagation()
                const currentIndex = clockData.findIndex((c) => c.id === selectedClock)
                const prevIndex = currentIndex === 0 ? clockData.length - 1 : currentIndex - 1
                setSelectedClock(clockData[prevIndex].id)
              }}
              className="absolute top-1/2 left-4 z-50 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20"
            >
              <svg
                className="h-6 w-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                const currentIndex = clockData.findIndex((c) => c.id === selectedClock)
                const nextIndex = currentIndex === clockData.length - 1 ? 0 : currentIndex + 1
                setSelectedClock(clockData[nextIndex].id)
              }}
              className="absolute top-1/2 right-4 z-50 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20"
            >
              <svg
                className="h-6 w-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>

            {/* Clock display */}
            <motion.div
              key={selectedClock}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="h-full w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <SelectedComponent />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="mt-16 border-t border-gray-800">
        <div className="mx-auto max-w-7xl px-4 py-8 text-center">
          <p className="text-sm text-gray-500">
            Click any clock to view fullscreen • Each clock shows real-time
          </p>
          <Link
            href="/blog/world-clocks-through-time"
            className="text-primary-500 hover:text-primary-400 mt-4 inline-block transition-colors"
          >
            Read the full history →
          </Link>
        </div>
      </footer>
    </div>
  )
}
