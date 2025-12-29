'use client'

import type { Station as StationType, GameItem, Order, Level } from '../../types'
import Station from './Station'
import OrderQueue from '../order-queue/OrderQueue'
import Timer from '../timer/Timer'
import Score from '../score/Score'
import { HeldItemDisplay } from '../item/Item'

interface GameBoardProps {
  stations: StationType[]
  orders: Order[]
  level: Level
  score: number
  timeRemaining: number
  comboMultiplier: number
  consecutiveCompletions: number
  heldItem: GameItem | null
  onPickUpItem: (stationId: string, itemIndex: number) => void
  onDropItem: (stationId: string) => void
  onProcessStation: (stationId: string) => void
  onCompleteOrder: (orderId: string) => void
  onPause: () => void
  onSpawnItems: () => void
}

export default function GameBoard({
  stations,
  orders,
  level,
  score,
  timeRemaining,
  comboMultiplier,
  consecutiveCompletions,
  heldItem,
  onPickUpItem,
  onDropItem,
  onProcessStation,
  onCompleteOrder,
  onPause,
  onSpawnItems,
}: GameBoardProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 p-4">
      {/* Header */}
      <div className="mx-auto mb-4 max-w-7xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">{level.name}</h1>
            <p className="text-sm text-gray-400">{level.description}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onSpawnItems}
              className="rounded-lg bg-green-600 px-4 py-2 font-medium text-white transition-colors hover:bg-green-500"
            >
              + Add Items
            </button>
            <button
              onClick={onPause}
              className="rounded-lg bg-gray-700 px-4 py-2 font-medium text-white transition-colors hover:bg-gray-600"
            >
              Pause
            </button>
          </div>
        </div>
      </div>

      {/* Main Game Area */}
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-4 lg:grid-cols-4">
        {/* Left Sidebar - Stats */}
        <div className="space-y-4 lg:col-span-1">
          <Timer timeRemaining={timeRemaining} totalTime={level.timeLimit} />
          <Score
            score={score}
            targetScore={level.targetScore}
            threeStarScore={level.threeStarScore}
            comboMultiplier={comboMultiplier}
            consecutiveCompletions={consecutiveCompletions}
          />
        </div>

        {/* Center - Station Grid */}
        <div className="lg:col-span-2">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {stations.map((station) => (
              <Station
                key={station.id}
                station={station}
                onPickUpItem={onPickUpItem}
                onDropItem={onDropItem}
                onProcess={onProcessStation}
                hasHeldItem={heldItem !== null}
                heldItem={heldItem}
              />
            ))}
          </div>

          {/* Instructions */}
          <div className="mt-4 rounded-xl border border-gray-700 bg-gray-800/50 p-4">
            <h3 className="mb-2 text-sm font-bold text-gray-300">How to Play</h3>
            <ul className="space-y-1 text-xs text-gray-400">
              <li>1. Click a station to pick up an item</li>
              <li>2. Click another station to drop the item</li>
              <li>3. Click "Start" on stations to process items</li>
              <li>4. Complete orders before time runs out!</li>
              <li>5. Chain completions for combo bonuses!</li>
            </ul>
          </div>
        </div>

        {/* Right Sidebar - Orders */}
        <div className="lg:col-span-1">
          <OrderQueue orders={orders} onCompleteOrder={onCompleteOrder} />
        </div>
      </div>

      {/* Held Item Display */}
      {heldItem && <HeldItemDisplay item={heldItem} />}
    </div>
  )
}
