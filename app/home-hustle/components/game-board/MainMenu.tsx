'use client'

import type { Level } from '../../types'
import { LEVELS, calculateStars } from '../../data/levels'

interface MainMenuProps {
  onStartGame: (levelId: number) => void
  highScores?: Record<number, number>
}

export default function MainMenu({ onStartGame, highScores = {} }: MainMenuProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900/30 to-gray-900 p-4">
      <div className="w-full max-w-4xl">
        {/* Title */}
        <div className="mb-12 text-center">
          <h1 className="mb-4 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-6xl font-bold text-transparent">
            Home Hustle
          </h1>
          <p className="text-xl text-gray-400">The Ultimate Home Organization Challenge!</p>
          <div className="mt-4 flex justify-center gap-4 text-4xl">
            <span>🧺</span>
            <span>👕</span>
            <span>🧹</span>
            <span>📦</span>
            <span>🏠</span>
          </div>
        </div>

        {/* Level Selection */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {LEVELS.map((level) => (
            <LevelCard
              key={level.id}
              level={level}
              highScore={highScores[level.id]}
              onSelect={() => onStartGame(level.id)}
            />
          ))}
        </div>

        {/* Game Info */}
        <div className="mt-12 text-center">
          <div className="mx-auto max-w-2xl rounded-xl border border-gray-700 bg-gray-800/50 p-6">
            <h2 className="mb-4 text-xl font-bold text-white">How to Play</h2>
            <div className="grid grid-cols-1 gap-4 text-left sm:grid-cols-2">
              <div className="flex items-start gap-3">
                <span className="text-2xl">🧺</span>
                <div>
                  <p className="font-medium text-white">Pick Up Items</p>
                  <p className="text-sm text-gray-400">Click stations to grab items</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">🌀</span>
                <div>
                  <p className="font-medium text-white">Process Items</p>
                  <p className="text-sm text-gray-400">Wash, dry, fold, and store</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">📋</span>
                <div>
                  <p className="font-medium text-white">Complete Orders</p>
                  <p className="text-sm text-gray-400">Fulfill requests before time runs out</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">⭐</span>
                <div>
                  <p className="font-medium text-white">Earn Stars</p>
                  <p className="text-sm text-gray-400">Score high to unlock new levels</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

interface LevelCardProps {
  level: Level
  highScore?: number
  onSelect: () => void
}

function LevelCard({ level, highScore = 0, onSelect }: LevelCardProps) {
  const stars = calculateStars(highScore, level)
  const isLocked = !level.unlocked && level.id > 1

  return (
    <button
      onClick={onSelect}
      disabled={isLocked}
      className={`relative rounded-xl border p-4 text-left transition-all duration-200 ${
        isLocked
          ? 'cursor-not-allowed border-gray-700 bg-gray-800/30 opacity-50'
          : 'cursor-pointer border-gray-600 bg-gray-800/60 hover:border-purple-500 hover:bg-gray-700/60'
      } `}
    >
      {/* Lock Icon */}
      {isLocked && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-4xl">🔒</span>
        </div>
      )}

      {/* Level Number */}
      <div className="mb-2 flex items-center justify-between">
        <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-3xl font-bold text-transparent">
          {level.id}
        </span>
        {/* Stars */}
        <div className="flex gap-0.5">
          {[1, 2, 3].map((star) => (
            <span
              key={star}
              className={`text-lg ${star <= stars ? 'text-yellow-400' : 'text-gray-600'}`}
            >
              ★
            </span>
          ))}
        </div>
      </div>

      {/* Level Name */}
      <h3 className="mb-1 text-lg font-bold text-white">{level.name}</h3>
      <p className="mb-3 text-sm text-gray-400">{level.description}</p>

      {/* Level Stats */}
      <div className="flex items-center gap-4 text-xs text-gray-500">
        <span>
          ⏱️ {Math.floor(level.timeLimit / 60)}:{(level.timeLimit % 60).toString().padStart(2, '0')}
        </span>
        <span>🎯 {level.targetScore} pts</span>
      </div>

      {/* High Score */}
      {highScore > 0 && (
        <div className="mt-2 text-sm text-yellow-400">Best: {highScore.toLocaleString()}</div>
      )}
    </button>
  )
}
