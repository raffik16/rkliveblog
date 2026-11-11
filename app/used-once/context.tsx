'use client'

import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { cx } from '@/lib/edition/cx'
import { type ItemId } from './data'
import { footprintFor, isAverage, tally, US_AVERAGE, type Habits, type Tally } from './model'
import { preferredUnits, UNITS_ATTR, UNITS_KEY, type Dual, type Units } from './units'
import styles from './used-once.module.css'

// What the whole page shares: the habits being counted (the US averages until a visitor
// changes them), the lifetime they add up to, and which units to show.

interface Value {
  habits: Habits
  /** The whole life at these habits */
  life: Tally
  /** Side of the square each stack of the pile stands on, in metres */
  footprint: number
  /** True while nothing has been changed from the US averages */
  average: boolean
  setRate: (id: ItemId, perYear: number) => void
  setYears: (years: number) => void
  reset: () => void
  units: Units
  setUnits: (units: Units) => void
}

const Context = createContext<Value | null>(null)

export function useUsedOnce() {
  const value = useContext(Context)
  if (!value) throw new Error('useUsedOnce must be used inside UsedOnceProvider')
  return value
}

export function UsedOnceProvider({ children }: { children: ReactNode }) {
  const [habits, setHabits] = useState<Habits>(US_AVERAGE)
  const [units, setUnitsState] = useState<Units>('metric')

  // The units are an attribute on <html>, set before the first paint by the script in
  // page.tsx. After a client-side navigation that script has not run, so the choice is made
  // here instead, still before anything is painted.
  useLayoutEffect(() => {
    const root = document.documentElement
    const set = root.getAttribute(UNITS_ATTR)
    const next = set === 'us' || set === 'metric' ? set : preferredUnits()
    root.setAttribute(UNITS_ATTR, next)
    setUnitsState(next)
    return () => root.removeAttribute(UNITS_ATTR)
  }, [])

  const setUnits = useCallback((next: Units) => {
    setUnitsState(next)
    document.documentElement.setAttribute(UNITS_ATTR, next)
    try {
      window.localStorage.setItem(UNITS_KEY, next)
    } catch {
      // Private mode, or storage turned off: the choice lasts for this visit
    }
  }, [])

  const setRate = useCallback((id: ItemId, perYear: number) => {
    setHabits((now) => ({ ...now, perYear: { ...now.perYear, [id]: perYear } }))
  }, [])
  const setYears = useCallback((years: number) => {
    setHabits((now) => ({ ...now, years }))
  }, [])
  const reset = useCallback(() => setHabits(US_AVERAGE), [])

  const value = useMemo<Value>(() => {
    const life = tally(habits)
    return {
      habits,
      life,
      footprint: footprintFor(
        Object.fromEntries(life.rows.map((row) => [row.item.id, row.count])) as Record<
          ItemId,
          number
        >
      ),
      average: isAverage(habits),
      setRate,
      setYears,
      reset,
      units,
      setUnits,
    }
  }, [habits, units, setRate, setYears, reset, setUnits])

  return <Context.Provider value={value}>{children}</Context.Provider>
}

/** A quantity in both systems. The stylesheet shows the one that matches <html>. */
export function Q({ v }: { v: Dual }) {
  return (
    <>
      <span data-unit="metric">{v.metric}</span>
      <span data-unit="us">{v.us}</span>
    </>
  )
}

export function UnitsToggle() {
  const { units, setUnits } = useUsedOnce()
  return (
    <div className={styles.units} role="group" aria-label="Units">
      <button
        type="button"
        data-units-button="metric"
        aria-pressed={units === 'metric'}
        onClick={() => setUnits('metric')}
      >
        kg · m
      </button>
      <button
        type="button"
        data-units-button="us"
        aria-pressed={units === 'us'}
        onClick={() => setUnits('us')}
      >
        lb · ft
      </button>
    </div>
  )
}

/** Whose numbers a figure is showing, with the way back to the averages */
export function Basis() {
  const { average, reset } = useUsedOnce()
  if (average) return <span className={styles.basis}>US average</span>
  return (
    <span className={cx(styles.basis, styles.basisYours)}>
      <i aria-hidden="true" />
      Your numbers
      <button type="button" onClick={reset}>
        Reset
      </button>
    </span>
  )
}

interface FigureProps {
  num: string
  title: string
  /** Extra controls on the right of the bar, after the basis */
  tools?: ReactNode
  foot?: ReactNode
  children: ReactNode
}

/** The frame every figure sits in: a bar with its number and name, the drawing, a caption */
export function Figure({ num, title, tools, foot, children }: FigureProps) {
  return (
    <figure className={styles.fig} data-reveal="">
      <div className={styles.figBar}>
        <span className={styles.figName}>
          <b>Fig. {num}</b> {title}
        </span>
        <span className={styles.figTools}>
          <Basis />
          {tools}
        </span>
      </div>
      {children}
      {foot && <figcaption className={styles.figFoot}>{foot}</figcaption>}
    </figure>
  )
}

/** The paper and plastic swatches, named */
export function MaterialKey({ children }: { children?: ReactNode }) {
  return (
    <div className={styles.key}>
      <span>
        <i className={styles.swatchPaper} aria-hidden="true" />
        Paper
      </span>
      <span>
        <i className={styles.swatchPlastic} aria-hidden="true" />
        Plastic
      </span>
      {children}
    </div>
  )
}
