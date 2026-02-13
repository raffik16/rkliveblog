'use client'

import type { Order } from '../../types'
import { PRIORITY_COLORS, PRIORITY_LABELS } from '../../data/orders'
import { STATE_LABELS } from '../../data/items'

interface OrderQueueProps {
  orders: Order[]
  onCompleteOrder?: (orderId: string) => void
}

export default function OrderQueue({ orders, onCompleteOrder }: OrderQueueProps) {
  if (orders.length === 0) {
    return (
      <div className="rounded-xl border border-gray-700 bg-gray-900/80 p-4">
        <h3 className="mb-2 text-lg font-bold text-gray-400">Orders</h3>
        <p className="text-sm text-gray-500">No active orders</p>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-gray-700 bg-gray-900/80 p-4">
      <h3 className="mb-3 text-lg font-bold text-white">
        Orders <span className="text-sm text-gray-400">({orders.length})</span>
      </h3>
      <div className="max-h-[400px] space-y-3 overflow-y-auto">
        {orders.map((order) => (
          <OrderCard key={order.id} order={order} onComplete={onCompleteOrder} />
        ))}
      </div>
    </div>
  )
}

interface OrderCardProps {
  order: Order
  onComplete?: (orderId: string) => void
}

function OrderCard({ order, onComplete }: OrderCardProps) {
  const colors = PRIORITY_COLORS[order.priority]
  const timePercent = (order.timeRemaining / order.timeLimit) * 100
  const isLowTime = timePercent < 25

  return (
    <div
      className={`rounded-lg border ${colors.border} ${colors.bg} p-3 transition-all duration-200 ${isLowTime ? 'animate-pulse' : ''} `}
    >
      {/* Header */}
      <div className="mb-2 flex items-center justify-between">
        <span className={`text-xs font-bold ${colors.text}`}>
          {PRIORITY_LABELS[order.priority]}
        </span>
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-yellow-400">+{order.points}pts</span>
          {order.tipBonus > 0 && (
            <span className="text-xs text-green-400">(+{order.tipBonus} tip)</span>
          )}
        </div>
      </div>

      {/* Time Bar */}
      <div className="mb-2 h-1.5 overflow-hidden rounded-full bg-gray-700">
        <div
          className={`h-full transition-all duration-1000 ${
            isLowTime ? 'bg-red-500' : timePercent < 50 ? 'bg-yellow-500' : 'bg-green-500'
          }`}
          style={{ width: `${timePercent}%` }}
        />
      </div>

      {/* Requirements */}
      <div className="space-y-1">
        {order.requirements.map((req, idx) => (
          <div key={idx} className="flex items-center gap-2 text-sm">
            <span className="text-gray-300">
              {req.quantity}x {req.type || req.category}
            </span>
            <span className="text-xs text-cyan-400">({STATE_LABELS[req.state]})</span>
            {req.color && (
              <span
                className={`h-3 w-3 rounded-full border border-white/30`}
                style={{ backgroundColor: req.color }}
              />
            )}
          </div>
        ))}
      </div>

      {/* Timer */}
      <div className="mt-2 flex items-center justify-between">
        <span className={`text-xs ${isLowTime ? 'text-red-400' : 'text-gray-400'}`}>
          {Math.floor(order.timeRemaining / 60)}:
          {(order.timeRemaining % 60).toString().padStart(2, '0')}
        </span>
        {onComplete && (
          <button
            onClick={() => onComplete(order.id)}
            className="rounded bg-green-600 px-2 py-1 text-xs text-white transition-colors hover:bg-green-500"
          >
            Complete
          </button>
        )}
      </div>
    </div>
  )
}
