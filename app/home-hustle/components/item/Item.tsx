'use client'

import type { GameItem } from '../../types'
import { COLOR_BORDER_CLASSES, STATE_LABELS, STATE_COLORS } from '../../data/items'

interface ItemProps {
  item: GameItem
  onClick?: () => void
  onDragStart?: (item: GameItem) => void
  onDragEnd?: () => void
  size?: 'sm' | 'md' | 'lg'
  showState?: boolean
  isHeld?: boolean
  isDraggable?: boolean
  className?: string
}

const sizeClasses = {
  sm: 'w-10 h-10 text-lg',
  md: 'w-14 h-14 text-2xl',
  lg: 'w-20 h-20 text-4xl',
}

export default function Item({
  item,
  onClick,
  onDragStart,
  onDragEnd,
  size = 'md',
  showState = true,
  isHeld = false,
  isDraggable = false,
  className = '',
}: ItemProps) {
  const borderColor = COLOR_BORDER_CLASSES[item.color]

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (onClick && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault()
      onClick()
    }
  }

  const handleDragStart = (e: React.DragEvent) => {
    if (!isDraggable) return
    e.dataTransfer.setData('application/json', JSON.stringify(item))
    e.dataTransfer.effectAllowed = 'move'
    onDragStart?.(item)
  }

  const handleDragEnd = () => {
    onDragEnd?.()
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!isDraggable || !onDragStart) return
    // For mobile: trigger pick up on touch
    onDragStart(item)
  }

  return (
    <div
      onClick={onClick}
      onKeyDown={onClick ? handleKeyDown : undefined}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      draggable={isDraggable}
      onDragStart={isDraggable ? handleDragStart : undefined}
      onDragEnd={isDraggable ? handleDragEnd : undefined}
      onTouchStart={isDraggable ? handleTouchStart : undefined}
      className={` ${sizeClasses[size]} flex flex-col items-center justify-center rounded-lg border-2 ${borderColor} bg-gray-800/80 backdrop-blur-sm ${onClick || isDraggable ? 'cursor-pointer hover:scale-110 hover:bg-gray-700/80' : ''} ${isHeld ? 'animate-bounce ring-2 ring-yellow-400' : ''} ${isDraggable ? 'cursor-grab touch-none active:cursor-grabbing' : ''} transition-all duration-150 ${className} `}
    >
      <span className="select-none">{item.emoji}</span>
      {showState && size !== 'sm' && (
        <span className={`text-[8px] font-bold ${STATE_COLORS[item.state]} mt-0.5`}>
          {STATE_LABELS[item.state]}
        </span>
      )}
    </div>
  )
}

interface HeldItemDisplayProps {
  item: GameItem
}

export function HeldItemDisplay({ item }: HeldItemDisplayProps) {
  return (
    <div className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2">
      <div className="rounded-xl border-2 border-yellow-400 bg-gray-900/95 p-4 shadow-lg shadow-yellow-400/20">
        <div className="flex items-center gap-3">
          <Item item={item} size="lg" showState={false} isHeld />
          <div>
            <p className="font-bold text-white">{item.name}</p>
            <p className={`text-sm ${STATE_COLORS[item.state]}`}>{STATE_LABELS[item.state]}</p>
            <p className="mt-1 text-xs text-gray-400">Click a station to drop</p>
          </div>
        </div>
      </div>
    </div>
  )
}
