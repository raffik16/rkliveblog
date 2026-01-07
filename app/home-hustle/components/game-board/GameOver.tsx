'use client'

import type { Level } from '../../types'
import { calculateStars } from '../../data/levels'

interface GameOverProps {
  level: Level
  score: number
  completedOrders: number
  failedOrders: number
  onRestart: () => void
  onMenu: () => void
  onNextLevel?: () => void
}

export default function GameOver({
  level,
  score,
  completedOrders,
  failedOrders,
  onRestart,
  onMenu,
  onNextLevel,
}: GameOverProps) {
  const stars = calculateStars(score, level)
  const passed = score >= level.targetScore

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 p-4">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-gray-700 bg-gray-800/80 p-8 text-center backdrop-blur-sm">
          {/* Result Header */}
          <div className="mb-6">
            {passed ? (
              <>
                <h1 className="mb-2 bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-4xl font-bold text-transparent">
                  Level Complete!
                </h1>
                <p className="text-gray-400">{level.name}</p>
              </>
            ) : (
              <>
                <h1 className="mb-2 bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-4xl font-bold text-transparent">
                  Time's Up!
                </h1>
                <p className="text-gray-400">Better luck next time!</p>
              </>
            )}
          </div>

          {/* Stars */}
          <div className="mb-6 flex justify-center gap-2">
            {[1, 2, 3].map((star) => (
              <span
                key={star}
                className={`text-5xl transition-all duration-500 ${
                  star <= stars ? 'animate-bounce text-yellow-400' : 'text-gray-600'
                }`}
                style={{ animationDelay: `${star * 0.2}s` }}
              >
                ★
              </span>
            ))}
          </div>

          {/* Score */}
          <div className="mb-6">
            <p className="mb-1 text-sm text-gray-400">Final Score</p>
            <p className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-5xl font-bold text-transparent">
              {score.toLocaleString()}
            </p>
            <div className="mt-2 text-sm text-gray-500">
              Target: {level.targetScore} | 3★: {level.threeStarScore}
            </div>
          </div>

          {/* Stats */}
          <div className="mb-8 grid grid-cols-2 gap-4">
            <div className="rounded-lg bg-gray-700/50 p-3">
              <p className="text-2xl font-bold text-green-400">{completedOrders}</p>
              <p className="text-xs text-gray-400">Orders Completed</p>
            </div>
            <div className="rounded-lg bg-gray-700/50 p-3">
              <p className="text-2xl font-bold text-red-400">{failedOrders}</p>
              <p className="text-xs text-gray-400">Orders Failed</p>
            </div>
          </div>

          {/* Buttons */}
          <div className="space-y-3">
            {passed && onNextLevel && (
              <button
                onClick={onNextLevel}
                className="w-full rounded-xl bg-gradient-to-r from-green-600 to-cyan-600 px-6 py-3 text-lg font-bold text-white shadow-lg shadow-green-500/20 transition-all duration-200 hover:from-green-500 hover:to-cyan-500"
              >
                Next Level →
              </button>
            )}
            <button
              onClick={onRestart}
              className="w-full rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-3 text-lg font-bold text-white shadow-lg shadow-purple-500/20 transition-all duration-200 hover:from-purple-500 hover:to-pink-500"
            >
              Try Again
            </button>
            <button
              onClick={onMenu}
              className="w-full rounded-xl bg-gray-700 px-6 py-3 font-medium text-white transition-all duration-200 hover:bg-gray-600"
            >
              Back to Menu
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
