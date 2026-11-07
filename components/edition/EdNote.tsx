import { ReactNode } from 'react'

interface Props {
  index?: number | string
  label?: string
  /** Optional bar sparkline (any scale) */
  bars?: number[]
  children: ReactNode
}

// Margin note for the right-hand notes column: "[1] text" (raffi.website's EdNote.vue).
export default function EdNote({ index = 1, label = 'Notes', bars, children }: Props) {
  const max = Math.max(...(bars || [1]), 1)
  return (
    <aside className="ed-note" data-reveal="">
      <span className="ed-note__label">{label}</span>
      <div className="ed-note__text">
        <span className="ed-note__index">[{index}]</span> {children}
      </div>
      {bars?.length ? (
        <svg
          className="ed-note__bars"
          viewBox={`0 0 ${bars.length * 6} 32`}
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          {bars.map((v, i) => (
            <rect key={i} x={i * 6} y={32 - (v / max) * 32} width="3" height={(v / max) * 32} />
          ))}
        </svg>
      ) : null}
    </aside>
  )
}
