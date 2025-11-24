'use client'

import { useEffect } from 'react'

export default function CryDecoderPage() {
  useEffect(() => {
    // Redirect to the standalone app
    window.location.href = '/baby-apps-static/CryDecoder/index.html'
  }, [])

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="mb-4 text-6xl">🍼</div>
        <h1 className="mb-2 text-2xl font-bold">Loading CryDecoder...</h1>
        <p className="text-gray-600 dark:text-gray-400">Redirecting to the app</p>
      </div>
    </div>
  )
}
