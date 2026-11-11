'use client'

import {
  useCallback,
  useRef,
  useState,
  type FocusEvent,
  type KeyboardEvent,
  type PointerEvent,
  type ReactNode,
} from 'react'
import styles from './used-once.module.css'

// The hover layer the charts share: a tooltip that reads out the mark under the pointer (or
// the one with keyboard focus), and arrow-key movement between the marks of one chart so a
// chart is a single stop in the tab order. Nothing a tooltip says is only in the tooltip:
// the same numbers are printed on the marks or in the ledger.

export interface TipContent {
  title: string
  /** Colour of the mark, shown as a short key beside the title */
  color?: string
  rows: [label: string, value: ReactNode][]
}

interface TipState extends TipContent {
  x: number
  y: number
}

// Half the tooltip's widest size, so it never hangs off the side of its figure
const HALF = 104

export function useTip<T extends HTMLElement>() {
  /** Goes on the element the marks sit in; it must be position: relative */
  const plot = useRef<T>(null)
  const [tip, setTip] = useState<TipState | null>(null)

  const show = useCallback((target: Element, content: TipContent) => {
    const box = plot.current?.getBoundingClientRect()
    if (!box) return
    // A mark's target is bigger than what is painted (a whole row, a whole column). Where it
    // names the painted part with [data-anchor], the tooltip sits on that instead.
    const mark = (target.querySelector('[data-anchor]') ?? target).getBoundingClientRect()
    const x = mark.left + mark.width / 2 - box.left
    setTip({
      ...content,
      x: Math.min(Math.max(x, HALF), Math.max(HALF, box.width - HALF)),
      y: mark.top - box.top,
    })
  }, [])
  const hide = useCallback(() => setTip(null), [])

  /** Spread on a mark */
  const mark = (content: TipContent) => ({
    onPointerEnter: (e: PointerEvent<HTMLElement>) => show(e.currentTarget, content),
    onPointerLeave: hide,
    onFocus: (e: FocusEvent<HTMLElement>) => show(e.currentTarget, content),
    onBlur: hide,
  })

  const node = tip && (
    <div className={styles.tip} style={{ left: tip.x, top: tip.y }} aria-hidden="true">
      <Readout {...tip} />
    </div>
  )

  return { plot, mark, show, hide, tip: node }
}

/** What a tooltip says: the name, then each value with its label after it */
export function Readout({ title, color, rows }: TipContent) {
  return (
    <>
      <span className={styles.tipTitle}>
        {color && <i style={{ background: color }} />}
        {title}
      </span>
      {rows.map(([label, value]) => (
        <span key={label} className={styles.tipRow}>
          <b>{value}</b>
          <span>{label}</span>
        </span>
      ))}
    </>
  )
}

/** One tab stop for a group of marks ([data-mark] elements), arrow keys to move between them */
export function useRoving<T extends HTMLElement>() {
  const group = useRef<T>(null)
  const [at, setAt] = useState(0)

  const onKeyDown = (e: KeyboardEvent<T>) => {
    const marks = Array.from(group.current?.querySelectorAll<HTMLElement>('[data-mark]') ?? [])
    const now = marks.indexOf(document.activeElement as HTMLElement)
    if (now < 0) return
    let next = now
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') next = Math.min(marks.length - 1, now + 1)
    else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') next = Math.max(0, now - 1)
    else if (e.key === 'Home') next = 0
    else if (e.key === 'End') next = marks.length - 1
    else return
    e.preventDefault()
    setAt(next)
    marks[next].focus()
  }

  /** tabIndex for the mark at a position: only the current one is in the tab order */
  const tabIndex = (index: number) => (index === at ? 0 : -1)

  return { group, onKeyDown, tabIndex, setAt }
}
