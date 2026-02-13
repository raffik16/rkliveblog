'use client'

interface TimerProps {
  timeRemaining: number
  totalTime: number
}

export default function Timer({ timeRemaining, totalTime }: TimerProps) {
  const minutes = Math.floor(timeRemaining / 60)
  const seconds = timeRemaining % 60
  const percent = (timeRemaining / totalTime) * 100
  const isLow = percent < 25

  return (
    <div className="rounded-xl border border-gray-700 bg-gray-900/90 p-4">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-medium text-gray-400">Time</span>
        <span
          className={`font-mono text-2xl font-bold ${
            isLow ? 'animate-pulse text-red-400' : 'text-white'
          }`}
        >
          {minutes}:{seconds.toString().padStart(2, '0')}
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-gray-700">
        <div
          className={`h-full transition-all duration-1000 ${
            isLow
              ? 'bg-red-500'
              : percent < 50
                ? 'bg-yellow-500'
                : 'bg-gradient-to-r from-cyan-400 to-green-400'
          }`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  )
}
