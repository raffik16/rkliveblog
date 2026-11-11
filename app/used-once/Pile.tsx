'use client'

import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent,
} from 'react'
import { cx } from '@/lib/edition/cx'
import { LIFE_RANGE, LIFE_YEARS, MATERIALS, PERSON_HEIGHT, type Item, type ItemId } from './data'
import { fromHabit, pileHeight, tally, toHabit, trim } from './model'
import { blockTop, drawPile, layoutPile, Sprites, type PileLabels } from './pile'
import { height, int, mass, volume } from './units'
import { Figure, Q, UnitsToggle, useUsedOnce } from './context'
import { Readout } from './marks'
import styles from './used-once.module.css'

// Fig. 01: the pile at a chosen age, with the controls that change it. Dragging the age (or
// pressing play) grows the stacks from birth; the sliders under each item set how fast.

/** How long a whole life takes to play, in milliseconds */
const PLAY_MS = 7000
// One row of four stacks where there is room; paper over plastic on a phone, so each stack is
// still big enough to see what it is made of.
const ONE_ROW: ItemId[][] = [['toiletPaper', 'paperTowels', 'bottles', 'cups']]
const TWO_ROWS: ItemId[][] = [
  ['toiletPaper', 'paperTowels'],
  ['bottles', 'cups'],
]
// Keep in step with the container query on .stage in used-once.module.css
const NARROW = 560

const countsOf = (rows: { item: Item; count: number }[]) =>
  Object.fromEntries(rows.map((row) => [row.item.id, row.count])) as Record<ItemId, number>

const things = (item: Item, count: number) =>
  `${int(count)} ${count === 1 ? item.unit.one : item.unit.many}`

export default function Pile() {
  const { habits, life, footprint, average, units, setRate, setYears, reset } = useUsedOnce()
  const { years } = habits

  const [age, setAge] = useState(years)
  const [playing, setPlaying] = useState(false)
  const [active, setActive] = useState<ItemId | null>(null)
  const [pointed, setPointed] = useState<{ id: ItemId; x: number; y: number } | null>(null)
  const [size, setSize] = useState<{ w: number; h: number } | null>(null)
  // Bumped when the canvas has to be drawn again for a reason React cannot see: the label
  // font arriving, or the window moving to a screen with a different pixel density.
  const [fresh, setFresh] = useState(0)
  /** False until it is known whether the pile opens whole or empty: nothing is drawn before */
  const [ready, setReady] = useState(false)

  const stageRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const sprites = useRef<Sprites | null>(null)
  const ageRef = useRef(age)
  const lastYears = useRef(years)
  /** Set once the visitor has moved the age themselves: the opening play then leaves it alone */
  const touched = useRef(false)
  ageRef.current = age

  const now = useMemo(() => tally(habits, age), [habits, age])
  const counts = useMemo(() => countsOf(now.rows), [now])
  const full = useMemo(() => countsOf(life.rows), [life])

  const narrow = size ? size.w < NARROW : false
  const layout = useMemo(
    () => (size ? layoutPile(size.w, size.h, narrow ? TWO_ROWS : ONE_ROW, full, footprint) : null),
    [size, narrow, full, footprint]
  )

  // ------------------------------------------------------------ size
  useLayoutEffect(() => {
    const stage = stageRef.current
    if (!stage) return
    const measure = () => {
      const w = stage.clientWidth
      const h = stage.clientHeight
      setSize((was) => (was && was.w === w && was.h === h ? was : { w, h }))
    }
    measure()
    const watch = new ResizeObserver(measure)
    watch.observe(stage)
    // A change of pixel density (zoom, another monitor) needs a redraw at the same size
    const redraw = () => setFresh((n) => n + 1)
    window.addEventListener('resize', redraw)
    document.fonts?.ready.then(redraw).catch(() => {})
    return () => {
      watch.disconnect()
      window.removeEventListener('resize', redraw)
    }
  }, [])

  // ------------------------------------------------------- the opening
  // The numbers above the drawing are the page's headline, so they open on the whole life. The
  // first time the drawing itself scrolls into view it empties and grows from birth, once.
  // With reduced motion it is simply shown whole.
  useLayoutEffect(() => {
    const stage = stageRef.current
    if (
      !stage ||
      !('IntersectionObserver' in window) ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      setReady(true)
      return
    }
    const watch = new IntersectionObserver(
      (entries) => {
        // The first report comes straight away. Drawing waits for it, so a pile already in
        // view starts empty instead of showing whole for a frame.
        if (entries.some((entry) => entry.intersectionRatio >= 0.39)) {
          watch.disconnect()
          if (!touched.current) {
            setAge(0)
            setPlaying(true)
          }
        }
        setReady(true)
      },
      { threshold: [0, 0.4] }
    )
    watch.observe(stage)
    return () => watch.disconnect()
  }, [])

  // ------------------------------------------------------------ play
  useEffect(() => {
    if (!playing) return
    const from = ageRef.current >= years ? 0 : ageRef.current
    const span = years - from
    const duration = Math.max(1, PLAY_MS * (span / years))
    let frame = 0
    let start = 0
    const tick = (time: number) => {
      if (!start) start = time
      const done = Math.min(1, (time - start) / duration)
      setAge(from + span * done)
      if (done < 1) frame = requestAnimationFrame(tick)
      else setPlaying(false)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [playing, years])

  // A longer or shorter life: an age at the end of the old one stays at the end of the new
  useEffect(() => {
    const before = lastYears.current
    if (before === years) return
    lastYears.current = years
    setAge((was) => (was >= before ? years : Math.min(was, years)))
  }, [years])

  // ------------------------------------------------------------ draw
  const labels = useMemo(
    () =>
      Object.fromEntries(
        now.rows.map((row) => [
          row.item.id,
          {
            name: row.item.name,
            count: things(row.item, row.count),
            height: height(pileHeight(row.item, row.count, footprint))[units],
          },
        ])
      ) as Record<ItemId, PileLabels>,
    [now, units, footprint]
  )

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !layout || !ready) return
    const dpr = Math.min(2, window.devicePixelRatio || 1)
    const w = Math.round(layout.width * dpr)
    const h = Math.round(layout.height * dpr)
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w
      canvas.height = h
    }
    const g = canvas.getContext('2d')
    if (!g) return
    sprites.current ??= new Sprites()
    drawPile(
      g,
      layout,
      {
        counts,
        labels,
        person: { name: 'A person', height: height(PERSON_HEIGHT)[units] },
        active,
        dpr,
        font: getComputedStyle(canvas).fontFamily,
        compact: narrow,
      },
      sprites.current
    )
  }, [layout, counts, labels, units, active, narrow, fresh, ready])

  // ------------------------------------------------------------ pointer
  const stackAt = (e: PointerEvent<HTMLCanvasElement>) => {
    if (!layout) return null
    const box = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - box.left
    const y = e.clientY - box.top
    for (const row of layout.rows)
      for (const block of row.blocks) {
        const top = blockTop(block, layout, counts[block.id])
        if (Math.abs(x - block.x) <= block.half && y >= top - 20 && y <= block.ground + block.depth)
          return block
      }
    return null
  }

  const point = (e: PointerEvent<HTMLCanvasElement>) => {
    const block = stackAt(e)
    if (!block || !layout) {
      if (pointed) setPointed(null)
      setActive(null)
      return
    }
    if (pointed?.id === block.id) return
    setActive(block.id)
    setPointed({
      id: block.id,
      x: Math.min(Math.max(block.x, 104), Math.max(104, layout.width - 104)),
      y: Math.max(8, blockTop(block, layout, counts[block.id]) - 24),
    })
  }
  const unpoint = () => {
    setPointed(null)
    setActive(null)
  }

  // ------------------------------------------------------------ controls
  const scrub = (next: number) => {
    touched.current = true
    setPlaying(false)
    setAge(Math.min(years, Math.max(0, next)))
  }

  // Whole years from the keyboard, whatever fraction the playhead stopped on
  const onAgeKey = (e: KeyboardEvent<HTMLInputElement>) => {
    const step: Record<string, number> = {
      ArrowRight: 1,
      ArrowUp: 1,
      ArrowLeft: -1,
      ArrowDown: -1,
      PageUp: 10,
      PageDown: -10,
    }
    if (e.key in step) scrub(Math.round(age) + step[e.key])
    else if (e.key === 'Home') scrub(0)
    else if (e.key === 'End') scrub(years)
    else return
    e.preventDefault()
  }

  const togglePlay = () => {
    touched.current = true
    setPlaying((was) => !was)
  }

  const atEnd = age >= years
  const shownAge = Math.floor(age)
  const pointedRow = pointed && now.rows.find((row) => row.item.id === pointed.id)
  const summary = `Drawing to scale. By age ${shownAge}: ${now.rows
    .map(
      (row) =>
        `${int(row.count)} ${row.item.phrase} in a stack ${height(pileHeight(row.item, row.count, footprint))[units]} tall`
    )
    .join('; ')}. Beside them, a person ${height(PERSON_HEIGHT)[units]} tall.`

  return (
    <Figure
      num="01"
      title="The pile, to scale"
      tools={<UnitsToggle />}
      foot={
        <>
          Every stack stands on the same <Q v={height(footprint)} /> square and fills one layer at a
          time, so a taller stack is a bigger one. Cups are nested in sleeves of 50, the way they
          are sold. The person is <Q v={height(PERSON_HEIGHT)} /> tall.
        </>
      }
    >
      <div className={styles.readout}>
        <p className={styles.readoutMain}>
          <span className={styles.readoutNumber}>{int(now.total.count)}</span>
          <span className={styles.readoutLabel}>
            items by age {shownAge}
            <span>
              <Q v={mass(now.total.kg)} /> · {int(life.total.count - now.total.count)} still to come
            </span>
          </span>
        </p>
        <dl className={styles.readoutSplit}>
          {(['paper', 'plastic'] as const).map((material) => (
            <div key={material}>
              <dt>
                <i style={{ background: MATERIALS[material].color }} aria-hidden="true" />
                {MATERIALS[material].name}
              </dt>
              <dd>
                <Q v={mass(now.byMaterial[material].kg)} />
              </dd>
            </div>
          ))}
        </dl>
      </div>

      <div className={styles.stageBox}>
        <div ref={stageRef} className={styles.stage}>
          <canvas
            ref={canvasRef}
            className={styles.canvas}
            role="img"
            aria-label={summary}
            onPointerMove={(e) => e.pointerType === 'mouse' && point(e)}
            onPointerDown={(e) => e.pointerType !== 'mouse' && point(e)}
            onPointerLeave={(e) => e.pointerType === 'mouse' && unpoint()}
            onPointerCancel={unpoint}
          />
          {/* Without JavaScript there is nothing to draw with and nothing for the controls to
              do: say so, and take the controls away rather than leave them dead. */}
          <noscript>
            <style>{`.${styles.transport}, .${styles.habit}, .${styles.life}, .${styles.units} { display: none }`}</style>
            <p className={styles.noscript}>
              The drawing needs JavaScript. Every number in it is in the ledger further down.
            </p>
          </noscript>
          {pointed && pointedRow && (
            <div
              className={styles.tip}
              style={{ left: pointed.x, top: pointed.y }}
              aria-hidden="true"
            >
              <Readout
                title={pointedRow.item.name}
                color={MATERIALS[pointedRow.item.material].color}
                rows={[
                  [pointedRow.item.unit.many, int(pointedRow.count)],
                  ['weight', mass(pointedRow.kg)[units]],
                  ['tall', height(pileHeight(pointedRow.item, pointedRow.count, footprint))[units]],
                  ['of space', volume(pointedRow.space)[units]],
                ]}
              />
            </div>
          )}
        </div>
      </div>

      <div className={styles.transport}>
        <button
          type="button"
          className={cx('ed-pill', 'ed-pill--light', 'ed-pill--lg', styles.play)}
          onClick={togglePlay}
        >
          <span className={styles.playIcon} data-state={playing ? 'pause' : 'play'} aria-hidden />
          {playing ? 'Pause' : atEnd ? 'Replay' : 'Play'}
        </button>
        <div className={styles.scrub}>
          <input
            type="range"
            className={cx(styles.range, styles.rangeAge)}
            min={0}
            max={years}
            step={0.1}
            value={age}
            onChange={(e) => scrub(Number(e.target.value))}
            onKeyDown={onAgeKey}
            style={{ '--p': age / years } as CSSProperties}
            aria-label="Age"
            aria-valuetext={`Age ${shownAge}: ${int(now.total.count)} items, ${mass(now.total.kg)[units]}`}
          />
          <div className={styles.scrubEnds} aria-hidden="true">
            <span>Birth</span>
            <span>Drag to any age</span>
            <span>{years} years</span>
          </div>
        </div>
        <p className={styles.age}>
          <span>Age</span>
          <b>{shownAge}</b>
        </p>
      </div>

      <ul className={styles.items} aria-label="The four items, and how fast each is used">
        {now.rows.map((row) => {
          const { item } = row
          const habit = toHabit(item, row.perYear)
          const usual = toHabit(item, item.perYear)
          const each = `${item.unit.many} a ${item.habit.per}`
          return (
            <li
              key={item.id}
              className={cx(styles.item, active === item.id && styles.itemActive)}
              onPointerEnter={(e) => e.pointerType === 'mouse' && setActive(item.id)}
              onPointerLeave={() => setActive(null)}
              onFocus={() => setActive(item.id)}
              onBlur={() => setActive(null)}
            >
              <p className={styles.itemName}>
                <i style={{ background: MATERIALS[item.material].color }} aria-hidden="true" />
                {item.name}
              </p>
              <p className={styles.itemCount}>
                <b>{int(row.count)}</b> {row.count === 1 ? item.unit.one : item.unit.many}
              </p>
              <p className={styles.itemSub}>
                <Q v={mass(row.kg)} />
              </p>
              <div className={styles.habit}>
                <p className={styles.habitText}>
                  <b>{trim(habit)}</b> {each}
                </p>
                <div
                  className={styles.rangeBox}
                  style={{ '--usual': Math.min(1, usual / item.habit.max) } as CSSProperties}
                >
                  <input
                    type="range"
                    className={styles.range}
                    min={0}
                    max={item.habit.max}
                    step={item.habit.step}
                    value={habit}
                    onChange={(e) => setRate(item.id, fromHabit(item, Number(e.target.value)))}
                    style={{ '--p': Math.min(1, habit / item.habit.max) } as CSSProperties}
                    aria-label={`${item.name}: ${each}`}
                    aria-valuetext={`${trim(habit)} ${each}`}
                  />
                  <i
                    className={styles.usual}
                    title={`US average: ${trim(usual)} ${each}`}
                    aria-hidden="true"
                  />
                </div>
              </div>
            </li>
          )
        })}
      </ul>

      <div className={styles.life}>
        <div>
          <p className={styles.habitText}>
            Lifespan <b>{years}</b> years
          </p>
          <div
            className={styles.rangeBox}
            style={
              {
                '--usual': (LIFE_YEARS - LIFE_RANGE.min) / (LIFE_RANGE.max - LIFE_RANGE.min),
              } as CSSProperties
            }
          >
            <input
              type="range"
              className={styles.range}
              min={LIFE_RANGE.min}
              max={LIFE_RANGE.max}
              step={1}
              value={years}
              onChange={(e) => setYears(Number(e.target.value))}
              style={
                {
                  '--p': (years - LIFE_RANGE.min) / (LIFE_RANGE.max - LIFE_RANGE.min),
                } as CSSProperties
              }
              aria-label="Lifespan in years"
            />
            <i
              className={styles.usual}
              title={`US life expectancy: ${LIFE_YEARS} years`}
              aria-hidden="true"
            />
          </div>
        </div>
        <p className={styles.lifeNote}>
          The marks on the sliders are the US averages. Move one and every figure on the page
          follows.
        </p>
        <button
          type="button"
          className={cx('ed-pill', 'ed-pill--outline', 'ed-pill--lg', styles.reset)}
          onClick={reset}
          disabled={average}
        >
          Reset to US averages
        </button>
      </div>
    </Figure>
  )
}
