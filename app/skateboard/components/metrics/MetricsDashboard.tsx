'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { SkateboardMetrics } from '../../types'

interface MetricsDashboardProps {
  metrics?: SkateboardMetrics
}

const DEFAULT_METRICS: SkateboardMetrics = {
  speed: 0,
  maxSpeed: 0,
  airTime: 0,
  totalAirTime: 0,
  currentTrick: null,
  trickCombo: 0,
  score: 0,
  height: 0,
  maxHeight: 0,
  rotationDegrees: 0,
  flipCount: 0,
}

interface SpeedometerProps {
  value: number
  max: number
  label: string
  unit: string
  color: string
}

function Speedometer({ value, max, label, unit, color }: SpeedometerProps) {
  const percentage = Math.min((value / max) * 100, 100)
  const angle = (percentage / 100) * 180 - 90

  return (
    <div className="relative aspect-[2/1] w-full">
      <svg className="h-full w-full" viewBox="0 0 200 100">
        <path
          d="M 20 100 A 80 80 0 0 1 180 100"
          fill="none"
          stroke="#374151"
          strokeWidth="12"
          strokeLinecap="round"
        />
        <motion.path
          d="M 20 100 A 80 80 0 0 1 180 100"
          fill="none"
          stroke={color}
          strokeWidth="12"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: percentage / 100 }}
          transition={{ duration: 0.3 }}
        />
        {[0, 25, 50, 75, 100].map((tick) => {
          const tickAngle = ((tick / 100) * 180 - 90) * (Math.PI / 180)
          const x1 = 100 + Math.cos(tickAngle) * 65
          const y1 = 100 + Math.sin(tickAngle) * 65
          const x2 = 100 + Math.cos(tickAngle) * 75
          const y2 = 100 + Math.sin(tickAngle) * 75
          return (
            <line key={tick} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#6b7280" strokeWidth="2" />
          )
        })}
        <motion.line
          x1="100"
          y1="100"
          x2="100"
          y2="35"
          stroke="#ffffff"
          strokeWidth="3"
          strokeLinecap="round"
          style={{ transformOrigin: '100px 100px' }}
          animate={{ rotate: angle }}
          transition={{ type: 'spring', stiffness: 100, damping: 20 }}
        />
        <circle cx="100" cy="100" r="8" fill={color} />
      </svg>
      <div className="absolute right-0 bottom-0 left-0 text-center">
        <motion.div
          className="text-2xl font-bold text-white"
          key={Math.round(value)}
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
        >
          {value.toFixed(0)}
          <span className="ml-1 text-sm text-gray-400">{unit}</span>
        </motion.div>
        <div className="text-xs text-gray-500">{label}</div>
      </div>
    </div>
  )
}

interface BarMeterProps {
  value: number
  max: number
  label: string
  color: string
  showHistory?: boolean
}

function BarMeter({ value, max, label, color, showHistory = false }: BarMeterProps) {
  const historyRef = useRef<number[]>([])
  const [history, setHistory] = useState<number[]>([])

  useEffect(() => {
    if (showHistory) {
      historyRef.current = [...historyRef.current.slice(-19), value]
      setHistory([...historyRef.current])
    }
  }, [value, showHistory])

  const percentage = Math.min((value / max) * 100, 100)

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-gray-400">{label}</span>
        <motion.span
          className="font-mono text-white"
          key={Math.round(value)}
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
        >
          {value.toFixed(1)}
        </motion.span>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-gray-700">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.1 }}
        />
      </div>
      {showHistory && history.length > 1 && (
        <div className="flex h-12 items-end gap-0.5">
          {history.map((v, i) => (
            <motion.div
              key={i}
              className="flex-1 rounded-t"
              style={{ backgroundColor: color, opacity: 0.3 + (i / history.length) * 0.7 }}
              initial={{ height: 0 }}
              animate={{ height: `${(v / max) * 100}%` }}
            />
          ))}
        </div>
      )}
    </div>
  )
}

interface StatCardProps {
  label: string
  value: string | number
  color?: string
}

function StatCard({ label, value, color = '#ffffff' }: StatCardProps) {
  return (
    <motion.div
      className="rounded-xl border border-gray-700 bg-gray-800/50 p-4"
      whileHover={{ scale: 1.02 }}
    >
      <div className="flex items-center gap-3">
        <div>
          <div className="text-xs tracking-wider text-gray-500 uppercase">{label}</div>
          <div className="text-xl font-bold" style={{ color }}>
            {typeof value === 'number' ? value.toLocaleString() : value}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default function MetricsDashboard({ metrics = DEFAULT_METRICS }: MetricsDashboardProps) {
  const [demoMetrics, setDemoMetrics] = useState<SkateboardMetrics>(metrics)
  const [isSimulating, setIsSimulating] = useState(true)

  useEffect(() => {
    if (!isSimulating) return

    const interval = setInterval(() => {
      setDemoMetrics((prev) => {
        const newSpeed = prev.speed + (Math.random() - 0.5) * 100
        const clampedSpeed = Math.max(0, Math.min(800, newSpeed))
        const isInAir = Math.random() > 0.7
        const newHeight = isInAir ? Math.random() * 150 : 0

        return {
          ...prev,
          speed: clampedSpeed,
          maxSpeed: Math.max(prev.maxSpeed, clampedSpeed),
          height: newHeight,
          maxHeight: Math.max(prev.maxHeight, newHeight),
          airTime: isInAir ? prev.airTime + 0.05 : 0,
          totalAirTime: prev.totalAirTime + (isInAir ? 0.05 : 0),
          rotationDegrees: isInAir ? Math.random() * 720 : 0,
          score: prev.score + (isInAir ? Math.floor(Math.random() * 50) : 0),
          trickCombo:
            isInAir && Math.random() > 0.5 ? prev.trickCombo + 1 : isInAir ? prev.trickCombo : 0,
          currentTrick:
            isInAir && Math.random() > 0.6
              ? ['Kickflip', 'Heelflip', 'Ollie', '360 Flip'][Math.floor(Math.random() * 4)]
              : null,
        }
      })
    }, 50)

    return () => clearInterval(interval)
  }, [isSimulating])

  const displayMetrics = metrics !== DEFAULT_METRICS ? metrics : demoMetrics

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Performance Metrics</h2>
        <button
          onClick={() => setIsSimulating(!isSimulating)}
          className={`rounded-lg px-4 py-2 text-sm transition-colors ${
            isSimulating
              ? 'bg-orange-500 text-white hover:bg-orange-600'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          {isSimulating ? 'Pause Simulation' : 'Resume Simulation'}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-gray-700 bg-gray-800/50 p-6">
          <Speedometer
            value={displayMetrics.speed}
            max={800}
            label="Current Speed"
            unit="px/s"
            color="#f97316"
          />
        </div>
        <div className="rounded-xl border border-gray-700 bg-gray-800/50 p-6">
          <Speedometer
            value={displayMetrics.height}
            max={200}
            label="Current Height"
            unit="px"
            color="#06b6d4"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-gray-700 bg-gray-800/50 p-4">
          <BarMeter
            value={displayMetrics.speed}
            max={800}
            label="Speed"
            color="#f97316"
            showHistory
          />
        </div>
        <div className="rounded-xl border border-gray-700 bg-gray-800/50 p-4">
          <BarMeter
            value={displayMetrics.rotationDegrees}
            max={720}
            label="Rotation"
            color="#a855f7"
            showHistory
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard label="Score" value={displayMetrics.score} color="#22c55e" />
        <StatCard
          label="Max Speed"
          value={`${displayMetrics.maxSpeed.toFixed(0)} px/s`}
          color="#f97316"
        />
        <StatCard
          label="Max Height"
          value={`${displayMetrics.maxHeight.toFixed(0)} px`}
          color="#06b6d4"
        />
        <StatCard
          label="Total Air Time"
          value={`${displayMetrics.totalAirTime.toFixed(1)}s`}
          color="#a855f7"
        />
      </div>

      <div className="rounded-xl border border-gray-700 bg-gray-800/50 p-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="mb-1 text-xs tracking-wider text-gray-500 uppercase">Current Trick</div>
            <motion.div
              key={displayMetrics.currentTrick || 'none'}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl font-bold"
              style={{ color: displayMetrics.currentTrick ? '#f97316' : '#6b7280' }}
            >
              {displayMetrics.currentTrick || 'None'}
            </motion.div>
          </div>
          <div className="text-right">
            <div className="mb-1 text-xs tracking-wider text-gray-500 uppercase">Combo</div>
            <motion.div
              key={displayMetrics.trickCombo}
              initial={{ scale: 1.5 }}
              animate={{ scale: 1 }}
              className="text-3xl font-bold text-yellow-400"
            >
              x{displayMetrics.trickCombo}
            </motion.div>
          </div>
        </div>
        <div className="mt-4 flex gap-1">
          {Array(10)
            .fill(0)
            .map((_, i) => (
              <motion.div
                key={i}
                className="h-2 flex-1 rounded-full"
                style={{
                  backgroundColor: i < displayMetrics.trickCombo ? '#eab308' : '#374151',
                }}
                animate={{
                  scale: i < displayMetrics.trickCombo ? [1, 1.2, 1] : 1,
                }}
                transition={{
                  duration: 0.3,
                  delay: i * 0.05,
                }}
              />
            ))}
        </div>
      </div>

      <div className="rounded-xl border border-gray-700 bg-gray-800/50 p-4">
        <h3 className="mb-3 text-sm font-semibold text-gray-400">Live Data Stream</h3>
        <div className="h-24 space-y-1 overflow-hidden font-mono text-xs text-gray-500">
          <div className="animate-pulse">
            <span className="text-gray-600">[{new Date().toISOString().slice(11, 23)}]</span>{' '}
            <span className="text-orange-400">SPD:</span> {displayMetrics.speed.toFixed(2)}{' '}
            <span className="text-cyan-400">HGT:</span> {displayMetrics.height.toFixed(2)}{' '}
            <span className="text-purple-400">ROT:</span>{' '}
            {displayMetrics.rotationDegrees.toFixed(1)}°{' '}
            <span className="text-green-400">SCR:</span> {displayMetrics.score}
          </div>
        </div>
      </div>
    </div>
  )
}
