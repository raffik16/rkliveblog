'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import SkatePhysics from './components/physics-engine/SkatePhysics'
import TrickShowcase from './components/trick-system/TrickShowcase'
import ParticlePlayground from './components/particle-effects/ParticlePlayground'
import MetricsDashboard from './components/metrics/MetricsDashboard'
import { TabType } from './types'

const TABS: { id: TabType; label: string; description: string }[] = [
  {
    id: 'physics',
    label: 'Physics Engine',
    description: 'Interactive skateboard physics simulation with gravity, friction, and momentum',
  },
  {
    id: 'tricks',
    label: 'Trick System',
    description: 'Explore skateboard tricks with keyframe animations and 3D visualization',
  },
  {
    id: 'particles',
    label: 'Particle Effects',
    description: 'Interactive particle system playground with customizable effects',
  },
  {
    id: 'metrics',
    label: 'Metrics Dashboard',
    description: 'Real-time performance metrics visualization and data streaming',
  },
]

export default function SkateboardPage() {
  const [activeTab, setActiveTab] = useState<TabType>('physics')
  const [isFullscreen, setIsFullscreen] = useState(false)

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  const currentTab = TABS.find((t) => t.id === activeTab)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <div className="border-b border-gray-700 bg-gray-900/80 backdrop-blur sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">
                <span className="bg-gradient-to-r from-orange-400 via-red-500 to-purple-500 bg-clip-text text-transparent">
                  Skateboard Motion Lab
                </span>
              </h1>
              <p className="text-gray-400 text-sm mt-1">
                Advanced motion physics and animation showcase
              </p>
            </div>

            <div className="flex items-center gap-4">
              {/* Status indicator */}
              <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/10 border border-green-500/30 rounded-full">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-green-400 text-sm font-medium">SYSTEMS ACTIVE</span>
              </div>

              {/* Fullscreen toggle */}
              <button
                onClick={toggleFullscreen}
                className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                title="Toggle fullscreen"
              >
                <svg
                  className="w-5 h-5 text-gray-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  {isFullscreen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5"
                    />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-700 bg-gray-900/50">
        <div className="container mx-auto px-4">
          <div className="flex overflow-x-auto scrollbar-hide">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'text-orange-400'
                    : 'text-gray-400 hover:text-gray-300'
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-orange-500 to-red-500"
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab description */}
      <div className="container mx-auto px-4 py-4">
        <motion.p
          key={activeTab}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-gray-500 text-sm"
        >
          {currentTab?.description}
        </motion.p>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 pb-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'physics' && <SkatePhysics showDebug={false} />}
            {activeTab === 'tricks' && <TrickShowcase />}
            {activeTab === 'particles' && <ParticlePlayground />}
            {activeTab === 'metrics' && <MetricsDashboard />}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer info */}
      <div className="border-t border-gray-700 bg-gray-900/50">
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            <div>
              <h3 className="font-semibold text-white mb-2">Technologies Used</h3>
              <div className="flex flex-wrap gap-2">
                {['React 19', 'Framer Motion', 'GSAP', 'Canvas API', 'TypeScript'].map((tech) => (
                  <span
                    key={tech}
                    className="px-2 py-1 bg-gray-800 rounded text-gray-400 text-xs"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-white mb-2">Features</h3>
              <ul className="text-gray-400 space-y-1">
                <li>Real-time physics simulation</li>
                <li>Keyframe-based trick animations</li>
                <li>GPU-accelerated particle effects</li>
                <li>Live metrics visualization</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-white mb-2">Controls</h3>
              <ul className="text-gray-400 space-y-1">
                <li><kbd className="px-1 bg-gray-700 rounded text-xs">A/D</kbd> or <kbd className="px-1 bg-gray-700 rounded text-xs">←/→</kbd> - Move</li>
                <li><kbd className="px-1 bg-gray-700 rounded text-xs">Space</kbd> - Jump</li>
                <li><kbd className="px-1 bg-gray-700 rounded text-xs">1-4</kbd> - Perform tricks in air</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
