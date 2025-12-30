'use client'

import { useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { heroIntros } from './components'
import type { HeroIntro } from './types'

type ViewMode = 'grid' | 'timeline'

export default function HeroIntrosPage() {
  const [selectedIntro, setSelectedIntro] = useState<HeroIntro | null>(null)
  const [viewMode, setViewMode] = useState<ViewMode>('grid')

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedIntro) return

      if (e.key === 'Escape') {
        setSelectedIntro(null)
      } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        const currentIndex = heroIntros.findIndex((i) => i.id === selectedIntro.id)
        const nextIndex = (currentIndex + 1) % heroIntros.length
        setSelectedIntro(heroIntros[nextIndex])
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        const currentIndex = heroIntros.findIndex((i) => i.id === selectedIntro.id)
        const prevIndex = (currentIndex - 1 + heroIntros.length) % heroIntros.length
        setSelectedIntro(heroIntros[prevIndex])
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedIntro])

  const navigate = useCallback(
    (direction: 'prev' | 'next') => {
      if (!selectedIntro) return
      const currentIndex = heroIntros.findIndex((i) => i.id === selectedIntro.id)
      const newIndex =
        direction === 'next'
          ? (currentIndex + 1) % heroIntros.length
          : (currentIndex - 1 + heroIntros.length) % heroIntros.length
      setSelectedIntro(heroIntros[newIndex])
    },
    [selectedIntro]
  )

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-gray-700/50 bg-gray-900/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <div>
            <Link
              href="/blog/hero-intro-animations"
              className="text-sm text-gray-400 transition-colors hover:text-white"
            >
              ← Back to Article
            </Link>
            <h1 className="mt-1 text-xl font-bold text-white md:text-2xl">Hero Intro Animations</h1>
            <p className="text-sm text-gray-400">12 cinematic reveals through history</p>
          </div>

          {/* View Toggle */}
          <div className="flex items-center gap-2 rounded-full bg-gray-800 p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`rounded-full px-4 py-2 text-sm transition-all ${
                viewMode === 'grid' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              Grid
            </button>
            <button
              onClick={() => setViewMode('timeline')}
              className={`rounded-full px-4 py-2 text-sm transition-all ${
                viewMode === 'timeline'
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Timeline
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8">
        {viewMode === 'grid' ? (
          /* Grid View */
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {heroIntros.map((intro, index) => (
              <motion.button
                key={intro.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => setSelectedIntro(intro)}
                className="group relative aspect-[4/3] overflow-hidden rounded-xl bg-gray-800 shadow-lg transition-all hover:scale-[1.02] hover:shadow-2xl"
              >
                {/* Preview thumbnail */}
                <div className="absolute inset-0">
                  <intro.component isFullscreen={false} isPlaying={false} />
                </div>

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-80 transition-opacity group-hover:opacity-100" />

                {/* Info */}
                <div className="absolute right-0 bottom-0 left-0 p-4 text-left">
                  <div className="mb-1 text-xs font-medium text-indigo-400">
                    {intro.era} • {intro.year}
                  </div>
                  <h3 className="text-lg font-bold text-white">{intro.name}</h3>
                  <p className="mt-1 line-clamp-2 text-xs text-gray-300">{intro.description}</p>
                </div>

                {/* Play indicator */}
                <div className="absolute top-3 right-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white opacity-0 backdrop-blur-sm transition-all group-hover:opacity-100">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                  </svg>
                </div>
              </motion.button>
            ))}
          </div>
        ) : (
          /* Timeline View */
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute top-0 bottom-0 left-8 w-0.5 bg-gradient-to-b from-indigo-500 via-purple-500 to-pink-500 md:left-1/2" />

            {heroIntros.map((intro, index) => (
              <motion.div
                key={intro.id}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`relative mb-12 flex items-center ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
              >
                {/* Timeline dot */}
                <div className="absolute left-8 z-10 h-4 w-4 -translate-x-1/2 rounded-full border-4 border-indigo-500 bg-gray-900 md:left-1/2" />

                {/* Content card */}
                <button
                  onClick={() => setSelectedIntro(intro)}
                  className={`group ml-16 w-full md:ml-0 md:w-5/12 ${
                    index % 2 === 0 ? 'md:mr-auto md:pr-12' : 'md:ml-auto md:pl-12'
                  }`}
                >
                  <div className="overflow-hidden rounded-xl bg-gray-800 shadow-lg transition-all hover:scale-[1.02] hover:shadow-2xl">
                    {/* Preview */}
                    <div className="relative aspect-video">
                      <intro.component isFullscreen={false} isPlaying={false} />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition-opacity group-hover:opacity-100">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm">
                          <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                          </svg>
                        </div>
                      </div>
                    </div>

                    {/* Info */}
                    <div className="p-4 text-left">
                      <div className="mb-1 text-sm font-bold text-indigo-400">{intro.year}</div>
                      <h3 className="text-xl font-bold text-white">{intro.name}</h3>
                      <p className="mb-2 text-sm text-gray-400">{intro.era}</p>
                      <p className="text-sm text-gray-300">{intro.description}</p>
                      <p className="mt-2 text-xs text-gray-500 italic">
                        Inspired by: {intro.inspiration}
                      </p>
                    </div>
                  </div>
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      {/* Fullscreen Modal */}
      <AnimatePresence>
        {selectedIntro && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black"
            onClick={() => setSelectedIntro(null)}
          >
            {/* Close button */}
            <button
              onClick={() => setSelectedIntro(null)}
              className="absolute top-4 right-4 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Info panel */}
            <div className="absolute top-4 left-4 z-50 max-w-sm rounded-xl bg-black/60 p-4 backdrop-blur-sm">
              <div className="text-sm text-indigo-400">
                {selectedIntro.era} • {selectedIntro.year}
              </div>
              <h2 className="text-xl font-bold text-white">{selectedIntro.name}</h2>
              <p className="mt-1 text-sm text-gray-300">{selectedIntro.description}</p>
            </div>

            {/* Navigation arrows */}
            <button
              onClick={(e) => {
                e.stopPropagation()
                navigate('prev')
              }}
              className="absolute top-1/2 left-4 z-50 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                navigate('next')
              }}
              className="absolute top-1/2 right-4 z-50 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>

            {/* Navigation dots */}
            <div className="absolute bottom-6 left-1/2 z-50 flex -translate-x-1/2 gap-2">
              {heroIntros.map((intro) => (
                <button
                  key={intro.id}
                  onClick={(e) => {
                    e.stopPropagation()
                    setSelectedIntro(intro)
                  }}
                  className={`h-2 w-2 rounded-full transition-all ${
                    intro.id === selectedIntro.id ? 'w-6 bg-white' : 'bg-white/40 hover:bg-white/60'
                  }`}
                />
              ))}
            </div>

            {/* Full screen animation */}
            <motion.div
              key={selectedIntro.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="h-full w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <selectedIntro.component isFullscreen={true} isPlaying={true} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer hint */}
      <footer className="border-t border-gray-700/50 py-6 text-center text-sm text-gray-500">
        <p>Click any animation to view fullscreen • Use arrow keys to navigate</p>
        <p className="mt-2">
          Built with{' '}
          <a
            href="https://motion.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-400 hover:text-indigo-300"
          >
            Motion
          </a>{' '}
          (Framer Motion)
        </p>
      </footer>
    </div>
  )
}
