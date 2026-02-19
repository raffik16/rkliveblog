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
        <div className="container mx-auto px-3 py-3 md:px-4 md:py-4">
          <div className="flex items-center justify-between gap-2 md:gap-4">
            <div className="min-w-0 flex-1">
              <h1 className="truncate text-lg font-bold sm:text-2xl md:text-3xl">
                <span className="bg-gradient-to-r from-orange-400 via-red-500 to-purple-500 bg-clip-text text-transparent">
                  Skateboard Motion Lab
                </span>
              </h1>
              <p className="mt-0.5 hidden text-sm text-gray-400 sm:block md:mt-1">
                Advanced motion physics and animation showcase
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-2 md:gap-4">
              <div className="hidden items-center gap-2 rounded-full border border-green-500/30 bg-green-500/10 px-2 py-1 sm:flex md:px-3 md:py-1.5">
                <span className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
                <span className="text-xs font-medium text-green-400 md:text-sm">ACTIVE</span>
              </div>

              <button
                onClick={toggleFullscreen}
                className="rounded-lg bg-gray-700 p-1.5 transition-colors hover:bg-gray-600 md:p-2"
                title="Toggle fullscreen"
              >
                <svg
                  className="h-4 w-4 text-gray-300 md:h-5 md:w-5"
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
        <div className="container mx-auto px-2 md:px-4">
          <div className="scrollbar-hide flex overflow-x-auto">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative px-3 py-3 text-xs font-medium whitespace-nowrap transition-colors sm:px-4 sm:text-sm md:px-6 md:py-4 ${
                  activeTab === tab.id ? 'text-orange-400' : 'text-gray-400 hover:text-gray-300'
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute right-0 bottom-0 left-0 h-0.5 bg-gradient-to-r from-orange-500 to-red-500"
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-3 py-2 md:px-4 md:py-4">
        <motion.p
          key={activeTab}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs text-gray-500 md:text-sm"
        >
          {currentTab?.description}
        </motion.p>
      </div>

      <div className="container mx-auto px-3 pb-6 md:px-4 md:pb-8">
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
        <div className="container mx-auto px-3 py-4 md:px-4 md:py-6">
          <div className="grid grid-cols-2 gap-4 text-xs md:grid-cols-3 md:gap-6 md:text-sm">
            <div className="col-span-2 md:col-span-1">
              <h3 className="mb-2 text-sm font-semibold text-white md:text-base">Technologies</h3>
              <div className="flex flex-wrap gap-1.5 md:gap-2">
                {['React 19', 'Framer Motion', 'GSAP', 'Canvas API', 'TypeScript'].map((tech) => (
                  <span
                    key={tech}
                    className="rounded bg-gray-800 px-1.5 py-0.5 text-xs text-gray-400"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h3 className="mb-2 text-sm font-semibold text-white md:text-base">Features</h3>
              <ul className="space-y-0.5 text-gray-400 md:space-y-1">
                <li>Physics simulation</li>
                <li>Trick animations</li>
                <li>Particle effects</li>
                <li>Live metrics</li>
              </ul>
            </div>

            <div>
              <h3 className="mb-2 text-sm font-semibold text-white md:text-base">Controls</h3>
              <ul className="space-y-0.5 text-gray-400 md:space-y-1">
                <li>
                  <kbd className="rounded bg-gray-700 px-1 text-xs">A/D</kbd> - Move
                </li>
                <li>
                  <kbd className="rounded bg-gray-700 px-1 text-xs">Space</kbd> - Jump
                </li>
                <li>
                  <kbd className="rounded bg-gray-700 px-1 text-xs">1-4</kbd> - Tricks
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
