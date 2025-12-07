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
      <div className="sticky top-0 z-50 border-b border-gray-700 bg-gray-900/80 backdrop-blur">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold md:text-3xl">
                <span className="bg-gradient-to-r from-orange-400 via-red-500 to-purple-500 bg-clip-text text-transparent">
                  Skateboard Motion Lab
                </span>
              </h1>
              <p className="mt-1 text-sm text-gray-400">
                Advanced motion physics and animation showcase
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 rounded-full border border-green-500/30 bg-green-500/10 px-3 py-1.5">
                <span className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
                <span className="text-sm font-medium text-green-400">SYSTEMS ACTIVE</span>
              </div>

              <button
                onClick={toggleFullscreen}
                className="rounded-lg bg-gray-700 p-2 transition-colors hover:bg-gray-600"
                title="Toggle fullscreen"
              >
                <svg
                  className="h-5 w-5 text-gray-300"
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

      <div className="border-b border-gray-700 bg-gray-900/50">
        <div className="container mx-auto px-4">
          <div className="scrollbar-hide flex overflow-x-auto">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative whitespace-nowrap px-6 py-4 text-sm font-medium transition-colors ${
                  activeTab === tab.id ? 'text-orange-400' : 'text-gray-400 hover:text-gray-300'
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

      <div className="container mx-auto px-4 py-4">
        <motion.p
          key={activeTab}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-gray-500"
        >
          {currentTab?.description}
        </motion.p>
      </div>

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

      <div className="border-t border-gray-700 bg-gray-900/50">
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 gap-6 text-sm md:grid-cols-3">
            <div>
              <h3 className="mb-2 font-semibold text-white">Technologies Used</h3>
              <div className="flex flex-wrap gap-2">
                {['React 19', 'Framer Motion', 'GSAP', 'Canvas API', 'TypeScript'].map((tech) => (
                  <span key={tech} className="rounded bg-gray-800 px-2 py-1 text-xs text-gray-400">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h3 className="mb-2 font-semibold text-white">Features</h3>
              <ul className="space-y-1 text-gray-400">
                <li>Real-time physics simulation</li>
                <li>Keyframe-based trick animations</li>
                <li>GPU-accelerated particle effects</li>
                <li>Live metrics visualization</li>
              </ul>
            </div>

            <div>
              <h3 className="mb-2 font-semibold text-white">Controls</h3>
              <ul className="space-y-1 text-gray-400">
                <li>
                  <kbd className="rounded bg-gray-700 px-1 text-xs">A/D</kbd> or{' '}
                  <kbd className="rounded bg-gray-700 px-1 text-xs">←/→</kbd> - Move
                </li>
                <li>
                  <kbd className="rounded bg-gray-700 px-1 text-xs">Space</kbd> - Jump
                </li>
                <li>
                  <kbd className="rounded bg-gray-700 px-1 text-xs">1-4</kbd> - Perform tricks in
                  air
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
