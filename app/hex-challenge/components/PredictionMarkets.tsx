'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import { gsap } from 'gsap'
import type { PredictionMarket } from '../types'
import { predictionMarkets, generateMarketHistory } from '../data/mockData'

const categoryColors: Record<string, { bg: string; text: string; border: string }> = {
  technology: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/30' },
  economy: { bg: 'bg-green-500/10', text: 'text-green-400', border: 'border-green-500/30' },
  politics: { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/30' },
  entertainment: { bg: 'bg-pink-500/10', text: 'text-pink-400', border: 'border-pink-500/30' },
  sports: { bg: 'bg-orange-500/10', text: 'text-orange-400', border: 'border-orange-500/30' },
}

export default function PredictionMarkets() {
  const [markets, setMarkets] = useState<PredictionMarket[]>(predictionMarkets)
  const [selectedMarket, setSelectedMarket] = useState<PredictionMarket>(predictionMarkets[0])
  const [chartHistory, setChartHistory] = useState<{ timestamp: Date; probability: number }[]>([])
  const gaugeRef = useRef<HTMLCanvasElement>(null)
  const chartRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<{ probability: number }>({ probability: 0 })

  // Simulate live updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMarkets((prev) =>
        prev.map((market) => {
          const change = (Math.random() - 0.5) * 0.02
          const newProb = Math.max(0.01, Math.min(0.99, market.probability + change))
          const trending =
            newProb > market.probability ? 'up' : newProb < market.probability ? 'down' : 'stable'
          return {
            ...market,
            previousProbability: market.probability,
            probability: newProb,
            trending,
            lastUpdate: new Date(),
          }
        })
      )
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  // Update selected market when markets change
  useEffect(() => {
    const updated = markets.find((m) => m.id === selectedMarket.id)
    if (updated) setSelectedMarket(updated)
  }, [markets, selectedMarket.id])

  // Generate chart history when market changes
  useEffect(() => {
    setChartHistory(generateMarketHistory(selectedMarket, 30))
  }, [selectedMarket])

  const drawGauge = useCallback(
    (ctx: CanvasRenderingContext2D, width: number, height: number, probability: number) => {
      ctx.clearRect(0, 0, width, height)

      const centerX = width / 2
      const centerY = height * 0.7
      const radius = Math.min(width, height) * 0.4
      const lineWidth = 20

      // Background arc
      ctx.beginPath()
      ctx.arc(centerX, centerY, radius, Math.PI, 2 * Math.PI)
      ctx.strokeStyle = 'rgba(100, 116, 139, 0.2)'
      ctx.lineWidth = lineWidth
      ctx.lineCap = 'round'
      ctx.stroke()

      // Probability arc
      const gradient = ctx.createLinearGradient(0, 0, width, 0)
      gradient.addColorStop(0, '#ef4444')
      gradient.addColorStop(0.5, '#eab308')
      gradient.addColorStop(1, '#22c55e')

      ctx.beginPath()
      ctx.arc(centerX, centerY, radius, Math.PI, Math.PI + probability * Math.PI)
      ctx.strokeStyle = gradient
      ctx.lineWidth = lineWidth
      ctx.lineCap = 'round'
      ctx.stroke()

      // Probability text
      ctx.fillStyle = '#ffffff'
      ctx.font = 'bold 48px system-ui'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(`${(probability * 100).toFixed(1)}%`, centerX, centerY - 20)

      // Label
      ctx.fillStyle = 'rgba(148, 163, 184, 0.8)'
      ctx.font = '14px system-ui'
      ctx.fillText('PROBABILITY', centerX, centerY + 30)
    },
    []
  )

  // Draw probability gauge
  useEffect(() => {
    const canvas = gaugeRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Animate to new probability
    gsap.to(animationRef.current, {
      probability: selectedMarket.probability,
      duration: 1,
      ease: 'power2.out',
      onUpdate: () => {
        drawGauge(ctx, canvas.width, canvas.height, animationRef.current.probability)
      },
    })
  }, [selectedMarket.probability, drawGauge])

  // Draw time series chart
  useEffect(() => {
    const canvas = chartRef.current
    if (!canvas || chartHistory.length === 0) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height
    const padding = 40

    ctx.clearRect(0, 0, width, height)

    // Draw grid
    ctx.strokeStyle = 'rgba(100, 116, 139, 0.1)'
    ctx.lineWidth = 1

    for (let i = 0; i <= 4; i++) {
      const y = padding + ((height - padding * 2) * i) / 4
      ctx.beginPath()
      ctx.moveTo(padding, y)
      ctx.lineTo(width - padding, y)
      ctx.stroke()

      // Y-axis labels
      ctx.fillStyle = 'rgba(148, 163, 184, 0.5)'
      ctx.font = '12px system-ui'
      ctx.textAlign = 'right'
      ctx.fillText(`${100 - i * 25}%`, padding - 10, y + 4)
    }

    // Draw line chart
    const points = chartHistory.map((d, i) => ({
      x: padding + ((width - padding * 2) * i) / (chartHistory.length - 1),
      y: padding + (1 - d.probability) * (height - padding * 2),
    }))

    // Gradient fill
    const gradient = ctx.createLinearGradient(0, padding, 0, height - padding)
    gradient.addColorStop(0, 'rgba(168, 85, 247, 0.3)')
    gradient.addColorStop(1, 'rgba(168, 85, 247, 0)')

    ctx.beginPath()
    ctx.moveTo(points[0].x, height - padding)
    points.forEach((p) => ctx.lineTo(p.x, p.y))
    ctx.lineTo(points[points.length - 1].x, height - padding)
    ctx.closePath()
    ctx.fillStyle = gradient
    ctx.fill()

    // Line
    ctx.beginPath()
    ctx.moveTo(points[0].x, points[0].y)
    points.forEach((p) => ctx.lineTo(p.x, p.y))
    ctx.strokeStyle = '#a855f7'
    ctx.lineWidth = 3
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.stroke()

    // Current point
    const lastPoint = points[points.length - 1]
    ctx.beginPath()
    ctx.arc(lastPoint.x, lastPoint.y, 8, 0, Math.PI * 2)
    ctx.fillStyle = '#a855f7'
    ctx.fill()
    ctx.beginPath()
    ctx.arc(lastPoint.x, lastPoint.y, 4, 0, Math.PI * 2)
    ctx.fillStyle = '#ffffff'
    ctx.fill()
  }, [chartHistory])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Prediction Markets</h2>
          <p className="text-slate-400">Real-time odds from collective intelligence markets</p>
        </div>
        <div className="flex items-center gap-2 rounded-lg bg-slate-800/50 px-4 py-2">
          <span className="text-sm text-slate-400">Updating every</span>
          <motion.span
            className="font-mono text-purple-400"
            key={Date.now()}
            initial={{ opacity: 0.5 }}
            animate={{ opacity: 1 }}
          >
            3s
          </motion.span>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left: Market List */}
        <div className="space-y-3">
          {markets.map((market) => {
            const colors = categoryColors[market.category]
            const isSelected = market.id === selectedMarket.id
            const change = market.probability - market.previousProbability

            return (
              <motion.button
                key={market.id}
                onClick={() => setSelectedMarket(market)}
                className={`w-full rounded-xl border p-4 text-left transition-all ${
                  isSelected
                    ? 'border-purple-500/50 bg-purple-500/10'
                    : 'border-slate-700/50 bg-slate-800/30 hover:border-slate-600/50 hover:bg-slate-800/50'
                }`}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="mb-2 flex items-center gap-2">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${colors.bg} ${colors.text}`}
                      >
                        {market.category}
                      </span>
                    </div>
                    <h3 className="font-medium text-white">{market.title}</h3>
                    <p className="mt-1 text-sm text-slate-500">
                      Volume: ${(market.volume / 1000000).toFixed(1)}M
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="font-mono text-2xl font-bold text-white">
                      {(market.probability * 100).toFixed(1)}%
                    </div>
                    <div
                      className={`flex items-center justify-end gap-1 text-sm ${
                        change > 0
                          ? 'text-green-400'
                          : change < 0
                            ? 'text-red-400'
                            : 'text-slate-400'
                      }`}
                    >
                      {change > 0 ? '↑' : change < 0 ? '↓' : '→'}
                      {Math.abs(change * 100).toFixed(2)}%
                    </div>
                  </div>
                </div>
              </motion.button>
            )
          })}
        </div>

        {/* Right: Selected Market Details */}
        <div className="space-y-6">
          {/* Probability Gauge */}
          <div className="rounded-xl border border-slate-700/50 bg-slate-800/30 p-6">
            <h3 className="mb-4 text-lg font-semibold text-white">Current Probability</h3>
            <canvas
              ref={gaugeRef}
              width={400}
              height={250}
              className="mx-auto w-full max-w-md"
            />
            <p className="mt-4 text-center text-sm text-slate-400">{selectedMarket.title}</p>
          </div>

          {/* Time Series Chart */}
          <div className="rounded-xl border border-slate-700/50 bg-slate-800/30 p-6">
            <h3 className="mb-4 text-lg font-semibold text-white">30-Day History</h3>
            <canvas ref={chartRef} width={500} height={200} className="w-full" />
          </div>

          {/* Market Insights */}
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl border border-slate-700/50 bg-slate-800/30 p-4">
              <div className="text-sm text-slate-400">Total Volume</div>
              <div className="mt-1 font-mono text-xl font-bold text-green-400">
                ${(selectedMarket.volume / 1000000).toFixed(2)}M
              </div>
            </div>
            <div className="rounded-xl border border-slate-700/50 bg-slate-800/30 p-4">
              <div className="text-sm text-slate-400">Resolution Date</div>
              <div className="mt-1 font-mono text-xl font-bold text-cyan-400">
                {new Date(selectedMarket.endDate).toLocaleDateString('en-US', {
                  month: 'short',
                  year: 'numeric',
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Insight Banner */}
      <motion.div
        className="rounded-xl border border-purple-500/30 bg-gradient-to-r from-purple-500/10 to-pink-500/10 p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-purple-500/20">
            <span className="text-xl">💡</span>
          </div>
          <div>
            <h4 className="font-semibold text-white">AI Insight</h4>
            <p className="mt-1 text-sm text-slate-300">
              Markets with technology and economy categories show highest volume correlation with
              news cycle intensity. Consider tracking breaking news feeds alongside market movements
              for predictive modeling opportunities.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
