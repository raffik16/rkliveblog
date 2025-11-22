'use client'

import { useState } from 'react'
import WarpSpeed from './components/warp-speed/WarpSpeed'
import TransMedium from './components/trans-medium/TransMedium'
import VelocityMetrics from './components/velocity/VelocityMetrics'
import AntiGravity from './components/anti-gravity/AntiGravity'
import BiologicalEffects from './components/biological/BiologicalEffects'
import Observability from './components/observability/Observability'

export default function AlienAppPage() {
  const [activeTab, setActiveTab] = useState<string>('overview')

  const tabs = [
    { id: 'overview', name: '🛸 Overview', icon: '🌌' },
    { id: 'warp', name: 'Warp Speed', icon: '⚡' },
    { id: 'trans-medium', name: 'Trans-Medium', icon: '🌊' },
    { id: 'velocity', name: 'Speed & Velocity', icon: '🚀' },
    { id: 'anti-gravity', name: 'Anti-Gravity', icon: '🌀' },
    { id: 'biological', name: 'Biological Effects', icon: '🧬' },
    { id: 'observability', name: 'Observability', icon: '📡' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      {/* Header */}
      <div className="border-b border-gray-800 bg-black/50 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400">
                🛸 Alien Spacecraft Command Center
              </h1>
              <p className="mt-2 text-gray-400">
                Advanced UAP Technology Simulation & Analysis Platform
              </p>
            </div>
            <div className="flex items-center gap-2 rounded-lg border border-green-900 bg-green-950/30 px-4 py-2">
              <div className="h-3 w-3 animate-pulse rounded-full bg-green-500" />
              <span className="text-sm font-semibold text-green-400">SYSTEMS ONLINE</span>
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
                className={`whitespace-nowrap rounded-lg px-4 py-2 text-sm font-semibold transition ${
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
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Hero Section */}
            <div className="relative overflow-hidden rounded-2xl border border-cyan-900 bg-gradient-to-br from-cyan-950/50 to-purple-950/50 p-8">
              <div className="relative z-10">
                <h2 className="mb-4 text-3xl font-bold text-cyan-400">
                  Welcome to the UAP Research Platform
                </h2>
                <p className="mb-6 max-w-3xl text-lg text-gray-300">
                  Explore cutting-edge alien spacecraft capabilities including faster-than-light
                  travel, trans-medium propulsion, anti-gravity systems, and advanced stealth
                  technology. This comprehensive platform simulates documented UAP phenomena based
                  on real-world observations.
                </p>
                <div className="flex flex-wrap gap-4">
                  <button
                    onClick={() => setActiveTab('warp')}
                    className="rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 px-6 py-3 font-semibold text-white shadow-lg transition hover:from-cyan-500 hover:to-blue-500"
                  >
                    ⚡ Engage Warp Drive
                  </button>
                  <button
                    onClick={() => setActiveTab('trans-medium')}
                    className="rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 font-semibold text-white shadow-lg transition hover:from-blue-500 hover:to-purple-500"
                  >
                    🌊 Trans-Medium Travel
                  </button>
                  <button
                    onClick={() => setActiveTab('biological')}
                    className="rounded-lg bg-gradient-to-r from-red-600 to-pink-600 px-6 py-3 font-semibold text-white shadow-lg transition hover:from-red-500 hover:to-pink-500"
                  >
                    🧬 Biological Analysis
                  </button>
                </div>
              </div>
              <div className="absolute right-0 top-0 h-full w-1/3 opacity-10">
                <div className="text-9xl">🛸</div>
              </div>
            </div>

            {/* Feature Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {tabs.slice(1).map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="group relative overflow-hidden rounded-xl border border-gray-700 bg-gradient-to-br from-gray-900 to-black p-6 text-left transition hover:border-cyan-500 hover:shadow-lg hover:shadow-cyan-500/20"
                >
                  <div className="mb-4 text-5xl">{tab.icon}</div>
                  <h3 className="mb-2 text-xl font-bold text-white group-hover:text-cyan-400">
                    {tab.name}
                  </h3>
                  <p className="text-sm text-gray-400">
                    {tab.id === 'warp' &&
                      'Experience faster-than-light travel with warp factor controls up to Warp 9'}
                    {tab.id === 'trans-medium' &&
                      'Seamless transition between air, water, and space with zero performance loss'}
                    {tab.id === 'velocity' &&
                      'Track speed and acceleration metrics up to 5% the speed of light'}
                    {tab.id === 'anti-gravity' &&
                      'Manipulate gravitational fields with real-time wind tracking systems'}
                    {tab.id === 'biological' &&
                      'Analyze documented biological effects from high-energy electromagnetic fields'}
                    {tab.id === 'observability' &&
                      'Monitor detection signatures and engage advanced stealth capabilities'}
                  </p>
                  <div className="mt-4 flex items-center gap-2 text-sm text-cyan-400">
                    <span>Explore Module</span>
                    <span className="transition-transform group-hover:translate-x-1">→</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Key Features */}
            <div className="rounded-xl border border-gray-700 bg-gradient-to-br from-gray-900 to-black p-6">
              <h3 className="mb-4 text-2xl font-bold text-purple-400">Platform Capabilities</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex gap-3 rounded-lg border border-gray-800 bg-black/50 p-4">
                  <div className="text-2xl">⚡</div>
                  <div>
                    <div className="font-semibold text-white">Warp Speed Emulation</div>
                    <div className="text-sm text-gray-400">
                      Variable warp factors with real-time spacetime distortion visualization
                    </div>
                  </div>
                </div>
                <div className="flex gap-3 rounded-lg border border-gray-800 bg-black/50 p-4">
                  <div className="text-2xl">🌊</div>
                  <div>
                    <div className="font-semibold text-white">No Performance Compromise</div>
                    <div className="text-sm text-gray-400">
                      Maintain full speed underwater and across all mediums
                    </div>
                  </div>
                </div>
                <div className="flex gap-3 rounded-lg border border-gray-800 bg-black/50 p-4">
                  <div className="text-2xl">🌀</div>
                  <div>
                    <div className="font-semibold text-white">Advanced Wind Tracking</div>
                    <div className="text-sm text-gray-400">
                      Real-time environmental monitoring with vector visualization
                    </div>
                  </div>
                </div>
                <div className="flex gap-3 rounded-lg border border-gray-800 bg-black/50 p-4">
                  <div className="text-2xl">🧬</div>
                  <div>
                    <div className="font-semibold text-white">Biological Impact Data</div>
                    <div className="text-sm text-gray-400">
                      Documented effects near electrical infrastructure and high-voltage areas
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Warning Notice */}
            <div className="rounded-xl border-2 border-yellow-600 bg-yellow-950/30 p-6">
              <div className="flex gap-4">
                <div className="text-3xl">⚠️</div>
                <div>
                  <h4 className="mb-2 font-bold text-yellow-400">Research & Educational Use Only</h4>
                  <p className="text-sm text-yellow-200">
                    This platform simulates observed UAP (Unidentified Aerial Phenomena)
                    characteristics based on documented reports and scientific analysis. All
                    biological effects data is derived from real incident reports involving
                    proximity to high-energy electromagnetic fields, particularly near electrical
                    infrastructure.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'warp' && <WarpSpeed />}
        {activeTab === 'trans-medium' && <TransMedium />}
        {activeTab === 'velocity' && <VelocityMetrics />}
        {activeTab === 'anti-gravity' && <AntiGravity />}
        {activeTab === 'biological' && <BiologicalEffects />}
        {activeTab === 'observability' && <Observability />}
      </div>

      {/* Footer */}
      <div className="border-t border-gray-800 bg-black/50 py-6">
        <div className="mx-auto max-w-7xl px-4 text-center text-sm text-gray-500">
          <p>🛸 Alien Spacecraft Command Center - Advanced UAP Technology Research Platform</p>
          <p className="mt-1">
            All simulations based on documented observations and scientific analysis
          </p>
        </div>
      </div>
    </div>
  )
}
