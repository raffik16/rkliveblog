'use client'

import { useEffect } from 'react'

export default function DiaperDJPage() {
  useEffect(() => {
    // Redirect to the standalone app
    window.location.href = '/baby-apps-static/DiaperDJ/index.html'
  }, [])

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="mb-4 text-6xl">🎵</div>
        <h1 className="mb-2 text-2xl font-bold">Loading Diaper DJ...</h1>
        <p className="text-gray-600 dark:text-gray-400">Redirecting to the app</p>
      </div>
    </div>
  )
}
