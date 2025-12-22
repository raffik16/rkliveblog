'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import type { TabType, DashboardMetrics } from './types'
import PredictionMarkets from './components/PredictionMarkets'
import SlangEvolution from './components/SlangEvolution'
import WorldCup2026 from './components/WorldCup2026'
import WildcardLab from './components/WildcardLab'

const tabs: { id: TabType; label: string; icon: string; color: string }[] = [
  {
    id: 'predictions',
    label: 'Prediction Markets',
    icon: '🎰',
    color: 'from-purple-500 to-pink-500',
  },
  {
    id: 'slang',
    label: 'Slang Evolution',
    icon: '🗣️',
    color: 'from-cyan-500 to-blue-500',
  },
  {
    id: 'worldcup',
    label: 'World Cup 2026',
    icon: '⚽',
    color: 'from-green-500 to-emerald-500',
  },
  {
    id: 'wildcard',
    label: 'Wildcard Lab',
    icon: '🃏',
    color: 'from-orange-500 to-yellow-500',
  },
]

export default function HexChallengePage() {
  const [activeTab, setActiveTab] = useState<TabType>('predictions')
  const [isFullscreen, setIsFullscreen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalDataPoints: 0,
    insightsGenerated: 0,
    activeMarkets: 0,
    trendsTracked: 0,
  })

  // Animate metrics on mount
  useEffect(() => {
    const targetMetrics: DashboardMetrics = {
      totalDataPoints: 52400000,
      insightsGenerated: 1247,
      activeMarkets: 156,
      trendsTracked: 89,
    }

    const duration = 2000
    const steps = 60
    const interval = duration / steps

    let step = 0
    const timer = setInterval(() => {
      step++
      const progress = step / steps
      const eased = 1 - Math.pow(1 - progress, 3) // Ease out cubic

      setMetrics({
        totalDataPoints: Math.floor(targetMetrics.totalDataPoints * eased),
        insightsGenerated: Math.floor(targetMetrics.insightsGenerated * eased),
        activeMarkets: Math.floor(targetMetrics.activeMarkets * eased),
        trendsTracked: Math.floor(targetMetrics.trendsTracked * eased),
      })

      if (step >= steps) clearInterval(timer)
    }, interval)

    return () => clearInterval(timer)
  }, [])

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

  const renderContent = () => {
    switch (activeTab) {
      case 'predictions':
        return <PredictionMarkets />
      case 'slang':
        return <SlangEvolution />
      case 'worldcup':
        return <WorldCup2026 />
      case 'wildcard':
        return <WildcardLab />
      default:
        return null
    }
  }

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
    return num.toString()
  }

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950"
    >
      {/* Animated Background Grid */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-[size:64px_64px]" />
        <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-purple-500/10 blur-3xl" />
        <div className="absolute top-3/4 right-1/4 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-slate-800/50 bg-slate-900/50 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.div
                className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-500"
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              >
                <span className="text-2xl font-black text-white">H</span>
              </motion.div>
              <div>
                <h1 className="text-xl font-bold text-white">Hex Data Insights Challenge</h1>
                <p className="text-sm text-slate-400">Interactive Demo Dashboard</p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              {/* Live Metrics */}
              <div className="hidden items-center gap-6 lg:flex">
                <div className="text-right">
                  <div className="font-mono text-lg font-bold text-purple-400">
                    {formatNumber(metrics.totalDataPoints)}
                  </div>
                  <div className="text-xs text-slate-500">Data Points</div>
                </div>
                <div className="h-8 w-px bg-slate-700" />
                <div className="text-right">
                  <div className="font-mono text-lg font-bold text-cyan-400">
                    {metrics.insightsGenerated}
                  </div>
                  <div className="text-xs text-slate-500">Insights</div>
                </div>
                <div className="h-8 w-px bg-slate-700" />
                <div className="text-right">
                  <div className="font-mono text-lg font-bold text-green-400">
                    {metrics.activeMarkets}
                  </div>
                  <div className="text-xs text-slate-500">Markets</div>
                </div>
              </div>

              {/* Status Indicator */}
              <div className="flex items-center gap-2 rounded-full bg-emerald-500/10 px-4 py-2">
                <motion.div
                  className="h-2 w-2 rounded-full bg-emerald-500"
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
                <span className="text-sm font-medium text-emerald-400">LIVE DATA</span>
              </div>

              {/* Fullscreen Toggle */}
              <button
                onClick={toggleFullscreen}
                className="rounded-lg bg-slate-800 p-2 text-slate-400 transition-colors hover:bg-slate-700 hover:text-white"
              >
                {isFullscreen ? (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                ) : (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mx-auto max-w-7xl px-4">
          <nav className="-mb-px flex gap-1 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`group relative flex items-center gap-2 px-6 py-4 text-sm font-medium whitespace-nowrap transition-all ${
                  activeTab === tab.id ? 'text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <span className="text-lg">{tab.icon}</span>
                <span>{tab.label}</span>
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTab"
                    className={`absolute inset-x-0 -bottom-px h-0.5 bg-gradient-to-r ${tab.color}`}
                    initial={false}
                    transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                  />
                )}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 mx-auto max-w-7xl px-4 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-800/50 bg-slate-900/50 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 py-6">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-sm text-slate-500">
              Built with Hex — The unified platform for data impact
            </p>
            <div className="flex items-center gap-4">
              <Link
                href="/blog/hex-data-insights-challenge"
                className="text-sm text-purple-400 hover:text-purple-300"
              >
                Read the Blog Post →
              </Link>
              <a
                href="https://hex.tech"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
              >
                Try Hex Free
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
