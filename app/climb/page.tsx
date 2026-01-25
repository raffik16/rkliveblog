'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import ClimbingGame from './components/ClimbingGame'

export default function ClimbPage() {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

  if (!isMounted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 via-slate-900 to-black">
        <div className="text-xl text-white">Loading...</div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-gray-900 via-slate-900 to-black">
      {/* Animated background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="bg-primary-500/10 absolute top-20 left-10 h-64 w-64 animate-pulse rounded-full blur-3xl" />
        <div
          className="absolute right-10 bottom-20 h-96 w-96 animate-pulse rounded-full bg-cyan-500/10 blur-3xl"
          style={{ animationDelay: '1s' }}
        />
        <div
          className="absolute top-1/2 left-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 animate-pulse rounded-full bg-purple-500/10 blur-3xl"
          style={{ animationDelay: '2s' }}
        />
      </div>

      {/* Mountain silhouette background */}
      <svg
        className="pointer-events-none absolute right-0 bottom-0 left-0 opacity-20"
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
      >
        <path
          fill="#374151"
          d="M0,224L60,213.3C120,203,240,181,360,181.3C480,181,600,203,720,224C840,245,960,267,1080,261.3C1200,256,1320,224,1380,208L1440,192L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
        />
        <path
          fill="#1f2937"
          d="M0,288L48,272C96,256,192,224,288,224C384,224,480,256,576,261.3C672,267,768,245,864,234.7C960,224,1056,224,1152,234.7C1248,245,1344,267,1392,277.3L1440,288L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
        />
      </svg>

      <div className="relative z-10 container mx-auto flex min-h-screen flex-col items-center px-4 py-8">
        {/* Header */}
        <header className="mb-8 flex w-full max-w-4xl items-center justify-between">
          <Link
            href="/blog/free-solo-climbing-game"
            className="flex items-center gap-2 text-white/60 transition-colors hover:text-white"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Blog
          </Link>

          <button
            onClick={toggleFullscreen}
            className="flex items-center gap-2 rounded-lg px-4 py-2 text-white/60 transition-colors hover:bg-white/10 hover:text-white"
          >
            {isFullscreen ? (
              <>
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5l5.25 5.25"
                  />
                </svg>
                Exit Fullscreen
              </>
            ) : (
              <>
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15"
                  />
                </svg>
                Fullscreen
              </>
            )}
          </button>
        </header>

        {/* Game Container */}
        <main className="flex flex-1 flex-col items-center justify-center">
          <div className="mb-6 text-center">
            <h1 className="mb-2 text-4xl font-bold text-white md:text-5xl">
              Free Solo <span className="text-primary-500">Climber</span>
            </h1>
            <p className="text-lg text-white/60">How high can you climb?</p>
          </div>

          <ClimbingGame />

          {/* Instructions */}
          <div className="mt-8 max-w-md text-center">
            <div className="glass-frost rounded-xl p-6">
              <h3 className="mb-4 font-bold text-white">How to Play</h3>
              <div className="grid grid-cols-1 gap-4 text-sm text-white/70 md:grid-cols-2">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10">
                    <span className="text-lg">👆</span>
                  </div>
                  <span>Tap or click to jump</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10">
                    <span className="text-lg">⌨️</span>
                  </div>
                  <span>Press SPACE to jump</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-500/20">
                    <span className="text-lg">⭐</span>
                  </div>
                  <span>Golden holds = bonus</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-500/20">
                    <span className="text-lg">💨</span>
                  </div>
                  <span>Watch for wind gusts!</span>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="mt-8 text-center text-sm text-white/40">
          <p>Built with Next.js, Canvas API, and GSAP</p>
        </footer>
      </div>
    </div>
  )
}
