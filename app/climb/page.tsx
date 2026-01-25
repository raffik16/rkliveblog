'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import ClimbingGame from './components/ClimbingGame'

export default function ClimbPage() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
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
      <div className="relative z-10 container mx-auto flex min-h-screen flex-col items-center px-4 py-8">
        {/* Header */}
        <header className="mb-6 flex w-full max-w-md items-center justify-between">
          <Link
            href="/blog/gapper"
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
            Back
          </Link>
        </header>

        {/* Game */}
        <main className="flex flex-1 flex-col items-center justify-center">
          <ClimbingGame />
        </main>

        {/* Footer */}
        <footer className="mt-6 text-center text-sm text-white/40">
          <p>SPACE or TAP to jump</p>
        </footer>
      </div>
    </div>
  )
}
