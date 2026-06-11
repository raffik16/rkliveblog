'use client'

import { useState, useCallback } from 'react'
import Example1 from './examples/Example1'
import Example2 from './examples/Example2'
import Example3 from './examples/Example3'

type ExampleId = 1 | 2 | 3

const EXAMPLES: { id: ExampleId; title: string; blurb: string }[] = [
  {
    id: 1,
    title: 'Example 1 — Baseline dock',
    blurb: 'Spring-in logo, slide-in title, then the whole composition docks into the header.',
  },
  {
    id: 2,
    title: 'Example 2 — Slanted clip reveal',
    blurb:
      'Each letter and the logo reveal through a slanted parallelogram clip-path, then dock into the header.',
  },
  {
    id: 3,
    title: 'Example 3 — Ink stamp (white / black)',
    blurb: 'White overlay, black logo. Parallelograms stamp in with a ripple; letters drop in.',
  },
]

export default function LogoIntroShowcase() {
  const [selected, setSelected] = useState<ExampleId>(1)
  const [playId, setPlayId] = useState(0)
  const [playing, setPlaying] = useState(false)

  const play = useCallback(() => {
    setPlayId((n) => n + 1)
    setPlaying(true)
  }, [])

  const handleDone = useCallback(() => {
    setPlaying(false)
  }, [])

  const current = EXAMPLES.find((e) => e.id === selected)!

  return (
    <div className="space-y-6">
      <div
        role="tablist"
        aria-label="Logo intro examples"
        className="flex flex-wrap gap-2 rounded-xl border border-gray-200 bg-white/60 p-2 backdrop-blur-md dark:border-gray-700 dark:bg-gray-800/60"
      >
        {EXAMPLES.map((e) => (
          <button
            key={e.id}
            role="tab"
            aria-selected={selected === e.id}
            onClick={() => setSelected(e.id)}
            disabled={playing}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50 ${
              selected === e.id
                ? 'bg-primary-500 text-white shadow-sm'
                : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700/50'
            }`}
          >
            {e.title}
          </button>
        ))}
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white/60 p-6 backdrop-blur-md dark:border-gray-700 dark:bg-gray-800/60">
        <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">{current.blurb}</p>
        <button
          onClick={play}
          disabled={playing}
          className="bg-primary-500 hover:bg-primary-600 rounded-lg px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition disabled:cursor-not-allowed disabled:opacity-60"
        >
          {playing ? 'Playing…' : 'Play animation'}
        </button>
      </div>

      {playing && selected === 1 && <Example1 playId={playId} onDone={handleDone} />}
      {playing && selected === 2 && <Example2 playId={playId} onDone={handleDone} />}
      {playing && selected === 3 && <Example3 playId={playId} onDone={handleDone} />}
    </div>
  )
}
