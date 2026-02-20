'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { SlangTerm } from '../types'
import { slangTerms, slangTimeline } from '../data/mockData'

const statusColors: Record<string, { bg: string; text: string; ring: string }> = {
  rising: { bg: 'bg-green-500/20', text: 'text-green-400', ring: 'ring-green-500/50' },
  peak: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', ring: 'ring-yellow-500/50' },
  declining: { bg: 'bg-orange-500/20', text: 'text-orange-400', ring: 'ring-orange-500/50' },
  dead: { bg: 'bg-red-500/20', text: 'text-red-400', ring: 'ring-red-500/50' },
}

const generationColors: Record<string, string> = {
  'gen-z': 'bg-purple-500',
  millennial: 'bg-blue-500',
  'gen-x': 'bg-green-500',
  boomer: 'bg-orange-500',
}

export default function SlangEvolution() {
  const [selectedTerm, setSelectedTerm] = useState<SlangTerm | null>(null)
  const [activeYear, setActiveYear] = useState<number>(2024)
  const [sortBy, setSortBy] = useState<'popularity' | 'shelf-life' | 'year'>('popularity')
  const [terms, setTerms] = useState<SlangTerm[]>(slangTerms)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Animate shelf life countdown
  useEffect(() => {
    const interval = setInterval(() => {
      setTerms((prev) =>
        prev.map((term) => ({
          ...term,
          currentPopularity: Math.max(0, term.currentPopularity + (Math.random() - 0.5) * 3),
        }))
      )
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  // Sort terms
  const sortedTerms = [...terms].sort((a, b) => {
    switch (sortBy) {
      case 'popularity':
        return b.currentPopularity - a.currentPopularity
      case 'shelf-life':
        return b.shelfLife - a.shelfLife
      case 'year':
        return b.peakYear - a.peakYear
      default:
        return 0
    }
  })

  // Draw popularity wave visualization
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height

    let animationId: number
    let time = 0

    const draw = () => {
      ctx.clearRect(0, 0, width, height)

      // Draw wave for each term
      terms.forEach((term, index) => {
        const hue = (index * 360) / terms.length
        const baseY = height / 2
        const amplitude = (term.currentPopularity / 100) * 40

        ctx.beginPath()
        ctx.moveTo(0, baseY)

        for (let x = 0; x < width; x++) {
          const frequency = 0.02 + index * 0.005
          const phase = time * 0.02 + index * 0.5
          const y = baseY + Math.sin(x * frequency + phase) * amplitude

          ctx.lineTo(x, y)
        }

        ctx.strokeStyle = `hsla(${hue}, 70%, 60%, 0.3)`
        ctx.lineWidth = 2
        ctx.stroke()
      })

      time++
      animationId = requestAnimationFrame(draw)
    }

    draw()
    return () => cancelAnimationFrame(animationId)
  }, [terms])

  const getShelfLifeColor = (months: number) => {
    if (months > 30) return 'text-green-400'
    if (months > 18) return 'text-yellow-400'
    return 'text-red-400'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Slang Evolution</h2>
          <p className="text-slate-400">Track the rise and fall of internet vernacular</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-400">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white"
          >
            <option value="popularity">Popularity</option>
            <option value="shelf-life">Shelf Life</option>
            <option value="year">Peak Year</option>
          </select>
        </div>
      </div>

      {/* Wave Visualization */}
      <div className="rounded-xl border border-slate-700/50 bg-slate-800/30 p-4">
        <h3 className="mb-3 text-sm font-medium text-slate-400">Popularity Waves</h3>
        <canvas ref={canvasRef} width={800} height={100} className="w-full rounded-lg" />
      </div>

      {/* Timeline */}
      <div className="rounded-xl border border-slate-700/50 bg-slate-800/30 p-6">
        <h3 className="mb-4 text-lg font-semibold text-white">Historical Timeline</h3>
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute top-1/2 right-0 left-0 h-1 -translate-y-1/2 bg-gradient-to-r from-slate-700 via-cyan-500/50 to-slate-700" />

          {/* Year markers */}
          <div className="relative flex justify-between">
            {slangTimeline.map((point) => (
              <motion.button
                key={point.year}
                onClick={() => setActiveYear(point.year)}
                className={`relative flex flex-col items-center ${
                  activeYear === point.year ? 'z-10' : ''
                }`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  className={`mb-2 flex h-12 w-12 items-center justify-center rounded-full border-2 transition-all ${
                    activeYear === point.year
                      ? 'border-cyan-400 bg-cyan-500/20'
                      : 'border-slate-600 bg-slate-800 hover:border-slate-500'
                  }`}
                  animate={
                    activeYear === point.year
                      ? { boxShadow: '0 0 20px rgba(34, 211, 238, 0.5)' }
                      : { boxShadow: 'none' }
                  }
                >
                  <span className="font-mono text-sm font-bold text-white">{point.year}</span>
                </motion.div>
                <span className="text-xs text-slate-500">{point.dominantGeneration}</span>
              </motion.button>
            ))}
          </div>

          {/* Active year terms */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeYear}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mt-6 flex flex-wrap justify-center gap-3"
            >
              {slangTimeline
                .find((p) => p.year === activeYear)
                ?.terms.map((term, i) => (
                  <motion.span
                    key={term}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                    className="rounded-full bg-gradient-to-r from-cyan-500/20 to-blue-500/20 px-4 py-2 text-lg font-medium text-cyan-300"
                  >
                    {term}
                  </motion.span>
                ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Term Cards Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sortedTerms.map((term) => {
          const status = statusColors[term.status]
          return (
            <motion.div
              key={term.term}
              onClick={() => setSelectedTerm(term)}
              className={`cursor-pointer rounded-xl border p-5 transition-all ${
                selectedTerm?.term === term.term
                  ? `border-transparent ring-2 ${status.ring} ${status.bg}`
                  : 'border-slate-700/50 bg-slate-800/30 hover:border-slate-600/50'
              }`}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              layout
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white">&quot;{term.term}&quot;</h3>
                  <p className="mt-1 text-sm text-slate-400">{term.definition}</p>
                </div>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-medium ${status.bg} ${status.text}`}
                >
                  {term.status}
                </span>
              </div>

              {/* Popularity bar */}
              <div className="mt-4">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Popularity</span>
                  <span className="font-mono text-cyan-400">
                    {term.currentPopularity.toFixed(0)}%
                  </span>
                </div>
                <div className="mt-1 h-2 overflow-hidden rounded-full bg-slate-700">
                  <motion.div
                    className="h-full bg-gradient-to-r from-cyan-500 to-blue-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${term.currentPopularity}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>

              {/* Metadata */}
              <div className="mt-4 flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-slate-500">Shelf Life:</span>
                  <span className={`font-mono ${getShelfLifeColor(term.shelfLife)}`}>
                    {term.shelfLife}mo
                  </span>
                </div>
                <div className="flex gap-1">
                  {term.generations.map((gen) => (
                    <div
                      key={gen}
                      className={`h-3 w-3 rounded-full ${generationColors[gen]}`}
                      title={gen}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Selected Term Detail Panel */}
      <AnimatePresence>
        {selectedTerm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="rounded-xl border border-cyan-500/30 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-white">
                    &quot;{selectedTerm.term}&quot;
                  </h3>
                  <p className="mt-1 text-slate-400">{selectedTerm.definition}</p>
                </div>
                <button
                  onClick={() => setSelectedTerm(null)}
                  className="rounded-lg p-2 text-slate-400 hover:bg-slate-700 hover:text-white"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-4">
                <div className="rounded-lg bg-slate-800/50 p-4">
                  <div className="text-xs text-slate-500">Origin</div>
                  <div className="mt-1 text-white">{selectedTerm.origin}</div>
                </div>
                <div className="rounded-lg bg-slate-800/50 p-4">
                  <div className="text-xs text-slate-500">Peak Year</div>
                  <div className="mt-1 font-mono text-2xl font-bold text-cyan-400">
                    {selectedTerm.peakYear}
                  </div>
                </div>
                <div className="rounded-lg bg-slate-800/50 p-4">
                  <div className="text-xs text-slate-500">Category</div>
                  <div className="mt-1 text-white capitalize">{selectedTerm.category}</div>
                </div>
                <div className="rounded-lg bg-slate-800/50 p-4">
                  <div className="text-xs text-slate-500">Adopted By</div>
                  <div className="mt-2 flex gap-2">
                    {selectedTerm.generations.map((gen) => (
                      <span
                        key={gen}
                        className={`rounded-full ${generationColors[gen]} px-2 py-0.5 text-xs text-white`}
                      >
                        {gen}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Prediction */}
              <div className="mt-4 rounded-lg border border-yellow-500/20 bg-yellow-500/5 p-4">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🔮</span>
                  <span className="font-medium text-yellow-400">Prediction</span>
                </div>
                <p className="mt-2 text-sm text-slate-300">
                  Based on current trajectory, &quot;{selectedTerm.term}&quot; will likely{' '}
                  {selectedTerm.status === 'rising'
                    ? 'reach peak usage within 6-8 months'
                    : selectedTerm.status === 'peak'
                      ? 'begin declining in the next 3-6 months'
                      : 'fade from mainstream usage within 12 months'}
                  . Historical patterns suggest{' '}
                  {selectedTerm.generations.length > 1
                    ? 'cross-generational terms have 40% longer shelf life'
                    : 'single-generation terms fade faster but leave stronger cultural impact'}
                  .
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-center gap-6 rounded-lg bg-slate-800/30 p-4">
        <div className="text-sm text-slate-400">Generations:</div>
        {Object.entries(generationColors).map(([gen, color]) => (
          <div key={gen} className="flex items-center gap-2">
            <div className={`h-3 w-3 rounded-full ${color}`} />
            <span className="text-sm text-slate-300 capitalize">{gen}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
