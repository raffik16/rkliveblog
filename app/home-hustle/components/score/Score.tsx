'use client'

interface ScoreProps {
  score: number
  targetScore: number
  threeStarScore: number
  comboMultiplier: number
  consecutiveCompletions: number
}

export default function Score({
  score,
  targetScore,
  threeStarScore,
  comboMultiplier,
  consecutiveCompletions,
}: ScoreProps) {
  const stars =
    score >= threeStarScore ? 3 : score >= targetScore ? 2 : score >= targetScore * 0.5 ? 1 : 0

  return (
    <div className="rounded-xl border border-gray-700 bg-gray-900/90 p-4">
      {/* Score Display */}
      <div className="mb-3 flex items-center justify-between">
        <span className="text-sm font-medium text-gray-400">Score</span>
        <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-3xl font-bold text-transparent">
          {score.toLocaleString()}
        </span>
      </div>

      {/* Stars */}
      <div className="mb-3 flex items-center justify-center gap-1">
        {[1, 2, 3].map((star) => (
          <span
            key={star}
            className={`text-2xl transition-all duration-300 ${
              star <= stars ? 'scale-110 text-yellow-400' : 'text-gray-600'
            }`}
          >
            ★
          </span>
        ))}
      </div>

      {/* Progress to next star */}
      <div className="space-y-1">
        <div className="flex justify-between text-xs">
          <span className="text-gray-500">Next: {targetScore}</span>
          <span className="text-gray-500">3★: {threeStarScore}</span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-gray-700">
          <div
            className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 transition-all duration-300"
            style={{ width: `${Math.min(100, (score / threeStarScore) * 100)}%` }}
          />
        </div>
      </div>

      {/* Combo Display */}
      {comboMultiplier > 1 && (
        <div className="mt-3 rounded-lg border border-purple-500/30 bg-purple-900/50 p-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-purple-300">Combo</span>
            <span className="font-bold text-purple-200">x{comboMultiplier.toFixed(2)}</span>
          </div>
          <div className="mt-1 flex items-center gap-1">
            {Array.from({ length: consecutiveCompletions }).map((_, i) => (
              <div key={i} className="h-2 w-2 rounded-full bg-purple-400" />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
