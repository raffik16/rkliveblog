'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { DatasetCard, InsightMetric } from '../types'
import { wildcardDatasets } from '../data/mockData'

const colorClasses: Record<string, { bg: string; border: string; text: string; glow: string }> = {
  emerald: {
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/30',
    text: 'text-emerald-400',
    glow: 'shadow-emerald-500/20',
  },
  pink: {
    bg: 'bg-pink-500/10',
    border: 'border-pink-500/30',
    text: 'text-pink-400',
    glow: 'shadow-pink-500/20',
  },
  orange: {
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/30',
    text: 'text-orange-400',
    glow: 'shadow-orange-500/20',
  },
  green: {
    bg: 'bg-green-500/10',
    border: 'border-green-500/30',
    text: 'text-green-400',
    glow: 'shadow-green-500/20',
  },
  blue: {
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/30',
    text: 'text-blue-400',
    glow: 'shadow-blue-500/20',
  },
  purple: {
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/30',
    text: 'text-purple-400',
    glow: 'shadow-purple-500/20',
  },
}

const generateRandomMetrics = (): InsightMetric[] => [
  {
    label: 'Correlation',
    value: Math.random() * 0.8 + 0.1,
    unit: 'r²',
    change: (Math.random() - 0.5) * 20,
    trend: Math.random() > 0.5 ? 'up' : 'down',
  },
  {
    label: 'Confidence',
    value: Math.random() * 30 + 70,
    unit: '%',
    change: (Math.random() - 0.5) * 10,
    trend: Math.random() > 0.5 ? 'up' : 'down',
  },
  {
    label: 'Sample Size',
    value: Math.floor(Math.random() * 50000 + 10000),
    unit: '',
    change: Math.floor(Math.random() * 1000),
    trend: 'up',
  },
  {
    label: 'Significance',
    value: Math.random() * 0.04 + 0.001,
    unit: 'p-value',
    change: (Math.random() - 0.5) * 0.01,
    trend: 'stable',
  },
]

export default function WildcardLab() {
  const [selectedDataset, setSelectedDataset] = useState<DatasetCard | null>(null)
  const [metrics, setMetrics] = useState<InsightMetric[]>(generateRandomMetrics())
  const [query, setQuery] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [aiResponse, setAiResponse] = useState<string | null>(null)
  const [particles, setParticles] = useState<{ x: number; y: number; vx: number; vy: number }[]>([])
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Particle animation
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Initialize particles
    const newParticles: typeof particles = []
    for (let i = 0; i < 50; i++) {
      newParticles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
      })
    }
    setParticles(newParticles)

    let animationId: number

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Update and draw particles
      newParticles.forEach((p, i) => {
        // Update position
        p.x += p.vx
        p.y += p.vy

        // Bounce off walls
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1

        // Draw particle
        ctx.beginPath()
        ctx.arc(p.x, p.y, 2, 0, Math.PI * 2)
        ctx.fillStyle = `hsla(${(i * 7) % 360}, 70%, 60%, 0.6)`
        ctx.fill()

        // Draw connections
        newParticles.forEach((p2, j) => {
          if (i === j) return
          const dx = p.x - p2.x
          const dy = p.y - p2.y
          const dist = Math.sqrt(dx * dx + dy * dy)

          if (dist < 100) {
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.strokeStyle = `rgba(168, 85, 247, ${0.2 * (1 - dist / 100)})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        })
      })

      animationId = requestAnimationFrame(draw)
    }

    draw()
    return () => cancelAnimationFrame(animationId)
  }, [])

  // Simulate AI analysis
  const runAnalysis = () => {
    if (!query || !selectedDataset) return

    setIsAnalyzing(true)
    setAiResponse(null)

    setTimeout(() => {
      setMetrics(generateRandomMetrics())
      const responses = [
        `Based on the ${selectedDataset.title} dataset, I found a strong correlation between the variables you mentioned. The ${selectedDataset.sampleInsight} pattern appears consistent across 78% of the sample.`,
        `Analyzing ${(selectedDataset.dataPoints / 1000000).toFixed(1)}M data points from ${selectedDataset.source}, the trend shows a statistically significant relationship (p < 0.001). Key drivers include temporal patterns and demographic segmentation.`,
        `Your query reveals an interesting insight: the data suggests a causal relationship that contradicts conventional assumptions. Further investigation into confounding variables is recommended.`,
        `The ${selectedDataset.title} analysis complete. I identified 3 distinct clusters in the data, with the primary segment showing ${selectedDataset.sampleInsight}. Confidence interval: 95%.`,
      ]
      setAiResponse(responses[Math.floor(Math.random() * responses.length)])
      setIsAnalyzing(false)
    }, 2000)
  }

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
    if (num < 1) return num.toFixed(3)
    return num.toFixed(1)
  }

  return (
    <div className="space-y-6">
      {/* Header with Animation Canvas */}
      <div className="relative overflow-hidden rounded-xl border border-slate-700/50 bg-slate-800/30">
        <canvas
          ref={canvasRef}
          width={1200}
          height={150}
          className="absolute inset-0 h-full w-full opacity-50"
        />
        <div className="relative z-10 p-6">
          <h2 className="text-2xl font-bold text-white">Wildcard Lab</h2>
          <p className="text-slate-400">
            Your obsession. Your data. Build something that scratches that analytical itch.
          </p>
        </div>
      </div>

      {/* Dataset Selection */}
      <div>
        <h3 className="mb-4 text-lg font-semibold text-white">Choose Your Dataset</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {wildcardDatasets.map((dataset, index) => {
            const colors = colorClasses[dataset.color]
            const isSelected = selectedDataset?.id === dataset.id

            return (
              <motion.button
                key={dataset.id}
                onClick={() => setSelectedDataset(dataset)}
                className={`relative overflow-hidden rounded-xl border p-5 text-left transition-all ${
                  isSelected
                    ? `${colors.border} ${colors.bg} ring-2 ring-offset-2 ring-offset-slate-900 ${colors.border}`
                    : 'border-slate-700/50 bg-slate-800/30 hover:border-slate-600/50'
                }`}
                whileHover={{ scale: 1.02, y: -4 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                {/* Glow effect when selected */}
                {isSelected && (
                  <motion.div
                    className={`absolute inset-0 ${colors.bg} blur-xl`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.5 }}
                  />
                )}

                <div className="relative">
                  <div className="flex items-start justify-between">
                    <span className="text-4xl">{dataset.icon}</span>
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className={`rounded-full ${colors.bg} p-1`}
                      >
                        <svg
                          className={`h-4 w-4 ${colors.text}`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </motion.div>
                    )}
                  </div>

                  <h4 className="mt-3 font-semibold text-white">{dataset.title}</h4>
                  <p className="mt-1 text-sm text-slate-400">{dataset.description}</p>

                  <div className="mt-4 flex items-center justify-between text-xs">
                    <span className="text-slate-500">{formatNumber(dataset.dataPoints)} points</span>
                    <span className={colors.text}>{dataset.source}</span>
                  </div>

                  {/* Sample Insight */}
                  <div className={`mt-3 rounded-lg ${colors.bg} p-2`}>
                    <p className={`text-xs ${colors.text}`}>
                      💡 {dataset.sampleInsight}
                    </p>
                  </div>
                </div>
              </motion.button>
            )
          })}
        </div>
      </div>

      {/* AI Query Interface */}
      <AnimatePresence>
        {selectedDataset && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="rounded-xl border border-purple-500/30 bg-gradient-to-br from-purple-500/10 to-pink-500/10 p-6">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{selectedDataset.icon}</span>
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    Explore {selectedDataset.title}
                  </h3>
                  <p className="text-sm text-slate-400">
                    Ask anything about this dataset
                  </p>
                </div>
              </div>

              {/* Query Input */}
              <div className="mt-4 flex gap-3">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && runAnalysis()}
                  placeholder="e.g., What's the correlation between price and location?"
                  className="flex-1 rounded-lg border border-slate-600 bg-slate-800/50 px-4 py-3 text-white placeholder:text-slate-500 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                />
                <motion.button
                  onClick={runAnalysis}
                  disabled={!query || isAnalyzing}
                  className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-3 font-medium text-white transition-opacity disabled:opacity-50"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isAnalyzing ? (
                    <motion.div
                      className="h-5 w-5 rounded-full border-2 border-white border-t-transparent"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    />
                  ) : (
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  )}
                  Analyze
                </motion.button>
              </div>

              {/* Quick Query Suggestions */}
              <div className="mt-3 flex flex-wrap gap-2">
                {[
                  'Find correlations',
                  'Detect anomalies',
                  'Segment clusters',
                  'Predict trends',
                ].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => setQuery(suggestion)}
                    className="rounded-full border border-slate-600 px-3 py-1 text-xs text-slate-400 transition-colors hover:border-purple-500 hover:text-purple-400"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>

              {/* AI Response */}
              <AnimatePresence>
                {aiResponse && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mt-4 rounded-lg border border-green-500/30 bg-green-500/10 p-4"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-green-500/20">
                        <span>🤖</span>
                      </div>
                      <div>
                        <p className="text-sm text-slate-300">{aiResponse}</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Metrics Grid */}
              <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {metrics.map((metric, i) => (
                  <motion.div
                    key={metric.label}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                    className="rounded-lg bg-slate-800/50 p-4"
                  >
                    <div className="text-xs text-slate-500">{metric.label}</div>
                    <div className="mt-1 flex items-baseline gap-1">
                      <span className="font-mono text-2xl font-bold text-white">
                        {formatNumber(metric.value)}
                      </span>
                      <span className="text-sm text-slate-500">{metric.unit}</span>
                    </div>
                    <div
                      className={`mt-1 flex items-center gap-1 text-xs ${
                        metric.trend === 'up'
                          ? 'text-green-400'
                          : metric.trend === 'down'
                            ? 'text-red-400'
                            : 'text-slate-400'
                      }`}
                    >
                      {metric.trend === 'up' ? '↑' : metric.trend === 'down' ? '↓' : '→'}
                      {Math.abs(metric.change).toFixed(2)}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Inspiration Section */}
      <div className="rounded-xl border border-slate-700/50 bg-slate-800/30 p-6">
        <h3 className="mb-4 text-lg font-semibold text-white">Need Inspiration?</h3>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-lg bg-slate-900/50 p-4">
            <div className="text-2xl">🔥</div>
            <h4 className="mt-2 font-medium text-white">Trending Topics</h4>
            <ul className="mt-2 space-y-1 text-sm text-slate-400">
              <li>• AI model performance benchmarks</li>
              <li>• Climate migration patterns</li>
              <li>• Remote work productivity data</li>
            </ul>
          </div>
          <div className="rounded-lg bg-slate-900/50 p-4">
            <div className="text-2xl">🏆</div>
            <h4 className="mt-2 font-medium text-white">Past Winners</h4>
            <ul className="mt-2 space-y-1 text-sm text-slate-400">
              <li>• Music streaming behavior analysis</li>
              <li>• Restaurant survival prediction</li>
              <li>• Social network influence mapping</li>
            </ul>
          </div>
          <div className="rounded-lg bg-slate-900/50 p-4">
            <div className="text-2xl">💡</div>
            <h4 className="mt-2 font-medium text-white">Underexplored</h4>
            <ul className="mt-2 space-y-1 text-sm text-slate-400">
              <li>• Sleep pattern economics</li>
              <li>• Urban sound pollution mapping</li>
              <li>• Meme virality prediction</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <motion.div
        className="relative overflow-hidden rounded-xl border border-orange-500/30 bg-gradient-to-r from-orange-500/10 via-yellow-500/10 to-orange-500/10 p-8 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <motion.div
          className="absolute left-1/4 top-1/2 h-32 w-32 rounded-full bg-orange-500/20 blur-3xl"
          animate={{ x: [0, 50, 0], y: [0, -30, 0] }}
          transition={{ duration: 5, repeat: Infinity }}
        />
        <motion.div
          className="absolute right-1/4 top-1/2 h-32 w-32 rounded-full bg-yellow-500/20 blur-3xl"
          animate={{ x: [0, -50, 0], y: [0, 30, 0] }}
          transition={{ duration: 5, repeat: Infinity, delay: 0.5 }}
        />

        <div className="relative">
          <span className="text-5xl">🃏</span>
          <h3 className="mt-4 text-2xl font-bold text-white">Your Rules. Your Data. Your Story.</h3>
          <p className="mx-auto mt-2 max-w-xl text-slate-300">
            The best projects come from obsessions we didn't know we had. Find a dataset that
            fascinates you and build something that surprises everyone—including yourself.
          </p>
          <motion.a
            href="https://hex.tech"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-orange-500 to-yellow-500 px-8 py-3 font-medium text-white transition-opacity hover:opacity-90"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Start Building in Hex
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </motion.a>
        </div>
      </motion.div>
    </div>
  )
}
