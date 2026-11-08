'use client'

import { FormEvent, useId, useState } from 'react'
import { useRouter } from 'next/navigation'
import { cx } from '@/lib/edition/cx'

// Kept in step with titleFrom() and tempoFrom() in app/chaos/hotdog/scene/set.js (not imported
// from there, so the Lab doesn't pull the set's three.js code into its bundle).
const MIN_BPM = 60
const MAX_BPM = 200
const DEFAULT_BPM = 124
const TITLE_MAX = 40

interface Props {
  /** The demo's route, e.g. /chaos/hotdog */
  href: string
  /** The demo's name, for screen readers on the submit button */
  name: string
  variant?: 'dark' | 'light'
  size?: 'md' | 'lg'
}

/** The link to open: only the settings that are filled in and in range. */
function linkFor(href: string, title: string, bpm: string) {
  const q = new URLSearchParams()
  const tempo = Number(bpm)
  if (bpm.trim() && Number.isFinite(tempo) && tempo >= MIN_BPM && tempo <= MAX_BPM)
    q.set('bpm', String(tempo))
  const name = title.trim().replace(/\s+/g, ' ').slice(0, TITLE_MAX)
  if (name) q.set('title', name)
  const search = q.toString()
  return search ? `${href}?${search}` : href
}

// "Open demo" for Roller Grill Sessions, with the two settings a DJ may want: the party name on the
// record's label (?title=) and the tempo (?bpm=). A plain GET form, so it works before JS loads;
// with JS it opens a clean link (empty fields left out) and shows that link as you type, so it can
// be saved for the night.
export default function SetLauncher({ href, name, variant = 'dark', size = 'md' }: Props) {
  const router = useRouter()
  const id = useId()
  const [title, setTitle] = useState('')
  const [bpm, setBpm] = useState('')
  const link = linkFor(href, title, bpm)

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    router.push(link)
  }

  return (
    <form className="ed-set" action={href} method="get" onSubmit={onSubmit}>
      <div className="ed-set__fields">
        <div className="ed-set__field ed-set__field--title">
          <label htmlFor={`${id}-title`} className="ed-set__label">
            Party name
          </label>
          <input
            id={`${id}-title`}
            name="title"
            type="text"
            className="ed-set__input ed-set__input--title"
            placeholder="Name your party"
            maxLength={TITLE_MAX}
            autoComplete="off"
            autoCapitalize="words"
            spellCheck={false}
            enterKeyHint="go"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="ed-set__field ed-set__field--bpm">
          <label htmlFor={`${id}-bpm`} className="ed-set__label">
            BPM
          </label>
          <input
            id={`${id}-bpm`}
            name="bpm"
            type="number"
            inputMode="decimal"
            className="ed-set__input ed-set__input--bpm"
            placeholder={String(DEFAULT_BPM)}
            min={MIN_BPM}
            max={MAX_BPM}
            step="any"
            autoComplete="off"
            enterKeyHint="go"
            aria-describedby={`${id}-bpm-hint`}
            value={bpm}
            onChange={(e) => setBpm(e.target.value)}
          />
        </div>
      </div>
      <div className="ed-set__go">
        <button
          type="submit"
          className={cx('ed-pill', `ed-pill--${variant}`, size === 'lg' && 'ed-pill--lg')}
        >
          Open demo<span className="sr-only">: {name}</span>
          <span className="ed-pill__arrow" aria-hidden="true">
            →
          </span>
        </button>
        <p id={`${id}-bpm-hint`} className="ed-set__hint">
          BPM {MIN_BPM}–{MAX_BPM}. Leave blank for {DEFAULT_BPM}.
        </p>
      </div>
      <p className="ed-set__link">
        <span className="ed-set__label">Link</span>
        <code>{link}</code>
      </p>
    </form>
  )
}
