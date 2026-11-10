'use client'

import { memo, useRef, useState } from 'react'
import { toPosition, type KnobDef } from './params'
import styles from './synth.module.css'

interface Props {
  def: KnobDef
  value: number
  /** Called with the knob's new position, 0..1 */
  onTurn: (def: KnobDef, position: number) => void
  /** Two quick presses: put it back to where it started */
  onReset: (def: KnobDef) => void
}

// The dial sweeps 270 degrees, from 7 o'clock round to 5 o'clock
const SWEEP = 270
// Pixels of vertical drag for the full sweep
const TRAVEL = 180
// Two presses closer together than this reset the knob
const DOUBLE_PRESS_MS = 320
const clamp = (n: number) => Math.min(1, Math.max(0, n))

// A rotary knob. Drag up and down to turn it (hold Shift for fine steps), press it twice
// quickly to reset it, or focus it and use the arrow keys. To assistive technology it is a
// slider. Memoised: dragging one knob re-renders that knob, not the other fifteen.
function Knob({ def, value, onTurn, onReset }: Props) {
  // Rounded, because the server and the browser can disagree about the last digit of a cube
  // root, and React compares the angle the server drew with the one the browser works out
  const position = Math.round(toPosition(def, value) * 1e4) / 1e4
  const display = def.format(value)
  const [dragging, setDragging] = useState(false)
  const drag = useRef<{ y: number; position: number } | null>(null)
  const lastPress = useRef(-Infinity)

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return
    e.currentTarget.setPointerCapture(e.pointerId)
    e.currentTarget.focus({ preventScroll: true })

    // Timed by hand rather than with dblclick, which touch screens do not reliably send
    if (e.timeStamp - lastPress.current < DOUBLE_PRESS_MS) {
      lastPress.current = -Infinity
      onReset(def)
      return
    }
    lastPress.current = e.timeStamp
    drag.current = { y: e.clientY, position }
    setDragging(true)
  }
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!drag.current) return
    const pixels = drag.current.y - e.clientY
    // A press that turned the knob is not half of a double press: grabbing it again straight
    // after an adjustment must not reset it
    if (Math.abs(pixels) > 3) lastPress.current = -Infinity
    onTurn(def, clamp(drag.current.position + (pixels / TRAVEL) * (e.shiftKey ? 0.2 : 1)))
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
    onTurn(def, clamp(moves[e.key]))
  }

  return (
    <div className={styles.knob}>
      <div
        className={styles.dial}
        role="slider"
        tabIndex={0}
        aria-label={def.name}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(position * 100)}
        aria-valuetext={display}
        data-dragging={dragging || undefined}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerEnd}
        onPointerCancel={onPointerEnd}
        onLostPointerCapture={onPointerEnd}
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
        {def.label}
      </span>
    </div>
  )
}

export default memo(Knob)
