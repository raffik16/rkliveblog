'use client'

interface PauseMenuProps {
  onResume: () => void
  onRestart: () => void
  onMenu: () => void
}

export default function PauseMenu({ onResume, onRestart, onMenu }: PauseMenuProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="mx-4 w-full max-w-sm rounded-2xl border border-gray-600 bg-gray-800/90 p-8 text-center">
        <h2 className="mb-2 text-3xl font-bold text-white">Paused</h2>
        <p className="mb-8 text-gray-400">Take a breather!</p>

        <div className="space-y-3">
          <button
            onClick={onResume}
            className="w-full rounded-xl bg-gradient-to-r from-cyan-600 to-purple-600 px-6 py-3 text-lg font-bold text-white transition-all duration-200 hover:from-cyan-500 hover:to-purple-500"
          >
            Resume
          </button>
          <button
            onClick={onRestart}
            className="w-full rounded-xl bg-gray-700 px-6 py-3 font-medium text-white transition-all duration-200 hover:bg-gray-600"
          >
            Restart Level
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
  )
}
