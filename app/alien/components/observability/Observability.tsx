'use client'

import { useEffect, useState } from 'react'
import { ObservabilityData } from '../../types'

export default function Observability() {
  const [stealthMode, setStealthMode] = useState(false)
  const [data, setData] = useState<ObservabilityData>({
    radarSignature: 125.5,
    infraredSignature: 450,
    visualDetection: true,
    electromagneticEmissions: 15000,
    acousticSignature: 85,
    timestamp: Date.now(),
  })

  const [history, setHistory] = useState<ObservabilityData[]>([])

  useEffect(() => {
    const interval = setInterval(() => {
      setData((prev) => {
        const newData = {
          radarSignature: stealthMode
            ? Math.random() * 2
            : 100 + Math.random() * 50,
          infraredSignature: stealthMode
            ? 280 + Math.random() * 10
            : 400 + Math.random() * 100,
          visualDetection: !stealthMode,
          electromagneticEmissions: stealthMode
            ? Math.random() * 100
            : 10000 + Math.random() * 10000,
          acousticSignature: stealthMode
            ? Math.random() * 5
            : 70 + Math.random() * 30,
          timestamp: Date.now(),
        }

        setHistory((h) => [...h.slice(-29), newData])
        return newData
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [stealthMode])

  const toggleStealth = () => {
    setStealthMode(!stealthMode)
  }

  const getDetectionLevel = () => {
    if (stealthMode) {
      return { level: 'MINIMAL', color: 'text-green-400', bg: 'bg-green-950' }
    }
    return { level: 'HIGH', color: 'text-red-400', bg: 'bg-red-950' }
  }

  const detectionLevel = getDetectionLevel()

  return (
    <div className="w-full space-y-6 rounded-xl border border-gray-700 bg-gradient-to-br from-gray-900 to-black p-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold text-cyan-400">Observability Dashboard</h2>
          <p className="mt-1 text-sm text-gray-400">
            Real-time detection signatures and stealth metrics
          </p>
        </div>
        <div className={`rounded-lg border px-4 py-2 font-bold ${detectionLevel.bg}`}>
          <span className={detectionLevel.color}>
            🎯 Detection Level: {detectionLevel.level}
          </span>
        </div>
      </div>

      {/* Stealth Control */}
      <div className="flex items-center justify-between rounded-xl border-2 border-purple-900 bg-purple-950/30 p-4">
        <div>
          <div className="font-semibold text-purple-400">Stealth Mode</div>
          <div className="mt-1 text-sm text-gray-400">
            Reduce all detection signatures to minimal levels
          </div>
        </div>
        <button
          onClick={toggleStealth}
          className={`relative h-12 w-24 rounded-full transition ${
            stealthMode ? 'bg-purple-600' : 'bg-gray-700'
          }`}
        >
          <div
            className={`absolute top-1 h-10 w-10 rounded-full bg-white shadow-lg transition-all ${
              stealthMode ? 'right-1' : 'left-1'
            }`}
          />
        </button>
      </div>

      {/* Main Metrics Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Radar Signature */}
        <div className="rounded-lg border border-cyan-900 bg-cyan-950/30 p-4">
          <div className="mb-2 flex items-center justify-between">
            <div className="text-sm text-gray-400">Radar Cross Section</div>
            <div className="text-lg">📡</div>
          </div>
          <div className="font-mono text-3xl font-bold text-cyan-400">
            {data.radarSignature.toFixed(2)}
          </div>
          <div className="mt-1 text-xs text-gray-500">m² RCS</div>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-gray-800">
            <div
              className="h-full bg-gradient-to-r from-cyan-600 to-blue-600 transition-all duration-500"
              style={{ width: `${Math.min((data.radarSignature / 200) * 100, 100)}%` }}
            />
          </div>
          <div className="mt-2 text-xs text-gray-500">
            {stealthMode ? 'Stealth Active' : 'Normal Operations'}
          </div>
        </div>

        {/* Infrared Signature */}
        <div className="rounded-lg border border-orange-900 bg-orange-950/30 p-4">
          <div className="mb-2 flex items-center justify-between">
            <div className="text-sm text-gray-400">Infrared Signature</div>
            <div className="text-lg">🌡️</div>
          </div>
          <div className="font-mono text-3xl font-bold text-orange-400">
            {data.infraredSignature.toFixed(0)}
          </div>
          <div className="mt-1 text-xs text-gray-500">Kelvin</div>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-gray-800">
            <div
              className="h-full bg-gradient-to-r from-orange-600 to-red-600 transition-all duration-500"
              style={{ width: `${Math.min((data.infraredSignature / 600) * 100, 100)}%` }}
            />
          </div>
          <div className="mt-2 text-xs text-gray-500">
            {data.infraredSignature < 300 ? 'Low Heat' : 'Elevated Temperature'}
          </div>
        </div>

        {/* Visual Detection */}
        <div className="rounded-lg border border-purple-900 bg-purple-950/30 p-4">
          <div className="mb-2 flex items-center justify-between">
            <div className="text-sm text-gray-400">Visual Detection</div>
            <div className="text-lg">👁️</div>
          </div>
          <div className="font-mono text-3xl font-bold text-purple-400">
            {data.visualDetection ? 'VISIBLE' : 'HIDDEN'}
          </div>
          <div className="mt-1 text-xs text-gray-500">Optical Signature</div>
          <div className="mt-3">
            {data.visualDetection ? (
              <div className="flex items-center gap-2 text-sm text-red-400">
                <div className="h-3 w-3 animate-pulse rounded-full bg-red-500" />
                Detectable by eye
              </div>
            ) : (
              <div className="flex items-center gap-2 text-sm text-green-400">
                <div className="h-3 w-3 rounded-full bg-green-500" />
                Cloaked
              </div>
            )}
          </div>
        </div>

        {/* EM Emissions */}
        <div className="rounded-lg border border-yellow-900 bg-yellow-950/30 p-4">
          <div className="mb-2 flex items-center justify-between">
            <div className="text-sm text-gray-400">EM Emissions</div>
            <div className="text-lg">⚡</div>
          </div>
          <div className="font-mono text-3xl font-bold text-yellow-400">
            {(data.electromagneticEmissions / 1000).toFixed(1)}
          </div>
          <div className="mt-1 text-xs text-gray-500">kW Power</div>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-gray-800">
            <div
              className="h-full bg-gradient-to-r from-yellow-600 to-orange-600 transition-all duration-500"
              style={{ width: `${Math.min((data.electromagneticEmissions / 20000) * 100, 100)}%` }}
            />
          </div>
          <div className="mt-2 text-xs text-gray-500">
            {data.electromagneticEmissions < 1000 ? 'Low Signature' : 'High Output'}
          </div>
        </div>

        {/* Acoustic Signature */}
        <div className="rounded-lg border border-green-900 bg-green-950/30 p-4">
          <div className="mb-2 flex items-center justify-between">
            <div className="text-sm text-gray-400">Acoustic Signature</div>
            <div className="text-lg">🔊</div>
          </div>
          <div className="font-mono text-3xl font-bold text-green-400">
            {data.acousticSignature.toFixed(1)}
          </div>
          <div className="mt-1 text-xs text-gray-500">Decibels</div>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-gray-800">
            <div
              className="h-full bg-gradient-to-r from-green-600 to-emerald-600 transition-all duration-500"
              style={{ width: `${(data.acousticSignature / 120) * 100}%` }}
            />
          </div>
          <div className="mt-2 text-xs text-gray-500">
            {data.acousticSignature < 10 ? 'Silent' : 'Audible'}
          </div>
        </div>

        {/* Overall Stealth Rating */}
        <div className="rounded-lg border-2 border-purple-900 bg-purple-950/50 p-4">
          <div className="mb-2 flex items-center justify-between">
            <div className="text-sm text-gray-400">Stealth Rating</div>
            <div className="text-lg">🥷</div>
          </div>
          <div className="font-mono text-3xl font-bold text-purple-400">
            {stealthMode ? '95%' : '12%'}
          </div>
          <div className="mt-1 text-xs text-gray-500">Overall Concealment</div>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-gray-800">
            <div
              className="h-full bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-500"
              style={{ width: stealthMode ? '95%' : '12%' }}
            />
          </div>
          <div className="mt-2 text-xs text-gray-500">
            {stealthMode ? 'Nearly Undetectable' : 'Highly Visible'}
          </div>
        </div>
      </div>

      {/* Time Series Graph */}
      <div className="rounded-lg border border-gray-800 bg-black/50 p-4">
        <h3 className="mb-4 text-sm font-semibold text-gray-400">Detection History (30s)</h3>
        <div className="relative h-32">
          <svg className="h-full w-full" viewBox="0 0 600 100" preserveAspectRatio="none">
            {/* Grid lines */}
            {[0, 25, 50, 75, 100].map((y) => (
              <line
                key={y}
                x1="0"
                y1={y}
                x2="600"
                y2={y}
                stroke="#374151"
                strokeWidth="0.5"
                opacity="0.5"
              />
            ))}

            {/* Radar signature line */}
            {history.length > 1 && (
              <polyline
                points={history
                  .map(
                    (d, i) =>
                      `${(i / 30) * 600},${100 - (d.radarSignature / 200) * 100}`
                  )
                  .join(' ')}
                fill="none"
                stroke="#06b6d4"
                strokeWidth="2"
              />
            )}

            {/* Acoustic signature line */}
            {history.length > 1 && (
              <polyline
                points={history
                  .map(
                    (d, i) =>
                      `${(i / 30) * 600},${100 - (d.acousticSignature / 100) * 100}`
                  )
                  .join(' ')}
                fill="none"
                stroke="#10b981"
                strokeWidth="2"
              />
            )}
          </svg>
        </div>
        <div className="mt-2 flex gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-cyan-400" />
            <span className="text-gray-400">Radar</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-green-400" />
            <span className="text-gray-400">Acoustic</span>
          </div>
        </div>
      </div>

      {/* Detection Systems */}
      <div className="rounded-lg border border-gray-800 bg-black/30 p-4">
        <h3 className="mb-3 text-sm font-semibold text-gray-400">Detection Systems Status</h3>
        <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-4">
          <div className="flex items-center gap-2 rounded bg-gray-900/50 p-2">
            <div className={`h-2 w-2 rounded-full ${stealthMode ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="text-xs text-gray-300">Radar Evasion</span>
          </div>
          <div className="flex items-center gap-2 rounded bg-gray-900/50 p-2">
            <div className={`h-2 w-2 rounded-full ${stealthMode ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="text-xs text-gray-300">IR Suppression</span>
          </div>
          <div className="flex items-center gap-2 rounded bg-gray-900/50 p-2">
            <div className={`h-2 w-2 rounded-full ${stealthMode ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="text-xs text-gray-300">Active Cloaking</span>
          </div>
          <div className="flex items-center gap-2 rounded bg-gray-900/50 p-2">
            <div className={`h-2 w-2 rounded-full ${stealthMode ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="text-xs text-gray-300">Noise Reduction</span>
          </div>
        </div>
      </div>
    </div>
  )
}
