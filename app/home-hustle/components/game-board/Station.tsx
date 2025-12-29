'use client'

import { useState } from 'react'
import type { Station as StationType, GameItem } from '../../types'
import { STATION_COLORS } from '../../data/stations'
import Item from '../item/Item'

interface StationProps {
  station: StationType
  onPickUpItem: (stationId: string, itemIndex: number) => void
  onDropItem: (stationId: string) => void
  onProcess: (stationId: string) => void
  hasHeldItem: boolean
  heldItem: GameItem | null
  onDragStart?: (item: GameItem, stationId: string, itemIndex: number) => void
  onDragEnd?: () => void
  onDragDrop?: (stationId: string) => void
}

export default function Station({
  station,
  onPickUpItem,
  onDropItem,
  onProcess,
  hasHeldItem,
  heldItem,
  onDragStart,
  onDragEnd,
  onDragDrop,
}: StationProps) {
  const colors = STATION_COLORS[station.type]
  const [isDragOver, setIsDragOver] = useState(false)

  // Check if station can accept held item
  const canAcceptItem = heldItem
    ? station.acceptedCategories.includes(heldItem.category) &&
      station.inputStates.includes(heldItem.state) &&
      station.items.length < station.capacity
    : false

  // Check if a dragged item can be accepted (for visual feedback)
  const canAcceptDrag = (dragItem: GameItem | null) => {
    if (!dragItem) return false
    return (
      station.acceptedCategories.includes(dragItem.category) &&
      station.inputStates.includes(dragItem.state) &&
      station.items.length < station.capacity
    )
  }

  const handleClick = () => {
    if (hasHeldItem && canAcceptItem) {
      onDropItem(station.id)
    } else if (!hasHeldItem && station.items.length > 0 && !station.isProcessing) {
      onPickUpItem(station.id, 0)
    }
  }

  const handleProcess = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (station.processTime > 0 && station.items.length > 0 && !station.isProcessing) {
      onProcess(station.id)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleClick()
    }
  }

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    if (onDragDrop && canAcceptItem) {
      onDragDrop(station.id)
    }
  }

  // Touch drop handler for mobile
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (hasHeldItem && canAcceptItem) {
      e.preventDefault()
      onDropItem(station.id)
    }
  }

  const showDropIndicator = (isDragOver && canAcceptItem) || (hasHeldItem && canAcceptItem)

  return (
    <div
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onTouchEnd={hasHeldItem ? handleTouchEnd : undefined}
      role="button"
      tabIndex={0}
      className={`relative h-full min-h-[140px] w-full rounded-xl border-2 ${colors.border} ${colors.bg} flex flex-col p-3 ${showDropIndicator ? 'ring-opacity-75 scale-105 ring-2 ring-green-400' : ''} ${hasHeldItem && !canAcceptItem ? 'opacity-50' : ''} ${!hasHeldItem && station.items.length > 0 ? 'cursor-pointer hover:brightness-110' : ''} ${showDropIndicator ? 'cursor-pointer border-green-400 hover:brightness-110' : ''} backdrop-blur-sm transition-all duration-200`}
    >
      {/* Station Header */}
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{station.emoji}</span>
          <span className={`text-sm font-bold ${colors.text}`}>{station.name}</span>
        </div>
        <span className="text-xs text-gray-400">
          {station.items.length}/{station.capacity}
        </span>
      </div>

      {/* Processing Bar */}
      {station.isProcessing && (
        <div className="mb-2">
          <div className="h-2 overflow-hidden rounded-full bg-gray-700">
            <div
              className="h-full bg-gradient-to-r from-cyan-400 to-purple-500 transition-all duration-200"
              style={{ width: `${station.processingProgress}%` }}
            />
          </div>
          <p className="mt-1 animate-pulse text-center text-xs text-cyan-300">Processing...</p>
        </div>
      )}

      {/* Items Grid */}
      <div className="flex flex-1 flex-wrap content-start gap-1">
        {station.items.map((item, index) => (
          <Item
            key={item.id}
            item={item}
            size="sm"
            showState={false}
            isDraggable={!hasHeldItem && !station.isProcessing}
            onDragStart={(draggedItem) => {
              if (onDragStart) {
                onDragStart(draggedItem, station.id, index)
              }
            }}
            onDragEnd={onDragEnd}
            onClick={() => {
              if (!hasHeldItem && !station.isProcessing) {
                onPickUpItem(station.id, index)
              }
            }}
          />
        ))}
      </div>

      {/* Process Button */}
      {station.processTime > 0 && station.items.length > 0 && !station.isProcessing && (
        <button
          onClick={handleProcess}
          className="mt-2 w-full rounded-lg bg-gradient-to-r from-cyan-600 to-purple-600 px-3 py-1.5 text-sm font-bold text-white shadow-lg shadow-purple-500/20 transition-all duration-200 hover:from-cyan-500 hover:to-purple-500"
        >
          Start ({station.processTime}s)
        </button>
      )}

      {/* Empty State */}
      {station.items.length === 0 && !station.isProcessing && (
        <div className="flex flex-1 items-center justify-center">
          <p className="text-center text-xs text-gray-500">
            {hasHeldItem && canAcceptItem ? 'Click to drop item' : 'Empty'}
          </p>
        </div>
      )}

      {/* Capacity Warning */}
      {station.items.length >= station.capacity && (
        <div className="absolute top-1 right-1">
          <span className="rounded-full bg-red-600 px-1.5 py-0.5 text-xs text-white">FULL</span>
        </div>
      )}
    </div>
  )
}
