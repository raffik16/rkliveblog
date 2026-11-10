'use client'

import { useRef, useState } from 'react'
import styles from './synth.module.css'

interface Props {
  label: string
  /** 0..1 */
  position: number
  /** The value as text, e.g. "1.1 kHz" */
  display: string
  /** Where a double-click puts it back to */
  resetTo: number
  onChange: (position: number) => void
}

// The dial sweeps 270 degrees, from 7 o'clock round to 5 o'clock
const SWEEP = 270
// Pixels of vertical drag for the full sweep
const TRAVEL = 180
const clamp = (n: number) => Math.min(1, Math.max(0, n))

// A rotary knob. Drag up and down to turn it (hold Shift for fine steps), double-click to
// reset it, or focus it and use the arrow keys. To assistive technology it is a slider.
export default function Knob({ label, position, display, resetTo, onChange }: Props) {
  const [dragging, setDragging] = useState(false)
  const drag = useRef<{ y: number; position: number } | null>(null)

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return
    e.currentTarget.setPointerCapture(e.pointerId)
    e.currentTarget.focus()
    drag.current = { y: e.clientY, position }
    setDragging(true)
  }
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!drag.current) return
    const moved = (drag.current.y - e.clientY) / TRAVEL
    onChange(clamp(drag.current.position + moved * (e.shiftKey ? 0.2 : 1)))
  }
  const onPointerEnd = () => {
    drag.current = null
    setDragging(false)
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    const small = e.shiftKey ? 0.005 : 0.02
    const moves: Record<string, number> = {
      ArrowUp: position + small,
      ArrowRight: position + small,
      ArrowDown: position - small,
      ArrowLeft: position - small,
      PageUp: position + 0.1,
      PageDown: position - 0.1,
      Home: 0,
      End: 1,
    }
    if (!(e.key in moves)) return
    e.preventDefault()
    onChange(clamp(moves[e.key]))
  }

  return (
    <div className={styles.knob}>
      <div
        className={styles.dial}
        role="slider"
        tabIndex={0}
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(position * 100)}
        aria-valuetext={display}
        data-dragging={dragging || undefined}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerEnd}
        onPointerCancel={onPointerEnd}
        onDoubleClick={() => onChange(resetTo)}
        onKeyDown={onKeyDown}
        style={{ '--turn': `${(position - 0.5) * SWEEP}deg` } as React.CSSProperties}
      >
        {/* pathLength makes the arc 100 units long, so the dash offset is simply the value */}
        <svg viewBox="0 0 64 64" aria-hidden="true">
          <path
            className={styles.ringTrack}
            d="M16.4 47.6 A22 22 0 1 1 47.6 47.6"
            pathLength={100}
          />
          <path
            className={styles.ringValue}
            d="M16.4 47.6 A22 22 0 1 1 47.6 47.6"
            pathLength={100}
            style={{ strokeDashoffset: 100 - position * 100 }}
          />
        </svg>
        <span className={styles.cap} aria-hidden="true" />
      </div>
      <span className={styles.knobLabel} aria-hidden="true">
        {label}
      </span>
    </div>
  )
}
