'use client'

import { useState } from 'react'
import { biologicalEffectsData } from '../../data/biologicalEffects'
import { BiologicalEffect } from '../../types'

export default function BiologicalEffects() {
  const [selectedEffect, setSelectedEffect] = useState<BiologicalEffect>(biologicalEffectsData[0])
  const [showWarning, setShowWarning] = useState(true)

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low':
        return 'text-green-400 bg-green-950 border-green-900'
      case 'medium':
        return 'text-yellow-400 bg-yellow-950 border-yellow-900'
      case 'high':
        return 'text-orange-400 bg-orange-950 border-orange-900'
      case 'critical':
        return 'text-red-400 bg-red-950 border-red-900'
      default:
        return 'text-gray-400 bg-gray-950 border-gray-900'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'bleeding':
        return '🩸'
      case 'scarring':
        return '🔥'
      case 'radiation':
        return '☢️'
      case 'neurological':
        return '🧠'
      default:
        return '⚠️'
    }
  }

  return (
    <div className="w-full space-y-6 rounded-xl border border-gray-700 bg-gradient-to-br from-gray-900 to-black p-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold text-red-400">Biological Effects Analysis</h2>
          <p className="mt-1 text-sm text-gray-400">
            Documented effects on humans near high-energy fields
          </p>
        </div>
        {showWarning && (
          <button
            onClick={() => setShowWarning(false)}
            className="rounded-lg bg-red-950/50 px-3 py-1 text-xs text-red-400 transition hover:bg-red-950"
          >
            Dismiss Warning
          </button>
        )}
      </div>

      {/* Warning Banner */}
      {showWarning && (
        <div className="animate-pulse rounded-lg border-2 border-red-600 bg-red-950/30 p-4">
          <div className="flex items-start gap-3">
            <div className="text-3xl">⚠️</div>
            <div>
              <div className="font-bold text-red-400">DANGER: HIGH ELECTROMAGNETIC FIELDS</div>
              <div className="mt-1 text-sm text-red-300">
                Proximity to craft can cause severe biological damage. Maintain safe distance of at
                least 100 meters from active propulsion systems.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Effects Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {biologicalEffectsData.map((effect) => (
          <button
            key={effect.id}
            onClick={() => setSelectedEffect(effect)}
            className={`rounded-lg border p-4 text-left transition ${
              selectedEffect.id === effect.id
                ? 'border-cyan-500 bg-cyan-950/30 shadow-lg shadow-cyan-500/20'
                : 'border-gray-700 bg-gray-900/50 hover:border-gray-600'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="text-2xl">{getTypeIcon(effect.type)}</div>
              <div
                className={`rounded-full border px-2 py-0.5 text-xs font-semibold uppercase ${getSeverityColor(effect.severity)}`}
              >
                {effect.severity}
              </div>
            </div>
            <div className="mt-2 text-sm font-semibold text-gray-300">{effect.id}</div>
            <div className="mt-1 text-xs text-gray-400 capitalize">{effect.type} Effects</div>
            <div className="mt-2 text-xs text-gray-500">{effect.distance}m from source</div>
          </button>
        ))}
      </div>

      {/* Detailed View */}
      <div className="rounded-xl border-2 border-cyan-900 bg-cyan-950/20 p-6">
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h3 className="text-xl font-bold text-cyan-400">
              {getTypeIcon(selectedEffect.type)} {selectedEffect.id} - Detailed Analysis
            </h3>
            <div className="mt-1 text-sm text-gray-400 capitalize">{selectedEffect.type}</div>
          </div>
          <div
            className={`rounded-lg border px-4 py-2 text-sm font-bold uppercase ${getSeverityColor(selectedEffect.severity)}`}
          >
            {selectedEffect.severity} SEVERITY
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="mb-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg bg-black/50 p-3">
            <div className="text-xs text-gray-500">Affected Location</div>
            <div className="mt-1 font-semibold text-white">{selectedEffect.location}</div>
          </div>
          <div className="rounded-lg bg-black/50 p-3">
            <div className="text-xs text-gray-500">Distance from Craft</div>
            <div className="mt-1 font-mono text-xl font-bold text-orange-400">
              {selectedEffect.distance}m
            </div>
          </div>
          <div className="rounded-lg bg-black/50 p-3">
            <div className="text-xs text-gray-500">Electrical Field</div>
            <div className="mt-1 font-mono text-xl font-bold text-purple-400">
              {selectedEffect.electricalFieldStrength.toLocaleString()} V/m
            </div>
          </div>
          <div className="rounded-lg bg-black/50 p-3">
            <div className="text-xs text-gray-500">Exposure Duration</div>
            <div className="mt-1 font-mono text-xl font-bold text-yellow-400">
              {selectedEffect.duration}s
            </div>
          </div>
        </div>

        {/* Symptoms */}
        <div>
          <div className="mb-3 text-sm font-semibold text-gray-400">Documented Symptoms:</div>
          <div className="grid gap-2 md:grid-cols-2">
            {selectedEffect.symptoms.map((symptom, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2 rounded-lg border border-gray-800 bg-black/30 p-3"
              >
                <div className="mt-0.5 text-red-400">●</div>
                <div className="text-sm text-gray-300">{symptom}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Danger Zones Visualization */}
        <div className="mt-6 rounded-lg border border-gray-800 bg-black/50 p-4">
          <div className="mb-3 text-sm font-semibold text-gray-400">Danger Zone Visualization</div>
          <div className="relative h-32">
            {/* Safe zone */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-full w-full rounded-lg bg-gradient-to-r from-green-950/30 to-transparent">
                <div className="p-2 text-xs text-green-400">SAFE ZONE (&gt;100m)</div>
              </div>
            </div>
            {/* Warning zone */}
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{ width: '60%' }}
            >
              <div className="h-full w-full rounded-lg bg-gradient-to-r from-yellow-950/50 to-transparent">
                <div className="p-2 text-xs text-yellow-400">CAUTION (20-100m)</div>
              </div>
            </div>
            {/* Danger zone */}
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{ width: '30%' }}
            >
              <div className="h-full w-full rounded-lg bg-gradient-to-r from-red-950/70 to-transparent">
                <div className="p-2 text-xs text-red-400">DANGER (&lt;20m)</div>
              </div>
            </div>
            {/* Craft position */}
            <div className="absolute top-1/2 left-0 flex -translate-y-1/2 items-center gap-2">
              <div className="h-8 w-8 animate-pulse rounded-full bg-cyan-500 shadow-lg shadow-cyan-500/50" />
              <div className="text-xs font-semibold text-cyan-400">CRAFT</div>
            </div>
            {/* Current effect marker */}
            <div
              className="absolute top-1/2 -translate-y-1/2"
              style={{ left: `${(selectedEffect.distance / 100) * 100}%` }}
            >
              <div className="flex flex-col items-center">
                <div className="h-16 w-0.5 bg-white" />
                <div className="mt-1 rounded bg-white px-2 py-1 text-xs font-bold whitespace-nowrap text-black">
                  {selectedEffect.distance}m
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Data Source Note */}
        <div className="mt-4 rounded-lg border border-gray-800 bg-black/30 p-3">
          <div className="text-xs text-gray-500">
            📊 <span className="font-semibold">Data Source:</span> Based on documented UAP
            encounters near electrical infrastructure and high-voltage power lines. Effects
            particularly pronounced near electrical poles and transmission stations.
          </div>
        </div>
      </div>

      {/* Safety Recommendations */}
      <div className="rounded-lg border border-yellow-900 bg-yellow-950/20 p-4">
        <h4 className="mb-3 font-semibold text-yellow-400">Safety Recommendations</h4>
        <ul className="space-y-2 text-sm text-yellow-200">
          <li className="flex gap-2">
            <span>⚠️</span>
            <span>Maintain minimum 100m distance from craft during propulsion activation</span>
          </li>
          <li className="flex gap-2">
            <span>⚠️</span>
            <span>Avoid proximity to electrical poles when craft is nearby</span>
          </li>
          <li className="flex gap-2">
            <span>⚠️</span>
            <span>
              Individuals with pacemakers or electronic implants should evacuate immediately
            </span>
          </li>
          <li className="flex gap-2">
            <span>⚠️</span>
            <span>Use EMF shielding equipment when working near active craft systems</span>
          </li>
        </ul>
      </div>
    </div>
  )
}
