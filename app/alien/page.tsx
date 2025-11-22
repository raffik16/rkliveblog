'use client'

import { useState } from 'react'
import WarpSpeed from './components/warp-speed/WarpSpeed'
import VelocityMetrics from './components/velocity/VelocityMetrics'
import AntiGravity from './components/anti-gravity/AntiGravity'
import Observability from './components/observability/Observability'

export default function AlienAppPage() {
  const [activeTab, setActiveTab] = useState<string>('warp')
  const [isFullscreen, setIsFullscreen] = useState(false)

  const tabs = [
    { id: 'warp', name: 'Warp Speed', icon: '⚡' },
    { id: 'velocity', name: 'Speed & Velocity', icon: '🚀' },
    { id: 'anti-gravity', name: 'Anti-Gravity', icon: '🌀' },
    { id: 'observability', name: 'Observability', icon: '📡' },
  ]

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
      setIsFullscreen(true)
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
        setIsFullscreen(false)
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      {/* Header */}
      <div className="border-b border-gray-800 bg-black/50 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-4xl font-bold text-transparent">
                🛸 Alien Spacecraft Command Center
              </h1>
              <p className="mt-2 text-gray-400">
                Advanced UAP Technology Simulation & Analysis Platform
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 rounded-lg border border-green-900 bg-green-950/30 px-4 py-2">
                <div className="h-3 w-3 animate-pulse rounded-full bg-green-500" />
                <span className="text-sm font-semibold text-green-400">SYSTEMS ONLINE</span>
              </div>
              <button
                onClick={toggleFullscreen}
                className="rounded-lg border border-cyan-900 bg-cyan-950/30 px-4 py-2 text-sm font-semibold text-cyan-400 transition hover:bg-cyan-900/50"
                title="Toggle Fullscreen"
              >
                {isFullscreen ? '⛶ Exit Fullscreen' : '⛶ Fullscreen'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-800 bg-black/30 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex gap-2 overflow-x-auto py-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`rounded-lg px-4 py-2 text-sm font-semibold whitespace-nowrap transition ${
                  activeTab === tab.id
                    ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-500/30'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-200'
                }`}
              >
                {tab.icon} {tab.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-8">
        {activeTab === 'warp' && <WarpSpeed />}
        {activeTab === 'velocity' && <VelocityMetrics />}
        {activeTab === 'anti-gravity' && <AntiGravity />}
        {activeTab === 'observability' && <Observability />}
      </div>

      {/* Footer */}
      <div className="border-t border-gray-800 bg-black/50 py-6">
        <div className="mx-auto max-w-7xl px-4 text-center text-sm text-gray-500">
          <p>🛸 Alien Spacecraft Command Center - Advanced UAP Technology Research Platform</p>
        </div>
      </div>
    </div>
  )
}
